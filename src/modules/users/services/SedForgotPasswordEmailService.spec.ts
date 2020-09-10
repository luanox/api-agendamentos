import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SedForgotPasswordEmailService from './SedForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sedForgotPasswordEmail: SedForgotPasswordEmailService;

describe('SedForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository =  new FakeUserTokensRepository();

        
        sedForgotPasswordEmail = new SedForgotPasswordEmailService(
            fakeUsersRepository, 
            fakeMailProvider,
            fakeUserTokensRepository
        );
    })

    it('should be able to recover the password using the email', async () => {
        
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await sedForgotPasswordEmail.execute({
            email: 'luan@teste.com'
        });

        expect(sendMail).toHaveBeenCalled();
    })

    it('should be able to recover a non-ixiting user password ', async () => {
        await expect(
            sedForgotPasswordEmail.execute({
                email: 'luan@teste.com'
            })
        ).rejects.toBeInstanceOf(AppError);
    })

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user =  await fakeUsersRepository.create({
            name: 'luan neves',
            email: 'luan@teste.com',
            password: '12345'
        });

        await sedForgotPasswordEmail.execute({
            email: 'luan@teste.com'
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    })

})