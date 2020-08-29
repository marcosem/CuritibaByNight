import { Request, Response } from 'express';
import GetUserCharacterSheetService from '@modules/characters/services/GetUserCharacterSheetService';
import UploadCharacterSheetService from '@modules/characters/services/UploadCharacterSheetService';
import ParseCharacterSheetService from '@modules/characters/services/ParseCharacterSheetService';
import { container } from 'tsyringe';

export default class SessionsController {
  public async show(req: Request, res: Response): Promise<Response | void> {
    const getUserCharacterSheet = container.resolve(
      GetUserCharacterSheetService,
    );

    const sheet = await getUserCharacterSheet.execute({
      user_id: req.user.id,
      player_id: req.user.id,
    });

    return res.sendFile(sheet);
  }

  public async index(req: Request, res: Response): Promise<Response | void> {
    const { player_id } = req.body;

    const getUserCharacterSheet = container.resolve(
      GetUserCharacterSheetService,
    );

    const sheet = await getUserCharacterSheet.execute({
      user_id: req.user.id,
      player_id,
    });

    return res.sendFile(sheet);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { player_id } = req.body;

    const uploadCharacterSheetService = container.resolve(
      UploadCharacterSheetService,
    );

    const user = await uploadCharacterSheetService.execute({
      user_id: req.user.id,
      player_id,
      sheetFilename: req.file.filename,
    });

    const parseCharacterSheetService = container.resolve(
      ParseCharacterSheetService,
    );

    const char = await parseCharacterSheetService.execute({
      sheetFilename: user.character_file,
    });
    console.log(char);

    delete user.password;
    delete user.secret;

    return res.json(user);
  }
}
