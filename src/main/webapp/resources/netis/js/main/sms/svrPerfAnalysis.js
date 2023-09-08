var $grpTree, $procGrid;
var $chart_xAxis;
var _mngNo;
var _sortTarget;
var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$procGrid = $('#procGrid');
		$chart_xAxis = null;
		this.initCondition();
	},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('_svrPerfAnalysis');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		$('#chartContainer').bind('mousemove touchmove touchstart', function (e) {
			var chart,
				point,
				i,
				event;

			chart = Highcharts.charts[0];
			event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
			point = chart.series[0].searchPoint(event, true); // Get the hovered point

			chart = Highcharts.charts[1];
			event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
			point = chart.series[0].searchPoint(event, true); // Get the hovered point

			chart = Highcharts.charts[2];
			event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
			point = chart.series[0].searchPoint(event, true); // Get the hovered point

			chart = Highcharts.charts[3];
			event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
			point = chart.series[0].searchPoint(event, true); // Get the hovered point

			for (i = 0; i < Highcharts.charts.length; i++) {
				chart = Highcharts.charts[i];
				event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
				point = chart.series[0].searchPoint(event, true); // Get the hovered point

				if (point) {
					point.highlight(event);
				}
			}
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnSearch": this.search(); break;
		}
	},
	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.search();
		}
	},
	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));

		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '40%' }, { size: '60%' }]);

		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.searchSvr, {devKind1 : 'SVR'});

		$('#ddlSvr').jqxDropDownButton({ width: 200, height: 22 }).on('open', function(event) {
				$('#svrGrid').css('display', 'block');
		});


		HmGrid.create($('#svrGrid'), {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					url: ctxPath + '/svr/getSvrList.do',
				},
				{
					formatData: function(data) {
						var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
						var treeItem = HmTreeGrid.getSelectedItem($grpTree);
						var grpSelection = $grpTree.jqxTreeGrid('getSelection');
						if(treeItem != null) {
							_itemKind = treeItem.devKind2;
							_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
							_grpParent = treeItem.grpParent;
						}
						$.extend(data, {
							grpType: _grpType,
							grpNo: _grpNo,
							grpParent: _grpParent,
							itemKind: _itemKind
						});
						return data;
					}
				}
			),
			columns:
				[
					{ text: '서버명', datafield: 'name', width: 150 },
					{ text: 'IP', datafield: 'ip', width: 120 },
					{ text: '종류', datafield: 'devKind2', width: 130 },
					{ text: '호스트명', datafield: 'dnsHostname', width: 150 }
				],
			width:560
		}, CtxMenu.DEV);

		$('#svrGrid').on('rowselect', function(event) {
			var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
			if(rowdata === undefined) return;
			var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.name + '</div>';
			$('#ddlSvr').jqxDropDownButton('setContent', content);

			//Main.searchNetwork();
		}).on('bindingcomplete', function(event) {
			$(this).jqxGrid('selectrow', 0);
			_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
			Main.searchNetwork();
		}).on('rowdoubleclick', function(event){
			_mngNo = event.args.row.bounddata.mngNo;
			$('#ddlSvr').jqxDropDownButton('close');
			Main.searchNetwork();
		});

		var source =  new $.jqx.dataAdapter({
				datatype : 'json',
				datafields:[
					{ name:'name', type:'string' },
					{ name:'pid', type:'string' },
					{ name:'cpuPct', type:'number' },
					{ name:'cpuPctMax', type:'number' },
					{ name:'cpuPctMin', type:'number' },
					{ name:'memPct', type:'number' },
					{ name:'memPctMax', type:'number' },
					{ name:'memPctMin', type:'number' },
					{ name:'memRss', type:'number' },
					{ name:'memRssMax', type:'number' },
					{ name:'memRssMin', type:'number' },
					{ name:'memShare', type:'number' },
					{ name:'memShareMax', type:'number' },
					{ name:'memShareMin', type:'number' },
					{ name:'memSize', type:'number' },
					{ name:'memSizeMax', type:'number' },
					{ name:'memSizeMin', type:'number' },
					{ name:'username', type:'string' },
					{ name:'state', type:'string' },
					{ name:'startTime', type:'string' },
					{ name:'cmdline', type:'string' },
				]
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
					$.extend(data, Main.getCommParams());
					$.extend(data, param);
					return data;
				},loadComplete : function(record) {
					switch (_sortTarget) {
						case 'CPU': case 'NETWORK': case 'IN BPS': case 'OUT BPS': case 'IN PPS': case 'OUT PPS':
							$procGrid.jqxGrid('sortby', 'cpuPct', 'desc');
							break;
						case 'MEMORY':
							$procGrid.jqxGrid('sortby', 'memPct', 'desc');
							break;
					}
				}
			}
		);

		HmGrid.create($procGrid, {
			source : source,
			columns : [
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


		HmDropDownList.create($('#cbNetwork'), { width: 200, dropDownWidth: 400, displayMember: 'name', valueMember: 'name', selectedIndex: 0 });

	},
	searchNetwork: function() {
		console.log('ddd');
		Server.get('/main/popup/svrDetail/getSummary_networkInterfaceInfo.do', {
			data: {mngNo: _mngNo},
			success: function(result) {
				if(result != null) {
					$('#cbNetwork').jqxDropDownList('clearSelection');
					$('#cbNetwork').jqxDropDownList({source: result});
					$('#cbNetwork').jqxDropDownList('insertAt', {label: '전체', value: 'ALL'}, 0);
					$('#cbNetwork').jqxDropDownList('selectedIndex', 0);
				}
			}
		});
	},


	searchSvr: function() {
		HmGrid.updateBoundData($('#svrGrid'), ctxPath + '/svr/getSvrList.do');
	},

	search : function(){
		$("#chartContainer")[0].innerHTML= '';
		$procGrid.jqxGrid('clear');

		Server.post("/main/sms/svrPerfAnalysis/getSvrPerfList.do", {
			data: Main.getCommParams(),
			success: function(result) {

				if(result!=null){
					var xAxis = result.xdata;

					var series;
					$.each(result.datasets, function (i, dataset) {

						switch(dataset.name){
							case 'CPU':
								dataset.data = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.cpuVal)];
								});
								series = [{
									data: dataset.data,
									name: dataset.name,
									type: dataset.type,
									fillOpacity: 0.3
								}];
								break;
							case 'MEMORY':
								dataset.data = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.memVal)];
								});
								series = [{
									data: dataset.data,
									name: dataset.name,
									type: dataset.type,
									fillOpacity: 0.3
								}];
								break;
							case 'BPS':
								dataset.indata = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.inbpsVal)];
								});
								dataset.outdata = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.outbpsVal)];
								});
								series = [{
									data: dataset.indata,
									name: "IN "+dataset.name,
									type: dataset.type,
									fillOpacity: 0.3
									}, {
										data: dataset.outdata,
										name: "OUT "+dataset.name,
										type: dataset.type,
										fillOpacity: 0.3
									}];
								break;
							case 'PPS':
								dataset.indata = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.inppsVal)];
								});
								dataset.outdata = Highcharts.map(dataset.data, function (val, j) {
									return [HmHighchart.change_date(xAxis[j]).getTime(), parseFloat(val.outppsVal)];
								});

								series = [{
									data: dataset.indata,
									name: "IN "+dataset.name,
									type: dataset.type,
									fillOpacity: 0.3
								}, {
									data: dataset.outdata,
									name: "OUT "+dataset.name,
									type: dataset.type,
									fillOpacity: 0.3
								}];
								break;
						}

						var title_name = dataset.name;
						var tooltip_valueDecimals = dataset.valueDecimals;

						var chartOptions = {
							chart: {
								spacingTop: 15,
								spacingBottom: 15,
								height: 200,
								marginLeft: 55,
								style:{
									borderBottom:'1px solid #e0e0e0'
								}
							},
							title: {
								text: title_name,
								align: 'center',
								x: 0,
								y: 5,
								style:{
									fontWeight:'bold',
									fontSize:'14px',
									background:'#e0e0e0'
								}
							},
							credits: {
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
									week: '%m-%d',
									month: '%Y %m',
									year: '%Y'
								}
							},
							yAxis: {
								crosshair: true,
								opposite: false,
								showLastLabel: true,
								title: {
									text: null
								},
								labels: {
									formatter: function() {
										if(series.length == 1){
											return this.value;
										}else{
											return HmUtil.convertUnit1000(Math.abs(this.value));
										}
									}
								}
							},
							plotOptions: {
								series: {
									showInNavigator: true,
									events: {
										click: function(e) {
											_sortTarget = e.point.series.name;
											var xAxis = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', e.point.category);
											var chg_xAxis = HmHighchart.getConvertTime( HmHighchart.change_date(xAxis),"","","" );

											$chart_xAxis = chg_xAxis;
											// 해당 시간의 프로세스 리스트 조회
											HmGrid.updateBoundData($procGrid, ctxPath + '/main/sms/svrPerfAnalysis/getProcessList.do');
										}
									}
								},
							},
							tooltip: {
								enabled: true,
								useHTML: true,
								shared: true,
								crosshairs: true,
								valueDecimals: tooltip_valueDecimals,
								formatter: function () {
									var points = this.points;
									if(points.length == 1){

										var valUnit = "";
										var sName = points[0].series.name;
										valUnit = "%";
										var xVal = this.x;
										var yVal = this.y;

										var s = '<b>' + $.format.date(new Date(xVal), 'yyyy-MM-dd HH:mm') + '</b>';

										s += '<br/>' + sName + ': ' + (yVal)+valUnit;
										return s;
									}else{

									// in value
									var in_name = points[0].series.name;
									var in_color = points[0].color;
									var in_val = HmUtil.convertUnit1000(Math.abs(points[0].y));
									// out value
									var out_name = points[1].series.name;
									var out_color = points[1].color;
									var out_val = HmUtil.convertUnit1000(Math.abs(points[1].y));

									var tooltip = '<span style="color:'+in_color+'">●</span> '+in_name+" : <b>"+in_val+"</b><br/>"
										+'<span style="color:'+out_color+'">●</span> '+out_name+" : <b>"+out_val+"</b>";

									var xVal = this.x;
									var points = this.points;
									var s = '<b>' + $.format.date(new Date(xVal), 'yyyy-MM-dd HH:mm') + '</b>';
									s += '<br/>' + tooltip;

									return s;
									}

								},
							},
							series: series
						};

						if( title_name == 'CPU' || title_name == 'MEMORY'){
							chartOptions.yAxis
								$.extend(chartOptions.yAxis,{
									min: 0, max: 100
								});
						};

						$('<div class="chart" id="chart_'+title_name+'">').appendTo('#chartContainer');

						// chart 생성
						HmHighchart.createStockChart('chart_'+title_name, chartOptions);
					});

				}
			}
		});
	},

		/** init data */
		initData : function() {

		},

		/** 공통 파라미터 */
		getCommParams: function() {
			var params = {
				mngNo: _mngNo,
				network: $('#cbNetwork').val()
			};
			$.extend(params, HmBoxCondition.getPeriodParams('_svrPerfAnalysis'));
			return params;
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
	// this.series.chart.tooltip.refresh(this); // Show the tooltip
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
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});