const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kitchen-admin'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'kitchen-dev-token'

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD
}

export function issueToken() {
  return ADMIN_TOKEN
}

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: '未授權，請重新登入' })
  }
  next()
}
