var $dtlTab;
var sAuth;
var PMain = {
		/** variable */
		initVariable: function() {
			sAuth = $('#sAuth').val().toUpperCase();
			$dtlTab = $('#dtlTab');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'btnChgInfo': this.chgInfo(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
				$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			}
			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // Contact
						break;
					case 1: // rs485-1
						break;
					case 2:  // rs485-2
						break;
					case 3:	// rs232-1
						break;
					case 4:  // ethernet
						break;
					case 5: // relay
						break;
					case 6: // 이벤트
                        pEvtInfo.initDesign();
                        pEvtInfo.initData();
						break;
					case 7:  // 변경관리
                        pChgHist.initDesign();
                        pChgHist.initData();
						break;
					case 8:
						break;
					}
				}
			})
			.on('selected', function(event) {
				PMain.search();
			});
		},
		
		/** init data */
		initData: function() {

		},
		
		search: function() {
			try{
				switch($dtlTab.val()) {
				case 0: // contact
					//pSummary.search();
                    pContact.search();
					break;
				case 1: // rs485-1
					//pContact.search();
                    pRs485_1.search();
					break;
				case 2: // rs485-2
					//pRs485_1.search();
                    pRs485_2.search();
					break;
				case 3: //  rs232-1
					//pRs485_2.search();
                    pRs232_1.search();
					break;
				case 4: // ethernet
					//pRs232_1.search();
                    pEthernet.search();
					break;
				case 5: // relay
					//pEthernet.search();
                    pRelay.search();
					break;
				case 6: // 이벤트
					//pRelay.search();
                    pEvtInfo.search();
					break;
				case 7: // 변경관리
					//pEvtInfo.search();
                    pChgHist.search();
					break;
				case 8:
					//pChgHist.search();
					break;
				}
			}catch(e){}

		},
		chgInfo: function(){
			var params = {
				mngNo: dtl_mngNo,
				action: 'U'
			}
			$.post(ctxPath + '/main/popup/env/pDevAdd.do',
				params,
				function(result) {
					HmWindow.open($('#pwindow'), '[{0}] 장비정보 변경'.substitute(dtl_devName), result, 600, 650);
				}
			);
		}
};

function addDevResult() {
	HmGrid.updateBoundData($rtuGrid);
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
