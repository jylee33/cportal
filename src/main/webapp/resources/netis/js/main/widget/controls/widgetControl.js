/**
 * 위젯 대시보드 차트 Formatter 정의
 */
var ChartFn = {
    fnEvent_renderPieDonut: function() {
        // console.log("event.load", this, this.renderer);
        var chart = this,
            rend = chart.renderer,
            pie = chart.series[0],
            left = chart.plotLeft + (chart.plotBox.width/2),
            top = chart.plotTop + (chart.plotBox.height/2) + 10;
            // top = chart.plotTop + pie.center[1] + 10;

        if(pie == null) return;

        setTimeout(function() {
            if(chart.myText) {
                chart.myText.destroy();
            }
            if(pie.total == 0) return;
            chart.myText = rend.text(pie.total, left, top).attr({
                'text-anchor': 'middle',
                'zIndex': 10
            }).addClass('highcharts-pieCenterText').add();
        }, 1000);
    },
    fnUnit1000Tooltip: {
        formatter: function () {
            var s = '<b>' + this.key + '</b>';
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1000(this.y);
            if (this.series.type == 'pie') {
                s += '({0}%)'.substitute(this.percentage.toFixed(1));
            }
            return s;
        }
    },
    fnCTimeTooltip: {
        formatter: function () {
            var s = '<b>' + this.key + '</b>';
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertCTime(this.y);
            return s;
        }
    },
    fnCTimeFormatter: function() {
        return Math.floor(this.value / 60 / 60);
        //return HmUtil.convertCTime(this.value);
    },
    fnDevFormatter: function() {
        var _point = this.hasOwnProperty('points')? this.points[0].point : this.point;
        var s = '<tspan>그룹: ' + _point.grpName + '</tspan><br>'
            + '<tspan>장비명: ' + _point.devName + '</tspan><br>'
            + '<tspan>장비IP: ' + _point.devIp + '</tspan><br>'
            + '<tspan>' + _point.series.name + ': ' + this.y + ' ' + (_point.series.userOptions.userUnit || '</tspan>');
        return s;
    },
    fnDevCntFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan><b>그룹: ' + this.points[0].x + '</b></tspan><br>';
            $.each(this.points, function(i, v) {
                if(v.y > 0) {
                    s += '<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + '</span><br>';
                }
            });
            s += '<tspan><b>Total: ' + this.points[0].total + '</b></tspan>';
            return s;
        }
        // TODO 예외처리
        else if(this.series.type == 'pie'){
            var s = '<tspan><b>그룹: ' + this.point.name + '</b></tspan><br>';
            $.each(this.point.childrens, function(i,v) {
                if(v.hasOwnProperty('devCategory')) {
                    s += '<span>' + v.devCategory + ': ' + v.devCnt + '</span><br>';
                }
            });
            s += '<tspan><b>Total: ' + this.point.childrens.reduce(function(a, b) { return a + parseInt(b.devCnt); }, 0) + '</b></tspan>';
            return s;
        }
        return  null;
    },
    fnIfBpsFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                    + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                    + '<tspan>네트워크: ' + this.points[0].point.ifName + '</tspan><br>'
                    + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';
            $.each(this.points, function(i, v) {
                if(v.y > 0) {
                    if(_userUnit == '%') {
                        s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + ' %</span><br>';
                    }
                    else {
                        s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + HmUtil.convertUnit1000(v.y) + '</span><br>';
                    }
                }
            });
            if(this.points[0].hasOwnProperty('total') && this.points[0].total !== undefined) {
                if(_userUnit == '%') {
                    s += '<tspan><b>Total: ' + this.points[0].total + ' %</b></tspan>';
                } else {
                    s += '<tspan><b>Total: ' + HmUtil.convertUnit1000(this.points[0].total) + '</b></tspan>';
                }
            }
            return s;
        }
        return  null;
    },
    // SVR
    fnSvrProcessFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>'
                + '<tspan>프로세스: ' + this.points[0].point.processName + ' (' + this.points[0].point.pid + ')</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';
            $.each(this.points, function(i, v) {
                if(_userUnit == '%') {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + Math.abs(v.y) + ' %</span><br>';
                }
                else {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + Math.abs(v.y) + '</span><br>';
                }
            });
            return s;
        }
        return  null;
    },
    fnSvrMProcessFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>'
                + '<tspan>프로세스: ' + this.points[0].point.mprocName + '</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';
            $.each(this.points, function(i, v) {
                if(_userUnit == '%') {
                    s +='<span style="color: {0}">' +
                        ''.substitute(this.series.color) + v.series.name + ': ' + Math.abs(v.y) + ' %</span><br>';
                }
                else {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + Math.abs(v.y) + '</span><br>';
                }
            });
            return s;
        }
        return  null;
    },
    fnSvrFilesystemFormatter: function() {
        if(this.hasOwnProperty('points')) {
            var s = '<tspan>그룹: '.substitute(this.points[0].color) + this.points[0].point.grpName + '</tspan><br>'
                + '<tspan>장비: ' + this.points[0].point.devName + '</tspan><br>'
                + '<tspan>IP: ' + this.points[0].point.devIp + '</tspan><br>'
                + '<tspan>경로: ' + this.points[0].point.mountPoint + '</tspan><br>';
            var _userUnit = this.points[0].series.userOptions.userUnit || '';
            $.each(this.points, function(i, v) {
                if(_userUnit == '%') {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + ' %</span><br>';
                }
                else {
                    s +='<span style="color: {0}">'.substitute(this.series.color) + v.series.name + ': ' + v.y + '</span><br>';
                }
            });
            return s;
        }
        return  null;
    }
};

