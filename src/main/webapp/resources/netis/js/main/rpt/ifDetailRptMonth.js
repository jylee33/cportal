var $rptGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $rptGrid = $('#rptGrid');
        this.initCondition();
    },

    initCondition: function () {

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

        HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 30);


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


        $('#cbUnit').jqxDropDownList({
            selectedIndex: 0,
            source: [
                {label: '자동', value: 1},
                {label: '원본', value: 2},
                {label: 'K', value: 3},
                {label: 'M', value: 4},
                {label: 'G', value: 5},
            ],
            displayMember: "memo",
            valueMember: "codeId",
            theme: jqxTheme,
            width: 100,
            height: 21,
            placeHolder: '선택',
            autoDropDownHeight: true
        });

        $("#cbIfName").jqxDropDownList({
            selectedIndex: 1,
            source: [
                {label: '미적용', value: ''},
                {label: '업링크', value: '업링크'},
                {label: '교육망', value: '교육망'},
                {label: '업무망', value: '업무망'},
                {label: '무선망', value: '무선망'},
                {label: '전화기망', value: '전화기망'},
                {label: '학생망', value: '학생망'},
                {label: '교사망', value: '교사망'},
            ],
            displayMember: "memo",
            valueMember: "codeId",
            theme: jqxTheme,
            width: 100,
            height: 21,
            placeHolder: '선택',
            autoDropDownHeight: true
        });



        //휴일 공휴일 체크박스
        $('#ckDayOff, #ckHoliday').jqxCheckBox({width: 80, height: 22, checked: true});

        // 성능수집여부 체크박스
        $('#ckPerfFlag').jqxCheckBox({width: 80, height: 22, checked: true});


        $('#leftTab').jqxTabs({
            width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree);
                        break;
                    case 1:
                        HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree);
                        break;
                    case 2:
                        HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, Main.selectTree);
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
        var _temp = [];
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

        HmDate.getDateRange(HmDate.getDateStrNormal($("#date1")), HmDate.getDateStrNormal($("#date2")), _temp);

        var _list = new Array();

        _temp.forEach(function (value) {
            _list.push(Main.replaceAll(value, '-', ''));
        });

        $.extend(params, {
            timeId: $('#cbTimeId').val(),
            listDate: _list,
            date1: HmDate.getDateStr($('#date1')),
            date2: HmDate.getDateStr($('#date2')),
            isDayOff: $('#ckDayOff').val() ? 1 : 0,
            isHoliday: $('#ckHoliday').val() ? 1 : 0,
            isPerfFlag: $('#ckPerfFlag').val() ? 1 : 0,
            isIfName : $("#cbIfName").val()
        });

        return params;
    },


    replaceAll: function (str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    },


    selectTree: function () {
        Main.search();
    },

    /** 조회 */
    search: function () {
        Main.createGrid();
    },

    createGrid: function () {

        $rptGrid.jqxGrid('destroy');
        $('#initGrid').append('<div id="rptGrid"></div>');

        $rptGrid = $("#rptGrid");

        var listDate = [];
        var columnGroup2 = [];

        var source = {
            type: "POST",
            datatype: 'json',
            root: 'rows',
            contentType: "application/json; charset=utf-8",
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

        HmDate.getDateRange(HmDate.getDateStrNormal($("#date1")), HmDate.getDateStrNormal($("#date2")), listDate);

        for (var i = 0; i < listDate.length; i++) {
            var index = String(i);
            columnGroup2.push({text: listDate[i].substring(8, 10) + ' 일', align: 'center', name: index});
            columnGroup2.push({text: 'IN BPS', parentgroup: index, align: 'center', name: index + '_INBPS'});
            columnGroup2.push({text: 'OUT BPS', parentgroup: index, align: 'center', name: index + '_OUTBPS'});
        }

        columnGroup2.push({text: '최번시', align: 'center', name: 'LAST_BPS'});
        columnGroup2.push({text: 'IN BPS', parentgroup: 'LAST_BPS', align: 'center', name: 'LAST_INBPS'});
        columnGroup2.push({text: 'OUT BPS', parentgroup: 'LAST_BPS', align: 'center', name: 'LAST_OUTBPS'});


        var _fixedCols2 = [
            {text: '장비번호', datafield: 'mngNo', pinned: true, hidden: true},
            {text: '장비명', datafield: 'disDevName', minwidth: 150, pinned: true},
            {text: '장비IP', datafield: 'devIp', width: 120, pinned: true},
            {text: '장비종류', datafield: 'devKind2', width: 100, pinned: true},
            // {text: '제조사', datafield: 'vendor', width: 120, pinned: true, hidden: true},
            // {text: '모델', datafield: 'model', width: 120, pinned: true, hidden: true},
            {text: '회선명', datafield: 'ifName', minwidth: 140, pinned: true},
            {text: '회선IP', datafield: 'ifIp', minwidth: 140, pinned: true},
            {text: '회선별칭', datafield: 'ifAlias', minwidth: 140, pinned: true},
            {text: '회선번호', datafield: 'ifIdx', width: 80, cellsalign: 'right', hidden: true},
            {
                text: '대역폭',
                datafield: 'lineWidth',
                width: 80,
                cellsrenderer: HmGrid.unit1000renderer, pinned: true
            },
            {text: '상태', datafield: 'status', width: 80, cellsrenderer: HmGrid.ifStatusrenderer, pinned: true}
        ];

        var _dynamicCols2 = [];

        for (var j = 0; j < listDate.length; j++) {

            var index = String(j);

            var indexChar = Main.replaceAll(listDate[j], '-', '');

            _dynamicCols2.push({
                text: '평균',
                columngroup: index + '_INBPS',
                datafield: 'AVG_INBPS_' + indexChar,
                width: 80,
                cellsrenderer: Main.cellsRender
            });

            _dynamicCols2.push({
                text: '최대',
                columngroup: index + '_INBPS',
                datafield: 'MAX_INBPS_' + indexChar,
                width: 80,
                cellsrenderer: Main.cellsRender
            });

            _dynamicCols2.push({
                text: '평균',
                columngroup: index + '_OUTBPS',
                datafield: 'AVG_OUTBPS_' + indexChar,
                width: 80,
                cellsrenderer: Main.cellsRender
            });

            _dynamicCols2.push({
                text: '최대',
                columngroup: index + '_OUTBPS',
                datafield: 'MAX_OUTBPS_' + indexChar,
                width: 80,
                cellsrenderer: Main.cellsRender
            });
        }

        _dynamicCols2.push({
            text: '평균',
            columngroup: 'LAST_INBPS',
            datafield: 'AVG_INBPS',
            width: 80,
            cellsrenderer: Main.cellsRender
        });

        _dynamicCols2.push({
            text: '최대',
            columngroup: 'LAST_INBPS',
            datafield: 'MAX_INBPS',
            width: 80,
            cellsrenderer: Main.cellsRender
        });

        _dynamicCols2.push({
            text: '평균',
            columngroup: 'LAST_OUTBPS',
            datafield: 'AVG_OUTBPS',
            width: 80,
            cellsrenderer: Main.cellsRender
        });

        _dynamicCols2.push({
            text: '최대',
            columngroup: 'LAST_OUTBPS',
            datafield: 'MAX_OUTBPS',
            width: 80,
            cellsrenderer: Main.cellsRender
        });


        var adapter = new $.jqx.dataAdapter(
            source,
            {
                formatData: function (data) {
                    var params = Main.getCommParams();
                    $.extend(data, params);
                    return JSON.stringify(data);
                }
            }
        );

        HmGrid.create($rptGrid, {
            // sortmode: "many",
            source: adapter,
            // virtualmode: false,
            // rendergridrows: function (params) {
            //     return adapter.records;
            // },
            // pagesize: 1000,
            // pagerheight: 27,
            // pagerrenderer: HmGrid.pagerrenderer,
            columns: $.merge(_dynamicCols2, _fixedCols2),
            columngroups: columnGroup2
        }, CtxMenu.IF);

        HmGrid.updateBoundData($rptGrid, ctxPath + "/main/rpt/ifDetailRpt/getIfDetailRptMonth.do");

    },


    /** export Excel */
    exportExcel: function () {

        HmUtil.exportGridDaily($rptGrid, '회선상세(일)', false, $("#cbUnit").val());

    },

    /** export Html */
    exportExcelHtml: function () {

        var params = Main.getCommParams();
        HmUtil.exportExcel(ctxPath + '/main/rpt/ifDetailRpt/exportHtml.do', params);

    },

    cellsRender: function (row, column, value) {

        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += (value == null || value.length == 0) ? value : Main.convertUnit($("#cbUnit").val(), value);
        cell += '</div>';
        return cell;

    },


    convertUnit: function (unit, value) {

        var retnVal = '';
        var result = '';

        if (value > 0) {

            if (unit == 5) {
                result = Math.round((value / Math.pow(1000, 3)) * 100);
                retnVal += (result / 100) + "G";
            }
            else if (unit == 4) {
                result = Math.round((value / Math.pow(1000, 2)) * 100);
                retnVal += (result / 100) + "M";
            }
            else if (unit == 3) {
                result = Math.round((value / Math.pow(1000, 1)) * 100);
                retnVal += (result / 100) + "K";
            }
            else if (unit == 2) {
                result = Math.round(value * 100);
                retnVal += (result / 100) + "";
            } else {
                retnVal += HmUtil.convertUnit1000(value);
            }
        } else {
            retnVal += "0";
        }

        return retnVal;
    },


};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});