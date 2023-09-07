/**
 * 네트워크(NMS) 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    /* CPU TopN */
    nmsHighCpuByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'perfVal', type: 'number', text: 'CPU', width: '20%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'CPU', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + '%';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'CPU', colorByPoint: true, xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'CPU', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        PieDonutChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'CPU', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        }
    },

    /* Memory TopN */
    nmsHighMemoryByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'perfVal', type: 'number', text: 'MEM', width: '20%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'MEM', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' %';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'MEM', colorByPoint: true, xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'MEM', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        },
        PieDonutChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: 'MEM', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '%'}
            ]
        }
    },

    /* 온도 TopN */
    nmsHighTempByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'perfVal', type: 'number', text: '온도(℃)', width: '20%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' ℃';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '온도', xField: 'devName', yField: 'perfVal', userUnit: '℃'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' ℃';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '온도', colorByPoint: true, xField: 'devName', yField: 'perfVal', userUnit: '℃'}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '온도', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '℃'}
            ]
        },
        PieDonutChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '온도', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: '℃'}
            ]
        }
    },

    /* 응답시간 TopN */
    nmsHighResptimeByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'perfVal', type: 'number', text: '응답시간', width: '20%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' ms';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '응답시간', xField: 'devName', yField: 'perfVal', userUnit: 'ms'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function() {
                        return this.value + ' ms';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '응답시간', colorByPoint: true, xField: 'devName', yField: 'perfVal', userUnit: 'ms'}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '응답시간', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: 'ms'}
            ]
        },
        PieDonutChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '응답시간', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal', userUnit: 'ms'}
            ]
        }
    },

    /* 세션 TopN */
    nmsHighSessionByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '장비명', width: '35%'},
            {name: 'devIp', type: 'string', text: '장비IP', width: '20%'},
            {name: 'perfVal', type: 'number', text: '세션', width: '20%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null}
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '세션', xField: 'devName', yField: 'perfVal'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '세션', colorByPoint: true, xField: 'devName', yField: 'perfVal'}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '세션', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal'}
            ]
        },
        PieDonutChart: {
            tooltip: {
                formatter: ChartFn.fnDevFormatter
            },
            series: [
                {name: '세션', colorByPoint: true, type: 'pie', xField: 'devName', yField: 'perfVal'}
            ]
        }
    },
    /* 장비 Traffic TopN */
    nmsHighTrafficByDev: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 100},
            {name: 'devName', type: 'string', text: '장비명', minwidth: 100},
            {name: 'ifName', type: 'string', text: '네트워크', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'inbps', type: 'number', text: 'IN BPS', width: 80, cellsrenderer: HmGrid.unit1000renderer},
            {name: 'outbps', type: 'number', text: 'OUT BPS', width: 80, cellsrenderer: HmGrid.unit1000renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        BarStackChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null}
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        ColumnStackChart: {
            chart: {type: 'column'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        }
    },
    /* Traffic TopN */
    nmsHighTrafficByIfGrp: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 100},
            {name: 'devName', type: 'string', text: '장비명', minwidth: 100},
            {name: 'ifName', type: 'string', text: '네트워크', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'inbps', type: 'number', text: 'IN BPS', width: 80, cellsrenderer: HmGrid.unit1000renderer},
            {name: 'outbps', type: 'number', text: 'OUT BPS', width: 80, cellsrenderer: HmGrid.unit1000renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        BarStackChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null}
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        },
        ColumnStackChart: {
            chart: {type: 'column'},
            tooltip: {
                shared: true,
                formatter: ChartFn.fnIfBpsFormatter
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        console.log(this);
                        return this.value;
                    }
                }
            },
            series: [
                {name: 'IN BPS', colorByPoint: false, xField: 'ifName', yField: 'inbps'},
                {name: 'OUT BPS', colorByPoint: false, xField: 'ifName', yField: 'outbps'}
            ]
        }
    }
});


var WidgetNmsControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
    this.ctrlNo = ctrlNo;
    this.objId = objId;
    this.ctrlDisplay = ctrlDisplay;
    this.ctrlUrl = ctrlUrl;
    this.serviceUrl = serviceUrl;
    this.ctxMenu = CtxMenu[ctxMenu];
    this.condList = condList;
    this.ctrlObj = null;
    this.dbData = [];
    this.ajaxReq = null;
    this.chartSeries = [];
};

