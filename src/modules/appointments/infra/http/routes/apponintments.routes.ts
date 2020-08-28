import {Router} from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ApponintmentsCrontroller from '../controllers/AppointmentsController';

const appointmentsRouter = Router()
const apponintmentsCrontroller = new ApponintmentsCrontroller();

appointmentsRouter.use(ensureAuthenticated)

// appointmentsRouter.get('/', async (request, response) =>{
//     const appointments = await appointmentsRepository.find()

//     return response.json(appointments)
// })

appointmentsRouter.post('/', apponintmentsCrontroller.create)

export default appointmentsRouter