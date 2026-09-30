const apiBaseUrl =
  import.meta.env.VITE_UPLOAD_API_URL || 'http://localhost:8080'

export async function submitApplication(fields, submissionToken) {
  const response = await fetch(`${apiBaseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, submissionToken }),
  })

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.error || 'Could not submit your application. Please try again.')
  }

  return result
}