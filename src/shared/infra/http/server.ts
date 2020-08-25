import 'reflect-metadata'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import 'express-async-errors'
import routes from '@shared/infra/http/routes'

import AppError from '@shared/errors/AppError'
import uploadConfig from '@config/upload'
import '@shared/infra/http/typeorm'
import '@shared/container'

const app = express()

app.use(cors());
app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError){
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        })
    }

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

app.listen(3333, () => {
    console.log('🔱 server on port 3333!!');
})
