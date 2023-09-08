var $grpTree;
var $cbPeriod;
var $recPerfGrid, $recCallHistGrid
var $pieChart, $lineChart;
var ctxmenuIdx = 1;
var _curPerfIdx;
var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$cbPeriod = $('#cbPeriod');
		$recPerfGrid = $('#recPerfGrid');
		$recCallHistGrid = $('#recCallHistGrid');
		$pieChart = $('#pieChart');
		$lineChart = $('#lineChart');
		this.initCondition();
	},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});

		$recPerfGrid.on('rowclick', function (event){
			_curPerfIdx = event.args.rowindex;
			if( _curPerfIdx != -1)
				HmGrid.updateBoundData($recCallHistGrid, ctxPath + '/main/ipt/recMonitoring/getRecCallDbData.do');
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch':
			this.searchGrid();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchGrid, null);

		HmGrid.create($recPerfGrid, {
			source : new $.jqx.dataAdapter(
				{
					datatype : 'json',
					// 필터위해 미리 추가
					// datafields:[
                     //    { name:'extNum', type:'number' },
                     //    { name:'yyyymmdd', type:'string' },
                     //    { name:'extGrpName', type:'string' },
                     //    { name:'devName', type:'string' },
                     //    { name:'callCnt', type:'number' },
                     //    { name:'existEvtCnt', type:'number' },
                     //    { name:'sizeEvtCnt', type:'number' },
                    // ]
				},
				{
					formatData : function(data) {
					return Main.setCommonParam(data);
				}
				}),
			// selectionmode: 'multiplecellsadvanced',
			columns : [{ text : '그룹번호', datafield : 'extNum', hidden : true },
			        { text : '날짜', datafield : 'yyyymmdd', width: 100, cellsalign : 'center'},
					{ text : '그룹명', datafield : 'extGrpName', width : 150, cellsalign : 'center' },
					{ text : '장비명', datafield : 'devName', minwidth : 150, cellsalign : 'center' },
					{ text : '전체 Call 수', datafield : 'callCnt', width : 100, cellsalign : 'right' },
					{ text : '녹취 누락 건수', datafield : 'existEvtCnt' , width : 100, cellsalign : 'right'},
					{ text : '녹취 파일 이상 건수', datafield : 'sizeEvtCnt', width : 130, cellsalign : 'right' }
			] }, CtxMenu.COMM, ctxmenuIdx++);

		HmGrid.create($recCallHistGrid, {
			source : new $.jqx.dataAdapter({ datatype : 'json' }, { formatData : function(data) {
				var rowData = $recPerfGrid.jqxGrid('getrowdata', _curPerfIdx);
				if(rowData === undefined) return;

				$.extend(data, {
					extNum: rowData.extNum,
					yyyymmdd : rowData.yyyymmdd.replace(/\D/g, '')
				});
				return Main.setCommonParam(data);
			} }),
			columns : [
					{ text : '녹취 시작 시각', datafield : 'startTime', width : 150, cellsalign : 'center'},
					{ text : '녹취 종료 시각', datafield : 'stopTime', width : 150, cellsalign : 'center' },
					{ text : '통화 시간(초)', datafield : 'duration', width : 120, cellsalign : 'center' },
					{ text : '녹취 파일 경로', datafield : 'filePath' },
					{ text : '녹취 상태', datafield : 'recStatStr' },
					{ text : '내선 번호', datafield : 'extNum' }
			] }, CtxMenu.COMM, ctxmenuIdx++);

		//파이 차트
        HmHighchart.create2('pieChart', {
            chart: {
                type: 'pie',
                events: {
                    render: function (event) {
                        // var total = 0;
                        // for (var i = 0, len = this.series[0].yData.length; i < len; i++) {
                        //     total += parseFloat(this.series[0].yData[i]);
                        // }
                        // this.setTitle({text: total==0? null : '{0}<br>({1})'.substitute(item.name, total)});
                    }
                }
            },
            title: {
                verticalAlign: 'middle',
                floating: true,
                text: '',
                y: -20,
                style: {fontSize: '16px'}
            },
            legend: {
                enabled: true,
                symbolRadius: 1, // 사각형 모양
                layout: 'horizontal'
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b><br/>' +
                        this.series.name + ' : ' + this.point.y + ' (' + this.point.percentage.toFixed(1) + ' %)';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: false}
                }
            },
            series: [{
                name: '',
                type: 'pie',
                innerSize: '65%',
                colorByPoint: true,
                data: null,
                showInLegend: true
            }]
        }, HmHighchart.TYPE_PIE);

        var chartOptions = {
            title: {
                text: ''
            },
            xAxis: {
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
                title: null
            },
            series: [ {name: '녹취 정상', data: null},
                {name: '녹취 누락', data: null},
                {name: '파일 이상', data: null}
            ]
            // tooltip: { split: true }

        }
        HmHighchart.create2($lineChart.attr('id'), chartOptions, HmHighchart.TYPE_LINE);

		// //라인 차트
		// var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_DAY);
		// $.extend(settings, { seriesGroups : [
		// 	HmChart2.getSeriesGroup($lineChart, HmChart2.T_LINE, Main.chartTooltip, HmChart2.getSeries([
		// 			'nomalCnt', 'existEvtCnt', 'sizeEvtCnt'
		// 	], [
		// 			'녹취 정상', '녹취 누락', '파일 이상'
		// 	], false))
		// ] });
		// HmChart2.create($lineChart, settings);
	},

	/** init data */
	initData : function() {

	},

	/** 트리선택 */
	selectTree : function() {
		Main.searchGrid();
	},

	/** 조회 */
	searchGrid : function() {
		HmGrid.updateBoundData($recPerfGrid, ctxPath + '/main/ipt/recMonitoring/getRecPerfData.do');

		Server.get(ctxPath + '/main/ipt/recMonitoring/getPieChartData.do', { data : Main.setCommonParam({}), success : function(result) {
			if(result == null)
				return;

				var chartData = [];

                chartData.push({name: '녹취 정상', y: result.nomalCnt });
                chartData.push({name: '녹취 누락', y: result.existEvtCnt });
                chartData.push({name: '파일 이상', y: result.sizeEvtCnt });

                $('#pieChart').highcharts().series[0].setData(chartData);
		} });

		Server.get(ctxPath + '/main/ipt/recMonitoring/getLineChartData.do', { data : Main.setCommonParam({}), success : function(result) {
			var chart = $lineChart.highcharts();
			var nomalCnt = [], existEvtCnt = [], sizeEvtCnt = [];
                $.each(result, function (idx, item) {
                    nomalCnt.push([item.ymdhms, item.nomalCnt]);
                    existEvtCnt.push([item.ymdhms, item.existEvtCnt]);
                    sizeEvtCnt.push([item.ymdhms, item.sizeEvtCnt]);
                });
                chart.series[0].setData(nomalCnt, false);
                chart.series[1].setData(existEvtCnt, false);
                chart.series[2].setData(sizeEvtCnt, false);
                chart.redraw();
		} });

	}, setCommonParam : function(data) {
		var addData = {};
		var grpNoArray = [];
		var _grpNo = Main.getGrpTreeValue();
		var _mngNo = 0;

		if (_grpNo != 0 && _grpNo.indexOf('_') != -1) {
			grpNoArray = _grpNo.split('_');
			_grpNo = grpNoArray[0];
			_mngNo =  grpNoArray[1];
		}

		var periodParams =  HmBoxCondition.getPeriodParams();

		addData['grpNo'] = _grpNo;
		addData['mngNo'] = _mngNo;
		addData['cbPeriod'] = $cbPeriod.val();
		addData['fromDate'] = periodParams.date1;
		addData['toDate'] = periodParams.date2;

		$.extend(data, addData);

		return data;
	},

	// 차트 tooltip
	chartTooltip : function($chart, value, itemIndex, series, group, categoryValue, categoryAxis) {
		var dataItem = $chart.jqxChart('source')[itemIndex];
		var s = '';
		s += '<div style="text-align: left;"><b>' + $.format.date(categoryValue, 'yyyy-MM-dd') + '</b><br>';
		$.each(group.series, function(idx, value) {
			s += value.displayText + ' : ' + dataItem[value.dataField] + '<br>';
		});
		s += '</div>';
		return s;
	},

	/** 그룹 트리 Value get */
	getGrpTreeValue : function() {
		var _grpNo = 0;
		var grpSelection = $grpTree.jqxTreeGrid('getSelection');
		if (!$.isEmpty(grpSelection) && grpSelection.length > 0) {
			_grpNo = grpSelection[0].grpNo;
		}
		return _grpNo;
	} };

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});