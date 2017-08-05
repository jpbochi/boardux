const _ = require('lodash');

const namespace = 'core';
const routeAsSendAction = action => (req, res) => (
  res.send({ type: action.type, params: req.params })
);
const ensureEndResponse = fn => (req, res) => {
  fn(req, res).then(res.end, res.next);
};

const passTurnAction = {
  type: `${namespace}:pass-turn`,
  registerRoutes: router => {
    router.use('/pass-turn', ensureEndResponse(routeAsSendAction(passTurnAction)));
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
  registerRoutes: router => {
    router.use('/add/:piece/:position', ensureEndResponse(routeAsSendAction(addPieceAction)));
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
  registerRoutes: router => {
    router.use('/set-final-score/:player/:score', ensureEndResponse(routeAsSendAction(setFinalScoreAction)));
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
