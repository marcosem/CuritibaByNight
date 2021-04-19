import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import calculateRetainerXP from '@modules/characters/utils/calculateRetainerXP';
import { resolve } from 'path';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  char_name: string;
  char_xp: number;
  char_xp_total: number;
  char_clan: string;
  char_creature_type: string;
  char_sect: string;
  char_title: string;
  char_coterie: string;
  char_situation: string;
  is_npc: boolean;
  char_regnant?: string | null;
  char_retainer_level?: number;
  sheetFilename: string;
  update: string;
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
    char_xp_total,
    char_clan,
    char_creature_type,
    char_sect,
    char_title,
    char_coterie,
    char_situation,
    is_npc,
    char_regnant,
    char_retainer_level = 0,
    sheetFilename,
    update,
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

    const oldSituation = char.situation;

    char.name = char_name;
    char.experience = char_xp;
    char.experience_total = char_xp_total;
    char.clan = char_clan;
    char.creature_type = char_creature_type;
    char.sect = char_sect;
    char.title = char_title;
    char.coterie = char_coterie;
    char.situation = char_situation;
    char.retainer_level = char_retainer_level;
    char.file = filename;

    let player;
    if (char.user_id) {
      player = await this.usersRepository.findById(char.user_id);

      if (!player && !char.npc) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('Character player not found', 400);
      }

      if (is_npc) {
        char.user_id = null;
        delete char.user;
      }
    }
    char.npc = is_npc;

    let charRegnant: Character | undefined;

    if (char_regnant) {
      if (char_regnant === char_id) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('A Character cannot be his own Regnant', 400);
      }

      charRegnant = await this.charactersRepository.findById(char_regnant);

      if (!charRegnant) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('Regnant Character not found', 400);
      }

      if (char.creature_type === 'Mortal' || char.creature_type === 'Wraith') {
        if (char.regnant !== char_regnant) {
          delete char.regnant_char;
        }

        char.regnant = char_regnant;
      } else {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError(
          'Only Mortal and Wraith Characters may have a Regnant',
          400,
        );
      }
    } else if (char.regnant) {
      if (char_regnant === null) {
        char.regnant = null;
        delete char.regnant_char;
      } else {
        charRegnant = await this.charactersRepository.findById(char.regnant);
      }
    }

    if (charRegnant && is_npc) {
      const newTotalXP = calculateRetainerXP({
        retainerLevel: char.retainer_level,
        regnantXP: charRegnant.experience_total,
      });

      const difXP = newTotalXP - char.experience_total;
      char.experience_total = newTotalXP;
      char.experience += difXP;
    }

    const savedChar = await this.charactersRepository.update(char);

    if (player && (char.situation === 'active' || oldSituation === 'active')) {
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
            update,
            link: `${process.env.APP_WEB_URL}`,
            imgLogo: 'curitibabynight.png',
            imgCharSheet: 'character_sheet.jpg',
          },
        },
      });
    }

    return savedChar;
  }
}

export default UpdateCharacterSheetService;
