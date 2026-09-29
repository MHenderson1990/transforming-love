import { Storage } from '@google-cloud/storage'

const storage = new Storage()

export async function createPhotoUploadUrl(objectName, contentType) {
  const bucketName = process.env.PHOTO_BUCKET

  if (!bucketName) {
    throw new Error('PHOTO_BUCKET is not configured')
  }

  const file = storage.bucket(bucketName).file(objectName)

  const [policy] = await file.generateSignedPostPolicyV4({
    expires: Date.now() + 15 * 60 * 1000,
    fields: {
      'Content-Type': contentType,
    },
    conditions: [
      ['eq', '$Content-Type', contentType],
      ['content-length-range', 1, 25 * 1024 * 1024],
    ],
  })

  return policy
}