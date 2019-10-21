var CG = (function(CG) {

	class Toro {

    /**
    * @param {WebGLRenderingContext} gl
    * @param {Number[]} color
    * @param {Number} major_radius
    * @param {Number} minor_radius
    * @param {Number} Nu
    * @param {Number} Nv
    * @param {Matrix4} initial_transform
    */
		constructor(gl, color,major_radius, minor_radius, Nu, Nv, initial_transform) {


			let smooth_vertices = this.getVertices(major_radius, minor_radius, Nu, Nv);

			let faces = this.getFaces(major_radius, minor_radius, Nu, Nv);
			let flat_vertices = [];
			for (let i=0; i<faces.length; i++) {
				flat_vertices.push(
					smooth_vertices[faces[i]*3],
					smooth_vertices[faces[i]*3 +1],
					smooth_vertices[faces[i]*3 +2]
				);
			}

			//
			this.flatPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.flatPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat_vertices), gl.STATIC_DRAW);

			//
			this.smoothPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smooth_vertices), gl.STATIC_DRAW);

			//
			let indices = this.getFaces(major_radius, minor_radius, Nu, Nv);
			this.indicesBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

			//
			let flat_normals = getFlatNormals(flat_vertices);
			this.flatNormalBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.flatNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat_normals), gl.STATIC_DRAW);

			//
			this.flatColorBuffer = gl.createBuffer();
			let flatColors = [];
			gl.bindBuffer(gl.ARRAY_BUFFER, this.flatColorBuffer);
			if (color) {
				let R = (color[0] || 0)*255;
				let G = (color[1] || 0)*255;
				let B = (color[2] || 0)*255;
				for (let i=0; i<flat_vertices.length; i++) {
					flatColors.push(R, G, B);
				}
			}
			else {
				for (let i=0; i<flat_vertices.length; i++) {
					flatColors.push(
						Math.random()*256, Math.random()*256, Math.random()*256
					);
				}
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(flatColors), gl.STATIC_DRAW);

			//
			this.smoothColorBuffer = gl.createBuffer();
			let smoothColors = [];
			gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothColorBuffer);
			if (color) {
				let R = (color[0] || 0)*255;
				let G = (color[1] || 0)*255;
				let B = (color[2] || 0)*255;
				for (let i=0; i<flat_vertices.length; i++) {
					smoothColors.push(R, G, B);
				}
			}
			else {
				for (let i=0; i<flat_vertices.length; i++) {
					smoothColors.push(
						Math.random()*256, Math.random()*256, Math.random()*256
					);
				}
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(smoothColors), gl.STATIC_DRAW);

			//
			this.flatNumElements = flat_vertices.length/3;

			//
			this.smoothNumElements = indices.length;

			this.initial_transform = initial_transform || new CG.Matrix4();
		}

    /**
    * @return {WebGLBuffer}
    */
		getPositionBuffer() {
			if (this.smooth) {
				return this.smoothPositionBuffer;
			}
			else {
				return this.flatPositionBuffer;
			}
		}

    /**
    * @return {WebGLBuffer}
    */
		getColorBuffer() {
			if (this.smooth) {
				return this.smoothColorBuffer;
			}
			else {
				return this.flatColorBuffer;
			}
		}

    /**
    * @return {WebGLBuffer}
    */
		getIndexBuffer() {
			return this.indicesBuffer;
		}

    /**
    * @return {WebGLBuffer}
    */
		getNormalBuffer() {
			if (this.smooth) {
				return this.smoothNormalBuffer;
			}
			else {
				return this.flatNormalBuffer;
			}
		}

    /**
    * @return {Number}
    */
		getNumElements() {
			return this.numElements;
		}

    /**
    * @return {Number}
    */
		getModelTransform() {
			return this.initial_transform;
		}


    /**
    * @param {Number} major_radius
    * @param {Number} minor_radius
    * @param {Number} Nu
    * @param {Number} Nv
    * @return {Array}
    */
		getVertices(major_radius, minor_radius, Nu, Nv) {
			let pos = buildTorus(major_radius, minor_radius, Nu, Nv).vertices;
			return pos;
		}

    /**
    * @param {Number} major_radius
    * @param {Number} minor_radius
    * @param {Number} Nu
    * @param {Number} Nv
    * @return {Array}
    */
		getFaces(major_radius, minor_radius, Nu, Nv) {
			let face = buildTorus(major_radius, minor_radius, Nu, Nv).faces;

			return face;

		}


        /**
        * @param {WebGLRenderingContext} gl
        */
		draw(gl) {

				gl.drawArrays(gl.TRIANGLES, 0, this.flatNumElements);
		}
	}

	CG.Toro = Toro;
	return CG;
}(CG || {}));




/**
* @param {Number} radius
* @param {Matrix4} initial_transform
* @param {Number} height
* @param {Number} Nu
* @param {Number} Nv
* @return {Array} vertices
* @return {Array} faces
* @return {Array} new_vertices
* @return {Array} faces
*/
function buildTorus(major_radius, minor_radius, Nu, Nv,initial_transform) {
	const o = {
		Nv: Nv,
		Nu: Nu,
		minor_radius: minor_radius,
		major_radius: major_radius,
		makeVerts() {
			this.vertices = [];
			this.indices = [];

			for (let slice = 0; slice <= this.Nv; ++slice) {
				const v = slice / this.Nv;
				const slice_angle = v * 2 * Math.PI;
				const cos_slices = Math.cos(slice_angle);
				const sin_slices = Math.sin(slice_angle);
				const slice_rad = this.major_radius + this.minor_radius * cos_slices;

				for (let loop = 0; loop <= this.Nu; ++loop) {
					const u = loop / this.Nu;
					const loop_angle = u * 2 * Math.PI;
					const cos_loops = Math.cos(loop_angle);
					const sin_loops = Math.sin(loop_angle);

					const x = slice_rad * cos_loops;
					const y = slice_rad * sin_loops;
					const z = this.minor_radius * sin_slices;

					this.vertices.push(x, y, z);

				}
			}

			const vertsPerSlice = this.Nu + 1;
			for (let i = 0; i < this.Nv; ++i) {
				let v1 = i * vertsPerSlice;
				let v2 = v1 + vertsPerSlice;

				for (let j = 0; j < this.Nu; ++j) {

					this.indices.push(v1);
					this.indices.push(v1 + 1);
					this.indices.push(v2);

					this.indices.push(v2);
					this.indices.push(v1 + 1);
					this.indices.push(v2 + 1);

					v1 += 1;
					v2 += 1;
				}
			}
		},
	};
	o.makeVerts();
	return {
		vertices: o.vertices,
		faces: o.indices
	};
}

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
