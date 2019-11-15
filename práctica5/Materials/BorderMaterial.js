var CG = (function(CG) {

  class BorderMaterial extends CG.Material {
    /**
     */
    constructor(gl) {
      let vertex_shader = `
        precision mediump float;

        attribute vec4 a_position;
        attribute vec3 a_normal;

        uniform vec3 u_color;
        uniform mat4 u_PVM_matrix;

        float thickness = 0.05;
        
        void main() {
          gl_Position = u_PVM_matrix * vec4((a_position.xyz + normalize(a_normal)*thickness), 1);
        }`;
      let fragment_shader = `
        precision mediump float;

        uniform vec3 u_color;
        
        void main() {
          gl_FragColor = vec4(u_color, 1);
        }`;

      super(gl, vertex_shader, fragment_shader);
    }
  }

  CG.BorderMaterial = BorderMaterial;
  return CG;
}(CG || {}));
