////////////////////////////////////////  SOCKET  ////////////////////////////////////////// 

var socket = io.connect('http://joaowilbert.local:8000'); // has to be the port from client

 socket.on('handshake', function (data) {
    console.log(data);
    
});

var panel_width = 800;
var speed = 500;

var swipeOptions = {
    triggerOnTouchEnd : true,  
    swipeStatus : swipeStatus,
    threshold:200
}

$(function() {
    object = $("#swipable")        
    $("#swipable").swipe( swipeOptions );
});

function swipeStatus(event, phase, direction,distance) {

    console.debug("moving");
    $("#swipable").text("You swiped " +  phase );

    // Is moving
     if( phase=='move' && (direction=='left' || direction=='right')) {
        var duration = 0;
        
        if(direction == 'right') {
            movePanel(distance,duration) 
        }

    // Stopped Moving
     } else if ( phase=='cancel') {
        movePanel(0,speed);
    } else if (phase == 'end') {
        socket.emit('tablet_swipe', { dist: distance, dur: duration } );
        movePanel(window.innerWidth,speed);
    }
}
        

function movePanel(distance, duration) {
    object.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
    object.css("-webkit-transform", "translate3d("+distance +"px,0px,0px)");

}



