


jQuery(function() {
    'use strict';

    var $canvas, canvas, gl,
        vShaderSource, glProgram,
        vShader, fShader, fShaderSource,
        vertexAttribLoc, vVertices, vertexPosBufferObjekt;


    $canvas = jQuery('#viewport');
    canvas = {
        width: $canvas.width(),
        height: $canvas.height()
    };


    canvas = document.getElementById('viewport');
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
  
    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    } 


    glProgram = gl.createProgram();

    vShaderSource = 
        'attribute vec4 vPosition; \n\
        void main() \n\
        { \n\
          gl_Position = vPosition; \n\
        } \n';

    vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vShaderSource);
    gl.compileShader(vShader);
    gl.attachShader(glProgram, vShader);

    fShaderSource =
      'precision mediump float;\n\
      void main() \n\
      { \n\
          gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n\
      } \n';
    fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fShaderSource);
    gl.compileShader(fShader);
    gl.attachShader(glProgram, fShader);

    gl.linkProgram(glProgram);
    gl.useProgram(glProgram);

    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    // Hintergrund loeschen
    gl.clear(gl.COLOR_BUFFER_BIT);

    vertexAttribLoc = gl.getAttribLocation(glProgram, "vPosition");

    var radius = 0.2;
    var points = [0, 0];
    _.times(356, function() {
        points.push(
                
                
            );
    });
    vVertices = new Float32Array(points);
    // ein WebGL-Buffer-Objekt wird erzeugt:
    vertexPosBufferObjekt = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBufferObjekt);
    // die Arraydaten werden an den aktiven Puffer uebergeben:
    gl.bufferData(gl.ARRAY_BUFFER, vVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexAttribLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribLoc);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vVertices.length/2);

});






