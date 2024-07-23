// vite-plugin-vuetify-browser.ts 
import { capitalize, camelize } from 'vue';
import { createRequire } from 'node:module';
import { resolveVuetifyBase, isObject, normalizePath, includes, transformAssetUrls } from '@vuetify/loader-shared';
export { transformAssetUrls } from '@vuetify/loader-shared';
import { extname } from 'path';
import { URLSearchParams } from 'url';
import path from 'upath';
import chalk from 'chalk';

interface Match {
  [0]: string;
  [1]: string;
  [2]: string;
  index: number;
}

function parseTemplate(source) {
  const components = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveComponent\("([\w-.]+)"\);?/gm));
  const directives = createSet(source.matchAll(/(?:var|const) (\w+) = _resolveDirective\("([\w-.]+)"\);?/gm));
  return { components, directives };
}

function createSet(matches: Match[]) {
  return new Set(Array.from(matches, (i: Match) => ({
    symbol: i[1],
    name: capitalize(camelize(i[2])),
    index: i.index,
    length: i[0].length
  })));
}

const require$1 = createRequire(import.meta.url);
const importMap = require$1("vuetify/dist/json/importMap.json");
const importMapLabs = require$1("vuetify/dist/json/importMap-labs.json");

function getImports(source, options) {
  const { components, directives } = parseTemplate(source);
  const resolvedComponents = [];
  const resolvedDirectives = [];
  const imports = new Map();
  const ignore = isObject(options.autoImport) && options.autoImport.ignore || null;
  const includeLabs = isObject(options.autoImport) && options.autoImport.labs;
  const map = includeLabs ? {
    components: { ...importMap.components, ...importMapLabs.components },
    directives: importMap.directives
  } : importMap;

  if (components.size || directives.size) {
    components.forEach((component) => {
      if (ignore?.includes(component.name)) return;
      if (component.name in importMap.components) {
        resolvedComponents.push(component);
      } else if (includeLabs && component.name in importMapLabs.components) {
        resolvedComponents.push(component);
      }
    });

    directives.forEach((directive) => {
      if (importMap.directives.includes(directive.name) && !ignore?.includes(directive.name)) {
        resolvedDirectives.push(directive);
      }
    });
  }

  resolvedComponents.forEach((component) => {
    addImport(imports, component.name, component.symbol, "vuetify");
  });
  resolvedDirectives.forEach((directive) => {
    addImport(imports, directive.name, directive.symbol, "vuetify");
  });

  return {
    imports,
    components: resolvedComponents,
    directives: resolvedDirectives
  };
}

function addImport(imports, name, as, from) {
  if (!imports.has(from)) {
    imports.set(from, []);
  }
  imports.get(from).push(`${name} as ${as}`);
}

function generateImports(source, options) {
  const { components, directives } = getImports(source, options);
  let code = "";

  if (components.length || directives.length) {
    if (components.length) {
      const line = `import { components as vuetify_components } from 'vuetify';`;
      code += `\n${line}\n`;
      // console.log(chalk.bold.green("[+]"), chalk.green(line));
    }
    if (directives.length) {
      const line = `import { directives as vuetify_directives } from 'vuetify';`;
      code += `\n${line}\n`;
      // console.log(chalk.bold.green("[+]"), chalk.green(line));
    }

    const allComponentImports = components.map(item => `${item.name} : ${item.symbol}`).join(', ');
    const allDirectiveImports = directives.map(item => `${item.name} : ${item.symbol}`).join(', ');

    if (allComponentImports) {
      const line = `const { ${allComponentImports} } = vuetify_components;`;
      code += `${line}\n`;
      // console.log(chalk.bold.green("[+]"), chalk.green(line));
    }

    if (allDirectiveImports) {
      const line = `const { ${allDirectiveImports} } = vuetify_directives;`;
      code += `${line}\n`;
      // console.log(chalk.bold.green("[+]"), chalk.green(line));
    }

    source = [...components, ...directives].reduce((acc, v) => {
      return acc.slice(0, v.index) + " ".repeat(v.length) + acc.slice(v.index + v.length);
    }, source);

    if (!source.includes("_resolveComponent(")) {
      source = source.replace("resolveComponent as _resolveComponent, ", "");
    }
    if (!source.includes("_resolveDirective(")) {
      source = source.replace("resolveDirective as _resolveDirective, ", "");
    }
  }

  return { code, source };
}

