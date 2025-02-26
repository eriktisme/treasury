import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export const config: Config = {
  content: [
    './node_modules/@internal/design-system/components/**/*.{ts,tsx}',
    './node_modules/@internal/design-system/hooks/**/*.{ts,tsx}',
    './node_modules/@internal/design-system/index.tsx',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: [],
  plugins: [animate],
}
