/**
 * 회선 BPS 사용량 차트
 * @param chartId
 * @constructor
 */
var IfBpsChart2 = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

IfBpsChart2.prototype = Object.create(HmBaseChart.prototype); // prototype extend
IfBpsChart2.prototype.constructor = IfBpsChart2; // constructor link modify
IfBpsChart2.prototype.initialize = function() { //parent.method override
    this.chart =
        HmHighchart.createStockChart(this.chartId, {
            yAxis: {
                opposite: false,
                crosshair: true,
                showLastLabel: true,
                labels: {
                    formatter: HmHighchart.absUnit1000Formatter
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: HmHighchart.absUnit1000HtmlTooltipFormatter
            },
            series: [
                {name: 'IN 평균', type: 'area'},
                {name: 'OUT 평균', type: 'area',
                    data: {
                        events: {
                            update: function() {
                                return this.value * -1;
                            }
                        }
                    }
                },
                {name: 'IN 최대', type: 'line'},
                {name: 'OUT 최대', type: 'line'},
                {name: 'IN 최소', type: 'line'},
                {name: 'OUT 최소', type: 'line'}
                // {name: 'IN 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'diamond'}},
                // {name: 'OUT 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'triangle'}}
            ]
        }, HmHighchart.TYPE_AREA);
};

IfBpsChart2.prototype.redrawAxisPlotLines = function(inValue, outValue) {
    HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
    HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line-in',  inValue, 'In({0})'.substitute(HmUtil.convertUnit1000(inValue)));
    HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line-out',  -(outValue), 'Out({0})'.substitute(HmUtil.convertUnit1000(outValue)));
};

IfBpsChart2.prototype.searchData = function(params) {
    var _this = this;
    // TODO tableCnt == 1일때 E/S 사용여부에 따른 로직 추가
    Server.post('/main/popup/rawPerfChart/getPerfChartForIf.do', {
        data: params,
        success: function(result) {
            _this.searchDataResult.call(_this, params, result);
        }
    });
};

IfBpsChart2.prototype.searchDataResult = function(params, result) {
    var chartDataArr = null;
    if(params.tableCnt == 1) {
        this.chart.series[2].hide();
        this.chart.series[3].hide();
        chartDataArr = HmHighchart.convertJsonArrToChartDataArrByBaseVal('DT_YMDHMS',
            [
                {field: 'AVG_IN', baseVal: 1},
                {field: 'AVG_OUT', baseVal: 1}
            ], result);
    }
    else {
        this.chart.series[2].show();
        this.chart.series[3].show();
        chartDataArr = HmHighchart.convertJsonArrToChartDataArrByBaseVal('DT_YMDHMS',
            [
                {field: 'AVG_IN', baseVal: 1},
                {field: 'AVG_OUT', baseVal: 1},
                {field: 'MAX_IN', baseVal: 1},
                {field: 'MAX_OUT', baseVal: 1},
                {field: 'MIN_IN', baseVal: 1},
                {field: 'MIN_OUT', baseVal: 1}
            ],
            result);
    }
    this.updateBoundData.call(this, chartDataArr);
};