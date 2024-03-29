import 'reflect-metadata';
import FakeLocationsAddonsRepository from '@modules/locations/repositories/fakes/FakeLocationsAddonsRepository';
import FakeLocationsTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationsTraitsRepository';
import FakeAddonsRepository from '@modules/locations/repositories/fakes/FakeAddonsRepository';
import FakeLocationAvailableTraitsRepository from '@modules/locations/repositories/fakes/FakeLocationAvailableTraitsRepository';
import FakeLocationsRepository from '@modules/locations/repositories/fakes/FakeLocationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeLocationsCharactersRepository from '@modules/locations/repositories/fakes/FakeLocationsCharactersRepository';
import GetLocationAddonsAndTraitsService from '@modules/locations/services/GetLocationAddonsAndTraitsService';
import Addon from '@modules/locations/infra/typeorm/entities/Addon';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';

import AppError from '@shared/errors/AppError';

let fakeLocationsAddonsRepository: FakeLocationsAddonsRepository;
let fakeLocationsTraitsRepository: FakeLocationsTraitsRepository;
let fakeAddonsRepository: FakeAddonsRepository;
let fakeLocationAvailableTraitsRepository: FakeLocationAvailableTraitsRepository;
let fakeLocationsRepository: FakeLocationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeLocationsCharactersRepository: FakeLocationsCharactersRepository;
let getLocationAddonsAndTraits: GetLocationAddonsAndTraitsService;

let addonsList: {
  addon1: Addon;
  addon1_next: Addon;
  addon2: Addon;
  addon2_next: Addon;
  addon3: Addon;
  addon3_next: Addon;
  addon0_next: Addon;
};

let locAvaiTraits: LocationAvailableTrait[] = [];

