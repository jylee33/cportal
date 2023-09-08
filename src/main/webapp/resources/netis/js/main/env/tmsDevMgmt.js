var $tms_grpTree, $devGrid, $ifGrid;
var $flow_grpTree, $searchDevGrid, $searchIfGrid, $ifFlowGrpGrid, $ifFlowGrid;
var editDevIds = [], editIfIds = [];
var editSearchDevIds = [], editSearchIfIds = [];

var curDevData = null;
var curSearchDevData = null;
var profileList = [], devKindList = [], pollGrpList = [];
var pollGrpText = '수집기명';

var Main = {
    /** variable */
    initVariable: function () {
        $tms_grpTree = $('#tms_grpTree');
        $devGrid = $('#devGrid');
        $ifGrid = $('#ifGrid');

        $flow_grpTree = $('#flow_grpTree');
        $searchDevGrid = $('#searchDevGrid');
        $searchIfGrid = $('#searchIfGrid');
        $ifFlowGrpGrid = $('#ifFlowGrpGrid ');
        $ifFlowGrid = $('#ifFlowGrid');
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
            // group
            case 'btnAdd_grp':
                this.addGrp();
                break;
            case 'btnEdit_grp':
                this.editGrp();
                break;
            case 'btnDel_grp':
                this.delGrp();
                break;
            // dev
            case 'btnAutoAdd_dev':
                this.addAuto();
                break;
            case 'btnMultiAdd_dev':
                this.addMultiDev();
                break;
            case 'btnAdd_dev':
                this.addDev();
                break;
            case 'btnDel_dev':
                this.delDev();
                break;
            case 'btnSave_dev':
                this.saveDev();
                break;
            case 'btnSearch_dev':
                this.searchDev();
                break;
            case 'btnSave_if':
                this.saveIf();
                break;
            case 'btnSearch_if':
                this.searchIf();
                break;

            case 'btnAdd_flowgrp':
                this.addFlowGrp();
                break;
            case 'btnEdit_flowgrp':
                this.editFlowGrp();
                break;
            case 'btnDel_flowgrp':
                this.delFlowGrp();
                break;

            case 'btnMove_flowcfg':
                this.moveToFlowCfg();
                break;

            case 'btnSearch_flowcfg':
                this.searchFlowCfg();
                break;
            case 'btnSave_flowcfg':
                this.saveFlowCfg();
                break;
            case 'btnDel_flowcfg':
                this.delFlowCfg();
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


        /**
         회선Flow그룹관리(기능 이전됨)[환경설정>트래픽설정>그룹설정]
         >탭 제거
         */
        /*
                $('#mainTabs').jqxTabs({
                    width: '100%', height: '100%', theme: jqxTheme,
                    initTabContent: function (tab) {
                        switch (tab) {
                            case 0:
        */


        /**/
        /**/
        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmJqxSplitter.createTree($('#tms_mainSplitter'));
        HmJqxSplitter.create($('#tms_splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');

        HmTreeGrid.create($tms_grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev, {devKind1: 'DEV'});

        HmGrid.create($devGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'mngNo', type: 'number'},
                        {name: 'grpName', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'userDevName', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'devKind2', type: 'string'},
                        {name: 'vendor', type: 'string'},
                        {name: 'model', type: 'string'},
                        {name: 'sampleRate', type: 'number'},
                        {name: 'flowKindCd', type: 'string'},
                        {name: 'disFlowKindCd', type: 'string'},
                        {name: 'tmsFlag', type: 'string'},
                        {name: 'bTmsFlag', type: 'bool'},
                        {name: 'flowColYn', type: 'string'},
                        {name: 'bFlowColYn', type: 'bool'},
                        {name: 'popupYn', type: 'string'},
                        {name: 'bPopupYn', type: 'bool'}
                    ],
                    updaterow: function (rowid, rowdata, commit) {
                        if (editDevIds.indexOf(rowid) == -1)
                            editDevIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                        var treeItem = HmTreeGrid.getSelectedItem($tms_grpTree);
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
                            isTmsFlag: $('#chkTmsDevView').is(':checked') ? 'Y' : 'N'
                        });
                        $.extend(data, HmBoxCondition.getSrchParams());
                        return data;
                    },
                    loadComplete: function (records) {
                        editDevIds = [];
                        curDevData = null;
                        $ifGrid.jqxGrid('clear');
                        $('#titleIfGrid').text('회선');
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장비');
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedrow',
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns:
                [
                    {text: '장비번호', datafield: 'mngNo', width: 150, pinned: true, hidden: true, editable: false},
                    {text: '그룹', datafield: 'grpName', width: 150, pinned: true, editable: false},
                    {text: '장비명', datafield: 'devName', minwidth: 150, pinned: true, editable: false},
                    {text: '사용자장비명', datafield: 'userDevName', width: 130, pinned: true, editable: false},
                    {text: '장비IP', datafield: 'devIp', width: 120, pinned: true, editable: false},
                    {
                        text: '장비종류',
                        datafield: 'devKind2',
                        width: 120,
                        pinned: true,
                        editable: false,
                        filtertype: 'checkedlist'
                    },
                    {text: '제조사', datafield: 'vendor', width: 120, editable: false, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', width: 120, editable: false, filtertype: 'checkedlist'},
                    {text: 'TMS 장비설정', datafield: 'bTmsFlag', width: 100, columntype: 'checkbox'},
                    {
                        text: '샘플링 비율',
                        datafield: 'sampleRate',
                        width: 100,
                        columntype: 'numberinput',
                        cellsalign: 'right',
                        initeditor: function (row, cellvalue, editor) {
                            editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 99999});
                        }
                    },
                    {
                        text: 'FLOW 종류',
                        datafield: 'flowKindCd',
                        displayfield: 'disFlowKindCd',
                        width: 100,
                        columntype: 'dropdownlist',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {
                            var s = [
                                {label: 'netflow5', value: '5'},
                                {label: 'netflow9', value: '9'},
                                {label: 'sflow', value: 'S'}
                            ];
                            editor.jqxDropDownList({
                                source: s,
                                autoDropDownHeight: true,
                                displayMember: 'label',
                                valueMember: 'value'
                            });
                        }
                    },
                    {text: 'FLOW 수집설정', datafield: 'bFlowColYn', width: 100, columntype: 'checkbox'},
                    {text: 'FLOW 알람설정', datafield: 'bPopupYn', width: 100, columntype: 'checkbox', hidden: true}
                ]
        }, CtxMenu.COMM);
        $devGrid.on('rowdoubleclick', function (event) {
            var rowIdx = event.args.rowindex;
            var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
            $('#titleIfGrid').text('회선 [ ' + rowdata.devName + ' - ' + rowdata.devIp + ' ]');
            curDevData = rowdata;
            Main.searchIf();
        });

        HmGrid.create($ifGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'mngNo', type: 'number'},
                        {name: 'ifIdx', type: 'number'},
                        {name: 'ifName', type: 'string'},
                        {name: 'ifAlias', type: 'string'},
                        {name: 'userIfName', type: 'string'},
                        {name: 'tmsUserIfName', type: 'string'},
                        {name: 'lineWidth', type: 'number'},
                        {name: 'bIfInoutCd', type: 'string'},
                        {name: 'ifInoutCd', type: 'string'},
                        {name: 'disIfInoutCd', type: 'string'}
                    ],
                    updaterow: function (rowid, rowdata, commit) {
                        if (editIfIds.indexOf(rowid) == -1)
                            editIfIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        var rowIdx = HmGrid.getRowIdx($devGrid);
                        var _mngNo = -1;
                        if (rowIdx !== false) {
                            _mngNo = $devGrid.jqxGrid('getrowdata', rowIdx).mngNo;
                        }
                        $.extend(data, {
                            mngNo: _mngNo
                        });
                        return data;
                    },
                    loadComplete: function (records) {
                        editIfIds = [];
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '회선', 'titleIfGrid');
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            editmode: 'selectedrow',
            pagerheight: 27,
            pagerrenderer: HmGrid.pagerrenderer,
            columns:
                [
                    {
                        text: '장비번호',
                        datafield: 'mngNo',
                        width: 100,
                        pinned: true,
                        editable: false,
                        hidden: true,
                        cellsalign: 'right'
                    },
                    {text: '회선번호', datafield: 'ifIdx', width: 100, pinned: true, editable: false, cellsalign: 'right'},
                    {text: '회선명', datafield: 'ifName', minwidth: 150, pinned: true, editable: false},
                    {text: '회선별칭', datafield: 'ifAlias', minwidth: 150, editable: false},
                    {text: '사용자회선명', datafield: 'userIfName', minwidth: 130, editable: false},
                    {text: 'TMS사용자회선명', datafield: 'tmsUserIfName', minwidth: 130},
                    {
                        text: 'FLOW수집설정',
                        datafield: 'ifInoutCd',
                        displayfield: 'disIfInoutCd',
                        width: 100,
                        columntype: 'dropdownlist',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {
                            var s = [
                                {label: 'NONE', value: ''},
                                {label: '수집', value: 'I'}
                                // { label: 'OUT', value: 'O' }
                            ];
                            editor.jqxDropDownList({
                                source: s,
                                autoDropDownHeight: true,
                                displayMember: 'label',
                                valueMember: 'value',
                                enableBrowserBoundsDetection: true
                            });
                        }
                    }
                    // { text : 'FLOW 수집설정', datafield : 'bIfInoutCd', width: 100, columntype: 'checkbox' }
                ]
        }, CtxMenu.COMM);
        $ifGrid.on('sort', function (event) {
            event.stopPropagation();
            return false;
        });
        /**/
        /**/


        /*
                                break;
                            case 1:
                                HmJqxSplitter.create($('#flow_mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
                                HmJqxSplitter.create($('#flow_splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 285, collapsible: false }, { size: '100%' }], 'auto', '100%', {showSplitBar: false});
                                HmJqxSplitter.create($('#flow_splitter1'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
                                HmJqxSplitter.create($('#flow_splitter2'), HmJqxSplitter.ORIENTATION_V, [{ size: 285, collapsible: false }, { size: '100%' }], 'auto', '100%', {showSplitBar: false});
                                HmTreeGrid.create($flow_grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev, { devKind1 : 'DEV' });


                                HmGrid.create($searchDevGrid, {
                                    source: new $.jqx.dataAdapter(
                                        {
                                            datatype: 'json',
                                            datafields: [
                                                {name: 'mngNo', type: 'number'},
                                                {name: 'devName', type: 'string'},
                                                {name: 'userDevName', type: 'string'},
                                                {name: 'devIp', type: 'string'},
                                                {name: 'devKind2', type: 'string'},
                                                {name: 'vendor', type: 'string'},
                                                {name: 'model', type: 'string'}
                                            ],
                                            updaterow: function(rowid, rowdata, commit) {
                                                if(editSearchDevIds.indexOf(rowid) == -1)
                                                    editSearchDevIds.push(rowid);
                                                commit(true);
                                            }
                                        },
                                        {
                                            formatData: function(data) {
                                                var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                                                var treeItem = HmTreeGrid.getSelectedItem($flow_grpTree);
                                                if(treeItem != null) {
                                                    _itemKind = treeItem.devKind2;
                                                    _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                                                    _grpParent = treeItem.grpParent;
                                                }
                                                $.extend(data, {
                                                    grpType: _grpType,
                                                    grpNo: _grpNo,
                                                    grpParent: _grpParent,
                                                    itemKind: _itemKind,
                                                    // sIp: $('#sIp').val(),
                                                    // sDevName: $('#sDevName').val(),
                                                    // isTmsFlag: $('#chkTmsDevView').is(':checked')? 'Y' : 'N'
                                                });
                                                return data;
                                            },
                                            loadComplete: function(records) {
                                                // editDevIds = [];
                                                // curDevData = null;
                                                // $ifGrid.jqxGrid('clear');
                                                // $('#titleIfGrid').text('회선');
                                            }
                                        }
                                    ),
                                    // showtoolbar: true,
                                    // rendertoolbar: function(toolbar) {
                                    //     HmGrid.titlerenderer(toolbar, '장비');
                                    // },
                                    selectionmode: 'multiplerowsextended',
                                    editable: true,
                                    editmode: 'selectedrow',
                                    columns:
                                        [
                                            { text : '장비번호', datafield : 'mngNo', width : 150, pinned: true, hidden: true, editable: false },
                                            { text : '장비명', datafield : 'devName', minwidth : 150, pinned: true, editable: false },
                                            { text : '사용자장비명', datafield : 'userDevName', width : 130, pinned: true, editable: false },
                                            { text : '장비IP', datafield : 'devIp', width: 120, pinned: true, editable: false },
                                            { text : '장비종류', datafield : 'devKind2', width : 120, pinned: true, editable: false, filtertype: 'checkedlist' },
                                            { text : '제조사', datafield : 'vendor', width : 120, editable: false, filtertype: 'checkedlist' },
                                            { text : '모델', datafield : 'model', width : 120, editable: false, filtertype: 'checkedlist' }
                                        ]
                                }, CtxMenu.COMM);
                                $searchDevGrid.on('rowdoubleclick', function(event) {
                                    var rowIdx = event.args.rowindex;
                                    var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
                                    // $('#titleSearchIfGrid').text('회선 [ ' + rowdata.devName + ' - ' + rowdata.devIp + ' ]');
                                    curSearchDevData = rowdata;
                                    Main.searchIf();
                                });

                                HmGrid.create($searchIfGrid, {
                                    source: new $.jqx.dataAdapter(
                                        {
                                            datatype: 'json',
                                            datafields: [
                                                {name: 'mngNo', type: 'number'},
                                                {name: 'devName', type: 'string'},
                                                {name: 'devIp', type: 'string'},
                                                {name: 'ifIdx', type: 'number'},
                                                {name: 'ifName', type: 'string'},
                                                {name: 'ifAlias', type: 'string'},
                                                {name: 'userIfName', type: 'string'},
                                                {name: 'tmsUserIfName', type: 'string'},
                                                {name: 'lineWidth', type: 'number'}
                                            ],
                                            updaterow: function(rowid, rowdata, commit) {
                                                if(editSearchIfIds.indexOf(rowid) == -1)
                                                    editSearchIfIds.push(rowid);
                                                commit(true);
                                            }
                                        },
                                        {
                                            formatData: function(data) {
                                                var rowIdx = HmGrid.getRowIdx($searchDevGrid);
                                                var _mngNo = -1;
                                                if(rowIdx !== false) {
                                                    _mngNo = $searchDevGrid.jqxGrid('getrowdata', rowIdx).mngNo;
                                                }
                                                $.extend(data, {
                                                    mngNo: _mngNo
                                                });
                                                return data;
                                            },
                                            loadComplete: function(records) {
                                                editSearchIfIds = [];
                                            }
                                        }
                                    ),
                                    selectionmode: 'multiplerowsextended',
                                    editable: false,
                                    editmode: 'selectedrow',
                                    columns:
                                        [
                                            { text : '장비번호', datafield : 'mngNo', width : 100, pinned: true, editable: false, hidden: true, cellsalign: 'right' },
                                            { text : '장비명', datafield : 'devName', minwidth : 150, editable: false, hidden: true },
                                            { text : '장비IP', datafield : 'devIp', minwidth : 150, editable: false, hidden: true },
                                            { text : '회선번호', datafield : 'ifIdx', width : 100, pinned: true, editable: false, cellsalign: 'right' },
                                            { text : '회선명', datafield : 'ifName', minwidth : 150, pinned: true, editable: false },
                                            { text : '회선별칭', datafield : 'ifAlias', minwidth : 150, editable: false, hidden:true },
                                            // { text : '사용자회선명', datafield : 'userIfName', minwidth: 130, editable: false },
                                            { text : 'TMS사용자회선명', datafield : 'tmsUserIfName', minwidth: 130 }
                                        ]
                                }, CtxMenu.COMM);
                                $searchIfGrid.on('sort', function(event) {
                                    event.stopPropagation();
                                    return false;
                                });


                                var adapter = new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/grp/getDefaultGrpTreeList.do' });
                                $ifFlowGrpGrid.jqxTreeGrid({
                                    source : new $.jqx.dataAdapter(
                                        {
                                            datatype: 'json',
                                            root: 'resultData',
                                            url: ctxPath + '/grp/getFlowIfGrpList.do',
                                            hierarchy: {
                                                keyDataField: { name: 'grpNo' },
                                                parentDataField: { name: 'grpParent' }
                                            },
                                            id: 'grpNo'
                                        }
                                    ),
                                    width : '100%',
                                    height : '99.8%',
                                    theme : jqxTheme,
                                    editable: false,
                                    pageable : false,
                                    icons : function(rowKey, rowData) {
                                        try {
                                            if (rowData['devKind2'] === undefined) {
                                                return ctxPath + '/img/tree/p_tree.png';
                                            }
                                            switch (rowData.devKind2) {
                                                case 'GROUP':
                                                    return ctxPath + '/img/tree/p_tree.png';
                                                default:
                                                    return ctxPath + '/img/historyIcon.gif';
                                            }
                                        } catch (e) {
                                            return ctxPath + '/img/tree/p_tree.png';
                                        }
                                    },
                                    ready : function() {
                                        var uid = null;
                                        var rows = $ifFlowGrpGrid.jqxTreeGrid('getRows');
                                        if (rows != null && rows.length > 0) {
                                            uid = $ifFlowGrpGrid.jqxTreeGrid('getKey', rows[0]);
                                        }
                                        if (uid != null) {
                                            $ifFlowGrpGrid.jqxTreeGrid('expandRow', uid);
                                            $ifFlowGrpGrid.jqxTreeGrid('selectRow', uid);
                                        }
                                    },
                                    columns:
                                        [
                                            { text: '그룹', datafield: 'grpName' }
                                            // { text: '권한그룹', datafield: 'grpRefString', width: 130 }
                                        ]
                                }).on('rowSelect', function(event) {
                                    Main.searchFlowCfg();
                                });

                                HmGrid.create($ifFlowGrid,
                                    {
                                        source : new $.jqx.dataAdapter(
                                            {
                                                datatype : 'json'
                                            },
                                            {
                                                formatData : function(data) {
                                                    var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
                                                    var _grpNo = 0;
                                                    if(treeItem !== null) {
                                                        _grpNo = treeItem.grpNo;
                                                    }
                                                    $.extend(data, {
                                                        grpNo: _grpNo
                                                    });
                                                    return data;
                                                }
                                            }
                                        ),
                                        editable: true,
                                        editmode: 'selectedrow',
                                        selectionmode: 'multiplerowsextended',
                                        columns :
                                            [
                                                { text : '장비명', datafield : 'devName', width: 250, editable: false },
                                                { text : '장비IP', datafield : 'devIp', width : 150, editable: false },
                                                { text : '회선명', datafield : 'ifName', editable: false },
                                                { text : '회선별칭', datafield : 'ifAlias', width : 250, editable: false },
                                                { text : 'TMS사용자회선명', datafield : 'tmsUserIfName', width : 250, editable: false },
                                                { text : '대역폭', datafield : 'lineWidth', width : 150, editable: false, cellsrenderer : HmGrid.unit1000renderer }
                                                // { text : 'IN/OUT', datafield : 'ifInout', displayfield: 'ifInoutStr', width : 150, columntype: 'dropdownlist',
                                                //     createeditor: function(row, value, editor) {
                                                //         editor.jqxDropDownList({ source: [{ label: 'IN', value: 'I' }, { label: 'OUT', value: 'O' }], autoDropDownHeight: true });
                                                //     }
                                                // }
                                            ]
                                    });

                                break;
                        }
                    }
                });
        */

        // HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev, { devKind1 : 'DEV' });
        // $('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
        // $('#splitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', theme: jqxTheme, panels: [{ size: '50%', collapsible: false }, { size: '50%' }] });

    },

    /** init data */
    initData: function () {

    },

    /** 그룹관리 */
    addGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($tms_grpTree);
        var _grpParent = 1;
        if (treeItem.devKind2 == 'GROUP') _grpParent = treeItem.grpNo;
        else _grpParent = treeItem.grpParent;

        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    editGrp: function () {
        var grpSelection = $tms_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.devKind2 != 'GROUP') {
            alert('장비는 수정할 수 없습니다.');
            return;
        }
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        var _params = {
            grpNo: treeItem.grpNo,
            grpName: treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')),
            grpParent: treeItem.grpParent,
            grpCode: treeItem.grpCode
        };
        $.post(ctxPath + '/main/popup/env/pGrpEdit.do', _params,
            function (result) {
                HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 500, 'pwindow_init', _params);
            }
        );
    },

    delGrp: function () {
        var grpSelection = $tms_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.devKind2 != 'GROUP') {
            alert('장비는 삭제할 수 없습니다.');
            return;
        }
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')) + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delDefaultGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $tms_grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $tms_grpTree.jqxTreeGrid('selectRow', $tms_grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev: function () {
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsDevMgmtList.do');
    },

    saveDev: function () {

        HmGrid.endRowEdit($devGrid);

        if (editDevIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];
        $.each(editDevIds, function (idx, value) {
            var tmp = $devGrid.jqxGrid('getrowdatabyid', value);
            tmp.tmsFlag = tmp.bTmsFlag ? 'Y' : 'N';
            tmp.flowColYn = tmp.bFlowColYn ? 'Y' : 'N';
            tmp.popupYn = tmp.bPopupYn ? 'Y' : 'N';
            _list.push(tmp);
        });

        Server.post('/main/env/tmsDevMgmt/saveTmsDevMgmt.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editDevIds.length = 0;
            }
        });
    },

    /** 회선 */
    searchIf: function () {
        HmGrid.updateBoundData($ifGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsIfMgmtList.do');
    },

    saveIf: function () {
        HmGrid.endRowEdit($ifGrid);
        if (editIfIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editIfIds, function (idx, value) {
            // _list.push($ifGrid.jqxGrid('getrowdatabyid', value));
            var tmp = $ifGrid.jqxGrid('getrowdatabyid', value);
            _list.push(tmp);
        });

        Server.post('/main/env/tmsDevMgmt/saveTmsIfMgmt.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editIfIds.length = 0;
            }
        });
    },

    addFlowGrp: function () {
        $.get(ctxPath + '/main/popup/env/pFlowIfGrpAdd.do',
            function (result) {
                HmWindow.open($('#pwindow'), '회선 Flow 그룹 등록', result, 400, 459);
            }
        );
    },
    editFlowGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if (treeItem === null) {
            alert('회선 Flow 그룹을 선택해주세요.');
            return;
        }
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }

        $.get(ctxPath + '/main/popup/env/pFlowIfGrpEdit.do',
            {grpNo: treeItem.grpNo, grpParent: treeItem.grpParent, grpRef: treeItem.grpRef, grpName: treeItem.grpName},
            function (result) {
                HmWindow.open($('#pwindow'), '회선 Flow 그룹 수정', result, 400, 459);
            }
        );
    },
    delFlowGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if (treeItem === null) {
            alert('회선 Flow 그룹을 선택해주세요.');
            return;
        }

        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delFlowIfGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $ifFlowGrpGrid.jqxTreeGrid('deleteRow', treeItem.uid);
                alert('삭제되었습니다.');
            }
        });
    },
    moveToFlowCfg: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if (treeItem === null) {
            alert('망그룹을 선택해주세요.');
            return;
        }
        var rowIdxes = HmGrid.getRowIdxes($searchIfGrid, '회선을 선택해주세요.');
        if (rowIdxes === false) return;
        var list = [], newIds = [];
        for (var i = 0; i < rowIdxes.length; i++) {
            var tmp = $searchIfGrid.jqxGrid('getrowdata', rowIdxes[i]);
            var newId = tmp.mngNo + '_' + tmp.ifIdx;
            list.push({
                devName: tmp.devName, devIp: tmp.devIp, ifName: tmp.ifName, ifAlias: tmp.ifAlias, ifIdx: tmp.ifIdx,
                lineWidth: tmp.lineWidth, ifInout: 'I', mngNo: tmp.mngNo, grpNo: treeItem.grpNo, netNo: -1
            });
        }
        $ifFlowGrid.jqxGrid('addrow', null, list);
    },
    searchFlowCfg: function () {
        HmGrid.updateBoundData($ifFlowGrid, ctxPath + '/main/env/tmsDevMgmt/getIfFlowCfgList.do');
    },

    saveFlowCfg: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if (treeItem === false) {
            alert('망그룹을 선택해주세요.');
            return;
        }
        var _grpNo = treeItem.grpNo;
        var _list = $ifFlowGrid.jqxGrid('getboundrows');
        Server.post('/main/env/tmsDevMgmt/saveIfFlowCfg.do', {
            data: {grpNo: _grpNo, list: _list},
            success: function (result) {
                HmGrid.updateBoundData($ifFlowGrid);
                alert('저장되었습니다.');
            }
        });
    },

    delFlowCfg: function () {
        var rowIdxes = HmGrid.getRowIdxes($ifFlowGrid);
        if (rowIdxes === false) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
        var _netNos = [], _uids = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $ifFlowGrid.jqxGrid('getrowdata', value);
            // 로컬메모리에서 추가된 경우 삭제하고 리턴
            if (rowdata.netNo == -1) {
                $ifFlowGrid.jqxGrid('deleterow', rowdata.uid);
            }
            else {
                _netNos.push(rowdata.netNo);
                _uids.push(rowdata.uid);
            }
        });

        if (_netNos.length > 0) {
            Server.post('/main/env/tmsDevMgmt/delIfFlowCfg.do', {
                data: {netNos: _netNos},
                success: function (result) {
                    $ifFlowGrid.jqxGrid('deleterow', _uids);
                    alert('삭제되었습니다.');
                }
            });
        }
    }


};

function addGrpResult(addData, type) {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}

function editGrpResult(addData, type) {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}


function addDevResult() {
    HmGrid.updateBoundData($devGrid);
}

function refreshDev() {
    HmGrid.updateBoundData($devGrid);
}

function refreshIf() {
    HmGrid.updateBoundData($ifGrid);
}

function refreshGrp() {
    HmTreeGrid.updateData($tms_grpTree, HmTree.T_GRP_DEFAULT2, {devKind1: 'DEV'});
}

function refreshIfFlowGrp() {
    HmTreeGrid.updateData($ifFlowGrpGrid, HmTree.T_GRP_FLOW_IF, {devKind1: 'DEV'});
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});