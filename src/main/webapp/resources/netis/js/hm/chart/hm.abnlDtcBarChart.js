/**
 * 가로 바 차트
 * @param chartId
 * @constructor
 */
var AbnlDtcBarChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

AbnlDtcBarChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        var maxInit = 85;
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                legend: {
                    enabled: false
                },

                tooltip: {
                    // valueDecimals: 2,
                    // valueSuffix: '',
                    formatter: function() {
                        // 툴팁 내용을 동적으로 생성
                        return this.point.category + ' : ' + this.point.y;
                    },
                },


                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        },
                        groupPadding: 0.1
                    }
                },
                /*colors: ['#FCE700', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E'],*/ // colors가 없으면 색을 자동으로 할당
                series: [
                    {
                        name: "컬럼명",
                        data: "컬럼데이터"
                    }
                ]
            }, HmHighchart.TYPE_BAR);
    }

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var type = this.chartId.split("_")[1];
console.log("update this=", type)
        var noDataFlag = 0;
        var category = [];
        if(chartDataArr != null && chartDataArr.length > 0) {

            var category = [], chartData = [];
            $.each(chartDataArr, function(idx, item) {
                noDataFlag = 1;
                if (type == "topN") {
                    category.push(item.targetName); // 컬럼명 동적 할당
                } else if (type == "weakPoint"){
                    category.push(item.featureDescription); // 컬럼명 동적 할당
                } else {
                    category.push("abnlDtcBarChart"); // 컬럼명 동적 할당
                }

                if(idx == 0){
                    chartData.push({ y: Number(item.count),color:'#00aeef'});
                }else if(idx == 1){
                    chartData.push({ y: Number(item.count),color:'#5089e0'});
                }else if(idx == 2){
                    chartData.push({ y: Number(item.count),color:'#20a2a0'});
                }else if(idx == 3){
                    chartData.push({ y: Number(item.count),color:'#c0d767'});
                }else if(idx == 4){
                    chartData.push({ y: Number(item.count),color:'#91d581'});
                }

            });
            if(chartDataArr.length == 0){
                category = [''], chartData = [''];
            }
            while (this.chart.series.length) {
                this.chart.series[0].remove(false);
            }

            this.chart.update({
                chart: {
                    zoomType: 'none' // 줌 비활성화
                },
            });

            this.chart.xAxis[0].setCategories(category, false);
            this.chart.addSeries({data: chartData}, false);
            this.chart.redraw();

        }
        else {
            // alert('차트데이터를 확인하세요.');
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

        var dataList = result.data;

        if(this.chart.series) {
            this.chart.series[0].show();
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