var $grpTree, $infoGrid, $sessChart, $cpsChart;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $infoGrid = $('#infoGrid'), $sessChart = $('#sessChart'), $cpsChart = $('#cpsChart');
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
			case 'btnCList_sess': case 'btnCList_cps':
				this.showChartData(curTarget.id.replace('btnCList_', '')); break;
			case 'btnCSave_sess': case 'btnCSave_cps':
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
			HmTreeGrid.create($grpTree, HmTree.T_GRP_FW, Main.selectTree, {devKind2: 'Firewall', vendor: 'CISCO,Paloalto', isPerfFlag: 1, isContainVirtual: true});
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
                                { name: 'svcId', type: 'string' },
                                { name: 'devKind2', type: 'string' },
                                { name: 'vendor', type: 'string' },
                                { name: 'model', type: 'string' },
                                { name: 'avgSess', type: 'number' },
                                { name: 'maxSess', type: 'number' },
                                { name: 'avgCps', type: 'number' },
                                { name: 'maxCps', type: 'number' },
                                { name: 'avgTcpCps', type: 'number' },
                                { name: 'maxTcpCps', type: 'number' },
                                { name: 'avgUdpCps', type: 'number' },
                                { name: 'maxUdpCps', type: 'number' },
                                { name: 'avgIcmpCps', type: 'number' },
                                { name: 'maxIcmpCps', type: 'number' }
				             ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return JSON.stringify(data);
							},
                            loadComplete: function(records) {
                                //Main.resetChart();
                            }
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
				 	{ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true },
					{ text: '장비', datafield: 'devName', minwidth: 150, pinned: true },
					{ text: 'IP', datafield: 'devIp', width: 120, pinned: true },
					{ text: '종류', datafield: 'devKind2', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 120 },
					{ text: '모델', datafield: 'model', width: 120 },
                    { text: '평균', datafield: 'avgSess', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxSess', width: 80, cellsalign: 'right' },
                    { text: '평균', datafield: 'avgCps', columngroup: 'cps', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxCps', columngroup: 'cps', width: 80, cellsalign: 'right' },
                    { text: '평균', datafield: 'avgTcpCps', columngroup: 'tcpCps', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxTcpCps', columngroup: 'tcpCps', width: 80, cellsalign: 'right' },
                    { text: '평균', datafield: 'avgUdpCps', columngroup: 'udpCps', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxUdpCps', columngroup: 'udpCps', width: 80, cellsalign: 'right' },
                    { text: '평균', datafield: 'avgIcmpCps', columngroup: 'icmpCps', width: 80, cellsalign: 'right' },
                    { text: '최대', datafield: 'maxIcmpCps', columngroup: 'icmpCps', width: 80, cellsalign: 'right' }
				],
				columngroups: [
                    { text: '전체 세션', align: 'center', name: 'sess' },
                    { text: '전체 CPS', align: 'center', name: 'cps' },
                    { text: 'TCP CPS', align: 'center', name: 'tcpCps' },
                    { text: 'UDP CPS', align: 'center', name: 'udpCps' },
                    { text: 'ICMP CPS', align: 'center', name: 'icmpCps' }
				]
			}, CtxMenu.COMM);

	    	$infoGrid.on('rowdoubleclick', function(event) {
                var rowIdx = event.args.rowindex;
                var rowdata = $(this).jqxGrid('getrowdata', rowIdx);
                console.log(rowdata);
                Main.searchChart(rowdata.mngNo, rowdata.devKind2, rowdata.svcId);
            });

	    	var chartOptions = {
	    		xAxis: {
	    			type: 'datetime'
				}
			};
            HmHighchart.create2($sessChart.attr('id'), $.extend(chartOptions, {
                title: { text: '세션 추이' },
            	series: [
                    { name: '현재' },
                    { name: '최대', type: HmHighchart.TYPE_LINE, marker: { enabled: true, symbol: 'circle' }, lineWidth:0, states: { hover: { lineWidthPlus: 0 } } },
                ]
			}), HmHighchart.TYPE_AREA);
            HmHighchart.create2($cpsChart.attr('id'), $.extend(chartOptions, {
                title: { text: 'CPS 추이' },
				plotOptions: { series: { stacking: 'normal' } },
            	series: [
                    { name: 'TCP' },
                    { name: 'UDP' },
                    { name: 'ICMP' }
                ]
            }), HmHighchart.TYPE_AREA);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getFwGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams(), {
				perfCycle: HmBoxCondition.val('sPerfCycle')
			});
			return params;
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
            Main.searchChart();
		},
		
		/** 조회 */
		search: function() {
            this.searchGrid();
		},

		/** 그리드 조회 */
		searchGrid: function() {
            HmGrid.updateBoundData($infoGrid, ctxPath + '/main/nms/fwPerf/getFwPerfList.do');
		},

		resetChart: function() {
			var sessChart = $sessChart.highcharts(),
				cpsChart = $cpsChart.highcharts();
			if(sessChart === undefined || cpsChart === undefined) return;
			for(var i = 0; i < sessChart.series.length; i++) {
                sessChart.series[i].setData(null, false);
			}
			for(var i = 0; i < cpsChart.series.length; i++) {
                cpsChart.series[i].setData(null, false);
			}

            // var len = sessChart.series.length;
            // for (var i = len-1; i>=0; i--) {
            //     sessChart.series[i].remove();
            // };
            // var len = cpsChart.series.length;
            // for (var i = len-1; i>=0; i--) {
            //     cpsChart.series[i].remove();
            // }
            sessChart.redraw();
            cpsChart.redraw();
		},

		/** 차트 조회 */
		searchChart: function(mngNo, devKind2, svcId) {
			this.resetChart();
			var searchKind;
			if(mngNo === undefined && devKind2 === undefined && svcId === undefined ){
                console.log('ud');
                var params = Main.getCommParams();
                mngNo = params.mngNo;
                devKind2 = params.itemKind;
                svcId = params.svcId;
                // searchKind = 'TREE';
			}

            var params = {
              		date1: HmDate.getDateStr($('#date1')),
                    time1: HmDate.getTimeStr($('#date1')),
                    date2: HmDate.getDateStr($('#date2')),
                    time2: HmDate.getTimeStr($('#date2')),
                    sIp: $('#sIp').val(),
                    sDevName: $('#sDevName').val(),
                    perfCycle: $('#p_cbPerfCycle').val(),
					mngNo: mngNo,
               		devKind2: devKind2,
                	svcId: svcId,
                	// searchKind: searchKind
			};
			Server.post('/main/nms/fwPerf/getFwPerfChartList.do', {
				data: params,
				success: function(result) {
					if(result != null && result.length > 0) {
						var sessChart = $sessChart.highcharts(),
							cpsChart = $cpsChart.highcharts();

						/*var sCnt = 0;
                        var cCnt = 0;
						var tmp = [];
                        $.each(result, function(idx, item) {
                            sessChart.addSeries({ name: item.name + ' 현재' }, false);
                            sessChart.addSeries({ name: item.name + ' 최대' }, false);
                            cpsChart.addSeries({ name: item.name + ' CPS' }, false);
                            cpsChart.addSeries({ name: item.name + ' UDP' }, false);
                            cpsChart.addSeries({ name: item.name + ' ICMP' }, false);

                            var chartData = {
                               sessCurr: [], sessMax: [],
                                tcpCps: [], udpCps: [], icmpCps: []
                            };

                            $.each(item.perfList, function(idx, item) {
                                chartData.sessCurr.push([item.date, item.sessCurr]);
                                chartData.sessMax.push([item.date, item.sessMax]);
                                chartData.tcpCps.push([item.date, item.sessTcpCps]);
                                chartData.udpCps.push([item.date, item.sessUdpCps]);
                                chartData.icmpCps.push([item.date, item.sessIcmpCps]);
                            });
                            tmp.push({key:idx, value: chartData});
                        });

                        $.each(tmp, function(idx, item) {
                            sessChart.series[sCnt++].setData(item.value.sessCurr, false);
                            sessChart.series[sCnt++].setData(item.value.sessMax, false);
                            cpsChart.series[cCnt++].setData(item.value.tcpCps, false);
                            cpsChart.series[cCnt++].setData(item.value.udpCps, false);
                            cpsChart.series[cCnt++].setData(item.value.icmpCps, false);
                        });

                        sessChart.redraw();
                        cpsChart.redraw();
*/

                        var chartData = {
                            categories: [],
                            sessCurr: [], sessMax: [],
                            tcpCps: [], udpCps: [], icmpCps: []
                        };
                        $.each(result, function(idx, item) {
                            chartData.sessCurr.push([item.date, item.sessCurr]);
                            chartData.sessMax.push([item.date, item.sessMax]);
                            chartData.tcpCps.push([item.date, item.sessTcpCps]);
                            chartData.udpCps.push([item.date, item.sessUdpCps]);
                            chartData.icmpCps.push([item.date, item.sessIcmpCps]);
                        });

                        sessChart.series[0].update({data: chartData.sessCurr}, false);
                        sessChart.series[1].update({data: chartData.sessMax, visible: $('#p_cbPerfCycle').val()!=1}, false);


                        cpsChart.series[0].setData(chartData.tcpCps, false);
                        cpsChart.series[1].setData(chartData.udpCps, false);
                        cpsChart.series[2].setData(chartData.icmpCps, false);
						sessChart.redraw();
						cpsChart.redraw();
					}
				}
			});
		},

		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($infoGrid, '방화벽성능', false);
		},
		
		/** 차트 데이터보기 */
		showChartData: function(type) {
			var chart = type == 'sess'? $sessChart.highcharts() : $cpsChart.highcharts();
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
			if(type == 'sess') HmUtil.exportHighchart($sessChart.highcharts(), '세션추이'); 
			else HmUtil.exportHighchart($cpsChart.highcharts(), 'CPS추이');
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});