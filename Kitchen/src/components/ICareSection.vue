<script setup>
import { ref } from 'vue'

const isBookingOpen = ref(false)
const showToast = ref(false)
const bookingForm = ref({
  name: '',
  phone: '',
  serviceType: 'kitchen-check'
})

const submitBooking = () => {
  if (bookingForm.value.name.trim() && bookingForm.value.phone.trim()) {
    isBookingOpen.value = false
    showToast.value = true
    
    // Clear form
    bookingForm.value.name = ''
    bookingForm.value.phone = ''
    
    // Auto close toast
    setTimeout(() => {
      showToast.value = false
    }, 4000)
  } else {
    alert('請填寫完整資訊！')
  }
}
</script>

<template>
  <section class="icare-section">
    <div class="container icare-content-box animate-fade-in">
      <!-- iCare Logo & Slogan -->
      <div class="icare-brand">
        <svg class="icare-logo-svg" viewBox="0 0 350 70" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="35" r="28" fill="#C9151E" />
          <path d="M35 15 L40 27 L52 30 L43 38 L46 50 L35 44 L24 50 L27 38 L18 30 L30 27 Z" fill="#FFFFFF" />
          <text x="80" y="32" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF">SAKURA</text>
          <text x="80" y="58" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#E9ECEF" letter-spacing="1">iCare</text>
          <text x="210" y="45" font-family="system-ui, sans-serif" font-weight="300" font-size="18" fill="#CED4DA">| 服務承諾</text>
        </svg>
        <p class="slogan">時刻在乎，永恆守護</p>
      </div>

      <!-- Service Highlights Grid -->
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">📬</div>
          <h3 class="service-title">永久免費送油網</h3>
          <p class="service-text">櫻花除油煙機享每年油網永久免費送到家，保障廚房抽力常新。</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🔍</div>
          <h3 class="service-title">永久免費廚房健檢</h3>
          <p class="service-text">專業人員親自上門進行瓦斯、水路及廚電安全檢查，守護全家安全。</p>
        </div>
        <div class="service-card">
          <div class="service-icon">💧</div>
          <h3 class="service-title">永久免費淨水健檢</h3>
          <p class="service-text">定期水質與淨水設備健檢服務，讓您喝的每一口水都純淨安心。</p>
        </div>
        <div class="service-card">
          <div class="service-icon">♨️</div>
          <h3 class="service-title">永久免費熱水器安檢</h3>
          <p class="service-text">每年防範未然，熱水器安全防護安檢，保證安全無虞。</p>
        </div>
      </div>

      <button class="btn btn-reserve" @click="isBookingOpen = true">即刻預約 iCare 服務</button>
    </div>

    <!-- Booking Dialog Modal -->
    <transition name="fade">
      <div v-if="isBookingOpen" class="modal-overlay" @click.self="isBookingOpen = false">
        <div class="modal-card">
          <button class="modal-close" @click="isBookingOpen = false">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="booking-form-wrap">
            <h2 class="form-title">預約櫻花 iCare 服務</h2>
            <p class="form-desc">請填寫以下資訊，我們將派專人與您聯繫確認細節。</p>
            <div class="form-divider"></div>

            <div class="form-group">
              <label for="client-name">您的姓名</label>
              <input id="client-name" v-model="bookingForm.name" type="text" placeholder="例如：林先生">
            </div>

            <div class="form-group">
              <label for="client-phone">聯絡電話</label>
              <input id="client-phone" v-model="bookingForm.phone" type="tel" placeholder="例如：0912-345678">
            </div>

            <div class="form-group">
              <label for="service-type">預約服務類型</label>
              <select id="service-type" v-model="bookingForm.serviceType">
                <option value="grease-filter">永久免費送油網登記</option>
                <option value="kitchen-check">永久免費廚房安全健檢</option>
                <option value="water-check">永久免費淨水設備健檢</option>
                <option value="heater-check">永久免費熱水器安全檢查</option>
              </select>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary" @click="submitBooking">確認預約</button>
              <button class="btn btn-secondary" @click="isBookingOpen = false">取消</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success Toast Notification -->
    <transition name="toast-slide">
      <div v-if="showToast" class="toast-success">
        <div class="toast-icon">✓</div>
        <div class="toast-body">
          <h4 class="toast-title">預約申請已成功送出！</h4>
          <p class="toast-desc">我們已收到您的 iCare 預約，服務專員將於 24 小時內與您電話聯繫。</p>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.icare-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #A70F16 0%, #C9151E 50%, #E63946 100%);
  color: var(--light);
  position: relative;
  overflow: hidden;
}

.icare-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -20%;
  width: 140%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
}

.icare-content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
}

.icare-brand {
  margin-bottom: 50px;
}

.icare-logo-svg {
  height: 54px;
  width: auto;
  margin-bottom: 16px;
}

.slogan {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  margin-bottom: 60px;
}

@media (min-width: 576px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .services-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Service Card */
.service-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 30px 20px;
  transition: var(--transition-slow);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.service-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.service-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--light);
  margin-bottom: 10px;
}

.service-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

.btn-reserve {
  background-color: var(--light);
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 700;
  padding: 16px 40px;
  border-radius: 50px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: var(--transition-normal);
}

.btn-reserve:hover {
  background-color: var(--primary-light);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  color: var(--primary-hover);
}

/* Modal */
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
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  color: var(--dark);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--gray-100);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-main);
  transition: var(--transition-fast);
}

.modal-close:hover {
  background-color: var(--primary-light);
  color: var(--primary);
}

.booking-form-wrap {
  padding: 36px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--dark);
}

.form-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.form-divider {
  height: 1px;
  background-color: var(--gray-200);
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  text-align: left;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-800);
}

.form-group input, .form-group select {
  padding: 12px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition-fast);
  font-family: inherit;
}

.form-group input:focus, .form-group select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  flex: 1;
}

/* Toast */
.toast-success {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: var(--light);
  border-left: 6px solid #4CAF50;
  box-shadow: var(--shadow-lg);
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  z-index: 1100;
  max-width: 420px;
  color: var(--dark);
}

.toast-icon {
  background-color: #E8F5E9;
  color: #4CAF50;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.toast-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--dark);
}

.toast-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Toast slide animation */
.toast-slide-enter-active, .toast-slide-leave-active {
  transition: var(--transition-normal);
}
.toast-slide-enter-from {
  transform: translateX(100%) translateY(20px);
  opacity: 0;
}
.toast-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
