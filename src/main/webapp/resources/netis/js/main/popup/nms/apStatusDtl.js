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

            if ($dtlTab === undefined) return;

            $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
                initTabContent: function(tab) {
					switch(tab) {
						case 0: // 요약
							break;
						case 1: // 성능
							pPerf.initDesign();
							pPerf.initData();
							break;
						case 2: // 이벤트
							pEvtInfo.initDesign();
							pEvtInfo.initData();
							break;
						case 3: // client
							pClient.initDesign();
							pClient.initData();
							break;
						// case 4: // client Hist
						// 	pClientHist.initDesign();
						// 	pClientHist.initData();
						// 	break;
						case 4: // client Hist
                            pApplication.initDesign();
							pApplication.initData();
							break;
						case 5: // Asset
                            pAsset.initDesign();
							pAsset.initData();
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
				case 1: // 성능
					pPerf.search();
					break;
				case 2: // 이벤트
					pEvtInfo.search();
					break;
				case 3: // client
					pClient.search();
					break;
				case 4: // client Hist
					pClientHist.search();
					break;
				case 5: // client App
					pApplication.search();
					break;
				case 6: //Asset
					pAsset.search();
					break;
				}
			}catch(e){
			}
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
