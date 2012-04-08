var MAX_OCL, browse, container, drawGraph, oscilloRaw, reloadSpeed, reloadTimerId;

oscilloRaw = [];

MAX_OCL = 200;

reloadTimerId = null;

reloadSpeed = 100;

browse = io.connect('/browse');

browse.on('push', function(data) {
  var point;
  point = data.split(",");
  oscilloRaw.push([point[0], point[1]]);
  if (oscilloRaw.length > MAX_OCL) return oscilloRaw.shift();
});

container = document.getElementById("graphDiv");

drawGraph = function() {
  var first, graph, oscilloView, point, _i, _len;
  oscilloView = [];
  first = oscilloRaw[0][0];
  for (_i = 0, _len = oscilloRaw.length; _i < _len; _i++) {
    point = oscilloRaw[_i];
    oscilloView.push([point[0] - first, point[1]]);
  }
  return graph = Flotr.draw(container, [oscilloView], {
    xaxis: {
      minorTickFreq: 5,
      max: 2200,
      min: 0
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
