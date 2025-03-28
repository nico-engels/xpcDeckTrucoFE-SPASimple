import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
import fs from 'fs';
import express, { ErrorRequestHandler, Request, Response } from 'express';
import 'express-async-errors';
import session from 'express-session';
import { StatusCodes } from 'http-status-codes';
import http from 'node:http';
import https from 'node:https';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import apiLnk from './apiLnk.ts';
import apiRouter, { xpcSession } from './apiRouter.ts';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: `${process.env.COOKIE_SCRT}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
    },
  }),
);

if (!import.meta.dirname) import.meta.dirname = dirname(fileURLToPath(import.meta.url));

const privateKey = fs.readFileSync('rec/sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('rec/sslcert/selfsigned.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server_https = https.createServer(credentials, app);
const server_http = http.createServer(app);

app.use('/static', express.static(path.resolve(import.meta.dirname, '../spa', 'static')));
app.use('/api-truco/', apiRouter());
app.use('/lnk/', apiLnk());

app.get('/*', (req: Request, res: Response) => {
  const session = req.session as xpcSession;
  if (!session.deviceID) {
    session.deviceID = crypto.randomUUID();
  }

  res.sendFile(path.resolve(import.meta.dirname, '../spa', 'index.html'));
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`Error handler xpdDeck-Truco: ${err.stack}`);
  res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};

app.use(errorHandler);

const http_port = process.env.HTTP_PORT || 7779;
const https_port = process.env.HTTPS_PORT || 7780;

server_https.listen(https_port, () => {
  console.log(`xpcDeck-Truco Front running (${https_port} https)`);
});

server_http.listen(http_port, () => {
  console.log(`xpcDeck-Truco Front running (${http_port} http)`);
});
