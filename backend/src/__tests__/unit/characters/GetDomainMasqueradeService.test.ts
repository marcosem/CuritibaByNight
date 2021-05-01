import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/fakes/FakeDomainMasqueradeProvider';
import GetDomainMasqueradeService from '@modules/characters/services/GetDomainMasqueradeService';

let fakeUsersRepository: FakeUsersRepository;
let fakeDomainMasqueradeProvider: FakeDomainMasqueradeProvider;
let getDomainMasquerade: GetDomainMasqueradeService;

describe('SetDomainMasquerade', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDomainMasqueradeProvider = new FakeDomainMasqueradeProvider();

    getDomainMasquerade = new GetDomainMasqueradeService(
      fakeUsersRepository,
      fakeDomainMasqueradeProvider,
    );
  });

  it('Should be able to get the current domain masquerade', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    fakeDomainMasqueradeProvider.set(8);

    const currentDomainMasquerade = await getDomainMasquerade.execute({
      user_id: user.id,
    });

    expect(currentDomainMasquerade).toEqual(8);
  });

  it('Should not allow invalid users to set domain masquerade', async () => {
    await expect(
      getDomainMasquerade.execute({
        user_id: 'I am Invalid',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
