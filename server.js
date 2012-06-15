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

/*app.listen(process.env['app_port'] || 3000);*/
app.listen(8000);

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/imgs", express.static(__dirname + '/imgs'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

function test() {
}
/******************************************************************************/
/*  Client Object									                          */
/******************************************************************************/

var clients = [];

// Constructor
var Client = function(id,tunnel_x,tunnel_y,tunnel_pos,hasBall) {
	this.id = id;
	this.tunnel_x = tunnel_x;
	this.tunnel_y = tunnel_y;
	this.hasBall = hasBall;
	this.tunnel_pos = tunnel_pos;
};

/******************************************************************************/
/*  Connection Handles								                          */
/******************************************************************************/

stage_width = 500;
stage_height = 500;
TUNNEL_SIZE = 100;

io.sockets.on('connection', function (socket) {
	
	// Handles Connection
	if(clients.length == 0) {
		var randomTunnel = createRandomTunnel();
		client = new Client(socket.id,randomTunnel.x,randomTunnel.y,randomTunnel.pos,true);
		clients.push(client);
		ctunnel_x = clients[0].tunnel_x;
		ctunnel_y = clients[0].tunnel_y;
			
		// Event to interface
		socket.emit("create_door", { x: ctunnel_x, y : ctunnel_y });
	
	} else {

		// Create a new client object
		client = new Client(socket.id,10,10,"L",false);
		clients.push(client);
		
		// Calulates positions of last client
		var prevClient = returnIndex(client.id,clients)-1;
		var prevClientTunnel_x = clients[prevClient].tunnel_x;
		var prevClientTunnel_y = clients[prevClient].tunnel_y;
		var prevClientTunnel_pos = clients[prevClient].tunnel_pos;
	
		// Create fixed tunnel for new client
		var fixedTunnel = createFixedTunnel(prevClientTunnel_x,prevClientTunnel_y,prevClientTunnel_pos);	
		
		// Event to interface
		socket.emit("create_door", { x : fixedTunnel.x, y : fixedTunnel.y })
		
	}

	// Handles Disconnection
	socket.on('disconnect', function() {
		removeElement(socket.id, clients);
	});

	// Logging
	console.log(clients);
});


/******************************************************************************/
/*  Helpers											                          */
/******************************************************************************/


function removeElement(element,arr) {
	for (var i = 0; i< arr.length; i++) {
		if(element == arr[i].id){
			arr.splice(i,1);
		}
	}
}
function returnIndex(element,arr) {
	for (var i = 0; i < arr.length; i++) {
		if(element == arr[i].id) {
			return i;
		}
	}
}


/******************************************************************************/
/*  Element Creation 								                          */
/******************************************************************************/

function createFixedTunnel(prev_x,prev_y,prev_side) {
	var x_pos, y_pos, side_pos;

	console.log("-------------", prev_x,prev_y,prev_side);
	switch(prev_side) {
		case "T":
			x_pos = prev_x;
			y_pos = stage_height - TUNNEL_SIZE;
			side_pos = "B";
			break;	
		case "R":
			x_pos = 0;
			y_pos = prev_y;
			side_pos = "L";
			break;
		case "B":
			x_pos = prev_x;
			y_pos = 0;
			side_pos = "T";
			break;
		case "L":
			x_pos = stage_width - TUNNEL_SIZE;
			y_pos = prev_y;
			side_pos = prev_side;
			break;
	}

	return { x : x_pos, y : y_pos, pos: side_pos }
}

function createRandomTunnel() {
	
	var pos = ["T","R","B","L"];
	var x_pos, y_pos, side_pos;
	randomPos = pos[Math.floor(Math.random()*pos.length)];
	
	switch(randomPos) {
		case "T":
			x_pos = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE));
			y_pos =  0;
			side_pos = "T";
			break;
		case "R":
			x_pos = stage_width-TUNNEL_SIZE;
			y_pos = Math.floor(Math.random()*(stage_height-TUNNEL_SIZE));
			side_pos = "R";
			break;
		case "B":
			x_pos = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE)); 
			y_pos = stage_height - TUNNEL_SIZE;
			side_pos = "B";
			break;	
		case "L":
			x_pos = 0;
			y_pos = Math.floor(Math.random()*(stage_width-TUNNEL_SIZE));
			side_pos = "L";
			break;
	}

	return { x: x_pos, y: y_pos, pos: side_pos } 

}

