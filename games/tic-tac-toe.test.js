const ttt = require('./tic-tac-toe');
const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');
const recorder = require('../support/recorder');

describe('tic-tac-toe', () => {
  const newGame = (...extra) => gameMachine([...extra, core, ttt]).init();

  it('inits blank board with player:x starting', () => {
    return newGame().then(game => {
      expect(game.state().denormalized()).shallowDeepEqual({
        players: [ { id: 'player:x' }, { id: 'player:o' } ],
        currentPlayer: { id: 'player:x' },
        board: {
          pieces: [ { id: 'x' }, { id: 'o' } ]
        }
      });
    });
  });

  describe('GET /moves', () => {
    it('rejects not authenticated user', () => {
      return newGame().then(game => (
        expect(game.get('/moves')).rejected(err => expect(err.toString()).match(/^Unauthorized/))
      ));
    });

    it('lists no moves for not current player', () => {
      return newGame().then(game => (
        game.get('/moves', game.userForPlayer('player:o'))
      )).then(moves => {
        expect(moves).eql([]);
      });
    });
  });

  describe('/move/place', () => {
    it('rejects not authenticated user', () => {
      return newGame().then(game => (
        expect(game.move('/move/place/x/b2')).rejected(err => expect(err.toString()).match(/^Unauthorized/))
      ));
    });

    it('rejects not current player', () => {
      return newGame().then(game => (
        expect(
          game.move('/move/place/x/b2', game.userForPlayer('player:o'))
        ).rejected(err => expect(err.toString()).match(/^Forbidden/))
      ));
    });

    it('adds piece to board and cycles turn', () => {
      const rec = recorder();
      return newGame(rec).then(game => (
        game.move('/move/place/x/b2', game.userForPlayer('player:x'))
      )).then(game => {
        expect(rec.requests()).eql([
          'POST /init',
          'POST /move/place/x/b2 [user: `player:x`]',
          'POST /add/x/b2',
          'POST /cycle-turn',
          'POST /score'
        ]);
        expect(rec.actions()).eql([
          ['tic-tac-toe:init', {}],
          ['tic-tac-toe:place', { piece: 'x', position: 'b2' }],
          ['core:add', { piece: 'x', position: 'b2' }],
          ['core:cycle-turn', {}],
          ['tic-tac-toe:score', {}]
        ]);
      });
    });
  });
});
