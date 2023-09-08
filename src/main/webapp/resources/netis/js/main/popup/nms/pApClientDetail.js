var pMngNo, pGrpNo, pInitArea;
var $dtlTab;
var sAuth;
var pgSiteName;

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
	/** variable */
	initVariable: function() {
		pMngNo = $('#mngNo').val();
		pInitArea = $('#initArea').val();
		$dtlTab = $('#dtlTab');
		sAuth = $('#sAuth').val().toUpperCase();
		pgSiteName = $('#gSiteName').val();
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'pbtnClose': self.close(); break;
			case 'btnChgInfo': this.chgInfo(); break;
		}
	},

	/** init design */
	initDesign: function() {
		// 메인텝
		$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
					case 0: // 요약
						break;
					case 1: // 성능
						pPerf.initDesign();
						pPerf.initData();
						break;
				}
			}
		}).on('selected', function(event) {
			var selectedTab = event.args.item;
			if(selectedTab==0){
				// pSummary_evtStatus.resizeSvg();
			}
		});

		if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
			// $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			// $dtlTab.jqxTabs('disableAt', 9); // 권한에 따른 설정탭 숨김
		}

	},

	/** init data */
	initData: function() {
		$('.p_content_layer').css('display', 'block');
	},

	/** 상세정보 */
	searchDtlInfo: function() {
	},


	chgInfo: function(){


	}
};
