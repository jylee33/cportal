var $grpTree, $rackGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $grpTree = $('#grpTree'), $rackGrid = $('#rackGrid');
        this.initCondition();
    },

    initCondition: function () {
        // search condition
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
            case 'btnAdd_grp':
                this.addGrp();
                break;
            case 'btnEdit_grp':
                this.editGrp();
                break;
            case 'btnDel_grp':
                this.delGrp();
                break;

            case 'btnAdd':
                this.addRack();
                break;
            case 'btnEdit' :
                this.editRack();
                break;
            case 'btnDel':
                this.delRack();
                break;
            case 'btnConf':
                this.configRack();
                break;
            case 'btnSearch':
                this.searchRack();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.searchRack();
        }
    },

    /** init design */
    initDesign: function () {
        //검색바 호출.
        Master.createSearchBar1('', '', $("#srchBox"));

        HmWindow.create($('#pwindow'), 600, 400);
        HmTreeGrid.create($grpTree, HmTree.T_GRP_SERVER, Main.searchRack, {}, ['grpName']);
        HmJqxSplitter.createTree($('#mainSplitter'));

        HmGrid.create($rackGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/rackConf/getRackConfList.do',
                    datafields: [
                        {name: 'grpName', type: 'string'},
                        {name: 'rackName', type: 'string'},
                        {name: 'rackNo', type: 'number'},
                        {name: 'rackU', type: 'number'},
                        {name: 'unusedU', type: 'number'},
                        {name: 'vendor', type: 'string'},
                        {name: 'model', type: 'string'},
                        {name: 'profileName', type: 'string'},
                        {name: 'rackDesc', type: 'string'},
                        {name: 'profileNo', type: 'number'},
                        {name: 'rackIp', type: 'string'},
                        {name: 'rackPort', type: 'string'},
                        {name: 'ymd', type: 'string'},
                        {name: 'width', type: 'number'},
                        {name: 'height', type: 'number'},
                        {name: 'rackType', type: 'string'},
                    ]
                },
                {
                    formatData: function (data) {
                        var _grpNo = 0;
                        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                        if (!$.isEmpty(grpSelection) && grpSelection.length > 0) {
                            _grpNo = grpSelection[0].grpNo;
                        }

                        $.extend(data, {
                            grpNo: _grpNo
                        });
                        $.extend(data, HmBoxCondition.getSrchParams());
                        return data;
                    }
                }
            ),
            rowdetails: true,
            initrowdetails: Main.initrowdetails,
            rowdetailstemplate: {
                rowdetails: "<div id='slotGrid' style='margin: 10px;'></div>",
                rowdetailsheight: 250,
                rowdetailshidden: true
            },
            selectionmode: 'multiplerowsextended',
            editable: false,
            editmode: 'selectedrow',
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', minwidth: 150},
                    {text: '타입', datafield: 'rackType', width: 60, cellsrenderer: function (row, datafield, value) {
                            var txt = value === 'SINGLE' ? '단면' : '양면';
                            return '<div style="height: 100%; margin-top:6.5px; text-align: center">'+ txt + '</div>';
                        }
                    },
                    {text: 'Rack명', datafield: 'rackName', minwidth: 150},
                    //	{ text : 'Rack타입', datafield : 'rackType', width : 100 },
                    {
                        text: '전체',
                        columngroup: 'unit',
                        datafield: 'rackU',
                        width: 80,
                        cellsalign: 'right',
                        filtertype: 'number'
                    },
                    {
                        text: '미사용',
                        columngroup: 'unit',
                        datafield: 'unusedU',
                        width: 80,
                        cellsalign: 'right',
                        filtertype: 'number'
                    },
                    {text: '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist'},
                    {text: '프로파일', datafield: 'profileName', width: 150},
                    {text: 'profileNo', datafield: 'profileNo', hidden: true},
                    {text: 'RACK DESC', datafield: 'rackDesc', width: 120, hidden: true},
                    {text: 'IP', datafield: 'rackIp', width: 120},
                    {text: 'Port', datafield: 'rackPort', width: 60, cellsalign: 'right'},
                    {text: '설치일', datafield: 'ymd', width: 80, cellsalign: 'center'},
                    {text: '가로(cm)', datafield: 'width', width: 80, cellsalign: 'right', filtertype: 'number'},
                    {text: '세로(cm)', datafield: 'height', width: 80, cellsalign: 'right', filtertype: 'number'}
                ],
            columngroups: [
                {text: 'Unit수', align: 'center', name: 'unit'}
            ]
        }, CtxMenu.NONE);

        $rackGrid.on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                $rackGrid.jqxGrid('selectrow', event.args.rowindex);
                var rowIdxes = HmGrid.getRowIdxes($rackGrid, 'Rack을 선택해주세요.');
                /*
                if(rowIdxes.length > 1) {
                    $('#ctxmenu_dev ul').children(':first').css('display', 'none');
                }
                else {
                    $('#ctxmenu_dev ul').children(':first').css('display', 'block');
                }
                */
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_dev').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        });

        $('#ctxmenu_dev').jqxMenu({width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme})
            .on('itemclick', function (event) {
                Main.selectDevCtxmenu(event);
            });

        $('#section').css('display', 'block');
    },

    initrowdetails: function (index, parentElement, gridElement, record) {
        var id = record.uid.toString();
        var grid = $($(parentElement).children()[0]);
        console.log('grid',grid)
        var slotGridAdapter = new $.jqx.dataAdapter(
            {
                datatype: 'json',
                url: ctxPath + '/main/env/rackConf/getRackSlotList.do'
            },
            {
                formatData: function (data) {
                    data.grpNo = record.grpNo;
                    data.rackNo = record.rackNo;
                    return data;
                },
                loadComplete: function (records) {
                    console.log(records.resultData);
                }
            }
        );
        if (grid != null) {
            HmGrid.create(grid, {
                source: slotGridAdapter,
                width: '98%',
                height: 230,
                pagerheight: 27,
                pagerrenderer: HmGrid.pagerrenderer,
                columns: [
                    {text: 'Unit', datafield: 'slotNo', width: 100, cellsalign: 'right', hidden: true},
                    {text: '구분', datafield: 'rackSection', width: 60 ,
                        cellsrenderer: function (row, datafield, value) {
                            var txt = value === 'F' ? '앞면' : '뒷면';
                            return '<div style="height: 100%; margin-top:6.5px; text-align: center">'+ txt + '</div>';
                        }
                    },
                    {text: 'Unit 시작번호', datafield: 'descSlotNo', width: 100, cellsalign: 'right'},
                    {
                        text: 'Slot종류', datafield: 'slotKind', width: 100,
                        cellsrenderer: function (row, datafield, value) {
                            var cell = "<div style='margin-top: 6.5px; margin-left: 4px;'>";
                            switch (value.toString()) {
                                case "DEV":
                                    cell += "장비";
                                    break;
                                case "SVR":
                                    cell += "서버";
                                    break;
                                case "VSVR":
                                    cell += "가상서버";
                                    break;
                                case "BSVR":
                                    cell += "블레이드서버";
                                    break;
                                case "BLD":
                                    cell += "블레이드";
                                    break;
                            }
                            cell += "</div>";
                            return cell;
                        }
                    },
                    {text: 'Slot명', datafield: 'slotName', minwidth: 150},
                    {text: 'IP', datafield: 'slotIp', width: 120},
                    {text: '종류', datafield: 'devKind2', width: 120, filtertype: 'checkedlist'},
                    {text: '모델', datafield: 'model', width: 120, filtertype: 'checkedlist'},
                    {text: '벤더', datafield: 'vendor', width: 120, filtertype: 'checkedlist'},
                    {text: 'Unit수', datafield: 'slotU', width: 100, cellsalign: 'right'},
                    {text: '타입', datafield: 'devKind1', width: 100, filtertype: 'checkedlist'}
                ]
            });

            grid.on('rowdoubleclick', function () {
                var rackMngNo = HmGrid.getRowData(grid).mngNo;
                $.get(ctxPath + '/main/popup/env/pRackVmInfo.do', function (result) {
                    HmWindow.openFit($('#pwindow'), 'VM 서버정보', result, 600, 452, 'pwindow_init', rackMngNo);

                });
            })
        }
    },

    /** init data */
    initData: function () {

    },

    /** RACK 그룹 */
    addGrp: function () {
        $.get(ctxPath + '/main/popup/env/pSvrGrpAdd.do', function (result) {
            HmWindow.open($('#pwindow'), 'RACK그룹 등록', result, 400, 492);
        });
    },

    editGrp: function () {

        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if (grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if (treeItem.level == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pSvrGrpEdit.do',
            {
                grpNo: treeItem.grpNo,
                grpName: treeItem.grpName,
                grpParent: treeItem.grpParent,
                grpCode: treeItem.grpCode
            },
            function (result) {
                HmWindow.open($('#pwindow'), 'RACK그룹 수정', result, 400, 492);
            }
        );
    },

    delGrp: function () {
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
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
        var _isSvrDelete = confirm('그룹에 등록된 RACK 정보를 모두 삭제하시겠습니까?') + "";
        Server.post('/grp/delSvrGrp.do', {
            data: {grpNo: treeItem.grpNo, isSvrDelete: _isSvrDelete},
            success: function (result) {
                $grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $grpTree.jqxTreeGrid('selectRow', $grpTree.jqxTreeGrid('getSelection')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    /** RACK */
    searchRack: function () {
        HmGrid.updateBoundData($rackGrid);
    },

    addRack: function () {

        var _grpNo = 0;
        var grpSelection = $grpTree.jqxTreeGrid('getSelection');
        if (!$.isEmpty(grpSelection) && grpSelection.length > 0) {
            _grpNo = grpSelection[0].grpNo;
        }
        else {
            alert('그룹을 선택해주세요.');
            return;
        }

        HmWindow.create($('#pwindow'), 500, 350, 1999);
        $.get(ctxPath + '/main/popup/env/pRackAdd.do',
            {
                grpNo: _grpNo
            },
            function (result) {
                HmWindow.openFit($('#pwindow'), 'Rack 추가', result, 500, 350, 'pwindow_init');
            }
        );
    },

    editRack: function () {

        var rowdata = $rackGrid.jqxGrid('getrowdata', $rackGrid.jqxGrid('getselectedrowindex'));
        if (rowdata === undefined || rowdata === null) {
            alert('수정할 Rack을 선택하세요.');
            return;
        }

        HmWindow.create($('#pwindow'), 500, 350, 1999);

        $.get(ctxPath + '/main/popup/env/pRackEdit.do',
            {
                rackNo: rowdata.rackNo,
                rackName: rowdata.rackName,
                rackU: rowdata.rackU,
                unusedU: rowdata.unusedU,
                model: rowdata.model,
                vendor: rowdata.vendor,
                rackDesc: rowdata.rackDesc,
                width: rowdata.width,
                height: rowdata.height,
                ymd: rowdata.ymd,
                rackIp: rowdata.rackIp,
                rackPort: rowdata.rackPort,
                profileNo: rowdata.profileNo,
            },
            function (result) {
                HmWindow.openFit($('#pwindow'), 'Rack 수정', result, 500, 350, 'pwindow_init', rowdata);
            }

        );
    },

    delRack: function () {
        var rowIdxes = HmGrid.getRowIdxes($rackGrid);
        if (rowIdxes === false) {
            alert('선택된 장비가 없습니다.');
            return;
        }
        if (!confirm('[' + rowIdxes.length + ']건의 장비를 삭제하시겠습니까?')) return;
        var _rackNos = [];
        $.each(rowIdxes, function (idx, value) {
            var tmp = $rackGrid.jqxGrid('getrowdata', value);
            _rackNos.push(tmp.rackNo);
        });

        Server.post('/main/env/rackConf/deleteRack.do', {
            data: {rackNos: _rackNos},
            success: function (result) {
                Main.searchRack();
                alert(result);
            }
        });
    },

    configRack: function () {
        var rowIdx = HmGrid.getRowIdx($rackGrid, 'Rack을 선택해주세요.');
        if (rowIdx === false) return;
        var rowdata = $rackGrid.jqxGrid('getrowdata', rowIdx);
        HmUtil.createPopup('/main/popup/env/pRackConf.do', $('#hForm'), 'pRackConf', 1005, screen.availHeight+10 , rowdata);
    },

    /** ContextMenu */
    selectDevCtxmenu: function (event) {
        switch ($(event.args)[0].id) {
            case 'cm_grpMoveBatchSet':
                try {
                    var rowIdxes = HmGrid.getRowIdxes($rackGrid, 'Rack을 선택해주세요.');
                    if (rowIdxes === false) return;
                    var _rackNos = [];
                    $.each(rowIdxes, function (idx, value) {
                        _rackNos.push($rackGrid.jqxGrid('getrowdata', value).rackNo);
                    });
                    var params = {
                        rackNos: _rackNos.join(',')
                    };

                    HmWindow.create($('#pwindow'), 500, 500);
                    $.post(ctxPath + '/main/popup/env/pRackGrpBatchSet.do',
                        params,
                        function (result) {
                            HmWindow.open($('#pwindow'), 'Rack 그룹이동', result, 400, 376);
                        }
                    );
                } catch (e) {
                }
                break;
            case 'cm_filter':
                $rackGrid.jqxGrid('beginupdate');
                if ($rackGrid.jqxGrid('filterable') === false) {
                    $rackGrid.jqxGrid({filterable: true});
                }
                setTimeout(function () {
                    $rackGrid.jqxGrid({showfilterrow: !$rackGrid.jqxGrid('showfilterrow')});
                }, 300);
                $rackGrid.jqxGrid('endupdate');
                break;
            case 'cm_filterReset':
                $rackGrid.jqxGrid('clearfilters');
                break;
            case 'cm_colsMgr':
                $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                    function (result) {
                        HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $rackGrid);
                    }
                );
                break;
        }
    }
};

function grpResult() {
    HmTreeGrid.updateData($grpTree, HmTree.T_GRP_SERVER);
}

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});
