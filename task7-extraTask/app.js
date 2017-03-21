var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    if(req.url==='/'){
      fs.readFile(__dirname + '/public/index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    }
    else if(req.url.indexOf('.js') != -1){
      fs.readFile(__dirname + req.url, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });
    }
    else if(req.url.indexOf('.css') != -1){
      fs.readFile(__dirname + req.url, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
    }
    else if(req.url.indexOf('.png') != -1 || req.url.indexOf('.jpg') != -1){
        fs.readFile(__dirname + req.url, function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(data);
            res.end();
        });
    }

}).listen(8000);