<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <footer class="footer">
    <div class="footer-top container">
      <!-- Nav columns -->
      <div class="footer-links-grid">
        <div class="footer-col">
          <h4 class="col-title">相關網站</h4>
          <ul class="col-list">
            <li><a href="#">櫻花集團</a></li>
            <li><a href="#">櫻花家居</a></li>
            <li><a href="#">櫻花整體廚房</a></li>
            <li><a href="#">櫻花 EN</a></li>
            <li><a href="#">卜大浴室 - 整體浴室</a></li>
          </ul>
        </div>
        
        <div class="footer-col">
          <h4 class="col-title">推薦連結</h4>
          <ul class="col-list">
            <li><a href="#">熱水器推薦</a></li>
            <li><a href="#">廚房電器推薦</a></li>
            <li><a href="#">淨水器推薦</a></li>
            <li><a href="#">SAKURA AWARDS</a></li>
            <li><a href="#">創造美好生活儀式</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">進口精品</h4>
          <ul class="col-list">
            <li><a href="#">TEKA 廚電</a></li>
            <li><a href="#">svago 廚房精品</a></li>
            <li><a href="#">TLK 義大利廚具</a></li>
          </ul>
        </div>

        <!-- Social links -->
        <div class="footer-col social-col">
          <h4 class="col-title">關注櫻花</h4>
          <p class="social-intro">獲得第一手產品消息與生活提案</p>
          <div class="social-icons">
            <a href="#" class="social-icon fb" title="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a href="#" class="social-icon yt" title="YouTube">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" class="social-icon line" title="Line">
              <span class="line-txt">L</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <div class="container bottom-content">
        <div class="bottom-nav">
          <a href="#">網站地圖</a>
          <span class="divider">|</span>
          <a href="#">電子發票服務</a>
          <span class="divider">|</span>
          <a href="#">個人資料保護聲明</a>
          <span class="divider">|</span>
          <a href="#">隱私權政策</a>
        </div>
        <p class="copyright">Copyright © 2026 Taiwan Sakura Corporation. All rights reserved.</p>
      </div>
    </div>

    <!-- Back to Top Button -->
    <transition name="fade">
      <button v-show="showScrollTop" class="back-to-top-btn" @click="scrollToTop" aria-label="回到頂部">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </transition>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--dark);
  color: var(--gray-400);
  border-top: 1px solid var(--dark-light);
}

.footer-top {
  padding: 80px 24px 60px;
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 40px;
}

@media (min-width: 576px) {
  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .footer-links-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.col-title {
  color: var(--light);
  font-size: 1.1rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--dark-light);
  width: fit-content;
}

.col-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: var(--primary);
}

.col-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.col-list a {
  font-size: 0.95rem;
  transition: var(--transition-fast);
  color: var(--gray-600);
}

.col-list a:hover {
  color: var(--light);
  padding-left: 4px;
}

/* Social column */
.social-col {
  gap: 16px;
}

.social-intro {
  font-size: 0.9rem;
  color: var(--gray-600);
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-icon {
  background-color: var(--dark-light);
  color: var(--light);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.social-icon:hover {
  transform: translateY(-4px);
  color: var(--light);
}

.social-icon.fb:hover {
  background-color: #1877F2;
  box-shadow: 0 8px 15px rgba(24, 119, 242, 0.4);
}

.social-icon.yt:hover {
  background-color: #FF0000;
  box-shadow: 0 8px 15px rgba(255, 0, 0, 0.4);
}

.social-icon.line {
  font-family: Arial, sans-serif;
  font-weight: 900;
  font-size: 1.2rem;
}

.social-icon.line:hover {
  background-color: #06C755;
  box-shadow: 0 8px 15px rgba(6, 199, 85, 0.4);
}

/* Footer Bottom */
.footer-bottom {
  background-color: #0E0E0F;
  border-top: 1px solid var(--dark-light);
  padding: 24px 0;
}

.bottom-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

@media (min-width: 768px) {
  .bottom-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.bottom-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.bottom-nav a {
  font-size: 0.85rem;
  color: var(--gray-600);
}

.bottom-nav a:hover {
  color: var(--light);
}

.divider {
  color: #242426;
  font-size: 0.8rem;
}

.copyright {
  font-size: 0.85rem;
  color: var(--gray-600);
  text-align: center;
}

/* Floating Back To Top Button */
.back-to-top-btn {
  position: fixed;
  bottom: 30px;
  left: 30px; /* Swap with toast to avoid overlaps, toast is at bottom-right */
  background-color: var(--primary);
  color: var(--light);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 8px 24px rgba(201, 21, 30, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  z-index: 999;
}

.back-to-top-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(201, 21, 30, 0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
