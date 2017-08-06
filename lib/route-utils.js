const _ = require('lodash');

const isAuthenticated = req => (_.isFunction(_.get(req, ['user', 'playsAs'])));
const playsAsCurrentPlayer = req => (req.user.playsAs(req.state().currentPlayerId()));

const utils = {
  requireAuthentication: (req, res, next) => (
    (!isAuthenticated(req)) ? res.sendError('Unauthorized') : next()
  ),
  requireCurrentPlayer: (req, res, next) => {
    if (!isAuthenticated(req)) { return res.sendError('Unauthorized'); }
    if (!playsAsCurrentPlayer(req)) { return res.sendError('Forbidden', 'Not your turn'); }
    next();
  },
  execute: action => (req, res) => (
    res.execute(req.toAction(action))
  ),
  ensureEnd: fn => (req, res, ...args) => {
    try {
      fn(req, res, ...args).then(res.end, req.next);
    } catch (err) {
      req.next(err);
    }
  }
};
module.exports = utils;
