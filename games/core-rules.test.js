const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');

describe('core-rules', () => {
  const newGame = (state, ...extra) => Promise.resolve(gameMachine([core, ...extra], state));

  describe('/cycle-turn', () => { // TODO: beware that normalization can erase the player order. Somehow, tests still pass
    it('passes turn from second to third', () => {
      return newGame({
        players: [
          { id: 'player:one' }, { id: 'player:two' }, { id: 'player:three' }
        ],
        currentPlayer: 'player:two'
      }).then(game => (
        game.move('/cycle-turn')
      )).then(game => {
        expect(game.state().currentPlayerId()).eql('player:three');
      });
    });

    it('passes turn from last to first', () => {
      return newGame({
        players: [
          { id: 'player:one' }, { id: 'player:two' }, { id: 'player:last' }
        ],
        currentPlayer: 'player:last'
      }).then(game => (
        game.move('/cycle-turn')
      )).then(game => {
        expect(game.state().currentPlayerId()).eql('player:one');
      });
    });

    it('passes turn skips players with a final score', () => {
      return newGame({
        players: [
          { id: 'player:one', finalScore: 'resigned' }, { id: 'player:two' }, { id: 'player:last' }
        ],
        currentPlayer: 'player:last'
      }).then(game => (
        game.move('/cycle-turn')
      )).then(game => {
        expect(game.state().currentPlayerId()).eql('player:two');
      });
    });
  });

  describe('/set-final-score/:player/:score', () => {
    it('sets final score', () => {
      return newGame({
        players: [
          { id: 'player:one' }, { id: 'player:two' }
        ]
      }).then(game => (
        game.move('/set-final-score/player:one/rage-quit')
      )).then(game => {
        expect(game.state().players()).eql([
          { id: 'player:one', finalScore: 'rage-quit' },
          { id: 'player:two' }
        ]);
      });
    });
  });
});
