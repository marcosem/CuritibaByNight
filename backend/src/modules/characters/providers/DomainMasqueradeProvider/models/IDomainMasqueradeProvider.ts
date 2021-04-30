export default interface IDomainMasqueradeProvider {
  set(masquerade: number): boolean;
  get(): Promise<number>;
}
