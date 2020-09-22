import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository = new FakeUsersRepository;
let fakeStorageProvider = new FakeStorageProvider;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
    })

    it('should be able to create a new user', async () => {
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.png'
        })

        expect(user.avatar).toBe('avatar.png');
    })

    it('should not be able to upadate avatar from non existing user', async () => {
        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFileName: 'avatar.png'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar.png'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFileName: 'avatar2.png'
        })

        expect(deleteFile).toHaveBeenCalledWith('avatar.png');
        expect(user.avatar).toBe('avatar2.png');
    })
})