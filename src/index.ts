import express, { Request, Response } from 'express';
import http from 'node:http';
import path, { dirname } from 'node:path';

const app = express();

app.use('/static', express.static(path.resolve(import.meta.dirname, '../spa', 'static')));

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(import.meta.dirname, '../spa', 'index.html'));
});

const server = http.createServer(app);

server.listen(7778, () => {
  console.log('xpdDeck-Truco Front running');
});
