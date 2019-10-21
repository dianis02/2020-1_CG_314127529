var CG = (function(CG) {
  class TrackballCamera {
    constructor(pos, coi, up) {
      this.pos = pos || new CG.Vector3(0, 0, 1);
      this.coi = coi || new CG.Vector3(0, 0, 0);
      this.up  = up  || new CG.Vector3(0, 1, 0);

      this.radius = CG.Vector3.distance(this.pos, this.coi);

      let direction = CG.Vector3.subtract(this.pos, this.coi);
      this.theta = Math.atan2(direction.z, direction.x);
      this.phi = Math.atan2(direction.y, direction.x);
    }

    getMatrix() {
      let eye = this.pos;
      let center = this.coi;
      let up = this.up;

      var w = CG.Vector3.subtract(eye, center).normalize();
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

    finishMove(init_mouse, current_mouse) {
      let angles = this.getAngles(init_mouse, current_mouse);

      this.theta = angles.theta;
      this.phi   = angles.phi;
    }

    rotate(init_mouse, current_mouse) {
      let angles = this.getAngles(init_mouse, current_mouse);

      this.pos.set(
        this.radius * Math.cos(angles.phi) * Math.cos(angles.theta), 
        this.radius * Math.sin(angles.phi), 
        this.radius * Math.cos(angles.phi) * Math.sin(angles.theta)
      );
    }

    getAngles(init_mouse, current_mouse) {
      let theta = this.theta + (current_mouse.x - init_mouse.x)/100;
      let phi = Math.min(
        Math.max(
          this.phi   + (current_mouse.y - init_mouse.y)/100,
          -Math.PI/2
        ),
        Math.PI/2
      );

      return {
        theta : theta,
        phi   : phi
      };
    }
  
  }

  CG.TrackballCamera = TrackballCamera;
  return CG;
}(CG || {}));