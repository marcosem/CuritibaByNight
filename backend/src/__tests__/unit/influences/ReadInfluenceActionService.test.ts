import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ReadInfluenceActionService from '@modules/influences/services/ReadInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeUsersRepository: FakeUsersRepository;

let readInfluenceAction: ReadInfluenceActionService;

describe('ReadInfluenceAction', () => {
  beforeEach(() => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    readInfluenceAction = new ReadInfluenceActionService(
      fakeInfluenceActionsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to set an influence action as read', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
    });

    const infActionResult = await readInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
    });

    expect(infActionResult.storyteller_id).toEqual(user.id);
    expect(infActionResult.status).toEqual('read');
  });

  it('Should not allow a non existant user set an influence action as read', async () => {
    await expect(
      readInfluenceAction.execute({
        user_id: 'I do not exist',
        action_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow a non storyteller user set an influence action as read', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      readInfluenceAction.execute({
        user_id: user.id,
        action_id: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow set a non existant influence action as read', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      readInfluenceAction.execute({
        user_id: user.id,
        action_id: 'I do not exist',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
