var timer = null;
var scndTimer = null;

var $preChart;
var $nowChart;


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var Main = {
    /** variable */
    initVariable: function () {

        $preChart = $("#preChart");
        $nowChart = $("#nowChart");

    },

    /** add event */
    observe: function () {

        $('div.more_2, #dashboard').bind('click', function (event) {
            Main.eventControl(event);
        });

        $('#btnEditUser').bind('click', function (event) {
        });

        $('div.evtProcess > div').on('click', function (event) {
            var ticketStateCd = $(event.currentTarget).attr('data-ticketStateCd') || '001';
            Main.showEvtTicket(ticketStateCd);
        });

    },

    /** event handler */
    eventControl: function (event) {

        var curTarget = event.currentTarget;

        switch (curTarget.id) {

            case 'dashboard':
                this.showNoticeBoard();
                break;

            case 'evtTicket':
                this.showEvtTicket(-1);
                break;

            case 'nBoard':
                this.showNoticeBoard();
                break;

            case 'jBoard':
                this.showScheduler();
                break;

            case 'fBoard':
                this.showSupportBoard();
                break;
        }
    },

    initChart: function () {

        Main.createChart('preChart');
        Main.createChart('nowChart');

        // preChart = new MainIfBpsChart('preChart');
        // preChart = initialize();

        // nowChart = new MainIfBpsChart('nowChart');
        // nowChart.initialize();
    },


    createChart: function (chart) {


        var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);
        options.boost = {useGPUTranslations: true};
        options.chart = {
            zoomType: 'x',
            resetZoomButton: {
                position: {
                    align: 'right', // by default
                    verticalAlign: 'top', // by default
                    x: -10,
                    y: 10
                },
                relativeTo: 'chart'
            }
        };
        options.xAxis = {
            type: 'datetime',
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
        };
        options.yAxis =
            {
                opposite: false,
                crosshair: true,
                showLastLabel: true,
                labels: {
                    formatter: HmHighchart.absUnit1000Formatter
                }
            };


        options.legend = {enabled: true};
        // options.events = {
        //     load: function () {
        //         makeSumSeries(this);
        //     }
        // };
        options.exporting = {
            enabled: true,
            // Custom definition
            menuItemDefinitions: {
                hmViewChartData: {
                    onclick: function () {
                        HmHighchart.showChartData(this, $(event.currentTarget).text());
                    },
                    text: '데이터보기'
                },
                hmDownloadPNG: {
                    onclick: function () {
                        var filename = 'chart_' + $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
                        HmUtil.exportHighchart(this, filename);
                    },
                    text: '다운로드'
                }
            },
            buttons: {
                contextButton: {
                    menuItems: ['viewFullscreen', 'hmViewChartData', 'printChart', 'hmDownloadPNG'],
                    verticalAlign: 'bottom',
                    y: -10
                }
            }
        };

        options.navigation = {
            buttonOptions: {
                enabled: true
            },
            menuItemStyle: {
                padding: '0.3em 1em'
            }
        }

        options.plotOptions = {
            line: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                connectNulls: true
            },
            series: {
                events: {
                    hide: function () {
                        // makeSumSeries(this.chart);
                    },
                    show: function () {
                        // makeSumSeries(this.chart);
                    }
                }
            }
        };

        options.tooltip = {
            shared: true,
            useHTML: true,
            formatter: HmHighchart.absUnit1000HtmlTooltipFormatter_main};

        options.series = [{name: 'NONE', data: null, lineWidth: 0.5}];

