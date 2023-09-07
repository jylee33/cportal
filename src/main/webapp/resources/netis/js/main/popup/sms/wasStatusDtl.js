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
					case 1: // 성능
						WasPerfTree.initDesign();
						WasPerfChart.initDesign();
						// ProcessGrid.initDesign();
						break;
					case 2: // 이벤트
						pEvtInfo.initDesign();
						pEvtInfo.initData();
						break;
					case 3: // 이벤트
						pTomcatMgr.initDesign();
						pTomcatMgr.initData();
						break;
					case 4: // 이벤트
						pTomcatProcs.initDesign();
						pTomcatProcs.initData();
						break;
					}
				}
			}).on('selected', function(event) {
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
						WasPerfChart.searchCombo();
						WasPerfChart.search();
						break;
					case 2: // 이벤트
						pEvtInfo.search();
						break;
					case 3: // mgr
						pTomcatMgr.search();
						break;
					case 4: // procs
						pTomcatProcs.search();
						break;
				}
			}catch(e){}
		},

	chgInfo: function(){

		var params = {
			mngNo: dtl_mngNo,
			wasNo: dtl_wasNo,
			action: 'U'
		}
		Server.post(ctxPath +'/main/popup/wasDetail/getWasInfo.do', {
			data: { mngNo: dtl_mngNo, wasNo: dtl_wasNo },
			success: function(data) {
				if(data != null) {
					$.post(ctxPath + '/main/popup/env/pSvrWasMonitAdd.do',
						params,
						function(result) {
							var wasInfo = data[0];
							HmWindow.open($('#pwindow'), '[{0}] WAS정보 변경'.substitute(wasInfo.wasNm), result, 500, 300, 'p2window_init', wasInfo);
						}
					);
				}
			}
		});
	}
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
