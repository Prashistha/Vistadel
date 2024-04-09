// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//     container: {
//       padding: {
//         md:"10rem",
//       },
//     },
//   },
//   plugins: [],
// }

// tailwind.config.js

module.exports = {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          DEFAULT: '#FFC94A',
        },
      },
      container: {
        padding: {
          md: "10rem",
        },
      },
    },
  },
  plugins: [],
};


