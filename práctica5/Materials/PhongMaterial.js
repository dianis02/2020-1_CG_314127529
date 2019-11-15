var CG = (function(CG) {

  class PhongMaterial extends CG.Material {
    /**
     */
    constructor(gl) {
      let vertex_shader = `
        precision mediump float;

        attribute vec4 a_position;
        attribute vec3 a_normal;
        
        uniform mat4 u_PVM_matrix;
        uniform mat4 u_VM_matrix;
    
        uniform vec4 u_color;
        uniform vec3 u_light_position;
        uniform vec3 u_light_color;
        uniform float u_shininess;
    
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
        uniform vec3 u_light_color;
        uniform float u_shininess;
    
        varying vec3 v_position;
        varying vec3 v_normal;
    
        vec3 ambient = vec3(0.01, 0.01, 0.01);

        vec3 getAmbientColor(vec3 ambient, vec3 color) {
          return ambient * color;
        }
    
        vec3 getDiffuseColor(vec3 to_light, vec3 position, vec3 fragment_normal, vec4 color) {
          float cos_angle = dot(fragment_normal, to_light);
          cos_angle = clamp(cos_angle, 0.0, 1.0);
    
          return vec3(color) * cos_angle;
        }
    
        vec3 getSpecularColor(vec3 to_light, vec3 u_light_color, vec3 position, vec3 fragment_normal, vec4 color) {
          vec3 reflection = normalize( 2.0 * dot(fragment_normal, to_light) * fragment_normal - to_light );
    
          vec3 to_camera = normalize( vec3(0,0,0) - position );
    
          float cos_angle = dot(reflection, to_camera);
          cos_angle = clamp(cos_angle, 0.0, 1.0);
          cos_angle = pow(cos_angle, u_shininess);
        
          vec3 specular_color = u_light_color * cos_angle;
          vec3 object_color = vec3(color) * (1.0 - cos_angle);
    
          return specular_color;
        }
    
        void main() {
          vec3 to_light = normalize( u_light_position - v_position );
          vec3 fragment_normal = normalize(v_normal);

          // color ambiental
          vec3 ambient_color = getAmbientColor(ambient, vec3(u_color));
    
          // color difuso
          vec3 diffuse_color = getDiffuseColor(to_light, v_position, fragment_normal, u_color);
    
          // color especular
          vec3 specular_color = getSpecularColor(to_light, u_light_color, v_position, fragment_normal, u_color);
          
          gl_FragColor = vec4((ambient_color + diffuse_color + specular_color), u_color.a);
        }`;

      super(gl, vertex_shader, fragment_shader);
    }
  }

  CG.PhongMaterial = PhongMaterial;
  return CG;
}(CG || {}));
