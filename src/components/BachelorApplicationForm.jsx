import { useRef, useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { uploadPhotos } from '../services/photoUploadService.js'
import { submitApplication } from '../services/applicationService.js'
import './BachelorApplicationForm.css'

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const photoFields = [
  { slot: 'fullBodyPhoto', label: 'Full-body', required: true },
  { slot: 'photo2', label: 'Photo 2', required: true },
  { slot: 'photo3', label: 'Photo 3', required: true },
  { slot: 'photo4', label: 'Photo 4', required: false },
]
const photoSlots = photoFields.map(({ slot }) => slot)
const textFields = ['name', 'age', 'location', 'email', 'phone', 'social']
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const acceptTypes = 'image/jpeg,image/png,image/webp'
const maxPhotoBytes = 25 * 1024 * 1024

function BachelorApplicationForm() {
  const turnstileRef = useRef(null)
  const submissionRef = useRef(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [fileNames, setFileNames] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(slot, event) {
    const file = event.target.files?.[0]
    setFileNames((current) => ({ ...current, [slot]: file?.name ?? '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submissionRef.current) return

    const form = event.currentTarget
    setError('')

    if (!form.elements.namedItem('consent')?.checked) {
      setError('Please agree to be contacted before submitting.')
      return
    }

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

    const formData = new FormData(form)
    const fields = Object.fromEntries(
      textFields.map((name) => [name, String(formData.get(name) ?? '')]),
    )

    submissionRef.current = true
    setIsSubmitting(true)

    try {
      const { submissionToken } = await uploadPhotos(photos, turnstileToken)
      await submitApplication(fields, submissionToken)
      setIsSubmitted(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not submit your application. Please try again.',
      )
      submissionRef.current = false
      setTurnstileToken('')
      turnstileRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="form-card form-success" role="status">
        <h2 className="form-success__title">Application received</h2>
        <p>
          Thank you for applying to Transforming Love. If you're selected,
          we'll reach out by email about a video submission.
        </p>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className="form-field">
        <label className="form-label" htmlFor="name">Full name</label>
        <input className="form-input" id="name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="age">Age</label>
          <input className="form-input" id="age" name="age" type="number" min="25" max="40" inputMode="numeric" required />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="phone">Phone</label>
          <input className="form-input" id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="location">City and state</label>
        <input className="form-input" id="location" name="location" type="text" autoComplete="address-level2" required />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input" id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="social">Social media links</label>
        <textarea className="form-input form-input--textarea" id="social" name="social" rows="3" />
      </div>

      <fieldset className="form-photos">
        <legend className="form-label">Photos · JPEG, PNG, or WebP, up to 25 MB</legend>
        <div className="form-photos__grid">
          {photoFields.map(({ slot, label, required }) => (
            <label
              key={slot}
              className={`photo-tile${required ? '' : ' photo-tile--optional'}${fileNames[slot] ? ' photo-tile--filled' : ''}`}
            >
              <span className="photo-tile__label">
                {label}
                {required && ' *'}
              </span>
              <span className="photo-tile__hint">
                {fileNames[slot] || (required ? 'Tap to upload' : 'Optional')}
              </span>
              <input
                className="visually-hidden"
                name={slot}
                type="file"
                accept={acceptTypes}
                required={required}
                onChange={(event) => handleFileChange(slot, event)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="form-consent">
        <input name="consent" type="checkbox" required />
        <span>
          I agree to be contacted by the Transforming Love casting team, and I
          understand my information will be kept private.
        </span>
      </label>

      {siteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{ responseField: false, theme: 'dark' }}
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
        <p className="form-error" role="alert">
          Verification is unavailable. The Turnstile site key is missing.
        </p>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="form-submit" type="submit" disabled={isSubmitting || !turnstileToken}>
        {isSubmitting ? 'Uploading photos and submitting…' : 'Submit application'}
      </button>
    </form>
  )
}

export default BachelorApplicationForm
