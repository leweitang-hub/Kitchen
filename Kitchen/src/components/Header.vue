<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const activeDropdown = ref(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value) {
    searchQuery.value = ''
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`搜尋關鍵字: ${searchQuery.value}`)
    isSearchOpen.value = false
    searchQuery.value = ''
  }
}

const selectDropdown = (menu) => {
  if (activeDropdown.value === menu) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = menu
  }
}
</script>

<template>
  <header class="header glass-panel">
    <div class="header-container container">
      <!-- Logo -->
      <a href="#" class="logo">
        <svg class="logo-svg" viewBox="0 0 280 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="18" fill="#C9151E" />
          <path d="M25 12 L29 20 L38 22 L31 28 L33 37 L25 32 L17 37 L19 28 L12 22 L21 20 Z" fill="#FFFFFF" />
          <text x="55" y="27" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#151515" letter-spacing="1">SAKURA</text>
          <text x="55" y="42" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#C9151E" letter-spacing="4">台灣櫻花</text>
          <text x="160" y="32" font-family="system-ui, sans-serif" font-weight="300" font-size="15" fill="#6C757D">| 廚房電器</text>
        </svg>
      </a>

      <!-- Desktop Nav -->
      <nav class="desktop-nav">
        <ul class="nav-list">
          <li class="nav-item" 
              @mouseenter="activeDropdown = 'products'" 
              @mouseleave="activeDropdown = null">
            <a href="#" class="nav-link" :class="{ active: activeDropdown === 'products' }">
              櫻花產品
              <svg class="arrow-icon" viewBox="0 0 24 24" width="16" height="16">
                <path d="M7 10l5 5 5-5H7z" fill="currentColor"/>
              </svg>
            </a>
            <!-- Dropdown -->
            <transition name="fade-slide">
              <div v-show="activeDropdown === 'products'" class="dropdown-menu">
                <div class="dropdown-container container">
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">廚房配備</h4>
                    <a href="#recommend-hood" class="dropdown-item">
                      <span class="dot"></span> 除油煙機
                    </a>
                    <a href="#recommend-stove" class="dropdown-item">
                      <span class="dot"></span> 瓦斯爐
                    </a>
                    <a href="#recommend-dryer" class="dropdown-item">
                      <span class="dot"></span> 殺菌烘碗機
                    </a>
                  </div>
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">現代電器</h4>
                    <a href="#recommend-ih" class="dropdown-item">
                      <span class="dot"></span> IH感應爐
                    </a>
                    <a href="#recommend-washer" class="dropdown-item">
                      <span class="dot"></span> 洗碗機
                    </a>
                    <a href="#recommend-oven" class="dropdown-item">
                      <span class="dot"></span> 烤箱與電器櫃
                    </a>
                  </div>
                  <div class="dropdown-column">
                    <h4 class="dropdown-title">其他產品</h4>
                    <a href="#" class="dropdown-item"><span class="dot"></span> 熱水器系列</a>
                    <a href="#" class="dropdown-item"><span class="dot"></span> 淨水器系列</a>
                    <a href="#" class="dropdown-item"><span class="dot"></span> 電子型錄</a>
                  </div>
                </div>
              </div>
            </transition>
          </li>
          <li class="nav-item"><a href="#" class="nav-link">銷售通路</a></li>
          <li class="nav-item"><a href="#" class="nav-link">客戶服務</a></li>
          <li class="nav-item"><a href="#" class="nav-link">最新消息</a></li>
          <li class="nav-item"><a href="#" class="nav-link">櫻花集團</a></li>
        </ul>
      </nav>

      <!-- Action Area -->
      <div class="header-actions">
        <!-- Quick Search -->
        <div class="search-wrapper" :class="{ active: isSearchOpen }">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜尋產品..." 
            class="search-input"
            @keyup.enter="handleSearch"
            ref="searchInputRef"
          >
          <button class="action-btn" @click="isSearchOpen ? handleSearch() : toggleSearch()" aria-label="搜尋">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button v-if="isSearchOpen" class="close-search-btn" @click="toggleSearch">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Consultation -->
        <a href="#" class="action-btn-link" title="產品諮詢">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="action-txt">諮詢</span>
        </a>

        <!-- Shop -->
        <a href="#" class="action-btn-link shop-btn" title="線上購物">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="action-txt">商城</span>
        </a>

        <!-- Hamburger Menu (Mobile) -->
        <button class="hamburger-btn" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }" aria-label="選單">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Nav Slide-out -->
    <transition name="slide-menu">
      <div v-show="isMobileMenuOpen" class="mobile-menu-overlay">
        <div class="mobile-menu-content">
          <div class="mobile-search">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜尋產品..." 
              @keyup.enter="handleSearch"
            >
            <button @click="handleSearch">Go</button>
          </div>
          <ul class="mobile-nav-list">
            <li class="mobile-nav-item">
              <div class="mobile-nav-header" @click="selectDropdown('products')">
                <span>櫻花產品</span>
                <svg :class="{ rotated: activeDropdown === 'products' }" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
                </svg>
              </div>
              <transition name="expand">
                <ul v-show="activeDropdown === 'products'" class="mobile-sublist">
                  <li><a href="#recommend-hood" @click="isMobileMenuOpen = false">除油煙機</a></li>
                  <li><a href="#recommend-stove" @click="isMobileMenuOpen = false">瓦斯爐</a></li>
                  <li><a href="#recommend-dryer" @click="isMobileMenuOpen = false">殺菌烘碗機</a></li>
                  <li><a href="#recommend-ih" @click="isMobileMenuOpen = false">IH感應爐</a></li>
                  <li><a href="#recommend-washer" @click="isMobileMenuOpen = false">洗碗機</a></li>
                  <li><a href="#recommend-oven" @click="isMobileMenuOpen = false">烤箱與電器櫃</a></li>
                </ul>
              </transition>
            </li>
            <li class="mobile-nav-item"><a href="#" @click="isMobileMenuOpen = false">銷售通路</a></li>
            <li class="mobile-nav-item"><a href="#" @click="isMobileMenuOpen = false">客戶服務</a></li>
            <li class="mobile-nav-item"><a href="#" @click="isMobileMenuOpen = false">最新消息</a></li>
            <li class="mobile-nav-item"><a href="#" @click="isMobileMenuOpen = false">櫻花集團</a></li>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  z-index: 100;
  display: flex;
  align-items: center;
  transition: var(--transition-normal);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-svg {
  height: 42px;
  width: auto;
}

