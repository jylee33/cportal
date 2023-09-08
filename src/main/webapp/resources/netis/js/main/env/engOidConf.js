var $confGrid;
var editIds = [];

var Main = {
	/** variable */
	initVariable : function() {
		$confGrid = $('#confGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnExcel": this.exportExcel(); break;
		case "btnSearch": this.search();	break;
		case 'btnAdd': this.addConf(); break;
		case 'btnDel': this.delConf(); break;
		case 'btnSave': this.saveConf(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'));
		HmGrid.create($confGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						url: ctxPath + '/main/env/engOidConf/getEngOidConfList.do',
						updaterow: function(rowid, rowdata, commit) {
							if(editIds.indexOf(rowid) == -1)
								editIds.push(rowid);
			            	commit(true);
			            }
					},
					{
						loadComplete: function(records) {
							editIds = [];
						}
					}
			),
			editable: true,
			editmode: 'selectedcell',
			columns: 
			[ 
			 	{ text: 'LIST', datafield: 'list', width: 60, cellsalign: 'right', pinned: true, editable: false }, 
			 	{ text: '제조사', datafield: 'vendor', width: 130, pinned: true }, 
			 	{ text: '모델', datafield: 'model', width: 130, pinned: true }, 
			 	{ text: 'USE OID', columngroup: 'cpu', datafield: 'cpuUserOid', width: 150, validation: Main.validateOid },
			 	{ text: 'IDLE OID', columngroup: 'cpu', datafield: 'cpuIdleOid', width: 150, validation: Main.validateOid },
			 	{ text: 'USE OID', columngroup: 'mem', datafield: 'memUseOid', width: 150, validation: Main.validateOid },
			 	{ text: 'FREE OID', columngroup: 'mem', datafield: 'memFreeOid', width: 150, validation: Main.validateOid },
			 	{ text: 'TOTAL OID', columngroup: 'mem', datafield: 'memTotalOid', width: 150, validation: Main.validateOid },
			 	{ text: 'CACHED OID', columngroup: 'mem', datafield: 'memCachedOid', width: 150, validation: Main.validateOid },
			 	{ text: 'USE(%) OID', columngroup: 'mem', datafield: 'memUsePctOid', width: 150, validation: Main.validateOid },
			 	{ text: 'OID', columngroup: 'temp', datafield: 'tempOid', width: 150, validation: Main.validateOid },
			 	{ text: 'NAME OID', columngroup: 'temp', datafield: 'tempNameOid', width: 150, validation: Main.validateOid },
			 	{ text: 'SESSION COUNT OID', datafield: 'sessCntOid', width: 150, validation: Main.validateOid },
			 	{ text: 'ACTIVE TUNNEL OID', datafield: 'activeTunnelOid', width: 150, validation: Main.validateOid }
			],
			columngroups: 
			[
			 	{ text: 'CPU', name: 'cpu', align: 'center' },
			 	{ text: 'MEMORY', name: 'mem', align: 'center' },
			 	{ text: '온도', name: 'temp', align: 'center' }
			]
		});
	},

	/** init data */
	initData : function() {

	},

	validateOid: function(cell, value) {
		if (!$.isBlank(value)) {
			if (/[^0-9\.]/.test(value)) {
				return {result: false, message: '숫자와 특수문자[.]만 입력가능합니다.'};
			}
		}
		return true;
    },

	/** 조회 */
	search : function() {
		HmGrid.updateBoundData($confGrid);
	},
	
	/** 추가 */
	addConf: function() {
		$.post(ctxPath + '/main/popup/env/pEngOidConfAdd.do', 
				function(result) {
					HmWindow.open($('#pwindow'), '엔진OID설정 등록', result, 600, 505);
				}
		);
	},
	
	/** 삭제 */
	delConf: function() {
		HmGrid.endRowEdit($confGrid);
		var rowIdxes = HmGrid.getRowIdxes($confGrid, '데이터를 선택해주세요.');
		if(rowIdxes === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
		var _keys = [], _uids = [];
		$.each(rowIdxes, function(idx, value) {
			var tmp = $confGrid.jqxGrid('getrowdata', value);
			_keys.push(tmp.list);
			_uids.push(tmp.uid);
		});
	
		Server.post('/main/env/engOidConf/delEngOidConf.do', {
			data: { keys: _keys },
			success: function(result) {
				$confGrid.jqxGrid('deleterow', _uids);
				alert(result);
			}
		});
	},
	
	/** 저장 */
	saveConf: function() {
		if(HmGrid.endCellEdit($confGrid) === false) return;

		if(editIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(editIds, function(idx, value) {
			_list.push($confGrid.jqxGrid('getrowdatabyid', value));
		});
	
		Server.post('/main/env/engOidConf/saveEngOidConf.do', {
			data: { list: _list },
			success: function(result) {
				alert(result);
				editIds = [];
			}
		});
	},
	
	/** export Excel */
	exportExcel: function() {
		HmUtil.exportGrid($confGrid, '엔진설정파일', false);
	}
	
	
	
	
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
