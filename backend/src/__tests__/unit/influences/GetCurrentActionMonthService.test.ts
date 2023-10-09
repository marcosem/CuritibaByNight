import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCurrentActionMonthProvider from '@modules/influences/providers/CurrentActionMonthProvider/fakes/FakeCurrentActionMonthProvider';

import GetCurrentActionMonthService from '@modules/influences/services/GetCurrentActionMonthService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCurrentActionMonthProvider: FakeCurrentActionMonthProvider;
let getCurrentActionMonth: GetCurrentActionMonthService;

describe('GetCurrentActionMonth', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCurrentActionMonthProvider = new FakeCurrentActionMonthProvider();

    getCurrentActionMonth = new GetCurrentActionMonthService(
      fakeUsersRepository,
      fakeCurrentActionMonthProvider,
    );
  });

  it('Should be able get the current action month', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      storyteller: false,
    });

    const currentMonth = '2023-10';

    fakeCurrentActionMonthProvider.set(currentMonth);

    const currentMonthLoaded = await getCurrentActionMonth.execute({
      user_id: user.id,
    });

    expect(currentMonthLoaded).toEqual(currentMonth);
  });

  it('Should not allow a non existant user to get current action month', async () => {
    await expect(
      getCurrentActionMonth.execute({
        user_id: 'I do not exist',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
