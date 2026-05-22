import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defaultCategories, defaultSite, imagePathMigrations } from './seed-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'kitchen.db')

let db

export function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
    seedIfEmpty(db)
    migrateImagePathsToPng(db)
  }
  return db
}

/** Point stored paths at PNG files in public/images */
function migrateImagePathsToPng(database) {
  const updateCategory = database.prepare(
    'UPDATE categories SET image_path = @to WHERE image_path = @from'
  )
  const updateProduct = database.prepare(
    'UPDATE products SET image_path = @to WHERE image_path = @from'
  )
  const updateSite = database.prepare(
    "UPDATE site_settings SET value = @to WHERE key = 'hero_image' AND value = @from"
  )
  const run = database.transaction(() => {
    for (const [from, to] of imagePathMigrations) {
      updateCategory.run({ from, to })
      updateProduct.run({ from, to })
      updateSite.run({ from, to })
    }
  })
  run()
}

function initSchema(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      desc TEXT NOT NULL DEFAULT '',
      image_path TEXT NOT NULL DEFAULT '',
      anchor TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      section_title TEXT NOT NULL DEFAULT '',
      section_bg TEXT NOT NULL DEFAULT 'var(--light)'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_slug TEXT NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL DEFAULT '',
      image_path TEXT NOT NULL DEFAULT '',
      spec TEXT NOT NULL DEFAULT '',
      features TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `)
}

function seedIfEmpty(database) {
  const count = database.prepare('SELECT COUNT(*) AS n FROM categories').get().n
  if (count > 0) return

  const insertSite = database.prepare(
    'INSERT INTO site_settings (key, value) VALUES (@key, @value)'
  )
  for (const [key, value] of Object.entries(defaultSite)) {
    insertSite.run({ key, value })
  }

  const insertCategory = database.prepare(`
    INSERT INTO categories (slug, title, desc, image_path, anchor, icon, sort_order, section_title, section_bg)
    VALUES (@slug, @title, @desc, @image_path, @anchor, @icon, @sort_order, @section_title, @section_bg)
  `)

  const insertProduct = database.prepare(`
    INSERT INTO products (category_slug, name, tagline, image_path, spec, features, sort_order)
    VALUES (@category_slug, @name, @tagline, @image_path, @spec, @features, @sort_order)
  `)

  const seedAll = database.transaction((categories) => {
    categories.forEach((cat, catIndex) => {
      insertCategory.run({
        slug: cat.slug,
        title: cat.title,
        desc: cat.desc,
        image_path: cat.image_path,
        anchor: cat.anchor,
        icon: cat.icon,
        sort_order: cat.sort_order ?? catIndex,
        section_title: cat.section_title,
        section_bg: cat.section_bg,
      })
      cat.items.forEach((item, itemIndex) => {
        insertProduct.run({
          category_slug: cat.slug,
          name: item.name,
          tagline: item.tagline,
          image_path: item.image_path,
          spec: item.spec,
          features: JSON.stringify(item.features || []),
          sort_order: itemIndex,
        })
      })
    })
  })

  seedAll(defaultCategories)
}

export function getSiteSettings(database = getDb()) {
  const rows = database.prepare('SELECT key, value FROM site_settings').all()
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
}

export function buildCatalog(database = getDb()) {
  const site = getSiteSettings(database)
  const categories = database
    .prepare('SELECT * FROM categories ORDER BY sort_order ASC, slug ASC')
    .all()

  const productsByCategory = database
    .prepare('SELECT * FROM products ORDER BY sort_order ASC, id ASC')
    .all()
    .reduce((acc, row) => {
      if (!acc[row.category_slug]) acc[row.category_slug] = []
      acc[row.category_slug].push({
        id: row.id,
        name: row.name,
        tagline: row.tagline,
        img: row.image_path,
        spec: row.spec,
        features: JSON.parse(row.features || '[]'),
      })
      return acc
    }, {})

  const categoryList = categories.map((c) => ({
    id: c.slug,
    title: c.title,
    desc: c.desc,
    image: c.image_path,
    anchor: c.anchor,
    icon: c.icon,
  }))

  const menuItems = categories.map((c) => ({
    id: c.anchor,
    label: c.title,
    icon: c.icon,
  }))

  const recommendationData = {}
  for (const c of categories) {
    recommendationData[c.slug] = {
      id: c.anchor,
      title: c.section_title,
      bg: c.section_bg,
      items: productsByCategory[c.slug] || [],
    }
  }

  return { site, categories: categoryList, menuItems, recommendationData }
}
