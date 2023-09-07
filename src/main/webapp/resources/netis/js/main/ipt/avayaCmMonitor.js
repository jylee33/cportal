var $grpTree, $cmGrid, $tabs, $trunkGrpGrid, $moduleGrid, $healthPieChart, $healthLineChart, $gwGrid;
var _curMngNo = 0, _pieData = [];
var timer, rowIndex;
var ctxmenuIdx = 1;

var TAB = {
    TRUNK_GRP: 0,
    MODULE: 1,
    HEALTH: 2,
    GW: 3
};

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid'), $cmGrid = $('#cmGrid'), $tabs = $('#tabs'), $trunkGrpGrid = $('#trunkGrpGrid'), $moduleGrid = $('#moduleGrid');
        $healthPieChart = $('#healthPieChart'), $healthLineChart = $('#healthLineChart'), $gwGrid = $('#gwGrid');
        this.initCondition();
    },
    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('', Main.refreshSearch, timer);
        $("input[name=sRef]").eq(2).click();
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },
    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox').keypress(function (e) {
            if (e.keyCode == 13) Main.searchCm();
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.searchCm();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
            case 'btnSearch_health':
                this.searchPerfList();
                break;
            case 'btnCList_perf':
                this.showChartData();
                break;
            case 'btnCDown_perf':
                this.saveChart();
                break;
            case 'btnSetup' :
                this.setPopupCall();
                break;
        }
    },
       refreshSearch:function(){
        Main.searchCm();
        $cmGrid.jqxGrid('selectrow', rowIndex);
        Main.searchDetail();
        $(this).val(0);
    },
    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'PBX'});
       /* HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);*/

        $tabs.jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case TAB.TRUNK_GRP:
                        HmGrid.create($trunkGrpGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/ipt/avayaCmMonitor/getCallAvayaTrunkGrpList.do'
                                },
                                {
                                    formatData: function (data) {
                                        data.mngNo = _curMngNo;
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {text: '번호', datafield: 'trnNo', width: '50', cellsalign: 'center'},
                                    {text: '이름', datafield: 'trnName'},
                                    {text: '종류', datafield: 'trnType', width: '80', filtertype: 'checkedlist'},
                                    {text: 'means', datafield: 'trnMeas', width: '80'}
                                ],
                            columngroups:
                                [
                                    {text: '상태', align: 'center', name: 'state'}
                                ]
                        }, CtxMenu.COMM, ctxmenuIdx++);
                        break;
                    case TAB.MODULE:
                        HmGrid.create($moduleGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/ipt/avayaCmMonitor/getCallAvayaBoardList.do'
                                },
                                {
                                    formatData: function (data) {
                                        data.mngNo = _curMngNo;
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {text: '보드 번호', datafield: 'boardNum', width: '20%'},
                                    {text: '보드 종류', datafield: 'boardType', width: '30%', filtertype: 'checkedlist'},
                                    {text: '코드', datafield: 'boardCode', width: '30%'},
                                    {text: 'Vintage', datafield: 'firmVer', width: '20%'}
                                ]
                        }, CtxMenu.COMM, ctxmenuIdx++);
                        break;
                    case TAB.HEALTH:
                        var settings = {
                            title: "프로세스 점유율",
                            description: "",
                            enableAnimations: true,
                            showLegend: true,
                            showBorderLine: true,
                            legendLayout: {left: 20, top: 160, width: 300, height: 200, flow: 'vertical'},
                            padding: {left: 5, top: 5, right: 5, bottom: 5},
                            titlePadding: {left: 0, top: 0, right: 0, bottom: 10},
                            source: new $.jqx.dataAdapter({datatype: 'json'}),
                            colorScheme: 'scheme01',
                            seriesGroups:
                                [
                                    {
                                        type: 'pie',
                                        showLabels: true,
                                        series:
                                            [
                                                {
                                                    dataField: 'rate',
                                                    displayText: 'process',
                                                    labelRadius: 80,
                                                    initialAngle: 15,
                                                    radius: 120,
                                                    centerOffset: 0,
                                                    formatFunction: function (value) {
                                                        if (isNaN(value))
                                                            return value;
                                                        return parseFloat(value) + '%';
                                                    },
                                                }
                                            ]
                                    }
                                ]
                        };
                        // setup the chart
                        $healthPieChart.jqxChart(settings);
                        var _chartSetting = {
                            title: '점유율 추이',
                            description: null,
                            titlePadding: {left: 0, top: 0, right: 0, bottom: 10},
                            padding: {left: 15, top: 5, right: 5, bottom: 5},
                            colorScheme: 'scheme01',
                            xAxis: {
                                dataField: 'ymdhms',
                                type: 'basic'
                            },
                            seriesGroups: [
                                HmChart.getSeriesGroup($healthLineChart, HmChart.T_LINE, null,
                                    HmChart.getSeries(['osCpu', 'callCpu', 'sysCpu', 'idleCpu'], ['OS', 'Call Processing', 'System Management', 'Idle'])
                                )
                            ]
                        };

                        $healthLineChart.jqxChart(_chartSetting);
                        break;
                    case TAB.GW:
                        HmGrid.create($gwGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/ipt/avayaCmMonitor/getCallAvayaGwList.do'
                                },
                                {
                                    formatData: function (data) {
                                        data.mngNo = _curMngNo;
                                        return data;
                                    }
                                }
                            ),
                            columns:
                                [
                                    {text: 'GW 이름', datafield: 'gwName', width: '20%'},
                                    {text: 'IP', datafield: 'gwIp', width: '20%'},
                                    {text: 'Serial', datafield: 'gwMac', width: '20%'},
                                    {text: '모델', datafield: 'gwModel', width: '20%', filtertype: 'checkedlist'},
                                    {text: '등록 여부', datafield: 'gwReg', width: '20%'}
                                ]
                        }, CtxMenu.COMM, ctxmenuIdx++);
                        break;
                }
            }
        })
            .on('selected', function (event) {
                Main.searchDetail();
            });

        if ($('#isAvayaPbxV7').val()) {
            $tabs.jqxTabs('removeAt', 3);
        }

        HmGrid.create($cmGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[
                        { name:'mngNo', type:'number' },
                        { name:'grpName', type:'string' },
                        { name:'devName', type:'string' },
                        { name:'devIp', type:'string' },
                        { name:'vendor', type:'string' },
                        { name:'model', type:'string' },
                        { name:'isdnCnt', type:'number' },
                        { name:'sipCnt', type:'number' },
                        { name:'staReg', type:'number' },
                        { name:'remainCnt', type:'number' },
                        { name:'staLimit', type:'number' },
                        { name:'iptRegStateCnt', type:'string' },
                        { name:'ipPhone', type:'string' },
                        { name:'analogPhone', type:'string' },
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete: function (records) {
                        _curMngNo = 0;
                        Main.clearDetail();
                    }
                }
            ),
            columns:
                [
                    {text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true},
                    {text: '그룹', datafield: 'grpName', width: 150, pinned: true},
                    {text: '교환기 이름', datafield: 'devName', minwidth: 150, pinned: true},
                    {text: 'IP주소', datafield: 'devIp', width: 120},
                    {text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist'},
                    {text: '모델명', datafield: 'model', width: 130, filtertype: 'checkedlist'},
                    {text: 'ISDN', columngroup: 'trunk', datafield: 'isdnCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {text: 'SIP', columngroup: 'trunk', datafield: 'sipCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {text: '사용량', columngroup: 'license', datafield: 'staReg', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {text: '남은수량', columngroup: 'license', datafield: 'remainCnt', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {text: '총량', columngroup: 'license', datafield: 'staLimit', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {
                        text: 'IP전화기 등록현황', datafield: 'iptRegStateCnt', width: 100, cellsalign: 'right', cellsformat: 'n', renderer: function (defaultText, alignment, height) {
                            return '<div style="text-align:center; vertical-align:middle; height: ' + height + 'px; margin-top: 10px;">IP전화기<br>등록현황</div>';
                        }
                    },
                    {text: 'IP 내선', columngroup: 'iptRegState', datafield: 'ipPhone', width: 80, cellsalign: 'right', cellsformat: 'n'},
                    {text: 'Analog 내선', columngroup: 'iptRegState', datafield: 'analogPhone', width: 120, cellsalign: 'right', cellsformat: 'n'}
                ],
            columngroups:
                [
                    {text: 'Trunk', align: 'center', name: 'trunk'},
                    {text: '라이선스', align: 'center', name: 'license'},
                    {text: '내선 등록현황', align: 'center', name: 'iptRegState'}
                ]
        });
        $cmGrid.on('rowselect', function (event) {
            if (event.args.row == undefined) {
                setTimeout(function () {
                    $cmGrid.jqxGrid('selectrow', rowIndex);
                }, 500);
            } else {
                _curMngNo = event.args.row.mngNo;
                rowIndex = event.args.rowindex;
                Main.clearDetail();
                Main.searchDetail();
            }
        });

    },

    /** init data */
    initData: function () {
  /*      Main.chgRefreshCycle();*/
    },

    /** 트리선택 */
    selectTree: function () {
        Main.searchCm();
    },

    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Master.getDefGrpParams($grpTree);
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },

    /** 장비 조회 */
    searchCm: function () {
        HmGrid.updateBoundData($cmGrid, ctxPath + '/main/ipt/avayaCmMonitor/getCallMgrAvayaList.do');
    },

    /** 상세 하단 정보 클리어 */
    clearDetail: function () {
        $trunkGrpGrid.jqxGrid('clear');
        $moduleGrid.jqxGrid('clear');
        $gwGrid.jqxGrid('clear');
    },

    /** 상세 조회 */
    searchDetail: function () {
        switch ($tabs.val()) {
            case TAB.TRUNK_GRP:
                HmGrid.updateBoundData($trunkGrpGrid);
                break;
            case TAB.MODULE:
                HmGrid.updateBoundData($moduleGrid);
                break;
            case TAB.HEALTH:
                var params = {
                    mngNo: _curMngNo,
                    date1: HmDate.getDateStr($('#date1')),
                    time1: HmDate.getTimeStr($('#date1')),
                    date2: HmDate.getDateStr($('#date2')),
                    time2: HmDate.getTimeStr($('#date2'))
                };
                Server.get('/main/ipt/avayaCmMonitor/getCallMgrAvayaPerfLast.do', {
                    data: params,
                    success: function (result) {
                        if (result != null && result.length > 0) {
                            var chartData = [];
                            chartData.push({process: 'OS', rate: result[0].osCpu});
                            chartData.push({process: 'Call Processing', rate: result[0].callCpu});
                            chartData.push({process: 'System Management', rate: result[0].sysCpu});
                            chartData.push({process: 'Idle', rate: result[0].idleCpu});
                            $healthPieChart.jqxChart('source', chartData);
                            $healthPieChart.jqxChart('update');
                        }
                    }
                });
                Server.get('/main/ipt/avayaCmMonitor/getCallMgrAvayaPerfList.do', {
                    data: params,
                    success: function (result) {
                        $healthLineChart.jqxChart('source', result);
                        $healthLineChart.jqxChart('update');
                    }
                });
                break;
            case TAB.GW:
                HmGrid.updateBoundData($gwGrid);
                break;
        }
    },

    /** 점유율 추이 조회 */
    searchPerfList: function () {
        var params = {
            mngNo: _curMngNo,
            date1: HmDate.getDateStr($('#date1')),
            time1: HmDate.getTimeStr($('#date1')),
            date2: HmDate.getDateStr($('#date2')),
            time2: HmDate.getTimeStr($('#date2'))
        };
        Server.get('/main/ipt/avayaCmMonitor/getCallMgrAvayaPerfList.do', {
            data: params,
            success: function (result) {
                $healthLineChart.jqxChart('source', result);
                $healthLineChart.jqxChart('update');
            }
        });
    },

    /** Excel export */
    exportExcel: function () {
        HmUtil.exportGrid($cmGrid, '교환기 모니터링', false);
    },

    /** 차트 데이터 보기 */
    showChartData: function () {
        var params = {
            chartData: $healthLineChart.jqxChart('source'),
            cols: [
                {text: '일시', datafield: 'ymdhms'},
                {text: 'OS', datafield: 'osCpu', width: 100, cellsalign: 'right'},
                {text: 'Call Processing', datafield: 'callCpu', width: 100, cellsalign: 'right'},
                {text: 'System Management', datafield: 'sysCpu', width: 100, cellsalign: 'right'},
                {text: 'Idle', datafield: 'idleCpu', width: 100, cellsalign: 'right'}
            ]
        };
        $.post(ctxPath + '/main/popup/comm/pChartDataList.do',
            function (result) {
                HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', params);
            }
        );
    },

    /** 차트 다운로드 */
    saveChart: function () {
        HmUtil.exportChart($healthLineChart, "점유율추이.png");
    },

    /** 새로고침 주기 변경 */
    chgRefreshCycle: function () {
        var cycle = $('#refreshCycleCb').val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function () {
                var curVal = $('#prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#prgrsBar').val(0);
        }
    },

    setPopupCall: function () {
        $.post(ctxPath + '/main/popup/ipt/pAvayaPhoneSet.do',
            function (result) {
                HmWindow.open($('#pwindow'), '교환기 모니터링 설정', result, 330, 271);
            }
        );
    }
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});