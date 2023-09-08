/**
 * 공통 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    /* 토폴로지 */
    comTopology: {
        D3Topo: {
            controller: 'ComTopologyController'
        }
    },
    /* 이벤트 현황 */
    comEvtStatus: {
        Grid: [
            // {name: 'disEvtLevel', type: 'string', text: '장애등급', width: 80, cellsrenderer: HmGrid.evtLevelrenderer, cellsalign: 'center'},
            {name: 'evtLevelStr', type: 'string', text: '장애등급', width: 80, cellsrenderer: HmGrid.evtLevelrenderer, cellsalign: 'center'},
            {name: 'ymdhms', type: 'string', text: '발생일시', width: 140, cellsalign: 'center'},
            {name: 'srcInfo', type: 'number', text: '장애대상', minwidth: 200},
            {name: 'evtName', type: 'number', text: '이벤트명', width: 150},
            {name: 'sumSec', type: 'number', text: '지속시간', width: 150, cellsrenderer: HmGrid.cTimerenderer}
        ],
        GridDetail: [
            {name: 'disEvtLevel', type: 'string', text: '장애등급', width: 80, cellsrenderer: HmGrid.evtLevelrenderer, cellsalign: 'center'},
            {name: 'ymdhms', type: 'string', text: '발생일시', width: 140, cellsalign: 'center'},
            {name: 'grpName', type: 'string', text: '그룹', minwidth: 100},
            {name: 'disSrcType', type: 'string', text: '장애종류', width: 70, cellsalign: 'center'},
            {name: 'srcInfo', type: 'number', text: '장애대상', minwidth: 200},
            {name: 'evtName', type: 'number', text: '이벤트명', width: 150},
            {name: 'sumSec', type: 'number', text: '지속시간', width: 150, cellsrenderer: HmGrid.cTimerenderer},
            {name: 'disStatus', type: 'string', text: '장애상태', width: 70, cellsalign: 'center'},
            {name: 'progressState', type: 'string', text: '진행상태', width: 70, cellsalign: 'center'},
            {name: 'receiptMemo', type: 'string', text: '조치내역', width: 150},
            {name: 'limitDesc', type: 'string', text: '이벤트설명', width: 250}
        ],
        StatUI: {
            controller: 'ComEvtStatusController'
        }
    },
    /* 그룹별 장비수 */
    comDevCntForDGrp: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '50%'},
            {name: 'devCategory', type: 'string', text: '장비분류', width: '30%', hidden: true},
            {name: 'devCnt', type: 'number', text: '장비수', width: '20%', cellsalign: 'right'}
        ],
        BarStackChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function () {
                        return this.value + ' EA';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevCntFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: '장비수', colorByPoint: true, xField: 'grpName', yField: 'devCnt', userSeriesKey: 'devCategory', userUnit: ''}
            ]
        },
        ColumnStackChart: {
            chart: {type: 'column'},
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value + ' EA';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevCntFormatter
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: '장비수', colorByPoint: true, xField: 'grpName', yField: 'devCnt', userSeriesKey: 'devCategory', userUnit: ''}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevCntFormatter
            },
            series: [
                {name: '장비수', colorByPoint: true, type: 'pie', xField: 'grpName', yField: 'devCnt', userUnit: ''}
            ]
        },
        PieDonutChart: {
            chart: {
                events: {
                    render: ChartFn.fnEvent_renderPieDonut
                }
            },
            legend: {
                enabled: true,
                align: 'left',
                itemWidth: 150,
                // floating: 'true',
                verticalAlign: 'middle',
                symbolRadius: 1, // 사각형 모양
                layout: 'vertical'
            },
            tooltip: {
                formatter: ChartFn.fnDevCntFormatter
            },
            series: [
                {name: '장비수', colorByPoint: true, type: 'pie', xField: 'grpName', yField: 'devCnt', userUnit: ''}
            ]
        }
    },
    /* 조회그룹별 장비수 */
    comDevCntForSGrp: {
        Grid: [
            {name: 'grpName', type: 'string', text: '그룹', width: '50%'},
            {name: 'devCategory', type: 'string', text: '장비분류', width: '30%', hidden: true},
            {name: 'devCnt', type: 'number', text: '장비수', width: '20%', cellsalign: 'right'}
        ],
        BarStackChart: {
            chart: {type: 'bar'},
            yAxis: {
                title: {text: null},
                labels: {
                    formatter: function () {
                        return this.value + ' EA';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevCntFormatter
            },
            plotOptions: {
                bar: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: '장비수', colorByPoint: true, xField: 'grpName', yField: 'devCnt', userSeriesKey: 'devCategory', userUnit: ''}
            ]
        },
        ColumnStackChart: {
            chart: {type: 'column'},
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value + ' EA';
                    }
                }
            },
            tooltip: {
                shared: true,
                formatter: ChartFn.fnDevCntFormatter
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [
                {name: '장비수', colorByPoint: true, xField: 'grpName', yField: 'devCnt', userSeriesKey: 'devCategory', userUnit: ''}
            ]
        },
        PieChart: {
            tooltip: {
                formatter: ChartFn.fnDevCntFormatter
            },
            series: [
                {name: '장비수', colorByPoint: true, type: 'pie', xField: 'grpName', yField: 'devCnt', userUnit: ''}
            ]
        },
        PieDonutChart: {
            chart: {
                events: {
                    render: ChartFn.fnEvent_renderPieDonut
                }
            },
            legend: {
                enabled: true,
                align: 'left',
                itemWidth: 150,
                // floating: 'true',
                verticalAlign: 'middle',
                symbolRadius: 1, // 사각형 모양
                layout: 'vertical'
            },
            tooltip: {
                formatter: ChartFn.fnDevCntFormatter
            },
            series: [
                {name: '장비수', colorByPoint: true, type: 'pie', xField: 'grpName', yField: 'devCnt', userUnit: ''}
            ]
        }
    },
    /* Traffic TopN */
    comHighTraffic: {
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
    },
    comUserDefinedSql : {
        SqlText :{
            controller : 'ComUserDefinedSqlController'
        },
        SqlGauge :
        {
            controller : 'ComUserDefinedSqlController'
        }

    }
});

var WidgetComControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
    this.ctrlNo = ctrlNo;
    this.objId = objId;
    this.ctrlDisplay = ctrlDisplay;
    this.ctrlUrl = ctrlUrl;
    this.serviceUrl = serviceUrl;
    this.ctxMenu = ctxMenu == 'EVENT'? 'EVENT' : CtxMenu[ctxMenu];
    this.condList = condList;
    this.ctrlObj = null;
    this.dbData = [];
    this.ajaxReq = null;
    this.chartSeries = [];
};

WidgetComControl.prototype = function() {

    function create() {
        if(this.ctrlDisplay === HmWidgetConst.ctrlDisplay.SqlText.type || this.ctrlDisplay === HmWidgetConst.ctrlDisplay.SqlGauge.type){
            createTextUI.call(this);
        }else{
            WidgetControlHelper.create(this);

        }

    }


    //사용자 정의 SQL UI 생성
    function createTextUI() {
        var _widget = this;
        var ctrlData = _widget.getCtrlData.call(_widget);
        var _fn = typeof window[ctrlData.controller] === 'function';
        if(!_fn) {
            $.getScript('/js/main/widget/controls/{0}.js'.substitute(_widget.ctrlUrl), function (data) {
                var fn = window[ctrlData.controller];
                create(fn);
            });
        } else {
            var fn = window[ctrlData.controller];
            create(fn);
        }

        function create(fn) {
            console.dir(_widget);
            _widget.ctrlObj = new fn(_widget.objId, _widget.ctrlDisplay);
            _widget.ctrlObj.createHtml();
        }
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
                    'SUM_PER': {name: 'BPS', yField: 'bpsPer', userUnit: '%'}
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
                }
            }
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
