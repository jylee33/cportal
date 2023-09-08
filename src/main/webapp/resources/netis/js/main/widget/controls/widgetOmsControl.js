/** TODO 작업 필요 */
$.extend(HmWidgetConst.ctrlData, {

});


var WidgetOmsControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList) {
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

WidgetOmsControl.prototype = function() {

    function create() {
        switch(this.ctrlDisplay) {
            case HmWidgetConst.ctrlDisplay.StatUI.type:
                createStatUI.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.Grid.type:
                createGrid.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.LineChart.type:
            case HmWidgetConst.ctrlDisplay.AreaChart.type:
                createTimeChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                createColumnChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.PiePerChart.type:
            case HmWidgetConst.ctrlDisplay.PieChart.type:
            case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
                createPieChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.BarPerChart.type:
            case HmWidgetConst.ctrlDisplay.BarChart.type:
            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
                createBarChart.call(this);
                break;
        }
    }

    /* ctrlUrl, ctrlDisplay에 따른 사용자 control options 리턴 */
    function getCtrlData() {
        try {
            return HmWidgetConst.ctrlData[this.ctrlUrl][this.ctrlDisplay];
        } catch(e) {
            return null;
        }
    }

    /**
     * 통계UI (svg)
     */
    function createStatUI() {
        var ctrlData = getCtrlData.call(this);
        var _this = this;
        var _fn = typeof window[ctrlData.controller] === 'function';
        if(!_fn) {
            $.getScript('/js/main/widget/controls/{0}.js'.substitute(_this.ctrlUrl), function (data) {
                var fn = window[ctrlData.controller];
                create(fn);
            });
        } else {
            var fn = window[ctrlData.controller];
            create(fn);
        }

        function create(fn) {
            _this.ctrlObj = new fn(_this.objId);
            _this.ctrlObj.createHtml();
        }
    }

    /**
     * Grid
     */
    function createGrid() {
        try {
            var datafields = getCtrlData.call(this);
            // exception
            try {
                var column = datafields.filter(function (d) {return d.name == 'devCategory';});
                datafields[0].width = '80%';
                column[0].hidden = true;
                if (this.ctrlUrl == 'nmsDevCntForDGrp') {
                    $.each(this.condList, function (i, v) {
                        if (v.condKey == 'devCategory' && $.inArray(v.condVal, ['DEV_KIND2', 'VENDOR']) !== -1) {
                            datafields[0].width = '50%';
                            column[0].hidden = false;
                        }
                    });
                }
            } catch(e) {}
            var adapter = new HmDataAdapter('post', null, null).create();
            adapter.setDataFields(datafields);
            this.ctrlObj = new HmJqxGrid(this.objId, adapter).create({pageable: false}, this.ctxMenu, this.objId);
        } catch(e) {
            console.log(e);
        }
    }

    /**
     * 시간대별 분석 차트
     */
    function createTimeChart() {
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
        var ctrlOptions = getCtrlData.call(this);
        this.ctrlObj =
            HmHighchart.createStockChart(this.objId, $.extend(true, defOptions, ctrlOptions), HmHighchart.TYPE_AREA);
    }

    /**
     * Column 차트
     */
    function createColumnChart() {
        var defOptions = {
            chart: { spacingTop: 20 }, // 차트 top 여백 추가
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
        var ctrlOptions = getCtrlData.call(this);
        this.ctrlObj =
            HmHighchart.create2(this.objId, $.extend(true, defOptions, ctrlOptions), HmHighchart.TYPE_COLUMN);

        if(this.ctxMenu !== undefined) {
            CtxMenu.createHighchart(this.ctrlObj, this.ctxMenu, this.objId);
        }
    }

    /**
     * Bar 차트
     */
    function createBarChart() {
        var ctrlOptions = getCtrlData.call(this);
        this.ctrlObj =
            HmHighchart.create2(this.objId, $.extend({
                legend: {enabled: false},
                yAxis: {title: {text: null}}
            }, ctrlOptions), HmHighchart.TYPE_BAR);

        if(this.ctxMenu !== undefined) {
            CtxMenu.createHighchart(this.ctrlObj, this.ctxMenu, this.objId);
        }
    }

    /**
     * Pie 차트 / Donut 차트
     */
    function createPieChart() {
        var ctrlOptions = getCtrlData.call(this);
        if(this.ctrlDisplay == HmWidgetConst.ctrlDisplay.PieDonutChart.type) {
            $.extend(true, ctrlOptions, {
                plotOptions: {
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
        // console.log(this.ctrlUrl, this.objId, ctrlOptions);
        this.ctrlObj =
            HmHighchart.create2(this.objId, $.extend({
                legend: {enabled: true, layout: 'vertical', align: 'left', verticalAlign: 'middle'}
            }, ctrlOptions), HmHighchart.TYPE_PIE);

        if(this.ctxMenu !== undefined) {
            CtxMenu.createHighchart(this.ctrlObj, this.ctxMenu, this.objId);
        }
    }

    /* 데이터 갱신 */
    function refreshData(params) {
        try {
            var _this = this;
            if (this.serviceUrl) {
                Server.post(this.serviceUrl, {
                    data: $.extend({ctrlNo: _this.ctrlNo}, params),
                    success: function (result) {
                        // 예외처리
                        if(_this.ctrlUrl == 'nmsDevCntForDGrp') {
                            var tmp = [];
                            $.each(result, function(i, v) {
                                tmp = tmp.concat(v.childrens);
                            });
                            _this.dbData = tmp;
                            if(_this.ctrlDisplay == HmWidgetConst.ctrlDisplay.Grid.type) {
                                result = tmp;
                            }
                        }
                        else {
                            _this.dbData = result;
                        }
                        console.log(_this.ctrlUrl, result);
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
                                        v.name = v[_xField];
                                        v.y = v[_yField];
                                        chartData['data'+sidx].push(v);
                                    }
                                });
                                $.each(_series, function(si, sv) {
                                    HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                });
                                HmHighchart.redraw(_this.objId);
                                break;
                            case HmWidgetConst.ctrlDisplay.BarChart.type:
                            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
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
                                        v.y = v[_yField];
                                        chartData['data'+sidx].push(v);
                                    }
                                });
                                _this.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                                $.each(_series, function(si, sv) {
                                    HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                });
                                HmHighchart.redraw(_this.objId);
                                break;
                            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
                            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                                var chartData = {
                                    categories: []
                                };
                                var _series = _this.ctrlObj.series;
                                var xField = _series[0].userOptions.xField,
                                    yField = _series[0].userOptions.yField,
                                    seriesKey = _series[0].userOptions.userSeriesKey;

                                // seriesKey별 yField 배열 생성
                                var userSeries = [], userData = [], initArr = result.map(function(d) { return 0; });
                                $.each(result, function(i, v) {
                                    chartData['categories'].push(v[xField]);
                                    $.each(v.childrens, function(si, sv) {
                                        if(userSeries.indexOf(sv[seriesKey] || sv[xField]) === -1) {
                                            userSeries.push(sv[seriesKey] || sv[xField]);
                                            userData[userSeries.length-1] = initArr.slice();
                                        }

                                        var sidx = userSeries.indexOf(sv[seriesKey] || sv[xField]);
                                        userData[sidx][i] = sv[yField];
                                    });
                                });
                                _this.ctrlObj.xAxis[0].setCategories(chartData['categories'], false);
                                for(var i = _series.length-1; i >= 0; i --) {
                                    _this.ctrlObj.series[i].remove(false);
                                }
                                $.each(userSeries, function(si, sv) {
                                    _this.ctrlObj.addSeries({name: userSeries[si], data: userData[si], xField: xField, yField: yField, userSeriesKey: seriesKey}, false);
                                });
                                console.log(userSeries, userData);
                                HmHighchart.redraw(_this.objId);
                                break;
                            case HmWidgetConst.ctrlDisplay.LineChart.type:
                            case HmWidgetConst.ctrlDisplay.AreaChart.type:
                            // case HmWidgetConst.ctrlDisplay.ColumnChart.type:
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
                                console.log(chartData);
                                $.each(_series, function(si, sv) {
                                    HmHighchart.setSeriesData(_this.objId, si, chartData['data'+si], false);
                                });
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
        if(this.ctrlDisplay == HmWidgetConst.ctrlDisplay.StatUI.type) {
            this.ctrlObj.resize();
        }
        else if(this.ctrlDisplay.endsWith('Chart')) {
            this.ctrlObj.reflow();
        }
    }

    /* get excelExportData */
    function getExcelData() {
        var gridOptions = HmWidgetConst.ctrlData[this.ctrlUrl].Grid;
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
    }

    /* export to excel */
    function exportExcel() {
        var excelData = getExcelData.call(this);
        HmUtil.exportData(excelData.headerGrps, excelData.header, excelData.data, excelData.filename);
    }

    /* 표시 형식이 변경될 경우 destory를 호출하여 제거 */
    function destroy() {
        // highchart
        if($.inArray(this.ctrlDisplay, [
            HmWidgetConst.ctrlDisplay.ColumnChart.type, HmWidgetConst.ctrlDisplay.AreaChart.type,
            HmWidgetConst.ctrlDisplay.LineChart.type,
            HmWidgetConst.ctrlDisplay.BarChart.type, HmWidgetConst.ctrlDisplay.BarPerChart.type,
            HmWidgetConst.ctrlDisplay.PieChart.type, HmWidgetConst.ctrlDisplay.PiePerChart.type,
            HmWidgetConst.ctrlDisplay.PieDonutChart.type]) !== -1) {
            this.ctrlObj.destroy();
        }
        // jqxgrid
        else if($.inArray(this.ctrlDisplay, [
            HmWidgetConst.ctrlDisplay.Grid.type,
            HmWidgetConst.ctrlDisplay.GridDetail.type]) !== -1) {
            this.ctrlObj.destroy();
        }
        // other
        else {
            $('#' + this.objId).empty();
        }
    }

    return {
        create: create,
        getCtrlData: getCtrlData,
        refreshData: refreshData,
        resizeHandler: resizeHandler,
        getExcelData: getExcelData,
        exportExcel: exportExcel,
        destroy: destroy
    }
}();
