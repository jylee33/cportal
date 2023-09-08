/**
 * 무선(WNMS) 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    /* 전체 현황 */
    wnmsState: {
        Grid: [
            {name: 'kind', type: 'string', text: '구분', width: '50%'},
            {name: 'aliveCnt', type: 'number', text: 'Alive', width: '25%'},
            {name: 'totalCnt', type: 'number', text: 'Total', width: '25%'}
        ],
        StatUI: {
            controller: 'WnmsStateController'
        }
    },
    /* AP별 장애시간 TopN */
    wnmsEvtTimeTopByAp: {
        Grid: [
            {name: 'apName', type: 'string', text: 'AP명', width: '50%'},
            {name: 'evtSumSec', type: 'number', text: '장애시간', width: '50%', cellsrenderer: HmUtil.convertCTime}
        ],
        BarChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {formatter: ChartFn.fnCTimeFormatter}
            },
            tooltip: ChartFn.fnCTimeTooltip,
            series: [
                {name: '장애시간', xField: 'apName', yField: 'evtSumSec'}
            ]
        },
        PieChart: {
            tooltip: ChartFn.fnCTimeTooltip,
            series: [
                {name: '장애시간', colorByPoint: true, type: 'pie', xField: 'apName', yField: 'evtSumSec'}
            ]
        },
        PieDonutChart: {
            tooltip: ChartFn.fnCTimeTooltip,
            series: [
                {name: '장애시간', colorByPoint: true, type: 'pie', xField: 'apName', yField: 'evtSumSec'}
            ]
        }
    },
    /* 전체 클라이언트 추이 */
    wnmsClientAnalysis: {
        Grid: [
            {name: 'dt', type: 'number', text: '일시', width: '50%'},
            {name: 'connCnt', type: 'number', text: '접속수', width: '50%', cellsalign: 'right'}
        ],
        AreaChart: {
            chart: {type: 'area'},
            series: [
                {name: '접속수', xField: 'dt', yField: 'connCnt'}
            ]
        },
        LineChart: {
            chart: {type: 'line'},
            series: [
                {name: '접속수', xField: 'dt', yField: 'connCnt'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            series: [
                {name: '접속수', xField: 'dt', yField: 'connCnt'}
            ]
        }
    },
    /* 시간대별 최대 동접자 */
    wnmsMaxCCUByTime: {
        Grid: [
            {name: 'dt', type: 'number', text: '일시', width: '50%'},
            {name: 'ccuCnt', type: 'number', text: '최대동접자', width: '50%', cellsalign: 'right'}
        ],
        AreaChart: {
            chart: {type: 'area'},
            series: [
                {name: '최대동접자', xField: 'dt', yField: 'ccuCnt'}
            ]
        },
        LineChart: {
            chart: {type: 'line'},
            series: [
                {name: '최대동접자', xField: 'dt', yField: 'ccuCnt'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            series: [
                {name: '최대동접자', xField: 'dt', yField: 'ccuCnt'}
            ]
        }
    },
    /* 트래픽 사용량 추이 */
    wnmsTrafficAnalysis: {
        Grid: [
            {name: 'dt', type: 'number', text: '일시', width: '50%'},
            {name: 'byte', type: 'number', text: '사용량', width: '50%', cellsrenderer: HmGrid.unit1000renderer}
        ],
        AreaChart: {
            chart: {type: 'area'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        },
        LineChart: {
            chart: {type: 'line'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        }
    },
    /* 시간대별 최대 트래픽 */
    wnmsMaxTrafficByTime: {
        Grid: [
            {name: 'dt', type: 'number', text: '일시', width: '50%'},
            {name: 'byte', type: 'number', text: '사용량', width: '50%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        AreaChart: {
            chart: {type: 'area'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        },
        LineChart: {
            chart: {type: 'line'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        },
        ColumnChart: {
            chart: {type: 'column'},
            series: [
                {name: '사용량', xField: 'dt', yField: 'byte'}
            ]
        }
    },
    /* 클라이언트별 트래픽사용량 HighN */
    wnmsHighTrafficByClient: {
        Grid: [
            {name: 'connName', type: 'string', text: '접속자', width: '60%'},
            {name: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [
                {name: '사용량', colorByPoint: false, xField: 'connName', yField: 'byte'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connName', yField: 'byte'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connName', yField: 'byte'}]
        }
    },
    /* 클라이언트별 트래픽사용량 LowN */
    wnmsLowTrafficByClient: {
        Grid: [
            {name: 'connName', type: 'string', text: '접속자', width: '60%'},
            {name: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [
                {name: '사용량', colorByPoint: false, xField: 'connName', yField: 'byte'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connName', yField: 'byte'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connName', yField: 'byte'}]
        }
    },
    /* AP별 트래픽사용량 HighN */
    wnmsHighTrafficByAp: {
        Grid: [
            {name: 'apName', type: 'string', text: 'AP명', width: '60%'},
            {name: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [
                {name: '사용량', colorByPoint: false, xField: 'apName', yField: 'byte'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'apName', yField: 'byte'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'apName', yField: 'byte'}]
        }
    },
    /* AP별 트래픽사용량 LowN */
    wnmsLowTrafficByAp: {
        Grid: [
            {name: 'apName', type: 'string', text: 'AP명', width: '60%'},
            {name: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        BarChart: {
            chart: {type: 'bar'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [
                {name: '사용량', colorByPoint: false, xField: 'apName', yField: 'byte'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'apName', yField: 'byte'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'apName', yField: 'byte'}]
        }
    },
    /* AP별 클라이언트 HighN */
    wnmsHighClientByAp: {
        Grid: [
            {name: 'apName', type: 'string', text: 'AP명', width: '60%'},
            {name: 'connCnt', type: 'number', text: '접속수', width: '40%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            series: [
                {name: '접속수', colorByPoint: false, xField: 'apName', yField: 'connCnt'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'apName', yField: 'connCnt'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'apName', yField: 'connCnt'}]
        }
    },
    /* AP별 클라이언트 LowN */
    wnmsLowClientByAp: {
        Grid: [
            {name: 'apName', type: 'string', text: 'AP명', width: '60%'},
            {name: 'connCnt', type: 'number', text: '접속수', width: '40%', cellsalign: 'right'}
        ],
        BarChart: {
            chart: {type: 'bar'},
            series: [
                {name: '접속수', colorByPoint: false, xField: 'apName', yField: 'connCnt'}
            ]
        },
        PieChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'apName', yField: 'connCnt'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'apName', yField: 'connCnt'}]
        }
    },
    /* OS별 클라이언트 접속현황 */
    wnmsClientStateByOs: {
        Grid: [
            {name: 'connOsType', type: 'string', text: 'OS', width: '60%'},
            {name: 'connCnt', type: 'number', text: '접속수', width: '40%', cellsalign: 'right'}
        ],
        PieChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'connOsType', yField: 'connCnt'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            series: [{name: '접속수', colorByPoint: true, xField: 'connOsType', yField: 'connCnt'}]
        }
    },
    /* OS별 트래픽 사용현황 */
    wnmsTrafficStateByOs: {
        Grid: [
            {name: 'connOsType', type: 'string', text: 'OS', width: '60%'},
            {name: 'byte', type: 'number', text: '사용량', width: '40%', cellsrenderer: HmGrid.unit1024renderer}
        ],
        PieChart: {
            chart: {type: 'pie'},
            yAxis: {
                labels: {formatter: HmHighchart.unit1000Formatter}
            },
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connOsType', yField: 'byte'}]
        },
        PieDonutChart: {
            chart: {type: 'pie'},
            yAxis: {
                labels: {formatter: HmHighchart.unit1000Formatter}
            },
            tooltip: ChartFn.fnUnit1000Tooltip,
            series: [{name: '사용량', colorByPoint: true, xField: 'connOsType', yField: 'byte'}]
        }
    }
});


var WidgetWnmsControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
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

WidgetWnmsControl.prototype = function() {

    function create() {
        WidgetControlHelper.create(this);
    }

    function getCtrlData(ctrlUrl, ctrlDisplay) {
        try {
            if(ctrlUrl === undefined) {
                ctrlUrl = this.ctrlUrl;
            }
            if(ctrlDisplay === undefined) {
                ctrlDisplay = this.ctrlDisplay;
            }
            return HmWidgetConst.ctrlData[ctrlUrl][ctrlDisplay];
        } catch(e) {
            return null;
        }
    }

    /* 데이터 갱신 */
    function refreshData(params) {
        try {
            var _this = this;
            if (this.serviceUrl) {
                if(_this.ajaxReq != null) {
                    _this.ajaxReq.abort();
                }
                _this.ajaxReq =
                    Server.post(this.serviceUrl, {
                        data: $.extend({ctrlNo: _this.ctrlNo}, params),
                        success: function (result) {
                            _this.dbData = result;
                            // console.log(_this.ctrlUrl, result);
                            if(result == null) {
                                return;
                            }
                            switch(_this.ctrlDisplay) {
                                case HmWidgetConst.ctrlDisplay.StatUI.type:
                                    _this.ctrlObj.setData(result);
                                    break;
                                case HmWidgetConst.ctrlDisplay.Grid.type:
                                    _this.ctrlObj.updateLocalData(result);
                                    break;
                                case HmWidgetConst.ctrlDisplay.PieChart.type:
                                case HmWidgetConst.ctrlDisplay.PiePerChart.type:
                                case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
                                    var chartData = {};
                                    var _series = _this.ctrlObj.series;
                                    var xFieldArr = [], yFieldArr = [];
                                    $.each(_series, function(si, sv) {
                                        xFieldArr.push(sv.userOptions.xField);
                                        yFieldArr.push(sv.userOptions.yField);
                                        chartData['data'+si] = [];
                                    });
                                    $.each(result, function(i, v) {
                                        for(var sidx in xFieldArr) {
                                            var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                                            var cloneV = HmUtil.clone(v);
                                            cloneV.name = v[_xField];
                                            cloneV.y = v[_yField];
                                            chartData['data'+sidx].push(cloneV);
                                        }
                                    });
                                    WidgetControlHelper.removeSeries(_this.ctrlObj);
                                    for(var x in _this.chartSeries) {
                                        _this.ctrlObj.addSeries($.extend({}, _this.chartSeries[x], {data: chartData['data'+x]}), false);
                                    }
                                    // $.each(_series, function(si, sv) {
                                    //     HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                    // });
                                    HmHighchart.redraw(_this.objId);
                                    break;
                                case HmWidgetConst.ctrlDisplay.BarChart.type:
                                    var chartData = {};
                                    var _series = _this.ctrlObj.series;
                                    var xFieldArr = [], yFieldArr = [];
                                    $.each(_series, function(si, sv) {
                                        xFieldArr.push(sv.userOptions.xField);
                                        yFieldArr.push(sv.userOptions.yField);
                                        chartData['categories'] = [];
                                        chartData['data'+si] = [];
                                    });
                                    $.each(result, function(i, v) {
                                        chartData['categories'].push(v[xFieldArr[0]]);
                                        for(var sidx in xFieldArr) {
                                            var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                                            var cloneV = HmUtil.clone(v);
                                            cloneV.y = v[_yField];
                                            chartData['data'+sidx].push(cloneV);
                                        }
                                    });
                                    _this.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                                    WidgetControlHelper.removeSeries(_this.ctrlObj);
                                    for(var x in _this.chartSeries) {
                                        _this.ctrlObj.addSeries($.extend({}, _this.chartSeries[x], {data: chartData['data'+x]}), false);
                                    }
                                    // $.each(_series, function(si, sv) {
                                    //     HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                    // });
                                    HmHighchart.redraw(_this.objId);
                                    break;
                                case HmWidgetConst.ctrlDisplay.LineChart.type:
                                case HmWidgetConst.ctrlDisplay.AreaChart.type:
                                case HmWidgetConst.ctrlDisplay.ColumnChart.type:
                                    var chartData = {};
                                    var _series = _this.ctrlObj.series;
                                    var xFieldArr = [], yFieldArr = [];
                                    $.each(_series, function(si, sv) {
                                        xFieldArr.push(sv.userOptions.xField);
                                        yFieldArr.push(sv.userOptions.yField);
                                        chartData['data'+si] = [];
                                    });
                                    $.each(result, function(i, v) {
                                        for(var sidx in xFieldArr) {
                                            var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                                            chartData['data'+sidx].push([v[_xField], v[_yField]]);
                                        }
                                    });
                                    WidgetControlHelper.removeSeries(_this.ctrlObj);
                                    for(var x in _this.chartSeries) {
                                        _this.ctrlObj.addSeries($.extend({}, _this.chartSeries[x], {data: chartData['data'+x]}), false);
                                    }
                                    // $.each(_series, function(si, sv) {
                                    //     HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                    // });
                                    HmHighchart.redraw(_this.objId);
                                    break;
                            }
                        }
                    });
            }
        } catch(e){}
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
