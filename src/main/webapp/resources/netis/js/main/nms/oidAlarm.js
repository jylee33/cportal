var $oidAlarmGrid;
var timer;
var isSearchBtn = false;
var Main = {
		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$oidAlarmGrid = $('#oidAlarmGrid');
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
			case "btnExcel": this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
			Master.createGrpTab(Main.search);
			
			$('#btnViewType').jqxButtonGroup({ mode: 'radio', theme: jqxTheme })
				.on('buttonclick', function(event) {
					Main.chgViewType(event.args.button[0].id);
				});
			$('#btnViewType').jqxButtonGroup('setSelection', 0);

			// input timeProcessBar
			$('#prgrsBar').jqxProgressBar({ width : 100, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
			$('#prgrsBar').on('complete', function(event) {
				$(this).val(0);
				Main.search();
			});
			$('#cbRefreshCycle').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: 'NONE', value: 0 },
				         { label: '30초', value: 30 },
				         { label: '20초', value: 20 },
				         { label: '10초', value: 10 },
				         { label: '5초', value: 5 }
				         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 0
			})
			.on('change', function() {
				Main.chgRefreshCycle();
			});
			HmGrid.create($oidAlarmGrid, {
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
				 	{ text : '발생일시', 	datafield: 'ymdhms',			width: 150 	 },
					{ text : '장비이름', 	datafield: 'levelVal',			width: 150 	 },
					{ text : '장비IP', 		datafield: 'facilityVal',		width: 150 	 },
					{ text : '임계치', 		datafield: 'devName',		width: 120	 },
					{ text : '값', 			datafield: 'userDevName',	width: 150    },
					{ text : '지속시간', 	datafield: 'hostIp',			width: 150     },
					{ text : '상태', 		datafield: 'msg',				minwidth: 100 }
			    ]
			});
			Master.createGrpTab(Main.selectTree);
		},

		/** init data */
		initData : function() {

		},
		selectTree: function() {
			Main.search();
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var btnIdx = $('#btnViewType').jqxButtonGroup('getSelection');
			var params = Master.getGrpTabParams();
			$.extend(params, {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2')),
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val(),
				viewType: btnIdx == 0? 'HISTORY' : 'REALTIME',
			});
			return params;
		},
		chgViewType: function(btnId) {
			switch(btnId) {
			case 'HISTORY':
				$('.RType').css('display', 'none');
				$('.HType').css('display', 'block');
				break;
			case 'REALTIME':
				$('.RType').css('display', 'block');
				$('.HType').css('display', 'none');
				break;
			}
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
		},
		
		searchDevCond: function() {
			HmGrid.updateBoundData($('#devGrid'), ctxPath + '/dev/getDevList.do');
		},
		
		search : function() {
			$oidAlarmGrid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
			HmGrid.updateBoundData($oidAlarmGrid, ctxPath + '/main/nms/oidAlarm/getOidAlarmList.do');
			$('#prgrsBar').val(0);
		},
		
	    
		/** export Excel */
		exportExcel: function() {
			var btnIdx = $('#btnViewType').jqxButtonGroup('getSelection');
			var params = Master.getGrpTabParams();
			$.extend(params, {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2')),
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val(),
				viewType: btnIdx == 0? 'HISTORY' : 'REALTIME',
			});
		//	alert(JSON.stringify(params));
			HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', params);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});