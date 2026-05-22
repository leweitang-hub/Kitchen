<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useCatalogInject } from '../composables/useCatalogInject.js'
import { imageSrc } from '../utils/imageSrc.js'

const catalog = useCatalogInject()
const activeSection = ref('hood')
const isSticky = ref(false)
const selectedProduct = ref(null)

const menuItems = computed(() => catalog.value.menuItems)
const recommendationData = computed(() => catalog.value.recommendationData)

watch(
  menuItems,
  (items) => {
    if (items.length && !items.some((i) => i.id.replace('recommend-', '') === activeSection.value)) {
      activeSection.value = items[0].id.replace('recommend-', '')
    }
  },
  { immediate: true }
)

const handleScroll = () => {
  const navElement = document.getElementById('sticky-nav-bar')
  if (navElement) {
    isSticky.value = window.scrollY > navElement.offsetTop - 80
  }

  const scrollPosition = window.scrollY + 200
  for (const item of menuItems.value) {
    const el = document.getElementById(item.id)
    if (el) {
      const top = el.offsetTop
      const bottom = top + el.offsetHeight
      if (scrollPosition >= top && scrollPosition < bottom) {
        activeSection.value = item.id.replace('recommend-', '')
      }
    }
  }
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    const offset = el.offsetTop - 140
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
    activeSection.value = id.replace('recommend-', '')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const openProductModal = (product) => {
  selectedProduct.value = product
}

const closeModal = () => {
  selectedProduct.value = null
}
</script>

<template>
  <section class="recommendations-container-wrap">
    <!-- Sticky Scrollspy Nav -->
    <div id="sticky-nav-bar" class="sub-sticky-nav" :class="{ sticky: isSticky }">
      <div class="container nav-content">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          class="sub-nav-btn"
          :class="{ active: activeSection === item.id.replace('recommend-', '') }"
          @click="scrollToSection(item.id)"
        >
          <span class="sub-nav-icon">{{ item.icon }}</span>
          <span class="sub-nav-text">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- Recommendations Blocks -->
    <div class="recommendation-blocks">
      <section 
        v-for="(section, key) in recommendationData" 
        :key="key" 
        :id="section.id" 
        class="recommend-block" 
        :style="{ backgroundColor: section.bg }"
      >
        <div class="container">
          <div class="block-header">
            <h2 class="block-title">{{ section.title }}</h2>
            <div class="red-line"></div>
          </div>

          <div class="cards-grid">
            <div 
              v-for="(item, idx) in section.items" 
              :key="idx" 
              class="recommend-card"
              @click="openProductModal(item)"
            >
              <div class="card-img-container">
                <img :src="imageSrc(item.img)" :alt="item.name" class="card-img">
                <div class="card-hover-overlay">
                  <span class="overlay-btn">查看規格</span>
                </div>
              </div>
              <div class="card-body">
                <h3 class="card-name">{{ item.name }}</h3>
                <p class="card-tagline">{{ item.tagline }}</p>
                <div class="card-divider"></div>
                <ul class="card-bullets">
                  <li v-for="(f, fIdx) in item.features.slice(0, 2)" :key="fIdx">
                    <svg viewBox="0 0 24 24" width="16" height="16" class="bullet-check">
                      <polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ f }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Product Details Dialog/Modal (Premium UI Feature) -->
    <transition name="fade">
      <div v-if="selectedProduct" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card animate-fade-in">
          <button class="modal-close" @click="closeModal" aria-label="關閉">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="modal-grid">
            <div class="modal-image-area">
              <img :src="imageSrc(selectedProduct.img)" :alt="selectedProduct.name" class="modal-img">
            </div>
            <div class="modal-info-area">
              <span class="modal-tag">推薦商品系列</span>
              <h2 class="modal-title">{{ selectedProduct.name }}</h2>
              <p class="modal-tagline">{{ selectedProduct.tagline }}</p>
              
              <div class="modal-divider"></div>
              
              <h4 class="modal-subtitle">系列概述</h4>
              <p class="modal-desc">{{ selectedProduct.spec }}</p>
              
              <h4 class="modal-subtitle">獨特核心技術</h4>
              <ul class="modal-features">
                <li v-for="(f, index) in selectedProduct.features" :key="index">
                  <span class="feat-num">0{{ index + 1 }}</span>
                  <span class="feat-txt">{{ f }}</span>
                </li>
              </ul>

              <div class="modal-actions">
                <button class="btn btn-primary" @click="closeModal">了解更多產品</button>
                <button class="btn btn-secondary" @click="alert('我們已收到您的諮詢，客服將儘速聯絡您！')">預約門市諮詢</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
/* Sticky sub nav */
.sub-sticky-nav {
  background-color: var(--light);
  border-bottom: 1px solid var(--gray-200);
  z-index: 90;
  transition: var(--transition-normal);
}

.sub-sticky-nav.sticky {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  box-shadow: var(--shadow-sm);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav-content {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  overflow-x: auto;
  gap: 16px;
}

.sub-nav-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 30px;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.sub-nav-btn:hover {
  color: var(--primary);
  background-color: var(--primary-light);
}

.sub-nav-btn.active {
  color: var(--light);
  background-color: var(--primary);
  box-shadow: 0 4px 12px rgba(201, 21, 30, 0.25);
}

.sub-nav-icon {
  font-size: 1.1rem;
}

/* Blocks */
.recommend-block {
  padding: 100px 0;
  transition: var(--transition-slow);
}

.block-header {
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.block-title {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.red-line {
  width: 40px;
  height: 3px;
  background-color: var(--primary);
  border-radius: 1.5px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.recommend-card {
  background-color: var(--light);
  border-radius: 16px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: var(--transition-slow);
  display: flex;
  flex-direction: column;
}

.card-img-container {
  height: 240px;
  position: relative;
  background-color: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.card-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  transition: var(--transition-slow);
}

.card-hover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(21, 21, 21, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-normal);
  backdrop-filter: blur(4px);
}

.overlay-btn {
  background-color: var(--light);
  color: var(--dark);
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: var(--shadow-md);
  transform: translateY(10px);
  transition: var(--transition-normal);
}

.recommend-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(201, 21, 30, 0.2);
}

.recommend-card:hover .card-img {
  transform: scale(1.08);
}

.recommend-card:hover .card-hover-overlay {
  opacity: 1;
}

.recommend-card:hover .overlay-btn {
  transform: translateY(0);
}

.card-body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 4px;
}

.card-tagline {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 16px;
}

.card-divider {
  height: 1px;
  background-color: var(--gray-200);
  margin-bottom: 16px;
}

.card-bullets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-bullets li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--gray-800);
}

.bullet-check {
  color: var(--primary);
  flex-shrink: 0;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(21, 21, 21, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  background-color: var(--light);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--gray-100);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-main);
  transition: var(--transition-fast);
  z-index: 10;
}

.modal-close:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .modal-grid {
    grid-template-columns: 1.1fr 1.3fr;
    overflow-y: hidden;
  }
}

.modal-image-area {
  background-color: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.modal-img {
  max-width: 85%;
  max-height: 350px;
  object-fit: contain;
}

.modal-info-area {
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.modal-tagline {
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 20px;
}

.modal-divider {
  height: 1px;
  background-color: var(--gray-200);
  margin-bottom: 20px;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.modal-desc {
  font-size: 0.95rem;
  color: var(--gray-800);
  line-height: 1.7;
  margin-bottom: 24px;
}

.modal-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.modal-features li {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feat-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  background-color: var(--primary-light);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feat-txt {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--dark);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.modal-actions button {
  flex: 1;
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
