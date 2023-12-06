import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
// import Power from '@modules/characters/infra/typeorm/entities/Power';
import PowerExtended from '@modules/characters/infra/typeorm/entities/PowerExtended';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  char_id?: string;
}

@injectable()
class GetPowersListService {
  constructor(
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({
    user_id,
    char_id = 'all',
  }: IRequestDTO): Promise<PowerExtended[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can get powers list', 401);
    }
    if (char_id === 'all') {
      if (!user.storyteller) {
        throw new AppError(
          'Only authenticated Storytellers can get full powers list',
          401,
        );
      }

      const routeResult = await this.saveRouteResult.get('PowersList');

      if (routeResult !== '') {
        const myResult: PowerExtended[] = JSON.parse(
          routeResult,
        ) as PowerExtended[];

        return myResult;
      }
    } else {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (
        !user.storyteller &&
        user_id !== char.user_id &&
        user_id !== char.regnant_char?.user_id
      ) {
        throw new AppError(
          'Only authenticated Storytellers can get other players powers list',
          401,
        );
      }
    }

    const traitsList = await this.charactersTraitsRepository.listByTypes(
      ['powers', 'rituals'],
      char_id,
    );

    // Filter uniques (ES5)
    const parsedTraitsList = traitsList.map(myTrait => {
      const newTrait = {
        long_name: myTrait.trait,
        short_name: myTrait.trait,
        level: Number(myTrait.level),
        type: myTrait.type,
        creature_type: myTrait.characterId?.creature_type || '',
        clan: myTrait.characterId?.clan || '',
      };

      return newTrait;
    });

    let filteredTraitsList: PowerExtended[] = [];

    // Removing duplicated and adding all discipline levels
    for (let i = 0; i < parsedTraitsList.length; i += 1) {
      const myTrait = parsedTraitsList[i];
      const nextTrait =
        i < parsedTraitsList.length - 1 ? parsedTraitsList[i + 1] : undefined;

      if (
        nextTrait === undefined ||
        myTrait.long_name !== nextTrait.long_name
      ) {
        if (
          filteredTraitsList.find(
            fTrait =>
              fTrait.long_name === myTrait.long_name &&
              Number(fTrait.level) === Number(myTrait.level),
          ) === undefined
        ) {
          const multiLevelCreatures = ['Vampire', 'Mage', 'Wraith'];

          if (
            myTrait.type === 'rituals' ||
            (!multiLevelCreatures.includes(myTrait.creature_type) &&
              myTrait.clan.indexOf('Ghoul') === -1) ||
            myTrait.level === 0 ||
            myTrait.level > 5
          ) {
            const newTrait = {
              long_name: myTrait.long_name,
              short_name: myTrait.short_name,
              level: myTrait.level,
              type: myTrait.type,
            } as PowerExtended;

            filteredTraitsList.push(newTrait);
          } else {
            const newTraitsList: PowerExtended[] = [];

            for (let j = 0; j <= myTrait.level; j += 1) {
              const newTrait: PowerExtended = {
                long_name: myTrait.long_name,
                short_name: myTrait.short_name,
                level: j,
                type: myTrait.type,
              } as PowerExtended;

              newTraitsList.push(newTrait);
            }

            filteredTraitsList = filteredTraitsList.concat(newTraitsList);
          }
        }
      }
    }

    const existantPowersList = await this.powersRepository.listByNames(
      filteredTraitsList,
    );

    const powersList: PowerExtended[] = [];

    for (let k = 0; k < filteredTraitsList.length; k += 1) {
      const myTrait = filteredTraitsList[k];

      const newTrait: PowerExtended =
        existantPowersList.find(
          eTrait =>
            eTrait.long_name === myTrait.long_name &&
            Number(eTrait.level) === Number(myTrait.level),
        ) || myTrait;

      if (char_id === 'all') {
        const newTraitsList = traitsList.filter(
          fTrait =>
            fTrait.trait === newTrait.long_name &&
            Number(fTrait.level) >= Number(newTrait.level),
        );

        const chars: string[] = [];
        for (let j = 0; j < newTraitsList.length; j += 1) {
          const charId = newTraitsList[j].character_id;

          if (charId) {
            // eslint-disable-next-line no-await-in-loop
            const charTrait = await this.charactersRepository.findById(charId);
            if (
              charTrait?.name &&
              ['transfered', 'dead', 'destroyed'].includes(
                charTrait.situation,
              ) === false &&
              chars.indexOf(charTrait.name) === -1
            ) {
              chars.push(charTrait.name);
            }
          }
        }

        newTrait.chars = chars.sort();
      } else {
        newTrait.chars = [];
      }

      powersList.push(newTrait);
    }

    if (char_id === 'all') {
      this.saveRouteResult.set('PowersList', JSON.stringify(powersList));
    }

    return powersList;
  }
}

export default GetPowersListService;
