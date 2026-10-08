import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  require: `tailwind-scrollbar`,
  server: {
    allowedHosts: [
      "13fb-2a00-23ee-1580-1ba5-6925-7434-30b6-7940.ngrok-free.app",
      "e7e7-2a00-23ee-1580-1ba5-6925-7434-30b6-7940.ngrok-free.app",
      ".ngrok-free.app",
      ".trycloudflare.com",
    ],
  },
  build: {
    rollupOptions: {
      external: ["react-native-fs"],
    },
    // If your config uses rolldownOptions directly, you can also include it here:
    rolldownOptions: {
      external: ["react-native-fs"],
    },
  },
});
