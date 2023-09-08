"use strict";

var removeSpline = null, spline = null;
var i = 0, j = 0;
var dragged = null;
var circle = null, selected = null, lineType = null, circleCnt = null;
var createPoints = null;//[ [100, 330], [75, 200], [280, 75], [300, 75], [475, 300], [600, 200] ];
var pointsData = [], lablesData = [], startMarkersData = [], endMarkersData = [];
var lineGenerator = null, lineString = null;
var points = null, splineData = null, toolTipSpline = null;
var pData = null, splineNo = null, splinePoints = null, splineType = null, splineLabels = null;
var flowSplines = null, flowSplineId = null, flowSplineIdx = null, flowSplineInterval = null, circleCounter = null,
    splineItem = null, thisCircleNode = null, flowingSplineEffect = null;
var currSplineFlowObj = [], oldSplineFlowObj = [], flowSplineArray = [], splineFlows = [], splineFlow = [];
var lineData = null, concatConf = {}, labelObj = {}, sMarkerObj = {}, eMarkerObj = {}, confData = null;
var stMarker = null, enMarker = null;
var confData = null, flowCount = null;

var markers = [
    { id: 'circle', name: 'circle', path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0', viewbox: '-6 -6 12 12', refX: 0, refY: 0, orient: 'auto', markerWidth: 5, markerHeight: 5  },
    { id: 'square', name: 'square', path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z', viewbox: '-5 -5 10 10', refX: 0, refY: 0, orient: 'auto', markerWidth: 4, markerHeight: 4  },
    { id: 'arrow', name: 'arrow', path: 'M2,2 L10,6 L2,10 L6,6 L2,2', viewbox: '0 0 12 12', refX: 6, refY: 6, orient: 'auto-start-reverse', markerWidth: 9, markerHeight: 9 }
];

var TopoSpline = {

    callRefresh: function (objTopo) {
        this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.splines);
    },

    refresh: function (objTopo, svg, splines) {

        pointsData = [], lablesData = [], startMarkersData = [], endMarkersData = [];

        $.each(splines, function (i, v) {

            concatConf = {}, labelObj = {}, sMarkerObj = {}, eMarkerObj = {};
            confData = JSON.parse(v.splineConf);
            v.id = 'spline{0}'.substitute(v.splineNo);
            concatConf.splineNo = v.splineNo;
            concatConf.splineId = v.id;
            concatConf.splineFlowEffect = confData.splineFlowEffect;
            concatConf.splineConf = v.splineConf;
            pointsData.push(concatConf);

            labelObj.splineNo = v.splineNo;
            labelObj.splineId = v.id;
            labelObj.splineSize = v.splineSize;
            labelObj.splineLabel = confData.splineLabel;
            labelObj.splineLabelText = confData.splineLabelText;
            labelObj.splineLabelFontSize = confData.splineLabelFontSize;
            labelObj.splineLabelColor = confData.splineLabelColor;
            lablesData.push(labelObj);

            if (confData.startMarker !== 'none') {
                sMarkerObj.splineNo = v.splineNo;
                sMarkerObj.startMarker = confData.startMarker;
                sMarkerObj.markerColor = v.splineColor;
                sMarkerObj.markerData = markers.filter(x => x.id === confData.startMarker);
                startMarkersData.push(sMarkerObj);
            }

            if (confData.endMarker !== 'none') {
                eMarkerObj.splineNo = v.splineNo;
                eMarkerObj.endMarker = confData.endMarker;
                eMarkerObj.markerColor = v.splineColor;
                eMarkerObj.markerData = markers.filter(x => x.id === confData.endMarker);
                endMarkersData.push(eMarkerObj);
            }
        });

        svg.select("g.grp_object").selectAll('.markerPath').remove();
        stMarker = svg.select("g.grp_object").selectAll(".startMarker").data(startMarkersData);
        stMarker.exit().remove();
        stMarker.enter()
            .append('marker')
            .merge(stMarker)
            .attr('class', 'startMarker')
            .attr('id', function(d){ return 'marker_s_' + d.startMarker + '_'  + d.splineNo})
            .attr("data-splineNo", function (d) { return d.splineNo; })
            .attr('markerWidth', function (d) { return d.markerData[0].markerWidth; })
            .attr('markerHeight', function (d) { return d.markerData[0].markerHeight; })
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', function (d) { return d.markerData[0].orient;})
            .attr('refX', function (d) { return d.markerData[0].refX; })
            .attr('refY', function (d) { return d.markerData[0].refY; })
            .attr('viewBox', function(d){ return d.markerData[0].viewbox })
            .append('path')
            .attr('class','markerPath')
            .attr('d', function(d){ return d.markerData[0].path })
            .attr('fill', function(d,i) { return d.markerColor;})
            .style("display", TopoSpline.isManageMode(objTopo) ? "none" : "block");

        enMarker = svg.select("g.grp_object").selectAll(".endMarker").data(endMarkersData);
        enMarker.exit().remove();

        enMarker = enMarker.enter()
        // enMarker.enter()
            .append('marker')
            .merge(enMarker)
            .attr('class', 'endMarker')
            .attr('id', function(d){
                return 'marker_e_' + d.endMarker + '_'  + d.splineNo
            })
            .attr("data-splineNo", function (d) { return d.splineNo; })
            .attr('markerWidth', function (d) { return d.markerData[0].markerWidth; })
            .attr('markerHeight', function (d) { return d.markerData[0].markerHeight; })
            .attr('markerUnits', 'strokeWidth')
            .attr('orient', function (d) { return d.markerData[0].orient;})
            .attr('refX', function (d) { return d.markerData[0].refX; })
            .attr('refY', function (d) { return d.markerData[0].refY; })
            .attr('viewBox', function(d){ return d.markerData[0].viewbox })
            .append('path')
            .attr('class','markerPath')
            .attr('d', function(d){ return d.markerData[0].path })
            .attr('fill', function(d,i) { return d.markerColor;})
            .style("display", TopoSpline.isManageMode(objTopo) ? "none" : "block");

        removeSpline = svg.select("g.grp_object").selectAll("path.spline");
        TopoSpline.removeEvent(removeSpline);

        spline = svg.select("g.grp_object").selectAll("path.spline").data(splines);
        spline.exit().remove();

        spline.enter()
            // .append("path")
            .insert("path", "g.node")
            .merge(spline)
            .attr("id", function (d) { return "spline_" + d.splineNo; })
            .classed("spline", true)
            .attr("data-splineNo", function (d) { return d.splineNo; })
            .style("fill", "none")
            .style('stroke', function(d, i) { return d.splineColor; })
            .style("stroke-dasharray", function (d) { return d.splineStyle; })
            .style('stroke-width', function (d) { return d.splineSize; })
            .attr('d', function(d) {
                return d.splineString;
            })
            .attr('marker-start', function(d){
                return !TopoSpline.isManageMode(objTopo) &&
                JSON.parse(d.splineConf).startMarker != 'none' ? 'url(#marker_s_' + JSON.parse(d.splineConf).startMarker + '_' + d.splineNo  + ')' : '';
            })
            .attr('marker-end', function(d){
                return !TopoSpline.isManageMode(objTopo) &&
                JSON.parse(d.splineConf).endMarker != 'none' ? 'url(#marker_e_' + JSON.parse(d.splineConf).endMarker + '_' + d.splineNo  + ')' : '';
            })
            .classed("flowactive", function (d) { return JSON.parse(d.splineConf).splineFlowEffect != "None" ? true : false; })
            .on('click', function (e) {
                objTopo.vars.svg.select("g.grp_object").selectAll('circle.splinePoints').classed("splinePointSelected", false);
            });

        objTopo.vars.svg.select("g.grp_object").selectAll("text.splineLabel").remove();

        splineLabels = objTopo.vars.svg.select("g.grp_object").selectAll("text.splineLabel")
            .data(lablesData.filter(function (d) {
                return (d.splineLabelText != null && d.splineLabelText != "");
            }),
            function (d) { return d.splineNo; });
        splineLabels.exit().remove();

        splineLabels = splineLabels.enter()
            .selectAppend("text", "g.node")
            .attr("id", function (d) { return "splineText_" + d.splineNo; })
            .classed("splineLabel", true)
            .attr("dy", function (d) {
                return (d.splineSize + 4) * -1 ;
            })
            .append("textPath")
            .attr("xlink:href", function (d) {
                return "#spline_" + d.splineNo;
            })
            .classed("splineLabelChild", true)
            .attr("text-anchor", "middle")
            .attr("startOffset", "50%")
            // .merge(splineLabels)
            .attr("fill", function (d) {
                return d.splineLabelColor ? d.splineLabelColor : '';
            })
            .style("font-size", function (d) {
                return d.splineLabelFontSize ? d.splineLabelFontSize + "px"  : "0px";
            })
            .style("white-space", function(d) { return 'pre'; })
            .style("visibility", function (d) {
                return  d.splineLabel == '1' ? "visible" : "hidden"
            })
            .text(function (d) {
                return d.splineLabelText;
            });

        $.each(pointsData, function(idx, l) {

            // objTopo.vars.svg.select(".svgGroup").select("g.grp_spline_" + l.splineNo).selectAll('circle.splinePoints').exit().remove();
            // objTopo.vars.svg.select(".svgGroup").select("g.grp_spline_" + l.splineNo).selectAll("g.circle_" + l.splineNo).exit().remove();

            //objTopo.vars.svg.select(".svgGroup").select("g.grp_spline_" + l.splineNo).remove();

            if ( $('.grp_spline_' + l.splineNo).length == 0 ) {
                // Spline용 <g> tag
                objTopo.vars.svg.select("g.grp_object")
                    .append("g")
                    .attr("class", "grp_spline_" + l.splineNo);
            }

            pData = JSON.parse(l.splineConf);
            circleCnt = objTopo.vars.svg.select("g.grp_object").select("g.grp_spline_" + l.splineNo).selectAll('circle.splinePoints').nodes().length;
            if (pData.splinePoint.length < circleCnt) {
                objTopo.vars.svg.select("g.grp_object").select("g.grp_spline_" + l.splineNo)
                    .selectAll("g.circle_" + l.splineNo).filter(function (d, i) {
                    return i >= pData.splinePoint.length;
                }).remove();
            }

            splinePoints = objTopo.vars.svg.select("g.grp_object").select("g.grp_spline_" + l.splineNo)
            //.select("g.circle_" + l.splineNo)
                .selectAll('circle.splinePoints')
                .data( pData.splinePoint.slice(0, pData.splinePoint.length));

            splinePoints = splinePoints.enter()
                .selectAppend("g", "g.grp_spline_"+ l.splineNo)
                .classed("circle_" + l.splineNo, true)
                .append('circle')
                .attr("id", function (d, i) {
                    return "circle_" + l.splineNo + "_" + i;
                })
                .attr("data-splineNo", l.splineNo)
                //.attr("id", "circle_point_" + l.splineId)
                .attr('r', 6)
                //.call(drag)
                .merge(splinePoints)
                .classed("splinePoints", true)
                .attr('cx', function(d) {
                    return d[0]; })
                .attr('cy', function(d) {
                    return d[1];})
                .style("display", TopoSpline.isManageMode(objTopo) ? "block" : "none")
                .attr("cursor", TopoSpline.isManageMode(objTopo) ? "pointer" : "default")
                .call(d3.drag()
                    .on("start", function(d) {
                        if (TopoSpline.isManageMode(objTopo)) TopoSpline.pointDragStart(this, d, i, objTopo);
                    })
                    .on("drag", function (d, i) {
                        if (TopoSpline.isManageMode(objTopo)) TopoSpline.pointDragMove(this, d, i, objTopo);
                    })
                );

            splinePoints.exit().remove();

        });

        if ( !TopoSpline.isManageMode(objTopo) && svg.select("g.grp_object").selectAll('path.spline').nodes().length > 0) TopoSpline.splineFlow(objTopo, pointsData);

        TopoSpline.addEvent(svg.select("g.grp_object").selectAll("path.spline"), objTopo);

        return spline;
    },

    pointDragStart: function (dragP, pos, i, objTopo) {
        objTopo.vars.svgGroup.selectAll("g.shape").classed("shapeactive", false).selectAll("rect.shapeselection").style("display", "none");
        objTopo.vars.svgGroup.select("rect#clockSelect").classed("clockactive", false).style("display", "none");
        objTopo.vars.svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false).style("display", "none");
        objTopo.vars.svg.select("g.grp_object").selectAll('circle.splinePoints').classed("splinePointSelected", false);
        d3.select(dragP).classed("splinePointSelected", true);
    },

    pointDragMove: function (dragP, pos, i, objTopo) {
        splineNo = parseFloat(d3.select(dragP).attr("data-splineNo"));
        pos[0] = d3.event.x;
        pos[1] = d3.event.y;
        TopoSpline.redraw(objTopo, splineNo, pos, i);
    },

    redraw: function (objTopo, splineNo, pos, idx) {

        splineData = objTopo.vars.svg.select("g.grp_object").selectAll("path.spline").filter(function (d) {
            return d.splineNo == splineNo;
        }).data()[0];

        points = JSON.parse(splineData.splineConf);

        points.splinePoint[idx][0] = pos[0];
        points.splinePoint[idx][1] = pos[1];

        TopoSpline.updateSplinePath(splineData, points, splineNo);
    },

    splineFlow: function (objTopo, splineData) {

        currSplineFlowObj = [];
        splineFlows = [];
        lineData = null;

        for (i = 0; i < splineData.length; i++) {

            lineData = splineData[i];

            confData = JSON.parse(lineData.splineConf);
            flowCount = pData.splineFlowEffect != 'None' ? confData.splineFlowEffectCount : 0;

            for (j = 0; j < flowCount; j++) {
                // console.log("id =====================> " + "id: g" + d.linkNo +"_"+ j)
                tmpObj = {
                    id: "spline_flow_" +lineData.splineNo + "_" + j,
                    splineNo: lineData.splineNo,
                    flowFileName: 'circle',
                    width: 0,
                    height: 0,
                    lineFlowEffect: confData.splineFlowEffect,
                    lineFlowEffectColor: confData.splineFlowEffectColor,
                    lineFlowEffectSpeed: confData.splineFlowEffectSpeed
                };

                currSplineFlowObj.push(_.cloneDeep(tmpObj));
                // flowObj.flowCheckArr.push("spline_flow_" + d.splineNo + "_" + j);
                splineFlows.push(tmpObj);
            }

        }

        if ( JSON.stringify(currSplineFlowObj) === JSON.stringify(oldSplineFlowObj) &&
            objTopo.vars.svg.selectAll("circle.flow").nodes().length > 0) {
            return;
        }
        else {
            flowSplineArray = [];

            if (typeof flowSplineInterval !== "undefined" && flowSplineInterval) {
                clearInterval(flowSplineInterval);
                flowSplineInterval = null;
            }


        }
        oldSplineFlowObj = _.cloneDeep(currSplineFlowObj);



        splineFlow = objTopo.vars.svg.select("g.grp_object").selectAll("circle.flow").data(splineFlows);
        splineFlow.exit().remove();

        /* spline flow 생성 */
        splineFlow = splineFlow.enter()
            .insert("circle", "g.node")
            //.append("circle")
            .merge(splineFlow)
            .attr("class", "flow")
            .attr("id", function (d) { return d.id; })
            // .attr("cx", function (d) { return d.cx; })
            // .attr("cy", function (d) { return d.cy; })
            .attr("r", 5)
            .attr("fill", function (d) {
                return d.lineFlowEffectColor;
            })
            .style("display", "none");
            // .style('opacity', 1);

        if ( !TopoSpline.isManageMode(objTopo) ) TopoSpline.flowingLoop(objTopo);

    },

    flowingLoop: function(objTopo){

        // console.log(" flowInterval ================ ==> " + flowInterval);
        // clearInterval(flowInterval);

        flowSplines = objTopo.vars.svg.selectAll("path.spline.flowactive").data();

        flowSplineIdx = 0;
        flowSplineInterval = setInterval(function flowLoop() {

            circleCounter = 0;

            if (flowSplineIdx >= 0) {
                splineItem = null;
                thisCircleNode = null;
                $.each(flowSplines, function (idx, line) {

                    splineItem = objTopo.vars.svg.selectAll("path.spline").filter(function (d, i) {
                        return d.splineNo == line.splineNo;
                    });

                    // console.log(" before flowIdx ================ ==> " + flowIdx);
                    // linkNo 번호의 flowIdx 번호(0 ~ n 번까지)의 imageFlow 노드 Get
                    flowSplineId = "spline_flow_" + line.splineNo + "_" + flowSplineIdx;
                    thisCircleNode = objTopo.vars.svg.selectAll("circle.flow").filter(function (d, i) {
                        return d.id == flowSplineId;
                    });

                    /* path link에 flow 중인 image 체크 (없는 경우에만 flow 됨) */
                    if ( thisCircleNode.data().length > 0 && flowSplineArray.findIndex(d => d == flowSplineId) < 0 ) {

                        flowSplineArray.push(flowSplineId);

                        if (thisCircleNode.data() && thisCircleNode.data().length > 0) {
                            flowingSplineEffect = new FlowingEffect(objTopo);
                            // console.log("flowingEffect ================ ==> " +objLinkData.linkNo + "###" + flowIdx);
                            circleCounter++;
                            flowingSplineEffect.imageTransitionSingleLink(splineItem.node(), thisCircleNode);
                        }

                    }

                });

                if (circleCounter > 0) flowSplineIdx++;
                else flowSplineIdx = -1;
                // console.log("flowIdx ================ ==> " + (flowIdx));
            } else {
                clearInterval(flowSplineInterval);
            }


        }, 500);

    },

    /** 이벤트 등록 */
    addEvent: function (spline, objTopo) {
        spline.on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo))
            .on("mouseenter", function (d) {
                toolTipSpline = objTopo.vars.svg.select("g.grp_object").selectAll("path.spline").filter(function (l) {
                    return d.splineNo == l.splineNo;
                });
                toolTipSpline
                    .style("stroke-width", function (d) {
                        return d.splineSize + 3;
                    })
                    .attr("cursor", TopoSpline.isManageMode(objTopo) ? "pointer" : "default")
                    // .attr('marker-start', function(d){
                    //     return null ;
                    // })
                    // .attr('marker-end', function(d){
                    //     return null;
                    // })

            })
            .on("mouseleave", function (d) {
                toolTipSpline = objTopo.vars.svg.select("g.grp_object").selectAll("path.spline").filter(function (l) {
                    return d.splineNo == l.splineNo;
                });
                toolTipSpline
                    .style("stroke-width", d.splineSize)
                    // .attr('marker-start', function(d){
                    //     return !TopoSpline.isManageMode(objTopo) && JSON.parse(d.splineConf).startMarker != 'none' ? 'url(#marker_' + JSON.parse(d.splineConf).startMarker + ')' : '';
                    // })
                    // .attr('marker-end', function(d){
                    //     return !TopoSpline.isManageMode(objTopo) && JSON.parse(d.splineConf).endMarker != 'none' ? 'url(#marker_' + JSON.parse(d.splineConf).endMarker + ')' : '';
                    // })
            })
            .call(d3.drag()
                .on("start", function(d) {
                    objTopo.vars.svg.selectAll('path.helpline').classed("helplineSelected", false);
                    objTopo.vars.svg.selectAll("g.node rect.nodeactive").classed("nodeactive", false);
                    objTopo.vars.svg.selectAll("g.shape").classed("shapeactive", false);
                    objTopo.vars.svg.select(".svgGroup").select("rect#clockSelect").classed("clockactive", false);
                })
                .on("drag", function (d, i) {
                    if (TopoSpline.isManageMode(objTopo)) TopoSpline.splineDragMove(this, d, i, objTopo);
                })
            );

    },

    splineDragMove: function (dragThis, d, i, objTopo) {

        splineNo = parseFloat(d3.select(dragThis).attr("data-splineNo"));
        TopoSpline.splinePositionUpdate(objTopo, splineNo, i);
    },

    splinePositionUpdate: function (objTopo, splineNo, i) {
        splineData = objTopo.vars.svg.select("g.grp_object").selectAll("path.spline").filter(function (d) {
            return d.splineNo == splineNo;
        }).data()[0];

        points = JSON.parse(splineData.splineConf);

        points.splinePoint.forEach(function (datum, index) {
            datum[0] += d3.event.dx;
            datum[1] += d3.event.dy;
        });

        TopoSpline.updateSplinePath(splineData, points, splineNo);

    },

    updateSplinePath: function (splineData, points, splineNo) {

        if ( splineData.splineType == "curveLinear" ) splineType = d3.curveLinear;
        else if ( splineData.splineType  == "curveBasis") splineType = d3.curveBasis;
        else splineType = d3.curveNatural;

        lineGenerator = d3.line().curve(splineType);
        lineString = lineGenerator(points.splinePoint.slice(0, points.splinePoint.length));

        splineData = objTopo.vars.svg.select("g.grp_object").selectAll("path.spline[data-splineNo='" + splineNo + "']").data();

        splineData.forEach(function(value) {
            value.splineString = lineString;
            value.splineConf = JSON.stringify(points);
        });

        TopoSpline.refresh(objTopo, objTopo.vars.svg, objTopo.vars.svg.selectAll("path.spline").data());

    },

    /** 이벤트 해제 */
    removeEvent: function (spline) {
        spline.on("contextmenu", null)
            .on("mouseenter", null)
            .on("mouseleave", null);
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },

    getMapPos: function(objTopo) {
        var saveData = [];
        objTopo.vars.svg.select("g.grp_object").selectAll("path.spline").each(function(d, i) {

            var splineConf = JSON.parse(d.splineConf);

            var item = {
                splineNo: d.splineNo,
                splineType: d.splineType,
                splineString: d.splineString,
                splineConf: JSON.stringify(splineConf),
                splineSize: d.splineSize,
                splineStyle: d.splineStyle,
                splineColor: d.splineColor,
                marker_start: d.marker_start,
                marker_ene: d.marker_ene

            };
            saveData.push(item);
        });

        console.log("saveData", saveData);
        return saveData;
    }


};


