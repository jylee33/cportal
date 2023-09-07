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
            case 'btnIfConf': this.searchIfConf(); break;
            case 'btnExcel': this.exportExcel(); break;
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

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        /** 장비 그리드 */
        HmGrid.create($devGrid, {
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
                        { name: 'ifIdx', type: 'string' },
                        { name: 'disIfName', type: 'string' },
                        { name: 'lineWidth', type: 'number' },
                        { name: 'avgInbps', type: 'number' },
                        { name: 'avgOutbps', type: 'number' }
                    ]
                },
                {
                    formatData: function(data) {

                        var params = Master.getGrpTabParams();
                        params.sIp = $('#sIp').val();
                        params.sDevName = $('#sDevName').val();

                        $.extend(data, params);
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
                    { text : '회선설정번호', datafield: 'ifIdx', width: 80, pinned: true, hidden: true },
                    { text : '그룹명', datafield: 'grpName', minwidth : 130, pinned: true },
                    { text : '장비명', datafield: 'disDevName', minwidth : 150, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
                    { text: '대표IP', datafield: 'devIp', width: 120 },
                    { text: '타입코드', datafield: 'devKind1', hidden: true},
                    { text: '종류', datafield: 'devKind2', width: 100 },
                    { text: '제조사', datafield: 'vendor', width: 130 },
                    { text: '모델', datafield: 'model', width: 150 },
                    { text: "회선수", datafield: "ifCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
                    { text: "Alive 수", datafield: "aliveIfCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
                    { text: "Dead 수", datafield: "deadIfCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" , hidden: true},
                    { text: "메모리", datafield: "memory", width: 90, cellsrenderer: HmGrid.unit1024renderer },
                    { text: "CPU사용률", datafield: "cpuPer", width: 100, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
                    { text: "메모리사용률", datafield: "memPer", width: 110, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
                    { text: '시리얼', datafield: 'machine_serial', width: 130, hidden: true },
                    { text: 'OS버전', datafield: 'machineVer', width: 130, hidden: true },
                    { text: '회선명', datafield: 'disIfName', width: 130 },
                    { text: '대역폭', datafield: 'lineWidth', width: 80, cellsrenderer: HmGrid.unit1000renderer },
                    { text: "In bps", datafield: "avgInbps", width: 80, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "Out bps", datafield: "avgOutbps", width: 80, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "커뮤니티", datafield: "isCommunity", width: 80, hidden:true }
                ]
        }, CtxMenu.DEV, ctxmenuIdx++);

        $devGrid.on('rowdoubleclick', function(event) {
            dtl_mngNo = event.args.row.bounddata.mngNo;
            dtl_devName = event.args.row.bounddata.disDevName;
            Main.searchDtlInfo();
        })
            .on('bindingcomplete', function(event) {
                try {
                    $(this).jqxGrid('selectrow', 0);
                    dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
                    dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'disDevName');
                    Main.searchDtlInfo();
                } catch(e) {}
            });

        // 좌측 탭영역
        Master.createGrpTab(Main.searchDev, {devKind1: 'DEV'});
        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function() {

    },

    /** 장비 조회 */
    searchDev: function() {
        HmGrid.updateBoundData($devGrid, ctxPath + '/dexterStudios/nms/devStatus/getDevStatusList.do');
    },
    /** 회선 설정 */
    searchIfConf: function() {
        var rowIdxes = HmGrid.getRowIdxes($devGrid);
        if(rowIdxes === false) {
            alert('선택된 장비가 없습니다.');
            return;
        }
        var rowData = $devGrid.jqxGrid('getrowdata', rowIdxes);
        $.post(ctxPath + '/dexterStudios/popup/nms/pIfConf.do',
            function(result) {
                HmWindow.open($('#pwindow'), '회선 설정', result, 600, 430, 'pwindow_init', rowData);
            }
        );
    },

    /** 상세정보 */
    searchDtlInfo: function() {
        PMain.search();
    },

    exportExcel: function() {
        HmUtil.exportGrid($devGrid, '장비현황', false);
    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});