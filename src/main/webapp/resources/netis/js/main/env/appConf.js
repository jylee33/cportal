var $grpTreeGrid, $appGrid;
var _editRows = [];
var _grpNo=0;
var grpData=null;
var Main = {
		/** variable */
		initVariable : function() {
			$grpTreeGrid = $('#grpTreeGrid'), $appGrid = $('#appGrid');
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
			case 'btnAdd_app': this.addApp(); break;
			case 'btnDel_app': this.delApp(); break;
			case 'btnSave_app': this.saveApp(); break;
			case 'btnSearch_app': this.searchApp(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
		
			/*	APP 그룹 그리드	*/
			HmGrid.create($grpTreeGrid, {
				source: new $.jqx.dataAdapter(
						{ 
							datatype: 'json',
							url: ctxPath + '/grp/getAppGrpTreeList.do'
						},
						{
							formatData: function(data) {
								$.extend(data, {
									isContainTop: 'false'
								});
								return data;
							}
						}
				),
				selectionmode: 'singlerow',
			    ready : function() {
					var uid = null;
					var rows = $grpTreeGrid.jqxGrid('getrows');
				//	alert(JSON.stringify(rows[0]));
					if (rows != null && rows.length > 0) {
						uid = rows[0].uid;
					};
					if (uid != null) {
						$grpTreeGrid.jqxGrid('selectrow', uid);
					};
				},
				columns: 
				[
				 	{ text: '그룹번호', dataField: 'grpNo' , hidden: true },
				 	{ text: '그룹명', dataField: 'grpName' },
		            { text: '유해여부', dataField: 'isLeaf',  columntype: 'checkbox',width: '80' },
		            { text: 'IP', datafield: 'devIp', hidden: true }
				]
			});
			$grpTreeGrid.on('rowselect', function (event) {
				var tmp=event.args.rowindex
				//alert("tmp : "+tmp);
				grpData = $grpTreeGrid.jqxGrid('getrowdatabyid', tmp);
				//alert(JSON.stringify(data));
				_grpNo =grpData.grpNo;
				Main.searchApp();
			 });
			/*	APP 설정 그리드	*/
			HmGrid.create($appGrid, {
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
				 	{ text: '그룹번호',	datafield: 'grpNo',			hidden: true },
				 	{ text: '서비스번호',	datafield: 'serviceNo',	hidden: true },
				 	{ text: '업무명',	datafield: 'name' ,	width: '35%'},
				 	{ text : 'PROTOCOL', datafield : 'protocol', displayfield: 'protocolStr', width: '25%', columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							var s = [
							         	{ label: 'ALL',	value: 0 },
							         	{ label: 'TCP',	value: 6 },
							         	{ label: 'UDP',	value: 17 }
							         ];
							editor.jqxDropDownList({ source: s, autoDropDownHeight: true, displayMember: 'label', valueMember: 'value' });
						} 
					},
				 	{ text: '포트번호', datafield: 'port', cellsalign: 'right', width: '25%' , columntype: 'numberinput',
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
				 	{ text: 'PROFILE',	datafield: 'profile', columntype: 'checkbox',	width: '15%' }
				]
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** App 그룹 */
		addGrp: function() {
			HmWindow.create($('#pwindow'), 400, 150);
			$.get(ctxPath + '/main/popup/env/pAppGrpAdd.do', function(result) {
				HmWindow.open($('#pwindow'), 'APP그룹 등록', result, 400, 150);
			});
		},
		
		editGrp: function() {
			if(grpData === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			HmWindow.create($('#pwindow'), 400, 150);
			$.post(ctxPath + '/main/popup/env/pAppGrpEdit.do', 
					{ grpNo: grpData.grpNo, grpName: grpData.grpName, isLeaf: grpData.isLeaf },
					function(result) {
						HmWindow.open($('#pwindow'), 'APP그룹 수정', result, 400, 150);
					}
			);
		},
		
		delGrp: function() {
			if(grpData === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			if(!confirm('[' + grpData.grpName + '] 그룹을 삭제하시겠습니까?')) return;
			
			Server.post('/grp/delAppGrp.do', {
				data: { grpNo: grpData.grpNo },
				success: function(result) {
					try {
						$grpTreeGrid.jqxGrid('deleterow', grpData.uid);
						$grpTreeGrid.jqxGrid('selectRow', $grpTreeGrid.jqxGrid('getrows')[0].uid);
					} catch(e) {}
					alert('삭제되었습니다.');
				}
			});
		},
		
		/** 서비스 설정 */
		searchApp: function() {
			HmGrid.updateBoundData($appGrid, ctxPath + '/main/env/appConf/getCfgServiceList.do');
		},
		
		addApp: function() {
			if(grpData === null) {
				alert('그룹을 선택해주세요.');
				return;
			}
			HmWindow.create($('#pwindow'),280, 242);
			$.post(ctxPath + '/main/popup/env/pCfgAppAdd.do', 
					{ grpNo: grpData.grpNo, grpName: grpData.grpName },
					function(result) {
						HmWindow.open($('#pwindow'), 'APP등록', result, 280, 242);
					}
			);
		},
		
		delApp: function() {
			var rowIdxes = HmGrid.getRowIdxes($appGrid, 'APP를 선택해주세요.');
			if(rowIdxes === false) return;
			if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
			var _serviceNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var tmp = $appGrid.jqxGrid('getrowdata', value);
				_serviceNos.push(tmp.serviceNo);
				_uids.push(tmp.uid)
			});
			
			Server.post('/main/env/appConf/delCfgService.do', {
				data: { serviceNos: _serviceNos },
				success: function(result) {
					$appGrid.jqxGrid('deleterow', _uids);
					alert('삭제되었습니다.');
				}
			});
		},
		
		saveApp: function() {
			HmGrid.endRowEdit($appGrid);
			if(editRowIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editRowIds, function(idx, value) {
				_list.push($appGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/appConf/saveCfgService.do', {
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