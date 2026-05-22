import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getDb, getSiteSettings, buildCatalog } from '../db.js'
import { verifyPassword, issueToken, requireAdmin } from '../auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '..', '..', 'public', 'images')

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, imagesDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png'
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40)
    cb(null, `${base}-${Date.now()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('僅支援圖片檔案'))
  },
})

const router = Router()

router.post('/login', (req, res) => {
  const { password } = req.body || {}
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: '密碼錯誤' })
  }
  res.json({ token: issueToken() })
})

router.use(requireAdmin)

router.get('/catalog', (_req, res) => {
  const db = getDb()
  const site = getSiteSettings(db)
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all()
  const products = db.prepare('SELECT * FROM products ORDER BY category_slug, sort_order ASC').all()
  res.json({
    site,
    categories: categories.map((c) => ({
      ...c,
      items: products
        .filter((p) => p.category_slug === c.slug)
        .map((p) => ({
          ...p,
          features: JSON.parse(p.features || '[]'),
        })),
    })),
  })
})

router.put('/site', (req, res) => {
  const db = getDb()
  const allowed = ['hero_image', 'hero_title', 'hero_subtitle', 'category_intro']
  const upsert = db.prepare(`
    INSERT INTO site_settings (key, value) VALUES (@key, @value)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `)
  const update = db.transaction((body) => {
    for (const key of allowed) {
      if (body[key] !== undefined) {
        upsert.run({ key, value: String(body[key]) })
      }
    }
  })
  update(req.body || {})
  res.json({ site: getSiteSettings(db) })
})

router.put('/categories/:slug', (req, res) => {
  const db = getDb()
  const { slug } = req.params
  const body = req.body || {}
  const fields = [
    'title',
    'desc',
    'image_path',
    'anchor',
    'icon',
    'sort_order',
    'section_title',
    'section_bg',
  ]
  const sets = []
  const params = { slug }
  for (const f of fields) {
    if (body[f] !== undefined) {
      sets.push(`${f} = @${f}`)
      params[f] = body[f]
    }
  }
  if (!sets.length) return res.status(400).json({ error: '無可更新欄位' })
  const result = db
    .prepare(`UPDATE categories SET ${sets.join(', ')} WHERE slug = @slug`)
    .run(params)
  if (result.changes === 0) return res.status(404).json({ error: '分類不存在' })
  res.json(buildCatalog())
})

router.post('/categories/:slug/products', (req, res) => {
  const db = getDb()
  const { slug } = req.params
  const exists = db.prepare('SELECT 1 FROM categories WHERE slug = ?').get(slug)
  if (!exists) return res.status(404).json({ error: '分類不存在' })

  const body = req.body || {}
  const maxOrder = db
    .prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM products WHERE category_slug = ?')
    .get(slug).m

  const result = db
    .prepare(`
      INSERT INTO products (category_slug, name, tagline, image_path, spec, features, sort_order)
      VALUES (@category_slug, @name, @tagline, @image_path, @spec, @features, @sort_order)
    `)
    .run({
      category_slug: slug,
      name: body.name || '新系列',
      tagline: body.tagline || '',
      image_path: body.image_path || '/images/placeholder.png',
      spec: body.spec || '',
      features: JSON.stringify(body.features || []),
      sort_order: body.sort_order ?? maxOrder + 1,
    })

  res.status(201).json({ id: result.lastInsertRowid, catalog: buildCatalog() })
})

router.put('/products/:id', (req, res) => {
  const db = getDb()
  const id = Number(req.params.id)
  const body = req.body || {}
  const fields = ['name', 'tagline', 'image_path', 'spec', 'sort_order', 'category_slug']
  const sets = []
  const params = { id }
  for (const f of fields) {
    if (body[f] !== undefined) {
      sets.push(`${f} = @${f}`)
      params[f] = body[f]
    }
  }
  if (body.features !== undefined) {
    sets.push('features = @features')
    params.features = JSON.stringify(body.features)
  }
  if (!sets.length) return res.status(400).json({ error: '無可更新欄位' })
  const result = db
    .prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = @id`)
    .run(params)
  if (result.changes === 0) return res.status(404).json({ error: '產品不存在' })
  res.json(buildCatalog())
})

router.delete('/products/:id', (req, res) => {
  const db = getDb()
  const id = Number(req.params.id)
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id)
  if (result.changes === 0) return res.status(404).json({ error: '產品不存在' })
  res.json(buildCatalog())
})

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '請選擇圖片' })
  const url = `/images/${req.file.filename}`
  res.json({ url })
})

router.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || '上傳失敗' })
})

export default router
