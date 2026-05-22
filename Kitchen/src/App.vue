<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import HeroBanner from './components/HeroBanner.vue'
import CategoryGrid from './components/CategoryGrid.vue'
import RecommendationSection from './components/RecommendationSection.vue'
import ICareSection from './components/ICareSection.vue'
import Footer from './components/Footer.vue'

const recommendRef = ref(null)

const handleCategorySelect = (anchorId) => {
  const el = document.getElementById(anchorId)
  if (el) {
    // Offset for the sticky headers
    const offset = el.offsetTop - 140
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
  }
}
</script>

<template>
  <div class="app-layout">
    <!-- Header Navigation -->
    <Header />

    <main class="main-content">
      <!-- Hero Banner & Breadcrumbs -->
      <HeroBanner />

      <!-- Categories Catalog -->
      <CategoryGrid @select-category="handleCategorySelect" />

      <!-- Sticky Scrollspy Products Recommendations -->
      <RecommendationSection ref="recommendRef" />

      <!-- SAKURA iCare Reservation Section -->
      <ICareSection />
    </main>

    <!-- Footer Links & Back to Top -->
    <Footer />
  </div>
</template>

<style>
/* Reset local App.vue scoping to make it a clean full-width shell */
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
</style>
