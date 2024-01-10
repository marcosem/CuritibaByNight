import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeInfluenceActionsRepository from '@modules/influences/repositories/fakes/FakeInfluenceActionsRepository';
import FakeCharactersRepository from '@modules/characters/repositories/fakes/FakeCharactersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import ReviewInfluenceActionService from '@modules/influences/services/ReviewInfluenceActionService';

let fakeInfluenceActionsRepository: FakeInfluenceActionsRepository;
let fakeMailProvider: FakeMailProvider;
let fakeCharactersRepository: FakeCharactersRepository;
let fakeUsersRepository: FakeUsersRepository;

let reviewInfluenceAction: ReviewInfluenceActionService;

describe('ReviewInfluenceAction', () => {
  beforeEach(() => {
    fakeInfluenceActionsRepository = new FakeInfluenceActionsRepository();
    fakeCharactersRepository = new FakeCharactersRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();

    reviewInfluenceAction = new ReviewInfluenceActionService(
      fakeInfluenceActionsRepository,
      fakeCharactersRepository,
      fakeUsersRepository,
      fakeMailProvider,
    );
  });

  it('Should be able to review an influence action', async () => {
    const userSt = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const char = await fakeCharactersRepository.create({
      user_id: user.id,
      name: 'Dracula',
      experience: 666,
      file: 'dracula.pdf',
      npc: false,
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      backgrounds: 'Resources x5',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      ability: 'Investigation',
      ability_level: 2,
      endeavor: 'attack',
      character_id: char.id,
      action_owner_id: 'Does not matter',
      action: 'Attack action',
      action_force: 7,
      status: 'sent',
    });

    const infActionResult = await reviewInfluenceAction.execute({
      user_id: userSt.id,
      action_id: infAction.id,
      st_reply: 'Seems a good action',
      result: 'success',
      news: 'Do not generate any news',
    });

    expect(infActionResult.storyteller_id).toEqual(userSt.id);
    expect(infActionResult.st_reply).toEqual('Seems a good action');
    expect(infActionResult.result).toEqual('success');
    expect(infActionResult.news).toEqual('Do not generate any news');
    expect(infActionResult.status).toEqual('replied');
    expect(sendMail).toHaveBeenCalled();
  });

  it('Should be able to review an influence action with default reply', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      endeavor: 'defend',
      character_id: 'Does not matter',
      action_owner_id: 'Does not matter',
      action: 'Defend',
      action_force: 8,
      status: 'sent',
    });

    const infActionResult = await reviewInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      result: 'success',
    });

    expect(infActionResult.storyteller_id).toEqual(user.id);
    expect(infActionResult.st_reply).toEqual('');
    expect(infActionResult.result).toEqual('success');
    expect(infActionResult.news).toEqual('');
    expect(infActionResult.status).toEqual('replied');
  });

  it('Should not send email when there is no user associated to the character', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const char = await fakeCharactersRepository.create({
      name: 'Dracula',
      user_id: 'I do not exist',
      experience: 666,
      file: 'dracula.pdf',
      npc: true,
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const infAction = await fakeInfluenceActionsRepository.create({
      title: 'Action Title',
      action_period: '2023-06',
      influence: 'Occult',
      influence_level: 3,
      influence_effective_level: 5,
      endeavor: 'defend',
      character_id: char.id,
      action_owner_id: 'Does not matter',
      action: 'Defend',
      action_force: 8,
      status: 'sent',
    });

    await reviewInfluenceAction.execute({
      user_id: user.id,
      action_id: infAction.id,
      result: 'success',
    });

    expect(sendMail).not.toHaveBeenCalled();
  });

  it('Should not allow a non existant user to review an influence action', async () => {
    await expect(
      reviewInfluenceAction.execute({
        user_id: 'I do not exist',
        action_id: 'Does not matter',
        result: 'success',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow a non storyteller user to review an influence action', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      reviewInfluenceAction.execute({
        user_id: user.id,
        action_id: 'Does not matter',
        result: 'success',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to review a non existant influence action', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A ST User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    await expect(
      reviewInfluenceAction.execute({
        user_id: user.id,
        action_id: 'I do not exist',
        result: 'success',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
