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
		/*	Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));*/

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
					             { name: 'maxCurrPhone', type: 'number' },
					             { name: 'avgCurrPhone', type: 'number' },
					             { name: 'minCurrPhone', type: 'number' },
					             { name: 'maxRegPhone', type: 'number' },
					             { name: 'avgRegPhone', type: 'number' },
					             { name: 'minRegPhone', type: 'number' },
					             { name: 'maxUnregPhone', type: 'number' },
					             { name: 'avgUnregPhone', type: 'number' },
					             { name: 'minUnregPhone', type: 'number' }
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
					{ text: '최대', columngroup: 'curr', datafield: 'maxCurrPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'curr', datafield: 'avgCurrPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'curr', datafield: 'minCurrPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'reg', datafield: 'maxRegPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'reg', datafield: 'avgRegPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'reg', datafield: 'minRegPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최대', columngroup: 'unreg', datafield: 'maxUnregPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '평균', columngroup: 'unreg', datafield: 'avgUnregPhone', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '최소', columngroup: 'unreg', datafield: 'minUnregPhone', width: 100, cellsformat: 'd', cellsalign: 'right' }
				],
				columngroups:
				[
				 	{ text: '설정 단말기', align: 'center', name: 'curr' },
				 	{ text: 'Regi 단말기', align: 'center', name: 'reg' },
				 	{ text: 'UnRegi 단말기', align: 'center', name: 'unreg' }
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
		            				    ['avgCurrPhone', 'avgRegPhone', 'avgUnregPhone'], 
										['설정 단말기 수', 'Regi 단말기 수', 'UnRegi 단말기 수']
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
				/*sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val()*/
			};
		},
		
		/** IPT 성능현황 조회 */
		search: function() {
//			HmChart2.clear($chart);
			$chart.jqxChart({ source: null });
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/ssIpt/ssIptPerf/getIptDevPerfList.do');
		},
		
		/** draw chart */
		drawChart: function() {
			var params = Main.getCommParams();
			params.mngNo = curMngNo;
			Server.get('/main/ssIpt/ssIptPerf/getIptDevPerfChartList.do', {
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
							    [_type + 'CurrPhone', _type + 'RegPhone', _type + 'UnregPhone'], 
								['설정 단말기 수', 'Regi 단말기 수', 'UnRegi 단말기 수']
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
		            { text: '설정 단말기 수', datafield: _type + 'CurrPhone', cellsalign: 'right', cellsformat: 'n', width: 150 },
		            { text: 'Regi 단말기 수', datafield: _type + 'RegPhone', cellsalign: 'right', cellsformat: 'n', width: 150 },
		            { text: 'UnRegi 단말기 수', datafield: _type + 'UnregPhone', cellsalign: 'right', cellsformat: 'n', width: 150 }
	            ];
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', { cols: cols, chartData: chartData });
					}
			);
		},
		
		/** 차트 다운받기 */
		saveChart: function() {
			HmUtil.exportChart($chart, $('#chartType').val() + 'IptPerf.png');
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});