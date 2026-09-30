import {
  ApplicationInputError,
  submitApplication,
} from '../services/applicationService.js'

export async function createApplication(req, res) {
  try {
    const result = await submitApplication(req.body)
    res.status(201).json(result)
  } catch (error) {
    if (error instanceof ApplicationInputError) {
      return res.status(400).json({ error: error.message })
    }

    console.error('Could not submit application:', error)
    res.status(500).json({ error: 'Could not submit your application. Please try again.' })
  }
}