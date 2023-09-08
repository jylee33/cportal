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
						case 0: // 요약
							break;
						case 1: // AP
							pAp.initDesign();
							pAp.initData();
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
				case 0: // 요약
					pSummary.search();
					break;
				case 1: // AP성능
					pAp.search();
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
	HmGrid.updateBoundData($apGrid);
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
