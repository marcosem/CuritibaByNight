export default interface ICurrentActionMonthProvider {
  set(actionMonth: string): boolean;
  get(): Promise<string>;
}
