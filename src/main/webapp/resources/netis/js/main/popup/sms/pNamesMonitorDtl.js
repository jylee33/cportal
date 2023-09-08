var pMngNo, pGrpNo, pInitArea;
var $cbPeriod_evtHist, $cbPeriod_evtActionHist, $evtHistGrid, $evtActionHistGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid, $cardGrid, $cmDevGrid, $cmIfGrid, $eventTabs;
var sAuth;
var pgSiteName;
var dtlTabIndex;

$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
    PMain.inputName();
});

var param = document.location.href.split("?=");
var _param = param[1];

var PMain = {
    /** variable */
    initVariable: function () {
        pMngNo = $('#mngNo').val();
        pInitArea = $('#initArea').val();
        $dtlTab = $('#dtlTab');
        $eventTabs = $('#eventTabs');
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
            case 'pbtnClose':
                self.close();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        $('#ctxmenu_dev, #ctxmenu_if').jqxMenu({
            width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
        }).on('itemclick', function (event) {
            PMain.selectDevCtxmenu(event);
        });

        // 메인텝
        $dtlTab.jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0: // 요약
                        break;
                    case 1: // 파드 현황
                        pPodDtl.initDesign();
                        pPodDtl.initData();
                        break;
                }
            }
        }).on('selected', function (event) {

            var selectedTab = event.args.item;

            dtlTabIndex = selectedTab;

            if (selectedTab == 0 || selectedTab == 1 || selectedTab == 2) {
                $("#btnSearch_summary").show();
            } else {
                $("#btnSearch_summary").hide();
            }
        });

    },

    /** init data */
    initData: function () {
        $('.p_content_layer').css('display', 'block');
    },

    /** 상세정보 */
    searchDtlInfo: function () {
    },

    inputName: function () {
        Server.post(ctxPath + '/kub/getPodList2.do', {
            data: { namespaceNo : _param },
            success: function(result) {
                $('#namespaceArea').html(result[0].namespaceNm);
            }
        });
    }
};

function addDevResult() {
}
