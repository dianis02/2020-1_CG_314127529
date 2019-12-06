window.addEventListener("load", function() {
	//cargamos las texturas
	CG.ImageLoader.load(
		[
			"imagenes/planeta1.jpg",
			"imagenes/normal.jpeg",
			"imagenes/navetex2.jpg",
			"imagenes/navenormal.jpg",
			"imagenes/alien.jpg",
			"imagenes/alientex.jpg",
			"imagenes/marsnorm.jpg",
			"imagenes/mars.jpg",
			"imagenes/bumpmap.jpg",
			"imagenes/asteroid.jpg",
			"imagenes/skybox.png",
			"imagenes/espacio.jpeg",
			"imagenes/sky.png",
			"imagenes/planor.jpeg",
			"imagenes/vida.jpeg"

		],

		function() {
			let temp=1;
			let lastTime = Date.now();
			let current = 0;
			let elapsed = 0;
			let max_elapsed_wait = 30/1000;
			let time_step = .1;
			let counter_time = 10000;

			var ygrados = 0.0;
			var zgrados = 0.0;
			var xgrados = 0.0;

			let canvas = document.getElementById("the_canvas");
			const gl = canvas.getContext("webgl");

			if (!gl) throw "WebGL no soportado";

			let skybox = new CG.Skybox(gl, draw, CG.Matrix4.scale(new CG.Vector3(300, 300, 300)));


			//creamos los planos que formaran nuestro cubo
			let geometry = [
				//geometry[0]
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-40, 30, 50)),CG.Matrix4.scale(new CG.Vector3(5,5,5)))),
				new CG.nave(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(10,10,-30)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.planeta(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-40,-50, 70)),CG.Matrix4.scale(new CG.Vector3(40,40,40)))),
				new CG.alien(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-40,-50, 70)),CG.Matrix4.scale(new CG.Vector3(5,5,5)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(50, 30, 70)),CG.Matrix4.scale(new CG.Vector3(5,5,5)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.planeta2(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(80,80, 100)),CG.Matrix4.scale(new CG.Vector3(20,20,20)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.asteroide(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-50, 30, 90)),CG.Matrix4.scale(new CG.Vector3(3,3,3)))),
				new CG.planeta2(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(-80,-40, -80)),CG.Matrix4.scale(new CG.Vector3(15,15,15)))),
				new CG.planeta2(gl, draw, CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(40,70, 100)),CG.Matrix4.scale(new CG.Vector3(5,5,5)))),
				//geometry[20]
			];


			gl.clearColor(0, 0, 0, 0);
			gl.enable(gl.DEPTH_TEST);


			////////////////////////////////////////////////////////////


			//creamos nuestra camara
			let aspect = gl.canvas.width/gl.canvas.height;
			let zNear = 1;
			let zFar = 2000;
			let projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, aspect, zNear, zFar);
			let tempCam = 1;
			//proyeccion ortogonal
			let orthoMatrix = CG.Matrix4.ortho(-30, 30, -20, 20, 0.1, 200);

			let camera = new CG.TrackballCamera(
				new CG.Vector3(-90, 10, -80),
				new CG.Vector3(0, 0, 0),
				new CG.Vector3(0, 1, 0)
			);

			//segunda camara
			let camera2 = new CG.TrackballCamera(
				new CG.Vector3(10, 10, -40),
				new CG.Vector3(0, 0, 0),
				new CG.Vector3(0, 1, 0)
			);

			//camara con teclado
			let camera3 = new CG.TrackballCamera(
				new CG.Vector3(250, 0, 100),
				new CG.Vector3(-600, 0, 0),
				new CG.Vector3(0, 1, 0)
			);


			//camara con teclado
			let camera4 = new CG.TrackballCamera(
				new CG.Vector3(300, 80, -90),
				new CG.Vector3(0, 0, 0),
				new CG.Vector3(0, 1, 0)
			);

			let viewMatrix;
			let projectionViewMatrix;
			let lightPos = new CG.Vector3(20, 70, -80);

			let lightPosnave = new CG.Vector4(10, 10, -30, 1);
			let lightDir = new CG.Vector4(0, .01, .1, 1);

			let lightPos2 = [
				new CG.Vector3(20, 70, -80)
			];





			//Declaramos los puntos de control
			let control = [
				new CG.Vector4(camera.pos.x,camera.pos.y,camera.pos.z,1.0),
				new CG.Vector4(4.0,0.0,-0.8,1.0),
				new CG.Vector4(-0.3,1.0,-5.0,1.0)
			];

			//iniciamos la t que usaremos para los puntos de bezier
			let t = 0;

			//luces
			let lightPosView = [];
			let tmp_light_pos;

			//color inicial de la luz
			let lightCol = new CG.Vector3(1, 1, 1);


			//Declaramos al space invader
			let mono = new CG.SpaceInvader(gl, new CG.DiffuseMaterialReflector(gl), [0.2, 0.1, 0.5, 1], CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(10,0,250)),CG.Matrix4.scale(new CG.Vector3(3,3,3))));
			////////////////////////////////////////////////////////////
			// Dibujado
			////////////////////////////////////////////////////////////
			/**
			*
			*/

			//Funcion que transforma grados a radianes
			Math.radians = function(degrees) {
				return degrees * Math.PI / 180;
			};

			/*
			 *Dibujado
			**/
			function draw() {


				//declaramos nuestro sol
				let sol=new CG.sol(gl, new CG.FlatMaterial(gl), [lightCol.x, lightCol.y, lightCol.z, 1], CG.Matrix4.translate(new CG.Vector3(lightPos.x,lightPos.y,lightPos.z)));




				//vamos moviendo la camara
				t=(t+0.001)%1.01;
				var bezier = bezierC3(control,t);
				//camera.pos.x= bezier[0];
				//camera.pos.y= bezier[1];
				//camera.pos.z= bezier[2];

				gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

				//creamos las matrices que usa cada camara
				viewMatrix = camera.getMatrix();
				viewMatrix2 = camera2.getMatrix();
				viewMatrix3 = camera3.getMatrix();
				viewMatrix4 = camera4.getMatrix();

				projectionViewMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);
				projectionViewMatrix2 = CG.Matrix4.multiply(orthoMatrix, viewMatrix2);

				projectionViewMatrix3 = CG.Matrix4.multiply(projectionMatrix, viewMatrix3);

				projectionViewMatrix4 = CG.Matrix4.multiply(projectionMatrix, viewMatrix4);

				//posiciones de las luces
				for (let i=0; i<lightPos2.length; i++) {
					tmp_light_pos = viewMatrix.multiplyVector(lightPos2[i]);
					lightPosView[i] = [tmp_light_pos.x, tmp_light_pos.y, tmp_light_pos.z];
				}



				proyeccion = projectionViewMatrix;
				view = viewMatrix;
				cam=camera;

				counter_time += elapsed;

				lastTime = current;




				window.requestAnimationFrame(animation);


				window.onkeydown = function(ev)
				{
					console.log(ev);
					switch(ev.key){

							//CAMARA 1
						case "1": {
							tempCam= 1; //temporal
							for (let i=0; i<geometry.length; i++) {
								geometry[i].draw(gl, projectionViewMatrix, viewMatrix, [lightPos.x, lightPos.y, lightPos.z], [camera.pos.x, camera.pos.y, camera.pos.z],[lightCol.x,lightCol.y,lightCol.z]);
							}
							skybox.draw(gl, projectionViewMatrix); //skybox correspondiente
							sol.draw(gl, projectionViewMatrix, viewMatrix, lightPosView);
							mono.draw(gl, projectionViewMatrix, viewMatrix, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);
							break;
						}

							//CAMARA 2
						case "2": {
							tempCam= 2;
							for (let i=0; i<geometry.length; i++) {
								geometry[i].draw(gl, projectionViewMatrix2, viewMatrix2, [lightPos.x, lightPos.y, lightPos.z], [camera2.pos.x, camera2.pos.y, camera2.pos.z],[lightCol.x,lightCol.y,lightCol.z]);

							}
							skybox.draw(gl, projectionViewMatrix2); //aqui pasaba algo raro con la 2
							sol.draw(gl, projectionViewMatrix2, viewMatrix2, lightPosView);
							mono.draw(gl, projectionViewMatrix2, viewMatrix2, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);
							break;
						}

							//CAMARA 3
						case "3":{

							tempCam= 3;
							for (let i=0; i<geometry.length; i++) {
								geometry[i].draw(gl, projectionViewMatrix3, viewMatrix3, [lightPos.x, lightPos.y, lightPos.z], [camera3.pos.x, camera3.pos.y, camera3.pos.z],[lightCol.x,lightCol.y,lightCol.z]);

							}
							skybox.draw(gl, projectionViewMatrix3); // lo cambie
							sol.draw(gl, projectionViewMatrix3, viewMatrix3, lightPosView);
							mono.draw(gl, projectionViewMatrix3, viewMatrix3, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);

							break;


						}
							//camara 4
						case "4":{

							tempCam= 4;
							for (let i=0; i<geometry.length; i++) {
								geometry[i].draw(gl, projectionViewMatrix4, viewMatrix4, [lightPos.x, lightPos.y, lightPos.z], [camera4.pos.x, camera4.pos.y, camera4.pos.z],[lightCol.x,lightCol.y,lightCol.z]);



							}
							skybox.draw(gl, projectionViewMatrix4); // lo cambie

							sol.draw(gl, projectionViewMatrix4, viewMatrix4, lightPosView);

							mono.draw(gl, projectionViewMatrix4, viewMatrix4, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);
							break;


						}

							//colores de la luz
						case "x":{


							lightCol = new CG.Vector3(.7, .7, 1);

							break;
						}

						case "c":{


							lightCol = new CG.Vector3(.255, .255, .255);

							break;
						}

						case "z":{

							lightCol = new CG.Vector3(1, 1, 1);

							break;
						}

							//avanzar al frente
						case "ArrowUp": {
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform,CG.Matrix4.translate(new CG.Vector3(0,0,6))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);

							//console.log(geometry[1].posicion());
							break;
						}

							//avanzar izquierda
						case "ArrowLeft": {
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform,CG.Matrix4.translate(new CG.Vector3(6,0,0))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);
							break;
						}

							//avanzar derecha
						case "ArrowRight": {
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform,CG.Matrix4.translate(new CG.Vector3(-6,0,0))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);
							break;
						}

							//avanzar hacia atras
						case "ArrowDown": {
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform,CG.Matrix4.translate(new CG.Vector3(0,0,-6))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);
							break;
						}
							//mirar arriba
						case "u": {
							xgrados = xgrados - 0.1 * 90;
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform, CG.Matrix4.rotateX(Math.radians(xgrados))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);

							break;
						}
							//mirar abajo
						case "d": {
							xgrados = xgrados + 0.1 * 90;
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform, CG.Matrix4.rotateX(Math.radians(xgrados))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);

							break;
						}

							//inclinarse izquierda
						case "l": {
							zgrados = zgrados - 0.1 * 50;
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform, CG.Matrix4.rotateZ(Math.radians(zgrados))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);

							break;
						}

							//inclinarse derecha
						case "r": {
							zgrados = zgrados + 0.1 * 50;
							geometry[1].setT(CG.Matrix4.multiply(geometry[1].initial_transform, CG.Matrix4.rotateZ(Math.radians(zgrados))));

							lightPosnave = new CG.Vector4( geometry[1].posicion().a03,geometry[1].posicion().a13,geometry[1].posicion().a23,1);

							break;
						}

							//salto alien
						case "a": {
							geometry[3].setT(CG.Matrix4.multiply(geometry[3].initial_transform,CG.Matrix4.translate(new CG.Vector3(0,8,0))));
							break;
						}

					}



				};

				//CAMBIO DE CAMARA (TRACKBALL)
				///////////////////////////////////////////////////////////////////MAQUINA EDOS
				if(tempCam==1){
					proyeccion = projectionViewMatrix;
					view = viewMatrix;
					cam=camera;
					for (let i=0; i<geometry.length; i++) {
						geometry[i].draw(gl, projectionViewMatrix, viewMatrix, [lightPos.x, lightPos.y, lightPos.z], [camera.pos.x, camera.pos.y, camera.pos.z],[lightCol.x,lightCol.y,lightCol.z]);

					}
					skybox.draw(gl, projectionViewMatrix);
					sol.draw(gl, projectionViewMatrix, viewMatrix, lightPosView);
					mono.draw(gl, projectionViewMatrix, viewMatrix, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);

				}else if (tempCam==2) {
					proyeccion = projectionViewMatrix2;
					view = viewMatrix2;
					cam=camera2;
					for (let i=0; i<geometry.length; i++) {
						geometry[i].draw(gl, projectionViewMatrix2, viewMatrix2, [lightPos.x, lightPos.y, lightPos.z], [camera2.pos.x, camera2.pos.y, camera2.pos.z],[lightCol.x,lightCol.y,lightCol.z]);
					}
					skybox.draw(gl, projectionViewMatrix);
					sol.draw(gl, projectionViewMatrix2, viewMatrix2, lightPosView);
					mono.draw(gl, projectionViewMatrix2, viewMatrix2, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);

				}else if (tempCam==3) {
					proyeccion = projectionViewMatrix3;
					view = viewMatrix3;
					cam=camera3;
					for (let i=0; i<geometry.length; i++) {
						geometry[i].draw(gl, projectionViewMatrix3, viewMatrix3, [lightPos.x, lightPos.y, lightPos.z], [camera3.pos.x, camera3.pos.y, camera3.pos.z],[lightCol.x,lightCol.y,lightCol.z]);
					}
					skybox.draw(gl, projectionViewMatrix3);
					sol.draw(gl, projectionViewMatrix3, viewMatrix3, lightPosView);
					mono.draw(gl, projectionViewMatrix3, viewMatrix3, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);

				}else if (tempCam==4) {
					proyeccion = projectionViewMatrix4;
					view = viewMatrix4;
					cam=camera4;
					for (let i=0; i<geometry.length; i++) {
						geometry[i].draw(gl, projectionViewMatrix4, viewMatrix4, [lightPos.x, lightPos.y, lightPos.z], [camera4.pos.x, camera4.pos.y, camera4.pos.z],[lightCol.x,lightCol.y,lightCol.z]);
					}
					skybox.draw(gl, projectionViewMatrix4);
					sol.draw(gl, projectionViewMatrix4, viewMatrix4, lightPosView);
					mono.draw(gl, projectionViewMatrix4, viewMatrix4, [lightPosnave.x, lightPosnave.y, lightPosnave.z], [lightDir.x, lightDir.y, lightDir.z]);
				}
				////////////////////////////////////////////////////////////////////////////////



			}


			draw();

			CG.registerMouseEvents(canvas, camera, draw);


			////////////////////////////////////////////////////////////////////////////////
			//ANIMACION  SOLO ES ESTO
			function animation() {
				// track time
				current = Date.now();
				elapsed = (current - lastTime) / 1000;
				if (elapsed > max_elapsed_wait) {
					elapsed = max_elapsed_wait;
				}


				if (counter_time > time_step) {



				}
				//METEORITOS
				if(ygrados>-100000 && temp==1){
					ygrados = ygrados - 0.01 * 70;

					mono.setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.translate(new CG.Vector3(10,0,250)),CG.Matrix4.scale(new CG.Vector3(3,3,3))),CG.Matrix4.rotateY((Math.radians(ygrados)))));
					geometry[0].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(0,0,-1))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));


					geometry[4].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(10,0,30))),CG.Matrix4.rotateZ((Math.radians(ygrados)))))


					geometry[5].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(50,0,-50))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[7].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(80,40,-50))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[8].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(30,20,50))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[9].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(50,-80,20))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[10].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(70,-150,-20))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[11].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(20,100,-70))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

					geometry[12].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(20,10,-50))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));


					geometry[13].setT(CG.Matrix4.multiply(CG.Matrix4.multiply(CG.Matrix4.rotateX(90*(-Math.PI/180)),CG.Matrix4.translate(new CG.Vector3(80,60,-20))),CG.Matrix4.rotateZ((Math.radians(ygrados)))));

				}


				draw();
				counter_time = 0;
			}
			//FIN ANIMACION
			///////////////////////////////////////////////////////////////////////////////


    /**
     * @param {Number} x0
     * @param {Number} x1
     * @param {Number} t
     * @return {Number}
     */
			function interpolation(x0,x1,t){
				return ((1-t)*x0) + (t*x1);
			}

			/**
			*@param {Array} control
			*@param {Number} t
			*@return {Array}
			*/
			function bezierC3(control,t){
				var x01 = interpolation(control[0].x,control[1].x,t);
				var y01 = interpolation(control[0].y,control[1].y,t);
				var z01 = interpolation(control[0].z,control[1].z,t);

				var x12 = interpolation(control[1].x,control[2].x,t);
				var y12 = interpolation(control[1].y,control[2].y,t);
				var z12 = interpolation(control[1].z,control[2].z,t);

				var x = interpolation(x01,x12,t);
				var y = interpolation(y01,y12,t);
				var z = interpolation(z01,z12,t);

				var result = [x,y,z];

				return result;

			}


		}
	);
});
