"use strict";

var links = [];
var lineTrafficEffect = null, trafficInterval = null, typeEffect = null;
var offset = 0;
var tempVal = null, removeLink = null, link = null, linkText = null;
var d = null, i = 0;
var scale=0, x1=0, y1=0, x2=0, y2=0, pointCnt = 0;
var id = null, gradient1 = null, pathList = null;
var d_source, d_target, _devKind1 = null;
var div = null;
var msg = [];
var browserSize = null, tooltipSize = null;
var _left = null, _top = null;
var color = "", color1 = null, color2 = null;
var toolTipLink = null;
var currLinkObj = [], oldLinkObj = [];

var TopoLink = {

    /**
     * Layout 데이터 추가 (key: source, target)
     */
    setLinkData: function (list) {

        objTopo.vars.isChangeTopo = false;
        if (objTopo.vars.isChgGrp) oldLinkObj = [];
        if (list == null || list.length == 0) {
            // 객체가 없을경우 초기화를 위함
            objTopo.vars.isChangeTopo = true;
            return list;
        }

        currLinkObj = [];
        links = [];
        for (i = 0; i < list.length; i++) {
            d = list[i];
            // 아이템으로 그려졌지만 장비 원장에서 삭제된 경우를 찾아 삭제목록 생성(노드가 존재하지 않는 링크정보)
            if ($('#g' + d.itemNo1).length == 0 || $('#g' + d.itemNo2).length == 0) {
                continue;
            }
            // 1,3 있는 경우 고려해서 변경
            if (d.point1 == 0 && d.point2 == 0 && d.point3 == 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 != 0 && d.point2 == 0 && d.point3 == 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point1, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point1, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 != 0 && d.point2 != 0 && d.point3 == 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point1, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point1, target: "g" + d.point2, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point2, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 != 0 && d.point2 != 0 && d.point3 != 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point1, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point1, target: "g" + d.point2, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point2, target: "g" + d.point3, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point3, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 == 0 && d.point2 != 0 && d.point3 == 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point2, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point2, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 == 0 && d.point2 != 0 && d.point3 != 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point2, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point2, target: "g" + d.point3, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point3, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 == 0 && d.point2 == 0 && d.point3 != 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point3, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point3, target: "g" + d.itemNo2, itemType: 'link'}, d));
            } else if (d.point1 != 0 && d.point2 == 0 && d.point3 != 0) {
                links.push($.extend({source: "g" + d.itemNo1, target: "g" + d.point1, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point1, target: "g" + d.point3, itemType: 'link'}, d));
                links.push($.extend({source: "g" + d.point3, target: "g" + d.itemNo2, itemType: 'link'}, d));
            }
            currLinkObj = _.cloneDeep(links);
        }

        if ( JSON.stringify(currLinkObj) === JSON.stringify(oldLinkObj) )
            objTopo.vars.isChangeTopo = false;
        else
            objTopo.vars.isChangeTopo = true;

        oldLinkObj = _.cloneDeep(currLinkObj);

        return links;
    },

    callRefresh: function (objTopo) {
        return this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links);;
    },

    refresh: function (objTopo, svg, links) {

        console.log("Link ==============> Time : " + new Date());

        objTopo.vars.selectPathLink = [];
        removeLink = svg.select("g.grp_object").selectAll("path.link");
        TopoLink.removeEvent(removeLink);

        link = svg.select("g.grp_object").selectAll("path.link").data(links);
        link.exit().remove();

        link = link.enter()
            .insert("path", "g.node")
            .merge(link)
            .attr("id", function (d) {
                return d.source.devKind1 != "POINT" && d.target.devKind1 != "POINT" ? "link_" + d.linkNo :
                    d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT" ? "link_" + d.linkNo + "_" + d.itemNo1 :
                    d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT" ? "link_" + d.linkNo + "_" + d.itemNo2 :
                    "link_" + d.linkNo;
            })
            .attr("class", "link")
            .attr("data-linkNo", function (d) { return d.linkNo; })
            .style("stroke", function (d) {
                // return TopoUtil.getEvtColor(d.evtLevel1);
                pointCnt = 0;
                if (d.point1 > 0) pointCnt++;
                if (d.point2 > 0) pointCnt++;
                if (d.point3 > 0) pointCnt++;

                color1 = null, color2 = null;

                /**
                 * [회선 색상모드=대역폭기준]인 경우 폴링설정 회선의 대역폭이 0보다 크면 대역폭 색상표를 따르고 그렇지 않으면
                 * 회선의 기본색상으로 표시한다.
                 *
                 * 2022.03.24
                 * 폴링회선(CM_TOPO_LINK 테이블의 MNG_NO, IF_IDX 값이 존재)일경우 AND 회선 개별 POLLING_COLOR 미설정일 경우 기본 POLLING_COLOR 적용
                 *
                 */
                if (TopoConst.envSetting.ifColorMode == TopoConst.lineColorMode.SPEED) {
                    color1 = d.lineWidth1 > 0 ? TopoUtil.getIfSpeedColor(d.lineWidth1) : d.userPollLineColor1 ? d.userPollLineColor1 : d.lineColor || TopoConst.envSetting.lineColor;
                    color2 = d.lineWidth2 > 0 ? TopoUtil.getIfSpeedColor(d.lineWidth2) : d.userPollLineColor2 ? d.userPollLineColor2 : d.lineColor || TopoConst.envSetting.lineColor;
                }
                /**
                 * [회선 색상모드=장애기준]인 경우 회선 기본색상/폴링색상 설정값으로 적용
                 *
                 * * 2022.03.24
                 * 폴링회선(CM_TOPO_LINK 테이블의 MNG_NO, IF_IDX 값이 존재)일경우 AND 회선 개별 POLLING_COLOR 미설정일 경우 기본 POLLING_COLOR 적용
                 *
                 */
                else {
                    color1 = d.userPollLineColor1 ? d.userPollLineColor1 : TopoConst.evtLvlColor.level0;
                    color2 = d.userPollLineColor2 ? d.userPollLineColor2 : TopoConst.evtLvlColor.level0;
                    if (d.lineColor != null) {
                        color1 = d.lineColor;
                        color2 = d.lineColor;
                    }
                    if (d.pollingColor != null) {
                        color1 = d.ifIdx1 > 0 ? d.pollingColor : d.lineColor || TopoConst.envSetting.lineColor;
                        color2 = d.ifIdx2 > 0 ? d.pollingColor : d.lineColor || TopoConst.envSetting.lineColor;
                    } else {
                        if (d.ifIdx1 > 0) color1 = TopoConst.envSetting.pollingColor;
                        if (d.ifIdx2 > 0) color2 = TopoConst.envSetting.pollingColor;
                    }
                }

                /** 2022.02.23 명칭 변경 및 대역폭모드시 이벤트 등급에 따른 색상 적용
                 *  장애기준 => 기본모드, 대역폭기준 => 대역폭모드
                 *  장애기준색상 => 기본모드 색상, 대역폭기준 색상 => 대역폭모드 색상
                 *  대역폭모드 색상일 경우에도 회선 이벤트발생 시 등급에 따른 색상 적용
                 *  토폴로지맵의 경우 이벤트 등급 2~6 까지 발생임
                 */
                if (d.evtLevel1 && d.evtLevel1 > 1) color1 = TopoUtil.getEvtColor(d.evtLevel1);
                if (d.evtLevel2 && d.evtLevel2 > 1) color2 = TopoUtil.getEvtColor(d.evtLevel2);

                // point가 3개인 경우 point-to-point는 2번째 포인트 기준으로 이벤트 영역이 나뉜다.
                if (pointCnt == 3 && d.source.devKind1 == "POINT" && d.target.devKind1 == "POINT") {
                    if (d.source.itemNo == d.point1 && d.target.itemNo == d.point2) color2 = color1;
                    else if (d.source.itemNo == d.point2 && d.target.itemNo == d.point3) color1 = color2;
                }
                else {
                    if (d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT") color1 = color2;
                    if (d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT") color2 = color1;
                }

                scale = (1.5 * (9 * d.source.itemSize)) / 55;
                x1 = (d.source.x + ((55 - (55 * scale)) / 2)) + (55 * scale / 2);
                y1 = (d.source.y) + (55 * scale / 2);
                x2 = (d.target.x + ((55 - (55 * scale)) / 2)) + (55 * scale / 2);
                y2 = (d.target.y) + (55 * scale / 2);

                id = "S" + d.source.index + "T" + d.target.index + "L" + d.linkNo; //uniq값 생성
                gradient1 = svg.select("defs").selectAppendById("linearGradient", id).attr("id", id);
                gradient1.attr("gradientUnits", "userSpaceOnUse"); //absolute position (kind: userSpaceOnUse | objectBoundingBox)
                gradient1.attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
                gradient1.selectAppend("stop", "stop1").attr("class", "stop1").attr("offset", "0%").attr("stop-color", color1);
                gradient1.selectAppend("stop", "stop2").attr("class", "stop2").attr("offset", "50%").attr("stop-color", color1);
                gradient1.selectAppend("stop", "stop3").attr("class", "stop3").attr("offset", "50%").attr("stop-color", color2);
                gradient1.selectAppend("stop", "stop4").attr("class", "stop4").attr("offset", "100%").attr("stop-color", color2);
                return "url(#" + id + ")";
            })
            .attr("stroke-linecap", function (d) { return 'round'; /* butt, round, square */ })
            .style("stroke-dasharray", function (d) {
                lineTrafficEffect = null;
                if (d.lineTrafficEffect && d.lineTrafficEffect != 'None') {
                    lineTrafficEffect = d.lineTrafficEffect == 'Forward' ? [12, 6, 0.1, 8] : [12, 8, 0.1, 6];
                } else {
                    lineTrafficEffect = (d.lineStyle || "") == "" ? null : d.lineStyle;
                }
                return lineTrafficEffect;
                //return (d.lineStyle || "") == "" ? null : d.lineStyle;
            })
            //.style("stroke-dashoffset", 0)
            .style('stroke-width', function (d) { return d.lineSize; })
            .style("fill", "none")
            .attr("cursor", this.isManageMode(objTopo) ? "pointer" : "default")
            .classed("flowactive", function (d) { return d.lineFlowEffect != "None" ? true : false; });

        TopoLink.addEvent(link, objTopo);

        return link;
    },

    getPathLink: function(linkNo) {
        return  objTopo.vars.svg.select(".svgGroup").selectAll("path.link").filter(function (l) {
            return l.linkNo == linkNo;
        });
    },

    /** 이벤트 등록 */
    addEvent: function (link, objTopo) {

        link.on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo))
            .on("click", function (d) {
                if ( !TopoLink.isManageMode(objTopo) ) return false;
                // console.log("TopoLink click");
                toolTipLink = TopoLink.getPathLink(d.linkNo);
                toolTipLink
                    .style("stroke-width", function (d) {
                        return d.lineSize + 3;
                    });

                if (!objTopo.vars.selectPathLink.find(v => v === d.linkNo))
                    objTopo.vars.selectPathLink.push(d);

            })
            .on("mouseenter", function (d) {
                toolTipLink = TopoLink.getPathLink(d.linkNo);
                toolTipLink
                    .style("stroke-width", function (d) {
                        return d.lineSize + 3;
                    });
                TopoLink.showTooltip(d, objTopo);
            })
            .on("mouseleave", function (d) {
                if (objTopo.vars.selectPathLink.find(v => v.linkNo === d.linkNo)) return false;
                toolTipLink = TopoLink.getPathLink(d.linkNo);
                toolTipLink.style("stroke-width", d.lineSize);
                TopoLink.hideTooltip(d);
            });

        return true;
    },



    /** 이벤트 해제 */
    removeEvent: function (link) {
        link.on("contextmenu", null)
            .on("click", null)
            .on("mouseenter", null)
            .on("mouseleave", null);
    },

    /** 툴팁 show */
    showTooltip: function (d, objTopo) {

        if ( this.isManageMode(objTopo) ) return;

        pathList = d3.selectAll('path.link[data-linkNo="' + d.linkNo + '"]').data();
        d_source = null;
        d_target = null;
        $.each(pathList, function (idx, pathData) {
            if (pathData.source.devKind1 != "POINT" && pathData.source.itemNo == d.itemNo1) {
                d_source = pathData.source;
            }
            if (pathData.target.devKind1 != "POINT" && pathData.target.itemNo == d.itemNo2) {
                d_target = pathData.target;
            }
        });
        div = d3.select('div#section').select('div.tooltip');
        _devKind1 = d.hasOwnProperty("itemType") ? d.itemType.toUpperCase() : null;
        if (_devKind1 == null || _devKind1 != "LINK") return;

        msg = [];
        msg.push("[{0}] 회선 정보".substitute(d_source.itemName || ""));
        if (d.linkName1 != null && d.linkName1 != "") {
            msg.push("회선명 : {0}".substitute(d.linkName1));
            msg.push("대역폭 : {0}".substitute(HmUtil.convertUnit1000(d.lineWidth1)));
            if (d.isMulti == 1) {
                msg.push("트래픽 : {0}bps ({1})".substitute(HmUtil.convertUnit1000(d.traffic1), TopoConst.trfTypeString[d.trafficType1]));
            }
            else {
                msg.push("트래픽 : {0} (In) / {1} (Out)".substitute(
                    HmUtil.convertUnit1000(d.traffic1In), HmUtil.convertUnit1000(d.traffic1Out)));
            }
            // msg.push("트래픽 : {0}bps ({1})".substitute(HmUtil.convertUnit1000(d.traffic1), TopoConst.trfTypeString[d.trafficType1]));
        }
        msg.push("상태 : {0}<br>".substitute(TopoUtil.convertEvtLevel(d.evtLevel1)));

        msg.push("[{0}] 회선 정보".substitute(d_target.itemName || ""));
        if (d.linkName2 != null && d.linkName2 != "") {
            msg.push("회선명 : {0}".substitute(d.linkName2));
            msg.push("대역폭 : {0}".substitute(HmUtil.convertUnit1000(d.lineWidth2)));
            if (d.isMulti == 1) {
                msg.push("트래픽 : {0}bps ({1})".substitute(HmUtil.convertUnit1000(d.traffic2), TopoConst.trfTypeString[d.trafficType2]));
            }
            else {
                msg.push("트래픽 : {0} (In) / {1} (Out)".substitute(
                    HmUtil.convertUnit1000(d.traffic2In), HmUtil.convertUnit1000(d.traffic2Out)));
            }
            // msg.push("트래픽 : {0}bps ({1})".substitute(HmUtil.convertUnit1000(d.traffic2), TopoConst.trfTypeString[d.trafficType2]));
        }
        msg.push("상태 : {0}".substitute(TopoUtil.convertEvtLevel(d.evtLevel2)));

        show(msg.join("<br>"));

        function show(msg) {
            browserSize = {
                width: window.innerWidth || document.body.clientWidth,
                height: window.innerHeight || document.body.clientHeight
            };
            tooltipSize = {width: 0, height: 0};
                       // _left = d3.event.clientX + tooltipSize.width > browserSize.width ? (browserSize.width - tooltipSize.width) - 30 : d3.event.clientX;
            // _top = d3.event.clientY + tooltipSize.height > browserSize.height ? (browserSize.height - tooltipSize.height) - (tooltipSize.height / 2) : d3.event.clientY;

            div.transition().duration(100).style("opacity", .9);
            /*         div.html(msg)
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", ((d3.event.pageY) - $('#nav').height()) + "px"); //nav 영역 제외*/
            div.html(msg)
                .style("left", function (d) {
                    tooltipSize.width = $('.tooltip').width() + 30;
                    _left = d3.event.clientX + tooltipSize.width >= browserSize.width ? d3.event.clientX - (tooltipSize.width ) : d3.event.clientX;
                    // _left = d3.event.clientX + tooltipSize.width > browserSize.width ? (browserSize.width - tooltipSize.width) - 30 : d3.event.clientX;
                    return _left + "px";
                })
                .style("top", function (d) {
                    tooltipSize.height = $('.tooltip').height() + 40;
                    _top = d3.event.clientY + tooltipSize.height >= browserSize.height ? d3.event.clientY - tooltipSize.height - 30 : d3.event.clientY;
                    // _top = d3.event.clientY + tooltipSize.height > browserSize.height ? (browserSize.height - tooltipSize.height) - (tooltipSize.height / 2) : d3.event.clientY;
                    return (_top - $('#nav').height()) + "px";
                }); //nav 영역 제외
        }
    },

    /** 툴팁 hide */
    hideTooltip: function () {
        div = d3.select('div#section').select('div.tooltip');
        div.transition().duration(100).style("opacity", 0);
    },

    /** 이벤트등급에 따른 애니메이션 (깜빡깜빡) */
    animation: function (objTopo) {
        link = objTopo.vars.svg.selectAll("line.link");
        link.transition().duration(500).style("stroke", function (d) {
            return TopoLink.getStrokeColor("output", d.evtLevel1);
        }).transition().duration(500).style("stroke", function (d) {
            return TopoLink.getStrokeColor("input", d.evtLevel1);
        })
            .on("start", function repeat() {
                d3.active(this).transition().duration(500).style("stroke", function (d) {
                    return TopoLink.getStrokeColor("output", d.evtLevel1);
                })
                    .transition().duration(500).style("stroke", function (d) {
                    return TopoLink.getStrokeColor("input", d.evtLevel1);
                })
                    .on("start", repeat);
            });
    },

    /** 이벤트에 따른 색상 리턴 */
    getStrokeColor: function (type, evtLevel) {
        color = "";
        if (evtLevel == 0) color = TopoConst.evtLvlColor.level0;
        else if (type == "input" && evtLevel != 1) color = "#ffffff";
        else {
            color = TopoUtil.getEvtColor(evtLevel);
        }
//	    	console.log(color + " / " + type + " / " + evtLevel);
        return color;
    },

    /** 회선 이동 애니메이션 */
    animationTraffic: function (objTopo) {

        TopoLink.startOffset(objTopo);
    },

    /** path 이동 offset 값 적용 */
    startOffset: function (objTopo) {

        offset = 0; //회선 이동 속도(1~5 단계 적용 예정)
        console.log(" trafficInterval ================ ==> " + trafficInterval);
        clearInterval(trafficInterval);
        trafficInterval = null;

        trafficInterval = setInterval(function A() {

            // offset += linkItem.__data__.lineTrafficEffectSpeed;
            $.each(objTopo.vars.svg.selectAll("path.link").nodes(), function (idx, linkItem) {
                typeEffect = linkItem.__data__.lineTrafficEffect;
                if (typeEffect && typeEffect != 'None') {
                    offset += linkItem.__data__.lineTrafficEffectSpeed;
                    //console.log("offset ===================> " + linkItem.__data__.linkNo + " @@@ " + linkItem.__data__.lineTrafficEffectSpeed);
                    tempVal = typeEffect == 'Forward' ? -1 : 1;
                    linkItem.style.strokeDashoffset = (offset * tempVal);
                }
            });

        }, 500)

    },

    /** 회선에 특정 모양 이동 애니메이션 */
    stopOffset: function () {
        clearInterval(trafficInterval);
        trafficInterval = null;
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    }


};


