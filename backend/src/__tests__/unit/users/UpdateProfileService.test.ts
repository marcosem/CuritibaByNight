import 'reflect-metadata';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const userRrofile = await updateUserProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
    });

    expect(userRrofile).toMatchObject({
      id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: '123456',
      storyteller: false,
    });
  });

  it('Should not be able to change the email to an email already in use', async () => {
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'myemail@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: user.name,
        email: anotherUser.email,
        phone: user.phone,
        old_password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const userRrofile = await updateUserProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      old_password: '123456',
      password: '123123',
    });

    expect(userRrofile.password).toBe('123123');
  });

  it('Should not allow to update the password without enter the old one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
        password: '123123',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow to update the password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: user.id,
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
