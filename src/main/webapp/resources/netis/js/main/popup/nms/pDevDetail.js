var pMngNo, pGrpNo, pInitArea;
var $cbPeriod_evtHist, $cbPeriod_evtActionHist, $evtHistGrid, $evtActionHistGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid, $cardGrid, $cmDevGrid, $cmIfGrid, $eventTabs;
var $topnInUse, $topnOutUse, $topnUse, $topnInBps, $topnOutBps, $topnBps;
var sAuth;
var pgSiteName;
var dtlTabIndex;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    /** variable */
    initVariable: function () {
        pMngNo = $('#mngNo').val();
        pInitArea = $('#initArea').val();
        $dtlTab = $('#dtlTab');
        $eventTabs = $('#eventTabs');
        sAuth = $('#sAuth').val().toUpperCase();
        pgSiteName = $('#gSiteName').val();

        //이벤트 > 현황
        $evtGrid = $('#evtGrid');

        //이벤트 > 이력
        //$cbPeriod_evtHist = $('#cbPeriod_evtHist');
        //$cbPeriod_evtActionHist = $('#cbPeriod_evtActionHist');
        $evtHistGrid = $('#evtHistoryGrid');
        $evtActionHistGrid = $('#evtActionHistoryGrid');
        dtlTabIndex = 0;
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            PMain.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.searchSummary();
                break;
            case 'btnSearch_dtl':
                this.searchDtlInfo();
                break;
            case 'btnSave_dtl':
                this.saveDtlInfo();
                break;
            case 'pbtnClose':
                self.close();
                break;
            case "btnSearch_evtHist":
                PMain.searchHistory(false);
                break;
            case "btnExcel_evtHist":
                PMain.exportExcel(curTarget.id);
                break;
            case "btnSearch_evtActionHist":
                PMain.searchHistory(true);
                break;
            case "btnExcel_evtActionHist":
                PMain.exportExcel(curTarget.id);
                break;
            case 'btnChgInfo':
                this.chgInfo();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_evt_action, #ctxmenu_dev_action, #ctxmenu_if_action, #ctxmenu_ap_action, #ctxmenu_itmon_action, #ctxmenu_syslog_action').jqxMenu({
            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        }).on('itemclick', function (event) {
            PMain.selectDevCtxmenu(event);
        });

        // 메인텝
        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        break;
                    case 1: // TopN
                        pTopnPerf.initDesign();
                        pTopnPerf.initData();
                        break;
                    case 2: // 회선정보
                        pIfInfo.initDesign();
                        pIfInfo.initData();
                        break;
                    case 3: // 성능
                        pPerf.initDesign();
                        pPerf.initData();
                        break;
                    /** 성능탭 하단에 있던 실시간조회 탭을 성능탭 옆으로 이동(성능탭 이하 장비 Config 탭부터 번호 1씩 증가) **/
                    case 4: // 실시간 성능 조회
                        pPerfRealtime.initialize();
                        pPerfRealtime.initDesign();
                        break;
                    case 5: // 장비Config
                        pDevConf.initDesign();
                        pDevConf.initData();
                        break;
                    case 6: // 장비Routingconfig
                        pDevRoutingConf.initDesign();
                        pDevRoutingConf.initData();
                        break;
                    case 7: // Client 명령어
                        cliResult.initDesign();
                        cliResult.initData();
                        break;
                    case 8: // 이벤트
                        $eventTabs.jqxTabs({
                            width: '100%', height: '100%',theme : 'ui-hamon-v1-tab-mid',
                            initTabContent: function (tab) {
                                switch (tab) {
                                    case 0://현황
                                        HmGrid.updateBoundData($evtGrid, ctxPath + '/main/oms/errStatus/getErrStatusList.do');
                                        break;
                                    case 1://이력
                                        break;
                                    case 2://조치이력
                                        break;
                                }
                            }
                        });
                        break;
                    case 9: // 모듈/카드
                        pModuleCard.initDesign();
                        pModuleCard.initData();
                        break;
                    case 10: // 변경관리
                        pChgHist.initDesign();
                        pChgHist.initData();
                        break;
                    case 11: // 자산
                        var assetUrl = '/main/popup/sms/pSvrDetail/pAsset.do';
                        $('#asset').empty().load(assetUrl, function (response, status, xhr) {
                            try {
                                if (status === 'error') {
                                    alert('Page Load Error');

                                }
                            } catch (e) {
                                alert(e);
                            }
                        });
                        break;
                    case 12: // PortView
                        pPortView.initDesign();
                        pPortView.initData();
                        break;
                    case 13: // 성능예측
                        pPerfPredict.initDesign();
                        pPerfPredict.initData();
                        break;
                    case 14: // 장애예측
                        pErrPredict.initDesign();
                        pErrPredict.initData();
                        break;
                    // case 15: // IpScan
                    //     pIpScan.initDesign();
                    //     pIpScan.initData();
                    //     break;
                    case 15: // 회선연결정보
                        pAutoLink.initDesign();
                        pAutoLink.initData();
                        break;
                    case 16: // 임계치가이드
                        pDevPerfThreshold.initDesign();
                        pDevPerfThreshold.initData();
                        break;
                    case 17: // 성능비교
                        pDevPerfCompare.initDesign();
                        pDevPerfCompare.initData();
                        break;
                }

                var displayFlag = $('#aiPoll').val() == '1' ? 'block' : 'none';
                // $('#dtlTab .jqx-tabs-title:eq(11)').css('display', displayFlag);
                $('#dtlTab .jqx-tabs-title:eq(13)').css('display', displayFlag);
                $('#dtlTab .jqx-tabs-title:eq(14)').css('display', displayFlag);

            }
        }).on('selected', function (event) {

            var selectedTab = event.args.item;

            dtlTabIndex = selectedTab;

            if (selectedTab == 0 || selectedTab == 1 || selectedTab == 2) {
                $("#btnSearch_summary").show();
                // pSummary_evtStatus.resizeSvg();
            } else {
                $("#btnSearch_summary").hide();
            }
//				PMain.searchDtlInfo();
        });

        if (sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
            $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
            // $dtlTab.jqxTabs('disableAt', 9); // 권한에 따른 설정탭 숨김
        }

        //이벤트탭 현황 그리드
        $evtGrid.on('contextmenu', function () {
            return false;
        })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {
                    $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_svr').jqxMenu('close');
                    var targetMenu = null;
                    $evtGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtGrid.jqxGrid('getselectedrowindexes');
                    // 선택 Row 개수가 1이상일때
                    if (idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function (idx, value) {
                            var tmp = $evtGrid.jqxGrid('getrowdata', value);
                            if (tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if (_list.length > 1) targetMenu = $('#ctxmenu_evt');
                        else if (_list.length == 1) {	// 우클릭메뉴가 제공되는 이벤트가 1개일때
                            switch (_list[0].srcType) {
                                case 'DEV':
                                    targetMenu = $('#ctxmenu_dev');
                                    break;
                                case 'IF':
                                    targetMenu = $('#ctxmenu_if');
                                    break;
                                case 'AP':
                                    targetMenu = $('#ctxmenu_ap');
                                    break;
                                case 'ITMON':
                                    targetMenu = $('#ctxmenu_itmon');
                                    break;
                                case 'SYSLOG':
                                    targetMenu = $('#ctxmenu_syslog');
                                    break;
                                default:
                                    targetMenu = $('#ctxmenu_evt');
                                    break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon');
                        }
                    }
                    else if (idxes.length == 1) { // 선택 Row가 1개일때
                        var rowdata = $evtGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                targetMenu = $('#ctxmenu_dev');
                                break;
                            case 'IF':
                                targetMenu = $('#ctxmenu_if');
                                break;
                            case 'AP':
                                targetMenu = $('#ctxmenu_ap');
                                break;
                            case 'ITMON':
                                targetMenu = $('#ctxmenu_itmon');
                                break;
                            case 'SYSLOG':
                                targetMenu = $('#ctxmenu_syslog');
                                break;
                            default:
                                targetMenu = $('#ctxmenu_evt');
                                break;
                        }
                    }

                    if (targetMenu != null) {
                        var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                        var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                        if ($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                            posY = $(window).height() - (targetMenu.height() + 10);
                        }
                        targetMenu.jqxMenu('open', posX, posY);
                    }
                    return false;
                }
            });
        HmGrid.create($evtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, {mngNo: pMngNo/*, srcType:'DEV'*/});
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns: [
                {
                    text: '장애등급',
                    datafield: 'evtLevelStr',
                    width: 70,
                    filtertype: 'checkedlist',
                    cellsrenderer: HmGrid.evtLevelrenderer,
                    cellsalign: 'center',
                    createfilterwidget: function (column, columnElement, widget) {
                        widget.jqxDropDownList({
                            renderer: HmGrid.evtLevelFilterRenderer
                        });
                    }
                },
                {text: '발생일시', datafield: 'ymdhms', cellsalign: 'center', width: 140},
                {text: '그룹', datafield: 'grpName', width: 100},
                {text: '장애종류', datafield: 'srcTypeStr', width: 70, cellsalign: 'center'},
                {text: '장애대상', datafield: 'srcInfo', minwidth: 400},
                {text: '이벤트명', datafield: 'evtName', width: 140},
                {text: '지속시간', datafield: 'sumSec', width: 150, cellsrenderer: HmGrid.cTimerenderer},
                {text: '장애상태', datafield: 'status', width: 70, cellsalign: 'center'},
                {text: '진행상태', datafield: 'progressState', width: 70, cellsalign: 'center'},
                {text: '조치내역', datafield: 'receiptMemo', width: 150},
                {text: '이벤트설명', datafield: 'limitDesc', width: 250}
            ]
        }, CtxMenu.NONE);

        //이벤트탭 이력 그리드
        //Master.createPeriodCondition($cbPeriod_evtHist, $('#date1_evtHist'), $('#date2_evtHist'));
        HmBoxCondition.createPeriod('_pEvtHist');

        HmGrid.create($evtHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {

                        var params = {
                            sIp: $('#devIp').val(),
                            sDevName: $('#devName').val(),
                            actionFlag: 0,
                            // srcType:'DEV',
                            mngNo: pMngNo
                        };
                        $.extend(data, params, HmBoxCondition.getPeriodParams('_pEvtHist'));
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns:
                [
                    {
                        text: '장애등급',
                        datafield: 'evtLevelStr',
                        width: 70,
                        filtertype: 'checkedlist',
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    {text: '일시', datafield: 'ymdhms', width: 140, cellsalign: 'center'},
                    {text: '장애종류', datafield: 'srcTypeStr', cellsalign: 'center', width: 80},
                    {text: '장애대상', datafield: 'srcInfo', minwidth: 400},
                    {text: '이벤트명', datafield: 'evtName', width: 140},
                    {text: '지속시간', datafield: 'sumSec', width: 150, cellsrenderer: HmGrid.cTimerenderer},
                    {text: '장애상태', datafield: 'status', cellsalign: 'center', width: 100},
                    {text: '조치자', datafield: 'receiptUser', cellsalign: 'center', width: 100},
                    {text: '종료일시', datafield: 'endYmdhms', width: 140, cellsalign: 'center'},
                    {text: '조치내역', datafield: 'receiptMemo', width: 150},
                    {text: '이벤트설명', datafield: 'limitDesc', width: 250}
                ]
        }, CtxMenu.NONE);

        $evtHistGrid.on('contextmenu', function () {
            return false;
        })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {
                    var targetMenu = null;
                    $evtHistGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtHistGrid.jqxGrid('getselectedrowindexes');
                    if (idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function (idx, value) {
                            var tmp = $evtHistGrid.jqxGrid('getrowdata', value);
                            if (tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if (_list.length > 1) targetMenu = $('#ctxmenu_evt');
                        else if (_list.length == 1) {
                            switch (_list[0].srcType) {
                                case 'DEV':
                                    targetMenu = $('#ctxmenu_dev_action');
                                    break;
                                case 'IF':
                                    targetMenu = $('#ctxmenu_if_action');
                                    break;
                                case 'AP':
                                    targetMenu = $('#ctxmenu_ap_action');
                                    break;
                                case 'ITMON':
                                    targetMenu = $('#ctxmenu_itmon_action');
                                    break;
                                case 'SYSLOG':
                                    targetMenu = $('#ctxmenu_syslog_action');
                                    break;
                                default:
                                    targetMenu = $('#ctxmenu_evt_action');
                                    break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon_action');
                        }
                    }
                    else if (idxes.length == 1) {
                        var rowdata = $evtHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                targetMenu = $('#ctxmenu_dev_action');
                                break;
                            case 'IF':
                                targetMenu = $('#ctxmenu_if_action');
                                break;
                            case 'AP':
                                targetMenu = $('#ctxmenu_ap_action');
                                break;
                            case 'ITMON':
                                targetMenu = $('#ctxmenu_itmon_action');
                                break;
                            case 'SYSLOG':
                                targetMenu = $('#ctxmenu_syslog_action');
                                break;
                            default:
                                targetMenu = $('#ctxmenu_evt_action');
                                break;
                        }
                    }

                    if (targetMenu != null) {
                        var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                        var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                        if ($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                            posY = $(window).height() - (targetMenu.height() + 10);
                        }
                        targetMenu.jqxMenu('open', posX, posY);
                    }
                    return false;
                }
            });

        //이벤트탭 조치이력 그리드
        HmBoxCondition.createPeriod('_pEvtAction');
        HmGrid.create($evtActionHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        var params = {
                            sIp: $('#devIp').val(),
                            sDevName: $('#devName').val(),
                            actionFlag: 1,
                            // srcType:'DEV',
                            mngNo: pMngNo
                        };
                        $.extend(data, params, HmBoxCondition.getPeriodParams('_pEvtAction'));
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns:
                [
                    {
                        text: '장애등급',
                        datafield: 'evtLevelStr',
                        width: 70,
                        filtertype: 'checkedlist',
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    {text: '일시', datafield: 'ymdhms', width: 140, cellsalign: 'center'},
                    {text: '장애종류', datafield: 'srcTypeStr', cellsalign: 'center', width: 80},
                    {text: '장애대상', datafield: 'srcInfo', minwidth: 400},
                    {text: '이벤트명', datafield: 'evtName', width: 140},
                    {text: '조치내역', datafield: 'receiptMemo', width: 250},
                    {text: '지속시간', datafield: 'sumSec', width: 150, cellsrenderer: HmGrid.cTimerenderer},
                    {text: '장애상태', datafield: 'status', cellsalign: 'center', width: 100},
                    {text: '조치자', datafield: 'receiptUser', cellsalign: 'center', width: 100},
                    {text: '종료일시', datafield: 'endYmdhms', width: 140, cellsalign: 'center'},
                    {text: '이벤트설명', datafield: 'limitDesc', width: 150}
                ]
        }, CtxMenu.NONE);

        $evtActionHistGrid.on('contextmenu', function () {
            return false;
        })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {
                    var targetMenu = null;
                    $evtActionHistGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtActionHistGrid.jqxGrid('getselectedrowindexes');
                    if (idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function (idx, value) {
                            var tmp = $evtActionHistGrid.jqxGrid('getrowdata', value);
                            if (tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if (_list.length > 1) targetMenu = $('#ctxmenu_evt_action');
                        else if (_list.length == 1) {
                            switch (_list[0].srcType) {
                                case 'DEV':
                                    targetMenu = $('#ctxmenu_dev_action');
                                    break;
                                case 'IF':
                                    targetMenu = $('#ctxmenu_if_action');
                                    break;
                                case 'AP':
                                    targetMenu = $('#ctxmenu_ap_action');
                                    break;
                                case 'ITMON':
                                    targetMenu = $('#ctxmenu_itmon_action');
                                    break;
                                case 'SYSLOG':
                                    targetMenu = $('#ctxmenu_syslog_action');
                                    break;
                                default:
                                    targetMenu = $('#ctxmenu_evt_action');
                                    break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon_action');
                        }
                    }
                    else if (idxes.length == 1) {
                        var rowdata = $evtActionHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                targetMenu = $('#ctxmenu_dev_action');
                                break;
                            case 'SVR':
                                targetMenu = $('#ctxmenu_svr');
                                break;
                            case 'IF':
                                targetMenu = $('#ctxmenu_if_action');
                                break;
                            case 'AP':
                                targetMenu = $('#ctxmenu_ap_action');
                                break;
                            case 'ITMON':
                                targetMenu = $('#ctxmenu_itmon_action');
                                break;
                            case 'SYSLOG':
                                targetMenu = $('#ctxmenu_syslog_action');
                                break;
                            default:
                                targetMenu = $('#ctxmenu_evt_action');
                                break;
                        }
                    }

                    if (targetMenu != null) {
                        var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
                        var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
                        if ($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
                            posY = $(window).height() - (targetMenu.height() + 10);
                        }
                        targetMenu.jqxMenu('open', posX, posY);
                    }
                    return false;
                }
            });


        if (pInitArea == ("WebTopology")) {
            $dtlTab.jqxTabs({selectedItem: 5});
        }
    },

    /** init data */
    initData: function () {
        $('.p_content_layer').css('display', 'block');
    },

    /** 상세정보 */
    searchDtlInfo: function () {
    },

    /** ContextMenu */
    selectDevCtxmenu: function (event) {
        var tabIdx = $eventTabs.val();
        var $grid;
        // tab 에 따른 그리드 할당
        switch (tabIdx) {
            case 0: // 현황
                $grid = $evtGrid;
                break;
            case 1: // 이력
                $grid = $evtHistGrid;
                break;
            case 2: // 조치이력
                $grid = $evtActionHistGrid;
                break;
            default:
                return;
        }


        var val = $(event.args)[0].id;
        if (val == null) return;
        switch (val) {
            case 'cm_evtAction':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if (rowidxes === false) return;
                    var _seqNos = [];
                    $.each(rowidxes, function (idx, value) {
                        _seqNos.push($grid.jqxGrid('getrowdata', value).seqNo);
                    });
                    var params = {
                        seqNos: _seqNos
                    };
                    $.ajax({
                        url: ctxPath + '/main/popup/nms/pErrAction.do',
                        type: 'POST',
                        data: JSON.stringify(params),
                        contentType: 'application/json; charset=utf-8',
                        success: function (result) {
                            HmWindow.openFit($('#pwindow'), '장애조치', result, 660, 516);
                        }
                    });
                } catch (e) {
                }
                break;
            case 'cm_evtResume':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function (idx, value) {
                        var tmp = $grid.jqxGrid('getrowdata', value);
                        if (tmp.status == '일시정지') {
                            _seqNos.push(tmp.seqNo);
                            _rowids.push($grid.jqxGrid('getrowid', value));
                        }
                    });

                    if (_seqNos.length == 0) {
                        alert('선택한 데이터 중 일시정지 상태인 이벤트가 존재하지 않습니다.');
                        return;
                    }
                    if (!confirm('선택한 이벤트를 재개 하시겠습니까?')) return;
                    var params = {
                        seqNos: _seqNos
                    };
                    Server.post('/main/popup/errAction/saveEvtResume.do', {
                        data: params,
                        success: function () {
                            $.each(_rowids, function (idx, rowid) {
                                $grid.jqxGrid('setcellvaluebyid', rowid, 'status', '진행중');
                            });
                            alert('선택한 이벤트가 재개되었습니다.');
                        }
                    });
                } catch (e) {
                }
                break;
            case 'cm_evtPause':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if (!confirm('선택한 이벤트를 일시정지 하시겠습니까?')) return;
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function (idx, value) {
                        _seqNos.push($grid.jqxGrid('getrowdata', value).seqNo);
                        _rowids.push($grid.jqxGrid('getrowid', value));
                    });
                    var params = {
                        seqNos: _seqNos
                    };

                    Server.post('/main/popup/errAction/saveEvtPause.do', {
                        data: params,
                        success: function () {
                            $.each(_rowids, function (idx, value) {
                                $grid.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 정지되었습니다.');
                        }
                    });

                } catch (e) {
                }
                break;
            case 'cm_devPerfChart':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        devIp: rowdata.devIp,
                        mngNo: rowdata.mngNo
                    };
                    $.post(ctxPath + '/main/popup/nms/pDevPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + '] 장비성능그래프', result, 1100, 800);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_dev_rawPerfGraph': //장비성능그래프 (raw)
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        devIp: rowdata.devIp,
                        mngNo: rowdata.mngNo,
                        disDevName: rowdata.disDevName
                    };
                    // 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
                    // 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
                    var _gridElementName = $grid.selector.toUpperCase();
                    if (_gridElementName.indexOf('CPU') > 0) {
                        params.type = '1';
                    } else if (_gridElementName.indexOf('MEM') > 0) {
                        params.type = '2';
                    } else if (_gridElementName.indexOf('TEMP') > 0) {
                        params.type = '5';
                    } else if (_gridElementName.indexOf('RESTIME') > 0) {
                        params.type = '6';
                    } else if (_gridElementName.indexOf('SESSION') > 0) {
                        params.type = '11';
                    }

                    if (params !== undefined || params !== '') {
                        // 18.07.06] 현대차 예외처리 추가
                        var url = ctxPath + '/main/popup/nms/pDevRawPerfChart.do';
                        if ($('#gSiteName').val() == 'HyundaiCar') {
                            url = ctxPath + '/hyundaiCar/popup/nms/pDevRawPerfChart.do';
                        }
                        $.post(url,
                            params,
                            function (result) {
                                HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 장비성능그래프', result, 900, 800);
                            }
                        );
                    }
                } catch (e) {
                }


                break;
            case 'cm_dev_secUnitPerfGraph': //초단위 장비성능
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        devIp: rowdata.devIp,
                        mngNo: rowdata.mngNo,
                        disDevName: rowdata.disDevName
                    };

                    if (params !== undefined || params !== '') {
                        $.post(ctxPath + '/main/popup/nms/pSecUnitDevPerf.do',
                            params,
                            function (result) {
                                HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 초단위 장비성능', result, 1100, 640);
                            }
                        );
                    }
                } catch (e) {
                }

                break;
            case 'cm_if_rawPerfGraph': //회선성능그래프(raw)
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        devIp: rowdata.devIp,
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.srcIdx,
                        devName: rowdata.disDevName,
                        ifName: rowdata.ifName,
                        ifAlias: rowdata.ifAlias,
                        lineWidth: rowdata.lineWidth
                    };


                    if (params !== undefined || params !== '') {
                        // 18.07.06] 현대차 예외처리 추가
                        var url = ctxPath + '/main/popup/nms/pIfRawPerfChart.do';
                        if ($('#gSiteName').val() == 'HyundaiCar') {
                            url = ctxPath + '/hyundaiCar/popup/nms/pIfRawPerfChart.do';
                        }
                        $.post(url,
                            params,
                            function (result) {
                                HmWindow.open($('#pwindow'), '[' + params.devName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 회선성능그래프', result, 900, 800);
                            }
                        );
                    }
                } catch (e) {
                }
                break;
            case 'cm_if_secUnitPerfGraph': //초단위 회선성능
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.srcIdx,
                        disDevName: rowdata.disDevName,
                        ifName: rowdata.ifName,
                        ifAlias: rowdata.ifAlias
                    };

                    if (params !== undefined || params !== '') {
                        $.post(ctxPath + '/main/popup/nms/pSecUnitIfPerf.do',
                            params,
                            function (result) {
                                HmWindow.open($('#pwindow'), '[' + params.disDevName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 초단위 회선성능', result, 1000, 610);
                            }
                        );
                    }
                } catch (e) {
                }
                break;
            case 'cm_rtDevPerfChart':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo,
                    };
                    $.post(ctxPath + '/main/popup/nms/pRTimeDevPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ']  실시간 장비성능', result, 1000, 420);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_devJobReg':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo,
                        devName: rowdata.devName,
                        jobType: 'DEV'
                    };

                    $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                        params,
                        function (result) {
                            HmWindow.openFit($('#pwindow'), rowdata.disDevName + ' 장비작업등록', result, 750, 660);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_ping':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo
                    };
                    HmUtil.showPingPopup(params);
                } catch (e) {
                }
                break;
            case 'cm_telnet':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.telnet(rowdata.devIp);
                } catch (e) {
                }
                break;
            case 'cm_tracert':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo
                    };
                    HmUtil.showTracertPopup(params);
                } catch (e) {
                }
                break;
            case 'cm_ssh':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.ssh(rowdata.devIp);
                } catch (e) {
                }
                break;
            case 'cm_http':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.http(rowdata.devIp);
                } catch (e) {
                }
                break;
            case 'cm_https':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.https(rowdata.devIp);
                } catch (e) {
                }
                break;
            case 'cm_ifJobReg':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        ifIdx: rowdata.srcIdx,
                        ifName: rowdata.ifName,
                        mngNo: rowdata.mngNo,
                        jobType: 'IF'
                    };


                    $.post(ctxPath + '/main/popup/nms/pJobAdd.do',
                        params,
                        function (result) {
                            var alias = (rowdata.ifAlias && rowdata.ifAlias !== "" && rowdata.ifAlias !== undefined) ? '(' + rowdata.ifAlias + ')' : "";

                            HmWindow.openFit($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + alias + '] 회선작업등록', result, 750, 660);

                        });

                    // $.ajax({
                    //     url: ctxPath +  '/main/popup/nms/pJobAdd.do',
                    //     type: 'POST',
                    //     data: params, //JSON.stringify(params),
                    //     contentType: 'application/json; charset=utf-8',
                    //     success: function(result){
                    //         HmWindow.openFit($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + '(' + rowdata.ifAlias + ')] 회선작업등록', result, 750, 660);
                    //     }
                    // });

                } catch (e) {
                }
                break;
            case 'cm_ifPerfChart':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        devIp: rowdata.devIp,
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.srcIdx,
                        devName: rowdata.disDevName,
                        ifName: rowdata.ifName
                    };
                    $.post(ctxPath + '/main/popup/nms/pIfPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + '(' + rowdata.ifAlias + ')] 회선성능그래프', result, 1022, 685);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_rtIfPerfChart':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo,
                        ifIdx: rowdata.srcIdx
                    };
                    $.post(ctxPath + '/main/popup/nms/pRTimeIfPerfChart.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + '(' + rowdata.ifAlias + ')] 실시간 회선성능', result, 1012, 440);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_apDtl':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var params = {
                        apNo: $grid.jqxGrid('getrowdata', rowidx).mngNo
                    };
                    HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 660, params);
                } catch (e) {
                }
                break;
            case 'cm_syslog_detail': //Syslog 상세
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if (rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    if ($.isBlank(rowdata.srcIdx) || rowdata.srcIdx == 0) {
                        alert('SYSLOG정보가 존재하지 않습니다.');
                        return;
                    }
                    Server.get("/main/nms/syslog/getSyslogInfo.do", {
                        data: {seqNo: rowdata.srcIdx},
                        success: function (resultData) {
                            if (resultData == null) {
                                alert('SYSLOG정보가 존재하지 않습니다.');
                                return;
                            }

                            $.post(ctxPath + '/main/popup/nms/pSyslogDetail.do',
                                resultData,
                                function (result) {
                                    HmWindow.open($('#pwindow'), 'Syslog 상세', result, 800, 400);
                                }
                            );
                        }
                    })
                } catch (e) {
                }
                break;
            case 'cm_evt_stop': //이벤트 중지(SYSLOG삭제)
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function (idx, value) {
                        var tmp = $grid.jqxGrid('getrowdata', value);
                        if (tmp.srcType == 'SYSLOG') {
                            _seqNos.push(tmp.seqNo);
                            _rowids.push(tmp.uid);
                        }
                    });
                    if (_seqNos.length == 0) {
                        alert('선택된 데이터 중 SYSLOG이벤트가 없습니다.');
                        return;
                    }
                    if (!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
                    var params = {
                        seqNos: _seqNos
                    };
                    Server.post('/main/popup/errAction/saveEvtStop.do', {
                        data: params,
                        success: function () {
                            $.each(_rowids, function (idx, value) {
                                $grid.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 해제되었습니다.');
                        }
                    });
                } catch (e) {
                }
                break;
            case 'cm_filter':
                try {
                    $grid.jqxGrid('beginupdate');
                    if ($grid.jqxGrid('filterable') === false) {
                        $grid.jqxGrid({filterable: true});
                    }
                    setTimeout(function () {
                        $grid.jqxGrid({showfilterrow: !$grid.jqxGrid('showfilterrow')});
                    }, 300);
                    $grid.jqxGrid('endupdate');
                } catch (e) {
                }
                break;
            case 'cm_filterReset':
                try {
                    $grid.jqxGrid('clearfilters');
                } catch (e) {
                }
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $grid);
                    }
                );
                break;
            case 'cm_evtRevoke':
                try {
                    var rowidx = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if (!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
                    //				var _devIps = [];
                    var _rowids = [];
                    $.each(rowidx, function (idx, value) {
                        //					_devIps.push($grid.jqxGrid('getrowdata', value).devIp);
                        _rowids.push($grid.jqxGrid('getrowid', value));
                    });
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);

                    var params = {
                        devIp: rowdata.devIp
                    };
                    Server.post('/main/popup/errAction/saveStarCellEvtRevoke.do', {
                        data: params,
                        success: function () {
                            $.each(_rowids, function (idx, value) {
                                $gridv.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 해지되었습니다.');
                        }
                    });
                } catch (e) {
                }
                break;
        }
    },

    /** 선택이벤트 */
    selectHistoryTree: function () {
        Popup.searchHistory(false);
    },

    selectActionHistoryTree: function () {
        Popup.searchHistory(true);
    },
    searchHistory: function (actionFlag) {
        if (actionFlag) {
            //Master.refreshCbPeriod($cbPeriod_evtHist);
            HmBoxCondition.refreshPeriod('_pEvtAction');
            HmGrid.updateBoundData($evtActionHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
        } else {
            //Master.refreshCbPeriod($cbPeriod_evtActionHist);
            HmBoxCondition.refreshPeriod('_pEvtHist');
            HmGrid.updateBoundData($evtHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
        }
    },

    exportExcel: function (btnId) {
        if (btnId == 'btnExcel_evtHist') {
            HmUtil.exportGrid($evtHistGrid, '이력', false);
        }
        else if (btnId == 'btnExcel_evtActionHist') {
            HmUtil.exportGrid($evtActionHistGrid, '조치이력', false);
        }
    },

    chgInfo: function () {

        var params = {
            mngNo: dtl_mngNo,
            action: 'U'
        }

        Server.get('/dev/getDevInfo.do', {
            data: {mngNo: dtl_mngNo},
            success: function (data) {
                if (data != null) {
                    $.post(ctxPath + '/main/popup/env/pDevAdd.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), '[{0}] 장비정보 변경'.substitute(data.disDevName), result, 600, 681);
                        }
                    );
                }
            }
        });

    }
};

function addDevResult() {
}
