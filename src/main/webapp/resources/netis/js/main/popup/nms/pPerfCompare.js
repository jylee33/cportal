var pPerfCompare = {
    initialize: function () {

    },

    initDesign: function () {
        $('#pPerfCompare_splitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', showSplitBar: false, panels: [{ size: "50%" }, { size: '50%' }] });
        $('#pPerfCompare_splitter_sub1').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', showSplitBar: false, panels: [{ size: "50%" }, { size: '50%' }] });
        $('#pPerfCompare_splitter_sub2').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', showSplitBar: false, panels: [{ size: "50%" }, { size: '50%' }] });

        HmBoxCondition.createRadio($('#sPerfType_pPerfCompare'), HmResource.getResource('perf_compare_srch_type'));


        /*$('#sPerfType_pPerfCompare').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                { label: 'bps', value: 'BPS' },
                { label: 'pps', value: 'PPS' },
                { label: 'error', value: 'ERROR' }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function(event) {
            //event.args.item.value;
        });*/

    },

    resizeChart: function() {
        // 해당 탭이 열려있을때만 활성화
        if ($('#dtlTab').val() == 2) {
            var chartArr = ['perf_realtimeChart'];
            $.each(chartArr, function (idx, value) {
                pPerfCompare.createChart(value);
            });
            pPerfCompare.searchAll();
        }
    },

    initData: function() {
        pPerfCompare.createChart('compareChartBps', 'bps');
        pPerfCompare.createChart('compareChartBpsPer', 'bpsPer');
        pPerfCompare.createChart('compareChartPps', 'pps');

    },

    createChart: function (chartId, chartType) {
        var chartId = chartId;

        //compareChartBps compareChartBpsPer compareChartPps
        var chartType = chartType;
        var _tickInterval = HmBoxCondition.val('sPerfType_pPerfCompare') == 'DAY' ? 1 : 9;
        HmHighchart.createStockChart(chartId, {
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: false,
                    second: false,
                    minute: '%H:%M',
                    hour: '%H',
                    day: '%b-%e',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                },
                tickInterval: _tickInterval,
                /*type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m/%d',
                    week: '%b-%d',
                    month: '%y-%b',
                    year: '%Y'
                },*/
                tickColor:'#62686f',
                lineColor:'#62686f',
                gridLineColor:'#62686f',
                labels: {
                    style: {
                        //color: '#fff',
                        //fontSize:'10px'
                    },
                },
            },
            yAxis: {
                crosshair: true,
                opposite: false,
                showLastLabel: true,
                // max: 100,
                labels: {
                    formatter:  function () {
                        if(chartType == 'bpsPer'){
                            return this.value + ' %'
                        }else{
                            return  HmUtil.convertUnit1000(this.value);
                        }

                    }
                }
                /*labels: {
                    formatter: HmHighchart.absUnit1000Formatter
                }*/
            },
            /*legend: {
                floating: true,
                    enabled: true,
                    align: 'right',
                    verticalAlign: 'top',
                    layout: 'horizontal',
                    itemDistance: 6,
                    symbolPadding: 3,
                    padding: 6,
                    margin: 10,
                    itemStyle: {
                        fontSize: '10px'
                    }
            },*/
            tooltip: {
                shared: true,
                useHTML: true,
                //formatter: this.value
                formatter: function () {
                    var title = '';

                    for(var i=0; i<this.points.length; i++){
                        var colorVal = '#85ddf4';
                        if(this.points[i].point.test == '금일' || this.points[i].point.test == '금주'){
                            colorVal = '#f9899b'
                        }
                        //#85ddf4 하늘
                        //#f9899b 핑크
                        title += '<strong style="color: '+colorVal+'">'+this.points[i].point.name +'</strong>' +' '+ HmUtil.convertUnit1000(this.points[i].y);
                        title += '<br>'
                    }
                    //console.log(this)
                    return  title
                }
            },
            plotOptions : {
                line: {
                    lineWidth: 0.9
                }
            },
            series: []
        }, HmHighchart.TYPE_AREA);

        var timeInterval = HmBoxCondition.val('sPerfType_pPerfCompare');
        var params = {
            grpType: 'DEFAULT',
            grpNo: 1,
            mngNo: dtl_mngNo,//1
            ifIdx: dtl_ifIdx,//52
            chartType: chartType,
            timeInterval: timeInterval
        };
        var chart = $('#'+chartId).highcharts();

        var seriesNamePast = timeInterval == 'DAY' ? '전일' : '전주';
        var seriesNameNow = timeInterval == 'DAY' ? '금일' : '금주';

        chart.addSeries({ name: seriesNamePast }, false);
        chart.addSeries({ name: seriesNameNow }, false);

        Server.get('/main/popup/rawPerfChart/getIfPerfCompare.do', {
            data: params,
            success: function(result) {
                if(result != null){
                    var chartData = [];
                    var category = [];
                    $.each(result["past"], function(idx, item) { //전일 & 전주
                        //chartData.push([item.hh, item.val, seriesNamePast ]);
                        category.push(item.hh);
                        //chartData.push([item.hh, item.val, seriesNamePast ]);
                        chartData.push({ y: item.val , name: item.ymdhms2, test: seriesNamePast});
                    });

                    var chartData2 = [];
                    $.each(result["now"], function(idx, item) { //금일 & 금주
                        //chartData2.push([item.hh, item.val, seriesNameNow ]);
                        category.push(item.hh);
                        chartData2.push({  y: item.val , name: item.ymdhms2, test: seriesNameNow});
                        //chartData2.push([item.hh, item.val, seriesNamePast ]);
                    });


                    while (chart.series.length) {
                        chart.series[1].remove(false);
                        chart.series[0].remove(false);
                    }

                    chart.xAxis[0].setCategories(category, false);
                    chart.addSeries({data: chartData,name: seriesNamePast,lineWidth:2, marker: {enabled: false}, fillOpacity: 0.2}, false);
                    chart.addSeries({data: chartData2,name: seriesNameNow,lineWidth:2, marker: {enabled: false},fillOpacity: 0.2}, false);

                    chart.redraw();

                    /*chart.series[1].update({ name: seriesNameNow, data: chartData2 }, false);
                    HmHighchart.redraw(chartId);*/


                }else{
                    //데이터 없는 경우 y축 선 제거
                    $('#'+chartId).highcharts().yAxis[0].update({gridLineWidth: 0}, false);
                }
            }
        })
    },

}


function pwindow_close(){
    perf_realtimeChart = null;
}

$('#pPerfCompare_btnSearch').click(function(){
    pPerfCompare.initData();
})