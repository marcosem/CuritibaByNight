import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICreateCharacterTraitDTO from '@modules/characters/dtos/ICreateCharacterTraitDTO';

export default interface ICharactersTraitsRepository {
  // create(data: ICreateCharacterTraitDTO): Promise<CharacterTrait>;
  createList(data_list: ICreateCharacterTraitDTO[]): Promise<CharacterTrait[]>;
  update(data: CharacterTrait): Promise<CharacterTrait>;
  findById(char_trait_id: string): Promise<CharacterTrait | undefined>;
  findByCharId(char_id: string, type: string): Promise<CharacterTrait[]>;
  findTraitByCharId(
    char_id: string,
    trait: string,
    type: string,
  ): Promise<CharacterTrait | undefined>;
  traitLevelExist(trait: string, level: number): Promise<boolean>;
  resetTraitsLevel(char_id: string, keepMasquerade: boolean): Promise<void>;
  listByTypes(types: string[], char_id?: string): Promise<CharacterTrait[]>;
  deleteAllByChar(char_id: string): Promise<void>;
}
