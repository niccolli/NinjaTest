(function() {
  var MAX_OCL, browse, container, drawGraph, oscillo, reloadSpeed, reloadTimerId;

  oscillo = [];

  MAX_OCL = 200;

  reloadTimerId = null;

  reloadSpeed = 100;

  browse = io.connect('/browse');

  browse.on('push', function(data) {
    var point;
    point = data.split(",");
    oscillo.push([point[0], point[1]]);
    if (oscillo.length > MAX_OCL) return oscillo.shift();
  });

  container = document.getElementById("graphDiv");

  drawGraph = function() {
    var graph;
    return graph = Flotr.draw(container, [oscillo], {
      xaxis: {
        minorTickFreq: 4
      },
      yaxis: {
        max: 1000,
        min: 0
      },
      grid: {
        minorVerticalLines: true
      }
    });
  };

  reloadTimerId = setInterval(function() {
    return drawGraph();
  }, reloadSpeed);

}).call(this);
