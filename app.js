var express = require('express');
var app = express();
app.use(express.static('public'));
app.get('/', function (req, res) {
	res.sendfile('public/index.html');
});
app.listen(process.env.PORT || 5000);