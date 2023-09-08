var $grpTree, $infoGrid, $qpsChart, $hitChart;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $infoGrid = $('#infoGrid'), $qpsChart = $('#qpsChart'), $hitChart = $('#hitChart');
			this.initCondition();
		},

		initCondition: function() {
			HmBoxCondition.createPeriod('', null, null, 'sPerfCycle');
			HmBoxCondition.createRadio($('#sPerfCycle'), HmResource.getResource('cond_perf_cycle'));
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
			case 'btnCList_qps': case 'btnCList_hit':
				this.showChartData(curTarget.id.replace('btnCList_', '')); break;
			case 'btnCSave_qps': case 'btnCSave_hit':
				this.saveChart(curTarget.id.replace('btnCSave_', '')); break;
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
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'Server', isPerfFlag: 1});
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

	    	HmGrid.create($infoGrid, {
				source: new $.jqx.dataAdapter(
						{
							type: 'POST',
							contenttype: 'application/json; charset=utf-8',
							datatype: 'json',
							datafields: [
					             { name: 'grpName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'mngNo', type: 'number' },
					             { name: 'devKind2', type: 'string' },
					             { name: 'vendor', type: 'string' },
					             { name: 'model', type: 'string' },
					             { name: 'avgDnsQueryRate', type: 'number' },
					             { name: 'maxDnsQueryRate', type: 'number' },
					             { name: 'avgDnsHitRatio', type: 'number' },
					             { name: 'maxDnsHitRatio', type: 'number' }
				             ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return JSON.stringify(data);
							},
							loadComplete: function(records) {
								Main.resetChart();
							}
						}
				),
				columns:
				[
				 	{ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true },
					{ text: '장비', datafield: 'devName', minwidth: 150, pinned: true },
					{ text: 'IP', datafield: 'devIp', width: 120, pinned: true },
					{ text: '종류', datafield: 'devKind2', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 120 },
					{ text: '모델', datafield: 'model', width: 120 },
                    { text: '평균', datafield: 'avgDnsQueryRate', columngroup: 'qps', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxDnsQueryRate', columngroup: 'qps', width: 80, cellsalign: 'right' },
                    { text: '평균', datafield: 'avgDnsHitRatio', columngroup: 'hit', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxDnsHitRatio', columngroup: 'hit', width: 80, cellsalign: 'right' }
				],
				columngroups: [
                    { text: 'QPS', align: 'center', name: 'qps' },
                    { text: 'DNS Hit Ratio', align: 'center', name: 'hit' }
				]
			}, CtxMenu.COMM);

            $infoGrid.on('rowdoubleclick', function(event) {
                var rowIdx = event.args.rowindex;
                var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
                Main.searchChart(rowdata.mngNo);
			});

	    	var chartOptions = {
	    		xAxis: {
	    			type: 'datetime'
				}
			};
            HmHighchart.create2($qpsChart.attr('id'), $.extend(chartOptions, {
                title: { text: 'QPS 추이' },
            	series: [
                    { name: '평균' },
                    { name: '최대', type: HmHighchart.TYPE_LINE, marker: { enabled: true, symbol: 'circle' }, lineWidth:0, states: { hover: { lineWidthPlus: 0 } } },
                ]
			}), HmHighchart.TYPE_AREA);
            HmHighchart.create2($hitChart.attr('id'), $.extend(chartOptions, {
                title: { text: 'Hit Ratio 추이' },
				plotOptions: { series: { stacking: 'normal' } },
            	series: [
                    { name: '평균' },
                    { name: '최대', type: HmHighchart.TYPE_LINE, marker: { enabled: true, symbol: 'circle' }, lineWidth:0, states: { hover: { lineWidthPlus: 0 } } },
                ]
            }), HmHighchart.TYPE_AREA);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams(), {
				perfCycle: HmBoxCondition.val('sPerfCycle')
			});
			return params;
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {
            this.searchGrid();
		},

		/** 그리드 조회 */
		searchGrid: function() {
            HmGrid.updateBoundData($infoGrid, ctxPath + '/main/nms/dnsPerf/getDnsPerfList.do');
		},

		resetChart: function() {
			var qpsChart = $qpsChart.highcharts(),
				hitChart = $hitChart.highcharts();
			if(qpsChart === undefined || hitChart === undefined) return;
			for(var i = 0; i < qpsChart.series.length; i++) {
				qpsChart.series[i].setData(null, false);
			}
            for(var i = 0; i < hitChart.series.length; i++) {
                hitChart.series[i].setData(null, false);
            }
            qpsChart.redraw();
			hitChart.redraw();
		},

    	/** 차트 조회 */
		searchChart: function(mngNo) {
			this.resetChart();
			var params = Main.getCommParams();
			params.mngNo = mngNo;
			Server.post('/main/nms/dnsPerf/getDnsPerfChartList.do', {
				data: params,
				success: function(result) {
					if(result != null) {
                        var _tableCnt = result.tableCnt,
                            _list = result.list;
                        if (_list != null && _list.length > 0) {
                            var qpsChart = $qpsChart.highcharts(),
                                hitChart = $hitChart.highcharts();
                            var chartData = {
                                qps_avg: [], qps_max: [],
                                hit_avg: [], hit_max: []
                            };
                            $.each(_list, function (idx, item) {
                                chartData.qps_avg.push([item.date, item.avgDnsQueryRate]);
                                chartData.qps_max.push([item.date, item.maxDnsQueryRate]);
                                chartData.hit_avg.push([item.date, item.avgDnsHitRatio]);
                                chartData.hit_max.push([item.date, item.maxDnsHitRatio]);
                            });

                            qpsChart.series[0].update({data: chartData.qps_avg}, false);
                            qpsChart.series[1].update({data: chartData.qps_max, visible: _tableCnt!="1"}, false);
                            hitChart.series[0].update({data: chartData.hit_avg}, false);
                            hitChart.series[1].update({data: chartData.hit_max, visible: _tableCnt!="1"}, false);

                            // qpsChart.series[0].setData(chartData.qps_avg, false);
                            // qpsChart.series[1].setData(chartData.qps_max, false);
                            // hitChart.series[0].setData(chartData.hit_avg, false);
                            // hitChart.series[1].setData(chartData.hit_max, false);

                            qpsChart.redraw();
                            hitChart.redraw();
                        }
                    }
				}
			});
		},

		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($infoGrid, 'DNS성능', false);
		},

		/** 차트 데이터보기 */
		showChartData: function(type) {
			var chart = type == 'qps'? $qpsChart.highcharts() : $hitChart.highcharts();
			var cols, chartData = [];
			cols = [
				{ text: '일시', datafield: 'ymdhms', cellsalign: 'center', minwidth: 160 }
			];
			var seriesData = [];
			for(var i = 0, n = chart.series.length; i < n; i++) {
				seriesData[i] = chart.series[i].yData;
				cols.push({ text: chart.series[i].name, datafield: 'val' + i, cellsalign: 'right', cellsformat: 'n', width: 100 });
			}

			var xData = chart.series[0].xData,
				sLen = seriesData.length,
				dLen = xData.length;
			for(var i = 0; i < dLen; i++) {
				var obj = { ymdhms: $.format.date(new Date(xData[i]), 'yyyy-MM-dd HH:mm:ss') };
				for(var j = 0; j < sLen; j++) {
					obj['val' + j] = seriesData[j][i];
				}
				chartData.push(obj);
			}

			HmUtil.showChartData({cols: cols, chartData: chartData});
		},

		/** 차트 다운받기 */
		saveChart: function(type) {
			if(type == 'qps') HmUtil.exportHighchart($qpsChart.highcharts(), 'QPS추이');
			else HmUtil.exportHighchart($hitChart.highcharts(), 'HitRatio추이');
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});