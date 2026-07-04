import { defineConfig } from "vite";

// Base relativa para que el build funcione en GitHub Pages sin importar
// el nombre del repositorio (https://usuario.github.io/repo/).
export default defineConfig({
  base: "./",
});
