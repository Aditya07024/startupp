/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#0A0A0F",
        bgSecondary: "#0F0F1A",
        bgCard: "#12121E",
        borderTone: "rgba(99,102,241,0.15)",
        blueTone: "#2563EB",
        indigoTone: "#6366F1",
        textPrimary: "#F1F5F9",
        textMuted: "#64748B",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      boxShadow: {
        glow: "0 0 20px rgba(99,102,241,0.12)",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
