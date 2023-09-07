var $dtlTab;
var sAuth;

var PMain = {
		TAB: {
			SUMMARY: 0, PERF: 1, SESSION: 2, EVT: 3, TABLESPACE: 4, ENVIRON: 5
		},

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

			 // $('#dbmsStatusDtl').hide();
			// if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
			// 	$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			// }
			// alert(dtl_dbmsKind)

			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
						case PMain.TAB.SUMMARY:
							pSummary.initDesign();
							break;
						case PMain.TAB.PERF:
							DbmsPerfTree.initDesign();
							DbmsPerfChart.initDesign();
							break;
						case PMain.TAB.SESSION:
							pSession.initDesign();
							pSession.initData();
							break;
						case PMain.TAB.EVT:
							pEvtInfo.initDesign();
							pEvtInfo.initData();
							break;
						case PMain.TAB.TABLESPACE:
							pTableSpace.initDesign();
							pTableSpace.initData();
							break;
						case PMain.TAB.ENVIRON:
							pEnviron.initDesign();
							pEnviron.initData();
							break;
					}
				}
			}).on('selected', function(event) {
				// PMain.search();
			});
			$('#dbmsStatusDtl').css('visibility', 'visible');
		},

		/** init data */
		initData: function() {

		},

		search: function() {
			try{
				switch($dtlTab.val()) {
					case PMain.TAB.SUMMARY: // 요약
						pSummary.search();
						break;
					case PMain.TAB.PERF:
						DbmsPerfTree.initDesign();
						DbmsPerfChart.initDesign();
						break;
					case PMain.TAB.SESSION:
						pSession.search();
						break;
					case PMain.TAB.EVT:
						pEvtInfo.search();
						break;
					case PMain.TAB.TABLESPACE:
						pTableSpace.search();
						break;
					case PMain.TAB.ENVIRON:
						pEnviron.search();
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


		Server.post(ctxPath +'/main/popup/dbmsCommonDetail/getDbmsInfo.do', {
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
