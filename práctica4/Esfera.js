var CG = (function(CG) {
  class Esfera {

    /**
    * @param {WebGLRenderingContext} gl
    * @param {Number[]} color
    * @param {Number} radius
    * @param {Number} Nu
    * @param {Number} Nv
    * @param {Matrix4} initial_transform
    */
        constructor(gl, color, radius, Nu, Nv, initial_transform) {


          let smooth_vertices = this.getVertices(radius, Nu, Nv);

          let faces = this.getFaces(radius, Nu, Nv);
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
          let indices = this.getFaces(radius, Nu, Nv);
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
        * @param {Number} width
        * @param {Number} height
        * @param {Number} length
        * @return{Array} pos
        */
    getVertices(radius, Nu, Nv) {
      let pos = buildSphere(radius, Nu, Nv).vertices;
      return pos;
    }

    /**
    * @param {Number} width
    * @param {Number} height
    * @param {Number} length
    * @return{Array} face
    */
    getFaces(radius, Nu, Nv) {
    	  let face = buildSphere(radius, Nu, Nv).faces;

      return face;

    }

    /**
    * @param {WebGLRenderingContext} gl
    */
        draw(gl) {
            gl.drawArrays(gl.TRIANGLES, 0, this.flatNumElements);

        }
      }



      /**
      * @param {Number} radius
      * @param {Matrix4} initial_transform
      * @param {Number} Nu
      * @param {Number} Nv
      * @return {Array} vertices
      * @return {Array} faces
      * @return {Array} new_vertices
      * @return {Array} faces
      */
      function buildSphere(radius, Nu, Nv, initial_transform) {
    radius = radius || 1;
    Nu = Nu || 2;
    Nv = Nv || 2;
    let vertices = [];
    let phi;
    let theta;

        vertices.push(0);
    vertices.push(radius);
        vertices.push(0);
    for (let i=1; i<Nu; i++) {
      phi = (i*Math.PI)/Nu;

      for (let j=0; j<Nv; j++) {
        theta = (j*2*Math.PI)/Nv;

        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.cos(phi);
        z = radius * Math.sin(phi) * Math.sin(theta);

            vertices.push(x);
                vertices.push(y);
                    vertices.push(z);
      }
    }
    vertices.push(0);
vertices.push(-radius);
    vertices.push(0);
//TAPA
    let faces = [];
    for (let i=0; i<Nv; i++) {
      faces.push(0);
        faces.push(((i+1)%Nv)+1);
        faces.push((i%Nv)+1);
    }

//CUERPO
    for (let i=1; i<Nu-1; i++) {
      for (let j=0; j<Nv; j++) {
        faces.push(j+1 +(i-1)*Nv);
            faces.push((j+1)%Nv +1 +(i-1)*Nv);
            faces.push((j+1)%Nv +1 +i*Nv);
              faces.push(j+1 +(i-1)*Nv);
              faces.push((j+1)%Nv +1 +i*Nv);
            faces.push(j+1 +i*Nv);

      }
    }

//TAPA
for (i=0; i<Nv; i++) {
 faces.push(vertices.length-1);
 faces.push(vertices.length-1-Nv +i);
 faces.push(vertices.length-1-Nv +((i+1)%Nv));
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


CG.Esfera = Esfera;
return CG;
}(CG || {}));
