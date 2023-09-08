/**
 * Vsvr Network 차트
 * @param chartId, vsvrKind(VSVR, NUTANIX)
 * @constructor
 */
var VsvrBpsChart = function(chartId, vsvrKind) {
    this.chartId = chartId;
    this.vsvrKind = vsvrKind;
    this.chart = null;
};

VsvrBpsChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                yAxis: {
                    // title: {text: 'pps'},
                    crosshair: true,
                    opposite: false,
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
                    {name: 'In 평균', type: 'area'},
                    {name: 'Out 평균', type: 'area'},
                    {name: 'In 최대', type: 'line'},
                    {name: 'Out 최대', type: 'line'},
                    {name: 'In 최소', type: 'line', visible: false},
                    {name: 'Out 최소', type: 'line', visible: false}
                    //{name: 'CPU 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'diamond'}, visible: false}
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
            for(var i = 0, slen = this.chart.series.length; i < slen; i++) {
                // console.log('countCheck', chartDataArr.length,  'idx : ', i);
                if(chartDataArr.length > i) {
                    HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
                    if(chartDataArr[i].length>0) noDataFlag = 1;
                }
                else {
                    HmHighchart.setSeriesData(this.chartId, i, [], false);
                }
            }

            // 데이터가 존재하지 않을때 y축 라인 제거
            this.chart.yAxis[0].update({gridLineWidth: noDataFlag}, false);

            HmHighchart.redraw(this.chartId);
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

    /**
     * 임계선 표시추가
     * @param value
     */
    var redrawAxisPlotLines = function(value) {
        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line',  value, '임계치({0}%)'.substitute(value));
    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchData = function(params) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        var esUse = params.esUse;
        params.vsvrKind = this.vsvrKind;

        var perfData = new PerfData();

        perfData.searchVsvrPerf(_this, params, searchDataResult);
    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */
    var searchDataResult = function(params, result) {
        var chartDataArr = null;

        // if(params.tableCnt == 1) {
            // this.chart.series[2].hide();
            // this.chart.series[3].hide();
            // this.chart.series[2].update({data:[]}, false, false);
            // this.chart.series[3].update({data:[]}, false, false);
            chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['PERF_IN_AVG', 'PERF_OUT_AVG', 'PERF_IN_MAX', 'PERF_OUT_MAX', 'PERF_IN_MIN', 'PERF_OUT_MIN'], result);
        // }else{
            // this.chart.series[2].show();
            // this.chart.series[3].show();
            // chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['PERF_IN_AVG', 'PERF_OUT_AVG', 'PERF_IN_MAX', 'PERF_OUT_MAX', 'PERF_IN_MIN', 'PERF_OUT_MIN'], result);
        // }
            chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['PERF_IN_AVG', 'PERF_OUT_AVG', 'PERF_IN_MAX', 'PERF_OUT_MAX', 'PERF_IN_MIN', 'PERF_OUT_MIN'], result);

        updateBoundData.call(this, chartDataArr);
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
        searchData: searchData,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();