"use strict";
var shapeNode = null, shape_rect = null, shape_ellipse = null, shape_text = null, shape_textarea = null, shape_drawShapeText = null;
var rotatePos = [], drawTextArea = [], drawId = [], drawFontDistance = [], drawRotation = [], drawPosX = [], drawPosY = [], fontDistance = [];
var i = 0, j = 0, num = 0;
var str_lst = null, removeShape = null, shapeFilterData = null, drawFlag = true;
var drawConf = null, TransShapeText = null;
var xVal = 0, yVal = 0;
var thisX = 0, thisY = 0;
var dragTarget = null, targetW = null, targetH = null;


var TopoDraw = {

    /** 데이터 갱신 */
    callRefresh: function(objTopo) {
        // var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
        // var getBBox = objTopo.createBBox;
        // this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);
    },

    refresh: function(objTopo, svg, shape_data, shape_call, getBBox) {

        drawTextArea = [],drawId = [],drawFontDistance = [],drawRotation = [],drawPosX = [],drawPosY = [], fontDistance = [];

        shapeFilterData = shape_data.filter(function(d, i) {
            var retShape = null;
            if ( (d.devKind1 == "DRAW_SHAPE" && d.devKind2 == "RECT") ||
                (d.devKind1 == "DRAW_SHAPE" && d.devKind2 == 'ELLIPSE') ||
                ( d.devKind1 == "DRAW_TEXT" && d.devKind2 == "TEXT") ||
                (d.devKind1 == "DRAW_TEXT_AREA" && d.devKind2 == "TEXT")) {
                retShape = d;
            }
            return retShape;
        });

        shapeNode = svg.select("g.grp_object").selectAll("g.shape");
        TopoDraw.removeEvent(objTopo, shapeNode);

        shapeNode = svg.select("g.grp_object").selectAll("g.shape").data(shapeFilterData);
        shapeNode.exit().remove();

        /** node g */
        shapeNode = shapeNode.enter()
            .append("g")
            .merge(shapeNode)
            .attr("id", function (d) { return d.id; })
            .classed("shape", true)
            .attr("cursor", this.isManageMode(objTopo) ? "pointer" : "default")
            .attr("transform", function (d) {
                return "translate({0}, {1})".substitute(d.posX, d.posY);
            })
            .attr("drawConf", function(d) { return d.drawConf; })
            .call(shape_call);

        shape_rect = shapeNode.filter(function(d, i) { return d.devKind1 == "DRAW_SHAPE" && d.devKind2 == "RECT"; });
        shape_ellipse = shapeNode.filter(function(d, i) { return d.devKind1 == "DRAW_SHAPE" && d.devKind2 == 'ELLIPSE'; });
        shape_text = shapeNode.filter(function(d, i) { return d.devKind1 == "DRAW_TEXT" && d.devKind2 == "TEXT"; });
        shape_textarea =  shapeNode.filter(function(d, i) { return d.devKind1 == "DRAW_TEXT_AREA" && d.devKind2 == "TEXT"; });
        shape_drawShapeText = shapeNode.filter(function(d, i) { return d.devKind1 == "DRAW_SHAPE" && (d.devKind2 == "RECT" || d.devKind2 == 'ELLIPSE'); });

        /* RECT */
        shape_rect
            .selectAppend("rect", "shape")
            .attr("class", "shape")
            .attr("x", 10).attr("y", 10)
            .attr("rx", function(d) { return d.cornerRadius || 0; })
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .attr("fill", function(d) { return d.fillColor; })
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation,
                    d.width/2,
                    d.height/2
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .style("fill-opacity", function(d) {
                return d.fillOpacity;
            })
            .attr("stroke", function(d) { return d.strokeColor; })
            .style("stroke-opacity", function(d) { return d.strokeOpacity; })
            .style("stroke-dasharray", function(d) { return d.lineStyle; })
            .style("stroke-width", function(d) { return d.strokeWidth; });

        shape_rect
            .selectAppend("image")
            .merge(shape_rect)
            .attr("xlink:href","/img/resizeBR.png")
            .attr("x",function(d) { return d.width - 10; })
            .attr("y",function(d) { return d.height - 10; })
            .attr("width", 20)
            .attr("height", 20)
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation,
                    d.width/2,
                    d.height/2
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .style("display", this.isManageMode(objTopo)? "block" : "none")
            .call(d3.drag()
                .on("drag", function(d) {

                        if(TopoDraw.isManageMode(objTopo)) {
                            dragTarget = d3.select(this.parentNode).selectAll("rect");
                            var data = d3.select(this.parentNode).data()[0];
                            targetW = parseFloat(d3.select(this.parentNode).selectAll("rect").attr('width'));
                            targetH = parseFloat(d3.select(this.parentNode).selectAll("rect").attr('height'));

                            if (parseFloat(d3.select(this.parentNode).selectAll("rect").attr('width')) > 20 &&
                                parseFloat(d3.select(this.parentNode).selectAll("rect").attr('height')) > 20) {
                                dragTarget
                                    .attr("width", function(d) {
                                        return parseFloat(d3.select(this).attr("width")) + d3.event.dx;
                                    })
                                    .attr("height", function(d) {
                                        return parseFloat(d3.select(this).attr("height")) + d3.event.dy;
                                    });
                                d3.select(this)
                                    .attr("x", function(d) { return parseFloat(d3.select(this).attr("x")) + d3.event.dx; })
                                    .attr("y", function(d) { return parseFloat(d3.select(this).attr("y")) + d3.event.dy; });
                            }
                            else {
                                if (targetW <= 20) targetW += 2;
                                if (targetH <= 20) targetH += 2;
                                d3.select(this.parentNode).selectAll("rect")
                                    .attr('width', targetW)
                                    .attr('height', targetH);
                                d3.select(this)
                                    .attr("x", function(d) { return targetW - 10 })
                                    .attr("y", function(d) { return targetH - 10 });
                            }

                            TransShapeText = objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").select(".drawShapeText")
                                .filter(function(d,i){
                                    return d.id == data.id;
                                });

                            drawConf = TopoDraw.drawConfCheck(data);

                            TransShapeText
                                .attr("transform", function (d) {
                                    rotatePos = [d.rotation];
                                    if (drawConf && (drawConf.drawText).length > 0) {
                                        if (drawConf.textHorizontal) {
                                            if (drawConf.textHorizontal === 'start') xVal = 0;
                                            if (drawConf.textHorizontal === 'middle') xVal = parseFloat(dragTarget.attr("width")) / 2 - d.bbox.width / 2;
                                            if (drawConf.textHorizontal === 'end') xVal = parseFloat(dragTarget.attr("width")) - d.bbox.width;
                                            if (drawConf.hasOwnProperty('positionHorizontal')) xVal += drawConf.positionHorizontal;
                                        }
                                        if (drawConf.textVertical) {
                                            if (drawConf.textVertical === 'top') yVal = 0;
                                            if (drawConf.textVertical === 'center') yVal = parseFloat(dragTarget.attr("height")) / 2 - d.bbox.height / 2;
                                            if (drawConf.textVertical === 'bottom') yVal = parseFloat(dragTarget.attr("height")) - d.bbox.height;
                                            if (drawConf.hasOwnProperty('positionVertical'))  yVal += drawConf.positionVertical;
                                        }
                                        return "translate({0},{1})".substitute(xVal, yVal) + "rotate({0})".substitute(rotatePos);
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                });
                        }
                    }
                ));

        /* Circle */
        shape_ellipse
            .selectAppend("ellipse", "shape")
            .merge(shape_ellipse)
            .attr("class", "shape")
            .attr("cx", function(d) {return d.width/2 + 10;})
            .attr("cy", function(d) {return d.height/2 + 10;})
            .attr("rx", function(d) {return (d.width/2);})
            .attr("ry", function(d) {return d.height/2;})
            .attr("fill", function(d) { return d.fillColor; })
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation,
                    d.width/2,
                    d.height/2
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .style("fill-opacity", function(d) { return d.fillOpacity; })
            .attr("stroke", function(d) { return d.strokeColor; })
            .style("stroke-opacity", function(d) { return d.strokeOpacity; })
            .style("stroke-dasharray", function(d) { return d.lineStyle; })
            .style("stroke-width", function(d) { return d.strokeWidth; });

        shape_ellipse
            .selectAppend("image")
            .merge(shape_ellipse)
            .attr("xlink:href","/img/resizeBR.png")
            .attr("x",function(d) { return d.width - 10; })
            .attr("y",function(d) { return d.height - 10; })
            .attr("width", 20)
            .attr("height", 20)
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation,
                    d.width/2,
                    d.height/2
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .style("display", this.isManageMode(objTopo)? "block" : "none")
            .call(d3.drag()
                .on("drag", function(d) {
                        if(TopoDraw.isManageMode(objTopo)) {
                            var dragRect = d3.select(this.parentNode).select("rect.shapeselection");
                            var dragCircle = d3.select(this.parentNode).selectAll("ellipse");
                            var data = d3.select(this.parentNode).data()[0];
                            var _dx = d3.event.dx, _dy = d3.event.dy;
                            data.width += _dx;
                            data.height += _dy;
                            targetW = data.width, targetH = data.height;
                            if (data.width > 20 &&
                                data.height > 20) {

                                dragRect
                                    .attr("width", function(d) { return parseFloat(d3.select(this).attr("width")) + _dx;})
                                    .attr("height", function(d) { return parseFloat(d3.select(this).attr("height")) + _dy;});
                                dragCircle
                                    .attr("cx", function(d) { return data.width/2 + 10; })
                                    .attr("cy", function(d) { return data.height/2 + 10; })
                                    .attr("rx", function(d) { return data.width/2; })
                                    .attr("ry", function(d) { return data.height/2; });
                                d3.select(this)
                                    .attr("x", function(d){return d.width-10;}).attr("y", function(d){return d.height-10;});

                            }
                            else {
                                // if (data.width <= 20) data.width  += 2;
                                // if (data.height <= 20) data.heigh += 2;

                                return null;
                                // dragRect
                                //     .attr('width', data.width)
                                //     .attr('height', data.heigh);
                                // dragCircle
                                //     .attr("cx", function(d) { return data.width/2 + 10; })
                                //     .attr("cy", function(d) { return data.height/2 + 10; })
                                //     .attr("rx", function(d) { return data.width/2; })
                                //     .attr("ry", function(d) { return data.height/2; });
                                // d3.select(this)
                                //     .attr("x", function(d) { return data.width - 10 })
                                //     .attr("y", function(d) { return data.height - 10 });
                            }






                            TransShapeText = objTopo.vars.svg.select("g.grp_object").selectAll("g.shape").select(".drawShapeText")
                                .filter(function(d,i){
                                    return d.id == data.id;
                                });

                            drawConf = TopoDraw.drawConfCheck(data);

                            TransShapeText
                                .attr("transform", function (d) {
                                    rotatePos = [d.rotation];
                                    if (drawConf && (drawConf.drawText).length > 0) {
                                        if (drawConf.textHorizontal) {
                                            if (drawConf.textHorizontal === 'start') xVal = 0;
                                            if (drawConf.textHorizontal === 'middle') xVal =  data.width / 2 - d.bbox.width / 2;
                                            if (drawConf.textHorizontal === 'end') xVal = data.width - d.bbox.width;
                                            if (drawConf.hasOwnProperty('positionHorizontal')) xVal += drawConf.positionHorizontal;
                                        }
                                        if (drawConf.textVertical) {
                                            if (drawConf.textVertical === 'top') yVal = 0;
                                            if (drawConf.textVertical === 'center') yVal =  data.height / 2 - d.bbox.height / 2;
                                            if (drawConf.textVertical === 'bottom') yVal =  data.height - d.bbox.height;
                                            if (drawConf.hasOwnProperty('positionVertical'))  yVal += drawConf.positionVertical;
                                        }
                                        return "translate({0},{1})".substitute(xVal, yVal) + "rotate({0})".substitute(rotatePos);
                                    }
                                    else
                                    {
                                        return null;
                                    }
                                });
                        }
                    }
                ));

        /* Text */
        shape_text
            .selectInsert("text")
            .merge(shape_text)
            .classed("drawText", true)
            .attr("cx", function (d) {
                return d.posX;
            })
            .attr("cy", function (d) {
                return d.posY;
            })
            .style("font-size", function(d) { return d.fontSize; })
            .attr("text-anchor", function(d) { return d.textAnchor; })
            .style('font-weight', function(d) { return d.fontWeight; })
            .attr("fill", function(d) { return d.fillColor; })
            .style("fill-opacity", function(d) { return d.fillOpacity; })
            .attr("stroke", function(d) { return d.strokeColor; })
            .style("stroke-opacity", function(d) { return d.strokeOpacity; })
            .style("stroke-width", function(d) { return d.strokeWidth; })
            .text(function(d) { return d.textContent; })
            .style("white-space", function(d) { return 'pre'; })
            .attr("rotation", function(d) { return d.rotation; })
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .on("dblclick", function (d) {
                // draw 기타 설정 정보
                if (d.drawConf && JSON.parse(d.drawConf).hasOwnProperty('urlLink')) {
                    drawConf = JSON.parse(d.drawConf);
                    if ( !TopoDraw.isManageMode(objTopo) ) {
                        // console.log("drawConf.urlLink ==== > " + drawConf.urlLink);
                        window.open(
                            drawConf.urlLink,
                            '_blank'
                        );
                    }
                }
            })
            .call(objTopo.createBBox);


        /* Text Area */
        shape_textarea
            .selectInsert("text")
            .merge(shape_textarea)
            .classed("drawText", true)
            .attr("x", function (d) {
                return d.posX;
            })
            .attr("y", function (d) {
                return d.posY;
            })
            .style("font-size", function(d) { return d.fontSize; })
            .attr("text-anchor", function(d) { return d.textAnchor; })
            .style('font-weight', function(d) { return d.fontWeight; })
            .attr("fill", function(d) { return d.fillColor; })
            .style("fill-opacity", function(d) { return d.fillOpacity; })
            .attr("stroke", function(d) { return d.strokeColor; })
            .style("white-space", function(d) { return 'pre'; })
            .style("stroke-opacity", function(d) { return d.strokeOpacity; })
            .style("stroke-width", function(d) { return d.strokeWidth; })
            .text(function(d) {
                drawTextArea.push( d.textContent);
                drawId.push(d.id);
                drawFontDistance.push(d.fontDistance);
                drawRotation.push(d.rotation);
                drawPosX.push(d.posX);
                drawPosY.push(d.posY);
                fontDistance.push(d.fontDistance);
                return '';
            })
            .attr("fontDistance", function(d) {

                return d.fontDistance;
            })
            .attr("rotation", function(d) { return d.rotation; })
            .attr("transform", function (d) {
                rotatePos = [
                    d.rotation
                ];
                return "rotate({0})".substitute(rotatePos);
            })
            .attr("data-key", function(d) { return d.textContent; });

        for(i=0; i<drawTextArea.length; i++){
            drawFlag = true;
            if (drawTextArea[i]) {
                if ( d3.select("g#"+drawId[i]).select("text").select("tspan").nodes().length > 0 ) {
                    if ( JSON.stringify(drawTextArea[i]) === JSON.stringify(d3.select("g#" + drawId[i]).select("text").data()[0].textContent) ) {drawFlag = false;}
                    else {drawFlag = true;}
                } else {drawFlag = true;}

                if( drawFlag ) {
                    str_lst = drawTextArea[i].split('\n');
                    num = 0;
                    for (j = 0; j < str_lst.length; j = j + 1) {
                        d3.select("g#" + drawId[i]).select("text")
                            .append("tspan")
                            .attr("x", "0")
                            .attr("y", num)
                            .attr("transform", "rotate({0})".substitute(drawRotation[i]))
                            .text(str_lst[j]);
                        num = num + fontDistance[i];
                    }
                }
            }
        }
        shape_textarea.call(objTopo.createBBox);

        /* Rect Shape Text 추가 */
        TransShapeText = shape_drawShapeText
            .selectInsert("text")
            .classed("drawShapeText", true)
            .attr("x", function (d) { return 10; })
            .attr("y", function (d) { return 30; })
            .style("font-size", function(d) { return TopoDraw.drawConfCheck(d) && (TopoDraw.drawConfCheck(d).drawText).length > 0 ? TopoDraw.drawConfCheck(d).fontSize : null ;  })
            .style('font-weight', function(d) {
                return TopoDraw.drawConfCheck(d) && (TopoDraw.drawConfCheck(d).drawText).length > 0 ? TopoDraw.drawConfCheck(d).fontWeight == "1" ? "bold" : "normal" : null;
            })
            .attr("fill", function(d) { return TopoDraw.drawConfCheck(d) && (TopoDraw.drawConfCheck(d).drawText).length > 0 ? TopoDraw.drawConfCheck(d).fillColor : null; })
            .style("fill-opacity", function(d) { return TopoDraw.drawConfCheck(d) && (TopoDraw.drawConfCheck(d).drawText).length > 0 ? TopoDraw.drawConfCheck(d).fillOpacity : null; })
            .text(function(d) { return TopoDraw.drawConfCheck(d) && (TopoDraw.drawConfCheck(d).drawText).length > 0 ? TopoDraw.drawConfCheck(d).drawText : null; })
            .call(objTopo.createBBox);

        TopoDraw.drawShapeTextPositionSet();

        TopoDraw.addEvent(shapeNode, objTopo);
        $.each(shapeNode.data(), function (idx, item) {
            if (item.devKind1 === "DRAW_TEXT" || item.devKind1 === "DRAW_TEXT_AREA") {
                item.width = item.bbox.width;
                item.height = item.bbox.height;
            }
        });
        // console.log("topo_dtaw");
        return shapeNode;
    },

    drawConfCheck: function (data) {
        if (JSON.parse(data.drawConf) && JSON.parse(data.drawConf).hasOwnProperty('drawText')) {
            return JSON.parse(data.drawConf)
        }
        return null
    },

    drawShapeTextPositionSet: function () {
        /* Rect Shape Text 위치 정렬 */
        TransShapeText
            .attr("transform", function (d) {
                rotatePos = [d.rotation];
                drawConf = TopoDraw.drawConfCheck(d);
                if (drawConf && (drawConf.drawText).length > 0) {
                    thisX = parseInt(d3.select(this).attr('x')), thisY = parseInt(d3.select(this).attr('y'));
                    if (drawConf.textHorizontal) {
                        if (drawConf.textHorizontal === 'start') xVal = 0;
                        if (drawConf.textHorizontal === 'middle') xVal = d.width / 2 - d.bbox.width / 2;//thisX + (d.width / 2 - d.bbox.width / 2);
                        if (drawConf.textHorizontal === 'end') xVal = d.width - d.bbox.width;
                        if (drawConf.hasOwnProperty('positionHorizontal')) xVal += drawConf.positionHorizontal;
                    }
                    if (drawConf.textVertical) {
                        if (drawConf.textVertical === 'top') yVal = 0;
                        if (drawConf.textVertical === 'center') yVal = d.height / 2 - d.bbox.height / 2;
                        if (drawConf.textVertical === 'bottom') yVal = d.height - d.bbox.height;
                        if (drawConf.hasOwnProperty('positionVertical'))  yVal += drawConf.positionVertical;
                    }
                    return "translate({0},{1})".substitute(xVal, yVal) + "rotate({0})".substitute(rotatePos);
                }
                else
                {
                    return null;
                }
            });
    },

    // drawShapeTextRefresh: function (result) {
    //     shapeNode = objTopo.vars.svgGroup.selectAll("g.shape")
    //         .filter(function(d,i){
    //             return d.id == 'draw{0}'.substitute(result.drawNo);
    //         });
    //     drawConf = TopoDraw.drawConfCheck(result)
    //     if (drawConf && (drawConf.drawText).length > 0) {
    //         // 생성 및 변경
    //         TransShapeText = shapeNode
    //             .selectInsert("text")
    //             .classed("drawShapeText", true)
    //             .attr("x", function (d) { return 10; })
    //             .attr("y", function (d) { return 30; })
    //             .style("font-size", function(d) { return drawConf.fontSize;  })
    //             .style('font-weight', function(d) { return drawConf.fontWeight; })
    //             .attr("fill", function(d) { return drawConf.fillColor; })
    //             .style("fill-opacity", function(d) { return drawConf.fillOpacity; })
    //             .text(function(d) { return drawConf.drawText; })
    //             .attr('drawConf', drawConf)
    //             .call(objTopo.createBBox);
    //
    //         TopoDraw.drawShapeTextPositionSet();
    //     }
    //     else {
    //         // 삭제
    //         shapeNode.select('text.drawShapeText').remove()
    //     }
    // },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },

    /** 이벤트 등록 */
    addEvent: function(shapeNode, objTopo) {
        shapeNode
            .on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo));
    },

    /** 이벤트 해제 */
    removeEvent: function(objTopo, node) {
        var circle = objTopo.vars.svg.selectAll("g.node > g.grpImg").selectAll("circle");
        circle.interrupt();

        node.on("contextmenu", null)
            .on("click", null)
            .on("dblclick", null)
            .on("mouseover", null)
            .on("mouseout", null);
    },

    getMapPos: function(objTopo) {
        var saveData = [];
        objTopo.vars.svgGroup.selectAll("g.shape").each(function(d, i) {
            var rectgrp = d3.select(this),
                drawobj = d.devKind1 == 'DRAW_SHAPE'? rectgrp.select(".shape"): rectgrp.select(".drawText");

            var item = {
                devKind1:d.devKind1,
                drawNo: d.drawNo,
                posX: d.posX.toFixed(1),
                posY: d.posY.toFixed(1),
                width: d.width,
                height: d.height,
                fillColor: drawobj.attr("fill"),
                fillOpacity: parseFloat(drawobj.style("fill-opacity")).toFixed(1),
                strokeColor: drawobj.attr("stroke"),
                strokeOpacity: parseFloat(drawobj.style("stroke-opacity")).toFixed(1),
                strokeWidth: (drawobj.style("stroke-width") || '').replace(/\D/ig,''),
                cornerRadius: (drawobj.attr("rx") || '').replace(/\D/ig,''),
                fontSize: (drawobj.style('font-size') || '').replace(/\D/ig,''),
                fontWeight: drawobj.style('font-weight') == 700? 'bold' : 'normal',
                textAnchor: drawobj.attr('text-anchor'),
                textContent: d.devKind1 == 'DRAW_TEXT'? drawobj.text() :  d.devKind1 == 'DRAW_TEXT_AREA'? d.textContent :d.text,
                sortIdx: i+1,
                fontDistance: d.devKind1 == 'DRAW_TEXT_AREA'? d.fontDistance:'20',
                rotation: d.rotation,
                drawConf: d.drawConf
            };

            if(d.devKind2 == 'RECT') {
                item.width = parseFloat(drawobj.attr('width')).toFixed(1);
                item.height = parseFloat(drawobj.attr('height')).toFixed(1);
            } else if(d.devKind2 == 'ELLIPSE') {
                item.cornerRadius = 0;
                // 원을 그릴떄 width/height값을 사용하는데 원이 작을경우 문제가 됨.. 2021.02.03 by jjung
                // item.width = (parseFloat(drawobj.attr("cx")) * 2).toFixed(1);
                // item.height = (parseFloat(drawobj.attr("cy")) * 2).toFixed(1);
                // console.log(item.drawNo, item.width, item.height);
            }

            if(item.cornerRadius == '') {
                item.cornerRadius = 0;
            }
            saveData.push(item);
        });

        // console.log("saveData", saveData);
        return saveData;
    }
};
