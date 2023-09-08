var pMngNo, pVmId, pInitArea;
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
			pVmId = $('#vmId').val();
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
				case 'btnSearch': this.searchSummary(); break;
				case 'btnSearch_dtl': this.searchDtlInfo(); break;
				case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
           			// 메인텝
			$dtlTab.jqxTabs({ width: '99.8%', height: '99%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
                    switch(tab) {
                        case 0: // 요약
                            break;
                        case 1: // 성능
                            pPerf.initDesign();
                            pPerf.initData();
                            break;
                        case 2: // 디스크
                            pDiskInfo.initDesign();
                            pDiskInfo.initData();
                            break;
                        case 3: // 스토리지
                            pStorageInfo.initDesign();
                            pStorageInfo.initData();
                            break;
                        case 4: // 네트워크
                            pNetworkInfo.initDesign();
                            pNetworkInfo.initData();
                            break;
						case 5: // FileSystem
                            // pFileSystemInfo.initDesign();
                            // pFileSystemInfo.initData();
                            break;
                    }
		    	}
			})
			.on('selected', function(event) {
                var selectedTab = event.args.item;
                if(selectedTab==0){
                    pSummary_evtStatus.resizeSvg();
                }
//				PMain.searchDtlInfo();
			});

		},
		
		/** init data */
		initData: function() {

		},

		/** 상세정보 */
		searchDtlInfo: function() {
		},


        // exportExcel: function(btnId) {
		//     if(btnId == 'btnExcel_evtHist') {
        //         HmUtil.exportGrid($evtHistGrid, '이력', false);
        //     }
        //     else if(btnId == 'btnExcel_evtActionHist') {
        //         HmUtil.exportGrid($evtActionHistGrid, '조치이력', false);
        //     }
        // }
};
