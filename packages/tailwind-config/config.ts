import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export const config: Config = {
  content: [
    './node_modules/@internal/design-system/components/**/*.{ts,tsx}',
    './node_modules/@internal/design-system/hooks/**/*.{ts,tsx}',
    './node_modules/@internal/design-system/index.tsx',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['class'],
  extend: {
    colors: {
      sidebar: {
        DEFAULT: 'hsl(var(--sidebar-background))',
        foreground: 'hsl(var(--sidebar-foreground))',
        primary: 'hsl(var(--sidebar-primary))',
        'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        accent: 'hsl(var(--sidebar-accent))',
        'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        border: 'hsl(var(--sidebar-border))',
        ring: 'hsl(var(--sidebar-ring))',
      },
    },
  },
  plugins: [animate],
}
