import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICreateCharacterDTO from '@modules/characters/dtos/ICreateCharacterDTO';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

import { uuid } from 'uuidv4';

class FakeCharactersRepository implements ICharactersRepository {
  private chars: Character[] = [];

  public async create({
    name,
    user_id,
    experience = 0,
    clan,
    situation = 'active',
    file,
  }: ICreateCharacterDTO): Promise<Character> {
    const char = new Character();

    Object.assign(char, {
      id: uuid(),
      name,
      user_id,
      experience,
      clan,
      situation,
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

  public async findByUserId(
    user_id: string,
    situation: string,
  ): Promise<Character[]> {
    const charList = this.chars.filter(
      char =>
        char.user_id === user_id &&
        (situation === 'all' ? true : char.situation === situation),
    );

    return charList;
  }

  public async listAll(): Promise<Character[]> {
    return this.chars;
  }

  public async delete(char_id: string): Promise<void> {
    const listWithRemovedChars = this.chars.filter(char => char.id !== char_id);
    this.chars = listWithRemovedChars;
  }
}

export default FakeCharactersRepository;
