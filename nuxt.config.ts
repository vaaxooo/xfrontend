// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'


export default defineNuxtConfig({
	ssr: true,
	devtools: { enabled: false },


        experimental: {
                payloadExtraction: true,
                renderJsonPayloads: true
        },

        runtimeConfig: {
                public: {
                        apiBase: 'https://localhost:8081/api/v1'
                }
        },

	app: {
		head: {
			title: 'XFrontend',
			htmlAttrs: { lang: 'ru' },
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
			],
			link: [
				{ rel: 'stylesheet', href: '/assets/css/light.css' }
			],
			script: []
		}
	},

	modules: [],
	plugins: [],

	compatibilityDate: '2025-09-24',
})
