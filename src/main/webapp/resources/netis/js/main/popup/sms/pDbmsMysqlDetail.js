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
        $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // 요약
                        pSummary.initDesign();
                        pSummary.search();
                        break;
                    case 1: // 성능
                        pPerformance.initDesign();
                        DbmsPerfTree.initDesign();
                        DbmsPerfChart.initDesign();
                        break;
                    case 2: // 세션
                        pSession.initDesign();
                        pSession.initData();
                        break;
                    case 3: // 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case 4: // 저장장치
                        pTableSpace.initDesign();
                        pTableSpace.initData();
                        break;
                    case 5: // 환경변수
                        pEnviron.initDesign();
                        pEnviron.initData();
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

        console.log("???")
        var params = {
            mngNo: dtl_mngNo,
            dbmsNo: dtl_dbmsNo,
            action: 'U'
        };
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
