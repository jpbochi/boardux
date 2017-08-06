const _ = require('lodash');
const immutable = require('seamless-immutable');
const { normalize, denormalize, schema } = require('normalizr');

const defaultId = defaultId => ({ idAttribute: value => _.get(value, 'id', defaultId) });

const player = new schema.Entity('players');
const piece = new schema.Entity('pieces', { ensign: player });
const board = new schema.Entity('boards', { pieces: [ piece ] }, defaultId('main'));
const game = {
  players: [ player ],
  currentPlayer: player,
  board: board
};

const normalizeGame = (denormalized, schema = game) => normalize(denormalized, schema);
const denormalizeGame = (normalized, schema = game) => denormalize(normalized.result, schema, normalized.entities);

const utils = _.assign(
  source => {
    const state = immutable(source);
    const game = state.result;
    const entities = state.entities;
    return {
      currentPlayerId: () => game.currentPlayer,
      players: () => _.values(entities.players),
      pieces: () => _.values(entities.pieces),
      player: (id) => entities.players[id],
      piece: (id) => entities.pieces[id],
      board: () => entities.boards.main,
      tiles: () => entities.boards.main.tiles, // TODO: support more complex board graphs
      updateGame: (updater) => state.update('result', updater),
      updatePlayer: (id, updater) => state.updateIn(['entities', 'players', id], updater),
      updateEntities: (updater) => state.update('entities', updater),
      updateBoard: (updater) => state.updateIn(['entities', 'boards', 'main'], updater),
      denormalized: () => denormalizeGame(state)
    };
  },
  {
    normalize: normalizeGame,
    denormalize: denormalizeGame
  }
);
module.exports = utils;
