const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');

describe('core-rules', () => {
  const newGame = (state, ...extra) => gameMachine([core, ...extra], state).init();

  it('passes turn from second to third', () => {
    return newGame({
      players: [
        { id: 'player:one' }, { id: 'player:two' }, { id: 'player:three' }
      ],
      currentPlayerId: 'player:two'
    }).then(game => (
      game.move('/pass-turn')
    )).then(game => {
      expect(game.state()).deep.property('currentPlayerId', 'player:three');
    });
  });

  it('passes turn from last to first', () => {
    return newGame({
      players: [
        { id: 'player:one' }, { id: 'player:two' }, { id: 'player:last' }
      ],
      currentPlayerId: 'player:last'
    }).then(game => (
      game.move('/pass-turn')
    )).then(game => {
      expect(game.state()).deep.property('currentPlayerId', 'player:one');
    });
  });

  it('passes turn skips players with a final score', () => {
    return newGame({
      players: [
        { id: 'player:one', finalScore: 'resigned' }, { id: 'player:two' }, { id: 'player:last' }
      ],
      currentPlayerId: 'player:last'
    }).then(game => (
      game.move('/pass-turn')
    )).then(game => {
      expect(game.state()).deep.property('currentPlayerId', 'player:two');
    });
  });
});
