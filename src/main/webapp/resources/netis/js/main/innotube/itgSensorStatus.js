var $grpTree, $grid, $chart;

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
                                { name:'fmsSeqNo', type:'string' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'usrName', type:'string' },
                                { name:'sensorName', type:'string' },
                                { name:'setupLoc', type:'string' },
                                { name:'evtLevel', type:'number' },
                                { name:'curVal', type:'number' },
                                { name:'maxVal', type:'number' },
                                { name:'avgVal', type:'number' },
                                { name:'lastUdt', type:'string' },
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
					{ text : '그룹명', datafield: 'grpName', width : 150 },
					{ text : '주장치명', datafield: 'devName', minwidth : 150 },
					{ text : 'IP', datafield: 'devIp', width : 120 },
					{ text : '설비명', datafield: 'sensorName', width : 130 },
					{ text : '센서명', datafield: 'usrName', width : 130 },
					{ text : '설치위치', datafield: 'setupLoc', width : 130 },
					{ text : '상태', datafield: 'evtLevel', width : 80, cellsrenderer: HmGrid.evtLevelrenderer, cellsalign: 'center'},
					{ text : '현재값', datafield: 'curVal', width : 100, cellsalign: 'right' },
					{ text : '최대값', datafield: 'maxVal', width : 100, cellsalign: 'right' },
					{ text : '평균값', datafield: 'avgVal', width : 100, cellsalign: 'right' },
					{ text : '최종수집일시', datafield: 'lastUdt', width : 160, cellsalign: 'center' }
			    ]
			});
			$grid.on('rowselect', function(event) {
				var row = event.args.row;
				console.log(row)
				Main.drawChart(row.mngNo, row.fmsSeqNo);
			});
            HmHighchart.createStockChart($chart.attr('id'), {
                yAxis: {
                    crosshair: true,
                    opposite: false,
                    showLastLabel: true,
                    min: 0,
                    labels: {
                        formatter:  function () {
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    valueSuffix: '',
                    formatter: HmHighchart.absHtmlTooltipFormatter
                },
                series: [
                    {name: '상태', type: 'line'}
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
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgSensorStatus/getItgSensorStatusList.do');
		},

		/** 차트 조회 */
		drawChart: function(mngNo, fmsSeqNo) {
			var params = {
				mngNo: mngNo,
				fmsSeqNo: fmsSeqNo
			};
			$.extend(params, HmBoxCondition.getPeriodParams());

			Server.get('/main/innotube/itgSensorStatus/getItgSensorStatusChartList.do', {
				data: params,
				success: function(result) {
					if(result != null){
                        var chartDataArr = HmHighchart.convertJsonArrToChartDataArr('dtYmdhms', ['avgVal1'], result);

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
			HmUtil.exportGrid($grid, '센서현황', false);
			// HmUtil.exportExcel(ctxPath + '/main/innotube/itgSensorStatus/export.do', Main.getCommParams());
		}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
