import { createRouter, createWebHistory } from 'vue-router'
import { session } from '@/services/session'

import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import TripsView from '@/views/TripsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PreferencesView from '@/views/PreferencesView.vue'
import AppLayout from '@/layouts/AppLayout.vue'

// 1️⃣ PRIMERO crear el router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: LoginView
    },

    // 📱 APP (CON BOTTOM NAV)
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', redirect: '/home' },
        { path: 'home', component: HomeView },
        { path: 'trips', component: TripsView },
        { path: 'profile', component: ProfileView },
        { path: 'preferences', component: PreferencesView }
      ]
    }
  ]
})

// 2️⃣ DESPUÉS usar router.beforeEach
router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = session.isLogged()

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  if (to.path === '/login' && loggedIn) {
    return next('/home')
  }

  next()
})

// 3️⃣ EXPORTAR
export default router
