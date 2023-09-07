var $rptGrid;
var $rptChart;

var Main = {
		/** variable */
		initVariable : function() {
			$rptGrid = $('#rptGrid');
			$rptChart = $('#rptChart');
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
				case 'btnExcel': this.excelExport(); break;
				case 'btnCSave': this.saveChart(); break;
				case 'btnCList': this.showChartData(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
            $("#devKind1").jqxDropDownList({ source: [{ label:"장비", value:'DEV'}, { label:"서버", value: 'SVR'}], width: '150px', height: '22px', autoDropDownHeight: true , theme: jqxTheme})
				.on('change', function (idx) {
                	var item = idx.args.item.originalItem;
                	var source = {};
                	switch (item.value) {
						case 'DEV':
							source = [{ label:"CPU", value:1}, { label:"Memory", value:2}, {label:"온도", value:5}];
							break;
						case 'SVR':
							source = [{ label:"CPU", value:1}, { label:"Memory", value:2}];
							break;
					}
                    $("#searchUnit").jqxDropDownList({source : source, selectedIndex:0});
                });
            $("#devKind1").jqxDropDownList({ selectedIndex : 0 ,theme: jqxTheme, });
			$("#searchUnit").jqxDropDownList({ selectedIndex: 0, width: '150px', height: '22px', autoDropDownHeight: true ,theme: jqxTheme, });
			$("#over").jqxDropDownList({ source: [{ label:"평균", value:'AVG'}, { label:"최대", value:"MAX"}], selectedIndex: 0, width: '150px', height: '22px', autoDropDownHeight: true ,theme: jqxTheme, });
			//$('#date1').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });

            var srchYear = new Array();
            var thisDate = new Date();
            var currYear = thisDate.getFullYear().toString();
            srchYear.push({label: currYear, value: currYear})
            for(var i = 1; i<4; i++){
                var nowYear = thisDate.getFullYear();
                var nextYear = (nowYear - i)*1;

                srchYear.push({label: nextYear.toString() , value: nextYear.toString() })
            }
            $('#sYear').jqxDropDownList({source: srchYear, width: 90, height: '22px', dropDownHeight: 90, selectedIndex : 0, autoDropDownHeight: true , theme:jqxTheme});

            $('#sMonth').jqxDropDownList({
                source: [
                    {label: '1월', value: '01'},
                    {label: '2월', value: '02'},
                    {label: '3월', value: '03'},
                    {label: '4월', value: '04'},
                    {label: '5월', value: '05'},
                    {label: '6월', value: '06'},
                    {label: '7월', value: '07'},
                    {label: '8월', value: '08'},
                    {label: '9월', value: '09'},
                    {label: '10월', value: '10'},
                    {label: '11월', value: '11'},
                    {label: '12월', value: '12'}
                ],
                theme: jqxTheme,
                width: 50,
                height: '22px',
                dropDownHeight: 90,
                displayMember: 'label',
                valueMember: 'value',
                selectedIndex: 0,
                autoDropDownHeight: true
            });

            var curMonth = thisDate.getMonth() + 1;
            if(curMonth < 10){
                curMonth = '0' + curMonth;
			};
            $('#sMonth').val(curMonth)

			$('#btnGrpType').jqxButtonGroup({ mode: 'radio', theme: jqxTheme })
				.on('buttonclick', function(event) {
					Main.chgGrpType(event.args.button[0].id);
				});
			$('#btnGrpType').jqxButtonGroup('setSelection', 0);
			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEF_ALL, 180, 22, 300, 350, Main.searchDevCond);
	
		
			/** 월간장비 보고 그리드  그리기 */
			HmGrid.create($rptGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');
								var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
								var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
								var searchUnitType=0;

								var colName = 'AVG_VAL';
                                var date = new Date();
                                var curYear = date.getFullYear();
                                var month = $("#sMonth").val();
                                var lastDay = ( new Date( curYear, month , 0) ).getDate();

                                if($("#over").val() != 'AVG'){
                                    colName = 'MAX_VAL';
                                }
								$.extend(data, {
                                    grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
                                    itemKind: 'GROUP',
									searchUnit: $("#searchUnit").val(),
									grpNo: _grpNo,
									//date1: HmDate.getDateStr($('#date1')),
									over: $("#over").val(),
									devKind1: $('#devKind1').val(),

                                    colName : colName,
									sYear : $("#sYear").val(),
									sMonth : month,
									sLastDay : lastDay
								});
								return data;
							}
						}
				),
				columns: 
				[
                    { text: '그룹명', datafield: 'grpName', width: 150 },
				 	{ text: '장비명', datafield: 'devName', minwidth: 150 },
					{ text: '1일', datafield: 'dd01', minwidth: 80, cellsalign: 'right' },
					{ text: '2일', datafield: 'dd02', minwidth: 80, cellsalign: 'right' },
					{ text: '3일', datafield: 'dd03', minwidth: 80, cellsalign: 'right' },
					{ text: '4일', datafield: 'dd04', minwidth: 80, cellsalign: 'right' },
					{ text: '5일', datafield: 'dd05', minwidth: 80, cellsalign: 'right' },
					{ text: '6일', datafield: 'dd06', minwidth: 80, cellsalign: 'right' },
					{ text: '7일', datafield: 'dd07', minwidth: 80, cellsalign: 'right' },
					{ text: '8일', datafield: 'dd08', minwidth: 80, cellsalign: 'right' },
					{ text: '9일', datafield: 'dd09', minwidth: 80, cellsalign: 'right' },
					{ text: '10일', datafield: 'dd10', minwidth: 80, cellsalign: 'right' },
					{ text: '11일', datafield: 'dd11', minwidth: 80, cellsalign: 'right' },
					{ text: '12일', datafield: 'dd12', minwidth: 80, cellsalign: 'right' },
					{ text: '13일', datafield: 'dd13', minwidth: 80, cellsalign: 'right' },
					{ text: '14일', datafield: 'dd14', minwidth: 80, cellsalign: 'right' },
					{ text: '15일', datafield: 'dd15', minwidth: 80, cellsalign: 'right' },
					{ text: '16일', datafield: 'dd16', minwidth: 80, cellsalign: 'right' },
					{ text: '17일', datafield: 'dd17', minwidth: 80, cellsalign: 'right' },
					{ text: '18일', datafield: 'dd18', minwidth: 80, cellsalign: 'right' },
					{ text: '19일', datafield: 'dd19', minwidth: 80, cellsalign: 'right' },
					{ text: '20일', datafield: 'dd20', minwidth: 80, cellsalign: 'right' },
					{ text: '21일', datafield: 'dd21', minwidth: 80, cellsalign: 'right' },
					{ text: '22일', datafield: 'dd22', minwidth: 80, cellsalign: 'right' },
					{ text: '23일', datafield: 'dd23', minwidth: 80, cellsalign: 'right' },
                    { text: '24일', datafield: 'dd24', minwidth: 80, cellsalign: 'right' },
                    { text: '25일', datafield: 'dd25', minwidth: 80, cellsalign: 'right' },
                    { text: '26일', datafield: 'dd26', minwidth: 80, cellsalign: 'right' },
                    { text: '27일', datafield: 'dd27', minwidth: 80, cellsalign: 'right' },
                    { text: '28일', datafield: 'dd28', minwidth: 80, cellsalign: 'right' },
                    { text: '29일', datafield: 'dd29', minwidth: 80, cellsalign: 'right' },
                    { text: '30일', datafield: 'dd30', minwidth: 80, cellsalign: 'right' },
                    { text: '31일', datafield: 'dd31', minwidth: 80, cellsalign: 'right' }
			    ]
			});
			
			$rptGrid.on('rowdoubleclick', function(event) {
				Main.searchChart();
			});
			
			// 차트 초기화
			var defaultSeriesArray = [{name: 'RATE', data: null, lineWidth: 0.5}];
			Main.createDefaultHighChart('rptChart', defaultSeriesArray);
		},

		createDefaultHighChart: function (elementName, seriesArray){
			var titleTxt = "", valUnit="";
			var chartType = HmHighchart.TYPE_LINE;
			
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
		            type: chartType
		        };
			options.xAxis = {
					type: 'category'
			};
			options.yAxis = [
				{
					labels: {
						format: '{value}'+valUnit
					},
					title: null,
					max:100
				}
			];
			options.tooltip = {
				formatter: function(){
					return Main.perfTooltipFormat(this);
				}
			};
			options.legend= {enabled: true};
			options.series= seriesArray;
			
			var hmOptions = $.extend(true, commOptions, options);
			
			HmHighchart.create2(elementName, hmOptions);
		},
		/** 성능 차트 툴팁 포멧설정*/
		perfTooltipFormat: function (thisVal){
			var xVal = thisVal.x;
			var points = thisVal.points;

			var s = '<b>' + points[0].key + '</b>';
			var _valUnit= "";
	    	$.each(points, function(key, oneDt) {
				var name = oneDt.series.name;
				var yVal = oneDt.y;

				if(yVal!=null) yVal = Math.abs(yVal);
				
				s += '<br/>' + name + ': ' + (yVal)+_valUnit;
			});
			
			return s;
		},
		drawChart: function (chartName, result){
			var chart = $('#'+chartName).highcharts();
			var seriesArray = new Array();
	        
	        var chData = [];
			if(result!=null){
				for (var i = 0; i < result.length; i++) {
					var oneDt = result[i];

//					var time = HmHighchart.change_date(oneDt.ymdhms).getTime();
					var time = oneDt.time;
					var val = oneDt.rate; 
					if(val != null) val = parseFloat(val);
					chData.push([time, val]);

				};
			}

			chart.series[0].setData(chData, false);
			chart.redraw();
			
		},
		
		/** init data */
		initData : function() {

		},
		
		// 그룹타입 변경
		chgGrpType: function(btnId) {
			if(btnId == 'DEFAULT') {
				HmTreeGrid.updateData($('#grpTree'), HmTree.T_GRP_DEF_ALL);
			}
			else if(btnId == 'SEARCH') {
				HmTreeGrid.updateData($('#grpTree'), HmTree.T_GRP_SEARCH);
			}
		},
		
		/**  그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/monthDevRpt/getMonthDevRptList.do');
//			$rptChart.jqxChart({ source: null });
			var chData = [];
			var chart = $rptChart.highcharts();
			chart.series[0].setData(chData, false);
			chart.redraw();
			
		},
		/** Excel Export */
    	excelExport: function () {
            var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');
            var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
            var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
            var searchUnitType=0;

            var colName = 'AVG_VAL';
            var date = new Date();
            var curYear = date.getFullYear();
            var month = $("#sMonth").val();
            var lastDay = ( new Date( curYear, month , 0) ).getDate();

            var params = {
                grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
                itemKind: 'GROUP',
                searchUnit: $("#searchUnit").val(),
                grpNo: _grpNo,
                //date1: HmDate.getDateStr($('#date1')),
                over: $("#over").val(),
                devKind1: $('#devKind1').val(),

                colName : colName,
                sYear : $("#sYear").val(),
                sMonth : month,
                sLastDay : lastDay
            };
            HmUtil.exportExcel(ctxPath + '/main/rpt/monthDevRpt/export.do', params)
        },
		/**  차트 그리기 */
		searchChart: function() {
			var rowIdx = HmGrid.getRowIdx($rptGrid, '서버를 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $rptGrid.jqxGrid('getrowdata', rowIdx);
			var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
			var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
            var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');

            var colName = 'AVG_VAL';
            var date = new Date();
            var curYear = date.getFullYear();
            var month = $("#sMonth").val();
            var lastDay = ( new Date( curYear, month , 0) ).getDate();

            if($("#over").val() != 'AVG'){
                colName = 'MAX_VAL';
            }

			var params = {
                    grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
                    itemKind: 'GROUP',
                    searchUnit: $("#searchUnit").val(),
					grpNo: _grpNo,
					mngNo: rowdata.mngNo,
					//date1: HmDate.getDateStr($('#date1')),
                    over: $("#over").val(),
					devKind1: $('#devKind1').val(),

					colName : colName,
					sYear : $("#sYear").val(),
					sMonth : month,
					sLastDay : lastDay
			};
            console.log(params)
				Server.get('/main/rpt/monthDevRpt/getSummaryChart.do', {
					data: params,
					success: function(result) {
						Main.drawChart('rptChart', result);
					}
				});
		},

		saveChart: function() {
			HmUtil.exportHighchart($rptChart.highcharts(), "chart");
		},
		
		showChartData: function(){
			var chart = $rptChart.highcharts();
			var chartData = Main.customChartData(chart);
			var params = {
	            chartData: chartData,
	            cols: [
					{ text : '일시', datafield : 'time' }, 
					{ text : 'RATE', datafield : 'val', width : 200, cellsalign : 'right' }
				]
			};

			$.get(ctxPath + '/main/popup/comm/pChartDataList.do', function(result) {
				HmWindow.open($('#pwindow'), name, result, 600, 600, 'p2window_init', params);
			});
		},
		
		customChartData: function(chartData){
			var series = chartData.series;
			var dateArr = [];
			
			for(var i=0; i<series.length; i++){
				var one_seri = series[i];
				var name = one_seri.name;
				var data = one_seri.data;
				for(var k=0; k<data.length; k++){
					var oneDt = data[k];
					var x = oneDt.name;
					var y = oneDt.y; //val
					
					dateArr.push({time: x, val: y});
				}
			}
			
			return dateArr;
		},


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});