var $p_evtCodeGrid;
var ctxPath;

var PMain = {
		/** variable */
		initVariable: function() {;
			$p_evtCodeGrid = $('#p_evtCodeGrid'), ctxPath = $('#ctxPath').val();
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
			case 'pbtnEdit': this.edit(); break;
			case 'pbtnDel': this.del(); break;
//			case 'pbtnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#p2window'));
			
			HmGrid.create($p_evtCodeGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				columns: 
				[
				 	{ text: '코드', datafield: 'code', width: 80, hidden: true, pinned: true },
				 	{ text: '이벤트명', datafield: 'evtName', width: 300, pinned: true },
				 	{ text: '설명', datafield: 'evtDesc' },
				 	{ text: '사용여부', datafield: 'isUse', width: 80 }
				]
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
		add: function() {
			$.post(ctxPath + '/main/popup/env/pDosEvtCodeAdd.do', 
					function(result) {
						HmWindow.open($('#p2window'), '이벤트 추가', result, 400, 500, 'p2window_init');
					}
			);
		},
		
		edit: function() {
			var rowIdx = HmGrid.getRowIdx($p_evtCodeGrid, '이벤트를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $p_evtCodeGrid.jqxGrid('getrowdata', rowIdx);			
			$.post(ctxPath + '/main/popup/env/pDosEvtCodeEdit.do', 
					function(result) {
						HmWindow.open($('#p2window'), '이벤트 수정', result, 400, 500, 'p2window_init', rowdata);
					}
			);
		},
		
		del: function() {
			var rowIdx = HmGrid.getRowIdx($p_evtCodeGrid, '이벤트를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $p_evtCodeGrid.jqxGrid('getrowdata', rowIdx);
			if(!confirm('[' + rowdata.evtName + '] 이벤트를 삭제하시겠습니까?')) return;
			Server.post('/main/popup/dosEvtCode/delDosEvtCode.do', {
				data: { code: rowdata.code },
				success: function(result) {
					$p_evtCodeGrid.jqxGrid('deleterow', rowdata.uid);
					alert(result);
				}
			});
		},
		
		search: function() {
			HmGrid.updateBoundData($p_evtCodeGrid, ctxPath + '/main/popup/dosEvtCode/getDosEvtCodeList.do');
		}
		
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

