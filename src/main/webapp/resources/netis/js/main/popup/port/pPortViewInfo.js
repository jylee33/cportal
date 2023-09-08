
var PortView = {
    aniInterval: null,
    portSVG: null,
    timer: null,

    initDesign: function () {
        $.post(ctxPath + '/img/v5.0.1/pPortView_svgItem.jsp', function(result) {
            PortView.portSVG = result;
            PortView.initData();
        });

    },

    initData: function () {

        Server.post('/main/popup/ifDetail/getSummary_evtStatus.do', {
            data: {mngNo: dtl_mngNo, ifIdx: dtl_ifIdx},
            success: function (result) {
                var _status = result && result.status !== null ? result.status : 'dead';
                var list = [{ status: _status }];

                var svg = d3.select('svg#pPortView_svg_v2');
                var node = svg.selectAll('g.node').data(result);
                if (result) node.exit().remove();

                node = svg.selectAll('g.node').data(list);
                node = node.enter()
                    .appendSVG(PortView.portSVG)
                    .attr('data-ifStatus', function(d) { return d.status; })


                svg.selectAll('g.node')
                    .each(function(nodeData, idx) {
                        d3.select(this).select('title').text('포트뷰');

                        d3.select(this)
                            .attr('data-ifStatus', function(d) {return d.status; })
                            .select('text[data-key="ifIdx"]')
                            .text(function(d) { return ''; });

                        d3.select(this)
                            .select('g.Bg')
                            .attr('class', function(d) {
                                return 'Bg st_{0}'.substitute(d.status.toLowerCase());
                            });
                        d3.select(this)
                            .select('circle[data-key="circle_top_left"]')
                            .style('display', function(d) {
                                return d.status == 'Alive'? 'block' : 'none';
                            });

                        d3.select(this)
                            .select('circle[data-key="circle_top_right"]')
                            .style('display', function(d) {
                                return d.status == 'Alive'? 'block' : 'none';
                            });
                    });

                // 애니메이션
                var nodes = d3.selectAll('g.node[data-ifStatus="Alive"]');
                nodes.select("circle[data-key='circle_top_right']").on("start", null);
                nodes
                    .select("circle[data-key='circle_top_right']")
                    .transition().duration(300).style("display", "block")
                    .transition().duration(300).style("display", "none")
                    .on("start", function repeat() {
                        d3.active(this)
                            .transition().duration(300).style("display", "block")
                            .transition().duration(300).style("display", "none")
                            .on("start", repeat);
                    });
            }
        });

    }
}

$(function () {
    PortView.initDesign();
    // PortView.initData();
})