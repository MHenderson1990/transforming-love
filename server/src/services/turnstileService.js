export async function verifyTurnstileToken(token, ipAddress) {
  const secret = process.env.TURNSTILE_SECRET

  if (!secret) {
    throw new Error('TURNSTILE_SECRET is not configured')
  }

  if (!token || typeof token !== 'string') {
    return false
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (ipAddress) {
    body.set('remoteip', ipAddress)
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body,
    },
  )

  if (!response.ok) {
    throw new Error('Turnstile verification is unavailable')
  }

  const result = await response.json()

  return result.success === true
}