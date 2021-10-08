import fs from 'fs/promises';
import path from 'path';
import express from 'express';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  router.get('/cells', async (req, res) => {
    const fullPath = path.join(dir, filename);

    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });

      res.send(JSON.parse(result));
    } catch (error: any) {
      // Check if error says file doesn't exist
      if (error.code === 'ENOENT') {
        // Create a file and add default cells
        const defaultCells: Cell[] = [
          { id: '121', type: 'text', content: 'aha' },
        ];
        await fs.writeFile(fullPath, JSON.stringify(defaultCells), 'utf-8');

        res.send(defaultCells);
      } else {
        throw error;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;

    await fs.writeFile(
      path.join(dir, filename),
      JSON.stringify(cells),
      'utf-8'
    );

    res.send({ status: 'ok' });
  });

  return router;
};
