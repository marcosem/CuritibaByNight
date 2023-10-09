import ICurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/models/ICurrentActionMonthProvider';

class FakeCurrentActionMonthProvider implements ICurrentActionMonthProvider {
  private actionMonth: string;

  constructor() {
    this.actionMonth = '';
  }

  public get(): Promise<string> {
    return Promise.resolve(this.actionMonth);
  }

  public set(actionMonth: string): boolean {
    const dateFormatValidation = /^(19|20)\d{2}-(0[1-9]|1[012])$/;

    if (!dateFormatValidation.test(actionMonth)) return false;

    this.actionMonth = actionMonth;
    return true;
  }
}

export default FakeCurrentActionMonthProvider;
