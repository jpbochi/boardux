const _ = require('lodash');

const namespace = 'core';
const actions = {
  add: `${namespace}:add`,
  passTurn: `${namespace}:pass-turn`,
  setFinalScore: `${namespace}:set-final-score`
};
const reducerByAction = action => (
  {
    [actions.add]: state => (
      _.merge({}, state, {
        board: {
          pieces: _.concat(state.board.pieces, action.params)
        }
      })
    ),
    [actions.passTurn]: state => {
      const { players, currentPlayerId } = state;

      const nextPlayer = _(players)
        .concat(players)
        .dropWhile(player => player.id != currentPlayerId)
        .drop()
        .dropWhile(player => player.finalScore)
        .head();
      return _.merge({}, state, { currentPlayerId: nextPlayer.id });
    },
    [actions.setFinalScore]: state => {
      const { playerId, score } = action.params;
      const { players } = state;

      const editedPlayers = _.map(players, player => (
        (player.id != playerId) ? player : _.assign({}, player, { finalScore: score })
      ));
      return _.merge({}, state, { players: editedPlayers });
    }
  }[action.type] || _.identity
);

const core = {
  namespace,
  dependencies: [],
  registerRoutes: router => {
    router.use('/add/:piece/:position', (req, res, next) => {
      res.send({ type: actions.add, params: req.params }).then(res.end, next);
    });
    router.use('/pass-turn', (req, res, next) => {
      res.send({ type: actions.passTurn }).then(res.end, next);
    });
    router.use('/set-final-score/:playerId/:score', (req, res, next) => {
      res.send({ type: actions.setFinalScore, params: req.params }).then(res.end, next);
    });
  },
  reducer: (state, action) => reducerByAction(action)(state)
};

module.exports = core;
