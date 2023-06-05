"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.addDrag = exports.addHoverOpacity = exports.addZoom = void 0;

var _d3Drag = require("d3-drag");

var _d3Selection = require("d3-selection");

var _d3Zoom = require("d3-zoom");

var _events = require("./events");
var addZoom = function addZoom(svg, zoomDepth) {
  if (zoomDepth) {
    var svgHeight = svg._groups[0][0].clientHeight;
    var svgWidth = svg._groups[0][0].clientWidth;

    var zoomed = function zoomed() {
      svg
        .selectAll("._graphZoom")
        .attr("transform", _d3Selection.event.transform);
      var currentZoom = _d3Selection.event.transform.k;
      localStorage.setItem("currentZoom", currentZoom);
    };

    var zoom = (0, _d3Zoom.zoom)()
      .extent([
        [0, 0],
        [svgWidth, svgHeight],
      ])
      .scaleExtent([1, zoomDepth])
      .on("zoom", zoomed);

    var zoomIn = function () {
      zoom.scaleBy(svg.transition().duration(500), 1.2);
      var currentZoom = zoom.scaleExtent()[1];
      localStorage.setItem("currentZoom", currentZoom);
    };

    var zoomOut = function () {
      zoom.scaleBy(svg.transition().duration(500), 0.8);
      var currentZoom = zoom.scaleExtent()[1];
      localStorage.setItem("currentZoom", currentZoom);
    };

    // Bind zoom in and zoom out functions to UI buttons
    _d3Selection.select("#zoom-in-button").on("click", zoomIn);
    _d3Selection.select("#zoom-out-button").on("click", zoomOut);

    // Retrieve and set the initial zoom level from local storage
    var initialZoom = localStorage.getItem("currentZoom");
    if (initialZoom) {
      zoom.scaleTo(svg, initialZoom);
    }

    svg.call(zoom);
  }

  return svg;
};

exports.addZoom = addZoom;

var addHoverOpacity = function addHoverOpacity(node, link, hoverOpacity) {
  node
    .on("mouseover", function (d) {
      node.style("opacity", hoverOpacity);
      (0, _d3Selection.select)(this).style("opacity", "1");
      link.style("opacity", function (link_d) {
        return link_d.source.id === d.id || link_d.target.id === d.id
          ? "1"
          : hoverOpacity;
      });
    })
    .on("mouseout", function (d) {
      node.style("opacity", "1");
      link.style("opacity", "1");
    });
  return {
    node: node,
    link: link,
  };
};

exports.addHoverOpacity = addHoverOpacity;

var addDrag = function addDrag(node, simulation, enableDrag, pullIn) {
  if (enableDrag) {
    var drag = (0, _d3Drag.drag)()
      .subject(function() {
        return (0, _events.dragsubject)(simulation);
      })
      .on("start", function() {
        return (0, _events.dragstarted)(simulation);
      })
      .on("drag", function() {
        (0, _events.dragged)(simulation);
        saveGraphPosition();
      })
      .on(
        "end",
        pullIn
          ? function() {
              return (0, _events.dragended)(simulation);
            }
          : null
      );

    node.call(drag);
  } else {
    node.call(
      (0, _d3Drag.drag)()
        .subject(function() {
          return (0, _events.dragsubject)(simulation);
        })
        .on("start", null)
        .on("drag", null)
        .on("end", null)
    );
  }

  // Save the graph position in the local storage
  function saveGraphPosition() {
    var graphPosition = {
      x: simulation.alphaTarget().x,
      y: simulation.alphaTarget().y
    };
    localStorage.setItem("graphPosition", JSON.stringify(graphPosition));
  }

  return node;
};

exports.addDrag = addDrag;
