/* eslint-env node */
/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use
 * only the ES6 features that are supported by your Node version.
 * https://node.green/
 */

// Configuration for your app — Quasar 2 / Vite
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

// app-vite v2 loads this file as ESM (it compiles it to .mjs), so use import
// syntax — CJS `require()` of quasar/wrappers / local files is not supported
// in the compiled output. The dotenv + package.json-version logic that used
// to live in src/boot/envparser.js is inlined here as ESM for the same reason.
import { configure } from 'quasar/wrappers'
import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'

const { version: APP_VERSION } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
)

// Quasar's build.env runs values through DefinePlugin (already stringified),
// so pass the RAW parsed values — pre-stringifying would double-wrap them.
const parsedEnv = dotenv.config().parsed || {}

export default configure(function (/* ctx */) {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    // Only runtime boot files are listed here. (.env parsing for build.env is
    // handled inline at the top of this file, not via a boot file.)
    boot: [
      'main',
      'backend',
      'customFiles',
      'design-system',
      'i18n',
      'axios',
      'apollo',
      'cookies',
      'socail_auth',
      'hello',
      'notify'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'material-icons',
      'mdi-v5'
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-build
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari16'],
        node: 'node18'
      },

      vueRouterMode: 'hash', // preserve existing hash URLs

      // app-vite v2 tree-shakes Vue's Options API by default. This codebase
      // still has many Options-API pages/components, so keep it enabled or
      // they silently render blank at runtime (no build error).
      vueOptionsAPI: true,

      // Spread the .env vars, then expose the package.json version as
      // process.env.APP_VERSION so the footer can show the deployed build.
      // Vite statically replaces this at build time.
      env: { ...parsedEnv, APP_VERSION },

      // https://v2.quasar.dev/quasar-cli-vite/handling-vite
      // extendViteConf (viteConf) {}
      // viteVuePluginOptions: {},

      vitePlugins: [
        // vite-plugin-eslint can be toggled on here if desired; left out
        // so dev boot isn't blocked by legacy ESLint warnings during the
        // migration window.
      ]
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-devServer
    devServer: {
      https: false,
      port: 8080,
      open: false, // don't auto-open; keeps CI & headless runs quiet
      // Proxy the API through the dev server so the browser treats it as
      // SAME-ORIGIN (localhost). `changeOrigin` sets the upstream Host header;
      // `cookieDomainRewrite: ''` strips the Set-Cookie Domain so session
      // cookies (sessionid/csrftoken) become first-party localhost cookies —
      // which means they're sent on requests and actually cleared on logout,
      // matching production (where the SPA is served from the API host). In dev
      // the app uses a RELATIVE API path (see src/utils/hostConfig.js) so these
      // requests hit this proxy instead of going cross-origin to stc.training.
      proxy: {
        '/api': {
          target: 'https://stc.training',
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: ''
        }
      }
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#property-framework
    framework: {
      iconSet: 'material-icons',
      lang: 'ar',
      config: {
        // Brand tokens mirror src/design-system/tokens.scss.
        // Royal Indigo is the locked primary (STC logo color).
        // Terracotta is the signature accent, used sparingly.
        brand: {
          primary:   '#322873',
          secondary: '#C1623C',
          accent:    '#C1623C',
          dark:      '#1B1410',
          positive:  '#5A8E3A',
          negative:  '#9E3524',
          info:      '#322873',
          warning:   '#B8862A'
        }
      },

      // Possible values for "importStrategy":
      // * 'auto'  - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'   - Manually specify what to import
      importStrategy: 'auto',

      // Quasar plugins — preserve the runtime list the existing app uses.
      plugins: [
        'Notify',
        'Loading',
        'Dialog',
        'LocalStorage',
        'SessionStorage',
        'BottomSheet'
      ]
    },

    // Motion is orchestrated via GSAP + ScrollTrigger (see design-system/motion).
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render']
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      manifest: {
        name: 'Medical training center',
        short_name: 'Medical Training Center',
        description: 'The First Medical Training Platform in Sudan, Africa and the Middle East',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#322873',
        icons: [
          { src: 'icons/logoB.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/logoB.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/logoB.png', sizes: '256x256', type: 'image/png' },
          { src: 'icons/logoB.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/logoB.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'sabri_quasar_frontend'
      }
    }
  }
})
