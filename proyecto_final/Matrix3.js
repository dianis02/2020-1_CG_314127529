var CG = (function(CG) {
  let epsilon = 0.000001;

  class Matrix3 {
    constructor(
      a00=1, a01=0, a02=0,
      a10=0, a11=1, a12=0,
      a20=0, a21=0, a22=1
    ) {
      this.set(a00, a01, a02, a10, a11, a12, a20, a21, a22);
    }

    /**
    	* @param {Matrix3} m1
    	* @param {Matrix3} m2
    	* @return {Matrix3}
    	*/
    static add(m1, m2) {
      return new Matrix3(
        m1.a00 + m2.a00, m1.a01 + m2.a01, m1.a02 + m2.a02,
        m1.a10 + m2.a10, m1.a11 + m2.a11, m1.a12 + m2.a12,
        m1.a20 + m2.a20, m1.a21 + m2.a21, m1.a22 + m2.a22,
      );
    }

    /**
  	* @return {Matrix3}
  	*/
    adjoint() {
      return new Matrix3(
        (this.a11 * this.a22 - this.a12 * this.a21),
        (this.a02 * this.a21 - this.a01 * this.a22),
        (this.a01 * this.a12 - this.a02 * this.a11),

        (this.a12 * this.a20 - this.a10 * this.a22),
        (this.a00 * this.a22 - this.a02 * this.a20),
        (this.a02 * this.a10 - this.a00 * this.a12),

        (this.a10 * this.a21 - this.a11 * this.a20),
        (this.a01 * this.a20 - this.a00 * this.a21),
        (this.a00 * this.a11 - this.a01 * this.a10)
      );
    }

    /**
    	* @return {Matrix3}
    	*/
    clone() {
      return new Matrix3(
        this.a00, this.a01, this.a02,
        this.a10, this.a11, this.a12,
        this.a20, this.a21, this.a22,
      );
    }

    /**
    	* @return {Number}
    	*/
    determinant() {
      return this.a00 * (this.a22 * this.a11 - this.a12 * this.a21) +
             this.a01 * (this.a12 * this.a20 - this.a22 * this.a10) +
             this.a02 * (this.a21 * this.a10 - this.a11 * this.a20);
    }

    /**
    	* @param {Matrix3} m1
    	* @param {Matrix3} m2
    	* @return {Boolean}
    	*/
    static equals(m1, m2) {
      return Math.abs(m1.a00 - m2.a00) <= epsilon &&
             Math.abs(m1.a01 - m2.a01) <= epsilon &&
             Math.abs(m1.a02 - m2.a02) <= epsilon &&
             Math.abs(m1.a10 - m2.a10) <= epsilon &&
             Math.abs(m1.a11 - m2.a11) <= epsilon &&
             Math.abs(m1.a12 - m2.a12) <= epsilon &&
             Math.abs(m1.a20 - m2.a20) <= epsilon &&
             Math.abs(m1.a21 - m2.a21) <= epsilon &&
             Math.abs(m1.a22 - m2.a22) <= epsilon;
    }

    /**
    	* @param {Matrix3} m1
    	* @param {Matrix3} m2
    	* @return {Boolean}
    	*/
    static exactEquals(m1, m2) {
      return m1.a00 === m2.a00 &&
             m1.a01 === m2.a01 &&
             m1.a02 === m2.a02 &&
             m1.a10 === m2.a10 &&
             m1.a11 === m2.a11 &&
             m1.a12 === m2.a12 &&
             m1.a20 === m2.a20 &&
             m1.a21 === m2.a21 &&
             m1.a22 === m2.a22;
    }

    identity() {
      this.set(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      );
    }

    /**
    	* @return {Matrix3}
    	*/
    invert() {
      let det = this.determinant();
      if (det !== 0) {
        let adjoint = this.adjoint();
        let t = adjoint.transpose();
        return new Matrix3(
          t.a00/det, t.a01/det, t.a02/det,
          t.a10/det, t.a11/det, t.a12/det,
          t.a20/det, t.a21/det, t.a22/det
        );
      }
      return null;
    }

    /**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Matrix3}
	*/
    static multiply(m1, m2) {
      return new Matrix3(
        m1.a00 * m2.a00 + m1.a01 * m2.a10 + m1.a02 * m2.a20,
        m1.a00 * m2.a01 + m1.a01 * m2.a11 + m1.a02 * m2.a21,
        m1.a00 * m2.a02 + m1.a01 * m2.a12 + m1.a02 * m2.a22,

        m1.a10 * m2.a00 + m1.a11 * m2.a10 + m1.a12 * m2.a20,
        m1.a10 * m2.a01 + m1.a11 * m2.a11 + m1.a12 * m2.a21,
        m1.a10 * m2.a02 + m1.a11 * m2.a12 + m1.a12 * m2.a22,

        m1.a20 * m2.a00 + m1.a21 * m2.a10 + m1.a22 * m2.a20,
        m1.a20 * m2.a01 + m1.a21 * m2.a11 + m1.a22 * m2.a21,
        m1.a20 * m2.a02 + m1.a21 * m2.a12 + m1.a22 * m2.a22
      )
    }

    /**
	* @param {Matrix3} m1
	* @param {Number} c
	* @return {Matrix3}
	*/
    static multiplyScalar(m1, c) {
      return new Matrix3(
        m1.a00 * c, m1.a01 * c, m1.a02 * c,
        m1.a10 * c, m1.a11 * c, m1.a12 * c,
        m1.a20 * c, m1.a21 * c, m1.a22 * c
      );
    }



	/**
	* @param {Vector3} v
	* @return {Vector3}
	*/
    multiplyVector(v) {
      return new CG.Vector3(
        this.a00 * v.x + this.a01 * v.y + this.a02 * v.z,
        this.a10 * v.x + this.a11 * v.y + this.a12 * v.z,
        this.a20 * v.x + this.a21 * v.y + this.a22 * v.z
      );
    }

    /**
	* @param {Number} rad
	* @return {Matrix3}
	* rotacion en contra de las manecillas
	*/
    static rotate(rad) {
      let c = Math.cos(rad);
      let s = Math.sin(rad);
      return new Matrix3(
        c, -s, 0,
        s,  c, 0,
        0,  0, 1
      );
    }

    /**
* @param {Number} sx
* @param {Number} sy
* @return {Matrix3}
*/
    static scale(sx, sy) {
      return new Matrix3(
        sx, 0,  0,
        0,  sy, 0,
        0,  0,  1
      );
    }

    /**
  	* @param {Number} a00
  	* @param {Number} a01
  	* @param {Number} a02
  	* @param {Number} a10
  	* @param {Number} a11
  	* @param {Number} a12
  	* @param {Number} a20
  	* @param {Number} a21
  	* @param {Number} a22
  	*/
    set(a00=0, a01=0, a02=0, a10=0, a11=0, a12=0, a20=0, a21=0, a22=0) {
      this.a00 = a00;
      this.a01 = a01;
      this.a02 = a02;
      this.a10 = a10;
      this.a11 = a11;
      this.a12 = a12;
      this.a20 = a20;
      this.a21 = a21;
      this.a22 = a22;
    }

    /**
	* @param {Matrix3} m1
	* @param {Matrix3} m2
	* @return {Matrix3}
	*/
    static subtract(m1, m2) {
      return new Matrix3(
        m1.a00 - m2.a00, m1.a01 - m2.a01, m1.a02 - m2.a02,
        m1.a10 - m2.a10, m1.a11 - m2.a11, m1.a12 - m2.a12,
        m1.a20 - m2.a20, m1.a21 - m2.a21, m1.a22 - m2.a22,
      );
    }

    /**
    	* @param {Number} tx
    	* @param {Number} ty
    	* @return {Matrix3}
    	*/
    static translate(tx, ty) {
      return new Matrix3(
        1, 0, tx,
        0, 1, ty,
        0, 0, 1
      );
    }
    
    /**
    	* @return {Matrix3}
    	*/
    transpose() {
      return new Matrix3(
        this.a00, this.a10, this.a20,
        this.a01, this.a11, this.a21,
        this.a02, this.a12, this.a22,
      );
    }

toArray() {
      return [
        this.a00, this.a10, this.a20,
        this.a01, this.a11, this.a21,
        this.a02, this.a12, this.a22
      ];
    }


  }

  CG.Matrix3 = Matrix3;
  return CG;
}(CG || {}));
