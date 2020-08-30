import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICreateCharacterDTO from '@modules/characters/dtos/ICreateCharacterDTO';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

import { uuid } from 'uuidv4';

class FakeCharactersRepository implements ICharactersRepository {
  private chars: Character[] = [];

  public async create({
    name,
    email = '',
    user_id,
    experience = 0,
    file,
  }: ICreateCharacterDTO): Promise<Character> {
    const char = new Character();

    Object.assign(char, {
      id: uuid(),
      name,
      email,
      user_id,
      experience,
      file,
    });

    this.chars.push(char);

    return char;
  }

  public async update(char: Character): Promise<Character> {
    this.chars = this.chars.map(oldChar =>
      oldChar.id !== char.id ? oldChar : char,
    );

    return char;
  }

  public async findById(character_id: string): Promise<Character | undefined> {
    const findChar = this.chars.find(char => char.id === character_id);

    return findChar;
  }

  public async findByUserId(user_id: string): Promise<Character[]> {
    const charList = this.chars.filter(char => char.user_id === user_id);

    return charList;
  }

  public async listAll(): Promise<Character[]> {
    return this.chars;
  }
}

export default FakeCharactersRepository;
