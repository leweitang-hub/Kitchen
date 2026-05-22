import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb } from './db.js'
import publicRoutes from './routes/public.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 3001
const publicDir = path.join(__dirname, '..', 'public')

getDb()

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use('/images', express.static(path.join(publicDir, 'images')))
app.use('/api', publicRoutes)
app.use('/api/admin', adminRoutes)

if (process.env.NODE_ENV === 'production') {
  const distDir = path.join(__dirname, '..', 'dist')
  app.use(express.static(distDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Kitchen API http://localhost:${PORT}`)
})
