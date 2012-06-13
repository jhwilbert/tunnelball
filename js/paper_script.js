/******************************************************************************/
/* Graphical Elements
/*****************************************************************************/

var canvas = document.getElementById('stage');
paper.setup(canvas);

DOOR_SIZE = 100;

/* Doors */
function Door(x,y) {
	this.x = x;
	this.y = y; 
	this.size = DOOR_SIZE;
	this.rectangle = new Rectangle(new Point(this.x, this.y), new Point(this.x+this.size,this.y+this.size));
	var path = new Path.Rectangle(this.rectangle);
	path.fillColor = '#e9e9ff';
}

var group = new Group;
var ax,ay;

deviceMotion = [];
/* Ball */
var BounceBall = Base.extend({

	initialize: function() {
		this.point = new Point(0,0);
		this.vpoint = new Point(0,0);
		this.apoint = new Point(0,0);
		
 		this.gravity = 0.1;
		this.bounce = -0.3;
		this.radius = 30;
		this.friction = 1.0;

		this.createShape();
		group.addChild(this.item);

	}, // end of initialize
	getDeviceMotion: function() {
		if(window.DeviceMotionEvent != undefined) {
			window.ondevicemotion = function(event) {
				ax = event.accelerationIncludingGravity.x * 5;
				ay = event.accelerationIncludingGravity.y * 5;
				deviceMotion[0] = ax;
				deviceMotion[1] = ay;
			}
		}
		
		return deviceMotion;
	},
    createShape: function() {
		var ball = new Path.Circle(this.point, this.radius);
		ball.fillColor = 'blue';
		this.item = new Group([ball]);

	}, // end of createshape
	iterate: function() {
		//console.debug(this.getDeviceMotion());
		// Check Orientation
		var portrait = window.innerWidth / window.innerHeight > 1;
		document.getElementById("ax").innerHTML = this.getDeviceMotion()[0];
		document.getElementById("ay").innerHTML = this.getDeviceMotion()[1];
		document.getElementById("orient").innerHTML = portrait;
		/*
		if(portrait) {
			this.vpoint.y += this.gravity;
			this.item.position.y += this.vpoint.y; 		
			this.item.position.x = this.vpoint.x;
			this.vpoint.y *= this.friction;
			this.vpoint.x *= this.friction;
		
		}
	
		if(this.item.position.y < 0) {
			this.item.position.y = 0;
			
		} else if (this.item.position.y > canvas.height) {
			this.item.position.y = canvas.height;
			this.vpoint.y *= this.bounce; 
		} 
		*/


	} // end of iterate

});

function createDoor() {
	var pos = ["T","R","B","L"];
	randomPos = pos[Math.floor(Math.random()*pos.length)];
	
	switch(randomPos) {
		case "T":
	    	door = new Door(Math.floor(Math.random()*(canvas.width-DOOR_SIZE)),0);
			break;
		case "R":
			door = new Door(canvas.width-DOOR_SIZE,Math.floor(Math.random()*(canvas.height-DOOR_SIZE)));
			break;
		case "B":
			door = new Door(Math.floor(Math.random()*(canvas.width-DOOR_SIZE)), canvas.height - DOOR_SIZE);
			break;
		case "L":
			door = new Door(0,Math.floor(Math.random()*(canvas.width-DOOR_SIZE)));
			break;
	}
}

/* Create Elements */

ball = new BounceBall();

createDoor();

function onFrame() {
	ball.iterate();
	//console.debug(hitTest());
}

/******************************************************************************/
/* Helpers
/*****************************************************************************/

function hitTest() {
	if (ball.item.hitTest(door.rectangle) == null) {
		return false
	} else {
		return true
	}
	//console.debug(ball.item.hitTest(door.rectangle));
}

