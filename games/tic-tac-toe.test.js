const ttt = require('./tic-tac-toe');

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

  describe('drop piece move', () => {
    it.skip('adds piece to board and passes turn', () => {
      const recorder = null; // build one
      const game = ttt.new({ extraMiddleware: [recorder] });

      // uri-template: /drop/{playerid}/{piece}/{position}
      game.play('/drop/player:x/x/b2');

      expect(recorder.actions()).eql([
        '/add/tac/b2',
        '/cycle-turn',
        '/tic-tac-toe/score'
      ]);
    });

    it.skip('passes turn');
  });
});
