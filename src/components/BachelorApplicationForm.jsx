import { useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { uploadPhotos } from '/src/services/photoUploadService.js'

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const photoSlots = ['fullBodyPhoto', 'photo2', 'photo3', 'photo4']
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxPhotoBytes = 25 * 1024 * 1024

function BachelorApplicationForm() {
  const turnstileRef = useRef(null)
  const submissionRef = useRef(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (submissionRef.current) return

    const form = event.currentTarget
    setError('')

    if (!turnstileToken) {
      setError('Please complete the verification before submitting.')
      return
    }

    const photos = photoSlots.flatMap((slot) => {
      const file = form.elements.namedItem(slot)?.files?.[0]
      return file ? [{ slot, file }] : []
    })

    if (!photoSlots.slice(0, 3).every((slot) => photos.some((photo) => photo.slot === slot))) {
      setError('A full-body photo and two other photos are required.')
      return
    }

    for (const { file } of photos) {
      if (!allowedTypes.has(file.type)) {
        setError('Choose JPEG, PNG, or WebP photos.')
        return
      }
      if (file.size <= 0 || file.size > maxPhotoBytes) {
        setError('Each photo must be nonempty and 25 MB or smaller.')
        return
      }
    }

    // Capture the application details before starting the asynchronous uploads.
    const applicationData = new FormData(form)
    for (const slot of photoSlots) applicationData.delete(slot)
    applicationData.delete('cf-turnstile-response')

    submissionRef.current = true
    setIsSubmitting(true)
    let emailForm

    try {
      const { applicationId, objectNames } = await uploadPhotos(photos, turnstileToken)

      applicationData.set('applicationId', applicationId)
      applicationData.set(
        'photoStoragePaths',
        objectNames.map(({ slot, objectName }) => `${slot}: ${objectName}`).join('\n'),
      )

      // Submit text only to the existing email provider after every photo uploads.
      emailForm = document.createElement('form')
      emailForm.action = form.action
      emailForm.method = 'POST'
      emailForm.hidden = true

      for (const [name, value] of applicationData.entries()) {
        if (typeof value !== 'string') continue
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        emailForm.appendChild(input)
      }

      document.body.appendChild(emailForm)
      HTMLFormElement.prototype.submit.call(emailForm)
    } catch (uploadError) {
      emailForm?.remove()
      setError(uploadError instanceof Error ? uploadError.message : 'Could not submit your application. Please try again.')
      submissionRef.current = false
      setIsSubmitting(false)
      setTurnstileToken('')
      turnstileRef.current?.reset()
    }
  }

  return (
    <form
      action="https://formsubmit.co/transforminglove26@gmail.com"
      method="POST"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <input
        type="hidden"
        name="_subject"
        value="New Transforming Love bachelor application"
      />

      <label htmlFor="name">Full name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="age">Age</label>
      <input id="age" name="age" type="number" min="25" max="40" required />

      <label htmlFor="location">City and state</label>
      <input id="location" name="location" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="phone">Phone number</label>
      <input id="phone" name="phone" type="tel" required />

      <label htmlFor="social">Social media links</label>
      <textarea id="social" name="social" rows="3" />

      <p>Upload three or four JPEG, PNG, or WebP photos, up to 25 MB each.</p>

      <label htmlFor="fullBodyPhoto">Full-body photo</label>
      <input id="fullBodyPhoto" name="fullBodyPhoto" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo2">Second photo</label>
      <input id="photo2" name="photo2" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo3">Third photo</label>
      <input id="photo3" name="photo3" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo4">Fourth photo (optional)</label>
      <input id="photo4" name="photo4" type="file" accept="image/jpeg,image/png,image/webp" />

      {siteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{ responseField: false }}
          onSuccess={(token) => {
            setTurnstileToken(token)
            setError('')
          }}
          onExpire={() => setTurnstileToken('')}
          onTimeout={() => setTurnstileToken('')}
          onError={() => {
            setTurnstileToken('')
            setError('Verification could not load. Please refresh and try again.')
          }}
        />
      ) : (
        <p role="alert">Verification is unavailable. The Turnstile site key is missing.</p>
      )}

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting || !turnstileToken}>
        {isSubmitting ? 'Uploading photos and submitting…' : 'Submit application'}
      </button>
    </form>
  )
}

export default BachelorApplicationForm
