<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getAdminToken,
  clearAdminToken,
  adminLogin,
  adminFetch,
  adminUpload,
} from '../api/client.js'
import { imageSrc } from '../utils/imageSrc.js'

const loggedIn = ref(!!getAdminToken())
const password = ref('')
const loginError = ref('')
const message = ref('')
const saving = ref(false)
const activeTab = ref('site')
const selectedSlug = ref('hood')

const site = ref({})
const categories = ref([])

const selectedCategory = computed(() =>
  categories.value.find((c) => c.slug === selectedSlug.value)
)

const loadAdmin = async () => {
  const data = await adminFetch('/catalog')
  site.value = { ...data.site }
  categories.value = data.categories.map((c) => ({
    ...c,
    items: c.items.map((p) => ({ ...p, featuresText: (p.features || []).join('\n') })),
  }))
  if (!categories.value.find((c) => c.slug === selectedSlug.value)) {
    selectedSlug.value = categories.value[0]?.slug ?? ''
  }
}

const login = async () => {
  loginError.value = ''
  try {
    await adminLogin(password.value)
    loggedIn.value = true
    password.value = ''
    await loadAdmin()
  } catch (e) {
    loginError.value = e.message
  }
}

const logout = () => {
  clearAdminToken()
  loggedIn.value = false
}

const notify = (text, isError = false) => {
  message.value = text
  setTimeout(() => {
    if (message.value === text) message.value = ''
  }, isError ? 5000 : 3000)
}

const saveSite = async () => {
  saving.value = true
  try {
    const res = await adminFetch('/site', { method: 'PUT', body: JSON.stringify(site.value) })
    site.value = res.site
    notify('網站設定已儲存')
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
  }
}

