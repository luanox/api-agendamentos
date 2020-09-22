import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateuserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(fakeUsersRepository,fakeHashProvider);
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    })

    it('should be able to Authenticate', async () => {
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