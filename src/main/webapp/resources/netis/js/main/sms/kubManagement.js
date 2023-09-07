var $leftTab, $clusterManagementGrid;
 var dtl_clusterNo ;
 var dtl_clusterNm = '';

var Main = {
    /** variable */
    initVariable: function() {
        $leftTab = $('#leftTab');
        $clusterManagementGrid = $('#clusterManagementGrid');
       // this.initCondition();
    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cluster_srch_type'));
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchKub(); break;
            case 'btnAdd': this.addKub(); break;
            case 'btnEdit': this.editKub(); break;
            case 'btnDel': this.delKub(); break;
            case 'btnExcel': this.exportExcel(); break;
           /* case "btnExcelHtml": this.exportExcelHtml(); break;*/
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        console.log('keyupEvent:',event);
        if(event.keyCode == 13) {
            Main.searchDev();
            Main.searchKub();
        }
    },

    /** init design */
    initDesign: function() {

        HmJqxSplitter.createTree($('#mainSplitter'));

        /** 장비 그리드 */
        HmGrid.create($clusterManagementGrid, {
            sortmode: "many",
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [	// 필터기능이 정상동작을 안해서 추가함!
                        { name: 'clusterGrpNo', type: 'int' },
                        { name: 'clusterId', type: 'string' },
                        { name: 'clusterIp', type: 'string' },
                        { name: 'clusterNm', type: 'string' },
                        { name: 'clusterNo', type: 'int' },
                        { name: 'clusterPort', type: 'string' },
                        { name: 'clusterVersion', type: 'string' },
                        { name: 'crtDt', type: 'string' },
                        { name: 'grpName', type: 'string' },
                        { name: 'grpNo', type: 'int' }
                    ]
                },
                {
                    formatData: function(data) {
                        // var params = Master.getGrpTabParams();
                        // $.extend(data, params, HmBoxCondition.getSrchParams());
                        // return data;
                    },
                    loadComplete: function(records) {
                    }
                }
            ),
            // selectionmode: 'multiplerowsextended',
            // editable: false,
            // editmode: 'selectedrow',
            columns:
                [
                    { text : '클러스터번호', datafield: 'clusterNo', width: 80, pinned: true, hidden: true },
                    { text : '그룹', datafield: 'grpName', minwidth : 100 },
                    { text : '클러스터명', datafield: 'clusterNm', minwidth : 100},
                    { text: '클러스터IP', datafield: 'clusterIp', minwidth: 100 },
                    { text: '클러스터Port', datafield: 'clusterPort',width: 200},
                ]
        }, CtxMenu.COMM);

        $clusterManagementGrid.on('rowdoubleclick', function(event) {
            console.log('event',event);
            console.log('event123');
            //dtl_clusterNo = event.args.row.bounddata.clusterNo;
            //dtl_clusterNm = event.args.row.bounddata.clusterNm;
            // Main.predictShow(event.args.row.bounddata.aiPoll);

            var rowIdx = event.args.rowindex;
            console.log('rowIdx:',rowIdx);
             var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
             console.log('rowdata',rowdata);
            dtl_clusterNo = rowdata.clusterNo;
            dtl_clusterNm = rowdata.clusterNm;


            //Main.searchKubInfo(dtl_clusterNo);

           // HmUtil.createPopup('/main/popup/sms/pKuberDetail.do?clusterNo=' + dtl_clusterNo, $('#hForm'), 'pKuberDetail', 1200, 700);
            HmUtil.createPopup('/main/popup/sms/pKuberDetail.do', $('#hForm'), 'pKuberDetail', 1200, 700, rowdata);

        });
            // .on('bindingcomplete', function(event) {
            //     try {
            //         // $(this).jqxGrid('selectrow', 0);
            //         // dtl_clusterNo = $(this).jqxGrid('getcellvalue', 0, 'clusterNo');
            //         // dtl_clusterNm = $(this).jqxGrid('getcellvalue', 0, 'clusterNm');
            //         //Main.predictShow($(this).jqxGrid('getcellvalue', 0, 'aiPoll'));
            //
            //         $(this).jqxGrid('selectrow',0);
            //         var rowData = $(this).jqxGrid('getrowdata',0);
            //         console.log('rowData',rowData);
            //         dtl_clusterNo = rowData.clusterNo;
            //         dtl_clusterNm = rowData.clusterNm;
            //         Main.searchKubInfo();
            //     } catch(e) {}
            // });

        // 좌측 탭영역
        Master.createGrpTab(Main.searchKub, {devKind1: 'DEV'});
        $('#section').css('display', 'block');


        var themeSetting= { theme: "ui-hamon-v1" };
        $leftTab.jqxTabs(themeSetting);


    },

    /** init data */
    initData: function() {

    },

    // search : function(a) {
    //     var $grid = $clusterManagementGrid;
    //     $grid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
    //     HmGrid.updateBoundData($clusterManagementGrid, ctxPath + '/main/nms/ifStatus/getIfStatus.do');
    // },

    /** 장비 조회 */
    searchDev: function() {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devStatus/getDevStatusList.do');
    },

    searchKub: function() {
        HmGrid.updateBoundData($clusterManagementGrid, ctxPath + '/kub/getClusterList.do');
    },

    /** 상세정보 */
    searchKubInfo: function() {
     //   Main.searchKub();
        //PMain.search();
    //    pAutoLink.search();
        //pKuberDetailMain.search();
      //  pKuberDtlMain.search();
      //
      //   $.post(ctxPath + '/main/popup/sms/pKuberDetail.do', function (result) {
      //       HmWindow.open($('#pwindow'), '상세보기', result, 600, 250,'pwindow_init', data);
      //   });
    },

    addKub : function(){
        $.post(ctxPath + '/main/popup/sms/pClusterAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '호스트 등록', result, 600, 250);
        });
    },

    editKub : function(){

        var rowIdx = HmGrid.getRowIdx($clusterManagementGrid, '선택한 작업이 없습니다.');
        if(!rowIdx) return;

        var rowData = HmGrid.getRowData($clusterManagementGrid, rowIdx);

        $.post(ctxPath +'/main/popup/sms/pClusterEdit.do', rowData,
            function (result) {
            HmWindow.open($('#pwindow'), '호스트 정보 변경',result,600, 250, 'pwindow_init', rowData);
        });
    },

    delKub : function(){

        console.log('삭제버튼클릭');
        var rowIdx = HmGrid.getRowIdx($clusterManagementGrid, '선택한 작업이 없습니다.');
        if(!rowIdx) return;

        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowData = HmGrid.getRowData($clusterManagementGrid, rowIdx);
        console.log('rowData',rowData);

        Server.post('/kub/delCluster.do',{
            data: {
                clusterNo: rowData.clusterNo
            },
            success: function (result) {
                alert('삭제 되었습니다.');
                Main.searchKub();
                $('#pwindow').jqxWindow('close');
            },
            error:function(result){
                alert('삭제실패:', result);
            }
        });
        
    },


    exportExcel: function() {
        HmUtil.exportGrid($clusterManagementGrid, '쿠버네티스관리', false)

    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
