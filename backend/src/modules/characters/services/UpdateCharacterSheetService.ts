import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { resolve } from 'path';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  char_name: string;
  char_xp: number;
  sheetFilename: string;
}

@injectable()
class UpdateCharacterSheetService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    char_name,
    char_xp,
    sheetFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can update character sheets',
        401,
      );
    } else if (!user.storyteller) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can update character sheets',
        401,
      );
    }

    if (sheetFilename.indexOf('.pdf') === -1) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('File must be in PDF format', 400);
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('Character not found', 400);
    }

    if (char.file) {
      this.storageProvider.deleteFile(char.file, 'sheet');
    }

    const filename = await this.storageProvider.saveFile(
      sheetFilename,
      'sheet',
    );

    char.name = char_name;
    char.experience = char_xp;
    char.file = filename;

    await this.charactersRepository.update(char);

    const player = await this.usersRepository.findById(char.user_id);

    if (!player) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('Character player not found', 400);
    }

    const charUpdateTemplate = resolve(
      __dirname,
      '..',
      'views',
      'character_update.hbs',
    );

    // getting user first name.
    const userNames = player.name.split(' ');
    const xpMessage =
      char.experience === 1
        ? `${char.experience} XP`
        : `${char.experience} XPs`;

    await this.mailProvider.sendMail({
      to: {
        name: player.name,
        email: player.email,
      },
      subject: `[Curitiba By Night] Personagem '${char.name}' atualizado no sistema`,
      templateData: {
        file: charUpdateTemplate,
        variables: {
          name: userNames[0],
          char_name: char.name,
          char_xp: xpMessage,
          link: `${process.env.APP_WEB_URL}`,
          imgLogo: `${process.env.APP_API_URL}/images/curitibabynight.png`,
          imgCharSheet: `${process.env.APP_API_URL}/images/character_sheet.jpg`,
        },
      },
    });

    return char;
  }
}

export default UpdateCharacterSheetService;
