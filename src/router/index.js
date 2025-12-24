import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

import TripsView from '@/views/TripsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PreferencesView from '@/views/PreferencesView.vue'
import ChatView from '@/views/ChatView.vue'
import LoginView from '@/views/LoginView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },

    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', redirect: '/trips' },
        { path: 'trips', component: TripsView },
        { path: 'profile', component: ProfileView },
        { path: 'preferences', component: PreferencesView },
        { path: 'chat', component: ChatView },
      ]
    }
  ]
})
