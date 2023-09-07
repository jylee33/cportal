var $devGrid, $oidGrid, $perfGrid ,$perfChart;
var timer;
var Main = {
		/** variable */
		initVariable : function() {
			$cbPeriod = $('#cbPeriod');
			$devGrid = $('#devGrid');
			$oidGrid = $('#oidGrid');
			$perfGrid = $('#perfGrid');
			$perfChart = $('#perfChart');
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
			case 'btnMibBrowser': this.showMibBrowser(); break;
			case "btnExcel": this.exportExcel(); break;
			case "btnOidPerfConf": this.oidPerfConf(); break;

			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], '100%', '100%');
			HmJqxSplitter.create($('#tSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], '100%', '100%');
			HmJqxSplitter.create($('#bSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '30%', collapsible: false }, { size: '70%' }], '100%', '100%');

			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));

			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/nms/oidPerf/getDevList.do'
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
				 	{ text : '장비명', 		datafield: 'devName',		width: 120 	 },
					{ text : '장비IP', 		datafield: 'devIp',			width: 120 	 },
					{ text : '장비종류', 	datafield: 'devKind2',		width: 100 	 },
					{ text : '모델', 		datafield: 'model',			width: 100	 },
					{ text : '제조사', 		datafield: 'vendor',			minwidth: 100 },
					{ text : 'mngNo', 	datafield: 'mngNo',			hidden: true   }
			    ]
			});
			HmGrid.create($oidGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var idx = HmGrid.getRowIdx($devGrid);
								if(idx !== false) {
									var _mngNo = $devGrid.jqxGrid('getrowdata', idx).mngNo;
									$.extend(data, {
										mngNo: _mngNo
									});
								}
								return data;
							}
						}
				),
				columns: 
				[
				 	{ text : 'OID', 	datafield : 'oid',				minwidth: 120 	 },
					{ text : 'OID명', 	datafield : 'oidName',			width: 120 	 },
					{ text : 'OID설명', 	datafield : 'oidDesc',			width: 100 	 },
                    { text : '수집여부', datafield : 'perfPoll', 		width : 100 , columntype: 'checkbox' },
                    { text : '수집주기', datafield : 'pollInterval', 	width : 100 },
					{ text : '유형', 	datafield : 'disOidValType',	width : 100 },
					{ text : 'oid유형', 	datafield : 'oidValType',		hidden: true },
					{ text : 'oidNo', 	datafield : 'oidNo',			hidden: true   },
                    { text : 'seqNo', 	datafield : 'seqNo',			hidden: true   },
					{ text : 'mngNo', 	datafield : 'mngNo',			hidden: true   }
			    ]
			});
			HmGrid.create($perfGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var idx = HmGrid.getRowIdx($oidGrid);
								$.extend(data, Main.getCommParams());
								if(idx !== false) {
									var _mngNo = $oidGrid.jqxGrid('getrowdata', idx).mngNo;
									var _oidNo = $oidGrid.jqxGrid('getrowdata', idx).oidNo;
									$.extend(data, {
										mngNo: _mngNo,
										oidNo: _oidNo
									});
								}
								//alert(JSON.stringify(data));
								return data;
							}
						}
				),
				columns: 
				[
				 	{ text : '일자', 		datafield: 'ymdhms',				minwidth: 120 	 },
					{ text : '값', 			datafield: 'oidVal',					width: 150 	 }
			    ]
			});

			// oidPerf차트 생성
			Main.oidPerfChartCreate();

			$devGrid.on('rowdoubleclick', function(event){
				HmGrid.updateBoundData($oidGrid, ctxPath + '/main/nms/oidPerf/getOidList.do');
			});
			
			$oidGrid.on('rowdoubleclick', function(event){
				HmGrid.updateBoundData($perfGrid, ctxPath + '/main/nms/oidPerf/getPerfList.do');
				Main.searchChart();
			});

		},

		/** init data */
		initData : function() {

		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			});
			return params;
		},
		
		search : function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/oidPerf/getDevList.do');
		},
		searchChart : function() {
			var params=Main.getCommParams();
			var idx = HmGrid.getRowIdx($oidGrid);
			if(idx !== false) {
				var _mngNo = $oidGrid.jqxGrid('getrowdata', idx).mngNo;
				var _oidNo = $oidGrid.jqxGrid('getrowdata', idx).oidNo;
				$.extend(params, {
					mngNo: _mngNo,
					oidNo: _oidNo
				});
			}
			var _oidType = $oidGrid.jqxGrid('getrowdata', idx).oidValType;
            var perfChart = $perfChart.highcharts();

			// 문자형 OID조회시 차트 리셋
			if (_oidType==2) {
				perfChart.destroy();
				Main.oidPerfChartCreate();
				return;
			}
			Server.get('/main/nms/oidPerf/getPerfChart.do', {
				data: params,
				success: function(result) {
					console.log(result)
					var chartData = [];

                    $.each(result, function(idx, item) {
                        chartData.push([item.date, parseInt(item.oidVal)]);
                    });

                    perfChart.series[0].update({data: chartData}, false);
                    perfChart.redraw();
				}
			});
		},

		showMibBrowser: function() {
			HmUtil.createPopup('/main/popup/com/pMibBrowser.do', $('#hForm'), 'pMibBrowser', screen.availWidth, screen.availHeight);
		},

    	oidPerfConf:function(){
            $.post(ctxPath + '/main/popup/nms/pOidPerfConf.do' ,function(result) {
                HmWindow.open($('#pwindow'), 'OID 성능 설정', result, 1100, 800, 'pwindow_init');
            });
            //HmUtil.createPopup('/main/popup/nms/pOidPerfConf.do', $('#hForm'), 'pOidPerfConf', 1000, 800);
		},
		/** export Excel */
		exportExcel: function() {
		// 	var params = Master.getGrpTabParams();
		// 	$.extend(params, {
		// 		period: $cbPeriod.val(),
		// 		date1: HmDate.getDateStr($('#date1')),
		// 		time1: HmDate.getTimeStr($('#date1')),
		// 		date2: HmDate.getDateStr($('#date2')),
		// 		time2: HmDate.getTimeStr($('#date2'))
		// 	});
		// //	alert(JSON.stringify(params));
		// 	HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', params);
		},

		// oidPerf차트 생성
		oidPerfChartCreate : function () {
            var chartOptions = {
                xAxis: {
                    type: 'datetime'
                },
                yAxis:{
                    title: null
                }
            };
            HmHighchart.create2($perfChart.attr('id'), $.extend(chartOptions, {
                title: { text: '성능' },
                series: [
                    { name: '성능' }
                ]
            }), HmHighchart.TYPE_AREA);
        }
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});