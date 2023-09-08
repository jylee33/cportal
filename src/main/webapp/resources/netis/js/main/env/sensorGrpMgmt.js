var $grpTree, $devGrid, $sensorGrid;
var $sensorGrpTree, $confGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#grpTree'), $devGrid = $('#devGrid'), $sensorGrid = $('#sensorGrid');
			$sensorGrpTree = $('#sensorGrpTree'), $confGrid = $('#confGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd_grp': this.addSensorGrp(); break;
			case 'btnEdit_grp': this.editSensorGrp(); break;
			case 'btnDel_grp': this.delSensorGrp(); break;
			case 'btn_move': this.moveSensorToConf(); break;			
			case 'btnSearch_conf': this.searchConf(); break;
			case 'btnDel_conf': this.delConf(); break;
			case 'btnSave_conf': this.saveConf(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#pwindow'), 100, 100);
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmJqxSplitter.create($('#tSplitter, #bSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 285, min: 150, collapsible: false }, { size: '100%' }], 'auto', '100%', {showSplitBar: false});
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEF_ALL, Main.searchDev);

			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/dev/getDevList.do'
						},
						{
							formatData: function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($grpTree);
								var _grpNo = 0;
								if(treeItem !== null) {
									_grpNo = treeItem.grpNo;
								}
								$.extend(data, {
									grpType: 'SENSOR',
									grpNo: _grpNo,
									devKind2: 'RTU'
								});
								return data;
							}
						}
				),
				width: '49.5%',
				columns:
				[
					{ text : '장비명', datafield: 'disDevName', width: '60%' },
					{ text : 'IP', datafield: 'devIp', width: '20%' },
					{ text : '종류', datafield: 'devKind2', width: '20%', filtertype: 'checkedlist' }
				]
			});
			$devGrid.on('rowdoubleclick', function(event) {
				Main.searchSensor();
			});
			
			HmGrid.create($sensorGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var _grpNo = -1, _mngNo = -1;
								var treeItem = HmTreeGrid.getSelectedItem($grpTree);
								if(treeItem !== null) {
									_grpNo = treeItem.grpNo;
								}
								var rowIdx = HmGrid.getRowIdx($devGrid);
								if(rowIdx !== false) _mngNo = $devGrid.jqxGrid('getrowdata', rowIdx).mngNo;
								$.extend(data, {
									grpNo: _grpNo,
									mngNo: _mngNo
								});
								return data;
							}
						}
				),
				width: '50%',
				selectionmode: 'multiplerowsextended',
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
					{ text : '장비명', datafield: 'devName', width: '20%' },
					{ text : 'Sensor명', datafield: 'sensorName', width: '20%' },
					{ text : 'Model', datafield: 'sensorModel', width: '20%', filtertype: 'checkedlist' },
					{ text : '종류', datafield: 'sensorKind', width: '20%', filtertype: 'checkedlist' },
					{ text : '설비명', datafield: 'usrName', width: '20%' }
				]
			});
			
			HmTreeGrid.create($sensorGrpTree, HmTree.T_GRP_SENSOR, Main.searchConf);
			HmGrid.create($confGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							id: 'fmsSeqNo'
						},
						{
							formatData: function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($sensorGrpTree);
								data.grpNo = treeItem !== null? treeItem.grpNo : -1;
								return data;
							}
						}
				),
				selectionmode: 'multiplerowsextended',
				columns:
				[
					{ text : '장비명', datafield: 'devName', width: '20%' },
					{ text : 'Sensor명', datafield: 'sensorName', width: '20%' },
					{ text : 'Model', datafield: 'sensorModel', width: '20%', filtertype: 'checkedlist' },
					{ text : '종류', datafield: 'sensorKind', width: '20%', filtertype: 'checkedlist' },
					{ text : '설비명', datafield: 'usrName', width: '20%' }
				]
			});
		},
		
		/** init data */
		initData: function() {

		},
		
		/** AP그룹 */
		addSensorGrp: function() {
			$.get(ctxPath + '/main/popup/env/pSensorGrpAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '그룹 등록', result, 400, 475);
			});	
		},
		
		editSensorGrp: function() {
			var grpSelection = $sensorGrpTree.jqxTreeGrid('getSelection');
			if(grpSelection.length == 0) {
				alert('그룹을 선택해주세요.');
				return;
			}
			var treeItem = grpSelection[0];
			if(treeItem.level == 0) {
				alert('최상위 그룹을 수정할 수 없습니다.');
				return;
			}
			$.post(ctxPath + '/main/popup/env/pSensorGrpEdit.do',
					{ grpNo: treeItem.grpNo, grpName: treeItem.grpName, grpParent: treeItem.grpParent },
					function(result) {
						HmWindow.open($('#pwindow'), '그룹 수정', result, 400, 500);
					}
			);
		},
		
		delSensorGrp: function() {
			var grpSelection = $sensorGrpTree.jqxTreeGrid('getSelection');
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
			Server.post('/grp/delSensorGrp.do', {
				data: { grpNo: treeItem.grpNo },
				success: function(result) {
					$sensorGrpTree.jqxTreeGrid('deleteRow', treeItem.uid);
					$sensorGrpTree.jqxTreeGrid('selectRow', $sensorGrpTree.jqxTreeGrid('getRows')[0].uid);
					alert('삭제되었습니다.');
				}
			});
		},
		
		searchDev: function() {
			HmGrid.updateBoundData($devGrid);
		},
		
		searchSensor: function() {
			HmGrid.updateBoundData($sensorGrid, ctxPath + '/main/env/sensorGrpMgmt/getSensorList.do');
		},
		
		moveSensorToConf: function() {
			var treeItem = HmTreeGrid.getSelectedItem($sensorGrpTree);
			if(treeItem === null) {
				alert('Sensor그룹을 선택해주세요.');
				return;
			}
			var rowIdxes = HmGrid.getRowIdxes($sensorGrid, 'Sensor를 선택해주세요.');
			if(rowIdxes === false) return;
			var list = [], newIds = [];
			for(var i = 0; i < rowIdxes.length; i++) {
				var tmp = $sensorGrid.jqxGrid('getrowdata', rowIdxes[i]);

				var newId = tmp.fmsSeqNo;
				if($confGrid.jqxGrid('getrowdatabyid', newId) === undefined) {
					newIds.push(newId);
					list.push({ mngNo: tmp.mngNo, fmsSeqNo: tmp.fmsSeqNo, grpNo: treeItem.grpNo, devName: tmp.devName, sensorName: tmp.sensorName, sensorModel: tmp.sensorModel, sensorKind: tmp.sensorKind, usrName: tmp.usrName });
				}
			}
			$confGrid.jqxGrid('addrow', null, list);
		},
		
		searchConf: function() {
			HmGrid.updateBoundData($confGrid, ctxPath + '/main/env/sensorGrpMgmt/getSensorConfList.do');
		},
		
		delConf: function() {
			var rowIdxes = HmGrid.getRowIdxes($confGrid, '데이터를 선택해주세요.');
			if(rowIdxes === false) return;
			if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
			var _list = [];
			$.each(rowIdxes, function(idx, value) {
				_list.push($confGrid.jqxGrid('getrowdata', value));
			});

			Server.post('/main/env/sensorGrpMgmt/delCfgSensor.do', {
				data: { list: _list },
				success: function(result) {
					var delIds = [];
					$.each(rowIdxes, function(idx, value) {
						delIds.push($confGrid.jqxGrid('getrowid', value));
					});
					$confGrid.jqxGrid('deleterow', delIds);
					alert('삭제되었습니다.');
				}
			});

		},
		
		saveConf: function() {
			var treeItem = HmTreeGrid.getSelectedItem($sensorGrpTree);
			if(treeItem === false) {
				alert('Sensor그룹을 선택해주세요.');
				return;
			}
			var _grpNo = treeItem.grpNo;
			var _list = $confGrid.jqxGrid('getboundrows');
			if(_list.length == 0){
				alert('저장할 데이터가 없습니다.');
				return;
			}
			Server.post('/main/env/sensorGrpMgmt/saveCfgSensor.do', {
				data: { grpNo: _grpNo, list: _list },
				success: function(result) {
					HmGrid.updateBoundData($confGrid);
					alert('저장되었습니다.');
				}
			});
		}
		
};

function refreshGrp() {
	HmTreeGrid.updateData($sensorGrpTree, HmTree.T_GRP_SENSOR);
}

function addGrpResult(addData, type) {
	HmTreeGrid.updateData($sensorGrpTree, HmTree.T_GRP_SENSOR);
	$('#pwindow').jqxWindow('close');
}

function editGrpResult(addData, type) {
	HmTreeGrid.updateData($sensorGrpTree, HmTree.T_GRP_SENSOR);
	$('#pwindow').jqxWindow('close');
}


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});