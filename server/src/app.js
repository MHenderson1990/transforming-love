import express from 'express'
import cors from 'cors'
import photoRoutes from './routes/photoRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'

const app = express()
const port = process.env.PORT || 8080

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.set('trust proxy', true)
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '50kb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/photos', photoRoutes)
app.use('/api/applications', applicationRoutes)

app.listen(port, () => {
  console.log(`Upload service running on port ${port}`)
})