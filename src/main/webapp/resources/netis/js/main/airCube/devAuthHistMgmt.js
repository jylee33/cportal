var $authHistGrid;
var $authChart;
var $cbPeriod;
var Main = {
		/** variable */
		initVariable : function() {
			$authHistGrid = $('#authHistGrid');
			$authChart = $('#authChart');
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
					{ text : '설치위치', datafield : 'locationName', width: 130},
					{ text : '장비모델', datafield : 'nasModel', minwidth: 80, filtertype: 'checkedlist'},
					{ text : '인증성공횟수', datafield : 'successNo', width: 100  ,cellsalign: 'right'},
					{ text : '인증실패횟수', datafield : 'failNo', width: 100  ,cellsalign: 'right'},
					{ text : '접속날짜', datafield : 'timestamp', width: 130 },
					{ text : 'Secret Key', datafield : 'secretKey', width: 130 },
					{ text : '장비벤더', datafield : 'vendorCode', width: 130, filtertype: 'checkedlist'},
					{ text : '장비종류', datafield : 'nasType', width: 120, filtertype: 'checkedlist'},
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
			// HmGrid.updateBoundData($authHistGrid, ctxPath + '/main/airCube/devAuthHistMgmt/getDevAuthList.do' );
			// Main.searchChart();
		},
	
		/**   인증내역(30일) 차트 조회 */
		searchChart: function() {
			Server.get('/main/airCube/authHistMgmt/getAuthHistChart.do', {
				data: Main.getCommParams(),
				success: function(result) {
					$authChart.jqxChart({ source: result });
					$authChart.jqxChart('update');
				}
			});
		},	
		/** 차트 그리기 */
		drawChart: function() {
			//기존 차트 지우기 
			$authChart.jqxChart({ source: null });

			var monthlySettings = {
					title : "인증내역(30일)",
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