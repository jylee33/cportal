var $grpTree, $grid, $teChart, $huChart;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $grid = $('#grid'), $teChart = $('#teChart'), $huChart = $('#huChart');
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
			case 'btnCList_te': this.showChartData('te'); break;
			case 'btnCList_hu': this.showChartData('hu'); break;
			case 'btnCSave_te': this.saveChart($teChart, 'temperature.png'); break;
			case 'btnCSave_hu': this.saveChart($huChart, 'humidity.png'); break;
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
                                { name:'sensorId', type:'string' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
								{ name:'sensorName', type:'string' },
								{ name:'usrName', type:'string' },
                                { name:'aleartVal', type:'string' },
                                { name:'setupLoc', type:'string' },
                                { name:'lastUdt', type:'string' },
                                { name:'maxTemp', type:'number' },
                                { name:'avgTemp', type:'number' },
                                { name:'curTemp', type:'number' },
                                { name:'maxHumidity', type:'number' },
                                { name:'avgHumidity', type:'number' },
                                { name:'curHumidity', type:'number' },
                                { name:'info', type:'string' },
                                { name:'te', type:'number' },
                                { name:'hu', type:'number' },
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
					{ text : '주장치명', columngroup: 'info', datafield: 'devName', width : 180 },
					{ text : 'IP', columngroup: 'info', datafield: 'devIp', width : 120 },
					{ text : '설비명', columngroup: 'info', datafield: 'sensorName', width : 100 },
					{ text : '경보', columngroup: 'info', datafield: 'aleartVal', width: 100, cellsalign: 'center' },
					{ text : '설치위치', columngroup: 'info', datafield: 'setupLoc', minwidth : 100 },
					{ text : '최종수집일시', columngroup: 'info', datafield: 'lastUdt', width : 140, cellsalign: 'center' },
					{ text : '최대', columngroup: 'te', datafield: 'maxTemp', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'te', datafield: 'avgTemp', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'te', datafield: 'curTemp', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'hu', datafield: 'maxHumidity', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'hu', datafield: 'avgHumidity', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'hu', datafield: 'curHumidity', width : 80, cellsalign: 'right' }
			    ],
			    columngroups:
		    	[
		    	 	{ text: '정보', align: 'center', name: 'info' },
		    	 	{ text: '온도(℃)', align: 'center', name: 'te' },
		    	 	{ text: '습도(%)', align: 'center', name: 'hu' }
		    	]
			}, CtxMenu.NONE);
			$grid.on('rowselect', function(event) {
				var row = event.args.row;
				Main.drawChart(row.mngNo, row.sensorId);
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

            HmHighchart.createStockChart($teChart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return this.value + '℃';
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' ℃',
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '온도', type: 'line'},
                ]
            }, HmHighchart.TYPE_LINE);

            HmHighchart.createStockChart($huChart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return this.value + '%';
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: ' %',
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '습도', type: 'line'},
                ]
            }, HmHighchart.TYPE_LINE);
			// var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			// $.extend(settings, {
			// 	seriesGroups: [
			// 	               HmChart2.getSeriesGroup($teChart, HmChart2.T_LINE, null,
			// 	            		   HmChart2.getSeries(
			// 	            				   ['temp'],
			// 	            				   ['온도'],
			// 	            				   false
			// 	            		   )
			// 	               )
			//                ]
			// });
			// HmChart2.create($teChart, settings);
			//
			// var settings2 = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_HOUR);
			// $.extend(settings2, {
			// 	seriesGroups: [
			// 	               HmChart2.getSeriesGroup($huChart, HmChart2.T_LINE, null,
			// 	            		   HmChart2.getSeries(
			// 	            				   ['humidity'],
			// 	            				   ['습도'],
			// 	            				   false
			// 	            		   )
			// 	               )
			//                ]
			// });
			// HmChart2.create($huChart, settings2);

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
            var teChart = $teChart.highcharts();
            var huChart = $huChart.highcharts();
            var teLen = teChart.series.length;
            var huLen = huChart.series.length;
            for (var i = teLen-1; i>=0; i--) {
                if (teChart.series[i].data.length) {
                    teChart.series[i].data[0].remove();
                }
            }
            for (var i = huLen-1; i>=0; i--) {
                if (huChart.series[i].data.length) {
                    huChart.series[i].data[0].remove();
                }
            }
		/*	Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgThermoMonitor/getItgThermoMonitorList.do');
		},

		/** 차트 조회 */
		drawChart: function(mngNo, sensorId) {
			var params = {
				mngNo: mngNo,
				sensorId: sensorId
			};
			$.extend(params, HmBoxCondition.getPeriodParams());

			Server.get('/main/innotube/itgThermoMonitor/getItgThermoMonitorChartList.do', {
				data: params,
				success: function(result) {
                    if(result != null) {
                        var teChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['temp'], result);
                        var huChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['humidity'], result);

                        for(var i = 0; i < teChartDataArr.length; i++) {
                            HmHighchart.setSeriesData($teChart.attr('id'), i, teChartDataArr[i], false);
                        }
                        for(var i = 0; i < huChartDataArr.length; i++) {
                            HmHighchart.setSeriesData($huChart.attr('id'), i, huChartDataArr[i], false);
                        }
                        HmHighchart.redraw($teChart.attr('id'));
                        HmHighchart.redraw($huChart.attr('id'));
                    }
				}
			});
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($grid, '공조시설감시', false);
			// var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/innotube/itgThermoMonitor/export.do', params);
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
					$.post(ctxPath + '/main/popup/innotube/pThermoDevCpst.do',
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
