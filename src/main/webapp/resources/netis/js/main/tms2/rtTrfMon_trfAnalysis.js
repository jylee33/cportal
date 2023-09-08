var TrfAnalysis = {
		ajax: null,
		chart: null,
		wk_trfAnalysis: null,
		chartSelectionRange: null,
		searchCond: null,


		/** init design */
		initDesign: function() {
			this.createChart();
		},


		/** 차트 생성 */
		createChart: function() {

			TrfAnalysis.chart =
				HmHighchart.createStockChart('rtTimeChart', {
					chart: {
						height: 305,
						// height: 19 +'%',
						zoomType : 'x',
						renderTo: 'container',
					},
					// plotOptions: {
					// 	series: {
					// 		animation: {
					// 			duration: 2000
					// 		},
					// 	}
					// },
					xAxis: {
						type: 'datetime',
						dateTimeLabelFormats: {
							day: '%m-%d'
						},
					},
					yAxis: {
						opposite: false,
						crosshair: true,
						showLastLabel: true,
						labels: {
							formatter: HmHighchart.absUnit1000Formatter
						}
					},
					tooltip: {
						shared: true,
						useHTML: true,
						formatter: HmHighchart.absUnit1000HtmlTooltipFormatter
					},
					series: [
						{name: 'IN BPS'  , type: 'area' , xField : 'stampInserted' , yField : 'inBps'  , color : '#85DDF4' , visible: true },
						{name: 'OUT BPS' , type: 'area' , xField : 'stampInserted' , yField : 'outBps' , color : '#4375DB' },
						// {name: 'IN PPS'  , type: 'area' , xField : 'stampInserted' , yField : 'inPps'  , color : '#F9899B'},
						{name: 'IN PPS'  , type: 'area' , xField : 'stampInserted' , yField : 'inPps'  , color : '#FFA2A2' ,  visible: true },
						// {name: 'OUT PPS' , type: 'area' , xField : 'stampInserted' , yField : 'outPps' , color : '#FF4848'},
						{name: 'OUT PPS' , type: 'area' , xField : 'stampInserted' , yField : 'outPps' , color : '#B70000'},
					],
				}, HmHighchart.TYPE_AREA);



			setTimeout(function() {
				$("#rtTimeChart").css({
					width: '100%',
					// height: '70%',
					display: 'block'
				}).highcharts().reflow();
			}, 300);
		},

//
// 		/** 검색조건 변경시 차트 시리즈 재구성 */
// 		chgSeries: function(params) {
// 			var color_ob = '#54dd74', color_ib = '#328445', color_op = '#a84141', color_ip = '#ff5e5e';
// 			var color_lb = '#9effc9', color_lp = '#ffc1e8';
//
// 			try {
// 				switch(params.trfType) {
// 				case HmConst.trf_type.total:
// 				case HmConst.trf_type.port:
// 				case HmConst.trf_type.protocol:
// 					if(TrfAnalysis.chart.series.length < 2) {
// 						for(var i = TrfAnalysis.chart.series.length; i < 2; i++) {
// 							TrfAnalysis.chart.addSeries({ name: 'new' }, false);
// 						}
// 					}
// 					else {
// 						while(TrfAnalysis.chart.series.length > 2) {
// 							TrfAnalysis.chart.series[TrfAnalysis.chart.series.length-1].remove(false);
// 						}
// 					}
// 					TrfAnalysis.chart.series[0].update({ name: 'IN BPS',  data: null, yAxis: 0, threshold: 0, type: 'area', zIndex: 2, color: '#54dd74' }, false);
// 					TrfAnalysis.chart.series[1].update({ name: 'IN PPS', data: null, yAxis: 1, threshold: 0, type: 'area', zIndex: 1, color: '#a84141' }, false);
//
// 					//전일/전주 선택시
// 					if(params.lastdayYn == 'Y') {
// 						TrfAnalysis.chart.addSeries({ name: '전일 IN BPS', yAxis: 0, threshold: 0, type: 'line', zIndex: 3, marker: {enabled: false}, color: '#10300f' }, false);
// 						TrfAnalysis.chart.addSeries({ name: '전일 IN PPS', yAxis: 1, threshold: 0, type: 'line', zIndex: 3, marker: {enabled: false}, color: '#990101' }, false);
// 					}
// 					if(params.lastweekYn == 'Y') {
// 						TrfAnalysis.chart.addSeries({ name: '전주 IN BPS', yAxis: 0, threshold: 0, type: 'line', zIndex: 4, marker: {enabled: false}, color: '#10300f' }, false);
// 						TrfAnalysis.chart.addSeries({ name: '전주 IN PPS', yAxis: 1, threshold: 0, type: 'line', zIndex: 4, marker: {enabled: false}, color: '#990101' }, false);
// 					}
// 					TrfAnalysis.chart.redraw();
// 					break;
//
//
// 				case HmConst.trf_type.tcpflag:
// 					var flagCnt = params.tcpflag.split(',');
// 					var seriesCnt = flagCnt.length; // flag별 in out pps
//                     if(TrfAnalysis.chart.series.length < seriesCnt) {
// 						for(var i = TrfAnalysis.chart.series.length; i < seriesCnt; i++) {
// 							TrfAnalysis.chart.addSeries({ name: 'new' }, false);
// 						}
// 					}
// 					else {
// 						while(TrfAnalysis.chart.series.length > seriesCnt) {
// 							TrfAnalysis.chart.series[TrfAnalysis.chart.series.length-1].remove(false);
// 						}
// 					}
// 					var colors = ['#ff6551', '#fcaca1', '#fce655', '#fff5b5', '#4ed3ce', '#b4fffc', '#904cff', '#d5bcff', '#84cc59', '#d5ffbc'];
// 					var _etcIdx = 0;
// 					for(var i = 0; i < flagCnt.length; i++) {
// 						var _incolor, _outcolor;
// 						switch(flagCnt[i]) {
// 						case '0': _incolor = '#de6db5'; _outcolor = '#de6db5'; break;
// 						case '1': _incolor = '#63b263'; _outcolor = '#63b263'; break;
// 						case '2': _incolor = '#b57def', _outcolor = '#b57def'; break;
// 						case '4': _incolor = '#adb6c6', _outcolor = '#adb6c6'; break;
// 						case '8': _incolor = '#7bd3ce', _outcolor = '#7bd3ce'; break;
// 						case '16': _incolor = '#73baff', _outcolor = '#73baff'; break;
// 						case '32': _incolor = '#a08001', _outcolor = '#a08001'; break;
// 						default: _incolor = colors[_etcIdx], _outcolor = colors[_etcIdx++]; break;
// 						}
//
// 						var _zIndex = flagCnt[i] == '2'? 2 : 1;
// 						TrfAnalysis.chart.series[i * 2].update({ name: 'IN PPS(' + tcpFlagUtil.noToTcpFlag(flagCnt[i]) + ')', data: null, yAxis: 1, type: 'area', color: _incolor, zIndex: _zIndex }, false);
// 						//TrfAnalysis.chart.series[i * 2 + 1].update({ name: 'OUT PPS(' + tcpFlagUtil.noToTcpFlag(flagCnt[i]) + ')', data: null, yAxis: 1, type: 'area', color: _outcolor, zIndex: _zIndex }, false);
// 					}
// 					TrfAnalysis.chart.redraw();
// 					break;
// 				}
//
// 				this.search(params, false);
// 			} catch(e) {}
// 		},

		/** 조회 */
		search: function(params, isEqual) {

			try {
				var addParams = { isCondEqual: isEqual };
				// if(isEqual) {
				// 	var data = TrfAnalysis.chart.series[0].data;
				// 	if(data != null && data.length > 0) {
				// 		var lastDate = new Date(data[data.length-1].x);
				// 		addParams.lastYmdhms = $.format.date(lastDate, 'yyyyMMddHHmmss');
				// 	}
				// 	else {
				// 		addParams.isCondEqual = isEqual = false; //이전데이터가 없을경우 기준시간 조회
				// 	}
				// }
				$.extend(addParams, params);

				if(TrfAnalysis.ajax != null) {
					TrfAnalysis.ajax.abort();
				}
				TrfAnalysis.ajax = Server.post('/main/tms2/rtTrafficMonit/getTrfAnalysisList.do', {
					data: addParams,
					success: function(result) {
						if( result != null && result.length > 0 ){
							switch(params.tfStandard) {
								case "TOTAL" :
									var inbpsData = [], inppsData = [];
									var outbpsData = [], outppsData = [];

									$.each(result, function(idx, item) {
										var temp = new Date(item.stampInserted);
										inbpsData.push([temp.getTime(), item.inBps]);
										outbpsData.push([temp.getTime(), item.outBps]);
										inppsData.push([temp.getTime(), item.inPps]);
										outppsData.push([temp.getTime(), item.outPps]);
									});

									var slen = TrfAnalysis.chart.series.length;
									for (var i = 0; i < slen; i++) {
										TrfAnalysis.chart.series[i].update({data: []}, false);
									}
									TrfAnalysis.chart.yAxis[0].update({gridLineWidth: true}, false);
									HmHighchart.redraw('rtTimeChart');

									if(isEqual){
										for(var i = 0; i < result.length; i++) {
											// add point
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false,false,true);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i], false,false,true);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i], false,false,true);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i], false,false,true);

										}

										// for(var i = 0; i < result.length; i++) {
										// 	// add point
										// 	TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false);
										// 	TrfAnalysis.chart.series[1].addPoint(outbpsData[i], false);
										// 	TrfAnalysis.chart.series[2].addPoint(inppsData[i], false);
										// 	TrfAnalysis.chart.series[3].addPoint(outppsData[i], false);
										// 	// remove point
										// 	// TrfAnalysis.chart.series[0].data[0].remove(false);
										// 	// TrfAnalysis.chart.series[1].data[0].remove(false);
										// }

										// 	TrfAnalysis.chart.series[0].update({data : inbpsData ,pointStart : inbpsData[0][0]});
										// 	TrfAnalysis.chart.series[1].update({data : outbpsData ,pointStart : outbpsData[0][0]});
										// 	TrfAnalysis.chart.series[2].update({data : inppsData ,pointStart : inppsData[0][0]});
										// 	TrfAnalysis.chart.series[3].update({data : outppsData ,pointStart : outppsData[0][0]});

									}else{

										for(var i = 0; i < result.length; i++) {
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i],false);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i],false);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i],false);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i],false);
										}
										// TrfAnalysis.chart.series[0].update({data : inbpsData ,pointStart : inbpsData[0][0]});
										// TrfAnalysis.chart.series[1].update({data : outbpsData ,pointStart : outbpsData[0][0]});
										// TrfAnalysis.chart.series[2].update({data : inppsData ,pointStart : inppsData[0][0]});
										// TrfAnalysis.chart.series[3].update({data : outppsData ,pointStart : outppsData[0][0]});
									}

									TrfAnalysis.chart.redraw();


									break;
								case "PROTOCOL" :

									var inbpsData = [], inppsData = [];
									var outbpsData = [], outppsData = [];

									$.each(result, function(idx, item) {
										var temp = new Date(item.stampInserted);
										inbpsData.push([temp.getTime(), item.inBps]);
										outbpsData.push([temp.getTime(), item.outBps]);
										inppsData.push([temp.getTime(), item.inPps]);
										outppsData.push([temp.getTime(), item.outPps]);
									});

									var slen = TrfAnalysis.chart.series.length;
									for (var i = 0; i < slen; i++) {
										TrfAnalysis.chart.series[i].update({data: []}, false);
									}
									TrfAnalysis.chart.yAxis[0].update({gridLineWidth: true}, false);
									HmHighchart.redraw('rtTimeChart');

									if(isEqual){
										for(var i = 0; i < result.length; i++) {
											// add point
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false,false,true);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i], false,false,true);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i], false,false,true);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i], false,false,true);
										}
									}else{
										for(var i = 0; i < result.length; i++) {
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i],false);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i],false);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i],false);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i],false);
										}
									}

									TrfAnalysis.chart.redraw();
								break;
								case "PORT" :

									var inbpsData = [], inppsData = [];
									var outbpsData = [], outppsData = [];

									$.each(result, function(idx, item) {
										var temp = new Date(item.stampInserted);
										inbpsData.push([temp.getTime(), item.inBps]);
										outbpsData.push([temp.getTime(), item.outBps]);
										inppsData.push([temp.getTime(), item.inPps]);
										outppsData.push([temp.getTime(), item.outPps]);
									});

									var slen = TrfAnalysis.chart.series.length;
									for (var i = 0; i < slen; i++) {
										TrfAnalysis.chart.series[i].update({data: []}, false);
									}
									TrfAnalysis.chart.yAxis[0].update({gridLineWidth: true}, false);
									HmHighchart.redraw('rtTimeChart');

									if(isEqual){
										for(var i = 0; i < result.length; i++) {
											// add point
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false,false,true);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i], false,false,true);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i], false,false,true);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i], false,false,true);
										}
									}else{
										for(var i = 0; i < result.length; i++) {
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i],false);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i],false);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i],false);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i],false);
										}
									}

									TrfAnalysis.chart.redraw();
								break;
								case "TCPFLAG" :

									var inbpsData = [], inppsData = [];
									var outbpsData = [], outppsData = [];

									$.each(result, function(idx, item) {
										var temp = new Date(item.stampInserted);
										inbpsData.push([temp.getTime(), item.inBps]);
										outbpsData.push([temp.getTime(), item.outBps]);
										inppsData.push([temp.getTime(), item.inPps]);
										outppsData.push([temp.getTime(), item.outPps]);
									});

									var slen = TrfAnalysis.chart.series.length;
									for (var i = 0; i < slen; i++) {
										TrfAnalysis.chart.series[i].update({data: []}, false);
									}
									TrfAnalysis.chart.yAxis[0].update({gridLineWidth: true}, false);
									HmHighchart.redraw('rtTimeChart');

									if(isEqual){
										for(var i = 0; i < result.length; i++) {
											// add point
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false,false,true);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i], false,false,true);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i], false,false,true);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i], false,false,true);
										}
									}else{
										for(var i = 0; i < result.length; i++) {
											TrfAnalysis.chart.series[0].addPoint(inbpsData[i],false);
											TrfAnalysis.chart.series[1].addPoint(outbpsData[i],false);
											TrfAnalysis.chart.series[2].addPoint(inppsData[i],false);
											TrfAnalysis.chart.series[3].addPoint(outppsData[i],false);
										}
									}

									TrfAnalysis.chart.redraw();
								break;


							}


						}

						// var chartDataArr = null;

						// chartDataArr = HmHighchart.convertJsonArrToChartDataArrByBaseVal('DT_YMDHMS',
						// 	[
						// 		{field: 'IN_BPS' , baseVal: 1},
						// 		{field: 'OUT_BPS', baseVal: 1},
						// 		{field: 'IN_PPS' , baseVal: 1},
						// 		{field: 'OUT_PPS', baseVal: 1},
						// 	], result.resultData);
						//
						//
						// //updateBoundData...
						//
						// var noDataFlag = 0;
						// if (chartDataArr != null && chartDataArr.length > 0) {
						// 	// TODO series length check !!!
						// 	var slen = TrfAnalysis.chart.series.length;
						// 	for (var i = 0, n = chartDataArr.length > slen ? slen : chartDataArr.length; i < n; i++) {
						// 		HmHighchart.setSeriesData('rtTimeChart', i, chartDataArr[i], false);
						// 		if (chartDataArr[i].length > 0) noDataFlag = 1;
						// 	}
						//
						// 	TrfAnalysis.chart.yAxis[0].update({gridLineWidth: noDataFlag}, false);
						// 	HmHighchart.redraw('rtTimeChart');
						// 	// HmHighchart.centerThreshold(this.chart);
						// }
						// else {
						// 	alert('차트데이터를 확인하세요.');
						// }
						// try {
						// 	if (noDataFlag == 0) {
						// 		TrfAnalysis.chart.showNoData();
						// 	} else
						// 		TrfAnalysis.chart.hideNoData();
						// 	TrfAnalysis.chart.hideLoading();
						// } catch (err) {
						// }

						// if(result.length > 0) TrfAnalysis.searchLast(params, isEqual);
						// TrfAnalysis.searchResult(result.resultData, false);
					}
				}, false);



			} catch(e) {
				console.log(e);
			}
		},


		/** 조회결과 처리 
		 * @param		data		조회결과
		 * @param		isEqual	검색조건이 이전과 동일한지 여부
		 * */
		searchResult: function(data, isEqual) {
			try {
				var trfType = $('input[name=tfStandard]:checked').val();
				switch(trfType) {
				case HmConst.trf_type.total:

					var inbpsData = [], inppsData = [];
					var outbpsData = [], outppsData = [];
					$.each(data, function(idx, item) {
						inbpsData.push([item.date, item.inBps]);
						inppsData.push([item.date, item.inPps]);
						outbpsData.push([item.date, item.outBps]);
						outppsData.push([item.date, item.outPps]);
					});
					
					if(isEqual) {
						/**
						 * 검색조건이 동일하므로 차트의 마지막시간대 이후값만 조회하여 point를 추가한다. 이때 index 0번째 point는 제거한다.
						 */
						for(var i = 0; i < inbpsData.length; i++) {
							// add point
							// TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false);
							// TrfAnalysis.chart.series[1].addPoint(inppsData[i], false);
							// TrfAnalysis.chart.series[2].addPoint(outbpsData[i], false);
							// TrfAnalysis.chart.series[3].addPoint(outppsData[i], false);
							TrfAnalysis.chart.series[0].addPoint('2', false);
							TrfAnalysis.chart.series[1].addPoint('1', false);
							TrfAnalysis.chart.series[2].addPoint('3', false);
							TrfAnalysis.chart.series[3].addPoint('5', false);
							// remove point
							TrfAnalysis.chart.series[0].data[0].remove(false);
							TrfAnalysis.chart.series[1].data[0].remove(false);
							TrfAnalysis.chart.series[2].data[0].remove(false);
							TrfAnalysis.chart.series[3].data[0].remove(false);
						}
					}
					else {
						/**
						 * 검색조건이 이전과 상이하므로 기준시간의 데이터를 조회하여 차트 point를 업데이트 한다.
						 */
						TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false);
						TrfAnalysis.chart.series[1].addPoint(inppsData[i], false);
						TrfAnalysis.chart.series[2].addPoint(outbpsData[i], false);
						TrfAnalysis.chart.series[3].addPoint(outppsData[i], false);
					}
					TrfAnalysis.chart.redraw();
					break;

				case HmConst.trf_type.protocol:
					var chartData = [];
					for(var i = 0; i < data.length; i++) {
						var protoData = {
								inbps: [], outbps: [], inpps: [], outpps: []
						};
						$.each(data[i].perfList, function(idx, item) {
							protoData.inbps.push([item.date, item.inBps]);
							protoData.inpps.push([item.date, item.inPps]);
						});
						
						chartData.push({ proto: data[i].proto, perf: protoData });
					}
					
					if(isEqual) {
						for(var i = 0; i < chartData.length; i++) {
							for(var j = 0; j < chartData[i].perf.inbps.length; j++) {
								TrfAnalysis.chart.series[i * 2].addPoint(chartData[i].perf.inbps[j], false);
								TrfAnalysis.chart.series[i * 2 + 1].addPoint(chartData[i].perf.inpps[j], false);
								TrfAnalysis.chart.series[i * 2].data[0].remove(false);
								TrfAnalysis.chart.series[i * 2 + 1].data[0].remove(false);
							}
						}
					}
					else {
						for(var i = 0; i < chartData.length; i++) {
							TrfAnalysis.chart.series[i * 2].setData(chartData[i].perf.inbps, false);
							TrfAnalysis.chart.series[i * 2 + 1].setData(chartData[i].perf.inpps, false);
						}
					}
					TrfAnalysis.chart.redraw();
					break;
				case HmConst.trf_type.port:
					var inbpsData = [], outbpsData = [], inppsData = [], outppsData = [];
					$.each(data, function(idx, item) {
						inbpsData.push([item.date, item.inBps]);
						//outbpsData.push([item.date, item.outBps]);
						inppsData.push([item.date, item.inPps]);
						//outppsData.push([item.date, item.outPps]);
					});
					if(isEqual) {
						for(var i = 0; i < inbpsData.length; i++) {
							// add point
							TrfAnalysis.chart.series[0].addPoint(inbpsData[i], false);
							TrfAnalysis.chart.series[1].addPoint(inppsData[i], false);
							// remove point
							TrfAnalysis.chart.series[0].data[0].remove(false);
							TrfAnalysis.chart.series[1].data[0].remove(false);
						}
					} else {
						TrfAnalysis.chart.series[0].update({ data: inbpsData }, false);
						TrfAnalysis.chart.series[1].update({ data: inppsData }, false);
					}
					TrfAnalysis.chart.redraw();
					break;
				case HmConst.trf_type.tcpflag:
					var chartData = [];
					for(var i = 0; i < data.length; i++) {
						var flagData = {
								inbps: [], inpps: []
						};
						$.each(data[i].perfList, function(idx, item) {
							flagData.inbps.push([item.date, item.inBps]);
							flagData.inpps.push([item.date, item.inPps]);
						});
						chartData.push({ flag: data[i].tcpflag, perf: flagData });
					}
					var flagCnt = [];
					$.each($('#dtlcond_trfTcpflag').children().find('input:checkbox'), function(idx, value) {
						if($(this).is(':checked')) flagCnt.push($(this).val());
					});
					if(isEqual) {
						for(var i = 0; i < flagCnt.length; i++) {
							var dbData = null;
							for(var j = 0; j < chartData.length; j++) {
								if(chartData[j].flag == parseInt(flagCnt[i])) {
									dbData = chartData[j];
									break;
								}
							}
							if(dbData == null) {
								
							}
							else {
								for(var k = 0; k < dbData.perf.inbps.length; k++) {
									TrfAnalysis.chart.series[i * 2].addPoint(dbData.perf.inpps[k], false);
									TrfAnalysis.chart.series[i * 2].data[0].remove();
								}
							}
						}
					} else {
						for(var i = 0; i < flagCnt.length; i++) {
							var dbData = null;
							for(var j = 0; j < chartData.length; j++) {
								if(chartData[j].flag == parseInt(flagCnt[i])) {
									dbData = chartData[j];
									break;
								}
							}
							if(dbData != null) {
								TrfAnalysis.chart.series[i * 2].update({ data: dbData.perf.inpps}, false);
								// TrfAnalysis.chart.series[i * 2 + 1].update({ data: dbData.perf.outpps }, false);
							}
						}
						
						/*
						for(var i = 0; i < chartData.length; i++) {
							TrfAnalysis.chart.series[i * 2].update({ data: chartData[i].perf.inpps}, false);
							TrfAnalysis.chart.series[i * 2 + 1].update({ data: chartData[i].perf.outpps }, false);
						}
						*/
					}
					TrfAnalysis.chart.redraw();
					break;
				}
				HmHighchart.centerThreshold(TrfAnalysis.chart);
			} catch(e) {
				console.log(e);
			}

            // hideLoadingIcon();
		},

		// /** 전일/전주 추이 조회결과 처리 */
		// searchLastResult: function(type, data, isEqual) {
		// 	try {
		// 		var inbpsData = [], inppsData = [];
		// 		var addDays = type == 1? 1 : 7;
		// 		$.each(data, function(idx, item) {
		// 			var _date = new Date(item.date);
		// 			_date.setDate(_date.getDate() + addDays);
		// 			inbpsData.push([_date.getTime(), item.inBps]);
		// 			inppsData.push([_date.getTime(), item.inPps]);
		// 		});
		//
		// 		if(isEqual) {
		// 			/**
		// 			 * 검색조건이 동일하므로 차트의 마지막시간대 이후값만 조회하여 point를 추가한다. 이때 index 0번째 point는 제거한다.
		// 			 */
		// 			for(var i = 0; i < inbpsData.length; i++) {
		// 				// add point
		// 				TrfAnalysis.chart.series[2].addPoint(inbpsData[i], false);
		// 				TrfAnalysis.chart.series[3].addPoint(inppsData[i], false);
		// 				// remove point
		// 				TrfAnalysis.chart.series[2].data[0].remove(false);
		// 				TrfAnalysis.chart.series[3].data[0].remove(false);
		// 			}
		// 		} else {
		// 			/**
		// 			 * 검색조건이 이전과 상이하므로 기준시간의 데이터를 조회하여 차트 point를 업데이트 한다.
		// 			 */
		// 			TrfAnalysis.chart.series[2].update({ data: inbpsData }, false);
		// 			TrfAnalysis.chart.series[3].update({ data: inppsData }, false);
		// 		}
		// 		TrfAnalysis.chart.redraw();
		// 		HmHighchart.centerThreshold(TrfAnalysis.chart);
		// 	} catch(e) {}
		// },
		//

};

//그래프 생성
TrfAnalysis.initDesign();