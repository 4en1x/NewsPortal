(function () {
  module.exports.login = function (req, res) {
    res.sendStatus(200);
  };
  module.exports.logout = function (req, res) {
    req.logout();
    res.clearCookie('login');
    res.end();
  };
  module.exports.user = function (req, res) {
    if (req.user) res.send(req.user.username);
    else res.sendStatus(401).end();
  };
}());
