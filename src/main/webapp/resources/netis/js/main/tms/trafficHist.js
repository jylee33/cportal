var $histGrid, $cbPeriod;

var Main = {
		/** variable */
		initVariable: function() {
			$histGrid = $('#histGrid'), $cbPeriod = $('#cbPeriod');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchHist(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmGrid.create($histGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				columns: 
				[
					{ text : '발생일시', datafield : 'ymdhms', width : 160 },
					{ text : '망', datafield : 'grpName', width : 200 },
					{ text : '이벤트명', datafield : 'evtName', minwidth : 200 },
					{ text : '장애등급', datafield : 'evtLevel', width : 100, cellsrenderer : HmGrid.evtLevelrenderer },
					{ text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
					{ text : '장애상태', datafield : 'status', width: 100 }
			    ]						
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		getCommParams: function() {
			return HmBoxCondition.getPeriodParams();
		},
		
		searchHist: function() {
			HmGrid.updateBoundData($histGrid, ctxPath + '/main/tms/trafficHist/getTrafficEvtHist.do');
		},
		
		exportExcel: function() {
			HmUtil.exportExcel(ctxPath + '/main/tms/trafficHist/export.do', Main.getCommParams());
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});