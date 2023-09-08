"use strict";

var linkLabels = null,
    labelText = null,
    labelConf = null,
    labelOffset = null;
var toolTipLink = null;
var linkId = null, linkItem = null;
var l = null, p = null;
var _selectdTexts = null, _dragText = null, thisGapPos = [], thisPos = [];
var i = 0, x = 0, y = 0, transString = null;
var textg = null;
var t1SourceP = null, t2SourceP = null, t1TargetP = null, t2TargetP;
var linkNo = null, obj = null, lineLabelConf = null, item = null;
var saveData = [], linkLabelList = [], linkLabelGs = null;
var labelX = 0, labelY = 0, angle = 0;
var chgLabelConf = null;

var TopoLinkLabel = {

    callRefresh: function (objTopo) {
        var linkLabelCall = objTopo.createLinkLabelDrags(objTopo);
        this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.links, linkLabelCall);
    },

    refresh: function (objTopo, svg, links, linkLabelCall) {

        // objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("g").remove();

        objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").remove();
        svg.select("g.grp_object").append('g').classed("linkLabel", true);

        linkLabels = svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("text").data(links);
        // linkLabels.enter().append('g').classed("linkLabel", true);
        linkLabels.exit().remove();

        /** Source 부분 link 명칭 textPath **/
        // debugger
        linkLabels = linkLabels.enter()
            .insert('g')
            .merge(linkLabels)
            .classed("labelg", true);

        linkLabels
            .insert("text")
            .attr("id", function (d) { return "linkText1_source_" + d.linkNo; })
            .classed("linkText1_source", true)
            .attr("data-trans", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return TopoUtil.getValidateCheck(labelConf) && labelConf.hasOwnProperty('t1SourceP')  ? labelConf.t1SourceP : [0,0];
            })
            .attr("dy", function (d) {
                return (d.lineSize + 4) * -1 ;
            })
            .attr('transform', function (d) {
                linkId = null;
                linkId = d.source.devKind1 != "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo :
                    d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo1 :
                        d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo2 :
                            "#link_" + d.linkNo;
                linkItem = null;
                $.each(objTopo.vars.svg.selectAll("path.link").nodes(), function (i,path) {
                    if ('#' + path.id === linkId) {
                        linkItem = path;
                        return false;
                    }
                });
                labelOffset = "0.6";
                if (d.target.devKind1 != "POINT") labelOffset = "0.3";

                return TopoLinkLabel.getTranslateValue(this, linkItem, labelOffset);
            })
            .text(function(d) {
                labelText = '';
                if (d.source.devKind1 != "POINT" ) {
                    labelText = d.lineWidth1 ? '[' + "{0}".substitute(HmUtil.convertUnit1000(d.lineWidth1)) + ']' : '';
                    labelText += d.linkName1 ? ' ' + d.linkName1 : '';
                }
                return labelText;
            })
            .style("visibility", function (d) {
                labelConf = JSON.parse(d.lineLabelConf) ? JSON.parse(d.lineLabelConf) : {lineLabel : '0'} ;
                return labelConf.lineLabel == '1' ? "visible" : "hidden"
            })
            .attr("fill", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelColor : TopoConst.envSetting.lineLabelColor;
            })
            .style("font-size", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelFontSize + "px" : TopoConst.envSetting.lineLabelFontSize + "px";
            })
            .attr("text-anchor", "middle")
            .call(linkLabelCall);
            // .call(d3.drag()
            //     .on("start", function(d) {
            //         // if (TopoLinkLabel.isManageMode(objTopo))
            //             TopoLinkLabel.linkTextDragStart(this, d, i, objTopo);
            //     })
            //     .on("drag", function (d, i) {
            //         // if (TopoLinkLabel.isManageMode(objTopo))
            //             TopoLinkLabel.linkTextDragMove(this, d, i, objTopo);
            //     })
            // );

        /** Source 부분 link 성능 textPath **/
        // labelSourcePerf = linkLabels.append('g').merge(linkLabels);

        linkLabels
            .insert("text")
            .attr("id", function (d) { return "linkText2_source_" + d.linkNo; })
            .classed("linkText2_source", true)
            .attr("data-trans", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return TopoUtil.getValidateCheck(labelConf) && labelConf.hasOwnProperty('t2SourceP')  ? labelConf.t2SourceP : [0,0];
            })
            .attr("dy", function (d) { return (d.lineSize + 10) ;})
            .attr('transform', function (d) {
                linkId = null;
                linkId = d.source.devKind1 != "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo :
                    d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo1 :
                        d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo2 :
                            "#link_" + d.linkNo;
                linkItem = null;
                $.each(objTopo.vars.svg.selectAll("path.link").nodes(), function (i,path) {
                    if ('#' + path.id === linkId) {
                        linkItem = path;
                        return false;
                    }
                });
                labelOffset = "0.6";
                if (d.target.devKind1 != "POINT") labelOffset = "0.3";

                return TopoLinkLabel.getTranslateValue(this, linkItem, labelOffset);
            })
            .text(function(d) {
                labelText = '';
                if (d.source.devKind1 != "POINT" && (d.traffic1In || d.traffic1Out)) {
                    /* POINT 2개 이며 Source 부분이 장비(그룹) -- Target POINT 인경우 */
                    labelText = d.traffic1In ? HmUtil.convertUnit1000(d.traffic1In) : ' - ';
                    labelText += ' / ';
                    labelText += d.traffic1Out ? HmUtil.convertUnit1000(d.traffic1Out) : ' - ';
                }
                return labelText;
            })
            .style("visibility", function (d) {
                labelConf = JSON.parse(d.lineLabelConf) ? JSON.parse(d.lineLabelConf) : {linePerf : '0'} ;
                return labelConf.linePerf == '1' ? "visible" : "hidden"
            })
            .attr("fill", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelColor : TopoConst.envSetting.lineLabelColor;
            })
            .style("font-size", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelFontSize + "px" : TopoConst.envSetting.lineLabelFontSize + "px";
            })
            .attr("text-anchor", "middle")
            .call(linkLabelCall);
            // .call(d3.drag()
            //     .on("start", function(d) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragStart(this, d, i, objTopo);
            //     })
            //     .on("drag", function (d, i) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragMove(this, d, i, objTopo);
            //     })
            // );

        /** Target 부분 link 명칭 textPath **/
        // labelTargetText = linkLabels.append('g').merge(linkLabels);
        linkLabels
            .insert("text")
            .attr("id", function (d) { return "linkText1_target_" + d.linkNo; })
            .classed("linkText1_target", true)
            .attr("data-trans", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return TopoUtil.getValidateCheck(labelConf) && labelConf.hasOwnProperty('t1TargetP')  ? labelConf.t1TargetP : [0,0];
            })
            .attr("dy", function (d) {
                return (d.lineSize + 4) * -1 ;
            })
            .attr('transform', function (d) {
                linkId = null;
                linkId = d.source.devKind1 != "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo :
                    d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo1 :
                        d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo2 :
                            "#link_" + d.linkNo;
                linkItem = null;
                $.each(objTopo.vars.svg.selectAll("path.link").nodes(), function (i,path) {
                    if ('#' + path.id === linkId) {
                        linkItem = path;
                        return false;
                    }
                });
                labelOffset = "0.4";
                if (d.source.devKind1 != "POINT") labelOffset = "0.7";

                return TopoLinkLabel.getTranslateValue(this, linkItem, labelOffset);
            })
            .text(function(d) {
                labelText = '';
                if (d.target.devKind1 != "POINT") {
                    labelText = d.lineWidth2 ? '[' + "{0}".substitute(HmUtil.convertUnit1000(d.lineWidth2)) + ']' : '';
                    labelText += d.linkName2 ? ' ' + d.linkName2 : '';
                }
                return labelText;
            })
            .style("visibility", function (d) {
                labelConf = JSON.parse(d.lineLabelConf) ? JSON.parse(d.lineLabelConf) : {lineLabel : '0'} ;
                return labelConf.lineLabel == '1' ? "visible" : "hidden"
            })
            .attr("fill", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelColor : TopoConst.envSetting.lineLabelColor;
            })
            .style("font-size", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelFontSize + "px" : TopoConst.envSetting.lineLabelFontSize + "px";
            })
            .attr("text-anchor", "middle")
            .call(linkLabelCall);
            // .call(d3.drag()
            //     .on("start", function(d) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragStart(this, d, i, objTopo);
            //     })
            //     .on("drag", function (d, i) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragMove(this, d, i, objTopo);
            //     })
            // );

        /** Target 부분 link 성능 textPath **/
        // labelTargetPerf = linkLabels.append('g').merge(linkLabels);
        linkLabels
            .insert("text")
            .attr("id", function (d) { return "linkText2_target_" + d.linkNo; })
            .classed("linkText2_target", true)
            .attr("data-trans", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return TopoUtil.getValidateCheck(labelConf) && labelConf.hasOwnProperty('t2TargetP') ? labelConf.t2TargetP : [0,0];
            })
            .attr("dy", function (d) { return (d.lineSize + 10) ;})
            .attr('transform', function (d) {
                linkId = null;
                linkId = d.source.devKind1 != "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo :
                    d.source.devKind1 != "POINT" && d.target.devKind1 == "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo1 :
                        d.source.devKind1 == "POINT" && d.target.devKind1 != "POINT" ? "#link_" + d.linkNo + "_" + d.itemNo2 :
                            "#link_" + d.linkNo;
                linkItem = null;
                $.each(objTopo.vars.svg.selectAll("path.link").nodes(), function (i,path) {
                    if ('#' + path.id === linkId) {
                        linkItem = path;
                        return false;
                    }
                });

                labelOffset = "0.4";
                if (d.target.devKind1 != "POINT") labelOffset = "0.7";

                return TopoLinkLabel.getTranslateValue(this, linkItem, labelOffset);
            })
            .text(function(d) {
                labelText = '';
                if (d.target.devKind1 != "POINT" && (d.traffic2In || d.traffic2Out)) {
                    /* POINT 2개 이며 Source 부분이 장비(그룹) -- Target POINT 인경우 */
                    labelText = d.traffic2In ? HmUtil.convertUnit1000(d.traffic2In) : ' - ';
                    labelText += ' / ';
                    labelText += d.traffic2Out ? HmUtil.convertUnit1000(d.traffic2Out) : ' - ';
                }
                return labelText;
            })
            .style("visibility", function (d) {
                labelConf = JSON.parse(d.lineLabelConf) ? JSON.parse(d.lineLabelConf) : {linePerf : '0'} ;
                return labelConf.linePerf == '1' ? "visible" : "hidden"
            })
            .attr("fill", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelColor : TopoConst.envSetting.lineLabelColor;
            })
            .style("font-size", function (d) {
                labelConf = JSON.parse(d.lineLabelConf);
                return labelConf ? labelConf.lineLabelFontSize + "px" : TopoConst.envSetting.lineLabelFontSize + "px";
            })
            .attr("text-anchor", "middle")
            .call(linkLabelCall);
            // .call(d3.drag()
            //     .on("start", function(d) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragStart(this, d, i, objTopo);
            //     })
            //     .on("drag", function (d, i) {
            //         if (TopoLinkLabel.isManageMode(objTopo)) TopoLinkLabel.linkTextDragMove(this, d, i, objTopo);
            //     })
            // );

        TopoLinkLabel.addEvent(linkLabels, objTopo);

        return linkLabels;
    },

    getTranslateValue: function (thisT, path, offset) {
        l = path.getTotalLength();
        p = path.getPointAtLength(parseFloat(offset) * l); //current point
        // xoffset = imageNode.data()[0].width / 2;
        // yoffset = imageNode.data()[0].height / 2;

        thisGapPos = d3.select(thisT).attr("data-trans").split(',');

        labelX = (p.x - 0) + parseFloat(thisGapPos[0]);
        labelY = (p.y - 0) + parseFloat(thisGapPos[1]);
        angle = 0;

        // var thisGapPos = d3.select(thisT).attr("transform").substring(string.indexOf("(")+1, string.indexOf(")")).split(",");
        // d3.select(thisT).attr("data-trans", thisGapPos);
        
        return "translate(" + labelX + "," + labelY + ")rotate(" + angle + ")";

    },

    /** 이벤트 등록 */
    addEvent: function (linkLabel, objTopo) {
        linkLabel
            .on("mouseenter", function (d) {
                toolTipLink = objTopo.vars.svg.select(".svgGroup").selectAll("path.link").filter(function (l) {
                    return d.linkNo == l.linkNo;
                });
                toolTipLink.style("stroke-width", 5);
                // d3.select(this).style("font-weight", 'bold');
                TopoLink.showTooltip(toolTipLink.data()[0], objTopo);
            })
            .on("mouseleave", function (d) {
                toolTipLink = objTopo.vars.svg.select(".svgGroup").selectAll("path.link").filter(function (l) {
                    return d.linkNo == l.linkNo;
                });
                toolTipLink.style("stroke-width", d.lineSize);
                // d3.select(this).style("font-weight", 'normal');
                TopoLink.hideTooltip();
            });

    },

    linkTextDragStart: function (dragT, pos, objTopo) {
        if (!d3.event.sourceEvent.ctrlKey) {
            if (objTopo.vars.selectLinkLabel.length < 2) {
                objTopo.selectObjectSet('linkLabel');
                objTopo.vars.selectLinkLabel.push(dragT);
            }
        }
        else {
            if (!objTopo.vars.selectLinkLabel.find(v => v === dragT))
                objTopo.vars.selectLinkLabel.push(dragT)
        }

        d3.select(dragT).classed("linkTextSelected", true);
    },

    linkTextDragMove: function (dragT, pos, objTopo) {
        // _selectdTexts =  d3.select(dragT);
        _selectdTexts = objTopo.vars.svgGroup.selectAll("text.linkTextSelected");
        thisPos = [];
        for (i = 0; i < _selectdTexts.nodes().length; i++) {
            thisGapPos = _selectdTexts.nodes()[i].getAttribute("data-trans").split(",");
            thisGapPos[0] = parseFloat(thisGapPos[0]) + d3.event.dx;
            thisGapPos[1] = parseFloat(thisGapPos[1]) + d3.event.dy;
            transString = _selectdTexts.nodes()[i].getAttribute("transform");
            thisPos = transString.substring(transString.indexOf("(")+1, transString.indexOf(")")).split(",");
            // console.log("transString === > ", transString);
            // console.table(thisPos);
            thisPos[0] = parseFloat(thisPos[0]) + d3.event.dx;
            thisPos[1] = parseFloat(thisPos[1]) + d3.event.dy;
            d3.select(_selectdTexts.nodes()[i]).attr("transform", "translate(" +thisPos[0] + "," + thisPos[1] + ")rotate(" + 0 + ")");
            d3.select(_selectdTexts.nodes()[i]).attr("data-trans", thisGapPos);
        }
    },

    isManageMode: function(objTopo) {
        return objTopo.vars.mapMode == TopoConst.mapMode.MANAGE;
    },

    getMapPos: function(objTopo) {
        saveData = [];
        linkLabelGs = objTopo.vars.svg.select("g.grp_object").selectAll("g.linkLabel").selectAll("g").nodes();

        linkLabelGs.forEach(d => {

            linkNo = d3.select(d).data()[0].linkNo;
            lineLabelConf = JSON.parse(d3.select(d).data()[0].lineLabelConf);

            d.childNodes.forEach(n => {
                if (n.getAttribute("id") === ('linkText1_source_' + linkNo)) t1SourceP = n.getAttribute("data-trans");
                if (n.getAttribute("id") === ('linkText2_source_' + linkNo)) t2SourceP = n.getAttribute("data-trans");
                if (n.getAttribute("id") === ('linkText1_target_' + linkNo)) t1TargetP = n.getAttribute("data-trans");
                if (n.getAttribute("id") === ('linkText2_target_' + linkNo)) t2TargetP = n.getAttribute("data-trans");
            });

            item = {
                t1SourceP : t1SourceP,
                t2SourceP : t2SourceP,
                t1TargetP : t1TargetP,
                t2TargetP : t2TargetP
            };

            chgLabelConf = JSON.stringify($.extend(lineLabelConf, item));
            d3.select(d).data()[0].lineLabelConf = chgLabelConf;
            obj = {
                linkNo: linkNo,
                lineLabelConf: chgLabelConf
            };
            saveData.push(obj);
        });

        // console.log("saveData", saveData);
        return saveData;
    },

    linkLabelPositionSave: function (objTopo) {
        // linkLabelList = TopoLinkLabel.getMapPos(objTopo);
        /* 회선 명칭, 성능 명칭 저장 */
        topo_menu_action.save_map(null, "checkMap", null, objTopo);
        // Server.post('/d3map/popup/setting/modeSetting/saveMapPosition.do', {
        //     data: {linkLabelList: linkLabelList},
        //     success: function (result) {
        //         alert("저장되었습니다.");
        //     }
        // });
        return;
    }

};


