### NPM Publishing

- make sure package name is unique (via npmjs.com)
- specify which files should be sent to NPM
  - `"files": ["dist"]`
- split 'dependencies' and 'devDependencies'
- set package to be publicly accesible
  - `"publishConfig": { "access": "public" }`
- if building a cli, configure the file to run
  - `"bin": "dist/index.js"`
  - `#!/usr/bin/env node` allows us to directly execute this file (e.g. without writing `node index.js`)
- add a 'prePublish' script
  - `"prepublishOnly": "npm run build"`
- optional: commit to git
- run `npm publish` (must be logged in)
