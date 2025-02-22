import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

async function gameInfo(req: Request, res: Response) {
  if (!req.params.gameId || Number.isNaN(parseInt(req.params.gameId))) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo inválido!' }).end();
  }

  try {
    const reqApi = await fetch(`${process.env.BASE_URL_API}/game/info/${req.params.gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      resApi.readonly = false;

      if (req.session.userid == resApi.player2Id) {
        [resApi.player1Id, resApi.player2Id] = [resApi.player2Id, resApi.player1Id];
        [resApi.player1, resApi.player2] = [resApi.player2, resApi.player1];
        [resApi.player1Score, resApi.player2Score] = [resApi.player2Score, resApi.player1Score];
      } else if (req.session.userid != resApi.player1Id && req.session.userid != resApi.player2Id) {
        resApi.readonly = true;
      }

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else if (reqApi.status === StatusCodes.FORBIDDEN) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Acesso apenas ao jogo do link!' }).end();
    } else {
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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
    const reqApi = await fetch(`${process.env.BASE_URL_API}/round/last/${req.params.gameId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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
    const reqApi = await fetch(`${process.env.BASE_URL_API}/turn/check/${req.params.roundId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.tok}`,
      },
    });

    if (reqApi.status === StatusCodes.OK) {
      const resApi = await reqApi.json();

      return res.status(StatusCodes.OK).json(resApi).end();
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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
      } else if (resApi.message === 'Elevation needs a answer!') {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Responda nos botões para jogar!' }).end();  
      } else {
        console.log(resApi);
        return res.status(StatusCodes.CONFLICT).json({ message: 'Mensagem de erro não tratada!' }).end();
      }
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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

      if (resApi.message === 'Round already finished!') {
        return res.status(StatusCodes.OK).json({ message: 'kokok' }).end();
      } else {
        console.log(resApi);
        return res.status(StatusCodes.CONFLICT).json({ message: 'Mensagem de erro não tratada!' }).end();
      }
    } else if (reqApi.status === StatusCodes.NOT_FOUND) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Jogo não encontrado!' }).end();
    } else if (reqApi.status === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Deve estar autenticado!' }).end();
    } else {
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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
        Authorization: `Bearer ${process.env.TEMP_TOKEN_XT_ADMIN}`,
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
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function listPreAuthGame(req: Request, res: Response) {
  try {
    const reqApi = await fetch(`${process.env.BASE_URL_API}/auth/pre_game/list`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TEMP_TOKEN_XT_ADMIN}`,
        'Content-Type': 'application/json',
      },
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
      const resApi = await reqApi.text();

      return res.status(reqApi.status).send(resApi).end();
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
  router.get('/auth/pre_game/list', listPreAuthGame);

  return router;
}
