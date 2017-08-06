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
    mapRequests: (iteratee = _.method('toJSON')) => _.map(requests, iteratee),
    actions: () => mod.mapActions(action => [action.type, action.params]),
    requests: () => mod.mapRequests(_.method('toString')),
    storeMiddleware: store => next => action => {
      actions.push(action);
      return next(action);
    },
    addRoutes: router => {
      router.all('*', (req, res, next) => {
        requests.push(req);
        next();
      });
    }
  };
  return mod;
};
