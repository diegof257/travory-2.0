<template>
  <div class="home">
    <DashboardHeader :name="user.name" />
    <StatsCards :stats="stats" />
    <QuickActions />
  </div>
</template>

<script setup>
import DashboardHeader from '@/components/DashboardHeader.vue'
import StatsCards from '@/components/StatsCards.vue'
import QuickActions from '@/components/QuickActions.vue'
import { session } from '@/services/session'

const user = session.get()

const stats = [
  { label: 'Viajes', value: 0 },
  { label: 'Próximos', value: 0 },
  { label: 'Destinos', value: 0 }
]
</script>
