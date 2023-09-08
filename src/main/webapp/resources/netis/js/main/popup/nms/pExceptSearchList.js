var $exceptGrid;
var editConfNos = [];
var editTanslateNos = [];
var isEditTranslate = false;
var editExceptNos = [];
var Main = {
	/** variable */
	initVariable : function() {
		$exceptGrid = $('#exceptGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
	
		// 제외 메시지
		case "btnReg_except":	this.addExcept(); break;
		case "btnDel_except":	this.delExcept(); break;
		case "btnSave_except":	this.saveExcept(); break;
		case 'btnClose': self.close(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);

		HmGrid.create($exceptGrid, {
			source : new $.jqx.dataAdapter({
				datatype : 'json',
				updaterow: function(rowid, rowdata, commit) {
					if(editExceptNos.indexOf(rowid) == -1)
						editExceptNos.push(rowid);
						commit(true);
	            },
				url: ctxPath + '/main/nms/ifPerf/getExceptList.do'
			}),
			height : "91%",
			editable: true,
			editmode : 'selectedrow',
			columns : [ 
						{ text : '번호', datafield : 'seqNo', hidden:true }, 
			           	{ text : '제외회선명', datafield : 'ifName'}
		           	]
		});
		
	},

	/** init data */
	initData : function() {

	},
	
	/** 상세정보 */
	searchDtlInfo: function() {
		searchExcept();
	},
	
	searchExcept: function() {
		HmGrid.updateBoundData($exceptGrid, ctxPath + '/main/nms/ifPerf/getExceptList.do');
	},
	
	addExcept: function() {
		$.post(ctxPath + '/main/popup/nms/pExceptSearchAdd.do', 
				function(result) {
					HmWindow.open($('#pwindow'), '제외 회선 등록', result, 300, 120);
				}
		);
	},
	
	delExcept: function() {
		var rowIdx = HmGrid.getRowIdxes($exceptGrid, '데이터를 선택해주세요.');
		if(rowIdx === false) return;
		if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
		
		var _seqNo=$exceptGrid.jqxGrid('getcellvalue', rowIdx, "seqNo");
		Server.post('/main/nms/ifPerf/delExcept.do', {
			data: { seqNo: _seqNo },
			success: function(result) {
				$exceptGrid.jqxGrid('deleterow', $exceptGrid.jqxGrid('getrowid', rowIdx));
				alert('삭제되었습니다.');
			}
		});
	},
	
	saveExcept: function() {
		HmGrid.endRowEdit($exceptGrid);
		if(editExceptNos.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		var rows = $exceptGrid.jqxGrid('getboundrows');
		$.each(editExceptNos, function(idx, value) {
			_list.push($exceptGrid.jqxGrid('getrowdatabyid', value));
		});
		Server.post('/main/nms/ifPerf/saveExcept.do', {
			data: { list: _list },
			success: function(data) {
				alert("저장되었습니다.");
				editExceptNos = [];
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