const saveCategory = async (cat) => {
  saving.value = true
  try {
    await adminFetch(`/categories/${cat.slug}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: cat.title,
        desc: cat.desc,
        image_path: cat.image_path,
        icon: cat.icon,
        section_title: cat.section_title,
        section_bg: cat.section_bg,
      }),
    })
    notify(`已更新分類：${cat.title}`)
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
  }
}

const saveProduct = async (product) => {
  saving.value = true
  try {
    const features = product.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    await adminFetch(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: product.name,
        tagline: product.tagline,
        image_path: product.image_path,
        spec: product.spec,
        features,
      }),
    })
    notify(`已更新：${product.name}`)
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
  }
}

const addProduct = async () => {
  const cat = selectedCategory.value
  if (!cat) return
  saving.value = true
  try {
    const res = await adminFetch(`/categories/${cat.slug}/products`, {
      method: 'POST',
      body: JSON.stringify({
        name: '新推薦系列',
        image_path: cat.image_path,
      }),
    })
    await loadAdmin()
    notify('已新增推薦系列')
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (product) => {
  if (!confirm(`確定刪除「${product.name}」？`)) return
  saving.value = true
  try {
    await adminFetch(`/products/${product.id}`, { method: 'DELETE' })
    await loadAdmin()
    notify('已刪除')
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
  }
}

const uploadFor = async (event, target, field = 'image_path') => {
  const file = event.target.files?.[0]
  if (!file) return
  saving.value = true
  try {
    const { url } = await adminUpload(file)
    target[field] = url
    notify('圖片上傳成功')
  } catch (e) {
    notify(e.message, true)
  } finally {
    saving.value = false
    event.target.value = ''
  }
}

onMounted(async () => {
  if (loggedIn.value) {
    try {
      await loadAdmin()
    } catch {
      logout()
    }
  }
})
</script>

<template>
  <div class="admin-page">
    <header class="admin-header">
      <div class="admin-header-inner">
        <h1>櫻花廚電 · 內容管理</h1>
        <div class="admin-header-actions">
          <RouterLink to="/" class="link-front">← 返回前台</RouterLink>
          <button v-if="loggedIn" type="button" class="btn-logout" @click="logout">登出</button>
        </div>
      </div>
    </header>

    <div v-if="message" class="toast">{{ message }}</div>

    <section v-if="!loggedIn" class="admin-login container-narrow">
      <form class="login-card" @submit.prevent="login">
        <h2>管理員登入</h2>
        <p class="hint">預設密碼見 <code>.env</code> 的 <code>ADMIN_PASSWORD</code></p>
        <label>
          密碼
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>
        <p v-if="loginError" class="error">{{ loginError }}</p>
        <button type="submit" class="btn-primary">登入</button>
      </form>
    </section>

    <div v-else class="admin-body container-wide">
      <nav class="admin-tabs">
        <button type="button" :class="{ active: activeTab === 'site' }" @click="activeTab = 'site'">
          網站 / Hero
        </button>
        <button
          type="button"
          :class="{ active: activeTab === 'categories' }"
          @click="activeTab = 'categories'"
        >
          產品分類
        </button>
        <button
          type="button"
          :class="{ active: activeTab === 'products' }"
          @click="activeTab = 'products'"
        >
          推薦系列
        </button>
      </nav>

      <!-- Site settings -->
      <section v-show="activeTab === 'site'" class="panel">
        <h2>首頁與分類區文案</h2>
        <div class="form-grid">
          <label class="full">
            Hero 主圖
            <div class="img-row">
              <img :src="imageSrc(site.hero_image)" alt="" class="thumb" />
              <input v-model="site.hero_image" type="text" />
              <label class="btn-upload">
                上傳
                <input type="file" accept="image/*" hidden @change="uploadFor($event, site, 'hero_image')" />
              </label>
            </div>
          </label>
          <label>
            Hero 標題
            <input v-model="site.hero_title" type="text" />
          </label>
          <label>
            Hero 副標
            <input v-model="site.hero_subtitle" type="text" />
          </label>
          <label class="full">
            分類區介紹
            <textarea v-model="site.category_intro" rows="4" />
          </label>
        </div>
        <button type="button" class="btn-primary" :disabled="saving" @click="saveSite">儲存網站設定</button>
      </section>

      <!-- Categories -->
      <section v-show="activeTab === 'categories'" class="panel">
        <h2>六大產品分類（卡片）</h2>
        <div v-for="cat in categories" :key="cat.slug" class="edit-card">
          <h3>{{ cat.slug }}</h3>
          <div class="form-grid">
            <label>
              名稱
              <input v-model="cat.title" type="text" />
            </label>
            <label>
              圖示
              <input v-model="cat.icon" type="text" />
            </label>
            <label class="full">
              簡述
              <input v-model="cat.desc" type="text" />
            </label>
            <label class="full">
              分類圖片
              <div class="img-row">
                <img :src="imageSrc(cat.image_path)" alt="" class="thumb" />
                <input v-model="cat.image_path" type="text" />
                <label class="btn-upload">
                  上傳
                  <input type="file" accept="image/*" hidden @change="uploadFor($event, cat)" />
                </label>
              </div>
            </label>
            <label>
              推薦區標題
              <input v-model="cat.section_title" type="text" />
            </label>
            <label>
              區塊背景
              <input v-model="cat.section_bg" type="text" placeholder="var(--light)" />
            </label>
          </div>
          <button type="button" class="btn-secondary" :disabled="saving" @click="saveCategory(cat)">
            儲存此分類
          </button>
        </div>
      </section>

      <!-- Products -->
      <section v-show="activeTab === 'products'" class="panel">
        <div class="panel-head">
          <h2>推薦系列商品</h2>
          <select v-model="selectedSlug" class="cat-select">
            <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
              {{ cat.title }}
            </option>
          </select>
          <button type="button" class="btn-secondary" :disabled="saving" @click="addProduct">
            + 新增系列
          </button>
        </div>

        <div v-if="selectedCategory" class="product-list">
          <article v-for="p in selectedCategory.items" :key="p.id" class="edit-card">
            <div class="form-grid">
              <label>
                系列名稱
                <input v-model="p.name" type="text" />
              </label>
              <label>
                標語
                <input v-model="p.tagline" type="text" />
              </label>
              <label class="full">
                圖片
                <div class="img-row">
                  <img :src="imageSrc(p.image_path)" alt="" class="thumb" />
                  <input v-model="p.image_path" type="text" />
                  <label class="btn-upload">
                    上傳
                    <input type="file" accept="image/*" hidden @change="uploadFor($event, p)" />
                  </label>
                </div>
              </label>
              <label class="full">
                概述
                <textarea v-model="p.spec" rows="3" />
              </label>
              <label class="full">
                特色（每行一項）
                <textarea v-model="p.featuresText" rows="4" />
              </label>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-primary" :disabled="saving" @click="saveProduct(p)">
                儲存
              </button>
              <button type="button" class="btn-danger" :disabled="saving" @click="deleteProduct(p)">
                刪除
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: var(--gray-100);
  color: var(--text-main);
}

.admin-header {
  background: var(--dark);
  color: var(--light);
  padding: 16px 24px;
}

.admin-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.admin-header h1 {
  font-size: 1.25rem;
  font-weight: 700;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.link-front {
  color: #fff;
  opacity: 0.9;
  font-size: 0.9rem;
}

.link-front:hover {
  color: var(--primary-light);
}

.btn-logout {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.container-narrow {
  max-width: 420px;
  margin: 48px auto;
  padding: 0 20px;
}

.container-wide {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

.login-card {
  background: var(--light);
  padding: 32px;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card h2 {
  font-size: 1.35rem;
}

.hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.hint code {
  background: var(--gray-100);
  padding: 2px 6px;
  border-radius: 4px;
}

.login-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
}

.login-card input {
  padding: 10px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font: inherit;
}

.error {
  color: var(--primary);
  font-size: 0.9rem;
}

.toast {
  position: fixed;
  top: 72px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: var(--light);
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 2000;
  font-size: 0.9rem;
}

.admin-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.admin-tabs button {
  padding: 10px 18px;
  border: none;
  background: var(--light);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-muted);
}

.admin-tabs button.active {
  background: var(--primary);
  color: var(--light);
}

.panel {
  background: var(--light);
  border-radius: 16px;
  padding: 28px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}

.panel h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.panel-head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.panel-head h2 {
  margin: 0;
  flex: 1;
}

.cat-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--gray-300);
  font: inherit;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.form-grid label.full {
  grid-column: 1 / -1;
}

.form-grid input,
.form-grid textarea {
  font: inherit;
  padding: 8px 10px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
}

.img-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.thumb {
  width: 56px;
  height: 56px;
  object-fit: contain;
  background: var(--gray-100);
  border-radius: 8px;
}

.img-row input {
  flex: 1;
  min-width: 160px;
}

.btn-upload {
  padding: 8px 14px;
  background: var(--gray-200);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
}

.edit-card {
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.edit-card h3 {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  background: var(--primary);
  color: var(--light);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--gray-800);
  color: var(--light);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
