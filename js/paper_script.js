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
	var rectangle = new Rectangle(new Point(this.x, this.y), new Point(this.x+this.size,this.y+this.size));
	var path = new Path.Rectangle(rectangle);
	path.fillColor = '#e9e9ff';
}

var group = new Group;

/* Ball */
var BounceBall = Base.extend({
	initialize: function(point,vector){
		if (!vector || vector.isZero()){
			this.vector = Point.random() * 5;
		} else {
			this.vector = vector * 2;
		}
		this.point = point;
		this.dampen = 0.4;
		this.gravity = 3;
		this.bounce = -0.3;
		this.radius = 50;
		this.createShape();
		group.addChild(this.item);

	}, // end of initialize
    createShape: function() {
		var ball = new Path.Circle(this.point, this.radius);
		ball.fillColor = 'blue';
		this.item = new Group([ball]);

	}, // end of createshape
	iterate: function() {
		var size = view.size;
		this.vector.x *= 0.99;
		this.vector.y += this.gravity;
		var pre = this.point + this.vector;
		
		// Control x	
        if (pre.x < this.radius || pre.x > size.width - this.radius) {
			this.vector.x *= -this.dampen; 
		}
		// Control y
        if (pre.y < this.radius || pre.y > size.height - this.radius) {
            this.vector.y *= this.bounce;
        }
        
        var max = Point.max(this.radius, this.point + this.vector);
		this.item.position = this.point = Point.min(max, size - this.radius);
		
		//console.debug("door",door.y);
		
	} // end of iterate

});
createDoor();

function createDoor() {
	var pos = ["T","R"];
	randomPos = pos[Math.floor(Math.random()*pos.length)];
	console.debug(randomPos);
 	console.debug(canvas.width);		
	
	switch(randomPos) {
		case "T":
	    	door = new Door(Math.floor(Math.random()*canvas.width-DOOR_SIZE),0);
			break;
		case "R":
			door = new Door(0,Math.floor(Math.random()*canvas.height-DOOR_SIZE));
			break;
/*		case "B":
			door = new Door(Math.floor(Math.random()*canvas.width-DOOR_SIZE), canvas.height - DOOR_SIZE);
			break;
*/

	}

}

function onFrame() {
	ball.iterate();
}




ball = new BounceBall(Point.random(), Point.random());
//door = new Door(50,500);
