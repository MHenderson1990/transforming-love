import { sendApplicationEmail } from './emailService.js'
import { verifySubmissionToken } from './submissionTokenService.js'

export class ApplicationInputError extends Error {}

const usedApplicationIds = new Set()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function submitApplication(body) {
  const tokenData = verifySubmissionToken(body?.submissionToken)

  if (!tokenData) {
    throw new ApplicationInputError('Your session expired. Please submit again.')
  }

  const { applicationId, photoPaths } = tokenData

  if (usedApplicationIds.has(applicationId)) {
    throw new ApplicationInputError('This application was already submitted.')
  }

  const application = {
    applicationId,
    photoPaths,
    name: clean(body.name, 100),
    age: Number(body.age),
    location: clean(body.location, 100),
    email: clean(body.email, 254),
    phone: clean(body.phone, 30),
    social: clean(body.social, 1000),
  }

  if (!application.name || !application.location || !application.phone) {
    throw new ApplicationInputError('Please fill out every required field.')
  }

  if (!Number.isInteger(application.age) || application.age < 25 || application.age > 40) {
    throw new ApplicationInputError('Age must be between 25 and 40.')
  }

  if (!emailPattern.test(application.email)) {
    throw new ApplicationInputError('Please enter a valid email address.')
  }

  usedApplicationIds.add(applicationId)

  try {
    await sendApplicationEmail(application)
  } catch (error) {
    usedApplicationIds.delete(applicationId)
    throw error
  }

  return { applicationId }
}