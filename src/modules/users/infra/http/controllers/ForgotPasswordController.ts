import {Request, Response} from 'express';
import { container } from 'tsyringe'

import SedForgotPasswordEmailService from '@modules/users/services/SedForgotPasswordEmailService'

export default class ForgotPasswordController {
    public async create(request: Request, response: Response): Promise<Response> {
        const {email} = request.body
        
        const sedForgotPasswordEmail = container.resolve(SedForgotPasswordEmailService)

        await sedForgotPasswordEmail.execute({
            email,
        })

        return response.status(204).json();
    }
}