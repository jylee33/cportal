var $grpTree, $svrGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#dGrpTreeGrid');
        $svrGrid = $('#svrGrid');
        this.initCondition();
    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },


    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch":
                this.search();
                break;
            case "btnExcel":
                this.exportExcel();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.search, {devKind1: 'SVR'});

        $("#date1_dstRpt").jqxDateTimeInput({
            width: '150px', height: '25px', formatString: 'yyyy-MM-dd', theme: jqxTheme
        });

        /** 서버현황 그리드 그리기 */
        HmGrid.create($svrGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields:[
                        { name:'mngNo', type:'number' },
                        { name:'grpName', type:'string' },
                        { name:'name', type:'string' },
                        { name:'devIp', type:'string' },
                        { name:'devKind1', type:'string' },
                        { name:'devKind2', type:'string' },
                        { name:'perfPoll', type:'number' },
                        { name:'disPerfPoll', type:'string' },
                        { name:'mntPoint', type:'string' },
                        { name:'fsMaxPer', type:'number' },
                        { name:'fsAvgPer', type:'number' },
                        { name:'fsMinPer', type:'number' },
                        { name:'totalSize', type:'number' },
                    ]
                },
                {
                    formatData: function (data) {
                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                        var _date = $('#date1_dstRpt').val();
                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                        if (treeItem != null) {
                            _itemKind = treeItem.devKind2;
                            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                            _grpParent = treeItem.grpParent;
                        }
                        $.extend(data, {
                            grpType: _grpType,
                            grpNo: _grpNo,
                            grpParent: _grpParent,
                            itemKind: _itemKind,
                            yyyymmdd: _date.replace(/[-]/gi,'')
                        },HmBoxCondition.getSrchParams());

                        return data;
                    }
                }
            ),
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns: [
                {text: '서버번호', datafield: 'mngNo', width: 150, hidden: true},
                {text: '그룹명', datafield: 'grpName', width: 150, pinned: false},
                {text: '서버명', datafield: 'name', width: 150, pinned: false, cellsrenderer: HmGrid.devNameRenderer},
                {text: 'IP', datafield: 'devIp', width: 150, pinned: false},
                {text: '성능수집', datafield: 'perfPoll', displayfield: 'disPerfPoll', width: 100},
                {text: '타입', datafield: 'devKind1', hidden: true},
                {text: '종류', datafield: 'devKind2', hidden: true},
                {text: '마운트', datafield: 'mntPoint', minwidth: 250, cellsalign: 'left'},
                {
                    text: '최대',
                    columngroup: 'fileSystem',
                    datafield: 'fsMaxPer',
                    width: 100,
                    cellsrenderer: HmGrid.progressbarrenderer,
                    filtertype: 'number'
                },
                {
                    text: '평균',
                    columngroup: 'fileSystem',
                    datafield: 'fsAvgPer',
                    width: 100,
                    cellsrenderer: HmGrid.progressbarrenderer,
                    filtertype: 'number'
                },
                {
                    text: '최소',
                    columngroup: 'fileSystem',
                    datafield: 'fsMinPer',
                    width: 100,
                    cellsrenderer: HmGrid.progressbarrenderer,
                    filtertype: 'number',
                    hidden: true
                },
                {text: '총용량', datafield: 'totalSize', width: 100,
                    cellsrenderer: HmGrid.unit1024renderer,
                    filtertype: 'number', cellsalign: 'right'}
            ],
            columngroups: [
                {text: '파일시스템', align: 'center', name: 'fileSystem'},
            ]
        }, CtxMenu.SVR, 0);

    },

    /** init data */
    initData: function () {

    },

    /** 서버현황 그리드 조회 */
    search: function () {
        console.log("일간 디스크 보고서 조회");
        console.log("PARAMETER : " + $.format.date($('#date1_dstRpt').jqxDateTimeInput('getDate'), 'yyyyMMdd'));
        HmGrid.updateBoundData($svrGrid, ctxPath + '/main/sms/dskReport/getDskReportList.do');
    },

    /** export Excel */
    exportExcel: function () {
        var params = Master.getDefGrpParams($grpTree);
        var _date = $('#date1_dstRpt').val();
        params.sIp = $('#sIp').val();
        params.sName = $('#sName').val();
        params.yyyymmdd =_date.replace(/[-]/gi,'');
        HmUtil.exportExcel(ctxPath + '/main/sms/dskReport/export.do', params);
    }

};

$(function () {

    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();

});
