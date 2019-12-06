var CG = (function(CG) {

  class Skybox {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, draw_callback, initial_transform) {
      this.initial_transform = initial_transform || new CG.Matrix4();

      if (gl["skybox-program"]) {
        this.program = gl["skybox-program"];
      }
      else {
        this.program = CG.createProgram(
          gl,
          CG.createShader(gl, gl.VERTEX_SHADER, document.getElementById("skybox-vertex-shader").text),
          CG.createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("skybox-fragment-shader").text)
        );
      }

      this.a_position = gl.getAttribLocation(this.program, "a_position");
      this.a_texcoord = gl.getAttribLocation(this.program, "a_texcoord");
      this.u_PVM_matrix = gl.getUniformLocation(this.program, "u_PVM_matrix");

      this.vertices = [
        // frente
        1, -1,  1,
        -1,  1,  1,
         1,  1,  1,
         1, -1,  1,
        -1, -1,  1,
        -1,  1,  1,

        // derecha
         1, -1, -1,
         1,  1,  1,
         1,  1, -1,
         1, -1, -1,
         1, -1,  1,
         1,  1,  1,

        // atrás
        -1, -1, -1,
         1,  1, -1,
        -1,  1, -1,
        -1, -1, -1,
         1, -1, -1,
         1,  1, -1,

        // izquierda
        -1, -1,  1,
        -1,  1, -1,
        -1,  1,  1,
        -1, -1,  1,
        -1, -1, -1,
        -1,  1, -1,

        // arriba
         1,  1,  1,
        -1,  1, -1,
         1,  1, -1,
         1,  1,  1,
        -1,  1,  1,
        -1,  1, -1,

        // abajo
         1, -1, -1,
        -1, -1,  1,
         1, -1,  1,
         1, -1, -1,
        -1, -1, -1,
        -1, -1,  1
      ];

      this.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

      this.uv = [
        // frente
        0.5,  0.625,
        0.25, 0.375,
        0.5,  0.375,
        0.5,  0.625,
        0.25, 0.625,
        0.25, 0.375,

        // derecha
        0.75, 0.625,
        0.5,  0.375,
        0.75, 0.375,
        0.75, 0.625,
        0.5,  0.625,
        0.5,  0.375,

        // atrás
        1,    0.625,
        0.75, 0.375,
        1,    0.375,
        1,    0.625,
        0.75, 0.625,
        0.75, 0.375,

        // izquierda
        0.25, 0.625,
        0,    0.375,
        0.25, 0.375,
        0.25, 0.625,
        0,    0.625,
        0,    0.375,

        // arriba
        0.5,  0.375,
        0.25, 0.125,
        0.5,  0.125,
        0.5,  0.375,
        0.25, 0.375,
        0.25, 0.125,

        // abajo
        0.5,  0.875,
        0.25, 0.625,
        0.5,  0.625,
        0.5,  0.875,
        0.25, 0.875,
        0.25, 0.625,
      ];

      	let texture = gl.createTexture();
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, CG.ImageLoader.getImage("imagenes/sky.png"));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);




      this.UVBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);

      this.numElements = this.vertices.length/3;
    }

    /**
		 * @param {WebGLRenderingContext} gl
		 * @param {Matrix4} PVM
		 */
    draw(gl, PVM) {
      gl.useProgram(this.program);

		gl.uniform1i(this.u_texture, 0);

      gl.enableVertexAttribArray(this.a_position);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(this.a_texcoord);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
      gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0, 0);

      let transform = CG.Matrix4.multiply(PVM, this.initial_transform);

      gl.uniformMatrix4fv(this.u_PVM_matrix, false, transform.toArray());

      gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
    }
  }

  CG.Skybox = Skybox;
  return CG;
}(CG || {}));
