var CG = (function(CG) {

	class Vector4 {

		/**
		* Método constructor de un vector que recibe cuatro parámetros
		*/
		constructor(x=0, y=0, z=0, w=0) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		/**
		* Funcion que suma los argumentos de dos vectores entrada a entrada
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Vector4}
		*/
		static add(u, v){
			return new CG.Vector4(u.x + v.x, u.y + v.y, u.z + v.z, u.w + v.w);
		}

		/**
		* Funcion que crea un nuevo vector con los mismos argumentos que el vector
		* que manda a llamar al metodo
		* @return {Vector4}
		*/
		clone(){
			return new CG.Vector4(this.x, this.y, this.z, this.w);
		}
		
		/**
		* Funcion que calcula la distancia euclidiana entre dos vectores usando la formula
		* dist(u, v) = √(u1 - v1)² + (u2 - v2)² ... (un - vn)²
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static distance(u, v){
			return Math.sqrt(Math.pow(Math.abs(u.x - v.x), 2) + Math.pow(Math.abs(u.y - v.y), 2) + Math.pow(Math.abs(u.z - v.z), 2) + Math.pow(Math.abs(u.w - v.w), 2));
		}
		
		/**
		* Funcion que calcula el producto punto de dos vectores usando la formula
		* X·Y = x1*y1+...+xn*yn
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static dot(u, v){
			return u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
		}
		
		/**
		* Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente 
		* iguales, bajo una ε = 0.000001, y falso en caso contrario.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Boolean}
		*/
		static equals(u, v){
			if(Math.abs(u.x - v.x) <= .000001 && Math.abs(u.y - v.y) <= .000001 && Math.abs(u.z - v.z) <= .000001 && Math.abs(u.w - v.w) <= .000001){
				return true;
			}else{
				return false;
			}
		}
		
		/**
		* función que devuelve verdadero en caso de que sus argumentos sean exactamente 
		* iguales, y falso en caso contrario.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Boolean}
		*/
		static exactEquals(u, v){
			if(u.x===v.x && u.y===v.y && u.z===v.z && u.w===v.w){
				return true;
			}else{
				return false;
			}
		}
		
		/**
		* Funcion que calcula el largo de un vector usando la formula
		* |x|=sqrt(x_1^2+x_2^2+...+x_n^2) 
		* @return {Number}
		*/
		length(){
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2));
		}
		
		/**
		* Funcion que normaliza un vector dividiendo cada entrada entre el largo del vector
		* @return {Vector4}
		*/
		normalize(){
			return new CG.Vector4(this.x/this.length(), this.y/this.length(), this.z/this.length(), this.w/this.length());
		}
		
		/**
		* función que asigna nuevos valores a los componentes del vector con que se llama.
		* @param {Number} x
		* @param {Number} y
		* @param {Number} z
		*/
		set(x, y, z){
			this.x = x;
			this.y = y;
			this.z = z;
		}
		
		/**
		*función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
		* @param {Vector4} u
		* @param {Vector4} v
		* @return {Number}
		*/
		static squaredDistance(u, v){
			return Math.pow(Math.abs(u.x - v.x), 2) + Math.pow(Math.abs(u.y - v.y), 2) + Math.pow(Math.abs(u.z - v.z), 2) + Math.pow(Math.abs(u.w - v.w), 2);
		}
		
		/**
		* función que devuelve el tamaño del vector al cuadrado.
		* @return {Number}
		*/
		squaredLength(){
			return Math.pow(this.length(), 2);
		}
		
		/**
		* Funcion que asigna todos los parametros del vector a cero
		*/
		zero(){
			this.set(0,0,0,0);
		}

	}

	CG.Vector4 = Vector4;
	return CG;
})(CG || {});
