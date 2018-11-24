#!/usr/bin/env node
/* eslint no-console :0 */
const readline = require('readline');
const ttt = require('./games/tic-tac-toe');
const core = require('./games/core-rules');
const gameMachine = require('./lib/game-machine');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const showGameState = (state) => {
  const display = [
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2', 'c3']
  ].map(r => (
    r.map(tile => {
      const piece = state.piece(tile);
      if(piece) {
        return piece.ensign.split(':')[1];
      } else {
        return ' ';
      }
    })
  )).map(row => `${row.join(' | ')}`).join('\n---------\n');
  console.log(display);
};

const showGameScore = (state) => {
  console.log(state.denormalized().players);
};

const loop = (game) => {
  const state = game.state();
  if (state.isGameOver()) {
    showGameState(state);
    showGameScore(state);

    rl.close();
    return;
  }

  showGameState(state);

  // print available moves
  const currentPlayer = state.currentPlayerId();
  return game.get('/moves', game.userForPlayer(currentPlayer)).then(moves => {
    moves.forEach((x, i) => console.log(i, x));

    return rl.question(`[${currentPlayer}] what is your move? `, (answer) => {
      readline.moveCursor(process.stdin, 0, -6 - moves.length);
      readline.clearScreenDown(process.stdin);
      const nextMove = moves[answer];
      return game.move(nextMove, game.userForPlayer(currentPlayer)).then(loop);
    });
  });
};

gameMachine([core, ttt]).init()
  .then(loop)
  // .then(() => rl.close())
  .catch(err => console.error(err) || rl.close());
