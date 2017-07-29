(function() {
  var fuzzy, i, slData, slmap, _i, _ref;

  fuzzy = {
    scanlines: 3,
    scanheight: 10,
    scanwidth: 10,
    texSize: window.drawingConfig.sceneSize
  };

  slData = new Uint8Array(fuzzy.texSize * 4);

  for (i = _i = 0, _ref = fuzzy.texSize * 4; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    slData[i] = 0;
  }

  slmap = void 0;

  window.drawings.startup.push(function() {
    return slmap = new GLOW.Texture({
      data: slData,
      width: 1,
      height: fuzzy.texSize,
      format: GL.RGBA,
      internalFormat: GL.RGBA,
      filter: GL.LINEAR,
      wrap: GL.CLAMP_TO_EDGE
    });
  });

  window.drawings.prerenderOps.push(function(frame) {
    var o, slnegative, sloffs, slstart, _j, _k, _l, _ref1, _ref2, _ref3;
    for (i = _j = 0, _ref1 = fuzzy.texSize * 4; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      slData[i] = 0;
    }
    for (i = _k = 0, _ref2 = fuzzy.scanlines; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
      slstart = Math.floor(Math.random() * (fuzzy.texSize - fuzzy.scanheight));
      slnegative = Math.random() > .5;
      sloffs = 128 + (slnegative ? -1 : 1) * (Math.random() * .5 + .5) * fuzzy.scanwidth;
      for (o = _l = 0, _ref3 = fuzzy.scanheight; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; o = 0 <= _ref3 ? ++_l : --_l) {
        slData[(slstart + o) * 4 + 3] = parseInt(sloffs * (fuzzy.scanheight - o) / fuzzy.scanheight);
      }
    }
    return slmap.swapTexture(slData);
  });

  window.shaders.fuzzy = function(FBO, camera, size, fuzziness, slmap, yoffs) {
    return {
      vertexShader: window.programs.vertexProjection,
      fragmentShader: "#ifdef GL_ES\n	precision highp float;\n#endif\n\nuniform 	sampler2D 	fboTexture;\nuniform 	float 		fuzziness;\nuniform 	float 		time;\nuniform 	sampler2D   scanlineMap;\nuniform 	float 		sloffs;\nvarying 	vec2		uv;\n\nfloat rand(vec2 co){\n	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453)-0.5;\n}\n\nvoid main( void )\n{\n	// Scanline\n	vec4 sl = texture2D(scanlineMap, vec2(0,uv.y/2.0 + sloffs));\n	float xoffs = 0.0;\n	if(sl.a>0.0)xoffs = (sl.a - 0.5)/64.0;\n\n	// Random Pixel\n	vec4 sc = vec4(texture2D( fboTexture, vec2(rand(uv)/fuzziness+uv.x+xoffs,rand(uv*1.1)/fuzziness+uv.y) ));\n	sc += vec4(texture2D( fboTexture, vec2(rand(uv*0.94)/fuzziness*2.0+uv.x+xoffs,rand(uv*1.02)/fuzziness*2.0+uv.y) ));\n	sc.a /= 2.0;\n\n	// Composite Over\n	vec4 og = texture2D(fboTexture, vec2(uv.x+xoffs,uv.y));\n	float a = og.a;\n	\n	gl_FragColor = ((a * (1.0-time)) * og + (1.0 - a) * sc) * max(1.0 - time,0.1);\n}",
      data: {
        fboTexture: FBO,
        transform: new GLOW.Matrix4(),
        time: new GLOW.Float(0),
        fuzziness: new GLOW.Float(1000 / fuzziness),
        sloffs: yoffs,
        scanlineMap: slmap,
        cameraInverse: camera.inverse,
        cameraProjection: camera.projection,
        vertices: GLOW.Geometry.Plane.vertices(size, false),
        uvs: GLOW.Geometry.Plane.uvs()
      },
      indices: GLOW.Geometry.Plane.indices()
    };
  };

  window.filters.fuzzy = function(Texture, Camera, Size, Scanlines, Fuzziness, ypos) {
    var yoffs;
    yoffs = new GLOW.Float(ypos / fuzzy.texSize);
    return {
      shader: new GLOW.Shader(window.shaders.fuzzy(Texture, Camera, Size, Fuzziness, slmap, yoffs)),
      setup: function(shader) {},
      prepare: function(shader) {
        return shader.time.add(0.0007);
      },
      "delete": function() {
        return this.shader.dispose();
      }
    };
  };

}).call(this);
