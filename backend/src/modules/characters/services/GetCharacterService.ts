import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import Character from '@modules/characters/infra/typeorm/entities/Character';

interface IRequestDTO {
  user_id: string;
  char_id: string;
}

@injectable()
class GetCharacterService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, char_id }: IRequestDTO): Promise<Character> {
    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can load his characters sheets',
        401,
      );
    } else if (!user.storyteller && user_id !== char.user_id) {
      throw new AppError(
        'Only authenticated Storytellers can get other players character sheets',
        401,
      );
    }

    return char;

    /*
    const sheetUpload = uploadConfig('sheet');
    let playerSheetFilePath;
    switch (sheetUpload.driver) {
      case 's3':
        playerSheetFilePath = `https://${sheetUpload.config.s3.bucket}.s3.us-east-2.amazonaws.com/${char.file}`;
        // playerSheetFilePath = await request.get(url);
        break;
      case 'disk':
      default:
        playerSheetFilePath = path.join(
          uploadConfig('sheet').uploadsFolder,
          char.file,
        );
        break;
    }

    return playerSheetFilePath;
    */
  }
}

export default GetCharacterService;
