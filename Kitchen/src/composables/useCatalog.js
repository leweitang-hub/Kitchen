import { ref, shallowRef, onMounted } from 'vue'
import { fetchCatalog } from '../api/client.js'
import { defaultCatalog } from '../data/defaultCatalog.js'

const catalog = shallowRef(null)
const loading = ref(false)
const error = ref(null)
let loadPromise = null

export function useCatalog() {
  const load = async (force = false) => {
    if (catalog.value && !force) return catalog.value
    if (loadPromise && !force) return loadPromise

    loading.value = true
    error.value = null
    loadPromise = fetchCatalog()
      .then((data) => {
        catalog.value = data
        return data
      })
      .catch((err) => {
        error.value = err.message
        if (!catalog.value) catalog.value = defaultCatalog
        return catalog.value
      })
      .finally(() => {
        loading.value = false
        loadPromise = null
      })

    return loadPromise
  }

  onMounted(() => {
    if (!catalog.value) load()
  })

  return { catalog, loading, error, load, reload: () => load(true) }
}
