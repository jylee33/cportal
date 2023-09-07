var ComTopologyController = function(objId) {
    this.objId = objId || 'd3topo';
};

ComTopologyController.prototype = function() {

    function createHtml() {
        var _obj = $('#' + this.objId),
            _id = this.objId,
            _this = this;
        $.post('/main/widget/controls/comTopology.do', function(html) {
            _obj.html(html.replace(/\#id/ig, _id));
        });
    }

    function init() {

    }

    function start(grpNo) {
        console.log("D3Topology ====== > " + JSON.stringify(D3Topology));
        D3Topology.initialize.call(D3Topology, this.objId);
        if(grpNo === undefined) {
            D3Topology.getTopGrp();
        }
        else {
            D3Topology.vars.topGrpNo = D3Topology.vars.curGrpNo = grpNo;
            D3Topology.chgGrp.call(D3Topology);
        }
        D3Topology.resizeSvg.call(D3Topology);
        D3Topology.startTimer();
    }

    function getTopology() {
        return D3Topology;
    }

    function resize() {

    }

    function setData(data) {

    }

    return {
        createHtml: createHtml,
        start: start,
        getTopology: getTopology,
        resize: resize,
        setData: setData
    };
}();