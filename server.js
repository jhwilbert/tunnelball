var express = require('express');

var app = express.createServer()
var io = require('socket.io').listen(app);

app.listen(process.env['app_port'] || 3000);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

