var $ip_grpTree, $ip_subnetGrid, editSubnetIds = [], editIpGrpSortIds = [];
var $if_grpTree, $if_devGrid, $if_ifGrid, $if_ifGrpTree, $if_confGrid;
var $dev_grpTree, $dev_devGrid, $dev_sGrpTree, $dev_confGrid;
var $sort_grpTree, $sort_grpGrid, editGrpSortIds = [];

var Main = {
    /** variable */
    initVariable: function () {
        $ip_grpTree = $('#ip_grpTree'), $ip_subnetGrid = $('#ip_subnetGrid');
        $devGrid = $('#devGrid'), $recvDevGrid = $('#recvDevGrid'), $grpTree = $('#grpTree'), currRecvGrpNo = 1;
        $sort_grpTree = $('#sort_grpTree'), $sort_grpGrid = $('#sort_grpGrid');
        $if_grpTree = $('#if_grpTree'), $if_devGrid = $('#if_devGrid'), $if_ifGrid = $('#if_ifGrid');
        $if_ifGrpTree = $('#if_ifGrpTree'), $if_confGrid = $('#if_confGrid');
        $dev_grpTree = $('#dev_grpTree'), $dev_devGrid = $('#dev_devGrid'), $dev_sGrpTree = $('#dev_sGrpTree'), $dev_confGrid = $('#dev_confGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        // $('#btnIf_move, #btnDev_move').bind('click', function (event) {
        //     Main.eventControl(event);
        // }); //click 이 두번 bind 되기 때문에 하나 주석 처리함 2022.08.17
    },

    /** event handler */
    eventControl: function (event) {

        var curTarget = event.currentTarget;

        switch (curTarget.id) {
            /**
                ip그룹(기능 이전됨)[환경설정>트래픽설정>그룹설정]
            */
            case 'btnAdd_grp':
                this.addIpGrp();
                break;
            case 'btnEdit_grp':
                this.editIpGrp();
                break;
            case 'btnDel_grp':
                this.delIpGrp();
                break;
            /**/
            /**/
            case 'btnAdd_sort':
                this.addDefaultGrp();
                break;
            case 'btnEdit_sort':
                this.editDefaultGrp();
                break;
            case 'btnDel_sort':
                this.delDefaultGrp();
                break;
            /**
             ip그룹(기능 이전됨)[환경설정>트래픽설정>그룹설정]
             */
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
            /**/
            /**/
            case 'btnSave_sort':
                this.saveDefaultGrpSort();
                break;
            case 'btn_move_dev':
                this.addRecvDev();
                break;
            case 'btnDel_dev':
                this.delGrpDev();
                break;

            case 'btnAdd_ifGrp':
                this.addIfGrp();
                break;
            case 'btnEdit_ifGrp':
                this.editIfGrp();
                break;
            case 'btnDel_ifGrp':
                this.delIfGrp();
                break;
            case 'btnIf_move':
                this.addLineToIfGrp();
                break;
            case 'btnSearch_ifGrpConf':
                this.searchIfGrpConf();
                break;
            case 'btnDel_ifGrpConf':
                this.delIfGrpConf();
                break;
            case 'btnSave_ifGrpConf':
                this.saveIfGrpConf();
                break;

            case 'btnAdd_sGrp':
                this.addSearchGrp();
                break;
            case 'btnAdd_sGrpGate':
                this.addSearchGrpGate();
                break;
            case 'btnEdit_sGrp':
                this.editSearchGrp();
                break;
            case 'btnDel_sGrp':
                this.delSearchGrp();
                break;
            case 'btnDev_move':
                this.addDevToSGrp();
                break;
            case 'btnSearch_sGrpConf':
                this.searchSGrpConf();
                break;
            case 'btnDel_sGrpConf':
                this.delSGrpConf();
                break;
            case 'btnSave_sGrpConf':
                this.saveSGrpConf();
                break;
            case 'btnSort_sortDevTree':
                this.sortTree();
                break;
            case 'btnSort_sortIpTree':
                this.sortTree();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmWindow.create($('#pwindow'), 100, 100);

        $('#mainTabs').jqxTabs({
            width: '100%', height: '100%', theme : 'ui-hamon-v1-tab-top',
            initTabContent: function (tab) {
                switch (tab) {
                    case 0:
                        HmJqxSplitter.create($('#dev_mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], 'auto', '100%');
                        HmJqxSplitter.create($('#dev_tSplitter, #dev_bSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 340,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%', {showSplitBar: false});

                        HmTreeGrid.create($dev_grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDev2, null, ['grpName']);
                        HmTreeGrid.create($dev_sGrpTree, HmTree.T_GRP_SEARCH, Main.searchSGrpConf, null, ['grpName']);

                        HmGrid.create($dev_devGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/env/grpMgmt/getSearchDefaultDevList.do'
                                },
                                {
                                    formatData: function (data) {
                                        // 조회 그룹 정보
                                        var sgrpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
                                        if (sgrpSelection !== undefined && sgrpSelection.length == 1) {
                                            var _sgrpNo = sgrpSelection.length == 0 ? 0 : sgrpSelection[0].grpNo;
                                            // 선택의 최상위 그룹번호를 가져온다
                                            var _topGrpNo = _sgrpNo;
                                            var _curSelection = sgrpSelection[0];
                                            var level = _curSelection.level;
                                            for (var i = 0; i <= level; i--) {
                                                if (_curSelection.parent == null) {
                                                    _topGrpNo = _curSelection.grpNo;
                                                    break;
                                                } else {
                                                    _curSelection = _curSelection.parent;
                                                }
                                            }
                                        } else {
                                            return;
                                        }

                                        // 기본 그룹정보
                                        var grpSelection = $dev_grpTree.jqxTreeGrid('getSelection');
                                        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;
                                        $.extend(data, {
                                            grpType: 'DEFAULT',
                                            grpNo: _grpNo,
                                            searchTopGrpNo: _topGrpNo
//												grpNo: $dev_grpTree.val().value
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '기본그룹명', datafield: 'grpName', width: 120},
                                    {text: '장비명', datafield: 'disDevName', minwidth: 150},
                                    {text: 'IP', datafield: 'devIp', width: 120},
                                    {text: 'devKind1', datafield: 'devKind1', hidden: true},
                                    {text: '장비종류', datafield: 'disDevKind1', width: 90},
                                    {text: '종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist'},
                                    {text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist'},
                                    {text: '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist'}
                                ]
                        }, CtxMenu.COMM, "4");

                        HmGrid.create($dev_confGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/env/grpMgmt/getSearchDevList.do'
                                },
                                {
                                    formatData: function (data) {
                                        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
                                        if (grpSelection.length == 0) {
                                            return;
                                        }
                                        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;

                                        // 선택의 최상위 그룹번호를 가져온다
                                        var _topGrpNo = _grpNo;
                                        var _curSelection = grpSelection[0];
                                        var level = _curSelection.level;
                                        for (var i = 0; i <= level; i--) {
                                            if (_curSelection.parent == null) {
                                                _topGrpNo = _curSelection.grpNo;
                                                break;
                                            } else {
                                                _curSelection = _curSelection.parent;
                                            }
                                        }

                                        $.extend(data, {
                                            grpType: 'SEARCH',
                                            grpNo: _grpNo
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '조회그룹명', datafield: 'grpName', width: 120},
                                    {text: '장비명', datafield: 'disDevName', minwidth: 150},
                                    {text: 'IP', datafield: 'devIp', width: 120},
                                    {text: 'devKind1', datafield: 'devKind1', hidden: true},
                                    {text: '장비종류', datafield: 'disDevKind1', width: 90},
                                    {text: '종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist'},
                                    {text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist'},
                                    {text: '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist'}
                                ]
                        }, CtxMenu.COMM, "5");
                        break;
                    case 1:
                        HmJqxSplitter.create($('#if_mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], 'auto', '100%');
                        HmJqxSplitter.create($('#if_tSplitter, #if_bSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 340,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%', {showSplitBar: false});
                        HmTreeGrid.create($if_grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDev, null, ['grpName']);
                        HmGrid.create($if_devGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/dev/getDevList.do'
                                },
                                {
                                    formatData: function (data) {
                                        var grpSelection = $if_grpTree.jqxTreeGrid('getSelection');
                                        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;
                                        $.extend(data, {
                                            grpType: 'DEFAULT',
                                            grpNo: _grpNo,
                                            devKind1: 'DEV'
//												grpNo: $if_grpTree.val().value
                                        });
                                        return data;
                                    }
                                }
                            ),
                            width: '49.5%',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '기본그룹명', datafield: 'grpName', width: 120},
                                    {text: '장비명', datafield: 'disDevName', minwidth: 150},
                                    {text: '제조사', datafield: 'vendor', minwidth: 150, filtertype: 'checkedlist'},
                                    {text: '모델', datafield: 'model', minwidth: 150, filtertype: 'checkedlist'},
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {text: '종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist'}
                                ]
                        }, CtxMenu.COMM, "1");
                        $if_devGrid.on('rowdoubleclick', function (event) {
                            HmGrid.updateBoundData($if_ifGrid, ctxPath + '/line/getLineList.do');
                        });

                        HmGrid.create($if_ifGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json'
                                },
                                {
                                    formatData: function (data) {
                                        var _grpNo = -1, _mngNo = -1;
//											if($if_grpTree.val() !== null) _grpNo = $if_grpTree.val().value;
                                        var grpSelection = $if_grpTree.jqxTreeGrid('getSelection');
                                        if (grpSelection.length > 0)
                                            _grpNo = grpSelection[0].grpNo;
                                        var rowIdx = HmGrid.getRowIdx($if_devGrid);
                                        if (rowIdx !== false) _mngNo = $if_devGrid.jqxGrid('getrowdata', rowIdx).mngNo;
                                        $.extend(data, {
                                            grpNo: _grpNo,
                                            mngNo: _mngNo
                                        });
                                        return data;
                                    }
                                }
                            ),
                            width: '49.5%',
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '회선명', datafield: 'orgIfName', minwidth: 150},
                                    {text: '사용자회선명', datafield: 'userIfName', width: 150},
                                    {text: '회선별칭', datafield: 'ifAlias', width: 150},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '성능수집', datafield: 'perfPollStr', width: 70, cellsalign: 'center'}
                                ]
                        }, CtxMenu.COMM, "2");

                        HmTreeGrid.create($if_ifGrpTree, HmTree.T_GRP_IF, Main.searchIfGrpConf, null, ['grpName']);
                        HmGrid.create($if_confGrid, {
                            source: new $.jqx.dataAdapter(
                                {
                                    datatype: 'json',
                                    url: ctxPath + '/main/env/grpMgmt/getSearchIfList.do',
                                    datafields: [
                                        {name: 'grpName', type: 'string'},
                                        {name: 'disDevName', type: 'string'},
                                        {name: 'devIp', type: 'string'},
                                        {name: 'ifName', type: 'string'},
                                        {name: 'userIfName', type: 'string'},
                                        {name: 'ifAlias', type: 'string'},
                                        {name: 'lineWidth', type: 'string'},
                                        {name: 'devKind2', type: 'string'},
                                        {name: 'grpNo', type: 'number'},
                                        {name: 'mngNo', type: 'number'},
                                        {name: 'ifIdx', type: 'number'}
                                    ]
                                },
                                {
                                    formatData: function (data) {
                                        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
                                        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;
                                        $.extend(data, {
                                            grpNo: _grpNo
//												grpNo: $if_ifGrpTree.val().value
                                        });
                                        return data;
                                    }
                                }
                            ),
                            selectionmode: 'multiplerowsextended',
                            pagerheight: 27,
                            pagerrenderer: HmGrid.pagerrenderer,
                            columns:
                                [
                                    {text: '회선그룹명', datafield: 'grpName', width: 120},
                                    {text: '장비명', datafield: 'disDevName', minwidth: 150},
                                    {text: '장비IP', datafield: 'devIp', width: 120},
                                    {text: '회선명', datafield: 'ifName', minwidth: 150},
                                    {text: '사용자회선명', datafield: 'userIfName', width: 150},
                                    {text: '회선별칭', datafield: 'ifAlias', width: 150},
                                    {
                                        text: '대역폭',
                                        datafield: 'lineWidth',
                                        width: 100,
                                        cellsrenderer: HmGrid.unit1000renderer
                                    },
                                    {text: '종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist'},
                                    {text: '회선그룹번호', datafield: 'grpNo', hidden: true},
                                    {text: '장비번호', datafield: 'mngNo', hidden: true},
                                    {text: '회선IDX', datafield: 'ifIdx', hidden: true}
                                ]
                        }, CtxMenu.COMM, "3");
                        break;

                    case 2:
                        HmJqxSplitter.create($('#sort_mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 340,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%');

                        HmJqxSplitter.create($('#recvDev_mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
                            size: '50%',
                            collapsible: false
                        }, {size: '50%'}], 'auto', '100%');
                        HmJqxSplitter.create($('#recvDev_subSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 250,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%');


                        HmTreeGrid.create($sort_grpTree, HmTree.T_GRP_DEF_ALL, Main.searchSort, null, ['grpName']);

                        $sort_grpTree.on('rowSelect', function (event) {
                            currRecvGrpNo = event.args.key;
                            Main.search();
                        });

                        HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchGrpDev/*, { devKind1 : 'DEV' }*/);

                        $('#sort_tab').jqxTabs({
                            width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
                            initTabContent: function (tab) {
                                switch (tab) {

                                    case 0:
                                        HmGrid.create($('#sort_grpGrid'), {
                                            source: new $.jqx.dataAdapter({
                                                    datatype: 'json',
                                                    updaterow: function (rowid, rowdata, commit) {
                                                        if (editGrpSortIds.indexOf(rowid) == -1)
                                                            editGrpSortIds.push(rowid);
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
                                            ready: Main.searchSort
                                        }, CtxMenu.NONE);
                                        $('#sort_grpGrid').on('bindingcomplete', function () {
                                            editGrpSortIds = [];
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
                                        Main.search();
                                        break;

                                    case 1:


                                        HmGrid.create($recvDevGrid, {
                                            source: new $.jqx.dataAdapter(
                                                {
                                                    datatype: 'json',
                                                    url: ctxPath + '/main/com/recvGrpMgmt/getRecvDevList.do'
                                                },
                                                {
                                                    formatData: function (data) {
                                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                                        // if(rowIdx === false) return;
                                                        $.extend(data, {
                                                            recvGrpNo: currRecvGrpNo
                                                        });
                                                        return data;
                                                    }
                                                }
                                            ),
                                            selectionmode: 'multiplerowsextended',
                                            columns:
                                                [
                                                    {text: '장비번호', datafield: 'mngNo', hidden: true},
                                                    {text: '그룹명', datafield: 'grpName'},
                                                    {text: '장비명', datafield: 'devName'},
                                                    {text: '대표IP', datafield: 'devIp'},
                                                    {text: '종류', datafield: 'devKind2', filtertype: 'checkedlist'},
                                                    {text: '모델', datafield: 'model', filtertype: 'checkedlist'},
                                                    {text: '제조사', datafield: 'vendor', filtertype: 'checkedlist'}
                                                ]
                                        });

                                        HmGrid.create($devGrid, {
                                            source: new $.jqx.dataAdapter(
                                                {
                                                    datatype: 'json'
                                                },
                                                {
                                                    formatData: function (data) {
                                                        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT',
                                                            _itemKind = 'GROUP';
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

                                                        // var rowIdx = HmGrid.getRowIdx($recvGrpGrid);
                                                        // if(rowIdx === false) return;
                                                        $.extend(data, {
                                                            recvGrpNo: currRecvGrpNo
                                                        });
                                                        return data;
                                                    }
                                                }
                                            ),
                                            selectionmode: 'multiplerowsextended',
                                            pagerheight: 27,
                                            pagerrenderer: HmGrid.pagerrenderer,
                                            columns:
                                                [
                                                    {text: '그룹명', datafield: 'grpName'},
                                                    {text: '장비명', datafield: 'devName'},
                                                    {text: '대표IP', datafield: 'devIp'},
                                                    {text: '종류', datafield: 'devKind2', filtertype: 'checkedlist'},
                                                    {text: '모델', datafield: 'model', filtertype: 'checkedlist'},
                                                    {text: '제조사', datafield: 'vendor', filtertype: 'checkedlist'}
                                                ]
                                        });
                                        break;
                                }
                            }
                        });
                        break;


                    /**
                     ip그룹(기능 이전됨)[환경설정>트래픽설정>그룹설정]
                     */
                    case 3:
                        HmJqxSplitter.create($('#ip_mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{
                            size: 340,
                            min: 150,
                            collapsible: false
                        }, {size: '100%'}], 'auto', '100%');

                        $('#ip_tab').jqxTabs({
                            width: '100%', height: '100%', theme: jqxThemeV1,
                            initTabContent: function (tab) {
                                switch (tab) {
                                    case 0:
                                        HmGrid.create($ip_subnetGrid, {
                                            source: new $.jqx.dataAdapter(
                                                {
                                                    datatype: 'json',
                                                    url: ctxPath + '/main/env/grpMgmt/getSubnetList.do',
                                                    updaterow: function (rowid, rowdata, commit) {
                                                        if (editSubnetIds.indexOf(rowid) == -1)
                                                            editSubnetIds.push(rowid);
                                                        commit(true);
                                                    },
                                                    addrow: function (rowid, rowdata, commit) {
                                                        rowdata.grpNo = $ip_grpTree.jqxTreeGrid('getSelection')[0].grpNo;
//							            	rowdata.grpNo = $ip_grpTree.val().value;
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

                        HmTreeGrid.create($ip_grpTree, HmTree.T_GRP_DEF_ALL, Main.searchSubnet, null, ['grpName']);
                        break;
                        /**/
                        /**/
                }
            }
        });
    },

    /** init data */
    initData: function () {

    },

    /** IP그룹 */
    addIpGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($ip_grpTree);
        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    editIpGrp: function () {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        var _params = {
            grpNo: treeItem.grpNo,
            grpName: treeItem.grpName,
            grpParent: treeItem.grpParent,
            grpCode: treeItem.grpCode
        };
        $.post(ctxPath + '/main/popup/env/pGrpEdit.do', _params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹 수정', result, 400, 500, 'pwindow_init', _params);
            }
        );
    },

    delIpGrp: function () {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delDefaultGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $ip_grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $ip_grpTree.jqxTreeGrid('selectRow', $ip_grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    /** 그룹설정 */
    refreshAllTree: function (retVal) {
        if ($sort_grpTree.jqxTreeGrid('source')) HmTreeGrid.updateData($sort_grpTree, HmTree.T_GRP_DEF_ALL);
        if ($dev_grpTree.jqxTreeGrid('source')) HmTreeGrid.updateData($dev_grpTree, HmTree.T_GRP_DEF_ALL);
        if ($if_grpTree.jqxTreeGrid('source')) HmTreeGrid.updateData($if_grpTree, HmTree.T_GRP_DEF_ALL);
        if ($ip_grpTree.jqxTreeGrid('source')) HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
        if ($dev_sGrpTree.jqxTreeGrid('source')) {
            if (retVal !== 'undefined' && retVal.sortType == 'T_GRP_SEARCH') {
                HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
                $dev_sGrpTree.jqxTreeGrid()
                    .on('bindingComplete', function () {
                        setTimeout(function () {
                                $dev_sGrpTree.jqxTreeGrid('selectRow', retVal.grpNo);
                                $dev_sGrpTree.jqxTreeGrid('expandRow', retVal.grpNo);
                            },
                            100);
                    });
            }
        }
        if ($if_ifGrpTree.jqxTreeGrid('source')) {
            if (retVal !== 'undefined' && retVal.sortType == 'T_GRP_IF') {
                HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
                $if_ifGrpTree.jqxTreeGrid()
                    .on('bindingComplete', function () {
                        setTimeout(function () {
                                $if_ifGrpTree.jqxTreeGrid('selectRow', retVal.grpNo);
                                $if_ifGrpTree.jqxTreeGrid('expandRow', retVal.grpNo);
                            },
                            100);
                    });
            }
        }
    },

    addDefaultGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($sort_grpTree);
        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    editDefaultGrp: function () {
        var grpSelection = $sort_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        // if (treeItem.level == 0) {
        //     alert('최상위 그룹을 수정할 수 없습니다.');
        //     return;
        // }
        var _params = {
            grpNo: treeItem.grpNo,
            grpName: treeItem.grpName,
            grpParent: treeItem.grpParent,
            grpCode: treeItem.grpCode
        };
        $.post(ctxPath + '/main/popup/env/pGrpEdit.do', _params,
            function (result) {
                HmWindow.openFit($('#pwindow'), '그룹 수정', result, 400, 500,'pwindow_init', _params);
            }
        );
    },

    delDefaultGrp: function () {
        var grpSelection = $sort_grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delDefaultGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $sort_grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $sort_grpTree.jqxTreeGrid('selectRow', $sort_grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
                Main.refreshAllTree();
            }
        });
    },

    searchSubnet: function () {
        HmGrid.updateBoundData($ip_subnetGrid, ctxPath + '/main/env/grpMgmt/getSubnetList.do');
        if ($('#ip_tab').val() == 1) {
            var row = HmTreeGrid.getSelectedItem($ip_grpTree);
            if (row != null) {
                HmGrid.setLocalData($('#ip_sortGrid'), row.records);
            }
        }
    },

    sortTree: function () {
        switch ($('#mainTabs').val()) {
            case 0:
                var treeItem = HmTreeGrid.getSelectedItem($dev_sGrpTree);
                treeItem.searchType = HmTree.T_GRP_SEARCH;
                treeItem.saveUrl = '/grp/saveDevGrpSortIdx.do';
                treeItem.sortType = 'T_GRP_SEARCH';
                break;
            case 1:
                var treeItem = HmTreeGrid.getSelectedItem($if_ifGrpTree);
                treeItem.searchType = HmTree.T_GRP_IF;
                treeItem.saveUrl = '/grp/saveGrpSortIdx.do';
                treeItem.sortType = 'T_GRP_IF';
                break;
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
        HmUtil.createPopup('/main/popup/env/pSubnetAddMulti.do', $('#hForm'), 'pMultiAdd', 755, 700, params);
    },

    addSubnet: function () {
        $.get(ctxPath + '/main/popup/env/pSubnetAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '서브넷 등록', result, 300, 175);
        });
    },

    delSubnet: function () {
        var rowIdxes = HmGrid.getRowIdxes($ip_subnetGrid, '데이터를 선택해주세요.');
        if (rowIdxes === false) return;

        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;


        var _list = [];

        $.each(rowIdxes, function (idx, value) {
            _list.push({
                subNo: $ip_subnetGrid.jqxGrid('getrowdata', idx).subNo
            });
        });

        Server.post('/main/env/grpMgmt/delSubnet.do', {
            data: {list: _list},
            success: function (result) {
                $.each(rowIdxes, function (idx, value) {
                    $ip_subnetGrid.jqxGrid('deleterow', $ip_subnetGrid.jqxGrid('getrowid', idx));
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

    addRecvDev: function () {
        var rowIdx = HmTreeGrid.getSelectedItem($sort_grpTree);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return;
        }
        var recvGrpData = $sort_grpTree.jqxTreeGrid('getSelection', rowIdx);

        var rowIdx = HmTreeGrid.getSelectedItem($devGrid);
        if (rowIdx === false) {
            alert('등록할 장비를 선택하세요.');
            return;
        }


        var rowIdxes = HmGrid.getRowIdxes($devGrid, '선택된  데이터가 없습니다.');
        if (rowIdxes === false) return;

        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            var data = $devGrid.jqxGrid('getrowdata', value);
            _list.push({mngNo: data.mngNo});
        });


        var params = {
            recvGrpNo: recvGrpData[0].grpNo,
            list: _list
        };

        Server.post('/main/com/recvGrpMgmt/addRecvDev.do', {
            data: {recvGrpNo: recvGrpData[0].grpNo, list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.searchGrpDev();
                $recvDevGrid.jqxGrid('updateBoundData');
            }
        });

    },

    delGrpDev: function () {

        var rowIdxes = HmGrid.getRowIdxes($recvDevGrid, '장비를 선택해주세요.');
        if(rowIdxes === false){
            //2022.08.17 장비 선택을 안 했을때도 다음 로직으로 넘어가서 추가
            return false;
        }

        var rowIdx = HmTreeGrid.getSelectedItem($sort_grpTree);
        if (rowIdx === false) {
            alert('수신자 그룹을 선택하세요.');
            return false;
        }
        var recvGrpData = $sort_grpTree.jqxTreeGrid('getSelection', rowIdx);

        var _mngNos = [], _uids = [];
        $.each(rowIdxes, function (idx, value) {
            _mngNos.push($recvDevGrid.jqxGrid('getrowdata', value).mngNo);
            _uids.push($recvDevGrid.jqxGrid('getrowdata', value).uid);
        });

        if (confirm("선택한 수신장비를 삭제하시겠습니까?") != true) return false;

        Server.post('/main/com/recvGrpMgmt/delRecvDev.do', {
            data: {mngNos: _mngNos, recvGrpNo: recvGrpData[0].grpNo},
            success: function (result) {
                $recvDevGrid.jqxGrid('deleterow', _uids);
                alert('삭제되었습니다.');
            }
        });

    },


    search: function () {
        HmGrid.updateBoundData($recvDevGrid);
        HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2);
    },

    searchGrpDev: function () {
        //			HmGrid.updateBoundData($devGrid, ctxPath + '/main/com/devMgmt/getDevMgmtList.do');
        HmGrid.updateBoundData($devGrid, ctxPath + '/main/com/recvGrpMgmt/getDevList.do');
    },


    searchSort: function () {

        // switch ($('#sort_tab').val()) {
        //     case 0:
        //         break;
        //     case 1:
        //         var row = HmTreeGrid.getSelectedItem($sort_grpTree);
        //         if(row != null) {
        //             HmGrid.setLocalData($('#sort_grpGrid'), row.records);
        //         }
        //         break;
        // }
        if ($('#sort_tab').val() == 0) {
            var row = HmTreeGrid.getSelectedItem($sort_grpTree);
            if (row != null) {
                HmGrid.setLocalData($('#sort_grpGrid'), row.records);
            }
        }
    },

    /** IP그룹 표시순서 저장 */
    saveIpGrpSort: function () {
        HmGrid.endRowEdit($('#ip_sortGrid'));
        var rows = $('#ip_sortGrid').jqxGrid('getboundrows');
        if (editIpGrpSortIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _saveData = [];
        $.each(editIpGrpSortIds, function (idx, value) {
            var tmp = $('#ip_sortGrid').jqxGrid('getrowdatabyid', value);
            _saveData.push({grpNo: tmp.grpNo, sortIdx: tmp.sortIdx});
        });

        Server.post('/grp/saveGrpSortIdx.do', {
            data: {list: _saveData},
            success: function (result) {
                // left ipGrpTree update
                HmTreeGrid.updateSortIdx($ip_grpTree, _saveData);
                editIpGrpSortIds = [];
                alert('저장되었습니다.');
            }
        });
    },

    /** 그룹 표시순서 저장 */
    saveDefaultGrpSort: function () {
        HmGrid.endRowEdit($('#sort_grpGrid'));
        var rows = $('#sort_grpGrid').jqxGrid('getboundrows');
        if (editGrpSortIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _saveData = [];
        $.each(editGrpSortIds, function (idx, value) {
            var tmp = $('#sort_grpGrid').jqxGrid('getrowdatabyid', value);
            _saveData.push({grpNo: tmp.grpNo, sortIdx: tmp.sortIdx});
        });

        Server.post('/grp/saveGrpSortIdx.do', {
            data: {list: _saveData},
            success: function (result) {
                // left ipGrpTree update
                HmTreeGrid.updateSortIdx($sort_grpTree, _saveData);
                editGrpSortIds = [];
                alert('저장되었습니다.');
                Main.refreshAllTree();
            }
        });
    },


    /** 회선그룹 */
    addIfGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($if_ifGrpTree);
        $.get(ctxPath + '/main/popup/env/pIfGrpAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '회선그룹 등록', result, 400, 480, 'pwindow_init', treeItem);
        });
    },

    editIfGrp: function () {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pIfGrpEdit.do',
            {grpParent: treeItem.grpParent, grpNo: treeItem.grpNo, grpName: treeItem.grpName},
            function (result) {
                HmWindow.openFit($('#pwindow'), '회선그룹 수정', result, 400, 480, 'pwindow_init', treeItem);
            }
        );
    },

    delIfGrp: function () {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.grpParent == 0) {
            alert('최상위 그룹은 삭제할 수 없습니다.');
            return;
        }
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delIfGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $if_ifGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $if_ifGrpTree.jqxTreeGrid('selectRow', $if_ifGrpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev: function () {
        HmGrid.updateBoundData($if_devGrid);
    },

    addLineToIfGrp: function () {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;
        var _grpName = grpSelection[0].grpName;
//			var _grpNo = $if_ifGrpTree.val().value;
        var rowIdxes = HmGrid.getRowIdxes($if_ifGrid, '회선을 선택해주세요.');
        if (rowIdxes === false) return;
        var rows = $if_confGrid.jqxGrid('getboundrows');
        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $if_ifGrid.jqxGrid('getrowdata', value);
            //중복체크
            var isExist = false;
            for (var i = 0; i < rows.length; i++) {
                var tmp = rows[i];
                if (tmp.mngNo == rowdata.mngNo && tmp.ifIdx == rowdata.ifIdx) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                rowdata.grpNo = _grpNo;
                rowdata.grpName = _grpName;
                rowdata.ifName = rowdata.orgIfName;
                _list.push(rowdata);
            }
        });
        $if_confGrid.jqxGrid('addrow', null, _list, "first");
    },

    searchIfGrpConf: function () {
        HmGrid.updateBoundData($if_confGrid);
    },

    delIfGrpConf: function () {
        var rowIdxes = HmGrid.getRowIdxes($if_confGrid, '데이터를 선택해주세요.');
        if (rowIdxes === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            _list.push($if_confGrid.jqxGrid('getrowdata', value));
        });

        Server.post('/main/env/grpMgmt/delSearchIf.do', {
            data: {list: _list},
            success: function (result) {
                var delIds = [];
                $.each(rowIdxes, function (idx, value) {
                    delIds.push($if_confGrid.jqxGrid('getrowid', value));
                });
                $if_confGrid.jqxGrid('deleterow', delIds);
                alert('삭제되었습니다.');
            }
        });
    },

    saveIfGrpConf: function () {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;
//			var _grpNo = $if_ifGrpTree.val().value;
        var _clist = $if_confGrid.jqxGrid('getboundrows');

        var _list = [];
        $.each(_clist, function (i, v) {
            // console.log(_grpNo, v);
            if (_grpNo == parseInt(v.grpNo)) {
                _list.push(v);
            }
        });

        Server.post('/main/env/grpMgmt/saveSearchIf.do', {
            data: {grpNo: _grpNo, list: _list},
            success: function (result) {
                alert('저장되었습니다.');
            }
        });
    },

    /** 조회그룹 */
    addSearchGrp: function () {
        var treeItem = HmTreeGrid.getSelectedItem($dev_sGrpTree);
        var _grpParent = 0;
        if (treeItem != null) {
            _grpParent = treeItem.grpNo;
        }
        $.get(ctxPath + '/main/popup/env/pSearchGrpAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '조회그룹 등록', result, 400, 459, 'pwindow_init', treeItem);
        });
    },
    addSearchGrpGate: function () {
        $.get(ctxPath + '/main/popup/env/pSearchGrpGateAdd.do', function (result) {
            HmWindow.openFit($('#pwindow'), '분류그룹 등록', result, 300, 142, 'pwindow_init');
        });
    },

    editSearchGrp: function () {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        $.post(ctxPath + '/main/popup/env/pSearchGrpEdit.do',
            {
                grpNo: treeItem.grpNo,
                grpName: treeItem.grpName,
                grpParent: treeItem.grpParent,
                grpCode: treeItem.grpCode
            },
            function (result) {
                HmWindow.openFit($('#pwindow'), '조회그룹 수정', result, 400, 459, 'pwindow_init', treeItem);
            }
        );
    },

    delSearchGrp: function () {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delSearchGrp.do', {
            data: {grpNo: treeItem.grpNo},
            success: function (result) {
                $dev_sGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $dev_sGrpTree.jqxTreeGrid('selectRow', $dev_sGrpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev2: function () {
        HmGrid.updateBoundData($dev_devGrid);
    },

    addDevToSGrp: function () {
        var rowIdxes = HmGrid.getRowIdxes($dev_devGrid, '장비를 선택해주세요.');
        if (rowIdxes === false) return;

        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;
        var _grpParent = grpSelection.length == 0 ? 0 : grpSelection[0].grpParent;
        var _grpName = grpSelection.length == 0 ? 0 : grpSelection[0].grpName;

        if (_grpParent === 0) {
            alert('분류그룹에는 추가할 수 없습니다.');
            return;
        }

        var rows = $dev_confGrid.jqxGrid('getboundrows');
        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $dev_devGrid.jqxGrid('getrowdata', value);
            //중복체크
            var isExist = false;
            for (var i = 0; i < rows.length; i++) {
                var tmp = rows[i];
                if (tmp.mngNo == rowdata.mngNo) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                rowdata.grpNo = _grpNo;
                rowdata.sGrpNo = _grpNo;
                rowdata.grpName = _grpName;
                _list.push(rowdata);
            }
        });
        $dev_confGrid.jqxGrid('addrow', null, _list, "first");
    },

    searchSGrpConf: function () {
        HmGrid.updateBoundData($dev_confGrid);
        HmGrid.updateBoundData($dev_devGrid);
    },

    delSGrpConf: function () {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;

        var rowIdxes = HmGrid.getRowIdxes($dev_confGrid, '데이터를 선택해주세요.');
        if (rowIdxes === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
        var _list = [];
        $.each(rowIdxes, function (idx, value) {
            _list.push($dev_confGrid.jqxGrid('getrowdata', value));
        });

        Server.post('/main/env/grpMgmt/delSearchDev.do', {
            data: {grpNo: _grpNo, list: _list},
            success: function (result) {
                var delIds = [];
                $.each(rowIdxes, function (idx, value) {
                    delIds.push($dev_confGrid.jqxGrid('getrowid', value));
                });
                $dev_confGrid.jqxGrid('deleterow', delIds);
                alert('삭제되었습니다.');
            }
        });
    },

    saveSGrpConf: function () {

        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }

        var _grpNo = grpSelection[0].grpNo;
        var _clist = $dev_confGrid.jqxGrid('getboundrows');
        var _list = [];

        $.each(_clist, function (i, v) {
            // console.log(_grpNo, v);
            if (_grpNo == parseInt(v.sGrpNo)) {
                _list.push(v);
            }
        });

        Server.post('/main/env/grpMgmt/saveSearchDev.do', {
            data: {grpNo: _grpNo, list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.searchDev2();
            }
        });

    }


};

function addGrpResult(addData, type) {
    switch (type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            $if_ifGrpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $if_ifGrpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $if_ifGrpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            $dev_sGrpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $dev_sGrpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $dev_sGrpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
        case HmTree.T_GRP_DEF_ALL:
            HmTreeGrid.updateData($sort_grpTree, HmTree.T_GRP_DEF_ALL);
            $sort_grpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $sort_grpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $sort_grpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
    }

    $('#pwindow').jqxWindow('close');
}

function refreshGrp(type) {
    switch (type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            break;
        case HmTree.T_GRP_DEF_ALL:
            HmTreeGrid.updateData($sort_grpTree, HmTree.T_GRP_DEF_ALL);
            break;

    }
}

function editGrpResult(addData, type) {
    switch (type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            $if_ifGrpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $if_ifGrpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $if_ifGrpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            $dev_sGrpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $dev_sGrpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $dev_sGrpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
        case HmTree.T_GRP_DEF_ALL:
            HmTreeGrid.updateData($sort_grpTree, HmTree.T_GRP_DEF_ALL);
            $sort_grpTree.jqxTreeGrid()
                .on('bindingComplete', function () {
                    setTimeout(function () {
                            $sort_grpTree.jqxTreeGrid('selectRow', addData.grpParent);
                            $sort_grpTree.jqxTreeGrid('expandRow', addData.grpParent);
                        },
                        100);
                });
            break;
    }

    $('#pwindow').jqxWindow('close');
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});