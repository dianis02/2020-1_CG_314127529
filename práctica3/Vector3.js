var CG = (function(CG) {

	class Vector3 {
		
		/**
		* Método constructor de un vector que recibe tres parámetros
		*/
		constructor(x=0, y=0, z=0) {
			this.x = x;
			this.y = y;
			this.z = z;
		}

	/**
	  * Funcion que suma los argumentos de dos vectores entrada a entrada
	  * @param {Vector3} u
	  * @param {Vector3} v
	  * @return {Vector3}
	  */
		static add(u, v) {
			return new CG.Vector3(u.x + v.x, u.y + v.y, u.z + v.z);
		}

		/**
		* Funcion que calcula el angulo entre dos vectores usando la formula
		* θ = arc cos [( A·B ) / ( |A| |B| )]
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static angle(u, v) {
			return Math.acos((u.x * v.x + u.y * v.y + u.z * v.z)/(u.length()*v.length()));
		}


		/**
		* Funcion que crea un nuevo vector con los mismos argumentos que el vector
		* que manda a llamar al metodo
		* @return {Vector3}
		*/
		clone(){
			return new CG.Vector3(this.x, this.y, this.z);
		}

		/**
		* Funcion que calcula el producto cruz entre dos funciones usando la formula
		* UxV = (u2*v3 – u3*v2 , u3*v1 – u1*v3 , u1*v2 – u2*v1)
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Vector3}
		*/
		static cross(u, v){
			return new CG.Vector3(u.y*v.z - u.z*v.y, u.z*v.x - u.x*v.z, u.x*v.y - u.y*v.x);
		}

		/**
		* Funcion que calcula la distancia euclidiana entre dos vectores usando la formula
		* dist(u, v) = √(u1 - v1)² + (u2 - v2)² ... (un - vn)²
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static distance(u, v){
			return Math.sqrt(Math.pow(Math.abs(u.x - v.x), 2) + Math.pow(Math.abs(u.y - v.y), 2) + Math.pow(Math.abs(u.z - v.z), 2));
		}

		/**
		* Funcion que calcula el producto punto de dos vectores usando la formula
		* X·Y = x1*y1+...+xn*yn
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static dot(u, v){
			return u.x * v.x + u.y * v.y + u.z * v.z;
		}

		/**
		* Función que devuelve verdadero en caso de que sus argumentos sean aproximadamente 
		* iguales, bajo una ε = 0.000001, y falso en caso contrario.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Boolean}
		*/
		static equals(u, v){
			if(Math.abs(u.x - v.x) <= .000001 && Math.abs(u.y - v.y) <= .000001 && Math.abs(u.z - v.z) <= .000001){
				return true;
			}else{
				return false;
			}
		}

		/**
		* función que devuelve verdadero en caso de que sus argumentos sean exactamente
		* iguales, y falso en caso contrario.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Boolean}
		*/
		static exactEquals(u, v){
			if(u.x===v.x && u.y===v.y && u.z===v.z){
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
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		}

		/**
		* Funcion que normaliza un vector dividiendo cada entrada entre el largo del vector
		* @return {Vector3}
		*/
		normalize(){
			return new CG.Vector3(this.x/this.length(), this.y/this.length(), this.z/this.length());
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
		* función que devuelve la distancia euclidiana al cuadrado que hay entre sus argumentos.
		* @param {Vector3} u
		* @param {Vector3} v
		* @return {Number}
		*/
		static squaredDistance(u, v){
			return Math.pow(Math.abs(u.x - v.x), 2) + Math.pow(Math.abs(u.y - v.y), 2) + Math.pow(Math.abs(u.z - v.z), 2);
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
			this.set(0,0,0);
		}

	}

	CG.Vector3 = Vector3;
	return CG;
})(CG || {});