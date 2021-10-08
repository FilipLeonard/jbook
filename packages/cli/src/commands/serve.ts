import path from 'path';

import { Command } from 'commander';
import { serve } from '@jsnippet/local-api';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]') //[optional]
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005') //<required>
  .action(async (filename = 'notebook.js', { port }: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));

      await serve(
        Number.parseInt(port),
        path.basename(filename),
        dir,
        !isProduction
      );

      console.log(
        `Opened ${filename}. Navigate to http://localhost:${port} to edit the file.`
      );
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.error('Port is in use, try running on a different port.');
      } else {
        console.log(error.message);
      }

      process.exit(1);
    }
  });
