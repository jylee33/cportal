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
			HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1, HmDate.FS_SHORT);			
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/starcell/itmonDailySys/getITMonDailySysList.do'
						},
						{
							formatData: function(data) {
								$.extend(data, {
									date1: HmDate.getDateStr($('#date1')),
									date2: HmDate.getDateStr($('#date2'))
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
					{ text : 'CPU평균(%)', datafield: 'cpu', width: 100, cellsalign: 'right' },
					{ text : 'CPU최대(%)', datafield: 'cpuM', width: 100, cellsalign: 'right' },
					{ text : 'USR평균(%)', datafield: 'usr', width: 100, cellsalign: 'right' },
					{ text : 'USR최대(%)', datafield: 'usrM', width: 100, cellsalign: 'right' },
					{ text : 'SYS평균(%)', datafield: 'sys', width: 100, cellsalign: 'right' },
					{ text : 'SYS최대(%)', datafield: 'sysM', width: 100, cellsalign: 'right' },
					{ text : 'WAIT평균(%)', datafield: 'wait', width: 100, cellsalign: 'right' },
					{ text : 'WAIT최대(%)', datafield: 'waitM', width: 100, cellsalign: 'right' },
					{ text : 'CPUQ평균(개)', datafield: 'cpuq', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'CPUQ최대(개)', datafield: 'cpuqM', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'MEM평균(%)', datafield: 'mem', width: 100, cellsalign: 'right' },
					{ text : 'MEM최대(%)', datafield: 'memM', width: 100, cellsalign: 'right' },
					{ text : 'SWAP평균(%)', datafield: 'swap', width: 100, cellsalign: 'right' },
					{ text : 'SWAP최대(%)', datafield: 'swapM', width: 100, cellsalign: 'right' },
					{ text : 'PIN평균(개)', datafield: 'pin', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'PIN최대(개)', datafield: 'pinM', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'POUT평균(개)', datafield: 'pout', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'POUT최대(개)', datafield: 'poutM', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'PSCAN평균(개)', datafield: 'pscanq', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'PSCAN최대(개)', datafield: 'pscanM', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'NETIN평균(개)', datafield: 'netin', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'NETIN최대(개)', datafield: 'netinM', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'NETOUT평균(개)', datafield: 'netout', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text : 'NETOUT최대(개)', datafield: 'netoutM', width: 100, cellsalign: 'right', cellsformat: 'n' },
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
			HmUtil.exportGrid($svrGrid, '일간시스템', false);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});