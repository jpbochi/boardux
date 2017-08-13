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

    it('lists 9 moves for initial player', () => {
      return newGame().then(game => (
        game.get('/moves', game.userForPlayer('player:x'))
      )).then(moves => {
        expect(moves).eql([
          '/move/place/x/a1', '/move/place/x/a2', '/move/place/x/a3',
          '/move/place/x/b1', '/move/place/x/b2', '/move/place/x/b3',
          '/move/place/x/c1', '/move/place/x/c2', '/move/place/x/c3'
        ]);
      });
    });

    it('lists 8 moves for second player after an initial move', () => {
      return newGame().then(game => (
        game.move('/move/place/x/b2', game.userForPlayer('player:x'))
      )).then(game => (
        game.get('/moves', game.userForPlayer('player:o'))
      )).then(moves => {
        expect(moves).eql([
          '/move/place/o/a1', '/move/place/o/a2', '/move/place/o/a3',
          '/move/place/o/b1', '/move/place/o/b3',
          '/move/place/o/c1', '/move/place/o/c2', '/move/place/o/c3'
        ]);
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

    it('rejects /place/an-invalid-piece/...', () => {
      return newGame().then(game => (
        expect(
          game.move('/move/place/Y/a1', game.userForPlayer('player:x'))
        ).rejected(err => expect(err.toString()).match(/^Forbidden/, err.stack))
      ));
    });

    it(' rejects /place/.../an-invalid-tile', () => {
      return newGame().then(game => (
        expect(
          game.move('/move/place/Y/a1', game.userForPlayer('player:x'))
        ).rejected(err => expect(err.toString()).match(/^Forbidden/, err.stack))
      ));
    });

    it('rejects /place/.../an-occupied-tile', () => {
      const rec = recorder();
      return newGame(rec).then(game => (
        game.move('/move/place/x/c3', game.userForPlayer('player:x'))
      )).then(game => (
        expect(
          game.move('/move/place/o/c3', game.userForPlayer('player:o'))
        ).rejected(err => expect(err.toString()).match(/^Forbidden/, err.stack))
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
          ['tic-tac-toe:place', { piece: 'x', tile: 'b2' }],
          ['core:add', { piece: 'x', tile: 'b2' }],
          ['core:cycle-turn', {}]
        ]);
      });
    });
  });

  describe('/score', () => {
    it('does nothing while game is not over', () => {
      const rec = recorder();
      return newGame(rec)
        .then(game => rec.reset() || game.move('/score'))
        .then(game => {
          expect(rec.requests()).eql([
            'POST /score'
          ]);
        });
    });

    it('player X wins on diagonal', () => {
      const rec = recorder();
      return newGame(rec)
        .then(game => game.move('/add/x/a1'))
        .then(game => game.move('/add/x/c3'))
        .then(game => game.move('/add/x/b2'))
        .then(game => rec.reset() || game.move('/score'))
        .then(game => {
          expect(rec.requests()).eql([
            'POST /score',
            'POST /set-final-score/player:x/won',
            'POST /set-final-score/player:o/lost',
            'POST /set-game-over'
          ]);
        });
    });
  });
});
