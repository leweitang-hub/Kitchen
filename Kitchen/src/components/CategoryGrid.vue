<script setup>
const emit = defineEmits(['select-category'])

const categories = [
  { id: 'hood', title: '除油煙機', desc: '近吸、歐化與流線系列', image: '/images/range_hood.png', anchor: 'recommend-hood' },
  { id: 'stove', title: '瓦斯爐', desc: '檯面爐、台爐與嵌入爐', image: '/images/gas_stove.png', anchor: 'recommend-stove' },
  { id: 'dryer', title: '殺菌烘碗機', desc: '落地、吊掛與嵌門板式', image: '/images/dish_dryer.png', anchor: 'recommend-dryer' },
  { id: 'ih', title: 'IH感應爐', desc: '智慧觸控、雙口與單口爐', image: '/images/ih_stove.png', anchor: 'recommend-ih' },
  { id: 'washer', title: '洗碗機', desc: '全嵌式與半嵌式洗碗機', image: '/images/dishwasher.png', anchor: 'recommend-washer' },
  { id: 'oven', title: '烤箱與電器收納櫃', desc: '嵌入式蒸烤箱與收納櫃', image: '/images/oven_cabinet.png', anchor: 'recommend-oven' }
]

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
        <p class="section-desc">
          櫻花擁有多樣化的廚電商品，其中包含除油煙機、烘碗機、瓦斯爐、洗碗機、IH爐、烤箱等產品，致力於為國人打造最舒適的廚房空間；其中也不乏各項創新技術與國際認證，還有獨家的 SAKURA iCare 服務，永久免費送油網以及永久免費廚房健檢，讓您擁有了櫻花廚電產品後再也無後顧之憂，家中廚房永保如新。
        </p>
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
            <img :src="cat.image" :alt="cat.title" class="cat-img">
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
