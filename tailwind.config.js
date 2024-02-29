/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        loader: {
          "0%": { transform: "translate(-50%,-50%) ", opacity: 1 },
          "100%": { opacity: 0, transform: "translate(-50%,-100%)" },
        },
        loaderBg: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, visibility: "hidden" },
        },
        slider: {
          "0%": {
            transform: "translateX(60%)",
            opacity: 0,
          },

          "100%": { transform: "translateX(0%)", opacity: 1 },
        },
        sliderText: {
          "0%": {
            transform: "translateX(60%)",
            opacity: 0,
          },

          "100%": { transform: "translateX(-0px)", opacity: 1 },
        },
        faqUnderline: {
          "0%": {
            width: 0,
            opacity: 0,
          },

          "100%": { width: "100%", left: 0, opacity: 1 },
        },
        sliderLeft: {
          "0%": { transform: "translateX(-60%)", opacity: 0 },
          "100%": { transform: "translateX(0%)", opacity: 1 },
        },
        compassSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        loaderSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(5760deg)" },
        },
        compassOuterSpin: {
          "0%": { transform: "rotateY(0deg)" },
          "55%": { transform: "rotateY(1440deg)" },
          "70%": { transform: "rotateY(1530deg)" },
          "100%": { transform: "rotateY(1620deg)" },
        },
        waveMotion: {
          "0%": { transform: "translateX(-100px)" },
          "50%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-100px)" },
        },
        zoomIn: {
          "0%": {
            transform: "scale(0.9)",
            opacity: 0,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
        filterEffect: {
          "0%": { filter: "grayscale(100%)" },
          // "50%": { filter: "sepia(100%)" },
          "100%": { filter: "none" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        upDown: {
          "0%, 100%": { transform: "translateY(3px)" },
          "50%": { transform: "translateY(-3px)" },
        },

        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-in-out",
        "accordion-up": "accordion-up 0.3s ease-in-out",
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        loader: "1s loader 1s ease-in-out forwards",
        loaderBg: "1s loaderBg 1s ease-in-out forwards",
        slider: "1s slider 1s ease-in-out forwards",
        sliderLeft: "1s sliderLeft 1s ease-in-out forwards",
        zoomIn: "1s zoomIn 1s ease-in-out forwards",
        filterEffect: "1s filterEffect 1s ease-in-out forwards",
        wiggle: "wiggle 1s ease-in-out infinite",
        upDown: "upDown 1s ease-in-out infinite",
        compassSpin: "compassSpin 1s ease-in-out infinite",
        loaderSpin: "loaderSpin 1s ease-in-out infinite",
        compassOuterSpin: "compassOuterSpin 1s ease-in-out infinite",
        waveMotion: "waveMotion 1s ease-in-out infinite",
      },
    },
    backgroundImage: {
      "body-pattern": "url('/template/background-pattern.webp')",
      "pattern-mobile": "url('/template/background-pattern.webp')",
      "tours-bg": "url('/template/tours-bg.png')",
    },
    fontFamily: {
      heading: ["var(--font-playfair)", "sans-serif"],
      body: ["var(--font-montserrat)", "sans-serif"],
    },
    colors: {
      // ...colors,
      white: "#FFFFFF",
      "primary-color": "#092730",
      "secondary-color": "#A69769",
      "tertiary-color": "#072128",
      "quaternary-color": "#0F4150",
      "shop-banner-color": "#002D3C",
      // CMS COLORS CONFIGS
      "cms-primary-color": "#092730",
      "cms-secondary-color": "#A69769",
      "cms-tertiary-color": "#072128",
      "cms-fourth-color": "#0b2f3a",
      "gray-50": "#f9fafb",
      "gray-100": "#f3f4f6",
      "gray-200": "#e5e7eb",
      "gray-300": "#d1d5db",
      "gray-400": "#9ca3af",
      "gray-500": "#6b7280",
      "gray-600": "#4b5563",
      "gray-700": "#24262d",
      "gray-800": "#1a1c23",
      "gray-900": "#121317",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
