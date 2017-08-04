const _ = require('lodash');
const core = require('./core-rules');

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
const actions = {
  init: `${namespace}:init`,
  place: `${namespace}:place`
};
const actionBuilders = {
  init: req => ({ type: actions.init }),
  place: req => ({ type: actions.place, params: req.params })
};
const reducerByAction = action => _.get(
  {
    [actions.init]: () => initialState(),
  },
  action.type,
  _.identity
);

module.exports = {
  namespace: 'tic-tac-toe',
  dependencies: [ core.namespace ],
  registerRoutes: router => {
    router.use('/init', (req, res, next) => {
      res.send(actionBuilders.init(req)).then(res.end, next);
    });
    router.use('/place/:piece/:position', (req, res, next) => {
      const { piece, position } = req.params;
      res.send(actionBuilders.place(req))
        .then(() => res.redirect(`/add/${piece}/${position}`))
        .then(() => res.redirect('/pass-turn'))
        .then(() => res.redirect('/tic-tac-toe/score'))
        .then(res.end, next);
    });

    router.use('/tic-tac-toe/score', (req, res, next) => next());
  },
  reducer: (state, action) => reducerByAction(action)(state)
};
