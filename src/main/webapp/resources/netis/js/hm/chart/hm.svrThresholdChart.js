/**
 * 장비 임계치 차트
 * @param chartId
 * @constructor
 */
var SvrThresholdChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

SvrThresholdChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        var maxInit = 85;
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                    events:{
                        redraw: function () {
                            var dataMax = this.yAxis[0].dataMax;
                            if (dataMax>maxInit) {
                                maxInit=dataMax;
                                this.yAxis[0].update({
                                    max:100
                                });
                            }
                        }
                    }
                },

                xAxis: {
                    showLastLabel: true,

                    dateTimeLabelFormats: {
                        millisecond: '%H:%M:%S.%L',
                        second: '%H:%M:%S',
                        minute: '%H:%M',
                        hour: '%H:%M',
                        day: '%m/%d',
                        week: '%b-%d',
                        month: '%y-%b',
                        year: '%Y'
                    }
                },

                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    // maxPadding: 0,
                    endOnTick: false,
                    labels: {
                        formatter:  function () {
                            return this.value + ' %'
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' %',
                    formatter: HmHighchart.scatterTooltipFormatter
                },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 3,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                    }
                },
                // 겹칠 때 위에 올라오는것 => 나중에 그린것
                series: [
                    {name: '평균 이하', color: 'rgba(000, 000, 255, .3)', marker:{symbol: 'circle'} },
                    {name: '평균 이상', color: 'rgba(255, 000, 000, .3)', marker:{symbol: 'diamond'} },
                ]
            }, HmHighchart.TYPE_SCATTER);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {
            for(var i = 0, slen = this.chart.series.length; i < slen; i++) {
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
    var redrawAxisPlotLines = function(value, type) {
        HmHighchart.removeAllAxisPlotLines(this.chart.yAxis[0]);
        addThresholdLine(this.chart.yAxis[0], 'plot-line',  value, type+'({0}%)'.substitute(value));
    }

    var addThresholdLine = function (axis, id, limitValue, labelText) {
        axis.addPlotLine({
            id: id, value: limitValue,
            color: 'rgba(0,0,128)', width: 2, dashStyle: 'Dot', zIndex: 3,
            label: {text: labelText, align: 'right', style: {color: 'rgba(0,0,128)', fontSize: 12}}
        });
    }

    /**
     *  임계치 차트 데이터 조회
     * @param params { ??? }
     */
    var searchData = function(params) {
        try {
            this.chart.hideNoData();
            this.chart.showLoading();
        } catch (err) {
        }

        var _this = this;
        var perfData = new PerfData();

        perfData.searchSvrThresholdPerf(_this, params, searchDataResult);

    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params {chartName(차트 이름), itemType(1:CPU, 2:Memory), mngNo(장비번호), timeToday(현재시간), timeYesterday(현재시간-1day), holdLineName(임계치를 표시하는 span 정보)}
     * @param result {dataList(series 데이터 리스트), holdRateLine(임계점 값), rateArg(평균값)}
     */
    var searchDataResult = function(params, result) {
        var dataList = result.dataList;
        var holdRateLine = result.holdRateLine;
        var holdMaxLine = result.holdMaxLine;

        //권장임계치 설정
        if ('holdLineName' in params){
            if (holdRateLine==null || holdRateLine=='' || holdRateLine==undefined || holdMaxLine==null || holdMaxLine=='' || holdMaxLine==undefined ){
                params.holdLineName.html("권장임계치 : -")
            }else {
                // params.holdLineName.html("권장임계치 : " + holdRateLine + "%")
                params.holdLineName.html("권장임계치 : " + holdMaxLine + "%")
            }
        }

        var chartDataArr = HmHighchart.convertJsonArrToChartDataArr('DT_YMDHMS', ['AVG_UNDER', 'AVG_OVER'], dataList);

        if(this.chart.series) {
            this.chart.series[0].show();
            // redrawAxisPlotLines.call(this, holdRateLine,"임계치"); // 상위 5%~15%의 평균
            redrawAxisPlotLines.call(this, holdMaxLine,"임계치"); // 상위5%
            updateBoundData.call(this, chartDataArr);
        }

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