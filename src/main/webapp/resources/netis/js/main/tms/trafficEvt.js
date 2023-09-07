var $evtGrid;
var timer;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$evtGrid = $('#evtGrid');
		this.initCondition();
	},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('', Main.search, timer);
		$("input[name=sRef]").eq(3).click();
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.searchEvt(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {

		HmGrid.create($evtGrid, {
			source : new $.jqx.dataAdapter(
					{ 
						datatype : 'json' 
					}, 
					{ 
						formatData : function(data) {
							return data;
						}
					}
			),
			selectionmode: 'multiplerowsextended',
			columns : [
				{ text : '발생일시', datafield : 'ymdhms', width : 160 },
				{ text : '망', datafield : 'grpName', width : 200 },
				{ text : '이벤트명', datafield : 'evtName', minwidth : 200 },
				{ text : '장애등급', datafield : 'evtLevel', width : 100, cellsrenderer : HmGrid.evtLevelrenderer },
				{ text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
				{ text : '장애상태', datafield : 'status', width: 100 }
			] 
		}, CtxMenu.DOS_EVT);
	},

	/** init data */
	initData : function() {
		this.searchEvt();
	},

	/** 조회 */
	searchEvt : function() {
		HmGrid.updateBoundData($evtGrid, ctxPath + '/main/tms/trafficEvt/getTrafficEvtList.do');
	},

	exportExcel: function() {
		HmUtil.exportExcel(ctxPath + '/main/tms/trafficEvt/export.do', {});
	}
	
};

function refresh() {
	Main.searchErr();
}