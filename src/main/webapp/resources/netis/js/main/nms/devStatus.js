var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid, $kindGrid, $modelGrid, $vendorGrid;
var $devGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid;
var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_devName = '';

var Main = {
    /** variable */
    initVariable: function() {
        $leftTab = $('#leftTab');
        $dGrpTreeGrid = $('#dGrpTreeGrid'), $sGrpTreeGrid = $('#sGrpTreeGrid');
        $kindGrid = $('#kindGrid'), $modelGrid = $('#modelGrid'), $vendorGrid = $('#vendorGrid');
        $devGrid = $('#devGrid');
        this.initCondition();
    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
            case 'btnSearch': this.searchDev(); break;
            case 'btnExcel': this.exportExcel(); break;
            case "btnExcelHtml": this.exportExcelHtml(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchDev();
        }
    },

    /** init design */
    initDesign: function() {
        if($('#gSiteName').val() == 'TTA') {
            $('#btnExcelHtml').css('display', 'inline-block');
        }

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%', collapsible: false }, { size: '55%' }], 'auto', '100%');

        /** 장비 그리드 */
        HmGrid.create($devGrid, {
            sortmode: "many",
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [	// 필터기능이 정상동작을 안해서 추가함!
                        { name: 'grpName', type: 'string' },
                        { name: 'disDevName', type: 'string' },
                        { name: 'devName', type: 'string' },
                        { name: 'userDevName', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'devKind1', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'model', type: 'string' },
                        { name: 'devLocation', type: 'string' },
                        { name: 'vendor', type: 'string' },
                        { name: 'machine_serial', type: 'string' },
                        { name: 'machineVer', type: 'string' },
                        { name: 'ifCnt', type: 'number' },
                        { name: 'aliveIfCnt', type: 'number' },
                        { name: 'deadIfCnt', type: 'number' },
                        { name: 'usedIf', type: 'number' },
                        { name: 'aliveIfCnt', type: 'number' },
                        { name: 'aliveIfCnt', type: 'number' },
                        { name: 'card', type: 'number' },
                        { name: 'module', type: 'number' },
                        { name: 'grpNo', type: 'number' },
                        { name: 'mngNo', type: 'number' },
                        { name: 'memory', type: 'number' },
                        { name: 'isCommunity', type: 'string' },
                        { name: 'cpuPer', type: 'number' },
                        { name: 'memPer', type: 'number' },
                        { name: 'aiPoll', type: 'number' },
                        { name: 'icmpStatus', type: 'string' },
                        { name: 'snmpStatus', type: 'string' },
                        { name: 'upTime', type: 'string' },
                        { name: 'upTimeSumSec', type: 'number' }
                    ]
                },
                {
                    formatData: function(data) {
                        var params = Master.getGrpTabParams();
                        $.extend(data, params, HmBoxCondition.getSrchParams());
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
                    { text : '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true },
                    { text : 'ICMP', datafield : 'icmpStatus', width: 60, pinned: true, editable: false, hidden: true ,cellsalign: 'center', cellclassname: function(row, column, value, data) {
                            if(data.icmpStatus == 'X'){
                                return 'critical'
                            }else if(data.icmpStatus == '-') {
                                return 'notUse'
                            }else{
                                return 'normal'
                            }
                        }
                    },
                    { text : 'SNMP', datafield : 'snmpStatus', width: 60, pinned: true, editable: false, hidden: true ,cellsalign: 'center', cellclassname: function(row, column, value, data) {
                            if(data.snmpStatus == 'X'){
                                return 'critical'
                            }else if(data.snmpStatus == '-') {
                                return 'notUse'
                            }else{
                                return 'normal'
                            }
                        }
                    },
                    { text : '그룹명', datafield: 'grpName', minwidth : 130, pinned: true },
                    { text : '장비명', datafield: 'disDevName', minwidth : 150, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
                    { text: '대표IP', datafield: 'devIp', width: 120 },
                    { text: '타입코드', datafield: 'devKind1', hidden: true},
                    { text: '종류', datafield: 'devKind2', width: 100, filtertype: 'checkedlist' },
                    { text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
                    { text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
                    { text: '최근부팅', datafield: 'upTime', width: 120, cellsalign: 'center'},
                    {
                        text: '부팅후',
                        datafield: 'upTimeSumSec',
                        width: 150,
                        cellsrenderer: HmGrid.cTimerenderer,
                        filtertype: 'number'
                    },
                    { text: '장비위치', datafield: 'devLocation', width: 150, hidden: true  },
                    { text: "회선수", datafield: "ifCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
                    { text: "Alive 수", datafield: "aliveIfCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
                    { text: "Dead 수", datafield: "deadIfCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" , hidden: true},
                    { text: "메모리", datafield: "memory", width: 100, cellsrenderer: HmGrid.unit1024renderer },
                    { text: "CPU사용률", datafield: "cpuPer", width: 100, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
                    { text: "메모리사용률", datafield: "memPer", width: 110, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
                    { text: '시리얼', datafield: 'machine_serial', width: 130 },
                    { text: 'OS버전', datafield: 'machineVer', width: 130 },
                    { text: "커뮤니티", datafield: "isCommunity", width: 80, hidden:true }
                ]
        }, CtxMenu.DEV, ctxmenuIdx++);
        $devGrid.on('rowdoubleclick', function(event) {
            dtl_mngNo = event.args.row.bounddata.mngNo;
            dtl_devName = event.args.row.bounddata.disDevName;
            Main.predictShow(event.args.row.bounddata.aiPoll);
            Main.searchDtlInfo();
        })
            .on('bindingcomplete', function(event) {
                try {
                    $(this).jqxGrid('selectrow', 0);
                    dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
                    dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'disDevName');
                    Main.predictShow($(this).jqxGrid('getcellvalue', 0, 'aiPoll'));
                    Main.searchDtlInfo();
                } catch(e) {}
            });

        // 좌측 탭영역
        Master.createGrpTab(Main.searchDev, {devKind1: 'DEV'});
        $('#section').css('display', 'block');


        var themeSetting= { theme: "ui-hamon-v1" };
        $leftTab.jqxTabs(themeSetting);


    },

    /** init data */
    initData: function() {

    },

    /** 장비 조회 */
    searchDev: function() {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devStatus/getDevStatusList.do');
    },

    /** 상세정보 */
    searchDtlInfo: function() {
        PMain.search();
        pAutoLink.search();
    },

    /** aiPoll == 1 이면 성능예측, 장애예측 탭 출력 0인경우 성능예측,장애예측탭 선택시 요약탭으로 변경 eq 11 12 하드코딩.  */
    predictShow: function(aiPoll) {
        var displayFlag = aiPoll == 1 ? 'block' : 'none';
        if(aiPoll == 0){
            if($('#dtlTab').val() == 12 || $('#dtlTab').val() == 13)
            $('#dtlTab').jqxTabs('select', 0);
        }
        $('#dtlTab .jqx-tabs-title:eq(13)').css('display', displayFlag);
        $('#dtlTab .jqx-tabs-title:eq(14)').css('display', displayFlag);
    },

    exportExcel: function() {
        HmUtil.exportGrid($devGrid, '장비현황', false);
        // window.open('chrome-extension://iodihamcpbpeioajjeobimgagajmlibd/html/nassh.html#root@211.238.147.197:10022', '_blank');
        // alert('1');
    },
    exportExcelHtml: function() {
        HmUtil.exportGridHtml($devGrid, '장비현황', false);
    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
