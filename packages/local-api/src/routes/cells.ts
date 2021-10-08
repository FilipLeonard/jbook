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
          {
            id: 'n2oo7',
            type: 'text',
            content:
              "# JSnippet\n\n**JSnippet** is a locally running `javascript` and `markdown` playground. You can edit any cell (including this one) by clicking inside it. You can also add more cells, delete, resize and move them up/down.\n\nYou can execute `javascript` and `jsx` and use the custom function `show` to display values and jsx elements. \n\nAll the content is read from and stored to a file provided at the command line (`npx jsnippet serve my-notes.js`), at the terminal's current path. If not provided, default file name is `notebook.js`.",
          },
          {
            id: '1f25h',
            type: 'code',
            content:
              'const Button = ({ label, onClick }) => {\n  return <button onClick={onClick}>{label}</button>\n};\n\nshow(<Button label="Click me"/>);',
          },
          {
            id: 'nl88t',
            type: 'text',
            content: 'You can reference variables defined in previous cells. ',
          },
          {
            id: 'o0g0x',
            type: 'code',
            content:
              "import { useState } from 'react';\n\nconst App = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div\n      style={{ display: 'flex', justifyContent: 'space-around', width: '30%' }}\n    >\n      <Button label=\"-\" onClick={() => setCount(count - 1)}/>\n      <div>{count}</div>\n      <Button label=\"+\" onClick={() => setCount(count + 1)} />\n    </div>\n  );\n};\n\nshow(<App />);",
          },
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

const randomId = () => Math.random().toString(36).substr(2, 5);