function parseId(id) {
  const [pathname, query] = id.split("?");
  return {
    query: query ? Object.fromEntries(new URLSearchParams(query)) : null,
    path: pathname ?? id
  };
}

function importPlugin(options) {
  return {
    name: "vuetify:import-browser",
    configResolved(config) {
      if (config.plugins.findIndex((plugin) => plugin.name === "vuetify:import-browser") < config.plugins.findIndex((plugin) => plugin.name === "vite:vue")) {
        throw new Error("Vuetify plugin must be loaded after the vue plugin");
      }
    },
    async transform(code, id) {
      const { query, path } = parseId(id);
      if ((!query || !("vue" in query)) && extname(path) === ".vue" && !/^import { render as _sfc_render } from ".*"$/m.test(code) || query && "vue" in query && (query.type === "template" || query.type === "script" && query.setup === "true")) {
        const { code: imports, source } = generateImports(code, options);
        const result = {
          code: imports + source,
          map: null
        };
        return result;
      }
      return null;
    }
  };
}

function isSubdir(root, test) {
  const relative = path.relative(root, test);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function stylesPlugin(options) {
  const vuetifyBase = resolveVuetifyBase();
  let configFile;
  const tempFiles = new Map();
  
  return {
    name: "vuetify:styles",
    enforce: "pre",
    configResolved(config) {
      if (isObject(options.styles)) {
        if (path.isAbsolute(options.styles.configFile)) {
          configFile = options.styles.configFile;
        } else {
          configFile = path.join(config.root || process.cwd(), options.styles.configFile);
        }
      }
    },
    async resolveId(source, importer, objWithCustom: { custom: any}) {
      if (source === "vuetify/styles" || importer && source.endsWith(".css") && isSubdir(vuetifyBase, path.isAbsolute(source) ? source : importer)) {
        if (options.styles === "none") {
          return "\0__void__";
        } else if (options.styles === "sass") {
          const target = source.replace(/\.css$/, ".sass");
          return this.resolve(target, importer, { skipSelf: true, custom: objWithCustom.custom });
        } else if (isObject(options.styles)) {
          const resolution = await this.resolve(source, importer, { skipSelf: true, custom: objWithCustom.custom });
          if (!resolution)
            return null;
          const target = resolution.id.replace(/\.css$/, ".sass");
          const file = path.relative(path.join(vuetifyBase, "lib"), target);
          const contents = `@use "${normalizePath(configFile)}"
@use "${normalizePath(target)}"`;
          tempFiles.set(file, contents);
          return `\0plugin-vuetify:${file}`;
        }
      } else if (source.startsWith("/plugin-vuetify:")) {
        return "\0" + source.slice(1);
      } else if (source.startsWith("/@id/__x00__plugin-vuetify:")) {
        return "\0" + source.slice(12);
      }
      return null;
    },
    load(id) {
      if (/^\0__void__(\?.*)?$/.test(id)) {
        return "";
      }
      if (id.startsWith("\0plugin-vuetify")) {
        const file = /^\0plugin-vuetify:(.*?)(\?.*)?$/.exec(id)[1];
        return tempFiles.get(file);
      }
      return null;
    },
  };
}

function vuetify(_options = {}) {

  const options = {
    autoImport: true,
    styles: true,
    injectCSS: true,
    ..._options
  };


  const plugins = [];
  if (options.autoImport) {
    plugins.push(importPlugin(options));
  }
  if (includes(["none", "sass"], options.styles) || isObject(options.styles)) {
    plugins.push(stylesPlugin(options));
  }
  return plugins;
}

vuetify.transformAssetUrls = transformAssetUrls;

export { vuetify as default };
