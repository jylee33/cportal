var $p_sysoidGrid;
var ctxPath;

var PMain = {
		/** variable */
		initVariable: function() {;
			$p_sysoidGrid = $('#p_sysoidGrid');
			ctxPath = $('#ctxPath').val();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
//			case 'pbtnAdd': this.add(); break;
//			case 'pbtnEdit': this.edit(); break;
//			case 'pbtnDel': this.del(); break;
			case 'pbtnSave': this.save(); break;
			case 'pbtnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#p2window'));
			
			HmGrid.create($p_sysoidGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				editable: true,
				columns: 
				[
				 	{ text: 'SYSOID', datafield: 'sysoid', editable: false },
				 	{ text: '장비종류', datafield: 'devKind', width: 130 },
				 	{ text: '제조사', datafield: 'vendor', width: 130 },
				 	{ text: '모델', datafield: 'model', width: 130 }
				]
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
//		add: function() {
//			$.post(ctxPath + '/main/popup/env/pSysoidAdd.do', 
//					function(result) {
//						HmWindow.open($('#p2window'), 'SYSOID 추가', result, 350, 220, 'p2window_init');
//					}
//			);
//		},
//		
//		edit: function() {
//			var rowIdx = HmGrid.getRowIdx($p_sysoidGrid, 'SYSOID를 선택해주세요.');
//			if(rowIdx === false) return;
//			var rowdata = $p_sysoidGrid.jqxGrid('getrowdata', rowIdx);			
//			$.post(ctxPath + '/main/popup/env/pSysoidEdit.do', 
//					function(result) {
//						HmWindow.open($('#p2window'), 'SYSOID 수정', result, 350, 220, 'p2window_init', rowdata);
//					}
//			);
//		},
//		
//		del: function() {
//			var rowIdx = HmGrid.getRowIdx($p_sysoidGrid, 'SYSOID를 선택해주세요.');
//			if(rowIdx === false) return;
//			var rowdata = $p_sysoidGrid.jqxGrid('getrowdata', rowIdx);
//			if(!confirm('[' + rowdata.sysoid + '] 를 삭제하시겠습니까?')) return;
//			Server.post('/main/popup/sysoid/delSysoid.do', {
//				data: { sysoid: rowdata.sysoid },
//				success: function(result) {
//					$p_sysoidGrid.jqxGrid('deleterow', rowdata.uid);
//					alert(result);
//				}
//			});
//		},
		
		save: function() {
			var rows = $p_sysoidGrid.jqxGrid('getboundrows');
			if(rows == null || rows.length == 0) {
				alert('저장할 데이터가 없습니다.');
				return;
			}
			Server.post('/main/popup/sysoid/saveSysoid.do', {
				data: { list: rows },
				success: function(result) {
					alert(result);
				}
			});
		},
		
		search: function() {
			HmGrid.updateBoundData($p_sysoidGrid, ctxPath + '/main/popup/sysoid/getSysoidList.do');
		}
		
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
