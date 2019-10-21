var CG = (function(CG) {
  class Dodecaedro {

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
      let pos = buildDodecahedron(width, height, length).vertices;
      return pos;
    }

    /**
    * @param {Number} width
    * @param {Number} height
    * @param {Number} length
    * @return{Array} face
    */
    getFaces(width, height, length) {
    	  let face = buildDodecahedron(width, height, length).faces;

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
      function buildDodecahedron(width, initial_transform) {
        var goldenRatio = 1.6180339887;
        width = (width || 1)/Math.PI;

        let width_d_goldenRatio = width/goldenRatio;
        let width_m_goldenRatio = width*goldenRatio;

        return {
          vertices: [  width,  width,  width,  width,  width, -width,  width, -width,  width,  width, -width, -width, -width,  width,  width, -width,  width, -width, -width, -width,  width, -width, -width, -width, 0,  width_d_goldenRatio,  width_m_goldenRatio, 0,  width_d_goldenRatio, -width_m_goldenRatio, 0, -width_d_goldenRatio,  width_m_goldenRatio, 0, -width_d_goldenRatio, -width_m_goldenRatio, width_d_goldenRatio,  width_m_goldenRatio, 0,  width_d_goldenRatio, -width_m_goldenRatio, 0, -width_d_goldenRatio,  width_m_goldenRatio, 0, -width_d_goldenRatio, -width_m_goldenRatio, 0,  width_m_goldenRatio, 0,  width_d_goldenRatio,  width_m_goldenRatio, 0, -width_d_goldenRatio, -width_m_goldenRatio, 0,  width_d_goldenRatio, -width_m_goldenRatio, 0, -width_d_goldenRatio ],
          faces: [0,16,2,0,2,10,0,10,8,12,1,17,12,17,16,12,16,0,8,4,14,8,14,12,8,12,0,2,16,17,2,17,3,2,3,13,13,15,6,13,6,10,13,10,2,6,18,4,
            6,4,8,6,8,10,3,17,1,3,1,9,3,9,11,13,3,11,13,11,7,13,7,15,1,12,14,1,14,5,1,5,9,11,9,5,11,5,19,11,19,7,5,14,4,5,4,18,5,
            18,19,6,15,7,6,7,19,6,19,18],
            //faces: [0,16, 2, 10, 8, 12, 1, 17, 16, 0, 8, 4, 14, 12, 0, 2, 16, 17, 3, 13, 13, 15, 6, 10, 2, 6, 18, 4, 8,
              //10, 3, 17, 1, 9, 11, 13, 3, 11, 7, 15, 1, 12, 14, 5, 9, 11, 9, 5, 19, 7, 5, 14, 4, 18, 19, 6, 15, 7, 19, 18 ],
          new_vertices: [],
          matrix: initial_transform || identity()
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




CG.Dodecaedro = Dodecaedro;
return CG;
}(CG || {}));
