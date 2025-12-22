import { computed } from 'vue'
import { useState } from '#app'
import en from '@/locales/en'
import ru from '@/locales/ru'

const messages = {
  en,
  ru,
}

type LocaleKey = keyof typeof messages

type TranslationValue = string | Record<string, string | TranslationValue>

const getValue = (obj: TranslationValue, path: string[]): string => {
  return path.reduce((value, key) => {
    if (typeof value === 'string') {
      return value
    }

    return (value?.[key] ?? '') as TranslationValue
  }, obj) as string
}

export const useI18n = () => {
  const locale = useState<LocaleKey>('app-locale', () => 'ru')

  const t = (key: string) => {
    const target = messages[locale.value]
    const value = getValue(target, key.split('.'))

    return value || key
  }

  const switchLocale = (next: LocaleKey) => {
    if (messages[next]) {
      locale.value = next
    }
  }

  const availableLocales = computed(() => Object.keys(messages) as LocaleKey[])

  return {
    locale,
    t,
    switchLocale,
    availableLocales,
  }
}
