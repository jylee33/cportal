var $grpTree, $p_sectPerfGrid;
var ctxPath;

var PMain = {
	/** variable */
	initVariable: function() {;
		$grpTree = $('#grpTree'), $p_sectPerfGrid = $('#p_sectPerfGrid'), ctxPath = $('#ctxPath').val();
	},
	
	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},
	
	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
		case 'pbtnAdd': this.add(); break;
		case 'pbtnSave': this.save(); break;
		case 'pbtnDel': this.del(); break;
		case 'pbtnSearch': this.search(); break;
		case 'pbtnClose': self.close(); break;
		}
	},
	
	/** init design */
	initDesign: function() {
		HmWindow.create($('#pwindow'));
		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, PMain.selectTree);
		
		HmGrid.create($p_sectPerfGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(editSectPerfIds.indexOf(rowid) == -1)
								editSectPerfIds.push(rowid);
			            	commit(true);
			            }
					},
					{
						formatData: function(data) {
							$.extend(data, PMain.getCommParams());
							return data;
						},
						loadComplete: function(records) {
							editSectPerfIds = [];
						}
					}
			),
			editable : true,
			editmode : 'selectedcell',
			columns: 
			[
			 	{ text : '그룹명', datafield: 'grpName', minwidth: 150, editable: false },
			 	{ text : '장비명', datafield: 'devName', minwidth: 150, editable: false },
				{ text : 'Node명', datafield : 'nodeName', minwidth : 150,
					validation: function(cell, value) {
						if($.isBlank(value)) {
							return { result: false, message: 'Node명을 입력해주세요.' };
						}
						return true;
					}
				},
				{ text : 'Source IP', datafield : 'fromIp', width : 120,
					validation: function(cell, value) {
						if($.isBlank(value)) {
							return { result: false, message: 'Source IP를 입력해주세요.' };
						}
						if(!$.validateIp(value)) {
							return { result: false, message: 'Source IP를 확인해주세요.' };
						}
						return true;
					}
				}, 
				{ text : 'Target IP', datafield : 'toIp', width : 120,
					validation: function(cell, value) {
						if($.isBlank(value)) {
							return { result: false, message: 'Target IP를 입력해주세요.' };
						}
						if(!$.validateIp(value)) {
							return { result: false, message: 'Target IP를 확인해주세요.' };
						}
						return true;
					}
				}, 
				{ text : '응답시간(ms)', datafield : 'crtRespTime', width : 100,
					validation: function(cell, value) {
						if($.isBlank(value)) {
							return { result: false, message: '응답시간을 입력해주세요.' };
						}
						return true;
					}
				},
				{ text : '패킷로스율', datafield : 'crtPktlossRate', width : 100,
					validation: function(cell, value) {
						if($.isBlank(value)) {
							return { result: false, message: '패킷로스율을 입력해주세요.' };
						}
						return true;
					}
				},
				{ text : '설명', datafield : 'memo', width : 150 }
		    ]
		});
		
	},
	
	/** init data */
	initData: function() {
		PMain.search();
	},
	
	selectTree: function() {
		PMain.search();
	},
	
	getCommParams: function() {
		var _grpNo = -1, _itemKind = 'GROUP';
		var treeItem = HmTreeGrid.getSelectedItem($grpTree);
		if(treeItem !== null) {
			_itemKind = treeItem.devKind2;
			_grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
		}
		
		return {
			grpNo: _grpNo,
			itemKind: _itemKind
		};	
	},
	
	add: function() {
		$.post(ctxPath + '/main/popup/nms/pSectPerfAdd.do', function(result) {
			HmWindow.open($('#pwindow'), '구간성능 설정  등록', result, 600, 210, 'pwindow_init', PMain.getCommParams());
		});
	},
	
	save: function() {
		HmGrid.endRowEdit($p_sectPerfGrid);
		if(editSectPerfIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		
		var _list = [];
		$.each(editSectPerfIds, function(idx, value) {
			_list.push($p_sectPerfGrid.jqxGrid('getrowdatabyid', value));
		});
	
		Server.post('/main/nms/devPerf2/editSectionPerf.do', {
			data: { list: _list },
			success: function(result) {
				alert(result);
				editSectPerfIds = [];
			}
		});
	},
	
	del: function() {
		var rowIdx = HmGrid.getRowIdx($p_sectPerfGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_sectPerfGrid.jqxGrid('getrowdata', rowIdx);
		if(!confirm('선택한 데이터를 삭제하시겠습니까?')) return;
		
		Server.post('/main/nms/devPerf2/delSectionPerf.do', {
			data: { nodeNo: rowdata.nodeNo },
			success: function(result) {
				$p_sectPerfGrid.jqxGrid('deleterow', rowdata.uid);
				alert(result);
			}
		});
	},
	
	search: function() {
		HmGrid.updateBoundData($p_sectPerfGrid, ctxPath + '/main/nms/devPerf2/getSectionPerfConfList.do');
	}
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

