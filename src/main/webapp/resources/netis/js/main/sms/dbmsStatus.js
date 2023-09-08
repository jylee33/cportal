var $grpTree, $dbGrid;
var timer;
var dtl_mngNo = -1;
var dtl_devName = '';
var dtl_dbmsNo = -1;
var dtl_dbmsKind = '';
var dtl_dbmsName = '';
var beforeDbmsKind = '';
var sFlag = false;

var DBMS_TAB = {
	ORACLE_DTL: 0,
	MYSQL_DTL: 1,
	COMM_PERF: 2,
	COMM_EVT: 3,
	ORACLE_DB_INFO: 4,
	ORACLE_TOP_SQL: 5,
	ORACLE_SESSION_INFO: 6,
	ORACLE_TRANSACTION_INFO: 7,
	ORACLE_SESSION_IO: 8,
	ORACLE_TABLESPACE_INFO: 9,
	ORACLE_USER_INFO: 10,
	ORACLE_LOG_INFO: 11,
	ORACLE_LOCK_INFO: 12,
	ORACLE_MEMORY_INFO: 13,

	MYSQL_SESSION_INFO: 14,
	MYSQL_MEMORY_INFO: 15,
	MYSQL_TABLESPACE_INFO: 16,
	MYSQL_DB_INFO: 17
}

var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#dGrpTreeGrid');
			$dbGrid = $('#dbGrid');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('', Main.search, timer);
			$("input[name=sRef]").eq(3).click();
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},

	/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
            $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},
		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DBMS, Main.search, {dbmsKind: 'ORACLE', devKind1 : 'SVR'});

			/** DB현황 그리드 그리기 */
			HmGrid.create($dbGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
                                var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                                var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                                var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                                if(treeItem != null) {
                                    _itemKind = treeItem.devKind2;
                                    _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                                    _grpParent = treeItem.grpParent;
                                }
                                $.extend(data, {
                                    grpType: _grpType,
                                    grpNo: _grpNo,
                                    grpParent: _grpParent,
                                    itemKind: _itemKind
								}, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
                                data.dbmsKind='ORACLE';
                                return data;
							},
							loadComplete: function(records) {
							}
						}
				),
				columns:
				[
					{ text: '서버번호', datafield: 'mngNo', width: 80, hidden: true },
					{ text: 'DB번호', datafield: 'dbmsNo', width: 80, hidden: true },
					{ text: '그룹명', datafield: 'grpName', width: 150, pinned: true },
					{ text: 'DBMS명', datafield: 'dbmsNm', width: 180, pinned: true, cellsrenderer: HmGrid.dbmsNameRenderer },
					{ text: '인스턴스', datafield: 'instnNm', width: 180 },
					{ text: '서버명', datafield: 'devName', displayfield: 'disDevName', minwidth: 180, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
					{ text: 'IP', datafield: 'devIp', width: 100 },
					{ text: 'DB 종류', datafield: 'dbmsKind', displayfield: 'disDbmsKind', width: 100 },
					{ text: 'DBMS상태', datafield: 'dbmsStatus', width: 100, cellsalign: 'center'/*, cellsrenderer: HmGrid.l4f5StatusRenderer*/},
					{ text: '인스턴스상태', datafield: 'instnStatus', width: 100, cellsalign: 'center'/*, cellsrenderer: HmGrid.l4f5StatusRenderer*/},
					{ text: '수집여부', datafield: 'perfPoll', width: 100, cellsalign: 'center'/*, cellsrenderer: HmGrid.l4f5StatusRenderer*/},
					{ text: '버전', datafield: 'dbmsVersion', width: 100 },
					{ text: '가동시간', datafield: 'sysUptime', width: 140, cellsrenderer: HmGrid.cTimerenderer },
					{ text: '최종수집일시', datafield: 'lastUpd', cellsalign: 'center', width: 160 }
			    ]
			}, CtxMenu.SVR, 0);

			$dbGrid.on('rowdoubleclick', function(event) {
				Main.chgDtlInfo(event.args.row.bounddata);
			}).on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					Main.chgDtlInfo(HmGrid.getRowData($(this)));
				} catch(e) {}
			});
			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {

		},

		/** 서버현황 그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($dbGrid, ctxPath + '/main/sms/dbmsStatus/getDbmsStatusList.do');
		},

		/** 상세정보 */
		chgDtlInfo: function(rowdata) {
			if(rowdata == null) return;

			if($.inArray(rowdata.dbmsKind.toLowerCase(), ['oracle', 'mysql','mssql', 'tibero']) === -1) {
				$('#dtlContent').empty().html('<div style="margin: 10px; ">[' + rowdata.dbmsKind  + '] DB는 상세정보를 제공하지 않습니다.</div>');
				return;
			}
			dtl_mngNo = rowdata.mngNo;
			dtl_devName = rowdata.disDevName;
			dtl_dbmsNo = rowdata.dbmsNo;
			// if(dtl_dbmsKind != rowdata.dbmsKind) {
				$('#dtlContent').empty().load(ctxPath + '/main/popup/sms/dbmsStatusDtl_{0}.do'.substitute(rowdata.dbmsKind.toLowerCase()));
			// }
			dtl_dbmsKind = rowdata.dbmsKind.toUpperCase();
			setTimeout(PMain.search, 300);
		},

		searchDtlInfo: function() {

		},

		searchDtlInfo_bak: function() {
			var showTab = null;

			switch(dtl_dbmsKind){
				case "ORACLE":
					showTab = [	DBMS_TAB.ORACLE_DTL, DBMS_TAB.COMM_PERF, DBMS_TAB.COMM_EVT, DBMS_TAB.ORACLE_DB_INFO,
						DBMS_TAB.ORACLE_TOP_SQL, DBMS_TAB.ORACLE_SESSION_INFO, DBMS_TAB.ORACLE_TRANSACTION_INFO,
						DBMS_TAB.ORACLE_SESSION_IO, DBMS_TAB.ORACLE_TABLESPACE_INFO, DBMS_TAB.ORACLE_USER_INFO,
						DBMS_TAB.ORACLE_LOG_INFO, DBMS_TAB.ORACLE_LOCK_INFO, DBMS_TAB.ORACLE_MEMORY_INFO
					];
					break;
				case "MYSQL":
					showTab = [ DBMS_TAB.MYSQL_DTL, DBMS_TAB.MYSQL_SESSION_INFO, DBMS_TAB.MYSQL_MEMORY_INFO, DBMS_TAB.MYSQL_TABLESPACE_INFO, DBMS_TAB.MYSQL_DB_INFO ];
					break;
			}

			$('#dtlTab .jqx-tabs-title').css('display', 'none');
			$.each(showTab, function(idx, value) {
				$('#dtlTab .jqx-tabs-title:eq(' + value + ')').css('display', 'block');
			});
			PMain.search();
		},

		/** export Excel */
		exportExcel: function() {
            HmUtil.exportGrid($dbGrid, "DB 현황", false);
		},

		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#cbRefreshCycle').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		}


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
