const _ = require('lodash');
const { createStore, applyMiddleware } = require('redux');
const express = require('express');
const VError = require('verror');
const gameState = require('./game-state');

const composeReducers = (...reducers) => {
  const flattenedReducers = _.flatten(reducers);
  return (state, action) => (
    flattenedReducers.reduce((state, reducer) => reducer(state, action), state)
  );
};

module.exports = (modules, initialState = {}) => {
  const reducerByActionMap = _(modules)
    .flatMap('actions')
    .groupBy('type')
    .mapValues(actions => composeReducers(
      // TODO: should reducers for the same action type really be combined?
      _(actions).map('reducer').filter(_.isFunction).value()
    ))
    .value();
  const reducerByAction = (state, action) => (
    (reducerByActionMap[action.type] || _.identity)(state, action)
  );
  const middlewares = _(modules).map('storeMiddleware').filter(_.isFunction).value();
  const store = createStore(
    reducerByAction,
    gameState.normalize(initialState),
    applyMiddleware(...middlewares)
  );

  const router = express.Router();
  _(modules)
    .flatMap(mod => (
      _.concat(
        mod.addRoutes,
        _.map(mod.actions, 'addRoutes')
      ).filter(_.isFunction)
    ))
    .forEach(addRoutes => addRoutes(router));
  router.all('*', (req, res, next) => res.sendError('RouteNotFound'));

  const route = (machine) => (method = 'POST') => (url, user) => {
    return new Promise((resolve, reject) => {
      const req = {
        method,
        url,
        user,
        game: machine,
        state: machine.state,
        toAction: (action) => ({ type: action.type, params: req.params }),
        toJSON: () => _.omit(_.omitBy(req, _.isFunction), ['_parsedUrl', 'route']),
        toString: () => {
          const base = `${req.method} ${req.originalUrl}`;
          return (req.user) ? `${base} [user: ${req.user}]`: base;
        }
      };
      const res = {
        execute: action => Promise.resolve().then(() => store.dispatch(_.assign({ url }, action))),
        sendError: (name, msg) => (
          req.next(new VError({ name, info: req.toJSON() }, msg || req.toString()))
        ),
        send: resolve,
        end: () => resolve()
      };
      router(req, res, err => err ? reject(err) : resolve());
    }).then(response => response || machine);
  };

  const machine = {
    state: () => gameState(store.getState()),
    init: () => route(machine)()('/init'),
    move: (url, user) => route(machine)()(url, user),
    get: (url, user) => route(machine)('GET')(url, user),
    userForPlayer: playerId => ({
      playsAs: player => (playerId === player) || (playerId === _.get(player, 'id')),
      toJSON: () => ({ playerId }),
      toString: () => `\`${playerId}\``
    })
  };
  return machine;
};
