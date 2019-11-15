var CG = (function(CG) {

  class Cube extends CG.GenericGeometry {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, material, color, initial_transform,pos) {
      super(gl, material, color, initial_transform,pos);
    }

    getVertices() {
      return [
        // frente
        1, -1,  1, 
        1,  1,  1, 
       -1,  1,  1, 
        1, -1,  1, 
       -1,  1,  1, 
       -1, -1,  1, 

       // derecha
        1, -1, -1, 
        1,  1, -1, 
        1,  1,  1, 
        1, -1, -1, 
        1,  1,  1, 
        1, -1,  1, 

       // atrás
       -1, -1, -1, 
       -1,  1, -1, 
        1,  1, -1, 
       -1, -1, -1, 
        1,  1, -1, 
        1, -1, -1, 

       // izquierda
       -1, -1,  1, 
       -1,  1,  1, 
       -1,  1, -1, 
       -1, -1,  1, 
       -1,  1, -1, 
       -1, -1, -1,

       // arriba
        1,  1,  1, 
        1,  1, -1, 
       -1,  1, -1, 
        1,  1,  1, 
       -1,  1, -1, 
       -1,  1,  1, 

       // abajo
        1, -1, -1, 
        1, -1,  1, 
       -1, -1,  1, 
        1, -1, -1, 
       -1, -1,  1,
       -1, -1, -1  
      ];
    }
  }

  CG.Cube = Cube;
  return CG;
}(CG || {}));
