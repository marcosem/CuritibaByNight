export default interface IDomainMasqueradeProvider {
  set(masquerade: number): boolean;
  get(): number;
}
