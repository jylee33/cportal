var $sensorGrid, $grpTreeGrid, $devGrid, $confGrid;
var curEngNo = 0;
var editSensorIds = [], editConfIds = [];

var Main = {
		/** variable */
		initVariable: function() {
			$sensorGrid = $('#sensorGrid'), $grpTreeGrid = $('#grpTreeGrid'), $devGrid = $('#devGrid'), $confGrid = $('#confGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnAdd_sensor': this.addSensor(); break;
			case 'btnDel_sensor': this.delSensor(); break;
			case 'btnSave_sensor': this.saveSensor(); break;
			case 'btnSearch_sensor': this.searchSensor(); break;
			case 'btnMove': this.addDevToConf(); break;
			case 'btnDel_cfg': this.delConfig(); break;
			case 'btnSave_cfg': this.saveConfig(); break;
			case 'btnSearch_cfg': this.searchConfig(); this.searchDev(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#pwindow'), 100, 100);
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%');
			HmJqxSplitter.create($('#vSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 230, min: 150, collapsible: false }, { size: '100%' }]);
			HmJqxSplitter.create($('#v2Splitter'), HmJqxSplitter.ORIENTATION_V,[{ size: 650, collapsible: false }, { size: '100%' }], '100%', '100%', {showSplitBar: false});
			HmGrid.create($sensorGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/env/collectorConf/getCfgSensorList.do',
							updaterow: function(rowid, rowdata, commit) {
								if(editSensorIds.indexOf(rowid) == -1)
									editSensorIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							loadComplete: function(records) {
								editSensorIds = [];
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '수집기');
			    },
			    editable: true,
				editmode: 'selectedrow',
			    pageable: false,
				columns: 
				[
					{ text : '이름', datafield : 'engName', width: 220 },
					{ text : 'IP', datafield : 'engIp', width : 120,
						validation: function(cell, value) {
							if(!$.validateIp(value)) {
								return { result: false, message: 'IP형식이 유효하지 않습니다.' };
							}
							return true;
						 }
					 },
					{ text : 'Flow종류', datafield : 'flowType', width: 130, columntype: 'dropdownlist', 
						 createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: [ 'NONE', 'All', 'sFlow', 'NetFlow'], autoDropDownHeight: true });
						}
					},
					{ text : 'Flow버전', datafield : 'flowVer', width : '130', cellsalign: 'right', columntype: 'numberinput', 
						initeditor: function(row, cellvalue, editor) {
							 editor.jqxNumberInput({ decimalDigits: 0, min: 0, inputMode: 'simple' });
						 },
						 validation: function(cell, value) {
							if(value < 0) {
								return { result: false, message: '0이상의 값을 입력해주세요.' };
							}
							return true;
						 }
					},
					{ text : 'Flow수집포트', datafield : 'flowPort', width : 130, cellsalign: 'right', columntype: 'numberinput', 
						 initeditor: function(row, cellvalue, editor) {
							 editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999, inputMode: 'simple' });
						 },
						 validation: function(cell, value) {
							if(value < 0 || value > 99999) {
								return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
							}
							return true;
						 }
					},
					{ text : '원격전송포트', datafield : 'remotePort', width : 130, cellsalign: 'right', columntype: 'numberinput', 
						 initeditor: function(row, cellvalue, editor) {
							 editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999, inputMode: 'simple' });
						 },
						 validation: function(cell, value) {
							if(value < 0 || value > 99999) {
								return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
							}
							return true;
						 }
					},
					{ text : '파일저장폴더', datafield : 'fileFolder', minwidth : 150,
						validation: function(cell, value) {
							if($.isBlank(value)) {
								return { result: false, message: '파일저장폴더에 값을 입력해주세요.' };
							}
							return true;
						 }
					},
					{ text : '라이센스', datafield : 'license', width: 250 }
			    ]
			});
			$sensorGrid.on('bindingcomplete', function() {
				$sensorGrid.jqxGrid('selectrow', 0);
			})
			.on('rowselect', function(event) {
				curEngNo = event.args.row.engNo;
				Main.searchDev();
				Main.searchConfig();
			});

			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var _grpNo = 0;
								var treeItem = HmTreeGrid.getSelectedItem($grpTreeGrid);
								if(treeItem !== null) {
									_grpNo = treeItem.grpNo;
								}
								$.extend(data, {
									grpNo: _grpNo,
									engNo: curEngNo
								});
								return data;
							}
						}
				),
				showtoolbar: true,
				selectionmode: 'multiplerowsextended',
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '미설정 장비');
			    },
			    columns: 
				[
					 { text : '장비명', datafield : 'disDevName', minwidth: 150 },
					 { text : '장비IP', datafield : 'devIp', width: 120 },
					 { text : '장비종류', datafield : 'devKind2', width: 120, filtertype: 'checkedlist' },
					 { text : '제조사', datafield : 'vendor', width: 120, filtertype: 'checkedlist' },
					 { text : 'Community', datafield : 'community', width: 120 }
				]						
			});

			HmGrid.create($confGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(editConfIds.indexOf(rowid) == -1)
									editConfIds.push(rowid);
				            	commit(true);
				            },
				            addrow: function(rowid, rowdata, position, commit) {
				            	$.each(rowid, function(idx, value) {
				            		editConfIds.push(value);
				            	})
				            	commit(true);
				            }
						},
						{
							formatData: function(data) {
								$.extend(data, {
									engNo: curEngNo
								});
								return data;
							},
							loadComplete: function(records) {
								editConfIds = [];
							}
						}
				),
				showtoolbar: true,
				rendertoolbar: function(toolbar) {
					HmGrid.titlerenderer(toolbar, '샘플링 설정');
				},
				editable: true,
				editmode: 'selectedrow',
				selectionmode: 'multiplerowsextended',
			    pageable: false,
				columns: 
				[
					 { text : '장비명', datafield : 'disDevName', minwidth: 150, editable: false },
					 { text : '장비IP', datafield : 'devIp', width: 120, editable: false },
					 { text : 'Community', datafield : 'community', width: 130, editable: false },
					 { text : '샘플링비율', datafield : 'sampleRate', width: 130, cellsalign: 'right', columntype: 'numberinput', 
						 initeditor: function(row, cellvalue, editor) {
							 editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 99999, inputMode: 'simple' });
						 }
					 }
				 ]
			});
			
			HmTreeGrid.create($grpTreeGrid, HmTree.T_GRP_DEF_ALL, Main.searchDev, null, ['grpName']);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 수집기 */
		addSensor: function() {
			$.post(ctxPath + '/main/popup/env/pSensorAdd.do', function(result) {
				HmWindow.openFit($('#pwindow'), '수집기  등록', result, 410, 280);
			});
		},
		
		delSensor: function() {
			var rowIdx = HmGrid.getRowIdx($sensorGrid, '데이터를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $sensorGrid.jqxGrid('getrowdata', rowIdx);
			if(!confirm('[' + rowdata.engName + '] 수집기를 삭제하시겠습니까?')) return;
			Server.post('/main/env/collectorConf/delCfgSensor.do', {
				data: { engNo: rowdata.engNo },
				success: function(result) {
					$sensorGrid.jqxGrid('deleterow', rowdata.uid);
					alert('삭제되었습니다.')
				}
			});
		},
		
		saveSensor: function() {
			HmGrid.endRowEdit($sensorGrid);
			if(editSensorIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			
			var _list = [];
			$.each(editSensorIds, function(idx, value) {
				_list.push($sensorGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/collectorConf/saveCfgSensor.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editSensorIds = [];
				}
			});
		},
		
		searchSensor: function() {
			HmGrid.updateBoundData($sensorGrid);
		},
		
		/** 하단 설정 */
		searchConfig: function() {
			HmGrid.updateBoundData($confGrid, ctxPath + '/main/env/collectorConf/getSetDevList.do');
		},
		
		searchDev: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/env/collectorConf/getUnsetDevList.do');
		},
		
		addDevToConf: function() {
			var rowIdx = HmGrid.getRowIdx($sensorGrid, '수집기를 선택해주세요.');
			if(rowIdx === false) return;
			
			var _engNo = $sensorGrid.jqxGrid('getrowdata', rowIdx).engNo;
			var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
			if(rowIdxes === false) return;
			var rows = $confGrid.jqxGrid('getboundrows');
			var _list = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var rowdata = $devGrid.jqxGrid('getrowdata', value);
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
					rowdata.engNo = _engNo;
					_list.push(rowdata);
					_uids.push(rowdata.uid);
				}
			});
			$devGrid.jqxGrid('deleterow', _uids);
			$confGrid.jqxGrid('addrow', null, _list);
		},
		
		delConfig: function() {
			var rowIdxes = HmGrid.getRowIdxes($confGrid, '데이터를 선택해주세요.');
			if(rowIdxes === false) return;
			if(!confirm('[' + rowIdxes.length + '] 건의 설정을 해제하시겠습니까?')) return;
			var _mngNos = [], _uids = [], _list = [];
			$.each(rowIdxes, function(idx, value) {
				var tmp = $confGrid.jqxGrid('getrowdata', value);
				_mngNos.push(tmp.mngNo);
				_uids.push(tmp.uid);
				_list.push(tmp);
			});
			Server.post('/main/env/collectorConf/delSensorDev.do', {
				data: { mngNos: _mngNos },
				success: function(result) {
					$confGrid.jqxGrid('deleterow', _uids);
					$devGrid.jqxGrid('addrow', null, _list);
					alert('설정이 해제되었습니다.')
				}
			});
		},
		
		saveConfig: function() {
			HmGrid.endRowEdit($confGrid);
			if(editConfIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			
			var rowIdx = HmGrid.getRowIdx($sensorGrid, '선택된 수집기가 없습니다.');
			if(rowIdx === false) return;
			var _engNo = $sensorGrid.jqxGrid('getrowdata', rowIdx).engNo;
			
			var _list = [];
			$.each(editConfIds, function(idx, value) {
				_list.push($confGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/collectorConf/saveSensorDev.do', {
				data: { engNo: _engNo, list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editConfIds = [];
				}
			});
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});