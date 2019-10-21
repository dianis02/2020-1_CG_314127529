var CG = (function(CG) {
  let epsilon = 0.000001;

  class Matrix4 {
    constructor(
      a00=1, a01=0, a02=0, a03=0,
      a10=0, a11=1, a12=0, a13=0,
      a20=0, a21=0, a22=1, a23=0,
      a30=0, a31=0, a32=0, a33=1,
    ) {
     this.set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33);
    }

  /**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Matrix4}
	*/
    static add(m1, m2) {
      return new Matrix4(
        m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02, m1.a03 + m2.a03,
        m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12, m1.a13 + m2.a13,
        m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22, m1.a23 + m2.a23,
        m1.a30 + m2.a30, m1.a31 + m2.a31, m1.a32 + m2.a32, m1.a33 + m2.a33
      );
    }

    /**
    	* @return {Matrix4}
    	*/
    adjoint() {
      let a00 = (this.a11 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a21 * (this.a12 * this.a33 - this.a13 * this.a32) + this.a31 * (this.a12 * this.a23 - this.a13 * this.a22));

      let a01 = -(this.a01 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a21 * (this.a02 * this.a33 - this.a03 * this.a32) + this.a31 * (this.a02 * this.a23 - this.a03 * this.a22));

      let a02 = (this.a01 * (this.a12 * this.a33 - this.a13 * this.a32) - this.a11 * (this.a02 * this.a33 - this.a03 * this.a32) + this.a31 * (this.a02 * this.a13 - this.a03 * this.a12));

      let a03 = -(this.a01 * (this.a12 * this.a23 - this.a13 * this.a22) - this.a11 * (this.a02 * this.a23 - this.a03 * this.a22) + this.a21 * (this.a02 * this.a13 - this.a03 * this.a12));

      let a10 = -(this.a10 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a20 * (this.a12 * this.a33 - this.a13 * this.a32) + this.a30 * (this.a12 * this.a23 - this.a13 * this.a22));

      let a11 = (this.a00 * (this.a22 * this.a33 - this.a23 * this.a32) - this.a20 * (this.a02 * this.a33 - this.a03 * this.a32) + this.a30 * (this.a02 * this.a23 - this.a03 * this.a22));

      let a12 = -(this.a00 * (this.a12 * this.a33 - this.a13 * this.a32) - this.a10 * (this.a02 * this.a33 - this.a03 * this.a32) + this.a30 * (this.a02 * this.a13 - this.a03 * this.a12));

      let a13 = (this.a00 * (this.a12 * this.a23 - this.a13 * this.a22) - this.a10 * (this.a02 * this.a23 - this.a03 * this.a22) + this.a20 * (this.a02 * this.a13 - this.a03 * this.a12));

      let a20 =  (this.a10 * (this.a21 * this.a33 - this.a23 * this.a31) - this.a20 * (this.a11 * this.a33 - this.a13 * this.a31) + this.a30 * (this.a11 * this.a23 - this.a13 * this.a21));

      let a21 = -(this.a00 * (this.a21 * this.a33 - this.a23 * this.a31) - this.a20 * (this.a01 * this.a33 - this.a03 * this.a31) + this.a30 * (this.a01 * this.a23 - this.a03 * this.a21));

      let a22 = (this.a00 * (this.a11 * this.a33 - this.a13 * this.a31) - this.a10 * (this.a01 * this.a33 - this.a03 * this.a31) + this.a30 * (this.a01 * this.a13 - this.a03 * this.a11));

      let a23 = -(this.a00 * (this.a11 * this.a23 - this.a13 * this.a21) - this.a10 * (this.a01 * this.a23 - this.a03 * this.a21) + this.a20 * (this.a01 * this.a13 - this.a03 * this.a11));

      let a30 = -(this.a10 * (this.a21 * this.a32 - this.a22 * this.a31) - this.a20 * (this.a11 * this.a32 - this.a12 * this.a31) + this.a30 * (this.a11 * this.a22 - this.a12 * this.a21));

      let a31 = (this.a00 * (this.a21 * this.a32 - this.a22 * this.a31) - this.a20 * (this.a01 * this.a32 - this.a02 * this.a31) + this.a30 * (this.a01 * this.a22 - this.a02 * this.a21));

      let a32 = -(this.a00 * (this.a11 * this.a32 - this.a12 * this.a31) - this.a10 * (this.a01 * this.a32 - this.a02 * this.a31) + this.a30 * (this.a01 * this.a12 - this.a02 * this.a11));

      let a33 = (this.a00 * (this.a11 * this.a22 - this.a12 * this.a21) - this.a10 * (this.a01 * this.a22 - this.a02 * this.a21) + this.a20 * (this.a01 * this.a12 - this.a02 * this.a11));

      return new Matrix4(
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33
      );
    }

    /**
  	* @return {Matrix4}
  	*/
    clone() {
      return new Matrix4(
        this.a00, this.a01, this.a02, this.a03,
        this.a10, this.a11, this.a12, this.a13,
        this.a20, this.a21, this.a22, this.a23,
        this.a30, this.a31, this.a32, this.a33
      );
    }

  /**
	* @return {Number}
	*/
    determinant() {
      let b00 = this.a00 * this.a11 - this.a01 * this.a10;
      let b01 = this.a00 * this.a12 - this.a02 * this.a10;
      let b02 = this.a00 * this.a13 - this.a03 * this.a10;
      let b03 = this.a01 * this.a12 - this.a02 * this.a11;
      let b04 = this.a01 * this.a13 - this.a03 * this.a11;
      let b05 = this.a02 * this.a13 - this.a03 * this.a12;
      let b06 = this.a20 * this.a31 - this.a21 * this.a30;
      let b07 = this.a20 * this.a32 - this.a22 * this.a30;
      let b08 = this.a20 * this.a33 - this.a23 * this.a30;
      let b09 = this.a21 * this.a32 - this.a22 * this.a31;
      let b10 = this.a21 * this.a33 - this.a23 * this.a31;
      let b11 = this.a22 * this.a33 - this.a23 * this.a32;

      return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Boolean}
	*/
    static equals(m1, m2) {
      return Math.abs(m1.a00 - m2.a00) <= epsilon &&
             Math.abs(m1.a01 - m2.a01) <= epsilon &&
             Math.abs(m1.a02 - m2.a02) <= epsilon &&
             Math.abs(m1.a03 - m2.a03) <= epsilon &&
             Math.abs(m1.a10 - m2.a10) <= epsilon &&
             Math.abs(m1.a11 - m2.a11) <= epsilon &&
             Math.abs(m1.a12 - m2.a12) <= epsilon &&
             Math.abs(m1.a13 - m2.a13) <= epsilon &&
             Math.abs(m1.a20 - m2.a20) <= epsilon &&
             Math.abs(m1.a21 - m2.a21) <= epsilon &&
             Math.abs(m1.a22 - m2.a22) <= epsilon &&
             Math.abs(m1.a23 - m2.a23) <= epsilon &&
             Math.abs(m1.a30 - m2.a30) <= epsilon &&
             Math.abs(m1.a31 - m2.a31) <= epsilon &&
             Math.abs(m1.a32 - m2.a32) <= epsilon &&
             Math.abs(m1.a33 - m2.a33) <= epsilon;
    }

    /**
	* @param {Matrix4} m1
	* @param {Matrix4} m2
	* @return {Boolean}
	*/
    static exactEquals(m1, m2) {
      return m1.a00 === m2.a00 &&
             m1.a01 === m2.a01 &&
             m1.a02 === m2.a02 &&
             m1.a03 === m2.a03 &&
             m1.a10 === m2.a10 &&
             m1.a11 === m2.a11 &&
             m1.a12 === m2.a12 &&
             m1.a13 === m2.a13 &&
             m1.a20 === m2.a20 &&
             m1.a21 === m2.a21 &&
             m1.a22 === m2.a22 &&
             m1.a23 === m2.a23 &&
             m1.a30 === m2.a30 &&
             m1.a31 === m2.a31 &&
             m1.a32 === m2.a32 &&
             m1.a33 === m2.a33;
    }

    identity() {
      this.set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
    }


    	/**
    	* @return {Matrix4}
    	*/
    invert() {
      let det = this.determinant();

      if (det !== 0) {
        let adjoint = this.adjoint();
        let t = adjoint.transpose();
        return new Matrix4(
          t.a00/det, t.a01/det, t.a02/det, t.a03/det,
          t.a10/det, t.a11/det, t.a12/det, t.a13/det,
          t.a20/det, t.a21/det, t.a22/det, t.a23/det,
          t.a30/det, t.a31/det, t.a32/det, t.a33/det
        );
      }
      return null;
    }

    /**
    	* @param {Number} left
    	* @param {Number} right
    	* @param {Number} bottom
    	* @param {Number} top
    	* @param {Number} near
    	* @param {Number} far
    	* @return {Matrix4}
    	*/
    static ortho(l, r, b, t, n, f) {
      return new Matrix4(
        2/(r-l), 0,       0,       (l+r)/(l-r),
        0,       2/(t-b), 0,       (b+t)/(b-t),
        0,       0,       2/(n-f), (f+n)/(n-f),
        0,       0,       0,        1
      );
    }


/**
* @param {Number} left
* @param {Number} right
* @param {Number} bottom
* @param {Number} top
* @param {Number} near
* @param {Number} far
* @return {Matrix4}
*/
    static frustum(l, r, b, t, n, f) {
			return new Matrix4(
				(2*n)/(r-l), 0,            (r+l)/(r-l),  0,
				0,           (2*n)/(t-b),  (t+b)/(t-b),  0,
				0,           0,            (n+f)/(n-f), (2*f*n)/(n-f),
				0,           0,           -1,            0
				);
		}

    /**
    	* @param {Number} fovy
    	* @param {Number} aspect
    	* @param {Number} near
    	* @param {Number} far
    	* @return {Matrix4}
    	*/
    static perspective(fovy, aspect, n, f) {
      var ftan = 1 / Math.tan(fovy/2);

      return new Matrix4(
        ftan/aspect, 0,     0,           0,
        0,           ftan,  0,           0,
        0,           0,     (n+f)/(n-f), (2*f*n)/(n-f),
        0,           0,    -1,           0
      );
    }

    /**
	* @param {Vector3} eye
	* @param {Vector3} center
	* @param {Vector3} up
	* @return {Matrix4}
	*/
    static lookAt(eye, center, up) {
      var w = CG.Vector3.subtract(eye, center).normalize();
      var u = CG.Vector3.cross(up, w).normalize();
      var v = CG.Vector3.cross(w, u);

      const a30= -u.x * eye.x - u.y * eye.y - u.z * eye.z;
      const a31= -v.x * eye.x - v.y * eye.y - v.z * eye.z;
      const a32= -w.x * eye.x - w.y * eye.y - w.z * eye.z;

      return new Matrix4(
        u.x, u.y, u.z, a30,
        v.x, v.y, v.z, a31,
        w.x, w.y, w.z, a32,
        0,   0,   0,   1
      );
    }

    /**
    	* @param {Matrix4} m1
    	* @param {Matrix4} m2
    	* @return {Matrix4}
    	*/
    static multiply(m1, m2) {
      return new Matrix4(
        m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20 + m1.a03 * m2.a30,
        m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21 + m1.a03 * m2.a31,
        m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22 + m1.a03 * m2.a32,
        m1.a00 * m2.a03 + m1.a01 * m2.a13 + m1.a02 * m2.a23 + m1.a03 * m2.a33,

        m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20 + m1.a13 * m2.a30,
        m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21 + m1.a13 * m2.a31,
        m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22 + m1.a13 * m2.a32,
        m1.a10 * m2.a03 + m1.a11 * m2.a13 + m1.a12 * m2.a23 + m1.a13 * m2.a33,

        m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20 + m1.a23 * m2.a30,
        m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21 + m1.a23 * m2.a31,
        m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22 + m1.a23 * m2.a32,
        m1.a20 * m2.a03 + m1.a21 * m2.a13 + m1.a22 * m2.a23 + m1.a23 * m2.a33,

        m1.a30 * m2.a00 + m1.a31 * m2.a10 + m1.a32 * m2.a20 + m1.a33 * m2.a30,
        m1.a30 * m2.a01 + m1.a31 * m2.a11 + m1.a32 * m2.a21 + m1.a33 * m2.a31,
        m1.a30 * m2.a02 + m1.a31 * m2.a12 + m1.a32 * m2.a22 + m1.a33 * m2.a32,
        m1.a30 * m2.a03 + m1.a31 * m2.a13 + m1.a32 * m2.a23 + m1.a33 * m2.a33,
      );
    }

    /**
* @param {Matrix4} m1
* @param {Number} c
* @return {Matrix4}
*/
    static multiplyScalar(m1, c) {
      return new Matrix4(
        m1.a00 * c, m1.a01 * c, m1.a02 * c, m1.a03 * c,
        m1.a10 * c, m1.a11 * c, m1.a12 * c, m1.a13 * c,
        m1.a20 * c, m1.a21 * c, m1.a22 * c, m1.a23 * c,
        m1.a30 * c, m1.a31 * c, m1.a32 * c, m1.a33 * c
      );
    }

    /**
    	* @param {Vector4} v
    	* @return {Vector4}
    	*/
    multiplyVector(v) {
      return new CG.Vector4(
        this.a00 * v.x + this.a01 * v.y + this.a02 * v.z + this.a03 * v.w,
        this.a10 * v.x + this.a11 * v.y + this.a12 * v.z + this.a13 * v.w,
        this.a20 * v.x + this.a21 * v.y + this.a22 * v.z + this.a23 * v.w,
        this.a30 * v.x + this.a31 * v.y + this.a32 * v.z + this.a33 * v.w
      );
    }

    /**
  	* @param {Number} rad
  	* @return {Matrix4}
  	*/
    static rotateX(rad) {
      let c = Math.cos(rad);
      let s = Math.sin(rad);
      return new Matrix4(
         1,  0,  0,  0,
         0,  c, -s,  0,
         0,  s,  c,  0,
         0,  0,  0,  1
      );
    }

    /**
  	* @param {Number} rad
  	* @return {Matrix4}
  	*/
    static rotateY(rad) {
      let c = Math.cos(rad);
      let s = Math.sin(rad);
      return new Matrix4(
         c,  0,  s,  0,
         0,  1,  0,  0,
        -s,  0,  c,  0,
         0,  0,  0,  1
      );
    }

    /**
  	* @param {Number} rad
  	* @return {Matrix4}
  	*/
    static rotateZ(rad) {
      let c = Math.cos(rad);
      let s = Math.sin(rad);
      return new Matrix4(
         c, -s,  0,  0,
         s,  c,  0,  0,
         0,  0,  0,  0,
         0,  0,  0,  1
      );
    }

    /**
    	* @param {Vector3} v
    	* @return {Matrix4}
    	*/
    static scale(v) {
      return new Matrix4(
        v.x, 0,   0,   0,
        0,   v.y, 0,   0,
        0,   0,   v.z, 0,
        0,   0,   0,   1
      );
    }

    /**
    	* @param {Number} a00
    	* @param {Number} a01
    	* @param {Number} a02
    	* @param {Number} a03
    	* @param {Number} a10
    	* @param {Number} a11
    	* @param {Number} a12
    	* @param {Number} a13
    	* @param {Number} a20
    	* @param {Number} a21
    	* @param {Number} a22
    	* @param {Number} a23
    	* @param {Number} a30
    	* @param {Number} a31
    	* @param {Number} a32
    	* @param {Number} a33
    	*/
    set(a00=0, a01=0, a02=0, a03=0, a10=0, a11=0, a12=0, a13=0, a20=0, a21=0, a22=0, a23=0, a30=0, a31=0, a32=0, a33=0) {
      this.a00 = a00;
      this.a01 = a01;
      this.a02 = a02;
      this.a03 = a03;
      this.a10 = a10;
      this.a11 = a11;
      this.a12 = a12;
      this.a13 = a13;
      this.a20 = a20;
      this.a21 = a21;
      this.a22 = a22;
      this.a23 = a23;
      this.a30 = a30;
      this.a31 = a31;
      this.a32 = a32;
      this.a33 = a33;
    }

    /**
  	* @param {Matrix4} m1
  	* @param {Matrix4} m2
  	* @return {Matrix4}
  	*/
    static subtract(m1, m2) {
      return new Matrix4(
        m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02, m1.a03 - m2.a03,
        m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12, m1.a13 - m2.a13,
        m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22, m1.a23 - m2.a23,
        m1.a30 - m2.a30, m1.a31 - m2.a31, m1.a32 - m2.a32, m1.a33 - m2.a33
      );
    }

    /**
    	* @param {Vector3} v
    	* @return {Matrix4}
    	*/
    static translate(v) {
      return new Matrix4(
        1, 0, 0, v.x,
        0, 1, 0, v.y,
        0, 0, 1, v.z,
        0, 0, 0, 1
      );
    }

    /**
    	* @return {Matrix4}
    	*/
    transpose() {
      return new Matrix4(
        this.a00, this.a10, this.a20, this.a30,
        this.a01, this.a11, this.a21, this.a31,
        this.a02, this.a12, this.a22, this.a32,
        this.a03, this.a13, this.a23, this.a33
      );
    }

    /**
	* @return {Array}
	*/
    toVector() {
      return [
        this.a00, this.a10, this.a20, this.a30,
        this.a01, this.a11, this.a21, this.a31,
        this.a02, this.a12, this.a22, this.a32,
        this.a03, this.a13, this.a23, this.a33
      ];
    }
  }

  CG.Matrix4 = Matrix4;
  return CG;
}(CG || {}));
