const _ = require('lodash');
const ttt = require('./tic-tac-toe');
const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');
const recorder = require('../support/recorder');

describe('tic-tac-toe', () => {
  const newGame = (...extra) => gameMachine([...extra, core, ttt]).init();

  it('inits blank board with player:X starting', () => {
    return newGame().then(game => {
      expect(game.state()).eql({
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
  });

  describe('/place', () => {
    it('adds piece to board and cycles turn', () => {
      const rec = recorder();
      return newGame(rec).then(game => (
        game.move('/place/x/b2')
      )).then(game => {
        expect(rec.requests()).eql([
          'POST /init',
          'POST /place/x/b2',
          'POST /add/x/b2',
          'POST /cycle-turn',
          'POST /score'
        ]);
        expect(rec.mapActions(req => _.pick(req, ['type', 'params']))).eql([
          { type: 'tic-tac-toe:init', params: {} },
          { type: 'tic-tac-toe:place', params: { piece: 'x', position: 'b2' } },
          { type: 'core:add', params: { piece: 'x', position: 'b2' } },
          { type: 'core:cycle-turn', params: {} },
          { type: 'tic-tac-toe:score', params: {} }
        ]);
      });
    });
  });
});
