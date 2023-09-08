var $db2dbTab;

var Main = {
    /** variable */
    initVariable : function() {
        $db2dbTab = $('#db2dbTab');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        if (curTarget.id == "btnSearch") {
            switch ($db2dbTab.val()) {
                case 0: // 서버
                    dbSvrMgmt.searchDbSvr();
                    break;
                case 2: // 설정
                    dbCollectMgmt.searchDbCollect();
                    break;
            }
        }else if (curTarget.id == "btnAdd") {
            switch ($db2dbTab.val()) {
                case 0: // 서버
                    dbSvrMgmt.addDbSvr();
                    break;
                case 2: // 설정
                    dbCollectMgmt.addDbCollect();
                    break;
            }
        }else if (curTarget.id == "btnEdit") {
            switch ($db2dbTab.val()) {
                case 0: // 서버
                    dbSvrMgmt.editDbSvr();
                    break;
                case 2: // 설정
                    dbCollectMgmt.editDbCollect();
                    break;
            }
        }else if (curTarget.id == "btnDel") {
            switch ($db2dbTab.val()) {
                case 0: // 서버
                    dbSvrMgmt.delDbSvr();
                    break;
                case 2: // 설정
                    dbCollectMgmt.delDbCollect();
                    break;
            }
        }else if (curTarget.id == "btnExcel") {
            switch ($db2dbTab.val()) {
                case 0: // 서버
                    console.log("here")
                    dbSvrMgmt.exportExcel();
                    break;
                case 2: // 설정
                    dbCollectMgmt.exportExcel();
                    break;
            }
        }
    },

    /** init design */
    initDesign : function() {
        $db2dbTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // 서버
                        dbSvrMgmt.initialize();
                        break;
                    case 1: // 쿼리
                        db2dbMgmt.initialize();
                        break;
                    case 2: // 설정
                        dbCollectMgmt.initialize();
                        break;
                }
            }
        }).on('selected', function(event) {
            var tabNo = event.args.item;
            switch(tabNo) {
                case 0: // 서버
                    $("#btnSearch").show();
                    $("#btnAdd").show();
                    $("#btnEdit").show();
                    $("#btnDel").show();
                    $("#btnExcel").show();
                    break;
                case 1: // 쿼리
                    $("#btnSearch").hide();
                    $("#btnAdd").hide();
                    $("#btnEdit").hide();
                    $("#btnDel").hide();
                    $("#btnExcel").hide();
                    break;
                case 2: // 설정
                    $("#btnSearch").show();
                    $("#btnAdd").show();
                    $("#btnEdit").show();
                    $("#btnDel").show();
                    $("#btnExcel").show();
                    break;
            }
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