var $grpTree, $deliverGrid;
var _deliverGridData;
var _usingList = [], editRowIds = [];

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$deliverGrid = $('#deliverGrid');
		_usingList = [{ label: '사용', value: '1' }, { label: '미사용', value: '0' }];
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});

		$deliverGrid.bind('rowclick', function(event) {
			var curSvrGridIndex = event.args.rowindex;
			if (curSvrGridIndex === undefined || curSvrGridIndex == -1)
				return;
			_deliverGridData = $deliverGrid.jqxGrid('getrowdata', curSvrGridIndex);
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch':
			this.search();
			break;
		case 'btnAdd':
			this.add();
			break;
		case 'btnSave':
			this.save();
			break;	
		case 'btnDel':
			this.del();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));

		// 서버목록 그리드
		HmGrid.create($deliverGrid, 
		{ 
			source : new $.jqx.dataAdapter(
				{
					datatype : 'json',
					// 필터위해 미리 추가
					// datafields:[
                     //    { name:'devName', type:'string' },
                     //    { name:'userId', type:'string' },
                     //    { name:'loginPwd', type:'string' },
                     //    { name:'port', type:'number' },
                     //    { name:'fromHhmmss', type:'string' },
                     //    { name:'toHhmmss', type:'string' },
                     //    { name:'filePath', type:'string' },
                     //    { name:'isUsing', type:'number' },
					// ],
					updaterow: function(rowid, rowdata, commit) {
						if(editRowIds.indexOf(rowid) == -1)
							editRowIds.push(rowid);
						commit(true);
					}
				}, 
				{ 
					formatData : function(data) {
						$.extend(data, Main.getCommParams());
						return data;
					},
					loadComplete: function(records) {
						editRowIds = [];
					}
				}
			),
			editable: true,
			editmode: 'selectedcell',
			columns : [
	           { text : '장비명', datafield : 'devName', width : '150px', editable: false}, 
	           { text : '서버접속 ID', datafield : 'userId', width : '100px' }, 
	           { text : '서버접속 비밀번호', datafield : 'loginPwd', width : '150px' }, 
	           { text : '서버접속 PORT', datafield : 'port', width : '100px' }, 
	           { text : '시작시간', datafield : 'fromHhmmss', columngroup: 'time', width : '150px', columntype: 'datetimeinput', cellsformat: 'HH:mm:ss',
	        	   createeditor: function(row, value, editor) {
						 editor.jqxDateTimeInput({ showTimeButton: false, showCalendarButton: false });
	        	   },
	        	   initeditor: function(row, value, editor) {
						 if (value == null || value.indexOf(':') !== -1) return;
						 editor.jqxDateTimeInput('setDate', new Date(2015, 1, 1, value.substr(0, 2), value.substr(2, 2)));
	        	   },
	        	   geteditorvalue: function (row, cellvalue, editor) {
					     return $.format.date(editor.jqxDateTimeInput('getDate'), 'HHmmss');
	        	   },
	        	   cellsrenderer: function(row, columnfield, value) {
						if (value == null || value.length < 6) return '';
						if (value.indexOf(':') !== -1) return '';
						return value.substr(0,2) + ':' + value.substr(2, 2) + ':' + value.substr(4, 2);
	        	   }
	           }, 
	           { text : '종료시간', datafield : 'toHhmmss', columngroup: 'time', width : '150px', columntype: 'datetimeinput', cellsformat: 'HH:mm:ss',
	        	   createeditor: function(row, value, editor) {
						 editor.jqxDateTimeInput({ showTimeButton: false, showCalendarButton: false });
	        	   },
	        	   initeditor: function(row, value, editor) {
						 if (value == null || value.indexOf(':') !== -1) return;
						 editor.jqxDateTimeInput('setDate', new Date(2015, 1, 1, value.substr(0, 2), value.substr(2, 2)));
	        	   },
	        	   geteditorvalue: function (row, cellvalue, editor) {
					     return $.format.date(editor.jqxDateTimeInput('getDate'), 'HHmmss');
	        	   },
	        	   cellsrenderer: function(row, columnfield, value) {
						if (value == null || value.length < 6) return '';
						if (value.indexOf(':') !== -1) return '';
						return value.substr(0,2) + ':' + value.substr(2, 2) + ':' + value.substr(4, 2);
	        	   }
	           }, 
	           { text : '경로', datafield : 'filePath', minwidth : '200px' }, 
	           { text : '사용여부', datafield : 'isUsing', displayfield: 'isUsingStr', width : '100px', cellsalign: 'center', columntype: 'dropdownlist',
	        	   createeditor: function(row, value, editor) {
	        		   editor.jqxDropDownList({ source: _usingList, autoDropDownHeight: true });
	        	   } 
	           }
			],
			columngroups: [
                { text: '미수집 시간', align: 'center', name: 'time' }
            ]
		}, CtxMenu.NONE);

		$deliverGrid.on('contextmenu', function(event) {return false;});
		
		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.search, null);
	},

	/** init data */
	initData : function() {
	},

	/** 공통 파라미터 */
	getCommParams: function() {
		var params = Master.getDefGrpParams();
		return params;
	},
	
	search : function() {
		HmGrid.updateBoundData($deliverGrid, ctxPath + '/main/env/recDeliverMgmt/getDeliverList.do');
	},
	
	add: function() {
		var treeItem = HmTreeGrid.getSelectedItem($grpTree);
		
		if (treeItem == null || treeItem.devKind2 == 'GROUP') {
			alert("장비를 선택해주세요.");
		} else {
			
			if ($deliverGrid.jqxGrid('getboundrows').length > 0) {
				alert("장비당 하나의 배송지만 설정가능합니다.");
				return;
			}
			
			var params = {
				devName: treeItem.grpName,
				mngNo: treeItem.grpNo.split('_')[1]
			};
			
			$.get(ctxPath + '/main/popup/env/pRecDeliverAdd.do', function(result) {
	    		HmWindow.open($('#pwindow'), '배송지 녹취 등록', result, 600, 310, null, params);
			});
		}
    },
    
    save: function() {
		HmGrid.endRowEdit($deliverGrid);
		if(editRowIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		
		var _list = [];
		$.each(editRowIds, function(idx, value) {
			_list.push($deliverGrid.jqxGrid('getrowdatabyid', value));
		});
		
		Server.post('/main/env/recDeliverMgmt/saveDeliver.do', {
			data: { list: _list },
			success: function(result) {
				alert(result);
				editRowIds = [];
			}
		});
	},
    
    del: function() {
    	var rowdata = HmGrid.getRowData($deliverGrid);
    	if(rowdata == null) {
    		alert('데이터를 선택해 주세요.');
    		return;
    	}
    	
    	if(!confirm('데이터를 삭제하시겠습니까?')) return;
    	userId = rowdata.userId;
		Server.post('/main/env/recDeliverMgmt/delDeliver.do', {
			data: { mngNo: rowdata.mngNo },
			success: function(result) {
				$deliverGrid.jqxGrid('deleterow', rowdata.uid);
				alert(result);
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