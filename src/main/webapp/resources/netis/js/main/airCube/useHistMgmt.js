var $useHistGrid;
var $usageChart;
var $useTimeChart;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$useHistGrid = $('#useHistGrid');
			$usageChart = $('#usageChart');
			$useTimeChart = $('#useTimeChart');
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
			case "btnSearch": this.search(); break;
			case "btnDtlSearch": this.searchChart(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#l_splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
           	Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
			HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 1);

			HmGrid.create($useHistGrid, {
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
				columns: 
				[
					{ text : '상태', datafield : 'acctStatus', width: 130 },
					{ text : 'ID', datafield : 'userName', width: 130},
					{ text : '이름', datafield : 'userRealName', width: 130 },
					{ text : 'IP', datafield : 'framedIpAddress', width: 130 },
					{ text : 'MAC', datafield : 'callingStationId', width: 150 },
					{ text : '장비IP', datafield : 'nasIpAddress', width: 130 },
					{ text : '시작시간', datafield : 'startTime', width: 130 },
					{ text : '종료시간', datafield : 'endTime', width: 130 },
					{ text : 'UP', datafield: 'inOctet', width: 130 , cellsrenderer: HmGrid.unit1024renderer},
					{ text : 'DOWN', datafield: 'outOctet', width: 130 , cellsrenderer: HmGrid.unit1024renderer},
					{ text : '소속', datafield: 'deptName', width: 100 },
					{ text : '사용자정책', datafield: 'userPolicyProfileName', minwidth: 80 }
			    ]
			});
			
			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case 0: // 사용량 차트
						$usageChart.jqxChart({ source: null });
						var monthlySettings = {
								title: "사용 내역 - 사용량(30일)",
								description : null,
				                enableAnimations: true,
				                showLegend: true,
				                showBorderLine: false,
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
				                            type: 'column',
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
						$usageChart.jqxChart(monthlySettings);   
						Main.search();
						break;
						
					case 1: // 사용시간 차트
						
						//기존 차트 지우기 
						$useTimeChart.jqxChart({ source: null });
						var monthlySettings = {
								title: "사용 내역- 시간(30일)",
								description : null,
				                enableAnimations: true,
				                showLegend: true,
				                padding: { left: 5, top: 5, right: 5, bottom: 5 },
				                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
				                source: null,
				                xAxis:
				                    {
				                        dataField: 'startTime',
				                        showGridLines: true
				                    },
				                colorScheme: 'scheme01',
				                seriesGroups:
				                    [
				                        {
				                            type: 'column',
				                            seriesGapPercent: 0,
				                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
				                            	var dataItem = $useTimeChart.jqxChart('source')[itemIndex];
				                      		   	var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br/>';
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
				                                description: '사용량(KB)',
				                                axisSize: 'auto',
				                                tickMarksColor: '#888888'
					       	                },
				                            series: [
				                                    { dataField: 'inOctet',	displayText: '업로드' },
				                                    { dataField: 'outOctet',	displayText: '다운로드' }
				                                ]
				                        }
				                    ]
				            };
						$useTimeChart.jqxChart(monthlySettings);   
					}
				}
			});	
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
			// HmGrid.updateBoundData($useHistGrid, ctxPath + '/main/airCube/useHistMgmt/getUseHistList.do' );
			// Main.searchChart();
		},
		/**   상세 챠트 조회 */
		searchChart: function() {
		
			switch($('#mainTab').val()) {
			case 0: // 사용내역
					Server.get('/main/airCube/useHistMgmt/getUsageChart.do', {
						data: Main.getCommParams(),
						success: function(result) {
							$usageChart.jqxChart({ source: result });
							$usageChart.jqxChart('update');
						}
					});
				break;
			case 1:  // 사용자관리
/*				Server.get('/main/airCube/useHistMgmt/getUseTimeChart.do', {
					data: Main.getCommParams(),
					success: function(result) {
						$useTimeChart.jqxChart({ source: result });
						$useTimeChart.jqxChart('update');
					}
				});*/
				break;
			};

		},
		

	    
	    exportExcel: function() {
	    	var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
			var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
		
			var params = {
				period: $cbPeriod.val(),
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			};
			
			HmUtil.exportExcel(ctxPath + '/main/sms/perfNetwork/export.do', params);
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