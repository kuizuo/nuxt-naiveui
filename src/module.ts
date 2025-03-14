import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  extendViteConfig,
  addImportsDir,
  addComponent,
} from "@nuxt/kit";
import { fileURLToPath } from "url";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import type { ThemeConfig } from "./runtime/types";
export type { NavbarRoute, ThemeConfig } from "./runtime/types";

// Module options TypeScript inteface definition
export interface ModuleOptions {
  defaultThemeConfig?: ThemeConfig;
  defaultColorMode: "light" | "dark" | "system";
  defaultIconSize: number;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bg-dev/nuxt-naiveui",
    configKey: "naiveui",
  },

  // Default configuration options of the Nuxt module
  defaults: {
    defaultColorMode: "system",
    defaultIconSize: 20,
  },

  // Add types for volar
  hooks: {
    "prepare:types": ({ tsConfig, references }) => {
      tsConfig.compilerOptions!.types.push("naive-ui/volar")
      references.push({
        types: "naive-ui/volar",
      })
    },
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve(runtimeDir, "naive.server"));

    // Add composables directory
    addImportsDir(resolve(runtimeDir, "composables"));

    // Add components
    addComponent({
      name: "NaiveConfig",
      filePath: resolve(runtimeDir, "components", "NaiveConfig.vue"),
    });
    addComponent({
      name: "NaiveNavbar",
      filePath: resolve(runtimeDir, "components", "NaiveNavbar.vue"),
    });
    addComponent({
      name: "NaiveIcon",
      filePath: resolve(runtimeDir, "components", "NaiveIcon.vue"),
    });
    addComponent({
      name: "NaiveColorModeSwitch",
      filePath: resolve(runtimeDir, "components", "NaiveColorModeSwitch.vue"),
    });

    // Pass module options to runtimeConfig object
    nuxt.options.runtimeConfig.public.naiveui = options;

    // Add auto import for naive components & composables
    // https://www.naiveui.com/en-US/os-theme/docs/ssr
    extendViteConfig((config) => {
      config.plugins?.push(
        AutoImport({
          imports: [
            {
              "naive-ui": [
                "useDialog",
                "useMessage",
                "useNotification",
                "useLoadingBar",
                "useThemeVars",
                "useDialogReactiveList",
                "useOsTheme",
              ],
            },
          ],
        }),
        Components({
          resolvers: [NaiveUiResolver()],
        })
      );

      // if (process.env.NODE_ENV === "development") {
      //   config.optimizeDeps = config.optimizeDeps || {};
      //   config.optimizeDeps.include = config.optimizeDeps.include || [];
      //   config.optimizeDeps.include.push(
      //     "naive-ui",
      //     "vueuc",
      //     "date-fns-tz/esm/formatInTimeZone"
      //   );
      // }
    });

    // Transpile naive modules
    if (process.env.NODE_ENV === "production") {
      nuxt.options.build.transpile.push(
        "naive-ui",
        "vueuc",
        "@css-render/vue3-ssr",
        "@juggle/resize-observer"
      );
    } else {
      nuxt.options.build.transpile.push("@juggle/resize-observer");
    }
  },
});
