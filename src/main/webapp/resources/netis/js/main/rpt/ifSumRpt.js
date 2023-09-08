var $grpTree, $ifGrid, $rptChart;
var _curIfData = null;

var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#grpTree'), $ifGrid = $('#ifGrid'), $rptChart = $('#rptChart');
			this.initCondition();
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
				case 'btnSearch': this.searchChart(); break;
				case 'btnCList': this.showChartData(); break;
				case 'btnCSave': this.saveChart(); break;
			}
		},

		initCondition : function() {
			HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
			//업무시간
			HmDropDownList.create($('#cbTimeId'), {
				source: HmResource.getResource('perf_work_time_type'), selectedIndex: 0
			});

			//휴일, 공휴일 체크박스
			$('#ckDayOff, #ckHoliday').jqxCheckBox({height: 22, checked: false});
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			// $('#cbTableCnt').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 0,
			// 	source: [{label: '수집주기', value: 1}, {label: '시간', value: 2}, {label: '일', value: 3}]
			// });
			// HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);



			
			HmTreeGrid.create($grpTree, HmTree.T_GRP_IF, Main.selectTree);
			HmGrid.create($ifGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var treeItem = HmTreeGrid.getSelectedItem($grpTree);
								data.grpNo = treeItem == null? -1 : treeItem.grpNo;
								return data;
							},
							loadComplete: function() {
								_curIfData = null;
							}
						}
				),
				pageable: false,
				columns:
				[
				 	{ text: '장비번호', datafield: 'mngNo', width: 50, hidden: true },
				 	{ text: '회선번호', datafield: 'ifIdx', width: 50, hidden: true },
				 	{ text: '회선명', datafield: 'ifName' }
				]
			}, CtxMenu.COMM, 1);
			$ifGrid.on('bindingcomplete', function(event) {
				$ifGrid.jqxGrid('addrow', null, {mngNo: -1, ifIdx: -1, ifName: '전체'}, 'first');
				$ifGrid.jqxGrid('selectrow', 0);
			}).on('rowselect', function(event) {
				// _curIfData = event.args.row;
				// Main.searchChart();
			});
			
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR, HmChart2.unit1000FormatFn);
			// var settings = {};
			$.extend(settings, {
				seriesGroups: [
					               	HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn, 
					               			HmChart2.getSeries(['maxInbps', 'maxOutbps'], ['IN', 'OUT'], [HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT])
					               	),
					               	HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
					               			HmChart2.getSeries(['maxBps'], ['SUM'])
					               	)
				               ]
			});

			$.extend(settings.xAxis, { dataField : 'ymdhms', type : 'basic',
				labels: {
					settings: 'topright',
					angle: 0,
					offset: { x: 0, y: 0 }
				},
				baseUnit : HmChart2.XUNIT_HOUR, dateFormat : 'yyyy-MM-dd HH:mm:ss', formatFunction : function(value) {

					return $.format.date(value, 'MM월dd일HH시');
				}
			});
			HmChart2.create($rptChart, settings);

			// $('#cbTableCnt').jqxDropDownList().on('change', function (e) {
			// 	$('#cbTimeId').jqxDropDownList({ disabled: false });
			// 	if ($('#cbTableCnt').val() != '1')  {
			// 		$('#cbTimeId').jqxDropDownList({ disabled: true });
			// 	}
			// });
			
			$('#cbChartType').jqxDropDownList({ width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 0,
				source: [{label: '최대', value: 'max'}, {label: '평균', value: 'avg'}, {label: '최소', value: 'min'}, {label: '최대+평균', value: 'max_avg'}, {label: '전체', value: 'all'}]
			})
			.on('change', function(event) {
				Main.chgChartType();
			});
		},

		/** init data */
		initData : function() {
			
		},
		
		/** 그룹 트리 선택 */
		selectTree: function() {
			Main.searchIf();
		},
		
		/** 회선목록 조회 */
		searchIf: function() {
			HmGrid.updateBoundData($ifGrid, ctxPath + '/line/getLineListForIfGrp.do');
		},

		/** 공통 파라미터 */
		getCommParams: function () {

			var params = HmBoxCondition.getPeriodParams();
			return params;

		},
		
		/** 회선 성능 차트 조회 */
		searchChart: function() {
//			var rowdata = HmGrid.getRowData($ifGrid);

			LoadingImg.startLoadingImg($rptChart);

			var rowdata = _curIfData
			if(rowdata == null) {
				rowdata = {mngNo: -1, ifIdx: -1};
			}
			var params = Main.getCommParams();

			$.extend(params, {
				// tableCnt: $('#cbTableCnt').val(),
				// timeId: $('#cbTableCnt').val() == '1' ? $('#cbTimeId').val() : 0,
				timeId: $('#cbTimeId').val(),
				isDayOff: $('#ckDayOff').val() ? 1 : 0,
				isHoliday: $('#ckHoliday').val() ? 1 : 0,
				grpNo: HmTreeGrid.getSelectedItem($grpTree).grpNo,
				mngNo: rowdata.mngNo,
				ifIdx: rowdata.ifIdx
			});
			
			Server.get('/main/rpt/ifSumRpt/getIfSumRptChartList.do', {
				data: params,
				success: function(result) {
					$rptChart.jqxChart('source', result);
					$rptChart.jqxChart('update');

					LoadingImg.endLoadingImg();
				}
			});
		},
		
		/** 차트 기준값 변경 */
		chgChartType: function() {
			var _type = $('#cbChartType').val();
			var _typeText = { max: '최대', avg: '평균', min: '최소' };
			var _seriesGroups;
			switch(_type) {
			case 'max': case 'avg': case 'min':
				var _typeNm = _typeText[_type];
				_seriesGroups = [
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries(
													[_type + 'Inbps', _type + 'Outbps'], 
													[_typeNm + 'IN', _typeNm + 'OUT'], 
													[HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT])
									),
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries([_type + 'Bps'], [_typeNm + 'SUM'])
									)
			                     ];
				break;
			case 'max_avg':
				_seriesGroups = [
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries(
													['maxInbps', 'maxOutbps', 'avgInbps', 'avgOutbps'], 
													['최대IN', '최대OUT', '평균IN', '평균OUT'], 
													[HmChart2.C_IF_AVG_IN, HmChart2.C_IF_AVG_OUT, HmChart2.C_IF_MAX_IN, HmChart2.C_IF_MAX_OUT])
									),
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries(['maxBps', 'avgBps'], ['최대SUM', '평균SUM'])
									)
			                     ];
				break;
			case 'all':
				_seriesGroups = [
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries(
													['maxInbps', 'maxOutbps', 'avgInbps', 'avgOutbps', 'minInbps', 'minOutbps'], 
													['최대IN', '최대OUT', '평균IN', '평균OUT', '최소IN', '최소OUT'])
									),
									HmChart2.getSeriesGroup($rptChart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
											HmChart2.getSeries(['maxBps', 'avgBps', 'minBps'], ['최대SUM', '평균SUM', '최소SUM'])
									)
			                     ];
				break;
			}
			
			$rptChart.jqxChart('seriesGroups', _seriesGroups);
		},
	    
	    showChartData: function() {
    		HmWindow.create($('#pwindow'));
    		var params = {
    				chartData: $rptChart.jqxChart('source') 
    		};
			var cols = [
			            	{ text: '일시', datafield: 'ymdhms', minwidth:130 }
			            ];
			switch($('#cbChartType').val()) {
			case 'max':
				cols.push({ text: '최대IN', datafield: 'maxInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대OUT', datafield: 'maxOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대SUM', datafield: 'maxBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				break;
			case 'avg':
				cols.push({ text: '평균IN', datafield: 'avgInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균OUT', datafield: 'avgOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균SUM', datafield: 'avgBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				break;
			case 'min':
				cols.push({ text: '최소IN', datafield: 'minInbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최소OUT', datafield: 'minOutbps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최소SUM', datafield: 'minBps', width: 100, cellsrenderer: HmGrid.unit1000renderer });
				break;
			case 'max_avg':
				cols.push({ text: '최대IN', datafield: 'maxInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대OUT', datafield: 'maxOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균IN', datafield: 'avgInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균OUT', datafield: 'avgOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대SUM', datafield: 'maxBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균SUM', datafield: 'avgBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				break;
			case 'all':
				cols.push({ text: '최대IN', datafield: 'maxInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대OUT', datafield: 'maxOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균IN', datafield: 'avgInbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균OUT', datafield: 'avgOutbps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최대SUM', datafield: 'maxBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '평균SUM', datafield: 'avgBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				cols.push({ text: '최소SUM', datafield: 'minBps', width: 70, cellsrenderer: HmGrid.unit1000renderer });
				break;
			}
			params.cols = cols;
			$.post(ctxPath + '/main/popup/comm/pChartDataList.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 600, 600, 'p2window_init', params);
					}
			);
		},
		
		saveChart: function() {
			HmUtil.exportChart($rptChart, "chart.png");
		}
		
		


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});