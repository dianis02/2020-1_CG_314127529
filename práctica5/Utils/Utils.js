var CG = (function(CG) {

  /**
   * 
   */
  function registerMouseEvents(canvas, camera, draw_callback) {
    let initial_mouse_position = null;

    canvas.addEventListener("mousedown", (evt) => {
      initial_mouse_position = getMousePositionInCanvas(evt, canvas);
      canvas.addEventListener("mousemove", mousemove);
    });

    window.addEventListener("mouseup", (evt) => {
      if (initial_mouse_position) {
        camera.finishMove(initial_mouse_position, getMousePositionInCanvas(evt, canvas));
        canvas.removeEventListener("mousemove", mousemove);
        initial_mouse_position = null;
      }
    });

    function mousemove(evt) {
      camera.rotate(initial_mouse_position, getMousePositionInCanvas(evt, canvas));
      draw_callback();
    } 
  }

  function getMousePositionInCanvas(evt, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x: x, y: y };
  }

  /**
   *
   */
  function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  /**
   *
   */
  function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  /**
   *
   */
  function getIndexedData(vertices) {
    let indexed_vertices = [];
    let current_vet;
    let exist;
    for (let i=0; i<vertices.length/3; i++) {
      current_vet = [vertices[i*3], vertices[i*3+1], vertices[i*3+2]];

      exist = indexed_vertices.find((el) => {
        return el[0] == current_vet[0] && el[1] == current_vet[1] && el[2] == current_vet[2];
      });

      if (!exist) {
        indexed_vertices.push(current_vet);
      }
    }

    let indexed_faces = [];
    let index;
    for (let i=0; i<vertices.length/3; i++) {
      current_vet = [vertices[i*3], vertices[i*3+1], vertices[i*3+2]];
      index = indexed_vertices.findIndex((el) => {
        return el[0] == current_vet[0] && el[1] == current_vet[1] && el[2] == current_vet[2];
      });
      indexed_faces.push(index);
    }

    let tmp_indexed_vertices = [];
    indexed_vertices.forEach((v) => {
      tmp_indexed_vertices = tmp_indexed_vertices.concat(v);
    });
    indexed_vertices = tmp_indexed_vertices;

    let average_normals = CG.getSmoothNormals(indexed_vertices, indexed_faces);

    return {
      vertices : indexed_vertices,
      normals: average_normals,
      indices : indexed_faces,
      numIndices : indexed_faces.length
    };
  }

  /**
   *
   */
  function getFlatNormals(vertices) {
    let normals = [];
    let v1 = new CG.Vector3();
    let v2 = new CG.Vector3();
    let v3 = new CG.Vector3();
    let n;
  
    for (let i=0; i<vertices.length; i+=9) {
      v1.set( vertices[i  ], vertices[i+1], vertices[i+2] );
      v2.set( vertices[i+3], vertices[i+4], vertices[i+5] );
      v3.set( vertices[i+6], vertices[i+7], vertices[i+8] );
      n = CG.Vector3.cross(CG.Vector3.subtract(v1, v2), CG.Vector3.subtract(v2, v3)).normalize();
      normals.push(
        n.x, n.y, n.z, 
        n.x, n.y, n.z, 
        n.x, n.y, n.z
      );
    }
  
    return normals;
  }
  
  /**
   *
   */
  function getSmoothNormals(vertices, faces) {
    let normals = [];
    let v1 = new CG.Vector3();
    let v2 = new CG.Vector3();
    let v3 = new CG.Vector3();
    let i1, i2, i3;
    let tmp = new CG.Vector3();
    let n;
  
    for (let i=0; i<faces.length; i+=3) {
      i1 = faces[i  ]*3;
      i2 = faces[i+1]*3;
      i3 = faces[i+2]*3;
  
      v1.set( vertices[i1], vertices[i1 + 1], vertices[i1 + 2] );
      v2.set( vertices[i2], vertices[i2 + 1], vertices[i2 + 2] );
      v3.set( vertices[i3], vertices[i3 + 1], vertices[i3 + 2] );
      n = CG.Vector3.cross(CG.Vector3.subtract(v1, v2), CG.Vector3.subtract(v2, v3));
  
      tmp.set( normals[i1], normals[i1+1], normals[i1+2] );
      tmp = CG.Vector3.add(tmp, n);
      normals[i1  ] = tmp.x;
      normals[i1+1] = tmp.y;
      normals[i1+2] = tmp.z;
  
      tmp.set( normals[i2], normals[i2+1], normals[i2+2] );
      tmp = CG.Vector3.add(tmp, n);
      normals[i2  ] = tmp.x;
      normals[i2+1] = tmp.y;
      normals[i2+2] = tmp.z;
  
      tmp.set( normals[i3], normals[i3+1], normals[i3+2] );
      tmp = CG.Vector3.add(tmp, n);
      normals[i3  ] = tmp.x;
      normals[i3+1] = tmp.y;
      normals[i3+2] = tmp.z;
    }
  
    for (let i=0; i<normals.length; i+=3) {
      tmp.set(normals[i], normals[i+1], normals[i+2]);
      tmp = tmp.normalize();
      normals[i  ] = tmp.x;
      normals[i+1] = tmp.y;
      normals[i+2] = tmp.z;
    }
  
    return normals;
  }

  CG.getMousePositionInCanvas = getMousePositionInCanvas;

  CG.getIndexedData = getIndexedData;
  CG.getFlatNormals = getFlatNormals;
  CG.getSmoothNormals = getSmoothNormals;

  CG.registerMouseEvents = registerMouseEvents;
  CG.createShader = createShader;
  CG.createProgram = createProgram;
  return CG;
}(CG || {}));
