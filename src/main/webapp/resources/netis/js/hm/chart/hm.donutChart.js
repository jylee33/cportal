/**
 * 도넛 모양 차트
 * @param chartId
 * @constructor
 */
var DonutChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

DonutChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        var maxInit = 85;
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                title: {
                    text: "차트 위 문구",
                    align: 'center'
                },
                subtitle: {
                    useHTML: true,
                    text: "차트 가운데 문구",
                    floating: true,
                    verticalAlign: 'middle',
                    y: 18
                },

                legend: {
                    enabled: false
                },

                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '개'
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        colorByPoint: true,
                        type: 'pie',
                        size: '100%',
                        innerSize: '50%',
                        dataLabels: {
                            enabled: true,
                            crop: false,
                            distance: '-10%',
                            style: {
                                fontWeight: 'bold',
                                fontSize: '16px'
                            },
                            connectorWidth: 0
                        }
                    },
                    pie: {
                        showInLegend: true,
                        point: {
                            events: {
                                legendItemClick: function (event) {

                                    var chart = this.series.chart

                                    if (this.visible) {
                                        // this.series.visible = false;
                                        subTitleNumber = subTitleNumber - event.target.options.y;
                                    } else {
                                        subTitleNumber = subTitleNumber + event.target.options.y;
                                    }
                                    chart.setSubtitle({
                                        text: subTitleNumber
                                    }, false, false);

                                    return true

                                },
                            },
                        }

                    },
                },
                /*colors: ['#FCE700', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E'],*/ // colors가 없으면 색을 자동으로 할당
                series: [
                    {
                        type: 'pie',
                        name: "컬럼명",
                        data: "컬럼데이터"
                    }
                ]
            }, HmHighchart.TYPE_PIE);
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

            // var subTitle = 0;
            for (var x in chartDataArr[0]) {
                subTitleNumber += chartDataArr[0][x][1] // subTitleNumber = 모든 row의 총합
                this.chart.series[0].userOptions.data[x][0] = ''; // 컬럼명 제거
            }

            this.chart.update({
                title: {
                    text: ""
                },
                subtitle: {
                    useHTML: true,
                    text: subTitleNumber,
                    style: {
                        fontSize: '36px'
                    },
                    floating: true,
                    verticalAlign: 'middle',
                    x: 36,
                    y: 39
                },
                plotOptions: {
                    pie: {
                        innerSize: '70%',
                        // allowPointSelect: true,
                        // cursor: 'pointer',
                        showInLegend: true,

                        dataLabels: {
                            enabled: false
                        },

                    }
                },
                tooltip: {
                    enabled: false, // 툴팁 비활성화
                },
                legend: {
                    enabled: true,
                    align: 'left',
                    layout: 'vertical',
                    verticalAlign: 'middle',
                    x: 0,
                    y: 0,
                    symbolWidth: 10, // 컬럼 너비 설정
                    symbolHeight: 10, // 컬럼 높이 설정
                    symbolRadius: 0, // 컬럼의 둥근 모서리 반지름 설정

                },
                series: [{
                    marker: {
                        symbol: 'square', // 컬럼 모양 설정
                    }
                },],

            });

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
     * 차트 데이터 조회
     * @param params { ??? }
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
     * @param params {}
     * @param result {}
     */
    var searchDataResult = function(params, result) {
        // var dataList = result.dataList;

        var resultData = {"code":0,"message":"SUCCESS",
            "data":[
                {"srcGrpNo":1,"grpName":"전체","count":2}
                ,{"srcGrpNo":2,"grpName":"전체2","count":10}
                ,{"srcGrpNo":3,"grpName":"전체3","count":15}
                ,{"srcGrpNo":4,"grpName":"전체4","count":20}
                ,{"srcGrpNo":5,"grpName":"전체5","count":25}
                ,{"srcGrpNo":6,"grpName":"전체6","count":10}
                ,{"srcGrpNo":7,"grpName":"전체7","count":10}
                ,{"srcGrpNo":8,"grpName":"전체8","count":8}
            ]}

        var dataList = result.data;

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