/**
 * 위젯 대시보드 코드 및 기초데이터 정의
 */
var HmWidgetConst = {
    // SYS_CODE
    ctrlType: {
        COM: {type: 'COM', label: '공통'},
        OMS: {type: 'OMS', label: '운영'},
        NMS: {type: 'NMS', label: '네트워크'},
        SMS: {type: 'SMS', label: '서버'},
        WNMS: {type: 'WNMS', label: '무선AP'},
        EDB: {type: 'EDB', label: '외부DB연동'}
    },

    // 표현
    ctrlDisplay: {
        Grid: {type: 'Grid', label: '그리드'},
        GridDetail: {type: 'GridDetail', label: '그리드(상세)'},
        BarChart: {type: 'BarChart', label: 'Bar차트'},
        BarStackChart: {type: 'BarStackChart', label: 'BarStack차트'},
        BarNegativeChart: {type: 'BarNegativeChart', label: 'BarNegative차트'},
        BarPerChart: {type: 'BarPerChart', label: 'Bar차트(%)'},
        ColumnChart: {type: 'ColumnChart', label: 'Column차트'},
        ColumnStackChart: {type: 'ColumnStackChart', label: 'ColumnStack차트'},
        PieChart: {type: 'PieChart', label: 'Pie차트'},
        PiePerChart: {type: 'PiePerChart', label: 'Pie차트(%)'},
        PieDonutChart: {type: 'PieDonutChart', label: 'PieDonut차트'},
        LineChart: {type: 'LineChart', label: 'Line차트'},
        SplineChart: {type: 'SplineChart', label: 'Spline차트'},
        AreaChart: {type: 'AreaChart', label: 'Area차트'},
        Gauge: {type: 'Gauge', label: '게이지'},
        SolidGaugeChart: {type: 'SolidGaugeChart', label: 'Solid게이지'},
        SpiderChart: {type: 'SpiderChart', label: 'Spider차트'},
        D3Topo: {type: 'D3Topo', label: '토폴로지'},
        StatUI: {type: 'StatUI', label: '통계화면'},
        StatUI_TeHu: {type: 'StatUI_TeHu', label: '통계화면 (온습도)'},
        SqlText: {type: 'SqlText', label: '값(텍스트)'},
        SqlGauge: {type: 'SqlGauge', label: '비율(게이지)'},
        CubeFix: {type: 'CubeFix', label: '큐브크기고정'},
        CubeResize: {type: 'CubeResize', label: '큐브크기변경'},
    },

    ctrlData: {}
};

