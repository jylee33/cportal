var $callGrid, $callChart;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$callGrid = $('#callGrid'), $callChart = $('#callChart');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			case 'btnCList': this.showChartData(); break;
			case 'btnCSave': this.saveChart(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });
			
			HmGrid.create($callGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devKind2', type:'string' },
                                { name:'model', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'curActiveCnt', type:'number' },
                                { name:'avgCallCnt', type:'number' },
                                { name:'maxCallCnt', type:'number' },
							]
						},
						{
							formatData: function(data) {
								var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
								$.extend(data, params, HmBoxCondition.getPeriodParams());
								return data;
							}
						}
				),
				columns:
				[
				 	{ text : '그룹', datafield: 'grpName', width: 140 },
					{ text : '장비명', datafield: 'devName', minwidth: 150 },
					{ text : 'IP', datafield: 'devKind2', width: 130 },
					{ text : '모델', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text : '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text : '현재통화수', datafield: 'curActiveCnt', width: 80, cellsalign: 'right' },
					{ text : '평균통화수', datafield: 'avgCallCnt', width: 80, cellsalign: 'right' },
					{ text : '최대통화수', datafield: 'maxCallCnt', width: 80, cellsalign: 'right' }
			    ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$callGrid.on('rowselect', function(event) {
				Main.drawChart(event.args.row);
			});
			
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($callChart, HmChart2.T_LINE, null, 
				            		   HmChart2.getSeries(
				            				   [ 'activeCount' ], 
				            				   [ '통화수' ],
				            				   false
				            		   )
				               )
			               ]
			});
			HmChart2.create($callChart, settings);
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		refresh: function() {
			this.search();
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		search: function() {
			//Master.refreshCbPeriod($('#cbPeriod'));
			HmGrid.updateBoundData($callGrid, ctxPath + '/main/ipt/callMgmt/getCallMgrMgmtList.do');
		},
		
		/**  차트 그리기 */
		drawChart: function(rowdata) {
			if(rowdata == null) {
				alert('장비를 선택해주세요.');
				return;
			}
			var params = {
					mngNo: rowdata.mngNo
			};
			$.extend(params, HmBoxCondition.getPeriodParams());
			Server.get('/main/ipt/vgwCallCnt/getVgwCallCntChartList.do', {
				data: params,
				success: function(result) {
					$callChart.jqxChart({ source: result });
					$callChart.jqxChart('update');
				}
			});
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
			HmUtil.exportExcel(ctxPath + '/main/ipt/callMgmt/export.do', params);
		},
		
		/** 차트 데이터보기 */
		showChartData: function() {
			var cols, chartData;
			cols = [
	            { text: '일시', datafield: 'ymdhms' },
	            { text: '통화수', datafield: 'activeCount', width: 100, cellsalign: 'right', cellsformat: 'n' }
            ];
			chartData = $callChart.jqxChart('source');
			
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', { cols: cols, chartData: chartData });
					}
			);
		},
		
		/** 차트 다운받기 */
		saveChart: function() {
			HmUtil.exportChart($callChart, 'callCnt.png');
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});