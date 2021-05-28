import 'reflect-metadata';
import { isToday } from 'date-fns';
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

  it('Should be able to update his user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const userProfile = await updateUserProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      active: false,
      storyteller: false,
    });

    expect(userProfile).toMatchObject({
      id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: '123456',
      storyteller: false,
    });
  });

  it('Should be able to update LGPD acceptance', async () => {
    const user = await fakeUsersRepository.create({
      name: 'A User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const userProfile = await updateUserProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      active: false,
      storyteller: false,
      lgpd_acceptance: true,
    });

    expect(userProfile).toMatchObject({
      id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: '123456',
      storyteller: false,
      lgpd_acceptance_date: expect.any(Date),
    });

    if (userProfile.lgpd_acceptance_date !== null) {
      expect(isToday(userProfile.lgpd_acceptance_date)).toBeTruthy();
    }
  });

  it('Should allow storyteller to update others users profile', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'I am Another User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const userProfile = await updateUserProfile.execute({
      user_id: stUser.id,
      profile_id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      storyteller: true,
    });

    expect(userProfile).toMatchObject({
      id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: '123456',
      storyteller: true,
    });
  });

  it('Should allow storyteller to reset user LGPD acceptance', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'I am Another User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const updatedUser = await updateUserProfile.execute({
      user_id: anotherUser.id,
      profile_id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      lgpd_acceptance: true,
    });

    expect(updatedUser.lgpd_acceptance_date).not.toEqual(null);
    if (updatedUser.lgpd_acceptance_date !== null) {
      expect(isToday(updatedUser.lgpd_acceptance_date)).toBeTruthy();
    }

    const userProfile = await updateUserProfile.execute({
      user_id: stUser.id,
      profile_id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      storyteller: false,
      lgpd_acceptance: false,
    });

    expect(userProfile).toMatchObject({
      id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: '123456',
      storyteller: false,
      lgpd_acceptance_date: null,
    });

    expect(userProfile.lgpd_acceptance_date).toEqual(null);
  });

  it('Should not allow storyteller to update another user LGPD acceptance', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const anotherUser = await fakeUsersRepository.create({
      name: 'I am Another User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: stUser.id,
        profile_id: anotherUser.id,
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
        storyteller: true,
        lgpd_acceptance: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
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

    const userProfile = await updateUserProfile.execute({
      user_id: user.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      old_password: '123456',
      password: '123123',
    });

    expect(userProfile.password).toBe('123123');
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

  it('Should not allow invalid users to update user profile', async () => {
    await expect(
      updateUserProfile.execute({
        user_id: 'I am invalid',
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should not allow non storyteller users to update other user profiles', async () => {
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const nonSTUser = await fakeUsersRepository.create({
      name: 'Not a ST User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: nonSTUser.id,
        profile_id: anotherUser.id,
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('Should allow a storyteller to update other user profiles', async () => {
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another User',
      email: 'user@user.com',
      password: 'AnotherUserPassword',
      phone: '12-12345-1234',
      storyteller: false,
    });

    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    const anotherUserUpdated = await updateUserProfile.execute({
      user_id: stUser.id,
      profile_id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
    });

    expect(anotherUserUpdated).toMatchObject({
      id: anotherUser.id,
      name: 'New User Name',
      email: 'new@user.com',
      phone: '21-54321-4321',
      password: 'AnotherUserPassword',
    });
  });

  it('Should not allow update a non existant user profile', async () => {
    const stUser = await fakeUsersRepository.create({
      name: 'I am ST',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: true,
    });

    await expect(
      updateUserProfile.execute({
        user_id: stUser.id,
        profile_id: 'I do not exist',
        name: 'New User Name',
        email: 'new@user.com',
        phone: '21-54321-4321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not allow a non storyteller to update storyteller permission', async () => {
    const nonSTUser = await fakeUsersRepository.create({
      name: 'Not a ST User',
      email: 'user@user.com',
      password: '123456',
      phone: '12-12345-1234',
      storyteller: false,
    });

    await expect(
      updateUserProfile.execute({
        user_id: nonSTUser.id,
        name: 'Not a ST User',
        email: 'user@user.com',
        storyteller: true,
      }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });
});
