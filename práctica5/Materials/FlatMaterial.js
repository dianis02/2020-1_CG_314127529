var CG = (function(CG) {

  class FlatMaterial extends CG.Material {
    /**
     */
    constructor(gl) {
      let vertex_shader = `
        precision mediump float;

        attribute vec4 a_position;
        uniform vec4 u_color;
        uniform mat4 u_PVM_matrix;
        
        void main() {
          gl_Position = u_PVM_matrix * a_position;
        }`;
      let fragment_shader = `
        precision mediump float;

        uniform vec4 u_color;
        
        void main() {
          gl_FragColor = u_color;
        }`;

      super(gl, vertex_shader, fragment_shader);
    }
  }

  CG.FlatMaterial = FlatMaterial;
  return CG;
}(CG || {}));
