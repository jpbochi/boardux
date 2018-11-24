const { ensureEnd } = require('../lib/route-utils');

const namespace = 'resign';

const resignAction = {
  type: `${namespace}:resign`,
  addRoutes: router => {
    // TODO: router.get('/moves', ???);
    router.post('/resign', ensureEnd((req, res) => {
      const { game, user } = req;
      return res.execute(req.toAction(resignAction))
        .then(() => game.move(`/set-final-score/${user.playerId}/resign`))
        .then(() => game.move('/cycle-turn'))
        .then(() => game.move('/score'));
    }));
  }
};

const core = {
  namespace,
  dependencies: [],
  actions: [
    resignAction
  ]
};

module.exports = core;
