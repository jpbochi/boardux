const _ = require('lodash');
const { execute, ensureEnd } = require('../lib/route-utils');
const gameState = require('../lib/game-state');

const namespace = 'core';

const cycleTurnAction = {
  type: `${namespace}:cycle-turn`,
  addRoutes: router => {
    router.post('/cycle-turn', ensureEnd(execute(cycleTurnAction)));
  },
  reducer: (raw, action) => {
    // TODO: beware that normalization can erase the player order. Somehow, tests still passing
    const state = gameState(raw);
    const nextPlayer = _(state.players())
      .concat(state.players())
      .dropWhile(player => player.id != state.currentPlayerId())
      .drop()
      .dropWhile(player => player.finalScore)
      .head();
    return state.updateGame(game => game.set('currentPlayer', nextPlayer.id));
  }
};
const addPieceAction = {
  type: `${namespace}:add`,
  addRoutes: router => {
    router.post('/add/:piece/:tile',
      (req, res, next) => {
        const { piece, tile } = req.params;
        const state = req.state();
        if (!state.piece(piece)) { return res.sendError('Forbidden', `piece \`${piece}\` not found`); }
        if (!state.tile(tile)) { return res.sendError('Forbidden', `tile \`${piece}\` not found`); }
        next();
      },
      ensureEnd(execute(addPieceAction))
    );
  },
  reducer: (raw, action) => {
    const { piece, tile } = action.params;
    const state = gameState(raw);
    const newPieceId = tile;
    const newPiece = state.piece(piece).set('id', newPieceId);
    return state.updateEntities(en =>
      en.setIn(['pieces', newPieceId], newPiece)
        .updateIn(['boards', 'main', 'pieces'], pieces => [...pieces, newPieceId])
    );
  }
};
const setFinalScoreAction = {
  type: `${namespace}:set-final-score`,
  addRoutes: router => {
    router.post('/set-final-score/:player/:score', ensureEnd(execute(setFinalScoreAction)));
  },
  reducer: (state, action) => {
    const { player, score } = action.params;
    return gameState(state).updatePlayer(player, p => p.set('finalScore', score));
  }
};
const setGameOverAction = {
  type: `${namespace}:set-game-over`,
  addRoutes: router => {
    router.post('/set-game-over', ensureEnd(execute(setGameOverAction)));
  },
  reducer: (raw, action) => {
    return gameState(raw).updateGame(game => game.set('currentPlayer', null));
  }
};

const core = {
  namespace,
  dependencies: [],
  addRoutes: router => {
    router.route('/moves').get(ensureEnd((req, res) => res.send(req.moves || [])));
    router.route('/score').post(ensureEnd((req, res) => {
      const state = req.state();
      const playersLeft = _.filter(state.players(), player => !player.finalScore);
      if (playersLeft.length === 1) {
        return req.game.moveInSeq([
          `/set-final-score/${playersLeft[0].id}/won`,
          '/set-game-over'
        ]);
      }
      return res.send();
    }));
  },
  actions: [
    cycleTurnAction,
    addPieceAction,
    setFinalScoreAction,
    setGameOverAction
  ]
};

module.exports = core;