//			var hmOptions = $.extend(true, commOptions, options);
        HmHighchart.create(chart, options);


    },

    /** 공지 게시판 */
    showNoticeBoard: function () {
        HmUtil.createPopup('/main/board/pNoticeBoardList.do', $('#hForm'), 'pNoticeBoard', 700, 430);
    },


    initTrafficIf: function () {

        Server.get('/main/oms/mainBoard/getUserTrafficSumList.do', {
            data: {},
            success: function (result) {
                $("#grpName").html(result[0].grpName);
                $("#inBps1").html(HmUtil.convertUnit1000(result[0].if_1) == '0' ? '-' : HmUtil.convertUnit1000(result[0].if_1));
                $("#inBps2").html(HmUtil.convertUnit1000(result[0].if_2) == '0' ? '-' : HmUtil.convertUnit1000(result[0].if_2));
                $("#inBps3").html(HmUtil.convertUnit1000(result[0].if_3) == '0' ? '-' : HmUtil.convertUnit1000(result[0].if_3));
                $("#inBps4").html(HmUtil.convertUnit1000(result[0].if_4) == '0' ? '-' : HmUtil.convertUnit1000(result[0].if_4));
                $("#inBps5").html(HmUtil.convertUnit1000(result[0].if_5) == '0' ? '-' : HmUtil.convertUnit1000(result[0].if_5));

                $("#outBps1").html(HmUtil.convertUnit1000(result[1].if_1) == '0' ? '-' : HmUtil.convertUnit1000(result[1].if_1));
                $("#outBps2").html(HmUtil.convertUnit1000(result[1].if_2) == '0' ? '-' : HmUtil.convertUnit1000(result[1].if_2));
                $("#outBps3").html(HmUtil.convertUnit1000(result[1].if_3) == '0' ? '-' : HmUtil.convertUnit1000(result[1].if_3));
                $("#outBps4").html(HmUtil.convertUnit1000(result[1].if_4) == '0' ? '-' : HmUtil.convertUnit1000(result[1].if_4));
                $("#outBps5").html(HmUtil.convertUnit1000(result[1].if_5) == '0' ? '-' : HmUtil.convertUnit1000(result[1].if_5));
            }
        });

    },

    /** init design */
    initDesign: function () {

        Main.initChart();
        Main.initTrafficIf();

        HmDropDownList.create($('#sItemType_pre'), {
            source: HmResource.getResource('if_itemtype_main'), selectedIndex: 0
        });

        HmDropDownList.create($('#sItemType_now'), {
            source: HmResource.getResource('if_itemtype_main'), selectedIndex: 0
        });


        HmGrid.create($("#evtGrid"), {
            source: new $.jqx.dataAdapter({
                datatype: "json",
                url: $('#ctxPath').val() + '/main/oms/errStatus/getErrStatusList.do'
            }, {
                formatData: function (data) {
                    $.extend(data, {});
                    return data;
                }
            }),
            height: 186,
            width: 1120,
            columns: [
                {
                    text: '장애등급',
                    datafield: 'evtLevelStr',
                    width: 100,
                    filtertype: 'checkedlist',
                    cellsalign: 'center', align: 'center',
                    cellsrenderer: HmGrid.evtLevelrenderer
                },
                {text: '발생일시', datafield: 'ymdhms', cellsalign: 'right', align: 'center', width: 120},
                {
                    text: '그룹',
                    datafield: 'grpName',
                    width: 150
                },
                {text: '장애종류', datafield: 'srcTypeStr', cellsalign: 'center', width: 80},
                {text: '장애대상', datafield: 'srcInfo', minwidth: 250},
                {text: '이벤트명', datafield: 'evtName', width: 140},
                {text: '지속시간', datafield: 'sumSec', width: 150, cellsrenderer: HmGrid.cTimerenderer},
                {text: '장애상태', datafield: 'status', align: 'center', cellsalign: 'center', width: 100},
                {
                    text: '진행상태',
                    datafield: 'progressState',
                    align: 'center',
                    cellsalign: 'center',
                    width: 100,
                    hidden: true
                },
                {
                    text: '조치내역',
                    datafield: 'receiptMemo',
                    align: 'center',
                    cellsalign: 'right',
                    width: 100,
                    hidden: true
                },
                {text: '이벤트설명', datafield: 'limitDesc', align: 'center', cellsalign: 'right', width: 100, hidden: true}
            ]
        });


        $("#sItemType_pre").on('change', function (event) {
            Main.searchIfTrafficPrev();
        });

        $("#sItemType_now").on('change', function (event) {

            Main.searchIfTrafficNow();
        });

        Main.searchIfTrafficPrev();


    },


    /** init data */
    initData: function () {

        // 메인화면 새로고침
        if (timer != null)
            clearInterval(timer);
        //  180 -> 30분
        timer = setInterval(Main.refreshData, 1800 * 1000);
        Main.refreshData();


        if (scndTimer != null)
            clearInterval(scndTimer);

        //
        scndTimer = setInterval(Main.initTrafficIf, 300 * 1000);

        Main.initTrafficIf();

    },

    /* 메인화면 데이터 갱신 */
    refreshData: function () {
        Main.searchErrStatusList();
        Main.searchIfTrafficNow();
    },

    searchErrStatusList: function () {
        HmGrid.updateBoundData($("#evtGrid"), $('#ctxPath').val() + '/main/oms/errStatus/getErrStatusList.do');
    },


    searchIfTrafficPrev: function () {

        var ifchart = $preChart.highcharts();

        try {
            ifchart.hideNoData();
            ifchart.showLoading();
        } catch (err) {
        }


        Server.get('/main/oms/mainBoard/getMainIfTraffic_Previous.do', {
            data: {},
            success: function (result) {
                // var chartDataArr = [null, null, null];
                var map = new Map();
                for (var i = 0; i < result.length; i++) {
                    var userDevName = result[i].USER_DEV_NAME;
                    if (!map.has(userDevName)) {
                        var array = new Array();
                        map.set(result[i].USER_DEV_NAME, array);
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    var json = new Object();
                    json = {
                        dtYmdhms: result[i].dtYmdhms,
                        maxInBps: result[i].maxInBps,
                        maxOutBps: result[i].maxOutBps,
                    }
                    var jsonArray = map.get(result[i].USER_DEV_NAME);
                    jsonArray.push(json);
                    map.set(result[i].USER_DEV_NAME, jsonArray);
                }

                var preLabel = $("#sItemType_pre").jqxDropDownList('getSelectedItem').value;

                Main.searchChartResult(map, $preChart, preLabel);
                ifchart.hideLoading();
            }
        });

    },

    searchIfTrafficNow: function () {

        var ifchart = $nowChart.highcharts();

        try {
            ifchart.hideNoData();
            ifchart.showLoading();
        } catch (err) {

        }

        Server.get('/main/oms/mainBoard/getMainIfTraffic_Today.do', {
            data: {},
            success: function (result) {
                var map = new Map();
                for (var i = 0; i < result.length; i++) {
                    var userDevName = result[i].USER_DEV_NAME;
                    if (!map.has(userDevName)) {
                        var array = new Array();
                        map.set(result[i].USER_DEV_NAME, array);
                    }
                }

                for (var i = 0; i < result.length; i++) {
                    var json = new Object();
                    json = {
                        dtYmdhms: result[i].dtYmdhms,
                        maxInBps: result[i].maxInBps,
                        maxOutBps: result[i].maxOutBps,
                    }
                    var jsonArray = map.get(result[i].USER_DEV_NAME);
                    jsonArray.push(json);
                    map.set(result[i].USER_DEV_NAME, jsonArray);
                }

                var nowLabel = $("#sItemType_now").jqxDropDownList('getSelectedItem').value;

                Main.searchChartResult(map, $nowChart, nowLabel);
                ifchart.hideLoading();
            }
        });
    },


    // tooltipFormatFn: function(label, unit, value){
    //     var rVal = null;
    //     switch (label) {
    //         case 'BPS':
    //             rVal = HmUtil.convertUnit1000(value, true) + unit;
    //             break;
    //         case 'BPSPER':
    //             rVal = value + unit;
    //             break;
    //         case 'PPS':
    //             rVal = HmUtil.convertUnit1000(value, true) + unit;
    //             break;
    //         case 'ERR': case 'CRC': case 'COLLISION':
    //         rVal = value + unit;
    //         break;
    //         default:
    //             return;
    //     }
    //     return rVal;
    //
    // },


    searchChartResult: function (result, ifChart, label) {

        var ifPerfCmpChart = ifChart.highcharts();
        var chk = 0;
        try {
            ifPerfCmpChart.hideNoData();
        } catch (err) {
        }

        var len = ifPerfCmpChart.series.length;
        for (var i = len - 1; i >= 0; i--) {
            ifPerfCmpChart.series[i].remove();
        }

        var _label = label, _unit = null;
        ifPerfCmpChart.yAxis[0].axisTitle.attr({
            text: _label
        });

        // ifPerfCmpChart.tooltip.options.formatter = function () {
        //     var xyArr = [], ymd;
        //     $.each(this.points, function () {
        //         if (xyArr.length == 0) ymd = $.format.date(this.x, 'yyyy-MM-dd HH:mm:ss');
        //         if (this.series.name == '합계') {
        //             xyArr.unshift(this.series.name + ' : ' + Main.tooltipFormatFn(_label, _unit, this.y))
        //         } else {
        //             xyArr.push(this.series.name + ' : ' + Main.tooltipFormatFn(_label, _unit, this.y));
        //         }
        //     });
        //     xyArr.unshift(ymd);
        //     return xyArr.join('<br/>');
        // };

        result.forEach((val, idx, arr)=>{
            ifPerfCmpChart.addSeries({name: idx}, false);
            var chartData = [];
            for (var j = 0; j < val.length; j++) {
                chartData.push([val[j].dtYmdhms, label == "IN_BPS" ? parseInt(val[j].maxInBps) : parseInt(val[j].maxOutBps)]);
            }
            ifPerfCmpChart.series[chk].update({name: idx, data: chartData}, false);
            chk++;
        });
        // ifPerfCmpChart.addSeries({name: '합계', visible: false}, false);
        ifPerfCmpChart.redraw();

    },

};


function makeSumSeries(chart) {
    var series = chart.series,
        each = Highcharts.each,
        sum;
    series[series.length - 1].update({
        data: []
    }, false);


    var pointCnt = 0;

    var maxSeriesIdx = 0;
    var xDataTotal = [];
    each(series, function (v, i) {
        if (xDataTotal.length < v.data.length) xDataTotal = $.extend(xDataTotal, v.xData)
    });
    for (var i = 0; i < xDataTotal.length; i++) {
        sum = 0;
        each(series, function (p, k) {
            if (p.name !== '합계' && p.visible === true) {
                each(p.data, function (ob, j) {
                    if (ob.x === xDataTotal[i]) {
                        if (!isNaN(ob.y)) {
                            sum += ob.y;
                        }
                    }
                });
            }
        });
        series[series.length - 1].addPoint({
            y: parseInt(sum),
            x: xDataTotal[i]
        }, false);
    }
    chart.redraw();
}