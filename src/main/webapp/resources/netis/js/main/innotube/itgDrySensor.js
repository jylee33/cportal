var $grpTree, $grid, $chart;
var curSensor = null;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $grid = $('#grid'), $chart = $('#chart');
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
			case 'btnCList': this.showChartData(); break;
			case 'btnCSave': this.saveChart(); break;
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
                                { name:'fmsSeqNo', type:'string' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'usrName', type:'string' },
                                { name:'sensorName', type:'string' },
                                { name:'state', type:'int' },
                                { name:'setupLoc', type:'string' },
                                { name:'lastUdt', type:'string' }
							]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {
								curSensor = null;
							}
						}
				),
				columns:
				[
					{ text : '그룹명', datafield: 'grpName', width : 150 },
					{ text : '주장치명', datafield: 'devName', width : 200 },
					{ text : 'IP', datafield: 'devIp', width : 120 },
					{ text : '설비명', datafield: 'sensorName', width : 130 },
					{ text : '센서명', datafield: 'usrName', width : 130 },
					{ text : '센서상태', datafield: 'state', width : 80, cellsrenderer: HmGrid.sensorStatusrenderer, columntype:'string', cellsalign: 'center' },
					{ text : '설치위치', datafield: 'setupLoc', minwidth : 130 },
					{ text : '최종수집일시', datafield: 'lastUdt', width : 160, cellsalign: 'center' }
			    ]
			}, CtxMenu.NONE);
			$grid.on('rowselect', function(event) {
				curSensor = event.args.row;
				Main.drawChart(curSensor.mngNo, curSensor.fmsSeqNo);
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

            HmHighchart.createStockChart($chart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            if(curSensor.sensorName.toUpperCase() == 'DOOR') {
								switch(this.value) {
									case -1: return '수집없음';
									case 0: return '열림';
									case 1: return '닫힘';
									default: return '';
								}
							} else {
								switch(this.value) {
								case -1: return '수집없음';
								case 0: return'정상';
								case 1: return '발생';
								default: return '';
								}
							}
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: '',
                    formatter: function() {
                    	console.log(this.y)
						var vStr = '';
                        if(curSensor.sensorName.toUpperCase() == 'DOOR') {
                            switch(this.y) {
                                case -1: vStr = '수집없음'; break;
                                case 0: vStr = '열림'; break;
                                case 1: vStr =  '닫힘'; break;
                                default: vStr = '';
                            }
                        } else {
                            switch(this.y) {
                                case -1: vStr = '수집없음'; break;
                                case 0: vStr = '정상'; break;
                                case 1: vStr = '발생'; break;
                                default: vStr = '';
                            }
                        }

                        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm') + '</b>';
                        s += '<table>';
                        var suffix = this.points[0].series.tooltipOptions.valueSuffix || '';
                        $.each(this.points, function() {
                            s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ':</td>' +
                                '<td style="text-align: right">' + vStr + '</td></tr>';
                        });
                        s += '</table>';
                        return s;
                    }
                },
                series: [
                    {name: '상태', type: 'column'}
                ]
            }, HmHighchart.TYPE_COLUMN);
// 			var settings = HmChart2.getCommOptions(HmChart2.T_COLUMN);
// 			settings.xAxis = {
// 					dataField: 'ymdhms',
// 					type: 'date',
// 					dateFormat: 'yyyy-MM-dd HH:mm:ss',
// 					formatFunction: function(value) {
// 	                	return $.format.date(value, 'MM-dd HH시');
// 					}
// 			};
// 			settings.valueAxis = {
// //					unitInterval: 1,
// 					minValue: -1,
// 					maxValue: 1,
// 					labels: {
// 						formatSettings: { decimalPlaces: '0' }
// 					},
// 					formatFunction: function(value) {
// 						if(curSensor.sensorName.toUpperCase() == 'DOOR') {
// 							switch(value) {
// 							case -1: return '수집없음';
// 							case 0: return '열림';
// 							case 1: return '닫힘';
// 							default: return '';
// 							}
// 						}
// 						else {
// 							switch(value) {
// 							case -1: return '수집없음';
// 							case 0: return'정상';
// 							case 1: return '발생';
// 							default: return '';
// 							}
// 						}
// 					}
// 			};
//
// 			$.extend(settings, {
// 				seriesGroups: [
// 				               HmChart2.getSeriesGroup($chart, HmChart2.T_COLUMN, null,
// 				            		   HmChart2.getSeries(
// 				            				   ['val1'],
// 				            				   ['상태'],
// 				            				   false
// 				            		   )
// 				               )
// 			               ]
// 			});
// //			settings.seriesGroups[0].bands = [{ minValue: 0, maxValue: 0.01, lineWidth: 1, color: '#1F99D3' }]; /* 오류가 발생해 주석처리 */
// 			HmChart2.create($chart, settings);

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
            var chart = $chart.highcharts();
            var len = chart.series.length;
            for (var i = len-1; i>=0; i--) {
                if (chart.series[i].data.length) {
                    chart.series[i].data[0].remove();
                }
            }
		/*	Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgDrySensor/getItgDrySensorList.do');
		},

		/** 차트 조회 */
		drawChart: function(mngNo, fmsSeqNo) {
			var params = {
				mngNo: mngNo,
				fmsSeqNo: fmsSeqNo
			};

			$.extend(params, HmBoxCondition.getPeriodParams());

			Server.get('/main/innotube/itgDrySensor/getItgDrySensorChartList.do', {
				data: params,
				success: function(result) {
					if(result != null){
						var chartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['val1'], result);
						for(var i = 0; i < chartDataArr.length; i++) {
							HmHighchart.setSeriesData($chart.attr('id'), i, chartDataArr[i], false);
						}
						HmHighchart.redraw($chart.attr('id'));
                    }
				}
			});
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($grid, '감지센서', false);
			// var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/innotube/itgDrySensor/export.do', params);
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
					$.post(ctxPath + '/main/popup/innotube/pDrySensorDevCpst.do',
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
