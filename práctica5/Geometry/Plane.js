var CG = (function(CG) {

  class Plane extends CG.GenericGeometry {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Number[]} color
     * 
     */
    constructor(gl, material, color, initial_transform) {
		
		super(gl, material, color, initial_transform);
	}
	  


      getVertices() {
		  return [
         1, 0,  1,
         1, 0, -1,
        -1, 0,  1,

        -1, 0,  1,
         1, 0, -1,
        -1, 0, -1
      ];
	  
	  }
      
    }
    
  CG.Plane = Plane;
  return CG;
}(CG || {}));
