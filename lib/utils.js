const mod = {
  sendAction: action => (req, res) => (
    res.send(req.toAction(action))
  ),
  ensureEndResponse: fn => (req, res, ...args) => (
    fn(req, res, ...args).then(res.end, res.next)
  )
};
module.exports = mod;
