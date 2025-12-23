<template>
  <div class="auth-card block p-32">
    <div class="auth-header">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>

    <div class="auth-content">
      <slot />

      <template v-if="hasSocials">
        <div class="auth-separator">
          {{ socialsLabel }}
        </div>

        <div class="auth-socials">
          <a
            v-for="social in socials"
            :key="social.id"
            href="#"
            class="button button--secondary button-social center justify-content-center"
            @click.prevent="emit('social', social.id)"
          >
            <img :src="social.icon" :alt="social.label" class="w-32 h-32">
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

interface SocialLink {
  id: string
  label: string
  icon: string
}

const props = withDefaults(
  defineProps<{ title: string; description?: string; socialLabel?: string; socials?: SocialLink[] }>(),
  {
    socials: () => [],
  },
)

const emit = defineEmits<{ (e: 'social', id: string): void }>()

const { t } = useI18n()

const socialsLabel = computed(() => props.socialLabel ?? t('auth.social_login'))
const hasSocials = computed(() => props.socials?.length)
</script>
