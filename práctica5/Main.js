
window.addEventListener("load", function() {

	var ygrados = 0.0;
	var zgrados = 0.0;
	var xgrados = 0.0;
	var edo=0.0;

	let canvas = document.getElementById("the_canvas");
	const gl = canvas.getContext("webgl");

	if (!gl) throw "WebGL no soportado";

	//Declaramos los cubos
	let geometry = [
		new CG.Cube(gl, new CG.DiffuseMaterial(gl), [0.2, 1.0, 0.2, 1], CG.Matrix4.translate(new CG.Vector3(10,0,0)),5),
		new CG.Cube(gl, new CG.DiffuseMaterial(gl), [0.4, 0.0, 0.1, 1], CG.Matrix4.translate(new CG.Vector3(-10,0,0)),1),
		new CG.Cube(gl, new CG.DiffuseMaterial(gl), [1,1,1,1], CG.Matrix4.translate(new CG.Vector3(0,0,-10)),3),
		new CG.Cube(gl, new CG.DiffuseMaterial(gl), [0.7, 0.9, 1.0, 1], CG.Matrix4.translate(new CG.Vector3(0,0,10)),7),
	];

	let flatMaterial = new CG.FlatMaterial(gl);
	//Declaramos los joints
	let joint_1 = new CG.Joint(gl, flatMaterial, [0.5, 0.2, 0.1, 1], 1, 1, 2);
	let joint_2 = new CG.Joint(gl, flatMaterial, [0.2, 0.6, 0.9, 1], 0.8, 0.8, 3)
	let joint_3 = new CG.Joint(gl, flatMaterial, [0.1, 0.8, 0.2, 1], 0.6, 0.6, 4)
	let joint_0 = new CG.Joint(gl, flatMaterial, [0.8, 0.2, 0.1, 1] ,1.5, 1.5, 1.5, CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))));
	
	let plano = new CG.Plane(gl, new CG.FlatMaterial(gl), [0.8, 0.8, 0.4, 1], CG.Matrix4.multiply(CG.Matrix4.scale(new CG.Vector3(14,14,14)),CG.Matrix4.translate(new CG.Vector3(0,-.077,0))));


	//Ponemos las transformaciones iniciales de cada joint
	joint_1.initial_transform = CG.Matrix4.multiply(
		CG.Matrix4.translate(joint_0.getEnd()),
		CG.Matrix4.rotateX(90*(-Math.PI/180)));

	joint_2.initial_transform = CG.Matrix4.multiply(
		CG.Matrix4.translate(joint_1.getEnd()),
		CG.Matrix4.rotateX(-Math.PI/4)
	);

	joint_3.initial_transform = CG.Matrix4.multiply(
		CG.Matrix4.translate(joint_2.getEnd()),
		CG.Matrix4.rotateX(-Math.PI/4)
	);

	geometry.push(joint_1);
	geometry.push(joint_2);
	geometry.push(joint_3);
	geometry.push(joint_0);

	
	
	geometry.push(plano);
	
	gl.enable(gl.DEPTH_TEST);


	////////////////////////////////////////////////////////////

	//Declaramos nuestra camara
	let zNear = 1;
	let zFar = 2000;
	let projectionMatrix;

	let camera = new CG.TrackballCamera(
		new CG.Vector3(-18, 2, 8),
		new CG.Vector3(0, 0, 0),
		new CG.Vector3(0, 1, 0)
	);

	let viewMatrix;
	let projectionViewMatrix;
	let lightPos = new CG.Vector4(5, 5, 5, 1);

	// textura a renderizar
	let texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);

	let level = 0;
	let internalFormat = gl.RGBA;
	let texture_width = 512;
	let texture_height = 512;
	let border = 0;
	let format = internalFormat;
	let type = gl.UNSIGNED_BYTE;
	let data = null;

	gl.texImage2D(
		gl.TEXTURE_2D, level, internalFormat,
		texture_width, texture_height, border,
		format, type, data
	);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	//Creamos nuestros buffers de profundidad
	let myFrameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
	let attachmentPoint = gl.COLOR_ATTACHMENT0;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);
	let depthBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texture_width, texture_height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

	gl.bindTexture(gl.TEXTURE_2D, null);

	let picking_material = new CG.FlatMaterial(gl);
	let picking_colors = [];
	let original_material;
	let original_color;
	let original_border;
	for (let i=0; i<geometry.length; i++) {
		picking_colors.push([i/256, 0, 0, 1]);
	}
	let pixelColor = new Uint8Array(4);

	////////////////////////////////////////////////////////////
	// Dibujado
	////////////////////////////////////////////////////////////
	/**
       *
       */
	function draw() {



		viewMatrix = camera.getMatrix();
		lightPosView = viewMatrix.multiplyVector(lightPos);

		// render a nuestro frame buffer
		gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.viewport(0, 0, texture_width, texture_height);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);

		projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, zNear, zFar);
		projectionViewMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);

		for (let i=0; i<geometry.length; i++) {
			original_material = geometry[i].material;
			original_color = geometry[i].color;
			original_border = geometry[i].border;

			geometry[i].material = picking_material;
			geometry[i].color = picking_colors[i];
			geometry[i].border = false;

			geometry[i].draw(gl, projectionViewMatrix, viewMatrix, [lightPosView.x, lightPosView.y, lightPosView.z]);

			geometry[i].material = original_material;
			geometry[i].color = original_color;
			geometry[i].border = original_border;
		}

		gl.bindTexture(gl.TEXTURE_2D, null);


		// render al canvas
		projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, canvas.width/canvas.height, zNear, zFar);
		projectionViewMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (let i=0; i<geometry.length; i++) {
			geometry[i].draw(gl, projectionViewMatrix, viewMatrix, [lightPosView.x, lightPosView.y, lightPosView.z]);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);



	}

	draw();

	//vemos que posicion de la pantalla se le dio un click
	let mouse_position;
	let last_picked = -1;
	canvas.addEventListener("mousedown", (evt) => {
		mouse_position = CG.getMousePositionInCanvas(evt, canvas);

		mouse_position.x = (mouse_position.x/canvas.width) * texture_width;
		mouse_position.y = ((canvas.height - mouse_position.y)/canvas.height) * texture_height;

		gl.bindFramebuffer(gl.FRAMEBUFFER, myFrameBuffer);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.readPixels(mouse_position.x, mouse_position.y, 1 ,1, gl.RGBA, gl.UNSIGNED_BYTE, pixelColor);

		gl.bindTexture(gl.TEXTURE_2D, null);


		if (last_picked >= 0) {
			geometry[last_picked].border = false;




		}

		if ( pixelColor[3] !== 0 ) {

			//aqui es donde ponemos el movimiento

			geometry[pixelColor[0]].border = true;

			//le pasamos la posicion del objeto
			var temp = geometry[pixelColor[0]].pos;

			//hacemos la funcion animacion
			window.onclick=function(ev)
			{

				let lastTime = Date.now();
				let current = 0;
				let elapsed = 0;
				let max_elapsed_wait = 30/1000;
				let time_step = .1;
				let counter_time = 10000;


				function animation() {
					// track time
					current = Date.now();
					elapsed = (current - lastTime) / 1000;
					if (elapsed > max_elapsed_wait) {
						elapsed = max_elapsed_wait;
					}


					if (counter_time > time_step) {

						//reiniciamos la maquina de estados
						if(temp==4 && xgrados==0.0 || temp==2 && xgrados==0.0 || temp==6 && xgrados==0.0 || temp==8 && xgrados==0.0){
							temp=0;

						}
						console.log("update: "+temp)
						update(temp); //llamamos la función para actualizar los grados
						draw();
						counter_time = 0;
					}
					counter_time += elapsed;

					lastTime = current;
					window.requestAnimationFrame(animation);
				}

				/////////////////////////////////////////
				//Maquina de estados , transiciones
				if(temp==3 && xgrados==-144){
					temp=4;
				}
				else if(temp==1 && xgrados==-90){
					temp=2;

				}else if(temp==5 && xgrados==90){
					temp=6;

				}else if(temp==7 && xgrados==30){
					temp=8;


				}else{
					window.requestAnimationFrame(animation);
				}    
				/////////////////////////////////////////				
			};

		}

		draw();
	});

	CG.registerMouseEvents(canvas, camera, draw);







	//funcion que actualiza los grados de la posición del objeto para realizar la animación
	function update(ev) {

		Math.radians = function(degrees) {
			return degrees * Math.PI / 180;
		};
		//draw();
		switch(ev){

				//Declaramos cada caso segun el cuadro que elijamos

				/////////////////////////////////////////
			case 1: {
				if(ygrados>-80){
					ygrados = ygrados - 0.1 * 70;

					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(ygrados)))));
				}

				if(zgrados>-30){
					zgrados = zgrados - 0.1 * 30;

					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateY((Math.radians(zgrados)))));

				}

				if(xgrados>-90){
					xgrados = xgrados - 0.1 * 30;


					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(xgrados)))));
				}
				console.log(1);
				break;
			}


				/////////////////////////////////////////
			case 2: {
				if(ygrados<0.0){
					ygrados =  ygrados + 0.1 * 70;
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(ygrados)))));

					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(zgrados)))));

				}


				if(zgrados<0.0){
					zgrados = zgrados + 0.1 * 30;

					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateY((Math.radians(zgrados)))));

				}

				if(xgrados<0.0){
					xgrados = xgrados + 0.1 * 30;
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(xgrados)))));
				}

				break;
			}        



				//////////////////////////////////////

			case 3: {
				if(xgrados>-140){
					xgrados = xgrados - 0.1 * 80;


					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(xgrados)))));
					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateZ((Math.radians(xgrados)))));

					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));

					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));

				}

				break;
			}


				//////////////////////////////////////    
			case 4: {
				if(xgrados<0.0){
					xgrados = xgrados + 0.1 * 80;

					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(xgrados)))));
					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateZ((Math.radians(xgrados)))));

					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));

				}

				break;
			}

				/////////////////////////////////////////

			case 5: {
				if(ygrados<80){
					ygrados = ygrados + 0.1 * 30;
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(ygrados)))));

				}


				if(zgrados<30){
					zgrados = zgrados + 0.1 * 30;
					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(zgrados)))));
					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateY((Math.radians(zgrados)))));

				}


				if(xgrados<90){
					xgrados = xgrados + 0.1 * 30;
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(xgrados)))));

				}

				break;
			}


				/////////////////////////////////////////

			case 6: {
				if(ygrados>0.0){
					ygrados = ygrados - 0.1 * 30;
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(ygrados)))));

				}


				if(zgrados>0.0){
					zgrados = zgrados - 0.1 * 30;
					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(zgrados)))));
					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateY((Math.radians(zgrados)))));

				}


				if(xgrados>0.0){
					xgrados = xgrados - 0.1 * 30;
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateY(Math.radians(xgrados)))));

				}

				break;
			}

				/////////////////////////////////////////


			case 7: {
				if(xgrados<30){
					xgrados = xgrados + 0.1 * 30;

					console.log(xgrados)
					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateX((Math.radians(xgrados)))));
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));

				}

				if(ygrados<55){
					ygrados = ygrados + 0.1 * 60;
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(ygrados)))));

				}

				console.log(xgrados)
				break;
			}

				/////////////////////////////////////////



			case 8: {
				if(xgrados>0.0){
					xgrados = xgrados - 0.1 * 30;

					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(joint_0.getEnd()),CG.Matrix4.rotateX(90*(-Math.PI/180))),CG.Matrix4.rotateX((Math.radians(xgrados)))));
					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_1.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(xgrados)))));

				}

				if(ygrados>0.0){
					ygrados = ygrados - 0.1 * 60;
					geometry[6].setT(CG.Matrix4.multiply(CG.Matrix4.translate(joint_2.getEnd()),CG.Matrix4.multiply(CG.Matrix4.rotateX(-Math.PI/4),CG.Matrix4.rotateX(Math.radians(ygrados)))));

				}

				break;
			}

				/////////////////////////////////////////


		}

	}



});
