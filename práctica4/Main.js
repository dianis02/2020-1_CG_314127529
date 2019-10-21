window.addEventListener("load", function() {
  let canvas = document.getElementById("the_canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) throw "WebGL no soportado";

  let draw_light = document.getElementById("draw_light");
  let is_smooth = document.getElementById("is_smooth");

  let vertexShaderSource = document.getElementById("2d-vertex-shader").text;
  let vertexShaderSourceSin = document.getElementById("2d-vertex-shaderSin").text;
  let fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
  let fragmentShaderSourceSin = document.getElementById("2d-fragment-shaderSin").text;

  let vertexShader = CG.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let vertexShaderSin = CG.createShader(gl, gl.VERTEX_SHADER, vertexShaderSourceSin);
  let fragmentShader = CG.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  let fragmentShaderSin = CG.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceSin);

  let program = CG.createProgram(gl, vertexShader, fragmentShader);
  let programSin = CG.createProgram(gl, vertexShaderSin, fragmentShaderSin);

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let positionAttributeLocationSin = gl.getAttribLocation(programSin, "a_position");
  let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  let colorAttributeLocationSin = gl.getAttribLocation(programSin, "a_color");
  let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

  let ambientColorLocation = gl.getUniformLocation(program, "u_ambient_color");
  let lightPositionLocation = gl.getUniformLocation(program, "u_light_position");
  let lightColorLocation = gl.getUniformLocation(program, "u_light_color");
  let shininessLocation = gl.getUniformLocation(program, "u_shininess");

  let PVM_matrixLocation = gl.getUniformLocation(program, "u_PVM_matrix");
  let PVM_matrixLocationSin = gl.getUniformLocation(programSin, "u_PVM_matrix");
  let VM_matrixLocation = gl.getUniformLocation(program, "u_VM_matrix");

  let geometry = [
  new CG.Toro(gl,[1,0,0,0],1,.5,32,32,CG.Matrix4.translate(new CG.Vector3(-8.5,0,0))),
  new CG.Esfera(gl,[1,0,0,0],1,32,32,CG.Matrix4.translate(new CG.Vector3(5,-3,0))),
  new CG.Cono(gl,[1,0,0,0],1,1,8,8),
  new CG.Cilindro(gl,[1,0,0,0],1,1,32,32,CG.Matrix4.translate(new CG.Vector3(-5,-3,0))),
  new CG.Tetraedro(gl,[1,0,0,0],1,1,1,CG.Matrix4.translate(new CG.Vector3(0,-3,0))),
  new CG.Octaedro(gl,[1,0,0,0],1,1,1,CG.Matrix4.translate(new CG.Vector3(0,3,0))),
  new CG.Dodecaedro(gl,[1,0,0,0],1,1,1,CG.Matrix4.translate(new CG.Vector3(-5,3,0))),
  new CG.Icosaedro(gl,[1,0,0,0],1,1,1,CG.Matrix4.translate(new CG.Vector3(-5,1,0))),
  new CG.PrismaRectangular(gl,[1,0,0,0],1,3,2, CG.Matrix4.translate(new CG.Vector3(5,0,0))) ];

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.DEPTH_TEST);


  //
  let light_program = CG.createProgram(
    gl,
    CG.createShader(gl, gl.VERTEX_SHADER,
      `attribute vec4 a_position;
      uniform mat4 u_PVM_matrix;
      void main() {
        gl_PointSize = 10.0;
        gl_Position = u_PVM_matrix * a_position;
      }`),
    CG.createShader(gl, gl.FRAGMENT_SHADER,
      `precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }`)
  );
  let lightPositionAttributeLocation = gl.getAttribLocation(light_program, "a_position");
  let lightPVM_matrixLocation = gl.getUniformLocation(light_program, "u_PVM_matrix");
  let lightPos = new CG.Vector4(3, 2, 3, 1);

  let lightPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([lightPos.x, lightPos.y, lightPos.z, lightPos.w]), gl.STATIC_DRAW);




  ////////////////////////////////////////////////////////////
  let aspect = gl.canvas.width/gl.canvas.height;
  let zNear = 1;
  let zFar = 2000;
  let projectionMatrix = CG.Matrix4.perspective(75*Math.PI/180, aspect, zNear, zFar);

  let camera = new CG.TrackballCamera(
    new CG.Vector3(0, 0, 7),
    new CG.Vector3(0, 0, 0),
    new CG.Vector3(0, 1, 0)
  );

  let viewMatrix;
  let modelMatrix;
  let viewModelMatrix;
  let projectionViewModelMatrix;
  let lightPosView;




  ////////////////////////////////////////////////////////////
  // Dibujado
  ////////////////////////////////////////////////////////////
  /**
   *
   */
  function draw_obj(obj,sinLuz) {
    ////////////////////////////////////////////////////////////
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.getPositionBuffer());
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    ////////////////////////////////////////////////////////////
    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.getNormalBuffer());
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    ////////////////////////////////////////////////////////////
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.getColorBuffer());
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    ////////////////////////////////////////////////////////////
	  gl.enableVertexAttribArray(positionAttributeLocationSin);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.getPositionBuffer());
    gl.vertexAttribPointer(positionAttributeLocationSin, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttributeLocationSin);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.getColorBuffer());
    gl.vertexAttribPointer(colorAttributeLocationSin, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    viewMatrix = camera.getMatrix();

    modelMatrix = obj.getModelTransform();

    viewModelMatrix = CG.Matrix4.multiply(viewMatrix, modelMatrix);

    projectionViewModelMatrix = CG.Matrix4.multiply(projectionMatrix, viewModelMatrix);

	  if(sinLuz){
	  gl.uniformMatrix4fv(PVM_matrixLocationSin, false, projectionViewModelMatrix.toVector());
	  }else{
    gl.uniformMatrix4fv(PVM_matrixLocation, false, projectionViewModelMatrix.toVector());
		  gl.uniformMatrix4fv(VM_matrixLocation, false, viewModelMatrix.toVector());

      gl.uniform3fv(ambientColorLocation, [0.2, 0.2, 0.2])
    gl.uniform3fv(lightColorLocation, [1, 1, 1]);
    gl.uniform1f(shininessLocation, 10);

		      ////////////////////////////////////////////////////////////
    lightPosView = viewMatrix.multiplyVector(lightPos);
    gl.uniform3fv(lightPositionLocation, [lightPosView.x, lightPosView.y, lightPosView.z]);

    ////////////////////////////////////////////////////////////
	  }


    obj.draw(gl);
  }

  /**
   *
   */
  function draw() {

	  if(draw_light.checked){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    for (let i=0; i<geometry.length; i++) {
      draw_obj(geometry[i],false);
    }

		   gl.useProgram(light_program);
      projectionViewModelMatrix = CG.Matrix4.multiply(projectionMatrix, viewMatrix);

      gl.uniformMatrix4fv(lightPVM_matrixLocation, false, projectionViewModelMatrix.toVector());

      gl.enableVertexAttribArray(lightPositionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, lightPositionBuffer);
      gl.vertexAttribPointer(lightPositionAttributeLocation, 4, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, 1);

	  }else{
    ////////////////////////////////////////////////////////////

		 gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(programSin);
	for (let i=0; i<geometry.length; i++) {
      draw_obj(geometry[i],true);
    }

    }
  }

  draw();

  draw_light.addEventListener("change", function() {
    draw();
  });

  //is_smooth.addEventListener("change", function() {
    //geometry[0].setSmooth(this.checked);
    //draw();
  //});

  CG.registerMouseEvents(canvas, camera, draw);
});
