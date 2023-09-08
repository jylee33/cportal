var $grpTree, $devGrid, $l7VirtualGrid, $l7RealGrid, $sessChart, $perfChart;
var currMngNo, currIdx, currGrpNm, currVirIdx, currSwitchType, currPartitionNm;
var Main = {
    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid'), $devGrid=$('#devGrid'), $l7VirtualGrid = $('#l7VirtualGrid'), $l7RealGrid = $('#l7RealGrid'), $sessChart = $('#sessChart'), $perfChart = $('#perfChart');
        this.initCondition();
    },

    initCondition: function() {
        HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
        HmBoxCondition.createRadio($('#sPerfCycle'), HmResource.getResource('cond_perf_cycle'));
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },


    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchDev(); break;
            case 'btnExcel': this.exportExcel(); break;
            case 'btnCList_sess': this.showChartData('sess'); break;
            case 'btnCSave_sess': this.saveChart('sess'); break;
            case 'btnCList_perf': this.showChartData('perf'); break;
            case 'btnCSave_perf': this.saveChart('perf'); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchDev();
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#pwindow'));
        HmWindow.create($('#p2window'));
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'L7SWITCH', isPerfFlag: 1});

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '60%', collapsible: false }, { size: '40%' }], 'auto', '100%');
        HmJqxSplitter.create($('#splitter2'), HmJqxSplitter.ORIENTATION_V, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%');
        HmJqxSplitter.create($('#splitter3'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmGrid.create($l7VirtualGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'svcNm', type: 'string' },
                        { name: 'disSvcNm', type: 'string' },
                        { name: 'grpNm', type: 'string' },
                        { name: 'idx', type: 'string' },
                        { name: 'ip', type: 'string' },
                        { name: 'portNum', type: 'integer' },
                        { name: 'portType', type: 'string' },
                        { name: 'disPortType', type: 'string' },
                        { name: 'disStatus', type: 'string' },
                        { name: 'avgSessCnt', type: 'number' },
                        { name: 'maxSessCnt', type: 'number' },
                        { name: 'avgCps', type: 'number' },
                        { name: 'maxCps', type: 'number' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        data.mngNo = currMngNo;
                        data.idx = currIdx;
                        data.switchType = currSwitchType;
                        data.partitionNm = currPartitionNm;
                        return data;
                    },
                    beforeLoadComplete: function(records) {
                        if(records != null) {
                            $.each(records, function(idx, item) {
                                // 서비스명 ascill 치환
                                item.svcNm = item.svcNm.replace(/\&quot\;/ig, '"');
                            });
                        }
                    },
                    loadComplete : function(record) {
                        $l7RealGrid.jqxGrid('clear');
                        if (record.hasOwnProperty('resultData')) {
                            var rowIdx =  HmGrid.getRowIdx($devGrid);

                            if(rowIdx !== false) {
                               var data = $devGrid.jqxGrid('getrowdata', rowIdx);
                               if(data.devKind2 == 'VIRTUAL'){
                                   $l7VirtualGrid.jqxGrid('selectrow', 0);
                                   console.log(data);
                                   Main.searchChart('VIRTUAL', $l7VirtualGrid.jqxGrid('getrowdata', 0));
                               }
                            }
                        }
                    }
                }
            ),
            showstatusbar: true,
            showaggregates: true,
            columns:
                [
                    { text: 'Virtual Server IP', datafield: 'ip', width: 120 },
                    { text: 'Protocol', datafield: 'disPortType', width: 100, cellsalign: 'center' },
                    { text: 'PORT', datafield: 'portNum', width: 80, cellsalign: 'right' },
                    { text: '서비스 그룹 이름', datafield: 'grpNm', width: 150, hidden: true },
                    { text: '서비스 이름', datafield: 'svcNm', minwidth: 150 },
                    { text: 'Status', datafield: 'disStatus', width: 100},
                    { text: "평균세션수", datafield: "avgSessCnt", width: 90, cellsalign: 'right', aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer },
                    { text: "최대세션수", datafield: "maxSessCnt", width: 90, cellsalign: 'right', aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer },
                    { text: "평균CPS", datafield: "avgCps", width: 80, cellsalign: 'right', aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer },
                    { text: "최대CPS", datafield: "maxCps", width: 80, cellsalign: 'right', aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer }
                ]
        }, CtxMenu.COMM, 'virtual');
        $l7VirtualGrid.on('rowdoubleclick', function(event) {
            currMngNo = event.args.row.bounddata.mngNo;
            currIdx = event.args.row.bounddata.idx;
            currGrpNm = event.args.row.bounddata.grpNm;
            Main.resetChart();
            Main.searchRealSvr();
            Main.searchChart('VIRTUAL', event.args.row.bounddata);
        });


        HmGrid.create($l7RealGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'svrNm', type: 'string' },
                        { name: 'idx', type: 'string' },
                        { name: 'ip', type: 'string' },
                        { name: 'portNum', type: 'integer' },
                        { name: 'disStatus', type: 'string' },
                        { name: 'portType', type: 'string' },
                        { name: 'disPortType', type: 'string' },
                        { name: 'avgSessCnt', type: 'number' },
                        { name: 'maxSessCnt', type: 'number' },
                        { name: 'avgCps', type: 'number' },
                        { name: 'maxCps', type: 'number' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        data.mngNo = currMngNo;
                        data.grpNm = currGrpNm;
                        return data;
                    }
                }
            ),
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns:
                [
                    { text: 'Real Server', datafield: 'svrNm', minwidth: 150 },
                    { text: 'Real Server IP', datafield: 'ip', width: 120 },
                    { text: 'Protocol', datafield: 'disPortType', width: 100, cellsalign: 'center' },
                    { text: 'PORT', datafield: 'portNum', width: 80, cellsalign: 'right'  },
                    { text: 'Status', datafield: 'disStatus', width: 100, cellsalign: 'right' },
                    { text: "평균세션수", datafield: "avgSessCnt", width: 90, cellsalign: 'right' },
                    { text: "최대세션수", datafield: "maxSessCnt", width: 90, cellsalign: 'right' },
                    { text: "평균CPS", datafield: "avgCps", width: 80, cellsalign: 'right' },
                    { text: "최대CPS", datafield: "maxCps", width: 80, cellsalign: 'right' }
                ]
        }, CtxMenu.COMM, 'real');
        $l7RealGrid.on('rowdoubleclick', function(event) {
            Main.resetChart();
            Main.searchChart('REAL', event.args.row.bounddata);
        });

        Main.drawChart();



        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        { name: 'grpName', type: 'string' },
                        { name: 'devName', type: 'string' },
                        { name: 'groupDevName', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'mngNo', type: 'number' },
                        { name: 'idx', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete: function(records) {
                        $l7VirtualGrid.jqxGrid('clear');
                        $l7RealGrid.jqxGrid('clear');
                        Main.resetChart();
                    }
                }
            ),
            groupable: true,
            showgroupsheader: false,
            groups: ['mngNo'],
            groupsrenderer: function (text, group, expanded, data) {
                var tmp = data.subItems[0];
                return '<div class="jqx-grid-groups-row" style="position: absolute;">' +
                    '<span>' + '장비명: {0}'.substitute(tmp.groupDevName) + '</span>'
            },
            columns:
                [
                    { text: '장비번호', datafield: 'mngNo', idth: 150, hidden: true },
                    { text: '그룹', datafield: 'grpName', minwidth: 150 },
                    { text: '장비', datafield: 'devName', width: 130},
                    { text: '종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist' },
                    { text: '장비IP', datafield: 'devIp', width: 120},
                ]
        });
        $devGrid.on('rowdoubleclick', function(event) {

            if(event.args.group !== undefined){
                currMngNo = event.args.group;
            }else{
                var rowdata = event.args.row.bounddata;
                currMngNo = rowdata.mngNo;
                currIdx = rowdata.idx;
                currSwitchType = rowdata.devKind2;
                currPartitionNm = rowdata.devKind2 == 'VIRTUAL'? rowdata.devName : null;
            }
            Main.resetChart();
            Main.searchVirtualSvr();
        });
        // $devGrid.on('click', '.jqx-grid-group-cell .jqx-grid-groups-row', function () {
        //     var id = parseInt($(this).parent().parent().attr('id').substring(3));
        //     var group = $devGrid.jqxGrid('getgroup', id);
        //     if(!!group.expanded){
        //         $devGrid.jqxGrid('collapsegroup', id);
        //     }else{
        //         $devGrid.jqxGrid('expandgroup', id);
        //     }
        // });

    },

    /** init data */
    initData: function() {

    },

    /** 공통 파라미터 */
    getCommParams: function() {
        var params = Master.getDefGrpParams($grpTree);
        $.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams(), {
            perfCycle: HmBoxCondition.val('sPerfCycle')
        });
        return params;
    },

    /** 그룹트리 선택이벤트 */
    selectTree: function() {
        Main.searchDev();
    },


    /** 조회 */
    searchDev: function() {
        //Master.refreshCbPeriod($('#cbPeriod'));
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/l7Session/getL7DevList.do');
    },

    /** 조회 */
    searchVirtualSvr: function() {
        HmGrid.updateBoundData($l7VirtualGrid, ctxPath + '/main/nms/l7Session/getL7VirtualSvrStatusList.do');
    },

    /** 조회 */
    searchRealSvr: function() {
        HmGrid.updateBoundData($l7RealGrid, ctxPath + '/main/nms/l7Session/getL7RealSvrStatusList.do');
    },

    resetChart: function(){
        var sessChart = $sessChart.highcharts(),
            perfChart = $perfChart.highcharts();
        if(sessChart === undefined || perfChart === undefined) return;
        for(var i = 0; i < sessChart.series.length; i++) {
            sessChart.series[i].setData(null, false);
        }
        for(var i = 0; i < perfChart.series.length; i++) {
            perfChart.series[i].setData(null, false);
        }
        sessChart.title.update({text: ''});
        perfChart.title.update({text: ''});
        sessChart.redraw();
        perfChart.redraw();
    },
    /** 차트 조회 */
    searchChart: function(type, rowdata) {
        this.resetChart();
        if(rowdata == null) return;

        var params = {
            mngNo: rowdata.mngNo,
            idx: rowdata.idx,
            ip: rowdata.ip,
            portType: rowdata.portType,
            portNum: rowdata.portNum,
            date1: HmDate.getDateStr($('#date1')),
            time1: HmDate.getTimeStr($('#date1')),
            date2: HmDate.getDateStr($('#date2')),
            time2: HmDate.getTimeStr($('#date2')),
            perfCycle: $('#p_cbPerfCycle').val()
        };
        switch(type){
            case 'VIRTUAL':
                var sessChart = $('#sessChart').highcharts();
                var perfChart = $('#perfChart').highcharts();
                Server.get('/main/nms/l7Session/getL7VirtualSvrChartList.do', {
                    data: params,
                    success: function(result) {
                        var chartData = {
                            avgSess: [], maxSess: [],
                            avgCps: [], maxCps: []
                        };
                        $.each(result, function(idx, value){
                            chartData.avgSess.push([value.date, parseFloat(value.avgSessCnt)]);
                            chartData.maxSess.push([value.date, parseFloat(value.maxSessCnt)]);
                            chartData.avgCps.push([value.date, parseFloat(value.avgCps)]);
                            chartData.maxCps.push([value.date, parseFloat(value.maxCps)]);
                        });

                        sessChart.title.update({text: 'Virtual ' + rowdata.ip +' '+rowdata.disPortType + ' ' + rowdata.portNum});
                        sessChart.series[0].update({data: chartData.avgSess}, false);
                        sessChart.series[1].update({data: chartData.maxSess, visible: $('#p_cbPerfCycle').val()!=1}, false);
                        perfChart.title.update({text: 'Virtual ' + rowdata.ip +' '+rowdata.disPortType + ' ' + rowdata.portNum});
                        perfChart.series[0].update({data: chartData.avgCps}, false);
                        perfChart.series[1].update({data: chartData.maxCps, visible: $('#p_cbPerfCycle').val()!=1}, false);

                        sessChart.redraw();
                        perfChart.redraw();
                    }
                });

                break;
            case 'REAL':
                var sessChart = $('#sessChart').highcharts();
                var perfChart = $('#perfChart').highcharts();
                Server.get('/main/nms/l7Session/getL7RealSvrChartList.do', {
                    data: params,
                    success: function(result) {

                        var chartData = {
                            avgSess: [], maxSess: [],
                            avgCps: [], maxCps: []
                        };
                        $.each(result, function(idx, value){
                            chartData.avgSess.push([value.date, parseFloat(value.avgSessCnt)]);
                            chartData.maxSess.push([value.date, parseFloat(value.maxSessCnt)]);
                            chartData.avgCps.push([value.date, parseFloat(value.avgCps)]);
                            chartData.maxCps.push([value.date, parseFloat(value.maxCps)]);
                        });
                        sessChart.title.update({text: 'Real ' + rowdata.ip +' '+rowdata.disPortType + ' ' + rowdata.portNum});
                        sessChart.series[0].update({data: chartData.avgSess}, false);
                        sessChart.series[1].update({data: chartData.maxSess, visible: $('#p_cbPerfCycle').val()!=1}, false);
                        perfChart.title.update({text: 'Real ' + rowdata.ip +' '+rowdata.disPortType + ' ' + rowdata.portNum});
                        perfChart.series[0].update({data: chartData.avgCps}, false);
                        perfChart.series[1].update({data: chartData.maxCps, visible: $('#p_cbPerfCycle').val()!=1}, false);
                        sessChart.redraw();
                        perfChart.redraw();
                    }
                });

                break;
        }

    },

    drawChart: function(){
        var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);
        options.boost= {useGPUTranslations: true};
        options.chart= {
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

        options.legend= { enabled: true };
        options.plotOptions = {
            line: {
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                connectNulls: true
            }
        };
        options.series= [{name: '평균'}, { name: '최대', type: HmHighchart.TYPE_LINE, marker: { enabled: true, symbol: 'circle' }, lineWidth:0, states: { hover: { lineWidthPlus: 0 } }}];
        options.yAxis = {title:{text: '세션'}};
        HmHighchart.create('sessChart', options);

        options.series= [{name: '평균'}, { name: '최대', type: HmHighchart.TYPE_LINE, marker: { enabled: true, symbol: 'circle' }, lineWidth:0, states: { hover: { lineWidthPlus: 0 } }}];
        options.yAxis = {title:{text: 'CPS'}};
        HmHighchart.create('perfChart', options);
    },

    /** export 엑셀 */
    exportExcel: function() {
        HmUtil.exportGrid($l7VirtualGrid, 'L4세션', false);
        return;

        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/nms/l4Session/export.do', params);
    },

    /** 차트 데이터보기 */
    showChartData: function(type) {
        var chart = type == 'sess'? $sessChart.highcharts() : $perfChart.highcharts();
        var cols, chartData = [];
        cols = [
            { text: '일시', datafield: 'ymdhms', cellsalign: 'center', minwidth: 160 }
        ];
        var seriesData = [];

        for(var i = 0, n = chart.series.length; i < n; i++) {
            seriesData[i] = chart.series[i].yData;
            cols.push({ text: chart.series[i].name, datafield: 'val' + i, cellsalign: 'right', cellsformat: 'n', width: 100 });
        }

        var xData = chart.series[0].xData,
            sLen = seriesData.length,
            dLen = xData.length;
        for(var i = 0; i < dLen; i++) {
            var obj = { ymdhms: $.format.date(new Date(xData[i]), 'yyyy-MM-dd HH:mm:ss') };
            for(var j = 0; j < sLen; j++) {
                obj['val' + j] = seriesData[j][i];
            }
            chartData.push(obj);
        }

        HmUtil.showChartData({cols: cols, chartData: chartData});
    },

    /** 차트 다운받기 */
    saveChart: function(type) {

        if(type == 'sess') HmUtil.exportHighchart($sessChart.highcharts(), '세션 추이');
        else HmUtil.exportHighchart($perfChart.highcharts(), 'CPS 추이');

    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});