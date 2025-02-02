import AbstractView from './abstractview.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.setTitle('xpcDeckTruco | Jogo');
  }

  getHtml() {
    return `
    <div id="all">
      <div id="header">
        <div id="player_2_name_round">
          <p id="player_2_name_p">-</p>
          <p id="player_2_round_p">#- > -</p>
        </div>    
        <div id="header_area">
          <div id="player_2_cards">
            <div id="player_2_cards_1" class="card">   
              <img id="player_2_cards_1_img" class="card-img" src="/static/img/Minicard_back.svg" />           
            </div>
            <div id="player_2_cards_2" class="card">              
              <img id="player_2_cards_2_img" class="card-img" src="/static/img/Minicard_back.svg" />
            </div>
            <div id="player_2_cards_3" class="card">              
              <img id="player_2_cards_3_img" class="card-img" src="/static/img/Minicard_back.svg" />
            </div>
          </div>
          <div id="msg_area">
            <div id="msg">
              <textarea id="msg_text" readonly>> Carregando jogo...</textarea>
            </div>
          </div>
        </div>
      </div>
      <div id="middle">
        <div id="game_table">
          <div id="trump">
            <div id="trump_area">                  
              <div></div>
              <div>
                <div id="trump_card" class="card">
                  <img id="trump_card_img" class="card-img" src="" style="display: none"/>
                </div>
                <div id="trump_deck">
                  <img id="trump_deck_img" class="card-img" src="/static/img/Minicard_back.svg" />
                </div>                
              </div>
              <div></div>              
            </div>  
          </div>  
          <div id="turns">
            <div id="turns_area">
              <div id="turn_3" class="turn">
                <div>
                  <p class="turn-label">Rodada 3</p>
                </div>
                <div id="turn_3_cards" class="turn-cards">
                  <div id="turn_3_card_1" class="card turn-card">
                    <img id="turn_3_card_1_img" class="card-img" src="" style="display: none" />
                  </div>
                  <div id="turn_3_card_2" class="card turn-card">
                    <img id="turn_3_card_2_img" class="card-img" src="" style="display: none" />
                  </div>
                </div>
                <div></div>
              </div>
              <div id="turn_2" class="turn">
                <div>
                  <p class="turn-label">Rodada 2</p>
                </div>
                <div id="turn_2_cards" class="turn-cards">
                  <div id="turn_2_card_1" class="card turn-card">
                    <img id="turn_2_card_1_img" class="card-img" src="" style="display: none" />
                  </div>
                  <div id="turn_2_card_2" class="card turn-card">
                    <img id="turn_2_card_2_img" class="card-img" src="" style="display: none" />
                  </div>
                </div>
                <div></div>
              </div>
              <div id="turn_1" class="turn">
                <div>
                  <p class="turn-label">Rodada 1</p>
                </div>
                <div id="turn_1_cards" class="turn-cards">
                  <div id="turn_1_card_1" class="card turn-card">
                    <img id="turn_1_card_1_img" class="card-img" src="" style="display: none" />
                  </div>
                  <div id="turn_1_card_2" class="card turn-card">
                    <img id="turn_1_card_2_img" class="card-img" src="" style="display: none" />
                  </div>
                </div>  
                <div></div>
              </div>
            </div>  
          </div>  
          <div id="score">
            <div></div>
            <div id="score_area">
              <div id="score_text">
                <p id="score_text_p2">-</p>
                <p id="score_text_x">x</p>
                <p id="score_text_p1">-</p>
                <p id="score_text_s">--</p>
              </div>
            </div>
            <div></div>
          </div>  
        </div>
      </div>        
      <div id="footer">
        <div id="player_1_controls">
          <div id="player_1_buttons">
            <div id="player_1_buttons_1">
              <button id="player_1_buttons_1_btn" class="btn" disabled>Sem ação</button>
            </div>  
            <div id="player_1_buttons_2">
              <button id="player_1_buttons_2_btn" class="btn" disabled>Sem ação</button>
            </div>
            <div id="player_1_buttons_3">
              <button id="player_1_buttons_3_btn" class="btn" disabled>Sem ação</button>
            </div>
            <div id="player_1_buttons_4">
              <button id="player_1_buttons_4_btn" class="btn" disabled>Sem ação</button>
            </div>
          </div>
          <div id="player_1_cards">
            <div id="player_1_cards_1" class="card player1-card">
              <img id="player_1_cards_1_img" class="card-img" src="" style="display:none" />
            </div>
            <div id="player_1_cards_2" class="card player1-card">
              <img id="player_1_cards_2_img" class="card-img" src="" style="display:none" />
            </div>
            <div id="player_1_cards_3" class="card player1-card">
              <img id="player_1_cards_3_img" class="card-img" src="" style="display:none" />
            </div>
          </div>
        </div>
        <div id="player_1_name">
          <p id="player_1_name_p">-</p>
        </div>
      </div>  
    </div>
    `;
  }

  async consumeApi(url, requestCfg) {
    const req = await fetch(url, requestCfg);
    const resp = await req.text();

    if (req.status === 401 || req.status === 404 || req.status === 409) {
      document.getElementById('msg_text').value = `> ${JSON.parse(resp).message}\n${document.getElementById('msg_text').value}`;
      throw JSON.parse(resp).message;
    } else if (req.status === 200) {
      return JSON.parse(resp);
    }

    throw 'err';
  }

  mapCardArt(card) {
    const cardFmt = card.replace('♠', 'S').replace('♣', 'C').replace('♥', 'H').replace('♦', 'D');

    return `/static/img/Minicard_${cardFmt}.svg`;
  }

  playCardPage(card, playerOrd, round) {
    const cardSrc = this.mapCardArt(card);

    if (playerOrd === 1 && !this.readonly) {
      if (document.getElementById('player_1_cards_1_img').src.endsWith(cardSrc)) {
        document.getElementById('player_1_cards_1_img').style.display = 'none';
      } else if (document.getElementById('player_1_cards_2_img').src.endsWith(cardSrc)) {
        document.getElementById('player_1_cards_2_img').style.display = 'none';
      } else {
        document.getElementById('player_1_cards_3_img').style.display = 'none';
      }
    } else {
      document.getElementById(`player_${playerOrd}_cards_${round}_img`).style.display = 'none';
    }

    document.getElementById(`turn_${round}_card_${playerOrd}_img`).src = cardSrc;
    document.getElementById(`turn_${round}_card_${playerOrd}_img`).style.display = 'initial';
  }

  resetUI() {
    document.getElementById('turn_3_card_2_img').src = '';
    document.getElementById('turn_3_card_2_img').style.display = 'none';
    document.getElementById('turn_3_card_2_img').classList.remove(['turn-winner']);
    document.getElementById('turn_3_card_1_img').src = '';
    document.getElementById('turn_3_card_1_img').style.display = 'none';
    document.getElementById('turn_3_card_1_img').classList.remove(['turn-winner']);
    document.getElementById('turn_2_card_2_img').src = '';
    document.getElementById('turn_2_card_2_img').style.display = 'none';
    document.getElementById('turn_2_card_2_img').classList.remove(['turn-winner']);
    document.getElementById('turn_2_card_1_img').src = '';
    document.getElementById('turn_2_card_1_img').style.display = 'none';
    document.getElementById('turn_2_card_1_img').classList.remove(['turn-winner']);
    document.getElementById('turn_1_card_2_img').src = '';
    document.getElementById('turn_1_card_2_img').style.display = 'none';
    document.getElementById('turn_1_card_2_img').classList.remove(['turn-winner']);
    document.getElementById('turn_1_card_1_img').src = '';
    document.getElementById('turn_1_card_1_img').style.display = 'none';
    document.getElementById('turn_1_card_1_img').classList.remove(['turn-winner']);

    document.getElementById('player_2_cards_1_img').style.display = 'initial';
    document.getElementById('player_2_cards_2_img').style.display = 'initial';
    document.getElementById('player_2_cards_3_img').style.display = 'initial';

    this.enableActions([]);
  }

  enableActions(actions) {
    document.getElementById('player_1_buttons_1_btn').textContent = 'Sem ação';
    document.getElementById('player_1_buttons_1_btn').disabled = true;
    document.getElementById('player_1_buttons_1_btn').onclick = undefined;
    document.getElementById('player_1_buttons_2_btn').textContent = 'Sem ação';
    document.getElementById('player_1_buttons_2_btn').disabled = true;
    document.getElementById('player_1_buttons_2_btn').onclick = undefined;
    document.getElementById('player_1_buttons_3_btn').textContent = 'Sem ação';
    document.getElementById('player_1_buttons_3_btn').disabled = true;
    document.getElementById('player_1_buttons_3_btn').onclick = undefined;
    document.getElementById('player_1_buttons_4_btn').textContent = 'Sem ação';
    document.getElementById('player_1_buttons_4_btn').disabled = true;
    document.getElementById('player_1_buttons_4_btn').onclick = undefined;

    for (let i = 0; i < actions.length; i++) {
      const elem = document.getElementById(`player_1_buttons_${i + 1}_btn`);

      if (actions[i] === 'finishRound') {
        elem.textContent = 'Próxima mão';
        elem.disabled = false;
        elem.onclick = async () => {
          await this.consumeApi('/api-truco/round/end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              roundId: this.roundId,
            }),
          });

          clearInterval(this.interval);
          this.resetUI();
          await this.afterLoad();
        };
      }
    }
  }

  async loadGameInfo(gameId) {
    const gameInfo = await this.consumeApi(`/api-truco/game/info/${gameId}`, { method: 'GET' });

    if (!gameInfo) return;

    this.player1 = gameInfo.player1;
    this.player2 = gameInfo.player2;
    this.player1Id = gameInfo.player1Id;
    this.player2Id = gameInfo.player2Id;
    this.roundId = gameInfo.lastRoundId;
    this.readonly = gameInfo.readonly;
    this.turnSeq = 0;

    let msg = '';
    let p1nameSuf = '';
    let p2nameSuf = '';

    if (!gameInfo.readonly) {
      p1nameSuf = ' (você)';
      p2nameSuf = ' (oponente)';
    } else {
      msg = '> Você não participa desse jogo. Modo de visualização.\n' + msg;
    }

    document.getElementById('player_2_name_p').innerText = `${gameInfo.player2}${p2nameSuf}`;
    document.getElementById('score_text_p2').innerText = gameInfo.player2Score;
    document.getElementById('player_1_name_p').innerText = `${gameInfo.player1}${p1nameSuf}`;
    document.getElementById('score_text_p1').innerText = gameInfo.player1Score;

    document.getElementById('player_2_round_p').innerText = `#${gameInfo.id} > ${gameInfo.lastRoundSeq}`;

    const optFmtDate = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    let msg_ret = '';
    if (gameInfo.winnerPlayerId) {
      msg_ret += '> ';

      if (gameInfo.winnerPlayerId === gameInfo.player1Id) {
        msg_ret += gameInfo.player1;
      } else {
        msg_ret += gameInfo.player2;
      }
      msg_ret += ' ganhou o jogo em ' + new Date(gameInfo.endPlay).toLocaleString('pt-BR', optFmtDate) + '.\n';
    }

    msg = '> Jogo iniciado em ' + new Date(gameInfo.startPlay).toLocaleString('pt-BR', optFmtDate) + '.\n' + msg;

    document.getElementById('msg_text').value = `${msg}${document.getElementById('msg_text').value}`;

    return msg_ret;
  }

  async loadLastRound(gameId) {
    const lastRound = await this.consumeApi(`/api-truco/round/last/${gameId}`, { method: 'GET' });

    if (!lastRound) return;

    let msg = `> Virou ${lastRound.trumpCard}.\n`;

    const srcImgTrumpCard = this.mapCardArt(lastRound.trumpCard);
    const imgTrumpCard = document.getElementById('trump_card_img');
    imgTrumpCard.src = srcImgTrumpCard;
    imgTrumpCard.style.display = 'initial';

    let srcImgCard;

    if (!this.readonly) {
      this.initialCards = lastRound.playerCards;
      this.roundId;

      srcImgCard = [this.mapCardArt(lastRound.playerCards[0]), this.mapCardArt(lastRound.playerCards[1]), this.mapCardArt(lastRound.playerCards[2])];
    } else {
      srcImgCard = ['/static/img/Minicard_back.svg', '/static/img/Minicard_back.svg', '/static/img/Minicard_back.svg'];
    }

    const imgCard = [
      document.getElementById('player_1_cards_1_img'),
      document.getElementById('player_1_cards_2_img'),
      document.getElementById('player_1_cards_3_img'),
    ];

    imgCard[0].src = srcImgCard[0];
    imgCard[1].src = srcImgCard[1];
    imgCard[2].src = srcImgCard[2];
    imgCard[0].style.display = 'initial';
    imgCard[1].style.display = 'initial';
    imgCard[2].style.display = 'initial';

    if (!this.readonly) {
      imgCard[0].classList.add('card-img-play');
      imgCard[1].classList.add('card-img-play');
      imgCard[2].classList.add('card-img-play');

      imgCard[0].onclick = async () => {
        await this.playCard(0);
      };
      imgCard[1].onclick = async () => {
        await this.playCard(1);
      };
      imgCard[2].onclick = async () => {
        await this.playCard(2);
      };
    }

    document.getElementById('score_text_s').innerText = `+${lastRound.score}`;

    msg += `> Inicia a mão ${lastRound.seq} `;

    if (lastRound.starterPlayer == this.player1Id) {
      msg += this.player1;
    } else {
      msg += this.player2;
    }
    msg += '.\n';

    document.getElementById('msg_text').value = `${msg}${document.getElementById('msg_text').value}`;

    return lastRound.id;
  }

  async loadLastRoundId(gameId) {
    const lastRound = await this.consumeApi(`/api-truco/round/last/${gameId}`, { method: 'GET' });

    if (!lastRound) return;

    return lastRound.id;
  }

  async check(roundId) {
    const checkData = await this.consumeApi(`/api-truco/turn/check/${roundId}`, { method: 'GET' });

    if (!checkData || checkData.lastTurnSeq == this.turnSeq) return;

    const actionsDesc = { Tr: 'TRUCO', Sx: 'SEIS' };
    const aswerDesc = { Ys: 'sim', No: 'não' };

    let player1Ord;
    let player2Ord;
    if (this.player1Id == checkData.player1Id) {
      player1Ord = 1;
      player2Ord = 2;
    } else {
      player1Ord = 2;
      player2Ord = 1;
    }

    this.round = 1;
    this.cardsPlayed = 0;
    this.finishedRound = false;
    let msg = '';
    for (const t of checkData.turns) {
      let log = `> ${t.seq} ${t.player} `;

      if (actionsDesc[t.cardOrAction]) {
        log += `pediu ${actionsDesc[t.cardOrAction]}`;
      } else if (aswerDesc[t.cardOrAction]) {
        log += `respondeu ${aswerDesc[t.cardOrAction]}`;
      } else {
        log += `jogou ${t.cardOrAction}`;
        this.cardsPlayed++;

        let playerOrd;
        if (this.player1Id == t.playerId) {
          playerOrd = 1;
        } else {
          playerOrd = 2;
        }

        this.playCardPage(t.cardOrAction, playerOrd, this.round);
      }

      msg = log + '.\n' + msg;

      if (this.cardsPlayed && !(this.cardsPlayed % 2)) {
        let winnerPlayer = '';
        if (checkData.TriTurnWinner[this.round - 1] == 1) {
          msg = `> ${checkData.player1} ganhou a rodada ${this.round}.\n${msg}`;
          document.getElementById(`turn_${this.round}_card_${player1Ord}_img`).classList.add('turn-winner');
        } else if (checkData.TriTurnWinner[this.round - 1] == 2) {
          msg = `> ${checkData.player2} ganhou a rodada ${this.round}.\n${msg}`;
          document.getElementById(`turn_${this.round}_card_${player2Ord}_img`).classList.add('turn-winner');
        } else {
          msg = `> Rodada ${this.round} deu empate.\n${msg}`;
          document.getElementById(`turn_${this.round}_card_1_img`).classList.add('turn-winner');
          document.getElementById(`turn_${this.round}_card_2_img`).classList.add('turn-winner');
        }

        this.round++;
      }

      this.turnSeq = t.seq;
    }

    if (checkData.roundWinner) {
      let winnerPlayer = '';
      if (checkData.roundWinner == 1) {
        winnerPlayer = checkData.player1;
      } else {
        winnerPlayer = checkData.player2;
      }

      this.finishedRound = true;
      this.enableActions(['finishRound']);

      msg = `> ${winnerPlayer} ganhou a mão ${checkData.roundSeq} valendo ${checkData.score} pontos.\n${msg}`;
    } else if (checkData.turns.length > 0) {
      if (checkData.nextPlayerId == this.player1Id) {
        msg = `> É sua vez.\n${msg}`;
      }
    }

    document.getElementById('msg_text').value = `${msg}${document.getElementById('msg_text').value}`;
  }

  async playCard(which) {
    const playData = await this.consumeApi('/api-truco/turn/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundId: this.roundId,
        prevSeq: this.turnSeq,
        cardOrAction: this.initialCards[which],
      }),
    });

    if (!playData) return;

    await this.check(this.roundId);
  }

  async afterLoad() {
    if (!this.params.gameId) return;

    const lastMsg = await this.loadGameInfo(this.params.gameId);
    const lastRoundId = await this.loadLastRound(this.params.gameId);
    await this.check(lastRoundId);

    if (lastMsg) {
      document.getElementById('msg_text').value = `${lastMsg}${document.getElementById('msg_text').value}`;
    }

    this.interval = setInterval(async () => {
      if (!this.finishedRound) {
        await this.check(lastRoundId);
      } else {
        const newRoundId = await this.loadLastRoundId(this.params.gameId);

        if (lastRoundId != newRoundId) {
          clearInterval(this.interval);
          this.resetUI();
          await this.afterLoad();
        }
      }
    }, 3000);
  }
}
