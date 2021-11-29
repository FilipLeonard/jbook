# JSnippet - In Browser JavaScript Playground

This repo is the main project from [this Udemy course](https://ict.udemy.com/course/react-and-typescript-build-a-portfolio-project/). It's composed of three separate packages published as NPM modules and orchestrated with Lerna:

- `@jsnippet/local-client`
  - React app that renders cells of two types
  - code cells (using `monaco-editor`)
  - Markdown cells (using `@uiw/react-md-editor`)
  - JavaScript is bundled using `esbuild-wasm`
  - Redux for state management
- `@jsnippet/local-api`
  - uses `@jsnippet/local-client` as a dependency
  - Express app that serves the React app and also exposes `GET` and `POST` endpoints to persist the cells contents
- `jsnippet`
  - uses `@jsnippet/local-client` and `@jsnippet/local-client` as dependencies
  - a Node CLI that glues everything together
  - run it like this `npx jsnippet serve my-snippets.js`
  - adding `-p <OTHER_PORT>` serves the React app on <OTHER_PORT>
