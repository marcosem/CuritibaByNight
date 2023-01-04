import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Power from '@modules/characters/infra/typeorm/entities/Power';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import IPowersRepository from '@modules/characters/repositories/IPowersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class GetPowersFullListService {
  constructor(
    @inject('CharactersTraitsRepository')
    private charactersTraitsRepository: ICharactersTraitsRepository,
    @inject('PowersRepository')
    private powersRepository: IPowersRepository,
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
        creature: myTrait.characterId?.creature_type,
      };

      return newTrait;
    });

    const filteredTraitsList: Power[] = [];

    // Removing duplicated and adding all discipline levels
    for (let i = 0; i < parsedTraitsList.length; i += 1) {
      const myTrait = parsedTraitsList[i];
      const nextTrait =
        i < parsedTraitsList.length ? parsedTraitsList[i + 1] : undefined;

      if (
        nextTrait === undefined ||
        myTrait.long_name !== nextTrait.long_name
      ) {
        if (
          filteredTraitsList.find(
            fTrait => fTrait.long_name === myTrait.long_name,
          ) === undefined
        ) {
          if (
            myTrait.type === 'rituals' ||
            myTrait.creature !== 'Vampire' ||
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

            filteredTraitsList.concat(newTraitsList);
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
