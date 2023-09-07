var IfRpt = {

    $ifGrid: null,
    timer: null,
    $grpTree: null,
    editRowIds: [],
    perfDateFormat: null,
    searchGrpNo: [],

    /** variable */
    initialize: function () {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
        this.initCondition();
    },

    initVariable: function () {
        this.$grpTree = $("#grpTree");
        this.$ifGrid = $("#ifGrid");
    },

    initCondition: function () {
        // 기간 (radio 조건)
        HmBoxCondition.createPeriod('', IfRpt.search, null);

        //업무시간
        HmDropDownList.create($('#cbTimeId'), {
            source: HmResource.getResource('perf_work_time_type'), selectedIndex: 0
        });

        //휴일, 공휴일 체크박스
        $('#ckDayOff, #ckHoliday').jqxCheckBox({height: 22, checked: false});

    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            IfRpt.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {

            case 'btnSearchIf':
                this.search();
                break;

            // case 'btnSearchDiv':
            //     this.searchDivTest();
            //     break;

            case 'btnExcelIf':
                this.exportExcel();
                break;

            case 'btnIfGroupPop':
                this.ifGroupPop();
                break;
        }
    },


    /** init design */
    initDesign: function () {


        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
            size: 400,
            collapsible: false
        }, {size: '100%'}], '100%', '100%');

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');

        HmTreeGrid.create(this.$grpTree, HmTree.T_GRP_IF, IfRpt.searchIfList);


        $('#cbUnit').jqxDropDownList({
            width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            source: [
                {label: '5분단위', value: '5M'}
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });


        HmGrid.create(this.$ifGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'strKey', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'grpNo', type: 'number'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'ifIdx', type: 'number'},
                        {name: 'ifName', type: 'string'},
                        {name: 'ifAlias', type: 'string'},
                        {name: 'lineWidth', type: 'string'},
                        {name: 'status', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {
                        var params = Master.getGrpTabParams();
                        var treeItem = HmTreeGrid.getSelectedItem(IfRpt.$grpTree);
                        $.extend(data, params, {
                            grpNo: treeItem !== null ? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
                        });
                        return data;
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '회선');
            },
            selectionmode: 'checkbox',
            width: '100%',
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', width: 70},
                    {text: '회선명', datafield: 'ifName', minwidth: 100, cellsrenderer: HmGrid.ifAliasrenderer},
                    {text: '대역폭', datafield: 'lineWidth', width: 50, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '상태', datafield: 'status', width: 80, cellsrenderer: HmGrid.ifStatusrenderer}
                ]
        });


    },

    /** init data */
    initData: function () {

    },

    /** App 그룹 */
    addGrp: function () {
        $.get(ctxPath + '/main/popup/env/pAppGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), 'APP그룹 등록', result, 350, 150);
        });
    },

    editGrp: function () {
        var row = HmGrid.getRowData(this.$grpGrid);
        if (row == null) {
            alert('그룹을 선택해주세요.');
            return;
        }

        $.post(ctxPath + '/main/popup/env/pAppGrpEdit.do',
            row,
            function (result) {
                HmWindow.open($('#pwindow'), 'APP그룹 수정', result, 350, 150);
            }
        );
    },


    exportExcel: function () {

        var _searchIfs = [];
        var _searchNms = [];

        var chartList = [];

        var rowIdxes = HmGrid.getRowIdxes(IfRpt.$ifGrid);

        $.each(rowIdxes, function (idx, value) {
            _searchIfs.push(IfRpt.$ifGrid.jqxGrid('getrowdata', value).strKey);
        });

        if (_searchIfs.length == 0) {
            alert('회선을 선택해주세요.');
            return;
        }

        var params = IfRpt.getCommParams();

        for (var i = 0; i < IfRpt.getChartDivIds("chartArea"); i++) {
            chartList.push($("#chart" + i));
            _searchNms.push($('#chart' + i).highcharts().title.textStr);
        }

        var treeItem = HmTreeGrid.getSelectedItem(this.$grpTree);

        $.extend(params, {
            searchIfs: _searchIfs,
            searchNms: _searchNms,
            searchNos : IfRpt.searchGrpNo,
            grpNo: treeItem !== null ? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0
        });

        console.log(params);

        HmUtil.saveMultiHighchart(chartList, IfRpt.exportExcel_after, params);

    },


    exportExcel_after: function (params) {

        HmUtil.exportExcel(ctxPath + '/main/rpt/dailyInspRpt/export.do', params);

    },

    /** 공통 파라미터 */
    getCommParams: function () {

        var params = HmBoxCondition.getPeriodParams();
        return params;

    },

    /** APP 설정 */
    search: function () {

        var _searchIfs = [];
        var _grpNos = [];

        var rowIdxes = HmGrid.getRowIdxes(IfRpt.$ifGrid);

        $.each(rowIdxes, function (idx, value) {
            _searchIfs.push(IfRpt.$ifGrid.jqxGrid('getrowdata', value).strKey);
            _grpNos.push(IfRpt.$ifGrid.jqxGrid('getrowdata', value).grpNo);
        });


        if (_searchIfs.length == 0) {
            alert('회선을 선택해주세요.');
            return;
        }

        var srcGrpName = HmTreeGrid.getSelectedItem(this.$grpTree);

        var params = IfRpt.getCommParams();

        $.extend(params, {
            searchIfs: _searchIfs,
            grpNos: [...new Set(_grpNos)
    ],
        timeId: $('#cbTimeId').val(),
            isDayOff
    :
        $('#ckDayOff').val() ? 1 : 0,
            isHoliday
    :
        $('#ckHoliday').val() ? 1 : 0
    })
        ;

        IfRpt.perfDateFormat = HmUtil.getPeriodDateFormat(params.period);
        console.log(params);

        Server.post('/main/rpt/dailyInspRpt/getPerfChartForIf.do', {
            data: params,
            success: function (result) {
                IfRpt.searchGrpNo = [];
                if (result != null && result.length > 0) IfRpt.drawChart(srcGrpName.grpName, result);
                else alert('검색된 데이터가 없습니다.');
            }
        });

        $('#chartArea').empty();

    },

    searchDivTest: function () {

        var chartDivIds = IfRpt.getChartDivIds("chartArea");
        console.log(chartDivIds);
    },


    drawChart: function (searchName, data) {
        // 차트 초기화
        for (var i = 0; i < data.length; i++) {
            var chartId = 'chart' + i;
            $('#chartArea').append('<div style="border: 1px solid #eeeeee; width: 99.5%; height: 200px; margin-bottom: 5px;"><div id="' + chartId + '" style="width: 100%; height: 100%;"></div></div>');

            var series = {
                series: [
                    {name: 'In bps', type: 'area', xField: 'dtYmdhms', yField: 'inbps'},
                    {name: 'Out bps', type: 'area', xField: 'dtYmdhms', yField: 'outbps'}
                ]
                , chartConfig: {unit: '1000'}
            };

            var userOptions = {
                chart: {
                    marginTop: 30,
                    marginBottom: 70
                },
                xAxis: {
                    type: "category",
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat(IfRpt.perfDateFormat, this.value);
                        }
                    },
                    // tickInterval: 3600 * 1000,
                }
            };

            $.extend(series, userOptions)
            var $chart = new CustomChart(chartId, HmHighchart.TYPE_AREA, series);
            $chart.initialize();

            // var title = data[i].devName + ' - ' + data[i].ifName;
            // var title = searchName;
            var title = data[i].grpName;

            IfRpt.searchGrpNo.push(data[i].grpNo);

            var chartData = {};
            var xFieldArr = [], yFieldArr = [];

            $.each(series.series, function (si, sv) {
                xFieldArr.push(sv.xField);
                yFieldArr.push(sv.yField);
                chartData[si] = [];
            });

            $.each(data[i].perfList, function (i, v) {
                for (var sidx in xFieldArr) {
                    var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                    chartData[sidx].push([v[_xField], v[_yField]]);
                }
            });

            $.each(series.series, function (si, sv) {
                HmHighchart.setSeriesData(chartId, si, chartData[si], false);
            });



            $('#' + chartId).highcharts().setTitle({
                text: title,
                style: {fontSize: '12px', fontWeight: 'bold'}
            });

            HmHighchart.redraw(chartId);
        }

    },


    searchIfList: function () {
        HmGrid.updateBoundData(IfRpt.$ifGrid, ctxPath + '/main/rpt/dailyInspRpt/getIfComboList.do');
    },

    ifGroupPop: function () {
        HmUtil.createPopup('/main/popup/nms/pIfGroupMgmt.do', $('#hForm'), ' pIfGroup', 1300, 700);
    },


    // 각 차트 DIV의 ID를 가져오는 함수
    getChartDivIds: function (containerId) {
        return $('#' + containerId).children('div').length;
    }


};