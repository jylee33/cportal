/**
 * 장비 Memory 차트
 * @param chartId
 * @constructor
 */

var SvrPerfDiskChart = function (chartId) {
    this.chartId = chartId;
    this.chart = null;
};

SvrPerfDiskChart.prototype = function () {

    /**
     * 차트 생성
     */

    var initialize = function () {

        this.chart = HmHighchart.createStockChart(this.chartId, {
            yAxis: [{
                min: 0,
                crosshair: true,
                opposite: false,
                showLastLabel: true,
                labels: {formatter: HmHighchart.absUnit1000Formatter}
            }, {
                min: 0,
                crosshair: true,
                opposite: true,
                showLastLabel: true,
                labels: {
                    // align: 'left',
                    // x : -50,
                    formatter: function () {
                        console.log(this);
                        return HmUtil.commaNum(this.value);
                    }
                },
                // labels: {formatter : HmUtil.commaNum(this.value)}
            }],
            tooltip: {
                shared: true,
                useHTML: true,
                valueSuffix: ' %',
                formatter: HmHighchart.absUnit1000TooltipFormatter
            },

            series: [
                {name: ' READ 사용량', type: 'line'},
                {name: ' WRITE 사용량', type: 'line'},

                {name: ' READ 건수', type: 'line', yAxis: 1},
                {name: ' WRITE 건수', type: 'line', yAxis: 1},
                // {name: this.seriesName + ' 최소', type: 'line', visible: false, yAxis: 1}
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

        columnDataArr = ['READ_BYTES', 'WRITE_BYTES', 'READ_COUNT', 'WRITE_COUNT'];
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