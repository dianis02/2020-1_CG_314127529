window.addEventListener("load", function(evt) {
	let canvas = document.getElementById("the_canvas");
	let context = canvas.getContext("2d");

	var cX = canvas.width/2;
	var cY = canvas.height/2;
	var rad = Math.PI / 180;
	var k = 3.8; // -----> variable k
	var R= 50;
	var r = R/k;
	var x;
	var y;
	var phi;
	var rot = Math.PI/3;
	var contador=0;
	
	
	//Dibujamos eje y
	context.beginPath();
	context.moveTo(400,50);
	context.lineTo(400,550);
	context.closePath();
    
	context.lineWidth = 3;
	context.setLineDash([8, 6]);
	context.strokeStyle = "black";
	context.stroke(); 
	
	//Dibujamos eje x
	context.beginPath();
    context.moveTo(50,300);
    context.lineTo(750,300);
    context.closePath();

	context.lineWidth = 3;
	context.setLineDash([5, 8]);
	context.strokeStyle = "black";
	context.stroke(); 
 

	//dibujamos la epicicloide
	context.beginPath();
	for (var w = 1; w <= 360*100; w++) {
		contador++;
		phi = w * rad;
		x	=	cX+(R+r)*Math.cos(phi)-r*Math.cos(rot+(R+r)/r*phi);
		y	=	cY+(R+r)*Math.sin(phi)-r*Math.sin(rot+(R+r)/r*phi);
		if(contador == 1){
			context.moveTo(x,y);
		}else
			context.lineTo(x, y);
		}
	context.closePath();
	context.lineWidth = 2;
	context.strokeStyle = "blue";
	context.stroke(); 



});
