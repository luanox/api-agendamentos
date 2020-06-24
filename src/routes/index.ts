import {Router} from 'express'
import appointmentsRouter from './apponintments.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)

export default routes
