// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeusersRepository';
import SedForgotPasswordEmailService from './SedForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

describe('SedForgotPasswordEmail', () => {
    it('should be able to recover the password using the email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const sedForgotPasswordEmail = new SedForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider);

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

})