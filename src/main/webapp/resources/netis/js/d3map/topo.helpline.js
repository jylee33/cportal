"use strict";


var helpLineNum = 0;
var lineGenerator = null, lineString = null, vPoints = null, hPoints = null;
var helpLineNode = null;

var TopoHelpLine = {

    refresh: function (objTopo, svg, splines) {

        lineGenerator = d3.line().curve(d3.curveLinear);

        // 세로선
        TopoHelpLine.add_vHelpline(objTopo);

        // 가로선
        TopoHelpLine.add_hHelpline(objTopo);
    },

    /* 안내선 세로 추가 */
    add_vHelpline: function (objTopo) {
        vPoints = [[200, 0], [200,objTopo.vars.stageH]];
        lineString = lineGenerator(vPoints.slice(0, vPoints.length));

        helpLineNode = objTopo.vars.svgGroup.select("g.grp_helpline");

        // helpLineNode.style("display", TopoHelpLine.isManageMode(objTopo) ? "block" : "none");

        helpLineNode = helpLineNode
            .append("g")
            .attr("id", function (d) {
                return "helpLine_" + TopoHelpLine.getHelplineNum();
            })
            .attr("class", "helpg")
            .append("path")
            .attr("class", "helpline")
            .attr("data-helpLineNo", function () {
                return TopoHelpLine.getCurrLineNum();
            })
            .style('stroke-width', 1)
            .style("fill", "none")
            .style('stroke', "#FF0000")
            .attr("d", lineString)
            .attr("cursor", "col-resize")
            .style('display', function () {
                return TopoHelpLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .on("mouseenter", function () {
                d3.select(this).style("stroke-width", 3).classed("helplineSelected", true);
            })
            .on("mouseleave", function () {
                d3.select(this).style("stroke-width", 1).classed("helplineSelected", false);
            })
            .call(d3.drag()
                .on("start", function() {
                    TopoHelpLine.helpLineDragStart(this, objTopo);
                })
                .on("drag", function (d, i) {
                    vPoints = [[d3.event.x, 0], [d3.event.x,objTopo.vars.stageH]];
                    TopoHelpLine.updatePath(this, vPoints);

                })
            );
        helpLineNode.exit().remove();
        TopoHelpLine.addEvent(helpLineNode, objTopo);
        objTopo.vars.svg.select(".svgGroup").selectAll('path.helpline').classed("helplineSelected", false);
    },

    /* 안내선 가로 추가 */
    add_hHelpline: function (objTopo) {
        hPoints = [[0, 200], [objTopo.vars.stageW,200]];
        lineString = lineGenerator(hPoints.slice(0, hPoints.length));

        helpLineNode = objTopo.vars.svgGroup.select("g.grp_helpline");

        helpLineNode = helpLineNode
            .append("g")
            .attr("id", function (d) {
                return "helpLine_" + TopoHelpLine.getHelplineNum();
            })
            .attr("class", "helpg")
            .append("path")
            .attr("class", "helpline")
            .attr("data-helpLineNo", function () {
                return TopoHelpLine.getCurrLineNum();
            })
            .style('stroke-width', 1)
            .style("fill", "none")
            .style('stroke', "#FF0000")
            .attr("d", lineString)
            .attr("cursor", "row-resize")
            .style('display', function () {
                return TopoHelpLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .on("mouseenter", function () {
                d3.select(this).style("stroke-width", 3).classed("helplineSelected", true);
            })
            .on("mouseleave", function () {
                d3.select(this).style("stroke-width", 1).classed("helplineSelected", false);
            })
            .call(d3.drag()
                .on("start", function() {
                    TopoHelpLine.helpLineDragStart(this, objTopo);
                })
                .on("drag", function (d, i) {
                    hPoints = [[0, d3.event.y], [objTopo.vars.stageW,d3.event.y]];
                    TopoHelpLine.updatePath(this, hPoints);
                })
            );

        helpLineNode.exit().remove();
        TopoHelpLine.addEvent(helpLineNode, objTopo);
        objTopo.vars.svg.select(".svgGroup").selectAll('path.helpline').classed("helplineSelected", false);
    },

    helpLineDragStart: function (helpLine, objTopo) {
        objTopo.vars.svg.select(".svgGroup").selectAll('path.helpline').classed("helplineSelected", false);
        d3.select(helpLine).classed("helplineSelected", true);
    },

    updatePath: function (path, data) {
        lineGenerator = d3.line().curve(d3.curveLinear);
        lineString = lineGenerator(data.slice(0, data.length));
        d3.select(path).attr('d', lineString);
    },

    getHelplineNum: function () {
        return helpLineNum++;
    },

    getCurrLineNum: function() {
        return helpLineNum
    },

    /** 이벤트 등록 */
    addEvent: function(helpLineNode, objTopo) {

        helpLineNode
            .on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo));
    },


    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },



};


