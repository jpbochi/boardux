const _ = require('lodash');
const { execute, ensureEnd } = require('../lib/route-utils');

const namespace = 'core';

const cycleTurnAction = {
  type: `${namespace}:cycle-turn`,
  addRoutes: router => {
    router.use('/cycle-turn', ensureEnd(execute(cycleTurnAction)));
  },
  reducer: (state, action) => {
    const { players, currentPlayerId } = state;

    const nextPlayer = _(players)
      .concat(players)
      .dropWhile(player => player.id != currentPlayerId)
      .drop()
      .dropWhile(player => player.finalScore)
      .head();
    return _.merge({}, state, { currentPlayerId: nextPlayer.id });
  }
};
const addPieceAction = {
  type: `${namespace}:add`,
  addRoutes: router => {
    router.use('/add/:piece/:position', ensureEnd(execute(addPieceAction)));
  },
  reducer: (state, action) => (
    _.merge({}, state, {
      board: {
        pieces: _.concat(state.board.pieces, action.params)
      }
    })
  )
};
const setFinalScoreAction = {
  type: `${namespace}:set-final-score`,
  addRoutes: router => {
    router.use('/set-final-score/:player/:score', ensureEnd(execute(setFinalScoreAction)));
  },
  reducer: (state, action) => {
    const { player, score } = action.params;
    const { players } = state;

    const editedPlayers = _.map(players, pl => (
      (pl.id != player) ? pl : _.assign({}, pl, { finalScore: score })
    ));
    return _.merge({}, state, { players: editedPlayers });
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
