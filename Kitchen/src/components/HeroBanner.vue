<script setup>
import { computed } from 'vue'
import { useCatalogInject } from '../composables/useCatalogInject.js'
import { imageSrc } from '../utils/imageSrc.js'

const catalog = useCatalogInject()
const site = computed(() => catalog.value.site)
const heroImage = computed(() => imageSrc(site.value.hero_image))
</script>

<template>
  <section class="hero-banner">
    <!-- Ken Burns zoom image effect -->
    <div class="banner-image-container">
      <img :src="heroImage" alt="櫻花奢華廚房電器" class="banner-img">
      <div class="banner-overlay"></div>
    </div>

    <!-- Content Card -->
    <div class="banner-content container">
      <div class="glass-card animate-fade-in">
        <span class="sub-tag">SAKURA KITCHEN APPLIANCES</span>
        <h1 class="main-title">{{ site.hero_title }}</h1>
        <p class="desc">{{ site.hero_subtitle }}</p>
        <a href="#category-grid" class="scroll-btn">
          <span>探索產品類別</span>
          <svg class="bounce-arrow" viewBox="0 0 24 24" width="20" height="20">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Breadcrumbs Section -->
    <div class="breadcrumbs-bar">
      <div class="container">
        <ol class="breadcrumbs">
          <li><a href="/">首頁</a></li>
          <li><span class="separator">/</span></li>
          <li class="active">廚房電器</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  position: relative;
  width: 100%;
  height: 520px;
  margin-top: var(--header-height);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.banner-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ken-burns 15s ease-out infinite alternate;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.2) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: 40px;
}

.glass-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 32px 40px;
  max-width: 550px;
  color: var(--light);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.sub-tag {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--primary-light);
  background-color: rgba(201, 21, 30, 0.85);
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 16px;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--light);
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

.desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
  line-height: 1.6;
}

.scroll-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--light);
  background-color: var(--primary);
  padding: 10px 24px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(201, 21, 30, 0.4);
  transition: var(--transition-normal);
}

.scroll-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(201, 21, 30, 0.6);
}

.bounce-arrow {
  animation: bounce 1.5s infinite;
}

/* Breadcrumbs */
.breadcrumbs-bar {
  position: relative;
  z-index: 2;
  background-color: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid var(--gray-200);
  border-bottom: 1px solid var(--gray-200);
  padding: 12px 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.breadcrumbs li {
  display: flex;
  align-items: center;
}

.breadcrumbs a {
  color: var(--gray-600);
  transition: var(--transition-fast);
}

.breadcrumbs a:hover {
  color: var(--primary);
}

.separator {
  margin: 0 10px;
  color: var(--gray-400);
}

.breadcrumbs .active {
  color: var(--dark);
  font-weight: 500;
}

/* Animations */
@keyframes ken-burns {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}

/* Responsive layout */
@media (max-width: 768px) {
  .hero-banner {
    height: 400px;
  }
  .glass-card {
    padding: 24px;
    margin: 0 16px;
  }
  .main-title {
    font-size: 2rem;
  }
  .desc {
    font-size: 1rem;
  }
}
</style>
