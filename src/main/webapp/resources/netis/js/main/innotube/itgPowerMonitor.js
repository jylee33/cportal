var $grpTree, $grid, $vChart, $aChart;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $grid = $('#grid'), $vChart = $('#vChart'), $aChart = $('#aChart');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('');
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
			case "btnExcel": this.exportExcel(); break;
			case 'btnCList_v': this.showChartData('v'); break;
			case 'btnCList_a': this.showChartData('a'); break;
			case 'btnCSave_v': this.saveChart($vChart, 'voltage.png'); break;
			case 'btnCSave_a': this.saveChart($aChart, 'current.png'); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'RTU' });

			HmGrid.create($grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
								{ name:'mngNo', type:'string' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'usrName', type:'string' },
                                { name:'alertVal', type:'number' },
                                { name:'setupLoc', type:'string' },
                                { name:'lastUdt', type:'string' },
                                { name:'volMaxval', type:'number' },
                                { name:'volAvgval', type:'number' },
                                { name:'volCurval', type:'number' },
                                { name:'curMaxval', type:'number' },
                                { name:'curAvgval', type:'number' },
                                { name:'curCurval', type:'number' },
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
					{ text : '그룹명', columngroup: 'info', datafield: 'grpName', width : 150 },
					{ text : '주장치명', columngroup: 'info', datafield: 'devName', width : 150 },
					{ text : 'IP', columngroup: 'info', datafield: 'devIp', width : 120 },
					{ text : '설비명', columngroup: 'info', datafield: 'usrName', width : 100 },
					{ text : '경보', columngroup: 'info', datafield: 'alertVal', width : 100 },
					{ text : '설치위치', columngroup: 'info', datafield: 'setupLoc', minwidth : 100 },
					{ text : '최종수집일시', columngroup: 'info', datafield: 'lastUdt', width : 120, cellsalign: 'center' },
					{ text : '최대', columngroup: 'vol', datafield: 'volMaxval', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'vol', datafield: 'volAvgval', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'vol', datafield: 'volCurval', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'cur', datafield: 'curMaxval', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'cur', datafield: 'curAvgval', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'cur', datafield: 'curCurval', width : 80, cellsalign: 'right' }
			    ],
			    columngroups: 
		    	[
		    	 	{ text: '정보', align: 'center', name: 'info' },
		    	 	{ text: '전압(V)', align: 'center', name: 'vol' },
		    	 	{ text: '전류(A)', align: 'center', name: 'cur' }
		    	]
			}, CtxMenu.NONE);
			$grid.on('rowselect', function(event) {
				Main.drawChart(event.args.row.mngNo);
			});
			$grid.on('contextmenu', function() { return false; })
				.on('rowclick', function(event) {
					if(event.args.rightclick) {
						$grid.jqxGrid('selectrow', event.args.rowindex);
						var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
		                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
		                if($(window).height() < (event.args.originalEvent.clientY + $('#ctxmenu').height() + 10)) {
		                	posY = $(window).height() - ($('#ctxmenu').height() + 10);
		                }
		                $('#ctxmenu').jqxMenu('open', posX, posY);
						return false;
					}
				});
			$('#ctxmenu').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999 })
				.on('itemclick', function(event) {
					Main.selectCtxmenu(event);
				});

            HmHighchart.createStockChart($vChart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return this.value + 'V';
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' V',
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '전압(V)', type: 'line'}
                ]
            }, HmHighchart.TYPE_LINE);

            HmHighchart.createStockChart($aChart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return this.value + 'A';
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' A',
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '전류(A)', type: 'line'}
                ]
            }, HmHighchart.TYPE_LINE);

			// var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			// $.extend(settings, {
			// 	seriesGroups: [
			// 	               HmChart2.getSeriesGroup($vChart, HmChart2.T_LINE, null,
			// 	            		   HmChart2.getSeries(
			// 	            				   ['voltage'],
			// 	            				   ['전압'],
			// 	            				   false
			// 	            		   )
			// 	               )
			//                ]
			// });
			// HmChart2.create($vChart, settings);
			//
			// var settings2 = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			// $.extend(settings2, {
			// 	seriesGroups: [
			// 	               HmChart2.getSeriesGroup($aChart, HmChart2.T_LINE, null,
			// 	            		   HmChart2.getSeries(
			// 	            				   ['current'],
			// 	            				   ['전류'],
			// 	            				   false
			// 	            		   )
			// 	               )
			//                ]
			// });
			// HmChart2.create($aChart, settings2);
		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getPeriodParams());
			return params;
		},
		
		/** 조회 */
		search: function() {
            var vChart = $vChart.highcharts();
            var aChart = $aChart.highcharts();
            var vLen = vChart.series.length;
            var aLen = aChart.series.length;
            for (var i = vLen-1; i>=0; i--) {
                if (vChart.series[i].data.length) {
                    vChart.series[i].data[0].remove();
                }
            }
            for (var i = aLen-1; i>=0; i--) {
                if (aChart.series[i].data.length) {
                    aChart.series[i].data[0].remove();
                }
            }
		/*	Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgPowerMonitor/getItgPowerMonitorList.do');
		},
		
		/** 차트 조회 */
		drawChart: function(mngNo) {
			var params = {
				mngNo: mngNo
			};
			$.extend(params, HmBoxCondition.getPeriodParams());

			Server.get('/main/innotube/itgPowerMonitor/getItgPowerMonitorChartList.do', {
				data: params,
				success: function(result) {
                    if(result != null) {
                        var vChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['voltage'], result);
                        var aChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['current'], result);

                        for(var i = 0; i < vChartDataArr.length; i++) {
                            HmHighchart.setSeriesData($vChart.attr('id'), i, vChartDataArr[i], false);
                        }
                        for(var i = 0; i < aChartDataArr.length; i++) {
                            HmHighchart.setSeriesData($aChart.attr('id'), i, aChartDataArr[i], false);
                        }
                        HmHighchart.redraw($vChart.attr('id'));
                        HmHighchart.redraw($aChart.attr('id'));
                    }
				}
			});
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($grid, '전력감시', false);
			// var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/innotube/itgPowerMonitor/export.do', params);
		},
		
		/** 차트 데이터보기 */
		showChartData: function(chartType) {
			var cols, chartData;
			if(chartType == 'v') {
				cols = [
		            { text: '일시', datafield: 'ymdhms' },
		            { text: '전압(V)', datafield: 'voltage', cellsalign: 'right', width: 150 }
	            ];
				chartData = $vChart.jqxChart('source');
			}
			else if(chartType == 'a') {
				cols = [
		            { text: '일시', datafield: 'ymdhms' },
		            { text: '전류(A)', datafield: 'current', cellsalign: 'right', width: 150 }
	            ];
				chartData = $aChart.jqxChart('source');
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
		},
		
		/** ContextMenu */
		selectCtxmenu: function(event) {
			var val = $(event.args)[0].title;
			if(val == null) return;
			switch(val) {
			case 'devCpst':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var params = $grid.jqxGrid('getrowdata', rowidx);
					params.sensorName = 'CURR/VOLT';
					$.post(ctxPath + '/main/popup/innotube/pPowerDevCpst.do', 
							params,
							function(result) {
								HmWindow.open($('#pwindow'), '장비구성정보', result, 760, 440);
							}
					);
				} catch(e) {}
				break;
			case 'filter':
				try {
					$grid.jqxGrid('beginupdate');
					if($grid.jqxGrid('filterable') === false) {
						$grid.jqxGrid({ filterable: true });
					}
                    setTimeout(function() {
                        $grid.jqxGrid({showfilterrow: !$grid.jqxGrid('showfilterrow')});
                    }, 300);
					$grid.jqxGrid('endupdate');
				} catch(e) {}
				break;
			case '필터초기화':
				try {
					$grid.jqxGrid('clearfilters');
				} catch(e) {}
				break;
			}
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});