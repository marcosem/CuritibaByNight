import 'reflect-metadata';
import FakeAddonsRepository from '@modules/locations/repositories/fakes/FakeAddonsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import GetAddonsArrayService from '@modules/locations/services/GetAddonsArrayService';

let fakeAddonsRepository: FakeAddonsRepository;
let fakeUsersRepository: FakeUsersRepository;
let getAddonsArray: GetAddonsArrayService;

describe('GetAddonsArray', () => {
  beforeAll(async () => {
    fakeAddonsRepository = new FakeAddonsRepository();

    await fakeAddonsRepository.create({
      name: 'Aeroporto/Heliporto',
      level: 1,
      description: 'Um heliporto para pequenos helicópteros.',
      defense: 0,
      surveillance: 0,
      req_background: 'Resources x5',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 5,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 7,
      time_qty: 2,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Aeroporto/Heliporto',
      level: 2,
      description: 'Um heliporto para helicópteros comerciais.',
      defense: 0,
      surveillance: 0,
      req_background: 'Resources x5',
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 10,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 11,
      time_qty: 1,
      time_type: 'months',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 1,
      description: '4 animais.',
      defense: 1,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 2,
      influence: 'Bureaucracy, Street',
      influence_qty: 2,
      time_qty: 3,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 2,
      description: '8 animais.',
      defense: 2,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: null,
      req_addon_1: null,
      req_addon_2: null,
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 6,
      influence: 'Bureaucracy, Street',
      influence_qty: 6,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 1,
      description: '4 animais.',
      defense: 1,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Lagoa da Desova x3',
      req_addon_2: 'Rancho/Fazenda x2',
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 1,
      influence: 'Bureaucracy, Street',
      influence_qty: 1,
      time_qty: 3,
      time_type: 'days',
    });

    await fakeAddonsRepository.create({
      name: 'Animais Defensores',
      level: 2,
      description: '8 animais.',
      defense: 2,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Lagoa da Desova x3',
      req_addon_2: 'Rancho/Fazenda x2',
      req_addon_3: null,
      ability: 'Animal Ken',
      ability_qty: 3,
      influence: 'Bureaucracy, Street',
      influence_qty: 3,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Sistema de Barcos',
      level: 1,
      description:
        'Grande o suficiente para um caiaque, uma canoa ou um bote de borracha.',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Túneis Extras x2',
      req_addon_2: 'Sistema Hídrico x4',
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 1,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });

    await fakeAddonsRepository.create({
      name: 'Sistema de Barcos',
      level: 2,
      description:
        'Grande o suficiente para um barco a remo, uma jangada grande, ou um barquinho a motor.',
      defense: 0,
      surveillance: 0,
      req_background: null,
      req_merit: null,
      req_influence: null,
      req_other: 'Warrens Nosferatu',
      req_addon_1: 'Túneis Extras x2',
      req_addon_2: 'Sistema Hídrico x4',
      req_addon_3: null,
      ability: 'Science: Engineering',
      ability_qty: 2,
      influence: 'Bureaucracy, Industry, Transportation',
      influence_qty: 5,
      time_qty: 1,
      time_type: 'weeks',
    });
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    getAddonsArray = new GetAddonsArrayService(
      fakeAddonsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to list all non warrens type addons', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const expectedArray = ['Aeroporto/Heliporto', 'Animais Defensores'];

    const addonsArrayList = await getAddonsArray.execute({
      user_id: user.id,
      warrens: false,
    });

    expect(addonsArrayList).toHaveLength(2);
    expect(addonsArrayList).toEqual(expect.arrayContaining(expectedArray));
  });

  it('Should be able to list all warrens type addons', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const expectedArray = [
      'Aeroporto/Heliporto',
      'Animais Defensores',
      'Sistema de Barcos',
    ];

    const addonsArrayList = await getAddonsArray.execute({
      user_id: user.id,
      warrens: true,
    });

    expect(addonsArrayList).toHaveLength(3);
    expect(addonsArrayList).toEqual(expect.arrayContaining(expectedArray));
  });

  it('Should not allow invalid users to get a list of addons', async () => {
    await expect(
      getAddonsArray.execute({
        user_id: 'I am invalid',
        warrens: false,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
