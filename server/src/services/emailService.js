import { Resend } from 'resend'

let resend

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
  const { applicationId, name, age, location, email, phone, social, photoPaths } = application

  const fields = [
    ['Name', name],
    ['Age', age],
    ['Location', location],
    ['Email', email],
    ['Phone', phone],
    ['Social media', social || '—'],
    ['Application ID', applicationId],
    ['Photos', photoPaths.join('\n')],
  ]

  const html = `
    <h2>New Transforming Love bachelor application</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${fields
        .map(
          ([label, value]) => `
        <tr>
          <td style="vertical-align:top"><strong>${label}</strong></td>
          <td style="white-space:pre-line">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join('')}
    </table>
  `

  const text = fields.map(([label, value]) => `${label}: ${value}`).join('\n')

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