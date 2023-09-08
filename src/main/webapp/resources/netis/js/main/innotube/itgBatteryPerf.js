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
                                { name:'setupLoc', type:'string' },
                                { name:'maxIV', type:'number' },
                                { name:'avgIV', type:'number' },
                                { name:'curIV', type:'number' },
                                { name:'maxOV', type:'number' },
                                { name:'avgOV', type:'number' },
                                { name:'curOV', type:'number' },
                                { name:'oa', type:'number' },
                                { name:'batV', type:'number' },
                                { name:'batA', type:'number' },

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
					{ text : '주장치명', columngroup: 'info', datafield: 'devName', width : 100 },
					{ text : 'IP', columngroup: 'info', datafield: 'devIp', width : 120 },
					{ text : '축전지명', columngroup: 'info', datafield: 'usrName', width : 150 },
					{ text : '설치위치', columngroup: 'info', datafield: 'setupLoc', minwidth : 100 },
					{ text : '최대', columngroup: 'iv', datafield: 'maxIV', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'iv', datafield: 'avgIV', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'iv', datafield: 'curIV', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'ov', datafield: 'maxOV', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'ov', datafield: 'avgOV', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'ov', datafield: 'curOV', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'oa', datafield: 'oa', width : 100, cellsalign: 'right' },
					{ text : '현재', columngroup: 'batV', datafield: 'batV', width : 100, cellsalign: 'right' },
					{ text : '현재', columngroup: 'batA', datafield: 'batA', width : 100, cellsalign: 'right' }
			    ],
			    columngroups: 
		    	[
		    	 	{ text: '정보', align: 'center', name: 'info' },
		    	 	{ text: '입력전압(V)', align: 'center', name: 'iv' },
		    	 	{ text: '출력전압(V)', align: 'center', name: 'ov' },
		    	 	{ text: '출력전압(V)', align: 'center', name: 'oa' },
		    	 	{ text: '축전지전압(V)', align: 'center', name: 'batV' },
		    	 	{ text: '축전지전류(A)', align: 'center', name: 'batA' }
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
                    {name: '입력전압(V)', type: 'line'},
                    {name: '출력전압(V)', type: 'line'},
                    {name: '축전지전압(V)', type: 'line'}
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
                    {name: '출력전류(A)', type: 'line'},
                    {name: '축전지전류(A)', type: 'line'}
                ]
            }, HmHighchart.TYPE_LINE);

			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params =  Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getPeriodParams());
			return params;
		},
		
		/** 조회 */
		search: function() {
			// chart clear
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
			/*Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgBatteryPerf/getItgBatteryPerfList.do');
		},
		
		/** 차트 조회 */
		drawChart: function(mngNo) {
			var params = {
				mngNo: mngNo
			};
			$.extend(params, HmBoxCondition.getPeriodParams());

			Server.get('/main/innotube/itgBatteryPerf/getItgBatteryPerfChartList.do', {
				data: params,
				success: function(result) {
                    if(result != null) {
                        var vChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['iv', 'ov', 'batV'], result);
                        var aChartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['oa', 'batA'], result);

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
			HmUtil.exportGrid($grid, '배터리성능', false);
			// var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/innotube/itgBatteryPerf/export.do', params);
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
					$.post(ctxPath + '/main/popup/innotube/pBatteryDevCpst.do', 
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