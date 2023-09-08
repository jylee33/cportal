var pMngNo, pWasNo, pWasKind, pGrpNo, pInitArea;
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
        pWasNo = $('#wasNo').val();
        pWasKind = $('#wasKind').val();
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
                        WasPerfTree.initDesign();
                        WasPerfChart.initDesign();
                        // ProcessGrid.initDesign();
                        break;
                    case 2: // 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
                        break;
                    case 3: // 이벤트
                        pTomcatMgr.initDesign();
                        pTomcatMgr.initData();
                        break;
                    case 4: // 이벤트
                        pTomcatProcs.initDesign();
                        pTomcatProcs.initData();
                        break;
                }
            }
        }).on('selected', function(event) {

                var selectedTab = event.args.item;
                if(selectedTab==0){
                    pWasSummary_evtStatus.resizeSvg();
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
            wasNo: dtl_wasNo,
            action: 'U'
        }
        Server.post(ctxPath +'/main/popup/wasDetail/getWasInfo.do', {
            data: { mngNo: dtl_mngNo, wasNo: dtl_wasNo },
            success: function(data) {
                if(data != null) {
                    $.post(ctxPath + '/main/popup/env/pSvrWasMonitAdd.do',
                        params,
                        function(result) {
                            var wasInfo = data[0];
                            HmWindow.open($('#pwindow'), '[{0}] WAS정보 변경'.substitute(wasInfo.wasNm), result, 500, 304, 'p2window_init', wasInfo);
                        }
                    );
                }
            }
        });
    }
};
