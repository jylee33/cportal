/**
 * 차트 Base
 * @param chartId
 * @constructor
 */
var HmBaseChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

HmBaseChart.prototype = function() {

    var initialize = function() {

    }

    var updateBoundData = function(chartDataArr, isCenterThreshold) {
        if(chartDataArr != null && chartDataArr.length > 0) {
            for(var i = 0; i < chartDataArr.length; i++) {
                HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
            }
            HmHighchart.redraw(this.chartId);
            if(isCenterThreshold) {
                HmHighchart.centerThreshold(this.chart);
            }
        }
        else {
            alert('차트데이터를 확인하세요.');
        }
    }

    var redrawAxisPlotLines = function(valueArr) {

    }

    /**
     *  차트 데이터 조회
     * @param params {tableCnt: 1, mngNo: 1, ifIdx: 1, itemType: 'BPS|BPSPER|PPS|ERR', date1: '20190904', date2: '20190905', time1: '0000', time2: '2359'}
     */
    var searchData = function(params) {

    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */
    var searchDataResult = function(params, result) {

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
        destroy: destroy
    }

}();