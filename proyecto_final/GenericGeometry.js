var CG = (function(CG) {

  class GenericGeometry {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {material} material
     * @param {Number[]} color
     * @param {Matrix4} initial_transform
     *
     */
    constructor(gl, material, color, initial_transform) {
      this.initial_transform = initial_transform || new CG.Matrix4();

      this.material = material || new CG.DiffuseMaterial(gl);
      this.color = color || [1.0, 0.0, 0.0, 1.0];
      this.initial_transform = initial_transform || new CG.Matrix4();

      // la geometria esta definida con indices de caras
      if (this.getFaces) {
        let smooth_vertices = this.getVertices();

        let faces = this.getFaces();
        let flat_vertices = [];
        for (let i=0; i<faces.length; i++) {
          flat_vertices.push(
            smooth_vertices[faces[i]*3],
            smooth_vertices[faces[i]*3 +1],
            smooth_vertices[faces[i]*3 +2]
          );
        }

        //
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat_vertices), gl.STATIC_DRAW);

        //
        this.smoothPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smooth_vertices), gl.STATIC_DRAW);

        //
        let indices = faces;
        this.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        //
        let flat_normals = CG.getFlatNormals(flat_vertices);
        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat_normals), gl.STATIC_DRAW);

        //
        let smooth_normals = CG.getSmoothNormals(smooth_vertices, faces);
        this.smoothNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothNormalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smooth_normals), gl.STATIC_DRAW);

        //
        this.numElements = flat_vertices.length/3;

        //
        this.numIndices = indices.length;
      }
      // la geometria solo esta definida con los vertices
      else {
        let vertices = this.getVertices();

        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        this.normals = CG.getFlatNormals(vertices);
        this.normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.numElements = vertices.length/3;

        //
        let smooth = CG.getIndexedData(vertices);
        this.smoothPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smooth.vertices), gl.STATIC_DRAW);
        this.smoothNormalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.smoothNormalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(smooth.normals), gl.STATIC_DRAW);
        this.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(smooth.indices), gl.STATIC_DRAW);
        this.numIndices = smooth.numIndices;
      }
    }


  /**
   *  
   */
    setSmooth(isSmooth) {
      this.smooth = isSmooth;
    }


  /**
   *
   */
    setMaterial(material) {
      this.material = material;
    }


  /**
   * @return {buffer}
   */
    getPositionBuffer() {
      if (this.smooth) {
        return this.smoothPositionBuffer;
      }
      else {
        return this.positionBuffer;
      }
    }

    /**
     * @return {buffer}
     */
    getNormalBuffer() {
      if (this.smooth) {
        return this.smoothNormalsBuffer;
      }
      else {
        return this.normalsBuffer;
      }
    }


    /**
     * @param {Matrix4} tr
     */
	  setT(tr){
		  this.initial_transform = (tr);
	  }


    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} PV
     * @param {Matrix4} V
     * @param {Array} light_pos
     * @param {Array} camera_pos
     * @param {Array} luz_color
     */
    draw(gl, PVM, VM, light_pos, light_dir) {
      gl.useProgram(this.material.program);

      this.material.setAttribute(gl, "a_position", this.getPositionBuffer(), 3, gl.FLOAT, false, 0, 0);
      this.material.setAttribute(gl, "a_normal", this.getNormalBuffer(), 3, gl.FLOAT, false, 0, 0);

      this.material.setUniform(gl, "u_color", this.color);
      this.material.setUniform(gl, "u_M_matrix", this.initial_transform.toArray());
      this.material.setUniform(gl, "u_PVM_matrix", CG.Matrix4.multiply(PVM, this.initial_transform).toArray());
      this.material.setUniform(gl, "u_VM_matrix", CG.Matrix4.multiply(VM, this.initial_transform).toArray());

      this.material.setUniform(gl, "u_light_position", light_pos);
      this.material.setUniform(gl, "u_light_direction", light_dir);

      this.material.setUniform(gl, "u_light_color", [1,1,1]);
      this.material.setUniform(gl, "u_shininess", 100.0);


      if (this.smooth) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
      }
      else {
        gl.drawArrays(gl.TRIANGLES, 0, this.numElements);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }

  CG.GenericGeometry = GenericGeometry;
  return CG;
}(CG || {}));
