var $cpuGrid, $memGrid, $restimeGrid, $inbpsGrid, $outbpsGrid, $inerrGrid, $outerrGrid, $evtGrid;

var Main = {
		/** variable */
		initVariable : function() {
			$cpuGrid = $('#cpuGrid'), $memGrid = $('#memGrid'), $restimeGrid = $('#restimeGrid'); 
			$inbpsGrid = $('#inbpsGrid'), $outbpsGrid = $('#outbpsGrid'), $inerrGrid = $('#inerrGrid'), $outerrGrid = $('#outerrGrid');
			$evtGrid = $('#evtGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('#ckTimeSet').bind('change', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			case 'btnReport': this.report(); break;
			case 'ckTimeSet': this.chgTimeSet(); break;
			case 'btnSchedule': this.showScheduleList(); break;
			}
		},

		/** init design */
		initDesign : function() {
			$('#date1').jqxDateTimeInput({ width: 100, height: 21, theme: jqxTheme, formatString: HmDate.FS_SHORT });
			$('#time1, #time2').jqxDateTimeInput({ width: 30, height: 21, theme: jqxTheme, formatString: 'HH', textAlign: 'center', showCalendarButton: false, disabled: true });
			$('#time2').val('23');
			HmGrid.create($cpuGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData : function(data) {
								$.extend(data, Main.getCommParams());
								$.extend(data, {
									itemType: 1
								});
								return data;
							}
						}
				),
				height : 247,
				pageable : false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, 'CPU 사용률 TOP1');
                },
				columns: 
				[
					{ text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer, cellsalign: 'center' },
					{ text: '그룹', datafield: 'grpName', width: 150 },
					{ text: '장비명', datafield: 'devName', minwidth: 100 },
					{ text: 'IP', datafield: 'devIp', width: 150 },
					{ text: '평균', datafield: 'avgVal', width: 150, cellsalign: 'right' },
					{ text: '최대', datafield: 'maxVal', width: 150, cellsalign: 'right' }
			    ]
			});

			HmGrid.create($memGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'								
						},
						{
							formatData : function(data) {
								$.extend(data, Main.getCommParams());
								$.extend(data, {
									itemType: 2
								});
								return data;
							}
						}
				),
			    height : 247,
			    pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, 'MEMORY 사용률 TOP10');
                },
				columns: 
				[
					{ text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer, cellsalign: 'center' },
					{ text: '그룹', datafield: 'grpName', width: 150 },
					{ text: '장비명', datafield: 'devName', minwidth: 100 },
					{ text: 'IP', datafield: 'devIp', width: 150 },
					{ text: '평균', datafield: 'avgVal', width: 150, cellsalign: 'right' },
					{ text: '최대', datafield: 'maxVal', width: 150, cellsalign: 'right' }
			    ]
			});
			
			HmGrid.create($restimeGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'								
						},
						{
							formatData : function(data) {
								$.extend(data, Main.getCommParams());
								$.extend(data, {
									itemType: 6
								});
								return data;
							}
						}
				),
				height : 247,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, '응답시간 TOP10');
                },
				columns: 
					[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer, cellsalign: 'center' },
					 { text: '그룹', datafield: 'grpName', width: 150 },
					 { text: '장비명', datafield: 'devName', minwidth: 100 },
					 { text: 'IP', datafield: 'devIp', width: 150 },
					 { text: '평균', datafield: 'avgVal', width: 150, cellsalign: 'right' },
					 { text: '최대', datafield: 'maxVal', width: 150, cellsalign: 'right' }
					 ]
			});
			
			HmGrid.create($inbpsGrid, {
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
				height : 273,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, '트래픽 사용률 TOP10 - IN');
                },
				columns: 
				[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer },
					 { text: '장비', datafield: 'devName', width: 180 },
					 { text: '회선', datafield: 'ifName', minwidth: 130 },
					 { text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'bps', datafield: 'avgBps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '최대', columngroup: 'bps', datafield: 'maxBps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'bpsper', datafield: 'avgBpsPer', width: 100, cellsalign: 'right' },
					 { text: '최대', columngroup: 'bpsper', datafield: 'maxBpsPer', width: 100, cellsalign: 'right' }
				 ],
				 columngroups: 
				 [
				  	{ text: 'BPS', name: 'bps', align: 'center' },
				  	{ text: 'BPS (%)', name: 'bpsper', align: 'center' }
				 ]
			});
			
			HmGrid.create($outbpsGrid, {
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
				height : 273,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, '트래픽 사용률 TOP10 - OUT');
                },
				columns: 
				[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer },
					 { text: '장비', datafield: 'devName', width: 180 },
					 { text: '회선', datafield: 'ifName', minwidth: 130 },
					 { text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'bps', datafield: 'avgBps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '최대', columngroup: 'bps', datafield: 'maxBps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'bpsper', datafield: 'avgBpsPer', width: 100, cellsalign: 'right' },
					 { text: '최대', columngroup: 'bpsper', datafield: 'maxBpsPer', width: 100, cellsalign: 'right' }
				 ],
				 columngroups: 
				 [
				  	{ text: 'BPS', name: 'bps', align: 'center' },
				  	{ text: 'BPS (%)', name: 'bpsper', align: 'center' }
				 ]
			});
			
			HmGrid.create($inerrGrid, {
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
				height : 273,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, ' 에러율 TOP10 - IN');
                },
				columns: 
					[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer },
					 { text: '장비', datafield: 'devName', width: 180 },
					 { text: '회선', datafield: 'ifName', minwidth: 130 },
					 { text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'err', datafield: 'avgErr', width: 100, cellsalign: 'right', cellsformat: 'n' },
					 { text: '최대', columngroup: 'err', datafield: 'maxErr', width: 100, cellsalign: 'right', cellsformat: 'n' }
					 ],
					 columngroups: 
					 [
						  { text: 'ERROR', name: 'err', align: 'center' },
					  ]
			});
			
			HmGrid.create($outerrGrid, {
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
				height : 273,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, ' 에러율 TOP10 - OUT');
                },
				columns: 
					[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer },
					 { text: '장비', datafield: 'devName', width: 180 },
					 { text: '회선', datafield: 'ifName', minwidth: 130 },
					 { text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					 { text: '평균', columngroup: 'err', datafield: 'avgErr', width: 100, cellsalign: 'right', cellsformat: 'n' },
					 { text: '최대', columngroup: 'err', datafield: 'maxErr', width: 100, cellsalign: 'right', cellsformat: 'n' }
					 ],
					 columngroups: 
					 [
						  { text: 'ERROR', name: 'err', align: 'center' }
					  ]
			});
			
			HmGrid.create($evtGrid, {
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
				height : 273,
				autoheight: true,
				pageable: false,
                showtoolbar: true,
                rendertoolbar: function (toolbar) {
                    HmGrid.titlerenderer(toolbar, '장애 상세 현황');
                },
				columns: 
				[
					 { text: 'No.', width: 50, cellsrenderer: HmGrid.rownumrenderer },
					 { text: '발생일시', datafield: 'ymdhms', width: 150 },
					 { text: '장애종류', datafield: 'srcType', width: 80 },
					 { text: '장애대상', datafield: 'srcInfo', minwidth: 130 },
					 { text: '지속시간', datafield: 'sumSec', width: 120, cellsrenderer: HmGrid.cTimerenderer },
					 { text: '이벤트명', datafield: 'evtName', width: 150 },
					 { text: '장애등급', datafield: 'evtLevel', width: 80, cellsrenderer: HmGrid.evtLevelrenderer },
					 { text: '장애상태', datafield: 'status', cellsalign: 'center', width: 80 }
				 ]
			});

			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {

			var isChecked = $('#ckTimeSet').is(':checked');
			var params = {
					date1: HmDate.getDateStr($('#date1')),
					time1: isChecked? HmDate.getTimeStr($('#time1')) : '0000',
					time2: isChecked? HmDate.getTimeStr($('#time2')) : '2359',
					ckTimeSet: isChecked
				};
			return params;
		},
		
		chgTimeSet: function() {
			var isChecked = $('#ckTimeSet').is(':checked');
			$('#time1, #time2').jqxDateTimeInput({ disabled: !isChecked });
		},
		
		/** 조회 */
		search : function() {
			HmGrid.updateBoundData($cpuGrid, ctxPath + '/main/rpt/dailyWorkRpt/getDevPerfList.do' );
			HmGrid.updateBoundData($memGrid, ctxPath + '/main/rpt/dailyWorkRpt/getDevPerfList.do' );
			HmGrid.updateBoundData($restimeGrid, ctxPath + '/main/rpt/dailyWorkRpt/getRestimePerfList.do' );
			HmGrid.updateBoundData($inbpsGrid, ctxPath + '/main/rpt/dailyWorkRpt/getInbpsPerfList.do' );
			HmGrid.updateBoundData($outbpsGrid, ctxPath + '/main/rpt/dailyWorkRpt/getOutbpsPerfList.do' );
			HmGrid.updateBoundData($inerrGrid, ctxPath + '/main/rpt/dailyWorkRpt/getInerrPerfList.do' );
			HmGrid.updateBoundData($outerrGrid, ctxPath + '/main/rpt/dailyWorkRpt/getOuterrPerfList.do' );
			HmGrid.updateBoundData($evtGrid, ctxPath + '/main/rpt/dailyWorkRpt/getEvtStatusList.do' );
		},
		
		/** 차트 조회 */
		drawCpuChart: function(mngNos) {
			$cpuChart.jqxChart('seriesGroups', []);
			$cpuChart.jqxChart('source', 0);
			$cpuChart.jqxChart('update');
			if(mngNos.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getDevPerfChartList.do', {
				data: { mngNos: mngNos, itemType: 1, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'avgVal', displayText: value.devName }]
							});
						});
					}
					$cpuChart.jqxChart('seriesGroups', _seriesGroups);
					$cpuChart.jqxChart('source', result);
					$cpuChart.jqxChart('update');
				}
			});
		},

		drawMemChart: function(mngNos) {
			$memChart.jqxChart('seriesGroups', []);
			$memChart.jqxChart('source', 0);
			$memChart.jqxChart('update');
			if(mngNos.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getDevPerfChartList.do', {
				data: { mngNos: mngNos, itemType: 2, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'avgVal', displayText: value.devName }]
							});
						});
					}
					$memChart.jqxChart('seriesGroups', _seriesGroups);
					$memChart.jqxChart('source', result);
					$memChart.jqxChart('update');
				}
			});
		},
		
		drawRestimeChart: function(mngNos) {
			$restimeChart.jqxChart('seriesGroups', []);
			$restimeChart.jqxChart('source', 0);
			$restimeChart.jqxChart('update');
			if(mngNos.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getDevPerfChartList.do', {
				data: { mngNos: mngNos, itemType: 6, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'avgVal', displayText: value.devName }]
							});
						});
					}
					$restimeChart.jqxChart('seriesGroups', _seriesGroups);
					$restimeChart.jqxChart('source', result);
					$restimeChart.jqxChart('update');
				}
			});
		},
		
		drawInbpsChart: function(keys) {
			$inbpsChart.jqxChart('seriesGroups', []);
			$inbpsChart.jqxChart('source', 0);
			$inbpsChart.jqxChart('update');
			if(keys.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getInbpsPerfChartList.do', {
				data: { keys: keys, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'val', displayText: value.ifName }]
							});
						});
					}
					$inbpsChart.jqxChart('seriesGroups', _seriesGroups);
					$inbpsChart.jqxChart('source', result);
					$inbpsChart.jqxChart('update');
				}
			});
		},
		
		drawOutbpsChart: function(keys) {
			$outbpsChart.jqxChart('seriesGroups', []);
			$outbpsChart.jqxChart('source', 0);
			$outbpsChart.jqxChart('update');
			if(keys.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getOutbpsPerfChartList.do', {
				data: { keys: keys, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'val', displayText: value.ifName }]
							});
						});
					}
					$outbpsChart.jqxChart('seriesGroups', _seriesGroups);
					$outbpsChart.jqxChart('source', result);
					$outbpsChart.jqxChart('update');
				}
			});
		},
		
		drawInerrChart: function(keys) {
			$inerrChart.jqxChart('seriesGroups', []);
			$inerrChart.jqxChart('source', 0);
			$inerrChart.jqxChart('update');
			if(keys.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getInerrPerfChartList.do', {
				data: { keys: keys, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'val', displayText: value.ifName }]
							});
						});
					}
					$inerrChart.jqxChart('seriesGroups', _seriesGroups);
					$inerrChart.jqxChart('source', result);
					$inerrChart.jqxChart('update');
				}
			});
		},
		
		drawOuterrChart: function(keys) {
			$outerrChart.jqxChart('seriesGroups', []);
			$outerrChart.jqxChart('source', 0);
			$outerrChart.jqxChart('update');
			if(keys.length == 0) return;
			
			Server.post('/main/rpt/dailyWorkRpt/getOuterrPerfChartList.do', {
				data: { keys: keys, date1: HmDate.getDateStr($('#date1')) },
				success: function(result) {
					var _seriesGroups = [];
					if(result != null) {
						$.each(result, function(idx, value) {
							_seriesGroups.push({
								type: 'line',
								source: value.chartData,
								series: [{ dataField: 'val', displayText: value.ifName }]
							});
						});
					}
					$outerrChart.jqxChart('seriesGroups', _seriesGroups);
					$outerrChart.jqxChart('source', result);
					$outerrChart.jqxChart('update');
				}
			});
		},
		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportExcel(ctxPath + '/main/rpt/dailyWorkRpt/export.do', Main.getCommParams());
		},
		
		/** 보고서 */
		report: function() {
			HmUtil.createPopup('/oz/viewer/dailyWorkRptViewer.do', $('#hForm'), 'oz', 1200, 700, Main.getCommParams());
		},


		/** 스케줄 파일 목록 보기 */
		showScheduleList: function() {
			HmUtil.createPopup('/oz/popup/pDailyWorkFileList.do', $('#hForm'), 'ozpopup', 400, 600);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});