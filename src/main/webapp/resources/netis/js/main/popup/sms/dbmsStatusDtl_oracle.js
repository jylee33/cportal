var $dtlTab;
var sAuth;

var PMain = {
		TAB: {
			DTL: 0, PERF: 1, EVT: 2, DB_INFO: 3, TOP_SQL: 4, SESSION_INFO: 5,
			TRANSACTION_INFO: 6, SESSION_IO: 7, TABLESPACE_INFO: 8, USER_INFO: 9,
			LOG_INFO: 10, LOCK_INFO: 11, MEMORY_INFO: 12
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
			if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
				$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			}
			// alert(dtl_dbmsKind)
			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case PMain.TAB.DTL: // ORACLE 요약
						pOraSummary.initDesign();
						break;
					case PMain.TAB.PERF: // COMMON 성능
						DbmsPerfTree.initDesign();
						DbmsPerfChart.initDesign();
						break;
					case PMain.TAB.EVT: // COMMON 이벤트
						pEvtInfo.initDesign();
						pEvtInfo.initData();
						break;
					case PMain.TAB.DB_INFO: // ORA DB정보
						pOraDbInfo.initDesign();
						pOraDbInfo.initData();
						break;
					case PMain.TAB.TOP_SQL: // ORA TopSql정보
						pOraTopSql.initDesign();
						pOraTopSql.initData();
						break;
					case PMain.TAB.SESSION_INFO: // ORA Session정보
						pOraSessionInfo.initDesign();
						pOraSessionInfo.initData();
						break;
					case PMain.TAB.TRANSACTION_INFO: // ORA Transaction 정보
						pOraTransactionInfo.initDesign();
						pOraTransactionInfo.initData();
						break;
					case PMain.TAB.SESSION_IO: // ORA IO 정보
						pOraSessionIo.initDesign();
						pOraSessionIo.initData();
						break;
					case PMain.TAB.TABLESPACE_INFO: // ORA TableSpace정보
						pOraTableSpaceInfo.initDesign();
						pOraTableSpaceInfo.initData();
						break;
					case PMain.TAB.USER_INFO: // ORA User정보
						pOraUserInfo.initDesign();
						pOraUserInfo.initData();
						break;
					case PMain.TAB.LOG_INFO: // ORA Log정보
						pOraLogInfo.initDesign();
						pOraLogInfo.initData();
						break;
					case PMain.TAB.LOCK_INFO: // ORA Lock정보
						pOraLock.initDesign();
						pOraLock.initData();
						break;
					case PMain.TAB.MEMORY_INFO: // ORA Memory정보
						pOraMemoryInfo.initDesign();
						pOraMemoryInfo.initData();
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
					case PMain.TAB.DTL: // ORACLE 요약
						pOraSummary.search();
						break;
					case PMain.TAB.PERF: // COMMON 성능
						DbmsPerfChart.search();
						break;
					case PMain.TAB.EVT: // COMMON 이벤트
						pEvtInfo.search();
						break;
					case PMain.TAB.DB_INFO: // ORA DB정보
						pOraDbInfo.getChgDate();
						pOraDbInfo.search();
						break;
					case PMain.TAB.TOP_SQL: // ORA TopSql정보
						pOraTopSql.search();
						break;
					case PMain.TAB.SESSION_INFO: // ORA Session정보
						pSessionInfo.search();
						break;
					case PMain.TAB.TRANSACTION_INFO: // ORA Transaction 정보
						pOraTransactionInfo.search();
						break;
					case PMain.TAB.SESSION_IO: // ORA IO 정보
						pOraSessionIo.search();
						break;
					case PMain.TAB.TABLESPACE_INFO: // ORA TableSpace정보
						pOraTableSpaceInfo.search();
						break;
					case PMain.TAB.USER_INFO: // ORA User정보
						pOraUserInfo.search();
						break;
					case PMain.TAB.LOG_INFO: // ORA Log정보
						pOraLogInfo.search();
						break;
					case PMain.TAB.LOCK_INFO: // ORA Lock정보
						pOraLock.search();
						break;
					case PMain.TAB.MEMORY_INFO: // ORA Memory정보
						pOraMemoryInfo.search();
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
