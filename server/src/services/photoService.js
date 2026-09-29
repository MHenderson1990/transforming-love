import { randomUUID } from 'node:crypto'
import { createPhotoUploadUrl } from '../repositories/photoRepository.js'

const allowedTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

const allowedSlots = new Set([
  'fullBodyPhoto',
  'photo2',
  'photo3',
  'photo4',
])

export class PhotoInputError extends Error {}

export async function preparePhotoUploads(photos) {
  if (!Array.isArray(photos) || photos.length < 3 || photos.length > 4) {
    throw new PhotoInputError('Provide three or four photos')
  }

  const slots = photos.map((photo) => photo.slot)

  if (
    !['fullBodyPhoto', 'photo2', 'photo3'].every((slot) => slots.includes(slot)) ||
    new Set(slots).size !== photos.length
  ) {
    throw new PhotoInputError('A full-body photo and two other photos are required')
  }

  for (const photo of photos) {
    if (!allowedSlots.has(photo.slot) || !allowedTypes[photo.contentType]) {
      throw new PhotoInputError('Choose JPEG, PNG, or WebP photos')
    }

    if (
      !Number.isInteger(photo.size) ||
      photo.size <= 0 ||
      photo.size > 25 * 1024 * 1024
    ) {
      throw new PhotoInputError('Each photo must be 25 MB or smaller')
    }
  }

  const applicationId = randomUUID()

  const uploads = await Promise.all(
    photos.map(async (photo) => {
      const extension = allowedTypes[photo.contentType]
      const objectName = `applications/${applicationId}/${photo.slot}.${extension}`
      const policy = await createPhotoUploadUrl(
        objectName,
        photo.contentType,
      )

      return {
        slot: photo.slot,
        objectName,
        ...policy,
      }
    }),
  )

  return { applicationId, uploads }
}