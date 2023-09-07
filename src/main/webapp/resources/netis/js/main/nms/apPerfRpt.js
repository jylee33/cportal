var $grpTree, $apGrid;
var Main = {

    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid');
        $apGrid = $('#apGrid');
    },

    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch': this.search(); break;
            case 'btnExcel': this.exportExcel(); break;
        }
    },

    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmTreeGrid.create($grpTree, HmTree.T_AP_GRP_SUB_DEFAULT, Main.selectTree);
        HmBoxCondition.createPeriod('_svrPerfChart');

        Main.createGrid();

        $('#section').css('display', 'block');

    },

    initData: function () {

    },

    selectTree: function() {
        Main.search();
    },

    search: function () {
        HmGrid.updateBoundData($apGrid, '/main/nms/apPerf/getApPerfRpt.do')
    },

    exportExcel: function () {
        var date = $.format.date(new Date(), 'yyyyMMddHHmmss');
        HmUtil.exportGrid($apGrid, 'AP성능보고서_' + date, false);
    },

    createGrid: function () {
        HmGrid.create($apGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function(data) {
                        $.extend(data, HmBoxCondition.getPeriodParams('_svrPerfChart')); //날짜 파라미터 세팅
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);

                        if(treeItem !== null) {
                            data.grpNo = treeItem.grpNo;
                            if(treeItem.devKind2 === 'AP') {
                                var index = treeItem.grpNo.indexOf('_');
                                data.apNo = treeItem.grpNo.substring(index+1, data.grpNo.length);
                            }
                        }
                        return data;
                    }
                }
            ),
            columns:
                [
                    { text : 'No.', datafield: '1', width: 80, cellsrenderer: HmGrid.rownumrenderer, cellsalign: 'center' },
                    { text : 'AP명', datafield: 'apName', minwidth: 130 },
                    { text : 'AP IP', datafield: 'apIp', width: 120, cellsalign: 'center' },
                    { text : '수신 Byte', datafield: 'rxByte', width: 250, cellsrenderer: HmGrid.unit1024renderer },
                    { text : '송신 Byte', datafield: 'txByte', width: 250, cellsrenderer: HmGrid.unit1024renderer },
                    { text : '합계', datafield: 'sumByte', width: 250, cellsrenderer: HmGrid.unit1024renderer },
                ]
        });
    }
};

$(function () {
    Main.initVariable();
    Main.initData();
    Main.initDesign();
    Main.observe();
});
