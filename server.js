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

var num_client = 0;
var client_isLast = false;
var client_isFirst = false;

io.sockets.on('connection', function (socket) {

	// Detects connection and updates other clients
	num_client++;
	console.log("Client Connected");
	
	// Send to other clients
	socket.emit('handshake', { client_id : num_client });
	socket.broadcast.emit('update', { last_client : num_client });
	
	console.log("num_clients", num_client);
	
	// Detects disconnection
	socket.on('disconnect', function(data) {
		num_client--;
		console.log("Client Disconnected");
		socket.emit('update', { num_client : num_client });
		
		/* Logging */
		console.log("num_clients", num_client);
		console.log("num_clients", num_client);
		
	});


});
