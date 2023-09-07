var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid;
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
        $devGrid = $('#devGrid');
        this.initCondition();
    },

    initCondition: function() {
        HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
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
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%', collapsible: false }, { size: '55%' }], 'auto', '100%');


        /** 장비 그리드 */
        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields:[
                        { name: 'mngNo', type: 'int'},
                        { name: 'grpName', type: 'string'},
                        { name: 'disDevName', type: 'string'},
                        { name: 'devIp', type: 'string'},
                        { name: 'devKind1', type: 'string'},
                        { name: 'devKind2', type: 'string'},
                        { name: 'vendor', type: 'string'},
                        { name: 'model', type: 'string'},
                        { name: 'respAvg', type: 'string'},
                        { name: 'respMax', type: 'string'},
                        { name: 'lossPer', type: 'string'}
                    ]
                },
                {
                    formatData: function(data) {
                        var params = Master.getGrpTabParams();
                        params.mngNo = -1;
                        $.extend(data, params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
                        return JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        // dtl_mngNo = -1; // 왜 -1?
                        // dtl_devName = '';
                    }
                }
            ),
            columns:
                [
                    { text : '장비번호', datafield: 'mngNo', hidden: true },
                    { text : '그룹', datafield: 'grpName', width: 160 },
                    { text : '장비명', datafield: 'disDevName', minwidth: 160, cellsrenderer: HmGrid.devNameRenderer },
                    { text : 'IP', datafield: 'devIp', width: 120 },
                    { text : '타입', datafield: 'devKind1', width: 130, hidden: true },
                    { text : '장비종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist' },
                    { text : '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist' },
                    { text : '모델', datafield: 'model', width: 220, filtertype: 'checkedlist' },
                    { text : '응답평균(ms)', datafield: 'respAvg', width: 150, cellsalign: 'right' },
                    { text : '응답최대(ms)', datafield: 'respMax', width: 150, cellsalign: 'right' },
                    { text : '손실율', datafield: 'lossPer', width: 150, cellsrenderer: HmGrid.progressbarrenderer }
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
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devResTime/getDevResTimeList.do');
    },

    /** 상세정보 */
    searchDtlInfo: function() {
        PMain.search();
    },

    exportExcel: function() {
        HmUtil.exportGrid($devGrid, '장비응답시간', false);
    }

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});