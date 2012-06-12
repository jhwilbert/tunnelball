var express = require('express');

var app = express.createServer()
var io = require('socket.io').listen(app);

/*app.listen(process.env['app_port'] || 3000);*/
app.listen(8000);

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/imgs", express.static(__dirname + '/imgs'));


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var num_clients = 0;
var client_isLast = false;
var client_isFirst = false;

io.sockets.on('connection', function (socket) {
	num_clients = num_clients + 1;
	socket.emit('handshake', { hello : socket.id });
	console.log(num_clients);
});
