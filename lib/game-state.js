const _ = require('lodash');
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
  state => {
    const game = state.result;
    const entities = state.entities;
    return {
      rawState: state,
      currentPlayerId: () => game.currentPlayer,
      players: () => _.values(entities.players),
      pieces: () => _.values(entities.pieces),
      board: () => entities.boards.main,
      denormalized: () => denormalizeGame(state)
    };
  },
  {
    normalize: normalizeGame,
    denormalize: denormalizeGame
  }
);
module.exports = utils;
