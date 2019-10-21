var CG = (function(CG) {
  class Tetraedro {

    /**
    * @param {WebGLRenderingContext} gl
    * @param {Number[]} color
    * @param {Number} width
    * @param {Number} height
    * @param {Number} length
    * @param {Matrix4} initial_transform
    */
        constructor(gl, color, width, height, length, initial_transform) {


          let smooth_vertices = this.getVertices(width, height, length);

          let faces = this.getFaces(width, height, length);
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
          let indices = this.getFaces(width, height, length);
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
    getVertices(width, height, length) {
      let pos = buildTetraedron(width, height, length).vertices;
      return pos;
    }

    /**
    * @param {Number} width
    * @param {Number} height
    * @param {Number} length
    * @return{Array} face
    */
    getFaces(width, height, length) {
    	  let face = buildTetraedron(width, height, length).faces;

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
      * @param {Number} width
      * @param {Matrix4} initial_transform
      * @return {Array} vertices
      * @return {Array} faces
      * @return {Array} new_vertices
      * @return {Array} faces
      */
  function buildTetraedron(width, initial_transform) {
      //let w = (width || 1)/2;
      //let h = (height || 1)/2;
      //let l = (length || 1)/2;
      width = (width || 1);
      let angle = 2*Math.PI/3;

  let x = width*2*Math.sqrt(2)/3;
  let y = 0;
  let z = -width/3;
  let x0 =  x*Math.cos(angle) + y*Math.sin(angle);
  let y0 = -x*Math.sin(angle) + y*Math.cos(angle);

  return {
    vertices: [ 0, 0, width, x0, y0, z, x0, -y0, z, x, y, z ],
    faces: [ 1, 3, 2, 0, 1, 2, 0, 2, 3, 0, 3, 1 ],
    new_vertices: [],
    matrix:initial_transform ||  new CG.Matrix4()
    //matrix: initial_transform || identity()
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


CG.Tetraedro = Tetraedro;
return CG;
}(CG || {}));
