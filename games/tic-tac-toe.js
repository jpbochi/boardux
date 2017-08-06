const core = require('./core-rules');
const { requireAuthentication, requireCurrentPlayer, execute, ensureEnd } = require('../lib/route-utils');

const initialState = () => (
  {
    players: [ { id: 'player:x' }, { id: 'player:o' } ],
    currentPlayerId: 'player:x',
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

const namespace = 'tic-tac-toe';
const initAction = {
  type: `${namespace}:init`,
  addRoutes: router => {
    router.use('/init', ensureEnd(execute(initAction)));
  },
  reducer: initialState
};
const placeAction = {
  type: `${namespace}:place`,
  addRoutes: router => {
    router.get('/moves', requireAuthentication);

    router.use('/place/:piece/:position',
      requireCurrentPlayer,
      ensureEnd((req, res) => {
        const { piece, position } = req.params;
        return res.execute(req.toAction(placeAction))
          .then(() => res.routeMove(`/add/${piece}/${position}`))
          .then(() => res.routeMove('/cycle-turn'))
          .then(() => res.routeMove('/score'));
      })
    );
  }
};
const scoreAction = {
  type: `${namespace}:score`,
  addRoutes: router => {
    router.use('/score', ensureEnd(execute(scoreAction)));
  }
};

module.exports = {
  namespace,
  dependencies: [ core.namespace ],
  actions: [
    initAction,
    placeAction,
    scoreAction
  ]
};
