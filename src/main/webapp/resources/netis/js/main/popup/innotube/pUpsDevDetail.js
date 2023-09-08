var pMngNo, pGrpNo, pInitArea;
var $cbPeriod_evtHist, $cbPeriod_evtActionHist, $evtHistGrid, $evtActionHistGrid;
var $dtlTab, $evtGrid,  $eventTabs;
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
        }
    },

    /** init design */
    initDesign: function () {

        // 메인텝
        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        break;
                    case 1: // 성능
                        pPerf.initDesign();
                        pPerf.initData();
                        break;
                    case 2: // 이벤트
                        $eventTabs.jqxTabs({
                            width: '100%', height: '100%',
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
                }
            }
        }).on('selected', function (event) {

            var selectedTab = event.args.item;
            dtlTabIndex = selectedTab;
            if (selectedTab == 0 || selectedTab == 1 || selectedTab == 2) {

            } else {

            }

        });

        //이벤트탭 현황 그리드
        $evtGrid.on('contextmenu', function () {
            return false;
        })
            .on('rowclick', function (event) {
                if (event.args.rightclick) {

                }
            });

        HmGrid.create($evtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, {mngNo: pMngNo});
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
        }).on('rowclick', function (event) {
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
                                default:
                                    targetMenu = $('#ctxmenu_evt_action');
                                    break;
                            }
                        }
                        else {

                        }
                    }
                    else if (idxes.length == 1) {
                        var rowdata = $evtHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch (rowdata.srcType) {
                            case 'DEV':
                                targetMenu = $('#ctxmenu_dev_action');
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

};

function addDevResult() {
}
