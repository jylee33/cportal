"use strict";
var iss_nodes = [];
var iss_grpImg = null;
var iss_point = null, iss_node = null, iss_removeNode = null, iss_gisNode = null;
var iss_scale, iss_cx, iss_cy;
var iss_circle = null, iss_rect= null, iss_findRect = null;
var iss_defImg = null, iss_defImgData = null, iss_canvas = null;
var iss_eItemNo = null, iss_targetItemNo = [];
var defaultWidth = 960, defaultHeight = 540, startX = 480, startY = 270;
var nodeCnt = 0, drawRowCnt = 0;
var rowCnt = 5, colCnt = 5;
var arrPoint = [];

var TopoIsShare = {
    /**
     * Node 데이터 추가 (key: id)
     */



    setArryPoint: function () {
        // 최대 25개 설정 가능
        var wGap = defaultWidth / rowCnt;
        var hGap = defaultHeight / colCnt;
        for (var row=0; row < rowCnt; row++) {
            for (var col=0; col < colCnt; col++) {
                arrPoint.push({ "x": startX + (col * wGap) , "y": startY + (row * hGap) })
            }
        }
    },

    setNodeData: function (list, objTopo) {

        nodeCnt = list.length;
        drawRowCnt = Math.ceil(nodeCnt/colCnt); // 무조건 올림처리

        /* 그룹 위치 좌표 생성( 5 x 5 ) */
        if (arrPoint.length === 0) TopoIsShare.setArryPoint(drawRowCnt);

        if (list == null || list.length == 0) return list;

        iss_nodes = [];
        list.forEach(function (d, idx) {

            d.xpoint = arrPoint[idx].x;
            d.ypoint = arrPoint[idx].y;
            iss_scale = TopoUtil.getItemScale(d.itemSize);  // Query 기본 3
            iss_cx = d.xpoint + ((55 - (55 * iss_scale)) / 2) + (55 * iss_scale / 2);
            iss_cy = d.ypoint + (55 * iss_scale / 2);

            iss_nodes.push($.extend({
                id: "g" + d.itemNo,
                x: d.xpoint,
                y: d.ypoint,
                cx: iss_cx,
                cy: iss_cy,
                xgap: iss_cx - d.xpoint,
                ygap: iss_cy - d.ypoint
            }, d));
        });

        return iss_nodes;
    },



    /** 데이터 갱신 */
    callRefresh: function (objTopo) {
        var getBBox = objTopo.createBBox;
        this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, null, getBBox);
    },

    refresh: function (objTopo, svg, nodes, node_call, getBBox) {
        iss_removeNode = svg.select(".svgGroup").selectAll("g.node");
        TopoIsShare.removeEvent(iss_removeNode);
//			removeNode.remove();

        iss_node = svg.select(".svgGroup").selectAll("g.node").data(nodes);
        iss_node.exit().remove();

        /** node g */
        iss_node = iss_node.enter()
            .append("g")
            .merge(iss_node)
            .attr("id", function (d) {
                return d.id;
            })
            .attr("class", "node")
            .attr("cursor", "pointer")
            .attr("width", 55)
            .attr("height", 55)
            .style("display", "none")
            // .call(node_call)
            .on("mouseenter", function (d) {
                TopoIsShare.nodeMouseenter(this, objTopo);
            })
            .on("mouseleave", function (d) {
                TopoIsShare.nodeMouseleave(this, objTopo);
            });



        /** event anmiation circle */
        iss_grpImg = iss_node.selectAppend("g", "grpImg");
        iss_grpImg
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 55)
            .attr("height", 55)
            .attr("class", "grpImg")
            .attr("transform", function (d) {
                iss_scale = TopoUtil.getItemScale(d.itemSize);
                return "scale(" + [iss_scale, iss_scale].join(",") + ")";
            });

        iss_grpImg.selectAppend("circle")
            .attr("cx", function (d) {
                return 55 / 2;
            })
            .attr("cy", function (d) {
                return 55 / 2;
            })
            .attr("r", function (d) {
                return 70 / 2;
            })
            .attr("class", function (d) {
                if(d.evtLevel == 6){
                    return "evtBubble critical";
                }else if(d.evtLevel == 5){
                    return "evtBubble major";
                }else if(d.evtLevel == 4){
                    return "evtBubble minor";
                }else if(d.evtLevel == 3){
                    return "evtBubble warning";
                }else if(d.evtLevel == 2){
                    return "evtBubble info";
                }else if(d.evtLevel == -1) {
                    //조치중
                    return "evtBubble processing";
                } else {
                    return "evtBubble";
                }
            })
            .style("fill", function (d) {
                if(d.evtLevel == 1){
                    // 정상
                    return "transparent";
                }else if(d.evtLevel == -2){
                    // 작업중
                    return "#072DEB";
                }
            })
            .style('opacity', TopoConst.envSetting.bubbleOpacity);
            // .style('display', function () {
            //     return TopoItem.isManageMode(objTopo) ? 'none' : 'block';
            // });


        /** 아이콘 이미지 추가 */
        iss_grpImg.selectAppend("image")
            .attr("id", function (d) {
                return "image-" + d.itemNo;
            })
            .attr("crossorigin", "anonymous")
            .attr("width", function (d) {
                return 55;
            })
            .attr("height", function (d) {
                return 55;
            });

        // 아이템 이미지 설정
        agent = navigator.userAgent.toLowerCase(),
        appVer = navigator.appVersion.toLowerCase(),
        isIE = agent.indexOf("msie") !== -1 || appVer.indexOf("trident/") > 0;
        if (isIE) TopoIsShare.setImageUrl_ie(iss_grpImg, iss_nodes);
        else TopoIsShare.setImageUrl(iss_grpImg, iss_nodes);

        /** 명칭 text 추가 */
        iss_node.selectAppend("text")
            .attr("dx", function (d) {
                return (55 / 2) * TopoUtil.getItemScale(d.itemSize);
            })
            .attr("dy", function (d) {
                return 20 + (55 * TopoUtil.getItemScale(d.itemSize));
            })
            .attr("class", "nodetext")
            .attr("text-anchor", "middle")
            .attr("fill", TopoConst.envSetting.fontColor)
            .attr("pointer-events", "none")
            .text(function (d) {
                return d.itemAlias ? d.itemAlias.htmlCharacterUnescapes() : d.itemName ? d.itemName.htmlCharacterUnescapes() : null;
            })
            .style("font-size", function (d) {
                return d.fontSize === 0 ? "0px" : (d.fontSize * 2 + 10) + "px";
            })
            .style("visibility", function (d) {
                return TopoConst.envSetting.showLabel == 1 && d.showLabel == 1 && d.fontSize > 0 ? "visible" : "hidden";
            })
            .call(getBBox);
        // .call(wrap, 60);

        /** text뒤에 배경rect 추가 */
        iss_node.selectInsert("rect", "text_bg")
            .attr("x", function (d) {
                return ((55 / 2) * TopoUtil.getItemScale(d.itemSize)) - (d.bbox.width / 2) - 5;
            })
            .attr("y", function (d) {
                return d.bbox.y;
            })
            .attr("width", function (d) {
                return d.bbox.width + 10;
            })
            .attr("height", function (d) {
                return d.bbox.height;
            })
            .attr("class", "text_bg")
            .style("fill", TopoConst.envSetting.fontBgColor)
            .style('opacity', TopoConst.envSetting.fontBgOpacity)
            .style("visibility", function (d) {
                return TopoConst.envSetting.showLabel == 1 && d.showLabel == 1 && d.fontSize > 0 ? "visible" : "hidden";
            });

        // GRP.viewType == 'GIS'인 경우 아이콘 표시
        iss_gisNode = iss_node.filter(function (d) {
            return d.temp1 == 'GIS';
        });
        iss_node.selectAll('image.imgGrpViewType').remove();
        if (iss_gisNode.size() > 0) {
            iss_gisNode.each(function (d) {
                d3.select(this)
                    .selectAppend('image', 'imgGrpViewType')
                    .classed('imgGrpViewType', true)
                    .attr('xlink:href', '/img/d3/icon_gis_3d.svg')
                    .attr('width', 30).attr('height', 30)
                    .attr('x', 10).attr('y', -28);
            });
        }

        TopoIsShare.addEvent(iss_node, objTopo);
        TopoIsShare.animationForfindItem(objTopo);

        return iss_node;
    },

    nodeMouseenter: function(eNode, objTopo) {

        iss_eItemNo = d3.select(eNode).data()[0].itemNo;
        // console.log("nodeMouseenter===>" + eItemNo);
        iss_targetItemNo = [];
        iss_targetItemNo = iss_targetItemNo.filter((element) => element !== eItemNo);

        $.each(iss_targetItemNo, function (idx, sItemNo) {
           objTopo.vars.svgGroup.selectAll("g.node").filter(function (n) {
                return   n.itemNo == sItemNo;
            }).classed("nodeHighlighted", true);
        });

        d3.select(eNode).classed("nodeHighlighted", true);
    },

    nodeMouseleave: function(d, objTopo) {
        objTopo.vars.svgGroup.selectAll("g.node").classed("nodeHighlighted", false);
    },

    /** 이벤트 등록 */
    addEvent: function (node, objTopo) {
        node.on("dblclick", function (d) {
                objTopo.vars.isShareGroupNo = objTopo.vars.curGrpNo = d.mngNo;
                objTopo.chgGrp.call(objTopo);
            })
            .on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo))
            .on("mouseover", function(d) {
                TopoItem.showTooltip(d, objTopo);
            })
            .on("mouseout", TopoItem.hideTooltip);
    },

    /** 이벤트 해제 */
    removeEvent: function (node) {
        node.on("contextmenu", null)
            .on("click", null)
            .on("dblclick", null)
            .on("mouseover", null)
            .on("mouseout", null);
    },

    /** 툴팁 show */
    showTooltip: function (d, objTopo) {

        if ( this.isManageMode(objTopo) ) return;
        // console.dir(d);
        var div = d3.select('div#section').select('div.tooltip');
        var _devKind1 = d.hasOwnProperty("devKind1") ? d.devKind1.toUpperCase() : null;
        var _devKind2 = d.hasOwnProperty("devKind2") ? d.devKind2.toUpperCase() : null;


        var msg = [];
        if (_devKind1 != "LINK") { //회선이 아닌경우 (그룹, 장비, 랙 등등)
            if (_devKind1 == "GRP" && d.uniqId > 0) {
                msg.push("상속그룹");
            }
            msg.push(d.itemAlias || d.itemName);
            if (_devKind1 != "GRP" && _devKind1 != "RACK") {
                if (_devKind1 != "ETC") msg.push("IP : {0}".substitute(d.devIp));
                else msg.push("IP(URL) : {0}".substitute(d.devIp ? d.devIp : '-'));
                if (_devKind1 == "SENSOR") {
                    msg.push("설치위치 : {0}".substitute(d.temp3));
                }
            }else if (_devKind1 == "ETC"){
                msg.push("MAC : {0}".substitute(d.devIp));
            }
            else if (_devKind1 == "RACK") {
                msg.push("유닛수 : {0}".substitute(d.devIp));
            }
            if (_devKind1 != "ETC") {
                msg.push("종류 : {0}".substitute(d.devKind2));
                msg.push("상태 : {0}".substitute(TopoUtil.convertEvtLevel(d.evtLevel)));
            }

            // console.dir(d);

            // 장비 및 AP 위치
            if ((_devKind2 == "L2SWITCH" && d.location != '') || (_devKind2 == "AP" && d.location != '')) {
                msg.push("위치 : {0}".substitute(d.location));
            }

            // HA 상태
            if (d.haStatus != 'NONE') {
                msg.push("HA : {0}".substitute(d.haStatus || '-'));
            }

            var _userContent = d.hasOwnProperty("userContent") ? d.userContent : null;
            if (_userContent != null) {
                msg.push("메모 : " + (_userContent.replace(/\n/gi, "<br>")));
            }
            var _dynInfo = d.hasOwnProperty('dynInfo') ? d.dynInfo : null;
            if (_dynInfo != null) {
                msg.push(_dynInfo.replace(/\n/, '').replace(/\n/g, '<br>'));
            }

            show(msg.join("<br>"));
        }

        function show(msg) {
            // console.log(d3.event);
            div.transition().duration(100).style("opacity", .9);
            div.html(msg)
                .style("left", (d3.event.pageX) + "px")
                .style("top", ((d3.event.pageY) - $('#nav').height()) + "px"); //nav 영역 제외
        }

    },


    /** 툴팁 hide */
    hideTooltip: function () {
        var div = d3.select('div#section').select('div.tooltip');
        div.transition().duration(100).style("opacity", 0);
    },

    /** 장애등급 버블 애니메이션 */
    animation: function (objTopo) {

        iss_circle = objTopo.vars.svg.selectAll("g.node > g.grpImg").selectAll("circle");
        iss_circle.on("start", null);
        iss_circle
            .transition().duration(500).attr("r", function (d) {
            return 70 / 2 + 4;
        })
            .transition().duration(500).attr("r", function (d) {
            return 70 / 2;
        })
            .on("start", function repeat() {
                d3.active(this)
                    .transition().duration(500).attr("r", function (d) {
                    return 70 / 2 + 4;
                })
                    .transition().duration(500).attr("r", function (d) {
                    return 70 / 2;
                })
                    .on("start", repeat);
            });
    },

    /** 장비찾기 아이템 애니메이션 */
    animationForfindItem: function (objTopo) {
        var fineItem = objTopo.vars.svgGroup.selectAll("g.node").filter(function (n) {
            return   n.itemNo == objTopo.vars.findItemNo;
        });
        iss_rect = objTopo.vars.svg.selectAll("g.node > rect.text_bg");
        if (objTopo.vars.findItemNo == null) {
            iss_rect.interrupt();
            fineItem.interrupt();
            iss_rect.on('start', null);
            fineItem.on("start", null);
            return;
        }



        iss_findRect = rect.filter(function (d) {
            return d.itemNo == objTopo.vars.findItemNo;
        });
        iss_findRect.on("start", null);
        iss_findRect
            .transition().duration(500).style("opacity", 1)
            .transition().duration(500).style("opacity", 0.3)
            .on("start", function repeat() {
                d3.active(this)
                    .transition().duration(500).style("opacity", 1)
                    .transition().duration(500).style("opacity", 0.3)
                    .on("start", repeat);
            });

        fineItem.on("start", null);
        fineItem
            .transition().duration(500).style("opacity", 1)
            .transition().duration(500).style("opacity", 0.3)
            .on("start", function repeat() {
                d3.active(this)
                    .transition().duration(500).style("opacity", 1)
                    .transition().duration(500).style("opacity", 0.3)
                    .on("start", repeat);
            });

        setTimeout(function () {
            iss_findRect.interrupt();
            fineItem.interrupt();
            iss_findRect.on('start', null);
            fineItem.on("start", null);
            fineItem.style("opacity", 1).classed("nodeHighlighted", true);
            objTopo.vars.findItemNo = null;
        }, 1000 * 10);
    },

    /** 아이템 이미지 설정
     * chrome에서 이미지가 url로 설정하면 export시 로드하지 못함. 그래서 base64로 설정함.
     * */
    setImageUrl: function (grpImg, nodes) {
        iss_defImg = new Image();
        iss_defImgData = null;
        iss_defImg.onload = function () {
            iss_canvas = document.createElement("canvas");
            iss_canvas.width = iss_defImg.width, iss_canvas.height = iss_defImg.height;
            iss_canvas.getContext("2d").drawImage(iss_defImg, 0, 0);
            iss_defImgData = iss_canvas.toDataURL("image/png");
        };
        iss_defImg.src = '/img/d3/micons/NoImage.PNG';

        nodes.forEach(function (d, idx) {

            // usrKind값이 존재하면 우선적용
            if (d.usrKind != null && d.usrKind.length > 0) {

                var img = new Image();

                img.crossOrigin = "anonymous";
                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width, canvas.height = img.height;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
                    // grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
                };

                img.onerror = function () { //usrKind이미지를 로드하지 못한 경우 devKind2이미지 적용
                    var img2 = new Image();
                    img2.crossOrigin = "anonymous";
                    img2.onload = function () {
                        var canvas = document.createElement("canvas");
                        canvas.width = img2.width, canvas.height = img2.height;
                        canvas.getContext("2d").drawImage(img2, 0, 0);
                        grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
                        // grpImg.select("#image-" + d.itemNo).attr("xlink:href", img2.src);
                    };
                    img2.onerror = function () { //기본이미지 적용
                        grpImg.select("#image-" + d.itemNo).attr("xlink:href", iss_defImgData);
                        // grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/img/d3/micons/NoImage.PNG");
                    };
                    img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
                };
                img.src = "/img/d3/micons/{0}.PNG".substitute(d.usrKind);
            }
            // devKind2에 따른 이미지 적용
            else {
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width, canvas.height = img.height;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
                    // grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
                };
                img.onerror = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", iss_defImgData);
                    // grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/img/d3/micons/NoImage.PNG");
                };
                img.src = TopoIsShare.getImageUrlByDevKind2(d.devKind2);
            }
        });
    },

    setImageUrl_ie: function (grpImg, nodes) {
        iss_defImg = '/img/d3/micons/NoImage.PNG';

        nodes.forEach(function (d, idx) {
            // usrKind값이 존재하면 우선적용
            if (d.usrKind != null && d.usrKind.length > 0) {
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
                };
                img.onerror = function () { //usrKind이미지를 로드하지 못한 경우 devKind2이미지 적용
                    var img2 = new Image();
                    img2.crossOrigin = "anonymous";
                    img2.onload = function () {
                        grpImg.select("#image-" + d.itemNo).attr("xlink:href", img2.src);
                    };
                    img2.onerror = function () { //기본이미지 적용
                        grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/img/d3/micons/NoImage.PNG");
                    };
                    img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
                };
                img.src = "/img/d3/micons/{0}.PNG".substitute(d.usrKind);
            }
            // devKind2에 따른 이미지 적용
            else {
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
                };
                img.onerror = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/img/d3/micons/NoImage.PNG");
                };
                img.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
            }
        });
    },

    /**
     * devKind2 이미지 url 리턴
     */
    getImageUrlByDevKind2: function (devKind2) {
        var fileName = null;
        switch (devKind2) {
            // case "BACKBONE": case "FIREWALL": case "IPS":
            // case "SWITCH": case "L3SWITCH": case "L4SWITCH":
            // case "NAC": case "QOS": case "VPN":
            // case "CLOUD": case "ROUTER":
            // fileName = devKind2 + "_B1";
            // break;
            default:
                fileName = devKind2;
                break;
        }
        return "/img/d3/micons/{0}.PNG".substitute(fileName);
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    }

};

// word wrap test
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().length > 15 ? [text.text().substring(0, 15), text.text().substring(16)].reverse() : [text.text()],
            // words = text.text().split(/\_/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 20, // ems
            y = text.attr("y") || 0,
            dx = parseFloat(text.attr("dx")),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("dx", 0).attr("y", y).attr("dy", dy)
                .attr("text-anchor", "middle");
        while (word = words.pop()) {
            var _dy = lineNumber++ * lineHeight + dy + (lineNumber * (text.data()[0].fontSize - 2));
            tspan = text.append("tspan").attr("x", 0).attr("dx", dx).attr("y", y).attr("dy", (_dy))
                .attr("text-anchor", "middle").text(word);
        }
    });
}
