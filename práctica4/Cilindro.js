var CG = (function(CG) {
  class Cilindro {

    /**
    * @param {WebGLRenderingContext} gl
    * @param {Number[]} color
    * @param {Number} radius
    * @param {Number} height
    * @param {Number} Nu
    * @param {Number} Nv
    * @param {Matrix4} initial_transform
    */
        constructor(gl, color, radius, height,Nu,Nv, initial_transform) {


          let smooth_vertices = this.getVertices(radius, height, Nu,Nv);

          let faces = this.getFaces(radius, height, Nu,Nv);
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
          let indices = this.getFaces(radius, height, Nu,Nv);
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
        * @param {Number} radius
        * @param {Number} height
        * @param {Number} Nu
        * @param {Number} Nv
        * @return {Array} 
        */
    getVertices(radius, height, Nu,Nv) {
      let pos = buildCylinder(radius, height, Nu,Nv).vertices;
      return pos;
    }

    /**
    * @param {Number} radius
    * @param {Number} height
    * @param {Number} Nu
    * @param {Number} Nv
    * @return {Array}
    */
    getFaces(radius, height, Nu,Nv) {
    	  let face = buildCylinder(radius, height, Nu,Nv).faces;

      return face;

    }

        draw(gl) {

            gl.drawArrays(gl.TRIANGLES, 0, this.flatNumElements);

        }
      }




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
function buildCylinder(radius, height, Nu, Nv, initial_transform) {
  radius = (radius || 1);
  height = (height || 1);
  Nu = Nu || 2;
  Nv = Nv || 2;

  let vertices = [];

  for (let i=0; i<Nv+1; i++) {
    for (let j=0; j<Nu; j++) {
      //vertices.push([
        vertices.push(radius * Math.cos(j*2*Math.PI/Nu));
        vertices.push(-height + i*2*height/Nv);
        vertices.push(radius * Math.sin(j*2*Math.PI/Nu));
      //]);
    }
  }

  let faces = [];

  for (let i=0; i<Nv-1; i++) {
    for (let j=0; j<Nu; j++) {
      //faces.push([
        faces.push(j +i*Nu);
        faces.push((j+1)%Nu +i*Nu);
        faces.push((j+1)%Nu +(i+1)*Nu);
        faces.push(j +i*Nu);
        faces.push(j +(i+1)*Nu);
        faces.push((j+1)%Nu +(i+1)*Nu);
      //]);
    }
  }


  return {
    vertices: vertices,
    faces: faces,
    new_vertices: [],
    matrix: initial_transform || new CG.Matrix4()
  };
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



CG.Cilindro = Cilindro;
return CG;
}(CG || {}));
