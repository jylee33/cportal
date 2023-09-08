var $cbPeriod_evtHist, $cbPeriod_evtActionHist;
var $evtHistGrid, $evtActionHistGrid;
var isHide = false;
var Main = {
    /** variable */
    initVariable: function () {

        $evtHistGrid = $('#evtHistoryGrid');
        $evtActionHistGrid = $('#evtActionHistoryGrid');
        this.initCondition();
    },

    initCondition: function () {

        // 기간
        HmBoxCondition.createPeriod('_hist');

        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType_hist'), HmResource.getResource('cond_srch_type'));

    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });

        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });

        //이벤트그룹별 현황 show/hide 처리
        $('div.btnEvtGrp').bind('click', function (event) {

            isHide = $(event.currentTarget).attr('data-key') == 'hide';

            if (isHide) {
                $('div.errGrpBox').animate({height: '25px'}, 500);
                $('div.errGrpBox > table tr:last').css('visibility', 'hidden');
                $('div.scontent').animate({top: '93px'}, 500);
            } else {
                $('div.errGrpBox').animate({height: '100px'}, 500);
                $('div.errGrpBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '168px'}, 500);
            }

            $('div.btnEvtGrp:first').css('display', isHide ? 'block' : 'none');
            $('div.btnEvtGrp:last').css('display', isHide ? 'none' : 'block');

            setTimeout(function () {
                $(window).resize();
            }, 500);

        });

        $('#section').css('display', 'block');

    },

    /** event handler */
    eventControl: function (event) {

        var curTarget = event.currentTarget;

        switch (curTarget.id) {
            case "btnSearch_evtHist":
                this.searchHistory(false);
                break;
            case "btnExcel_evtHist":
                this.exportExcel(false);
                break;
            case "btnExcelHtml_evtHist":
                this.exportExcelHtml(false);
                break;
            case "btnSearch_evtActionHist":
                this.searchHistory(true);
                break;
            case "btnExcel_evtActionHist":
                this.exportExcel(true);
                break;
            case "btnExcelHtml_evtActionHist":
                this.exportExcelHtml(true);
                break;
        }

    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchHistory();
        }
    },

    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        CtxMenu_Evt.create_impala('status_impala');

        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:

                        //장애이력
                        Master.createGrpTab_gyeongi(Main.selectHistoryTree);

                        HmGrid.create($evtHistGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    datafields: [
                                        {name: 'seqNo', type: 'number'},
                                        {name: 'mngNo', type: 'number'},
                                        {name: 'srcIdx', type: 'number'},
                                        {name: 'srcIdxText', type: 'string'},
                                        {name: 'devIp', type: 'string'},
                                        {name: 'engName', type: 'string'},
                                        {name: 'devName', type: 'string'},
                                        {name: 'disDevName', type: 'string'},
                                        {name: 'ifName', type: 'string'},
                                        {name: 'ifAlias', type: 'string'},
                                        {name: 'evtLevelStr', type: 'string'},
                                        {name: 'evtLevel', type: 'number'},
                                        {name: 'ymdhms', type: 'string'},
                                        {name: 'educationCode', type: 'string'},
                                        {name: 'grpName', type: 'string'},
                                        {name: 'grpKey', type: 'string'},
                                        {name: 'srcTypeStr', type: 'string'},
                                        {name: 'srcType', type: 'string'},
                                        {name: 'srcInfo', type: 'string'},
                                        {name: 'devLocation', type: 'string'},
                                        {name: 'code', type: 'string'},
                                        {name: 'evtName', type: 'string'},
                                        {name: 'sumSec', type: 'number'},
                                        {name: 'status', type: 'string'},
                                        {name: 'progressState', type: 'string'},
                                        {name: 'receiptUser', type: 'string'},
                                        {name: 'endYmdhms', type: 'string'},
                                        {name: 'receiptMemo', type: 'string'},
                                        {name: 'memo', type: 'string'},
                                        {name: 'limitDesc', type: 'string'}
                                    ]
                                },
                                {
                                    formatData: function (data) {

                                        var params = Master.getGrpTabParams();
                                        $.extend(data, params, HmBoxCondition.getPeriodParams('_hist'), HmBoxCondition.getSrchParams('sSrchType_hist'));
                                        data.actionFlag = 0;
                                        data.filterGroups = [];
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            columns:
                                [
                                    {text: '시퀀스', datafield: 'seqNo', hidden: true},
                                    {text: '지원청 코드', datafield: 'educationCode', width: 150, hidden: true},
                                    {text: '장비번호', datafield: 'mngNo', hidden: true},
                                    {text: '서브번호', datafield: 'srcIdx', hidden: true},
                                    {text: '서브키', datafield: 'srcIdxText', hidden: true},
                                    {text: 'IP', datafield: 'devIp', hidden: true},
                                    {text: '엔진종류', datafield: 'engName', hidden: true},
                                    {text: '장비명', datafield: 'disDevName', hidden: true},
                                    {text: '원천장비명', datafield: 'devName', hidden: true},
                                    {text: '회선명', datafield: 'ifName', hidden: true},
                                    {text: '회선별칭', datafield: 'ifAlias', hidden: true},
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
                                    {text: '장애등급코드', datafield: 'evtLevel', hidden: true},
                                    {text: '발생일시', datafield: 'ymdhms', width: 140, cellsalign: 'center'},
                                    {text: '그룹', datafield: 'grpName', width: 150},
                                    {text: '전용회선', datafield: 'grpKey', width: 150, hidden: true},
                                    {
                                        text: '장애종류',
                                        datafield: 'srcTypeStr',
                                        width: 70,
                                        cellsalign: 'center',
                                        filtertype: 'checkedlist'
                                    },
                                    {text: '장애종류코드', datafield: 'srcType', hidden: true},
                                    {text: '장애대상', datafield: 'srcInfo', minwidth: 405},
                                    {text: '장비위치', datafield: 'devLocation', width: 150, hidden: true},
                                    {text: '이벤트코드', datafield: 'code', width: 100, hidden: true},
                                    {text: '이벤트명', datafield: 'evtName', width: 140},
                                    {
                                        text: '지속시간',
                                        datafield: 'sumSec',
                                        width: 150,
                                        cellsrenderer: HmGrid.cTimerenderer,
                                        filtertype: 'number'
                                    },
                                    {
                                        text: '장애상태',
                                        datafield: 'status',
                                        width: 70,
                                        cellsalign: 'center',
                                        filtertype: 'checkedlist'
                                    },
                                    {
                                        text: '진행상태',
                                        datafield: 'progressState',
                                        width: 70,
                                        cellsalign: 'center',
                                        hidden: true
                                    },
                                    {text: '조치자',    datafield: 'receiptUser', width: 100},
                                    {text: '종료일시',  datafield: 'endYmdhms', width: 140, cellsalign: "center"},
                                    {text: '조치내역',  datafield: 'receiptMemo', width: 150},
                                    {text: '비고',         datafield: 'memo', width: 150, hidden: true},
                                    {text: '이벤트설명', datafield: 'limitDesc', width: 250}
                                ]
                        }, CtxMenu.NONE);

                        $evtHistGrid.on('bindingcomplete', function () {
                            Main.setEvtCodeGrpState();
                        });

                        $evtHistGrid.on('rowdoubleclick', function (event) {

                            var rowIdx = event.args.rowindex;

                            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);

                            rowdata.disSumSec = HmUtil.convertCTime(rowdata.sumSec);

                            var params = {
                                type: 'HIST'
                            };

                            $.extend(params, rowdata);

                            $.post(ctxPath + '/main/popup/nms/pEvtDetail.do', params, function (result) {
                                HmWindow.openFit($('#pwindow'), '이벤트 상세', result, 600, 450, 'pwindow_init', params);
                            });


                        });

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
                                                targetMenu = $('#ctxmenu_dev');
                                                break;
                                            case 'SVR':
                                                targetMenu = $('#ctxmenu_svr');
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
                                            case 'TRAP':
                                                targetMenu = $('#ctxmenu_trap');
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
                                else if (idxes.length == 1) {
                                    var rowdata = $evtHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                                    switch (rowdata.srcType) {
                                        case 'DEV':
                                            targetMenu = $('#ctxmenu_dev');
                                            break;
                                        case 'SVR':
                                            targetMenu = $('#ctxmenu_svr');
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
                                        case 'TRAP':
                                            targetMenu = $('#ctxmenu_trap');
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

                        $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_svr, #ctxmenu_trap').jqxMenu({
                            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
                        }).on('itemclick', function (event) {
                            CtxMenu_Evt.selectDevCtxmenu(event, $evtHistGrid);
                        });
                        break;
                    case 1: // 장애조치이력
                        // 기간
                        HmBoxCondition.createPeriod('_action');
                        // radio 조건
                        HmBoxCondition.createRadioInput($('#sSrchType_action'), HmResource.getResource('cond_srch_type'));
                        Master.createGrpTab_gyeongi(Main.selectActionHistoryTree);

                        HmGrid.create($evtActionHistGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    datafields: [
                                        {name: 'evtLevelStr', type: 'string'},
                                        {name: 'ymdhms', type: 'string'},
                                        {name: 'grpName', type: 'string'},
                                        {name: 'srcTypeStr', type: 'string'},
                                        {name: 'srcInfo', type: 'string'},
                                        {name: 'evtName', type: 'string'},
                                        {name: 'receiptMemo', type: 'string'},
                                        {name: 'sumSec', type: 'number'},
                                        {name: 'status', type: 'string'},
                                        {name: 'receiptUser', type: 'string'},
                                        {name: 'endYmdhms', type: 'string'},
                                        {name: 'limitDesc', type: 'string'},
                                    ]
                                },
                                {
                                    formatData: function (data) {
                                        var params = Master.getGrpTabParams();
                                        $.extend(data, params, HmBoxCondition.getPeriodParams('_action'), HmBoxCondition.getSrchParams('sSrchType_action'));
                                        data.actionFlag = 1;
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
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
                                    {text: '발생일시', datafield: 'ymdhms', width: 140, cellsalign: "center"},
                                    {text: '그룹', datafield: 'grpName', width: 150},
                                    {
                                        text: '장애종류',
                                        datafield: 'srcTypeStr',
                                        width: 70,
                                        cellsalign: 'center',
                                        filtertype: 'checkedlist'
                                    },
                                    {text: '장애대상', datafield: 'srcInfo', minwidth: 400},
                                    {text: '이벤트명', datafield: 'evtName', width: 140},
                                    {text: '조치내역', datafield: 'receiptMemo', width: 250},
                                    {
                                        text: '지속시간',
                                        datafield: 'sumSec',
                                        width: 150,
                                        cellsrenderer: HmGrid.cTimerenderer
                                    },
                                    {
                                        text: '장애상태',
                                        datafield: 'status',
                                        width: 70,
                                        cellsalign: 'center',
                                        filtertype: 'checkedlist'
                                    },
                                    {text: '조치자', datafield: 'receiptUser', cellsalign: 'center', width: 100},
                                    {text: '종료일시', datafield: 'endYmdhms', width: 140, cellsalign: "center"},
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
                                                case 'TRAP':
                                                    targetMenu = $('#ctxmenu_trap_action');
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
                                            case 'TRAP':
                                                targetMenu = $('#ctxmenu_trap_action');
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

                        $('#ctxmenu_evt_action, #ctxmenu_dev_action, #ctxmenu_if_action, #ctxmenu_ap_action, #ctxmenu_itmon_action, #ctxmenu_syslog_action, #ctxmenu_svr, #ctxmenu_trap').jqxMenu({
                            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
                        }).on('itemclick', function (event) {
                            CtxMenu_Evt.selectDevCtxmenu(event, $evtActionHistGrid);
                        });
                        break;
                }
            }
        });

        $('#mainTabs').on('selected', function (event) {
            var selectedTab = event.args.item;
            switch (selectedTab) {
                case 0: // 장애이력
                    if (isHide) {
                        /*  $('div.errGrpBox').css('height', '25px');*/
                        $('div.scontent').css('top', '100px');
                    } else {
                        /* $('div.errGrpBox').css('height', '105px');*/
                        $('div.scontent').css('top', '168px');
                    }

                    $('div.btnEvtGrp:first').css('display', isHide ? 'block' : 'none');
                    $('div.btnEvtGrp:last').css('display', isHide ? 'none' : 'block');
                    break;
                case 1: // 장애조치이력
                    if (isHide) {
                        $('div.scontent').css('top', '68px');
                    } else {
                        $('div.scontent').css('top', '65px');
                    }

                    break;
            }
        });

        var themeSetting= { theme: "ui-hamon-v1-tab-top" };
        $('#mainTabs').jqxTabs(themeSetting);


    },

    /** init data */
    initData: function () {
        this.initEvtCodeGrp();
    },

    initEvtCodeGrp: function () {

        // 이벤트 코드별 코드그룹 관리
        Server.get('/main/popup/evtCodeGrp/getCfgEvtGrpSubListAll.do', {
            success: function (result) {
                evtCodeMap = {};
                if (result != null && result.length > 0) {
                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return;
                        evtCodeMap[item.evtCode] = item.evtGrpNo;
                    });
                }
            }
        });

        // 코드그룹별 UI 생성
        Server.get('/main/popup/evtCodeGrp/getCfgEvtGrpList.do', {
            success: function (result) {
                if (result != null && result.length > 0) {

                    var table = $('#evtCodeGrpTable'),
                        docFrag = $(document.createDocumentFragment()),
                        headerTr = $('<tr></tr>', {style: 'height: 24px; border-bottom:1px solid #e0e0e0;'}),
                        stateTr = $('<tr></tr>');

                    // add all
                    headerTr.append($('<td></td>', {class: 'pop_gridSub focusTd'}).append($('<div></div>', {text: '전체'})));

                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'bubble bubbleSize50 normal',
                            text: '정상',
                            'data-key': 'all'
                        })));

                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return; //미표시
                        headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                            .append($('<div></div>', {text: item.evtGrpName}))
                        );

                        stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                            .append($('<div></div>', {
                                class: 'bubble bubbleSize50 normal',
                                text: '정상',
                                'data-key': item.evtGrpNo
                            })))
                    });

                    // add others
                    var othersStr = $('#gSiteName').val() == 'HyundaiCar' ? '경보' : 'Others';

                    headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                        .append($('<div></div>', {text: othersStr}))
                    );

                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'bubble bubbleSize50 normal',
                            text: '정상',
                            'data-key': 'etc'
                        })));

                    docFrag.append(headerTr);
                    docFrag.append(stateTr);
                    table.append(docFrag);
                }
                else {
                    $('div.errGrpBox').css('height', '25px');
                    $('div.errGrpBox > table tr:last').css('visibility', 'hidden');
                    $('div.scontent2').css('top', '168px');
                }

                // add event
                $('#evtCodeGrpTable td').on('click', function () {
                    var target = $(event.currentTarget);
                    var tdIndex = target.index();
                    $('#evtCodeGrpTable tr:first > td').removeClass('focusTd');
                    $('#evtCodeGrpTable tr:first').find('td:eq(' + tdIndex + ')').addClass('focusTd');
                    var dataKey = $('#evtCodeGrpTable tr:last').find('td:eq(' + tdIndex + ')').find('div').attr('data-key');
                    Main.applyCfgEvtGrpFilter(dataKey);
                });
            }
        });
    },

    setEvtCodeGrpState: function () {

        var rows = $evtHistGrid.jqxGrid('getboundrows');
        var stateDiv = $('#evtCodeGrpTable div.bubble');
        if (evtCodeMap === undefined) return;

        if (rows != null && rows.length > 0) {
            var maxLvl = 0;

            var evtMap = {
                all: {cnt: rows.length, lvl: 0},
                etc: {cnt: 0, lvl: 0}
            };

            for (var x in evtCodeMap) {
                evtMap[evtCodeMap[x]] = {cnt: 0, lvl: 0};
            }

            $.each(rows, function (evtIdx, evtItem) {
                if (evtItem.evtLevel > maxLvl) maxLvl = evtItem.evtLevel;
                if (evtCodeMap.hasOwnProperty(evtItem.code)) {
                    var tmp = evtMap[evtCodeMap[evtItem.code]];
                    tmp.cnt++;
                    if (tmp.lvl < evtItem.evtLevel) tmp.lvl = evtItem.evtLevel;
                } else {
                    evtMap.etc.cnt++;
                    if (evtMap.etc.lvl < evtItem.evtLevel) evtMap.etc.lvl = evtItem.evtLevel;
                }
            });

            evtMap.all.lvl = $('#gSiteName').val() == 'HyundaiCar' ? 6 : maxLvl;

            var evtClz = ['normal', 'info', 'warning', 'minor', 'major', 'critical', 'hyundaiCarAllLvl'];
            $.each(evtMap, function (key, item) {

                var div = $('#evtCodeGrpTable div[data-key="{0}"]'.substitute(key));
                div.text(item.cnt > 0 ? item.cnt : '정상');
                // 필터시 색상이 남아서 제거
                //if(item.lvl > 0) {
                div.removeClass().addClass('bubble bubbleSize50 {0}'.substitute(evtClz[item.lvl]));
                //}
            });
        } else {
            stateDiv.text('정상');
            stateDiv.removeClass().addClass('bubble bubbleSize50 normal');
        }
    },

    /** 이벤트그룹 필터 적용 */
    applyCfgEvtGrpFilter: function (evtGrpNo) {

        if (evtGrpNo == 'all') {
            $evtHistGrid.jqxGrid('removefilter', 'code');
        } else if (evtGrpNo == 'etc') { // others
            $evtHistGrid.jqxGrid('removefilter', 'code');
            var filtergroup = new $.jqx.filter(),
                operator = 0; //and
            for (var code in evtCodeMap) {
                filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', code, 'NOT_EQUAL'));
            }
            $evtHistGrid.jqxGrid('addfilter', 'code', filtergroup);
            $evtHistGrid.jqxGrid('applyfilters');
        } else {
            // find code list
            var codeList = [];
            for (var x in evtCodeMap) {
                if (evtCodeMap[x] == evtGrpNo) codeList.push(x);
            }
            if (codeList != null && codeList.length > 0) {
                $evtHistGrid.jqxGrid('removefilter', 'code');
                var filtergroup = new $.jqx.filter(),
                    operator = 1; //or
                for (var idx in codeList) {
                    filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', codeList[idx], 'EQUAL'));
                }
                $evtHistGrid.jqxGrid('addfilter', 'code', filtergroup);
                $evtHistGrid.jqxGrid('applyfilters');
            }
        }
    },

    refresh: function (actionFlag) {
        Main.searchHistory(actionFlag);
    },

    /** 그룹트리 선택이벤트 */
    selectHistoryTree: function () {
        Main.searchHistory(false);
    },

    selectActionHistoryTree: function () {
        Main.searchHistory(true);
    },

    searchHistory: function (actionFlag) {

        if (actionFlag) {
            HmGrid.updateBoundData($evtActionHistGrid, ctxPath + '/Gyeongischool4/oms/errHistory/getErrHistoryList.do');
        } else {
            HmGrid.updateBoundData($evtHistGrid, ctxPath + '/Gyeongischool4/oms/errHistory/getErrHistoryList.do');
        }

    },

    /** export Excel */
    exportExcel: function (actionFlag) {

        if (actionFlag)
            HmUtil.exportGrid($evtActionHistGrid, '장애조치이력', false);
        else
            HmUtil.exportGrid($evtHistGrid, '장애이력', false);

    },


    exportExcelHtml: function (actionFlag) {
        if (actionFlag)
            HmUtil.exportGridHtml($evtActionHistGrid, '장애조치이력', false);
        else
            HmUtil.exportGridHtml($evtHistGrid, '장애이력', false);
    },

    exportExcel__: function (actionFlag) {

        var params = Master.getGrpTabParams();

        if (actionFlag) {

            var sIP = "";
            var sDevName = "";

            if ($("input[name='srchType2']:checked").val() == "I") {
                //IP선택
                sIP = $("#srchText2").val();
            }

            if ($("input[name='srchType2']:checked").val() == "D") {
                //장비선택
                sDevName = $("#srchText2").val();
            }

            $.extend(params, {
                period: $("input[name='cbPeriod_evtActionHist']:checked").val(),
                date1: HmDate.getDateStr($('#date1_evtActionHist')),
                time1: HmDate.getTimeStr($('#date1_evtActionHist')),
                date2: HmDate.getDateStr($('#date2_evtActionHist')),
                time2: HmDate.getTimeStr($('#date2_evtActionHist')),
                sIp: sIP,
                sDevName: sDevName,
                actionFlag: 1
            });

//			HmUtil.exportGrid($evtActionHistGrid, "장애조치이력");

        } else {
//			HmUtil.exportGrid($evtHistGrid, "장애이력");
            $.extend(params, {
                period: $("input[name='cbPeriod_evtHist']:checked").val(),
                date1: HmDate.getDateStr($('#date1_evtHist')),
                time1: HmDate.getTimeStr($('#date1_evtHist')),
                date2: HmDate.getDateStr($('#date2_evtHist')),
                time2: HmDate.getTimeStr($('#date2_evtHist')),
                sIp: Master.getSrchIp(),
                sDevName: Master.getSrchDevName(),
                actionFlag: 0
            });
        }

        HmUtil.exportExcel(ctxPath + '/main/oms/errHistory/export.do', params);

    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});