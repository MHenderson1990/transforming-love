const apiBaseUrl =
  import.meta.env.VITE_UPLOAD_API_URL || 'http://localhost:8080'

export async function uploadPhotos(photos, turnstileToken) {
  const photoDetails = photos.map(({ slot, file }) => ({
    slot,
    contentType: file.type,
    size: file.size,
  }))

  const policyResponse = await fetch(`${apiBaseUrl}/api/photos/upload-urls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photos: photoDetails, turnstileToken }),
  })

  const policyResult = await policyResponse.json()

  if (!policyResponse.ok) {
    throw new Error(policyResult.error || 'Could not prepare photo uploads')
  }

  for (const upload of policyResult.uploads) {
    const photo = photos.find(({ slot }) => slot === upload.slot)
    const formData = new FormData()

    for (const [name, value] of Object.entries(upload.fields)) {
      formData.append(name, value)
    }

    formData.append('file', photo.file)

    const response = await fetch(upload.url, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Could not upload ${upload.slot}`)
    }
  }

  return {
    applicationId: policyResult.applicationId,
    objectNames: policyResult.uploads.map(({ slot, objectName }) => ({
      slot,
      objectName,
    })),
  }
}