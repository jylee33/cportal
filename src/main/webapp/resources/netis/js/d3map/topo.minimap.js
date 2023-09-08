"use strict";

var zoom            = null;
var base            = null,
    wrapperBorder   = 0,
    minimap         = null,
    minimapPadding  = 10;

var minimapScale    = 0.15,
    host            = null,
    base            = null,
    target          = null,
    width           = 0,
    height          = 0,
    x               = 0,
    y               = 0;

var TopoMiniMap = {

    setMiniMap: function () {

        zoom = d3.zoom().scaleExtent([0.5, 5]);

        zoom.on("zoom", TopoMiniMap.zoomHandler);

    },

    updateMinimapZoomExtents: function () {
        var scale = container.property("__zoom").k;
        var targetWidth = parseInt(target.attr("width"));
        var targetHeight = parseInt(target.attr("height"));
        var viewportWidth = host.width();
        var viewportHeight = host.height();
        zoom.translateExtent([
            [-viewportWidth/scale, -viewportHeight/scale],
            [(viewportWidth/scale + targetWidth), (viewportHeight/scale + targetHeight)]
        ]);
    },

    zoomHandler: function () {
        frame.attr("transform", d3.event.transform);
        if (d3.event.sourceEvent instanceof MouseEvent || d3.event.sourceEvent instanceof WheelEvent) {
            var transform = d3.event.transform;
            var modifiedTransform = d3.zoomIdentity.scale(1/transform.k).translate(-transform.x, -transform.y);
            host.update(modifiedTransform);
        }
        TopoMiniMap.updateMinimapZoomExtents();
    },

    miniMapConf : function () {

        var container = selection.append("g")
            .attr("class", "minimap");

        container.call(zoom);

        minimap.node = container.node();

        var frame = container.append("g")
            .attr("class", "frame")

        frame.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("filter", "url(#minimapDropShadow_qPWKOg)");

    },

    miniMapUpdate: function (hostTransform) {
        var modifiedTransform = d3.zoomIdentity.scale((1/hostTransform.k)).translate(-hostTransform.x, -hostTransform.y);
        zoom.transform(frame, modifiedTransform);
        container.property("__zoom", modifiedTransform);
        TopoMiniMap.updateMinimapZoomExtents();
    },

    miniMapRender: function () {
        container.attr("transform", "translate(" + x + "," + y + ")scale(" + minimapScale + ")");
        var node = target.node().cloneNode(true);
        node.removeAttribute("id");
        base.selectAll(".minimap .panCanvas").remove();
        minimap.node.appendChild(node); // minimap node is the container's node
        d3.select(node).attr("transform", "translate(0,0)");
        frame.select(".background")
            .attr("width", width)
            .attr("height", height);
        frame.node().parentNode.appendChild(frame.node());
    },


    miniMapWidth: function (value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    },

    miniMapHeight: function (value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    },

    miniMapX: function (value) {
        if (!arguments.length) return x;
        x = parseInt(value, 10);
        return this;
    },

    miniMapY: function (value) {
        if (!arguments.length) return y;
        y = parseInt(value, 10);
        return this;
    },

    miniMapHost: function (value) {
        if (!arguments.length) { return host;}
        host = value;
        return this;
    },

    miniMapScale: function (value) {
        if (!arguments.length) { return minimapScale; }
        minimapScale = value;
        return this;
    },

    miniMaptarget: function(value) {
        if (!arguments.length) { return target; }
        target = value;
        width  = parseInt(target.attr("width"),  10);
        height = parseInt(target.attr("height"), 10);
        return this;
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    }


};