describe('GetLocationAddonsAndTraits', () => {
  beforeAll(async () => {
    fakeAddonsRepository = new FakeAddonsRepository();

    const addon1 = await fakeAddonsRepository.create({
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

    const addon1_next = await fakeAddonsRepository.create({
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

    const addon2 = await fakeAddonsRepository.create({
      name: 'Armamento de Defesa',
      level: 3,
      description:
        'Controlado por um computador com um sistema básico de análise de ameaças.',
      defense: 3,
      surveillance: 0,
      req_background: 'Resources x3',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: 'Armadilhas x5',
      req_addon_2: 'Rede de Computadores x5',
      req_addon_3: 'Segurança Eletrônica x5',
      ability: 'Enigmas, Survival',
      ability_qty: 5,
      influence: 'Bureaucracy, Industry, Underworld',
      influence_qty: 10,
      time_qty: 3,
      time_type: 'weeks',
    });

    const addon2_next = await fakeAddonsRepository.create({
      name: 'Armamento de Defesa',
      level: 4,
      description:
        'Controlado por um computador com um sistema médio de análise de ameaças.',
      defense: 4,
      surveillance: 0,
      req_background: 'Resources x4',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: 'Armadilhas x5',
      req_addon_2: 'Rede de Computadores x5',
      req_addon_3: 'Segurança Eletrônica x5',
      ability: 'Enigmas, Survival',
      ability_qty: 9,
      influence: 'Bureaucracy, Industry, Underworld',
      influence_qty: 15,
      time_qty: 2,
      time_type: 'months',
    });

    const addon3 = await fakeAddonsRepository.create({
      name: 'Defesas Sobrenaturais',
      level: 2,
      description:
        'Quadros que viram os olhos para acompanhar alguém, plantas que murcham, ampulheta que faz a areia subir ao invés de cair, avisam da presença de algumas criaturas sobrenaturais intermediárias. Pode detectar espíritos e alguns fomores.',
      defense: 0,
      surveillance: 2,
      req_background: null,
      req_merit: null,
      req_influence: 'Occult x2',
      req_other: 'Blood Magic',
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Occult',
      ability_qty: 2,
      influence: 'Occult',
      influence_qty: 10,
      time_qty: 2,
      time_type: 'weeks',
    });

    const addon3_next = await fakeAddonsRepository.create({
      name: 'Defesas Sobrenaturais',
      level: 3,
      description:
        'Portas que rangem, espelhos que refletem uma imagem distorcida, água que muda de cor, podem ser indícios de que alguma criatura sobrenatural maior está presente no Refúgio. Pode detectar vampiros, lobisomens, fadas. *Ou fantasmas, no caso de Refúgio de membros de clã com Necromancia.',
      defense: 0,
      surveillance: 3,
      req_background: null,
      req_merit: null,
      req_influence: 'Occult x3',
      req_other: 'Blood Magic',
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Occult',
      ability_qty: 3,
      influence: 'Occult',
      influence_qty: 15,
      time_qty: 3,
      time_type: 'weeks',
    });

    const addon0_next = await fakeAddonsRepository.create({
      name: 'Design Artístico',
      level: 1,
      description: 'Agradável (Crafts x1).',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Crafts: Architecture',
      ability_qty: 1,
      influence: 'Industry',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });

    addonsList = {
      addon1,
      addon1_next,
      addon2,
      addon2_next,
      addon3,
      addon3_next,
      addon0_next,
    };

    fakeLocationAvailableTraitsRepository = new FakeLocationAvailableTraitsRepository();

    const traitsList = [
      {
        trait: 'Enigmas',
        type: 'abilities',
      },
      {
        trait: 'Security',
        type: 'abilities',
      },
      {
        trait: 'Occult',
        type: 'abilities',
      },
      {
        trait: 'Academics',
        type: 'abilities',
      },
      {
        trait: 'Resources',
        type: 'backgrounds',
      },
      {
        trait: 'Allies',
        type: 'backgrounds',
      },
      {
        trait: 'Media',
        type: 'influences',
      },
    ];

    locAvaiTraits = await fakeLocationAvailableTraitsRepository.createList(
      traitsList,
    );
  });

  beforeEach(() => {
    fakeLocationsAddonsRepository = new FakeLocationsAddonsRepository();
    fakeLocationsTraitsRepository = new FakeLocationsTraitsRepository();
    fakeLocationsRepository = new FakeLocationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeLocationsCharactersRepository = new FakeLocationsCharactersRepository();

    getLocationAddonsAndTraits = new GetLocationAddonsAndTraitsService(
      fakeLocationsAddonsRepository,
      fakeLocationsTraitsRepository,
      fakeLocationsRepository,
      fakeAddonsRepository,
      fakeLocationAvailableTraitsRepository,
      fakeUsersRepository,
      fakeCharactersRepository,
      fakeLocationsCharactersRepository,
    );
  });

  it('Should be able to list all addons and traits of a location', async () => {
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
      level: 3,
    });

    let expectedDefense = 8;
    let expectedSurveillance = 8;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon1.defense;
    expectedSurveillance += addonsList.addon1.surveillance;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon2.defense;
    expectedSurveillance += addonsList.addon2.surveillance;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon3.name,
      addon_level: addonsList.addon3.level,
      addon_id_current: addonsList.addon3.id,
      addon_id_next: addonsList.addon3_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon3.defense;
    expectedSurveillance += addonsList.addon3.surveillance;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon0_next.name,
      addon_level: 0,
      addon_id_current: null,
      addon_id_next: addonsList.addon0_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[0].id,
      level: 3,
    });
    expectedDefense += 3;

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[1].id,
      level: 2,
    });
    expectedSurveillance += 2;

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[4].id,
      level: 2,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.defense).toEqual(expectedDefense);
    expect(locationAddonsTraitsResult.surveillance).toEqual(
      expectedSurveillance,
    );
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(4);
    expect(locationAddonsTraitsResult.traitsList).toHaveLength(3);
  });

  it('Should be able to calculate surveillance correctly of a location', async () => {
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
      level: 3,
    });

    let expectedDefense = 8;
    let expectedSurveillance = 8;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon1.defense;
    expectedSurveillance += addonsList.addon1.surveillance;

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[0].id,
      level: 3,
    });

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[4].id,
      level: 2,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.defense).toEqual(expectedDefense);
    expect(locationAddonsTraitsResult.surveillance).toEqual(
      expectedSurveillance,
    );
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(1);
    expect(locationAddonsTraitsResult.traitsList).toHaveLength(2);
  });

  it('Should be able to calculate defense correctly of a location', async () => {
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
      level: 3,
    });

    let expectedDefense = 8;
    let expectedSurveillance = 8;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon2.defense;
    expectedSurveillance += addonsList.addon2.surveillance;

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: 'I am invalid',
      level: 2,
    });

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[4].id,
      level: 2,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.defense).toEqual(expectedDefense);
    expect(locationAddonsTraitsResult.surveillance).toEqual(
      expectedSurveillance,
    );
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(1);
    expect(locationAddonsTraitsResult.traitsList).toHaveLength(1);
  });

  it('Should handle invalid traits of a location by removing it from the list', async () => {
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
      level: 3,
    });

    let expectedDefense = 8;
    let expectedSurveillance = 8;

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    expectedDefense += addonsList.addon2.defense;
    expectedSurveillance += addonsList.addon2.surveillance;

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[1].id,
      level: 2,
    });

    await fakeLocationsTraitsRepository.addTraitToLocation({
      location_id: location.id,
      trait_id: locAvaiTraits[4].id,
      level: 2,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.defense).toEqual(expectedDefense);
    expect(locationAddonsTraitsResult.surveillance).toEqual(
      expectedSurveillance,
    );
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(1);
    expect(locationAddonsTraitsResult.traitsList).toHaveLength(2);
  });

  it('Should list no addon if there is no addon in the location', async () => {
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

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.defense).toEqual(6);
    expect(locationAddonsTraitsResult.surveillance).toEqual(6);
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(0);
  });

  it('Should be able to list all only valid addons of a location', async () => {
    const removeInvalidAddon = jest.spyOn(
      fakeLocationsAddonsRepository,
      'delete',
    );

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

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    const invalidLocAddon = await fakeLocationsAddonsRepository.addAddonToLocation(
      {
        location_id: location.id,
        addon_name: 'I am invalid',
        addon_level: 0,
        addon_id_current: 'Invalid Addon',
        addon_id_next: null,
        temp_ability: 0,
        temp_influence: 0,
      },
    );

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: user.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult.addonsList).toHaveLength(2);
    expect(removeInvalidAddon).toHaveBeenCalledWith(invalidLocAddon.id);
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

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: nonSTUser.id,
        char_id: char.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult).toHaveProperty('defense');
    expect(locationAddonsTraitsResult).toHaveProperty('surveillance');
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(2);
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

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: nonSTUser.id,
        char_id: char.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult).toHaveProperty('defense');
    expect(locationAddonsTraitsResult).toHaveProperty('surveillance');
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(2);
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

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon1.name,
      addon_level: addonsList.addon1.level,
      addon_id_current: addonsList.addon1.id,
      addon_id_next: addonsList.addon1_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    await fakeLocationsAddonsRepository.addAddonToLocation({
      location_id: location.id,
      addon_name: addonsList.addon2.name,
      addon_level: addonsList.addon2.level,
      addon_id_current: addonsList.addon2.id,
      addon_id_next: addonsList.addon2_next.id,
      temp_ability: 0,
      temp_influence: 0,
    });

    const locationAddonsTraitsResult = await getLocationAddonsAndTraits.execute(
      {
        user_id: nonSTUser.id,
        char_id: char.id,
        location_id: location.id,
      },
    );

    expect(locationAddonsTraitsResult).toHaveProperty('defense');
    expect(locationAddonsTraitsResult).toHaveProperty('surveillance');
    expect(locationAddonsTraitsResult.addonsList).toHaveLength(2);
  });

  it('Should not allow invalid users to get a list of addons', async () => {
    await expect(
      getLocationAddonsAndTraits.execute({
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
      getLocationAddonsAndTraits.execute({
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
      getLocationAddonsAndTraits.execute({
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
      getLocationAddonsAndTraits.execute({
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
      getLocationAddonsAndTraits.execute({
        user_id: nonSTUser.id,
        char_id: char.id,
        location_id: location.id,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
