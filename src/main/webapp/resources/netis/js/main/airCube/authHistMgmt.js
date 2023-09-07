var $authChart, $causeChart,$hourlyAuthChart;
var $logGrid, $successGrid, $failGrid;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$authChart = $('#authChart') , $causeChart = $('#causeChart'), $hourlyAuthChart = $('#hourlyAuthChart');
			$logGrid = $('#logGrid'), $successGrid = $('#successGrid'), $failGrid = $('#failGrid') ;
			$cbPeriod = $('#cbPeriod');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createPeriod('');
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
			case "btnDtlSearch": this.searchChart(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
            
			HmDate.create($('#sDate1'), $('#sDate2'), HmDate.HOUR, 1);

			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '70%', collapsible: false }, { size: '30%' }], 'auto', '100%');
			HmJqxSplitter.create($('#l_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // 인증로그
						HmGrid.create($logGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData : function(data) {
											var toMonth = $.format.date($('#sDate2').val("date"), 'M');
											var fromMonth = $.format.date($('#sDate1').val("date"), 'M');
											var cnt =parseInt(toMonth);
											var tableCnts=[];
											if((fromMonth-toMonth)>0){
												fromMonth =-(12-fromMonth);
											}
											var size = toMonth - fromMonth;
											var list=['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
												for(var i=cnt ; i >= (cnt-size) ; i--){
													if(i<=0){
														tableCnts.push(list[11+i]);
													}else{
														tableCnts.push(list[i-1]);
													}
												}
											$.extend(data, Main.getCommParams());
											if(size==0){
												$.extend(data, {
													tableCnt1: tableCnts[0]
												});
											}else if (size==1) {
												$.extend(data, {
													tableCnt1: tableCnts[0],
													tableCnt2: tableCnts[1]
												});
											}else if (size==2) {
												$.extend(data, {
													tableCnt1: tableCnts[0],
													tableCnt2: tableCnts[1],
													tableCnt3: tableCnts[2]
												});
											}else {
												$.extend(data, {
													tableCnt1: tableCnts[0],
													tableCnt2: tableCnts[1],
													tableCnt3: tableCnts[2],
													tableCnt4: tableCnts[3]
												});
											}
											return data;
										}
									}
							),
							columns: 
							[
								{ text : 'ID', datafield : 'userName', width: 150 },
								{ text : '이름', datafield : 'userRealName', width: 130 },
								{ text : 'MAC', datafield : 'callingStationId', width: 130 },
								{ text : '인증방식', datafield : 'authType', width: 150  },
								{ text : '접속시간', datafield : 'timestamp',  width: 130 },
								{ text : '장비IP', datafield : 'nasIpAddress', width: 130 },
								{ text : '결과', datafield : 'result', width: 100 },
								{ text : '실패사유', datafield: 'cause', minwidth: 200 },
								{ text : '소속', datafield: 'deptName', width: 100 }
						    ]
						});	
						break;
						
					case 1: // 최근 성공 단말
						HmGrid.create($successGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url:ctxPath + '/main/airCube/authHistMgmt/getSuccessList.do'
									},
									{
										formatData : function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							columns: 
							[
								{ text : '접속시간', datafield : 'timestamp', width: 130 },
								{ text : 'ID', datafield : 'userName', width: 130 },
								{ text : '이름', datafield : 'userRealName', width: 130 },
								{ text : 'MAC', datafield : 'callingStationId', width: 130 },
								{ text : '인증방식', datafield : 'authType', minwidth: 150  },
								{ text : '장비IP', datafield : 'nasIpAddress', width: 130 },
								{ text : '소속', datafield: 'deptName', width: 100 }
						    ]
						});
						break;
						
					case 2: //최근 실패 단말
						HmGrid.create($failGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url:ctxPath + '/main/airCube/authHistMgmt/getFailList.do'
									},
									{
										formatData : function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							columns: 
							[
								{ text : '접속시간', datafield : 'timestamp', width: 130 },
								{ text : 'ID', datafield : 'userName', width: 130 },
								{ text : '이름', datafield : 'userRealName', width: 130 },
								{ text : 'MAC', datafield : 'callingStationId', width: 130 },
								{ text : '장비IP', datafield : 'nasIpAddress', width: 130 },
								{ text : '소속', datafield: 'deptName', width: 100 },
								{ text : '사유', datafield : 'cause', minwidth: 200 }
						    ]
						});
						break;
					}
				}
			});

			// 차트 그리기
			Main.drawChart();
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
			},HmBoxCondition.getPeriodParams());
			return params;
		},
		/** 그리드 조회 */
		search : function() {
			// var fromDate = $('#date1').val('date').getTime() / 1000;
			// var toDate = $('#date2').val('date').getTime() / 1000;
			// var gap = toDate - fromDate;  //seconds
			// if((gap / (24 * 60 * 60)) > 90) {
			// 	alert("조회기간은 90일을 넘을 수 없습니다.");
			// 	return;
			// }
			// switch($('#mainTab').val()) {
			// case 0: HmGrid.updateBoundData($logGrid, ctxPath + '/main/airCube/authHistMgmt/getAuthLogList.do' ); break;
			// case 1: HmGrid.updateBoundData($successGrid, ctxPath + '/main/airCube/authHistMgmt/getSuccessList.do' ); break;
			// case 2: HmGrid.updateBoundData($failGrid, ctxPath + '/main/airCube/authHistMgmt/getFailList.do' ); break;
			// }
			// Main.searchChart();
		},
		
		/** 인증내역 사용량 차트 */
		searchChart: function(){
			// 인증 내역 챠트
			Server.get('/main/airCube/authHistMgmt/getAuthHistChart.do', {
				data: Main.getCommParams(),
				success: function(result) {
					$authChart.jqxChart({ source: result });
					$authChart.jqxChart('update');
				}
			});
			// 실패 원인 챠트
			Server.get('/main/airCube/authHistMgmt/getCauseChart.do', {
				data: Main.getCommParams(),
				success: function(result) {
					$causeChart.jqxChart({ source: result });
					$causeChart.jqxChart('update');
				}
			});	
			// 시간별 인증 챠트
			Server.get('/main/airCube/authHistMgmt/getHourlyAuthChart.do', {
				data: Main.getCommParams(),
				success: function(result) {
					$hourlyAuthChart.jqxChart({ source: result });
					$hourlyAuthChart.jqxChart('update');
				}
			});	
		},
		
		/** 차트 그리기 */
		drawChart: function() {
			//인증 카운트  챠트 그리기		
			//기존 차트 지우기 
			$authChart.jqxChart({ source: null });

			var monthlySettings = {
					title : "인증내역 (30일)",
					description: null,
					enableAnimations: true,
					showLegend: true,
					showBorderLine: false,
					enableCrosshairs: true,
					crosshairsColor: '#AA55AA',
					padding: { left: 15, top: 30, right: 15, bottom: 0 },
					colorScheme: 'scheme01',
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
	                seriesGroups:
	                    [
	                        {
	                            type: 'column',
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
			
			
			//실패 원인 원형 챠트 그리기
			//기존 차트 지우기 
			$causeChart.jqxChart({ source: null });
			var toDate;
			var fromDate;
			var today = new Date(); // 날자 변수 선언
            var dateNow = Main.fnLPAD(String(today.getDate()),"0",2); //일자를 구함
            var monthNow = Main.fnLPAD(String((today.getMonth()+1)),"0",2); // 월(month)을 구함
            var YearNow = String(today.getFullYear()); // 월(year)을 구함
            
            toDate =YearNow+ "-" +monthNow+ "-" +dateNow;
            
            today.setDate(today.getDate() - 30); //오늘 날짜에서 days만큼을 뒤로 이동 
		    var yy = today.getFullYear();
		    var mm = today.getMonth()+1;
		    var dd = today.getDate();
		    if( mm<10) mm="0"+mm;
		    if( dd<10) dd="0"+dd;
		    fromDate= yy + "-" + mm + "-" + dd;
			$("#title").html( "사용자 전체 통계("+fromDate+"~"+toDate +")" );
			 var settings = {
		                title: "실패 원인",
		                description: null,
		                enableAnimations: true,
		                showLegend: true,
		                showBorderLine: true,
		                legendPosition: { left: 520, top: 140, width: 100, height: 100 },
		                padding: { left: 15, top: 10, right: 15, bottom: 0 },
		                source: null,
		                colorScheme: 'scheme04',
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
		                                        labelRadius: 120,
		                                        initialAngle: 15,
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
			
			 //시간별 인증 막대 챠트 그리기
			//기존 차트 지우기 
			$hourlyAuthChart.jqxChart({ source: null });
			var monthlySettings = {
					title:  "시간별 인증 상태",
					description : null,
					enableAnimations: true,
					showLegend: true,
					showBorderLine: true,
					enableCrosshairs: true,
					crosshairsColor: '#AA55AA',
					padding: { left: 15, top: 10, right: 15, bottom: 0 },
					colorScheme: 'scheme01',
	                xAxis:
	                    {
	                        dataField: 'timestamp'
	                    },
	                seriesGroups:
	                    [
	                        {
	                            type: 'column',
	                            orientation: 'horizontal', // render values on X-axis
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $hourlyAuthChart.jqxChart('source')[itemIndex];
	                      		   	var s = '<div style="text-align: left;"><b>' +  $.format.date(categoryValue, 'yyyy-MM-dd') + '시</b><br/>';
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
	                                description: null,
	                                axisSize: 'auto',
	                                tickMarksColor: '#888888',
	                                alternatingBackgroundColor: '#E5E5E5',
	            					alternatingBackgroundColor2: '#F5F5F5',
	            					alternatingBackgroundOpacity: 0.5,
	                                formatFunction: function (value, itemIndex, serie, group) {
	                                	 return HmUtil.commaNum(value);
	                                }
		       	                },
	                            series: [
	                                     { dataField: 'successNo',	displayText: '성공' },
		                                 { dataField: 'failNo',			displayText: '실패' }
	                                     ]
	                        }
	                    ]
	            };
			$hourlyAuthChart.jqxChart(monthlySettings);   
	    },		
	    
	    exportExcel: function() {
	    	var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
			var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
		
			var params = {
				grpNo: _grpNo,
				date1: HmDate.getDateStr($('#sDate1')),
				time1: HmDate.getTimeStr($('#sDate1')),
				date2: HmDate.getDateStr($('#sDate2')),
				time2: HmDate.getTimeStr($('#sDate2'))
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