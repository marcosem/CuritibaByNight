import { Request, Response } from 'express';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import CreateCharacterSheetService from '@modules/characters/services/CreateCharacterSheetService';
import GetCharacterSheetService from '@modules/characters/services/GetCharacterSheetService';
import UploadCharacterSheetService from '@modules/characters/services/UploadCharacterSheetService';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import { container } from 'tsyringe';

export default class CharacterController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { player_id, email } = req.body;
    const fileName = req.file.filename;

    const parseCharacterSheetService = container.resolve(
      ParseCharacterSheetService,
    );

    const parsedChar = await parseCharacterSheetService.execute({
      sheetFilename: fileName,
    });

    const createCharacterSheetService = container.resolve(
      CreateCharacterSheetService,
    );

    const inputData = {
      user_id: req.user.id,
      player_id,
      char_email: email,
      char_name: '',
      char_xp: 0,
      sheetFilename: fileName,
    };

    if (parsedChar) {
      inputData.char_name = parsedChar.name;
      inputData.char_xp = parsedChar.experience;
    }

    const char = await createCharacterSheetService.execute(inputData);

    return res.json(char);
  }

  public async show(req: Request, res: Response): Promise<Response | void> {
    const { id } = req.params;

    const getCharacterSheetService = container.resolve(
      GetCharacterSheetService,
    );

    const sheet = await getCharacterSheetService.execute({
      user_id: req.user.id,
      char_id: id,
    });

    return res.sendFile(sheet);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { player_id } = req.body;

    const getUserCharacterSheet = container.resolve(
      GetUserCharacterSheetService,
    );

    const charList = await getUserCharacterSheet.execute({
      user_id: req.user.id,
      player_id: player_id || req.user.id,
    });

    return res.json(charList);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { character_id } = req.body;
    const fileName = req.file.filename;

    const parseCharacterSheetService = container.resolve(
      ParseCharacterSheetService,
    );

    const parsedChar = await parseCharacterSheetService.execute({
      sheetFilename: fileName,
    });

    const inputData = {
      user_id: req.user.id,
      char_id: character_id,
      char_name: '',
      char_xp: 0,
      sheetFilename: fileName,
    };

    if (parsedChar) {
      inputData.char_name = parsedChar.name;
      inputData.char_xp = parsedChar.experience;
    }

    const uploadCharacterSheetService = container.resolve(
      UploadCharacterSheetService,
    );

    const char = await uploadCharacterSheetService.execute(inputData);

    return res.json(char);
  }
}
