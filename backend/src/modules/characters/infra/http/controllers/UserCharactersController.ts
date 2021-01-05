import { Request, Response } from 'express';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import GetCharacterService from '@modules/characters/services/GetCharacterService';
import UpdateCharacterSheetService from '@modules/characters/services/UpdateCharacterSheetService';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import RemoveCharacterService from '@modules/characters/services/RemoveCharacterService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class UserCharactersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { player_id, is_npc } = req.body;
    const fileName = req.file.filename;
    const { mimetype } = req.file;

    const isNPC = is_npc === 'true';

    const parseCharacterSheetService = container.resolve(
      ParseCharacterSheetService,
    );

    const parsedChar = await parseCharacterSheetService.execute({
      sheetFilename: fileName,
      mimetype,
    });

    const createCharacterSheetService = container.resolve(
      CreateCharacterSheetService,
    );

    const inputData = {
      user_id: req.user.id,
      player_id,
      char_name: '',
      char_xp: 0,
      char_clan: '',
      char_title: '',
      char_coterie: '',
      is_npc: isNPC,
      sheetFilename: fileName,
    };

    if (parsedChar) {
      inputData.char_name = parsedChar.name;
      inputData.char_xp = parsedChar.experience;
      inputData.char_clan = parsedChar.clan;
      inputData.char_title = parsedChar.title;
      inputData.char_coterie = parsedChar.coterie;
    }

    const char = await createCharacterSheetService.execute(inputData);

    return res.json(classToClass(char));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getCharacterService = container.resolve(GetCharacterService);

    const char = await getCharacterService.execute({
      user_id: req.user.id,
      char_id: id,
    });

    return res.json(classToClass(char));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { player_id } = req.body;
    const situation = req.body.situation ? req.body.situation : 'active';

    const getUserCharacterSheet = container.resolve(
      GetUserCharacterSheetService,
    );

    const charList = await getUserCharacterSheet.execute({
      user_id: req.user.id,
      player_id: player_id || req.user.id,
      situation,
    });

    const charListUpdated = charList.map(char => {
      const newChar = char;
      return classToClass(newChar);
    });

    return res.json(charListUpdated);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { character_id, situation, comments, is_npc } = req.body;
    const fileName = req.file ? req.file.filename : '';
    const mimetype = req.file ? req.file.mimetype : '';

    const isNPC = is_npc === 'true';

    const getCharacterService = container.resolve(GetCharacterService);

    const oldChar = await getCharacterService.execute({
      user_id: req.user.id,
      char_id: character_id,
    });

    const parseCharacterSheetService = container.resolve(
      ParseCharacterSheetService,
    );

    const parsedChar = await parseCharacterSheetService.execute({
      sheetFilename: fileName,
      mimetype,
    });

    const inputData = {
      user_id: req.user.id,
      char_id: character_id,
      char_name: oldChar.name,
      char_xp: oldChar.experience,
      char_clan: oldChar.clan,
      char_title: oldChar.title,
      char_coterie: oldChar.coterie,
      char_situation: situation || oldChar.situation,
      is_npc: oldChar.npc !== isNPC ? isNPC : oldChar.npc,
      sheetFilename: fileName,
      update: comments,
    };

    if (parsedChar) {
      inputData.char_name = parsedChar.name;
      inputData.char_xp = parsedChar.experience;
      inputData.char_clan = parsedChar.clan;
      inputData.char_title = parsedChar.title;
      inputData.char_coterie = parsedChar.coterie;
    }

    const updateCharacterSheetService = container.resolve(
      UpdateCharacterSheetService,
    );

    const char = await updateCharacterSheetService.execute(inputData);

    return res.json(classToClass(char));
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { character_id } = req.body;

    const removeCharacter = container.resolve(RemoveCharacterService);

    await removeCharacter.execute({
      user_id: req.user.id,
      character_id,
    });

    return res.status(204).json();
  }
}
