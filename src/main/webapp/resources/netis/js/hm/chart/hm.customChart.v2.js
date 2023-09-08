/**
 * CustomChart 차트
 * @param chartId
 * @xAxis [seriesName][yField]
 * @constructor
 */
var HmCustomChart = function(chartId, options, series, url) {
    this.chartId = chartId;
    this.options = options;
    this.series = series;
    this.url = url;

    this.chart = null;
    this.chartType = (options.hasOwnProperty("chart")? options.chart.type : 'area') || 'area';

};

HmCustomChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        console.log("options", $.extend({}, this.options, this.series));

        if($.inArray(this.chartType, ['area', 'line', 'column']) !== -1) {
            this.chart =
                HmHighchart.createStockChart(this.chartId, $.extend({}, this.options, {series: this.series}), HmHighchart.TYPE_AREA);
        }
        else {
            this.chart =
                HmHighchart.create2(this.chartId, $.extend({}, this.options, {series: this.series}), this.chartType);
        }

         // if(this.unit.indexOf("%") > -1) {
         //    this.chart.update({
         //        tooltip: {
         //            shared: true,
         //            useHTML: true,
         //            valueSuffix: ' %',
         //            formatter: HmHighchart.absHtmlTooltipFormatter
         //        },
         //        yAxis: {
         //            min: 0,
         //            max: 100,
         //            labels: {
         //                formatter: function () {
         //                    return this.value + ' %'
         //                }
         //            }
         //        }
         //    });
         // }
    };

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        //this.chart.series[1].data = [];
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
            }else {
                this.chart.hideNoData();
            }
            this.chart.hideLoading();
        } catch(err){}
    };

    /**
     * 임계선 표시추가
     * @param value
     */
    var redrawAxisPlotLines = function(value) {
        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        HmHighchart.addAxisPlotLine(this.chart.yAxis[0], 'plot-line',  value, '임계치({0}%)'.substitute(value));
    };

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
    };

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */

    var searchDataResult = function(params, result) {
        if(this.chartType == 'pie') {
            var _xFields = [], _yFields = [], chartData = {};
            $.each(this.series, function(i,v) {
                _xFields.push(v.userOptions.xField);
                _yFields.push(v.userOptions.yField);
                chartData['data'+i] = [];
            });
            $.each(result, function(di, dv) {
                for(var sidx in _xFields) {
                    dv.name = dv[_xFields[sidx]];
                    dv.y = dv[_yFields[sidx]];
                    chartData['data'+sidx].push(dv);
                }
            });
            var _chartId = this.chartId;
            $.each(this.series, function(si, sv) {
                HmHighchart.setSeriesData(_chartId, si, chartData['data'+si], false);
            });
            HmHighchart.redraw(_chartId);
        } else if(this.chartType == 'bar') {
            var _xFields = [], _yFields = [], chartData = {};
            $.each(this.series, function(si, sv) {
                _xFields.push(sv.userOptions.xField);
                _yFields.push(sv.userOptions.yField);
                chartData['categories'] = [];
                chartData['data'+si] = [];
            });
            $.each(result, function(i, v) {
                chartData['categories'].push(v[_xFields[0]]);
                for(var sidx in _xFields) {
                    v.y = v[_yFields[sidx]];
                    chartData['data'+sidx].push(v);
                }
            });
            var _chartId = this.chartId;
            this.chart.xAxis[0].setCategories(chartData['categories'], false);
            $.each(this.series, function(si, sv) {
                HmHighchart.setSeriesData(_chartId, si, chartData['data'+si], false);
            });
            HmHighchart.redraw(_chartId);
        } else { //area, line, column -> stockChart
            var chartDataArr = null;
            var _xField = null, _yFields = [];
            $.each(this.series, function(i,v) {
                if(i == 0) {
                    _xField = v.userOptions.xField;
                }
                _yFields.push(v.userOptions.yField);
            });
            chartDataArr = HmHighchart.convertJsonArrToChartDataArr(_xField, _yFields, result);
            updateBoundData.call(this, chartDataArr);
        }
    };


    /** remove the chart */
    var destroy = function() {
        HmHighchart.destroy(this.chart);
    };

    return {
        initialize: initialize,
        updateBoundData: updateBoundData,
        redrawAxisPlotLines: redrawAxisPlotLines,
        searchData: searchData,
        destroy: destroy
    }

}();