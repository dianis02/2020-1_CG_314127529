var CG = (function(CG) {
  let g_width, g_height, g_length;

  class Joint extends CG.GenericGeometry {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {Matrix4} initial_transform
     */
    constructor(gl, material, color, width, height, length, initial_transform) {
      g_width = (width || 1) / 2;
      g_height = (height || 1) / 2;
      g_length = (length || 1) / 2;
      super(gl, material, color, initial_transform);

      this.w = width;
      this.height = height;
      this.length = length;
    }

    getVertices() {
      return [
        g_width,  g_height,  0,
        g_width, -g_height,  0,
        g_width,  g_height, 2*g_length,
        g_width, -g_height, 2*g_length,
       -g_width,  g_height,  0,
       -g_width, -g_height,  0,
       -g_width,  g_height, 2*g_length,
       -g_width, -g_height, 2*g_length
     ];
    }

    getFaces() {
      return [
        2, 1, 3,
        2, 0, 1,
        1, 4, 5,
        1, 0, 4,
        5, 6, 7,
        5, 4, 6,
        6, 3, 7,
        6, 2, 3,
        4, 2, 6,
        4, 0, 2,
        3, 5, 7,
        3, 1, 5,
      ];
    }

    getPivot() {
      return this.initial_transform.multiplyVector(new CG.Vector4());
    }

    getEnd() {
      return this.initial_transform.multiplyVector(new CG.Vector4(0, 0, this.length, 1));
    }
  }

  CG.Joint = Joint;
  return CG;
}(CG || {}));