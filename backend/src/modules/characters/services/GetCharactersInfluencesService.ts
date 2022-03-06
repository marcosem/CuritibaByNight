import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';
import {
  IInfluenceCapacityDTO,
  IInfluenceCharDTO,
  ICharInfluenceDTO,
  ICharactersInfluencesDTO,
} from '@modules/characters/dtos/ICharactersInfluencesDTO';
import getInfluenceAbility from '../utils/getInfluenceAbility';

@injectable()
class GetCharactersInfluencesService {
  constructor(
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute(user_id: string): Promise<ICharactersInfluencesDTO> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can get characters influences list',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can get characters influences list',
        401,
      );
    }

    const routeResult = await this.saveRouteResult.get('CharactersInfluences');

    if (routeResult !== '') {
      const myResult: ICharactersInfluencesDTO = JSON.parse(
        routeResult,
      ) as ICharactersInfluencesDTO;

      return myResult;
    }

    // Get characters List
    const charList = await this.charactersRepository.listAll('all');
    let infCapList: IInfluenceCapacityDTO[] = [];
    const charInfList: ICharInfluenceDTO[] = [];

    const processedCharList: string[] = [];
    const processed2CharList: string[] = [];

    await new Promise<void>((resolve, _) => {
      charList.forEach(async (char, index, myArray) => {
        let skipChar = false;

        if (
          char.situation === 'transfered' ||
          char.situation === 'dead' ||
          char.situation === 'destroyed'
        ) {
          skipChar = true;
        }

        // Inactive Retainer should not count
        if (
          char.npc &&
          char.creature_type === 'Mortal' &&
          char.situation !== 'active' &&
          (char.clan.indexOf('Ghoul') >= 0 ||
            char.clan.indexOf('Retainer') >= 0)
        ) {
          skipChar = true;
        }

        if (!skipChar) {
          // Initialize Character
          const newCharInfluence: ICharInfluenceDTO = {
            character: {
              id: char.id,
              name: char.name,
              creature_type: char.creature_type,
              clan: char.clan,
              sect: char.sect,
              npc: char.npc,
              situation: char.situation,
              retainers_level_perm: 0,
              retainers_level_temp: 0,
            },
          } as ICharInfluenceDTO;

          processedCharList.push(char.name);

          const charTraits = await this.charactersTraitsRepository.findByCharId(
            char.id,
            'all',
          );

          processed2CharList.push(char.name);

          // Get Morality
          let moralityTrait: string;
          let moralityLevel: number;
          switch (char.creature_type) {
            case 'Werewolf':
            case 'Mage':
              moralityTrait = char.creature_type;
              moralityLevel = 5;
              break;
            case 'Wraith':
              moralityTrait = char.creature_type;
              moralityLevel = 2;
              break;
            default: {
              const charMorality = charTraits.find(
                virt => virt.trait.indexOf('Morality: ') === 0,
              );

              if (charMorality) {
                moralityTrait = charMorality.trait.replace('Morality: ', '');

                if (moralityTrait === 'Humanity') {
                  moralityLevel = Number(charMorality.level);
                } else {
                  moralityLevel =
                    Number(charMorality.level) > 3
                      ? Number(charMorality.level) - 2
                      : 1;
                }
              } else {
                moralityTrait = 'Humanity';
                moralityLevel = 0;
              }
            }
          }

          newCharInfluence.character.morality = moralityTrait;
          newCharInfluence.character.morality_level = moralityLevel;

          // Get Retainers
          const retainerTrait = charTraits.find(
            ret => ret.trait === 'Retainers' && ret.type === 'backgrounds',
          );

          if (retainerTrait) {
            let levelTemp: number;

            if (!retainerTrait.level_temp) {
              levelTemp = Number(retainerTrait.level);
            } else {
              const levelTempRetainerArray = retainerTrait.level_temp
                .split('|')
                .filter(elem => elem === 'full');

              levelTemp = levelTempRetainerArray.length;
            }

            newCharInfluence.character.retainers_level_perm = Number(
              retainerTrait.level,
            );
            newCharInfluence.character.retainers_level_temp = levelTemp;
          }

          // Get Attributes
          const attributesTraits = charTraits.filter(
            att => att.type === 'attributes',
          );

          let attributes = 0;
          for (let i = 0; i < attributesTraits.length; i += 1) {
            const att = attributesTraits[i];
            attributes += Number(att.level);
          }

          newCharInfluence.character.attributes = attributes;

          // Influence Capacity is Attributes + Retainers Permanent
          newCharInfluence.character.influence_capacity =
            attributes + newCharInfluence.character.retainers_level_perm;

          // Actions is Morality Level + Retainers Temporaty
          newCharInfluence.character.actions =
            moralityLevel + newCharInfluence.character.retainers_level_temp;

          // Get Character influences
          const influenceTraits = charTraits.filter(
            inf => inf.type === 'influences',
          );

          if (influenceTraits.length > 0) {
            const infCharList: IInfluenceCharDTO[] = [];

            for (let i = 0; i < influenceTraits.length; i += 1) {
              const inf = influenceTraits[i];

              let ability = getInfluenceAbility(inf.trait);
              let abilityLevel = 0;
              const abilitiesTraits = charTraits.filter(
                abi =>
                  abi.trait.indexOf(ability) === 0 && abi.type === 'abilities',
              );

              if (abilitiesTraits.length > 0) {
                abilitiesTraits.sort((traitA, traitB) => {
                  if (traitA.level > traitB.level) return -1;
                  if (traitA.level < traitB.level) return 1;
                  return 0;
                });

                ability = abilitiesTraits[0].trait;
                abilityLevel = Number(abilitiesTraits[0].level);
              }

              let infLevelTemp: number;
              if (!inf.level_temp) {
                infLevelTemp = Number(inf.level);
              } else {
                const levelTempArray = inf.level_temp
                  .split('|')
                  .filter(elem => elem === 'full');

                infLevelTemp = levelTempArray.length;
              }

              const levelTemp = infLevelTemp;

              const newInfChar: IInfluenceCharDTO = {
                name: inf.trait,
                level_perm: Number(inf.level),
                level_temp: levelTemp,
                ability,
                ability_level: abilityLevel,
                defense_passive:
                  char.situation === 'active'
                    ? levelTemp + abilityLevel + moralityLevel
                    : levelTemp,
                defense_active:
                  char.situation === 'active'
                    ? levelTemp * 2 + abilityLevel + moralityLevel
                    : levelTemp,
              };

              let infCap = infCapList.find(
                infC => infC.name === newInfChar.name,
              );

              if (infCap === undefined) {
                infCap = {
                  name: newInfChar.name,
                  total: Number(newInfChar.level_perm),
                  leader_level: Number(newInfChar.level_perm),
                  leaders: [
                    {
                      id: char.id,
                      name: char.name,
                    },
                  ],
                };

                infCapList.push(infCap);
              } else {
                infCap.total += Number(newInfChar.level_perm);
                if (newInfChar.level_perm > infCap.leader_level) {
                  infCap.leader_level = newInfChar.level_perm;
                  infCap.leaders = [{ id: char.id, name: char.name }];
                } else if (newInfChar.level_perm === infCap.leader_level) {
                  infCap.leaders.push({ id: char.id, name: char.name });
                }

                const newInfCap: IInfluenceCapacityDTO = infCap;
                infCapList = infCapList.map(infC =>
                  infC.name === newInfCap.name ? newInfCap : infC,
                );
              }

              infCharList.push(newInfChar);
            }

            newCharInfluence.influences = infCharList;
          }

          charInfList.push(newCharInfluence);
        }

        if (index === myArray.length - 1) {
          // Add a small delay just to ensure everything is processed
          setTimeout(() => {
            resolve();
          }, 5000);
        }
      });
    });

    infCapList.sort((infCapA, infCapB) => {
      if (infCapA.name < infCapB.name) return -1;
      // There is no duplicated influence, so, no need to return 0
      return 1;
    });

    charInfList.sort((charA, charB) => {
      const nameA = charA.character.name
        .toUpperCase()
        .replace(/[ÁÀÃÂ]/gi, 'A')
        .replace(/[ÉÊ]/gi, 'E')
        .replace(/[Í]/gi, 'I')
        .replace(/[ÓÔÕ]/gi, 'O')
        .replace(/[Ú]/gi, 'U');
      const nameB = charB.character.name
        .toUpperCase()
        .replace(/[ÁÀÃÂ]/gi, 'A')
        .replace(/[ÉÊ]/gi, 'E')
        .replace(/[Í]/gi, 'I')
        .replace(/[ÓÔÕ]/gi, 'O')
        .replace(/[Ú]/gi, 'U');

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    const result: ICharactersInfluencesDTO = {
      domain_capacity: 39,
      influence_capacity: infCapList,
      list: charInfList,
      processed: processedCharList,
      processed2: processed2CharList,
    };

    this.saveRouteResult.set('CharactersInfluences', JSON.stringify(result));

    return result;
  }
}

export default GetCharactersInfluencesService;
