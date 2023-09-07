var $cbPeriod_evtHist, $cbPeriod_evtActionHist;
var $evtHistGrid, $evtActionHistGrid;
var isHide = false;
var etcEvtCodeMap = [];
var evtCodeArr = [];
var keyKeep = null;
var evtCodeMap;
var _exist = false;

var Main = {
    /** variable */
    initVariable: function () {
        /*	$cbPeriod_evtHist = $('#cbPeriod_evtHist');
            $cbPeriod_evtActionHist = $('#cbPeriod_evtActionHist');*/
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
        $('.btnEvtGrp').bind('click', function (event) {
            isHide = $(event.currentTarget).attr('data-key') == 'hide';
            if (isHide) {
                $('div.errStatusBox').animate({height: '27px'}, 500);
                $('div.errStatusBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '89px'}, 500);
            } else {
                $('div.errStatusBox').animate({height: '74px'}, 500);
                $('div.errStatusBox > table tr:last').css('visibility', 'visible');
                $('div.scontent').animate({top: '138px'}, 500);
            }
            $('.btnEvtGrp:first').css('display', isHide ? 'inline-block' : 'none');
            $('.btnEvtGrp:last').css('display', isHide ? 'none' : 'inline-block');
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
        if ($('#gSiteName').val() == 'TTA') {
            $('#btnExcelHtml_evtHist, #btnExcelHtml_evtActionHist').css('display', 'inline-block');
        }

        HmJqxSplitter.createTree($('#mainSplitter'));
        CtxMenu_Evt.create('history');
        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: //장애이력
                        /*	Master.createPeriodCondition($cbPeriod_evtHist, $('#date1_evtHist'), $('#date2_evtHist'));*/

                        // HmDate.create($('#date1_evtHist'), $('#date2_evtHist'), HmDate.DAY, 0);
                        // $('#date1_evtHist').add($('#date2_evtHist')).jqxDateTimeInput({ disabled: true });
                        //
                        // Master.radioCbPeriodCondition($("input[name='cbPeriod_evtHist']:checked"), $('#date1_evtHist'), $('#date2_evtHist'));
                        //
                        // //구분 라디오 버튼 클릭 이벤트
                        // $("input:radio[name=cbPeriod_evtHist]").click(function(){
                        // 	if($("input[name='cbPeriod_evtHist']:checked").val() == "-1"){//사용자설정
                        // 		$('#date1_evtHist').add( $('#date2_evtHist')).jqxDateTimeInput({ disabled: false });
                        // 	}else{
                        // 		Master.radioCbPeriodCondition($("input[name='cbPeriod_evtHist']:checked"), $('#date1_evtHist'), $('#date2_evtHist'));
                        // 	}
                        // });

                        Master.createGrpTab(Main.selectHistoryTree);



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
                                        {name: 'grpName', type: 'string'},
                                        {name: 'srcTypeStr', type: 'string'},
                                        {name: 'srcType', type: 'string'},
                                        {name: 'srcInfo', type: 'string'},
                                        {name: 'devLocation', type: 'string' },
                                        {name: 'code', type: 'string'},
                                        {name: 'evtName', type: 'string'},
                                        {name: 'sumSec', type: 'number'},
                                        {name: 'status', type: 'string'},
                                        {name: 'progressState', type: 'string'},
                                        {name: 'receiptUser', type: 'string'},
                                        {name: 'endYmdhms', type: 'string'},
                                        {name: 'receiptMemo', type: 'string'},
                                        {name: 'limitDesc', type: 'string'}
                                    ]
                                },
                                {
                                    formatData: function (data) {
                                        var params = Master.getGrpTabParams();
                                        // $.extend(params, {
                                        // 	period: $("input[name='cbPeriod_evtHist']:checked").val(),
                                        // 	date1: HmDate.getDateStr($('#date1_evtHist')),
                                        // 	time1: HmDate.getTimeStr($('#date1_evtHist')),
                                        // 	date2: HmDate.getDateStr($('#date2_evtHist')),
                                        // 	time2: HmDate.getTimeStr($('#date2_evtHist')),
                                        // 	sIp: Master.getSrchIp(),
                                        // 	sDevName: Master.getSrchDevName(),
                                        // 	actionFlag: 0
                                        // });
                                        // $.extend(data, params);
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
                                    {
                                        text: '장애종류',
                                        datafield: 'srcTypeStr',
                                        width: 70,
                                        cellsalign: 'center',
                                        filtertype: 'checkedlist'
                                    },
                                    {text: '장애종류코드', datafield: 'srcType', hidden: true},
                                    {text: '장애대상', datafield: 'srcInfo', minwidth: 405},
                                    {text: '장비위치', datafield: 'devLocation', width: 150, hidden: true  },
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
                                    {text: '조치자', datafield: 'receiptUser', width: 100},
                                    {text: '종료일시', datafield: 'endYmdhms', width: 140, cellsalign: "center"},
                                    {text: '조치내역', datafield: 'receiptMemo', width: 150},
                                    {text: '이벤트설명', datafield: 'limitDesc', width: 250}
                                ]
                        }, CtxMenu.NONE);

                        $evtHistGrid.on('bindingcomplete', function () {
                            Main.setEvtCodeGrpState();
                        });

                        $evtHistGrid.on('rowdoubleclick', function (event) {
                            /* shift를 입력중이면 더블클릭이벤트가 발생하지 않도록 변경 */
                            if (event.args.originalEvent.shiftKey) return;
                            /* 우클릭으로 더블클릭이벤트가 발생하지 않도록 변경 */
                            if (event.args.rightclick) return;

                            var rowIdx = event.args.rowindex;
                            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);

                            rowdata.disSumSec = HmUtil.convertCTime(rowdata.sumSec);
                            var params = {
                                type: 'HIST'
                            };
                            $.extend(params, rowdata);
                            $.post(ctxPath + '/main/popup/nms/pEvtDetail.do', params, function (result) {
                                HmWindow.openFit($('#pwindow'), '이벤트 상세', result, 800, 430, 'pwindow_init', params);
                            });
                        });

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
                        // HmDate.create($('#date1_evtActionHist'), $('#date2_evtActionHist'), HmDate.DAY, 0);
                        // $('#date1_evtActionHist').add($('#date2_evtActionHist')).jqxDateTimeInput({ disabled: true });
                        //
                        // Master.radioCbPeriodCondition($("input[name='cbPeriod_evtActionHist']:checked"), $('#date1_evtActionHist'), $('#date2_evtActionHist'));
                        //
                        // //구분 라디오 버튼 클릭 이벤트
                        // $("input:radio[name=cbPeriod_evtActionHist]").click(function(){
                        // 	if($("input[name='cbPeriod_evtActionHist']:checked").val() == "-1"){//사용자설정
                        // 		$('#date1_evtActionHist').add( $('#date2_evtActionHist')).jqxDateTimeInput({ disabled: false });
                        // 	}else{
                        // 		Master.radioCbPeriodCondition($("input[name='cbPeriod_evtActionHist']:checked"), $('#date1_evtActionHist'), $('#date2_evtActionHist'));
                        // 	}
                        // });

                        /*	Master.createPeriodCondition($cbPeriod_evtActionHist, $('#date1_evtActionHist'), $('#date2_evtActionHist'));*/

                        // 기간
                        HmBoxCondition.createPeriod('_action');
                        // radio 조건
                        HmBoxCondition.createRadioInput($('#sSrchType_action'), HmResource.getResource('cond_srch_type'));
                        Master.createGrpTab(Main.selectActionHistoryTree);

                        HmGrid.create($evtActionHistGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    datafields: [
                                        {name: 'seqNo', type: 'number'},
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
                                        // var sIP = "";
                                        // var sDevName = "";
                                        // if($("input[name='srchType2']:checked").val() == "I"){ //IP선택
                                        // 	sIP =  $("#srchText2").val();
                                        // }
                                        // if($("input[name='srchType2']:checked").val() == "D"){ //장비선택
                                        // 	sDevName =  $("#srchText2").val();
                                        // }
                                        // $.extend(params, {
                                        // 	period: $("input[name='cbPeriod_evtActionHist']:checked").val(),
                                        // 	date1: HmDate.getDateStr($('#date1_evtActionHist')),
                                        // 	time1: HmDate.getTimeStr($('#date1_evtActionHist')),
                                        // 	date2: HmDate.getDateStr($('#date2_evtActionHist')),
                                        // 	time2: HmDate.getTimeStr($('#date2_evtActionHist')),
                                        // 	sIp:sIP,
                                        // 	sDevName:sDevName,
                                        // 	actionFlag: 1
                                        // });
                                        // $.extend(data, params);
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
                                    {text: '시퀀스', datafield: 'seqNo', hidden: true},
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
                        $('div.scontent').css('top', '138px');
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
                evtCodeArr = [];
                keyKeep = null;
                if (result != null && result.length > 0) {
                    $.each(result, function (idx, item) {
                        if(idx === result.length - 1) { //마지막 데이터 적용
                            evtCodeMap[keyKeep] = evtCodeArr;
                        }
                        if (item.isUse != 1) return;

                        if (etcEvtCodeMap.findIndex(v => v === item.evtCode) < 1 ) etcEvtCodeMap.push(item.evtCode);

                        if (keyKeep === null) keyKeep = item.evtGrpNo;

                        if (keyKeep !== item.evtGrpNo) {
                            evtCodeMap[keyKeep] = evtCodeArr;
                            evtCodeArr = [];
                            evtCodeArr.push(item.evtCode);
                            keyKeep = item.evtGrpNo
                        }
                        else {
                            evtCodeArr.push(item.evtCode);
                        }

                    });

                    //현대차 이벤트 이력 Syslog 통계 별도 출력 (우측끝) 등록된 전체 Syslog 코드리스트 조회 후 evtCodeMap에 삽입. 예외 evtGrpNo: 'hyundaiSyslog'
                    if ($('#gSiteName').val() == 'HyundaiCar') {

                        Server.get('/main/popup/evtCodeGrp/getCertainEvtCodeList.do', {
                            data: {evtType: 'SYSLOG'},
                            success: function (syslogCodeResult) {
                                $.each(syslogCodeResult, function (idx, item) {
                                    console.log(item);
                                    evtCodeMap[item.CODE] = 'hyundaiSyslog';
                                });
                            }
                        });

                    }
                }
            }
        });

        // 코드그룹별 UI 생성
        Server.get('/main/popup/evtCodeGrp/getCfgEvtGrpList.do', {
            success: function (result) {
                if (result != null && result.length > 0) {

                    var table = $('#evtCodeGrpTable'),
                        docFrag = $(document.createDocumentFragment()),
                        headerTr = $('<tr></tr>', {style: 'height: 24px;'}),
                        stateTr = $('<tr></tr>');
                    table.empty();
                    //전체
                    headerTr.append($('<td></td>', {class: 'pop_gridSub focusTd'})
                        .append($('<div></div>', {text: '전체'}))
                    );

                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'eventBg',
                            style: 'opacity:0;', //202.12.26 흰색 적용 후 바뀌지 않아서 1로 변경// 2023.02.01 - 정상일때 흰색이오니 변경 금지
                            'data-key': 'all'
                        }))
                        .append($('<span></span>',{
                            class: 'errEffect ',
                            text: '정상',
                            'data-key': 'all'
                        }))
                    );

                    //가운데
                    $.each(result, function (idx, item) {
                        if (item.isUse != 1) return; //미표시
                        headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                            .append($('<div></div>', {text: item.evtGrpName}))
                        );

                        stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                            .append($('<div></div>', {
                                class: 'eventBg',
                                style: 'opacity:0;', //2022.12.25// 2023.02.01 - 정상일때 흰색이오니 변경 금지
                                'data-key': item.evtGrpNo
                            }))
                            .append($('<span></span>',{
                                class: 'errEffect ',
                                text: '정상',
                                'data-key': item.evtGrpNo
                            }))
                        );
                    });

                    //기타
                    var othersStr = $('#gSiteName').val() == 'HyundaiCar' ? '경보' : '기타';

                    headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                        .append($('<div></div>', {text: othersStr}))
                    );

                    stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                        .append($('<div></div>', {
                            class: 'eventBg',
                            style: 'opacity:0;', //202.12.26 흰색 적용 후 바뀌지 않아서 1로 변경// 2023.02.01 - 정상일때 흰색이오니 변경 금지
                            'data-key': 'etc'
                        }))
                        .append($('<span></span>',{
                            class: 'errEffect ',
                            text: '정상',
                            'data-key': 'etc'
                        }))
                    );
                    docFrag.append(headerTr);
                    docFrag.append(stateTr);
                    table.append(docFrag);

                    if ($('#gSiteName').val() == 'HyundaiCar') {
                        var hyundaiSyslog = 'SYSLOG';
                        headerTr.append($('<td></td>', {class: 'pop_gridSub'})
                            .append($('<div></div>', {text: hyundaiSyslog}))
                        );
                        stateTr.append($('<td></td>', {class: 'pop_gridVal'})
                            .append($('<div></div>', {
                                class: 'eventBg',
                                text: '정상',
                                style: 'opacity:0;',
                                'data-key': 'hyundaiSyslog'
                            }))
                            .append($('<span></span>',{
                                class: 'errEffect ',
                                text: '정상',
                                'data-key': 'hyundaiSyslog'
                            }))
                        );
                        docFrag.append(headerTr);
                        docFrag.append(stateTr);
                        table.append(docFrag);
                    }
                }
                else {
                    $('div.errGrpBox').css('height', '25px');
                    $('div.errGrpBox > table tr:last').css('visibility', 'hidden');
                    $('div.scontent2').css('top', '138px');
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

    /*
    * 이벤트 조회 완료 후 상단 이벤트 그룹 표시
    * */
    setEvtCodeGrpState: function () {

        var rows = $evtHistGrid.jqxGrid('getboundrows');
        var stateDiv = $('#evtCodeGrpTable div.eventBg');
        var stateSpan = $('#evtCodeGrpTable span.errEffect');
        if (evtCodeMap === undefined) return;

        if (rows != null && rows.length > 0) {
            var maxLvl = 0;
            var evtMap = {
                all: {cnt: rows.length, lvl: 0},
                etc: {cnt: 0, lvl: 0}
            };
            for (var x in evtCodeMap) {
                evtMap[x] = {cnt: 0, lvl: 0};
            }

            $.each(rows, function (evtIdx, evtItem) {
                _exist = false;
                if (evtItem.evtLevel > maxLvl) maxLvl = evtItem.evtLevel;
                for (var i=0; i < Object.keys(evtMap).length; i++ ) {
                    if (Object.keys(evtMap)[i] !== 'all' && Object.keys(evtMap)[i] !== 'etc') {
                        if ( evtCodeMap[Object.keys(evtCodeMap)[i]].findIndex(v => v === evtItem.code) > -1 ) {
                            evtMap[parseInt(Object.keys(evtMap)[i])].cnt++;
                            if (evtMap[parseInt(Object.keys(evtMap)[i])].lvl < evtItem.evtLevel) evtMap[parseInt(Object.keys(evtMap)[i])].lvl = evtItem.evtLevel;
                            _exist = true;
                        }
                    }
                }

                if (!_exist) {
                    evtMap.etc.cnt++;
                    if (evtMap.etc.lvl < evtItem.evtLevel) evtMap.etc.lvl = evtItem.evtLevel;
                }
            });

            evtMap.all.lvl = $('#gSiteName').val() == 'HyundaiCar' ? 6 : maxLvl;

            var evtClz = ['normal', 'info', 'warning', 'minor', 'major', 'critical', 'hyundaiCarAllLvl'];
            $.each(evtMap, function (key, item) {

                var div = $('#evtCodeGrpTable div[data-key="{0}"]'.substitute(key));
                var span = $('#evtCodeGrpTable span[data-key="{0}"]'.substitute(key));
                span.text(item.cnt > 0 ? item.cnt : '정상');
                // 필터시 색상이 남아서 제거
                if(item.lvl > 0) {
                    div.removeClass().addClass('eventBg {0}'.substitute(evtClz[item.lvl]));
                    if(item.lvl !== 0) {//정상은 흰색. 나머지는 이벤트 level 색 적용
                        div.attr('style', 'opacity:1')
                    }
                }
                else {
                    div.removeClass();
                }
            });
        }
        else {
            stateSpan.text('정상');
            stateDiv.removeClass().addClass('eventBg');
            if ($('#gSiteName').val() == 'HyundaiCar')
                $('#evtCodeGrpTable div[data-key="all"]').removeClass().addClass('eventBg hyundaiCarAllLvl');
        }
    },

    /** 이벤트그룹 필터 적용 */
    applyCfgEvtGrpFilter: function (evtGrpNo) {
        console.log(evtGrpNo);
        if (evtGrpNo == 'all') {
            $evtHistGrid.jqxGrid('removefilter', 'code');
        }
        else if (evtGrpNo == 'etc') { // others
            $evtHistGrid.jqxGrid('removefilter', 'code');
            var filtergroup = new $.jqx.filter(),
                operator = 0; //and

            for (var code in etcEvtCodeMap) {
                filtergroup.addfilter(operator, filtergroup.createfilter('stringfilter', etcEvtCodeMap[code], 'NOT_EQUAL'));
            }
            $evtHistGrid.jqxGrid('addfilter', 'code', filtergroup);
            $evtHistGrid.jqxGrid('applyfilters');
        }
        else {
            // find code list
            var codeList = [];
            for (var x in evtCodeMap) {
                if (x == evtGrpNo) codeList = evtCodeMap[evtGrpNo];
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
        Main.initEvtCodeGrp();
        Main.searchHistory(false);
    },

    selectActionHistoryTree: function () {
        Main.initEvtCodeGrp();
        Main.searchHistory(true);
    },

    searchHistory: function (actionFlag) {

        if ($("#gSiteName").val() == "KangOneEdu") {
            if (actionFlag) {
                /*Master.refreshCbPeriod($cbPeriod_evtHist);*/
                HmGrid.updateBoundData($evtActionHistGrid, ctxPath + '/kac/oms/errHistory/getErrHistoryList.do');
            } else {
                /*Master.refreshCbPeriod($cbPeriod_evtActionHist);*/
                HmGrid.updateBoundData($evtHistGrid, ctxPath + '/kac/oms/errHistory/getErrHistoryList.do');
            }
        } else {
            if (actionFlag) {
                /*Master.refreshCbPeriod($cbPeriod_evtHist);*/
                HmGrid.updateBoundData($evtActionHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
            } else {
                /*Master.refreshCbPeriod($cbPeriod_evtActionHist);*/
                HmGrid.updateBoundData($evtHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
            }

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
            if ($("input[name='srchType2']:checked").val() == "I") { //IP선택
                sIP = $("#srchText2").val();
            }
            if ($("input[name='srchType2']:checked").val() == "D") { //장비선택
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

        /*
        var params = Master.getGrpTabParams();
        $.extend(params, {
            period: $cbPeriod_evtHist.val(),
            date1: HmDate.getDateStr($('#date1_evtHist')),
            time1: HmDate.getTimeStr($('#date1_evtHist')),
            date2: HmDate.getDateStr($('#date2_evtHist')),
            time2: HmDate.getTimeStr($('#date2_evtHist')),
            sIp: $('#sIp').val(),
            sDevName: $('#sDevName').val()
        });

        HmUtil.exportExcel(ctxPath + '/main/oms/errHistory/export.do', params);*/
    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});