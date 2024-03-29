import { getRepository, Repository, Not, MoreThanOrEqual } from 'typeorm';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICreateCharacterTraitDTO from '@modules/characters/dtos/ICreateCharacterTraitDTO';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';

class CharactersTraitsRepository implements ICharactersTraitsRepository {
  private ormRepository: Repository<CharacterTrait>;

  constructor() {
    this.ormRepository = getRepository(CharacterTrait);
  }

  public async createList(
    dataList: ICreateCharacterTraitDTO[],
  ): Promise<CharacterTrait[]> {
    const charTraits = this.ormRepository.create(dataList);
    await this.ormRepository.save(charTraits);

    return charTraits;
  }

  public async update(charTrait: CharacterTrait): Promise<CharacterTrait> {
    await this.ormRepository.save(charTrait);

    // Return what is saved with user relationship attached.
    let savedChar = await this.findById(charTrait.id);
    if (!savedChar) {
      savedChar = charTrait;
    }

    return savedChar;
  }

  public async findById(
    char_trait_id: string,
  ): Promise<CharacterTrait | undefined> {
    const charTraitFound = await this.ormRepository.findOne({
      where: { id: char_trait_id },
      relations: ['characterId'],
    });

    // if not found, return undefined
    return charTraitFound;
  }

  public async findByCharId(
    char_id: string,
    type: string,
  ): Promise<CharacterTrait[]> {
    const where =
      type === 'all'
        ? { character_id: char_id }
        : { character_id: char_id, type };

    const charTraitList = await this.ormRepository.find({
      where,
      // order: { trait: 'ASC' },
    });

    // if not found, return undefined
    return charTraitList;
  }

  public async findTraitByCharId(
    char_id: string,
    trait: string,
    type: string,
  ): Promise<CharacterTrait | undefined> {
    const where = {
      character_id: char_id,
      trait,
      type,
    };

    const myCharTrait = await this.ormRepository.findOne({
      where,
      relations: ['characterId'],
    });

    // if not found, return undefined
    return myCharTrait;
  }

  public async traitLevelExist(trait: string, level: number): Promise<boolean> {
    const where = {
      trait,
      level: MoreThanOrEqual(level),
    };

    const myCharTrait = await this.ormRepository.findOne({
      where,
    });

    return !!myCharTrait;
  }

  public async resetTraitsLevel(
    char_id: string,
    keepMasquerade: boolean,
  ): Promise<void> {
    const trait = keepMasquerade ? Not('Personal Masquerade') : undefined;
    const where = {
      character_id: char_id,
      trait,
    };

    const charTraitsList = await this.ormRepository.find({ where });

    const newTraitsList = charTraitsList.map(myTrait => {
      const newTrait = myTrait;

      if (newTrait.trait === 'Personal Masquerade' && !keepMasquerade) {
        newTrait.level_temp =
          'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty';
      } else {
        newTrait.level_temp = '';
      }

      return newTrait;
    });

    await this.ormRepository.save(newTraitsList);
  }

  public async listByTypes(
    types: string[],
    char_id = 'all',
  ): Promise<CharacterTrait[]> {
    const where = types.map(type => {
      let newWhere;

      if (char_id === 'all') {
        newWhere = {
          type,
        };
      } else {
        newWhere = {
          type,
          character_id: char_id,
        };
      }

      return newWhere;
    });

    const charTraitList = await this.ormRepository.find({
      where,
      relations: ['characterId'],
      order: { trait: 'ASC', level: 'ASC' },
    });

    return charTraitList;
  }

  /*
  public async listAll(): Promise<CharacterTrait[]> {
    const charTraitList = await this.ormRepository.find({
      order: { trait: 'ASC' },
    });

    return charTraitList;
  }
  */

  /*
  public async delete(char_trait_id: string): Promise<void> {
    const charTrait = await this.ormRepository.findOne({
      where: { id: char_trait_id },
    });
    if (charTrait) {
      await this.ormRepository.remove(charTrait);
    }
  }
  */

  public async deleteAllByChar(char_id: string): Promise<void> {
    const charTrait = await this.ormRepository.find({
      where: { character_id: char_id },
    });

    if (charTrait) {
      await this.ormRepository.remove(charTrait);
    }
  }
}

export default CharactersTraitsRepository;
