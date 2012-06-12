var socket = io.connect('http://joaowilbert.local:8000');
var my_id;
var last_client;

/******************************************************************************/
/* Socket Controller
/*****************************************************************************/

socket.on('handshake', function(data) {
	my_id = data["client_id"];
	total_clients = data["total_clients"]
	updateStatus();
});

socket.on('update', function(data) {	
	total_clients = data["total_clients"];
	updateStatus();
});


function updateStatus() {
	if(my_id == 0 &&  total_clients == 1) {
		console.debug("I AM THE ONLY ONE");
	} else if (my_id == 0 && total_clients > 1) {
		console.debug("I AM THE FIRST ONE");
	} else if (my_id  == total_clients - 1) {
		console.debug("I AM THE LAST  ONE");
	} else if (my_id > 0 && my_id < total_clients - 1 ) {
		console.debug("I AM THE MIDDLE");	
	} 
	
	console.debug("my id", my_id) 
	console.debug("total clients",total_clients);

}


/******************************************************************************/
/* Helpers
/*****************************************************************************/

function getBoundaries() {
	screenH = screen.height;
	screenW = screen.width;
	arr = [screenH,screenW];
	return arr
}
