var pMngNo, pIfIdx, pGrpNo;
var $evtHistGrid, $evtActionHistGrid;
var $dtlTab, $evtGrid;
var sAuth;
var pgSiteName;

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
        pIfIdx = $('#ifIdx').val();
        $dtlTab = $('#dtlTab');
        sAuth = $('#sAuth').val().toUpperCase();
        pgSiteName = $('#gSiteName').val();

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
            case 'btnChgInfo':
                this.chgInfo();
                break;
            case 'pbtnClose':
                self.close();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        // 메인텝
        $dtlTab.jqxTabs({
            width: '99.8%', height: '99%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        break;
                    case 1: // 성능
                        pPerf.initDesign();
                        pPerf.initData();
                        break;

                    case 2: // 실시간 성능 조회 (성능 하위 탭에서의 위치 조정)
                        pPerfRealtime.initialize();
                        pPerfRealtime.initDesign();
                        break;
                    case 3: // 성능예측
                        pPerfPredict.initDesign();
                        pPerfPredict.initData();
                        break;
                    case 4: // 장애예측
                        pErrPredict.initDesign();
                        pErrPredict.initData();
                        break;
                    case 5: //
                        pIfPerfThreshold.initDesign();
                        pIfPerfThreshold.initData();
                        break;
                    case 6: //2023.04.03 신규 성능비교
                        pPerfCompare.initDesign();
                        pPerfCompare.initData();
                        break;
                    case 7: // (가장 뒤에 두거나 else로 분기처리)
                        if ($('#gSiteName').val()=="KangOneEdu") {
                            pOnuInfo.initDesign();
                            pOnuInfo.initData();
                            $('#btnChgInfo').hide();
                        }
                        break;
                }
                var displayFlag = $('#aiPoll').val() == '1' ? 'block' : 'none';
                $('#dtlTab .jqx-tabs-title:eq(3)').css('display', displayFlag);
                $('#dtlTab .jqx-tabs-title:eq(4)').css('display', displayFlag);
            }
        })
            .on('selected', function (event) {
//				PMain.searchDtlInfo();
                var selectedTab = event.args.item;
                if (selectedTab == 0) {
                    // pSummary_evtStatus.resizeSvg();
                }
            });

        if (sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
            $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
        }



        $(window).on('resize', function () {
            setTimeout(function () {
                // if(pSummary_evtStatus.vars.svg != null){
                // 	pSummary_evtStatus.resizeSvg();
                // }
            }, 100)
        });

    },

    /** init data */
    initData: function () {
        $('.p_content_layer').css('display', 'block');
    },

    /** 상세정보 */
    searchDtlInfo: function () {
    },

    chgInfo: function () {
        var params = {
            action: 'U',
            mngNo: pMngNo,
            ifIdx: pIfIdx
        };

        $.post(ctxPath + '/main/popup/env/pIfInfoSet.do',
            params,
            function (result) {
                HmWindow.open($('#pwindow'), '회선정보 변경', result, 700, 580);
            }
        );

    }

};

function refreshIf() {
}