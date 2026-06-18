/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          DEFAULT: "#1B2A3D",
          deep: "#101B28",
          line: "#5B8DBF",
          glow: "#8FB7DE",
        },
        paper: "#F4F5F3",
        ink: "#20242B",
        concrete: "#6B6F76",
        brass: {
          DEFAULT: "#A8743C",
          light: "#C99A63",
          dark: "#7E5A2D",
        },
        stone: "#C9C2B4",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(91,141,191,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(91,141,191,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
  plugins: [],
};
