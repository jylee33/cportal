var pMngNo, pDbmsNo, pDbmsKind, pGrpNo, pInitArea;
var sAuth;
var pgSiteName;
var $dtlTab;

$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
    TAB: {
        SERVER: 0, EVT: 1, PERF: 2, LOCK: 3, LATCH: 4, TABLE: 5, PARAMETER: 6, CPU: 7, SESSION: 8, FILEIO: 9, USERINFO: 10
        , OS: 11, PROCESS: 12, SYSTEM: 13
    },

    /** variable */
    initVariable: function() {
        pMngNo = $('#mngNo').val();
        pDbmsNo = $('#dbmsNo').val();
        pDbmsKind = $('#dbmsKind').val();
        pInitArea = $('#initArea').val();
        $dtlTab = $('#dtlTab');
        sAuth = $('#sAuth').val().toUpperCase();
        pgSiteName = $('#gSiteName').val();

    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'pbtnClose': self.close(); break;
            case 'btnChgInfo': this.chgInfo(); break;
        }
    },

    /** init design */
    initDesign: function() {
        // // 메인탭
        // $('#dbmsStatusDtl').hide();
        // if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
        // 	$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
        // }
        // alert(dtl_dbmsKind)
        $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function(tab) {
                switch(tab) {
                    case PMain.TAB.SERVER:
                        pServerBasicInfo.initDesign();
                        pServerBasicInfo.initData();
                        break;
                    case PMain.TAB.EVT: // COMMON 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case PMain.TAB.PERF: // COMMON 성능
                        DbmsPerfTree.initDesign();
                        DbmsPerfChart.initDesign();
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
                    case PMain.TAB.PARAMETER:
                        pParameter.initDesign();
                        pParameter.initData();
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
                    case PMain.TAB.USERINFO:
                        pUserInfo.initDesign();
                        pUserInfo.initData();
                        break;

                    case PMain.TAB.OS:
                        pOsMemory.initDesign();
                        pOsMemory.initData();
                        break;
                    case PMain.TAB.PROCESS:
                        pProcessMemory.initDesign();
                        pProcessMemory.initData();
                        break;
                    case PMain.TAB.SYSTEM:
                        pSystemConfig.initDesign();
                        pSystemConfig.initData();
                        break;
                }
            }
        }).on('selected', function(event) {
            // PMain.search();
        });

        if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
            $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
        }


        if(pInitArea == ("WebTopology"))
        {
            // $dtlTab.jqxTabs({selectedItem:5});
        }
    },

    /** init data */
    initData: function() {
        $('.p_content_layer').css('display', 'block');
    },

    /** 상세정보 */
    searchDtlInfo: function() {
    },
    search: function() {
        try{
            switch($dtlTab.val()) {
                case PMain.TAB.SERVER:
                    pServerBasicInfo.search();
                    break;
                case PMain.TAB.EVT: // COMMON 이벤트
                    pEvtInfo.search();
                    break;
                case PMain.TAB.PERF: // COMMON 성능
                    DbmsPerfChart.search();
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
                case PMain.TAB.PARAMETER:
                    pParameter.search();
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
                case PMain.TAB.USERINFO:
                    pUserInfo.search();
                    break;

                case PMain.TAB.OS:
                    pOsMemory.search();
                    break;
                case PMain.TAB.PROCESS:
                    pProcessMemory.search();
                    break;
                case PMain.TAB.SYSTEM:
                    pSystemConfig.search();
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

        Server.post(ctxPath +'/main/popup/dbmsOracleDetail/getDbmsInfo.do', {
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