var WidgetControlHelper = {

    /**
     * 위젯 표현유형(ctrlDisplay)에 따른 UI초기화 (create dom html)
     * @param widget
     */
    create: function(widget) {
        // WNMS 위젯의 경우 ColumChart를 timeChart로 생성한다. (예외!!)
        if(widget instanceof WidgetWnmsControl && widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.ColumnChart.type) {
            WidgetControlHelper.createTimeChart.call(widget);
            return;
        }
        switch(widget.ctrlDisplay) {
            case HmWidgetConst.ctrlDisplay.D3Topo.type:
                WidgetControlHelper.createTopology.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.StatUI.type:
                WidgetControlHelper.createStatUI.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.Grid.type:
            case HmWidgetConst.ctrlDisplay.GridDetail.type:
                WidgetControlHelper.createGrid.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.LineChart.type:
            case HmWidgetConst.ctrlDisplay.AreaChart.type:
                WidgetControlHelper.createTimeChart.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                WidgetControlHelper.createColumnChart.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.PiePerChart.type:
            case HmWidgetConst.ctrlDisplay.PieChart.type:
            case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
                WidgetControlHelper.createPieChart.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.BarPerChart.type:
            case HmWidgetConst.ctrlDisplay.BarChart.type:
            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
            case HmWidgetConst.ctrlDisplay.BarNegativeChart.type:
                WidgetControlHelper.createBarChart.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.SolidGaugeChart.type:
                WidgetControlHelper.createSolidGaugeChart.call(widget);
                break;
            case HmWidgetConst.ctrlDisplay.CubeFix.type:
            case HmWidgetConst.ctrlDisplay.CubeResize.type:
                WidgetControlHelper.createCube.call(widget);
                break;
        }
    },

    /**
     * 토폴로지 (svg)
     */
    createTopology: function() {
        var _widget = this;
        // debugger
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
            _widget.ctrlObj = new fn(_widget.objId);
            _widget.ctrlObj.createHtml();
            setTimeout(function() {
                /**
                 * condList에 condKey='topoGrpNo'인 데이터가 존재하면 표시하는 토폴로지의 최상위그룹으로 설정한다.
                 *  2020.09.11
                 *      log - viewScope='global'이고 auth='System' 계정이 아닌 경우 로그인계정의 권한으로 토폴로지 표현하도록 예외처리
                 *      author - jjung
                 */
                if(model.viewScope != null && model.viewScope == 'global' && $('#sAuth').val().toUpperCase() != 'SYSTEM') {
                    _widget.ctrlObj.start.call(_widget);
                }
                else {
                    var filter = _widget.condList.filter(function(d) { return d.condKey == 'topoGrpNo'; });
                    if(filter.length > 0) {
                        _widget.ctrlObj.start.call(_widget, parseInt(filter[0].condVal));
                    }
                    else { //권한에 따른 최상위그룹을 찾아 표시
                        _widget.ctrlObj.start.call(_widget);
                    }
                }
            }, 500);
        }
    },

    /**
     * 통계UI (svg)
     */
    createStatUI: function() {
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
            _widget.ctrlObj = new fn(_widget.objId);
            _widget.ctrlObj.createHtml();
        }
    },

    /**
     * Grid
     */
    createGrid: function() {
        try {
            var _widget = this;
            var datafields = _widget.getCtrlData.call(_widget);
            // exception
            try {
                if (_widget.ctrlUrl == 'comDevCntForDGrp') {
                    var column = datafields.filter(function (d) {return d.name == 'devCategory';});
                    datafields[0].width = '80%';
                    column[0].hidden = true;

                    $.each(_widget.condList, function (i, v) {
                        if (v.condKey == 'devCategory' && $.inArray(v.condVal, ['DEV_KIND2', 'VENDOR']) !== -1) {
                            datafields[0].width = '50%';
                            column[0].hidden = false;
                        }
                    });
                }
            } catch(e) {}
            var adapter = new HmDataAdapter('post', null, null).create();
            adapter.setDataFields(datafields);

            if(_widget.ctxMenu == 'EVENT') {
                _widget.ctrlObj = new HmJqxGrid(_widget.objId, adapter).create({pageable: false}, CtxMenu.NONE, _widget.objId);
                _widget.ctrlObj.grid
                    .on('contextmenu', function() { return false; })
                    .on('rowclick', function(event) {
                        var _grid = $(this);
                        if(event.args.rightclick) {
                            $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_svr').jqxMenu('close');
                            var targetMenu = null;
                            _grid.jqxGrid('selectrow', event.args.rowindex);
                            var idxes = _grid.jqxGrid('getselectedrowindexes');
                            var rowdata = _grid.jqxGrid('getrowdata', event.args.rowindex);
                            switch(rowdata.srcType) {
                                case 'DEV': targetMenu = $('#ctxmenu_dev'); break;
                                case 'SVR':targetMenu = $('#ctxmenu_svr'); break;
                                case 'IF': targetMenu = $('#ctxmenu_if'); break;
                                case 'AP': targetMenu = $('#ctxmenu_ap'); break;
                                case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
                                case 'SYSLOG': targetMenu = $('#ctxmenu_syslog'); break;
                                case 'TRAP': targetMenu = $('#ctxmenu_trap'); break;
                                default: targetMenu = $('#ctxmenu_evt'); break;
                            }

                            if(targetMenu != null) {
                                var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                                if($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                                    posY = $(window).height() - (targetMenu.height() + 10);
                                }
                                targetMenu.jqxMenu('open', posX, posY);
                            }
                            return false;
                        }
                    });
                $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_svr, #ctxmenu_config, #ctxmenu_trap').jqxMenu({
                    width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
                }).off('itemclick').on('itemclick', function(event) {
                    CtxMenu_Evt.selectDevCtxmenu(event, _widget.ctrlObj.grid);
                });
            }
            else {
                _widget.ctrlObj = new HmJqxGrid(_widget.objId, adapter).create({pageable: false}, _widget.ctxMenu, _widget.objId);
            }
        } catch(e) {
            console.log(e);
        }
    },

    /**
     * 시간대별 분석 차트
     */
    createTimeChart: function() {
        var _widget = this;
        var defOptions = {
            chart: { spacingTop: 20 }, // 차트 top 여백 추가
            yAxis: {
                crosshair: true,
                opposite: false,
                showLastLabel: true,
                labels: {formatter: HmHighchart.absUnit1000Formatter}
            },
            tooltip: {
                shared: true,
                useHTML: true,
                valueSuffix: ' %',
                formatter: HmHighchart.absUnit1000TooltipFormatter
            },
            legend: {enabled: false},
            exporting: {enabled: false},
            series: []
        };
        var ctrlOptions = _widget.getCtrlData.call(_widget);
        _widget.chartSeries = ctrlOptions.series;
        _widget.ctrlObj =
            HmHighchart.createStockChart(_widget.objId, $.extend(true, defOptions, ctrlOptions), HmHighchart.TYPE_AREA);
    },

    /**
     * Column 차트
     */
    createColumnChart: function() {
        var _widget = this;
        var defOptions = {
            chart: { type: 'column', spacingTop: 20 }, // 차트 top 여백 추가
            yAxis: {
                title: {text: null},
                crosshair: true,
                opposite: false,
                showLastLabel: true
            },
            tooltip: {
                shared: true,
                useHTML: true
            },
            legend: {enabled: false},
            exporting: {enabled: false},
            series: []
        };
        var ctrlOptions = _widget.getCtrlData.call(_widget);
        _widget.chartSeries = ctrlOptions.series;
        _widget.ctrlObj =
            HmHighchart.create2(_widget.objId, $.extend(true, defOptions, ctrlOptions), HmHighchart.TYPE_COLUMN);

        if(_widget.ctxMenu !== undefined) {
            CtxMenu.createHighchart(_widget.ctrlObj, _widget.ctxMenu, _widget.objId);
        }
    },

    /**
     * Bar 차트
     */
    createBarChart: function() {
        var _widget = this;
        var ctrlOptions = _widget.getCtrlData.call(_widget);
        _widget.chartSeries = ctrlOptions.series;
        this.ctrlObj =
            HmHighchart.create2(_widget.objId, $.extend({
                legend: {enabled: false},
                yAxis: {title: {text: null}}
            }, ctrlOptions), HmHighchart.TYPE_BAR);

        if(_widget.ctxMenu !== undefined) {
            CtxMenu.createHighchart(_widget.ctrlObj, _widget.ctxMenu, _widget.objId);
        }
    },

    /**
     * Pie 차트 / Donut 차트
     */
    createPieChart: function() {
        var _widget = this;
        var ctrlOptions = _widget.getCtrlData.call(_widget);
        _widget.chartSeries = ctrlOptions.series;
        if(_widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.PieDonutChart.type) {
            $.extend(true, ctrlOptions, {
                plotOptions: {
                    series: {
                        animation: true
                    },
                    pie: {
                        showInLegend: true,
                        dataLabels: {
                            enabled: false,
                            distance: '-20%'
                        },
                        innerSize: '50%'
                    }
                }
            });
        }

        _widget.ctrlObj =
            HmHighchart.create2(_widget.objId, $.extend({
                legend: {enabled: true, layout: 'vertical', align: 'left', verticalAlign: 'middle'}
            }, ctrlOptions), HmHighchart.TYPE_PIE);

        if(_widget.ctxMenu !== undefined) {
            CtxMenu.createHighchart(_widget.ctrlObj, _widget.ctxMenu, _widget.objId);
        }
    },

    /**
     * SolidGauge 차트
     */
    createSolidGaugeChart: function() {
        var _widget = this;
        var ctrlOptions = _widget.getCtrlData.call(_widget);
        _widget.chartSeries = ctrlOptions.series;
        _widget.ctrlObj =
            HmHighchart.create2(_widget.objId, $.extend({
                chart: {type: 'solidgauge'},
                pane: {
                    center: ['50%','80%'], size: '140%',
                    startAngle: -90, endAngle: 90,
                    background: {
                        backgroundColor: '#EEE',
                        innerRadius: '60%', outerRadius: '100%', shape: 'arc'
                    }
                },
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 10, borderWidth: 0, useHTML: true
                        }
                    }
                },
                tooltip: {enabled: false},
                yAxis: {
                    min: 0, max: 100,
                    tickWidth: 0,
                    tickAmount: 2,
                    minorTickInterval: null,
                    title: {text: null},
                    labels: {y: 15}
                }
            }, ctrlOptions), HmHighchart.TYPE_SOLIDGAUGE);

        if(_widget.ctxMenu !== undefined) {
            CtxMenu.createHighchart(_widget.ctrlObj, _widget.ctxMenu, _widget.objId);
        }
    },

    /**
     * Cube
     */
    createCube: function() {
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
            _widget.ctrlObj = new fn(_widget.objId, _widget.ctrlDisplay);
            _widget.ctrlObj.createHtml();
        }

    },

    /**
     * serviceUrl을 호출하여 데이터 갱신
     * @param widgetCtrl
     * @param params
     */
    refreshData: function(widgetCtrl, params) {
        try {
            var _widget = widgetCtrl;
            if(_widget.serviceUrl) {
                if(_widget.ajaxReq != null) {
                    _widget.ajaxReq.abort();
                }
                _widget.ajaxReq =
                    Server.post(_widget.serviceUrl, {
                        data: $.extend({ctrlNo: _widget.ctrlNo, ctrlDisplay: _widget.ctrlDisplay}, params),
                        success: function(result) {
                            WidgetControlHelper.refreshDataResult.call(_widget, result);
                        }
                    });
            }
        } catch(e) {
            console.log("[Error] refreshData, ", widgetCtrl.ctrlUrl);
        }
    },

    /**
     * refreshData의 callback function
     * @param result
     */
    refreshDataResult: function(result) {
        var _widget = this;

        // 예외처리
        if($.inArray(_widget.ctrlUrl, ['comDevCntForDGrp', 'comDevCntForSGrp']) !== -1) {
            var tmp = [];
            $.each(result, function(i, v) {
                tmp = tmp.concat(v.childrens);
            });
            _widget.dbData = tmp;
            if(_widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.Grid.type) {
                result = tmp;
            }
        }
        else {
            _widget.dbData = result;
        }

        if(result == null) {
            return;
        }

        switch(_widget.ctrlDisplay) {
            case HmWidgetConst.ctrlDisplay.StatUI.type:
            case HmWidgetConst.ctrlDisplay.StatUI_TeHu.type:
                _widget.ctrlObj.setData(result);
                break;
            case HmWidgetConst.ctrlDisplay.Grid.type:
            case HmWidgetConst.ctrlDisplay.GridDetail.type:
                _widget.ctrlObj.updateLocalData(result);
                break;
            case HmWidgetConst.ctrlDisplay.PieChart.type:
            case HmWidgetConst.ctrlDisplay.PiePerChart.type:
            case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
            case HmWidgetConst.ctrlDisplay.SolidGaugeChart.type:
                var chartData = {};
                var _series = _widget.ctrlObj.series;
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

                WidgetControlHelper.removeSeries(_widget.ctrlObj);
                for(var x in _widget.chartSeries) {
                    _widget.ctrlObj.addSeries($.extend({}, _widget.chartSeries[x], {data: chartData['data'+x]}), false);
                }
                // $.each(_series, function(si, sv) {
                //     HmHighchart.setSeriesData(_widget.objId, si, chartData['data'+si], false);
                // });
                HmHighchart.redraw(_widget.objId);
                break;
            case HmWidgetConst.ctrlDisplay.BarChart.type:
            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
            case HmWidgetConst.ctrlDisplay.SpiderChart.type:
                var chartData = {};
                var _series = _widget.ctrlObj.series;
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


                _widget.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                WidgetControlHelper.removeSeries(_widget.ctrlObj);
                for(var x in _widget.chartSeries) {
                    _widget.ctrlObj.addSeries($.extend({}, _widget.chartSeries[x], {data: chartData['data'+x]}), false);
                }
                // $.each(_series, function(si, sv) {
                //     HmHighchart.setSeriesData(_widget.objId, si, chartData['data'+si], false);
                // });
                HmHighchart.redraw(_widget.objId);
                break;
            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                if(_widget.ctrlUrl == 'comDevCntForDGrp' || _widget.ctrlUrl == 'comDevCntForSGrp') {
                    var chartData = {
                        categories: []
                    };
                    var _series = _widget.ctrlObj.series;
                    var xField = _series[0].userOptions.xField,
                        yField = _series[0].userOptions.yField,
                        seriesKey = _series[0].userOptions.userSeriesKey;

                    // seriesKey별 yField 배열 생성
                    var userSeries = [], userData = [], initArr = result.map(function (d) {
                        return 0;
                    });
                    $.each(result, function (i, v) {
                        chartData['categories'].push(v[xField]);
                        $.each(v.childrens, function (si, sv) {
                            if (userSeries.indexOf(sv[seriesKey] || sv[xField]) === -1) {
                                userSeries.push(sv[seriesKey] || sv[xField]);
                                userData[userSeries.length - 1] = initArr.slice();
                            }

                            var sidx = userSeries.indexOf(sv[seriesKey] || sv[xField]);
                            userData[sidx][i] = sv[yField];
                        });
                    });
                    _widget.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                    for (var i = _series.length - 1; i >= 0; i--) {
                        _widget.ctrlObj.series[i].remove(false);
                    }
                    $.each(userSeries, function (si, sv) {
                        _widget.ctrlObj.addSeries({
                            name: userSeries[si],
                            data: userData[si],
                            xField: xField,
                            yField: yField,
                            userSeriesKey: seriesKey
                        }, false);
                    });
                    HmHighchart.redraw(_widget.objId);
                }
                else {
                    var chartData = {};
                    var _series = _widget.ctrlObj.series;
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
                    _widget.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);

                    WidgetControlHelper.removeSeries(_widget.ctrlObj);
                    for(var x in _widget.chartSeries) {
                        _widget.ctrlObj.addSeries($.extend({}, _widget.chartSeries[x], {data: chartData['data'+x]}), false);
                    }
                    // $.each(_series, function(si, sv) {
                    //     HmHighchart.setSeriesData(_widget.objId, si, chartData['data'+si], false);
                    // });
                    HmHighchart.redraw(_widget.objId);
                }
                break;
            case HmWidgetConst.ctrlDisplay.BarNegativeChart.type:
                var chartData = {};
                var _series = _widget.ctrlObj.series;
                var xFieldArr = [], yFieldArr = [];
                $.each(_series, function(si, sv) {
                    xFieldArr.push(sv.userOptions.xField);
                    yFieldArr.push(sv.userOptions.yField);
                    chartData['categories'] = [];
                    chartData['data'+si] = [];
                });
                $.each(result, function(i, v) {
                    chartData['categories'].push(v[xFieldArr[0]].replace('\n','<br>'));
                    for(var sidx in xFieldArr) {
                        var _yField = yFieldArr[sidx];
                        var cloneV = HmUtil.clone(v);
                        cloneV.y = sidx == 0? -1 * v[_yField] : v[_yField];
                        chartData['data'+sidx].push(cloneV);
                    }
                });
                _widget.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                WidgetControlHelper.removeSeries(_widget.ctrlObj);
                for(var x in _widget.chartSeries) {
                    _widget.ctrlObj.addSeries($.extend({}, _widget.chartSeries[x], {data: chartData['data'+x]}), false);
                }
                // $.each(_series, function(si, sv) {
                //     HmHighchart.setSeriesData(_widget.objId, si, chartData['data'+si], false);
                // });
                HmHighchart.redraw(_widget.objId);
                break;
            case HmWidgetConst.ctrlDisplay.LineChart.type:
            case HmWidgetConst.ctrlDisplay.AreaChart.type:
                var chartData = {};
                var _series = _widget.ctrlObj.series;
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
                $.each(_series, function(si, sv) {
                    HmHighchart.setSeriesData(_widget.objId, si, chartData['data'+si], false);
                });
                HmHighchart.redraw(_widget.objId);
                break;
            case HmWidgetConst.ctrlDisplay.CubeFix.type:
            case HmWidgetConst.ctrlDisplay.CubeResize.type:
                _widget.ctrlObj.setData(result);
                break;
            case HmWidgetConst.ctrlDisplay.SqlText.type:
            case HmWidgetConst.ctrlDisplay.SqlGauge.type:
                _widget.ctrlObj.setData(result);
                break;
        }
    },

    removeSeries: function(chart, index) {
        try {
            if (index === undefined) {
                while (chart.series.length) {
                    chart.series[0].remove();
                }
            } else {
                chart.series[index].remove();
            }
        } catch(e) {
            console.log("[series remove error]", e);
        }
    },

    /* resize event handler (call highchart.reflow) */
    resizeHandler: function(widget) {
        console.log(widget.ctrlUrl, widget.ctrlDisplay);
        if (widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.StatUI.type) {
            widget.ctrlObj.resize();
        }
        else if (widget.ctrlDisplay.endsWith('Chart')) {
            widget.ctrlObj.reflow();
        }
        else if (widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.CubeFix.type
            || widget.ctrlDisplay == HmWidgetConst.ctrlDisplay.CubeResize.type) {
            //크기고정큐브 || 크기동적큐브
            widget.ctrlObj.resize();
        }
    },

    /* get excelExportData */
    getExcelData: function() {
        // var gridOptions = HmWidgetConst.ctrlData[this.ctrlUrl].Grid;
        var _ctrlDisplay = HmWidgetConst.ctrlDisplay.Grid.type;
        if(this.ctrlDisplay == HmWidgetConst.ctrlDisplay.GridDetail.type) {
            _ctrlDisplay = HmWidgetConst.ctrlDisplay.GridDetail.type;
        }
        var gridOptions = this.getCtrlData.call(this, this.ctrlUrl, _ctrlDisplay);
        var displayCols = gridOptions.filter(function(d) { return d.hasOwnProperty('text'); });
        var headerGrps = [],
            headers = [],
            data = this.dbData;

        $.each(displayCols, function(i, v) {
            var _cellsrenderer = null;
            if(v.cellsrenderer != null && v.cellsrenderer.prototype.hasOwnProperty('name')) {
                _cellsrenderer = v.cellsrenderer.prototype.name();
            }
            headers.push({text: v.text, datafield: v.name, width: 100, cellsrenderer: _cellsrenderer});
        });

        var title = $('div#'+this.objId.replace('Ctrl','')).find('.ctrlTitle').text().replace(/\s/ig,''),
            filename = title + '_' + $.format.date(new Date(),'yyyyMMdd');

        return {
            name: title,
            headerGrps: headerGrps,
            header: headers,
            data: data,
            filename: filename
        }
    },

    /* export to excel */
    exportExcel: function(widget) {
        var excelData = WidgetControlHelper.getExcelData.call(widget);
        HmUtil.exportData(excelData.headerGrps, excelData.header, excelData.data, excelData.filename);
    },

    /* 표시 형식이 변경될 경우 destory를 호출하여 제거 */
    destroy: function(widget) {
        try {
            // highchart
            if (widget.ctrlDisplay.endsWith('Chart')) {
                widget.ctrlObj.destroy();
            }
            // jqxgrid
            else if ($.inArray(widget.ctrlDisplay, [
                HmWidgetConst.ctrlDisplay.Grid.type,
                HmWidgetConst.ctrlDisplay.GridDetail.type]) !== -1) {
                widget.ctrlObj.destroy();
            }
            // other
            else {
                $('#' + widget.objId).empty();
            }
        } catch(e) {}
    }

};
