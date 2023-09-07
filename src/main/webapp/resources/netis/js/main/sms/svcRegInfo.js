var $svcRegInfoGrid;
var editUserIds = [];
var userId;
var userName;
var svcRegInfo = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $svcRegInfoGrid = $('#svcRegInfoGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { svcRegInfo.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        // var curTarget = event.currentTarget;
        // switch(curTarget.id) {
        //     case "btnSearch": this.searchSvcRegInfo(); break;
        //     case "btnExcel": this.exportExcel(); break;
        // }
    },

    /** init design */
    initDesign: function() {

        initColumns = [
            { text: '알맞는 서비스 등록 정보가 없습니다.', datafield: 'column3', minwidth: 100 }
        ];

        // svrStatusDtl에 변수 선언되어있음
        linuxColumns = [
            { text: '서비스 이름', datafield: 'serviceNm', minwidth: 100 },
            { text: 'LOAD', datafield: 'serviceLoad', minwidth: 100 },
            { text: 'ACTIVE', datafield: 'serviceActive', minwidth: 100 },
            { text: 'SUB', datafield: 'serviceSub', minwidth: 100 },
            { text: '서비스 설명', datafield: 'description', minwidth: 100 }
        ];
        windowColumns = [
            { text: '서비스 이름', datafield: 'serviceNm', minwidth: 100 },
            { text: '표시이름', datafield: 'dispNm', minwidth: 100 },
            { text: '실행 파일 경로', datafield: 'execPath', minwidth: 100 },
            { text: '시작 유형', datafield: 'serviceStartType', minwidth: 100 },
            { text: '서비스 상태', datafield: 'serviceStatus', minwidth: 100 },
            { text: '서비스 설명', datafield: 'description', minwidth: 100 }
        ];

        HmGrid.create($('#svcRegInfoGrid'), {
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
                            mngNo: dtl_mngNo,
                            devKind2: dtl_devKind2
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
                pSvrInfo.topNToolbarRenderer(toolbar, '서비스 등록 정보', 'svcRegInfo', false);
            },
            columns: initColumns
        } , CtxMenu.NONE );

        // devKind2 정보에 따라 컬럼 변경
        if (dtl_devKind2 == "LINUX") {
            $('#svcRegInfoGrid').jqxGrid('columns', linuxColumns);
        } else if (dtl_devKind2 == "WINDOW") {
            $('#svcRegInfoGrid').jqxGrid('columns', windowColumns);
        };

    },

    /** init data */
    initData: function() {
        svcRegInfo.searchSvcRegInfo();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchSvcRegInfo: function() {
        // devKind2 정보에 따라 컬럼 변경
        if (dtl_devKind2 == "LINUX") {
            $('#svcRegInfoGrid').jqxGrid('columns', linuxColumns);
        } else if (dtl_devKind2 == "WINDOW") {
            $('#svcRegInfoGrid').jqxGrid('columns', windowColumns);
        } else {
            $('#svcRegInfoGrid').jqxGrid('columns', initColumns);
        };
        HmGrid.updateBoundData($('#svcRegInfoGrid'), ctxPath + '/main/sms/svcRegInfo/getSvcRegInfoList.do');
        // HmGrid.updateBoundData($svcRegInfoGrid, ctxPath + '/main/sms/svcRegInfo/getsvcRegInfoList.do');
    },
    /** export Excel */
    exportExcel: function() {
        console.log("svcReg")
        HmUtil.exportGrid($('#svcRegInfoGrid'), '서비스 등록 정보', false);
    }
};


// $(function() {
//     svcRegInfo.initVariable();
//     svcRegInfo.observe();
//     svcRegInfo.initDesign();
//     svcRegInfo.initData();
// });