var $dGrpTreeGrid, $scmGwGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$scmGwGrid = $('#scmGwGrid');
			$dGrpTreeGrid = $('#dGrpTreeGrid');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createPeriod();
		},
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmTreeGrid.create($dGrpTreeGrid, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'IPT' });
		/*	Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));*/
			HmJqxSplitter.createTree($('#mainSplitter'));
			
			/** 장비 그리드 */
			HmGrid.create($scmGwGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [	
					             { name: 'grpName', type: 'string' },
					             { name: 'gwIp', type: 'string' },
					             { name: 'gwStats', type: 'string' },
					             { name: 'lastUpd', type: 'string' }
				            ]
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getDefGrpParams($dGrpTreeGrid));
								$.extend(data, HmBoxCondition.getPeriodParams(),);
								return data;
							},
							loadComplete: function(records) {
								curMngNo = 0;
							}
						}
				),
				columns:
				[
				 	{ text: '기관명', datafield: 'grpName', minwidth: 200, pinned: true }, 
				 	{ text: 'IP', datafield: 'gwIp', minwidth : 150, pinned: true }, 
					{ text: '상태', datafield: 'gwStats', width: 120 },
					{ text: '최종 수집 시간', datafield: 'lastUpd', width: 200 }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);

		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			return {
				date1: HmDate.getDateStr($('#sDate1')),
				time1: HmDate.getTimeStr($('#sDate1')),
				date2: HmDate.getDateStr($('#sDate2')),
				time2: HmDate.getTimeStr($('#sDate2'))
			};
		},
		
		/** IPT 성능현황 조회 */
		search: function() {
			HmGrid.updateBoundData($scmGwGrid, ctxPath + '/main/ssIpt/scmGwStatus/getScmGwStatusList.do');
		},
		
		/** 엑셀 Export 기능 */
		exportExcel: function() {
			var _grpNo = -1;
			var _grpName = '';
			var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
			if(treeItem != null) {
				_grpNo = treeItem.grpNo;
				_grpName = treeItem.grpName;
			}
			
			var params = {
								grpNo: _grpNo,
								grpName: _grpName
								}
			
			$.extend(params, Main.getCommParams());
			
			HmUtil.exportExcel(ctxPath + '/main/ssIpt/scmGwStatus/export.do', params);
		}
		
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});