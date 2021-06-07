import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import FakeSaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/fakes/FakeSaveRouteResultProvider';
import UpdateCharacterTraitService from '@modules/characters/services/UpdateCharacterTraitService';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let fakeSaveRouteResultProvider: FakeSaveRouteResultProvider;
let updateCharacterTrait: UpdateCharacterTraitService;

describe('UpdateCharacterTrait', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();
    fakeSaveRouteResultProvider = new FakeSaveRouteResultProvider();

    updateCharacterTrait = new UpdateCharacterTraitService(
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeSaveRouteResultProvider,
    );
  });

  it('Should be able to update a trait for a character', async () => {
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

    const traitsList = await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Blood',
        character_id: char.id,
        level: 10,
        type: 'creature',
      },
      {
        trait: 'Willpower',
        character_id: char.id,
        level: 6,
        type: 'virtues',
      },
      {
        trait: 'Personal Masquerade',
        character_id: char.id,
        level: 10,
        level_temp:
          'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
        type: 'creature',
      },
    ]);

    const templateBloodTrait: CharacterTrait = {
      id: traitsList[0].id,
      character_id: char.id,
      trait: 'Blood Pool',
      type: 'virtues',
      level: 5,
      level_temp: 'full|full|full|full|full',
    } as CharacterTrait;

    const newBloodTrait = {
      user_id: user.id,
      char_id: char.id,
      trait_id: traitsList[0].id,
      trait_name: 'Blood Pool',
      trait_type: 'virtues',
      trait_level: 5,
      trait_level_temp: 'full|full|full|full|full',
    };

    const updatedTrait = await updateCharacterTrait.execute(newBloodTrait);
    const updatedTraitsList = await fakeCharactersTraitsRepository.findByCharId(
      char.id,
      'all',
    );
    const oldBloodTrait = updatedTraitsList.find(
      trait => trait.trait === 'Blood',
    );
    const updatedBloodTrait = updatedTraitsList.find(
      trait => trait.trait === 'Blood Pool',
    );

    expect(updatedTrait).toMatchObject(templateBloodTrait);
    expect(oldBloodTrait).toBeUndefined();
    expect(updatedBloodTrait).not.toBeUndefined();
    if (updatedBloodTrait) {
      expect(updatedTrait).toMatchObject(updatedBloodTrait);
    }
    expect(removeSavedResult).toHaveBeenCalledWith('CharactersInfluences');
  });

  it('Should not be able to update a invalid trait', async () => {
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

    await expect(
      updateCharacterTrait.execute({
        user_id: user.id,
        char_id: char.id,
        trait_id: 'I am Invalid',
        trait_name: 'Does not matter',
        trait_type: 'Does not matter',
        trait_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update a trait for a invalid character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      updateCharacterTrait.execute({
        user_id: user.id,
        char_id: 'I am Invalid',
        trait_id: 'Does not matter',
        trait_name: 'Does not matter',
        trait_type: 'Does not matter',
        trait_level: 0,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow no storyteller user to update a trait', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      updateCharacterTrait.execute({
        user_id: notStUser.id,
        char_id: 'Does not matter',
        trait_id: 'Does not matter',
        trait_name: 'Does not matter',
        trait_type: 'Does not matter',
        trait_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow invalid usersto update a trait', async () => {
    await expect(
      updateCharacterTrait.execute({
        user_id: 'I am Invalid',
        char_id: 'Does not matter',
        trait_id: 'Does not matter',
        trait_name: 'Does not matter',
        trait_type: 'Does not matter',
        trait_level: 0,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
