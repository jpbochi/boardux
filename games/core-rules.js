const _ = require('lodash');

const namespace = 'core';
const actions = {
  add: `${namespace}:add`,
  passTurn: `${namespace}:pass-turn`
};
const reducerByAction = action => _.get(
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
        .dropWhile(player => player.id != currentPlayerId)
        .nth(1);
      return _.merge({}, state, { currentPlayerId: nextPlayer.id });
    }
  },
  action.type,
  _.identity
);

const core = {
  namespace,
  dependencies: [],
  registerRoutes: router => {
    router.post('/add/:piece/:position', (req, res, next) => {
      res.send({ type: actions.add, params: req.params }).then(res.end, next);
    });
    router.post('/pass-turn', (req, res, next) => {
      res.send({ type: actions.passTurn }).then(res.end, next);
    });
  },
  reducer: (state, action) => reducerByAction(action)(state)
};

module.exports = core;
