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
    initVariable: function() {

        $ip_grpTree = $('#ip_grpTree'), $ip_subnetGrid = $('#ip_subnetGrid');
        $devGrid = $('#devGrid'), $recvDevGrid = $('#recvDevGrid'), $grpTree = $('#grpTree'), currRecvGrpNo = 1;
        $sort_grpTree = $('#sort_grpTree'), $sort_grpGrid = $('#sort_grpGrid');
        $if_grpTree = $('#if_grpTree'), $if_devGrid = $('#if_devGrid'), $if_ifGrid = $('#if_ifGrid');
        $if_ifGrpTree = $('#if_ifGrpTree'), $if_confGrid = $('#if_confGrid');
        $dev_grpTree = $('#dev_grpTree'), $dev_devGrid = $('#dev_devGrid'), $dev_sGrpTree = $('#dev_sGrpTree'), $dev_confGrid = $('#dev_confGrid');

        $tms_grpTree = $('#tms_grpTree');
        $devGrid = $('#devGrid');
        $ifGrid = $('#ifGrid');

        $flow_grpTree = $('#flow_grpTree');
        $searchDevGrid = $('#searchDevGrid');
        $searchIfGrid = $('#searchIfGrid');
        $ifFlowGrpGrid = $('#ifFlowGrpGrid');
        $ifFlowGrid = $('#ifFlowGrid');
        this.initCondition();
    },

    initCondition: function() {
        // search condition
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
            // IP group
            case 'btnAdd_ipGrpGate':
                this.addIpGrpGate();
                break;
            case 'btnAdd_ipGrp':
                this.addIpGrp();
                break;
            case 'btnEdit_ipGrp':
                this.editIpGrp();
                break;
            case 'btnDel_ipGrp':
                this.delIpGrp();
                break;
            case 'btnSort_sortIpTree':
                this.sortTree();
                break;

            // Subnet
            case 'btnMAdd_subnet':
                this.addMultiSubnet();
                break;
            case 'btnAdd_subnet':
                this.addSubnet();
                break;
            case 'btnDel_subnet':
                this.delSubnet();
                break;
            case 'btnSave_subnet':
                this.saveSubnet();
                break;
            case 'btnSave_ipSort':
                this.saveIpGrpSort();
                break;


            // Flow group
            case 'btnAdd_flowgrp': this.addFlowGrp(); break;
            case 'btnEdit_flowgrp': this.editFlowGrp(); break;
            case 'btnDel_flowgrp': this.delFlowGrp(); break;

            case 'btnMove_flowcfg': this.moveToFlowCfg(); break;

            case 'btnSearch_flowcfg': this.searchFlowCfg(); break;
            case 'btnSave_flowcfg': this.saveFlowCfg(); break;
            case 'btnDel_flowcfg': this.delFlowCfg(); break;
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

        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:

                        HmJqxSplitter.create($('#ip_mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 340,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%' );


                        $('#ip_tab').jqxTabs({
                            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
                            initTabContent: function (tab) {
                                switch (tab) {

                                    case 0:

                                        HmGrid.create($ip_subnetGrid, {
                                            source: new $.jqx.dataAdapter(
                                                {
                                                    datatype: 'json',
                                                    url: ctxPath + '/main/env/grpMgmt/getIpConfSubnetList.do',
                                                    updaterow: function (rowid, rowdata, commit) {
                                                        if (editSubnetIds.indexOf(rowid) == -1)
                                                            editSubnetIds.push(rowid);
                                                        commit(true);
                                                    },
                                                    addrow: function (rowid, rowdata, commit) {
                                                        rowdata.grpNo = $ip_grpTree.jqxTreeGrid('getSelection')[0].grpNo;
                                                        Server.post('/main/env/grpMgmt/addSubnet.do', {
                                                            data: rowdata,
                                                            success: function () {
                                                                HmGrid.updateBoundData($ip_subnetGrid);
                                                            }
                                                        });
                                                        commit(true);
                                                    }
                                                },
                                                {
                                                    formatData: function (data) {
                                                        var _grpNo = 0;
                                                        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
                                                        if (!$.isEmpty(grpSelection) && grpSelection.length > 0) {
                                                            _grpNo = grpSelection[0].grpNo;
                                                        }
                                                        $.extend(data, {
                                                            grpNo: _grpNo
                                                        });
                                                        return data;
                                                    },
                                                    loadComplete: function (records) {
                                                        editSubnetIds = [];
                                                    }
                                                }
                                            ),
                                            // showtoolbar: true,
                                            // rendertoolbar: function(toolbar) {
                                            // 	HmGrid.titlerenderer(toolbar, '서브넷');
                                            // },
                                            editable: true,
                                            selectionmode: 'multiplerowsextended',
                                            editmode: 'selectedcell',
                                            pageable: false,
                                            columns:
                                                [
                                                    {
                                                        text: '기본그룹명',
                                                        datafield: 'grpName',
                                                        minwidth: 140,
                                                        editable: false
                                                    },
                                                    {text : '서브넷번호', datafield : 'subNo', width: 100 , hidden : true },
                                                    {text: '이름', datafield: 'subName', minwidth: 140},
                                                    {text: 'IP', datafield: 'ip', width: '20%'},
                                                    {
                                                        text: 'Bit Mask',
                                                        datafield: 'subMaskNo',
                                                        width: '20%',
                                                        cellsalign: 'right',
                                                        columntype: 'numberinput',
                                                        initeditor: function (row, cellvalue, editor) {
                                                            editor.jqxNumberInput({decimalDigits: 0, min: 0, max: 32});
                                                        },
                                                        validation: function (cell, value) {
                                                            if (value < 0 || value > 32) {
                                                                return {result: false, message: '0~32사이의 수치값을 입력해주세요.'};
                                                            }
                                                            return true;
                                                        }
                                                    },
                                                    { text : 'useYn', datafield : 'useYn', width: 100 , hidden : true },
                                                    { text : 'TMS 사용 여부', datafield : 'bUseYn', width: 150, columntype: 'checkbox' ,
                                                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                                                            if(newvalue==true){
                                                                $ip_subnetGrid.jqxGrid('setcellvalue', row , "useYn", "Y");
                                                            }else{
                                                                $ip_subnetGrid.jqxGrid('setcellvalue', row , "useYn", "N");
                                                            }
                                                        }
                                                    },
                                                ]
                                        }, CtxMenu.NONE);
                                        // CtxMenu 동작
                                        $('#ctxmenu_ip').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
                                            .on('itemclick', function (event) {
                                                Main.selectIpCtxmenu(event);
                                            });
                                        // CtxMenu 설정
                                        $ip_subnetGrid.on('contextmenu', function (event) {
                                            return false;
                                            }).on('rowclick', function (event) {
                                                if (event.args.rightclick) {
                                                    $ip_subnetGrid.jqxGrid('selectrow', event.args.rowindex);
                                                    var rowIdxes = HmGrid.getRowIdxes($ip_subnetGrid, '서브넷을 선택해주세요.');
    /*
                                                    // 2개 이상일때(지금은 쓰이지 않는중)
                                                    if (rowIdxes.length > 1) {
                                                        // $('#cm_ifInfoSet').css('display', 'none');
                                                    }
                                                    else {
                                                        // $('#cm_ifInfoSet').css('display', 'block');
                                                    }
    */
                                                    var scrollTop = $(window).scrollTop();
                                                    var scrollLeft = $(window).scrollLeft();
                                                    $('#ctxmenu_ip').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                                                        parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                                                    return false;
                                                }
                                            });
                                        break;
                                    case 1:
                                        HmGrid.create($('#ip_sortGrid'), {
                                            source: new $.jqx.dataAdapter({
                                                    datatype: 'json',
                                                    updaterow: function (rowid, rowdata, commit) {
                                                        if (editIpGrpSortIds.indexOf(rowid) == -1)
                                                            editIpGrpSortIds.push(rowid);
                                                        commit(true);
                                                    }
                                                }
                                            ),
                                            editable: true,
                                            columns: [
                                                {text: '그룹', datafield: 'grpName', editable: false, width: 300},
                                                {
                                                    text: '순서',
                                                    datafield: 'sortIdx',
                                                    cellsalign: 'right',
                                                    columntype: 'numberinput',
                                                    width: 100
                                                }
                                            ],
                                            ready: Main.searchSubnet
                                        }, CtxMenu.NONE);
                                        $('#ip_sortGrid').on('bindingcomplete', function () {
                                            editIpGrpSortIds = [];
                                            $(this).jqxGrid('sortby', 'sortIdx', 'asc');
                                        })
                                            .on('cellendedit', function (event) {
                                                if (event.args.oldvalue != event.args.value) {
                                                    var rowdata = event.args.row;
                                                    var $grid = $(this);
                                                    var rows = $grid.jqxGrid('getboundrows');
                                                    // 변경된 대상과 동일한 sortIdx 가 있는지 체크
                                                    var tmp = rows.filter(function (d) {
                                                        return d.sortIdx == event.args.value;
                                                    });
                                                    if (tmp.length == 0) return;

                                                    // 변경대상의 sortIdx와 동일하거나 큰순서를 가진 데이틔 sortIdx값을 1씩 증가시킨다.
                                                    $grid.jqxGrid('beginupdate');
                                                    $.each(rows, function (idx, value) {
                                                        if (value.grpNo == rowdata.grpNo) return; // 변경대상
                                                        if (value.sortIdx >= event.args.value) { // sortIdx가 변경대상과 같거나 큰경우
                                                            $grid.jqxGrid('setcellvaluebyid', value.uid, 'sortIdx', value.sortIdx + 1);
                                                        }
                                                    });
                                                    $grid.jqxGrid('endupdate');
                                                }
                                            });
                                        break;
                                }
                            }
                        });


                        HmTreeGrid.create($ip_grpTree, HmTree.T_GRP_IP, Main.searchSubnet, null, ['grpName']);

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

        // HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchDev, { devKind1 : 'DEV' });
        // $('#mainSplitter').jqxSplitter({ width: '99.8%', height: '99.8%', orientation: 'vertical', theme: jqxTheme, panels: [{ size: 254, collapsible: true }, { size: '100%' }] });
        // $('#splitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', theme: jqxTheme, panels: [{ size: '50%', collapsible: false }, { size: '50%' }] });

    },

    /** init data */
    initData: function() {

    },

    /** IP그룹 */
    addIpGrpGate: function () {
        $.get(ctxPath + '/main/popup/env/pIpGrpGateAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '분류그룹 등록', result, 300, 142, 'pwindow_init');
        });
    },

    /** IP그룹 */
    addIpGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ip_grpTree);
        $.get(ctxPath + '/main/popup/env/pIpGrpAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    /** IP그룹 */
    editIpGrp: function () {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
/*
        if (treeItem.level == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
*/
        var _params = {
            grpNo: treeItem.grpNo,
            grpName: treeItem.grpName,
            grpParent: treeItem.grpParent,
            grpCode: treeItem.grpCode,
            grpRef: treeItem.grpRef
        };
        $.post(ctxPath + '/main/popup/env/pIpGrpEdit.do', _params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹 수정', result, 400, 500, 'pwindow_init', _params);
            }
        );
    },

    /** IP그룹 */
    delIpGrp: function () {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('IP그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0/* && treeItem.grpParent == 0*/) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delIpGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $ip_grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $ip_grpTree.jqxTreeGrid('selectRow', $ip_grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    /** IP그룹 */
    sortTree: function () {
        switch ($('#mainTabs').val()) {
            case 0:
                var treeItem = HmTreeGrid.getSelectedItem($ip_grpTree);
                treeItem.searchType = HmTree.T_GRP_IP;
                treeItem.saveUrl = '/grp/saveIpGrpSortIdx.do';
                treeItem.sortType = 'T_GRP_IP';
                treeItem.mainTreeName = "ip_grpTree";
                break;
            // case 1:
            //     var treeItem = HmTreeGrid.getSelectedItem($if_ifGrpTree);
            //     treeItem.searchType = HmTree.T_GRP_IF;
            //     treeItem.saveUrl = '/grp/saveGrpSortIdx.do';
            //     treeItem.sortType = 'T_GRP_IF';
            //     break;
        }
        $.get(ctxPath + '/main/popup/env/pSortTree.do', function (result) {
            HmWindow.open($('#pwindow'), '그룹정렬순서 설정', result, 600, 482, 'pwindow_init', treeItem);
        });
    },

    /** 서브넷 다중추가 */
    addMultiSubnet: function () {
        var params = {
            grpNo: $ip_grpTree.jqxTreeGrid('getSelection')[0].uid
        };
        HmUtil.createPopup('/main/popup/env/pSubnetAddMulti.do', $('#hForm'), 'pMultiAdd', 900, 700, params);
    },

    addSubnet: function () {
        $.get(ctxPath + '/main/popup/env/pSubnetAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '서브넷 등록', result, 300, 205);
        });
    },

    delSubnet: function () {
        var rowIdxes = HmGrid.getRowIdxes($ip_subnetGrid, '데이터를 선택해주세요.');
        if (rowIdxes === false) return;

        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;


        var _list = [];

        $.each(rowIdxes, function (idx, value) {
            _list.push({
                subNo: $ip_subnetGrid.jqxGrid('getrowdata', value).subNo
            });
        });

        Server.post('/main/env/grpMgmt/delSubnet.do', {
            data: {list: _list},
            success: function (result) {
                $.each(rowIdxes, function (idx, value) {
                    $ip_subnetGrid.jqxGrid('updatebounddata');
                });
                alert('삭제되었습니다.');
            }
        });

    },

    saveSubnet: function () {
        HmGrid.endRowEdit($ip_subnetGrid);
        if (editSubnetIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSubnetIds, function (idx, value) {
            _list.push($ip_subnetGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/grpMgmt/saveSubnet.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editSubnetIds = [];
            }
        });
    },

    searchSubnet: function () {
        HmGrid.updateBoundData($ip_subnetGrid, ctxPath + '/main/env/grpMgmt/getIpConfSubnetList.do');
        if ($('#ip_tab').val() == 0) {
            var row = HmTreeGrid.getSelectedItem($ip_grpTree);
/*
            if (row != null) {
                HmGrid.setLocalData($('#ip_sortGrid'), row.records);
            }
*/
        }
    },




    /** 회선 Flow 그룹관리 장비 조회 */
    searchDev: function() {
        switch($('#mainTabs').val()) {
            case 0:
                HmGrid.updateBoundData($devGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsDevMgmtList.do');
                break;
            case 1:
                HmGrid.updateBoundData($searchDevGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsDevMgmtList.do');
                break;
        }
    },
    /** 회선 Flow 그룹관리 회선 조회 */
    searchIf: function() {
        switch($('#mainTabs').val()) {
            case 0:
                var rowIdx = HmGrid.getRowIdx($devGrid);
                if (rowIdx !== false) {
                    curDevData = $devGrid.jqxGrid('getrowdata', rowIdx);
                    $('#titleIfGrid').text('회선 [ ' + curDevData.devName + ' - ' + curDevData.devIp + ' ]');
                }
                HmGrid.updateBoundData($ifGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsIfMgmtList.do');
                break;
            case 1:
                var rowIdx = HmGrid.getRowIdx($searchDevGrid);
                if (rowIdx !== false) {
                    curSearchDevData = $searchDevGrid.jqxGrid('getrowdata', rowIdx);
                    // $('#titleSearchIfGrid').text('회선 [ ' + curSearchDevData.devName + ' - ' + curSearchDevData.devIp + ' ]');
                }
                HmGrid.updateBoundData($searchIfGrid, ctxPath + '/main/env/tmsDevMgmt/getTmsIfMgmtList.do');
                break;
        }
    },

    addFlowGrp: function(){
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        $.get(ctxPath + '/main/popup/env/pFlowIfGrpAdd.do',
            function(result) {
                HmWindow.open($('#pwindow'), '회선 Flow 그룹 등록', result, 400, 459, 'pwindow_init', treeItem);
            }
        );
    },

    editFlowGrp: function(){
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if(treeItem === null) {
            alert('회선 Flow 그룹을 선택해주세요.');
            return;
        }
/*
        if(treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
*/

        $.get(ctxPath + '/main/popup/env/pFlowIfGrpEdit.do',
            { grpNo: treeItem.grpNo, grpParent: treeItem.grpParent, grpRef: treeItem.grpRef, grpName: treeItem.grpName },
            function(result) {
                HmWindow.open($('#pwindow'), '회선 Flow 그룹 수정', result, 400, 459);
            }
        );
    },

    delFlowGrp: function(){

        var grpSelection = $ifFlowGrpGrid.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('회선 Flow 그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0/* && treeItem.grpParent == 0*/) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }

        if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delFlowIfGrp.do', {
            data: { grpNo: treeItem.grpNo },
            success: function(result) {
                $ifFlowGrpGrid.jqxTreeGrid('deleteRow', treeItem.uid);
                alert('삭제되었습니다.');
            }
        });
    },

    moveToFlowCfg : function() {
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if(treeItem === null) {
            alert('망그룹을 선택해주세요.');
            return;
        }
        var rowIdxes = HmGrid.getRowIdxes($searchIfGrid, '회선을 선택해주세요.');
        if(rowIdxes === false) return;

        var devIdx = HmGrid.getRowIdx($searchDevGrid);
        var devItem = HmGrid.getRowData($searchDevGrid, devIdx);

        var list = [];
        for(var i = 0; i < rowIdxes.length; i++) {
            var tmp = $searchIfGrid.jqxGrid('getrowdata', rowIdxes[i]);
            list.push({ devName: devItem.userDevName, devIp: devItem.devIp, ifName: tmp.ifName, ifAlias: tmp.ifAlias, ifIdx: tmp.ifIdx,
                lineWidth: tmp.lineWidth, ifInout: 'I', mngNo: tmp.mngNo, grpNo: treeItem.grpNo, netNo: -1 });
        }
        if(!Main.checkDuplicateIf(list)) {
            alert('이미 선택된 회선이 존재합니다.');
            return;
        }
        $ifFlowGrid.jqxGrid('addrow', null, list);
    },

    checkDuplicateIf: function (selected) {
        var rows = $ifFlowGrid.jqxGrid('getrows')

        for(var i = 0; i < rows.length; i++) {
            for(var j = 0; j < selected.length; j++) {
                if(rows[i].ifIdx == selected[j].ifIdx && rows[i].mngNo == selected[j].mngNo) {
                    return false;
                }
            }
        }
        return true;
    },

    searchFlowCfg: function(){
        HmGrid.updateBoundData($ifFlowGrid, ctxPath + '/main/env/tmsDevMgmt/getIfFlowCfgList.do');
    },

    saveFlowCfg: function(){
        var treeItem = HmTreeGrid.getSelectedItem($ifFlowGrpGrid);
        if(treeItem === false) {
            alert('망그룹을 선택해주세요.');
            return;
        }
        var _grpNo = treeItem.grpNo;
        var _list = $ifFlowGrid.jqxGrid('getboundrows');
        Server.post('/main/env/tmsDevMgmt/saveIfFlowCfg.do', {
            data: { grpNo: _grpNo, list: _list },
            success: function(result) {
                HmGrid.updateBoundData($ifFlowGrid);
                alert('저장되었습니다.');
            }
        });
    },

    delFlowCfg: function(){
        var rowIdxes = HmGrid.getRowIdxes($ifFlowGrid);
        if(rowIdxes === false) {
            alert('선택된 데이터가 없습니다.');
            return;
        }

        if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;

        var _cfgNos = [], _uids = [], _locals = [];
        $.each(rowIdxes, function(idx, value) {
            var rowdata = $ifFlowGrid.jqxGrid('getrowdata', value);
            // 로컬메모리에서 추가된 경우 삭제하고 리턴
            if(rowdata.netNo == -1) {
                _locals.push(rowdata.uid);
            }
            else {
                _cfgNos.push({ cfgNo: rowdata.cfgNo });
                _uids.push(rowdata.uid);
            }
        });

        // 로컬데이터 삭제
        $ifFlowGrid.jqxGrid('deleterow', _locals);

        // DB데이터 삭제
        if(_cfgNos.length > 0) {
            Server.post('/main/env/tmsDevMgmt/delIfFlowCfg.do', {
                data : { cfgNos : _cfgNos },
                success : function(result) {
                    $ifFlowGrid.jqxGrid('deleterow', _uids);
                    alert('삭제되었습니다.');
                }
            });
        }
    },

    /** 그룹설정 */
    refreshAllTree: function (retVal) {
        refreshGrp();
    },

    selectIpCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_grpMoveBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($ip_subnetGrid, '서브넷을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _subNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _subNos.push($ip_subnetGrid.jqxGrid('getrowdata', value).subNo);
                    });
                    var params = {
                        subNos: _subNos.join(',')
                    };
                    HmWindow.create($('#pwindow'), 500, 500, 999);
                    $.post(ctxPath + '/main/popup/env/pIpGrpBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), 'IP 그룹이동', result, 400, 376);
                        }
                    );
                } catch (e) {
                }
                break;
            //도구
            case 'cm_filter':
                $ip_subnetGrid.jqxGrid('beginupdate');
                if ($ip_subnetGrid.jqxGrid('filterable') === false) {
                    $ip_subnetGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $ip_subnetGrid.jqxGrid({showfilterrow: !$ip_subnetGrid.jqxGrid('showfilterrow')});
                }, 300);
                $ip_subnetGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $ip_subnetGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $ip_subnetGrid);
                    }
                );
                break;
        }
    },



};

function addGrpResult() {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}

function editGrpResult() {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}

function addIfFlowGrpResult() {
    refreshGrp();
    $('#pwindow').jqxWindow('close');
}

function editIfFlowGrpResult() {
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
    HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_IP/*, { devKind1 : 'DEV' }*/);
}
function refreshIfFlowGrp() {
    HmTreeGrid.updateData($ifFlowGrpGrid, HmTree.T_GRP_FLOW_IF/*, { devKind1 : 'DEV' }*/);
}



$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});