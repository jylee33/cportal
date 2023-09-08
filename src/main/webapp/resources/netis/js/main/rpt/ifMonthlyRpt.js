var $periodChart, $monthChart, $yearChart;
var period_data, month_data, year_data;


var rraDataObjList = [], rraDataObj;

var Main = {
    /** variable */
    initVariable: function () {
        $periodChart = $('#periodChart');
        $monthChart = $('#monthChart');
        $yearChart = $('#yearChart');
    },

    /** add event */
    observe: function () {
    	$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });

        $(window).bind('resize', function(event) {
        	$periodChart.highcharts().reflow();
            $monthChart.highcharts().reflow();
            $yearChart.highcharts().reflow();
		});

    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch": this.search(); break;
            case "btnExcel": this.exportExcel(); break;
            case "btnCList_period": this.openChartData(1); break;
            case "btnCList_quarter": this.openChartData(2); break;
            case "btnCList_year": this.openChartData(3); break;
        }
    },
    
    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {
    	HmWindow.create($('#p2window'));
    	
    	$('#mainSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', panels: [ { size: '33%' }, { size: '67%' } ] });
    	$('#subSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'horizontal', panels: [ { size: '50%' }, { size: '50%' } ] });
    	
    	$('#basicSp1').jqxSplitter({
            width: '100%',
            height: '100%',
            theme: jqxTheme,
            orientation: 'vertical',
            // showSplitBar: false,
            splitBarSize: 0.5,
            panels: [{size: '67%'}, {size: '33%'}]
        });

    	$('#basicSp2').jqxSplitter({
            width: '100%',
            height: '100%',
            theme: jqxTheme,
            orientation: 'vertical',
            // showSplitBar: false,
            splitBarSize: 0.5,
            panels: [{size: '67%'}, {size: '33%'}]
        });

    	$('#basicSp3').jqxSplitter({
            width: '100%',
            height: '100%',
            theme: jqxTheme,
            orientation: 'vertical',
            // showSplitBar: false,
            splitBarSize: 0.5,
            panels: [{size: '67%'}, {size: '33%'}]
        });
    	
    	/** ======== 조회조건 설정 START ========= */
    	// 그룹
		HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_IF, 200, 22, 300, 350, Main.searchIfCond);

        // 회선
		$('#ddbIf').jqxDropDownButton({ width: 220, height: 22, theme:jqxTheme })
        .on('open', function(event) {
            $('#ifGrid').css('display', 'block');
        });
		setTimeout(function(){
            $('#ifGrid').css('display', 'block');
		}, 300);
		var nonSelected = '<div style="position: relative; margin-left: 3px; margin-top: 4px;">' + '선택해주세요' + '</div>'; 
    	$("#ddbIf").jqxDropDownButton('setContent', nonSelected);
    	
        HmGrid.create($('#ifGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/line/getLineListForIfGrp.do'
                },
                {
                    formatData: function(data) {
                        var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
                        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
//                        var devSelection = $('#devGrid').jqxGrid('getselectedrowindex');
//                        var devInfo = $('#devGrid').jqxGrid('getrowdata', devSelection);
//                        var _mngNo = -1;
//                        if(devInfo!=null){
//                        	_mngNo = devInfo.mngNo;
//                        }
                        $.extend(data, {
                            isAll: false,
                            grpType: 'IF',
                            grpNo: _grpNo,
//                            mngNo: _mngNo
                        });
                        return data;
                    }
                }
            ),
            columns:
                [
                	{ text: '회선번호', datafield: 'ifIdx',  pinned: true, width: 80 },
					{ text: '장비명', datafield: 'disDevName',  pinned: true, width: 160 },
					{ text: '회선명', datafield: 'ifName',  pinned: true, minwidth: 160 },
					{ text: '회선별칭', datafield: 'ifAlias', width: 130 },
					{ text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer }
                ],
             width:650
        });
        $('#ifGrid').on('rowselect', function(event) {
            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
            if(rowdata!=null){
//            	console.log(rowdata);
            	var ifAlias = rowdata.ifAlias;
            	var ifName = rowdata.ifName;
            	var displayName = ifName;
            	if(ifAlias!=null && ifAlias!=""){
            		displayName = ifAlias;
            	}
            	var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + displayName + '</div>';
            	$('#ddbIf').jqxDropDownButton('setContent', content);
            	
            	var disDevName = rowdata.disDevName;
            	$("#disDevName").text(disDevName);
            	
            	var lineWidth = rowdata.lineWidth;
            	if(lineWidth!=null && lineWidth!=""){
            		lineWidth = HmUtil.convertUnit1000(lineWidth);
            	}
            	$("#lineWidth").text(lineWidth);
            }else{
            	// 데이터 없을시 표현,
            	$('#ddbIf').jqxDropDownButton('setContent', nonSelected);
            }
        }).on('bindingcomplete', function(event) {
        	$(this).jqxGrid('selectrow', 0);
        }).on('rowdoubleclick', function(event){
            $('#ddbIf').jqxDropDownButton('close');
        });
        
    	// 기간설정
        HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1);
        
        $('#date1, #date2').jqxDateTimeInput({
            width: '120px',
            height: '21px',
            formatString: 'yyyy-MM-dd HH',
            theme: jqxTheme
        });
        
        var source = {
            datatype: "json",
            url: ctxPath + '/main/env/optConf/getWorkTimeConfList.do',
            formatData: function (data) {
                $.extend(data, {isAll:'false'});
                return data;
            }
        };
        // 예외시간
        var dataAdapter = new $.jqx.dataAdapter(source);
        $('#cbTimeId').jqxDropDownList({
            selectedIndex: 0,
            source: dataAdapter,
            displayMember: "memo",
            valueMember: "codeId",
            theme: jqxTheme,
            width: 100,
            height: 21,
            placeHolder: '선택',
            autoDropDownHeight: true
        });
        
        // 기간그래프 대상설정 라디오박스
        $('#rdTbl1').jqxRadioButton({ width: 55, height: 21, checked: true });
		$('#rdTbl2, #rdTbl3').jqxRadioButton({ width: 70, height: 21 });
		
        //휴일 공휴일 업무시간 체크박스
        $('#ckDayOff, #ckHoliday, #ckWorktime').jqxCheckBox({width: 80, height: 22, checked: false});
        
        // 이용률/이용량
		var source = [{ label:"bps", value:'BPS'}, { label:"bps%", value:'BPSPER'}];
		$("#searchUnit").jqxDropDownList({width: 90, height: 21, theme: jqxTheme, autoDropDownHeight: true, source : source, selectedIndex:0});
		
        /** ======== 조회조건 설정 END ========= */
		
		var defaultSeriesArray = [
            {name: 'bps 입력(평균)', data: null, lineWidth: 0.5},
            {name: 'bps 출력(평균)', data: null, lineWidth: 0.5}
        ];
        var chartType = HmHighchart.TYPE_AREA;
        var itemType = $('#searchUnit').val();
        /** 기간단위 */
        Main.createDefaultHighChart('periodChart', defaultSeriesArray, '', itemType, chartType);
        /** 분기단위 */
        Main.createDefaultHighChart('monthChart', defaultSeriesArray, '', itemType, chartType);
        /** 년단위 */
        Main.createDefaultHighChart('yearChart', defaultSeriesArray, '', itemType, chartType);
    },

    /** init data */
    initData: function () {
    },

    /** 공통 파라미터 */
    getCommParams: function (val) {
//    	var $devSearchGrid = $('#devGrid');
//		var rowIdx = $('#devGrid').jqxGrid('getselectedrowindex');
//        if(rowIdx == -1){
//        	alert("장비를 선택해 주세요.");
//        	return;
//        }
//        var devInfo = $devSearchGrid.jqxGrid('getrowdata', rowIdx);
//        if(devInfo == null){
//        	alert("장비를 선택해 주세요.");
//        	return;
//        }
        
        var $ifSearchGrid = $('#ifGrid');
		var rowIdx2 = $('#ifGrid').jqxGrid('getselectedrowindex');
        if(rowIdx2 == -1){
        	alert("회선을 선택해 주세요.");
        	return;
        }
        var ifInfo = $ifSearchGrid.jqxGrid('getrowdata', rowIdx2);
        if(ifInfo == null){
        	alert("회선을 선택해 주세요.");
        	return;
        }
        
    	var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
        var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
        var _grpName = grpSelection.length == 0? '' : grpSelection[0].grpName;
        
        var _mngNo = -1, _ifIdx = -1;
        var _devName = '', _ifName='', _lineWidth='';
        
//        if(devInfo!=null){
//        	_mngNo = devInfo.mngNo;
//        }
        if(ifInfo!=null){
        	_mngNo = ifInfo.mngNo;
        	_ifIdx = ifInfo.ifIdx;
        	_devName = ifInfo.devName;
        	_ifName = ifInfo.ifName;
        	_lineWidth = HmUtil.convertUnit1000(ifInfo.lineWidth);
        }
        
        // 기간그래프 대상설정
        var tableCnt = -1;
        if($("#rdTbl1").jqxRadioButton('val')==true) tableCnt = 1;
        else if($("#rdTbl2").jqxRadioButton('val')==true) tableCnt = 2;
        else if($("#rdTbl3").jqxRadioButton('val')==true) tableCnt = 3;

        var d = $('#date1').val("date");
        var _date1 = null;
        if(val==1){
        	_date1 = HmDate.getDateStr($('#date1'));
        }else if(val==2){
        	d.setMonth(d.getMonth()-3);
        	_date1 = $.format.date(d, 'yyyyMMdd');
        }else if(val==3){	
        	d.setFullYear(d.getFullYear()-1);
        	_date1 = $.format.date(d, 'yyyyMMdd');
        }
        
        var params = {};

        console.log($('#cbTimeId').val());
        console.log(tableCnt);

        $.extend(params, {
        	grpType: 'IF',
            grpNo: _grpNo,
            mngNo: _mngNo,
            ifIdx: _ifIdx,
//            date1: HmDate.getDateStr($('#date1')),
            date1: _date1,
            time1: $.format.date($('#date1').val("date"), "HH")+"00",
            date2: HmDate.getDateStr($('#date2')),
    		time2: $.format.date($('#date2').val("date"), "HH")+"00",
    		itemType: $("#searchUnit").val(),
            timeId: $('#cbTimeId').val(),
            isDayOff: $('#ckDayOff').val() ? 1 : 0,
            isHoliday: $('#ckHoliday').val() ? 1 : 0,
    		isWorkFlag: $('#ckWorktime').val() ? 1 : 0,
			tableCnt: tableCnt,
            grpName: _grpName,
            devName: _devName,
            ifName: _ifName,
            lineWidth: _lineWidth
        });
        
        return params;
    },

    /** 검색조건 > 회선 > 장비그리드 조회 */
    searchDevCond: function() {
        HmGrid.updateBoundData($('#devGrid'), ctxPath + '/dev/getDevList.do');
    },
    
    /** 검색조건 > 회선그리드 조회 */
    searchIfCond: function() {
        HmGrid.updateBoundData($('#ifGrid'), ctxPath + '/line/getLineList.do');
    },
    
    /** 조회 */
    search: function () {
		Main.periodSearch();
		Main.monthSearch();
		Main.yearSearch();
    },
    dateFormat: function(date, time){
    	var t = date+time;
    	
    	var yyyy = t.substring(0,4);
    	var MM = t.substring(4,6);
    	var dd = t.substring(6,8);
    	var HH = t.substring(8,10);
    	var mm = t.substring(10,12);
    	
    	var d = yyyy+"-"+MM+"-"+dd+" "+HH+":"+mm;
    	return d;
    	
    },
    periodSearch: function(){
    	var params = Main.getCommParams(1);
    	
    	$('#spPeriod').text(' (검색기간 : ' + Main.dateFormat(params.date1,params.time1) + ' ~ ' + Main.dateFormat(params.date2,params.time2) + ')');
    	
    	Server.post('/main/rpt/ifMonthlyRpt/getIfPeriodChartList.do', {
			data: params,
			success: function(result, send_data) {
//				console.log("ifChart!!!",result);
				
				Main.drawChart($periodChart, $('#searchUnit').val(), result, 1, send_data);
			}
		});
    },
    monthSearch: function(){
    	var params = Main.getCommParams(2);
    	$('#spQuarter').text(' (검색기간 : ' + Main.dateFormat(params.date1,params.time1) + ' ~ ' + Main.dateFormat(params.date2,params.time2) + ')');

    	Server.post('/main/rpt/ifMonthlyRpt/getIfMonthlyChartList.do', {
			data: params,
			success: function(result, send_data) {
//				console.log("ifChart!!!",result);
				
				Main.drawChart($monthChart, $('#searchUnit').val(), result, 2, send_data);
			}
		});
    },
    yearSearch: function(){
    	var params = Main.getCommParams(3);
    	$('#spYear').text(' (검색기간 : ' + Main.dateFormat(params.date1,params.time1) + ' ~ ' + Main.dateFormat(params.date2,params.time2) + ')');

    	Server.post('/main/rpt/ifMonthlyRpt/getIfYearChartList.do', {
			data: params,
			success: function(result, send_data) {
				console.log("ifChart!!!",result);
				
				Main.drawChart($yearChart, $('#searchUnit').val(), result, 3, send_data);
			}
		});
    },
    drawChart: function ($chart, _itemType, result, chartNum, send_data) {
    	var chart = $chart.highcharts();
    	if(chart==null){
    		try{ 
				chart.showNoData();
    			chart.hideLoading(); 
            } catch(err){}
    		return;
    	}
    	
        var seriesArray = new Array();

        try{
			chart.hideNoData();
        	chart.showLoading();
        }catch(err){}
     	
        var titleTxt = "", valUnit="";
        var chartType = HmHighchart.TYPE_AREA;
        
        // series 제거
		var len = chart.series.length;
		for (var i = len-1; i>=0; i--) {
			chart.series[i].remove();
        }
		
        switch(_itemType) {
        	case 'BPS': titleTxt= "bps"; 
	        	var new_series = [ {name: 'bps 출력(평균)', type: chartType}, {name: 'bps 입력(평균)', type: chartType} ];
	        	for (var y = new_series.length-1; y >= 0; y--) {
            		chart.addSeries(new_series[y]);
            	}
        		break;
        	case 'BPSPER': titleTxt= "bps%"; valUnit="%";
	        	var new_series = [ {name: 'bps% 출력(평균)', type: chartType}, {name: 'bps% 입력(평균)', type: chartType} ];
	        	for (var y = new_series.length-1; y >= 0; y--) {
	        		chart.addSeries(new_series[y]);
	        	}
        		break;
        }
        
        chart.yAxis[0].update({
			labels: {
				formatter:function(){
					var val = this.value;
					if(val!=null) val = Math.abs(val);
					if(_itemType!='BPSPER')
						return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
					else
						return Math.abs(val)+valUnit;
				}
			},
			title: null
		});
		
		chart.options.tooltip.formatter = function(){
            if($("#rdTbl1").jqxRadioButton('val')==true) return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', _itemType, valUnit);
            else if($("#rdTbl2").jqxRadioButton('val')==true) return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', _itemType, valUnit);
            else if($("#rdTbl3").jqxRadioButton('val')==true) return Main.perfTooltipFormat(this, 'yyyy-MM-dd', _itemType, valUnit);

        };
		
		if (result == undefined) result = null;
		Main.perfDataSetting(chart, result, _itemType, chartNum, send_data);
		
    },

    perfDataSetting: function($chart, result, $tabType, chartNum, send_data){ // db에서 가져온 정보 세팅
    	var noDataFlag = 0; //0:데이터 없음, 1:데이터 존재
    	
    	var chData_in = [], chData_out = [], chData_per_in = [], chData_per_out = [];
    	var category = [], xStep = 2;
    	
    	var in_max=null, in_min=null, in_avg=0;
    	var out_max=null, out_min=null, out_avg=0;
    	var inPer_max=null, inPer_min=null, inPer_avg=0;
    	var outPer_max=null, outPer_min=null, outPer_avg=0;
    	
    	if(result!=null){
			var dateFormat = 'MM-dd HH:mm';
			
			switch(chartNum){
				case 1: //period 
					dateFormat = 'yyyy-MM-dd HH:mm';
					if($("#rdTbl3").jqxRadioButton('val')==true){
						dateFormat = 'yyyy-MM-dd';	
					}else {
						dateFormat = 'yyyy-MM-dd HH:mm';
					}
					if(result.length<10) xStep = 1;
					else if(result.length>50) xStep = parseInt(result.length/15);
					else if(result.length>30) xStep = parseInt(result.length/4);
					break;
					
				case 2: // month
					if(result.length<10) xStep = 1;
					else if(result.length>300){
						dateFormat = 'yyyy-MM-dd HH:mm';
						xStep = parseInt(result.length/12);
					}
					else if(result.length>50) xStep = parseInt(result.length/15);
					else if(result.length>30) xStep = parseInt(result.length/4);
					else if(result.length>15) xStep = 3;
					
					break;
				case 3: // year
					if(result.length<10) xStep = 1;
					else if(result.length<50) xStep = 3;
					else if(result.length<100) xStep = parseInt(result.length/15);
					
					dateFormat = 'yyyy-MM-dd'; 
					break;
			}
			
			for (var i = 0; i < result.length; i++) {
				var oneDt = result[i];
				var time = oneDt.date;
				var time2 = HmHighchart.change_date(oneDt.ymdhms).getTime();

				category.push($.format.date(new Date(time2), dateFormat));
				
				var val = oneDt.avgInBps; 
				if(val != null) val = parseFloat(val);
				chData_in.push([time, val]);

				var val2 = oneDt.avgOutBps; 
				if(val2 != null) val2 = parseFloat(val2)*-1;
				chData_out.push([time, val2]);
				

				var val3 = oneDt.avgInbpsPer; 
				if(val3 != null) val3 = parseFloat(val3);
				chData_per_in.push([time, val3]);

				var val4 = oneDt.avgOutbpsPer; 
				if(val4 != null) val4 = parseFloat(val4)*-1;
				chData_per_out.push([time, val4]);
				
				if(i==0){ // 첫번째 데이터를 변수에 넣는다
					in_max = val; in_min = val;
					out_max = val2; out_min = val2;
					inPer_max = val3; inPer_min = val3;
					outPer_max = val4; outPer_min = val4;
				}
				
				if(in_max<val) in_max = val;
				if(in_min>val) in_min = val;
				in_avg += val;

				// out 값은 - 가 붙기 때문에 반대
				if(out_max>val2) out_max = val2;
				if(out_min<val2) out_min = val2;
				out_avg += val2;
				
				if(inPer_max<val3) inPer_max = val3;
				if(inPer_min>val3) inPer_min = val3;
				inPer_avg += val3;
				
				// out 값은 - 가 붙기 때문에 반대
				if(outPer_max>val4) outPer_max = val4;
				if(outPer_min<val4) outPer_min = val4;
				outPer_avg += val4;
			};

            rraDataObj = {};

			rraDataObj.in_max = Math.abs(in_max);
			rraDataObj.in_min = Math.abs(in_min);
			rraDataObj.in_avg = 0;

			in_max = HmUtil.convertUnit1000(Math.abs(in_max));
			in_min = HmUtil.convertUnit1000(Math.abs(in_min));
			if(in_avg!=0){
				rraDataObj.in_avg = (Math.abs(in_avg)/result.length).toFixed(2);
				in_avg = HmUtil.convertUnit1000(Math.abs(in_avg)/result.length);
			}

			rraDataObj.out_max = Math.abs(out_max);
			rraDataObj.out_min = Math.abs(out_min);
			rraDataObj.out_avg = 0;

			out_max = HmUtil.convertUnit1000(Math.abs(out_max));
			out_min = HmUtil.convertUnit1000(Math.abs(out_min));
			if(out_avg!=0){
                rraDataObj.out_avg = (Math.abs(out_avg)/result.length).toFixed(2);
				out_avg = HmUtil.convertUnit1000(Math.abs(out_avg)/result.length);
			}

			inPer_max = Math.abs(inPer_max).toFixed(2) + "%";
			inPer_min = Math.abs(inPer_min).toFixed(2) + "%";
			rraDataObj.inPer_avg = '0.00%';
			if(inPer_avg!=0){
				inPer_avg = Math.abs(inPer_avg/result.length).toFixed(2) + "%";
				rraDataObj.inPer_avg = inPer_avg;
			} else {
                inPer_avg = '0.00%';
			}

			rraDataObj.inPer_max = inPer_max;
			rraDataObj.inPer_min = inPer_min;

			outPer_max = Math.abs(outPer_max).toFixed(2) + "%";
			outPer_min = Math.abs(outPer_min).toFixed(2) + "%";
            rraDataObj.outPer_avg = '0.00%';
			if(outPer_avg!=0){
				outPer_avg = Math.abs(outPer_avg/result.length).toFixed(2) + "%";
				rraDataObj.outPer_avg = outPer_avg;
			} else {
                outPer_avg = '0.00%';
			}

			rraDataObj.outPer_max = outPer_max;
			rraDataObj.outPer_min = outPer_min;

			rraDataObjList.push({chartNum: chartNum, data: rraDataObj});
		}
		
		$chart.xAxis[0].update({
			tickInterval: xStep
//			labels: {
//				step: xStep
//			}
		});
		$chart.xAxis[0].setCategories(category, false);
		
//		console.log(in_avg, out_avg, inPer_avg, outPer_avg);
		$("#basicSp"+chartNum+" .summary_max_in").text(in_max+" ("+inPer_max+")");
		$("#basicSp"+chartNum+" .summary_min_in").text(in_min+" ("+inPer_min+")");
		$("#basicSp"+chartNum+" .summary_avg_in").text(in_avg+" ("+inPer_avg+")");
		$("#basicSp"+chartNum+" .summary_max_out").text(out_max+" ("+outPer_max+")");
		$("#basicSp"+chartNum+" .summary_min_out").text(out_min+" ("+outPer_min+")");
		$("#basicSp"+chartNum+" .summary_avg_out").text(out_avg+" ("+outPer_avg+")");
		
		switch($tabType) {
	    	case 'BPS':
	    		$chart.series[0].setData(chData_in, false);
	    		$chart.series[1].setData(chData_out, false);
	    		break;
	    	case 'BPSPER':
	    		$chart.series[0].setData(chData_per_in, false);
	    		$chart.series[1].setData(chData_per_out, false);
	    		break;
		}
    			
		switch(chartNum){
			case 1: period_data = result; break;
			case 2: month_data = result; break;
			case 3: year_data = result; break;
		}
		
		if(chData_in!=0 || chData_out!=0) noDataFlag=1;
			
		$chart.redraw();
		
		try{ 
			if(noDataFlag==0){
				$chart.showNoData();
			}else
				$chart.hideNoData();
			$chart.hideLoading(); 
        } catch(err){}
	},
	
	createDefaultHighChart: function (elementName, seriesArray, valUnit, itemType, chartType) {
//      Highcharts.chart(elementName, pIfPerfChart.getSettings(seriesArray, suffix, itemType, chartType));
//		var new_series = [ { name: "IN 평균", type: chartType }, { name: "OUT 평균", type: chartType } ];
		var new_series = [
            {name: 'bps 입력(평균)', type: chartType},
            {name: 'bps 출력(평균)', type: chartType}
        ];
		
	 	var commOptions = HmHighchart.getCommOptions(chartType);
	 	var options = {};
	 	options.chart= {
	         zoomType: 'x',
	         resetZoomButton: {
	             position: {
	                 align: 'right', // by default
	                 verticalAlign: 'top', // by default
	                 x: -10,
	                 y: 10
	             },
	             relativeTo: 'chart'
	         },
	         type: chartType,
	         events: {
		            redraw: function () {
		                try{
			                this.hideNoData();  // hide no data message
		            	}catch(err){}
		                try{
	//		                this.hideLoading();  // hide loading message
		            	}catch(err){}
		            }
		        }
	     };
		options.xAxis = {
				type: 'category',
//				labels: {
//					formatter:function(){
//						console.log();
//						var chartId = this.chart.renderTo.id;
//						var dateFormat = 'yyyy-MM-dd HH:mm';
//						
//						switch(chartId){
//						case 'periodChart': break;
//						case 'monthChart': break;
//						case 'yearChart': dateFormat = 'yyyy-MM-dd'; break;
//						}
//						var s = $.format.date(new Date(this.value), dateFormat);
//						return s;
//					}
//				}
		};
		options.yAxis = [
							{
								labels: {
//									format: '{value}'+valUnit
									formatter:function(){
										var val = this.value;
										if(val!=null) val = Math.abs(val);
										if(itemType!='BPSPER')
											return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
										else
											return Math.abs(val)+valUnit;
									}
								},
								title: null
							}
						];
		options.tooltip = {
			formatter: function(){
				return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', type, valUnit);
			}
		};
		options.legend= { enabled: true };
		options.plotOptions = {
			line: {
				lineWidth: 1,
				marker: {
					enabled: false
				},
				connectNulls: true
			},
			series: {
                connectNulls: true,
                turboThreshold:5000000,//set it to a larger threshold, it is by default to 1000
            }
		};
		options.series= seriesArray;
		
		var hmOptions = $.extend(true, commOptions, options);
//		console.log(options);
		HmHighchart.create2(elementName, hmOptions);
	},
	
    createDefaultHighChart_dateTime: function (elementName, seriesArray, valUnit, itemType, chartType) {
//      Highcharts.chart(elementName, pIfPerfChart.getSettings(seriesArray, suffix, itemType, chartType));
//		var new_series = [ { name: "IN 평균", type: chartType }, { name: "OUT 평균", type: chartType } ];
		var new_series = [
            {name: 'bps 입력(평균)', type: chartType},
            {name: 'bps 출력(평균)', type: chartType}
        ];
		
	 	var commOptions = HmHighchart.getCommOptions(chartType);
	 	var options = {};
	 	options.chart= {
	         zoomType: 'x',
	         resetZoomButton: {
	             position: {
	                 align: 'right', // by default
	                 verticalAlign: 'top', // by default
	                 x: -10,
	                 y: 10
	             },
	             relativeTo: 'chart'
	         },
	         type: chartType,
	         events: {
		            redraw: function () {
		                try{
			                this.hideNoData();  // hide no data message
		            	}catch(err){}
		                try{
	//		                this.hideLoading();  // hide loading message
		            	}catch(err){}
		            }
		        }
	     };
		options.xAxis = {
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
		};
		options.yAxis = [
							{
								labels: {
//									format: '{value}'+valUnit
									formatter:function(){
										var val = this.value;
										if(val!=null) val = Math.abs(val);
										if(itemType!='BPSPER')
											return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
										else
											return Math.abs(val)+valUnit;
									}
								},
								title: null
							}
						];
		options.tooltip = {
			formatter: function(){
				return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', type, valUnit);
			}
		};
		options.legend= { enabled: true };
		options.plotOptions = {
			line: {
				lineWidth: 1,
				marker: {
					enabled: false
				},
				connectNulls: true
			}
		};
		options.series= seriesArray;
		
		var hmOptions = $.extend(true, commOptions, options);
//		console.log(options);
		HmHighchart.create2(elementName, hmOptions);
	},
 
	/** 성능 차트 툴팁 포멧설정*/
	perfTooltipFormat: function(thisVal, dateFormat, $tabType, valUnit){
		var xVal = thisVal.x;
		var points = thisVal.points;
        console.log(thisVal);
		var s = '<b>' + $.format.date(new Date(xVal), dateFormat) + '</b>';
		
		$.each(points, function(key, oneDt) {
			var name = oneDt.series.name;
			var yVal = oneDt.y;

			if(yVal!=null) yVal = Math.abs(yVal);
			if($tabType=='BPS'){
				s += '<br/>' + name + ': ' + HmUtil.convertUnit1000(yVal)+valUnit;
			}
			else if($tabType=='BPSPER'){
				s += '<br/>' + name + ': ' + (yVal)+valUnit;
			}
		});
		
		return s;
	},
	
    /** export Excel */
    exportExcel: function () {
//        var params = Main.getCommParams();
        var params = {};
		params['period'] = Main.getCommParams(1);
		params['month'] = Main.getCommParams(2);
		params['year'] = Main.getCommParams(3);

		//사이트명이 RRA(전파연구소)일 경우 원래 데이터를 그대로 넘겨준다.
		if($('#gSiteName').val() == 'RRA') {
			console.log('rraObjList', rraDataObjList);

			for(var i = 0 ; i < rraDataObjList.length ; i++){
				var item = rraDataObjList[i];

				var paramText = '';

				if(item.chartNum == 1){
                    paramText = 'period';
				} else if(item.chartNum == 2){
                    paramText = 'month';
				} else {
                    paramText = 'year';
				}

				var inMax = parseFloat((item.data.in_max / 1000000).toFixed(3));
				var inMin = parseFloat((item.data.in_min / 1000000).toFixed(3));
				var inAvg = parseFloat((item.data.in_avg / 1000000).toFixed(3));
				var outMax = parseFloat((item.data.out_max / 1000000).toFixed(3));
				var outMin = parseFloat((item.data.out_min / 1000000).toFixed(3));
				var outAvg = parseFloat((item.data.out_avg / 1000000).toFixed(3));

				inMax > 0.009 ? inMax = inMax.toFixed(2) : inMax = inMax.toFixed(3);
                inMin > 0.009 ? inMin = inMin.toFixed(2) : inMin = inMin.toFixed(3);
                inAvg > 0.009 ? inAvg = inAvg.toFixed(2) : inAvg = inAvg.toFixed(3);
                outMax > 0.009 ? outMax = outMax.toFixed(2) : outMax = outMax.toFixed(3);
                outMin > 0.009 ? outMin = outMin.toFixed(2) : outMin = outMin.toFixed(3);
                outAvg > 0.009 ? outAvg = outAvg.toFixed(2) : outAvg = outAvg.toFixed(3);

                params[paramText].maxIn = inMax + ' M (' + item.data.inPer_max + ')';
                params[paramText].minIn = inMin + ' M (' + item.data.inPer_min + ')';
                params[paramText].avgIn = inAvg + ' M (' + item.data.inPer_avg + ')';
                params[paramText].maxOut = outMax + ' M (' + item.data.outPer_max + ')';
                params[paramText].minOut = outMin + ' M (' + item.data.outPer_min + ')';
                params[paramText].avgOut = outAvg + ' M (' + item.data.outPer_avg + ')';

			}//for end(i)

            params.chartDataList = period_data;
			console.log(params.chartDataList);


        } else {// 다른 사이트일 경우 이전과 그대로 데이터를 넘긴다.

            //요약 데이터
            // params['period'].maxIn = $("#basicSp1 .summary_max_in").text();
            // params['period'].minIn = $("#basicSp1 .summary_min_in").text();
            // params['period'].avgIn = $("#basicSp1 .summary_avg_in").text();
            // params['period'].maxOut = $("#basicSp1 .summary_max_out").text();
            // params['period'].minOut = $("#basicSp1 .summary_min_out").text();
            // params['period'].avgOut = $("#basicSp1 .summary_avg_out").text();
            //
            // params['month'].maxIn = $("#basicSp2 .summary_max_in").text();
            // params['month'].minIn = $("#basicSp2 .summary_min_in").text();
            // params['month'].avgIn = $("#basicSp2 .summary_avg_in").text();
            // params['month'].maxOut = $("#basicSp2 .summary_max_out").text();
            // params['month'].minOut = $("#basicSp2 .summary_min_out").text();
            // params['month'].avgOut = $("#basicSp2 .summary_avg_out").text();
            //
            // params['year'].maxIn = $("#basicSp3 .summary_max_in").text();
            // params['year'].minIn = $("#basicSp3 .summary_min_in").text();
            // params['year'].avgIn = $("#basicSp3 .summary_avg_in").text();
            // params['year'].maxOut = $("#basicSp3 .summary_max_out").text();
            // params['year'].minOut = $("#basicSp3 .summary_min_out").text();
            // params['year'].avgOut = $("#basicSp3 .summary_avg_out").text();

            console.log('rraObjList', rraDataObjList);

            for(var i = 0 ; i < rraDataObjList.length ; i++){
                var item = rraDataObjList[i];

                var paramText = '';

                if(item.chartNum == 1){
                    paramText = 'period';
                } else if(item.chartNum == 2){
                    paramText = 'month';
                } else {
                    paramText = 'year';
                }

                var inMax = parseFloat((item.data.in_max / 1000000).toFixed(3));
                var inMin = parseFloat((item.data.in_min / 1000000).toFixed(3));
                var inAvg = parseFloat((item.data.in_avg / 1000000).toFixed(3));
                var outMax = parseFloat((item.data.out_max / 1000000).toFixed(3));
                var outMin = parseFloat((item.data.out_min / 1000000).toFixed(3));
                var outAvg = parseFloat((item.data.out_avg / 1000000).toFixed(3));

                inMax > 0.009 ? inMax = inMax.toFixed(2) : inMax = inMax.toFixed(3);
                inMin > 0.009 ? inMin = inMin.toFixed(2) : inMin = inMin.toFixed(3);
                inAvg > 0.009 ? inAvg = inAvg.toFixed(2) : inAvg = inAvg.toFixed(3);
                outMax > 0.009 ? outMax = outMax.toFixed(2) : outMax = outMax.toFixed(3);
                outMin > 0.009 ? outMin = outMin.toFixed(2) : outMin = outMin.toFixed(3);
                outAvg > 0.009 ? outAvg = outAvg.toFixed(2) : outAvg = outAvg.toFixed(3);

                params[paramText].maxIn = inMax + ' M (' + item.data.inPer_max + ')';
                params[paramText].minIn = inMin + ' M (' + item.data.inPer_min + ')';
                params[paramText].avgIn = inAvg + ' M (' + item.data.inPer_avg + ')';
                params[paramText].maxOut = outMax + ' M (' + item.data.outPer_max + ')';
                params[paramText].minOut = outMin + ' M (' + item.data.outPer_min + ')';
                params[paramText].avgOut = outAvg + ' M (' + item.data.outPer_avg + ')';

            }//for end(i)

            params.chartDataList = period_data;
            console.log(params.chartDataList);

        }

        var total = 3;
        var saveCnt = 0;
        var chartNameList = [
            'period', 'month', 'year'
        ];

        for (var i = 0; i < chartNameList.length; i++) {
            var oneName = chartNameList[i];
            var chart = $("#" + oneName + "Chart").highcharts();
            var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + "_" + oneName + '.png';
            // chart export size를 조정하여 svg 추출
            var svg = chart.getSVG({
                exporting: {
                    sourceWidth: chart.chartWidth,
                    sourceHeight: chart.chartHeight
                }
            });

            var canvas = document.createElement('canvas');
            canvg(canvas, svg); //svg -> canvas draw
            var imgData = canvas.toDataURL("image/png"); // png이미지로 변환
            var ch_params = {fname: fname, imgData: imgData, imgChartName: oneName};

            Server.post('/file/saveHighchart.do', {
                data: ch_params,
                success: function (result, send_data) {
                    saveCnt++;
                    if (send_data != null) {
                        var dat = $.parseJSON(send_data);
                        params[dat.imgChartName + 'ImgFile'] = dat.fname;
// 						console.log(dat);
                        if (saveCnt == total) { // 차트이미지 저장 다 완료되었을시 엑셀 출력으로 넘어감
                            HmUtil.exportExcel(ctxPath + '/main/rpt/ifMonthlyRpt/export.do', params);
                        }
                    }
                }
            });
        }
        
    },
    /** 데이터 보기 */
    openChartData: function(val){
    	var $chart;
		var name;
    	switch(val) {
			case 1:	$chart=$periodChart; name='기간 차트 데이터 리스트';		break;
			case 2:	$chart=$monthChart; name='분기 차트 데이터 리스트';		break;
			case 3:	$chart=$yearChart; name='년 차트 데이터 리스트';		break;
		}
    	var chart = $chart.highcharts();
    	if(chart==null){
    		alert("차트가 존재하지 않습니다.");
    		return;
    	}
    		
    	var _itemType = $('#searchUnit').val();
    	
    	var chart = $chart.highcharts();
//		var chartData = Main.customChartData(chart, 0);
		var chartData = {};
		switch(val){
	    	case 1: chartData = period_data; break;
	    	case 2: chartData = month_data; break;
	    	case 3: chartData = year_data; break;
	    }
		chartData = Main.customChartData(chartData);
		
		var params = {
//				colgroups: [
//	                  	{ text: '평균', name: 'avg', align: 'center' }
//                  ]
		};
		params.chartData = chartData;
//		console.log(chartData);
		
		params.cols = [
       		{ text: '일시', datafield: 'date'},
       		{ text: 'bps 입력', datafield: 'avgInBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
       		{ text: 'bps% 입력', datafield: 'avgInbpsPer', width: 100, cellsalign: 'right', cellsformat: 'p' },
       		{ text: 'bps 출력', datafield: 'avgOutBps', width: 100, cellsrenderer: HmGrid.unit1000renderer },
       		{ text: 'bps% 출력', datafield: 'avgOutbpsPer', width: 100, cellsalign: 'right', cellsformat: 'p' }
       	];
		
		params.datafields = [
			{ name: 'date', type: 'string' },
			{ name: 'avgInBps', type: 'number' },
			{ name: 'avgInbpsPer', type: 'number' },
			{ name: 'avgOutBps', type: 'number' },
			{ name: 'avgOutbpsPer', type: 'number' }
		];
			
		params.excelTitle = name;
		params.exportType = 1;
		params.gridType = CtxMenu.COMM;

		if($('#gSiteName').val() == 'RRA'){
            $.get(ctxPath + '/rra/popup/comm/pChartDataList.do', function(result) {
                HmWindow.open($('#p2window'), name, result, 700, 600, 'p2window_init', params);
            });
		} else {
			$.get(ctxPath + '/main/popup/comm/pChartDataList.do', function(result) {
				HmWindow.open($('#p2window'), name, result, 700, 600, 'p2window_init', params);
			});
		}

    },
	
    customChartData: function(chartData){ // 데이터보기 팝업용 차트데이터 커스텀

		$.each(chartData, function(idx, oneDt){
			oneDt.avgInBpsStr = HmUtil.convertUnit1000(Math.abs(oneDt.avgInBps));
			oneDt.avgOutBpsStr = HmUtil.convertUnit1000(Math.abs(oneDt.avgOutBps));
//			oneDt.avgInbpsPer = Math.abs(oneDt.avgInbpsPer)+"%";
//			oneDt.avgOutbpsPer = Math.abs(oneDt.avgOutbpsPer)+"%";
		});
		
		return chartData;
	},
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});