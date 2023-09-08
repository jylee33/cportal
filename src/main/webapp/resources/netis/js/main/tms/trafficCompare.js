var TAB = {
		MANG: 0,
		GRP: 1,
		BIZ: 2,
		NATION: 3,
		ISP: 4,
		MANG_FLOW: 5
};

var $mangGrid, $grpGrid, $bizGrid, $nationGrid, $ispGrid, $mangFlowGrid;
var $mangChart, $grpChart, $bizChart, $nationChart, $ispChart, $mangFlowChart;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$mangGrid = $('#mangGrid'), $grpGrid = $('#grpGrid'), $bizGrid = $('#bizGrid'), $nationGrid = $('#nationGrid');
		$ispGrid= $('#ispGrid'), $mangFlowGrid = $('#mangFlowGrid');
		$mangChart = $('#mangChart'), $grpChart = $('#grpChart'), $bizChart = $('#bizChart'), $nationChart = $('#nationChart');
		$ispChart = $('#ispChart'), $mangFlowChart = $('#mangFlowChart');
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
		}
	},

	/** init design */
	initDesign : function() {
		HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 6);
		
		$('#dataTypeCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: [
			         { label: 'BYTES', value: 'BYTES' },
			         { label: 'PACKET', value: 'PACKET' },
			         { label: 'BPS', value: 'BPS' },
			         { label: 'PPS', value: 'PPS' },
			         { label: 'HOST수', value: 'HOSTCNT' }
	         ],
	        displayMember: 'label', valueMember: 'value', selectedIndex: 0
		})
		.on('change', function(event) {
			Main.chgChartType();
		});
	
		$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case TAB.MANG:
					HmJqxSplitter.create($('#m_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($mangGrid);
					break;
				case TAB.GRP:
					HmJqxSplitter.create($('#g_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($grpGrid);
					break;
				case TAB.BIZ:
					HmJqxSplitter.create($('#b_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($bizGrid); 
					break;
				case TAB.NATION:
					HmJqxSplitter.create($('#n_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($nationGrid); 
					break;
				case TAB.ISP:
					HmJqxSplitter.create($('#i_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($ispGrid); 
					break;
				case TAB.MANG_FLOW:
					HmJqxSplitter.create($('#mf_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
					Main.createGrid($mangFlowGrid); 
					break;
				}
				Main.drawChart();
			}
		})
		.on('resize', function(event) {
			event.stopPropagation();
		});
	},

	/** init data */
	initData : function() {
		this.searchChart();
	},

	/** 그리드 생성 */
	createGrid: function($grid) {
		var _columns = [];
		switch($grid.attr('id')) {
		case 'mangGrid': 
			_columns.push({ text: '망', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'grpGrid':
			_columns.push({ text: '그룹번호', datafield: 'grpNo', minwidth: 130, pinned: true, hidden: true });
			_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'bizGrid':
			_columns.push({ text: '서비스', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'nationGrid':
			_columns.push({ text: '국가명', datafield: 'nameShort', minwidth: 130, pinned: true }); 
			break;
		case 'ispGrid':
			_columns.push({ text: 'ISP', datafield: 'ispName', minwidth: 130, pinned: true });
			break;			
		case 'mangFlowGrid':
			_columns.push({ text: '망흐름', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		}
		var _isSizeHidden = false, _isFlagHidden = false;
		var commColumns = [
				{ text: 'BYTES(%)', datafield: 'bytesPer', cellsalign: 'right', width: 100 },
				{ text: 'PACKET(%)', datafield: 'pktPer', cellsalign: 'right', width: 100 },
				{ text: 'HOST수(%)', datafield: 'hostPer', cellsalign: 'right', width: 100 },
				{ text: 'Bytes', datafield: 'bytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1024renderer },
				{ text: 'Packet', datafield: 'pkt', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
				{ text: 'BPS', datafield: 'bps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
				{ text: 'PPS', datafield: 'pps', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
				{ text: 'Host수', datafield: 'hostCnt', cellsalign: 'right', width: 100 },
				{ text: 'P64', datafield: 'p64', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'P128', datafield: 'p128', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'P256', datafield: 'p256', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'P512', datafield: 'p512', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'P1024', datafield: 'p1024', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'P1518', datafield: 'p1518', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'POVER', datafield: 'pover', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isSizeHidden },
				{ text: 'URG', datafield: 'urg', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
				{ text: 'ACK', datafield: 'ack', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
				{ text: 'PSH', datafield: 'psh', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
				{ text: 'RST', datafield: 'rst', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
				{ text: 'SYN', datafield: 'syn', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden },
				{ text: 'FIN', datafield: 'fin', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer, hidden: _isFlagHidden }
           ];
		
		HmGrid.create($grid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json'
					},
					{
						formatData: function(data) {
							$.extend(data, {
								date1: HmDate.getDateStr($('#date1')),
								time1: HmDate.getTimeStr($('#date1')),
								date2: HmDate.getDateStr($('#date2')),
								time2: HmDate.getTimeStr($('#date2'))
							});
							return data;
						}
					}
			),
			columns: _columns.concat(commColumns)
		}, CtxMenu.GRP_DETAIL);
		$grid.on('rowdoubleclick', function(event) {
			Main.searchChart();
		});
	},
	
	/** 조회 */
	search : function() {
		var tabIdx = $('#mainTabs').jqxTabs('val');
		var url = null, $grid = null;
		switch(tabIdx) {
		case TAB.MANG:
			url = ctxPath + '/main/tms/trafficCompare/getMangTrafficCompareList.do';
			$grid = $mangGrid;
			break;
		case TAB.GRP:
			url = ctxPath + '/main/tms/trafficCompare/getGrpTrafficCompareList.do';
			$grid = $grpGrid;
			break;
		case TAB.BIZ:
			url = ctxPath + '/main/tms/trafficCompare/getBizTrafficCompareList.do';
			$grid = $bizGrid;
			break;
		case TAB.NATION:
			url = ctxPath + '/main/tms/trafficCompare/getNationTrafficCompareList.do';
			$grid = $nationGrid;
			break;
		case TAB.ISP:
			url = ctxPath + '/main/tms/trafficCompare/getIspTrafficCompareList.do';
			$grid = $ispGrid;
			break;
		case TAB.MANG_FLOW:
			url = ctxPath + '/main/tms/trafficCompare/getMangFlowTrafficCompareList.do';
			$grid = $mangFlowGrid;
			break;
		}
		if($grid !== null && url !== null)
			HmGrid.updateBoundData($grid, url);
	},
	
	drawChart: function() {
		// 차트 초기화
		var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
		
		switch($('#mainTabs').val()) {
		case TAB.MANG: HmChart2.create($mangChart, settings); break;
		case TAB.GRP: HmChart2.create($grpChart, settings); break;
		case TAB.BIZ: HmChart2.create($bizChart, settings); break;
		case TAB.NATION: HmChart2.create($nationChart, settings); break;
		case TAB.ISP: HmChart2.create($ispChart, settings); break;
		case TAB.MANG_FLOW: HmChart2.create($mangFlowChart, settings); break;
		default: return;
		}		
		
		this.chgChartType();
	},
	
	/** 차트 타입콤보 변경시 */
	chgChartType: function() {
		var $chart = null;
		switch($('#mainTabs').val()) {
		case TAB.MANG: $chart = $mangChart; break;
		case TAB.GRP: $chart = $grpChart; break;
		case TAB.BIZ: $chart = $bizChart; break;
		case TAB.NATION: $chart = $nationChart; break;
		case TAB.ISP: $chart = $ispChart; break;
		case TAB.MANG_FLOW: $chart = $mangFlowChart; break;
		default: return;
		}
		
		var valueAxis = $chart.jqxChart('valueAxis');
		var series = [];
		switch($('#dataTypeCb').val()) {
		case 'BYTES':
			series.push(HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, HmChart2.unit1024ToolTipFormatFn, HmChart2.getSeries([ 'bytes' ], [ 'BYTES' ]))); 
			$.extend(valueAxis, {
				labels: {
					formatFunction: function(value) {
						return HmUtil.convertUnit1024(value);
					}
				}
			});
			break;
		case 'PACKET':
			series.push(HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, HmChart2.getSeries([ 'pkt' ], [ 'PACKET' ])));
			$.extend(valueAxis, {
				labels: {
					formatFunction: function(value) {
						return HmUtil.convertUnit1000(value);
					}
				}
			});
			break;
		case 'BPS':
			series.push(HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, HmChart.unit1000ToolTipFormatFn, HmChart2.getSeries([ 'bps' ], [ 'BPS' ])));
			$.extend(valueAxis, {
				labels: {
					formatFunction: function(value) {
						return HmUtil.convertUnit1000(value);
					}
				}
			});
			break;
		case 'PPS':
			series.push(HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, HmChart2.getSeries([ 'pps' ], [ 'PPS' ])));
			$.extend(valueAxis, {
				labels: {
					formatFunction: function(value) {
						return HmUtil.convertUnit1000(value);
					}
				}
			});
			break;
		case 'HOSTCNT':
			series.push(HmChart2.getSeriesGroup($chart, HmChart2.T_LINE, null, HmChart2.getSeries([ 'hostCnt' ], [ 'HOST수' ])));
			$.extend(valueAxis, {
				labels: {
					formatFunction: function(value) {
						return value;
					}
				}
			});
			break;
		}
		
		$chart.jqxChart({ seriesGroups: series });
		$chart.jqxChart('update');
	},
	
	/** 차트 데이터 조회 */
	searchChart: function() {
		var tabIdx = $('#mainTabs').jqxTabs('val');
		var url = null, $chart = null;
		var params = {
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
		};
		switch(tabIdx) {
		case TAB.MANG:
			url = '/main/tms/trafficCompare/getMangTrafficCompareChartList.do';
			params.grpNo = $mangGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($mangGrid)).grpNo;
			$chart = $mangChart;
			break;
		case TAB.GRP:
			url = '/main/tms/trafficCompare/getGrpTrafficCompareChartList.do';
			params.grpNo = $grpGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($grpGrid)).grpNo;
			$chart = $grpChart;
			break;
		case TAB.BIZ:
			url = '/main/tms/trafficCompare/getBizTrafficCompareChartList.do';
			params.grpNo = $bizGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($bizGrid)).grpNo;
			$chart = $bizChart;
			break;
		case TAB.NATION:
			url = '/main/tms/trafficCompare/getNationTrafficCompareChartList.do';
			params.grpNo = $nationGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($nationGrid)).nameShort;
			$chart = $nationChart;
			break;
		case TAB.ISP:
			url = '/main/tms/trafficCompare/getIspTrafficCompareChartList.do';
			params.grpNo = $ispGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($ispGrid)).ispNo;
			$chart = $ispChart;
			break;
		case TAB.MANG_FLOW:
			url = '/main/tms/trafficCompare/getMangFlowTrafficCompareChartList.do';
			params.grpNo = $mangFlowGrid.jqxGrid('getrowdata', HmGrid.getRowIdx($mangFlowGrid)).grpNo;
			$chart = $mangFlowChart;
			break;
		default: return;
		}
		
		Server.get(url, {
			data: params,
			success: function(result) {
//				result = [];
//				result.push({ ymdhms: '2015-11-01 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-02 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-03 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-04 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-05 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-06 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-07 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-08 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-09 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
//				result.push({ ymdhms: '2015-11-10 00:00:00', name: 'test1', bps: Math.random() * 1000000, pps: Math.random() * 1000000, pkt: Math.random() * 1000000, bytes: Math.random() * 1000000, hostCnt: Math.random() * 100 });
				
				$chart.jqxChart({ source: result });
				$chart.jqxChart('update');
			}
		});
	}

};
