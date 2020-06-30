import multer from 'multer'
import crypto from 'crypto'
import path from 'path'

const tmpfolder = path.resolve(__dirname, '..', '..', 'tmp')

export default {
    directory: tmpfolder,

    storage: multer.diskStorage({
        destination: tmpfolder,
        filename(request, file, callback){
            const fileHash = crypto.randomBytes(10).toString('hex')
            const fileName = `${fileHash}-${file.originalname}`

            return callback(null, fileName)
        }
    })
}