import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateuserService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository = new FakeUsersRepository;
let fakeHashProvider = new FakeHashProvider;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
    })

    it('should be able to create a new user', async () => {
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user =  await createUser.execute({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        expect(user).toHaveProperty('id');
    })

    it('should not be able to create a new user with same email from another', async () => {
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

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