var $grpTree, $devGrid, $ifGrid;
var editDevIds = [], editIfIds = [];
var curDevData = null;
var hmDevGrid;

var codeMap = {
    devKindList: [],
    vendorList: [],
    vendorModelList: []
};


var Main = {

    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree'), $devGrid = $('#devGrid'), $ifGrid = $('#ifGrid');
        this.initCondition();
    },

    initCondition: function () {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
            case 'btnSearch_dev':
                this.searchDev();
                break;
            case 'btnExcel_dev':
                this.exportExcel_dev();
                break;

            case 'btnSearch_dtl':
                this.searchDtl();
                break;
            case 'btnExcel_dtl':
                this.exportExcelDtl();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchDev();
        }
    },

    /** init design */
    initDesign: function () {

        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmWindow.create($('#pwindow'), 100, 100, 999);
        HmWindow.create($('#msgbox'), 300, 200, 999);

        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}]);

        $('#dtlTab').jqxTabs({
            width: '100%', height: '100%', theme: jqxTheme,
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmGrid.create($ifGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    updaterow: function (rowid, rowdata, commit) {
                                        if (editIfIds.indexOf(rowid) == -1)
                                            editIfIds.push(rowid);
                                        commit(true);
                                    }
                                },
                                {
                                    formatData: function (data) {
                                        var rowdata = HmGrid.getRowData($devGrid);
                                        var treeItem = HmTreeGrid.getSelectedItem($grpTree);

                                        data.mngNo = rowdata == null ? -1 : rowdata.mngNo;

                                        if (treeItem != null && treeItem != undefined) {
                                            $.extend(data, {
                                                grpNo: treeItem.grpNo
                                            });
                                        }

                                        return data;
                                    },
                                    loadComplete: function (records) {
                                        editIfIds = [];
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            editable: true,
                            columns: [
                                {
                                    text: '장비번호',
                                    datafield: 'mngNo',
                                    width: 100,
                                    hidden: true,
                                    pinned: true,
                                    editable: false
                                },
                                {
                                    text: '회선번호',
                                    datafield: 'ifIdx',
                                    width: 100,
                                    hidden: true,
                                    pinned: true,
                                    editable: false
                                },
                                {text: '회선명', datafield: 'ifName', width: '16.6%', pinned: true, editable: false},
                                {text: '회선별칭', datafield: 'ifAlias', width: '16.6%', editable: false},
                                {text: '사용자회선명', datafield: 'userIfName', width: '16.6%'},
                                {text: '회선IP', datafield: 'ifIp', width: '16.6%', hidden: true},
                                {
                                    text: '유형',
                                    datafield: 'userLineWidthPoll',
                                    displayfield: 'userLineWidthPollStr',
                                    width: '16.6%',
                                    editable: false,
                                    columtype: 'dropdownlist',
                                    createeditor: function (row, value, editor) {
                                        var s = [
                                            {label: '사용대역', value: 1},
                                            {label: '원본대역', value: 0}
                                        ];
                                        editor.jqxDropDownList({source: s, autoDropDownHeight: true});
                                    }
                                },
                                {
                                    text: '대역폭',
                                    datafield: 'lineWidth',
                                    width: '16.6%',
                                    cellsrenderer: HmGrid.unit1000renderer,
                                    cellsalign: 'right',
                                    columntype: 'numberinput',
                                    createeditor: function (row, cellvalue, editor) {
                                        editor.jqxNumberInput({
                                            decimalDigits: 0,
                                            min: 0,
                                            max: 9999999999999999999,
                                            digits: 20
                                        });
                                    },
                                    validation: function (cell, value) {
                                        if (value < 0 || value > 9999999999999999999) {
                                            return {result: false, message: '20자리 이내로 수치값을 입력해주세요.'};
                                        }
                                        return true;
                                    }
                                },
                                {
                                    text: '상태',
                                    datafield: 'status',
                                    width: '16.6%',
                                    cellsrenderer: HmGrid.ifStatusrenderer,
                                    editable: false
                                }
                            ],
                        }, CtxMenu.NONE);

                        $ifGrid.on('sort', function (event) {
                            event.stopPropagation();
                            return false;
                        }).on('contextmenu', function (event) {
                            return false;
                        }).on('rowclick', function (event) {
                        }).on('rowclick', function (event) {
                            if (event.args.rightclick) {
                                $ifGrid.jqxGrid('selectrow', event.args.rowindex);

                                var rowIdxes = HmGrid.getRowIdxes($ifGrid, '회선을 선택해주세요.');

                                if (rowIdxes.length > 1) {
                                    $('#cm_ifInfoSet').css('display', 'none');
                                } else {
                                    $('#cm_ifInfoSet').css('display', 'block');
                                }
                                var scrollTop = $(window).scrollTop();
                                var scrollLeft = $(window).scrollLeft();
                                $('#ctxmenu_if').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                return false;
                            }
                        });
                        break;
                }
            }
        });

        var dynCols = [];
        Main.initDevGrid(dynCols);

        $('#ctxmenu_dev').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectDevCtxmenu(event);
            });

        $('#ctxmenu_if').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectIfCtxmenu(event);
            });

    },

    initDevGrid: function (dynCols) {

        var devAdapter = new HmDataAdapter().create(
            function (data) {
                var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                if (treeItem != null) {
                    _itemKind = treeItem.devKind2;
                    _grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                    _grpParent = treeItem.grpParent;
                }
                $.extend(data, {
                    grpType: _grpType,
                    grpNo: _grpNo,
                    grpParent: _grpParent,
                    itemKind: _itemKind
                });
                $.extend(data, HmBoxCondition.getSrchParams());
                return data;
            },
            function (records) {
                editDevIds = [];
                curDevData = null;
                $ifGrid.jqxGrid('clear');
                $('#titleIfGrid').text('선택장비 [-]');
            }
        );

        devAdapter.setDataFields([
            {name: 'parentName', type: 'string', text: '교육청', width: '14.6%',editable: false},
            {name: 'grpName', type: 'string', text: '그룹명', width: '14.6%',editable: false},
            {name: 'mngNo', type: 'number', text: '장비번호', hidden: true, editable: false},
            {name: 'devName', type: 'string', text: '장비명', width: '14.6%', editable: false},
            {name: 'devIp', type: 'string', text: '장비IP', width: '14.6%',editable: false},
            {
                name: 'devKind2', type: 'string', text: '장비종류', columntype: 'dropdownlist', width: '14.6%',editable: false,
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.devKindList, dropDownWidth: 150});
                }, filtertype: 'checkedlist'
            },
            {
                name: 'vendor', type: 'string', text: '제조사', columntype: 'dropdownlist', width: '14.6%',editable: false,
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.vendorList, dropDownWidth: 150});
                }, filtertype: 'checkedlist'
            },
            {
                name: 'model', type: 'string', text: '모델', columntype: 'dropdownlist', width: '14.6%',editable: false,
                createeditor: function (row, value, editor) {
                    editor.jqxDropDownList({source: codeMap.vendorModelList, dropDownWidth: 150});
                }, filtertype: 'checkedlist'
            }
        ].concat(dynCols));

        hmDevGrid = new HmJqxGrid('devGrid', devAdapter);

        hmDevGrid.create({
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedcell',
        }, CtxMenu.NONE);

        $devGrid.on('rowdoubleclick', function (event) {
            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
            $('#titleIfGrid').text('선택장비 [ ' + rowdata.devName + ' - ' + rowdata.devIp + ' ]');
            curDevData = rowdata;
            Main.searchIf();
        }).on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $devGrid.jqxGrid('selectrow', event.args.rowindex);
                var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
                if (rowIdxes.length > 1) {
                    $('#cm_devInfoSet, #cm_chgMgr, #cm_devOidSet, #cm_snmpTester').css('display', 'none');
                }
                else {
                    $('#cm_devInfoSet, #cm_chgMgr, #cm_devOidSet, #cm_snmpTester').css('display', 'block');
                }
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_dev').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        });
        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT_GYEONGI, Main.searchDev);
    },

    /** init data */
    initData: function () {

        Server.post('/combo/getSysoidVendorList.do', {
            success: function (result) {
                codeMap.vendorList = result;
            }
        });

        Server.post('/combo/getSysoidModelList.do', {
            success: function (result) {
                codeMap.vendorModelList = result;
            }
        });

        Server.post('/combo/getSysoidDevKindList.do', {
            success: function (result) {
                codeMap.devKindList = result;
            }
        });

    },

    searchDev: function () {
        HmGrid.updateBoundData($devGrid, ctxPath + '/gyeongischool4/env/devMgmt/getDevMgmtList.do');
    },

    /** 회선 */
    searchIf: function () {

        var rowIdx = HmGrid.getRowIdx($devGrid);
        if (rowIdx !== false) {
            curDevData = $devGrid.jqxGrid('getrowdata', rowIdx);
            $('#titleIfGrid').text('선택장비 [ ' + curDevData.devName + ' - ' + curDevData.devIp + ' ]');
        }

        HmGrid.updateBoundData($ifGrid, ctxPath + '/gyeongischool4/env/devMgmt/getIfMgmtList.do');

    },


    searchDtl: function () {
        this.searchIf();
    },

    exportExcelDtl: function () {
        this.exportExcel_if();
    },

    /** ContextMenu */
    selectDevCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_filter':
                $devGrid.jqxGrid('beginupdate');
                if ($devGrid.jqxGrid('filterable') === false) {
                    $devGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $devGrid.jqxGrid({showfilterrow: !$devGrid.jqxGrid('showfilterrow')});
                }, 300);
                $devGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $devGrid.jqxGrid('clearfilters');
                break;
                break;
        }
    },

    selectIfCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_filter':
                $ifGrid.jqxGrid('beginupdate');
                if ($ifGrid.jqxGrid('filterable') === false) {
                    $ifGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $ifGrid.jqxGrid({showfilterrow: !$ifGrid.jqxGrid('showfilterrow')});
                }, 300);
                $ifGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $ifGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $ifGrid);
                    }
                );
                break;
        }
    },

    exportExcel_dev: function () {
        HmUtil.exportGrid($devGrid, '장비정보', false);
    },

    exportExcel_if: function () {
        HmUtil.exportGrid($ifGrid, '회선정보', false);
    },

    contain: function (data) {
        var row = $devGrid.jqxGrid('getRowData', data);
        console.log(row.vendor);
        var _tmp = [];
        _tmp = vendorModelList.filter(function (item) {
            return item.value === row.vendor;
        });
        HmGrid.endCellEdit($devGrid);
        return _tmp;
    }

};


function refreshDev() {
    HmGrid.updateBoundData($devGrid);
}

function refreshIf() {
    HmGrid.updateBoundData($ifGrid);
}

function refreshGrp() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT_GYEONGI);
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});