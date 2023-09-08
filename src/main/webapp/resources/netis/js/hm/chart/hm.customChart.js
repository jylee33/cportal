/**
 * CustomChart 차트
 * @param chartId, chartType, options, url
 * @xAxis [seriesName][yField]
 * @unit per, 1000, 1024
 * @constructor
 */
var CustomChart = function(chartId, chartType, options, url) {
    this.chartId = chartId;
    this.chartType = chartType;
    this.series = options.series || [];
    this.unit = options.hasOwnProperty('chartConfig')? options.chartConfig.unit : '';
    this.url = url;
    this.options = options;

    this.chart = null;
};


function createTimeChart() {
    this.chart =
        HmHighchart.createStockChart(this.chartId, $.extend({
            yAxis: {
                crosshair: true,
                opposite: false,
                showLastLabel: true,
            },
            tooltip: {
                shared: true,
                useHTML: true,
                valueSuffix: '',
            }
        }, this.options), HmHighchart.TYPE_AREA);

         switch (this.unit) {
             case 'pct':
                     this.chart.update({
                         tooltip: {
                             shared: true,
                             useHTML: true,
                             valueSuffix: ' %',
                             formatter: HmHighchart.absHtmlTooltipFormatter
                         },
                         yAxis: {
                             min: 0,
                             max: 100,
                             labels: {
                                 formatter: function () {
                                     return this.value + ' %'
                                 }
                             }
                         }
                     });
                 break;
             case 'cnt':
                     this.chart.update({
                         tooltip: {
                             shared: true,
                             useHTML: true,
                             valueSuffix: ' 개',
                             formatter: HmHighchart.absHtmlTooltipFormatter
                         },
                         yAxis: {
                             min: 0,
                             labels: {
                                 formatter: function () {
                                     return this.value + ' 개'
                                 }
                             }
                         }
                     });
                 break;
             case 'temp':
                     this.chart.update({
                         tooltip: {
                             shared: true,
                             useHTML: true,
                             valueSuffix: ' ℃',
                             formatter: HmHighchart.absHtmlTooltipFormatter
                         },
                         yAxis: {
                             min: 0,
                             labels: {
                                 formatter: function () {
                                     return this.value + ' ℃'
                                 }
                             }
                         }
                     });
                 break;
             case 'ms':
                     this.chart.update({
                         tooltip: {
                             shared: true,
                             useHTML: true,
                             valueSuffix: ' ms',
                             formatter: HmHighchart.absHtmlTooltipFormatter
                         },
                         yAxis: {
                             min: 0,
                             labels: {
                                 formatter: function () {
                                     return this.value + ' ms'
                                 }
                             }
                         }
                     });
                 break;
             case '1000':
                 this.chart.update({
                     tooltip: {
                         shared: true,
                         useHTML: true,
                         formatter: HmHighchart.absUnit1000HtmlTooltipFormatter
                     },
                     yAxis: {
                         opposite: false,
                         crosshair: true,
                         showLastLabel: true,
                         labels: {
                             formatter: HmHighchart.absUnit1000Formatter
                         }
                     }
                 });
                 break;
             case '1024':
                 this.chart.update({
                     tooltip: {
                         shared: true,
                         useHTML: true,
                         formatter: HmHighchart.absUnit1024HtmlTooltipFormatter
                     },
                     yAxis: {
                         opposite: false,
                         crosshair: true,
                         showLastLabel: true,
                         labels: {
                             formatter: HmHighchart.absUnit1024Formatter
                         }
                     }
                 });
                 break;
         }
}

/**
 * Bar 차트
 */
function createBarChart() {
    this.chart = HmHighchart.create2(this.chartId, $.extend({
        chart: {type: 'bar'},
        legend: {enabled: false},
        yAxis: {title: {text: null}},
    }, this.options), HmHighchart.TYPE_BAR);
}

function createPieChart() {
    this.chart = HmHighchart.create2(this.chartId, $.extend({
            chart: {type: 'pie'},
            legend: {enabled: false},
            yAxis: {title: {text: null}},
        }, this.options), HmHighchart.TYPE_PIE);


}
function createSolidGaugeChart() {
    this.chart = HmHighchart.create(this.chartId, $.extend({
            chart: {type: 'solidgauge'},
            legend: {enabled: false},
            yAxis: {title: {text: null}},
        }, this.options), HmHighchart.TYPE_SOLIDGAUGE);
}

