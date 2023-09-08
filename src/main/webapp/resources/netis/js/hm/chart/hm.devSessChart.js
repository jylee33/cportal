/**
 * 장비 세션 차트
 * @param chartId
 * @constructor
 */
var DevSessChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

DevSessChart.prototype = function() {

    var initialize = function() {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return HmUtil.commaNum(this.value);
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '세션 평균', type: 'area'},
                    {name: '세션 최대', type: 'line'},
                    {name: '세션 최소', type: 'line', visible: false}
                    //{name: '세션 최대', type: 'line', lineWidth: 0, marker: {enabled: true, radius: 4, symbol: 'diamond'}, visible: false}
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
            for(var i = 0; i < chartDataArr.length; i++) {
                HmHighchart.setSeriesData(this.chartId, i, chartDataArr[i], false);
                if(chartDataArr[i].length>0) noDataFlag = 1;
            }
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

        var perfData = new PerfData();

        if(esUse != 'Y'){
            perfData.searchDevPerf(_this, params, searchDataResult);
            // search(_this, params);
        }else{
            if(params.tableCnt == 1){
                perfData.searchEsDevPerf(_this, params, searchDataResult);
                // searchEs(_this, params);
            }else{
                perfData.searchDevPerf(_this, params, searchDataResult);
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
                this.chart.series[1].hide();
                this.chart.series[1].update({data: []}, false, false);
            }
            chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['RATE'], result);
        }else{
            if(this.chart.series) {
                this.chart.series[1].show();
            }
            chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['RATE', 'MAX_VAL', 'MIN_VAL'], result);
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
        searchData: searchData,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();