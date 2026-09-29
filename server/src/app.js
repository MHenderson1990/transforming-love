import express from 'express'
import cors from 'cors'
import photoRoutes from './routes/photoRoutes.js'

const app = express()
const port = process.env.PORT || 8080

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/photos', photoRoutes)

app.listen(port, () => {
  console.log(`Upload service running on port ${port}`)
})