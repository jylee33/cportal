var $svrGrid;
var Main = {
		/** variable */
		initVariable : function() {
			$svrGrid = $('#svrGrid');
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
			case 'btnExcel': this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			Main.search();
		},

		/** init data */
		initData : function() {

		},

		/** 네트워크 그리드 조회 */
		search : function() {
			// Server.get('/main/airCube/svrStatus/getSvrStatusInfo.do', {
			// 	data: null,
			// 	success: function(result) {
			// 		if(result[0]!=null && result[0]!=undefined){
			// 			var data=result[0]
			// 			$('#cpuUser').html(Math.floor(data.cpuUser*100)/100 + "%" );
			// 			$('#cpuSys').html(Math.floor(data.cpuSys*100)/100 + "%");
			// 			$('#cpuIdle').html(Math.floor(data.cpuIdle*100)/100 + "%");
			// 			$('#memoryTotal').html(data.memoryTotal+ "k" ) ;
			// 			$('#memoryFree').html(data.memoryFree+ "k" );
			// 			$('#memoryUsed').html(data.memoryUsed+ "k" );
			// 			$('#swapTotal').html(data.swapTotal+ "k" );
			// 			$('#swapFree').html(data.swapFree+ "k" );
			// 			$('#swapUsed').html(data.swapUsed+ "k" );
			// 			$('#networkIn').html(data.networkIn);
			// 			$('#networkOut').html(data.networkOut);
			// 			$('#diskRoot').html(data.diskRoot + "%" );
			// 			$('#diskExport').html(data.diskExport + "%" );
			// 		}
			// 	}
			// });
		},

		exportExcel: function() {
			var params = {
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			};
			HmUtil.exportExcel(ctxPath + '/main/sms/perfNetwork/export.do', params);
		}
		
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});