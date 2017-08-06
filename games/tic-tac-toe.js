const core = require('./core-rules');
const { sendAction, ensureEndResponse } = require('../lib/utils');

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

const namespace = 'tic-tac-toe';
const initAction = {
  type: `${namespace}:init`,
  addRoutes: router => {
    router.use('/init', ensureEndResponse(sendAction(initAction)));
  },
  reducer: initialState
};
const placeAction = {
  type: `${namespace}:place`,
  addRoutes: router => {
    router.use('/place/:piece/:position', ensureEndResponse((req, res) => {
      const { piece, position } = req.params;
      return sendAction(placeAction)(req, res)
        .then(() => res.redirect(`/add/${piece}/${position}`))
        .then(() => res.redirect('/cycle-turn'))
        .then(() => res.redirect('/score'));
    }));
  }
};
const scoreAction = {
  type: `${namespace}:score`,
  addRoutes: router => {
    router.use('/score', ensureEndResponse(sendAction(scoreAction)));
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
