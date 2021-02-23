import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Character from '@modules/characters/infra/typeorm/entities/Character';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import calculateRetainerXP from '@modules/characters/utils/calculateRetainerXP';

interface IRequestDTO {
  user_id: string;
  player_id?: string;
  char_name: string;
  char_xp: number;
  char_xp_total: number;
  char_clan: string;
  char_creature_type: string;
  char_sect: string;
  char_title: string;
  char_coterie: string;
  is_npc: boolean;
  char_regnant?: string;
  char_retainer_level?: number;
  sheetFilename: string;
}

@injectable()
class CreateCharacterSheetService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    player_id,
    char_name,
    char_xp,
    char_xp_total,
    char_clan,
    char_creature_type,
    char_sect,
    char_title,
    char_coterie,
    is_npc,
    char_regnant,
    char_retainer_level = 0,
    sheetFilename,
  }: IRequestDTO): Promise<Character> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    } else if (!user.storyteller) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    }

    if (sheetFilename.indexOf('.pdf') === -1) {
      await this.storageProvider.deleteFile(sheetFilename, 'sheet');
      throw new AppError('File must be in PDF format', 400);
    }

    if (player_id && !is_npc) {
      const player = await this.usersRepository.findById(player_id);

      if (!player) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('Player not found', 400);
      }
    }

    let newCharTotalXP = char_xp_total;
    let newCharXP = char_xp;

    if (char_regnant) {
      const charRegnant = await this.charactersRepository.findById(
        char_regnant,
      );

      if (!charRegnant) {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError('Regnant Character not found', 400);
      }

      if (char_creature_type !== 'Mortal' && char_creature_type !== 'Wraith') {
        await this.storageProvider.deleteFile(sheetFilename, 'sheet');
        throw new AppError(
          'Only Mortal or Wraith Characters may have a Regnant',
          400,
        );
      }

      if (is_npc) {
        newCharTotalXP = calculateRetainerXP({
          retainerLevel: char_retainer_level,
          regnantXP: charRegnant.experience_total,
        });

        const difXP = newCharTotalXP - char_xp_total;
        newCharXP += difXP;
      }
    }

    const filename = await this.storageProvider.saveFile(
      sheetFilename,
      'sheet',
    );

    const char = await this.charactersRepository.create({
      user_id: !is_npc ? player_id : undefined,
      name: char_name,
      experience: newCharXP,
      experience_total: newCharTotalXP,
      clan: char_clan,
      creature_type: char_creature_type,
      sect: char_sect,
      title: char_title,
      coterie: char_coterie,
      file: filename,
      npc: is_npc,
      regnant: char_regnant,
      retainer_level: char_retainer_level,
    });

    return char;
  }
}

export default CreateCharacterSheetService;
