var $eventTabs;
var $cbPeriod_evtHist, $cbPeriod_evtActionHist,$evtHistGrid, $evtActionHistGrid;

var $dtlTab;
//설정 탭
var $svrGrid;
var curSvrNo = -1;
var evtLevelList = [];
var pollList = [];
var sAuth;
var pgSiteName, pInitArea;

var PMain = {

    initVariable: function() {
        $dtlTab = $('#dtlTab');
        $eventTabs = $('#eventTabs');


        $mainProcessGrid = $('#mainProcessGrid');
        $filesysGrid = $('#filesysGrid');
        $networkGrid = $('#networkGrid');
        pInitArea = $('#initArea').val();


        sAuth = $('#sAuth').val().toUpperCase();
        pgSiteName = $('#gSiteName').val();

        //이벤트 > 현황
        $evtGrid = $('#evtGrid');

        //이벤트 > 이력
        $cbPeriod_evtHist = $('#cbPeriod_evtHist');
        $cbPeriod_evtActionHist = $('#cbPeriod_evtActionHist');
        $evtHistGrid = $('#evtHistoryGrid');
        $evtActionHistGrid = $('#evtActionHistoryGrid');

    },

    observe: function () {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'pbtnClose':self.close();break;
            case "btnSearch_evtHist": PMain.searchHistory(false); break;
            case "btnExcel_evtHist": PMain.exportExcel(false); break;
            case "btnSearch_evtActionHist": PMain.searchHistory(true); break;
            case "btnExcel_evtActionHist": PMain.exportExcel(true); break;

            // 감시프로세스 저장
            case 'btnAdd_cfg': this.addConfig(); break;
			case 'btnDel_cfg': this.delConfig(); break;
			case 'btnSave_cfg': this.saveConfig(); break;
			case 'btnSearch_cfg': this.searchConfig(); break;
			case 'btnMultiAdd_cfg': this.saveMprocList(); break;
            case 'btnChgInfo': this.chgInfo(); break;
        }
    },

    initData: function () {

        $('.p_content_layer').css('display', 'block');

    	Server.get('/code/getCodeListByCodeKind.do', {
        	data: { codeKind: 'MPROC_EVT_LEVEL' },
        	success: function(result) {
        		evtLevelList = result;
        	}
        });

    	Server.get('/code/getCodeListByCodeKind.do', {
            data: { codeKind: 'PERF_POLL_TYPE' },
        	success: function(result) {
        		pollList = result;
        	}
        });

    },
    initDesign: function () {
        $('#ctxmenu_evt, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_svr, #ctxmenu_evt_action, #ctxmenu_itmon_action, #ctxmenu_syslog_action').jqxMenu({
            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        }).on('itemclick', function(event) {
            PMain.selectDevCtxmenu(event);
        });

        //메인탭
        $dtlTab.jqxTabs({width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0:// 요약
                        break;

                    case 1:// 성능
                        pPerfInfo.initDesign();
                        pPerfInfo.initData();
                        break;

                    case 2://이벤트 탭
                        $eventTabs.jqxTabs({width: '100%', height: '100%',theme: 'ui-hamon-v1-tab-mid',
                            initTabContent: function(tab) {
                                switch(tab) {
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
                    case 3://감시프로세스 탭
                        pMprocess.initDesign();
                        pMprocess.initData();
                        break;
                    case 4://프로세스 탭
                        pProcess.initDesign();
                        pProcess.initData();
                        break;
                    case 5://파일시스템 탭
                        pFileSystem.initDesign();
                        pFileSystem.initData();
                        break;
                    case 6://디스크
                        pDisk.initDesign();
                        pDisk.initData();
                        break;
                    case 7://네트워크 탭
                        pNetwork.initDesign();
                        pNetwork.initData();
                        break;
                    case 8:// 세션
                        pSession.initDesign();
                        pSession.initData();
                        break;
                    case 9:// 자산
                        pAsset.initDesign();
                        pAsset.initData();
                        break;
                    case 10:// WAS
                        pWas.initDesign();
                        pWas.initData();
                        break;
                    case 11:// DBMS
                        pDbms.initDesign();
                        pDbms.initData();
                        break;
                    case 12: //AccessLog
                        pAccessLog.initDesign();
                        pAccessLog.initData();
                        break;
                    case 13:
                        pSvrInfo.initDesign();
                        pSvrInfo.initData();
                        break;
                    case 14: // 기간
                        SvrPerfTree.initDesign();
                        SvrPerfChart.initDesign();
                        ProcessGrid.initDesign();
                        break;
                    case 15: // 임계치가이드
                        pSvrPerfThreshold.initDesign();
                        pSvrPerfThreshold.initData();
                        break;
                    case 16: // 실시간
                        pPerfRealtime.initDesign();
                        pPerfRealtime.initData();
                        pPerfRealtime.initialize();
                        break;
                    case 17: // TCP 세션
                        pTcpSession.initDesign();
                        svcPort.createChart();
                        break;

                }

                var wasDflag = $('#wasNo').val() ? 'block' : 'none';
                var dbmsDflag = $('#dbmsNo').val() ? 'block' : 'none';
                $('#dtlTab .jqx-tabs-title:eq(10)').css('display', wasDflag);
                $('#dtlTab .jqx-tabs-title:eq(11)').css('display', dbmsDflag);

                // session(세션), 접속로그 Tab은 엔진팀 개발 완료 후 활성화 예정 2022.01.14 숨김처리
                $('#dtlTab .jqx-tabs-title:eq(8)').css('display', 'none');
                $('#dtlTab .jqx-tabs-title:eq(12)').css('display', 'none');
            }
        })
        .on('selected', function(event) {
            var selectedTab = event.args.item;
            if(selectedTab==0){
                pSvrSummary_evtStatus.resizeSvg();
            }
        });

        if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
            $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
            // $('#jqxtabs').jqxTabs('disableAt', 7); // 권한에 따른 설정탭 숨김
        }

        //이벤트탭 현황 그리드
        $evtGrid.on('contextmenu', function() { return false; })
            .on('rowclick', function(event) {
                if(event.args.rightclick) {
                    $('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_svr').jqxMenu('close');
                    var targetMenu = null;
                    $evtGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtGrid.jqxGrid('getselectedrowindexes');
                    // 선택 Row 개수가 1이상일때
                    if(idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function(idx, value) {
                            var tmp = $evtGrid.jqxGrid('getrowdata', value);
                            if(tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if(_list.length > 1) targetMenu = $('#ctxmenu_evt');
                        else if(_list.length == 1) {	// 우클릭메뉴가 제공되는 이벤트가 1개일때
                            switch(_list[0].srcType) {
                                case 'SVR': targetMenu = $('#ctxmenu_svr'); break;
                                case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
                                default: targetMenu = $('#ctxmenu_evt'); break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon');
                        }
                    }
                    else if(idxes.length == 1) { // 선택 Row가 1개일때
                        var rowdata = $evtGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch(rowdata.srcType) {
                            case 'SVR': targetMenu = $('#ctxmenu_svr'); break;
                            case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
                            default: targetMenu = $('#ctxmenu_evt'); break;
                        }
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
        HmGrid.create($evtGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype : 'json'
                },
                {
                    formatData : function(data) {
                        $.extend(data, {mngNo: $('#mngNo').val(), /*srcType:'SVR'*/});
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns : [
                { text : '장애등급', datafield : 'evtLevelStr', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
                    createfilterwidget: function (column, columnElement, widget) {
                        widget.jqxDropDownList({
                            renderer: HmGrid.evtLevelFilterRenderer
                        });
                    }
                },
                { text : '발생일시', datafield : 'ymdhms', cellsalign: 'center', width : 140 },
                { text : '그룹', datafield : 'grpName', width : 100 },
                { text : '장애종류', datafield : 'srcTypeStr', width: 70, cellsalign: 'center' },
                { text : '장애대상', datafield : 'srcInfo', minwidth : 400 },
                { text : '이벤트명', datafield : 'evtName', width : 140 },
                { text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
                { text : '장애상태', datafield : 'status', width: 70, cellsalign: 'center' },
                { text : '진행상태', datafield : 'progressState', width: 70, cellsalign: 'center' },
                { text : '조치내역', datafield : 'receiptMemo', width: 150 },
                { text : '이벤트설명', datafield : 'limitDesc', width: 250 }
            ]
        }, CtxMenu.NONE);

        //이벤트탭 이력 그리드
        Master.createPeriodCondition($cbPeriod_evtHist, $('#date1_evtHist'), $('#date2_evtHist'));

        HmGrid.create($evtHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        var params = {
                            period: $cbPeriod_evtHist.val(),
                            date1: HmDate.getDateStr($('#date1_evtHist')),
                            time1: HmDate.getTimeStr($('#date1_evtHist')),
                            date2: HmDate.getDateStr($('#date2_evtHist')),
                            time2: HmDate.getTimeStr($('#date2_evtHist')),
                            sIp: $('#devIp').val(),
                            sDevName: $('#devName').val(),
                            actionFlag: 0,
                            // srcType:'SVR',
                            mngNo: $('#mngNo').val()
                        };
                        $.extend(data, params);
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns:
                [
                    { text : '장애등급', datafield : 'evtLevelStr', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    { text : '일시', datafield : 'ymdhms', width : 140, cellsalign: 'center' },
                    { text : '장애종류', datafield : 'srcTypeStr', cellsalign: 'center', width: 80 },
                    { text : '장애대상', datafield : 'srcInfo', minwidth : 400 },
                    { text : '이벤트명', datafield : 'evtName', width : 140 },
                    { text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
                    { text : '장애상태', datafield : 'status', cellsalign: 'center', width: 80 },
                    { text : '조치자', datafield : 'receiptUser', cellsalign: 'center', width: 100 },
                    { text : '종료일시', datafield : 'endYmdhms', width: 140, cellsalign: 'center' },
                    { text : '조치내역', datafield : 'receiptMemo', width: 150 },
                    { text : '이벤트설명', datafield : 'limitDesc', width: 250 }
                ]
        }, CtxMenu.NONE);

        $evtHistGrid.on('contextmenu', function() { return false; })
            .on('rowclick', function(event) {
                if(event.args.rightclick) {
                    var targetMenu = null;
                    $evtHistGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtHistGrid.jqxGrid('getselectedrowindexes');
                    if(idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function(idx, value) {
                            var tmp = $evtHistGrid.jqxGrid('getrowdata', value);
                            if(tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if(_list.length > 1) targetMenu = $('#ctxmenu_evt_action');
                        else if(_list.length == 1) {
                            switch(_list[0].srcType) {
                                case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
                                default: targetMenu = $('#ctxmenu_evt_action'); break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon');
                        }
                    }
                    else if(idxes.length == 1) {
                        var rowdata = $evtHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch(rowdata.srcType) {
                            case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
                            default: targetMenu = $('#ctxmenu_evt_action'); break;
                        }
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

        //이벤트탭 조치이력 그리드
        Master.createPeriodCondition($cbPeriod_evtActionHist, $('#date1_evtActionHist'), $('#date2_evtActionHist'));
        HmGrid.create($evtActionHistGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        var params = {
                            period: $cbPeriod_evtActionHist.val(),
                            date1: HmDate.getDateStr($('#date1_evtActionHist')),
                            time1: HmDate.getTimeStr($('#date1_evtActionHist')),
                            date2: HmDate.getDateStr($('#date2_evtActionHist')),
                            time2: HmDate.getTimeStr($('#date2_evtActionHist')),
                            sIp: $('#devIp').val(),
                            sDevName: $('#devName').val(),
                            actionFlag: 1,
                            // srcType:'SVR',
                            mngNo: $('#mngNo').val()
                        };
                        $.extend(data, params);
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns:
                [
                    { text : '장애등급', datafield : 'evtLevelStr', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
                        createfilterwidget: function (column, columnElement, widget) {
                            widget.jqxDropDownList({
                                renderer: HmGrid.evtLevelFilterRenderer
                            });
                        }
                    },
                    { text : '일시', datafield : 'ymdhms', width : 140, cellsalign: 'center' },
                    { text : '장애종류', datafield : 'srcTypeStr', cellsalign: 'center', width: 80 },
                    { text : '장애대상', datafield : 'srcInfo', minwidth : 400 },
                    { text : '이벤트명', datafield : 'evtName', width : 140 },
                    { text : '조치내역', datafield : 'receiptMemo', width: 250 },
                    { text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
                    { text : '장애상태', datafield : 'status', cellsalign: 'center', width: 80 },
                    { text : '조치자', datafield : 'receiptUser', cellsalign: 'center', width: 100 },
                    { text : '종료일시', datafield : 'endYmdhms', width: 140, cellsalign: 'center' },
                    { text : '이벤트설명', datafield : 'limitDesc', width: 150 }
                ]
        }, CtxMenu.NONE);

        $evtActionHistGrid.on('contextmenu', function() { return false; })
            .on('rowclick', function(event) {
                if(event.args.rightclick) {
                    var targetMenu = null;
                    $evtActionHistGrid.jqxGrid('selectrow', event.args.rowindex);
                    var idxes = $evtActionHistGrid.jqxGrid('getselectedrowindexes');
                    if(idxes.length > 1) {
                        var _list = [];
                        $.each(idxes, function(idx, value) {
                            var tmp = $evtActionHistGrid.jqxGrid('getrowdata', value);
                            if(tmp.srcType == 'ITMON') return;
                            _list.push(tmp);
                        });

                        if(_list.length > 1) targetMenu = $('#ctxmenu_evt_action');
                        else if(_list.length == 1) {
                            switch(_list[0].srcType) {
                                case 'ITMON': targetMenu = $('#ctxmenu_itmon_action'); break;
                                default: targetMenu = $('#ctxmenu_evt_action'); break;
                            }
                        }
                        else {
                            targetMenu = $('#ctxmenu_itmon_action');
                        }
                    }
                    else if(idxes.length == 1) {
                        var rowdata = $evtActionHistGrid.jqxGrid('getrowdata', event.args.rowindex);
                        switch(rowdata.srcType) {
                            case 'ITMON': targetMenu = $('#ctxmenu_itmon_action'); break;
                            default: targetMenu = $('#ctxmenu_evt_action'); break;
                        }
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

        if(pInitArea == ("WebTopologyEvt"))
        {
            $('#jqxtabs').jqxTabs({selectedItem:2});
        }

    },

    /** ContextMenu */
    selectDevCtxmenu: function(event) {
        var tabIdx = $eventTabs.val();
        var $grid;
        // tab 에 따른 그리드 할당
        switch(tabIdx){
            case 0: // 현황
                $grid = $evtGrid;
                break;
            case 1: // 이력
                $grid = $evtHistGrid;
                break;
            case 2: // 조치이력
                $grid = $evtActionHistGrid;
                break;
            default: return;
        }

        var val = $(event.args)[0].id;
        if(val == null) return;
        switch(val) {
            case 'cm_evtAction':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if(rowidxes === false) return;
                    var _seqNos = [];
                    $.each(rowidxes, function(idx, value) {
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
                        success: function(result) {
                            HmWindow.open($('#pwindow'), '장애조치', result, 660, 520, "init");
                        }
                    });
                } catch(e) {}
                break;
            case 'cm_evtPause':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if(!confirm('선택한 이벤트를 일시정지 하시겠습니까?')) return;
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function(idx, value) {
                        _seqNos.push($grid.jqxGrid('getrowdata', value).seqNo);
                        _rowids.push($grid.jqxGrid('getrowid', value));
                    });
                    var params = {
                        seqNos: _seqNos
                    };
                    Server.post('/main/popup/errAction/saveEvtPause.do', {
                        data: params,
                        success: function() {
                            $.each(_rowids, function(idx, value) {
                                $grid.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 정지되었습니다.');
                        }
                    });
                } catch(e) {}
                break;
            case 'cm_evtResume':
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function(idx, value) {
                        var tmp = $grid.jqxGrid('getrowdata', value);
                        if(tmp.status == '일시정지') {
                            _seqNos.push(tmp.seqNo);
                            _rowids.push($grid.jqxGrid('getrowid', value));
                        }
                    });

                    if(_seqNos.length == 0) {
                        alert('선택한 데이터 중 일시정지 상태인 이벤트가 존재하지 않습니다.');
                        return;
                    }
                    if(!confirm('선택한 이벤트를 재개 하시겠습니까?')) return;
                    var params = {
                        seqNos: _seqNos
                    };
                    Server.post('/main/popup/errAction/saveEvtResume.do', {
                        data: params,
                        success: function() {
                            $.each(_rowids, function(idx, rowid) {
                                $grid.jqxGrid('setcellvaluebyid', rowid, 'status', '진행중');
                            });
                            alert('선택한 이벤트가 재개되었습니다.');
                        }
                    });
                } catch(e) {}
                break;
            case 'cm_devJobReg':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo,
                        devName: rowdata.devName
                    };

                    $.post(ctxPath +  '/main/popup/nms/pJobAdd.do',
                        params,
                        function(result) {
                            HmWindow.openFit($('#pwindow'), rowdata.disDevName + ' 장비작업등록', result, 750, 660);
                        }
                    );
                } catch(e) {}
                break;
            case 'cm_ping':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo
                    };
                    HmUtil.showPingPopup(params);
                } catch(e) {}
                break;
            case 'cm_telnet':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.telnet(rowdata.devIp);
                } catch(e) {}
                break;
            case 'cm_tracert':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        mngNo: rowdata.mngNo
                    };
                    HmUtil.showTracertPopup(params);
                } catch(e) {}
                break;
            case 'cm_ssh':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.ssh(rowdata.devIp);
                } catch(e) {}
                break;
            case 'cm_http':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.http(rowdata.devIp);
                } catch(e) {}
                break;
            case 'cm_https':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    ActiveX.https(rowdata.devIp);
                } catch(e) {}
                break;
            case 'cm_ifJobReg':
                try {
                    var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);
                    var params = {
                        ifIdx: rowdata.srcIdx,
                        ifName: rowdata.ifName,
                        mngNo : rowdata.mngNo
                    };
                    $.ajax({
                        url: ctxPath +  '/main/popup/nms/pJobAdd.do',
                        type: 'POST',
                        data: JSON.stringify(params),
                        contentType: 'application/json; charset=utf-8',
                        success: function(result){

                            var alias = (rowdata.ifAlias && rowdata.ifAlias !== "" && rowdata.ifAlias !== undefined) ? '(' + rowdata.ifAlias + ')' : "";
                            HmWindow.openFit($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + alias +'] 회선작업등록', result, 750, 660);
                        }
                    });
                } catch(e) {}
                break;
            case 'cm_evt_stop': //이벤트 중지(SYSLOG삭제)
                try {
                    var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    var _seqNos = [];
                    var _rowids = [];
                    $.each(rowidxes, function(idx, value) {
                        var tmp = $grid.jqxGrid('getrowdata', value);
                        if(tmp.srcType == 'SYSLOG') {
                            _seqNos.push(tmp.seqNo);
                            _rowids.push(tmp.uid);
                        }
                    });
                    if(_seqNos.length == 0) {
                        alert('선택된 데이터 중 SYSLOG이벤트가 없습니다.');
                        return;
                    }
                    if(!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
                    var params = {
                        seqNos: _seqNos
                    };
                    Server.post('/main/popup/errAction/saveEvtStop.do', {
                        data: params,
                        success: function() {
                            $.each(_rowids, function(idx, value) {
                                $grid.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 해제되었습니다.');
                        }
                    });
                } catch(e) {}
                break;
            case 'cm_filter':

                try {
                    $grid.jqxGrid('beginupdate');
                    if($grid.jqxGrid('filterable') === false) {
                        $grid.jqxGrid({ filterable: true });
                    }
                    setTimeout(function() {
                        $grid.jqxGrid({showfilterrow: !$grid.jqxGrid('showfilterrow')});
                    }, 300);
                    $grid.jqxGrid('endupdate');
                } catch(e) {}
                break;
            case 'cm_filterReset':
                try {
                    $grid.jqxGrid('clearfilters');
                } catch(e) {}
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function(result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $grid);
                    }
                );
                break;
            case 'cm_evtRevoke':
                try {
                    var rowidx = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
                    if(!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
                    var _rowids = [];
                    $.each(rowidx, function(idx, value) {
                        _rowids.push($grid.jqxGrid('getrowid', value));
                    });
                    var rowdata = $grid.jqxGrid('getrowdata', rowidx);

                    var params = {
                        devIp: rowdata.devIp
                    };
                    Server.post('/main/popup/errAction/saveStarCellEvtRevoke.do', {
                        data: params,
                        success: function() {
                            $.each(_rowids, function(idx, value) {
                                $grid.jqxGrid('deleterow', value);
                            });
                            alert('선택한 이벤트가 해지되었습니다.');
                        }
                    });
                } catch(e) {}
                break;
        }



    },
    /** 선택이벤트 */
    selectHistoryTree: function() {
        PMain.searchHistory(false);
    },

    selectActionHistoryTree: function() {
        PMain.searchHistory(true);
    },

    searchHistory: function(actionFlag) {
        if (actionFlag) {
            Master.refreshCbPeriod($cbPeriod_evtHist);
            HmGrid.updateBoundData($evtActionHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
        } else {
            Master.refreshCbPeriod($cbPeriod_evtActionHist);
            HmGrid.updateBoundData($evtHistGrid, ctxPath + '/main/oms/errHistory/getErrHistoryList.do');
        }
    },

    getCommParams: function() {
        var params = Master.getGrpTabParams();
        $.extend(params, {
            sIp: $('#devIp').val(),
            sDevName: $('#devName').val()
        });
        return params;
    },

    exportExcel: function(actionFlag) {
        if (actionFlag) {
            HmUtil.exportGrid($evtActionHistGrid, '조치이력', false);
        }else{
            HmUtil.exportGrid($evtHistGrid, '장애이력', false);
        }
    },

    chgInfo: function(){

        var params = {
            mngNo: dtl_mngNo,
            action: 'U'
        };

        HmWindow.createNewWindow('pDtlwindow');

        Server.post(ctxPath + '/svr/getSvrInfo.do', {
            data: { mngNo: dtl_mngNo },
            success: function(data) {
                if(data != null) {
                    $.post(ctxPath + '/main/popup/env/pSvrInfoSet.do',
                        params,
                        function(result) {

                            HmWindow.open($('#pDtlwindow'), '[{0}] 서버정보 변경'.substitute(data.name), result, 850, 340);
                        }
                    );
                }
            }
        });

    }

};

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initData();
    PMain.initDesign();
});