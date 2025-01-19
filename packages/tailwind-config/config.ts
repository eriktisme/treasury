import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [animate],
}
