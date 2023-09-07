/**
 * 네트워크 차트
 * @param chartId
 * @constructor
 */
var AbnlDtcNetworkChart = function(chartId) {
    this.chartId = chartId;
    this.chart = null;
};

AbnlDtcNetworkChart.prototype = function() {

    /**
     * 차트 생성
     */
    var initialize = function() {
        this.chart =
            HmHighchart.createStockChart(this.chartId, {
                // // chart: {
                // //     type: 'networkgraph',
                // //     height: '100%'
                // // },
                // series: [{
                //     accessibility: {
                //         enabled: false
                //     },
                //     dataLabels: {
                //         enabled: true,
                //         linkFormat: '',
                //         style: {
                //             fontSize: '0.8em',
                //             fontWeight: 'normal'
                //         }
                //     },
                //     id: 'lang-tree',
                //     name: "노드명",
                //     data: []
                // }]
                chart: {
                    type: 'networkgraph',
                    height: '100%'
                },
                title: {
                    text: 'The Indo-European Language Tree',
                    align: 'left'
                },
                subtitle: {
                    text: 'A Force-Directed Network Graph in Highcharts',
                    align: 'left'
                },
                plotOptions: {
                    networkgraph: {
                        keys: ['from', 'to'],
                        layoutAlgorithm: {
                            enableSimulation: true,
                            friction: -0.9
                        }
                    }
                },
                series: [{
                    accessibility: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: true,
                        linkFormat: '',
                        style: {
                            fontSize: '0.8em',
                            fontWeight: 'normal'
                        }
                    },
                    id: 'lang-tree',
                    data: [
                        ['Proto Indo-European', 'Balto-Slavic'],
                        ['Proto Indo-European', 'Germanic'],
                        ['Proto Indo-European', 'Celtic'],
                        ['Proto Indo-European', 'Italic'],
                        ['Proto Indo-European', 'Hellenic'],
                        ['Proto Indo-European', 'Anatolian'],
                        ['Proto Indo-European', 'Indo-Iranian'],
                        ['Proto Indo-European', 'Tocharian'],
                        ['Indo-Iranian', 'Dardic'],
                        ['Indo-Iranian', 'Indic'],
                        ['Indo-Iranian', 'Iranian'],
                        ['Iranian', 'Old Persian'],
                        ['Old Persian', 'Middle Persian'],
                        ['Indic', 'Sanskrit'],
                        ['Italic', 'Osco-Umbrian'],
                        ['Italic', 'Latino-Faliscan'],
                        ['Latino-Faliscan', 'Latin'],
                        ['Celtic', 'Brythonic'],
                        ['Celtic', 'Goidelic'],
                        ['Germanic', 'North Germanic'],
                        ['Germanic', 'West Germanic'],
                        ['Germanic', 'East Germanic'],
                        ['North Germanic', 'Old Norse'],
                        ['North Germanic', 'Old Swedish'],
                        ['North Germanic', 'Old Danish'],
                        ['West Germanic', 'Old English'],
                        ['West Germanic', 'Old Frisian'],
                        ['West Germanic', 'Old Dutch'],
                        ['West Germanic', 'Old Low German'],
                        ['West Germanic', 'Old High German'],
                        ['Old Norse', 'Old Icelandic'],
                        ['Old Norse', 'Old Norwegian'],
                        ['Old Norwegian', 'Middle Norwegian'],
                        ['Old Swedish', 'Middle Swedish'],
                        ['Old Danish', 'Middle Danish'],
                        ['Old English', 'Middle English'],
                        ['Old Dutch', 'Middle Dutch'],
                        ['Old Low German', 'Middle Low German'],
                        ['Old High German', 'Middle High German'],
                        ['Balto-Slavic', 'Baltic'],
                        ['Balto-Slavic', 'Slavic'],
                        ['Slavic', 'East Slavic'],
                        ['Slavic', 'West Slavic'],
                        ['Slavic', 'South Slavic'],
                        // Leaves:
                        ['Proto Indo-European', 'Phrygian'],
                        ['Proto Indo-European', 'Armenian'],
                        ['Proto Indo-European', 'Albanian'],
                        ['Proto Indo-European', 'Thracian'],
                        ['Tocharian', 'Tocharian A'],
                        ['Tocharian', 'Tocharian B'],
                        ['Anatolian', 'Hittite'],
                        ['Anatolian', 'Palaic'],
                        ['Anatolian', 'Luwic'],
                        ['Anatolian', 'Lydian'],
                        ['Iranian', 'Balochi'],
                        ['Iranian', 'Kurdish'],
                        ['Iranian', 'Pashto'],
                        ['Iranian', 'Sogdian'],
                        ['Old Persian', 'Pahlavi'],
                        ['Middle Persian', 'Persian'],
                        ['Hellenic', 'Greek'],
                        ['Dardic', 'Dard'],
                        ['Sanskrit', 'Sindhi'],
                        ['Sanskrit', 'Romani'],
                        ['Sanskrit', 'Urdu'],
                        ['Sanskrit', 'Hindi'],
                        ['Sanskrit', 'Bihari'],
                        ['Sanskrit', 'Assamese'],
                        ['Sanskrit', 'Bengali'],
                        ['Sanskrit', 'Marathi'],
                        ['Sanskrit', 'Gujarati'],
                        ['Sanskrit', 'Punjabi'],
                        ['Sanskrit', 'Sinhalese'],
                        ['Osco-Umbrian', 'Umbrian'],
                        ['Osco-Umbrian', 'Oscan'],
                        ['Latino-Faliscan', 'Faliscan'],
                        ['Latin', 'Portugese'],
                        ['Latin', 'Spanish'],
                        ['Latin', 'French'],
                        ['Latin', 'Romanian'],
                        ['Latin', 'Italian'],
                        ['Latin', 'Catalan'],
                        ['Latin', 'Franco-Provençal'],
                        ['Latin', 'Rhaeto-Romance'],
                        ['Brythonic', 'Welsh'],
                        ['Brythonic', 'Breton'],
                        ['Brythonic', 'Cornish'],
                        ['Brythonic', 'Cuymbric'],
                        ['Goidelic', 'Modern Irish'],
                        ['Goidelic', 'Scottish Gaelic'],
                        ['Goidelic', 'Manx'],
                        ['East Germanic', 'Gothic'],
                        ['Middle Low German', 'Low German'],
                        ['Middle High German', '(High) German'],
                        ['Middle High German', 'Yiddish'],
                        ['Middle English', 'English'],
                        ['Middle Dutch', 'Hollandic'],
                        ['Middle Dutch', 'Flemish'],
                        ['Middle Dutch', 'Dutch'],
                        ['Middle Dutch', 'Limburgish'],
                        ['Middle Dutch', 'Brabantian'],
                        ['Middle Dutch', 'Rhinelandic'],
                        ['Old Frisian', 'Frisian'],
                        ['Middle Danish', 'Danish'],
                        ['Middle Swedish', 'Swedish'],
                        ['Middle Norwegian', 'Norwegian'],
                        ['Old Norse', 'Faroese'],
                        ['Old Icelandic', 'Icelandic'],
                        ['Baltic', 'Old Prussian'],
                        ['Baltic', 'Lithuanian'],
                        ['Baltic', 'Latvian'],
                        ['West Slavic', 'Polish'],
                        ['West Slavic', 'Slovak'],
                        ['West Slavic', 'Czech'],
                        ['West Slavic', 'Wendish'],
                        ['East Slavic', 'Bulgarian'],
                        ['East Slavic', 'Old Church Slavonic'],
                        ['East Slavic', 'Macedonian'],
                        ['East Slavic', 'Serbo-Croatian'],
                        ['East Slavic', 'Slovene'],
                        ['South Slavic', 'Russian'],
                        ['South Slavic', 'Ukrainian'],
                        ['South Slavic', 'Belarusian'],
                        ['South Slavic', 'Rusyn']
                    ]
                }]
            }, HmHighchart.TYPE_NETWORK);
    };

    /**
     * 데이터 바인딩 후 차트 갱신
     * @param chartDataArr
     */
    var updateBoundData = function(chartDataArr) {
        var type = this.chartId.split("_")[1];
        console.log("update this=", type);
        var noDataFlag = 0;
        if(chartDataArr != null && chartDataArr.length > 0) {

            var chartData = [];
            $.each(chartDataArr, function(idx, item) {
                noDataFlag = 1;
                if(type == "node"){
                    chartData.push([item.targetName, item.sourceName]);
                }
            });

            if(chartDataArr.length == 0){
                chartData = [''];
            }
            console.log(this.chart);

            this.chart.addSeries({data: chartData}, false);
            this.chart.redraw();

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

        var dataList = result.data;

        // if(this.chart.series) {
        //     this.chart.series[0].show();
        updateBoundData.call(this, dataList);
        // }
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