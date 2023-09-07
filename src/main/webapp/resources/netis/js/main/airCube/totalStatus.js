var timer;
var $todayChart,	 $weeklyChart,	$monthlyChart;
var weekOfMonth //이 달의 몇 째 주
var Main = {
		/** variable */
		initVariable: function() {
			$todayChart = $('#todayChart');
			$weeklyChart = $('#weeklyChart');
			$monthlyChart = $('#monthlyChart');
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
			}
		},
		
		/** init design */
		initDesign: function() {
			$("#cpuBar").jqxProgressBar({ width: 300, height: 30, showText : true });
			$("#memoryBar").jqxProgressBar({ width: 300, height: 30, showText : true });
			$("#diskBar").jqxProgressBar({ width: 300, height: 30, showText : true });

			//검색바호출.
			Master.createSearchBar2('',$("#cycleBox"),'','','','');

			//주기 바.
			Master.getProgressBar(Main.search);
			//30초 디폴트
			$('input:radio[name=cbRefreshCycle]').eq(2).attr("checked", true);
			//주기 클릭 이벤트
			$("input:radio[name=cbRefreshCycle]").click(function(){
				Main.chgRefreshCycle();
			});

			/*
                $('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
                $('#prgrsBar').on('complete', function(event) {
                    Main.search();
                    $(this).val(0);
                });
                $('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
                    source: [
                             { label: '30초', value: 30 },
                             { label: '20초', value: 20 },
                             { label: '10초', value: 10 }
                     ],
                    displayMember: 'label', valueMember: 'value', selectedIndex: 1
                })
                .on('change', function() {
                    Main.chgRefreshCycle();
                });
                */
			
			// 차트 그리기
			Main.drawChart();
			Main.search();
			
		},
		
		/** init data */
		initData: function() {
			Main.chgRefreshCycle();
		},
		
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $("input[name='cbRefreshCycle']:checked").val();
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
		},
		
		/** 조회 */
		search: function() {
   			// Server.get('/main/airCube/totalStatus/getTotalStatusList.do', {
			// 	data: null,
			// 	success: function(result) {
			// 		var data=result[0]
			// 		$('#totalCnt').html(data.totalCnt);
			// 		$('#successCnt').html(data.successCnt);
			// 		$('#failCnt').html(data.failCnt);
			// 		$('#cpuBar').val(data.cpuUser);
			// 		$('#memoryBar').val(data.memoryTotal);
			// 		$('#diskBar').val(data.diskRoot);
			// 	}
			// });
			//
 			// Server.get('/main/airCube/totalStatus/getTodayChart.do', {
			// 	data: null,
			// 	success: function(result) {
			// 		//alert(JSON.stringify(result));
			// 		$todayChart.jqxChart({ source: result });
			// 		$todayChart.jqxChart('update');
			// 	}
			// });
			//
			// Server.get('/main/airCube/totalStatus/getWeeklyChart.do', {
			// 	data: null,
			// 	success: function(result) {
			// 		$weeklyChart.jqxChart({ source: result });
			// 		$weeklyChart.jqxChart('update');
			// 	}
			// });
			//
			// Server.get('/main/airCube/totalStatus/getMonthlyChart.do', {
			// 	data: null,
			// 	success: function(result) {
			// 		$monthlyChart.jqxChart({ source: result });
			// 		$monthlyChart.jqxChart('update');
			// 	}
			// });

		},
        
        /** 차트 그리기 */
		drawChart: function() {
			
		/*==========================================================		
					금일 인증 추이 차트 그리기	
		===========================================================*/
			var today = new Date(); // 날자 변수 선언
            var dateNow = Main.fnLPAD(String(today.getDate()),"0",2); //일자를 구함
            var monthNow = Main.fnLPAD(String((today.getMonth()+1)),"0",2); // 월(month)을 구함
            var YearNow = String(today.getFullYear()); // 월(year)을 구함
            
            today =YearNow+monthNow+dateNow;
            var d = new Date( today.substring(0,4), parseInt(today.substring(4,6))-1, today.substring(6,8) );
            var fd = new Date( today.substring(0,4), parseInt(today.substring(4,6))-1, 1 );
            weekOfMonth=Math.ceil((parseInt(today.substring(6,8))+fd.getDay())/7);
            
            var day=dateNow + "일";
            var week=monthNow +  "월 "+weekOfMonth + "번째 주";
            var month=YearNow+"년 "+monthNow +  "월 ";
            
			var todaySettings = {
					title : "금일 인증 추이",
					description : day,
	                enableAnimations: true,
	                showLegend: true,
	                padding: { left: 5, top: 5, right: 5, bottom: 5 },
	                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
	                source: null,
	                xAxis:
	                    {
	                        dataField: 'timestamp',
	                        showGridLines: true
	                    },
	                colorScheme: 'scheme01',
	                seriesGroups:
	                    [
	                        {
	                            type: 'column',
	                            seriesGapPercent: 0,
	                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
	                            	var dataItem = $todayChart.jqxChart('source')[itemIndex];
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
	                                description: '개수(건)',
	                                axisSize: 'auto',
	                                tickMarksColor: '#888888'
		       	                },
	                            series: [
	                                    { dataField: 'successCnt',	displayText: '인증성공' },
	                                    { dataField: 'failCnt',			displayText: '인증실패' }
	                                ]
	                        }
	                    ]
	            };
	            $todayChart.jqxChart(todaySettings);
	            
		/*=============================================================
			            	주간 인증 추이 차트 그리기	
		 ============================================================*/
				var weeklySettings = {
						title : "주간 인증 추이",
						description : week,
		                enableAnimations: true,
		                showLegend: true,
		                padding: { left: 5, top: 5, right: 5, bottom: 5 },
		                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
		                source: null,
		                xAxis:
		                    {
		                        dataField: 'timestamp',
		                        showGridLines: true
		                    },
		                colorScheme: 'scheme01',
		                seriesGroups:
		                    [
		                        {
		                            type: 'column',
		                            seriesGapPercent: 0,
		                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
		                            	var dataItem = $todayChart.jqxChart('source')[itemIndex];
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
		                                description: '개수(건)',
		                                axisSize: 'auto',
		                                tickMarksColor: '#888888'
			       	                },
		                            series: [
		                                    { dataField: 'successCnt',	displayText: '인증성공' },
		                                    { dataField: 'failCnt',			displayText: '인증실패' }
		                                ]
		                        }
		                    ]
		            };
				$weeklyChart.jqxChart(weeklySettings);            
		          
		/*=============================================================
			            	월간 인증 추이 차트 그리기	
		 ============================================================*/

				var monthlySettings = {
						title : "월간 인증 추이",
						description : month,
		                enableAnimations: true,
		                showLegend: true,
		                padding: { left: 5, top: 5, right: 5, bottom: 5 },
		                titlePadding: { left: 10, top: 0, right: 10, bottom: 10 },
		                source: null,
		                xAxis:
		                    {
		                        dataField: 'timestamp',
		                        showGridLines: true
		                    },
		                colorScheme: 'scheme01',
		                seriesGroups:
		                    [
		                        {
		                            type: 'column',
		                            seriesGapPercent: 0,
		                            toolTipFormatFunction: function(value, itemIndex, series, group, categoryValue, categoryAxis) {
		                            	var dataItem = $todayChart.jqxChart('source')[itemIndex];
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
		                                description: '개수(건)',
		                                axisSize: 'auto',
		                                tickMarksColor: '#888888'
			       	                },
		                            series: [
		                                    { dataField: 'successCnt',	displayText: '인증성공' },
		                                    { dataField: 'failCnt',			displayText: '인증실패' }
		                                ]
		                        }
		                    ]
		            };
				$monthlyChart.jqxChart(monthlySettings);            	            
	            
			
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
       }
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});