var CG = (function(CG) {

  class Material {
    /**
     */
    constructor(gl, vertex_shader_txt, fragment_shader_txt) {
      this.program = CG.createProgram(
        gl,
        CG.createShader(gl, gl.VERTEX_SHADER, vertex_shader_txt),
        CG.createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_txt)
      );

      this.attributes = this.getAttributes(gl);
      this.uniforms = this.getUniforms(gl);
    }

    getAttributes(gl) {
      let attributes = {};
      let tmp_attribute_name;

      for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES); i<l; i++) {
        tmp_attribute_name = gl.getActiveAttrib(this.program, i).name;
        attributes[tmp_attribute_name] = gl.getAttribLocation(this.program, tmp_attribute_name);
      }

      return attributes;
    }

    getUniforms(gl) {
      let uniforms = {};
      let tmp_uniform;
      let name;

      for (let i=0, l=gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS); i<l; i++) {
        tmp_uniform = gl.getActiveUniform(this.program, i);

        name = tmp_uniform.name;
        if (name.substr(-3) === "[0]") {
          name = name.substr(0, name.length-3);

          for (let index=0; index<tmp_uniform.size; index++) {
            uniforms[`${name}[${index}]`] = gl.getUniformLocation(this.program, `${name}[${index}]`);
            uniforms[`${name}[${index}]`].type = tmp_uniform.type;
            uniforms[`${name}[${index}]`].size = tmp_uniform.size;
          }
        }
        else {
          uniforms[name] = gl.getUniformLocation(this.program, name);
          uniforms[name].type = tmp_uniform.type;
          uniforms[name].size = tmp_uniform.size;
        }
      }

      return uniforms;
    }

    setAttribute(gl, name, bufferData, size, type, normalized, stride, offset) {
      let attr = this.attributes[name];

      if (attr !== undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferData);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, size, type, normalized, stride, offset);
      }
    }

    setUniform(gl, name, data) {
      let unif = this.uniforms[name];

      if (unif) {
        let type = unif.type;
        let size = unif.size;

        if (type === gl.FLOAT && size > 1) {
          gl.uniform1fv(unif, data);
        }

        if (type === gl.FLOAT) {
          gl.uniform1f(unif, data);
        }

        if (type === gl.FLOAT_VEC2) {
          gl.uniform2fv(unif, data);
        }

        if (type === gl.FLOAT_VEC3) {
          gl.uniform3fv(unif, data);
        }

        if (type === gl.FLOAT_VEC4) {
          gl.uniform4fv(unif, data);
        }

        if (type === gl.INT && size > 1) {
          gl.uniform1iv(unif, data);
        }

        if (type === gl.INT) {
          gl.uniform1i(unif, data);
        }

        if (type === gl.INT_VEC2) {
          gl.uniform2iv(unif, data);
        }

        if (type === gl.INT_VEC3) {
          gl.uniform3iv(unif, data);
        }

        if (type === gl.INT_VEC4) {
          gl.uniform4iv(unif, data);
        }

        if (type === gl.BOOL) {
          gl.uniform1iv(unif, data);
        }

        if (type === gl.BOOL_VEC2) {
          gl.uniform2iv(unif, data);
        }

        if (type === gl.BOOL_VEC3) {
          gl.uniform3iv(unif, data);
        }

        if (type === gl.BOOL_VEC4) {
          gl.uniform4iv(unif, data);
        }

        if (type === gl.FLOAT_MAT2) {
          gl.uniformMatrix2fv(unif, false, data);
        }

        if (type === gl.FLOAT_MAT3) {
          gl.uniformMatrix3fv(unif, false, data);
        }

        if (type === gl.FLOAT_MAT4) {
          gl.uniformMatrix4fv(unif, false, data);
        }
      }
    }

  }

  CG.Material = Material;
  return CG;
}(CG || {}));
