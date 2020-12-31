import { Request, Response } from 'express';
import GetCharactersListService from '@modules/characters/services/GetCharactersListService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class CharactersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { filter } = req.params;

    const charactersList = container.resolve(GetCharactersListService);

    const charList = await charactersList.execute({
      user_id: req.user.id,
      filter,
    });

    const charListUpdated = charList.map(char => {
      const newChar = char;
      return classToClass(newChar);
    });

    return res.json(charListUpdated);
  }
}
