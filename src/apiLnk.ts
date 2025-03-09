import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { xpcSession } from './apiRouter';

const router = express.Router();

async function consumeLink(req: Request, res: Response) {
  if (!req.params.playerLink) {
    res.redirect('/');
    return;
  }

  const session = req.session as xpcSession;

  if (!session.deviceID) {
    session.deviceID = crypto.randomUUID();
  }

  const reqApi = await fetch(`${process.env.BASE_URL_API}/auth/pre_game/consume_link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerLink: req.params.playerLink,
      deviceId: session.deviceID,
    }),
  });

  if (reqApi.status === StatusCodes.OK) {
    const resApi = await reqApi.json();

    session.tok = resApi.jwtTok;
    session.username = resApi.player;
    session.userid = resApi.playerId;

    res.redirect(`/jogos/${resApi.gameId}`);
    return;
  } else {
    console.log({ playerLink: req.params.playerLink, deviceId: session.deviceID }, await reqApi.text());

    res.redirect('/');
    return;
  }
}

export default function () {
  router.get('/:playerLink', consumeLink);
  router.get('/:playerLink/:playerName', consumeLink);

  return router;
}
