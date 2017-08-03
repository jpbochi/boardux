const ttt = require('./tic-tac-toe');

describe('init', () => {
  it('has blank board with X starting', () => {

    expect(ttt.new()).eql({
      turn: 'player:X',
      board: {
        positions: [
          'a1', 'a2', 'a3',
          'b1', 'b2', 'b3',
          'c1', 'c2', 'c3'
        ]
      }
    });
  });
});
