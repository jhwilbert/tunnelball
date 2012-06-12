var socket = io.connect('http://joaowilbert.local:8000');
var my_id;

socket.on('handshake', function(data) {
	my_id = data["client_id"];
	console.debug("my_id", my_id);
});
socket.on('update', function(data) {
	console.debug("my_id", my_id);
	console.log("lastClient",data["last_client"]);
	

});


