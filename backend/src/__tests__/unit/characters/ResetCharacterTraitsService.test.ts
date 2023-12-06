import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import ResetCharacterTraitsService from '@modules/characters/services/ResetCharacterTraitsService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let resetCharacterTraits: ResetCharacterTraitsService;

describe('ResetCharactersTraits', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    resetCharacterTraits = new ResetCharacterTraitsService(
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to reset traits of character', async () => {
    const removeSavedResult = jest.spyOn(fakeSaveRouteResultProvider, 'remove');

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Blood',
        character_id: char.id,
        level: 10,
        level_temp: 'full|full|full|full|full|empty|empty|empty|empty|empty',
        type: 'creature',
      },
      {
        trait: 'Willpower',
        character_id: char.id,
        level: 6,
        level_temp: 'full|full|full|empty|empty|empty',
        type: 'virtues',
      },
      {
        trait: 'Personal Masquerade',
        character_id: char.id,
        level: 10,
        level_temp: 'full|full|full|empty|empty|empty|empty|empty|empty|empty',
        type: 'creature',
      },
    ]);

    await resetCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
      keep_masquerade: false,
    });

    const newTraitsList = await fakeCharactersTraitsRepository.findByCharId(
      char.id,
      'all',
    );

    expect(newTraitsList).toHaveLength(3);
    expect(newTraitsList[0].level_temp).toBeUndefined();
    expect(newTraitsList[1].level_temp).toBeUndefined();
    expect(newTraitsList[2].level_temp).toEqual(
      'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
    );
    expect(removeSavedResult).toHaveBeenCalledWith('CharactersInfluences');
    expect(removeSavedResult).toHaveBeenCalledWith('PowersList');
  });

  it('Should be able to reset traits of character keeping Personal Masquerade', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Blood',
        character_id: char.id,
        level: 10,
        level_temp: 'full|full|full|full|full|empty|empty|empty|empty|empty',
        type: 'creature',
      },
      {
        trait: 'Willpower',
        character_id: char.id,
        level: 6,
        level_temp: 'full|full|full|empty|empty|empty',
        type: 'virtues',
      },
      {
        trait: 'Personal Masquerade',
        character_id: char.id,
        level: 10,
        level_temp: 'full|full|full|empty|empty|empty|empty|empty|empty|empty',
        type: 'creature',
      },
    ]);

    await resetCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
      keep_masquerade: true,
    });

    const newTraitsList = await fakeCharactersTraitsRepository.findByCharId(
      char.id,
      'all',
    );

    expect(newTraitsList).toHaveLength(3);
    expect(newTraitsList[0].level_temp).toBeUndefined();
    expect(newTraitsList[1].level_temp).toBeUndefined();
    expect(newTraitsList[2].level_temp).toEqual(
      'full|full|full|empty|empty|empty|empty|empty|empty|empty',
    );
  });

  it('Should not be able to reset traits of an invalid character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      resetCharacterTraits.execute({
        user_id: user.id,
        char_id: 'I am Invalid',
        keep_masquerade: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow no storyteller user to reset traits', async () => {
    const noStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      resetCharacterTraits.execute({
        user_id: noStUser.id,
        char_id: 'Does not matter',
        keep_masquerade: false,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow invalid users to reset traits', async () => {
    await expect(
      resetCharacterTraits.execute({
        user_id: 'I am Invalid',
        char_id: 'Does not matter',
        keep_masquerade: false,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
