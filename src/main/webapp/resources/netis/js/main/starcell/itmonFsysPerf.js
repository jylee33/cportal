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
			$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
			$('#prgrsBar').on('complete', function(event) {
				Main.search();
				$(this).val(0);
			});
			$('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: 'NONE', value: 0 },
				         { label: '30초', value: 30 },
				         { label: '20초', value: 20 },
				         { label: '10초', value: 10 },
				         { label: '5초', value: 5 }
				         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 1
			})
			.on('change', function() {
				Main.chgRefreshCycle();
			});
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/starcell/itmonFsysPerf/getITMonFsysPerfList.do'
						}
				),
				columns: 
				[
					{ text : '그룹명', datafield: 'gname', width: 130 },
					{ text : '서버명', datafield: 'invenName', width: 150 },
					{ text : 'IP주소', datafield: 'agentIp', width: 120 },
					{ text : '파일시스템명', datafield: 'instance', width: 150 },
					{ text : '파일시스템크기', datafield: 'total', width: 100, cellsrenderer: HmGrid.unit1024renderer },
					{ text : '사용률(%)', datafield: 'usedPct', width: 100, cellsalign: 'right' },
					{ text : '운영체제', datafield: 'smsMachineType', minwidth: 250 },
					{ text : '버전', datafield: 'osVer', width: 130 }
			    ]
			});
		},
		
		/** init data */
		initData: function() {
			Main.chgRefreshCycle();
		},
		
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#refreshCycleCb').val();
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
		},
		
		search: function() {
			HmGrid.updateBoundData($svrGrid);
		},
		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($svrGrid, '파일시스템성능', false);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});