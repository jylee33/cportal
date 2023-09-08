var $grpTree, $grid;
var dtl_mngNo = -1;
var ctxmenuIdx = 1;
var Main = {
    /** variable */
    initVariable: function() {
        $grpTree = $('#dGrpTreeGrid'), $grid = $('#grid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSearch': this.search(); break;
            case "btnExcel": this.exportExcel(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{size: '50%', collapsible: false}, {size: '50%'}], 'auto', '100%');
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'UPS' });

        HmGrid.create($grid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            columns:
                [
                    { text : '그룹명', datafield: 'grpName', width : 150, pinned: true },
                    { text : 'UPS명', datafield: 'devName', minwidth : 150, pinned: true },
                    { text : 'IP', datafield: 'devIp', width : 120 },
                    { text : '장비번호', datafield: 'mngNo', hidden : true },
                    { text : '종류', datafield: 'devKind2', width : 100 },
                    { text : '제조사', datafield: 'vendor', width : 140 },
                    { text : '모델', datafield: 'model', width : 200 },
                    { text : 'UPS형태', datafield: 'upsVoltStr', width : 100},
                    { text : '수집시작일시', datafield: 'startPerfDate', width : 150 },
                    /*{ text : '배터리용량 (%)', datafield: 'batteryCapacity', width : 110, cellsalign: 'right' },
                    { text : '입력전압 (V)', datafield: 'inVoltage', width : 100, cellsalign: 'right' },
                    { text : '출력전압 (V)', datafield: 'outVoltage', width : 100, cellsalign: 'right' },
                    { text : 'UPS부하 (%)', datafield: 'upsCharge', width : 100, cellsalign: 'right' },
                    { text : '배터리전압 (V)', datafield: 'batteryVoltage', width : 100, cellsalign: 'right' },
                    { text : '입력주파수 (Hz)', datafield: 'inFrequency', width : 110, cellsalign: 'right' },
                    { text : '출력주파수 (Hz)', datafield: 'outFrequency', width : 110, cellsalign: 'right' },
                    { text : '배터리상태', datafield: 'batteryStatus', width : 130 },
                    { text : '출력상태', datafield: 'outStatus', width : 130 },
                    { text : '온도 (℃)', datafield: 'batteryTemp', width : 100, cellsalign: 'right' }*/
                ]
            //}, CtxMenu.ALONE_UPS);
        }, CtxMenu.COMM, ctxmenuIdx);

        $grid.on('bindingcomplete', function (event) {
            $grid.jqxGrid('selectrow', 0);
        });

        $grid.on('rowselect', function (event) {
            var row = event.args.row;
            if(!row) return;
            dtl_mngNo = row.mngNo;
            $("#summaryUpsVolt").val(row.upsVolt);
            $("#summaryMngNo").val(row.mngNo);

            switch($dtlTab.val()) {//탭구분 조회
                case 0 : pSummary.search(row); break;
                case 1 : pPerf.search(); break;
                case 2 : pEvtInfo.search(); break;
            }
        });
    },



    /** init data */
    initData: function() {

    },

    selectTree: function() {
        Main.search();
    },

    /** 공통 파라미터 */
    getCommParams: function() {
        var params = Master.getDefGrpParams($grpTree);
        $.extend(params, {
        });
        return params;
    },

    /** 조회 */
    search: function() {
        HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgAloneUpsMonitor/getItgAloneUpsMonitorList.do');
    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($grid, '단독형UPS감시', false);
        // var params = Main.getCommParams();
        // HmUtil.exportExcel(ctxPath + '/main/innotube/itgAloneUpsMonitor/export.do', params);
    }
};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});