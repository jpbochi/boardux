const core = require('./core-rules');
const { requireAuthentication, requireCurrentPlayer, execute, ensureEnd } = require('../lib/route-utils');
const { normalize } = require('../lib/game-state');

const initialState = () => normalize(
  {
    id: 'main',
    players: [ { id: 'player:x' }, { id: 'player:o' } ],
    currentPlayer: 'player:x',
    board: {
      id: 'main',
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

const namespace = 'tic-tac-toe';
const initAction = {
  type: `${namespace}:init`,
  addRoutes: router => {
    router.post('/init', ensureEnd(execute(initAction)));
  },
  reducer: initialState
};
const placeAction = {
  type: `${namespace}:place`,
  addRoutes: router => {
    router.post('/move/place/:piece/:position', ensureEnd((req, res) => {
      const { piece, position } = req.params;
      const { game } = req;
      return res.execute(req.toAction(placeAction))
        .then(() => game.move(`/add/${piece}/${position}`))
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
      .get(ensureEnd((req, res) => {
        // if (!playsAsCurrentPlayer(req)) { return res.send([]); }
        // const { user } = req;
        // const { currentPlayerId, board } = req.state();

        // const placeablePiece = board.
        // var currentPlayerId = state.CurrentPlayerId;
        // var pieceClass = state.Board.Pieces.ById(TicTacToePlayer.Piece[currentPlayerId]);
        // return state.Board
        // .Region(Tiles.MainBoard)
        // .Where(p => state.Board.PiecesAt(p).IsEmpty())
        // .Select(p => GetTicTacToeMove(currentPlayerId, pieceClass.Class, p))
        // .Select(m => m.Link)
        return res.send([]);
      }));

    router.all('/move/*', requireCurrentPlayer);
  }
};
