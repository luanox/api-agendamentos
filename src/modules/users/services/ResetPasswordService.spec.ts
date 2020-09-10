import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('SedForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository =  new FakeUserTokensRepository();
        
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository
        );
    })

    it('should be able to reset to password', async () => {
        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({
            password: '1212',
            token
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(updateUser?.password).toBe('1212');
    })

})