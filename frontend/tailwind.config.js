export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        destructive: "hsl(var(--destructive))"
      }
    }
  },
  plugins: []
}