WidgetNmsControl.prototype = function() {

    function create() {
        WidgetControlHelper.create(this);
    }

    /* ctrlUrl, ctrlDisplay에 따른 사용자 control options 리턴 */
    function getCtrlData(ctrlUrl, ctrlDisplay) {
        try {
            if(ctrlUrl === undefined) {
                ctrlUrl = this.ctrlUrl;
            }
            if(ctrlDisplay === undefined) {
                ctrlDisplay = this.ctrlDisplay;
            }
            var data = HmUtil.clone(HmWidgetConst.ctrlData[ctrlUrl][ctrlDisplay]);
            var ifInout = this.condList.filter(function(d) { return d.condKey == 'ifInout'; });
            // 회선 IN/OUT 조건이 있을때
            if(ifInout.length) {
                var convert = {
                    'IN': {name: 'IN BPS', yField: 'inbps'},
                    'OUT': {name: 'OUT BPS', yField: 'outbps'},
                    'SUM': {name: 'BPS', yField: 'bps'},
                    'IN_PER': {name: 'IN BPS', yField: 'inbpsPer', userUnit: '%'},
                    'OUT_PER': {name: 'OUT BPS', yField: 'outbpsPer', userUnit: '%'},
                    'SUM_PER': {name: 'BPS', yField: 'bpsPer', userUnit: '%'},
                    'IO': {},
                    'IO_PER': {userUnit: '%'}
                };
                if(ctrlDisplay == HmWidgetConst.ctrlDisplay.Grid.type) {
                    var bps_columns = data.filter(function(d) { return $.inArray(d.name, ['inbps', 'outbps']) !== -1;});
                    if($.inArray(ifInout[0].condVal, ['IN', 'OUT', 'IN_PER', 'OUT_PER', 'SUM', 'SUM_PER']) !== -1) {
                        data = data.slice(0, data.length-1);
                        data[data.length-1].name = convert[ifInout[0].condVal].yField;
                        data[data.length-1].text = convert[ifInout[0].condVal].name;
                        if(ifInout[0].condVal.endsWith('PER')) {
                            data[data.length-1].cellsrenderer = HmGrid.progressbarrenderer;
                        }
                    }
                    else {
                        if(ifInout[0].condVal.endsWith('IO_PER')) {
                            data[data.length-1].name += 'Per';
                            data[data.length-1].cellsrenderer = HmGrid.progressbarrenderer;
                            data[data.length-2].name += 'Per';
                            data[data.length-2].cellsrenderer = HmGrid.progressbarrenderer;
                        }
                    }
                }
                else {
                    // series => 1개
                    if($.inArray(ifInout[0].condVal, ['IN', 'OUT', 'IN_PER', 'OUT_PER', 'SUM', 'SUM_PER']) !== -1) {
                        data.series = data.series.slice(0, 1);
                        $.extend(data.series[0], convert[ifInout[0].condVal]);
                    }
                    // series => 2개
                    else if($.inArray(ifInout[0].condVal, ['IO_PER']) !== -1) {
                        $.each(data.series, function(i, v) {
                            v.yField = v.yField+'Per';
                            v.userUnit = '%';
                        });
                    }

                    // yAxis.labels.formatter
                    if(convert[ifInout[0].condVal].hasOwnProperty('userUnit') && convert[ifInout[0].condVal].userUnit == '%') {
                        $.extend(true, data, {
                            yAxis: {
                                labels: {
                                    formatter: function() {
                                        return this.value + ' %';
                                    }
                                }
                            }
                        });
                    } else {
                        $.extend(true, data, {
                            yAxis: {
                                labels: {
                                    formatter: function() {
                                        return HmUtil.convertUnit1000(this.value);
                                    }
                                }
                            }
                        });
                    }
                }
            }

            // console.log('chart_' + ctrlUrl, data);
            return data;
        } catch(e) {
            console.log("error", e);
            return null;
        }
    }

    /* 데이터 갱신 */
    function refreshData(params) {
        WidgetControlHelper.refreshData(this, params);
    }

    /* resize event handler (call highchart.reflow) */
    function resizeHandler() {
        WidgetControlHelper.resizeHandler(this);
    }

    /* export to excel */
    function exportExcel() {
        WidgetControlHelper.exportExcel(this);
    }

    /* 표시 형식이 변경될 경우 destory를 호출하여 제거 */
    function destroy() {
        WidgetControlHelper.destroy(this);
    }

    return {
        create: create,
        getCtrlData: getCtrlData,
        refreshData: refreshData,
        resizeHandler: resizeHandler,
        exportExcel: exportExcel,
        destroy: destroy
    }
}();
