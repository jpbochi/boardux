const ttt = require('./tic-tac-toe');
const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');
const recorder = require('../support/recorder');

describe('tic-tac-toe', () => {
  const newGame = (...extra) => gameMachine([...extra, core, ttt]).init();

  it('inits blank board with player:X starting', () => {
    return newGame().then(game => {
      expect(game.state()).eql({
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
      });
    });
  });

  describe('GET /moves', () => {
    it('rejects not authenticated user', () => {
      return newGame().then(game => (
        expect(game.get('/moves')).rejected(err => expect(err.toString()).match(/^Unauthorized/))
      ));
    });
  });

  describe('/place', () => {
    it('rejects not authenticated user', () => {
      return newGame().then(game => (
        expect(game.move('/place/x/b2')).rejected(err => expect(err.toString()).match(/^Unauthorized/))
      ));
    });

    it('rejects not current player', () => {
      return newGame().then(game => (
        expect(
          game.move('/place/x/b2', game.userForPlayer('player:o'))
        ).rejected(err => expect(err.toString()).match(/^Forbidden/))
      ));
    });

    it('adds piece to board and cycles turn', () => {
      const rec = recorder();
      return newGame(rec).then(game => (
        game.move('/place/x/b2', game.userForPlayer('player:x'))
      )).then(game => {
        expect(rec.requests()).eql([
          'POST /init',
          'POST /place/x/b2 [user: `player:x`]',
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
