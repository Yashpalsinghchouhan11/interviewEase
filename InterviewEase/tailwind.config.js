/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'landingimg': "url('./src/assets/download (1).png')",
      },
      colors:{
        'black':'#141414',
        'neon': '#D7FF35',
  
      },
      fontFamily:{
  
      },
      background:{
        'light':'#FFFFFF',
        'dark':'#222222',
      },

    },
  },
  plugins: [],
}