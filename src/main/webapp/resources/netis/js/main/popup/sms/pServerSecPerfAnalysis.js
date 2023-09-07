var $cpuChart, $memChart,
	cpuLastYmd = null, memLastYmd = null;

var Popup = {
	/** variable */
	initVariable : function() {
		$cbPeriod = $('#cbPeriod');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Popup.eventControl(event); });
		
		$('#chartContainer').bind('mousemove touchmove touchstart', function (e) {
		    var chart,
		        point,
		        i,
		        event;

		    for (i = 0; i < Highcharts.charts.length; i = i + 1) {
		        chart = Highcharts.charts[i];
		        event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
		        point = chart.series[0].searchPoint(event, true); // Get the hovered point

		        if (point) {
		            point.highlight(e);
		        }
		    }
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
		case "btnSearch": this.search(); break;
		case 'pbtnClose': self.close(); break;
		}
	},

	/** init design */
	initDesign : function() {
		Highcharts.setOptions({
			global: {
				useUTC: false
			},
			lang: {
				months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
				shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				weekdays: ['일', '월', '화', '수', '목', '금', '토'],
				noData: '조회된 데이터가 없습니다.'
			}
		});
		
		var options = {
				 chart: {
	                    spacingTop: 10,
	                    spacingBottom: 10,
	                    height: 300
	                },
	                title: {
	                    text: null,
	                    align: 'left',
	                    margin: 0,
	                    x: 30
	                },
	                credits: {
	                    enabled: false
	                },
	                legend: {
	                    enabled: false
	                },
	                xAxis: {
	                    crosshair: true,
//	                    events: {
//	                        setExtremes: syncExtremes
//	                    },
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
	                },
	                yAxis: {
	                    title: {
	                        text: null
	                    }
	                },
	                plotOptions: {
	                    series: {
	                        showInNavigator: true
	                    }
	                },
//	                tooltip: {
//	                    positioner: function () {
//	                        return {
//	                            x: this.chart.chartWidth - this.label.width, // right aligned
//	                            y: 10 // align to title
//	                        };
//	                    },
//	                    borderWidth: 0,
//	                    backgroundColor: 'none',
//	                    pointFormat: '{point.y}',
//	                    headerFormat: '',
//	                    shadow: false,
//	                    style: {
//	                        fontSize: '18px'
//	                    },
//	                    formatter: function () {
//                    		return this.y+"%";
//	                    },
//	                }
		};
		$.extend(true, options, {
			yAxis: {
				title: { text: 'CPU' }
			},
			series: [{ connectNulls: true, data: null, name: 'CPU', type: 'area', fillOpacity: 0.3 }]
		});
		$cpuChart = Highcharts.chart('p_cpuChart', options);
		$.extend(true, options, {
			yAxis: {
				title: { text: 'MEM' }
			},
			series: [{ connectNulls: true, data: null, name: 'MEM', type: 'area', fillOpacity: 0.3 }]
		});
		$memChart = Highcharts.chart('p_memChart', options);
	},

	/** init data */
	initData : function() {
		this.search(); 
	},

	/** 공통 파라미터 */
	getCommParams: function() {
		return {
			mngNo: $('#pMngNo').val(),
			reqType: 'ALL'
		}
	},
	
	search : function(){
		Popup.searchChart();
	},
		
	searchChart : function(){
		var respCnt = 2;
		
		Server.post("/main/popup/serverSecPerfAnalysis/getServerCpuSecPerfAnalysisList.do", {
			data: Popup.getCommParams(),
			success: function(result) {
				if(result != null) {
					var chartData = [];
					$.each(result, function(idx, item) {
						chartData.push([item.date, item.cpuUsedPct]);
					});
//					chartData = chartData.slice(chartData.length-10); //test
					cpuLastYmd = result[result.length-1].ymdhms;
					$cpuChart.series[0].update({ data: chartData });
					if(--respCnt ==0) Popup.startTimer();
				}
			}
		});
		
		Server.post("/main/popup/serverSecPerfAnalysis/getServerMemSecPerfAnalysisList.do", {
			data: Popup.getCommParams(),
			success: function(result) {
				if(result != null) {
					var chartData = [];
					$.each(result, function(idx, item) {
						chartData.push([item.date, item.memUsedPct]);
					});
					memLastYmd = result[result.length-1].ymdhms;
					$memChart.series[0].update({ data: chartData });
					if(--respCnt ==0) Popup.startTimer();
				}
			}
		});
//		
//		Server.post("/main/popup/serverSecPerfAnalysis/getServerSecPerfAnalysisList.do", {
//			data: Popup.getCommParams(),
//			success: function(result) {
//				if(result != null) {
//					var cpuData = [], memData = [];
//					$.each(result, function(idx, item) {
////						cpuData.push([item.date, item.cpuUsedPct]);
//						memData.push([item.date, item.memUsedPct]);
//					});
//					$cpuChart.series[0].update({ data: cpuData });
//					$memChart.series[0].update({ data: memData });
//					
//					setTimeout(Popup.startTimer(), 3000);
//				}
//			}
//		});
	},
	
	startTimer: function() {
		setInterval(function() {
			Popup.searchLast();
		}, 1000);
	},
	
	searchLast: function() {
		console.log({ mngNo: $('#pMngNo').val(), reqType: 'LAST', date1: cpuLastYmd.substring(0, 8), time1: cpuLastYmd.substring(8) });
		Server.post("/main/popup/serverSecPerfAnalysis/getServerCpuSecPerfAnalysisList.do", {
			data: { mngNo: $('#pMngNo').val(), reqType: 'LAST', date1: cpuLastYmd.substring(0, 8), time1: cpuLastYmd.substring(8) },
			success: function(result) {
				if(result != null && result.length > 0) {
					var chartData = [];
					$.each(result, function(idx, item) {
						$cpuChart.series[0].addPoint([item.date, item.cpuUsedPct], false);
						$cpuChart.series[0].data[0].remove(false);
					});
					cpuLastYmd = result[result.length-1].ymdhms;
					$cpuChart.redraw();
				}
			}
		});
		
		Server.post("/main/popup/serverSecPerfAnalysis/getServerMemSecPerfAnalysisList.do", {
			data: { mngNo: $('#pMngNo').val(), reqType: 'LAST', date1: memLastYmd.substring(0, 8), time1: memLastYmd.substring(8) },
			success: function(result) {
				if(result != null && result.length > 0) {
					var chartData = [];
					$.each(result, function(idx, item) {
						$memChart.series[0].addPoint([item.date, item.memUsedPct], false);
						$memChart.series[0].data[0].remove(false);
					});
					memLastYmd = result[result.length-1].ymdhms;
					$memChart.redraw();
				}
			}
		});
		
//		var cpuData = [new Date().getTime(), Math.ceil(Math.random() * 100)];
//		$cpuChart.series[0].addPoint(cpuData, false);
//		$cpuChart.series[0].data[0].remove(false);
//		$cpuChart.redraw();
	}

};

/**
 * Override the reset function, we don't need to hide the tooltips and crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}


$(function() {
	Popup.initVariable();
	Popup.observe();
	
	Popup.initDesign();
	Popup.initData();
});