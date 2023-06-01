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

    var drag = (0, _d3Drag.drag)()
      .on("start", function () {
        if (_d3Selection.event.sourceEvent.type !== "brush") {
          _d3Selection.event.sourceEvent.stopPropagation();
        }
      })
      .on("drag", function () {
        if (_d3Selection.event.sourceEvent.type !== "brush") {
          svg.attr("transform", _d3Selection.event.transform);
        }
      });

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

    svg.call(zoom).call(drag);
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
    node.call(
      (0, _d3Drag.drag)()
        .subject(function () {
          return (0, _events.dragsubject)(simulation);
        })
        .on("start", function () {
          return (0, _events.dragstarted)(simulation);
        })
        .on("drag", _events.dragged)
        .on(
          "end",
          pullIn
            ? function () {
                return (0, _events.dragended)(simulation);
              }
            : null,
        ),
    );
  } else {
    node.call(
      (0, _d3Drag.drag)()
        .subject(function () {
          return (0, _events.dragsubject)(simulation);
        })
        .on("start", null)
        .on("drag", null)
        .on("end", null),
    );
  }

  return node;
};

exports.addDrag = addDrag;
