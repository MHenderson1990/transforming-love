import { Router } from 'express'
import { createPhotoUploads } from '../controllers/photoController.js'

const router = Router()

router.post('/upload-urls', createPhotoUploads)

export default router