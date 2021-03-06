import {sign} from 'jsonwebtoken'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'
import IUserRepository from '../repositories/IUsersRepository'
import { injectable, inject } from 'tsyringe'
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
    email: string
    password: string
}

interface Response {
    user: User
    token: string
}

@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({email, password}: Request): Promise<Response> {
        const user = await this.usersRepository.findByEmail(email)
        
        
        if(!user){
            throw new AppError("Incorrect email/password combination", 401);
        }
        
        const passwordMatched = await this.hashProvider.compareHash(password, user.password)

        if(!passwordMatched){
            throw new AppError("Incorrect email/password combination", 401);
        }

        const token = sign({}, authConfig.jwt.secret,{
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        })

        return {
            user,
            token
        }
    }
}

export default AuthenticateUserService