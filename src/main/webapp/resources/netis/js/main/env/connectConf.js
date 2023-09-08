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
		case "btnSearch":
			this.searchConf();
			break;
		case "btnAdd":
			this.addConf();
			break;
		case "btnDel":
			this.delConf();
			break;
		case "btnSave":
			this.saveConf();
			break;
		case "btnExcel": 
			this.exportExcel(); 
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);

		var cmdFlag = [{ value: 0, label: 'N/A'},
            { value: 1, label: 'ConfigBackup'},
            { value: 2, label: 'Routing'},
            { value: 5, label: 'Shutdown'}
        ];

		HmGrid.create($confGrid, {
			source : new $.jqx.dataAdapter(
					{
						datatype : 'json',
						url: ctxPath + '/main/env/connectConf/getConnectConfigList.do',
						updaterow: function(rowid, rowdata, commit) {
							if(editIds.indexOf(rowid) == -1)
								editIds.push(rowid);
			            	commit(true);
			            },
						datafields: [
							{ name: 'vendor', type: 'String'},
                            { name: 'model', type: 'String'},
                            { name: 'loginFormat', type: 'String'},
                            { name: 'pwdFormat', type: 'String'},
                            { name: 'enFlag', type: 'String'},
                            { name: 'endChar', type: 'String'},
                            { name: 'moreFormat', type: 'String'},
                            { name: 'command', type: 'String'},
                            { name: 'commandFlag', type: 'int'},
							{ name: 'commandFlagDis', value: 'commandFlag', values: { source:  new $.jqx.dataAdapter(cmdFlag, {
                                        autoBind: true
                                    }).records,  value: 'value', name: 'label'}}
						]
					},
					{
						loadComplete: function(records) {
							editIds = [];
						}
					}
			),
			editable: true,
		    editmode: 'selectedrow',
			columns : [
				{ text : '제조사', datafield : 'vendor', width : 150, editable: false, pinned: true },
				{ text : '모델', datafield : 'model', width : 150, editable: false, pinned: true },
				{ text : 'Login형식', datafield : 'loginFormat', width: 150 },
				{ text : 'Password형식', datafield : 'pwdFormat', width : 150 },
				{ text : 'Enable인증', datafield : 'enFlag', displayfield: 'enFlag', width : 100, columntype: 'dropdownlist', filtertype: 'checkedlist',
					createeditor: function(row, value, editor) {
						editor.jqxDropDownList({ source: ['Yes', 'No'], autoDropDownHeight: true });
					} 
				},
				{ text : '완료문자', datafield : 'endChar', width : 100 },
				{ text : '진행 문자열', datafield : 'moreFormat', width : 150 },
                { text : 'Command 종류', datafield : 'commandFlag', width : 100, columntype: 'dropdownlist', filtertype: 'checkedlist', displayfield: 'commandFlagDis',
                    createeditor: function(row, value, editor) {
                        editor.jqxDropDownList({ source: cmdFlag,
                            displayMember: "commandFlagDis", valueMember: "commandFlag",
                            autoDropDownHeight: true });
                    }
                },
				{ text : 'Command', datafield : 'command', minwidth: 150 }
			] 
		});
	},

	/** init data */
	initData : function() {
		
	},

	searchConf : function() {
		HmGrid.updateBoundData($confGrid);
	},
	
	addConf: function() {
		$.get(ctxPath + '/main/popup/env/pConnectConfAdd.do', function(result) {
			$('#pwindow').jqxWindow({ width: 400, height: 350, title: '<h1>접속설정 등록</h1>', content: result, position: 'center', resizable: false });
			$('#pwindow').jqxWindow('open');
		});
	},
	
	delConf: function() {
		var rowIdx = HmGrid.getRowIdx($confGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
		
		var rowdata = $confGrid.jqxGrid('getrowdata', rowIdx);
		Server.post('/main/env/connectConf/delConnectConfig.do', {
			data: rowdata,
			success: function(result) {
				$confGrid.jqxGrid('deleterow', $confGrid.jqxGrid('getrowid', rowIdx));
				alert('삭제되었습니다.');
			}
		});
	},
	
	saveConf: function() {
		HmGrid.endRowEdit($confGrid);
		if(editIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(editIds, function(idx, value) {
			var tmp = $confGrid.jqxGrid('getrowdatabyid', value);
			_list.push(tmp);
		});
	
		Server.post('/main/env/connectConf/saveConnectConfig.do', {
			data: { list: _list },
			success: function(result) {
				alert('저장되었습니다.');
				editIds = [];
			}
		});
	},
	
	/** export Excel */
	exportExcel: function() {
		HmUtil.exportGrid($confGrid, '접속설정', false);
	}

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
