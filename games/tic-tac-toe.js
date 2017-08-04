const _ = require('lodash');
const { createStore, applyMiddleware } = require('redux');
const express = require('express');
const core = require('./core-rules');

const composeReducers = (...reducers) => (
  _.reduce(
    reducers,
    (redPrev, redNext) => (state, action) => redNext(redPrev(state, action), action),
    _.identity
  )
);

const initialState = () => (
  {
    players: [ 'player:x', 'player:o' ],
    turn: 'player:x',
    board: {
      tiles: [
        'a1', 'a2', 'a3',
        'b1', 'b2', 'b3',
        'c1', 'c2', 'c3'
      ],
      pieces: []
    }
  }
);

const game = {
  namespace: 'tic-tac-toe',
  dependencies: [ core.namespace ],
  registerRoutes: (router) => {
    router.use('/place/:piece/:position', (req, res) => {
      const { piece, position } = req.params;
      res.send({
        type: `${game.namespace}:place`,
        params: req.params
      });
      res.redirect(`/add/${piece}/${position}`);
      res.redirect('/pass-turn');
      res.redirect('/tic-tac-toe/score');
    });

    router.use('/tic-tac-toe/score', (req, res) => {});
  },
  reducer: (state, action) => state
};

exports.new = ({ extraMiddleware = [] } = {}) => {
  const router = express.Router();

  core.registerRoutes(router);
  game.registerRoutes(router);

  const store = createStore(
    composeReducers(core.reducer, game.reducer),
    initialState(),
    applyMiddleware(...extraMiddleware)
  );
  const handle = (url, done = _.identity) => {
    const req = { method: 'POST', url };
    const res = {
      send: action => store.dispatch(_.assign({ url }, action)),
      redirect: url => handle(url, done)
    };
    router.handle(req, res, done);
  };

  return {
    state: store.getState,
    move: (url) => handle(url)
  };
};
