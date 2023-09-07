var $grpTree, $devGrid, $virtualGrid, $realGrid;
var Main = {
    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid'), $devGrid=$('#devGrid'),
            $virtualGrid = $('#virtualGrid'), $realGrid = $('#realGrid');
        this.initCondition();
    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
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
            case 'btnSearch': this.search(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function() {

        // HmTreeGrid.create($grpTree, HmTree.T_L4_GRP_DEFAULT, Main.selectTree, {devKind2: 'L4', isPerfFlag: 1});
        HmTreeGrid.create($grpTree, HmTree.T_L4_F5_GRP_DEFAULT, Main.selectTree, {devKind2: 'L7SWITCH,L4SWITCH', isPerfFlag: 1 , vendor:'PIOLINK'});

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmGrid.create($virtualGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'grpName', type: 'string' },
                        { name: 'devName', type: 'string' },
                        { name: 'devKind2', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'idx', type: 'string' },
                        { name: 'lbType', type: 'number' },
                        { name: 'ip', type: 'string' },
                        { name: 'protocol', type: 'string' },
                        { name: 'port', type: 'number' },
                        { name: 'svrNm', type: 'string' },
                        { name: 'svrGrpNm', type: 'string' },
                        { name: 'status', type: 'number' },
                        { name: 'dispStatus', type: 'string' },
                        { name: 'lastUpd', type: 'string' },
                        { name: 'inBps', type: 'number' },
                        { name: 'outBps', type: 'number' },
                        { name: 'currConn', type: 'number' },
                        { name: 'cps', type: 'number' },
                        { name: 'statusClz', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        return JSON.stringify(data);
                    },
                    loadComplete : function(record) {
                        $realGrid.jqxGrid('clear');
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, 'Virtual 세션성능');
            },
            columns:
                [
                    { text: '그룹명', datafield: 'grpName', width: 130, pinned: true },
                    { text: '장비명', datafield: 'devName', width: 150, pinned: true },
                    { text: '장비IP', datafield: 'devIp', width: 120, pinned: true },
                    { text: 'Virtual Server', datafield: 'svrNm', width: 150, pinned: true },
                    { text: 'Virtual Server IP', datafield: 'ip', width: 120 },
                    { text: 'Protocol', datafield: 'protocol', width: 100, cellsalign: 'center' , hidden : true},
                    { text: 'PORT', datafield: 'port', width: 80, cellsalign: 'right'},
                    { text: 'Virtual 그룹명', datafield: 'svrGrpNm', width: 150 ,hidden : true},
                    //{ text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', cellsrenderer: HmGrid.l4f5VirtualStatusRenderer ,hidden : true},
                    { text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden : true},
                    { text: "In bps", datafield: "inBps", width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer ,hidden : true},
                    { text: "Out bps", datafield: "outBps", width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer ,hidden : true},
                    { text: "현재 세션수", datafield: "currConn", width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "CPS", datafield: "cps", width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center' }
                ]
        }, CtxMenu.L4_F5_PIOLINK_VIRTUAL, 'virtual');
        $virtualGrid.on('rowdoubleclick', function(event) {
            Main.searchRealSvr();
        });

        HmGrid.create($realGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'idx', type: 'string' },
                        { name: 'lbType', type: 'number' },
                        { name: 'ip', type: 'string' },
                        { name: 'port', type: 'number' },
                        { name: 'svrNm', type: 'string' },
                        { name: 'svrGrpNm', type: 'string' },
                        { name: 'status', type: 'number' },
                        { name: 'dispStatus', type: 'string' },
                        { name: 'lastUpd', type: 'string' },
                        { name: 'inBps', type: 'number' },
                        { name: 'outBps', type: 'number' },
                        { name: 'currConn', type: 'number' },
                        { name: 'cps', type: 'number' },
                        { name: 'statusClz', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        var virtualItem = HmGrid.getRowData($virtualGrid);
                        data.mngNo = virtualItem == null? -1 : virtualItem.mngNo;
                        data.svrGrpNm = virtualItem == null? null : virtualItem.svrGrpNm;
                        data.virtualIdx = virtualItem == null? '' : virtualItem.idx;
                        console.log('data',data)
                        return JSON.stringify(data);
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, 'Real Server 세션성능');
            },
            columns:
                [
                    { text: 'Real Server', datafield: 'svrNm', width: 500 },
                    { text: 'Real Server IP', datafield: 'ip', width: 120 },
                    { text: 'PORT', datafield: 'port', width: 80, cellsalign: 'right'},
                    // { text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', cellsrenderer: HmGrid.l4f5StatusRenderer, hidden : false },
                    { text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden : true },
                    { text: "In bps", datafield: "inBps", width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, hidden : true },
                    { text: "Out bps", datafield: "outBps", width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, hidden : true },
                    { text: "현재 세션수", datafield: "currConn", width: 100, cellsalign: 'right', cellsformat: 'n' },
                    //{ text: "증가 세션수", datafield: "totConn", width: 100, cellsalign: 'right', cellsformat: 'n', hidden : true },
                    //{ text: "최대 세션수", datafield: "maxConn", width: 100, cellsalign: 'right', cellsformat: 'n', hidden : true },
                    { text: "CPS", datafield: "cps", width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center' }
                ]
        }, CtxMenu.L4_F5_PIOLINK_REAL, 'real');
    },

    /** init data */
    initData: function() {
        Main.search();
    },

    /** 공통 파라미터 */
    getCommParams: function() {
        var params = Master.getDefGrpParams($grpTree);
        // $.extend(params, {
        //     sIp: $('#sIp').val(),
        //     sDevName: $('#sDevName').val()
        // });
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },

    /** 그룹트리 선택이벤트 */
    selectTree: function() {
        Main.search();
    },

    search: function() {
        Main.searchVirtualSvr();
    },

    /** Virtual 조회 */
    searchVirtualSvr: function() {
        HmGrid.updateBoundData($virtualGrid, ctxPath + '/main/nms/l4SessionPiolink/getVirtualList.do');
    },

    /** Real 조회 */
    searchRealSvr: function() {
        HmGrid.updateBoundData($realGrid, ctxPath + '/main/nms/l4SessionPiolink/getRealList.do');
    },

    /** export 엑셀 */
    exportExcel: function() {
        HmUtil.exportGrid($virtualGrid, 'L4/L7세션', false);
    },


};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
