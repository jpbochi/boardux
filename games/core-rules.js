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
    const state = gameState(raw);
    const nextPlayer = _(state.players())
      .concat(state.players())
      .dropWhile(player => player.id != state.currentPlayerId())
      .drop()
      .dropWhile(player => player.finalScore)
      .head();
    return _.merge({}, raw, { result: { currentPlayer: nextPlayer.id } });
  }
};
const addPieceAction = {
  type: `${namespace}:add`,
  addRoutes: router => {
    router.post('/add/:piece/:position', ensureEnd(execute(addPieceAction)));
  },
  reducer: (state, action) => (
    state // TODO: copy a blueprint piece into the board
    // _.merge({}, state, { boards: { main: { pieces: _.concat(state.board.pieces, action.params) }} })
  )
};
const setFinalScoreAction = {
  type: `${namespace}:set-final-score`,
  addRoutes: router => {
    router.post('/set-final-score/:player/:score', ensureEnd(execute(setFinalScoreAction)));
  },
  reducer: (raw, action) => {
    const { player, score } = action.params;
    return _.merge({}, raw, { entities: { players: { [player]: { finalScore: score } } } });
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
