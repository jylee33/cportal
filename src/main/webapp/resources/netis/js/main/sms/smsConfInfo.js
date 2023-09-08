var $smsConfInfoTab;

var Main = {
    /** variable */
    initVariable : function() {
        $smsConfInfoTab = $('#smsConfInfoTab');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        console.log("evt=",event)
        console.log("curT=",curTarget)
        console.log("id",curTarget.id)
        console.log("tab=",$smsConfInfoTab.val())
        if (curTarget.id == "btnSearch") {
            switch ($smsConfInfoTab.val()) {
                case 0: // OS 계정/그룹 정보
                    osUserInfo.searchOsUserInfo();
                    break;
                case 1: // IPCS
                    ipcsInfo.searchIpcsInfo();
                    break;
                case 2: // OS Table
                    osTableInfo.searchOsTableInfo();
                    break;
                case 3: // 서비스 등록 정보
                    svcRegInfo.searchSvcRegInfo();
                    break;
                case 4: // Routing 테이블
                    routingTableStatus.searchRoutingTable();
                    break;
                case 5: // Cron 설정 정보
                    cronConfInfo.searchCronConfInfo();
                    break;
            }

        }else if (curTarget.id == "btnExcel") {
            switch ($smsConfInfoTab.val()) {
                case 0: // OS 계정/그룹 정보
                    osUserInfo.exportExcel();
                    break;
                case 1: // IPCS
                    ipcsInfo.exportExcel();
                    break;
                case 2: // OS Table
                    osTableInfo.exportExcel();
                    break;
                case 3: // 서비스 등록 정보
                    svcRegInfo.exportExcel();
                    break;
                case 4: // Routing 테이블
                    routingTableStatus.exportExcel();
                    break;
                case 5: // Cron 설정 정보
                    cronConfInfo.exportExcel();
                    break;
            }
        }
    },

    /** init design */
    initDesign : function() {
        $smsConfInfoTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // OS 계정/그룹 정보
                        osUserInfo.initialize();
                        break;
                    case 1: // IPCS
                        ipcsInfo.initialize();
                        break;
                    case 2: // OS Table
                        osTableInfo.initialize();
                        break;
                    case 3: // 서비스 등록 정보
                        svcRegInfo.initialize();
                        break;
                    case 4: // Routing 테이블
                        routingTableStatus.initialize();
                        break;
                    case 5: // Cron 설정 정보
                        cronConfInfo.initialize();
                        break;
                }
            }
        }).on('selected', function(event) {
        });
    },

    /** init data */
    initData: function() {

    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});