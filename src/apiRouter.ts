import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

async function gameInfo(req: Request, res: Response) {
  if (!req.params.gameId || Number.isNaN(parseInt(req.params.gameId))) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo inválido!' }).end();
  }

  try {
    const req_api = await fetch(`${process.env.BASE_URL_API}/game/info/${req.params.gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (req_api.status === StatusCodes.OK) {
      const res_api = await req_api.json();

      res_api.readonly = false;

      if (req.session.userid == res_api.player2Id) {
        [res_api.player1Id, res_api.player2Id] = [res_api.player2Id, res_api.player1Id];
        [res_api.player1, res_api.player2] = [res_api.player2, res_api.player1];
        [res_api.player1Score, res_api.player2Score] = [res_api.player2Score, res_api.player1Score];
      } else if (req.session.userid != res_api.player1Id && req.session.userid != res_api.player2Id) {
        res_api.readonly = true;
      }

      return res.status(StatusCodes.OK).json(res_api).end();
    } else if (req_api.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (req_api.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await req_api.text();

      return res.status(req_api.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function roundLast(req: Request, res: Response) {
  if (!req.params.gameId || Number.isNaN(parseInt(req.params.gameId))) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo inválido!' }).end();
  }

  try {
    const req_api = await fetch(`${process.env.BASE_URL_API}/round/last/${req.params.gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (req_api.status === StatusCodes.OK) {
      const res_api = await req_api.json();

      return res.status(StatusCodes.OK).json(res_api).end();
    } else if (req_api.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (req_api.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await req_api.text();

      return res.status(req_api.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function checkRound(req: Request, res: Response) {
  if (!req.params.roundId || Number.isNaN(parseInt(req.params.roundId))) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo inválido!' }).end();
  }

  try {
    const req_api = await fetch(`${process.env.BASE_URL_API}/turn/check/${req.params.roundId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (req_api.status === StatusCodes.OK) {
      const res_api = await req_api.json();

      return res.status(StatusCodes.OK).json(res_api).end();
    } else if (req_api.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (req_api.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await req_api.text();

      return res.status(req_api.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function playTurn(req: Request, res: Response) {
  try {
    const reqApi = await fetch(`${process.env.BASE_URL_API}/turn/play`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.CONFLICT) {
      const resApi = await reqApi.json();

      if (resApi.message === 'Not your turn!') {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Não é sua vez!' }).end();
      } else if (resApi.message === 'Round is over!') {
        return res.status(StatusCodes.CONFLICT).json({ message: 'A mão encerrou!' }).end();
      } else {
        console.log(resApi);
        return res.status(StatusCodes.CONFLICT).json({ message: 'Mensagem de erro não tratada!' }).end();
      }
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await reqApi.text();

      return res.status(reqApi.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function finishRound(req: Request, res: Response) {
  try {
    const reqApi = await fetch(`${process.env.BASE_URL_API}/round/end`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.CONFLICT) {
      const resApi = await reqApi.json();

      if (resApi.message === 'xxx') {
        return res.status(StatusCodes.CONFLICT).json({ message: 'xxx' }).end();
      } else {
        console.log(resApi);
        return res.status(StatusCodes.CONFLICT).json({ message: 'Mensagem de erro não tratada!' }).end();
      }
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await reqApi.text();

      return res.status(reqApi.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function newPreAuthGame(req: Request, res: Response) {
  try {
    const reqApi = await fetch(`${process.env.BASE_URL_API}/auth/pre_game/new`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh0LWFkbWluIiwidXNlcklkIjoyMiwiaWF0IjoxNzM4NDQ3NTEzLCJleHAiOjE3Mzg3MDY3MTN9.w-DT8hf5VeYkfYlI7NyKfIT4vCBWqOth9FKegrZ7eSk`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.CONFLICT) {
      const resApi = await reqApi.json();

      if (resApi.message === 'xxx') {
        return res.status(StatusCodes.CONFLICT).json({ message: 'xxx' }).end();
      } else {
        console.log(resApi);
        return res.status(StatusCodes.CONFLICT).json({ message: 'Mensagem de erro não tratada!' }).end();
      }
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Usuário(s) não encontrados!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const res_api = await reqApi.text();

      return res.status(reqApi.status).send(res_api).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default function apiTrucoRouter() {
  router.get('/game/info/:gameId', gameInfo);
  router.get('/round/last/:gameId', roundLast);
  router.get('/turn/check/:roundId', checkRound);

  router.post('/turn/play', playTurn);
  router.post('/round/end', finishRound);
  router.post('/auth/pre_game/new', newPreAuthGame);

  return router;
}
