import {hash} from 'bcryptjs'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import IUserRepository from '../repositories/IUsersRepository'
import { injectable, inject } from 'tsyringe'

interface Request {
    name: string,
    email: string,
    password: string
}

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository
    ) {}

    public async execute({name, email, password}: Request): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email)

        if (checkUserExists) {
            throw new AppError("Email address already used");
            
        }

        const hashedPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        })

        return user
    }
}

export default CreateUserService