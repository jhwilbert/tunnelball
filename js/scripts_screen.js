

////////////////////////////////////////  SOCKET  ////////////////////////////////////////// 


var socket = io.connect('http://joaowilbert.local:8000'); // has to be the port from client


 socket.on('handshake', function (data) {
    console.log(data);
    
});


socket.on('move_stuff', function (data) {
    console.debug("moving",data.dist);
    movePanel(0, 600)
    
});


$(function() {
    object = $("#swipable");        
	object.css("-webkit-transform", "translate3d(-800px,0px,0px)");
});



function movePanel(distance, duration) {
    object.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
    object.css("-webkit-transform", "translate3d("+distance +"px,0px,0px)");
}

