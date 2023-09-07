var $p_communityGrid;
var ctxPath;
var PMain = {
		/** variable */
		initVariable: function() {;
			$p_communityGrid = $('#p_communityGrid');
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
			case 'pbtnAdd': this.add(); break;
			case 'pbtnEdit': this.edit(); break;
			case 'pbtnDel': this.del(); break;
			case 'pbtnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#p2window'));
			
			HmGrid.create($p_communityGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				columns: 
				[
				 	{ text: 'ID', datafield: 'userId', width: 80, pinned: true },
				 	{ text: 'No', datafield: 'communityNo', width: 60, cellsalign: 'right', pinned: true },
				 	{ text: '커뮤니티', datafield: 'communityName', width: 130, pinned: true },
				 	{ text: 'SNMP Ver', datafield: 'snmpVerNm', width: 80 },
				 	{ text: 'User ID', datafield: 'snmpUserId', width: 80 },
				 	{ text: 'Security Level', datafield: 'snmpSecurityLevelNm', width: 100 },
				 	{ text: 'AuthType', datafield: 'snmpAuthTypeNm', width: 100 },
				 	{ text: 'AuthKey', datafield: 'snmpAuthKey', width: 100 },
				 	{ text: 'EncryptType', datafield: 'snmpEncryptTypeNm', width: 100 },
				 	{ text: 'EncryptKey', datafield: 'snmpEncryptKey', width: 100 }
				]
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
		add: function() {
			$.post(ctxPath + '/main/popup/env/pCommunityAdd.do', 
					function(result) {
						HmWindow.open($('#p2window'), '커뮤니티 등록', result, 340, 348, 'p2window_init');
					}
			);
		},
		
		edit: function() {
			var rowIdx = HmGrid.getRowIdx($p_communityGrid, '커뮤니티를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $p_communityGrid.jqxGrid('getrowdata', rowIdx);			
			$.post(ctxPath + '/main/popup/env/pCommunityEdit.do', 
					function(result) {
						HmWindow.open($('#p2window'), '커뮤니티 수정', result, 340, 348, 'p2window_init', rowdata);
					}
			);
		},
		
		del: function() {
			var rowIdx = HmGrid.getRowIdx($p_communityGrid, '커뮤니티를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $p_communityGrid.jqxGrid('getrowdata', rowIdx);
			if(!confirm('[' + rowdata.communityName + '] 커뮤니티를 삭제하시겠습니까?')) return;
			Server.post('/main/popup/community/delCommunity.do', {
				data: { communityNo: rowdata.communityNo },
				success: function(result) {
					$p_communityGrid.jqxGrid('deleterow', rowdata.uid);
					alert(result);
					try{window.opener.searchCommunity();}catch(err){}
				}
			});
		},
		
		search: function() {
			HmGrid.updateBoundData($p_communityGrid, ctxPath + '/main/popup/community/getCommunityList.do');
		}
		
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
