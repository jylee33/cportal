"use strict";
var flow = null;
var flowInterval = null;
var i, j, d;
var flows = [], flowArray = [], flowCheckArr = [];
var scale, cx, cy, count = 0;
var flowFileName = null, flow = null, tmpObj = null, linkItem = null, thisImageNode = null;
var flowIdx = 0, imageCounter = 0;
var flowId = null, flowingEffect = null, multiFlowingEffect = null, findId = null;
var flowObj = {};
var currFlowObj = [], oldFlowObj = [], flowfilterColor= [];

var TopoFlow = {
    /**
     * Flow Image 데이터 추가 (key: id (linkNo) )
     */
    setFlowData: function (objTopo, list) {

        objTopo.vars.isChgFlow = false;
        flowObj.rmTargetlinks = [];
        flowObj.linkArr = [];
        flowObj.flowDiffArr = [];
        flowObj.flowAddArr = [];
        flowObj.flowCheckArr = [];
        currFlowObj = [];

        if (objTopo.vars.isChgGrp) oldFlowObj = [];
        if (list == null || list.length == 0) {
            // 객체가 없을경우 초기화를 위함
            objTopo.vars.isChgFlow = true;
            return list;
        }
        flows = [];
        flowCheckArr = [];
        for (i = 0; i < list.length; i++) {
            d = list[i];
            // console.log("xxxxxx i =====================> " + d.linkNo + " ### " + d.lineFlowEffect)

            if (d.lineFlowEffect && d.lineFlowEffect != 'None') {

                if (flows.findIndex(i => i.linkNo == d.linkNo) < 0) {

                    // 아이템으로 그려졌지만 장비 원장에서 삭제된 경우를 찾아 삭제목록 생성(노드가 존재하지 않는 링크정보)
                    if ($('#g' + d.itemNo1).length == 0 || $('#g' + d.itemNo2).length == 0) {
                        continue;
                    }

                    //objExtend = $.extend({source: "g" + d.itemNo1, target: "g" + d.itemNo2, itemType: 'link'}, d);

                    scale = TopoUtil.getItemScale(d.source.itemSize);
                    cx = d.source.x + ((55 - (55 * scale)) / 2) + (55 * scale / 2);
                    cy = d.source.y + (55 * scale / 2);

                    count = d.lineFlowEffectCount;
                    flowFileName = d.lineFlowEffect == 'Forward' ? 'FlowR.svg' : 'FlowL.svg';

                    for (j = 0; j < count; j++) {

                        // console.log("id =====================> " + "id: g" + d.linkNo +"_"+ j)

                        tmpObj = {
                            id: "g" + d.linkNo + "_" + j,
                            linkNo: d.linkNo,
                            // width: 50 * scale,
                            // height: 50 * scale,
                            width: 40,
                            height: 40,
                            flowFileName: flowFileName,
                            scx: d.source.cx,
                            scy: d.source.cy,
                            lineFlowEffect: d.lineFlowEffect,
                            lineFlowEffectColor: d.lineFlowEffectColor,
                            lineFlowEffectSpeed : d.lineFlowEffectSpeed
                            // flowClass : 'filter-red'
                        };

                        currFlowObj.push(_.cloneDeep(tmpObj));
                        flowObj.flowCheckArr.push("g" + d.linkNo + "_" + j);
                        flows.push($.extend(tmpObj, d));
                    }
                }
            }
        }

        if (JSON.stringify(currFlowObj) === JSON.stringify(oldFlowObj) &&
            objTopo.vars.svg.selectAll(objTopo.vars.flowIconStr).nodes().length > 0) {
            objTopo.vars.isChgFlow = false;
        } else {
            objTopo.vars.isChgFlow = true;
            flowArray = [];
        }
       // TopoFlow.flowDrawReSetting(objTopo);
        oldFlowObj = _.cloneDeep(currFlowObj);
        return flows;
    },

    // flowDrawReSetting: function (objTopo) {
    //
    //     // 기존 생성된 flow와 가져온 flow 데이터 차집합
    //     flowObj.flowDiffArr = flowArray.filter(x => !flowObj.flowCheckArr.includes(x));
    //
    //     //신규 추가된 flow 구함 (기존 linkNo의 Flow 개수가 다를 경우 재 설정
    //     flowObj.flowAddArr = flowObj.flowCheckArr.filter(x => !flowArray.includes(x));
    //     //신규 추가되는 LinkNo의 기존 flow remove 처리 (동일 Link의 추가되는 Flow와 같이 흐르게 하기 위함)
    //
    //     $.each(flowObj.flowAddArr, function (idx, item) {
    //         flowObj.rmTargetlinks.push(item.split('_')[0]);
    //     });
    //     // flow linkNo 중복 제거
    //     flowObj.linkArr = flowObj.rmTargetlinks.filter((v, i) => flowObj.rmTargetlinks.indexOf(v) === i);
    //
    //     // 추가해야할 flow 의 LinkNo에 해당하는 flow element 모두 제거 (재 적용 필요함)
    //     $.each(flowObj.linkArr, function (idx, linkNo) {
    //         objTopo.vars.svg.selectAll(flowIconStr).filter(function (d, i) {
    //             return ('g'+ d.linkNo) == linkNo;
    //         }).remove();
    //
    //         // 추가되는 flow가 해당 link에 기존 flow 존재시 다시 적용해야 하므로 기준 배열에서 flowId 정보 삭제
    //         flowArray = flowArray.filter((v) =>  v.split('_')[0] == linkNo);
    //     });
    //
    //     // 없어진 flowId 삭제(완전없어진 flow )
    //     $.each(flowObj.flowDiffArr, function (idx, linkNo) {
    //         objTopo.vars.svg.selectAll(flowIconStr).filter(function (d, i) {
    //             return ('g'+ d.linkNo) == linkNo;
    //         }).remove();
    //     });
    //     flowArray = flowArray.filter(x => !flowObj.flowDiffArr.includes(x));
    // },

    /** 데이터 갱신 */
    callRefresh: function (objTopo) {
        oldFlowObj = [];
        if (objTopo.vars.svgGroup.selectAll(objTopo.vars.flowIconStr).data().length === 0) {
            if (typeof flowInterval !== "undefined" && flowInterval) {
                clearInterval(flowInterval);
                flowInterval = null;
            }
        }
        // objTopo.vars.flows = TopoFlow.setFlowData(objTopo.vars.links, objTopo.vars.flows);
        // objTopo.vars.simulation.tick(objTopo.vars.flows);
        // TopoFlow.refresh(objTopo, objTopo.vars.svg, objTopo.vars.flows);
    },

    refresh: function (objTopo, svg, flows) {

        console.log(svg);

        console.log("Flow ==============> Time : " + new Date());

        // if ( Object.entries(flows).toString() === Object.entries(oldFlowObj).toString() ) return;

        if ( !objTopo.vars.isChgFlow ) return;


        if (typeof flowInterval !== "undefined" && flowInterval) {
            clearInterval(flowInterval);
            flowInterval = null;
        }

        objTopo.vars.flowIconType = 'ellipse'; // trickle (물방울)  :  ellipse(원)

        if (objTopo.vars.flowIconType === 'trickle') {
            objTopo.vars.flowIconStr = ".trickle_flow";

            flowfilterColor = [];

            $.each(flows, function (idx, d) {
                flowfilterColor.push({
                    id: d.lineFlowEffectColor || TopoConst.envSetting.lineFlowEffectColor,
                    value: flowfilterColor.value = TopoStyleFilter.getFilter(d.lineFlowEffectColor || TopoConst.envSetting.lineFlowEffectColor ) + " opacity(85%) blur(1px)"
                });
            });

            flowfilterColor = flowfilterColor.filter((arr, idx, self) => idx === self.findIndex(t => t.id === arr.id));

            $.each(flows, function (idx, d) {
                findId = d.lineFlowEffectColor || TopoConst.envSetting.lineFlowEffectColor;
                d.lineFlowEffectColor = flowfilterColor.find(x => x.id === findId).value;
                //d.lineFlowEffectColor = TopoStyleFilter.getFilter(d.lineFlowEffectColor || TopoConst.envSetting.lineFlowEffectColor ) + " opacity(85%) blur(1px)";
            });
        } else {
            objTopo.vars.flowIconStr = ".ellipse_flow";
        }
        // flow = flow.enter()
        //     .insert("circle", "g.node")
        //     //.append("circle")
        //     .merge(flow)
        //     .attr("class", "flow")
        //     .attr("id", function (d) { return d.id; })
        //     .attr("cx", function (d) { return d.cx; })
        //     .attr("cy", function (d) { return d.cy; })
        //     .attr("r", function (d) { return d.lineSize + 2; })
        //     .attr("fill", "blue")
        //     .style("display", "block")
        //     .style('opacity', 1);

        // svg.select(".svgGroup").selectAll("image.flow").remove();
        // removeFlow.remove();
        // debugger
        debugger
        flow = svg.select("g.grp_object").selectAll(objTopo.vars.flowIconStr).data(flows);
        // flow = svg.select(".svgGroup").selectAll(objTopo.vars.flowIconStr).data(flows);
        if (flow) {
            flow.exit().remove();

            if (objTopo.vars.flowIconType === 'trickle') {

                flow = flow.enter()
                    .insert("svg:image", "g.node")
                    // .merge(flow)
                    .classed("trickle_flow", true)
                    .attr("id", function (d) {
                        return d.id;
                    })
                    // .attr("x", function (d) {
                    //     return d.cx;
                    // })
                    // .attr("y", function (d) {
                    //     return d.cy;
                    // })
                    .attr('xlink:href', function (d) {
                        return '/img/d3/icon/' + d.flowFileName;
                    })
                    .attr('width', function (d) {
                        return d.width;
                    })
                    .attr('height', function (d) {
                        return d.height;
                    })
                    .style("display", "none")
                    .style("filter", function (d) {
                        // debugger

                        return d.lineFlowEffectColor;
                    });
                // .classed('filter-red', true);
            } else {

                flow = flow.enter()
                    .insert("circle", "g.node")
                    // .merge(flow)
                    .classed("ellipse_flow", true)
                    .attr("id", function (d) {
                        return d.id;
                    })
                    .attr("cx", function (d) {
                        return 20;
                    })
                    .attr("cy", function (d) {
                        return 20;
                    })
                    .attr("r", 5)
                    .style("display", "none")
                    .style("fill", function (d) {
                        return d.lineFlowEffectColor;
                    });

            }
        }
        // mapMode에 따른 flow visible/hidden
        if (objTopo.vars.mapMode == TopoConst.mapMode.SEARCH) TopoFlow.flowingLoop(objTopo);

        return flow;
    },

    flowingLoop: function(objTopo, flowLinks){

        // console.log(" flowInterval ================ ==> " + flowInterval);

        flowLinks = objTopo.vars.svg.selectAll("path.link.flowactive").data();

        flowIdx = 0;
        flowInterval = setInterval(function flowLoop() {

            imageCounter = 0;

            if (flowIdx >= 0) {
                linkItem = null;
                thisImageNode = null;
                $.each(flowLinks, function (idx, link) {

                    linkItem = objTopo.vars.svg.selectAll("path.link").filter(function (d, i) {
                        return d.linkNo == link.linkNo;
                    });

                    // console.log(" before flowIdx ================ ==> " + flowIdx);
                    // linkNo 번호의 flowIdx 번호(0 ~ n 번까지)의 imageFlow 노드 Get
                    flowId = "g" + link.linkNo + "_" + flowIdx;
                    thisImageNode = objTopo.vars.svg.selectAll(objTopo.vars.flowIconStr).filter(function (d, i) {
                        return d.id == flowId;
                    });


                    /* path link에 flow 중인 image 체크 (없는 경우에만 flow 됨) */
                    if ( thisImageNode.data().length > 0 && flowArray.findIndex(d => d == flowId) < 0 ) {

                        flowArray.push(flowId);

                        // 포인트 없는 직선
                        if (linkItem.nodes().length == 1) {

                            if (thisImageNode.data() && thisImageNode.data().length > 0) {
                                flowingEffect = new FlowingEffect(objTopo);
                                // console.log("flowingEffect ================ ==> " +objLinkData.linkNo + "###" + flowIdx);
                                imageCounter++;
                                flowingEffect.imageTransitionSingleLink(linkItem.node(), thisImageNode);
                            }

                        } else {
                            // 포인트 존재하는 직선 (추후 개발 진행)
                            if (thisImageNode.data() && thisImageNode.data().length > 0) {
                                multiFlowingEffect = new FlowingEffect(objTopo);
                                // console.log("flowingEffect ================ ==> " +objLinkData.linkNo + "###" + flowIdx);
                                imageCounter++;
                                if (link.lineFlowEffect == 'Forward') {
                                    multiFlowingEffect.imageTransitionMultiLink(0, linkItem.nodes(), thisImageNode);
                                } else {
                                    multiFlowingEffect.imageTransitionMultiLink(linkItem.nodes().length - 1, linkItem.nodes(), thisImageNode);
                                }
                            }
                        }

                    }


                });

                if (imageCounter > 0) flowIdx++;
                else flowIdx = -1;
                // console.log("flowIdx ================ ==> " + (flowIdx));
            } else {
                clearInterval(flowInterval);
                // clearTimeout(flowTimeout);
            }

            // setTimeout(flowLoop, 500);

        }, 500);

    },

    // setObjectValue: function (obj, value) {
    //   obj.
    //
    // },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    }

};

