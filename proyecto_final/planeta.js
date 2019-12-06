var CG = (function(CG) {

	class planeta {
		/**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
		constructor(gl, draw_callback, initial_transform) {




			this.initial_transform = initial_transform || new CG.Matrix4();

			if (gl["diffuse-program"]) {
				this.program = gl["diffuse-program"];
			}
			else {
				this.program = CG.createProgram(
					gl,
					CG.createShader(gl, gl.VERTEX_SHADER, document.getElementById("diffuse-vertex-shader").text),
					CG.createShader(gl, gl.FRAGMENT_SHADER, document.getElementById("diffuse-fragment-shader").text)
				);
			}

			//Agarramos los atributos declarados en los shaders
			this.a_position = gl.getAttribLocation(this.program, "a_position");
			this.a_texcoord = gl.getAttribLocation(this.program, "a_texcoord");
			this.a_normal = gl.getAttribLocation(this.program, "a_normal");
			this.a_tangent = gl.getAttribLocation(this.program, "a_tangent");
			this.a_bitangent = gl.getAttribLocation(this.program, "a_bitangent");

			this.u_texture = gl.getUniformLocation(this.program, "u_texture");
			this.u_texture_normal = gl.getUniformLocation(this.program, "u_texture_normal");

			this.u_light_position = gl.getUniformLocation(this.program, "u_light_position");
			this.u_camera_position = gl.getUniformLocation(this.program, "u_camera_position");
			this.u_PVM_matrix = gl.getUniformLocation(this.program, "u_PVM_matrix");
			this.u_M_matrix = gl.getUniformLocation(this.program, "u_M_matrix");

			//color
			this.v_color = gl.getUniformLocation(this.program, "v_color");
			this.color_light = gl.getUniformLocation(this.program, "color_light");


			this.vertices = [
				0.5, -0.707107, -0.5, 0.382683, -0.92388, 0, 0.270598, -0.92388, -0.270598, 0.653281, -0.382684, -0.653281, 1, 0, 0, 0.923879, -0.382684, 0, 0.653281, 0.382683, -0.653281, 0.707107, 0.707107, 0, 0.923879, 0.382683, 0, 0.270598, 0.92388, -0.270598, 0, 1, 0, 0.382683, 0.92388, 0, 0, -1, 0, 0.270598, -0.92388, -0.270598, 0.382683, -0.92388, 0, 0.653281, -0.382684, -0.653281, 0.707107, -0.707107, 0, 0.5, -0.707107, -0.5, 0.653281, 0.382683, -0.653281, 1, 0, 0, 0.707107, 0, -0.707107, 0.5, 0.707107, -0.5, 0.382683, 0.92388, 0, 0.707107, 0.707107, 0, 0.707107, 0.707107, 0, 0.653281, 0.382683, 0.653281, 0.923879, 0.382683, 0, 0.382683, 0.92388, 0, 0, 1, 0, 0.270598, 0.92388, 0.270598, 0, -1, 0, 0.382683, -0.92388, 0, 0.270598, -0.92388, 0.270598, 0.923879, -0.382684, 0, 0.5, -0.707107, 0.5, 0.707107, -0.707107, 0, 0.923879, 0.382683, 0, 0.707107, 0, 0.707106, 1, 0, 0, 0.382683, 0.92388, 0, 0.5, 0.707107, 0.5, 0.707107, 0.707107, 0, 0.382683, -0.92388, 0, 0.5, -0.707107, 0.5, 0.270598, -0.92388, 0.270598, 1, 0, 0, 0.653281, -0.382684, 0.653281, 0.923879, -0.382684, 0, 0, -1, 0, 0.270598, -0.92388, 0.270598, 0, -0.92388, 0.382683, 0.653281, -0.382684, 0.653281, 0, -0.707107, 0.707106, 0.5, -0.707107, 0.5, 0.653281, 0.382683, 0.653281, 0, 0, 1, 0.707107, 0, 0.707106, 0.270598, 0.92388, 0.270598, 0, 0.707107, 0.707106, 0.5, 0.707107, 0.5, 0.5, -0.707107, 0.5, 0, -0.92388, 0.382683, 0.270598, -0.92388, 0.270598, 0.707107, 0, 0.707106, 0, -0.382684, 0.923879, 0.653281, -0.382684, 0.653281, 0.5, 0.707107, 0.5, 0, 0.382683, 0.923879, 0.653281, 0.382683, 0.653281, 0.270598, 0.92388, 0.270598, 0, 1, 0, 0, 0.92388, 0.382683, 0, 0.92388, 0.382683, -0.5, 0.707107, 0.5, 0, 0.707107, 0.707106, 0, -0.707107, 0.707106, -0.270598, -0.92388, 0.270598, 0, -0.92388, 0.382683, 0, 0, 1, -0.653281, -0.382684, 0.653281, 0, -0.382684, 0.923879, 0, 0.707107, 0.707106, -0.653281, 0.382683, 0.653281, 0, 0.382683, 0.923879, 0, 0.92388, 0.382683, 0, 1, 0, -0.270598, 0.92388, 0.270598, 0, -1, 0, 0, -0.92388, 0.382683, -0.270598, -0.92388, 0.270598, 0, -0.707107, 0.707106, -0.653281, -0.382684, 0.653281, -0.5, -0.707107, 0.5, 0, 0.382683, 0.923879, -0.707107, 0, 0.707106, 0, 0, 1, -0.5, -0.707107, 0.5, -0.382683, -0.92388, 0, -0.270598, -0.92388, 0.270598, -0.707107, 0, 0.707106, -0.923879, -0.382684, 0, -0.653281, -0.382684, 0.653281, -0.5, 0.707107, 0.5, -0.923879, 0.382683, 0, -0.653281, 0.382683, 0.653281, -0.270598, 0.92388, 0.270598, 0, 1, 0, -0.382683, 0.92388, 0, 0, -1, 0, -0.270598, -0.92388, 0.270598, -0.382683, -0.92388, 0, -0.5, -0.707107, 0.5, -0.923879, -0.382684, 0, -0.707106, -0.707107, 0, -0.707107, 0, 0.707106, -0.923879, 0.382683, 0, -1, 0, 0, -0.5, 0.707107, 0.5, -0.382683, 0.92388, 0, -0.707106, 0.707107, 0, -0.382683, 0.92388, 0, 0, 1, 0, -0.270598, 0.92388, -0.270598, 0, -1, 0, -0.382683, -0.92388, 0, -0.270598, -0.92388, -0.270598, -0.923879, -0.382684, 0, -0.5, -0.707107, -0.5, -0.707106, -0.707107, 0, -1, 0, 0, -0.653281, 0.382683, -0.653281, -0.707107, 0, -0.707107, -0.382683, 0.92388, 0, -0.5, 0.707107, -0.5, -0.707106, 0.707107, 0, -0.707106, -0.707107, 0, -0.270598, -0.92388, -0.270598, -0.382683, -0.92388, 0, -1, 0, 0, -0.653281, -0.382684, -0.653281, -0.923879, -0.382684, 0, -0.707106, 0.707107, 0, -0.653281, 0.382683, -0.653281, -0.923879, 0.382683, 0, -0.5, -0.707107, -0.5, 0, -0.382684, -0.923879, 0, -0.707107, -0.707107, -0.707107, 0, -0.707107, 0, 0.382683, -0.923879, 0, 0, -1, -0.270598, 0.92388, -0.270598, 0, 0.707107, -0.707107, -0.5, 0.707107, -0.5, -0.270598, -0.92388, -0.270598, 0, -0.707107, -0.707107, 0, -0.92388, -0.382683, -0.707107, 0, -0.707107, 0, -0.382684, -0.923879, -0.653281, -0.382684, -0.653281, -0.5, 0.707107, -0.5, 0, 0.382683, -0.923879, -0.653281, 0.382683, -0.653281, -0.270598, 0.92388, -0.270598, 0, 1, 0, 0, 0.92388, -0.382683, 0, -1, 0, -0.270598, -0.92388, -0.270598, 0, -0.92388, -0.382683, 0, -0.707107, -0.707107, 0.270598, -0.92388, -0.270598, 0, -0.92388, -0.382683, 0, 0, -1, 0.653281, -0.382684, -0.653281, 0, -0.382684, -0.923879, 0, 0.707107, -0.707107, 0.653281, 0.382683, -0.653281, 0, 0.382683, -0.923879, 0, 0.92388, -0.382683, 0, 1, 0, 0.270598, 0.92388, -0.270598, 0, -1, 0, 0, -0.92388, -0.382683, 0.270598, -0.92388, -0.270598, 0, -0.382684, -0.923879, 0.5, -0.707107, -0.5, 0, -0.707107, -0.707107, 0, 0.382683, -0.923879, 0.707107, 0, -0.707107, 0, 0, -1, 0, 0.92388, -0.382683, 0.5, 0.707107, -0.5, 0, 0.707107, -0.707107, 0.5, -0.707107, -0.5, 0.707107, -0.707107, 0, 0.382683, -0.92388, 0, 0.653281, -0.382684, -0.653281, 0.707107, 0, -0.707107, 1, 0, 0, 0.653281, 0.382683, -0.653281, 0.5, 0.707107, -0.5, 0.707107, 0.707107, 0, 0.653281, -0.382684, -0.653281, 0.923879, -0.382684, 0, 0.707107, -0.707107, 0, 0.653281, 0.382683, -0.653281, 0.923879, 0.382683, 0, 1, 0, 0, 0.5, 0.707107, -0.5, 0.270598, 0.92388, -0.270598, 0.382683, 0.92388, 0, 0.707107, 0.707107, 0, 0.5, 0.707107, 0.5, 0.653281, 0.382683, 0.653281, 0.923879, -0.382684, 0, 0.653281, -0.382684, 0.653281, 0.5, -0.707107, 0.5, 0.923879, 0.382683, 0, 0.653281, 0.382683, 0.653281, 0.707107, 0, 0.707106, 0.382683, 0.92388, 0, 0.270598, 0.92388, 0.270598, 0.5, 0.707107, 0.5, 0.382683, -0.92388, 0, 0.707107, -0.707107, 0, 0.5, -0.707107, 0.5, 1, 0, 0, 0.707107, 0, 0.707106, 0.653281, -0.382684, 0.653281, 0.653281, -0.382684, 0.653281, 0, -0.382684, 0.923879, 0, -0.707107, 0.707106, 0.653281, 0.382683, 0.653281, 0, 0.382683, 0.923879, 0, 0, 1, 0.270598, 0.92388, 0.270598, 0, 0.92388, 0.382683, 0, 0.707107, 0.707106, 0.5, -0.707107, 0.5, 0, -0.707107, 0.707106, 0, -0.92388, 0.382683, 0.707107, 0, 0.707106, 0, 0, 1, 0, -0.382684, 0.923879, 0.5, 0.707107, 0.5, 0, 0.707107, 0.707106, 0, 0.382683, 0.923879, 0, 0.92388, 0.382683, -0.270598, 0.92388, 0.270598, -0.5, 0.707107, 0.5, 0, -0.707107, 0.707106, -0.5, -0.707107, 0.5, -0.270598, -0.92388, 0.270598, 0, 0, 1, -0.707107, 0, 0.707106, -0.653281, -0.382684, 0.653281, 0, 0.707107, 0.707106, -0.5, 0.707107, 0.5, -0.653281, 0.382683, 0.653281, 0, -0.707107, 0.707106, 0, -0.382684, 0.923879, -0.653281, -0.382684, 0.653281, 0, 0.382683, 0.923879, -0.653281, 0.382683, 0.653281, -0.707107, 0, 0.707106, -0.5, -0.707107, 0.5, -0.707106, -0.707107, 0, -0.382683, -0.92388, 0, -0.707107, 0, 0.707106, -1, 0, 0, -0.923879, -0.382684, 0, -0.5, 0.707107, 0.5, -0.707106, 0.707107, 0, -0.923879, 0.382683, 0, -0.5, -0.707107, 0.5, -0.653281, -0.382684, 0.653281, -0.923879, -0.382684, 0, -0.707107, 0, 0.707106, -0.653281, 0.382683, 0.653281, -0.923879, 0.382683, 0, -0.5, 0.707107, 0.5, -0.270598, 0.92388, 0.270598, -0.382683, 0.92388, 0, -0.923879, -0.382684, 0, -0.653281, -0.382684, -0.653281, -0.5, -0.707107, -0.5, -1, 0, 0, -0.923879, 0.382683, 0, -0.653281, 0.382683, -0.653281, -0.382683, 0.92388, 0, -0.270598, 0.92388, -0.270598, -0.5, 0.707107, -0.5, -0.707106, -0.707107, 0, -0.5, -0.707107, -0.5, -0.270598, -0.92388, -0.270598, -1, 0, 0, -0.707107, 0, -0.707107, -0.653281, -0.382684, -0.653281, -0.707106, 0.707107, 0, -0.5, 0.707107, -0.5, -0.653281, 0.382683, -0.653281, -0.5, -0.707107, -0.5, -0.653281, -0.382684, -0.653281, 0, -0.382684, -0.923879, -0.707107, 0, -0.707107, -0.653281, 0.382683, -0.653281, 0, 0.382683, -0.923879, -0.270598, 0.92388, -0.270598, 0, 0.92388, -0.382683, 0, 0.707107, -0.707107, -0.270598, -0.92388, -0.270598, -0.5, -0.707107, -0.5, 0, -0.707107, -0.707107, -0.707107, 0, -0.707107, 0, 0, -1, 0, -0.382684, -0.923879, -0.5, 0.707107, -0.5, 0, 0.707107, -0.707107, 0, 0.382683, -0.923879, 0, -0.707107, -0.707107, 0.5, -0.707107, -0.5, 0.270598, -0.92388, -0.270598, 0, 0, -1, 0.707107, 0, -0.707107, 0.653281, -0.382684, -0.653281, 0, 0.707107, -0.707107, 0.5, 0.707107, -0.5, 0.653281, 0.382683, -0.653281, 0, -0.382684, -0.923879, 0.653281, -0.382684, -0.653281, 0.5, -0.707107, -0.5, 0, 0.382683, -0.923879, 0.653281, 0.382683, -0.653281, 0.707107, 0, -0.707107, 0, 0.92388, -0.382683, 0.270598, 0.92388, -0.270598, 0.5, 0.707107, -0.5,
			];

			let vertices = this.vertices;



			let normals = getFlatNormals(vertices);
			this.normalsBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

			this.positionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
			//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

			this.uv = [];
			let PI2 = 2 * Math.PI
			let d1 = new CG.Vector3();
			let d2 = new CG.Vector3();
			let d3 = new CG.Vector3();
			let u1, vv1, u2, vv2, u3, v3;
			for (let i=0; i<vertices.length/3; i+=3) {
				d1.set( vertices[i*3],     vertices[i*3 +1],     vertices[i*3 +2] );
				d1 = d1.normalize();
				u1 = 0.5 + (Math.atan2(d1.z, d1.x)) / PI2;
				vv1 = 0.5 - (Math.asin(d1.y)) / Math.PI;

				d2.set( vertices[(i+1)*3], vertices[(i+1)*3 +1], vertices[(i+1)*3 +2] );
				d2 = d2.normalize();
				u2 = 0.5 + (Math.atan2(d2.z, d2.x)) / PI2;
				vv2 = 0.5 - (Math.asin(d2.y)) / Math.PI;

				d3.set( vertices[(i+2)*3], vertices[(i+2)*3 +1], vertices[(i+2)*3 +2] );
				d3 = d3.normalize();
				u3 = 0.5 + (Math.atan2(d3.z, d3.x)) / PI2;
				v3 = 0.5 - (Math.asin(d3.y)) / Math.PI;

				if (Math.abs(u1-u2) > 0.90) {
					if (u1 > u2) {
						u2 = 1 + u2;
					}
					else {
						u1 = 1 + u1;
					}
				}
				if (Math.abs(u1-u3) > 0.90) {
					if (u1 > u3) {
						u3 = 1 + u3;
					}
					else {
						u1 = 1 + u1;
					}
				}
				if (Math.abs(u2-u3) > 0.90) {
					if (u2 > u3) {
						u3 = 1 + u3;
					}
					else {
						u2 = 1 + u2;
					}
				}

				this.uv.push( u1, vv1, u2, vv2, u3, v3 );
			}

			let uvs = this.uv;




			//declaramos las texturas
			let texture = gl.createTexture();
			gl.activeTexture(gl.TEXTURE2);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, CG.ImageLoader.getImage("imagenes/planeta1.jpg"));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			let normal_texture = gl.createTexture();
			gl.activeTexture(gl.TEXTURE3);
			gl.bindTexture(gl.TEXTURE_2D, normal_texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, CG.ImageLoader.getImage("imagenes/planor.jpeg"));
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			this.UVBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);


			//////////////////////////////////////////////////////////////////
			// delta_pos_1 = delta_uv1.x * T + delta_uv1.y * B
			// delta_pos_2 = delta_uv2.x * T + delta_uv2.y * B
			//////////////////////////////////////////////////////////////////
			let v0 = new  CG.Vector3();
			let v1 = new  CG.Vector3();
			let v2 = new  CG.Vector3();
			let uv0 = new  CG.Vector3();
			let uv1 = new  CG.Vector3();
			let uv2 = new  CG.Vector3();
			let delta_pos_1, delta_pos_2;
			let delta_uv_1, delta_uv_2;
			let r, div;
			let tangent, bitangent;
			let tangents = [];
			let bitangents = [];
			for (let i=0; i<vertices.length/3; i+=3) {
				v0.set( vertices[i*3],     vertices[i*3 +1],     vertices[i*3 +2] );
				v1.set( vertices[(i+1)*3], vertices[(i+1)*3 +1], vertices[(i+1)*3 +2] );
				v2.set( vertices[(i+2)*3], vertices[(i+2)*3 +1], vertices[(i+2)*3 +2] );

				uv0.set( uvs[i*2],     uvs[i*2 +1],     0 );
				uv1.set( uvs[(i+1)*2], uvs[(i+1)*2 +1], 0 );
				uv2.set( uvs[(i+2)*2], uvs[(i+2)*2 +1], 0 );

				delta_pos_1 = CG.Vector3.subtract(v1, v0);
				delta_pos_2 = CG.Vector3.subtract(v2, v0);

				delta_uv_1 = CG.Vector3.subtract(uv1, uv0);
				delta_uv_2 = CG.Vector3.subtract(uv2, uv0);

				div = (delta_uv_1.x * delta_uv_2.y - delta_uv_2.x * delta_uv_1.y);
				r = (div <= 0.000001) ? 1 : (1/div);

				tangent = CG.Vector3.subtract(
					delta_pos_1.multiplyEscalar(delta_uv_2.y),
					delta_pos_2.multiplyEscalar(delta_uv_1.y),
				).multiplyEscalar(r).normalize();

				bitangent = CG.Vector3.subtract(
					delta_pos_2.multiplyEscalar(delta_uv_1.x),
					delta_pos_1.multiplyEscalar(delta_uv_2.x),
				).multiplyEscalar(r).normalize();

				tangents.push(
					tangent.x, tangent.y, tangent.z,
					tangent.x, tangent.y, tangent.z,
					tangent.x, tangent.y, tangent.z,
				);
				bitangents.push(
					bitangent.x, bitangent.y, bitangent.z,
					bitangent.x, bitangent.y, bitangent.z,
					bitangent.x, bitangent.y, bitangent.z,
				);
			}

			//////////////////////////////////////////////////////////////////
			// Proceso de ortogonalización de Gram-Schmidt
			// T - N*(N·T)
			//////////////////////////////////////////////////////////////////
			let tmp_T = new CG.Vector3();
			let tmp_N = new CG.Vector3();
			let tmp;
			for (let i=0, l=tangents.length/3; i<l; i++) {
				tmp_T.set( tangents[i*3], tangents[i*3 +1], tangents[i*3 +2] );
				tmp_N.set( normals[i*3], normals[i*3 +1], normals[i*3 +2] );
				tmp = (CG.Vector3.subtract(tmp_T, tmp_N.multiplyEscalar(CG.Vector3.dot(tmp_N, tmp_T)))).normalize();
				tangents[i*3] = tmp.x;
				tangents[i*3 +1] = tmp.y;
				tangents[i*3 +2] = tmp.z;
			}


			this.tangentBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);

			this.bitangentBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bitangents), gl.STATIC_DRAW);

			this.numElements = this.vertices.length/3;
		}



		/**
		 * @param {Matrix4} tr
		 */
	  setT(tr){
		  this.initial_transform =tr;

	  }

		/**
		 * @param {WebGLRenderingContext} gl
		 * @param {Matrix4} PV
		 * @param {Matrix4} V
		 * @param {Array} light_pos
		 * @param {Array} camera_pos
		 * @param {Array} luz_color
		 */
		draw(gl, PV, V, light_pos, camera_pos,luz_color) {
			gl.useProgram(this.program);

			gl.uniform1i(this.u_texture, 2);
			gl.uniform1i(this.u_texture_normal, 3);

			gl.enableVertexAttribArray(this.a_position);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
			gl.vertexAttribPointer(this.a_position, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(this.a_texcoord);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.UVBuffer);
			gl.vertexAttribPointer(this.a_texcoord, 2, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(this.a_normal);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
			gl.vertexAttribPointer(this.a_normal, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(this.a_tangent);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
			gl.vertexAttribPointer(this.a_tangent, 3, gl.FLOAT, false, 0, 0);

			gl.enableVertexAttribArray(this.a_bitangent);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bitangentBuffer);
			gl.vertexAttribPointer(this.a_bitangent, 3, gl.FLOAT, false, 0, 0);

			gl.uniformMatrix4fv(this.u_PVM_matrix, false, CG.Matrix4.multiply(PV, this.initial_transform).toArray());

			gl.uniformMatrix4fv(this.u_M_matrix, false, CG.Matrix4.multiply(V, this.initial_transform).toArray());

			let light_v = V.multiplyVector(new CG.Vector4(light_pos[0], light_pos[1], light_pos[2], 1));
			gl.uniform3fv(this.u_light_position, [light_v.x, light_v.y, light_v.z]);



			gl.uniform3fv(this.u_camera_position, camera_pos);

			//color

			gl.uniform4fv(this.v_color, [luz_color[0],luz_color[1],luz_color[2],1]);
			gl.uniform3fv(this.color_light, [luz_color[0],luz_color[1],luz_color[2]]);

			gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
		}
	}




	/**
  * @param {Array} vertices
  * @return {Array} normals
  */
	function getFlatNormals(vertices) {
		let normals = [];
		var i;

		for(i = 0; i < vertices.length; i= i+3){
			var length = Math.sqrt(vertices[i]*vertices[i] + vertices[i+1]*vertices[i+1] + vertices[i+2]*vertices[i+2]);
			normals.push(vertices[i]  / length);
			normals.push(vertices[i+1]/ length);
			normals.push(vertices[i+2]/ length);
		}

		return normals;
	}

	CG.planeta = planeta;
	return CG;
}(CG || {}));