/* Desktop Nav */
.desktop-nav {
  display: none;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  position: relative;
}

.nav-link {
  font-size: 1.05rem;
  font-weight: 500;
  padding: 8px 0;
  color: var(--dark);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover, .nav-link.active {
  color: var(--primary);
}

.arrow-icon {
  transition: var(--transition-fast);
}

.nav-link:hover .arrow-icon, .nav-link.active .arrow-icon {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(var(--header-height) - 15px);
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  background: var(--light);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  padding: 24px;
  z-index: 101;
}

.dropdown-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.dropdown-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dropdown-title {
  font-size: 0.95rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.dropdown-item {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-item .dot {
  width: 6px;
  height: 6px;
  background-color: var(--gray-400);
  border-radius: 50%;
  transition: var(--transition-fast);
}

.dropdown-item:hover {
  color: var(--primary);
}

.dropdown-item:hover .dot {
  background-color: var(--primary);
  transform: scale(1.5);
}

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-btn-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-main);
  font-weight: 500;
  font-size: 0.95rem;
}

.action-btn-link:hover {
  color: var(--primary);
}

.action-btn {
  background: none;
  border: none;
  padding: 8px;
  color: var(--text-main);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
}

.action-btn:hover {
  background-color: var(--gray-100);
  color: var(--primary);
}

.shop-btn {
  background-color: var(--primary-light);
  color: var(--primary);
  padding: 8px 16px;
  border-radius: 20px;
  transition: var(--transition-fast);
}

.shop-btn:hover {
  background-color: var(--primary);
  color: var(--light);
}

/* Search Box Animation */
.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.search-input {
  width: 0;
  opacity: 0;
  border: none;
  outline: none;
  padding: 8px 0;
  font-size: 0.95rem;
  font-family: inherit;
  transition: var(--transition-normal);
  background: transparent;
  border-bottom: 2px solid transparent;
}

.search-wrapper.active .search-input {
  width: 180px;
  opacity: 1;
  padding-left: 8px;
  padding-right: 28px;
  border-bottom-color: var(--primary);
}

.close-search-btn {
  position: absolute;
  right: 36px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.close-search-btn:hover {
  color: var(--primary);
}

/* Hamburger (Mobile) */
.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger-btn span {
  width: 100%;
  height: 2px;
  background-color: var(--dark);
  border-radius: 2px;
  transition: var(--transition-fast);
}

.hamburger-btn.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Mobile Slide-out Menu */
.mobile-menu-overlay {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--header-height));
  background-color: rgba(255, 255, 255, 0.98);
  z-index: 99;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-shadow: inset 0 8px 16px rgba(0,0,0,0.02);
}

.mobile-search {
  display: flex;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--gray-300);
}

.mobile-search input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.mobile-search button {
  background-color: var(--primary);
  color: var(--light);
  border: none;
  padding: 0 20px;
  font-weight: 600;
  cursor: pointer;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-item {
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: 16px;
}

.mobile-nav-item a {
  font-size: 1.15rem;
  font-weight: 600;
}

.mobile-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
}

.mobile-nav-header svg {
  transition: var(--transition-fast);
}

.mobile-nav-header svg.rotated {
  transform: rotate(90deg);
}

.mobile-sublist {
  margin-top: 12px;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-sublist a {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-main);
}

/* Animations */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: var(--transition-normal);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.slide-menu-enter-active, .slide-menu-leave-active {
  transition: var(--transition-normal);
}
.slide-menu-enter-from, .slide-menu-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.expand-enter-active, .expand-leave-active {
  transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
  max-height: 250px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Media Queries */
@media (min-width: 992px) {
  .desktop-nav {
    display: block;
  }
  .hamburger-btn {
    display: none;
  }
  .action-txt {
    display: inline;
  }
}

@media (max-width: 991px) {
  .action-txt {
    display: none;
  }
}
</style>
