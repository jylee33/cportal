var $dGrpTreeGrid;
var $devGrid, $chart;
var curMngNo = 0;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$dGrpTreeGrid = $('#dGrpTreeGrid'), $devGrid = $('#devGrid'), $chart = $('#chart');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createPeriod();
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type2'));
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
			case 'btnCList': this.showChartData(); break;
			case 'btnCSave': this.saveChart(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($dGrpTreeGrid, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'IPT' });
			/*Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));*/

			/** 장비 그리드 */
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [	
					             { name: 'mngNo', type: 'number' },
					             { name: 'grpName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'vendor', type: 'string' },
					             { name: 'model', type: 'string' },
					             { name: 'maxCallTotal', type: 'number' },
					             { name: 'avgCallTotal', type: 'number' },
					             { name: 'minCallTotal', type: 'number' },
					             { name: 'maxCallOut', type: 'number' },
					             { name: 'avgCallOut', type: 'number' },
					             { name: 'minCallOut', type: 'number' },
					             { name: 'maxCallIn', type: 'number' },
					             { name: 'avgCallIn', type: 'number' },
					             { name: 'minCallIn', type: 'number' },
					             { name: 'maxCallTndm', type: 'number' },
					             { name: 'avgCallTndm', type: 'number' },
					             { name: 'minCallTndm', type: 'number' },
					             { name: 'maxCallInt', type: 'number' },
					             { name: 'avgCallInt', type: 'number' },
					             { name: 'minCallInt', type: 'number' }
				            ]
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getDefGrpParams($dGrpTreeGrid));
								$.extend(data, HmBoxCondition.getPeriodParams(),HmBoxCondition.getSrchParams());
								return data;
							},
							loadComplete: function(records) {
								curMngNo = 0;
							}
						}
				),
				columns:
				[
				 	{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true }, 
				 	{ text: '장비명', datafield: 'devName', minwidth : 150, pinned: true }, 
					{ text: '장비IP', datafield: 'devIp', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
					{ text: '최대', columngroup: 'total', datafield: 'maxCallTotal', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'total', datafield: 'avgCallTotal', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'total', datafield: 'minCallTotal', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'callOut', datafield: 'maxCallOut', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'callOut', datafield: 'avgCallOut', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'callOut', datafield: 'minCallOut', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'callIn', datafield: 'maxCallIn', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'callIn', datafield: 'avgCallIn', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'callIn', datafield: 'minCallIn', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'callTndm', datafield: 'maxCallTndm', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'callTndm', datafield: 'avgCallTndm', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'callTndm', datafield: 'minCallTndm', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'callInt', datafield: 'maxCallInt', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'callInt', datafield: 'avgCallInt', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'callInt', datafield: 'minCallInt', width: 100, cellsformat: 'd', cellsalign: 'right' }
				],
				columngroups:
				[
				 	{ text: '총 호 수', align: 'center', name: 'total' },
				 	{ text: '국선발신호 수', align: 'center', name: 'callOut' },
				 	{ text: '국선착신호 수', align: 'center', name: 'callIn' },
				 	{ text: '국선탄뎀호 수', align: 'center', name: 'callTndm' },
				 	{ text: '통화중 내선호 수', align: 'center', name: 'callInt' }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$devGrid.on('rowselect', function(event) {
				curMngNo = event.args.row.mngNo;
				Main.drawChart();
			});
			
			$("#chartType").jqxDropDownList({ width: 70, height: 21, autoDropDownHeight: true, selectedIndex: 1,
				source: [{ label: '최대', value: 'max' }, { label: '평균', value: 'avg'}, { label: '최소', value: 'min'}]
			}).on('change', function(event) {
				Main.chgChartType();
			});
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, null, 
			            		   HmChart2.getSeries(
		            				    ['avgCallTotal', 'avgCallOut', 'avgCallIn', 'avgCallTndm', 'avgCallInt'], 
										['총 호 수', '국선발신호 수', '국선착신호 수', '국선탄뎀호 수', '통화중 내선호 수']
			            		   )
				               )
			               ]
			});
			HmChart.create($chart, settings);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			return {
				date1: HmDate.getDateStr($('#sDate1')),
				time1: HmDate.getTimeStr($('#sDate1')),
				date2: HmDate.getDateStr($('#sDate2')),
				time2: HmDate.getTimeStr($('#sDate2')),
			};
		},
		
		/** IPT 장비현황 조회 */
		search: function() {
//			HmChart2.clear($chart);
			$chart.jqxChart({ source: null });
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/ssIpt/ssIptCallPerf/getIptCallPerfList.do');
		},
		
		/** draw chart */
		drawChart: function() {
			var params = Main.getCommParams();
			params.mngNo = curMngNo;
			Server.get('/main/ssIpt/ssIptCallPerf/getIptCallPerfChartList.do', {
				data: params,
				success: function(result) {
					$chart.jqxChart('source', result);
					$chart.jqxChart('update');
				}
			});
		},
		
		/** 차트 구분 변경 */
		chgChartType: function() {
			var _type = $('#chartType').val();
			$chart.jqxChart('seriesGroups', [
					HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, null, 
						   HmChart2.getSeries(
								[_type + 'CallTotal', _type + 'CallOut', _type + 'CallIn', _type + 'CallTndm', _type + 'CallInt'], 
								['총 호 수', '국선발신호 수', '국선착신호 수', '국선탄뎀호 수', '통화중 내선호 수']
						   )
				    )
	    	]);
			$chart.jqxChart('update');
		},
		
		/** 차트 데이터보기 */
		showChartData: function() {
			var _type = $('#chartType').val();
			var chartData = $chart.jqxChart('source');
			cols = [
		            { text: '일시', datafield: 'ymdhms' },
		            { text: '총 호 수', datafield: _type + 'CallTotal', cellsalign: 'right', cellsformat: 'n', width: 120 },
		            { text: '국선발신호 수', datafield: _type + 'CallOut', cellsalign: 'right', cellsformat: 'n', width: 120 },
		            { text: '국선착신호 수', datafield: _type + 'CallIn', cellsalign: 'right', cellsformat: 'n', width: 120 },
		            { text: '국선탄뎀호 수', datafield: _type + 'CallTndm', cellsalign: 'right', cellsformat: 'n', width: 120 },
		            { text: '통화중 내선호 수', datafield: _type + 'CallInt', cellsalign: 'right', cellsformat: 'n', width: 120 }
	            ];
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 750, 600, 'p2window_init', { cols: cols, chartData: chartData });
					}
			);
		},
		
		/** 차트 다운받기 */
		saveChart: function() {
			HmUtil.exportChart($chart, $('#chartType').val() + 'IptCallPerf.png');
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});