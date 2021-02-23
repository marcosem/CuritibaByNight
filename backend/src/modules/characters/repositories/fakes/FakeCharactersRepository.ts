import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICreateCharacterDTO from '@modules/characters/dtos/ICreateCharacterDTO';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

import { v4 } from 'uuid';

class FakeCharactersRepository implements ICharactersRepository {
  private chars: Character[] = [];

  public async create({
    name,
    user_id,
    experience = 0,
    experience_total = 0,
    clan,
    creature_type,
    sect = '',
    title = '',
    coterie = '',
    situation = 'active',
    npc = false,
    regnant = undefined,
    retainer_level = 0,
    file,
  }: ICreateCharacterDTO): Promise<Character> {
    const char = new Character();

    Object.assign(char, {
      id: v4(),
      name,
      user_id: user_id === undefined ? null : user_id,
      experience,
      experience_total,
      clan,
      creature_type,
      sect,
      title,
      coterie,
      situation,
      npc,
      regnant: regnant === undefined ? null : regnant,
      retainer_level,
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

  public async listAll(filter = 'all'): Promise<Character[]> {
    let charList: Character[];

    switch (filter) {
      case 'npc':
        charList = this.chars.filter(char => char.npc === true);
        break;
      case 'pc':
        charList = this.chars.filter(char => char.npc === false);
        break;
      default:
        charList = this.chars;
    }

    return charList;
  }

  public async listRetainers(
    character_id: string,
    situation = 'active',
  ): Promise<Character[]> {
    const charList: Character[] = this.chars.filter(
      char => char.regnant === character_id && char.situation === situation,
    );

    return charList;
  }

  public async delete(char_id: string): Promise<void> {
    const listWithRemovedChars = this.chars.filter(char => char.id !== char_id);
    this.chars = listWithRemovedChars;
  }
}

export default FakeCharactersRepository;
