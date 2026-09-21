import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Static SPA. base './' keeps GitHub Pages project sites working without a custom domain.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
