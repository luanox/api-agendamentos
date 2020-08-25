import {Router} from 'express'

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request, response) => {
    const userRepository = new UserRepository()
    const {email, password} = request.body

        
    const authenticateUser = new AuthenticateUserService(userRepository)
    // console.log(authenticateUser);

    const {user, token} = await authenticateUser.execute({
        email,
        password
    })

    delete user.password

    return response.json({user, token})
})

export default sessionsRouter