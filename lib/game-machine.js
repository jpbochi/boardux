const _ = require('lodash');
const { createStore, applyMiddleware } = require('redux');
const express = require('express');

const composeReducers = (...reducers) => (
  _.reduce(
    _.flatten(reducers),
    (redPrev, redNext) => (state, action) => redNext(redPrev(state, action), action),
    _.identity
  )
);

module.exports = (modules, initialState = { status: 'uninitialized' }) => {
  const router = express.Router();

  _(modules)
    .map('registerRoutes')
    .filter(_.isFunction)
    .forEach(registerRoutes => registerRoutes(router));
  const reducers = _(modules).map('reducer').filter(_.isFunction).value();
  const middlewares = _(modules).map('storeMiddleware').filter(_.isFunction).value();

  const store = createStore(
    composeReducers(reducers),
    initialState,
    applyMiddleware(...middlewares)
  );
  const handle = (url, done = _.identity) => {
    const req = { method: 'POST', url };
    const res = {
      send: action => store.dispatch(_.assign({ url }, action)),
      redirect: url => handle(url, done)
    };
    router.handle(req, res, done);
  };

  const machine = {
    state: store.getState,
    init: () => {
      handle('/init');
      return machine;
    },
    move: url => handle(url)
  };
  return machine;
};
