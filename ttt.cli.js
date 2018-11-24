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

const loop = (game) => {
  const state = game.state();
  if (state.isGameOver()) {
    // print score
    console.log(state.denormalized().players);

    rl.close();
    return;
  }

  // print game state
  console.log(state.denormalized().board.pieces);

  // print available moves
  const currentPlayer = state.currentPlayerId();
  return game.get('/moves', game.userForPlayer(currentPlayer)).then(moves => {
    moves.forEach((x, i) => console.log(i, x));

    return rl.question(`[${currentPlayer}] what is your move? `, (answer) => {
      const nextMove = moves[answer];
      return game.move(nextMove, game.userForPlayer(currentPlayer)).then(loop);
    });
  });
};

gameMachine([core, ttt]).init()
  .then(loop)
  // .then(() => rl.close())
  .catch(err => console.error(err) || rl.close());
