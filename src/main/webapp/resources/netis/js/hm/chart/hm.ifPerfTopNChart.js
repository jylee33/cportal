/**
 * 회선성능 TopN 차트
 * @param chartId
 * @constructor
 */
var IfPerfTopNChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

IfPerfTopNChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                chart: {
                    type: 'bar',
                    backgroundColor: 'transparent',
                },
                lang: {
                    noData: '정보없음',
                    loading: '조회중입니다.'
                },
                noData: {
                    y:-120,
                    position: {
                        align: 'center',
                        verticalAlign: 'top',
                        y: 80
                    },
                },
                xAxis: {
                    categories: [],
                    labels: {
                        style: {
                            color: '#111',
                            width: '100px',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontSize: '11px',
                        }
                    },
                },
                yAxis: {
                    title: { text: null },
                    labels: {
                        enabled: false,
                        formatter: function () {
                            return this.value;
                        },
                        style: {
                            color: '#111'
                        },
                    },
                    gridLineWidth:0,
                    lineWidth: 0,
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true,
                            allowOverlap: true,
                            style: {
                                color: '#111'
                                ,fontSize: '10px',
                            },
                            formatter: function () {
                                return  HmUtil.convertUnit1024Blank(this.y)+"B";
                            },
                        },
                    },
                    series: {
                        // pointPadding: 0.21,
                        pointWidth: 6,
                        groupPadding:0.9
                    }
                },
                series: [],
                tooltip: {
                    formatter: function () {
                        return  HmUtil.convertUnit1024Blank(this.y)+"B";
                    },
                },
                exporting: {
                    enabled: false,
                }
            }, HmHighchart.TYPE_BAR);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var noDataFlag = 0;
        $("#ifPerfTopN").addClass("contentsTopN"); // 스크롤바 주입

        if(chartDataArr != null && chartDataArr.length > 0) {

            noDataFlag = 1;

            var data = chartDataArr;
            var category = [], chartData = [],chartData2 = [];

            $.each(data, function(idx, item) {
                category.push(item.ifName);
                chartData.push({ y: Number(item.inVal)});
                chartData2.push({ y: Number(item.outVal)});
            });

            while (this.chart.series.length) {
                this.chart.series[1].remove(false);
                this.chart.series[0].remove(false);
            }

            this.chart.xAxis[0].setCategories(category, false);
            this.chart.addSeries({data: chartData2,name:'OUT',color:'#50bae0', legendIndex:1}, false);
            this.chart.addSeries({data: chartData,name:'IN',color:'#59c57f', legendIndex: 0}, false);
            this.chart.update(
                {
                    xAxis: {
                        lineWidth: 1 // x축의 선 두께를 1로 설정하여 생성
                    },
                }
            );
            this.chart.redraw();

        } else {
            // console.log(this.chartId+' 차트데이터를 확인하세요.');
        }
        try{
            if(noDataFlag == 0){
                $("#ifPerfTopN").removeClass("contentsTopN"); // 스크롤바 제거
                this.chart.update(
                    {
                        series: [{data:[]},{data:[]}],
                        xAxis: {
                            lineWidth: 0 // x축의 선 두께를 0으로 설정하여 제거
                        },
                        yAxis: {
                            lineWidth: 0 // y축의 선 두께를 0으로 설정하여 제거
                        }
                    }
                );
                this.chart.reflow();
                this.chart.showNoData();
            }else{
                this.chart.hideNoData();
            }
            this.chart.hideLoading();
        } catch(err){
        }
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

        var perfData = new PerfData();

        perfData.searchIfTotalPerfTopN(_this, params, searchDataResult);
    }

    /**
     * 차트 데이터 조회결과 처리
     * @param params
     * @param result
     */
    var searchDataResult = function(params, result) {
        updateBoundData.call(this, result);
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