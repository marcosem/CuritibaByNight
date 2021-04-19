import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import ICreateCharacterTraitDTO from '@modules/characters/dtos/ICreateCharacterTraitDTO';

export default interface ICharactersTraitsRepository {
  create(data: ICreateCharacterTraitDTO): Promise<CharacterTrait>;
  update(data: CharacterTrait): Promise<CharacterTrait>;
  findById(char_trait_id: string): Promise<CharacterTrait | undefined>;
  findByCharId(char_id: string, type: string): Promise<CharacterTrait[]>;
  findTraitByCharId(
    char_id: string,
    trait: string,
    type: string,
  ): Promise<CharacterTrait | undefined>;
  listAllByTrait(trait: string, type: string): Promise<CharacterTrait[]>;
  listAll(): Promise<CharacterTrait[]>;
  delete(char_trait_id: string): Promise<void>;
  deleteAllByChar(char_id: string): Promise<void>;
}
