var $statsGrid, $statsByVendorGrid;
var $usageChart,$useTimeChart, $authChart, $causeChart, $statsByVendorChart;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$statsGrid = $('#statsGrid'), 
			$statsByVendorGrid = $('#statsByVendorGrid');
			$usageChart = $('#usageChart');
			$useTimeChart = $('#useTimeChart ');
			$authChart = $('#authChart');
			$causeChart = $('#causeChart');
			$statsByVendorChart = $('#statsByVendorChart');
			$cbPeriod = $('#cbPeriod');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch":	 this.search(); break;
			case "btnDtlSearch": this.searchChart(); break;
			case 'btnExcel':		 this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
			
			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));

			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // 통계
						HmGrid.create($statsGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData : function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height : 80,
							pageable : false,
							columns: 
							[
								{ text : '인증시도', datafield : 'totalNo', width: 150  ,cellsalign: 'right'},
								{ text : '성공', datafield : 'successNo', width: 150   ,cellsalign: 'right'},
								{ text : '실패', datafield : 'failNo', width: 150  ,cellsalign: 'right'},
								{ text : '사용시간', datafield : 'totalTime', minwidth: 130, cellsrenderer: Main.convertHour },
								{ text : 'UP', datafield: 'totalUp', width: 120 , cellsrenderer: HmGrid.unit1024renderer},
								{ text : 'DOWN', datafield: 'totalDown', width: 120 , cellsrenderer: HmGrid.unit1024renderer},
								{ text : '접속자수', datafield : 'totalUser', width: 120  ,cellsalign: 'right'},
						    ]
						});
						Main.drawChart();
						break;
						
					case 1: // 제조사별 단말 통계
						HmGrid.create($statsByVendorGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData : function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height : '50%',
							columns: 
							[
								{ text : '회사명', datafield : 'company', minwidth: 120 },
								{ text : '단말수', datafield : 'sumCnt', width: 120 }
						    ]
						});
						Main.drawChart2();
						break;
						
				
					}
				}
			});	
			Main.search();

		},

		/** init data */
		initData : function() {

		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
			$.extend(params, {
				grpNo: treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
				itemKind: treeItem != null? treeItem.devKind2 : 'GROUP',				
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))				
			});
			return params;
		},
		/** 그리드 조회 */
		search : function() {
			// switch($('#mainTab').val()) {
			// case 0: HmGrid.updateBoundData($statsGrid, ctxPath + '/main/airCube/statsMgmt/getStatsList.do' ); break;
			// case 1: HmGrid.updateBoundData($statsByVendorGrid, ctxPath + '/main/airCube/statsMgmt/getStatsByVendorList.do' ); break;
			// }
			// Main.searchChart();
		},
		/**   상세 챠트 조회 */
		searchChart: function() {
			switch($('#mainTab').val()) {
			case 0: // 통계
				//사용내역-사용량 차트
					Server.get('/main/airCube/statsMgmt/getUsageChart.do', {
						data: Main.getCommParams(),
						success: function(result) {
//							alert("사용내역-사용량 차트"+JSON.stringify(result));
							$usageChart.jqxChart({ source: result });
							$usageChart.jqxChart('update');
						}
					});
			//사용내역-사용시간 차트
					Server.get('/main/airCube/statsMgmt/getUseTimeChart.do', {
						data: Main.getCommParams(),
						success: function(result) {
//							alert("사용내역-사용시간 차트"+JSON.stringify(result));
							$useTimeChart.jqxChart({ source: result });
							$useTimeChart.jqxChart('update');
						}
					});
				//인증내역 차트	
					Server.get('/main/airCube/statsMgmt/getAuthHistChart.do', {
						data: Main.getCommParams(),
						success: function(result) {
							$authChart.jqxChart({ source: result });
							$authChart.jqxChart('update');
						}
					});	
				//실패사유 차트		
					Server.get('/main/airCube/statsMgmt/getCauseChart.do', {
						data: Main.getCommParams(),
						success: function(result) {
							$causeChart.jqxChart({ source: result });
							$causeChart.jqxChart('update');
						}
					});		
				break;
			case 1:  // 제조사별 단말 통계
				Server.get('/main/airCube/statsMgmt/getStatsByVendorChart.do', {
					data: Main.getCommParams(),
					success: function(result) {
						$statsByVendorChart.jqxChart({ source: result });
						$statsByVendorChart.jqxChart('update');
					}
				});	
				break;
			};

		},
		
		/** 차트 그리기 */
		drawChart: function() {
/*			var usageSettings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_DAY, HmChart2.unit1024FormatFn);
			$.extend(usageSettings, {
				seriesGroups: [
				               		HmChart2.getSeriesGroup($usageChart, HmChart2.T_LINE, HmChart2.unit1024ToolTipFormatFn, 
			            		   HmChart2.getSeries(
										['inOctet', 'outOctet'], 
										['업로드', '다운로드'],
										[HmChart2.C_IF_MAX_IN, HmChart2.C_IF_MAX_OUT],
										false
			            		   )
				               )
			               ]
			});
			HmChart2.create($usageChart, usageSettings);*/
			// 사용량 차트
			$usageChart.jqxChart({ source: null });
			var usageSettings = {
					title: "사용 내역 : 사용량(MB)",
					description : null,
	                enableAnimations: true,
	                showLegend: true,
	            	showBorderLine: true,
	    			enableCrosshairs: true,
	    			crosshairsColor: '#AA55AA',
	    			padding: { left: 15, top: 30, right: 15, bottom: 0 },
	                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
	                source: null,
	                xAxis:
	                    {
	                        dataField: 'startTime',
	        				type: 'date',
	        				baseUnit: 'day',
	        				dateFormat: 'MM-dd',
                        	formatFunction: function(value) {
                                return $.format.date(value,  'MM-dd');
            				},
            				labels: { 
            					rotationPoint: 'topright',
            					angle: -45,
            					offset: { x: 0, y: -15 }
            				},
            				gridLines: { 
            					visible: true, 
            					step: 99999
            				}
	                    },
	                colorScheme: 'scheme05',
	                seriesGroups:
	                    [
	                        {
	                            type: 'line',
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $usageChart.jqxChart('source')[itemIndex];
	                      		   	var s = '<div style="text-align: left;"><b>' +  $.format.date(categoryValue, 'yyyy-MM-dd') + '</b><br/>';
	                      		   	$.each(group.series, function(idx, value) {
	                      		   	  s += value.displayText + ' : ' + HmUtil.convertUnit1024(dataItem[value.dataField]) + '<br/>';
	                      		   	});
	                      		   	s + '</div>';
	                      		   	return s;
	             			    },
	             			   valueAxis:
		       	                {
	             				   	minValue: 0,
	                                displayValueAxis: true,
	                                axisSize: 'auto',
	                                description: '사용량(MB)',
	                                tickMarksColor: '#888888',
	                                alternatingBackgroundColor: '#E5E5E5',
	            					alternatingBackgroundColor2: '#F5F5F5',
	            					alternatingBackgroundOpacity: 0.5,
	                                formatFunction: function (value, itemIndex, serie, group) {
	                                	return HmUtil.convertUnit1024(value);
	                                }
		       	                },
	                            series: [
	                                    { dataField: 'inOctet',	displayText: '업로드' },
	                                    { dataField: 'outOctet',	displayText: '다운로드' }
	                                ]
	                        }
	                    ]
	            };
			$usageChart.jqxChart(usageSettings);   
			
			// 사용시간 차트
			$useTimeChart.jqxChart({ source: null });
			var useTimeSettings = {
					title: "사용 내역 : 사용시간(SEC)",
					description : null,
	                enableAnimations: true,
	                showLegend: true,
	            	showBorderLine: true,
	    			enableCrosshairs: true,
	    			crosshairsColor: '#AA55AA',
	    			padding: { left: 15, top: 30, right: 15, bottom: 0 },
	                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
	                source: null,
	                xAxis:
	                    {
	                        dataField: 'startTime',
	        				type: 'date',
	        				baseUnit: 'day',
	        				dateFormat: 'MM-dd',
	        				formatFunction: function(value) {
                                return $.format.date(value,  'MM-dd');
            				},
            				labels: { 
            					rotationPoint: 'topright',
            					angle: -45,
            					offset: { x: 0, y: -15 }
            				},
            				gridLines: { 
            					visible: true, 
            					step: 99999
            				}
	                    },
	                colorScheme: 'scheme01',
	                seriesGroups:
	                    [
	                        {
	                            type: 'line',
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $useTimeChart.jqxChart('source')[itemIndex];
	                      		   	var s = '<div style="text-align: left;"><b>' +  $.format.date(categoryValue, 'yyyy-MM-dd') + '</b><br/>';
	                      		   	$.each(group.series, function(idx, value) {
	                      		  	  s += value.displayText + ' : ' + Main.convertUnitHour(dataItem[value.dataField]) + '<br/>';
	                      		   	});
	                      		   	s + '</div>';
	                      		   	return s;
	             			    },
	             			   valueAxis:
		       	                {
                                	minValue: 0,
	                                displayValueAxis: true,
	                                axisSize: 'auto',
	                                description: '시간(초)',
	                                tickMarksColor: '#888888',
	                                alternatingBackgroundColor: '#E5E5E5',
	            					alternatingBackgroundColor2: '#F5F5F5',
	            					alternatingBackgroundOpacity: 0.5
		       	                },
	                            series: [
	                                    { dataField: 'sessionTime',	displayText: '사용시간' }
	                                ]
	                        }
	                    ]
	            };
			$useTimeChart.jqxChart(useTimeSettings);   
			
			//인증내역 차트	
			$authChart.jqxChart({ source: null });
			var monthlySettings = {
					title : "인증내역",
					description: null,
					enableAnimations: true,
					showLegend: true,
					showBorderLine: true,
					enableCrosshairs: true,
					crosshairsColor: '#AA55AA',
					padding: { left: 15, top: 30, right: 15, bottom: 0 },
					colorScheme: 'scheme05',
	                xAxis:
	                    {
	                        dataField: 'timestamp',
	                    	type: 'date',
	        				baseUnit: 'day',
	        				dateFormat: 'MM-dd',
                        	formatFunction: function(value) {
                                return $.format.date(value,  'MM-dd');
            				},
            				labels: { 
            					rotationPoint: 'topright',
            					angle: -45,
            					offset: { x: 0, y: -15 }
            				},
            				gridLines: { 
            					visible: true, 
            					step: 99999
            				}
	                    },
	                colorScheme: 'scheme01',
	                seriesGroups:
	                    [
	                        {
	                            type: 'line',
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $authChart.jqxChart('source')[itemIndex];
	                      		   	var s = '<div style="text-align: left;"><b>' +  $.format.date(categoryValue, 'yyyy-MM-dd') + '</b><br/>';
	                      		   	$.each(group.series, function(idx, value) {
	                      		   		s += value.displayText + ' : ' + dataItem[value.dataField] + '(건)<br/>';
	                      		   	});
	                      		   	s + '</div>';
	                      		   	return s;
	             			    },
	             			   valueAxis:
		       	                {
	             				   	minValue: 0,
	                                displayValueAxis: true,
	                                description: '개수(건)',
	                                axisSize: 'auto',
	                                tickMarksColor: '#888888',
	                                gridLinesInterval: 1,
	                                alternatingBackgroundColor: '#E5E5E5',
	            					alternatingBackgroundColor2: '#F5F5F5',
	            					alternatingBackgroundOpacity: 0.5,
	                                formatFunction: function (value, itemIndex, serie, group) {
	                                	return HmUtil.commaNum(value);
	                                },
	                                labels: { horizontalAlignment: 'right' }
		       	                },
	                            series: [
	                                    { dataField: 'successNo',	displayText: '성공' },
	                                    { dataField: 'failNo',			displayText: '실패' }
	                                ]
	                        }
	                    ]
	            };
			$authChart.jqxChart(monthlySettings);   
			
			//실패 원인 원형 챠트
			$causeChart.jqxChart({ source: null });
		    var settings = {
	                title: "실패 사유",
					description: null,
					enableAnimations: true,
					showLegend: true,
					showBorderLine: true,
					enableCrosshairs: true,
					crosshairsColor: '#AA55AA',
					padding: { left: 15, top: 10, right: 15, bottom: 0 },
					colorScheme: 'scheme05',
	                seriesGroups:
	                    [
	                        {
	                            type: 'donut',
	                            showLabels: true,
	                            series:
	                                [
	                                    {
	                                        dataField: 'causePer',
	                                        displayText: 'cause',
	                                        labelRadius: 100,
	                                        initialAngle: 10,
	                                        radius: '90%',
	                                        innerRadius: '20%',
	                                        centerOffset: 0,
	                                        formatSettings: {decimalPlaces: 1 },
	                                        formatFunction: function (value) {
	                                            if (isNaN(value))
	                                                return value;
	                                            var num = parseFloat(value)
	                                            return num.toFixed(2)  + '%';
	                                        }
	                                    }
	                                ]
	                        }
	                    ]
	            }
			$causeChart.jqxChart(settings);   
	    },	
	    
		/** 제조사별 단말 통계 차트 그리기 */
		drawChart2: function() {
			// 제조사별 통계 차트
			$statsByVendorChart.jqxChart({ source: null });
			var vendorSettings = {
					title: "제조사별 단말 수",
					description : null,
	                enableAnimations: true,
	                showLegend: true,
	            	showBorderLine: true,
	    			enableCrosshairs: true,
	    			crosshairsColor: '#AA55AA',
	    			padding: { left: 15, top: 30, right: 15, bottom: 0 },
	                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
	    			colorScheme: 'scheme05',
	                source: null,
	                xAxis:
	                    {
	                        dataField: 'company',
	                        labels: { 
	        					rotationPoint: 'topright',
	        					angle: -45,
	        					offset: { x: 0, y: -15 }
	        				},
	        				gridLines: { 
	        					visible: true, 
	        					step: 99999
	        				}
	                    },
	                seriesGroups:
	                    [
	                        {
	                            type: 'column',
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $statsByVendorChart.jqxChart('source')[itemIndex];
	                      		   	var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br/>';
	                      		   	$.each(group.series, function(idx, value) {
	                      		   	  s += value.displayText + ' : ' + dataItem[value.dataField] + '(개)<br/>';
	                      		   	});
	                      		   	s + '</div>';
	                      		   	return s;
	             			    },
	             			   valueAxis:
		       	                {
             				   		minValue: 0,
	                                displayValueAxis: true,
	                                axisSize: 'auto',
	                                description: '개수',
	                                tickMarksColor: '#888888',
	                                alternatingBackgroundColor: '#E5E5E5',
	            					alternatingBackgroundColor2: '#F5F5F5',
	            					alternatingBackgroundOpacity: 0.5
		       	                },
	                            series: [
	                                    { dataField: 'sumCnt',	displayText: '단말수' }
	                                ]
	                        }
	                    ]
	            };
			$statsByVendorChart.jqxChart(vendorSettings);   
	    },		
	    
	    exportExcel: function() {
	    	var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
			var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
		
			var params = {
				grpNo: _grpNo,
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			};
			
			HmUtil.exportExcel(ctxPath + '/main/sms/perfNetwork/export.do', params);
		},

		fnLPAD: function(val,set,cnt) {
            if( !set || !cnt || val.length >= cnt){	
           	 return val; 
           }
            var max = (cnt - val.length)/set.length;
            for(var i = 0; i < max; i++){
                 val = set + val;
            }
            return val;
       },
		
		/** 초단위를  시간 단위로 변환 */
		convertHour: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			var pad = function(x) { return (x < 10) ? "0"+x : x; }
			cell += pad(parseInt(value / (60*60))) + "시간" +  pad(parseInt(value / 60 % 60)) + "분" + pad(value % 60)+"초";
		    cell += '</div>';
			return cell;
		},
		/** 초단위를  시간 단위로 변환 */
       convertUnitHour: function (value) {
			var pad = function(x) { return (x < 10) ? "0"+x : x; }
			var cell = pad(parseInt(value / (60*60))) + "시간" +  pad(parseInt(value / 60 % 60)) + "분" + pad(value % 60)+"초";
			return cell;
		},
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		}
		
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});