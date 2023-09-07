var $logGrid;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$logGrid = $('#logGrid');
			$cbPeriod = $('#cbPeriod');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnDtlSearch": this.searchChart(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
			HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 1);
			HmGrid.create($logGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData : function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				columns: 
				[
					{ text : '접속IP', datafield : 'ip',  width: 130 },
					{ text : '관리자ID', datafield : 'userName', width: 130 },
					{ text : '시간', datafield : 'timestamp', width: 130 },
					{ text : 'ACTION', datafield : 'menu', width: 120 },
					{ text : '변경테이블', datafield : 'targetTable', width: 150 },
					{ text : '변경대상', datafield: 'targetName', width: 150 },
					{ text : 'EVENT', datafield: 'event', minwidth: 100 }
			    ]
			});
			Main.search();
		},

		/** init data */
		initData : function() {

		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
			$.extend(params, {
				grpNo: treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
						itemKind: treeItem != null? treeItem.devKind2 : 'GROUP',
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))				
			});
			return params;
		},
		/** 그리드 조회 */
		search : function() {
			// HmGrid.updateBoundData($logGrid, ctxPath + '/main/airCube/adminLog/getAdminLogList.do' );
		},		
	    exportExcel: function() {
	    	var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
			var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
		
			var params = {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			};
			
			HmUtil.exportExcel(ctxPath + '/main/sms/perfNetwork/export.do', params);
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		}
		
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});