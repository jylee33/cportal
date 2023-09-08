/**
 * 차트
 * @param chartId
 * @constructor
 */
var SolidGaugeChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

SolidGaugeChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        var maxInit = 85;
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                chart: {
                    type: 'solidgauge',
                    // renderTo: this.chartId
                },

                title: {
                    useHTML: true,
                    // text: "80%",
                    floating: true,
                    verticalAlign: 'middle',
                    y: 18,
                    style:{
                        "font-weight":"bold" , "font-size":"18px",
                    }
                },

                lang: {
                    noData: '정보없음',
                    loading: '조회중입니다.'
                },

                tooltip: {
                    enabled: false
                },

                pane: {
                    center: ['50%', '50%'],
                    size: '81%',
                    startAngle: 0,
                    endAngle: 360,
                    background: {
                        backgroundColor: '#ebeff7',
                        innerRadius: '86%',
                        outerRadius: '100%',
                        borderWidth: 0
                    }
                },

                yAxis: {
                    min: 0,
                    max: 100,
                    labels: {
                        enabled: false
                    },

                    lineWidth: 0,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0
                },

                plotOptions: {
                    solidgauge: {
                        innerRadius: '86%',
                        rounded: true
                    }
                },

                series: [{
                    name: 'Percent',
                    // data: [30], // 시리즈 데이터
                    dataLabels: {
                        enabled: false
                    }
                }],

                exporting: {
                    enabled: false,
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        },
                        menuItemStyle: {
                            padding: '0.3em 1em'
                        }
                    }
                }

            }, HmHighchart.TYPE_SOLIDGAUGE);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     */
    var updateBoundData = function(chartDataArr, param) {

        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {
            noDataFlag = 1;

            if (param != null
                && param != undefined) {
                this.chart.update(param);
            }
            this.chart.reflow();
        }
        else {
            // console.log(this.chartId+' 차트데이터를 확인하세요.');
        }
        try{
            if(noDataFlag == 0){
                this.chart.update(
                    {
                        title: {
                            text: "",
                            style:{
                                "font-weight":"bold" , "font-size":"12px",
                            }
                        },
                        series: [{data:[]}],
                    }
                );
                this.chart.reflow();
                this.chart.showNoData();
            }else {
                this.chart.hideNoData();
            }
            this.chart.hideLoading();
        } catch(err){}
    }


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
        var perfData = new PerfData();

        perfData.searchExternalGet(_this, params, url, searchDataResult);

    }

    /**
     * 차트 데이터 조회결과 처리
     */
    var searchDataResult = function(params, result) {
        var dataList = result.dataList;

        var chartDataArr = HmHighchart.convertJsonArrToChartDataArr(['grpName'], ['count'], dataList);

        if(this.chart.series) {
            this.chart.series[0].show();
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
        searchData: searchData,
        clearSeriesData: clearSeriesData,
        destroy: destroy
    }

}();