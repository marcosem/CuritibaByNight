import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/fakes/FakeCurrentActionMonthProvider';

import SetCurrentActionMonthService from '@modules/influences/services/SetCurrentActionMonthService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCurrentActionMonthProvider: FakeCurrentActionMonthProvider;
let setCurrentActionMonth: SetCurrentActionMonthService;

describe('SetCurrentActionMonth', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCurrentActionMonthProvider = new FakeCurrentActionMonthProvider();

    setCurrentActionMonth = new SetCurrentActionMonthService(
      fakeUsersRepository,
      fakeCurrentActionMonthProvider,
    );
  });

  it('Should be able set the current action month', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'A St User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const actionMonth = '2023-10';

    await setCurrentActionMonth.execute({
      user_id: stUser.id,
      action_month: actionMonth,
    });

    const currentActionMonth = await fakeCurrentActionMonthProvider.get();

    expect(currentActionMonth).toEqual(actionMonth);
  });

  it('Should not allow a non existant user to set current action month', async () => {
    await expect(
      setCurrentActionMonth.execute({
        user_id: 'I do not exist',
        action_month: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow a non storyteller user to set current action month', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Non St User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: false,
    });

    await expect(
      setCurrentActionMonth.execute({
        user_id: user.id,
        action_month: 'Does not matter',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should be able set the current action month', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'A St User',
      email: 'stUser@user.com',
      password: '123456',
      storyteller: true,
    });

    const invalidFormatActionMonth = '2023-10-09';

    await expect(
      setCurrentActionMonth.execute({
        user_id: stUser.id,
        action_month: invalidFormatActionMonth,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
