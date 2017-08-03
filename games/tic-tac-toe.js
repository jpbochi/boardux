const _ = require('lodash');
const { createStore, applyMiddleware } = require('redux');
const uriTemplates = require('uri-templates');

const nullAction = (state, action) => {
  return state;
};

const namespace = 'tic-tac-toe';

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


const dropPieceMove = () => {
  const template = uriTemplates('/drop/{playerid}/{piece}/{position}');

  return {
    test: uri => template.test(uri),
    action: uri => (
      {
        type: `${namespace}:drop`,
        uri,
        params: template.fromUri(uri)
      }
    )
  };
};

const knownMoves = [
  dropPieceMove()
];

exports.new = ({ extraMiddleware = [] } = {}) => {
  const store = createStore(nullAction, initialState(), applyMiddleware(...extraMiddleware));

  return {
    state: store.getState,
    move: (uri) => {
      const move = _.find(knownMoves, move => move.test(uri));
      store.dispatch(move.action(uri));
    }
  };
};
