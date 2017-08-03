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

  describe('move/drop', () => {
    it('adds piece to board and passes turn', () => {
      const actions = [];
      const recorder = store => next => action => {
        actions.push(action);
        return next(action);
      };
      const game = ttt.new({ extraMiddleware: [recorder] });

      game.move('/drop/player:x/x/b2');

      expect(actions).eql([
        {
          type: 'tic-tac-toe:drop',
          uri: '/drop/player:x/x/b2',
          params: { piece: 'x', playerid: 'player:x', position: 'b2' }
        }
      ]);

      // TODO: expand move to these actions: '/add/tac/b2', '/cycle-turn', '/tic-tac-toe/score'
    });
  });
});
