import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 60 * 60 * 1000

function getSecret() {
  const secret = process.env.SUBMISSION_TOKEN_SECRET
  if (!secret) {
    throw new Error('SUBMISSION_TOKEN_SECRET is not configured')
  }
  return secret
}

function sign(data) {
  return createHmac('sha256', getSecret()).update(data).digest('base64url')
}

export function createSubmissionToken(applicationId, photoPaths) {
  const payload = Buffer.from(
    JSON.stringify({
      applicationId,
      photoPaths,
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  ).toString('base64url')

  return `${payload}.${sign(payload)}`
}

export function verifySubmissionToken(token) {
  if (typeof token !== 'string') return null

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null
  }

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}