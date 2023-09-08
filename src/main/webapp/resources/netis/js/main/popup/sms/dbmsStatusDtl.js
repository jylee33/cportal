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
			$('#dbmsStatusDtl').hide();
			if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
				$('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			}
			// alert(dtl_dbmsKind)
			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case DBMS_TAB.ORACLE_DTL: // ORACLE 요약
						break;
					case DBMS_TAB.MYSQL_DTL: // MYSQL 요약
						break;
					case DBMS_TAB.COMM_PERF: // COMMON 성능
						DbmsPerfTree.initDesign();
						DbmsPerfChart.initDesign();
						break;
					case DBMS_TAB.COMM_EVT: // COMMON 이벤트
						pEvtInfo.initDesign();
						pEvtInfo.initData();
						break;
					case DBMS_TAB.ORACLE_DB_INFO: // ORA DB정보
						pOraDbInfo.initDesign();
						pOraDbInfo.initData();
						break;
					case DBMS_TAB.ORACLE_TOP_SQL: // ORA TopSql정보
						pOraTopSql.initDesign();
						pOraTopSql.initData();
						break;
					case DBMS_TAB.ORACLE_SESSION_INFO: // ORA Session정보
						pOraSessionInfo.initDesign();
						pOraSessionInfo.initData();
						break;
					case DBMS_TAB.ORACLE_TRANSACTION_INFO: // ORA Transaction 정보
						pOraTransactionInfo.initDesign();
						pOraTransactionInfo.initData();
						break;
					case DBMS_TAB.ORACLE_SESSION_IO: // ORA IO 정보
						pOraSessionIo.initDesign();
						pOraSessionIo.initData();
						break;
					case DBMS_TAB.ORACLE_TABLESPACE_INFO: // ORA TableSpace정보
						pOraTableSpaceInfo.initDesign();
						pOraTableSpaceInfo.initData();
						break;
					case DBMS_TAB.ORACLE_USER_INFO: // ORA User정보
						pOraUserInfo.initDesign();
						pOraUserInfo.initData();
						break;
					case DBMS_TAB.ORACLE_LOG_INFO: // ORA Log정보
						pOraLogInfo.initDesign();
						pOraLogInfo.initData();
						break;
					case DBMS_TAB.ORACLE_LOCK_INFO: // ORA Lock정보
						pOraLock.initDesign();
						pOraLock.initData();
						break;
					case DBMS_TAB.ORACLE_MEMORY_INFO: // ORA Memory정보
						pOraMemoryInfo.initDesign();
						pOraMemoryInfo.initData();
						break;

					case DBMS_TAB.MYSQL_SESSION_INFO: // MYSQL SESSION정보
						// pMysqlSessionInfo.initDesign();
						// pMysqlSessionInfo.initData();
						break;
					case DBMS_TAB.MYSQL_MEMORY_INFO: // MYSQL Memory정보
						// pMysqlMemoryInfo.initDesign();
						// pMysqlMemoryInfo.initData();
						break;
					case DBMS_TAB.MYSQL_TABLESPACE_INFO: // MYSQL TableSpace정보
						// pMysqlTableSpaceInfo.initDesign();
						// pMysqlTableSpaceInfo.initData();
						break;
					case DBMS_TAB.MYSQL_DB_INFO: // MYSQL DB정보
						// pMysqlDbInfo.initDesign();
						// pMysqlDbInfo.initData();
						break;
					}
				}
			}).on('selected', function(event) {
				// PMain.search();
			});
			$('#dbmsStatusDtl').show();


		},
		
		/** init data */
		initData: function() {

		},
		
		search: function() {
			try{
				switch($dtlTab.val()) {
					case DBMS_TAB.ORACLE_DTL: // ORACLE 요약
						pOraSummary.search();
						break;
					case DBMS_TAB.MYSQL_DTL: // MYSQL 요약
						pMysqlSummary.search();
						break;

					case DBMS_TAB.COMM_PERF: // COMMON 성능
						DbmsPerfChart.search();
						break;
					case DBMS_TAB.COMM_EVT: // COMMON 이벤트
						pEvtInfo.search();
						break;

					case DBMS_TAB.ORACLE_DB_INFO: // ORA DB정보
						pOraDbInfo.getChgDate();
						pOraDbInfo.search();
						break;
					case DBMS_TAB.ORACLE_TOP_SQL: // ORA TopSql정보
						pOraTopSql.search();
						break;
					case DBMS_TAB.ORACLE_SESSION_INFO: // ORA Session정보
						pSessionInfo.search();
						break;
					case DBMS_TAB.ORACLE_TRANSACTION_INFO: // ORA Transaction 정보
						pOraTransactionInfo.search();
						break;
					case DBMS_TAB.ORACLE_SESSION_IO: // ORA IO 정보
						pOraSessionIo.search();
						break;
					case DBMS_TAB.ORACLE_TABLESPACE_INFO: // ORA TableSpace정보
						pOraTableSpaceInfo.search();
						break;
					case DBMS_TAB.ORACLE_USER_INFO: // ORA User정보
						pOraUserInfo.search();
						break;
					case DBMS_TAB.ORACLE_LOG_INFO: // ORA Log정보
						pOraLogInfo.search();
						break;
					case DBMS_TAB.ORACLE_LOCK_INFO: // ORA Lock정보
						pOraLock.search();
						break;
					case DBMS_TAB.ORACLE_MEMORY_INFO: // ORA Memory정보
						pOraMemoryInfo.search();
						break;

					case DBMS_TAB.MYSQL_SESSION_INFO: // MYSQL SESSION정보
						// pMysqlSessionInfo.search();
						break;
					case DBMS_TAB.MYSQL_MEMORY_INFO: // MYSQL Memory정보
						// pMysqlMemoryInfo.search();
						break;
					case DBMS_TAB.MYSQL_TABLESPACE_INFO: // MYSQL TableSpace정보
						// pMysqlTableSpaceInfo.search();
						break;
					case DBMS_TAB.MYSQL_DB_INFO: // MYSQL DB정보
						// pMysqlDbInfo.search();
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
