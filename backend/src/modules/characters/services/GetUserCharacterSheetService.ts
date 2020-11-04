import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import Character from '@modules/characters/infra/typeorm/entities/Character';

interface IRequestDTO {
  user_id: string;
  player_id: string;
  situation: string;
}

@injectable()
class GetUserCharacterSheet {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    player_id,
    situation,
  }: IRequestDTO): Promise<Character[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his characters sheets',
        401,
      );
    } else if (!user.storyteller && user_id !== player_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players character sheets',
        401,
      );
    }

    const player = await this.usersRepository.findById(player_id);

    if (!player) {
      throw new AppError('Player not found', 400);
    }

    const charList = await this.charactersRepository.findByUserId(
      player_id,
      situation,
    );

    if (charList.length === 0) {
      throw new AppError('User does not have any character sheet saved', 400);
    }

    return charList;
  }
}

export default GetUserCharacterSheet;
