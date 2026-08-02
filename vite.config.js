import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),

    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      includeAssets: [
        "icon-192.png",
        "icon-512.png",
        "maskable-icon-512.png",
        "apple-touch-icon.png",
        "favicon-32x32.png"
      ],

      manifest: {
        id: "/",
        name: "CodeMarket",
        short_name: "CodeMarket",
        description: "Buy and sell code projects.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2563eb",

        lang: "en",

        categories: [
          "shopping",
          "business",
          "developer"
        ],

        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,ico,json}"
        ]
      }
    })
  ]
});
