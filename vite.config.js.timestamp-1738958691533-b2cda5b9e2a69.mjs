// vite.config.js
import VueI18nPlugin from "file:///D:/laragon/www/qube/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import vue from "file:///D:/laragon/www/qube/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/laragon/www/qube/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { fileURLToPath } from "node:url";
import AutoImport from "file:///D:/laragon/www/qube/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/laragon/www/qube/node_modules/unplugin-vue-components/dist/vite.js";
import { VueRouterAutoImports, getPascalCaseRouteName } from "file:///D:/laragon/www/qube/node_modules/unplugin-vue-router/dist/index.mjs";
import VueRouter from "file:///D:/laragon/www/qube/node_modules/unplugin-vue-router/dist/vite.mjs";
import { defineConfig } from "file:///D:/laragon/www/qube/node_modules/vite/dist/node/index.js";
import VueDevTools from "file:///D:/laragon/www/qube/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import Layouts from "file:///D:/laragon/www/qube/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import vuetify from "file:///D:/laragon/www/qube/node_modules/vite-plugin-vuetify/dist/index.mjs";
import svgLoader from "file:///D:/laragon/www/qube/node_modules/vite-svg-loader/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/laragon/www/qube/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    {
      name: "configure-server",
      configureServer(_server) {
        console.log("server");
      }
    },
    // Docs: https://github.com/posva/unplugin-vue-router
    // ℹ️ This plugin should be placed before vue plugin
    VueRouter({
      getRouteName: (routeNode) => {
        return getPascalCaseRouteName(routeNode).replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
      },
      beforeWriteFiles: (root) => {
        root.insert("/apps/email/:filter", "/src/pages/apps/email/index.vue");
        root.insert("/apps/email/:label", "/src/pages/apps/email/index.vue");
      }
    }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "swiper-container" || tag === "swiper-slide"
        }
      }
    }),
    VueDevTools(),
    vueJsx(),
    // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
    vuetify({
      styles: {
        configFile: "src/assets/styles/variables/_vuetify.scss"
      }
    }),
    // Docs: https://github.com/johncampionjr/vite-plugin-vue-layouts#vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: "./src/layouts/"
    }),
    // Docs: https://github.com/antfu/unplugin-vue-components#unplugin-vue-components
    Components({
      dirs: ["src/@core/components", "src/views/demos", "src/components"],
      dts: true,
      resolvers: [
        (componentName) => {
          if (componentName === "VueApexCharts")
            return { name: "default", from: "vue3-apexcharts", as: "VueApexCharts" };
        }
      ]
    }),
    // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
    AutoImport({
      imports: ["vue", VueRouterAutoImports, "@vueuse/core", "@vueuse/math", "vue-i18n", "pinia"],
      dirs: [
        "./src/@core/utils",
        "./src/@core/composable/",
        "./src/composables/",
        "./src/utils/",
        "./src/plugins/*/composables/*"
      ],
      vueTemplate: true,
      // ℹ️ Disabled to avoid confusion & accidental usage
      ignore: ["useCookies", "useStorage"],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json"
      }
    }),
    // Docs: https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#intlifyunplugin-vue-i18n
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [
        fileURLToPath(new URL("./src/plugins/i18n/locales/**", __vite_injected_original_import_meta_url))
      ]
    }),
    svgLoader()
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@node_modules": fileURLToPath(new URL("./node_modules", __vite_injected_original_import_meta_url)),
      "@themeConfig": fileURLToPath(new URL("./themeConfig.js", __vite_injected_original_import_meta_url)),
      "@core": fileURLToPath(new URL("./src/@core", __vite_injected_original_import_meta_url)),
      "@layouts": fileURLToPath(new URL("./src/@layouts", __vite_injected_original_import_meta_url)),
      "@images": fileURLToPath(new URL("./src/assets/images/", __vite_injected_original_import_meta_url)),
      "@styles": fileURLToPath(new URL("./src/assets/styles/", __vite_injected_original_import_meta_url)),
      "@configured-variables": fileURLToPath(new URL("./src/assets/styles/variables/_template.scss", __vite_injected_original_import_meta_url)),
      "@db": fileURLToPath(new URL("./src/plugins/fake-api/handlers/", __vite_injected_original_import_meta_url)),
      "@api-utils": fileURLToPath(new URL("./src/plugins/fake-api/utils/", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/components/")) {
            return "components";
          }
        }
      }
    },
    sourcemap: true,
    chunkSizeWarningLimit: 5e3
  },
  optimizeDeps: {
    exclude: ["vuetify"],
    entries: [
      "./src/**/*.vue"
    ]
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern"
      }
    },
    preprocessorMaxWorkers: true
  },
  server: {
    proxy: {
      // '/api': {
      //   target: 'http://127.0.0.1:8000', // Your backend URL  
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite path if needed  
      // },
      "/api/connection-details": {
        target: "https://meet.codelfi.com",
        // Your backend URL  
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrite path if needed  
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxxdWJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxsYXJhZ29uXFxcXHd3d1xcXFxxdWJlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9sYXJhZ29uL3d3dy9xdWJlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBWdWVSb3V0ZXJBdXRvSW1wb3J0cywgZ2V0UGFzY2FsQ2FzZVJvdXRlTmFtZSB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXInXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvdml0ZSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IExheW91dHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWxheW91dHMnXG5pbXBvcnQgdnVldGlmeSBmcm9tICd2aXRlLXBsdWdpbi12dWV0aWZ5J1xuaW1wb3J0IHN2Z0xvYWRlciBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXG4gIHBsdWdpbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiAnY29uZmlndXJlLXNlcnZlcicsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoX3NlcnZlcikge1xuICAgICAgICBjb25zb2xlLmxvZygnc2VydmVyJylcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIC8vIFx1MjEzOVx1RkUwRiBUaGlzIHBsdWdpbiBzaG91bGQgYmUgcGxhY2VkIGJlZm9yZSB2dWUgcGx1Z2luXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIGdldFJvdXRlTmFtZTogcm91dGVOb2RlID0+IHtcbiAgICAgICAgLy8gQ29udmVydCBwYXNjYWwgY2FzZSB0byBrZWJhYiBjYXNlXG4gICAgICAgIHJldHVybiBnZXRQYXNjYWxDYXNlUm91dGVOYW1lKHJvdXRlTm9kZSlcbiAgICAgICAgICAucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aXSkvZywgJyQxLSQyJylcbiAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgfSxcbiAgICAgIGJlZm9yZVdyaXRlRmlsZXM6IHJvb3QgPT4ge1xuICAgICAgICByb290Lmluc2VydCgnL2FwcHMvZW1haWwvOmZpbHRlcicsICcvc3JjL3BhZ2VzL2FwcHMvZW1haWwvaW5kZXgudnVlJylcbiAgICAgICAgcm9vdC5pbnNlcnQoJy9hcHBzL2VtYWlsLzpsYWJlbCcsICcvc3JjL3BhZ2VzL2FwcHMvZW1haWwvaW5kZXgudnVlJylcbiAgICAgIH0sXG4gICAgfSksXG4gICAgdnVlKHtcbiAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xuICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogdGFnID0+IHRhZyA9PT0gJ3N3aXBlci1jb250YWluZXInIHx8IHRhZyA9PT0gJ3N3aXBlci1zbGlkZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFZ1ZURldlRvb2xzKCksXG4gICAgdnVlSnN4KCksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vdnVldGlmeWpzL3Z1ZXRpZnktbG9hZGVyL3RyZWUvbWFzdGVyL3BhY2thZ2VzL3ZpdGUtcGx1Z2luXG4gICAgdnVldGlmeSh7XG4gICAgICBzdHlsZXM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogJ3NyYy9hc3NldHMvc3R5bGVzL3ZhcmlhYmxlcy9fdnVldGlmeS5zY3NzJyxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vam9obmNhbXBpb25qci92aXRlLXBsdWdpbi12dWUtbGF5b3V0cyN2aXRlLXBsdWdpbi12dWUtbGF5b3V0c1xuICAgIExheW91dHMoe1xuICAgICAgbGF5b3V0c0RpcnM6ICcuL3NyYy9sYXlvdXRzLycsXG4gICAgfSksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tdnVlLWNvbXBvbmVudHMjdW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFsnc3JjL0Bjb3JlL2NvbXBvbmVudHMnLCAnc3JjL3ZpZXdzL2RlbW9zJywgJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBkdHM6IHRydWUsXG4gICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgY29tcG9uZW50TmFtZSA9PiB7XG4gICAgICAgICAgLy8gQXV0byBpbXBvcnQgYFZ1ZUFwZXhDaGFydHNgXG4gICAgICAgICAgaWYgKGNvbXBvbmVudE5hbWUgPT09ICdWdWVBcGV4Q2hhcnRzJylcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6ICdkZWZhdWx0JywgZnJvbTogJ3Z1ZTMtYXBleGNoYXJ0cycsIGFzOiAnVnVlQXBleENoYXJ0cycgfVxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcblxuICAgIC8vIERvY3M6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi1hdXRvLWltcG9ydCN1bnBsdWdpbi1hdXRvLWltcG9ydFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW1wb3J0czogWyd2dWUnLCBWdWVSb3V0ZXJBdXRvSW1wb3J0cywgJ0B2dWV1c2UvY29yZScsICdAdnVldXNlL21hdGgnLCAndnVlLWkxOG4nLCAncGluaWEnXSxcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgJy4vc3JjL0Bjb3JlL3V0aWxzJyxcbiAgICAgICAgJy4vc3JjL0Bjb3JlL2NvbXBvc2FibGUvJyxcbiAgICAgICAgJy4vc3JjL2NvbXBvc2FibGVzLycsXG4gICAgICAgICcuL3NyYy91dGlscy8nLFxuICAgICAgICAnLi9zcmMvcGx1Z2lucy8qL2NvbXBvc2FibGVzLyonLFxuICAgICAgXSxcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuXG4gICAgICAvLyBcdTIxMzlcdUZFMEYgRGlzYWJsZWQgdG8gYXZvaWQgY29uZnVzaW9uICYgYWNjaWRlbnRhbCB1c2FnZVxuICAgICAgaWdub3JlOiBbJ3VzZUNvb2tpZXMnLCAndXNlU3RvcmFnZSddLFxuICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJyxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBEb2NzOiBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvdHJlZS9tYWluL3BhY2thZ2VzL3VucGx1Z2luLXZ1ZS1pMThuI2ludGxpZnl1bnBsdWdpbi12dWUtaTE4blxuICAgIFZ1ZUkxOG5QbHVnaW4oe1xuICAgICAgcnVudGltZU9ubHk6IHRydWUsXG4gICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgIGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvcGx1Z2lucy9pMThuL2xvY2FsZXMvKionLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgc3ZnTG9hZGVyKCksXG4gIF0sXG4gIGRlZmluZTogeyAncHJvY2Vzcy5lbnYnOiB7fSB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgJ0Bub2RlX21vZHVsZXMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vbm9kZV9tb2R1bGVzJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQHRoZW1lQ29uZmlnJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3RoZW1lQ29uZmlnLmpzJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGNvcmUnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0Bjb3JlJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGxheW91dHMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0BsYXlvdXRzJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGltYWdlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL2ltYWdlcy8nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAc3R5bGVzJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9hc3NldHMvc3R5bGVzLycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgJ0Bjb25maWd1cmVkLXZhcmlhYmxlcyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMvX3RlbXBsYXRlLnNjc3MnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAZGInOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3BsdWdpbnMvZmFrZS1hcGkvaGFuZGxlcnMvJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAnQGFwaS11dGlscyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvcGx1Z2lucy9mYWtlLWFwaS91dGlscy8nLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIEdyb3VwIHZlbmRvciBjb2RlXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBHcm91cCBjb21tb24gY29tcG9uZW50c1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL2NvbXBvbmVudHMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnY29tcG9uZW50cyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA1MDAwLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ3Z1ZXRpZnknXSxcbiAgICBlbnRyaWVzOiBbXG4gICAgICAnLi9zcmMvKiovKi52dWUnLFxuICAgIF0sXG4gIH0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNhc3M6IHtcbiAgICAgICAgYXBpOiAnbW9kZXJuJ1xuICAgICAgfSxcbiAgICB9LFxuICAgIHByZXByb2Nlc3Nvck1heFdvcmtlcnM6IHRydWVcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgIC8vICcvYXBpJzoge1xuICAgICAgLy8gICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjgwMDAnLCAvLyBZb3VyIGJhY2tlbmQgVVJMICBcbiAgICAgIC8vICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgLy8gICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLCAvLyBPcHRpb25hbDogcmV3cml0ZSBwYXRoIGlmIG5lZWRlZCAgXG4gICAgICAvLyB9LFxuICAgICAgJy9hcGkvY29ubmVjdGlvbi1kZXRhaWxzJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL21lZXQuY29kZWxmaS5jb20nLCAvLyBZb3VyIGJhY2tlbmQgVVJMICBcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLCAvLyBPcHRpb25hbDogcmV3cml0ZSBwYXRoIGlmIG5lZWRlZCAgXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5cblxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVAsT0FBTyxtQkFBbUI7QUFDN1EsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLHNCQUFzQiw4QkFBOEI7QUFDN0QsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sYUFBYTtBQUNwQixPQUFPLGFBQWE7QUFDcEIsT0FBTyxlQUFlO0FBWitILElBQU0sMkNBQTJDO0FBZXRNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBRTFCLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixnQkFBZ0IsU0FBUztBQUN2QixnQkFBUSxJQUFJLFFBQVE7QUFBQSxNQUN0QjtB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
