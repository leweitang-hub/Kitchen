<script setup>
import { computed } from 'vue'
import { useCatalogInject } from '../composables/useCatalogInject.js'
import { imageSrc } from '../utils/imageSrc.js'

const emit = defineEmits(['select-category'])
const catalog = useCatalogInject()

const categories = computed(() => catalog.value.categories)
const categoryIntro = computed(() => catalog.value.site?.category_intro ?? '')

const handleCategoryClick = (anchor) => {
  emit('select-category', anchor)
}
</script>

<template>
  <section id="category-grid" class="category-grid-section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-intro">
        <h2 class="section-title">廚房電器產品</h2>
        <div class="title-underline"></div>
        <p class="section-desc">{{ categoryIntro }}</p>
      </div>

      <!-- Categories Grid -->
      <div class="grid-layout">
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="category-card"
          @click="handleCategoryClick(cat.anchor)"
        >
          <div class="card-image-wrap">
            <img :src="imageSrc(cat.image)" :alt="cat.title" class="cat-img">
          </div>
          <div class="card-info">
            <h3 class="cat-title">{{ cat.title }}</h3>
            <p class="cat-desc">{{ cat.desc }}</p>
            <span class="explore-link">
              推薦系列
              <svg viewBox="0 0 24 24" width="16" height="16" class="link-arrow">
                <path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-grid-section {
  padding: 80px 0;
  background-color: var(--light);
}

.section-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.title-underline {
  width: 60px;
  height: 4px;
  background-color: var(--primary);
  border-radius: 2px;
  margin-bottom: 24px;
}

.section-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
}

/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
}

@media (min-width: 576px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .grid-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Card Styling */
.category-card {
  background: var(--light);
  border-radius: 20px;
  border: 1px solid var(--gray-200);
  padding: 30px;
  cursor: pointer;
  transition: var(--transition-slow);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.category-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 2px solid var(--primary);
  opacity: 0;
  transition: var(--transition-normal);
  z-index: 2;
  pointer-events: none;
}

.card-image-wrap {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: var(--gray-100);
  border-radius: 50%;
  padding: 20px;
  transition: var(--transition-normal);
  overflow: hidden;
}

.cat-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: var(--transition-slow);
}

.card-info {
  width: 100%;
}

.cat-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  transition: var(--transition-fast);
}

.cat-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 16px;
  min-height: 20px;
}

.explore-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: var(--transition-fast);
}

.link-arrow {
  transition: transform 0.3s ease;
}

/* Hover States */
.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.category-card:hover::after {
  opacity: 0.15;
}

.category-card:hover .card-image-wrap {
  background-color: var(--primary-light);
  transform: scale(1.03);
}

.category-card:hover .cat-img {
  transform: scale(1.1);
}

.category-card:hover .cat-title {
  color: var(--primary);
}

.category-card:hover .explore-link {
  letter-spacing: 0.5px;
}

.category-card:hover .link-arrow {
  transform: translateX(4px);
}
</style>
