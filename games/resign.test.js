const recorder = require('../support/recorder');
const gameMachine = require('../lib/game-machine');
const core = require('./core-rules');
const resign = require('./resign');

describe('resign', () => {
  const newGame = (state, ...extra) => Promise.resolve(gameMachine([...extra, resign, core], state));

  describe('/resign', () => {
    it('sets player score to resign', () => {
      const rec = recorder();
      return newGame({
        players: [ { id: 'player:one' }, { id: 'player:two' } ],
        currentPlayer: 'player:one'
      }, rec).then(game => (
        game.move('/resign', game.userForPlayer('player:two'))
      )).then(game => {
        expect(rec.requests()).eql([
          'POST /resign [user: `player:two`]',
          'POST /set-final-score/player:two/resign',
          'POST /cycle-turn',
          'POST /score'
        ]);
        expect(rec.actions()).eql([
          ['resign:resign', {}],
          ['core:set-final-score', { player: 'player:two', score: 'resign' }],
          ['core:cycle-turn', {}]
        ]);
      });
    });
  });
});
