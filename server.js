/******************************************************************************/
/*                                                           				  */
/*                                                                            */
/*  	 	                   Socket Server			                      */
/*                                                                            */
/*                                                                            */
/******************************************************************************/
var express = require('express');
var app = express.createServer()

var io = require('socket.io').listen(app);
io.set('log level', 1);

/*app.listen(process.env['app_port'] || 3000);*/
app.listen(8000);

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/imgs", express.static(__dirname + '/imgs'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

/******************************************************************************/
/*  Connection Handles								                          */
/******************************************************************************/

stage_width = 500;
stage_height = 500;
TUNNEL_SIZE = 100;

var gameList;
var tunnel = createTunnel();
console.log(tunnel);

io.sockets.on('connection', function (socket) {
	gameList = io.sockets.clients('game');

	switch (gameList.length) {
		case 0:
			console.log("----- GAME IS EMPTY WAITING FOR PLAYERS -----");
			socket.join('game');
			
			io.sockets.socket(gameList[0]['id']).emit('create_tunnel', { x : tunnel.startx, y : tunnel.starty, pos : tunnel.startpos });
			break;
		case 1:
			console.log("----- GAME HAS ONE PLAYER WE CAN START NOW -----");

			socket.join('game');	
			io.sockets.socket(gameList[0]['id']).emit('create_ball', { x : 10, y : 10 });	
			io.sockets.socket(gameList[1]['id']).emit('create_tunnel', { x : tunnel.endx, y : tunnel.endy, pos : tunnel.endpos });
			break;
		case 2:
			console.log("---- GAME IS FULL ----");
			break;
	}	

	// Handles Disconnection
	socket.on('disconnect', function() {
		socket.leave('room');
	});	
});


/******************************************************************************/
/*  Element Creation 								                          */
/******************************************************************************/

function createTunnel() {
	var pos = ["T","R","B","L"];
	var x_start, x_end, y_start, y_send, pos_start, pos_end;

	randomPos = pos[Math.floor(Math.random()*pos.length)];
	
	switch(randomPos) {
		case "T":
			x_start = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE));
			y_start =  0;
			pos_start = "T";
			
			x_end = x_start;
			y_end = stage_height - TUNNEL_SIZE
			pos_end = "B";
			
			break;
		case "R":
			x_start = stage_width-TUNNEL_SIZE;
			y_start =  Math.floor(Math.random()*(stage_height-TUNNEL_SIZE));
			pos_start = "R";
			
			x_end = 0;
			y_end = y_start;
			pos_end = "L";
			break;
		case "B":
			x_start = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE)); 
			y_start = stage_height - TUNNEL_SIZE;
			pos_start = "B";
			
			x_end = x_start;
			y_end = 0;
			pos_end = "T";
			break;	
		case "L":
			x_start = 0;
			y_start = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE));
			pos_start = "L";

			x_end = stage_width - TUNNEL_SIZE;
			y_end = y_start;
			pos_end = "R";
			break;
	}

	return { startx: x_start, endx: x_end, starty : y_start, endy : y_end, startpos : pos_start, endpos : pos_end } 

}

