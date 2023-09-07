var pMngNo, pDbmsNo, pDbmsKind, pGrpNo, pInitArea;
var sAuth;
var pgSiteName;

$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});

var PMain = {
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
        // 메인텝
        $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // 요약
                        break;
                    case 1: // 성능
                        DbmsPerfTree.initDesign();
                        DbmsPerfChart.initDesign();
                        break;
                    case 2: // 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case 3: // ORA DB정보
                        pOraDbInfo.initDesign();
                        pOraDbInfo.initData();
                        break;
                    case 4: // ORA TopSql정보
                        pOraTopSql.initDesign();
                        pOraTopSql.initData();
                        break;
                    case 5: // ORA Session정보
                        pOraSessionInfo.initDesign();
                        pOraSessionInfo.initData();
                        break;
                    case 6: // ORA Transaction 정보
                        pOraTransactionInfo.initDesign();
                        pOraTransactionInfo.initData();
                        break;
                    case 7: // ORA IO 정보
                        pOraSessionIo.initDesign();
                        pOraSessionIo.initData();
                        break;
                    case 8: // ORA TableSpace정보
                        pOraTableSpaceInfo.initDesign();
                        pOraTableSpaceInfo.initData();
                        break;
                    case 9: // ORA User정보
                        pOraUserInfo.initDesign();
                        pOraUserInfo.initData();
                        break;
                    case 10: // ORA Log정보
                        pOraLogInfo.initDesign();
                        pOraLogInfo.initData();
                        break;
                    case 11: // ORA Lock정보
                        pOraLock.initDesign();
                        pOraLock.initData();
                        break;
                    case 12: // ORA Memory정보
                        pOraMemoryInfo.initDesign();
                        pOraMemoryInfo.initData();
                        break;
                }
            }
        }).on('selected', function(event) {
                var selectedTab = event.args.item;
                if(selectedTab==0){
                    // pWasSummary_evtStatus.resizeSvg();
                }
//				PMain.searchDtlInfo();
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
                            HmWindow.open($('#pwindow'), '[{0}] DBMS정보 변경'.substitute(dbmsInfo.dbmsNm), result, 500, 240, 'p2window_init', dbmsInfo);
                        }
                    );
                }
            }
        });
    }
};
