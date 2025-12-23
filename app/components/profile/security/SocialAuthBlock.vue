<template>
  <div class="block p-16">
    <div class="row justify-content-start">
      <div class="icon">
        <img src="/assets/images/icons/id.svg" class="w-32 h-32">
      </div>

      <div class="block-content">
        <div class="block-content__title">
          {{ t('security.social_title') }}
        </div>

        <div class="block-content__description">
          {{ t('security.social_description') }}
        </div>
      </div>
    </div>

    <div class="block-action row justify-content-start socials">
      <SocialButton
        v-for="provider in providers"
        :key="provider.id"
        :icon="provider.icon"
        :title="provider.title"
        :status-icon="provider.connected ? '/assets/images/icons/green-check.svg' : '/assets/images/icons/plus.svg'"
        @click="() => handleProviderClick(provider)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { useModal } from '@/composables/useModal'
import SocialButton from '@/components/profile/security/SocialButton.vue'
import { useProfileApi } from '@/composables/useProfileApi'

interface Provider {
  id: string
  title: string
  icon: string
  connected: boolean
}

const providers = ref<Provider[]>([
  {
    id: 'telegram',
    title: 'Telegram',
    icon: '/assets/images/icons/telegram.svg',
    connected: true,
  },
  {
    id: 'google',
    title: 'Google',
    icon: '/assets/images/icons/google.svg',
    connected: false,
  },
  {
    id: 'apple',
    title: 'Apple ID',
    icon: '/assets/images/icons/apple.svg',
    connected: false,
  },
  {
    id: 'facebook',
    title: 'Facebook',
    icon: '/assets/images/icons/facebook.svg',
    connected: false,
  },
])

const { t } = useI18n()
const { openModal } = useModal()
const { toggleSocialAccount } = useProfileApi()

const handleProviderClick = (provider: Provider) => {
  openModal({
    title: provider.connected
      ? t('security.social_disconnect_title', { provider: provider.title })
      : t('security.social_connect_title', { provider: provider.title }),
    description: provider.connected
      ? t('security.social_disconnect_description')
      : t('security.social_connect_description'),
    confirmLabel: provider.connected ? t('modal.confirm') : t('security.enable'),
    cancelLabel: t('modal.cancel'),
    onConfirm: async () => {
      await toggleSocialAccount(provider.id, !provider.connected)
      providers.value = providers.value.map((item) =>
        item.id === provider.id ? { ...item, connected: !item.connected } : item,
      )
    },
  })
}
</script>
