import { Resend } from 'resend'

let resend

const slotLabels = {
  fullBodyPhoto: 'Full-body photo',
  photo2: 'Photo 2',
  photo3: 'Photo 3',
  photo4: 'Photo 4',
}

function getClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  resend ??= new Resend(process.env.RESEND_API_KEY)
  return resend
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function sendApplicationEmail(application) {
  const {
    applicationId,
    name,
    age,
    location,
    email,
    phone,
    social,
    photos,
    photoFolderUrl,
  } = application

  const fields = [
    ['Name', name],
    ['Age', age],
    ['Location', location],
    ['Email', email],
    ['Phone', phone],
    ['Social media', social || '—'],
    ['Application ID', applicationId],
  ]

  const fieldRows = fields
    .map(
      ([label, value]) => `
      <tr>
        <td style="vertical-align:top;padding:6px 12px 6px 0"><strong>${label}</strong></td>
        <td style="padding:6px 0;white-space:pre-line">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join('')

  const photoCells = photos
    .map(
      ({ slot, url }) => `
      <td style="vertical-align:top;padding:0 12px 12px 0;text-align:center">
        <a href="${escapeHtml(url)}">
          <img src="${escapeHtml(url)}" alt="${slotLabels[slot] ?? slot}" width="160"
            style="display:block;width:160px;height:auto;border-radius:8px;border:1px solid #ddd" />
        </a>
        <div style="margin-top:6px;font-size:13px">
          <a href="${escapeHtml(url)}">${slotLabels[slot] ?? slot}</a>
        </div>
      </td>`,
    )
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111;font-size:15px">
      <h2 style="margin:0 0 12px">New Transforming Love bachelor application</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">${fieldRows}</table>

      <h3 style="margin:24px 0 12px">Photos</h3>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>${photoCells}</tr></table>
      <p style="margin:4px 0 0;font-size:13px;color:#555">
        Photo links expire in 7 days. After that, open the
        <a href="${escapeHtml(photoFolderUrl)}">applicant's folder in Cloud Storage</a>.
      </p>
    </div>
  `

  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Photos (links expire in 7 days):',
    ...photos.map(({ slot, url }) => `${slotLabels[slot] ?? slot}: ${url}`),
    '',
    `Cloud Storage folder: ${photoFolderUrl}`,
  ].join('\n')

  const { error } = await getClient().emails.send({
    from: process.env.APPLICATION_FROM,
    to: process.env.APPLICATION_INBOX,
    replyTo: email,
    subject: `New bachelor application: ${name}`,
    html,
    text,
  })

  if (error) {
    throw new Error(`Email failed: ${error.message}`)
  }
}