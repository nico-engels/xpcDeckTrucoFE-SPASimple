import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import express, { Request, Response } from 'express';
import http from 'node:http';
import https from 'node:https';
import path, { dirname } from 'node:path';
import session from 'express-session';

import apiLnk from './apiLnk.ts';
import apiRouter from './apiRouter.ts';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
    },
  }),
);
app.use('/static', express.static(path.resolve(import.meta.dirname, '../spa', 'static')));
app.use('/api-truco/', apiRouter());
app.use('/lnk/', apiLnk());

app.get('/*', (req: Request, res: Response) => {
  if (!req.session.deviceID) {
    req.session.deviceID = crypto.randomUUID();
  }

  res.sendFile(path.resolve(import.meta.dirname, '../spa', 'index.html'));
});

const privateKey = fs.readFileSync('rec/sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('rec/sslcert/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server_https = https.createServer(credentials, app);
const server_http = http.createServer(app);

server_https.listen(7779, () => {
  console.log('xpdDeck-Truco Front running (7779 https)');
});

server_http.listen(7780, () => {
  console.log('xpdDeck-Truco Front running (7780 http)');
});
