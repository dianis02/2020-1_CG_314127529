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

  CG.registerMouseEvents = registerMouseEvents;
  CG.createShader = createShader;
  CG.createProgram = createProgram;
  return CG;
}(CG || {}));
