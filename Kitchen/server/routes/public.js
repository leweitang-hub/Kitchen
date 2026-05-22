import { Router } from 'express'
import { buildCatalog } from '../db.js'

const router = Router()

router.get('/catalog', (_req, res) => {
  res.json(buildCatalog())
})

export default router
