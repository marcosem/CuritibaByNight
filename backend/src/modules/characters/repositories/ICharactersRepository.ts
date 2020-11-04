import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICreateCharacterDTO from '@modules/characters/dtos/ICreateCharacterDTO';

export default interface ICharacterRepository {
  create(data: ICreateCharacterDTO): Promise<Character>;
  update(data: Character): Promise<Character>;
  findById(character_id: string): Promise<Character | undefined>;
  findByUserId(user_id: string, situation: string): Promise<Character[]>;
  listAll(): Promise<Character[]>;
  delete(character_id: string): Promise<void>;
}
