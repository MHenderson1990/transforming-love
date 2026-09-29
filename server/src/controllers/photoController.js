import {
  PhotoInputError,
  preparePhotoUploads,
} from '../services/photoService.js'
import { verifyTurnstileToken } from '../services/turnstileService.js'

export async function createPhotoUploads(req, res) {
  try {
    const { photos, turnstileToken } = req.body

    const verified = await verifyTurnstileToken(turnstileToken)

    if (!verified) {
      return res.status(403).json({
        error: 'Verification failed. Please try again.',
      })
    }

    const result = await preparePhotoUploads(photos)
    res.json(result)
  } catch (error) {
    if (error instanceof PhotoInputError) {
      return res.status(400).json({ error: error.message })
    }

    console.error('Could not prepare photo uploads:', error)
    res.status(500).json({ error: 'Could not prepare photo uploads' })
  }
}