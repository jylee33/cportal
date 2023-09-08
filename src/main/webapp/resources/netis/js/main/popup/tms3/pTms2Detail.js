var $dtlTab;

var PMain = {
	/** variable */
	initVariable: function () {
		$dtlTab = $('#dtlTab');
	},

	/** add event */
	observe: function() {
//			$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {

		}
	},

	/** init design */
	initDesign: function() {
		$dtlTab.jqxTabs({ width: '99.8%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
					case 0: // 요약
						pIpTopN.initDesign();
						pIpTopN.initData();
						break;
					case 1: // TopN
						pConnIp.initDesign();
						pConnIp.initData();
						break;
					case 2: // 회선정보
						pConnIpPort.initDesign();
						pConnIpPort.initData();
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
//					pIpTopN.search();
					break;
				case 1: // TopN
					pConnIp.search();
					break;
				case 2: // 회선정보
					pConnIpPort.search();
			}
		}catch(e){}
	}
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
