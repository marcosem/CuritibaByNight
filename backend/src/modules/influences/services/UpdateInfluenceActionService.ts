import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import InfluenceAction from '@modules/influences/infra/typeorm/entities/InfluenceAction';
import IInfluenceActionsRepository from '@modules/influences/repositories/IInfluenceActionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import getInfluenceAbility from '@modules/influences/utils/getInfluenceAbility';
import { isAfter } from 'date-fns';

interface IRequestDTO {
  user_id: string;
  action_id: string;
  title: string;
  action_period: string;
  backgrounds?: string;
  influence: string;
  influence_level: number;
  influence_effective_level: number;
  ability?: string;
  ability_level?: number;
  endeavor?: string;
  character_id: string;
  action_owner_id?: string;
  action?: string;
}

@injectable()
class UpdateInfluenceActionService {
  constructor(
    @inject('InfluenceActionsRepository')
    private influenceActionsRepository: IInfluenceActionsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    action_id,
    title,
    action_period,
    backgrounds,
    influence,
    influence_level,
    influence_effective_level,
    ability,
    ability_level,
    endeavor,
    character_id,
    action_owner_id,
    action,
  }: IRequestDTO): Promise<InfluenceAction> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can update an influence action',
        401,
      );
    }

    const infAction = await this.influenceActionsRepository.findById(action_id);
    if (!infAction) {
      throw new AppError('Influence action not found', 400);
    }

    if (
      infAction.result !== 'not evaluated' &&
      infAction.result !== 'partial'
    ) {
      throw new AppError(
        'Only not evaluated or partially evaluated influence action can be updated',
        400,
      );
    }

    const char = await this.charactersRepository.findById(character_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (user_id !== char.user_id) {
      throw new AppError(
        'Only characters owners can create an influence action for their character',
        401,
      );
    }

    // Find action owner
    let actionOwnerId: string;
    if (
      action_owner_id &&
      action_owner_id !== character_id &&
      endeavor !== 'defend'
    ) {
      const actionChar = await this.charactersRepository.findById(
        action_owner_id,
      );

      if (!actionChar) {
        throw new AppError('Action owner character not found', 400);
      }

      if (character_id !== actionChar.regnant) {
        throw new AppError(
          'Only the character or its retainers can be the owner of an influence action',
          401,
        );
      }

      actionOwnerId = actionChar.id;
    } else {
      actionOwnerId = character_id;
    }

    const charTraits = await this.charactersTraitsRepository.findByCharId(
      char.id,
      'all',
    );

    // Get Ability level
    let abilityLevel: number;
    let abilityUsed: string;
    if (ability && endeavor !== 'defend') {
      abilityUsed = ability;
      abilityLevel = ability_level || 0;
    } else {
      const infAbility = getInfluenceAbility(influence);

      const abilitiesTraits = charTraits.filter(
        abi => abi.trait.indexOf(infAbility) === 0 && abi.type === 'abilities',
      );

      if (abilitiesTraits.length > 0) {
        abilitiesTraits.sort((traitA, traitB) => {
          if (traitA.level > traitB.level) return -1;
          return 1;
        });

        abilityUsed = abilitiesTraits[0].trait;
        abilityLevel = Number(abilitiesTraits[0].level);
      } else {
        abilityUsed = infAbility;
        abilityLevel = 0;
      }
    }

    // Get Morality Level
    const charMorality = charTraits.find(
      trait => trait.trait.indexOf('Morality: ') >= 0,
    );

    let moralityLevel: number;
    if (charMorality) {
      const moralityTrait = charMorality.trait.replace('Morality: ', '');

      let refMoralityLevel: number;
      // New rule applied after November 2022. All characters added after, should follow this new rule.
      if (
        isAfter(
          new Date(charMorality.updated_at),
          new Date('2022-11-01T00:00:00.000Z'),
        )
      ) {
        const fullMoralityLevel = Number(charMorality.level);
        refMoralityLevel =
          fullMoralityLevel === 1
            ? fullMoralityLevel
            : Math.floor(fullMoralityLevel / 2);
      } else {
        refMoralityLevel = Number(charMorality.level);
      }

      if (moralityTrait === 'Humanity') {
        moralityLevel = refMoralityLevel;
      } else {
        moralityLevel = refMoralityLevel > 3 ? refMoralityLevel - 2 : 1;
      }
    } else {
      moralityLevel = 0;
    }

    // Determine the force
    const actionForce =
      abilityLevel +
      moralityLevel +
      influence_effective_level * (endeavor === 'defend' ? 2 : 1);

    infAction.title = title;

    if (endeavor !== 'defend') {
      if (backgrounds !== undefined) infAction.backgrounds = backgrounds;
      infAction.action = action;
    } else {
      infAction.backgrounds = '';
      infAction.action = '';
    }

    infAction.action_period = action_period;
    infAction.influence = influence;
    infAction.influence_level = influence_level;
    infAction.influence_effective_level = influence_effective_level;
    infAction.ability = abilityUsed;
    infAction.ability_level = abilityLevel;
    if (endeavor) infAction.endeavor = endeavor;
    infAction.character_id = character_id;
    if (actionOwnerId !== infAction.action_owner_id) {
      infAction.ownerId = undefined;
    }
    infAction.action_owner_id = actionOwnerId;
    infAction.action_force = actionForce;
    infAction.status = 'sent';
    infAction.result = 'not evaluated';

    const influenceAction = await this.influenceActionsRepository.update(
      infAction,
    );

    return influenceAction;
  }
}

export default UpdateInfluenceActionService;
