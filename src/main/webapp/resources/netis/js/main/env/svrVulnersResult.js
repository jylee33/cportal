var $svrResultGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$svrResultGrid = $('#svrResultGrid');
			this.initCondition();
		},

		initCondition: function () {
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType_svrVulners'), HmResource.getResource('svr_vulners_srch_type'));
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			/*사용자 관리 */
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmGrid.create($svrResultGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json'
					}
				),
				columns:
					[
						{ text: '상태', datafield: 'code', width: 200, pinned: true },
						{ text: '장비 종류', datafield: 'evtName', width: 300, pinned: true },
						{ text: '그룹명', datafield: 'evtDesc' },
						{ text: '장비명', datafield: 'isUse', width: 300 },
						{ text: '장비IP', datafield: 'isUse2', width: 300 },
					],
				selectionmode: 'checkbox'
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {

		},
		
		search: function() {
			HmGrid.updateBoundData($smsHistGrid, ctxPath + '/main/env/smsHistory/getSmsHistoryList.do');
		},
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($smsHistGrid, '단문자 발송이력', false);
		}
		
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});