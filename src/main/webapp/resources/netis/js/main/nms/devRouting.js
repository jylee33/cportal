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
        HmBoxCondition.createRadioInput($('#sSrchType'), [
            {label: 'SourceIP', value: 'IP'},
            {label: 'Rroute명', value: 'NAME'}
        ]);
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
            case 'btnConf': this.showConf(); break;
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
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;'
                },
                {
                    formatData: function(data) {
                        var params = Master.getGrpTabParams();
                        params.mngNo = -1;
                        $.extend(data, params,HmBoxCondition.getPeriodParams(), Main.getSrchParams());
                        return JSON.stringify(data);
                    },
                    loadComplete: function(records) {
                        // dtl_mngNo = -1; // 왜 -1?
                        // dtl_devName = '';
                    }
                }
            ),
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
            columns:
                [
                    { text: '장비번호', datafield: 'mngNo', width: 60, hidden: true },
                    { text : '그룹', datafield: 'grpName', minwidth: 150 },
                    { text : 'Source장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
                    { text : 'Route명', datafield: 'routeName', minwidth: 150 },
                    { text : '명령어구분', datafield: 'traceCmdType', displayfield: 'disTraceCmdType', width: 100 },
                    { text : 'Source IP', datafield: 'srcIp', width: 250 },
                    { text : 'Target IP', datafield: 'dstIp', width: 250 },
                    { text : '변경여부', displayfield: 'disIsChg', datafield: 'isChg', width: 100, cellsalign: 'center' },
                    { text : '최종변경일시', datafield: 'lastChgDatae', width: 200, cellsalign: 'center' }
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
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devRouting/getCfgRoutingList.do');
    },

    /** 상세정보 */
    searchDtlInfo: function() {
        PMain.search();
    },

    showConf: function() {
        var params = {
            grpType: 'DEFAULT',
            grpNo: 1
        }
        HmUtil.createPopup('/main/popup/nms/pRouteMonitoringConf.do', $('#hForm'), 'routeMonitoringConf', 1000, 600, params);
    },

    exportExcel: function() {
        HmUtil.exportGrid($devGrid, '장비경로감시', false);
    },
    getSrchParams: function(radioNm) {
        if(radioNm === undefined) {
            radioNm = 'sSrchType';
        }
        var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
            _stext = $('#{0}_input'.substitute(radioNm)).val();
        return {
            sSrcip: _stype == 'IP'? _stext : null,
            sRouteName: _stype == 'NAME'? _stext : null,
        };
    },

};


$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});