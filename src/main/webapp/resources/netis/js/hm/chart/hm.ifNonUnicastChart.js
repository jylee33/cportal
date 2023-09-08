/**
 * 회선 BPS 사용량 차트
 * @param chartId
 * @constructor
 */
var IfNonUnicastChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

IfNonUnicastChart.prototype = function() {

    var initialize = function() {
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
                    {name: 'IN 최소', type: 'line', visible: false},
                    {name: 'OUT 최소', type: 'line', visible: false}
                    // {name: 'IN 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'diamond'}, visible: false},
                    // {name: 'OUT 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'triangle'}, visible: false}
                ]
            }, HmHighchart.TYPE_AREA);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {
            // TODO series length check !!!
            var slen = this.chart.series.length;
            for(var i = 0, n = chartDataArr.length > slen? slen : chartDataArr.length; i < n; i++) {
                HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
                if(chartDataArr[i].length>0) noDataFlag = 1;
            }

            this.chart.yAxis[0].update({gridLineWidth: noDataFlag}, false);
            HmHighchart.redraw(this.chartId);
            // HmHighchart.centerThreshold(this.chart);
        }
        else {
            alert('차트데이터를 확인하세요.');
        }
        try{
            if(noDataFlag == 0){
                this.chart.showNoData();
            }else
                this.chart.hideNoData();
            this.chart.hideLoading();
        } catch(err){}
    }

    var redrawAxisPlotLines = function(inValue, outValue) {
        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line-in',  inValue, 'In({0})'.substitute(HmUtil.convertUnit1000(inValue)));
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line-out',  -(outValue), 'Out({0})'.substitute(HmUtil.convertUnit1000(outValue)));
    }

    /**
     * TODO TEST.. 필요할까?
     */
    var updateSeries = function(idx, options, redraw) {
        if(typeof redraw === 'undefined') {
            redraw = false;
        }

        this.chart.series[idx].update(options, redraw);
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, mngNo: 1, ifIdx: 1, itemType: 'BPS|BPSPER|PPS|ERR', date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchData = function(params) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        var esUse = params.esUse;

        var perfData = new PerfData();

        if(esUse != 'Y'){
            perfData.searchIfPerf(_this, params, searchDataResult);
            // search(_this, params);
        }else{
            if(params.tableCnt == 1){
                perfData.searchEsIfPerf(_this, params, searchDataResult);
                // searchEs(_this, params);
            }else{
                perfData.searchIfPerf(_this, params, searchDataResult);
                // search(_this, params);
            }
        }
    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */
    var searchDataResult = function(params, result) {
        var chartDataArr = null;
        if(params.tableCnt == 1) {
            if(this.chart.series) {
                this.chart.series[2].hide();
                this.chart.series[3].hide();
                this.chart.series[2].update({data: []}, false);
                this.chart.series[3].update({data: []}, false);
            }
            chartDataArr = HmHighchart.convertJsonArrToChartDataArrByBaseVal('DT_YMDHMS',
                [
                    {field: 'AVG_IN', baseVal: 1},
                    {field: 'AVG_OUT', baseVal: 1}
                ], result);
        }
        else {
            if(this.chart.series) {
                this.chart.series[2].show();
                this.chart.series[3].show();
            }
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
        if(this.chart.series) updateBoundData.call(this, chartDataArr);
    }

    /**
     * clear series data
     */
    var clearSeriesData = function() {
        try {
            var slen = this.chart.series.length;
            for (var i = 0; i < slen; i++) {
                this.chart.series[i].update({data: []}, false);
            }
            this.chart.yAxis[0].update({gridLineWidth: true}, false);
            HmHighchart.redraw(this.chartId);
        } catch(e) {}
    }

    /** remove the chart */
    var destroy = function() {
        HmHighchart.destroy(this.chart);
    }

    return {
        initialize: initialize,
        updateBoundData: updateBoundData,
        redrawAxisPlotLines: redrawAxisPlotLines,
        updateSeries: updateSeries,
        searchData: searchData,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();