import { getRepository, Repository } from 'typeorm';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICreateCharacterDTO from '@modules/characters/dtos/ICreateCharacterDTO';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';

class CharactersRepository implements ICharactersRepository {
  private ormRepository: Repository<Character>;

  constructor() {
    this.ormRepository = getRepository(Character);
  }

  public async create({
    name,
    email = '',
    user_id,
    experience = 0,
    file,
  }: ICreateCharacterDTO): Promise<Character> {
    const char = this.ormRepository.create({
      name,
      email,
      user_id,
      experience,
      file,
    });

    await this.ormRepository.save(char);

    return char;
  }

  public async update(char: Character): Promise<Character> {
    await this.ormRepository.save(char);

    return char;
  }

  public async findById(char_id: string): Promise<Character | undefined> {
    const charFound = await this.ormRepository.findOne({
      where: { id: char_id },
    });

    // if not found, return undefined
    return charFound;
  }

  public async findByUserId(user_id: string): Promise<Character[]> {
    const charList = await this.ormRepository.find({
      where: { user_id },
    });

    // if not found, return undefined
    return charList;
  }

  public async listAll(): Promise<Character[]> {
    const charList = await this.ormRepository.find();

    return charList;
  }

  public async delete(char_id: string): Promise<void> {
    const char = await this.ormRepository.findOne({ where: { id: char_id } });
    if (char) {
      await this.ormRepository.remove(char);
    }
  }
}

export default CharactersRepository;
