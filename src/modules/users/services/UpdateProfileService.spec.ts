import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
    })

    it('should be able update the profile', async () => {
        const updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Luan Lugatti',
            email: 'lugatti@hotmail.com'
        })

        expect(updateUser.name).toBe('Luan Lugatti');
        expect(updateUser.email).toBe('lugatti@hotmail.com');
    })

    it('should not be able to change to another user email', async () => {
        const updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const user =  await fakeUsersRepository.create({
            name: 'luan neves teste',
            email: 'luanteste@teste.com',
            password: '12345'
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'luan neves',
                email: 'luan@teste.com'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should be able update the password', async () => {
        const updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Luan Lugatti',
            email: 'lugatti@hotmail.com',
            old_password: '12345',
            password: '123123'
        })

        expect(updateUser.password).toBe('123123');
    })

    it('should not be able update the password without old password', async () => {
        const updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Luan Lugatti',
                email: 'lugatti@hotmail.com',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able update the password with wrong old password', async () => {
        const updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Luan Lugatti',
                email: 'lugatti@hotmail.com',
                old_password: '123',
                password: '123123'
            })
        ).rejects.toBeInstanceOf(AppError);
    })
})