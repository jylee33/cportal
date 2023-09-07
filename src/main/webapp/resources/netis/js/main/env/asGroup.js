var $grpTreeGrid, $asGrid;
var _editRows = [];

var Main = {
		/** variable */
		initVariable : function() {
			$grpTreeGrid = $('#grpTreeGrid'), $asGrid = $('#asGrid');
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
			case 'btnAdd_as': this.addAs(); break;
			case 'btnDel_as': this.delAs(); break;
			case 'btnSave_as': this.saveAs(); break;
			case 'btnSearch_as': this.searchAs(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmGrid.create($asGrid, {
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
				 	{ text: '그룹명',	datafield: 'grpNo',			hidden: true },
				 	{ text: 'AS명',		datafield: 'asName',			width: '35%' },
				 	{ text: '국가명',	datafield: 'nameLong',		width: '25%' },
				 	{ text: '국가명약어', datafield: 'nameShort',	width: '15%', 
				 		validation: function(cell, value) {
							if(value.toString().length > 2) {
								return { result: false, message: ' 국가명 약어는 0~1 글자 사이의 값을 입력해주세요.' };
							}
							return true;
						}
				 	},
				 	{ text: '국가번호', datafield: 'asNo', cellsalign: 'right', width: '25%' , editable: false , columntype: 'numberinput',
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
			
			HmTreeGrid.create($grpTreeGrid, HmTree.T_GRP_AS, Main.searchAs, {isContainTop: 'false'}, ['grpName']);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** As 그룹 */
		addGrp: function() {
			$.get(ctxPath + '/main/popup/env/pAsGrpAdd.do', function(result) {
				HmWindow.open($('#pwindow'), 'AS그룹 등록', result, 400, 120);
			});
		},
		
		editGrp: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
			if(treeItem === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			$.post(ctxPath + '/main/popup/env/pAsGrpEdit.do', 
					{ grpNo: treeItem.grpNo, grpName: treeItem.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), 'AS그룹 수정', result, 400, 120);
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
			
			Server.post('/grp/delAsGrp.do', {
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
		searchAs: function() {
			HmGrid.updateBoundData($asGrid, ctxPath + '/main/env/asGroup/getCfgServiceList.do');
		},
		
		addAs: function() {
			var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
			if(treeItem === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			HmWindow.create($('#pwindow'),280, 242);
			$.post(ctxPath + '/main/popup/env/pCfgAsAdd.do', 
					{ grpNo: treeItem.grpNo, grpName: treeItem.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), 'AS 등록', result, 280, 242);
					}
			);
		},
		
		delAs: function() {
			var rowIdxes = HmGrid.getRowIdxes($asGrid, 'AS를 선택해주세요.');
			if(rowIdxes === false) return;
			if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
			var _serviceNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var tmp = $asGrid.jqxGrid('getrowdata', value);
				_serviceNos.push(tmp.asNo);
				_uids.push(tmp.uid)
			});
			
			Server.post('/main/env/asGroup/delCfgService.do', {
				data: { serviceNos: _serviceNos },
				success: function(result) {
					$asGrid.jqxGrid('deleterow', _uids);
					alert('삭제되었습니다.');
				}
			});
		},
		
		saveAs: function() {
			HmGrid.endRowEdit($asGrid);
			if(editRowIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editRowIds, function(idx, value) {
				_list.push($asGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/asGroup/saveCfgService.do', {
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