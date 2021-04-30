import { Request, Response } from 'express';
import GetDomainMasqueradeService from '@modules/characters/services/GetDomainMasqueradeService';
import SetDomainMasqueradeService from '@modules/characters/services/SetDomainMasqueradeService';
import { container } from 'tsyringe';

export default class DomainMasqueradeController {
  public async show(req: Request, res: Response): Promise<Response> {
    const getDomainMasquerade = container.resolve(GetDomainMasqueradeService);

    const domainMasquerade = await getDomainMasquerade.execute({
      user_id: req.user.id,
    });

    return res.json({ masquerade_level: domainMasquerade });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { masquerade_level } = req.body;

    const setDomainMasquerade = container.resolve(SetDomainMasqueradeService);

    await setDomainMasquerade.execute({
      user_id: req.user.id,
      masquerade_level,
    });

    return res.status(204).json();
  }
}
