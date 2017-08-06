
exports.sendAction = action => (req, res) => (
  res.send({ type: action.type, params: req.params })
);
exports.ensureEndResponse = fn => (req, res, ...args) => (
  fn(req, res, ...args).then(res.end, res.next)
);
