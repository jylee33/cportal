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
						DbmsPerfTree.initDesign();
						DbmsPerfChart.initDesign();
						break;
					case 2: // EVT 정보
						pEvtInfo.initDesign();
						pEvtInfo.initData();
						break;
					case 3: // Session정보
						pMysqlSessionInfo.initDesign();
						pMysqlSessionInfo.initData();
						break;
					case 4: // MEM 정보
						pMysqlMemoryInfo.initDesign();
						pMysqlMemoryInfo.initData();
						break;
					case 5: // TBSPACE정보
						pMysqlTableSpaceInfo.initDesign();
						pMysqlTableSpaceInfo.initData();
						break;
					case 6: // DB 정보
						pMysqlDbInfo.initDesign();
						pMysqlDbInfo.initData();
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
						pMysqlSummary.search();
						break;
					case 1: // 성능
						DbmsPerfChart.search();
						break;
					case 2: // EVT 정보
						pEvtInfo.search();
						break;
					case 3: // Session
						pMysqlSessionInfo.search();
						break;
					case 4: //  MEM 정보
						pMysqlMemoryInfo.search();
						break;
					case 5: // TBSPACE정보
						pMysqlTableSpaceInfo.search();
						break;
					case 6: // DB정보
						pMysqlDbInfo.getChgDate();
						pMysqlDbInfo.search();
						break;
				}
			}catch(e){}
		},

	chgInfo: function(){

		var params = {
			mngNo: dtl_mngNo,
			dbmsNo: dtl_dbmsNo,
			action: 'U'
		}
		Server.post(ctxPath +'/main/popup/dbmsDetail/getDbmsInfo.do', {
			data: { mngNo: dtl_mngNo, dbmsNo: dtl_dbmsNo },
			success: function(data) {
				if(data != null) {
					$.post(ctxPath + '/main/popup/env/pSvrDbmsMonitAdd.do',
						params,
						function(result) {
							var dbmsInfo = data[0];
							HmWindow.open($('#pwindow'), '[{0}] DBMS정보 변경'.substitute(dbmsInfo.dbmsNm), result, 800, 240, 'p2window_init', dbmsInfo);
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
