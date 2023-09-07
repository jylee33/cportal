var $ip_grpTree, $ip_subnetGrid, editSubnetIds = [], editIpGrpSortIds = [];
var $if_grpTree, $if_devGrid, $if_ifGrid, $if_ifGrpTree, $if_confGrid;
var $dev_grpTree, $dev_devGrid, $dev_sGrpTree, $dev_confGrid;

var PMain = {
    /** variable */
    initVariable: function() {
        $ip_grpTree = $('#ip_grpTree'), $ip_subnetGrid = $('#ip_subnetGrid');
        $if_grpTree = $('#if_grpTree'), $if_devGrid = $('#if_devGrid'), $if_ifGrid = $('#if_ifGrid');
        $if_ifGrpTree = $('#if_ifGrpTree'), $if_confGrid = $('#if_confGrid');
        $dev_grpTree = $('#dev_grpTree'), $dev_devGrid = $('#dev_devGrid'), $dev_sGrpTree = $('#dev_sGrpTree'), $dev_confGrid = $('#dev_confGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { PMain.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {

            case 'btnAdd_ifGrp': this.addIfGrp(); break;
            case 'btnEdit_ifGrp': this.editIfGrp(); break;
            case 'btnDel_ifGrp': this.delIfGrp(); break;
            case 'btnIf_move': this.addLineToIfGrp(); break;
            case 'btnSearch_ifGrpConf': this.searchIfGrpConf(); break;
            case 'btnDel_ifGrpConf': this.delIfGrpConf(); break;
            case 'btnSave_ifGrpConf': this.saveIfGrpConf(); break;
        }
    },

    /** init design */
    initDesign: function() {
        HmWindow.create($('#pwindow'), 100, 100);

			$('#if_mainSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', theme: jqxTheme, panels: [{ size: '50%' }, { size: '50%' }] });
			$('#if_tSplitter, #if_bSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical',  showSplitBar: false, panels: [{ size: '230px', min: 150 }, { size: '100%' }] });
			HmTreeGrid.create($if_grpTree, HmTree.T_GRP_DEF_ALL, PMain.searchDev, null, ['grpName']);
			HmGrid.create($if_devGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						url: ctxPath + '/dev/getDevList.do'
					},
					{
						formatData: function(data) {
							var grpSelection = $if_grpTree.jqxTreeGrid('getSelection');
							var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
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
				columns:
					[
						{ text : '기본그룹명', datafield: 'grpName', width: 120 },
						{ text : '장비명', datafield: 'disDevName', minwidth: 150 },
						{ text : '제조사', datafield: 'vendor', minwidth: 150 },
						{ text : '모델', datafield: 'model', minwidth: 150 },
						{ text : '장비IP', datafield: 'devIp', width: 120 },
						{ text : '종류', datafield: 'devKind2', width: 130 }
					]
			}, CtxMenu.COMM, "1");
			$if_devGrid.on('rowdoubleclick', function(event) {
				HmGrid.updateBoundData($if_ifGrid, ctxPath + '/line/getLineList.do');
			});

			HmGrid.create($if_ifGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json'
					},
					{
						formatData: function(data) {
							var _grpNo = -1, _mngNo = -1;
//											if($if_grpTree.val() !== null) _grpNo = $if_grpTree.val().value;
							var grpSelection = $if_grpTree.jqxTreeGrid('getSelection');
							if(grpSelection.length > 0)
								_grpNo = grpSelection[0].grpNo;
							var rowIdx = HmGrid.getRowIdx($if_devGrid);
							if(rowIdx !== false) _mngNo = $if_devGrid.jqxGrid('getrowdata', rowIdx).mngNo;
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
				columns:
					[
						{ text : '회선명', datafield: 'ifName', minwidth: 150 },
						{ text : '회선별칭', datafield: 'ifAlias', width: 150 },
						{ text : '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
						{ text : '성능수집', datafield: 'perfPollStr' , width: 70, cellsalign: 'center'}
					]
			}, CtxMenu.COMM, "2");

			HmTreeGrid.create($if_ifGrpTree, HmTree.T_GRP_IF, PMain.searchIfGrpConf, null,  ['grpName']);
			HmGrid.create($if_confGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						url: ctxPath + '/main/env/grpMgmt/getSearchIfList.do'
					},
					{
						formatData: function(data) {
							var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
							var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
							$.extend(data, {
								grpNo: _grpNo
//												grpNo: $if_ifGrpTree.val().value
							});
							return data;
						}
					}
				),
				selectionmode: 'multiplerowsextended',
				columns:
					[
						{ text : '회선그룹명', datafield: 'grpName', width: 120 },
						{ text : '장비명', datafield: 'disDevName', minwidth: 150 },
						{ text : '장비IP', datafield: 'devIp', width: 120 },
						{ text : '회선명', datafield: 'ifName', minwidth: 150 },
						{ text : '회선별칭', datafield: 'ifAlias', width: 150 },
						{ text : '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
						{ text : '종류', datafield: 'devKind2', width: 130 }
					]
			}, CtxMenu.COMM, "3");


    },

    /** init data */
    initData: function() {

    },

    /** IP그룹 */
    addDefaultGrp: function() {
        var treeItem = HmTreeGrid.getSelectedItem($ip_grpTree);
        $.get(ctxPath + '/main/popup/env/pGrpAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 500, 'pwindow_init', treeItem);
        });
    },

    editDefaultGrp: function() {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.level == 0) {
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
            function(result) {
                HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 480, 'pwindow_init', _params);
            }
        );
    },

    delDefaultGrp: function() {
        var grpSelection = $ip_grpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.level == 0) {
            alert('최상위 그룹을 삭제할 수 없습니다.');
            return;
        }
        var treeItem = grpSelection[0];
        if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delDefaultGrp.do', {
            data: { grpNo: treeItem.grpNo },
            success: function(result) {
                $ip_grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $ip_grpTree.jqxTreeGrid('selectRow', $ip_grpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchSubnet: function() {
        HmGrid.updateBoundData($ip_subnetGrid, ctxPath + '/main/env/grpMgmt/getSubnetList.do');
        if($('#ip_tab').val() == 1) {
            var row = HmTreeGrid.getSelectedItem($ip_grpTree);
            if(row != null) {
                HmGrid.setLocalData($('#ip_sortGrid'), row.records);
            }
        }
    },

    addSubnet: function() {
        $.get(ctxPath + '/main/popup/env/pSubnetAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '서브넷 등록', result, 250, 170);
        });
    },

    delSubnet: function() {
        var rowIdx = HmGrid.getRowIdx($ip_subnetGrid, '데이터를 선택해주세요.');
        if(rowIdx === false) return;
        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $ip_subnetGrid.jqxGrid('getrowdata', rowIdx);
        Server.post('/main/env/grpMgmt/delSubnet.do', {
            data: { subNo: rowdata.subNo },
            success: function(result) {
                $ip_subnetGrid.jqxGrid('deleterow', $ip_subnetGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveSubnet: function() {
        HmGrid.endRowEdit($ip_subnetGrid);
        if(editSubnetIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editSubnetIds, function(idx, value) {
            _list.push($ip_subnetGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/grpMgmt/saveSubnet.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                editSubnetIds = [];
            }
        });
    },

    /** IP그룹 표시순서 저장 */
    saveDefaultGrpSort: function() {
        HmGrid.endRowEdit($('#ip_sortGrid'));
        var rows = $('#ip_sortGrid').jqxGrid('getboundrows');
        if(editIpGrpSortIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _saveData = [];
        $.each(editIpGrpSortIds, function(idx, value) {
            var tmp = $('#ip_sortGrid').jqxGrid('getrowdatabyid', value);
            _saveData.push({grpNo: tmp.grpNo, sortIdx: tmp.sortIdx});
        });

        Server.post('/grp/saveGrpSortIdx.do', {
            data: {list: _saveData},
            success: function(result) {
                // left ipGrpTree update
                HmTreeGrid.updateSortIdx($ip_grpTree, _saveData);
                editIpGrpSortIds = [];
                alert('저장되었습니다.');
            }
        });
    },


    /** 회선그룹 */
    addIfGrp: function() {
        var treeItem = HmTreeGrid.getSelectedItem($if_ifGrpTree);
        $.get(ctxPath + '/main/popup/env/pIfGrpAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '회선그룹 등록', result, 400, 480, 'pwindow_init', treeItem.grpNo);
        });
    },

    editIfGrp: function() {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.grpParent == 0) {
            alert('최상위 그룹을 수정할 수 없습니다.');
            return;
        }
        $.post(ctxPath + '/main/popup/env/pIfGrpEdit.do',
            { grpParent: treeItem.grpParent, grpNo: treeItem.grpNo, grpName: treeItem.grpName },
            function(result) {
                HmWindow.open($('#pwindow'), '회선그룹 수정', result, 400, 480);
            }
        );
    },

    delIfGrp: function() {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(treeItem.grpParent == 0) {
            alert('최상위 그룹은 삭제할 수 없습니다.');
            return;
        }
        if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delIfGrp.do', {
            data: { grpNo: treeItem.grpNo },
            success: function(result) {
                $if_ifGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $if_ifGrpTree.jqxTreeGrid('selectRow', $if_ifGrpTree.jqxTreeGrid('getRows')[0].uid);
                opener.refreshGrpCmp();
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev: function() {
        HmGrid.updateBoundData($if_devGrid);
    },

    addLineToIfGrp: function() {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;
//			var _grpNo = $if_ifGrpTree.val().value;
        var rowIdxes = HmGrid.getRowIdxes($if_ifGrid, '회선을 선택해주세요.');
        if(rowIdxes === false) return;
        var rows = $if_confGrid.jqxGrid('getboundrows');
        var _list = [];
        $.each(rowIdxes, function(idx, value) {
            var rowdata = $if_ifGrid.jqxGrid('getrowdata', value);
            //중복체크
            var isExist = false;
            for(var i = 0; i < rows.length; i++) {
                var tmp = rows[i];
                if(tmp.mngNo == rowdata.mngNo && tmp.ifIdx == rowdata.ifIdx) {
                    isExist = true;
                    break;
                }
            }
            if(!isExist) {
                rowdata.grpNo = _grpNo;
                _list.push(rowdata);
            }
        });
        $if_confGrid.jqxGrid('addrow', null, _list, "first");
    },

    searchIfGrpConf: function() {
        HmGrid.updateBoundData($if_confGrid);
    },

    delIfGrpConf: function() {
        var rowIdxes = HmGrid.getRowIdxes($if_confGrid, '데이터를 선택해주세요.');
        if(rowIdxes === false) return;
        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
        var _list = [];
        $.each(rowIdxes, function(idx, value) {
            _list.push($if_confGrid.jqxGrid('getrowdata', value));
        });

        Server.post('/main/env/grpMgmt/delSearchIf.do', {
            data: { list: _list },
            success: function(result) {
                var delIds = [];
                $.each(rowIdxes, function(idx, value) {
                    delIds.push($if_confGrid.jqxGrid('getrowid', value));
                });
                $if_confGrid.jqxGrid('deleterow', delIds);
                alert('삭제되었습니다.');
            }
        });
    },

    saveIfGrpConf: function() {
        var grpSelection = $if_ifGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;
//			var _grpNo = $if_ifGrpTree.val().value;
        var _list = $if_confGrid.jqxGrid('getboundrows');
        Server.post('/main/env/grpMgmt/saveSearchIf.do', {
            data: { grpNo: _grpNo, list: _list },
            success: function(result) {
                opener.refreshIfCmp();
                alert('저장되었습니다.');
            }
        });
    },

    /** 조회그룹 */
    addSearchGrp: function() {
        var treeItem = HmTreeGrid.getSelectedItem($dev_sGrpTree);
        var _grpParent = 0;
        if(treeItem != null) {
            _grpParent = treeItem.grpNo;
        }
        $.get(ctxPath + '/main/popup/env/pSearchGrpAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '조회그룹 등록', result, 400, 510, 'pwindow_init', _grpParent);
        });
    },
    addSearchGrpGate: function () {
        $.get(ctxPath + '/main/popup/env/pSearchGrpGateAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '분류그룹 등록', result, 300, 150, 'pwindow_init');
        });
    },

    editSearchGrp: function() {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        $.post(ctxPath + '/main/popup/env/pSearchGrpEdit.do',
            { grpNo: treeItem.grpNo, grpName: treeItem.grpName, grpParent: treeItem.grpParent, grpCode: treeItem.grpCode },
            function(result) {
                HmWindow.open($('#pwindow'), '조회그룹 수정', result, 400, treeItem.grpParent == 0? 510 : 510);
            }
        );
    },

    delSearchGrp: function() {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var treeItem = grpSelection[0];
        if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
        Server.post('/grp/delSearchGrp.do', {
            data: { grpNo: treeItem.grpNo },
            success: function(result) {
                $dev_sGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
                $dev_sGrpTree.jqxTreeGrid('selectRow', $dev_sGrpTree.jqxTreeGrid('getRows')[0].uid);
                alert('삭제되었습니다.');
            }
        });
    },

    searchDev2: function() {
        HmGrid.updateBoundData($dev_devGrid);
    },

    addDevToSGrp: function() {
        var rowIdxes = HmGrid.getRowIdxes($dev_devGrid, '장비를 선택해주세요.');
        if(rowIdxes === false) return;

        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
        var _grpParent = grpSelection.length == 0? 0 : grpSelection[0].grpParent;
        var _grpName = grpSelection.length == 0? 0 : grpSelection[0].grpName;

        if (_grpParent === 0) {
            alert('분류그룹에는 추가할 수 없습니다.');
            return;
        }

        var rows = $dev_confGrid.jqxGrid('getboundrows');
        var _list = [];
        $.each(rowIdxes, function(idx, value) {
            var rowdata = $dev_devGrid.jqxGrid('getrowdata', value);
            //중복체크
            var isExist = false;
            for(var i = 0; i < rows.length; i++) {
                var tmp = rows[i];
                if(tmp.mngNo == rowdata.mngNo) {
                    isExist = true;
                    break;
                }
            }
            if(!isExist) {
                rowdata.grpNo = _grpNo;
                rowdata.grpName = _grpName;
                _list.push(rowdata);
            }
        });
        $dev_confGrid.jqxGrid('addrow', null, _list, "first");
    },

    searchSGrpConf: function() {
        HmGrid.updateBoundData($dev_confGrid);
        HmGrid.updateBoundData($dev_devGrid);
    },

    delSGrpConf: function() {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;

        var rowIdxes = HmGrid.getRowIdxes($dev_confGrid, '데이터를 선택해주세요.');
        if(rowIdxes === false) return;
        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
        var _list = [];
        $.each(rowIdxes, function(idx, value) {
            _list.push($dev_confGrid.jqxGrid('getrowdata', value));
        });

        Server.post('/main/env/grpMgmt/delSearchDev.do', {
            data: {grpNo: _grpNo, list: _list },
            success: function(result) {
                var delIds = [];
                $.each(rowIdxes, function(idx, value) {
                    delIds.push($dev_confGrid.jqxGrid('getrowid', value));
                });
                $dev_confGrid.jqxGrid('deleterow', delIds);
                alert('삭제되었습니다.');
            }
        });
    },

    saveSGrpConf: function() {
        var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
        if(grpSelection.length == 0) {
            alert('그룹을 선택해주세요.');
            return;
        }
        var _grpNo = grpSelection[0].grpNo;
        var _list = $dev_confGrid.jqxGrid('getboundrows');
        Server.post('/main/env/grpMgmt/saveSearchDev.do', {
            data: { grpNo: _grpNo, list: _list },
            success: function(result) {
                alert('저장되었습니다.');
            }
        });
    }

};

function addGrpResult(addData, type) {
    switch(type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            break;
    }

    $('#pwindow').jqxWindow('close');
}

function refreshGrp(type) {
    switch(type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            break;
    }
}

function editGrpResult(addData, type) {
    switch(type) {
        case HmTree.T_GRP_DEFAULT:
            HmTreeGrid.updateData($ip_grpTree, HmTree.T_GRP_DEF_ALL);
            break;
        case HmTree.T_GRP_IF:
            HmTreeGrid.updateData($if_ifGrpTree, HmTree.T_GRP_IF);
            break;
        case HmTree.T_GRP_SEARCH:
            HmTreeGrid.updateData($dev_sGrpTree, HmTree.T_GRP_SEARCH);
            break;
    }

    $('#pwindow').jqxWindow('close');
}


$(function() {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});