var $ip_grpTree, $ip_subnetGrid, editSubnetIds = [];
var $if_grpTree, $if_devGrid, $if_ifGrid, $if_ifGrpTree, $if_confGrid;
var $dev_grpTree, $dev_devGrid, $dev_sGrpTree, $dev_confGrid;
var editDevIds = []
var Main = {
		/** variable */
		initVariable: function() {
			$ip_grpTree = $('#ip_grpTree'), $ip_subnetGrid = $('#ip_subnetGrid');
			$if_grpTree = $('#if_grpTree'), $if_devGrid = $('#if_devGrid'), $if_ifGrid = $('#if_ifGrid');
			$if_ifGrpTree = $('#if_ifGrpTree'), $if_confGrid = $('#if_confGrid');
			$dev_grpTree = $('#dev_grpTree'), $dev_devGrid = $('#dev_devGrid'), $dev_sGrpTree = $('#dev_sGrpTree'), $dev_confGrid = $('#dev_confGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('#btnIf_move, #btnDev_move').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {

			case 'btnDev_move': this.addDevToSGrp(); break;
			case 'btnDel_sGrpConf': this.delSGrpConf(); break;
			}
		},

		/** init design */
		initDesign: function() {
			HmWindow.create($('#pwindow'), 100, 100);
			$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {
                    $('#dev_mainSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', theme: jqxTheme, panels: [{ size: '50%' }, { size: '50%' }] });
                    //$('#dev_tSplitter, #dev_bSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', showSplitBar: false, panels: [{ size: '230px', min: 150 }, { size: '100%' }] });
                    $('#dev_tSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', showSplitBar: false, panels: [{ size: '230px', min: 150 }, { size: '100%' }] });
                    HmTreeGrid.create($dev_grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDev2, null,  ['grpName']);
                    
                    HmTreeGrid.create($dev_sGrpTree, HmTree.T_GRP_SEARCH, Main.searchSGrpConf, null,  ['grpName']); //아래 좌측 조회그룹 그리는 영역
                    HmGrid.create($dev_devGrid, {
                        source: new $.jqx.dataAdapter(
                            {
                                datatype: 'json',
                                data: { autoCheckYn: 'Y' }, //기존 권한 그룹 쿼리 구분값 is_main 컬럼 사용 여부
                                url: '/main/env/grpMgmt/getSearchDefaultDevList.do'
                            },
                            {
                                formatData: function(data) {
                                	// 조회 그룹 정보
                                    var sgrpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
                                    if (sgrpSelection !== undefined && sgrpSelection.length == 1) {
                                        var _sgrpNo = sgrpSelection.length == 0? 0 : sgrpSelection[0].grpNo;
                                        // 선택의 최상위 그룹번호를 가져온다
                                        var _topGrpNo = _sgrpNo;
                                        var _curSelection = sgrpSelection[0];
                                        var level = _curSelection.level;
                                        for (var i=0; i <= level; i--) {
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
                                    console.log($dev_grpTree.jqxTreeGrid('getSelection'))
                                    var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
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
                        columns:
                            [
                                { text : '그룹명', datafield: 'grpName', width: 120 },
                                { text : '장비명', datafield: 'disDevName', minwidth: 150 },
                                { text : 'IP', datafield: 'devIp', width: 120 },
                                { text : 'devKind1', datafield: 'devKind1', hidden: true },
                                { text : '장비종류', datafield: 'disDevKind1', width: 90 },
                                { text : '종류', datafield: 'devKind2', width: 130 },
                                { text : '모델', datafield: 'model', width: 150 },
                                { text : '제조사', datafield: 'vendor', width: 150 }
                            ]
                    }, CtxMenu.COMM, "4");
                    
                    HmGrid.create($dev_confGrid, {
            			source: new $.jqx.dataAdapter(
            				{
            					datatype: 'json',
            					datafields: [
            					      { name: 'grpName', type: 'string'},
            					      { name: 'disDevName', type: 'string'},
            					      { name: 'devIp', type: 'string'},
            					      { name : 'mngNo', type: 'int' },
            					      { name: 'disDevKind1', type: 'string'},
            					      { name: 'devKind2', type: 'string'},
            					      { name: 'model', type: 'string'},
            					      { name: 'vendor', type: 'string'}
            					 ],
            					url: ctxPath + '/main/env/grpMgmt/getSettingAutoCheckDev.do',
            					updaterow: function(rowid, rowdata, commit) {
            						if(editDevIds.indexOf(rowid) == -1)
            							editDevIds.push(rowid);
            							commit(true);
            		            },
            				},
            				{
            					formatData: function(data) {
            						data.grpNo = 10;
            						data.check = false;
            						return data;
            					}
            				}
            			),
            			showtoolbar: true,
            		    editable: true,
            		    selectionmode: 'multiplerowsextended',
            			columns: 
            			[
            				{ text : '그룹명', datafield : 'grpName', width: '10%', editable: false },
            				{ text : '장비명', datafield: 'disDevName', width: '20%' },
            				{ text : 'IP', datafield: 'devIp', width: '15%' },
                            { text : '장비종류', datafield: 'disDevKind1', width: '10%' },
                            { text : '종류', datafield: 'devKind2', width: '15%' },
                            { text : '모델', datafield: 'model', width: '15%' },
                            { text : '제조사', datafield: 'vendor', width: '15%' }
            		    ]
            		});
				}
			});
		},

		/** init data */
		initData: function() {

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
					alert('삭제되었습니다.');
				}
			});
		},

		searchDev: function() {
			HmGrid.updateBoundData($if_devGrid);
		},

		/** 회선그룹 */
		addIfGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($if_ifGrpTree);
			$.get(ctxPath + '/main/popup/env/pIfGrpAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '회선그룹 등록', result, 400, 480, 'pwindow_init', treeItem.grpNo);
			});
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
					alert('저장되었습니다.');
				}
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
		
		addDevToSGrp: function() { //대상장비 설정
			var rowIdxes = HmGrid.getRowIdxes($dev_devGrid, '장비를 선택해주세요.');
			if(rowIdxes === false) return;

            var grpSelection = $dev_sGrpTree.jqxTreeGrid('getSelection');
            var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
            var _grpParent = grpSelection.length == 0? 0 : grpSelection[0].grpParent;
            var _grpName = grpSelection.length == 0? 0 : grpSelection[0].grpName;
            
            var rowdata = $dev_devGrid.jqxGrid('getrowdata', rowIdxes);
            console.log(rowdata) 
            
            /*if (_grpParent === 0) {
            	alert('분류그룹에는 추가할 수 없습니다.');
            	return;
			}*/

			var rows = $dev_confGrid.jqxGrid('getboundrows');
			var _list = [];
			$.each(rowIdxes, function(idx, value) {
				_list.push($dev_devGrid.jqxGrid('getrowdata', value));
			});
			Server.post('/main/env/grpMgmt/updateAutoCheckDev.do', {
				data: {list: _list },
				success: function(data) {
					Main.searchSGrpConf()
					alert('추가되었습니다.');
				}
			});
		},

		searchSGrpConf: function() {
			HmGrid.updateBoundData($dev_confGrid);
            HmGrid.updateBoundData($dev_devGrid);
		},

		delSGrpConf: function() { //대상그룹 삭제
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
			console.log(_list)
			Server.post('/main/env/grpMgmt/delAutoCheckDev.do', {
				data: {grpNo: _grpNo, list: _list },
				success: function(result) {
					Main.searchSGrpConf()
					alert('삭제되었습니다.');
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
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});