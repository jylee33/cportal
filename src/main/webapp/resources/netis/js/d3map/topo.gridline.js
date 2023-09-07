"use strict";


var svgWidth = 0, svgHeight = 0;
var x, y, xAxis, yAxis, xAxisGrid, yAxisGrid;
var gridLine = null;
var margin = { top: 0, right: 0, bottom: 0, left: 0, leftGap: 2 };
var xDomain, yDomain;
var gideLineGap = 10, gideAxisGap = 10;

var TopoGridLine = {

    refresh: function (objTopo) {

        svgWidth = objTopo.vars.stageW - margin.left - margin.right;
        svgHeight = objTopo.vars.stageH - margin.top - margin.bottom;

        gideLineGap = 10; // pix 단위
        gideAxisGap = 10; // pix 단위

        xDomain = parseInt(svgWidth * gideLineGap / gideLineGap),
        yDomain = parseInt(svgHeight * gideLineGap / gideLineGap);

        gridLine = objTopo.vars.svg.select(".svgGroup").select("g.grp_gridline")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x = d3.scaleLinear().domain([0, xDomain]).range([0, svgWidth]);
        y = d3.scaleLinear().domain([0, yDomain]).range([0, svgHeight]);
        xAxis = d3.axisBottom(x).ticks(xDomain / (5 * gideAxisGap));
        yAxis = d3.axisRight(y).ticks(yDomain / (5 * gideAxisGap));
        xAxisGrid = d3.axisBottom(x).tickSize(-svgHeight).tickFormat('').ticks(xDomain/gideLineGap);
        yAxisGrid = d3.axisLeft(y).tickSize(-svgWidth).tickFormat('').ticks(yDomain/gideLineGap);

        // CreateGridLine
        TopoGridLine.createGridLines(objTopo);

    },

    /* CreateGrid */
    createGridLines: function (objTopo) {

        /* x축 눈금선 */
        gridLine
            .append("g")
            .attr('class', 'x axis-grid')
            .attr('transform', 'translate(0,' + svgHeight + ')')
            .style('display', function () {
                return TopoGridLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .style("stroke-dasharray", "2")
            .call(xAxisGrid);

        /* y축 눈금선 */
        gridLine
            .append('g')
            .attr('class', 'y axis-grid')
            .style('display', function () {
                return TopoGridLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .style("stroke-dasharray", "2")
            .call(yAxisGrid);

        /* x축 눈금자 */
        gridLine
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate('+ margin.left + ',' + '0' + ')')
            .style('display', function () {
                return TopoGridLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .call(xAxis);

        /* y축 눈금자 */
        gridLine
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + margin.leftGap +',' + '0' + ')')
            .style('display', function () {
                return TopoGridLine.isManageMode(objTopo) ? 'block' : 'none';
            })
            .call(yAxis);

    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },



};


