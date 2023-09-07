var $dtlTab;

var PMain = {
		/** variable */
		initVariable: function() {;
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
			$dtlTab.jqxTabs({ width: '99.8%', height: '99%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
                        case 0: // 요약
                            pSummary.search();
                            break;
                        case 1: // 가상시스템
                            pVmInfo.initDesign();
                            pVmInfo.initData();
                            break;
                        case 2: // 성능
                            pPerf.initDesign();
                            pPerf.initData();
                            break;
                        case 3: // 디스크
                            pDiskInfo.initDesign();
                            pDiskInfo.initData();
                            break;
                        case 4: // 스토리지
                            pStorageInfo.initDesign();
                            pStorageInfo.initData();
                            break;
                        case 5: // 네트워크
                            pNetworkInfo.initDesign();
                            pNetworkInfo.initData();
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
				case 1: // 가상시스템
                    pVmInfo.search();
					break;
				case 2: // 성능
                    pPerf.itemIdxSearch();
					pPerf.search();
					break;
				case 3: // 디스크
                    pDiskInfo.search();
					break;
				case 4: // 스토리지
                    pStorageInfo.search();
					break;
				case 5: // 네트워크
					pNetworkInfo.search();
					break;
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
