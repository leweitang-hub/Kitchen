<script setup>
import { provide, computed } from 'vue'
import Header from '../components/Header.vue'
import HeroBanner from '../components/HeroBanner.vue'
import CategoryGrid from '../components/CategoryGrid.vue'
import RecommendationSection from '../components/RecommendationSection.vue'
import ICareSection from '../components/ICareSection.vue'
import Footer from '../components/Footer.vue'
import { useCatalog } from '../composables/useCatalog.js'
import { defaultCatalog } from '../data/defaultCatalog.js'

const { catalog, loading, error } = useCatalog()
const catalogData = computed(() => catalog.value ?? defaultCatalog)

provide('catalog', catalog)
provide('catalogData', catalogData)
provide('catalogLoading', loading)
provide('catalogError', error)

const handleCategorySelect = (anchorId) => {
  const el = document.getElementById(anchorId)
  if (el) {
    const offset = el.offsetTop - 140
    window.scrollTo({ top: offset, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="app-layout">
    <Header />
    <main class="main-content">
      <p v-if="catalogError" class="catalog-banner warn">
        無法連線後端，顯示預設內容。請執行 <code>npm run dev:all</code>
      </p>
      <HeroBanner />
      <CategoryGrid @select-category="handleCategorySelect" />
      <RecommendationSection />
      <ICareSection />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.catalog-banner {
  text-align: center;
  padding: 10px 16px;
  font-size: 0.85rem;
  background: #fff8e6;
  color: #856404;
}

.catalog-banner code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
