var $phoneGrid, $menu;
var timer;

var Main = {
    /** variable */
    initVariable: function () {
        $phoneGrid = $('#phoneGrid');
        $menu = $('<div id="ctxmenu_phoneMonitor"></div>');
        this.initCondition();
    },
    initCondition: function() {
        // 기간
        HmBoxCondition.createPeriod('', Main.search, timer);
        $("input[name=sRef]").eq(2).click();
        // radio 조건
        HmBoxCondition.createRadioInput($('#sSrchType'), [
            {label: '전화기명', value: 'sPhoneName'},
            {label: '내선', value: 'sExtNum'},
            {label: 'IP', value: 'sSetIp'},
        ]);
    },
    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        //
        // $phoneGrid.contextmenu(function (event) {
        //     return false;
        // }).on('rowclick', function (event) {
        //     if (event.args.rightclick) {
        //         $phoneGrid.jqxGrid('selectrow', event.args.rowindex);
        //
        //         var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
        //         var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
        //         if ($(window).height() < (event.args.originalEvent.clientY + $menu.height() + 10)) {
        //             posY = $(window).height() - ($menu.height() + 10);
        //         }
        //         $menu.jqxMenu('open', posX, posY);
        //         return false;
        //     }
        // });

        $('.searchBox').keypress(function (e) {
            if (e.keyCode == 13) Main.search();
        });

    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
            case 'btnSetup' :
                this.setPopupCall();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        Master.createGrpTab(Main.selectTree, {devKind2: 'PBX'});

        HmGrid.create($phoneGrid, {
            source: new $.jqx.dataAdapter({datatype: 'json'}, {
                formatData: function (data) {
                    $.extend(data, Main.getCommParams());
                    return data;
                }
            }),
            columns: [
                {text: '교환기 이름', datafield: 'devName', minwidth: 80, cellsalign: 'center', pinned: true},
                {text: '연결 내선번호', datafield: 'extPort', width: 120, cellsalign: 'center'},
                {text: '내선 생성 Type', datafield: 'setType', width: 120, cellsalign: 'center'},
                {text: '전화기 IP', datafield: 'phoneIp', width: 150, cellsalign: 'center'},
                {text: 'Network-Region Number', datafield: 'netRgn', width: 170, cellsalign: 'center'},
                {text: '연결노드ID', datafield: 'prodId', width: 180, cellsalign: 'center'},
                {text: '펌웨어 버전', datafield: 'fwVer', width: 180, cellsalign: 'center'},
                {text: 'Socket 연결 여부', datafield: 'sktFlag', width: 180, cellsalign: 'center'},
                {text: '등록 여부', datafield: 'status', width: 180, cellsalign: 'center'},
                {text: 'Gatekeeper IP', datafield: 'gateIp', width: 180, cellsalign: 'center'}
            ]
        }, CtxMenu.AVAYA_PHONE_MONITOR, 1);
    },

    /** init data */
    initData: function () {
      /*  Main.chgRefreshCycle();*/
    },

    /** 트리선택 */
    selectTree: function () {
        Main.search();
    },

    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Master.getGrpTabParams();
        $.extend(params, Main.getSrchParams()
           );
        return params;
    },
    getSrchParams: function(radioNm) {
        if(radioNm === undefined) {
            radioNm = 'sSrchType';
        }
        var _stype = $("input:radio[name={0}]:checked".substitute(radioNm)).val(),
            _stext = $('#{0}_input'.substitute(radioNm)).val();
        return {
            sPhoneName: _stype == 'sPhoneName'? _stext : null,
            sExtNum: _stype == 'sExtNum'? _stext : null,
            sSetIp: _stype == 'sSetIp'? _stext : null,
        };
    },
    search: function () {
        HmGrid.updateBoundData($phoneGrid, ctxPath + '/main/ipt/avayaPhoneMonitor/getIptAvayaPhoneList.do');
    },

    /** export */
    exportExcel: function () {
        HmUtil.exportGrid($phoneGrid, '전화기 모니터링', false);
    },

    /** 새로고침 주기 변경 */
    chgRefreshCycle: function () {
        var cycle = $('#refreshCycleCb').val();
        if (timer != null)
            clearInterval(timer);
        if (cycle > 0) {
            timer = setInterval(function () {
                var curVal = $('#prgrsBar').val();
                if (curVal < 100)
                    curVal += 100 / cycle;
                $('#prgrsBar').val(curVal);
            }, 1000);
        } else {
            $('#prgrsBar').val(0);
        }
    },

    setPopupCall: function () {
        var params = { type : 'phone' };
        $.post(ctxPath + '/main/popup/ipt/pAvayaPhoneSet.do', params,
            function (result) {
                HmWindow.open($('#pwindow'), '전화기 모니터링 설정', result, 330, 137, 'pwindow_init');
            }
        );
    }

};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});