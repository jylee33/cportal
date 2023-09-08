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
					case 1: // 성능
						pPerf.initDesign();
						pPerf.initData();
						break;
					/** 성능탭 하단에 있던 실시간조회 탭을 성능탭 옆으로 이동(성능탭 이하 장비 Config 탭부터 번호 1씩 증가) **/
					case 2: // 이벤트
						pEvtInfo.initDesign();
						pEvtInfo.initData();
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
				}
			}catch(e){}
		},

};

function addDevResult() {
	HmGrid.updateBoundData($devGrid);
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
