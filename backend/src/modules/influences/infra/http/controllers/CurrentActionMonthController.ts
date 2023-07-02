import { Request, Response } from 'express';
import GetCurrentActionMonthService from '@modules/influences/services/GetCurrentActionMonthService';
import SetCurrentActionMonthService from '@modules/influences/services/SetCurrentActionMonthService';
import { container } from 'tsyringe';

export default class CurrentActionMonthController {
  public async show(req: Request, res: Response): Promise<Response> {
    const getActionMonth = container.resolve(GetCurrentActionMonthService);

    const actionMonth = await getActionMonth.execute({
      user_id: req.user.id,
    });

    return res.json({ action_month: actionMonth });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { action_month } = req.body;

    const setActionMonth = container.resolve(SetCurrentActionMonthService);

    await setActionMonth.execute({
      user_id: req.user.id,
      action_month,
    });

    return res.status(204).json();
  }
}
