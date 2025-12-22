<template>
	<div class="menu">
		<div class="logo">
			<span>XFrontend</span>
		</div>

		<div class="navigation">
                        <NuxtLink to="/" class="menu__link is-active">
                                <img src="/assets/images/icons/user.svg" class="menu__icon">
                                Профиль
                        </NuxtLink>

                        <a href="#" class="menu__link">
                                <img src="/assets/images/icons/wallet.svg" class="menu__icon">
                                Кошелёк
                        </a>

                        <button type="button" class="menu__link" @click="handleLogout">
                                <img src="/assets/images/icons/logout.svg" class="menu__icon">
                                Выйти из аккаунта
                        </button>
                </div>
        </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthState } from '@/composables/useAuthState'

const router = useRouter()
const { clearSession } = useAuthState()

const handleLogout = () => {
  clearSession()
  router.push('/auth/login')
}
</script>
