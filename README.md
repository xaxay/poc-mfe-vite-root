# [Phase-3] Distributed Pure Single Page Application (SPA): Proof of Concept

## Introduction

A proof of concept for a Distributed SPA, enabling separate teams to develop and manage UI components independently.

It is full-fledged development version that is bases on

Vite / ImportMaps / HTML / JS / CSS / Vue3 / Vuetify3 / Pinia.

It is distributed on few repositories:

* [poc-mfe-vite-root](https://github.com/xaxay/poc-mfe-vite-root) 
* [poc-mfe-vite-header](https://github.com/xaxay/poc-mfe-vite-header) 
* [poc-mfe-vite-dashboard](https://github.com/xaxay/poc-mfe-vite-dashboard) 
* [poc-mfe-vite-admin](https://github.com/xaxay/poc-mfe-vite-admin) 

# Demo

[Click to see Demo](https://xaxay.github.io/poc-mfe-vite-root/)

It proves that it works and demonstrate how all these parts are initialized and interacted together from different in-browser modules!

For simplicity all modules are exposed from one repo!

## Installation

`yarn`

## Starting in development (serve) mode with enabled HMR

`yarn dev`

## Starting in production (build) mode

`yarn build`

`yarn preview`


## References
- [POC Distributed SPA : Phase-1](https://github.com/xaxay/poc-mfe-pure) Pure implementation without any bundler.
- [POC Distributed SPA : Phase 2](https://github.com/xaxay/poc-mfe-vite/) It is full-fledged development version.
- [POC Distributed SPA : Phase-3](https://github.com/xaxay/poc-mfe-vite-root) Using of multiple repositiories.

- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vuetify 3](https://next.vuetifyjs.com/en/)
- [Import Maps](https://github.com/WICG/import-maps)
- [Single-SPA](https://single-spa.js.org/)






