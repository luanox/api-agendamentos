import {Router} from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsCrontroller from '../controllers/AppointmentsController';

const appointmentsRouter = Router()
const appointmentsController = new AppointmentsCrontroller();

appointmentsRouter.use(ensureAuthenticated)

// appointmentsRouter.get('/', async (request, response) =>{
//     const appointments = await appointmentsRepository.find()

//     return response.json(appointments)
// })

appointmentsRouter.post('/', appointmentsController.create)

export default appointmentsRouter