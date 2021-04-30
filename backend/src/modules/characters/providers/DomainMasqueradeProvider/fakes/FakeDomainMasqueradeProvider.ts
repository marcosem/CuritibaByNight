import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';

class FakeDomainMasqueradeProvider implements IDomainMasqueradeProvider {
  private masqueradeLevel: number;

  constructor() {
    this.masqueradeLevel = 0;
  }

  public get(): Promise<number> {
    return Promise.resolve(this.masqueradeLevel);
  }

  public set(masquerade: number): boolean {
    if (masquerade < 0 || masquerade > 10) return false;

    this.masqueradeLevel = masquerade;
    return true;
  }
}

export default FakeDomainMasqueradeProvider;
