const _ = require('lodash');
const { createStore, applyMiddleware } = require('redux');
const express = require('express');
const VError = require('verror');

const composeReducers = (...reducers) => {
  const flattenedReducers = _.flatten(reducers);
  return (state, action) => (
    flattenedReducers.reduce((state, reducer) => reducer(state, action), state)
  );
};

module.exports = (modules, initialState = { status: 'uninitialized' }) => {
  const reducers = _(modules).map('reducer').filter(_.isFunction).value();
  const middlewares = _(modules).map('storeMiddleware').filter(_.isFunction).value();
  const store = createStore(
    composeReducers(reducers),
    initialState,
    applyMiddleware(...middlewares)
  );

  const router = express.Router();
  _(modules)
    .map('registerRoutes')
    .filter(_.isFunction)
    .forEach(registerRoutes => registerRoutes(router));
  router.all('*', (req, res, next) => {
    next(new VError(
      { name: 'MoveNotFound', info: { url: req.url } },
      req.url
    ));
  });

  const routeMove = (url) => {
    return new Promise((resolve, reject) => {
      const req = { method: 'POST', url };
      const res = {
        send: action => Promise.resolve().then(() => store.dispatch(_.assign({ url }, action))),
        redirect: routeMove,
        end: resolve
      };
      router(req, res, err => err ? reject(err) : resolve());
    });
  };

  const machine = {
    state: store.getState,
    init: () => routeMove('/init').then(() => machine),
    move: url => routeMove(url).then(() => machine)
  };
  return machine;
};
