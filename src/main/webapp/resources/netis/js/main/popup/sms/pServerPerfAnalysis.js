var $processGrid;
var $cbPeriod;
var $chart_xAxis;

var Popup = {
	/** variable */
	initVariable : function() {
		$processGrid = $('#processGrid');
		$cbPeriod = $('#cbPeriod');
		$chart_xAxis = null;
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
		
		// layout
		$('#p_hsplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', panels: [{size: '50%'}, {size: '50%'}] });
		
		Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));
		
		var source =  new $.jqx.dataAdapter({ 
				datatype : 'json', 
			}, { 
				formatData : function(data) {
                    var dateStr = 'N/A';
                    if ($chart_xAxis !== undefined && $chart_xAxis !== null) {
                        if ($chart_xAxis.length === 14) {
                            dateStr = $chart_xAxis.substring(0, 4) + '-' + $chart_xAxis.substring(4, 6) + '-' + $chart_xAxis.substring(6, 8) + ' ' + $chart_xAxis.substring(8, 10) + ':' + $chart_xAxis.substring(10, 12);
                        } else {
                            dateStr = $chart_xAxis;
                        }
                    }
                    $('#netGridDateStr').text(dateStr);

					var param = {
            				ymdhms : $chart_xAxis
            		};
					$.extend(data, Popup.getCommParams());
					$.extend(data, param);
					return data;
				} 
			}
		);
		
		HmGrid.create($processGrid, {
			source : source,
			columns : [ 
					//{ text : '일시', datafield : 'ymdhms', width : 140, cellsalign: 'center'  },
					{ text : '프로세스명', datafield : 'name', minwidth : 150  },
					{ text : 'PID', datafield : 'pid', width : 50 },
					{ text : '평균', datafield : 'cpuPct', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'cpu'},
					{ text : '최대', datafield : 'cpuPctMax', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'cpu'},
					{ text : '최소', datafield : 'cpuPctMin', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'cpu'},
					{ text : '평균', datafield : 'memPct', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'mem'},
					{ text : '최대', datafield : 'memPctMax', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'mem'},
					{ text : '최소', datafield : 'memPctMin', width : 60, align:'center',cellsrenderer: HmGrid.progressbarrenderer, columngroup: 'mem'},
					{ text : '평균', datafield : 'memRss', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
					{ text : '최대', datafield : 'memRssMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
					{ text : '최소', datafield : 'memRssMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'rssMem' },
					{ text : '평균', datafield : 'memShare', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
					{ text : '최대', datafield : 'memShareMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
					{ text : '최소', datafield : 'memShareMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'shareMem' },
					{ text : '평균', datafield : 'memSize', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
					{ text : '최대', datafield : 'memSizeMax', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
					{ text : '최소', datafield : 'memSizeMin', width : 70, cellsrenderer: HmGrid.unit1024renderer, columngroup: 'memSize' },
					{ text : '사용자명', datafield : 'username', width : 100 },
					{ text : '상태', datafield : 'state', width : 80, cellsalign: 'center' },
					{ text : '실행 시간', datafield : 'startTime', width : 160, cellsalign: 'center' },
					{ text : 'CMD', datafield : 'cmdline', width : 500 } 
			] ,
            columngroups:
                [
                    { text: 'CPU', align: 'center', name: 'cpu'},
                    { text: 'Memory(%)', align: 'center', name: 'mem'},
                    { text: 'RSS Memory', align: 'center', name: 'rssMem'},
                    { text: 'Share Memory', align: 'center', name: 'shareMem'},
                    { text: 'Memory', align: 'center', name: 'memSize'}
                ]
		});

		
	},

	/** init data */
	initData : function() {
		this.search(); 
	},

	/** 공통 파라미터 */
	getCommParams: function() {
		var params = {};
		$.extend(params, {
			period: $cbPeriod.val(),
			date1: HmDate.getDateStr($('#date1')),
			time1: HmDate.getTimeStr($('#date1')),
			date2: HmDate.getDateStr($('#date2')),
			time2: HmDate.getTimeStr($('#date2')),
			mngNo: $('#pMngNo').val()
		});
		return params;
	},
	
	search : function(){
		Master.refreshCbPeriod($cbPeriod);

		$chart_xAxis = null;
		Popup.searchChart();
		
	},
	
	/**
	 * 날짜 변환. Highchart 에서 사용하는 형태로 변경. (String -> Date.UTC)
	 * @param val : 날짜 형태가 (YYYY-MM-DD HH:mm:ss 형태거나 구분자 없는것만 체크)
	 */
	setting_dt_convert : function(val){
		var rtnTxt = val;
		// "20170317091210"
		if(val!=null){
			var tem_dt = Popup.change_date(val);
			var yyyy = tem_dt.getFullYear();
			var mm = tem_dt.getMonth();
			var dd = tem_dt.getDate();
			var hh = tem_dt.getHours();
			var ii = tem_dt.getMinutes();
			var ss = tem_dt.getSeconds();

			rtnTxt = Date.UTC(yyyy,mm,dd,hh,ii,ss);
		}
		return rtnTxt;
	},
	
	/**
	 * 날짜 변환. (String -> Date)
	 * @param val : 날짜 형태가 (YYYY-MM-DD HH:mm:ss 형태거나 구분자 없는것만 체크)
	 */
	change_date : function(val){
		var dd = new Date();
		
		var chgVal = val.replace(/-/gi, "");
		chgVal = chgVal.replace(/:/gi, "");
		chgVal = chgVal.replace(/ /gi, "");
		
		var yyyy = chgVal.substr(0,4);
		var mm = chgVal.substr(4,2)-1;
		var dd = chgVal.substr(6,2);
		var hh = chgVal.substr(8,2);
		var mi = chgVal.substr(10,2);
		var ss = chgVal.substr(12,2);
		return new Date(yyyy,mm,dd,hh,mi,ss);
	},
	

	/**
	 * 날짜 세팅
	 * @author KangYS
	 * @param setDate : date() 형식의 데이터
	 * @param day_sp : 날짜 구분자
	 * @param dt_time_sp : 날짜_시간 사이 구분자
	 * @param time_sp : 시간 구분자
	 * @param misecFlag : millisecond 표시 여부, true 일시 리턴 데이터에 추가
	 * @returns {String}
	 */
	getConvertTime : function (setDate, day_sp, dt_time_sp, time_sp, misecFlag, misec_sp){ // 현재시간 가져오기
		var dat_split = "", dt_time_split="_", time_split=""; misec_split="  ";
		
		try{ 
			if(day_sp!=null) dat_split = day_sp; 
		} catch(e){ 
		}
		try{ 
			if(dt_time_sp!=null) dt_time_split = dt_time_sp; 
		} catch(e){ 
		}
		try{
			if(time_sp!=null) time_split = time_sp; 
		} catch(e){ 
		}
		try{
			if(misec_sp!=null) misec_split = misec_sp; 
		} catch(e){ }
		
		var now = setDate;
		var year = now.getFullYear();
		
		var month = now.getMonth()+1;
		if((month+"").length<2) month="0"+month;
		
		var now_date = now.getDate();
		if((now_date+"").length<2) now_date="0"+now_date;
		
		var now_hour = now.getHours();
		if((now_hour+"").length<2) now_hour="0"+now_hour;
		var now_min = now.getMinutes();
		if((now_min+"").length<2) now_min="0"+now_min;
		var now_sec = now.getSeconds();
		if((now_sec+"").length<2) now_sec="0"+now_sec;
		
		var now_time = year+dat_split+month+dat_split+now_date
					+dt_time_split+now_hour+time_split+now_min+time_split+now_sec;
		
		if(misecFlag==true){
			
			now_time += misec_split + now.getMilliseconds(); 
		}
		
		return now_time;
	},
	
	searchChart : function(){
		$("#chartContainer")[0].innerHTML= '';
		
		Server.post("/main/popup/ServerPerfAnalysis/getChartList.do", {
			data: Popup.getCommParams(),
			success: function(result) {

				if(result!=null){
					var xAxis = result.xdata;

					console.log(result);
					$.each(result.datasets, function (i, dataset) {
				        // Add X values
						/*
				        dataset.data = Highcharts.map(dataset.data, function (val, j) {
				        	var tmp = new Date();
				        	tmp.setTime(Popup.setting_dt_convert(xAxis[j]));
//				        	console.log(xAxis[j] + " / " + tmp);
				            return [Popup.setting_dt_convert(xAxis[j]), val];
				        });
				        */
						
				        dataset.data = Highcharts.map(dataset.data, function (val, j) {
	                        var returnArray = [];
                            returnArray = [HmHighchart.change_date(xAxis[j]).getTime(), val];
	                        return returnArray;
	                    });

				        var series = [{
				        	connectNulls: true,
		                    data: dataset.data,
		                    name: dataset.name,
		                    type: dataset.type,
		                    color: Highcharts.getOptions().colors[i],
		                    fillOpacity: 0.3
//		                    tooltip: {
//		                        valueSuffix: ' ' + dataset.unit
//		                    }
		                }];
				        var title_name = dataset.name;
				        var tooltip_valueDecimals = dataset.valueDecimals;
				        
				        var chartOptions = {
				                chart: {
//				                    marginLeft: 40, // Keep all charts left aligned
				                    spacingTop: 10,
				                    spacingBottom: 10,
				                    height: 300
				                },
				                title: {
				                    text: title_name,
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
				                    events: {
				                        setExtremes: syncExtremes
				                    },
				                    type: 'datetime',
				                    dateTimeLabelFormats: { 
				                        second: '%m-%d %H:%M:%S',
				                        minute: '%m-%d %H:%M',
				                        hour: '%m-%d %H:%M',
				                        day: '%m-%d',
				                        week: 'Week from %A, %b %e, %Y',
				                        month: '%Y %m',
				                        year: '%Y'
				    		        }
				                },
				                yAxis: {
				                    title: {
				                        text: null
				                    },
                                    labels: {
                                        formatter: function () {
                                            if($('#gSiteName').val()=='Samsung')
                                                return this.value + ' %';
                                            else
                                                return this.value;
                                        }
                                    }
				                },
				                plotOptions: {
				                    series: {
//				                        compare: 'percent',
				                        showInNavigator: true,
				                        events: {
					                    	click: function(e) {
					                    		var xAxis = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.point.category);
					                    		var chg_xAxis = Popup.getConvertTime( Popup.change_date(xAxis),"","","" );
					                    		$chart_xAxis = chg_xAxis;
					                    		// 해당 시간의 프로세스 리스트 조회
					                    		HmGrid.updateBoundData($processGrid, ctxPath + '/main/popup/ServerPerfAnalysis/getProcessList.do');
						                    }
					                    }
				                    },
//				                    point: {
//				                        events: {
//				                            mouseOver: function () {
//				                                Popup.syncTooltip(this.series.chart.container, this.x - 1);
//				                            }
//				                        }
//				                    }
				                },
				                tooltip: {
//				                    positioner: function () {
//				                        return {
//				                            x: this.chart.chartWidth - this.label.width, // right aligned
//				                            y: 10 // align to title
//				                        };
//				                    },
//				                    borderWidth: 0,
//				                    backgroundColor: 'none',
//				                    pointFormat: '{point.y}',
//				                    headerFormat: '',
//				                    shadow: false,
//				                    style: {
//				                        fontSize: '18px'
//				                    },
				                    valueDecimals: tooltip_valueDecimals,
				                    formatter: function () {
//				                    	var sName = this.series.name;
//				                    	if(sName == "CPU"){
//				                    		return this.y+"%";
//				                    	}
//				                    	var s = HmUtil.convertUnit1024(this.y);
//				                        return s;
				                    	
				                    	var valUnit = "";
				                    	var sName = this.series.name;
				                    	if(sName == "CPU"){
		                					valUnit = "%";
		                				}
		                            	var xVal = this.x;
		                            	var yVal = this.y;

		                    			var s = '<b>' + $.format.date(new Date(xVal), 'yyyy-MM-dd HH:mm') + '</b>';
		                    			
		                    			if(sName == "CPU"){
	                    					s += '<br/>' + sName + ': ' + (yVal)+valUnit;
	                    				}else{
	                    					s += '<br/>' + sName + ': ' + HmUtil.convertUnit1000(yVal)+valUnit;
	                    				}
		                    			
		                    			return s;
				                    },
				                },
				                series: series
				            };
				        
				        $('<div class="chart" id="chart_'+title_name+'">')
				            .appendTo('#chartContainer');
				        
				        // chart 생성
						HmHighchart.create2('chart_'+title_name, chartOptions);
				    });
				}
			}
		});
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