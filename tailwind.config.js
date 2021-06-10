console.log(`NODE_ENV =`, process.env.NODE_ENV)
const purge = process.env.NODE_ENV === 'production' ? true : false
module.exports = {
  purge: { enabled: purge, content: ['./**/*.html'] },
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'outer-space': {
          50: '#373737',
          100: '#353535',
          200: '#333333',
          300: '#2D2D2D',
          400: '#2C2C2C',
          500: '#272727',
          600: '#242424',
          700: '#222222',
          800: '#1D1D1D',
          900: '#121212',
        },
      },
      spacing: {
        108: '27rem',
        120: '30rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
