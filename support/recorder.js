const _ = require('lodash');

module.exports = () => {
  let actions = [];
  let requests = [];

  const mod = {
    reset: () => {
      actions = [];
      requests = [];
    },
    mapActions: (iteratee) => _.map(actions, iteratee),
    mapRequests: (iteratee) => _.map(requests, iteratee),
    requests: () => mod.mapRequests(req => `${req.method} ${req.url}`),
    storeMiddleware: store => next => action => {
      actions.push(action);
      return next(action);
    },
    addRoutes: router => {
      router.all('*', (req, res, next) => {
        requests.push(_.omit(req, ['next', '_parsedUrl', 'baseUrl', 'originalUrl', 'route']));
        next();
      });
    }
  };
  return mod;
};
