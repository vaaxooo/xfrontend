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
                                apiBase: 'http://localhost:8080/api/v1',
                                googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                                googleRedirectUri:
                                        process.env.NUXT_PUBLIC_GOOGLE_REDIRECT_URI ||
                                        'http://localtest.me:3000/auth/google/callback',
                                googleOrigin: process.env.NUXT_PUBLIC_GOOGLE_ORIGIN || 'http://localtest.me:3000'
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

	vite: {
		server: {
			strictPort: true,
			allowedHosts: ['localtest.me'],
		},
	},
})
