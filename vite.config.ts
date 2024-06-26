import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@components": "/src/components",
      "@api": "/src/api",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
      "@store": "/src/store",
    },
  },
  plugins: [react()],
});
