import {Router} from 'express'
import multer from 'multer'

import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import CreateUserService from '@modules/users/services/CreateuserService'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import uploadConfig from '@config/upload'

const usersRouter = Router()
const upload = multer(uploadConfig)


usersRouter.post('/', async (request, response) => {
    const userRepository = new UserRepository()
    const {name, email, password} = request.body

    const createUser = new CreateUserService(userRepository)

    const user = await createUser.execute({
        name,
        email,
        password
    })

    delete user.password

    return response.json(user)
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const userRepository = new UserRepository()
    const updateUserAvatar = new UpdateUserAvatarService(userRepository)

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename
    })
    delete user.password

    return response.json(user)
})

export default usersRouter