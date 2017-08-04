const _ = require('lodash');

const namespace = 'core';
const actions = {
  add: `${namespace}:add`,
  passTurn: `${namespace}:pass-turn`
};

const core = {
  namespace,
  dependencies: [],
  registerRoutes: (router) => {
    router.use('/add/:piece/:position', (req, res) => {
      res.send({ type: actions.add, params: req.params });
    });
    router.use('/pass-turn', (req, res) => {
      res.send({ type: actions.passTurn });
    });
  },
  reducer: (state, action) => {
    if (action.type === actions.add) {
      return _.merge({}, state, {
        board: {
          pieces: _.concat(state.board.pieces, action.params)
        }
      });
    }
    return state;
  }
};

module.exports = core;
