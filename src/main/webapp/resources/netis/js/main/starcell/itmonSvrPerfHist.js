var $svrGrid, $cpuChart, $memChart, $swapChart;
var timer;

var Main = {
		/** variable */
		initVariable: function() {
			$svrGrid = $('#svrGrid'), $cpuChart = $('#cpuChart'), $memChart = $('#memChart'), $swapChart = $('#swapChart');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch_svr': this.searchSvr(); break;
			case 'btnSearch_perf': this.searchPerf(); break;
			case 'btnCList_c': this.showChartData('cpu'); break;
			case 'btnCSave_c': this.saveChart($cpuChart, 'cpu.png'); break;
			case 'btnCList_m': this.showChartData('mem'); break;
			case 'btnCSave_m': this.saveChart($memChart, 'memory.png'); break;
			case 'btnCList_s': this.showChartData('swap'); break;
			case 'btnCSave_s': this.saveChart($swapChart, 'swap.png'); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 600, collapsible: false }, { size: '100%' }], 'auto', '100%');
			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEFAULT, 200, 21, 200, 300, Main.searchSvr);
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($('#grpTree'));
								data.grpNo = treeItem !== null? treeItem.grpNo : 0;
								return data;
							}
						}
				),
				columns: 
				[
					{ text : 'INVEN ID', datafield: 'invenId', width: 80, hidden: true },
					{ text : '그룹명', datafield: 'grpName', width: 130, pinned: true },
					{ text : '장비명', datafield: 'devName', width: 150, pinned: true },
					{ text : 'IP주소', datafield: 'agentIp', width: 120 },
					{ text : '운영체제', datafield: 'os', width: 120 },
					{ text : '버전', datafield: 'osVer', width: 120 }
			    ]
			});
			$svrGrid.on('rowdoubleclick', function(event) {
				Main.searchPerf();
			});
			
			HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings.valueAxis, {
				maxValue: 100,
				labels: {
					formatSettings: { sufix: '%' }
				}
			});
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($cpuChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
				            				   ['val'], 
				            				   ['CPU'],
				            				   false
				            		   )
				               )
			               ]
			});
			HmChart2.create($cpuChart, settings);
			
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings.valueAxis, {
				maxValue: 100,
				labels: {
					formatSettings: { sufix: '%' }
				}
			});
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($memChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
				            				   ['val'], 
				            				   ['MEMORY'],
				            				   false
				            		   )
				               )
			               ]
			});
			HmChart2.create($memChart, settings);
			
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings.valueAxis, {
				maxValue: 100,
				labels: {
					formatSettings: { sufix: '%' }
				}
			});
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($swapChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
				            				   ['val'], 
				            				   ['SWAP'],
				            				   false
				            		   )
				               )
			               ]
			});
			HmChart2.create($swapChart, settings);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		searchSvr: function() {
			HmGrid.updateBoundData($svrGrid, ctxPath + '/main/starcell/itmonSvrPerfHist/getITMonSvrList.do');
		},
		
		searchPerf: function() {
			var rowdata = HmGrid.getRowData($svrGrid);
			if(rowdata == null) return;
			var params = {
					agentIp: rowdata.agentIp,
					invenId: rowdata.invenId,
					date1: HmDate.getDateStr($('#date1')),
					time1: HmDate.getTimeStr($('#date1')),
					date2: HmDate.getDateStr($('#date2')),
					time2: HmDate.getTimeStr($('#date2'))
			};
			Server.get('/main/starcell/itmonSvrPerfHist/getITMonSvrCpuPerfChartList.do', {
				data: params,
				success: function(result) {
					$cpuChart.jqxChart('source', result);
					$cpuChart.jqxChart('update');
				}
			});
			Server.get('/main/starcell/itmonSvrPerfHist/getITMonSvrMemPerfChartList.do', {
				data: params,
				success: function(result) {
					$memChart.jqxChart('source', result);
					$memChart.jqxChart('update');
				}
			});
			Server.get('/main/starcell/itmonSvrPerfHist/getITMonSvrSwapPerfChartList.do', {
				data: params,
				success: function(result) {
					$swapChart.jqxChart('source', result);
					$swapChart.jqxChart('update');
				}
			});
		},
		
		/** export Excel */
		exportExcel: function() {
//			HmUtil.exportExcel(ctxPath + '/main/starcell/itmonCpuPerf/export.do');
		},
		
		/** 차트 데이터보기 */
		showChartData: function(chartType) {
			var cols, chartData;
			if(chartType == 'cpu') {
				cols = [
		            { text: '일시', datafield: 'ymdhms' },
		            { text: 'CPU', datafield: 'val', cellsalign: 'right', width: 150 }
	            ];
				chartData = $cpuChart.jqxChart('source');
			}
			else if(chartType == 'mem') {
				cols = [
		            { text: '일시', datafield: 'ymdhms' },
		            { text: 'MEMORY', datafield: 'val', cellsalign: 'right', width: 150 }
	            ];
				chartData = $memChart.jqxChart('source');
			}
			else if(chartType == 'swap') {
				cols = [
			            { text: '일시', datafield: 'ymdhms' },
			            { text: 'SWAP', datafield: 'val', cellsalign: 'right', width: 150 }
		            ];
				chartData = $swapChart.jqxChart('source');
			}
			else return;
			
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', { cols: cols, chartData: chartData });
					}
			);
		},
		
		/** 차트 다운받기 */
		saveChart: function(chart, chartNm) {
			HmUtil.exportChart(chart, chartNm);
		}		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});