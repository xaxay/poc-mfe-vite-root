// vite-plugin-import-maps.ts
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { Plugin } from 'vite';
import { join } from 'path';
import { NormalizedOutputOptions, OutputBundle, OutputChunk, OutputAsset } from 'rollup';

type CssAsset = {
  content: string;
  file: string;
};

export function vueBuildInjectedCss(): Plugin {
  const cssInjections: { [jsFileName: string]: CssAsset[] } = {};

  let outputDir;

  return {
    name: 'vite-plugin-vue-build-injected-css',

    generateBundle(options: NormalizedOutputOptions, bundle: OutputBundle, isWrite: boolean) {
      const cssFiles: { [fileName: string]: OutputAsset } = {};
      const jsFiles: { [fileName: string]: OutputChunk } = {};
      outputDir = options.dir || 'dist'; // Use options.dir or fallback to 'dist'

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && fileName.endsWith('.css')) {
          cssFiles[fileName] = chunk;
        } else if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
          jsFiles[fileName] = chunk;
        }
      }

      for (const [jsFileName, jsChunk] of Object.entries(jsFiles)) {
        if (jsChunk.viteMetadata?.importedCss) {
          for (const cssFileName of jsChunk.viteMetadata.importedCss) {
            const cssFile: OutputAsset = cssFiles[cssFileName];
            if (cssFile) {
              if (!cssInjections[jsFileName]) {
                cssInjections[jsFileName] = [];
              }
              const cssAsset: CssAsset = { content: `${cssFile.source}`, file: join(outputDir, cssFileName) };
              cssInjections[jsFileName].push(cssAsset);
            }
          }
        }
      }
    },

    closeBundle() {
      for (const [jsFileName, cssAssets] of Object.entries(cssInjections)) {
        const jsFilePath = join(outputDir, jsFileName);
        const jsFileExists = existsSync(jsFilePath);
        if (jsFileExists) {
          const jsContent = readFileSync(jsFilePath, 'utf8');
          let updatedJsContent = jsContent
            .replace('}from"vue";', ',onMounted as onM, onUnmounted as onU}from"vue";')
            .replace(/setup\((\w*)\){/, `setup($1){let sE;onM(()=>{sE=document.createElement('style');sE.textContent=\`${cssAssets.map(a=>a.content).join('\n')}\`;document.head.appendChild(sE);});onU(()=>{if(sE){document.head.removeChild(sE);}});`);
          writeFileSync(jsFilePath, updatedJsContent, 'utf8');
          cssAssets.forEach(cssAsset => {
            console.log('removing injected styles', cssAsset.file);
            rmSync(cssAsset.file, { force: true });
          });
        }
      }
    },
  };
}
