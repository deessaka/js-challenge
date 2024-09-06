/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
  content: ['./inertia/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        dmRegular: ['DM Serif Display', 'sans-serif'],
        dmItalic: ['DM Serif Display', 'sans-serif'],
        rbThin: ['Roboto-Thin', 'sans-serif'],
        rbLight: ['Roboto-Light', 'sans-serif'],
        rbRegular: ['Roboto-Regular', 'sans-serif'],
        rbMedium: ['Roboto-Medium', 'sans-serif'],
        rbBold: ['Roboto-Bold', 'sans-serif'],
        rbBlack: ['Roboto-Black', 'sans-serif'],
        quicksandRegular: ['Quicksand', 'sans-serif'],
        quicksandLight: ['Quicksand', 'sans-serif'],
        quicksandMedium: ['Quicksand', 'sans-serif'],
        quicksandBold: ['Quicksand', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          'DEFAULT': 'hsl(var(--primary))',
          // Couleurs neutres
          'neutral': {
            light: '#f3f4f6', // Gris très clair pour le mode clair
            dark: '#1f2937', // Gris foncé pour le mode sombre
          },
          'neutral-content': {
            light: '#1f2937', // Gris foncé pour le texte en mode clair
            dark: '#f3f4f6', // Gris très clair pour le texte en mode sombre
          },
          'accent-content': {
            light: '#1f2937', // Gris foncé pour le texte sur accent en mode clair
            dark: '#f3f4f6', // Gris très clair pour le texte sur accent en mode sombre
          },
          'foreground': 'hsl(var(--primary-foreground))',
          'light': '#f59e0b', // Jaune vif pour le mode clair
          'dark': '#d97706',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          light: '#64748b', // Gris moyen pour le mode clair
          dark: '#94a3b8', //
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          light: '#22d3ee', // Bleu clair pour le mode clair
          dark: '#06b6d4',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
