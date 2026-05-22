import { inject, computed, unref } from 'vue'
import { defaultCatalog } from '../data/defaultCatalog.js'

/**
 * Read catalog from SiteView provide(). Handles both Ref and plain object inject.
 */
export function useCatalogInject() {
  const catalogData = inject('catalogData', null)
  const catalogRef = inject('catalog', null)
  const injected = catalogData ?? catalogRef

  return computed(() => {
    const raw = unref(injected)
    if (!raw) return defaultCatalog
    if (raw.categories || raw.site) return raw
    return defaultCatalog
  })
}
