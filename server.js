var express = require('express');

var app = express.createServer()
var io = require('socket.io').listen(app);

app.listen(process.env['app_port'] || 3000);

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/imgs", express.static(__dirname + '/imgs'));


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});


