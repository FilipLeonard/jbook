import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({ name: 'filecache' });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /\.css$/ }, async args => {
        const { data, request } = await axios.get(args.path);
        const baseDirForOtherFiles = new URL('./', request.responseURL)
          .pathname;

        const contents = generateEscapedInjectableCSS(data);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: baseDirForOtherFiles,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);
        const baseDirForOtherFiles = new URL('./', request.responseURL)
          .pathname;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: baseDirForOtherFiles,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};

const generateEscapedInjectableCSS = (cssData: string) => {
  const escaped = cssData
    .replace(/\n/g, '')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  return `
	const style = document.createElement('style');
	style.innerText = '${escaped}';
	document.head.appendChild(style);
	`;
};
