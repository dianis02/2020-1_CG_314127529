window.addEventListener("load", function(evt) {
	let canvas = document.getElementById("the_canvas");
	let context = canvas.getContext("2d");

	//puntos primera curva
	let init_point = { x: 400, y: 200 };
	let middle_point = { x: 200, y: 125 };
	let end_point = { x: 265, y: 350 };
	  
	//puntos segunda curva
	let init_point2 = { x: 400, y: 200 };
	let middle_point2 = { x: 550, y: 110 };
	let end_point2 = { x: 550, y: 280 };
	  
	  
	//puntos tercera curva
	let init_point3 = { x: 300, y: 375 };
	let middle_point3 = { x: 430, y: 500 };
	let end_point3 = { x: 525, y: 330 };

	//puntos cuarta curva
	let init_point4 = { x: 400, y: 200 };
	let middle_point4 = { x: 450, y: 270 };
	let end_point4 = { x: 390, y: 315 };


	//puntos quinta curva
	let init_point5 = { x: 410, y: 305 };
	let middle_point5 = { x: 400, y: 350 };
	let end_point5 = { x: 540, y: 285 };

	//puntos sexta curva
	let init_point6 = { x: 310, y: 300 };
	let middle_point6 = { x: 300, y: 290 };
	let end_point6 = { x: 415, y: 320 };

	//puntos septima curva
	let init_point7 = { x: 310, y: 340 };
	let middle_point7 = { x: 400, y: 410 };
	let end_point7 = { x: 555, y: 310 };

	// puntos bezier 1
	let init_pointb = { x: 380, y: 260 };
	let control_point_1 = { x: 400, y: 250 };
	let control_point_2 = { x: 400, y: 255 };
	let end_pointb = { x: 425, y: 260 };

	// puntos bezier 2
	let init_pointb2 = { x: 300, y: 300 };
	let control_point_12 = { x: 280, y: 220 };
	let control_point_22 = { x: 360, y: 240 };
	let end_pointb2 = { x: 380, y: 260};
    
	// puntos bezier 3
	let init_pointb3 = { x: 420, y: 230 };
	let control_point_13 = { x: 390, y: 215 };
	let control_point_23 = { x: 450, y: 215 };
	let end_pointb3 = { x: 470, y: 230};

	// puntos bezier 4
	let init_pointb4 = { x: 470, y: 230 };
	let control_point_14 = { x: 490, y: 200 };
	let control_point_24 = { x: 500, y: 200 };
	let end_pointb4 = { x: 540, y: 200};
  
	//Dibujar letras
	context.font = "30px Arial";
	context.textAlign = "center";
	context.strokeText("SLOTHS HUG TEAM", 400, 150); 

	//Dibujar Triangulos garras
	//triangulo 1
	context.beginPath();
	context.moveTo(260,350);
	context.lineTo(270,360);
	context.lineTo(290,340);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.stroke();
	
	//triangulo 2
	context.beginPath();
	context.moveTo(270,360);
	context.lineTo(280,370);
	context.lineTo(300,340);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.stroke();

	//triangulo 3
	context.beginPath();
	context.moveTo(280,370);
	context.lineTo(295,380);
	context.lineTo(305,345);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.stroke();

	//triangulos 2da parte
	//triangulo 2.1
	context.beginPath();
	context.moveTo(535,290);
	context.lineTo(545,300);
	context.lineTo(575,250);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle ="black";
	context.stroke();

	//triangulo 2.2
	context.beginPath();
	context.moveTo(545,300);
	context.lineTo(555,305);
	context.lineTo(575,260);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.stroke();

	//triangulo 2.3
	context.beginPath();
	context.moveTo(555,310);
	context.lineTo(565,310);
	context.lineTo(575,265);
	context.closePath();
		
	context.lineWidth = 3;
	context.strokeStyle = "black";
	context.stroke();


	//Dibujar curva 1
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle ="#995c04";
	context.beginPath();
	context.moveTo(init_point.x, init_point.y);
	context.quadraticCurveTo(
		middle_point.x, middle_point.y, 
		end_point.x, end_point.y
	);
	context.lineTo(end_point.x, end_point.y);
	context.stroke();


	//Dibujar curva 2
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#995c04";
	context.beginPath();
	context.moveTo(init_point2.x, init_point2.y);
	context.quadraticCurveTo(
		middle_point2.x, middle_point2.y, 
		end_point2.x, end_point2.y
	);
	context.lineTo(end_point2.x, end_point2.y);
	context.stroke();
  
  //Dibujar curva 3
  context.lineWidth = 5;
  context.setLineDash([]);
  context.strokeStyle = "#995c04";
  context.beginPath();
  context.moveTo(init_point3.x, init_point3.y);
  context.quadraticCurveTo(
    middle_point3.x, middle_point3.y, 
    end_point3.x, end_point3.y
  );
  context.lineTo(end_point3.x, end_point3.y);
  context.stroke();


	//Dibujar curva 4
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#995c04";
	context.beginPath();
	context.moveTo(init_point4.x, init_point4.y);
	context.quadraticCurveTo(
		middle_point4.x, middle_point4.y, 
		end_point4.x, end_point4.y
	);
	context.lineTo(end_point4.x, end_point4.y);
	context.stroke();
  

	//Dibujar curva 5
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#995c04";
	context.beginPath();
	context.moveTo(init_point5.x, init_point5.y);
	context.quadraticCurveTo(
		middle_point5.x, middle_point5.y, 
		end_point5.x, end_point5.y
	);
	context.lineTo(end_point5.x, end_point5.y);
	context.stroke();
  
	//Dibujar curva 6
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#995c04";
	context.beginPath();
	context.moveTo(init_point6.x, init_point6.y);
	context.quadraticCurveTo(
		middle_point6.x, middle_point6.y, 
		end_point6.x, end_point6.y
	);
	context.lineTo(end_point6.x, end_point6.y);
	context.stroke();


	//Dibujar curva 7
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#995c04";
	context.beginPath();
	context.moveTo(init_point7.x, init_point7.y);
	context.quadraticCurveTo(
		middle_point7.x, middle_point7.y, 
		end_point7.x, end_point7.y
	);
	context.lineTo(end_point7.x, end_point7.y);
	context.stroke();


	//Dibujar curva de bezier1
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.moveTo(init_pointb.x, init_pointb.y);
	context.bezierCurveTo(
		control_point_1.x, control_point_1.y,
		control_point_2.x, control_point_2.y, 
		end_pointb.x, end_pointb.y
	);
	context.lineTo(end_pointb.x, end_pointb.y);
	context.stroke();
  

	//Dibujar curva de bezier2
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.moveTo(init_pointb2.x, init_pointb2.y);
	context.bezierCurveTo(
		control_point_12.x, control_point_12.y,
		control_point_22.x, control_point_22.y, 
		end_pointb2.x, end_pointb2.y
	);
	context.lineTo(end_pointb2.x, end_pointb2.y);
	context.stroke();
  
  
	//Dibujar curva de bezier3
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.moveTo(init_pointb3.x, init_pointb3.y);
	context.bezierCurveTo(
		control_point_13.x, control_point_13.y,
		control_point_23.x, control_point_23.y, 
		end_pointb3.x, end_pointb3.y
	);
	context.lineTo(end_pointb3.x, end_pointb3.y);
	context.stroke();
  
  
	//Dibujar curva de bezier4
	context.lineWidth = 5;
	context.setLineDash([]);
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.moveTo(init_pointb4.x, init_pointb4.y);
	context.bezierCurveTo(
		control_point_14.x, control_point_14.y,
		control_point_24.x, control_point_24.y, 
		end_pointb4.x, end_pointb4.y
	);
	context.lineTo(end_pointb4.x, end_pointb4.y);
	context.stroke();
  
	//Dibujar cara con circunferencias 
 
	//boca
	context.strokeStyle = "black";
    context.beginPath();
    context.arc( 380, 290, 10, 0, Math.PI);
    context.stroke();

	//nariz
    context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 380, 280, 5, 0, 2*Math.PI);
    context.stroke();

	//ojos
	context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 340, 270, 20, 0, 2*Math.PI);
    context.stroke();

	context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 410, 280, 12, 0, 2*Math.PI);
    context.stroke();

	//n.n
	context.strokeStyle = "#d2a25c";
    context.beginPath();
	context.arc(340, 275,7, 0, Math.PI, true)
	context.stroke();

	//n.n
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.arc(410, 283,5, 0, Math.PI, true);
	context.stroke();


	//boca
	context.strokeStyle = "black";
    context.beginPath();
    context.arc( 480, 290, 10, 0, Math.PI);
    context.stroke();
	
	//nariz
    context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 480, 270, 7, 0, 2*Math.PI);
    context.stroke();

	//ojos
	context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 440, 260, 20, 0, 2*Math.PI);
    context.stroke();

	context.strokeStyle = "#5d3c0b";
    context.beginPath();
    context.arc( 515, 245, 20, 0, 2*Math.PI);
    context.stroke();
    
	//n.n
	context.strokeStyle = "#d2a25c";
    context.beginPath();
	context.arc(440, 265,7, 0, Math.PI, true);
	context.stroke();
	
	//n.n
	context.strokeStyle = "#d2a25c";
	context.beginPath();
	context.arc(515, 250,7, 0, Math.PI, true);
	context.stroke();

});
