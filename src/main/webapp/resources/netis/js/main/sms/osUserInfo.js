var $osUserInfoGrid;
var editUserIds = [];
var userId;
var userName;
var osUserInfo = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $osUserInfoGrid = $('#osUserInfoGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { osUserInfo.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchOsUserInfo(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#osUserInfoGrid'), {
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
                pSvrInfo.topNToolbarRenderer(toolbar, 'OS 계정/그룹 정보', 'osUserInfo', false);
            },
            columns:
                [
                    { text : '계정명', datafield : 'id', width : 120, /*editable: false, pinned: true*/ },
                    { text : 'UID', datafield : 'uid', width: 120, /*pinned: true */},
                    { text : 'GID', datafield : 'gid', width: 120, /*pinned: true */},
                    { text : '홈 경로', datafield : 'homeDir', width: 120, /*pinned: true */},
                    { text : '설명', datafield : 'description', minwidth: 120, /*pinned: true */},
                    { text : 'SHELL', datafield : 'shell', width: 120, /*pinned: true */},
                    { text : '패스워드 변경여부', datafield : 'changePwStatus', width : 200 },
                    // { text : '사용여부', datafield : 'useFlag', width : 200 }
                ]
        } , CtxMenu.NONE );
    },

    /** init data */
    initData: function() {
        osUserInfo.searchOsUserInfo();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchOsUserInfo: function() {
        console.log("ouUserInfo")
        HmGrid.updateBoundData($('#osUserInfoGrid'), ctxPath + '/main/sms/osUserInfo/getOsUserInfoList.do');
        // HmGrid.updateBoundData($osUserInfoGrid, ctxPath + '/main/sms/osUserInfo/getOsUserInfoList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("ouUserInfo")
        HmUtil.exportGrid($('#osUserInfoGrid'), 'OS User 정보', false);
    }
};


// $(function() {
//     osUserInfo.initVariable();
//     osUserInfo.observe();
//     osUserInfo.initDesign();
//     osUserInfo.initData();
// });