import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

async function consumeLink(req: Request, res: Response) {  

    if (!req.params.playerLink) {
      res.redirect('/');
      return;
    }

    if (!req.session.deviceID) {
      req.session.deviceID = crypto.randomUUID();
    }    

    try {
      const reqApi = await fetch(`${process.env.BASE_URL_API}/auth/pre_game/consume_link`, {
        method: 'POST',      
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          playerLink: req.params.playerLink,
          deviceId: req.session.deviceID
        })
      });  
  
      if (reqApi.status === StatusCodes.OK) {
        const resApi = await reqApi.json();
        
        req.session.tok = resApi.jwtTok;
        req.session.username = resApi.player;
        req.session.userid = resApi.playerId;
  
        res.redirect(`/jogos/${resApi.gameId}`);
        return;
  
      } else {
        console.log({ playerLink: req.params.playerLink, deviceId: req.session.deviceID }, await reqApi.text());
  
        res.redirect('/');
        return;
      }
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }       
  }

export default function() 
{
  router.get('/:playerLink', consumeLink);
  router.get('/:playerLink/:playerName', consumeLink);

  return router;
}