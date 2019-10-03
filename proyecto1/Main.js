
	/**
	* @param {file.content} obj
	* @param {canvas} context
	* @param {canvas} canvas
	* @param {Number} eye_x
	* @param {Number} eye_y
	* @param {Number} eye_z
	*/
	function parseObj(obj,context,canvas,eye_x,eye_y,eye_z,initial_transform){
		console.log("context parse:"+context);
		 eye_x = (eye_x || 0);
		 eye_y = (eye_y || 0);
		 eye_z = (eye_z || 5);
		context.clearRect(0,0,800,600);
		var points =[];
		var faces =[];
		var new_vertice=[];
		
		var angle = 150;
		let cameraP = new CG.Vector3(eye_x,eye_y,eye_z);
		let co = new CG.Vector3(0,0,0);
		let u = new CG.Vector3(0,1,0);
		let viewMatri = CG.Matrix4.lookAt(cameraP,co,u);
	
		let aspect = canvas.width/canvas.clientHeight;
		let zNear = 1;
		let zFar = 2000;
		let projectionMatri = CG.Matrix4.perspective(60*Math.PI/180, aspect, zNear, zFar);
	  
		let viewProjectionMatri = CG.Matrix4.multiply(viewMatri,projectionMatri);
		
		var transfor = (initial_transform ||new CG.Matrix4());

		//parse
		var obj = obj + '';
		obj.split('\n').forEach(i=>{
			if(i[0] == 'v' && i[1]==' '){
				var parts = i.split(' ');
				points.push(new CG.Vector4(Number(parts[1]),Number(parts[2]),Number(parts[3]),0));

			}else if(i[0]=='f'){
				faces.push(aux(i.split(' ').slice(1,4)));
			}
		})
		
		    
		
		//transformacion 4* queda cool personaje, con 2* suzanne
		transfor = CG.Matrix4.multiply(CG.Matrix4.multiply(transfor,CG.Matrix4.rotateY(8*angle)), CG.Matrix4.rotateX(4*angle));
		transfor = CG.Matrix4.multiply(transfor, viewProjectionMatri);
		points.forEach((vertex, index) => {
			new_vertice[index] = transfor.multiplyVector(vertex);
		});

		
		//dibuja
		faces.forEach((face) => {
			context.beginPath();
			face.forEach((vertex_index, index) => {
				vertex = imagenTransfor(canvas.width, canvas.height, new_vertice[vertex_index-1]);
					if (index === 0) {
						context.moveTo(vertex.x, vertex.y);
					}
					else {
						context.lineTo(vertex.x, vertex.y);
					}
				});

			context.closePath();
			context.stroke();
		});
	
	}
	
	/**
	* @param {Array} arr
	* @return {Array}
	*/
	function aux(arr){
		arr.forEach(function(part, index){
			arr[index] = arr[index].substring(0, arr[index].indexOf("/"));
		});
		return arr;
	}

	/**
	* @param {Number} w
	* @param {Number} h
	* @param {Number} v
	* @return {Number} 
	* @return {Number} 
	* @return {Number} 
	*/
	function imagenTransfor(w, h, v) {
		return {
			x: (v.x*w/8 + w/8)+260,
			y: (v.y*h/8 + h/8)+240,
			z: v.z
		};
	}	


	/**
	* @param {file.content} obj
	* @param {canvas} context
	* @param {canvas} canvas
	*/
	function change(obj,context,canvas){
		let valor_1 = document.getElementById("valor1");
		let valor_2 = document.getElementById("valor2");
		let valor_3 = document.getElementById("valor3");
		parseObj(obj,context,canvas,valor_1.value,valor_2.value,valor_3.value);

	}


window.addEventListener("load", function(evt) {
	let canvas = document.getElementById("the_canvas");
	let context = canvas.getContext("2d");
	let file_input = document.getElementById("adjunto");
	let valor_1 = document.getElementById("valor1");
	let valor_2 = document.getElementById("valor2");
	let valor_3 = document.getElementById("valor3");
	
	//Actualizar la posición de la camara eje x

	valor_1.addEventListener("change", function(evt) {
		change(contents,context,canvas);
		//console.log("en change: "+context);
	});

	//Actualizar la posición de la camara eje y
	valor_2.addEventListener("change", function(evt) {
		change(contents,context,canvas);
	});
	
	//Actualizar la posición de la camara eje z
	valor_3.addEventListener("change", function(evt) {
		change(contents,context,canvas);
	});

	//Manejo del archivo para su lectura
	file_input.addEventListener("change", function(evt) {
		let files = evt.target.files;
		let reader = new FileReader();
		reader.onload = function(reader_evt) {
			file_input.value = "";
			contents = reader_evt.target.result;
			//llamada a funcion que grafica
			parseObj(contents,context,canvas);
			
		

		};
		reader.readAsText(files[0]);
	});



});
