module.exports = () => {
  let actions = [];

  return {
    reset: () => {
      actions = [];
    },
    actions: () => actions,
    storeMiddleware: store => next => action => {
      actions.push(action);
      return next(action);
    }
  };
};
