/**
 * FMS 공통 차트
 * @param chartId
 * @constructor
 */
var FmsChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
    this.xField = null;
    this.yFields = null;
    this.series = null;
};

FmsChart.prototype = function() {
    /**
     * 차트 생성
     */
    var initialize = function(suffix) {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {

                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    // max: 100,
                    labels: {
                        formatter:  function () {
                            return this.value
                        }
                    },
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: suffix,
                    formatter: absHtmlTooltipFormatter
                },
                //스텍차트
                plotOptions : {
                    line: {
                        lineWidth: 0.9
                    }
                },
                series: []
            });
    };

    /**
     * 차트 x축, y축, 범례, 단위 설정
     * @param _xField
     * @param _yFields
     * @param _series
     */
    var setChartOptions = function (_xField, _yFields, _series) {
        this.xField = _xField;
        this.yFields = _yFields;

        setSeries.call(this, _series);
    };

    /**
     *  차트 데이터 조회
     */
    var searchData = function(params, url) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;

        Server.get(url, {
            data: params,
            success: function(result) {
                searchDataResult.call(_this, params, result);
            }
        });
    };

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */
    var searchDataResult = function(params, result) {
        var chartDataArr = HmHighchart.convertJsonArrToChartDataArr(
            this.xField, this.yFields, result
        );
        updateBoundData.call(this, chartDataArr);
    };

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
    };

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
    };

    /** remove the chart */
    var destroyChart = function() {
        HmHighchart.destroy(this.chart);
    };

    var setSeries = function (_series) {
        while (this.chart.series.length) {
            this.chart.series[0].remove(false);
        }
        for(var i = 0; i < _series.length; i++) {
            this.chart.addSeries({name: _series[i].name, type:'line'}, false) //스텍차트 type:'column'
        }
        this.chart.redraw();
    };

    var absHtmlTooltipFormatter = function() {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
        s += '<table>';
        var suffix = this.points[0].series.tooltipOptions.valueSuffix || '';
        var total = 0;
        $.each(this.points, function() {
            s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
                '<td style="text-align: right">' + HmUtil.convertUnit1000(this.y) + suffix + '</td></tr>';
            total = this.total;
        });
        // s += '<tr><td style="color: #9579da">Total: </td>' +
        //     '<td style="text-align: right">' + HmUtil.commaNum(Math.abs(total.toFixed(2))) + suffix + '</td></tr>';
        s += '</table>';
        return s;
    };

    return {
        initialize: initialize,
        updateBoundData: updateBoundData,
        clearSeriesData: clearSeriesData,
        destroyChart: destroyChart,
        setSeries: setSeries,
        searchData: searchData,
        setChartOptions: setChartOptions
    }

}();