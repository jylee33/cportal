"use strict";
var nodes = [];
var point = null, node = null, removeNode = null, gisNode = null;
var scale, cx, cy;
var appVer = null, isIE = null, agent = null;
var circle = null, rect= null, findRect = null;
var defImg = null, defImgData = null, canvas = null;
var enterNode = null, eItemNo = null, targetItemNo = [];
var startX = 0, startY = 0;
var rowCnt = 0, colCnt = 0;
var arrPoint = [];
var objTemp = {};
var retValue = null;
var _left = 0, _top = 0;
var wGap = null, hGap = null, row=0, col=0;
var grpImg = null, healthImg = null, haImg = null, osImg = null, osImgUrl;
var haStatus = null;
var currItemObj = [], oldItemObj = [];
var valueTop = 0;

// var nodeText, bboxWidth, bboxHeigth, centerCalc, itemScale;


var TopoItem = {
    /**
     * Node 데이터 추가 (key: id)
     */
    setNodeData: function (list, objTopo) {

        objTopo.vars.isChangeTopo = false;
        if (objTopo.vars.isChgGrp) oldItemObj = [];
        if (list == null || list.length == 0) {
            // 객체가 없을경우 초기화를 위함
            objTopo.vars.isChangeTopo = true;
            return list;
        }

        /* 그룹 위치 좌표 생성( 7 x 6 ) */
        if (arrPoint.length === 0) TopoItem.setArryPoint();

        currItemObj = [];
        nodes = [];
        list.forEach(function (d, idx) {

            if (objTopo.getIsShareGroupRoot()) {
                if (idx >= arrPoint.length) return false;
                d.xpoint = arrPoint[idx].x;
                d.ypoint = arrPoint[idx].y;
            }
            else {
                point = objTopo.convertMapLocation([d.xpoint, d.ypoint]);
                d.xpoint = point[0];
                d.ypoint = point[1];
            }
            // center position
            if (d.devKind1 == "POINT") {
                d.itemSize = 1.5;
                scale = TopoUtil.getItemScale(d.itemSize);
                cx = d.xpoint + (55 * scale / 2);
                cy = d.ypoint + (55 * scale / 2);
            }
            else {
                scale = TopoUtil.getItemScale(d.itemSize),
                    cx = d.xpoint + ((55 - (55 * scale)) / 2) + (55 * scale / 2),
                    cy = d.ypoint + (55 * scale / 2);
            }

            // Item 능 설정 정보
            if (d.devPerf) d.devPerf = JSON.parse(d.devPerf);

            // Item 기타 설정 정보
            if (d.itemConf) d.itemConf = JSON.parse(d.itemConf);

            nodes.push($.extend({
                id: "g" + d.itemNo,
                x: d.xpoint,
                y: d.ypoint,
                cx: cx,
                cy: cy,
                xgap: cx - d.xpoint,
                ygap: cy - d.ypoint
            }, d));

            currItemObj = _.cloneDeep(nodes);
        });

        if ( JSON.stringify(currItemObj) === JSON.stringify(oldItemObj) )
            objTopo.vars.isChangeTopo = false;
        else
            objTopo.vars.isChangeTopo = true;

        oldItemObj = _.cloneDeep(currItemObj);

        return nodes;
    },

    setCenterLoc: function (d) {
        if (d == null) return;
        var scale;
        // center position
        if (d.devKind1 == "POINT") {
            scale = TopoUtil.getItemScale(1.5);
            d.cx = d.x + (55 * scale / 2);
            d.cy = d.y + (55 * scale / 2);
        }
        else {
            scale = TopoUtil.getItemScale(d.itemSize);
            d.cx = d.x + ((55 - (55 * scale)) / 2) + (55 * scale / 2);
            d.cy = d.y + (55 * scale / 2);
        }
    },

    /** 데이터 갱신 */
    callRefresh: function (objTopo) {

        // console.log("callRefresh : ")
        var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
        var getBBox = objTopo.createBBox;
        this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);
    },

    refresh: function (objTopo, svg, nodes, node_call, getBBox) {

        removeNode = svg.select("g.grp_object").selectAll(".node");
        TopoItem.removeEvent(removeNode);
//			removeNode.remove();

        node = svg.select("g.grp_object").selectAll(".node").data(nodes);
        node.exit().remove();

        /** node g */
        node = node.enter()
            .append("g")
            .merge(node)
            .attr("id", function (d) {
                return d.id;
            })
            .attr("class", function (d) {
                if (d.devKind1 == "POINT") return "node point";
                else return "node";
            })
            .attr("cursor", "pointer")
            .attr("width", 55)
            .attr("height", 55)
            .style("display", "none")
            .call(node_call);

        /** event anmiation circle */
        grpImg = node.selectAppend("g", "grpImg");
        grpImg
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 55)
            .attr("height", 55)
            .attr("class", "grpImg")
            .attr("transform", function (d) {
                scale = TopoUtil.getItemScale(d.itemSize);
                return "scale(" + [scale, scale].join(",") + ")";
            });

        grpImg.selectAppend("circle")
            .attr("cx", function (d) {
                return 55 / 2;
            })
            .attr("cy", function (d) {
                return 55 / 2;
            })
            .attr("r", function (d) {
                return 70 / 2;
            })
            // .classed("evtBubble", true)
            // .attr('class', function (d) {
            //     if (d.devKind1 == "POINT" || d.evtLevel == 0 || d.evtLevel == 1) return "evtBubble_1";
            //     return 'evtBubble_' + d.evtLevel;
            // })
            .attr("class", function (d) {
                if(d.evtLevel > 1) {
                    return "evtBubble";
                }else if(d.evtLevel == -1) {
                    //조치중
                    return "evtBubble processing";
                } else {
                    return "evtBubble";
                }
            })
            .style("fill", function (d) {  // 우클릭 -> 이미지 저장시 버블표기 검정으로 나오는 현상으로 수정.
                if (d.devKind1 == "POINT" || d.evtLevel == 0 || d.evtLevel == 1) {
                    return "transparent";
                }
                else if(d.evtLevel == 1) {
                    // 정상
                    return "transparent";
                }
                else if(d.evtLevel > 1) {
                    if(d.evtLevel == 6) return themeStyle.getPropertyValue('--critical-color');
                    else if(d.evtLevel == 5) return themeStyle.getPropertyValue('--major-color');
                    else if(d.evtLevel == 4) return themeStyle.getPropertyValue('--minor-color');
                    else if(d.evtLevel == 3) return themeStyle.getPropertyValue('--warning-color');
                    else if(d.evtLevel == 2) return themeStyle.getPropertyValue('--info-color');
                    else if(d.evtLevel == -1) return themeStyle.getPropertyValue('--processing-color'); //조치중
                }
                else if(d.evtLevel == -2){
                    // 작업중
                    return "#072DEB";
                }
            })
            .style('opacity', TopoConst.envSetting.bubbleOpacity)
            .style('display', function () {
                return TopoItem.isManageMode(objTopo) ? 'none' : 'block';
            });


        /** node 선택 영역 추가 */
        grpImg.selectAppend("rect", "state")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", function (d) {
