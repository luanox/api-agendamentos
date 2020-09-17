import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface Request {
  email: string;
}

@injectable()
class SedForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({email}: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    

    if(!user) {
        throw new AppError('User does not Exists.');
    }

    const {token} = await this.userTokensRepository.generate(user.id)
    
    await this.mailProvider.sendMail(email, `Pedido recebido para recuperação de senha!!! token: ${token}`)
  }
}

export default SedForgotPasswordEmailService;
