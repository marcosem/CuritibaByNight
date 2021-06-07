export default interface ISaveRouteResultProvider {
  set(route: string, result: string): boolean;
  get(route: string): Promise<string>;
  remove(route: string): boolean;
}