//	                return d.itemSize * 10;
                return 55;
            })
            .attr("height", function (d) {
//	                return d.itemSize * 10;
                return 55;
            })
            .style("fill", "transparent")
            .attr("class", "state");

        /** 아이콘 이미지 추가 */
        grpImg.selectAppend("image")
            .attr("id", function (d) {
                return "image-" + d.itemNo;
            })
            .attr("crossorigin", "anonymous")
            .attr("width", function (d) {
                // return d.itemSize * 10;
                return 55;
            })
            .attr("height", function (d) {
                // return d.itemSize * 10;
                return 55;
            });
            // .on("dblclick", function (d) {
            //     if (d.itemConf && d.itemConf.hasOwnProperty('urlLink')) {
            //         if ( !TopoDraw.isManageMode(objTopo) ) {
            //             console.log("drawConf.urlLink ==== > " + d.itemConf.urlLink);
            //             window.open(
            //                 d.itemConf.urlLink,
            //                 '_blank' // <- This is what makes it open in a new window.
            //             );
            //
            //         }
            //     }
            // });

        // 아이템 이미지 설정
        agent = navigator.userAgent.toLowerCase(),
        appVer = navigator.appVersion.toLowerCase(),
        isIE = agent.indexOf("msie") !== -1 || appVer.indexOf("trident/") > 0;
        if (isIE) TopoItem.setImageUrl_ie(grpImg, nodes);
        else TopoItem.setImageUrl(grpImg, nodes);


        /* Item이 Server 일경우 OS 아이콘 적용 */
        // osImg = node.selectAppend("g", "osImg")
        //     .attr("class", "osImg");
        // osImg.selectAppend("image")
        //     .attr("id", function (d) {
        //         return "osImg-" + d.itemNo;
        //     })
        //     // .attr('width', 20)
        //     // .attr('height', 20)
        //     .attr('xlink:href', function (d) {
        //         if (d.devKind1 === 'SVR' || d.devKind1 === 'DBMS' || d.devKind1 === 'WAS' ) {
        //             osImgUrl = '/img/d3/devTypeIcons/' + d.devKind2 + '.svg';
        //         }
        //         return osImgUrl;
        //     })
        //     .style("display", function (d) {
        //         return d.devKind1 === 'SVR' ||
        //         d.devKind1 === 'DBMS' ||
        //         d.devKind1 === 'WAS' ? "block" : "none"
        //     })
        //     // .attr('x', function (d) {
        //     //     return (55 / 2) * TopoUtil.getItemScale(d.itemSize) ;
        //     // })
        //     // .attr('y', function (d) {
        //     //     return (55 / 2) * TopoUtil.getItemScale(d.itemSize) ;
        //     // })
        //     .attr("transform", function (d) {
        //         scale = TopoUtil.getItemScale(d.itemSize);
        //         if (scale < 1) scale = 1.5;
        //         else scale  = TopoUtil.getItemScale(d.itemSize) * 1.5;
        //         return "scale(" + [scale, scale].join(",") + ")";
        //     });

        /** 명칭 text 추가 */
        node.selectAppend("text")
            .attr("id", function (d) {
                return "nodetext_" + d.itemNo;
            })
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
        node.selectInsert("rect", "text_bg")
            .attr("labelPosition", function (d) {
                /* label(명칭) 위치 정렬 */
                objTemp = {};
                // d.itemConf.labelPosition = 'C'; // L:좌측, T:상단, R:우측, B:하단, C:중앙
                objTemp.nodeText = objTopo.vars.svg.select(".svgGroup").selectAll(".nodetext").filter(function (n) {
                    return n.id == d.id;
                });

                objTemp.bboxWidth = objTemp.nodeText.data()[0].bbox.width;
                objTemp.bboxHeigth = objTemp.nodeText.data()[0].bbox.height;
                objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) < 1 ? 1 : TopoUtil.getItemScale(d.itemSize);
                if (d.itemConf && d.itemConf.labelPosition === 'T') {
                    // 상단
                    objTemp.nodeText.attr("dx", objTemp.centerCalc);
                    objTemp.nodeText.attr("dy", (-1 * objTemp.bboxHeigth / 2));
                }
                else if ( !d.itemConf || (d.itemConf && d.itemConf.labelPosition === 'B')) {
                    // 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                    objTemp.nodeText.attr("dx", objTemp.centerCalc);
                    objTemp.nodeText.attr("dy", (55 * TopoUtil.getItemScale(d.itemSize)) + 20);
                }
                else if (d.itemConf && d.itemConf.labelPosition === 'L') {
                    // 좌측
                    objTemp.nodeText.attr("dx", (-1) * (objTemp.bboxWidth / 2) - 10 );
                    // objTemp.nodeText.attr("dx", (-1) * objTemp.bboxWidth + 15 );
                    objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                }
                else if (d.itemConf && d.itemConf.labelPosition === 'R') {
                    // 우측
                    //objTemp.nodeText.attr("dx", objTemp.centerCalc + ((objTemp.bboxWidth / 2) * objTemp.itemScale + 26));
                   // objTemp.nodeText.attr("dx", (55 * TopoUtil.getItemScale(d.itemSize) + 26));
                    objTemp.nodeText.attr("dx", (objTemp.bboxWidth / 2) + (55 * TopoUtil.getItemScale(d.itemSize)) + 10);
                    objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                }
                else {
                    // 중앙
                    objTemp.nodeText.attr("dx", objTemp.centerCalc);
                    objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                }
            })
            .attr("x", function (d) {
                objTemp = {};
                objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) ;
                if (!d.itemConf ||
                    (d.itemConf && d.itemConf.labelPosition === 'T') ||
                    (d.itemConf && d.itemConf.labelPosition === 'B') ||
                    (d.itemConf && d.itemConf.labelPosition === 'C') ) {
                    // 상단, 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함), 중앙
                    objTemp.xRetVal = objTemp.centerCalc - (d.bbox.width / 2) - 5;
                }
                else if (d.itemConf && d.itemConf.labelPosition === 'L') {
                    // 좌측
                    objTemp.xRetVal = (-1) * d.bbox.width - 15;
                }
                else if (d.itemConf && d.itemConf.labelPosition === 'R') {
                    // 우측
                    objTemp.xRetVal = (55 * TopoUtil.getItemScale(d.itemSize) + 8 );
                }

                return objTemp.xRetVal;
            })
            .attr("y", function (d) {

                objTemp = {};
                objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) ;
                if (d.itemConf && d.itemConf.labelPosition === 'T') {
                    // 상단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                    objTemp.yRetVal = (-1 * d.bbox.height) - 5;
                }
                else if (!d.itemConf || (d.itemConf && d.itemConf.labelPosition === 'B')) {
                    // 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                    objTemp.yRetVal = d.bbox.y;
                }
                else if ((d.itemConf && d.itemConf.labelPosition === 'L') ||
                    (d.itemConf && d.itemConf.labelPosition === 'R') ||
                    (d.itemConf && d.itemConf.labelPosition === 'C')) {
                    // 좌측, 우측, 중앙
                    objTemp.yRetVal = (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (d.bbox.height / 2);
                }

                return objTemp.yRetVal;
            })
            .attr("width", function (d) {
                // debugger
                return d.bbox.width + 10;
            })
            .attr("height", function (d) {
                return d.bbox.height;
            })
            .attr("class", "text_bg")
            .style("fill", TopoConst.envSetting.fontBgColor)
            .style('opacity', TopoConst.envSetting.fontBgOpacity)
            // .style("opacity", 0.3)
            // .style("stroke", TopoConst.envSetting.fontBgColor)
            // .style('stroke-opacity', 0.9)
            // .style("fill", "RGBA(0,188,212,0.3)")
            .style("visibility", function (d) {
                return TopoConst.envSetting.showLabel == 1 && d.showLabel == 1 && d.fontSize > 0 ? "visible" : "hidden";
            });

        // GRP.viewType == 'GIS'인 경우 아이콘 표시
        gisNode = node.filter(function (d) {
            return d.temp1 == 'GIS';
        });
        node.selectAll('image.imgGrpViewType').remove();
        if (gisNode.size() > 0) {
            gisNode.each(function (d) {
                d3.select(this)
                    .selectAppend('image', 'imgGrpViewType')
                    .classed('imgGrpViewType', true)
                    .attr('xlink:href', '/img/d3/icon_gis_3d.svg')
                    .attr('width', 30).attr('height', 30)
                    .attr('x', 10).attr('y', -28);
            });
        }

        /* Health 이미지 추가 */
        healthImg = node.selectAppend("g", "healthImg");
        healthImg
            .attr("class", "healthImg");
        healthImg.selectAppend("image")
            .attr("id", function (d) {
                return "healthImage-" + d.itemNo;
            })
            .attr('x', function (d) {
                return (55 / 2) * TopoUtil.getItemScale(d.itemSize) + (35 * TopoUtil.getItemScale(d.itemSize));
            })
            .attr('y', -10)
            // .style("visibility", function (d) {
            //     return TopoConst.envSetting.showIcmpPoll == 1 && d.devKind1 == "DEV" ? "visible" : "hidden"
            // })
            .style("display", function (d) {
                return d.devKind1 != 'GRP' && TopoConst.envSetting.showIcmpPoll == 1 ? "block" : "none"
            });

        /* HA 이미지 추가 */
        haImg = node.selectAppend("g", "haImg");
        haImg
            .attr("class", "haImg");
        haImg.selectAppend("image")
            .attr("id", function (d) {
                return "haImage-" + d.itemNo;
            })
            .attr('x', function (d) {
                return (55 / 2) * TopoUtil.getItemScale(d.itemSize) + (35 * TopoUtil.getItemScale(d.itemSize));
            })
            .attr('y', 15)
            .style("display", function (d) {
                return d.devKind1 != 'GRP' && d.haStatus && d.haStatus > -1 && TopoConst.envSetting.showHA == 1 ? "block" : "none"
            });

        TopoItem.addEvent(node, objTopo);
        TopoItem.animationForfindItem(objTopo);

        // mapMode에 따른 포인트아이템 visible/hidden
        svg.selectAll(".svgGroup").selectAll("g.node.point").style("display", objTopo.vars.mapMode == TopoConst.mapMode.SEARCH ? "none" : "block");

        return node;
    },

    nodeMouseenter: function(eNode, objTopo) {
        eItemNo = d3.select(eNode).data()[0].itemNo;
        targetItemNo = [];
        objTopo.vars.svgGroup.selectAll("path.link").filter(function (l) {
            retValue = false;
            if (eItemNo == l.itemNo1 || eItemNo == l.itemNo2) {
                if (targetItemNo.indexOf(l.itemNo1) == -1) targetItemNo.push(l.itemNo1);
                if (targetItemNo.indexOf(l.itemNo2) == -1) targetItemNo.push(l.itemNo2);
                retValue = true;
            }
            return retValue;
        }).classed("linkHighlighted", true);

        targetItemNo = targetItemNo.filter((element) => element !== eItemNo);

        $.each(targetItemNo, function (idx, sItemNo) {
           objTopo.vars.svgGroup.selectAll("g.node").filter(function (n) {
                return   n.itemNo == sItemNo;
            }).classed("nodeHighlighted", true);
            // objTopo.vars.svgGroup.selectAll("g.node").classed("nodeHighlighted", function (n) {
            //     return   n.itemNo == sItemNo;
            // });
        });

        d3.select(eNode).classed("nodeHighlighted", true);
    },

    nodeMouseleave: function(d, objTopo) {
        objTopo.vars.svgGroup.selectAll("g.node").classed("nodeHighlighted", false);
        objTopo.vars.svgGroup.selectAll("path.link").classed("linkHighlighted", false);
    },

    /** 이벤트 등록 */
    addEvent: function (node, objTopo) {
        node.on("dblclick", function (d) {
                // if (D3Topology.vars.mapMode == TopoConst.mapMode.SEARCH && d.devKind1 == "GRP") {
                if (d.devKind1 == 'GRP') {

                    if (  objTopo.getAccountGroups() || objTopo.vars.isShareGroupNo ) {
                        //그룹 Item의 경우 mngNo에 자기자신의 grpNo 번호가 있음 (권한 그룹 체크)
                        if ( objTopo.vars.isShareArrGrps.some(groupNode => groupNode.grpNo === d.mngNo) ) {
                            console.log("group Item dbclick 그룹권한 ok");
                        }
                        else {
                            console.log("group Item dbclick 그룹권한 없음");
                            alert("권한이 없는 그룹입니다.");
                            return false;
                        }

                        /* 상위 그룹을 위한 현재 그룹번호 이력 저장 (상속계정 상위그룹 이동용)
                        * 상속계정의 최상위 화면에서 그룹으로 이동할 경우 grpNo 와 mngNo 동일하여 예외 처리
                        **/
                        if (d.grpNo != d.mngNo) objTopo.vars.isGrpMoveHistory.push(d.grpNo);

                        objTopo.vars.isShareGroupNo = objTopo.vars.curGrpNo = d.mngNo;
                    }
                    else {
                        objTopo.vars.curGrpNo = d.mngNo;
                    }
                    objTopo.vars.isChgGrp = true;
                    objTopo.chgGrp.call(objTopo);
                }
                else {
                    /* item 이 장비일경우 성능 Panel view/hide : 추후 개발 예정 */
                }
            })
            .on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo))
            .on("mouseenter", function(d) {
                TopoItem.showTooltip(d, objTopo);
                if( !TopoItem.isManageMode(objTopo) ) TopoItem.nodeMouseenter(this, objTopo);
            })
            .on("mouseleave", function (d) {
                TopoItem.hideTooltip();
                TopoItem.nodeMouseleave(this, objTopo);
            });
    },

    /** 이벤트 해제 */
    removeEvent: function (node) {
        node.on("contextmenu", null)
            .on("click", null)
            .on("dblclick", null)
            .on("mouseenter", null)
            .on("mouseleave", null);
    },

    /** 툴팁 show */
    showTooltip: function (d, objTopo) {

        if ( this.isManageMode(objTopo) ) return;
        // console.dir(d);
        var div = d3.select('div#section').select('div.tooltip');
        var _devKind1 = d && d.hasOwnProperty("devKind1") && d.devKind1 ? d.devKind1.toUpperCase() : null;
        var _devKind2 = d && d.hasOwnProperty("devKind2") && d.devKind2 ? d.devKind2.toUpperCase() : null;
        if (_devKind1 == null || _devKind1 == "POINT") return;

        var tHtml = "<table class='tt-table'>";
        if (_devKind1 != "LINK") { //회선이 아닌경우 (그룹, 장비, 랙 등등)
            if (_devKind1 == "GRP" && d.uniqId > 0) {
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "상속그룹" + "</th>";
                tHtml += "<td class='tt-td'>" + (d.itemAlias || d.itemName) + "</td></tr>";
            }
            tHtml += "<tr class='tt-tr'><td class='tt-td' colspan='2'>" + (d.itemAlias || d.itemName) + "</td></tr>";
            if (_devKind1 != "GRP" && _devKind1 != "RACK") {
                if (_devKind1 != "ETC") {
                    tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "IP" + "</th>";
                    tHtml += "<td class='tt-td'>" + d.devIp + "</td></tr>";
                }
                else {
                    var tmp = d.devIp ? d.devIp : '-';
                    tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "IP(URL)" + "</th>";
                    tHtml += "<td class='tt-td'>" + tmp + "</td></tr>";
                }

                if (_devKind1 == "SENSOR") {
                    tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "설치위치" + "</th>";
                    tHtml += "<td class='tt-td'>" + (d.temp3 || '-') + "</td></tr>";
                }
            }else if (_devKind1 == "ETC"){
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "MAC" + "</th>";
                tHtml += "<td class='tt-td'>" + (d.devIp || '-') + "</td></tr>";
            }
            else if (_devKind1 == "RACK") {
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "유닛수" + "</th>";
                tHtml += "<td class='tt-td'>" + (d.devIp || '-') + "</td></tr>";
            }
            if (_devKind1 != "ETC") {
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "종류" + "</th>";
                tHtml += "<td class='tt-td'>" + (d.devKind2 || '-') + "</td></tr>";
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "상태" + "</th>";
                tHtml += "<td class='tt-td'>" + (TopoUtil.convertEvtLevel(d.evtLevel) || '-') + "</td></tr>";
            }

            // console.dir(d);

            // 장비 및 AP 위치
            if ((_devKind2 == "L2SWITCH" && d.location != '') || (_devKind2 == "AP" && d.location != '')) {
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "위치" + "</th>";
                tHtml += "<td class='tt-td'>" + (d.location || '-') + "</td></tr>";
            }

            // HA 상태
            if (d.haStatus && d.haStatus > -1) {
                haStatus = null;
                if (d.haStatus == 1)  haStatus = 'Active';
                else haStatus = 'Standby';

                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "HA" + "</th>";
                tHtml += "<td class='tt-td'>" + (haStatus || '-')  + "</td></tr>";
            }

            var _userContent = d.hasOwnProperty("userContent") ? d.userContent : null;
            if (_userContent != null) {
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "메모" + "</th>";
                tHtml += "<td class='tt-td'>" + ((_userContent.replace(/\n/gi, "<br>")) || '-') + "</td></tr>";
            }
            var _dynInfo = d.hasOwnProperty('dynInfo') ? d.dynInfo : null;
            if (_dynInfo != null) {
                tHtml += "<tr class='tt-tr'><td class='tt-td' colspan='2'>" + ((_dynInfo.replace(/\n/, '').replace(/\n/g, '<br>')) || '-') + "</td></tr>";
            }
            if(_devKind1 === "DEV" && d.devPerf) {
                // 일반장비 이며 성능 정보가 있는 경우
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "CPU" + "</th>";
                tHtml += "<td class='tt-td'><div class='animated-progress'><div class='progress-bg'></div><span data-progress='" + d.devPerf.CPU + "'></span></div></td></tr>";
                tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "Memory" + "</th>";
                tHtml += "<td class='tt-td'><div class='animated-progress'><div class='progress-bg'></div><span data-progress='" + d.devPerf.MEM + "'></span></div></td></tr>";

            } else if (_devKind1 === "AP_CONTROLLER" && d.devPerf) {
                // AP Controller 이며 성능 정보가 있는 경우
            }

            tHtml += "</table>";
            show(tHtml, objTopo);
        }

        function show(msg, objTopo) {
            // console.log(d3.event);
            browserSize = {
                width: window.innerWidth || document.body.clientWidth,
                height: window.innerHeight || document.body.clientHeight
            };
            tooltipSize = {width: 0, height: 0};

            div.transition().duration(100).style("opacity", .9);
            div.html(msg)
                .style("left", function(d) {
                    tooltipSize.width = $('.tooltip').width() + 30;
                    _left = d3.event.clientX + tooltipSize.width >= browserSize.width ? d3.event.clientX - (tooltipSize.width ) : d3.event.clientX;
                    return _left + "px";
                })
                .style("top", function (d){
                    tooltipSize.height = $('.tooltip').height() + 40;
                    _top = d3.event.clientY + tooltipSize.height >= browserSize.height ? d3.event.clientY - tooltipSize.height - 30 : d3.event.clientY;
                    valueTop = $('#nav').height() ? $('#nav').height() : $('#hd-header').height();
                    return _top - valueTop  + "px";
                }); //nav 영역 제외

            $(".animated-progress").each(function (d) {
                $(this).children("div").animate(
                    {
                        width: $(this).children("span").attr("data-progress") + "%",
                    },
                    500
                );
                $(this).children("span").text($(this).children("span").attr("data-progress") + "%");
            });
        }

    },


    /** 툴팁 hide */
    hideTooltip: function () {
        var div = d3.select('div#section').select('div.tooltip');
        div.transition().duration(100).style("opacity", 0);
    },

    /** 장애등급 버블 애니메이션 */
    animation: function (objTopo) {

        circle = objTopo.vars.svg.selectAll("g.node > g.grpImg").selectAll("circle");
        circle.on("start", null);
        circle
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
        rect = objTopo.vars.svg.selectAll("g.node > rect.text_bg");
        var findMark = fineItem.selectAppend("g", "imgFindMark");
        if (objTopo.vars.findItemNo == null) {
            rect.interrupt();
            fineItem.interrupt();
            rect.on('start', null);
            fineItem.on("start", null);
            findMark.interrupt();
            findMark.on("start", null);
            return;
        }

        /* 장비찾기 표시 */
        findMark
            .attr("class", "imgFindMark");
        findMark.selectAppend("image")
            .attr('xlink:href', '/img/d3/icon/findMark.svg')
            .attr('width', 30).attr('height', 30)
            .attr('x', function (d) {
                return (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (30/2) ;
            })
            .attr('y', function (d) {

                return (-1 * ( (30 / 2) * TopoUtil.getItemScale(d.itemSize)));
            });

        var xVal = 0, yVal;
        findMark.on("start", null);
        findMark
            .transition().duration(500).attr("transform", function (d) {
            return "translate(" + 0 + "," + 0 + ")";
        })
            .transition().duration(500).attr("transform", function (d) {
            yVal = (-1 * ( (30 / 2) * TopoUtil.getItemScale(d.itemSize))) - 5;
            return "translate(" + 0 + "," + yVal + ")";
        })
            .on("start", function repeat() {
                d3.active(this)
                    .transition().duration(500).attr("transform", function (d) {
                    return "translate(" + 0 + "," + 0 + ")";
                })
                    .transition().duration(500).attr("transform", function (d) {
                    yVal = (-1 * ( (30 / 2) * TopoUtil.getItemScale(d.itemSize))) - 5;
                    return "translate(" + 0 + "," + yVal + ")";
                })
                    .on("start", repeat);
            });



        findRect = rect.filter(function (d) {
            return d.itemNo == objTopo.vars.findItemNo;
        });
        findRect.on("start", null);
        findRect
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
            findRect.interrupt();
            fineItem.interrupt();
            findMark.interrupt();
            findRect.on('start', null);
            fineItem.on("start", null);
            findMark.on("start", null);
            fineItem.style("opacity", 1).classed("nodeHighlighted", true);
            objTopo.vars.findItemNo = null;
            findMark.transition().duration(500).attr("transform", function (d) { return "translate(" + 0 + "," + 0 + ")"; });

        }, 1000 * 10);
    },

    /** 아이템 이미지 설정
     * chrome에서 이미지가 url로 설정하면 export시 로드하지 못함. 그래서 base64로 설정함.
     * */
    setImageUrl: function (grpImg, nodes) {
        defImg = new Image();
        defImgData = null;
        defImg.onload = function () {
            canvas = document.createElement("canvas");
            canvas.width = defImg.width, canvas.height = defImg.height;
            canvas.getContext("2d").drawImage(defImg, 0, 0);
            defImgData = canvas.toDataURL("image/png");
        };
        defImg.src = '/image/d3/micons/NoImage.PNG';

        nodes.forEach(function (d, idx) {

            if (TopoConst.envSetting.showIcmpPoll == 1) {
                var icmpPollImgUrl = '';
                if(d.icmpPoll == "0")  icmpPollImgUrl = '/img/d3/icon/' + 'health_NONE.png';
                else if(d.icmpPoll == "1") icmpPollImgUrl = '/img/d3/icon/' + 'health_ICMP.png';
                else if(d.icmpPoll == "2") icmpPollImgUrl = '/img/d3/icon/' + 'health_SNMP.png';
                else if(d.icmpPoll == "3") icmpPollImgUrl = '/img/d3/icon/' + 'health_BOTH.png';
                var icmpImg = new Image();
                icmpImg.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = icmpImg.width, canvas.height = icmpImg.height;
                    canvas.getContext("2d").drawImage(icmpImg, 0, 0);
                    healthImg.select("#healthImage-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
                };
                icmpImg.src = icmpPollImgUrl;
            }
            if (TopoConst.envSetting.showHA == 1 && d.haStatus && d.haStatus > -1 ) {
                var haImgUrl = '/img/d3/icon/' + 'ha_ACTIVE.png';

                if (d.haStatus == 1) haImgUrl = '/img/d3/icon/' + 'ha_ACTIVE.png';
                else if (d.haStatus == 0) haImgUrl =  '/img/d3/icon/' + 'ha_STANDBY.png';


                var asImg = new Image();
                asImg.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = asImg.width, canvas.height = asImg.height;
                    canvas.getContext("2d").drawImage(asImg, 0, 0);
                    haImg.select("#haImage-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
                };
                asImg.src = haImgUrl;
            }

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
                        // grpImg.select("#image-" + d.itemNo).attr("xlink:href", defImgData);
                         grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/image/d3/micons/NoImage.PNG");
                    };
                    img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
                    // img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2, d.imgKind3);
                };
                img.src = "/image/d3/micons/{0}.PNG".substitute(d.usrKind);
                // img.src = "/image/d3/micons/{0}.{1}".substitute(d.usrKind, d.imgKind3 || 'PNG');
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
                    // grpImg.select("#image-" + d.itemNo).attr("xlink:href", defImgData);
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/image/d3/micons/NoImage.PNG");
                };
                img.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
                // img.src = TopoItem.getImageUrlByDevKind2(d.devKind2, d.imgKind3);
            }
        });
    },

    setImageUrl_ie: function (grpImg, nodes) {
        defImg = '/image/d3/micons/NoImage.PNG';

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
                        grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/image/d3/micons/NoImage.PNG");
                    };
                    img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2, d.imgKind3);
                };
                img.src = "/image/d3/micons/{0}.PNG".substitute(d.usrKind, d.imgKind || 'PNG');
            }
            // devKind2에 따른 이미지 적용
            else {
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
                };
                img.onerror = function () {
                    grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/image/d3/micons/NoImage.PNG");
                };
                img.src = TopoItem.getImageUrlByDevKind2(d.devKind2, d.imgKind3 || 'PNG');
            }
        });
    },

    /**
     * devKind2 이미지 url 리턴
     */
    getImageUrlByDevKind2: function (devKind2, imgKind3) {
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
        return "/image/d3/micons/{0}.PNG".substitute(fileName, imgKind3 || 'PNG');
    },

    /* 상속 토폴로지그룹 권한에 부여된 그룹(2개이상) 표현을 위한 좌표 값 적용 */
    setArryPoint: function () {
        // 최대 42개 설정 가능
        rowCnt = 6;  // 행
        colCnt = 7;  // 열
        browserSize = {
            width: window.innerWidth || document.body.clientWidth,
            height: window.innerHeight || document.body.clientHeight
        };

        startX = (browserSize.width / 2) / 2;
        startY = (browserSize.height / 2) / 2;

        wGap = (browserSize.width / 2)  / colCnt;
        hGap = (browserSize.height / 2) / rowCnt;
        for (row=0; row < rowCnt; row++) {
            for (col=0; col < colCnt; col++) {
                arrPoint.push({ "x": startX + (col * wGap) , "y": startY + (row * hGap) })
            }
        }
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
