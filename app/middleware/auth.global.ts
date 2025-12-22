import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthState } from '@/composables/useAuthState'

const isAuthRoute = (path: string) => path.startsWith('/auth')

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthState()

  if (!isAuthenticated.value && !isAuthRoute(to.path)) {
    return navigateTo('/auth/login')
  }

  if (isAuthenticated.value && isAuthRoute(to.path)) {
    return navigateTo('/')
  }
})
