import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/fakes/FakeDomainMasqueradeProvider';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import SetDomainMasqueradeService from '@modules/characters/services/SetDomainMasqueradeService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeDomainMasqueradeProvider: FakeDomainMasqueradeProvider;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let setDomainMasquerade: SetDomainMasqueradeService;

describe('SetDomainMasquerade', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDomainMasqueradeProvider = new FakeDomainMasqueradeProvider();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    setDomainMasquerade = new SetDomainMasqueradeService(
      fakeUsersRepository,
      fakeDomainMasqueradeProvider,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to set the domain masquerade', async () => {
    const removeSavedResult = jest.spyOn(fakeSaveRouteResultProvider, 'remove');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const initialLevel = await fakeDomainMasqueradeProvider.get();

    await setDomainMasquerade.execute({
      user_id: user.id,
      masquerade_level: 3,
    });

    const updatedLevel = await fakeDomainMasqueradeProvider.get();

    expect(initialLevel).not.toEqual(updatedLevel);
    expect(updatedLevel).toEqual(3);
    expect(removeSavedResult).toHaveBeenCalledWith('CharactersInfluences');
  });

  it('Should not allow to set negative domain masquerade', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      setDomainMasquerade.execute({
        user_id: user.id,
        masquerade_level: -1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to set domain masquerade bigger than 10', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      setDomainMasquerade.execute({
        user_id: user.id,
        masquerade_level: 11,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow no storyteller user to set domain masquerade', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      setDomainMasquerade.execute({
        user_id: noStUser.id,
        masquerade_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow invalid users to set domain masquerade', async () => {
    await expect(
      setDomainMasquerade.execute({
        user_id: 'I am Invalid',
        masquerade_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
