/**
 * 장비 Memory 차트
 * @param chartId
 * @constructor
 */

var SvrPerfNetworkChart = function (chartId, chartInfo) {
    this.chartId = chartId;
    this.seriesName = chartInfo.label;
    this.unit = chartInfo.unit;
    this.chart = null;
};


SvrPerfNetworkChart.prototype = function () {

    /**
     * 차트 생성
     */

    var initialize = function () {


        this.chart = HmHighchart.createStockChart(this.chartId, {
            yAxis: [{
                min: 0,
                max: 100,
                crosshair: true,
                opposite: false,
                showLastLabel: true,
                labels: {
                    formatter: function () {
                        return this.value + ' %'
                    }
                }
            }, {
                min: 0,
                crosshair: true,
                opposite: true,
                showLastLabel: true,
                labels: {
                    formatter: HmHighchart.absUnit1000Formatter
                }
            }],
            tooltip: {
                shared: true,
                useHTML: true,
                valueSuffix: ' %',
                formatter: HmHighchart.absUnit1000TooltipFormatter
            },

            series: [

                {name: this.seriesName + ' IN 평균 사용률', type: 'area'},
                {name: this.seriesName + ' OUT 평균 사용률', type: 'area'},
                // {name: this.seriesName + ' IN 최대 사용률', type: 'line', visible: false},
                // {name: this.seriesName + ' OUT 최대 사용률', type: 'line', visible: false},

                {name: this.seriesName + ' IN 평균', type: 'area', yAxis: 1},
                {name: this.seriesName + ' OUT 평균', type: 'area', yAxis: 1},
                // {name: this.seriesName + ' IN 최대', type: 'line', yAxis: 1, visible: false},
                // {name: this.seriesName + ' OUT 최대', type: 'line', yAxis: 1, visible: false},

            ]
        }, HmHighchart.TYPE_AREA);


    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function (chartDataArr) {

        var noDataFlag = 0;

        if (chartDataArr != null && chartDataArr.length > 0) {
            for (var i = 0; i < chartDataArr.length; i++) {
                HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
                if (chartDataArr[i].length > 0) noDataFlag = 1;
            }
            this.chart.yAxis[0].update({gridLineWidth: noDataFlag}, false);
            HmHighchart.redraw(this.chartId);
        } else {
            alert('차트데이터를 확인하세요.');
        }

        try {
            if (noDataFlag == 0) {
                this.chart.showNoData();
            } else
                this.chart.hideNoData();
            this.chart.hideLoading();
        } catch (err) {
        }

    }


    /**
     * 임계선 표시추가
     * @param value
     */

    var redrawAxisPlotLines = function (value) {

        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line', value, '임계치({0}%)'.substitute(value));

    }


    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, itemType: 1, mngNo: 1, itemIdx: 1, date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */

    var searchData = function (params) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        var esUse = params.esUse;

        var perfData = new PerfData();

        perfData.searchSvrPerf(_this, params, searchDataResult);

    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */

    var searchDataResult = function (params, result) {

        var chartDataArr = null;
        var columnDataArr = null;

        console.log("searchDataResult : " + JSON.stringify(params));

        if (params.svrPerfKind = "BPS") {
            columnDataArr = ['USAGE_IN_AVG', 'USAGE_OUT_AVG', 'PERF_IN_AVG', 'PERF_OUT_AVG',];
        } else if (params.svrPerfKind = "PPS") {
            columnDataArr = ['USAGE_IN_AVG', 'USAGE_OUT_AVG', 'PERF_IN_AVG', 'PERF_OUT_AVG',];
        }

        chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', columnDataArr, result);

        updateBoundData.call(this, chartDataArr);

    }

    /**
     * clear series data
     */
    var clearSeriesData = function () {
        try {
            var slen = this.chart.series.length;
            for (var i = 0; i < slen; i++) {
                this.chart.series[i].update({data: []}, false);
            }
            this.chart.yAxis[0].update({gridLineWidth: true}, false);
            HmHighchart.redraw(this.chartId);
        } catch (e) {
        }
    }


    /** remove the chart */
    var destroy = function () {
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