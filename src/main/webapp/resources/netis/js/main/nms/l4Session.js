var $grpTree, $l4Grid, $sessChart, $perfChart;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $l4Grid = $('#l4Grid'), $sessChart = $('#sessChart'), $perfChart = $('#perfChart');
            this.initCondition();
        },

		initCondition: function() {
			// search condition
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			case 'btnCList_sess': this.showChartData('sess'); break;
			case 'btnCSave_sess': this.saveChart('sess'); break;
			case 'btnCList_perf': this.showChartData('perf'); break;
			case 'btnCSave_perf': this.saveChart('perf'); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},
		
		/** init design */
		initDesign: function() {
			HmWindow.create($('#pwindow'));
			HmWindow.create($('#p2window'));
			HmTreeGrid.create($grpTree, HmTree.T_L4_GRP_DEFAULT, Main.search);
			Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
	    	HmGrid.create($l4Grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [
					             { name: 'grpName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'mngNo', type: 'number' },
					             { name: 'vSvcName', type: 'string' },
					             { name: 'userVSvcName', type: 'string' },
					             { name: 'vIdx', type: 'string' },
					             { name: 'vIp', type: 'string' },
					             { name: 'vPort', type: 'integer' },
					             { name: 'vPort2', type: 'string' },
					             { name: 'rIpCnt', type: 'number' },
					             { name: 'curSessCnt', type: 'number' },
					             { name: 'avgSessCnt', type: 'number' },
					             { name: 'maxSessCnt', type: 'number' },
					             { name: 'avgCps', type: 'number' },
					             { name: 'avgRSessCps', type: 'number' },
					             { name: 'maxCps', type: 'number' },
					             { name: 'maxRSessCps', type: 'number' },
					             { name: 'connMonit', type: 'integer' }
				             ]
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
				 	{ text: '그룹', datafield: 'grpName', minwidth: 150, pinned: true },
					{ text: '장비', datafield: 'devName', minwidth: 130, pinned: true },
					{ text: '장비IP', datafield: 'devIp', width: 120, pinned: true },
					{ text: 'V_IP ', datafield: 'vIp', width: 120 },
					{ text: 'V_PORT', datafield: 'vPort', width: 80, cellsalign: 'right' },
					{ text: '서비스 이름', datafield: 'vSvcName', width: 150 },
					{ text: 'R_IP수', datafield: 'rIpCnt', width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text: "현재세션수", datafield: "curSessCnt", width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text: "평균세션수", datafield: "avgSessCnt", width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text: "최대세션수", datafield: "maxSessCnt", width: 100, cellsalign: 'right', cellsformat: 'n' },
					{ text: "평균BPS", datafield: "avgCps", width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: true },
					{ text: "평균CPS", datafield: "avgRSessCps", width: 100, cellsalign: 'right' },
					{ text: "최대CPS", datafield: "maxRSessCps", width: 100, cellsalign: 'right' }
				 ]
			}, CtxMenu.L4);
	    	$l4Grid.on('rowselect', function(event) {
	    		Main.searchChart(event.args.row);
	    	});
				
	    	var settings1 = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings1, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($sessChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
				            				   ['rSessCnt'], 
				            				   ['세션수'],
				            				   false
				            		   )
				               )
			               ]
			});
			HmChart2.create($sessChart, settings1);
			
			var settings2 = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings2, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($perfChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
//				            				   ['rCps', 'rSessCps'], 
//				            				   ['BPS', 'CPS'],
				            				   ['rSessCps'],
				            				   ['CPS'],
				            				   false
				            		   )
				               )
				               ]
			});
			HmChart2.create($perfChart, settings2);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, {
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2')),
				// sIp: $('#sIp').val(),
				// sDevName: $('#sDevName').val()
			});
            $.extend(params, HmBoxCondition.getSrchParams());
			return params;
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {
			$sessChart.jqxChart('source', 0);
			$perfChart.jqxChart('source', 0);
			$sessChart.jqxChart('update');
			$perfChart.jqxChart('update');
			
			Master.refreshCbPeriod($('#cbPeriod'));
			HmGrid.updateBoundData($l4Grid, ctxPath + '/main/nms/l4Session/getL4SessionList.do');
		},
		
		/** 차트 조회 */
		searchChart: function(rowdata) {
			if(rowdata == null) return;
			var params = {
					mngNo: rowdata.mngNo,
					vIdx: rowdata.vIdx,
					vSvcName: rowdata.vSvcName,
					date1: HmDate.getDateStr($('#date1')),
					time1: HmDate.getTimeStr($('#date1')),
					date2: HmDate.getDateStr($('#date2')),
					time2: HmDate.getTimeStr($('#date2'))
			};
			Server.get('/main/nms/l4Session/getL4SessionChartList.do', {
				data: params,
				success: function(result) {
					$sessChart.jqxChart('source', result);
					$perfChart.jqxChart('source', result);
					$sessChart.jqxChart('update');
					$perfChart.jqxChart('update');
				}
			});
		},
		
		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($l4Grid, 'L4세션', false);
			return;

			var params = Main.getCommParams();
			HmUtil.exportExcel(ctxPath + '/main/nms/l4Session/export.do', params);
		},
		
		/** 차트 데이터보기 */
		showChartData: function(type) {
			var cols, chartData;
			switch(type) {
			case 'sess':
				cols = [
			            { text: '일시', datafield: 'ymdhms' },
			            { text: '세션수', datafield: 'rSessCnt', cellsalign: 'right', cellsformat: 'n', width: 150 }
		            ];
				chartData = $sessChart.jqxChart('source');
				break;
			case 'perf':
				cols = [
			            { text: '일시', datafield: 'ymdhms' },
			            { text: 'CPS', datafield: 'rSessCps', cellsalign: 'right', cellsformat: 'n', width: 150 }
		            ];
				chartData = $perfChart.jqxChart('source');
				break;
			default: return;
			}
			
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#p2window'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', { cols: cols, chartData: chartData });
					}
			);
		},
		
		/** 차트 다운받기 */
		saveChart: function(type) {
			if(type == 'sess') {
				HmUtil.exportChart($sessChart, '세션수.png');
			}
			else if(type == 'perf') {
				HmUtil.exportChart($perfChart, 'CPS.png');
			}
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});