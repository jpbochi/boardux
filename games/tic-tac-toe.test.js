const ttt = require('./tic-tac-toe');
const recorder = require('../support/recorder');

describe('tic-tac-toe', () => {
  it('inits blank board with player:X starting', () => {
    expect(ttt.new().state()).eql({
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
      const game = ttt.new({ extraMiddleware: [rec] });

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
