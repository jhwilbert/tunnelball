/******************************************************************************/
/* 																			  */
/* 																			  */
/* 						Graphical Elements : paper.js						  */
/* 																			  */
/* 																			  */
/******************************************************************************/


var canvas = document.getElementById('stage');
canvas.width = 500;
canvas.height = 500;
paper.setup(canvas);

/******************************************************************************/
/* Graphical Elements : Ball
/*****************************************************************************/

var group = new Group;
var ax,ay;
var deviceMotion = [];

var BounceBall = Base.extend({
	initialize: function() {
		this.point = new Point(canvas.width/2,canvas.height/2);  // position
		this.vpoint = new Point(0,0); // velocity
		this.apoint = new Point(0,0); // acceleration
		
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
	}, // end of device motion

    createShape: function() {
		var ball = new Path.Circle(this.point, this.radius);
		ball.fillColor = 'blue';
		this.item = new Group([ball]);
	}, // end of createshape
	
	checkBounds: function() {
		
		if (this.item.position.x < this.radius) { // top
			this.item.position.x = 0 + this.radius;
			this.vpoint.x = - this.vpoint.x;
		}
		if (this.item.position.y < this.radius) {
			this.item.position.y = 0 + this.radius;
			this.vpoint.y = - this.vpoint.y;
		} 
		if (this.item.position.x > canvas.width - this.radius) {
			this.item.position.x = canvas.width - this.radius;
			this.vpoint.x = - this.vpoint.x;
		}
		if (this.item.position.y > canvas.height - this.radius) {
			this.vpoint.y = - this.vpoint.y;
		}
	},
	iterate: function() {
		var landscape = window.innerWidth / window.innerHeight > 1;
		//document.getElementById("ax").innerHTML = this.getDeviceMotion()[0];
		//document.getElementById("ay").innerHTML = this.getDeviceMotion()[1];
		//document.getElementById("orient").innerHTML = landscape;
		
		this.apoint.x = this.getDeviceMotion()[0];
		this.apoint.y = this.getDeviceMotion()[1];		

		if(landscape) {
			this.vpoint = this.vpoint + new Point(this.getDeviceMotion()[0], this.getDeviceMotion()[1]);
		} else {
			this.vpoint = this.vpoint + new Point(this.getDeviceMotion()[0], this.getDeviceMotion()[1]);
		}
		
		this.vpoint.x = this.vpoint.x * 0.98;
		this.vpoint.y = this.vpoint.y * 0.98;
		this.item.position.y = this.item.position.y + this.vpoint.y / 50;
		this.item.position.x = this.item.position.x + this.vpoint.x / 50;	
		
		this.checkBounds();
	} // end of iterate
});



/******************************************************************************/
/* Graphical Elements : DOORS
/*****************************************************************************/

DOOR_SIZE = 100;

function Door(x,y) {
	this.x = x;
	this.y = y; 
	this.size = DOOR_SIZE;
	this.rectangle = new Rectangle(new Point(this.x, this.y), new Point(this.x+this.size,this.y+this.size));
	var path = new Path.Rectangle(this.rectangle);
	path.fillColor = '#e9e9ff';
}

function onFrame() {
	//ball.iterate();
}


/******************************************************************************/
/* 																			  */
/* 																			  */
/* 							Socket Controller								  */
/* 																			  */
/* 																			  */
/******************************************************************************/


var socket = io.connect('http://joaowilbert.local:8000');
var my_id;
var last_client;
var doors = [];

socket.on('create_door', function(data) {	
	door = new Door(data.x, data.y);
});


