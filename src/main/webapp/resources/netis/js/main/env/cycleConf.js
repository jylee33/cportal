var $collectGrid, $daemonGrid;
var editCollectIds = [], editDaemonIds = [];

var Main = {
		/** variable */
		initVariable: function() {
			$collectGrid = $('#collectGrid');
			$daemonGrid = $('#daemonGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch_collect': this.searchCollectEngineConf(); break;
			case 'btnSave_collect': this.saveCollectEngineConf(); break;
			case 'btnSearch_daemon': this.searchDaemonEngineConf(); break;
			case 'btnSave_daemon': this.saveDaemonEngineConf(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '60%', collapsible: false }, { size: '40%' }], 'auto', '100%');
			HmGrid.create($collectGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/env/cycleConf/getCollectEngineConfList.do',
							updaterow: function(rowid, rowdata, commit) {
								if(editCollectIds.indexOf(rowid) == -1)
									editCollectIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							loadComplete: function(records) {
								editCollectIds = [];
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '수집엔진 주기설정');
			    },
			    editable: true,
				editmode: 'selectedrow',
			    pageable: false,
				columns: 
				[
					{ text : '엔진명', datafield : 'engName', minwidth : 150, editable: false },
					{ text : '실행파일명', datafield : 'codeId', minwidth : 150, editable: false },
					{ text : '엔진설명', datafield : 'memo', minwidth: 300, editable: false },
					{ text : '시작시간', datafield : 'startTime', width : 80, cellsalign: 'center' },
					{ text : '종료시간', datafield : 'endTime', width : 80, cellsalign: 'center' },
					{ text : '주기', datafield : 'cycle', width : 80, cellsalign: 'right' },
					{ text : '단위', datafield : 'unit', width : 80, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: [ 'sec', 'min', 'hour' ] });
						}	
					},
					{ text : '사용여부', datafield : 'useFlag', width: 80, columntype: 'checkbox' }
			    ]
			});

			HmGrid.create($daemonGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/env/cycleConf/getDaemonEngineConfList.do',
							updaterow: function(rowid, rowdata, commit) {
								if(editDaemonIds.indexOf(rowid) == -1)
									editDaemonIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							loadComplete: function(records) {
								editDaemonIds = [];
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '데몬엔진 설정');
			    },
			    editable: true,
				editmode: 'selectedrow',
			    pageable: false,
				columns: 
				[
					 { text : '엔진명', datafield : 'engName', minwidth : 150, editable: false },
					 { text : '실행파일명', datafield : 'codeId', minwidth : 150, editable: false },
					 { text : '엔진설명', datafield : 'memo', minwidth: 300, editable: false },
					 { text : '감시주기', datafield : 'cycle', width : 80, cellsalign: 'right', columntype: 'numberinput', 
						 initeditor: function(row, cellvalue, editor) {
							 editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99 });
						 },
						 validation: function(cell, value) {
							if(value < 0 || value > 99) {
								return { result: false, message: '0~99사이의 수치값을 입력해주세요.' };
							}
							return true;
						}
					 },
					 { text : '단위', datafield : 'unit', width : 80, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: [ 'sec', 'min', 'hour' ] });
						}
					},
					 { text : '사용여부', datafield : 'useFlag', width: 80, columntype: 'checkbox' }
				]						
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 조회 */
		searchCollectEngineConf: function() {
			HmGrid.updateBoundData($collectGrid);
		},

		searchDaemonEngineConf: function() {
			HmGrid.updateBoundData($daemonGrid);
		},
		
		/** 저장 */
		saveCollectEngineConf: function() {
			HmGrid.endRowEdit($collectGrid);
			if(editCollectIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editCollectIds, function(idx, value) {
				_list.push($collectGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/env/cycleConf/saveCollectEngineConf.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editCollectIds = [];
				}
			});
		},
		
		saveDaemonEngineConf: function() {
			HmGrid.endRowEdit($daemonGrid);
			if(editDaemonIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(editDaemonIds, function(idx, value) {
				_list.push($daemonGrid.jqxGrid('getrowdatabyid', value));
			});
			
			Server.post('/main/env/cycleConf/saveDaemonEngineConf.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					editDaemonIds = [];
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