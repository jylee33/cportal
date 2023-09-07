var $grpTreeGrid, $svcGrid;
var _editRows = [];

var Main = {
		/** variable */
		initVariable : function() {
			$grpTreeGrid = $('#grpTreeGrid'), $svcGrid = $('#svcGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case 'btnAdd_grp': this.addGrp(); break;
			case 'btnEdit_grp': this.editGrp(); break;
			case 'btnDel_grp': this.delGrp(); break;
			case 'btnAdd_svc': this.addSvc(); break;
			case 'btnDel_svc': this.delSvc(); break;
			case 'btnSave_svc': this.saveSvc(); break;
			case 'btnSearch_svc': this.searchSvc(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmGrid.create($svcGrid, {
				source: new $.jqx.dataAdapter(
						{ 
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(editRowIds.indexOf(rowid) == -1)
									editRowIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							formatData: function(data) {
								var _grpNo = 0;
								var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
								if(treeItem != null) {
									_grpNo = treeItem.grpNo;
								}
								$.extend(data, {
									grpNo: _grpNo
								});
								return data;
							},
							loadComplete: function(records) {
								editRowIds = [];
							}
						}
				),
				selectionmode: 'multiplerowsextended',
			    editable: true,
			    editmode: 'selectedrow',
				columns: 
				[
				 	{ text: '시작IP', datafield: 'fromIp', width: '20%',
				 		validation: function(cell, value) {
				 			var result = $.validateIp(value);
				 			if(result === false) {
				 				return { result: false, message: 'IP형식이 유효하지 않습니다.' };
				 			}
							return true;
						}
				 	},
				 	{ text: '끝IP', datafield: 'toIp', width: '20%',
				 		validation: function(cell, value) {
				 			var result = $.validateIp(value);
				 			if(result === false) {
				 				return { result: false, message: 'IP형식이 유효하지 않습니다.' };
				 			}
							return true;
						}
				 	},
				 	{ text: '프로토콜', datafield: 'protocol', displayfield: 'protocolStr', width: '20%', columntype: 'dropdownlist',
				 		createeditor: function(row, value, editor) {
							var s = [
							         	{ label: 'ALL', value: 0 },
							         	{ label: 'TCP', value: 6 },
							         	{ label: 'UDP', value: 17 }
							         ];
							editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
						}
				 		
				 	},
				 	{ text: '시작PORT', datafield: 'fromPort', cellsalign: 'right', width: '20%', columntype: 'numberinput',
						initeditor: function(row, cellvalue, editor) {
							editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
						},
						validation: function(cell, value) {
							if(value.toString().length > 5) {
								return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
							}
							return true;
						}
			 		},
				 	{ text: '끝PORT', datafield: 'toPort', cellsalign: 'right', width: '20%', columntype: 'numberinput',
						initeditor: function(row, cellvalue, editor) {
							editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
						},
						validation: function(cell, value) {
							if(value.toString().length > 5) {
								return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
							}
							return true;
						}
					}
				]
			}, CtxMenu.COMM);
			
			HmTreeGrid.create($grpTreeGrid, HmTree.T_GRP_SERVICE, Main.searchSvc, {isContainTop: 'false'}, [ 'grpName']);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 서비스 그룹 */
		addGrp: function() {
			$.get(ctxPath + '/main/popup/env/pSvcGrpAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '서비스그룹 등록', result, 400, 120);
			});
		},
		
		editGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
			if(treeItem === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			$.post(ctxPath + '/main/popup/env/pSvcGrpEdit.do', 
					{ grpNo: treeItem.grpNo, grpName: treeItem.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), '서비스그룹 수정', result, 400, 120);
					}
			);
		},
		
		delGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
			if(treeItem === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			if(!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?')) return;
			
			Server.post('/grp/delServiceGrp.do', {
				data: { grpNo: treeItem.grpNo },
				success: function(result) {
					try {
						$grpTreeGrid.jqxTreeGrid('deleteRow', treeItem.uid);
						$grpTreeGrid.jqxTreeGrid('selectRow', $grpTreeGrid.jqxTreeGrid('getSelection')[0].uid);
					} catch(e) {}
					alert('삭제되었습니다.');
				}
			});
		},
		
		/** 서비스 설정 */
		searchSvc: function() {
			HmGrid.updateBoundData($svcGrid, ctxPath + '/main/env/workGroup/getCfgServiceList.do');
		},
		
		addSvc: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
			if(treeItem === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			HmWindow.create($('#pwindow'), 400, 220);
			$.post(ctxPath + '/main/popup/env/pCfgSvcAdd.do', 
					{ grpNo: treeItem.grpNo, grpName: treeItem.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), '서비스 등록', result, 400, 235);
					}
			);
		},
		
		delSvc: function() {
			var rowIdxes = HmGrid.getRowIdxes($svcGrid, '서비스를 선택해주세요.');
			if(rowIdxes === false) return;
			if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
			var _serviceNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var tmp = $svcGrid.jqxGrid('getrowdata', value);
				_serviceNos.push(tmp.serviceNo);
				_uids.push(tmp.uid)
			});
			
			Server.post('/main/env/workGroup/delCfgService.do', {
				data: { serviceNos: _serviceNos },
				success: function(result) {
					$svcGrid.jqxGrid('deleterow', _uids);
					alert('삭제되었습니다.');
				}
			});
		},
		
		saveSvc: function() {
			HmGrid.endRowEdit($svcGrid);
			if(editRowIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editRowIds, function(idx, value) {
				_list.push($svcGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/workGroup/saveCfgService.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editRowIds = [];
				}
			});
		}
		
	};

function addGrpResult(type) {
	HmTreeGrid.updateData($grpTreeGrid, type);
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});