import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository =  new FakeUserTokensRepository();
        fakeHashProvider =  new FakeHashProvider();
        
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    })

    it('should be able to reset to password', async () => {
        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            password: '1212',
            token
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('1212');
        expect(updateUser?.password).toBe('1212');
    })

    it('should not be able to reset the password with non-existing token', async () => {
        expect(
            resetPasswordService.execute({
                password: '1234',
                token: 'non-existing-token'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user')

        await expect(
            resetPasswordService.execute({
                password: '1234',
                token
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should not be able to reset password if passed more than 2 hours', async () => {
        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
           const customDate = new Date();

           return customDate.setHours(customDate.getHours() + 3);
        })

        await expect(
            resetPasswordService.execute({
                password: '1234',
                token
            })
        ).rejects.toBeInstanceOf(AppError);
    })

})