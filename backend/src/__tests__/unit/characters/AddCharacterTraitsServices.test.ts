import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import AddCharacterTraitsService from '@modules/characters/services/AddCharacterTraitsService';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let addCharacterTraits: AddCharacterTraitsService;

describe('AddCharacterTraits', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();

    addCharacterTraits = new AddCharacterTraitsService(
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get add a list of traits for a character', async () => {
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

    const traitsList = [
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
    ] as CharacterTrait[];

    const traitsListResult = await addCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
      char_traits: traitsList,
    });

    expect(traitsListResult).toHaveLength(3);
    const personalMasqueradeTrait = traitsListResult.find(
      trait => trait.trait === 'Personal Masquerade',
    );
    expect(personalMasqueradeTrait).not.toBeUndefined();
    expect(personalMasqueradeTrait).toHaveProperty('level_temp');
    expect(personalMasqueradeTrait?.level_temp).toEqual(
      'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
    );
  });

  it('Should be able get add a list of traits for a characters removing the old one, except Personal Masquerade', async () => {
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
        trait: 'Courage',
        character_id: char.id,
        level: 5,
        type: 'virtues',
      },
      {
        trait: 'Personal Masquerade',
        character_id: char.id,
        level: 10,
        level_temp: 'empty|empty|empty|empty|empty|empty|empty|full|full|full',
        type: 'creature',
      },
    ]);

    const newTraitsList = [
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
    ] as CharacterTrait[];

    const traitsListResult = await addCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
      char_traits: newTraitsList,
    });

    const courageTrait = traitsListResult.find(
      trait => trait.trait === 'Courage',
    );
    const personalMasqueradeTrait = traitsListResult.find(
      trait => trait.trait === 'Personal Masquerade',
    );

    expect(traitsListResult).toHaveLength(3);
    expect(courageTrait).toBeUndefined();
    expect(personalMasqueradeTrait).toHaveProperty('level_temp');
    expect(personalMasqueradeTrait?.level_temp).toEqual(
      'empty|empty|empty|empty|empty|empty|empty|full|full|full',
    );
  });

  it('Should not be able to add an empty list of traits to a character', async () => {
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

    const emptyTraitsList = [] as CharacterTrait[];

    await expect(
      addCharacterTraits.execute({
        user_id: user.id,
        char_id: char.id,
        char_traits: emptyTraitsList,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to add a list of traits to an invalid character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      addCharacterTraits.execute({
        user_id: user.id,
        char_id: 'I am invalid',
        char_traits: [],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow not storyteller user to add traits to a character', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      addCharacterTraits.execute({
        user_id: notStUser.id,
        char_id: 'Does not matter',
        char_traits: [],
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow not invalid users to add traits to a character', async () => {
    await expect(
      addCharacterTraits.execute({
        user_id: 'I am Invalid',
        char_id: 'Does not matter',
        char_traits: [],
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
