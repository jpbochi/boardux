const core = require('./core-rules');
const gameMachine = require('../lib/game-machine');
const recorder = require('../support/recorder');

describe('core-rules', () => {
  const newGame = (state, ...extra) => Promise.resolve(gameMachine([...extra, core], state));

  describe('/cycle-turn', () => {
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

  describe('/add/:piece/:position', () => {
    it('copies a blueprint piece into specified position', () => {
      return newGame({
        board: {
          tiles: [ 'a1', 'a2', 'b1', 'b2' ],
          pieces: [ { id: 'stone', color: 'white' } ]
        }
      }).then(game => (
        game.move('/add/stone/a2')
      )).then(game => {
        expect(game.state().denormalized()).eql({
          board: {
            tiles: [ 'a1', 'a2', 'b1', 'b2' ],
            pieces: [
              { id: 'stone', color: 'white' },
              { id: 'a2', color: 'white' }
            ]
          }
        });
        expect(game.state().normalized()).eql({
          entities: {
            boards: {
              main: {
                pieces: ['stone', 'a2'],
                tiles: ['a1', 'a2', 'b1', 'b2']
              }
            },
            pieces: {
              a2: { color: 'white', id: 'a2' },
              stone: { color: 'white', id: 'stone' }
            }
          },
          result: {
            board: 'main'
          }
        });
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

  describe('/set-game-over', () => {
    it('sets no current player and game-over flag', () => {
      return newGame({
        players: [
          { id: 'player:one' }, { id: 'player:two' }
        ],
        currentPlayer: 'player:one'
      }).then(game => (
        game.move('/set-game-over')
      )).then(game => {
        expect(game.state().currentPlayerId()).eql(null);
        expect(game.state().isGameOver()).eql(true);
      });
    });
  });

  describe('/score', () => {
    it('ends game if the other player has a final score', () => {
      const rec = recorder();
      return newGame({
        players: [ { id: 'player:one' }, { id: 'player:two' } ],
        currentPlayer: 'player:one'
      }, rec)
        .then(game => game.move('/set-final-score/player:one/ragequit'))
        .then(game => rec.reset() || game.move('/score'))
        .then(game => {
          expect(rec.requests()).eql([
            'POST /score',
            'POST /set-final-score/player:two/won',
            'POST /set-game-over'
          ]);
        });
    });
  });
});
