const ttt = require('./tic-tac-toe');
const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');
const recorder = require('../support/recorder');

describe('tic-tac-toe', () => {
  const newGame = (...extra) => gameMachine([core, ttt, ...extra]).init();

  it('inits blank board with player:X starting', () => {
    expect(newGame().state()).eql({
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
    });
  });

  describe('/place', () => {
    it('adds piece to board and passes turn', () => {
      const rec = recorder();
      const game = newGame(rec);

      game.move('/place/x/b2');

      expect(rec.actions()).eql([
        { type: 'tic-tac-toe:init', url: '/init' },
        { type: 'tic-tac-toe:place', url: '/place/x/b2', params: { piece: 'x', position: 'b2' } },
        { type: 'core:add', url: '/add/x/b2', params: { piece: 'x', position: 'b2' } },
        { type: 'core:pass-turn', url: '/pass-turn' }
      ]);
    });
  });
});
