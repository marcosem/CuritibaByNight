import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeCharactersTraitsRepository from '@modules/characters/repositories/fakes/FakeCharactersTraitsRepository';
import GetCharacterTraitsService from '@modules/characters/services/GetCharacterTraitsService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeCharactersTraitsRepository: FakeCharactersTraitsRepository;
let getCharacterTraits: GetCharacterTraitsService;

describe('GetCharacterTraits', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeCharactersTraitsRepository = new FakeCharactersTraitsRepository();

    getCharacterTraits = new GetCharacterTraitsService(
      fakeCharactersTraitsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able get a list of all traits from a characters', async () => {
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

    const traitsListResult = await getCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(traitsListResult).toHaveLength(3);
    expect(traitsListResult).toMatchObject(traitsList);
  });

  it('Should be able to get his own character traits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      user_id: user.id,
      npc: false,
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

    const traitsListResult = await getCharacterTraits.execute({
      user_id: user.id,
      char_id: char.id,
    });

    expect(traitsListResult).toHaveLength(3);
    expect(traitsListResult).toMatchObject(traitsList);
  });

  it('Should be able to get his own character retainer traits', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      user_id: user.id,
      npc: false,
    });

    const retainerChar = await fakeCharactersRepository.create({
      name: 'Igor',
      experience: 2,
      file: 'igor.pdf',
      npc: true,
      regnant: char.id,
      retainer_level: 2,
    });

    const traitsList = await fakeCharactersTraitsRepository.createList([
      {
        trait: 'Blood',
        character_id: retainerChar.id,
        level: 10,
        type: 'creature',
      },
      {
        trait: 'Willpower',
        character_id: retainerChar.id,
        level: 6,
        type: 'virtues',
      },
      {
        trait: 'Personal Masquerade',
        character_id: retainerChar.id,
        level: 10,
        level_temp:
          'empty|empty|empty|empty|empty|empty|empty|empty|empty|empty',
        type: 'creature',
      },
    ]);

    const traitsListResult = await getCharacterTraits.execute({
      user_id: user.id,
      char_id: retainerChar.id,
    });

    expect(traitsListResult).toHaveLength(3);
    expect(traitsListResult).toMatchObject(traitsList);
  });

  it('Should now allow invalid user to get character traits', async () => {
    await expect(
      getCharacterTraits.execute({
        user_id: 'I am invalid',
        char_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should now allow to get traits from a invalid character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getCharacterTraits.execute({
        user_id: user.id,
        char_id: 'Does not matter',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should now allow to get traits from another user characters', async () => {
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another',
      email: 'another@user.com',
      password: '123456',
      storyteller: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      user_id: anotherUser.id,
      npc: false,
    });

    await expect(
      getCharacterTraits.execute({
        user_id: user.id,
        char_id: char.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
