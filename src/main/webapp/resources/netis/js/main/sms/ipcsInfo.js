var $ipcsInfoGrid;
var editUserIds = [];
var userId;
var userName;
var ipcsInfo = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $ipcsInfoGrid = $('#ipcsInfoGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { ipcsInfo.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchIpcsInfo(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {
        HmGrid.create($('#ipcsInfoGrid'), {
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
                pSvrInfo.topNToolbarRenderer(toolbar, 'IPCS', 'ipcs', false);
            },
            columns:
                [
                    { text : '번호', datafield : 'ipcsNo', cellsalign: 'center', width: 200 },
                    { text : '수집항목', datafield : 'ipcsName', cellsalign: 'center', width: 500 },
                    { text : '값', datafield : 'ipcsPath', cellsalign: 'center', minwidth: 500 },
                    // { text : '사용여부', datafield : 'useFlag', width : 200 }
                ]
        } , CtxMenu.NONE );
    },

    /** init data */
    initData: function() {
        ipcsInfo.searchIpcsInfo();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchIpcsInfo: function() {
        console.log("ipcs")
        HmGrid.updateBoundData($('#ipcsInfoGrid'), ctxPath + '/main/sms/ipcsInfo/getIpcsInfoList.do');
        // HmGrid.updateBoundData($ipcsInfoGrid, ctxPath + '/main/sms/ipcsInfo/getipcsInfoList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("ipcs")
        HmUtil.exportGrid($('#ipcsInfoGrid'), 'IPCS 정보', false);
    }
};


// $(function() {
//     ipcsInfo.initVariable();
//     ipcsInfo.observe();
//     ipcsInfo.initDesign();
//     ipcsInfo.initData();
// });