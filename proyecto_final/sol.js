var CG = (function(CG) {

  class sol extends CG.GenericGeometry {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, material, color, initial_transform) {
      super(gl, material, color, initial_transform);
    }


    /**
		 * @return {Array}
		 */
    getVertices() {
		 let r = 40;
      let Nu = 22;
      let Nv = 22;

      return this.getVerticess(r,Nu,Nv);
    }


    /**
		 * @return {Array}
		 */
	   getFaces() {
		 let r = 1;
      let Nu = 22;
      let Nv = 22;

      return this.getFacess(r,Nu,Nv);
    }


  /**
   *@param {Number} r
   *@param {Number} Nu
   *@param {Number} Nv
	 * @return {Array}
	 */
	  getVerticess(r,Nu,Nv) {
      let vertices = [];
      let phi;
      let theta;
      let x, y, z;
      let g_radius = r;
      let g_Nu = Nu;
      let g_Nv = Nv;
      vertices.push(0, g_radius, 0);
      for (let i=1; i<g_Nu; i++) {
        phi = (i*Math.PI)/g_Nu;

        for (let j=0; j<g_Nv; j++) {
          theta = (j*2*Math.PI)/g_Nv;

          x = g_radius * Math.sin(phi) * Math.cos(theta);
          y = g_radius * Math.cos(phi);
          z = g_radius * Math.sin(phi) * Math.sin(theta);

          vertices.push(x, y, z);
        }
      }
      vertices.push(0, -g_radius, 0);

      return vertices;

    }

    /**
     *@param {Number} r
     *@param {Number} Nu
     *@param {Number} Nv
     * @return {Array}
     */
	  getFacess(r,Nu,Nv) {
		  let smooth_vertices = this.getVerticess(r,Nu,Nv);
      let faces = [];
      let g_Nu = Nu;
      let g_Nv = Nv;
      let g_vertices_length = smooth_vertices.length;
      for (let i=0; i<g_Nv; i++) {
        faces.push(
          0,
          ((i+1)%g_Nv)+1,
          (i%g_Nv)+1
        );
      }

      for (let i=1; i<g_Nu-1; i++) {
        for (let j=0; j<g_Nv; j++) {
          faces.push(
            j+1 +(i-1)*g_Nv,
            (j+1)%g_Nv +1 +(i-1)*g_Nv,
            (j+1)%g_Nv +1 +i*g_Nv,

            j+1 +(i-1)*g_Nv,
            (j+1)%g_Nv +1 +i*g_Nv,
            j+1 +i*g_Nv
          );
        }
      }

      for (let i=0; i<g_Nv; i++) {
        faces.push(
          g_vertices_length-1,
          g_vertices_length-1-g_Nv +i,
          g_vertices_length-1-g_Nv +((i+1)%g_Nv),
        );
      }

      return faces;
    }

  }

  CG.sol = sol;
  return CG;
}(CG || {}));
