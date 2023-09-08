var $topChart, $topGrid, $histGrid;

var Main = {
	/** variable */
	initVariable : function() {
		$topChart = $('#topChart'), $topGrid = $('#topGrid');
		$histGrid = $('#histGrid');
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
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnSearch":	this.search();	break;
		case "btnExcel":		this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
		//검색바 호출.
		// Master.createSearchBar1($("#periodBox"),$("#dateBox"),'');

		HmJqxSplitter.create($('#contentSplitter'), HmJqxSplitter.ORIENTATION_V, [{size: '50%'}, {size: '50%'}], '100%', '100%', {showSplitBar: false});
	/*	Master.createPeriodCondition($cbPeriod, $('#date1'), $('#date2'));*/

		HmHighchart.create2($topChart.attr('id'), {
			yAxis: {
				title: {text: '접속수'},
				crosshair: true,
				opposite: false,
				showLastLabel: true,
				labels: {
					formatter:  function () {
						return HmUtil.commaNum(this.value);
					}
				}
			},
			tooltip: {
				shared: true,
				useHTML: true,
				valueSuffix: '',
				formatter: function() {
					var s = '<b>' + this.x + '</b>';
					s += '<table>';
					$.each(this.points, function() {
						s += '<tr><td style="color: ' + this.series.color + '">' + this.series.name + ': ' + this.y + '</td>';
					});
					s += '</table>';
					return s;
				}
			},
			legend: {enabled: false},
			series: [
				{name: '접속수', type: 'column', colorByPoint: true}
			]
		}, HmHighchart.TYPE_COLUMN);

		HmGrid.create($topGrid, {
			source: new $.jqx.dataAdapter({
				datatype: 'json',
				datafields:[
                    { name:'userId', type:'string' },
                    { name:'userName', type:'string' },
                    { name:'loginIp', type:'string' },
                    { name:'loginCnt', type:'number' },
				]
				// localdata: []
			}),
			//pageable: false,
			columns: [
				{text: '사용자ID', datafield: 'userId', width: '25%', cellsalign: 'center'},
				{text: '사용자명 ', datafield: 'userName', width: '25%'},
				{text: 'IP', datafield: 'loginIp', width: '25%', cellsalign: 'center'},
				{text: '접속수', datafield: 'loginCnt', width: '25%', cellsalign: 'right'}
			]
		}, CtxMenu.NONE);
		$topGrid.on('rowselect', function(event) {
			setTimeout(Main.searchHist, 100);
		});

		HmGrid.create($histGrid, {
			source : new $.jqx.dataAdapter({
				datatype : 'json',
				datafields: [
                    { name:'userId', type:'string' },
                    { name:'userName', type:'string' },
                    { name:'loginDate', type:'string' },
                    { name:'loginIp', type:'string' },
                    { name:'sessionId', type:'string' },
					{ name:'logoutDate', type:'string' },
				]
			}, {
				formatData : function(data) {
					var rowdata = HmGrid.getRowData($topGrid);
					$.extend(data, Main.getCommParams());
					if(rowdata != null) {
						data.sUserId = rowdata.userId;
						data.sLoginIp = rowdata.loginIp;
					}
					return data;
				}
			}),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '접속현황');
			},
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
			columns : [ 
				{text : '사용자ID', datafield : 'userId', 	width : '12%', cellsalign: 'center'},
				{text : '사용자명', datafield : 'userName',	width : '15%'	},
				{text : '로그인일시', datafield : 'loginDate', width : '16%', cellsalign: 'center'	},
				{text : '접속IP', datafield : 'loginIp' , minwidth : '15%', cellsalign: 'center'	},
				{text: 'SessionID ', datafield: 'sessionId', cellsalign: 'center'},
				{text : '로그아웃일시', datafield : 'logoutDate', width : '16%', cellsalign: 'center',  hidden: true	}
			]
		});

		$('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
		this.search();
	},

	getCommParams: function() {
		return HmBoxCondition.getPeriodParams();
	},

	search: function() {
		try {
			$histGrid.jqxGrid('clear');
		} catch(e) {}
		var params = Main.getCommParams();
		// params.topN = 5;
		Server.post('/main/env/loginHist/getLoginHistTopList.do', {
			data: params,
			success: function(result) {
				if(result != null){
					var chartData = result.slice(0, 5);
					var categories = [];
					$.each(chartData, function(i, v) {
						v.x = '{0}<br>[{1}]'.substitute(v.userName, v.loginIp);
						v.y = v.loginCnt;
						categories.push(v.x);
					});

					var chartDataArr = HmHighchart.convertJsonArrToChartDataArr('disText', ['loginCnt'], chartData);
					for(var i = 0; i < chartDataArr.length; i++) {
						HmHighchart.setSeriesData($topChart.attr('id'), i, chartDataArr[i], false);
					}
					$topChart.highcharts().xAxis[0].setCategories(categories, false);
					HmHighchart.redraw($topChart.attr('id'));

					HmGrid.setLocalData($topGrid, result);
				}
			}
		});
	},

	searchHist : function() {
	/*	Master.refreshCbPeriod($cbPeriod);*/
		HmGrid.updateBoundData($histGrid, ctxPath + '/main/env/loginHist/getLoginHist.do');
	},
	
	/** export Excel */
	exportExcel: function() {
		HmUtil.exportGrid($histGrid, '사용자접속이력', false);
//		var params = Master.getGrpTabParams();
//		$.extend(params, {
//			period: $cbPeriod.val(),
//			date1: HmDate.getDateStr($('#date1')),
//			time1: HmDate.getTimeStr($('#date1')),
//			date2: HmDate.getDateStr($('#date2')),
//			time2: HmDate.getTimeStr($('#date2')),
//			sIp: $('#sIp').val(),
//			sDevName: $('#sDevName').val()
//		});
//		
//		HmUtil.exportExcel(ctxPath + '/main/env/loginHist/export.do', params);
	}
	
	
	
	
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
