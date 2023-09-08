var $rptGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $rptGrid = $('#rptGrid');
        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });

        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
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
            case "btnExcelHtml":
                this.exportExcelHtml();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        HmDate.create($('#date1'), $('#date2'), HmDate.YESTERDAY, 1);

        $('#date1, #date2').jqxDateTimeInput({
            width: '100px',
            height: '21px',
            formatString: 'yyyy-MM-dd',
            theme: jqxTheme
        });

        var source = {
            datatype: "json",
            url: ctxPath + '/main/env/optConf/getWorkTimeConfList.do',
            formatData: function (data) {
                $.extend(data, {isAll: 'true'});
                return data;
            }
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#cbTimeId').jqxDropDownList({
            selectedIndex: 0,
            source: dataAdapter,
            displayMember: "memo",
            valueMember: "codeId",
            theme: jqxTheme,
            width: 100,
            height: 21,
            placeHolder: '선택',
            autoDropDownHeight: true
        });

        $('#cbPer').jqxNumberInput({
            width: 45,
            height: 21,
            min: 0,
            max: 100,
            decimalDigits: 0,
            spinButtons: true,
            inputMode: 'simple',
            theme: jqxTheme
        });

        $('#cbPer').jqxNumberInput('val', 80);


        //휴일 공휴일 체크박스
        // $('#ckDayOff, #ckHoliday').jqxCheckBox({width: 80, height: 22, checked: false});

        // 성능수집여부 체크박스
        $('#ckPerfFlag').jqxCheckBox({width: 80, height: 22, checked: true});



        var source = {
            datatype: 'json',
            root: 'rows',
            beforeprocessing: function (data) {
                if (data != null)
                    source.totalrecords = data.resultData != null ? data.resultData.totalrecords : 0;
            },
            sort: function () {
                $rptGrid.jqxGrid('updatebounddata', 'sort');
            },
            filter: function () {
                $rptGrid.jqxGrid('updatebounddata', 'filter');
            }
        };

        var adapter = new $.jqx.dataAdapter(
            source,
            {
                formatData: function (data) {
                    var params = Main.getCommParams();
                    $.extend(data, params);
                    return data;
                }
            }
        );

        HmGrid.create($rptGrid, {
            source: adapter,
            virtualmode: true,
            rendergridrows: function (params) {
                return adapter.records;
            },
            // pagesize : 100,
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns: [
                {text: '그룹명', datafield: 'grpName', pinned: true, hidden: false},
                {text: '장비번호', datafield: 'mngNo', hidden: true},
                {text: '장비명', datafield: 'disDevName', minwidth: 150, pinned: true},
                {text: '장비IP', datafield: 'devIp', width: 120, pinned: true},
                {text: '장비종류', datafield: 'devKind2', width: 100, pinned: true},
                {text: '제조사', datafield: 'vendor', width: 120, pinned: true, hidden: true},
                {text: '모델', datafield: 'model', width: 120, pinned: true, hidden: true},
                {text: '회선명', datafield: 'ifName', minwidth: 140, pinned: true},
                {text: '회선IP', datafield: 'ifIp', minwidth: 140, pinned: true},
                {text: '회선별칭', datafield: 'ifAlias', minwidth: 140},
                {text: '회선번호', datafield: 'ifIdx', width: 80, cellsalign: 'right', hidden: true},
                {
                    text: '대역폭',
                    datafield: 'lineWidth',
                    width: 80,
                    cellsrenderer: HmGrid.unit1000renderer
                },
                {text: '상태', datafield: 'status', width: 80, cellsrenderer: HmGrid.ifStatusrenderer},

                {
                    text: '평균',
                    columngroup: 'inbps',
                    datafield: 'avgInbps',
                    width: 80,
                    cellsrenderer: HmGrid.unit1000renderer
                },
                {
                    text: '최대',
                    columngroup: 'inbps',
                    datafield: 'maxInbps',
                    width: 80,
                    cellsrenderer: HmGrid.unit1000renderer
                },

                {
                    text: '평균',
                    columngroup: 'outbps',
                    datafield: 'avgOutbps',
                    width: 80,
                    cellsrenderer: HmGrid.unit1000renderer
                },
                {
                    text: '최대',
                    columngroup: 'outbps',
                    datafield: 'maxOutbps',
                    width: 80,
                    cellsrenderer: HmGrid.unit1000renderer
                },


                /*================IN BPS(%)=================*/
                {
                    text: '평균 ',
                    columngroup: 'inLoad',
                    datafield: 'avgInbpsPer',
                    width: 80,
                    cellsformat: 'p',
                    cellsalign: 'right'
                },
                {
                    text: '최대',
                    columngroup: 'inLoad',
                    datafield: 'maxInbpsPer',
                    width: 80,
                    cellsformat: 'p',
                    cellsalign: 'right'
                },
                /*================OUT BPS(%)=================*/
                {
                    text: '평균 ',
                    columngroup: 'outLoad',
                    datafield: 'avgOutbpsPer',
                    width: 80,
                    cellsformat: 'p',
                    cellsalign: 'right'
                },
                {
                    text: '최대',
                    columngroup: 'outLoad',
                    datafield: 'maxOutbpsPer',
                    width: 80,
                    cellsformat: 'p',
                    cellsalign: 'right'
                }
            ],
            columngroups: [
                {text: '장비정보', align: 'center', name: 'devInfo'},
                {text: 'In bps', align: 'center', name: 'inbps'},
                {text: 'Out bps', align: 'center', name: 'outbps'},
                {text: 'In bps(%)', align: 'center', name: 'inLoad'},
                {text: 'Out bps(%)', align: 'center', name: 'outLoad'},
            ]
        }, CtxMenu.COMM);


        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT_GYEONGI);
                        break;
                }
            }
        }).on('selected', function (event) {
            Main.search();
        });

        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {
    },

    /** 공통 파라미터 */
    getCommParams: function () {

        var treeItem = null, _grpType = 'DEFAULT';
        switch ($('#leftTab').val()) {
            case 0:
                treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
                _grpType = 'DEFAULT';
                break;
            case 1:
                treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
                _grpType = 'SEARCH';
                break;
            case 2:
                treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
                _grpType = 'IF';
                break;
        }

        var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';

        if (treeItem != null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
            _grpParent = treeItem.grpParent;
        }

        var params = {
            grpType: _grpType,
            grpNo: _grpNo,
            grpParent: _grpParent,
            itemKind: _itemKind
        };

        $.extend(params, {
            timeId: '0',
            per: $('#cbPer').val(),
            date1: HmDate.getDateStr($('#date1')),
            date2: HmDate.getDateStr($('#date2')),
            isDayOff: $('#ckDayOff').val() ? 1 : 0,
            isHoliday: $('#ckHoliday').val() ? 1 : 0,
            isPerfFlag: $('#ckPerfFlag').val() ? 1 : 0
        }, HmBoxCondition.getSrchParams());
        return params;
    },

    selectTree: function () {
        Main.search();
    },
    /** 조회 */
    search: function () {

        var paginginformation = $rptGrid.jqxGrid('getpaginginformation');

        if (paginginformation.pagenum > 0) {
            $rptGrid.jqxGrid("gotopage", 0);
        } else {
            HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/ifDetailRpt/getIfDetailRptList_Gyeongischool4.do');
        }

    },

    /** export Excel */
    exportExcel: function () {

        HmUtil.exportGrid($rptGrid, '회선 상세 보고서', true);

        // var params = Main.getCommParams();
        // HmUtil.exportExcel(ctxPath + '/main/rpt/ifDetailRpt/export_impala.do', params);

    },
    /** export Html */
    exportExcelHtml: function () {
        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/rpt/ifDetailRpt/exportHtml.do', params);
    }
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});