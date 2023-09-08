/**
 * 서버(SMS) 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    /* 서버 CPU TopN */
    smsHighCpuBySvr: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '서버', width: '35%'},
            {name: 'devIp', type: 'string', text: 'IP', width: '20%'},
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
    /* 서버 Memory TopN */
    smsHighMemoryBySvr: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '25%'},
            {name: 'devName', type: 'string', text: '서버', width: '35%'},
            {name: 'devIp', type: 'string', text: 'IP', width: '20%'},
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
    /* 파일시스템 사용율 TopN */
    smsHighFilesystemBySvr: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 80},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'mountPoint', type: 'string', text: '경로', minwidth: 100},
            {name: 'usedPct', type: 'number', text: '사용율', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
            {name: 'totalSize', type: 'number', text: '전체량', width: 80, cellsrenderer: HmGrid.unit1024renderer},
            {name: 'usedSize', type: 'number', text: '사용량', width: 80, cellsrenderer: HmGrid.unit1024renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                // min: -100, max: 100,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrFilesystemFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: '사용율', colorByPoint: true, xField: 'devName', yField: 'usedPct', userUnit: '%'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrFilesystemFormatter
            },
            series: [
                {name: '사용율', colorByPoint: true, xField: 'devName', yField: 'usedPct', userUnit: '%'}
            ]
        }
    },
    /* 서버 Traffic TopN */
    smsHighTrafficBySvr: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 100},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
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
                        // console.log(this);
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
    /* 프로세스 CPU TopN */
    smsHighCpuByProcess: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 80},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
            {name: 'processName', type: 'string', text: '프로세스', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
            {name: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: HmGrid.progressbarrenderer}
        ],
        BarNegativeChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                min: -100, max: 100,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            legend: {
                enabled: true
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrProcessFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
                {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
            ]
        }
    },
    /* 프로세스 Memory TopN */
    smsHighMemoryByProcess: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 80},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
            {name: 'processName', type: 'string', text: '프로세스', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
            {name: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: HmGrid.progressbarrenderer}
        ],
        BarNegativeChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                min: -100, max: 100,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            legend: {
                enabled: true
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrProcessFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'},
                {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'}
            ]
        }
    },
    /* 감시프로세스 CPU TopN */
    smsHighCpuByMonitoringProcess: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 80},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
            {name: 'mprocName', type: 'string', text: '프로세스', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
            {name: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: HmGrid.progressbarrenderer}
        ],
        BarNegativeChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                min: -100, max: 100,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            legend: {
                enabled: true
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrMProcessFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'},
                {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'}
            ]
        }
    },
    /* 감시프로세스 Memory TopN */
    smsHighMemoryByMonitoringProcess: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: 80},
            {name: 'devName', type: 'string', text: '서버', minwidth: 100},
            {name: 'mprocName', type: 'string', text: '프로세스', minwidth: 100},
            {name: 'devIp', type: 'string', text: 'IP', width: 100},
            {name: 'memPct', type: 'number', text: 'MEM', width: 80, cellsrenderer: HmGrid.progressbarrenderer},
            {name: 'cpuPct', type: 'number', text: 'CPU', width: 80, cellsrenderer: HmGrid.progressbarrenderer}
        ],
        BarNegativeChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                min: -100, max: 100,
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + ' %';
                    }
                }
            },
            legend: {
                enabled: true
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnSvrMProcessFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: 'MEM', xField: 'disText', yField: 'memPct', userUnit: '%'},
                {name: 'CPU', xField: 'disText', yField: 'cpuPct', userUnit: '%'}
            ]
        }
    },
    /* VM 서버 상태 Cube */
    smsVMConnectStatus: {
        CubeFix: {
            controller: 'SmsVMConnectStatusController'
        },
        CubeResize: {
            controller: 'SmsVMConnectStatusController'
        }
    },
});


var WidgetSmsControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
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

WidgetSmsControl.prototype = function() {

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
