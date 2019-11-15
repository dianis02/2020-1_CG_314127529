var CG = (function(CG) {

  class DiffuseMaterial extends CG.Material {
    /**
     */
    constructor(gl) {
      let vertex_shader = `
        precision mediump float;

        attribute vec4 a_position;
        attribute vec3 a_normal;
    
        uniform vec4 u_color;
        uniform vec3 u_light_position;
        uniform mat4 u_PVM_matrix;
        uniform mat4 u_VM_matrix;
        
        varying vec3 v_position;
        varying vec3 v_normal;
    
        void main() {
          v_position = vec3( u_VM_matrix * a_position );
          v_normal = vec3( u_VM_matrix * vec4(a_normal, 0) );
      
          gl_Position = u_PVM_matrix * a_position;
        }`;
      let fragment_shader = `
        precision mediump float;

        uniform vec4 u_color;
        uniform vec3 u_light_position;
    
        varying vec3 v_position;
        varying vec3 v_normal;
    
        vec3 ambient = vec3(0.01, 0.01, 0.01);
        
        void main() {
          vec3 to_light = normalize( u_light_position - v_position );
          vec3 fragment_normal = normalize(v_normal);
      
          float cos_angle = max(dot(fragment_normal, to_light), 0.0);
    
          gl_FragColor = vec4(u_color.rgb * cos_angle + ambient, u_color.a);
        }`;

      super(gl, vertex_shader, fragment_shader);
    }
  }

  CG.DiffuseMaterial = DiffuseMaterial;
  return CG;
}(CG || {}));
