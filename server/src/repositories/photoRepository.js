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

const READ_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000 - 60 * 1000

function getPhotoFile(objectName) {
  const bucketName = process.env.PHOTO_BUCKET

  if (!bucketName) {
    throw new Error('PHOTO_BUCKET is not configured')
  }

  return storage.bucket(bucketName).file(objectName)
}

export async function photoExists(objectName) {
  const [exists] = await getPhotoFile(objectName).exists()
  return exists
}

export async function createPhotoReadUrl(objectName) {
  const [url] = await getPhotoFile(objectName).getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + READ_LINK_TTL_MS,
  })

  return url
}

export function getPhotoFolderConsoleUrl(applicationId) {
  const bucketName = process.env.PHOTO_BUCKET
  return `https://console.cloud.google.com/storage/browser/${bucketName}/applications/${applicationId}`
}