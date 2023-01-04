import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class GetPowersFullListService {
  constructor(
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<Power[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can get full powers list',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can get full powers list',
        401,
      );
    }

    const traitsList = await this.charactersTraitsRepository.listByTypes([
      'powers',
      'rituals',
    ]);

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

    let filteredTraitsList: Power[] = [];

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
            fTrait => fTrait.long_name === myTrait.long_name,
          ) === undefined
        ) {
          const multiLevelCreatures = ['Vampire', 'Mage', 'Wraith'];

          if (
            myTrait.type === 'rituals' ||
            (!multiLevelCreatures.includes(myTrait.creature_type) &&
              myTrait.clan.indexOf('Ghoul') === -1) ||
            myTrait.level === 0
          ) {
            const newTrait = {
              long_name: myTrait.long_name,
              short_name: myTrait.short_name,
              level: myTrait.level,
              type: myTrait.type,
            } as Power;

            filteredTraitsList.push(newTrait);
          } else {
            const newTraitsList: Power[] = [];

            for (let j = 0; j < myTrait.level; j += 1) {
              const newTrait: Power = {
                long_name: myTrait.long_name,
                short_name: myTrait.short_name,
                level: j + 1,
                type: myTrait.type,
              } as Power;

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

    const powersList = filteredTraitsList.map(myTrait => {
      const newTrait =
        existantPowersList.find(
          eTrait =>
            eTrait.long_name === myTrait.long_name &&
            eTrait.level === myTrait.level,
        ) || myTrait;

      return newTrait;
    });

    return powersList;
  }
}

export default GetPowersFullListService;
