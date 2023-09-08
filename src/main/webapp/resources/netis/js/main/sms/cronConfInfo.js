var $cronConfInfoGrid;
var editUserIds = [];
var userId;
var userName;
var cronConfInfo = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $cronConfInfoGrid = $('#cronConfInfoGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { cronConfInfo.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchCronConfInfo(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#cronConfInfoGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editUserIds.indexOf(rowid) == -1)
                            editUserIds.push(rowid);
                        commit(true);
                    },
                    // datafields: [
                    //     { name: 'userId', type: 'string' },
                    //     { name: 'notiCnt', type: 'int' }
                    // ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            mngNo: dtl_mngNo
                        });
                        return data;
                    }
                },
                {
                    beforeLoadComplete: function(records) {
                        if(records != null) {
                            $.each(records, function(idx, value) {
                                if(value.topoAuthGrpNo == 0) { //토폴로지권한 미설정표시
                                    value.topoAuthGrpNm = $i18n.map["com.word.noSet"];//미설정
                                }
                            });
                        }
                        return records;
                    }
                }
            ),
            height: 200,
            autoheight: true,
            showtoolbar: true,
            scrollbarsize: -1,
            pageable: false,
            rendertoolbar: function (toolbar) {
                pSvrInfo.topNToolbarRenderer(toolbar, 'Cron 설정 정보', 'cronConfInfo', false);
            },
            columns:
                [
                    { text : '작업명', datafield : 'cronNm', minwidth : 120, /*editable: false, pinned: true*/ },
                    { text : '등록자', datafield : 'cronUser', width: 120, /*pinned: true */},
                    // { text : '상태', datafield : 'cronStatus', width: 120, /*pinned: true */},
                    { text : '실행시간', datafield : 'cronRunTime', minwidth: 120, /*pinned: true */},
                    // { text : '사용여부', datafield : 'useFlag', width : 200 }
                ]
        } , CtxMenu.NONE );
    },

    /** init data */
    initData: function() {
        cronConfInfo.searchCronConfInfo();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchCronConfInfo: function() {
        console.log("cronConf")
        HmGrid.updateBoundData($('#cronConfInfoGrid'), ctxPath + '/main/sms/cronConfInfo/getCronConfInfoList.do');
        // HmGrid.updateBoundData($osUserInfoGrid, ctxPath + '/main/sms/osUserInfo/getOsUserInfoList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("cronConf")
        HmUtil.exportGrid($('#cronConfInfoGrid'), 'Cron 설정 정보', false);
    }
};


// $(function() {
//     cronConfInfo.initVariable();
//     cronConfInfo.observe();
//     cronConfInfo.initDesign();
//     cronConfInfo.initData();
// });