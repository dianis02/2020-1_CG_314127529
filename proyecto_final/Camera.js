var CG = (function(CG) {
  let up;
  let angle_incr = Math.PI/16;

  class Camera {
    constructor(pos, rotation) {
      this.pos = pos || new CG.Vector3();
      this.rotation = rotation || 0;
      this.coi = new CG.Vector3();
      up = new CG.Vector3(0, 1, 0);

      this.getMatrix();
    }

    /**
     * @return {Matrix4}
     */
    getMatrix() {
      let eye = this.pos;
      this.coi = new CG.Vector3(
        this.pos.x + Math.cos(this.rotation),
        this.pos.y,
        this.pos.z + Math.sin(this.rotation)
      );

      var w = CG.Vector3.subtract(eye, this.coi).normalize();
      var u = CG.Vector3.cross(up, w).normalize();
      var v = CG.Vector3.cross(w, u);

      const a30= -u.x * eye.x - u.y * eye.y - u.z * eye.z;
      const a31= -v.x * eye.x - v.y * eye.y - v.z * eye.z;
      const a32= -w.x * eye.x - w.y * eye.y - w.z * eye.z;

      return new CG.Matrix4(
        u.x, u.y, u.z, a30,
        v.x, v.y, v.z, a31,
        w.x, w.y, w.z, a32,
        0,   0,   0,   1
      );
    }

    /**
     *Movimiento adelante
     */
    moveForward() {
      let dir = CG.Vector3.subtract(this.coi, this.pos);
      this.pos = CG.Vector3.add(this.pos, dir);
    }

    /**
     *Movimiento atrás
     */
    moveBackward() {
      let dir = CG.Vector3.subtract(this.coi, this.pos);
      this.pos = CG.Vector3.subtract(this.pos, dir);
    }

    /**
     *Movimiento izquierda
     */
    moveLeft() {
      this.rotation -= angle_incr;
    }

    /**
     *Movimiento derecha
     */
    moveRight() {
      this.rotation += angle_incr;
    }

  }

  CG.Camera = Camera;
  return CG;
}(CG || {}));