CustomChart.prototype = function() {
    /**
     * 차트 생성
     */
    var initialize = function() {

        switch(this.chartType) {
            case HmHighchart.TYPE_LINE:
            case HmHighchart.TYPE_AREA:
            case HmHighchart.TYPE_COLUMN:
                createTimeChart.call(this);
                break;
            case HmHighchart.TYPE_PIE:
                createPieChart.call(this);
                break;
            case HmHighchart.TYPE_SOLIDGAUGE:
                createSolidGaugeChart.call(this);
                break;
            case HmHighchart.TYPE_BAR:
                createBarChart.call(this);
                break;
        }

    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        //this.chart.series[1].data = [];
        console.log(chartDataArr)
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
        $.each(this.series, function (i,v) {
           console.log('series'+i, v);
        });

        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        // var esUse = params.esUse;

        var perfData = new PerfData();
        if(this.url != undefined){
            perfData.searchCustomPerf(_this, params, this.url, searchDataResult);
        }else{
            perfData.searchSvrDbmsPerf(_this, params, searchDataResult);
        }
/*      서버성능이 ES로 현재 들어오는 데이터가 없음 무조건 RDB 조회.... 추후 변경 필요
        if(esUse != 'Y'){
            perfData.searchSvrPerf(_this, params, searchDataResult);
        }else{
            if(params.tableCnt == 1){
                perfData.searchEsSvrPerf(_this, params, searchDataResult);
            }else{
                perfData.searchSvrPerf(_this, params, searchDataResult);
            }
        }
*/
    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */

    var searchDataResult = function(params, result) {
        var chartId = this.chartId;
        switch(this.chartType) {
            case HmHighchart.TYPE_LINE:
            case HmHighchart.TYPE_AREA:
            case HmHighchart.TYPE_COLUMN:
                var chartData = {};
                var _series = this.series;
                var xFieldArr = [], yFieldArr = [];
                $.each(_series, function(si, sv) {
                    xFieldArr.push(sv.xField);
                    yFieldArr.push(sv.yField);
                    chartData[si] = [];
                });
                $.each(result, function(i, v) {
                    for(var sidx in xFieldArr) {
                        var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                        chartData[sidx].push([v[_xField], v[_yField]]);
                    }
                });
                $.each(_series, function(si, sv) {
                    HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                });
                HmHighchart.redraw(chartId);

                // updateBoundData.call(this, chartData);
                break;
            case HmHighchart.TYPE_PIE:
            case HmHighchart.TYPE_SOLIDGAUGE:
                var chartData = {};
                var _series = this.series;
                var xFieldArr = [], yFieldArr = [];
                $.each(_series, function(si, sv) {
                    xFieldArr.push(sv.xField);
                    yFieldArr.push(sv.yField);
                    chartData[si] = [];
                });
                $.each(result, function(i, v) {
                    for(var sidx in xFieldArr) {
                        var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                        v.name = v[_xField];
                        v.y = v[_yField];
                        chartData[sidx].push(v);
                    }
                });
                $.each(_series, function(si, sv) {
                    HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                });
                HmHighchart.redraw(chartId);
                break;
            case HmHighchart.TYPE_BAR:
                var chartData = {};
                var _series = this.series;
                var xFieldArr = [], yFieldArr = [];
                $.each(_series, function(si, sv) {
                    xFieldArr.push(sv.xField);
                    yFieldArr.push(sv.yField);
                    chartData['categories'] = [];
                    chartData[si] = [];
                });
                $.each(result, function(i, v) {
                    chartData['categories'].push(v[xFieldArr[0]]);
                    for(var sidx in xFieldArr) {
                        var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                        v.y = v[_yField];
                        chartData[sidx].push(v);
                    }
                });
                this.chart.xAxis[0].setCategories(chartData['categories'], false);
                $.each(_series, function(si, sv) {
                    HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                });
                HmHighchart.redraw(chartId);
                break;
        }


        /*
        var chartDataArr = null;

        chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', this.yfield, result);

        updateBoundData.call(this, chartDataArr);*/
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