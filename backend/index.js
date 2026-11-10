import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { fileURLToPath } from 'node:url'
import authRoutes from './routes/authRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)

function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required')
  }

  app.listen(port, () => {
    console.log(`Leafy API listening on port ${port}`)
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    start()
  } catch (error) {
    console.error('Unable to start Leafy API:', error.message)
    process.exit(1)
  }
}

export default app
