const _ = require('lodash');
const core = require('./core-rules');
const { requireAuthentication, requireCurrentPlayer, execute, ensureEnd } = require('../lib/route-utils');
const { normalize } = require('../lib/game-state');

const initialState = () => normalize(
  {
    players: [ { id: 'player:x' }, { id: 'player:o' } ],
    currentPlayer: 'player:x',
    board: {
      tiles: [
        'a1', 'a2', 'a3',
        'b1', 'b2', 'b3',
        'c1', 'c2', 'c3'
      ],
      pieces: [
        { id: 'x', ensign: 'player:x' },
        { id: 'o', ensign: 'player:o' }
      ]
    }
  }
);

const blueprintPieceIdFromPlayerId = {
  ['player:x']: 'x',
  ['player:o']: 'o'
};

const namespace = 'tic-tac-toe';

const referee = {
  isMoveAvailable: (url, state, user) => {
    return _.includes(referee.getMoves(state, user), url);
  },
  getMoves: (state, user) => {
    const currentPlayer = state.currentPlayerId();

    if (!user.canPlayAs(currentPlayer)) { return []; }

    const piece = blueprintPieceIdFromPlayerId[currentPlayer];
    return state.tiles()
      .filter(tile => !state.piece(tile))
      .map(tile => placeAction.link({ piece, tile }));
  }
};

const initAction = {
  type: `${namespace}:init`,
  addRoutes: router => {
    router.post('/init', ensureEnd(execute(initAction)));
  },
  reducer: initialState
};
const placeAction = {
  type: `${namespace}:place`,
  link: ({ piece, tile }) => `/move/place/${piece}/${tile}`,
  addRoutes: router => {
    router.post('/move/place/:piece/:tile', ensureEnd((req, res) => {
      const { piece, tile } = req.params;
      const { game } = req;
      return res.execute(req.toAction(placeAction))
        .then(() => game.move(`/add/${piece}/${tile}`))
        .then(() => game.move('/cycle-turn'))
        .then(() => game.move('/score'));
    }));
  }
};
const scoreAction = {
  type: `${namespace}:score`,
  addRoutes: router => {
    router.post('/score', ensureEnd(execute(scoreAction)));
  }
};

module.exports = {
  namespace,
  dependencies: [ core.namespace ],
  actions: [
    initAction,
    placeAction,
    scoreAction
  ],
  addRoutes: router => {
    router.route('/moves')
      .all(requireAuthentication)
      .get(ensureEnd((req, res) => res.send(referee.getMoves(req.state(), req.user))));
    router.route('/move/*')
      .all(requireAuthentication)
      .all(requireCurrentPlayer)
      .post((req, res, next) => (
        referee.isMoveAvailable(req.url, req.state(), req.user) ? next() : res.sendError('Forbidden')
      ));
  }
};
