import {Router} from 'express'
import multer from 'multer'
import { container } from 'tsyringe'

import CreateUserService from '@modules/users/services/CreateuserService'
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import uploadConfig from '@config/upload'

const usersRouter = Router()
const upload = multer(uploadConfig)


usersRouter.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        return response.json(user);
    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService)

    const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename
    })
    delete user.password

    return response.json(user)
})

export default usersRouter