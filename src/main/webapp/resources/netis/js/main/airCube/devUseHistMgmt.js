var $authHistGrid;
var $usageChart;
var $useTimeChart;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$authHistGrid = $('#authHistGrid');
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
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
			Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
			HmDate.create($('#date1'), $('#date2'), HmDate.HOUR, 1);
			$('#chartTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {}
			});

			HmGrid.create($authHistGrid, {
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
					{ text : '장비IP', datafield : 'nasIpAddress', width: 130 },
					{ text : '설치위치', datafield : 'locationId', width: 130},
					{ text : '장비모델', datafield : 'nasModel', minwidth: 150, filtertype: 'checkedlist'},
					{ text : 'UP', datafield: 'inOctet', width: 120 , cellsrenderer: HmGrid.unit1024renderer},
					{ text : 'DOWN', datafield: 'outOctet', width: 120 , cellsrenderer: HmGrid.unit1024renderer},
					{ text : '사용시간', datafield : 'sessionTime', width: 130, cellsrenderer: Main.convertHour },
					{ text : '시작시간', datafield : 'startTime', width: 130 },
					{ text : '종료시간', datafield : 'endTime', width: 130 },
					{ text : 'Secret Key', datafield : 'secretKey', width: 120},
					{ text : '장비벤더', datafield : 'vendorCode', width: 120, filtertype: 'checkedlist' },
					{ text : '장비종류', datafield : 'nasType', width: 120, filtertype: 'checkedlist' },
					{ text : '유무선 설정', datafield : 'isWireless', width: 120 },
					{ text : 'NAS 속성', datafield : 'attrNasPolicyName', width: 120 }
			    ]
			});	
			
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
			// HmGrid.updateBoundData($authHistGrid, ctxPath + '/main/airCube/devUseHistMgmt/getDevUseList.do' );
			// Main.searchChart();
		},
		/**   상세 챠트 조회 */
		searchChart: function() {
			switch($('#chartTab').val()) {
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
		/** 차트 그리기 */
		drawChart: function() {
			//기존 차트 지우기 
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
	    },
	    exportExcel: function() {
			var params = {
				date1: HmDate.getDateStr($('#date1')),
				time1: HmDate.getTimeStr($('#date1')),
				date2: HmDate.getDateStr($('#date2')),
				time2: HmDate.getTimeStr($('#date2'))
			};
			
			HmUtil.exportExcel(ctxPath + '/main/sms/perfNetwork/export.do', params);
		},
		
		/** 초 단위를  시간 단위로 변환 */
		convertHour: function (row, column, value) {
			var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
			var pad = function(x) { return (x < 10) ? "0"+x : x; }
			cell += pad(parseInt(value / (60*60))) + "시간 " +  pad(parseInt(value / 60 % 60)) + "분 " + pad(value % 60)+ "초" ;
		    cell += '</div>';
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