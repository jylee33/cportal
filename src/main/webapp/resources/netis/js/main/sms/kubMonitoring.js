var $leftTab, $clusterMonitoringGrid;
var dtl_clusterGrpNo;
var dtl_clusterNo=-1;
//var dtl_grpName='';
//var dtl_clusterNm='';

var Main = {
    /** variable */
    initVariable: function() {
        $leftTab = $('#leftTab');
        $clusterMonitoringGrid = $('#clusterMonitoringGrid');
        // $dGrpTreeGrid = $('#dGrpTreeGrid'), $sGrpTreeGrid = $('#sGrpTreeGrid');
        // $kindGrid = $('#kindGrid'), $modelGrid = $('#modelGrid'), $vendorGrid = $('#vendorGrid');
      //  this.initCondition();
    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cluster_srch_type'));

    },

    /** add event */
    observe: function() {
        $('button').on('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.searchMonitoring(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchDev();
         //   Main.searchMonitoring();
        }
    },

    /** init design */
    initDesign: function() {

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%', collapsible: false }, { size: '55%' }], 'auto', '100%');

        /** cluster 그리드 */
        HmGrid.create($clusterMonitoringGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',

                }
                , {
                    formatData: function(data) {
                        //좌측탭에 대한것.
                         // var params = Master.getGrpTabParams();
                         // console.log('params',params);
                         // $.extend(data, params, HmBoxCondition.getSrchParams());
                        return data;
                    },
                    loadComplete: function(records) {
                        // dtl_mngNo = -1; // 왜 -1?
                        // dtl_devName = '';
                    }
                }
            ),
            columns:
                [
                    { text : '그룹번호', datafield: 'clusterNo', width: 80, hidden: true },
                    { text : '그룹', datafield: 'grpName', width : 280},
                    { text : '클러스터명', datafield: 'clusterNm', width : 280/*, cellsrenderer: HmGrid.devNameRenderer*/ },
                    { text: '클러스터IP', datafield: 'clusterIp', width: 280 },
                    { text: '클러스터Port', datafield: 'clusterPort', width:200},
                    { text: '클러스터상태', datafield: 's', width: 100 /*,filtertype: 'checkedlist'*/ },
                    { text: '쿠버네티스버전', datafield: 'clusterVersion', width: 280 /*,filtertype: 'checkedlist'*/ },
                ]
        }, CtxMenu.COMM /*,ctxmenuIdx++*/);

        $clusterMonitoringGrid.on('rowdoubleclick', function(event) {
        //    console.log('event',event);

            // dtl_clusterGrpNo = event.args.row.bounddata.clusterGrpNo;
            // dtl_clusterNo = event.args.row.bounddata.clusterNo;
            // //dtl_grpName = event.args.row.bounddata.grpName;
            // //dtl_clusterNm = event.args.row.bounddata.clusterNm;

            var rowIdx = event.args.rowindex;
            console.log('rowIdx:',rowIdx);
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
            console.log('rowdata',rowdata);
            dtl_clusterNo = rowdata.clusterNo;
            dtl_clusterNm = rowdata.clusterNm;


            //HmUtil.createPopup('/main/popup/sms/pKuberDetail.do', $('#hForm'), 'pKuberDetail', 1200, 700, rowdata);
            Main.searchDtlInfo();//하단탭
        });
            // .on('bindingcomplete', function(event) {
            //     try {
            //          console.log('event:',event);
            //           $(this).jqxGrid('selectrow', 0);
            //          dtl_clusterNo = $(this).jqxGrid('getcellvalue', 0, 'clusterNo');
            //         // dtl_clusterNm = $(this).jqxGrid('getcellvalue', 0, 'clusterNm');
            //         // dtl_clusterGrpNo = $(this).jqxGrid('getcellvalue', 0, 'clusterGrpNo');
            //       //  Main.predictShow($(this).jqxGrid('getcellvalue', 0, 'aiPoll'));
            //
            //       //  Main.searchDtlInfo();
            //
            //        // HmUtil.createPopup('/main/popup/sms/pKuberDetail.do', $('#hForm'), 'pKuberDetail', 1200, 700, rowdata);
            //         Main.searchDtlInfo();//하단탭
            //
            //     } catch(e) {}
            // });

        // 좌측 탭영역
        Master.createGrpTab(Main.searchDev, {devKind1: 'DEV'});
        $('#section').css('display', 'block');


        var themeSetting= { theme: "ui-hamon-v1" };
        $leftTab.jqxTabs(themeSetting);


    },

    /** init data */
    initData: function() {
       Main.searchMonitoring();
    },

    /** cluster 조회 */
    searchMonitoring: function() {
        HmGrid.updateBoundData($clusterMonitoringGrid, ctxPath + '/kub/getClusterList.do');
    },

    /** 상세정보 */
    searchDtlInfo: function() {
        pKuberDtlMain.search(); //하단 탭을 관리하는 js를 호출한다
        // pAutoLink.search();
    },

    exportExcel: function() {
        HmUtil.exportGridHtml($clusterMonitoringGrid, '쿠버네티스모니터링', false);
    },
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
