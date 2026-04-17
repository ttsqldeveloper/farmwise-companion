// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from 'nitro/vite'; // Import the Nitro plugin

export default defineConfig({
  // The @lovable.dev/config already includes tanstackStart, react, tailwindcss, etc.
  // We just need to add the nitro plugin to the array.
  plugins: [
    // ... other plugins from the lovable config,
    nitro(), // Add Nitro plugin here
  ],
});