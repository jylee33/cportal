/**
 * 외부DB연동(EDB) 위젯 컨트롤
 */

$.extend(HmWidgetConst.ctrlData, {
    edbUserDefine: {
        Grid: [

        ],
        PieChart: {
            series: []
        },
        PieDonutChart: {
            series: []
        },
        BarChart: {
            series: []
        },
        ColumnChart: {
            series: []
        },
        SpiderChart: {
            series: []
        },
        BarStackChart: {
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: []
        },
        ColumnStackChart: {
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: []
        }
    }
});

var WidgetEdbControl = function(ctrlNo, objId, ctrlDisplay, ctrlUrl, serviceUrl, ctxMenu, condList, ctrlUserDefine) {
    this.ctrlNo = ctrlNo;
    this.objId = objId;
    this.ctrlDisplay = ctrlDisplay;
    this.ctrlUrl = ctrlUrl;
    this.serviceUrl = serviceUrl;
    this.ctxMenu = CtxMenu.NONE;
    this.condList = condList;
    this.ctrlUserDefine = ctrlUserDefine;
    this.ctrlObj = null;
    this.dbData = [];
    this.ajaxReq = null;
    this.chartSeries = [];
};

WidgetEdbControl.prototype = function() {

    function create() {
        switch (this.ctrlDisplay) {
            case HmWidgetConst.ctrlDisplay.Grid.type:
                createGrid.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.PieChart.type:
            case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
                WidgetControlHelper.createPieChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.BarChart.type:
            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
                WidgetControlHelper.createBarChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                WidgetControlHelper.createColumnChart.call(this);
                break;
            case HmWidgetConst.ctrlDisplay.SpiderChart.type:
                createSpiderChart.call(this);
                break;
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
            /**
             * ctrlDisplay=Chart인 경우에는 ctrlUserDefine (chart.series 속성 사용자정의) 속성을 차트옵션에 추가한다.
             */
            // if(ctrlDisplay == HmWidgetConst.ctrlDisplay.PieDonutChart.type) {
            //     /**
            //      * PieDonutChart이고 chart.events.render 속성 체크
            //      * @type {any}
            //      */
            //     var userDefine = JSON.parse(this.ctrlUserDefine);
            //     if(userDefine.hasOwnProperty('chart')) {
            //         var _chartOpts = userDefine.chart;
            //         if(_chartOpts.hasOwnProperty('events') && _chartOpts.events.render != null) {
            //             _chartOpts = {
            //                 type: 'pie', events: {render: ChartFn[_chartOpts.events.render.replace('ChartFn.','')]}
            //             };
            //         }
            //         delete userDefine.chart;
            //     }
            //     $.extend(data, {chart: _chartOpts}, userDefine);
            // }
            if(ctrlDisplay.endsWith("Chart")) {
                var userDefine = JSON.parse(this.ctrlUserDefine);
                try {
                    userDefine.chart.events.render = ChartFn[userDefine.chart.events.render];
                } catch(e){}
                $.extend(data, userDefine);
            }
            console.log("[getCtrlData]", data);
            return data;
        } catch(e) {
            console.log("error", e);
            return null;
        }
    }

    function createGrid() {
        var userDefine = JSON.parse(this.ctrlUserDefine);
        $.each(userDefine, function(i,v) {
            v.datafield = v.datafield.toUpperCase();
            if(v.hasOwnProperty('cellsrenderer') && v.cellsrenderer.length) {
                v.cellsrenderer = HmGrid[v.cellsrenderer];
            }
            else {
                delete v.cellsrenderer;
            }
        });

        var adapter = new HmDataAdapter('post', null, null).create();
        adapter.setDataFields(userDefine);
        this.ctrlObj = new HmJqxGrid(this.objId, adapter).create({pageable: false}, CtxMenu.NONE, this.objId);
    }

    /**
     * Spider 차트
     */
    function createSpiderChart() {
        var _widget = this;
        var defOptions = {
            chart: { type: 'column', spacingTop: 20, polar: true }, // 차트 top 여백 추가
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
    }

    /* 데이터 갱신
    *   /edb/getUserDefine.do 호출인 경우 응답값
    *   {
    *       metaDataList: [{}],     // resultSetMetaData 정보
    *       dataList: [{}]          // resultSet
    *   }
    */
    function refreshData(params) {
        var _this = this;
        if(this.serviceUrl) {
            if(_this.ajaxReq != null) {
                _this.ajaxReq.abort();
            }
            _this.ajaxReq =
                Server.post(this.serviceUrl, {
                    data: $.extend({ctrlNo: this.ctrlNo, ctrlDisplay: this.ctrlDisplay}, params),
                    success: function(result) {
                        switch(_this.ctrlDisplay) {
                            case HmWidgetConst.ctrlDisplay.Grid.type:
                                _this.dbData = result.dataList;
                                HmGrid.setLocalData(_this.ctrlObj.grid, result.dataList);
                                break;
                            case HmWidgetConst.ctrlDisplay.PieChart.type:
                            case HmWidgetConst.ctrlDisplay.PieDonutChart.type:
                            case HmWidgetConst.ctrlDisplay.BarChart.type:
                            case HmWidgetConst.ctrlDisplay.ColumnChart.type:
                            case HmWidgetConst.ctrlDisplay.SpiderChart.type:
                            case HmWidgetConst.ctrlDisplay.BarStackChart.type:
                            case HmWidgetConst.ctrlDisplay.ColumnStackChart.type:
                                WidgetControlHelper.refreshDataResult.call(_this, result.dataList);
                                break;
                        }
                        var alertContent = $('#' + _this.objId.replace('Ctrl','')).find('div.alertContent');
                        alertContent.css('display', 'none');
                    },
                    error: function(result) {
                        var alertContent = $('#' + _this.objId.replace('Ctrl','')).find('div.alertContent');
                        alertContent.find('span').html('데이터 조회중 에러가 발생하였습니다.<br/>' + result.errorInfo.message);
                        alertContent.css('display', 'table');
                    }
                });
        }
    }

    /* resize event handler (call highchart.reflow) */
    function resizeHandler() {
        WidgetControlHelper.resizeHandler(this);
    }

    /* get excelExportData
    *   동적생성 위젯에 대한 excel export 데이터를 예외적으로 생성한다.
    *       grid의 경우 columns속성을 이용하여 데이터 생성
    *       chart의 경우 series 정보를 기반으로 x/y축 데이터를 생성
    */
    function getExcelData() {
        var headerGrps = [],
            headers = [],
            data = this.dbData;
        if(this.ctrlDisplay == HmWidgetConst.ctrlDisplay.Grid.type) {
            var displayCols = this.ctrlObj.grid.jqxGrid('columns').records.filter(function(d) { return !d.hidden; });
            $.each(displayCols, function(i, v) {
                var _cellsrenderer = null;
                if(v.cellsrenderer != null && v.cellsrenderer.prototype.hasOwnProperty('name')) {
                    _cellsrenderer = v.cellsrenderer.prototype.name();
                }
                headers.push({text: v.text, datafield: v.datafield, width: 100, cellsrenderer: _cellsrenderer});
            });
        }
        else if(this.ctrlDisplay.endsWith("Chart")){
            headers.push({text: 'X축', datafield: this.ctrlObj.series[0].userOptions.xField, width: 100});
            $.each(this.ctrlObj.series, function(i,v) {
                headers.push({text: v.name || ('Series'+(i+1)), datafield: v.userOptions.yField, width: 100});
            });
        }

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
        WidgetControlHelper.destroy(this);
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
