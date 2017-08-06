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
    router.post('/add/:piece/:position', ensureEnd(execute(addPieceAction)));
  },
  reducer: (raw, action) => {
    const { piece, position } = action.params;
    const state = gameState(raw);
    const blueprint = state.piece(piece).set('id', position);
    return state.updateEntities(en =>
      en.setIn(['pieces', blueprint.id], blueprint)
        .updateIn(['boards', 'main', 'pieces'], pieces => [...pieces, blueprint.id])
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

const core = {
  namespace,
  dependencies: [],
  actions: [
    cycleTurnAction,
    addPieceAction,
    setFinalScoreAction,
  ]
};

module.exports = core;
