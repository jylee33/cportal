var $svrGrid;
var timer;

var Main = {
		/** variable */
		initVariable: function() {
			$svrGrid = $('#svrGrid');
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
			$('#date1').jqxDateTimeInput({ width: 100, height: 21, theme: jqxTheme, formatString: 'yyyy-MM', showCalendarButton: false });
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/starcell/itmonMonthlyFsys/getITMonMonthlyFsysList.do'
						},
						{
							formatData: function(data) {
								$.extend(data, {
									date1: HmDate.getDateStr($('#date1'), 'yyyyMM')
								});
								return data;
							}
						}
				),
				columns: 
				[
					{ text : '그룹명', datafield: 'gname', width: 130 },
					{ text : '장비명', datafield: 'invenName', width: 150 },
					{ text : 'IP주소', datafield: 'agentIp', width: 120 },
					{ text : '파일시스템명', datafield: 'instance', width: 120 },
					{ text : '총량', datafield: 'totalSize', width: 100, cellsrenderer: HmGrid.unit1024renderer },
					{ text : '평균사용률(%)', datafield: 'usedPct', width: 120, cellsalign: 'right' },
					{ text : '최대사용률(%)', datafield: 'usedPctMax', width: 120, cellsalign: 'right' },
					{ text : '운영체제', datafield: 'os', minwidth: 250 }
			    ]
			});
		},
		
		/** init data */
		initData: function() {
			Main.chgRefreshCycle();
		},
		
		search: function() {
			HmGrid.updateBoundData($svrGrid);
		},
		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($svrGrid, '월간파일시스템', false);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});