var $grpTree, $trunkGrid, $ifGrid;
var Main = {
    curMngNo: -1,
    curTrunkNm: null,

    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid'),
        $trunkGrid = $('#trunkGrid'), $ifGrid = $('#ifGrid');
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
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'L7SWITCH,L4SWITCH', isPerfFlag: 1});
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

        HmGrid.create($trunkGrid, {
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
                        { name: 'trunkNm', type: 'string' },
                        { name: 'memberCount', type: 'number' },
                        { name: 'bandwidth', type: 'number' },
                        { name: 'lastUpd', type: 'string' },
                        { name: 'status', type: 'number' },
                        { name: 'dispStatus', type: 'string' },
                        { name: 'inPps', type: 'number' },
                        { name: 'outPps', type: 'number' },
                        { name: 'inBps', type: 'number' },
                        { name: 'outBps', type: 'number' },
                        { name: 'inMcast', type: 'number' },
                        { name: 'outMcast', type: 'number' },
                        { name: 'inError', type: 'number' },
                        { name: 'outError', type: 'number' },
                        { name: 'inDrop', type: 'number' },
                        { name: 'outDrop', type: 'number' },
                        { name: 'statusClz', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        // $.extend(data, HmBoxCondition.getSrchParams());
                        $.extend(data, Main.getCommParams());
                        return JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        Main.curMngNo = -1;
                        Main.curTrunkNm = null;
                        $ifGrid.jqxGrid('clear');
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, 'Trunk 성능');
            },
            columns:
                [
                    { text: '그룹명', datafield: 'grpName', width: 130, pinned: true },
                    { text: '장비명', datafield: 'devName', minwidth: 150, pinned: true },
                    { text: '장비IP', datafield: 'devIp', width: 120, pinned: true },
                    { text: 'Trunk Name', datafield: 'trunkNm', minwidth: 150, pinned: true },
                    { text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', cellsrenderer: HmGrid.l4f5StatusRenderer},
                    { text: 'Member Count', datafield: 'memberCount', width: 80},
                    { text: 'BandWidth', datafield: 'bandwidth', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    { text: "In", datafield: "inPps", columngroup: 'pps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "Out", datafield: "outPps", columngroup: 'pps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "In", datafield: "inBps", columngroup: 'bps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "Out", datafield: "outBps", columngroup: 'bps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer },
                    { text: "In", datafield: "inError", columngroup: 'error', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "Out", datafield: "outError", columngroup: 'error', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "In", datafield: "inMcast", columngroup: 'mcast', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "Out", datafield: "outMcast", columngroup: 'mcast', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "In", datafield: "inDrop", columngroup: 'drop', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "Out", datafield: "outDrop", columngroup: 'drop', width: 100, cellsalign: 'right', cellsformat: 'n' },
                    { text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center' }
                ],
            columngroups: [
                {text: 'pps', align: 'center', name: 'pps'},
                {text: 'bps', align: 'center', name: 'bps'},
                {text: 'multicast', align: 'center', name: 'mcast'},
                {text: 'error', align: 'center', name: 'error'},
                {text: 'drop', align: 'center', name: 'drop'}
            ]
        }, CtxMenu.L4_F5_TRUNK, 'trunk');
        $trunkGrid.on('rowselect', function(event) {
            // search interface
            Main.curMngNo = event.args.row.mngNo;
            Main.curTrunkNm = event.args.row.trunkNm;
            Main.searchInterface();
        });

        HmGrid.create($ifGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        { name: 'mngNo', type: 'number' },
                        { name: 'idx', type: 'string' },
                        { name: 'grpName', type: 'string' },
                        { name: 'devName', type: 'string' },
                        { name: 'devIp', type: 'string' },
                        { name: 'lbType', type: 'number' },
                        { name: 'ifNm', type: 'string' },
                        { name: 'bandwidth', type: 'number' },
                        { name: 'duplex', type: 'integer' },
                        { name: 'trunkNm', type: 'string' },
                        { name: 'lastUpd', type: 'string' },
                        { name: 'status', type: 'number' },
                        { name: 'dispStatus', type: 'string' },
                        { name: 'inPps', type: 'number' },
                        { name: 'outPps', type: 'number' },
                        { name: 'inBps', type: 'number' },
                        { name: 'outBps', type: 'number' },
                        { name: 'inMcast', type: 'number' },
                        { name: 'outMcast', type: 'number' },
                        { name: 'inError', type: 'number' },
                        { name: 'outError', type: 'number' },
                        { name: 'inDrop', type: 'number' },
                        { name: 'outDrop', type: 'number' },
                        { name: 'isHighlight', type: 'number' },
                        { name: 'statusClz', type: 'string' }
                    ]
                },
                {
                    formatData: function(data) {
                        // $.extend(data, HmBoxCondition.getSrchParams());
                        $.extend(data, Main.getCommParams());
                        data.mngNo = Main.curMngNo;
                        data.trunkNm = Main.curTrunkNm;
                        return JSON.stringify(data);
                    },
                    beforeLoadComplete: function(records) {
                        if(records != null && records.length) {
                            $.each(records, function(i, v) {
                                v.isHighlight = v.trunkNm == Main.curTrunkNm? 1 : 0;
                            });
                        }
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '회선 성능');
            },
            columns:
            [
                { text: '그룹명', datafield: 'grpName', minwidth: 130, pinned: true, cellclassname: Main.highlight_cellclassname },
                { text: '장비명', datafield: 'devName', minwidth: 150, pinned: true, cellclassname: Main.highlight_cellclassname },
                { text: '장비IP', datafield: 'devIp', width: 120, pinned: true, cellclassname: Main.highlight_cellclassname },
                { text: 'Interface Name', datafield: 'ifNm', width: 150, pinned: true, cellclassname: Main.highlight_cellclassname },
                { text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', cellsrenderer: HmGrid.l4f5StatusRenderer, cellclassname: Main.highlight_cellclassname},
                { text: 'BandWidth', datafield: 'bandwidth', width: 100, cellsrenderer: HmGrid.unit1000renderer, cellclassname: Main.highlight_cellclassname },
                { text: 'Trunk Name', datafield: 'trunkNm', width: 150, pinned: true, cellclassname: Main.highlight_cellclassname },
                { text: "In", datafield: "inPps", columngroup: 'pps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, cellclassname: Main.highlight_cellclassname },
                { text: "Out", datafield: "outPps", columngroup: 'pps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, cellclassname: Main.highlight_cellclassname },
                { text: "In", datafield: "inBps", columngroup: 'bps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, cellclassname: Main.highlight_cellclassname },
                { text: "Out", datafield: "outBps", columngroup: 'bps', width: 100, cellsalign: 'right', cellsrenderer: HmGrid.unit1000renderer, cellclassname: Main.highlight_cellclassname },
                { text: "In", datafield: "inError", columngroup: 'error', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "Out", datafield: "outError", columngroup: 'error', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "In", datafield: "inMcast", columngroup: 'mcast', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "Out", datafield: "outMcast", columngroup: 'mcast', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "In", datafield: "inDrop", columngroup: 'drop', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "Out", datafield: "outDrop", columngroup: 'drop', width: 100, cellsalign: 'right', cellsformat: 'n', cellclassname: Main.highlight_cellclassname },
                { text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center', cellclassname: Main.highlight_cellclassname }
            ],
            columngroups: [
                {text: 'pps', align: 'center', name: 'pps'},
                {text: 'bps', align: 'center', name: 'bps'},
                {text: 'multicast', align: 'center', name: 'mcast'},
                {text: 'error', align: 'center', name: 'error'},
                {text: 'drop', align: 'center', name: 'drop'}
            ]
        }, CtxMenu.L4_F5_IF, 'interface');
    },

    /** init data */
    initData: function() {
        Main.search();
    },

    highlight_cellclassname:  function(row, column, value, data) {
        return data.isHighlight == 1? 'action' : null;
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
        Main.searchTrunk();
        // Main.searchInterface();
    },

    /** Trunk 조회 */
    searchTrunk: function() {
        HmGrid.updateBoundData($trunkGrid, ctxPath + '/main/nms/l4TrunkF5/getTrunkList.do');
    },

    /** Interface 조회 */
    searchInterface: function() {
        HmGrid.updateBoundData($ifGrid, ctxPath + '/main/nms/l4TrunkF5/getInterfaceList.do');
    },

    /** Interface highlight
    highlightTrunkIf: function(mngNo, trunkNm) {
        var rows = $ifGrid.jqxGrid('getboundrows');
        $.each(rows, function(i, v) {
            if(v.mngNo == mngNo && v.trunkNm == trunkNm) {
                v.isHighlight = 1;
            }
            else {
                v.isHighlight = 0;
            }
        });

        $ifGrid.jqxGrid('refresh');
    },
     */
    /** export 엑셀 */
    exportExcel: function() {
        HmUtil.exportGrid($trunkGrid, 'L4Trunk', false);
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});