var $grpTree, $devGrid, $cvpChart1, $cvpChart3, $cvpChart4, $cvpChart6;
var _curMngNo = 0;
var timer, rowIndex;
var ctxmenuIdx = 1;
var CVP_TYPE = {
		SIP: 1,
		IVR: 3,
		ICM: 4,
		VXML: 6
};

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $devGrid = $('#devGrid');
			$cvpChart1 = $('#cvpChart1'), $cvpChart3 = $('#cvpChart3'), $cvpChart4 = $('#cvpChart4'), $cvpChart6 = $('#cvpChart6');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchDev(); break;
			case 'btnTotalChart': this.showTotalChart(); break;
			case 'btnSearch_svc': this.searchSvcChart(); break;
			case 'btnExcel': this.exportExcel(); break;
			case 'btnCList_1': case 'btnCList_3': case 'btnCList_4': case 'btnCList_6':
				this.showChartData(curTarget.id.substr(curTarget.id.length-1));
				break;
			case 'btnCSave_1': case 'btnCSave_3': case 'btnCSave_4': case 'btnCSave_6':
				this.saveChart(curTarget.id.substr(curTarget.id.length-1));
				break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '30%', collapsible: false }, { size: '70%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'CVP' });
			Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
			
			$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true , animationDuration: 0});
			$('#prgrsBar').on('complete', function(event) {
				Main.searchDev();
				$devGrid.jqxGrid('selectrow', rowIndex);
				Main.searchSvc();
				$(this).val(0);
			});
			$('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: 'NONE', value: 0 },
				         { label: '30초', value: 30 },
				         { label: '20초', value: 20 },
				         { label: '10초', value: 10 },
				         { label: '5초', value: 5 }
				         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 1
			})
			.on('change', function() {
				Main.chgRefreshCycle();
			});
			
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {
								//_curMngNo = 0;
								//Main.
								// ();
							},
							sort: function() {
								$devGrid.jqxGrid('updatebounddata', 'sort');
							},
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
				 	{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true }, 
				 	{ text: '그룹', datafield: 'grpName', width : 150, pinned: true }, 
				 	{ text: '이름', datafield: 'devName', minwidth : 150, pinned: true }, 
					{ text: 'IP', datafield: 'devIp', width: 120 },
					{ text: '모델', datafield: 'model', width: 130 },
					{ text: '제조사', datafield: 'vendor', width: 130 },
					{ text: '콜 처리 라이선스', datafield: 'availPortCount', width: 130, cellsalign: 'right', cellsformat: 'n' },
					{ text: '콜 사용 라이선스', datafield: 'usedPortCount', width: 130, cellsalign: 'right', cellsformat: 'n' },
					{ text: '라이선스 상태', datafield: 'portStatusStr', width: 130 },
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$devGrid.on('rowclick', function(event) {
				_curMngNo = event.args.row.bounddata.mngNo;
				rowIndex = event.args.rowindex;
				Main.searchSvc();
			});
			
			// create chart
			var chartList = ['cvpChart1', 'cvpChart3', 'cvpChart4', 'cvpChart6'];
            var commOptions = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);

            var options = {};
            options.chart = {
                zoomType: 'x',
                resetZoomButton: {
                    position: {
                        align: 'right', // by default
                        verticalAlign: 'top', // by default
                        x: -10,
                        y: 10
                    },
                    relativeTo: 'chart'
                }
            };
            options.xAxis = {
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m/%d',
                    week: '%b-%d',
                    month: '%y-%b',
                    year: '%Y'
                }
            };
            options.yAxis = [
                {
                    labels: {
                        format: '{value}'
                    },
                    title: null
                }
            ];
            // options.tooltip = {
            //     formatter: function () {
            //         return pPerf.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm');
            //     }
            // };
            options.legend= {enabled: true, margin:5};

            options.series = [{name: 'Active 콜 수', data: null, lineWidth: 0.5}];
            var hmOptions = $.extend(true, commOptions, options);
			$.each(chartList, function(idx, chart) {
                HmHighchart.create2(chart, hmOptions);
			});
			
			Main.chgRefreshCycle();
		},
		
		/** init data */
		initData: function() {
			
		},

		/** 트리선택 */
		selectTree: function() {
			Main.searchDev();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, {
				sIp: $('#sIp').val(),
				sDevName: $('#sDevName').val()
			});
			return params;
		},
		
		/** 장비 조회 */
		searchDev: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/ipt/ciscoCvpMonitor/getIptCvpList.do');
			$('.chartList').hide();
		},
		
		/** 서비스 정보 클리어 */
		clearSvc: function() {
			$('#cvpName1, #cvpTypeStr1, #cvpStatusStr1').val(null);
			$('#cvpName3, #cvpTypeStr3, #cvpStatusStr3').val(null);
			$('#cvpName4, #cvpTypeStr4, #cvpStatusStr4').val(null);
			$('#cvpName6, #cvpTypeStr6, #cvpStatusStr6').val(null);
            // HmHighchart.destroyById($cvpChart1.attr('id'));
            // HmHighchart.destroyById($cvpChart3.attr('id'));
            // HmHighchart.destroyById($cvpChart4.attr('id'));
            // HmHighchart.destroyById($cvpChart6.attr('id'));
			// HmChart.clear($cvpChart1);
			// HmChart.clear($cvpChart3);
			// HmChart.clear($cvpChart4);
			// HmChart.clear($cvpChart6);
		},
		
		/** 서비스 조회 */
		searchSvc: function() {
			Main.clearSvc();
			Server.get('/main/ipt/ciscoCvpMonitor/getIptCvpPerfList.do', {
				data: { mngNo: _curMngNo },
				success: function(result) {
					$('.chartList').hide();
					if(result != null) {
						$.each(result, function(idx, value) {
							$('#cvpName' + value.cvpType).val(value.cvpName);
							if($.inArray(value.cvpType, [CVP_TYPE.SIP, CVP_TYPE.IVR, CVP_TYPE.ICM]) == -1) {
								$('#cvpTypeStr' + value.cvpType).val(value.cvpTypeStr);
							}else {
								$('#cvpTypeStr' + value.cvpType).val('Call Server-' + value.cvpTypeStr);
							}
							$('#cvpStatusStr' + value.cvpType).val(value.cvpStatusStr);
							$('#chartList_' + value.cvpType).show();
						});
					}
				}
			});
		},
		
		/** 서비스 추이그래프 조회 */
		searchSvcChart: function() {
			if(_curMngNo == 0) {
				alert('장비를 선택해주세요.');
				return;
			}
			var params = {
					mngNo: _curMngNo,
					date1: HmDate.getDateStr($('#date1')),
					time1: HmDate.getTimeStr($('#date1')),
					date2: HmDate.getDateStr($('#date2')),
					time2: HmDate.getTimeStr($('#date2'))
			};
			
			Server.get('/main/ipt/ciscoCvpMonitor/getIptCvpPerfChartList.do', {
				data: params,
				success: function(result) {
                    var chartData1 = [], chartData3 = [], chartData4 = [], chartData6 = [];
                    var chart1 = $('#cvpChart1').highcharts();
                    var chart3 = $('#cvpChart3').highcharts();
                    var chart4 = $('#cvpChart4').highcharts();
                    var chart6 = $('#cvpChart6').highcharts();
					if(result != null) {
						$.each(result, function(idx, item) {
                            switch(item.cvpType){
								case 1:
                                    $.each(item.perfList, function(i,v){
                                        var time = HmHighchart.setting_dt_convert(v.ymdhms);
                                        var data = v.activeCall;
                                    	chartData1.push([time, data]);
									});
									break;
								case 3:
                                    $.each(item.perfList, function(i,v){
                                        var time = HmHighchart.setting_dt_convert(v.ymdhms);
                                        var data = v.activeCall;
                                        chartData3.push([time, data]);
                                    });
									break;
                                case 4:
                                    $.each(item.perfList, function(i,v){
                                        var time = HmHighchart.setting_dt_convert(v.ymdhms);
                                        var data = v.activeCall;
                                        chartData4.push([time, data]);
                                    });
                                    break;
                                case 6:
                                    $.each(item.perfList, function(i,v){
                                        var time = HmHighchart.setting_dt_convert(v.ymdhms);
                                        var data = v.activeCall;
                                        chartData5.push([time, data]);
                                    });
                                    break;
                            }
						});
                        chart1.series[0].setData(chartData1, false);
                        chart3.series[0].setData(chartData3, false);
                        chart4.series[0].setData(chartData4, false);
                        chart6.series[0].setData(chartData6, false);
                        chart1.redraw();
                        chart3.redraw();
                        chart4.redraw();
                        chart6.redraw();
					}
				}
			});
		},
		
		/** vxml 합산 추이 차트 */
		showTotalChart: function(row) {
			var rowdata = $devGrid.jqxGrid('getrowdata', row);
			
			$.get(ctxPath + '/main/popup/ipt/pCiscoCvpPerfChart.do', { mngNo: 0, searchType: 'cnt' },
					function(result) {
						HmWindow.open($('#pwindow'), 'VXML 합산 추이 그래프', result, 600, 400, 'pwindow_init', rowdata);
					}
			);
		},
		
		/** export */
		exportExcel: function() {
			var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/ipt/ciscoCvpMonitor/export.do', params);
		},
		
		/** 차트 데이터 보기 */
		showChartData: function(type) {
			var params = {};
			params.chartData = $('#cvpChart' + type).jqxChart('source');
			params.cols = [
			               	{ text: '일시', datafield: 'ymdhms' },
			               	{ text: 'Active 콜 수', datafield: 'activeCall', width: 200, cellsalign: 'right' }
			               ];
			
			$.get(ctxPath + '/main/popup/comm/pChartDataList.do', function(result) {
				HmWindow.open($('#pwindow'), '차트 데이터 리스트', result, 698, 600, 'p2window_init', params);
			});
		},
		
		/** 차트 저장 */
		saveChart: function(type) {
			switch(type) {
			case '1': HmUtil.exportChart($cvpChart1, 'sip.png'); break;
			case '3': HmUtil.exportChart($cvpChart3, 'ivr.png'); break;
			case '4': HmUtil.exportChart($cvpChart4, 'icn.png'); break;
			case '6': HmUtil.exportChart($cvpChart6, 'vxm.png'); break;
			}
		},
		
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#refreshCycleCb').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
	
	$('.searchBox').keypress(function(e) { 
		if (e.keyCode == 13) Main.searchDev(); 
	});
});