import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import CreateUserService from './CreateuserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);

        const user =  await createUser.execute({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        expect(user).toHaveProperty('id');
    })

    it('should not be able to create a new user with same email from another', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);

        await createUser.execute({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        expect(createUser.execute({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        })).rejects.toBeInstanceOf(AppError);
    })

})