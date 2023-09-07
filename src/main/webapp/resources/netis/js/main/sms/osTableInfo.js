var $osTableInfoGrid;
var editUserIds = [];
var userId;
var userName;
var osTableInfo = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $osTableInfoGrid = $('#osTableInfoGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { osTableInfo.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchOsTableInfo(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#osTableInfoGrid'), {
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
                pSvrInfo.topNToolbarRenderer(toolbar, 'OS TABLE', 'osTable', false);
            },
            columns:
                [
                    { text : '번호', datafield : 'osTableNo', cellsalign: 'center', width: '33.3%'},
                    { text : '수집항목', datafield : 'osTableName', cellsalign: 'center', width: '33.3%'},
                    { text : '값', datafield : 'osTablePath', cellsalign: 'center', width: '33.3%'},
                    // { text : '사용여부', datafield : 'useFlag', width : 200 }
                ]
        } , CtxMenu.NONE );
    },

    /** init data */
    initData: function() {
        osTableInfo.searchOsTableInfo();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchOsTableInfo: function() {
        console.log("osTable")
        HmGrid.updateBoundData($('#osTableInfoGrid'), ctxPath + '/main/sms/osTableInfo/getOsTableInfoList.do');
        // HmGrid.updateBoundData($osTableInfoGrid, ctxPath + '/main/sms/osTableInfo/getosTableInfoList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("osTable")
        HmUtil.exportGrid($('#osTableInfoGrid'), 'OS Table 정보', false);
    }
};


// $(function() {
//     osTableInfo.initVariable();
//     osTableInfo.observe();
//     osTableInfo.initDesign();
//     osTableInfo.initData();
// });