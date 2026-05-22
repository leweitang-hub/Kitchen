const TOKEN_KEY = 'kitchen_admin_token'

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || res.statusText || '請求失敗')
  }
  return data
}

export async function fetchCatalog() {
  const res = await fetch('/api/catalog')
  return parseJson(res)
}

export async function adminLogin(password) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  const data = await parseJson(res)
  setAdminToken(data.token)
  return data
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken()
  const res = await fetch(`/api/admin${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
  })
  return parseJson(res)
}

export async function adminUpload(file) {
  const form = new FormData()
  form.append('image', file)
  return adminFetch('/upload', { method: 'POST', body: form })
}
