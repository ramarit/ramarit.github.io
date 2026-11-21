import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://www.ryanamarit.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/thank-you/') })],
  vite: { plugins: [tailwindcss()] },
})
