import 'reflect-metadata';
import FakeAddonsRepository from '@modules/locations/repositories/fakes/FakeAddonsRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import GetAvailableAddonsListService from '@modules/locations/services/GetAvailableAddonsListService';

import AppError from '@shared/errors/AppError';

let fakeAddonsRepository: FakeAddonsRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let getAvailableAddonsList: GetAvailableAddonsListService;

describe('GetAvailableAddonsList', () => {
  beforeAll(async () => {
    fakeAddonsRepository = new FakeAddonsRepository();

    await fakeAddonsRepository.create({
      name: 'Lacaios do Warren',
      level: 1,
      description: '1 Lacaio.',
      defense: 0,
      surveillance: 1,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Leadership',
      ability_qty: 1,
      influence: 'Any',
      influence_qty: 2,
      time_qty: 1,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Lacaios do Warren',
      level: 2,
      description: '2 Lacaios.',
      defense: 0,
      surveillance: 2,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Leadership',
      ability_qty: 1,
      influence: 'Any',
      influence_qty: 2,
      time_qty: 1,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Segurança Eletrônica',
      level: 1,
      description: 'Conjunto de câmeras preto e branco analógicas.',
      defense: 0,
      surveillance: 1,
      req_background: 'Resources x3',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: 'Rede de Computadores x1',
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Security',
      ability_qty: 1,
      influence: 'Bureaucracy, Industry, Police, University',
      influence_qty: 2,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Segurança Eletrônica',
      level: 2,
      description:
        'Câmeras infra-vermelhas/noturnas e sensores de movimento, ambos instalados em locais escondidos.',
      defense: 0,
      surveillance: 2,
      req_background: 'Resources x3',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: 'Rede de Computadores x1',
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Security',
      ability_qty: 3,
      influence: 'Bureaucracy, Industry, Police, University',
      influence_qty: 4,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Campo de Caça (Canil)',
      level: 1,
      description: '2 humanos.',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Medicine',
      ability_qty: 2,
      influence: 'Health, Street, Underworld',
      influence_qty: 10,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Defesas Sobrenaturais',
      level: 1,
      description:
        'Inscrições mágicas, apitos sobrenaturais, ventos em locais fechados, avisam da presença de algumas criaturas sobrenaturais menores. Pode detectar um carniçal ou alguém com Fé Verdadeira.',
      defense: 0,
      surveillance: 1,
      req_background: null,
      req_merit: null,
      req_influence: 'Occult x1',
      req_other: 'Blood Magic',
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Occult',
      ability_qty: 1,
      influence: 'Occult',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });
  });

  beforeEach(() => {
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();

    getAvailableAddonsList = new GetAvailableAddonsListService(
      fakeAddonsRepository,
      fakeLocationsRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
      fakeLocationsCharactersRepository,
    );
  });

  it('Should be able to list all addons for warrens', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Warrens Nosferatu',
      description: 'Warrens',
      latitude: -25.4425605,
      longitude: -49.2627458,
      property: 'clan',
      clan: 'Nosferatu',
    });

    const addonsList = await getAvailableAddonsList.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(addonsList).toHaveLength(4);
  });

  it('Should be able to list all addons for non warrens', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      elysium: true,
      clan: 'Toreador',
    });

    const addonsList = await getAvailableAddonsList.execute({
      user_id: user.id,
      location_id: location.id,
    });

    expect(addonsList).toHaveLength(3);
  });

  it('Should be able to list all addons for characters location', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      responsible: char.id,
      elysium: true,
      clan: 'Toreador',
    });

    const addonsList = await getAvailableAddonsList.execute({
      user_id: nonSTUser.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(addonsList).toHaveLength(3);
  });

  it('Should be able to list all addons for characters clan location', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Dracula',
      clan: 'Toreador',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      elysium: true,
      clan: 'Toreador',
    });

    const addonsList = await getAvailableAddonsList.execute({
      user_id: nonSTUser.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(addonsList).toHaveLength(3);
  });

  it('Should be able to list all addons for location shared by the character', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      elysium: true,
      clan: 'Toreador',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      true,
    );

    const addonsList = await getAvailableAddonsList.execute({
      user_id: nonSTUser.id,
      char_id: char.id,
      location_id: location.id,
    });

    expect(addonsList).toHaveLength(3);
  });

  it('Should not allow invalid users to get a list of addons', async () => {
    await expect(
      getAvailableAddonsList.execute({
        user_id: 'I am invalid',
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller user to list addons with character not defined', async () => {
    const notStUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
    });

    await expect(
      getAvailableAddonsList.execute({
        user_id: notStUser.id,
        location_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to get a list of addons for an invalid location', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      getAvailableAddonsList.execute({
        user_id: user.id,
        location_id: 'I am invalid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to get a list of addons with an invalid character', async () => {
    const nonSTuser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      elysium: true,
      clan: 'Toreador',
    });

    await expect(
      getAvailableAddonsList.execute({
        user_id: nonSTuser.id,
        location_id: location.id,
        char_id: 'I am invalid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow to list all addons for location not shared by the character', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: nonSTUser.id,
      name: 'Dracula',
      clan: 'Tzimisce',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const location = await fakeLocationsRepository.create({
      name: 'Ateliê Victor Augusto Gentil',
      description: 'Elysium Toreador',
      latitude: -25.4384281,
      longitude: -49.293875,
      property: 'clan',
      elysium: true,
      clan: 'Toreador',
    });

    await fakeLocationsCharactersRepository.addCharToLocation(
      char.id,
      location.id,
      false,
    );

    await expect(
      getAvailableAddonsList.execute({
        user_id: nonSTUser.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
