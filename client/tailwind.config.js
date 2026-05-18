/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'solar-dark': '#0a1f1a',
        'solar-green': '#00ff88',
        'solar-blue': '#00d4ff',
        'solar-emerald': '#10b981',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-gradient': 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
        'eco-gradient': 'linear-gradient(180deg, rgba(0,255,136,0.1) 0%, rgba(0,212,255,0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88' },
          '100%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88' },
        },
      },
    },
  },
  plugins: [],
}
