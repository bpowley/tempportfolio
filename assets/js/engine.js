(function() {
  var container, delay, drawDrawing, dshft, is_safari, layers, no_webgl, resizeHandler, stop;

  is_safari = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;

  stop = false;

  no_webgl = (function() {
    var canv;
    if (!window.WebGLRenderingContext) {
      return true;
    }
    canv = document.createElement("canvas");
    if (!(canv.getContext("webgl")) && !(canv.getContext("experimental-webgl"))) {
      return true;
    }
    return false;
  })();

  if (!is_safari && !no_webgl) {
    drawings.setup("container");
    window.onresize = drawings.resize;
    window.onload = drawings.resize;
    delay = {
      drawingTime: 3000,
      drawingVary: 1500,
      overrideTime: 6000
    };
    drawings.resizeFill = true;
    drawings.resize();
    layers = [];
    dshft = 0;
    drawDrawing = function(vectorDrawing) {
      var coords, distThreshold, dx, dy, goodposition, heightScale, widthScale, x, y, _i, _len, _ref;
      if (layers.length > 4) {
        drawings.removeDrawing("drawing" + dshft);
        layers.shift();
        dshft++;
      }
      widthScale = 0.75 * drawingConfig.sceneSize;
      heightScale = 0.66 * drawings.effectiveHeight;
      distThreshold = 0.66 * drawingConfig.drawingSize;
      x = 0;
      y = 0;
      while (true) {
        _ref = [Math.random() * widthScale - widthScale / 2, Math.random() * heightScale - (heightScale / 2)], x = _ref[0], y = _ref[1];
        goodposition = true;
        for (_i = 0, _len = layers.length; _i < _len; _i++) {
          coords = layers[_i];
          dx = x - coords[0];
          dy = y - coords[1];
          if (Math.sqrt(dx * dx + dy * dy) < distThreshold) {
            goodposition = false;
            break;
          }
        }
        if (goodposition) {
          break;
        }
      }
      drawings.addDrawing("drawing" + (layers.length + dshft), vectorDrawing, x, y);
      drawings.addFilter("drawing" + (layers.length + dshft), "fuzzy", [1, 5, y]);
      drawings.addFilter("drawing" + (layers.length + dshft), "chromatic", [7, 5, 10]);
      return layers.push([x, y]);
    };
    window.startDrawing = function() {
      var imgUrl;
      if (stop) {
        return;
      }
      imgUrl = "./drawings/" + DWTDrawings[Math.floor(Math.random() * DWTDrawings.length)];
      return $.get("../FakeDWTServer/index.php?req=GET", function(img) {
        if (img !== "CAC") {
          drawDrawing(img);
          return setTimeout(startDrawing, delay.drawingTime + Math.random() * delay.drawingVary * 2 - delay.drawingVary);
        } else {
          return $.get(imgUrl, function(img) {
            drawDrawing(img);
            return setTimeout(startDrawing, delay.drawingTime + Math.random() * delay.drawingVary * 2 - delay.drawingVary);
          });
        }
      });
    };
    window.endDrawing = function() {
      if (stop) {
        return stop = false;
      } else {
        return stop = true;
      }
    };
    startDrawing();
  } else {
    container = $("#container");
    container.css("width", "100%");
    container.css("height", "100%");
    container.html("<video id='drawings_fallback' class='video-js' autoplay loop src='https://web.archive.org/web/20141006141850/http://player.vimeo.com/external/101828507.hd.mp4?s=96641fbeeeefbff1fc1827ead503c3de'></video>");
    videojs("drawings_fallback");
    resizeHandler = function() {
      return $(".vjs-tech").css("top", ($(window).height() / 2) - ($(".vjs-tech").height() / 2));
    };
    $("window").on("resize", resizeHandler);
    resizeHandler();
    $("#link").text("Use another browser to see live drawings");
  }

}).call(this);

/*
     FILE ARCHIVED ON 14:18:50 Oct 06, 2014 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:22:15 Jul 26, 2017.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
