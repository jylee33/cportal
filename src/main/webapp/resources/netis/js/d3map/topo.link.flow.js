 "use strict";
var FlowingEffect = function(objTopo) {

    var curThis = this;
    var speedData = [10000, 8000, 6000, 4000, 2000];
    var nextSeq = 0;
    var p0 = null, p =  null;
    var xoffset =  null, yoffset =  null, centerX =  null, centerY =  null, angle = null;
    var l = null;
    var t0 = 0;
    var flowSpeed = 5000;

    // 1개 Path flow 처리
    this.imageTransitionSingleLink = function (path, imageNode) {
            imageNode
                .style("display", objTopo.vars.mapMode == TopoConst.mapMode.SEARCH ? "block" : "none")
                .attr("transform", "translate(" + path.getPointAtLength(0).x + "," + path.getPointAtLength(0).y + ")" );
            flowSpeed = speedData[imageNode.data()[0].lineFlowEffectSpeed - 1];
            if (imageNode.data()[0].lineFlowEffect == 'Forward') {
                imageNode.transition()
                    .duration(flowSpeed)
                    .ease(d3.easeLinear)
                    .attrTween("transform", curThis.translateAlongForward(path, imageNode))
                    .on("end", function (d) {
                        // imageNode.interrupt();
                        return curThis.imageTransitionSingleLink(path, imageNode);
                    }); //infinite loop
            } else {
                imageNode.transition()
                    .duration(flowSpeed)
                    .ease(d3.easeLinear)
                    .attrTween("transform", curThis.translateAlongBackward(path, imageNode))
                    .on("end", function () {
                        // imageNode.interrupt();
                        return curThis.imageTransitionSingleLink(path, imageNode)
                    }); //infinite loop
            }



    };

    // 2개 Path flow 처리 (point 존재시)
    this.imageTransitionMultiLink = function (seqNo, paths, imageNode) {
        imageNode
            .style("display", objTopo.vars.mapMode == TopoConst.mapMode.SEARCH ? "block" : "none");
        flowSpeed = speedData[imageNode.data()[0].lineFlowEffectSpeed - 1];
        if (imageNode.data()[0].lineFlowEffect == 'Forward') {

            imageNode.attr("transform", "translate(" + paths[seqNo].getPointAtLength(0).x + "," + paths[seqNo].getPointAtLength(0).y + ")" );

            imageNode.transition()
                .duration(flowSpeed)
                .ease(d3.easeLinear)
                .attrTween("transform", curThis.translateAlongForward(paths[seqNo], imageNode))
                .on("end", function (d) {
                    nextSeq = seqNo == (paths.length - 1) ? 0 : seqNo + 1;
                    return curThis.imageTransitionMultiLink(nextSeq, paths, imageNode);
                }); //infinite loop
        } else {

            imageNode.attr("transform", "translate(" + paths[seqNo].getPointAtLength(0).x + "," + paths[seqNo].getPointAtLength(0).y + ")" );

            imageNode.transition()
                .duration(flowSpeed)
                .ease(d3.easeLinear)
                .attrTween("transform", curThis.translateAlongBackward(paths[seqNo], imageNode))
                .on("end", function () {
                    nextSeq = seqNo == 0 ? paths.length - 1 : seqNo - 1;
                    return curThis.imageTransitionMultiLink(nextSeq, paths, imageNode);
                }); //infinite loop
        }
    };

    this.translateAlongForward = function (path, imageNode) {
        l = path.getTotalLength();
        t0 = 0;
        return function(d, i, a) {
            return function(t) {
                p0 = path.getPointAtLength(t0 * l); //previous point
                p = path.getPointAtLength(t * l); //current point
                xoffset = imageNode.data()[0].width / 2;
                yoffset = imageNode.data()[0].height / 2;
                centerX = p.x - xoffset;
                centerY = p.y - yoffset;
                angle = Math.atan2(p.y - p0.y, p.x - p0.x) * 180 / Math.PI;//angle for tangent
                t0 = t;
                return "translate(" + centerX + "," + centerY + ")rotate(" + angle + " " + xoffset + " " + yoffset + ")";
            };
        };
    };

    this.translateAlongBackward = function (path, imageNode) {
        l = path.getTotalLength();
        t0 = l;
        return function(d, i, a) {
            return function(t) {
                p0 = path.getPointAtLength((1 - t0) * l); //previous point
                p = path.getPointAtLength((1 - t) * l); //current point
                xoffset = imageNode.data()[0].width / 2;
                yoffset = imageNode.data()[0].height / 2;
                centerX = p.x - xoffset;
                centerY = p.y - yoffset;
                angle = Math.atan2(p.y - p0.y, p.x - p0.x) * 180 / Math.PI + 180 ;//angle for tangent
                t0 = t;
                return "translate(" + centerX + "," + centerY + ")rotate(" + angle + " " + xoffset + " " + yoffset + ")";
            };
        };
    };
};



