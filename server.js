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

var clients = [];

io.sockets.on('connection', function (socket) {

	
	// Detects Connection
	clients.push(socket.id);
	socket.emit('handshake', { client_id : returnIndex(socket.id, clients), total_clients : clients.length });
	socket.broadcast.emit('update', { total_clients : clients.length });
	
	// Detects disconnection
	socket.on('disconnect', function() {
		removeElement(socket.id, clients);
	});

	// Logging
	console.log(clients);


});


/*
HELPERS
*/
function removeElement(element,arr) {
	for (var i = 0; i< arr.length; i++) {
		if(element == arr[i]){
			arr.splice(i,1);
		}
	}
}

function returnIndex(element,arr) {
	for (var i = 0; i < arr.length; i++) {
		if(element == arr[i]) {
			return i;
		}
	}
}
