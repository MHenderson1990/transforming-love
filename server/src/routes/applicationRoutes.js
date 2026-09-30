import { Router } from 'express'
import { createApplication } from '../controllers/applicationController.js'

const router = Router()

router.post('/', createApplication)

export default router