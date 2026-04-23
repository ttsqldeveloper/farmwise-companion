// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitroV2Plugin(),
  ],
});