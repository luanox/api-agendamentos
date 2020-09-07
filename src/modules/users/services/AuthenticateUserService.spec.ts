import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateuserService';

describe('AuthenticateUser', () => {
    it('should be able to Authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const response =  await authenticateUser.execute({
            email: 'luan@teste.com',
            password: '12345'
        });

        expect(response).toHaveProperty('token');
    })

})