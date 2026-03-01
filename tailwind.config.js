/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode support using a 'class' strategy (e.g., adding 'dark' class to the html element)
  darkMode: ["class"],

  // Specify the paths to all of the template files in the project
  // Tailwind will scan these files for class names to generate the corresponding CSS
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],

  theme: {
    extend: {
      // Extend the default border radius values
      // Uses CSS variables for flexible theming (likely from a UI library like shadcn/ui)
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Extend the default color palette
      // define specific colors for the sidebar component using CSS variables
      // This allows for easy theme switching (e.g., light/dark mode) without changing class names
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  // Add plugins to extend Tailwind's functionality
  // tailwindcss-animate: Adds utility classes for animations
  plugins: [require("tailwindcss-animate")],
};
