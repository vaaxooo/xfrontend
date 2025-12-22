<template>
  <div class="twofa">
    <p class="twofa__subtitle">{{ t('security.two_factor_description') }}</p>

    <div class="twofa__grid">
      <div class="twofa__qr" v-if="qr || otpauthUri">
        <img :src="qr || buildQr(otpauthUri)" alt="QR code" class="twofa__qr-image">
        <span class="twofa__hint">{{ t('security.scan_qr') }}</span>
      </div>

      <div class="twofa__details">
        <div class="twofa__item">
          <span class="twofa__label">{{ t('security.secret_key') }}</span>
          <code class="twofa__code">{{ secret || '•••• •••• ••••' }}</code>
        </div>
        <div class="twofa__item" v-if="otpauthUri">
          <span class="twofa__label">{{ t('security.manual_uri') }}</span>
          <code class="twofa__code twofa__code--wrap">{{ otpauthUri }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{ secret?: string; otpauthUri?: string; qr?: string }>()

const { t } = useI18n()

const buildQr = (uri?: string) => (uri ? `https://quickchart.io/qr?text=${encodeURIComponent(uri)}` : '')
</script>

<style scoped>
.twofa {
  display: grid;
  gap: var(--s-3);
}

.twofa__subtitle {
  margin: 0;
  color: var(--muted);
}

.twofa__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--s-3);
  align-items: flex-start;
}

.twofa__qr {
  border: 1px dashed var(--muted-100);
  border-radius: var(--radius-md);
  padding: var(--s-3);
  display: grid;
  gap: var(--s-2);
  justify-items: center;
}

.twofa__qr-image {
  width: 160px;
  height: 160px;
  object-fit: contain;
}

.twofa__hint {
  font-size: var(--fs-12);
  color: var(--muted);
}

.twofa__details {
  display: grid;
  gap: var(--s-2);
}

.twofa__item {
  background: var(--muted-50);
  border-radius: var(--radius-md);
  padding: var(--s-2) var(--s-3);
}

.twofa__label {
  display: block;
  font-size: var(--fs-12);
  color: var(--muted);
  margin-bottom: var(--s-1);
}

.twofa__code {
  display: block;
  font-family: 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--fs-14);
  color: var(--text-color);
}

.twofa__code--wrap {
  word-break: break-all;
}
</style>
