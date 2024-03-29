import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICreateCharacterTraitDTO from '@modules/characters/dtos/ICreateCharacterTraitDTO';
import ICharactersTraitsRepository from '@modules/characters/repositories/ICharactersTraitsRepository';
import { v4 } from 'uuid';

class FakeCharactersTraitsRepository implements ICharactersTraitsRepository {
  private charsTraits: CharacterTrait[] = [];

  public async createList(
    dataList: ICreateCharacterTraitDTO[],
  ): Promise<CharacterTrait[]> {
    const charTraitList = dataList.map(data => {
      // const charTrait = new CharacterTrait();
      const charTrait = { id: v4(), ...data } as CharacterTrait;

      /*
      Object.assign(charTrait, {
        id: v4(),
        trait: data.trait,
        character_id: data.character_id,
        level: data.level,
        level_temp: data.level_temp,
        type: data.type,
        // characterId: data.characterId,
        updated_at: data.updated_at,
      });
      */

      return charTrait;
    });

    this.charsTraits = this.charsTraits.concat(charTraitList);

    return charTraitList;
  }

  public async update(charTrait: CharacterTrait): Promise<CharacterTrait> {
    this.charsTraits = this.charsTraits.map(oldCharTrait =>
      oldCharTrait.id !== charTrait.id ? oldCharTrait : charTrait,
    );

    return charTrait;
  }

  public async findById(
    char_trait_id: string,
  ): Promise<CharacterTrait | undefined> {
    const findCharTrait = this.charsTraits.find(
      charTrait => charTrait.id === char_trait_id,
    );

    return findCharTrait;
  }

  public async findByCharId(
    char_id: string,
    type: string,
  ): Promise<CharacterTrait[]> {
    const charTraitList = this.charsTraits.filter(
      charTrait =>
        charTrait.character_id === char_id &&
        (type === 'all' ? true : charTrait.type === type),
    );

    return charTraitList;
  }

  public async findTraitByCharId(
    char_id: string,
    trait: string,
    type: string,
  ): Promise<CharacterTrait | undefined> {
    const myCharTrait = this.charsTraits.find(
      charTrait =>
        charTrait.character_id === char_id &&
        charTrait.trait === trait &&
        charTrait.type === type,
    );

    return myCharTrait;
  }

  public async traitLevelExist(trait: string, level: number): Promise<boolean> {
    const myCharTrait = this.charsTraits.find(
      charTrait => charTrait.trait === trait && charTrait.level >= level,
    );

    return !!myCharTrait;
  }

  public async resetTraitsLevel(
    char_id: string,
    keepMasquerade: boolean,
  ): Promise<void> {
    const newCharsTraits = this.charsTraits.map((trait: CharacterTrait) => {
      const newTrait = trait;

      if (
        newTrait.character_id === char_id &&
        newTrait.trait !== 'Personal Masquerade'
      ) {
        newTrait.level_temp = undefined;
      } else if (newTrait.trait === 'Personal Masquerade' && !keepMasquerade) {
        newTrait.level = 10;
        newTrait.level_temp =
          'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty';
      }

      return newTrait;
    });

    this.charsTraits = newCharsTraits;
  }

  public async listByTypes(
    types: string[],
    char_id = 'all',
  ): Promise<CharacterTrait[]> {
    const myCharsTraits: CharacterTrait[] = this.charsTraits.filter(
      charTrait =>
        types.includes(charTrait.type) &&
        (char_id !== 'all' ? charTrait.character_id === char_id : true),
    );

    return myCharsTraits;
  }

  public async deleteAllByChar(char_id: string): Promise<void> {
    const listWithRemovedChars = this.charsTraits.filter(
      charTrait => charTrait.character_id !== char_id,
    );
    this.charsTraits = listWithRemovedChars;
  }
}

export default FakeCharactersTraitsRepository;
