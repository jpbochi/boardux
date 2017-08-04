module.exports = () => {
  const actions = [];

  const recorder = store => next => action => {
    actions.push(action);
    return next(action);
  };
  recorder.actions = () => actions;
  return recorder;
};
