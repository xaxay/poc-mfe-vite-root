// vite.config.mts
import { ConfigEnv, Plugin, UserConfig } from 'vite';
import Vue from '@vitejs/plugin-vue'
import baseUrl from './src/config/baseUrl';

// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'


// It is customized version that allows to handle `autoImport: true` for case 
// when import map is reffered to vuetify as single file esm browser module from CDN. 
// and inject CSS into JS
import vuetify, { transformAssetUrls } from './vite-plugin-vuetify-browser'

import { defaultImportMapsConfig, ImportMapsPlugin } from './vite-plugin-import-maps';
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

import { vueBuildInjectedCss } from './vite-plugin-vue-build-injected-css';
import path from 'path';
import fs from 'fs';

// import rewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
const config = defineConfig((env: ConfigEnv) => { 

  return {
    base: baseUrl,

    plugins: [

  
      Vue({
        template: { transformAssetUrls },
      }),


      vueBuildInjectedCss(),

      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      vuetify({
        autoImport: true,
        styles: 'sass',
        injectCSS: true
      }),

      ImportMapsPlugin({
        ...defaultImportMapsConfig,

        entryTemplate: 'assets/[name]-[hash].[ext]',
        assetTemplate: 'assets/[name]-[hash].[ext]',
        chunckTemplate: 'assets/[name]-[hash].js',
      }),

      {
        name: 'log-config-plugin',
        configResolved(config) {
          // const outputPath = path.resolve(__dirname, `vite-config-${env.command === 'serve' ? 'dev' : 'build'}-actual.json`);
          const outputPath = path.resolve(__dirname, `vite-config-actual.json`);
          fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
          console.log(`Result Vite configuration has been written to ${outputPath}`);
        }
      } as Plugin,
    ],

    define: { 'process.env': {} },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },

    server: {
      port: 5001,
      historyApiFallback: true
    },

    preview: {
      port: 6001,
    },

    build: {
      // minify: false,

      outDir: 'docs',

      rollupOptions: {
        output: {
          // inlineDynamicImports: true
        }
      }
    }
  } as UserConfig;
})


export default config;