const { createStore } = require('redux');

const nullAction = (state, action) => {
  return state;
};

const initialState = () => (
  {
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
  }
);

exports.new = () => {
  const store = createStore(nullAction, initialState());

  return {
    state: store.getState
  };
};
