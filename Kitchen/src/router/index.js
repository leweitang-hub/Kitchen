import { createRouter, createWebHistory } from 'vue-router'
import SiteView from '../views/SiteView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: SiteView },
    { path: '/admin', name: 'admin', component: AdminView },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 140 }
    }
    return { top: 0 }
  },
})

export default router
