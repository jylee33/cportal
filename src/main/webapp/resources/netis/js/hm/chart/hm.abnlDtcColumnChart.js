/**
 * 세로 바 차트
 * @param chartId
 * @constructor
 */
var AbnlDtcColumnChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

AbnlDtcColumnChart.prototype = function() {
    /**
     * 차트 생성
     */
    var initialize = function() {
        var maxInit = 85;
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                yAxis: {
                    allowDecimals: false, //정수로 나타내줌
                    title: {text: 'count'},
                    opposite: false, /* 이거 지우면 y축 title 오른쪽으로 이동함*/
                },

                tooltip: {
                    shared: true,
                    useHTML: true,
                    crosshair: false,

                    formatter: function () {
                        var point = this.points;

                        var xValue = point[0].x;
                        var xVal = point[0].y;
                        var yVal = point[1].y;
                        var xName = point[0].series.name;
                        var yName = point[1].series.name;


                        var s = '<b>' +xValue + '</b>';
                        s += '<br/>' + xName + ': ' + (xVal);
                        s += '<br/>' + yName + ': ' + (yVal);
                        return s;


                    },
                    overflow: 'justify'
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: false /*각각 데이터 보여주는것*/
                        },
                        groupPadding: 0,
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                legend: {
                    enabled: true
                },
                series: [
                    {name: 'active', type: 'column'},
                    {name: 'inactive', type: 'column'}
                ]
            }, HmHighchart.TYPE_COLUMN);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {

        var type = this.chartId.split("_")[1];
        console.log('type',type);

        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {

            var category = [], chartData = [] , chartData2 = [];


            $.each(chartDataArr, function(idx, item) {

                console.log('item',item);

                if (type == "history") {

                    var rawDate = item.yyyyMMddHHmm.toString();
                    var date = rawDate.slice(0,4) + "-" + rawDate.slice(4,6) + "-" + rawDate.slice(6,8)+"-"+ rawDate.slice(8,10)+":"+ rawDate.slice(10,12);

                    category.push(date); // 컬럼명 동적 할당
                }
                else{
                    category.push("AhbnlDtcColumnChart");
                }

                chartData.push({y: Number(item.onEventCount)});
                chartData2.push({y: Number(item.offEventCount)});
            });


            while (this.chart.series.length) {
                this.chart.series[0].remove(false);
            }

            //필요할지도 모르니 주석처리
            // this.chart.update({
            //     chart: {
            //         zoomType: 'none' // 줌 비활성화
            //     },
            // });


            this.chart.xAxis[0].setCategories(category,false);
            this.chart.addSeries({data: chartData}, false);
            this.chart.addSeries({data: chartData2}, false);
            this.chart.series[0].name = 'active';
            this.chart.series[1].name = 'inactice';
            this.chart.redraw();

        }
        else {
            alert('차트데이터를 확인하세요.');
        }
        try{
            if(noDataFlag == 1){
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

        var dataList = result.data;

        if(this.chart.series) {
            this.chart.series[0].show();
            //this.chart.series[1].show();
            updateBoundData.call(this, dataList);
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