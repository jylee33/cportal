var $dtlTab;
var sAuth;

var PMain = {
    TAB: {
        SERVER: 0, PERF: 1, EVT: 2, FILEINFO: 3, OS: 4, PROCESS: 5, LOCK: 6, LATCH: 7, TABLE: 8, SYSTEM: 9, CPU: 10, SESSION: 11, FILEIO: 12
    },

    /** variable */
    initVariable: function() {
        sAuth = $('#sAuth').val().toUpperCase();
        $dtlTab = $('#dtlTab');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnChgInfo': this.chgInfo(); break;
        }
    },

    /** init design */
    initDesign: function() {
        // $('#dbmsStatusDtl').hide();
        // if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
        // 	$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
        // }
        // alert(dtl_dbmsKind)
        $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case PMain.TAB.SERVER:
                        pServerBasicInfo.initDesign();
                        pServerBasicInfo.initData();
                        break;
                    case PMain.TAB.PERF:
                        pPerformanceCnt.initDesign();
                        pPerformanceCnt.initData();
                        break;
                    case PMain.TAB.EVT: // COMMON 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case PMain.TAB.FILEINFO:
                        pFileInfo.initDesign();
                        pFileInfo.initData();
                        break;
                    case PMain.TAB.OS:
                        pOsMemory.initDesign();
                        pOsMemory.initData();
                        break;
                    case PMain.TAB.PROCESS:
                        pProcessMemory.initDesign();
                        pProcessMemory.initData();
                        break;
                    case PMain.TAB.LOCK:
                        pLock.initDesign();
                        pLock.initData();
                        break;
                    case PMain.TAB.LATCH:
                        pLatch.initDesign();
                        pLatch.initData();
                        break;
                    case PMain.TAB.TABLE:
                        pTableUseSize.initDesign();
                        pTableUseSize.initData();
                        break;
                    case PMain.TAB.SYSTEM:
                        pSystemConfig.initDesign();
                        pSystemConfig.initData();
                        break;
                    case PMain.TAB.CPU:
                        pCpuTop.initDesign();
                        pCpuTop.initData();
                        break;
                    case PMain.TAB.SESSION:
                        pSession.initDesign();
                        pSession.initData();
                        break;
                    case PMain.TAB.FILEIO:
                        pFileIoInfo.initDesign();
                        pFileIoInfo.initData();
                        break;
                }
            }
        }).on('selected', function(event) {
            // PMain.search();
        });
        $('#dbmsStatusDtl').css('visibility', 'visible');
    },

    /** init data */
    initData: function() {

    },

    search: function() {
        try{
            switch($dtlTab.val()) {
                case PMain.TAB.SERVER:
                    pServerBasicInfo.search();
                    break;
                case PMain.TAB.PERF:
                    pPerformanceCnt.search();
                    break;
                case PMain.TAB.EVT: // COMMON 이벤트
                    pEvtInfo.search();
                    break;
                case PMain.TAB.FILEINFO:
                    pFileInfo.search();
                    break;
                case PMain.TAB.OS:
                    pOsMemory.search();
                    break;
                case PMain.TAB.PROCESS:
                    pProcessMemory.search();
                    break;
                case PMain.TAB.LOCK:
                    pLock.search();
                    break;
                case PMain.TAB.LATCH:
                    pLatch.search();
                    break;
                case PMain.TAB.TABLE:
                    pTableUseSize.search();
                    break;
                case PMain.TAB.SYSTEM:
                    pSystemConfig.search();
                    break;
                case PMain.TAB.CPU:
                    pCpuTop.search();
                    break;
                case PMain.TAB.SESSION:
                    pSession.search();
                    break;
                case PMain.TAB.FILEIO:
                    pFileIoInfo.search();
                    break;
            }
        }catch(e){}
    },

    chgInfo: function(){

        var params = {
            mngNo: dtl_mngNo,
            dbmsNo: dtl_dbmsNo,
            action: 'U'
        }


        Server.post(ctxPath +'/main/popup/dbmsCommonDetail/getDbmsInfo.do', {
            data: { mngNo: dtl_mngNo, dbmsNo: dtl_dbmsNo },
            success: function(data) {
                if(data != null) {
                    $.post(ctxPath + '/main/popup/env/pSvrDbmsMonitAdd.do',
                        params,
                        function(result) {
                            var dbmsInfo = data[0];
                            HmWindow.open($('#pwindow'), '[{0}] DBMS정보 변경'.substitute(dbmsInfo.dbmsNm), result, 800, 240, 'p2window_init', dbmsInfo);
                        }
                    );
                }
            }
        });
    }
};

$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});
