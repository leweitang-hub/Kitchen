/**
 * Resolve image URL for <img src>. Prefers .png when path was stored as .svg
 * but matching PNG exists in public/images (project convention).
 */
export function imageSrc(path) {
  if (!path) return ''
  if (typeof path !== 'string') return ''

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  let url = path.startsWith('/') ? path : `/${path}`

  if (url.endsWith('.svg')) {
    url = url.replace(/\.svg$/, '.png')
  }

  if (base === '/') return url
  return `${base.replace(/\/$/, '')}${url}`
}
