var CG = (function(CG) {

  class TextureFlatMaterial extends CG.Material {
    /**
     */
    constructor(gl) {
      let vertex_shader = `
        precision mediump float;

        attribute vec4 a_position;
        attribute vec2 a_texcoord;
    
        uniform mat4 u_PVM_matrix;
    
        varying vec2 v_texcoord;
        
        void main() {
          gl_Position = u_PVM_matrix * a_position;
          v_texcoord = a_texcoord;
        }`;
      let fragment_shader = `
        precision mediump float;

        varying vec2 v_texcoord;

        uniform sampler2D u_texture;

        void main() {
          gl_FragColor = texture2D(u_texture, v_texcoord);
        }`;

      super(gl, vertex_shader, fragment_shader);
    }
  }

  CG.TextureFlatMaterial = TextureFlatMaterial;
  return CG;
}(CG || {}));
