const _ = require('lodash');

const isAuthenticated = req => (_.isFunction(_.get(req, ['user', 'canPlayAs'])));
const canPlayAsCurrentPlayer = req => (req.user.canPlayAs(req.state().currentPlayerId()));

const utils = {
  requireAuthentication: (req, res, next) => (
    (!isAuthenticated(req)) ? res.sendError('Unauthorized') : next() // TODO: use github.com/restify/errors ?
  ),
  requireCurrentPlayer: (req, res, next) => {
    if (!isAuthenticated(req)) { return res.sendError('Unauthorized'); }
    if (!canPlayAsCurrentPlayer(req)) { return res.sendError('Forbidden', 'Not your turn'); }
    next();
  },
  execute: action => (req, res) => (
    res.execute(req.toAction(action))
  ),
  ensureEnd: fn => (req, res, next) => {
    try {
      fn(req, res, next).then(res.end, next);
    } catch (err) {
      next(err);
    }
  }
};
module.exports = utils;
