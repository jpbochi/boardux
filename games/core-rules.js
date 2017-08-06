const _ = require('lodash');
const { sendAction, ensureEndResponse } = require('../lib/utils');

const namespace = 'core';

const passTurnAction = {
  type: `${namespace}:pass-turn`,
  addRoutes: router => {
    router.use('/pass-turn', ensureEndResponse(sendAction(passTurnAction)));
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
    router.use('/add/:piece/:position', ensureEndResponse(sendAction(addPieceAction)));
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
    router.use('/set-final-score/:player/:score', ensureEndResponse(sendAction(setFinalScoreAction)));
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
    passTurnAction,
    addPieceAction,
    setFinalScoreAction,
  ]
};

module.exports = core;
