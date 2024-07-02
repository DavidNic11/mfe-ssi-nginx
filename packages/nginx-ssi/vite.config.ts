import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: {
        index: "./index.html",
        catalog: "./catalog.html",
        header: "./src/Header/header.html",
        footer: "./src/Footer/footer.html",
      },
    },
  },
});
