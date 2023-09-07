var $grpTree, $ifGrid;

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#grpTree');
		$ifGrid = $('#ifGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnIfGroupPop': this.ifGroupPop(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 405, collapsible: false }, { size: '100%' }], '100%', '100%');
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

		HmTreeGrid.create($grpTree, HmTree.T_GRP_IF, Main.searchIfList);

		$('#cbUnit').jqxDropDownList({ width: 80, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: [
			         { label: '5분단위', value: '5M' }
	         ],
	        displayMember: 'label', valueMember: 'value', selectedIndex: 0
		});

		HmBoxCondition.createRadio($('#cbPeriodType'), [
			{ label: '최근', value: 'REAL' },
			{ label: '이력', value: 'HIST' }
		]);

		$('#cbPeriodType').on('change', function(event){
			switch(event.target.value){
				case 'REAL':
					HmBoxCondition.changeRadioSource($('#cbTime'), [
							{ label: '최근1H', value: '1H' },
							{ label: '최근3H', value: '3H' },
							{ label: '최근6H', value: '6H' },
							{ label: '최근12H', value: '12H' }
						]
					);
					break;
				case 'HIST':
					HmBoxCondition.changeRadioSource($('#cbTime'), [
							{ label: '오늘', value: '0D' },
							{ label: '1일전', value: '1D' },
							{ label: '2일전', value: '2D' },
							{ label: '3일전', value: '3D' },
							{ label: '4일전', value: '4D' },
							{ label: '5일전', value: '5D' },
							{ label: '6일전', value: '6D' }
						]
					);
					break;
			}
		});

		HmBoxCondition.createRadio($('#cbTime'), [
			{ label: '최근1H', value: '1H' },
			{ label: '최근3H', value: '3H' },
			{ label: '최근6H', value: '6H' },
			{ label: '최근12H', value: '12H' }
		]);

		HmBoxCondition.createRadio($('#cbType'), [
			{ label: 'bps', value: 'bps' },
			{ label: 'bps(%)', value: 'bpsPer' },
			{ label: 'pps', value: 'pps' },
			{ label: 'Err/Crc/Collision', value: 'ecc' }
		]);

		HmGrid.create($ifGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					datafields: [
						{ name: 'strKey', type: 'string' },
						{ name: 'mngNo', type: 'number' },
						{ name: 'ifIdx', type: 'number' },
						{ name: 'ifName', type: 'string' },
						{ name: 'ifAlias', type: 'string' },
						{ name: 'lineWidth', type: 'string' },
						{ name: 'status', type: 'string' }
					]
				},
				{
					formatData: function(data) {
						var params = Master.getGrpTabParams();
						var treeItem = HmTreeGrid.getSelectedItem($grpTree);
						$.extend(data, params, {
							grpNo: treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
						});
						return data;
					}
				}
			),
			showtoolbar: true,
			rendertoolbar: function(toolbar) {
				HmGrid.titlerenderer(toolbar, '회선');
			},
			selectionmode: 'checkbox',
			width: '100%',
			columns:
				[
				{ text : '회선명', datafield : 'ifName', minwidth : 100, cellsrenderer: HmGrid.ifAliasrenderer },
				{ text : '대역폭', datafield : 'lineWidth', width : 80, cellsrenderer: HmGrid.unit1000renderer },
				{ text : '상태', datafield : 'status', width : 80,  cellsrenderer: HmGrid.ifStatusrenderer}
			]
		});
		$('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
		
	},

	searchIfList: function() {
		HmGrid.updateBoundData($ifGrid, ctxPath + '/main/nms/ifGraph/getIfComboList.do' );
	},
	
	search: function() {

		var _searchIfs = [];
		var rowIdxes = HmGrid.getRowIdxes($ifGrid);

		$.each(rowIdxes, function(idx,value){
			_searchIfs.push($ifGrid.jqxGrid('getrowdata', value).strKey);
		});

		if(_searchIfs.length == 0) {
			alert('회선을 선택해주세요.');
			return;
		}


		Server.post('/main/nms/ifGraph/getIfPerfChartList.do', {
			data: { sUnit: $('#cbUnit').val(), sTime: HmBoxCondition.val('cbTime'), searchIfs: _searchIfs },
			success: function(result) {
//				result = [{devName: 'dev1', ifName: 'if1', perfList: [
//					        	{ ymdhms: '2016-12-01 01:00:00', devName: 'test', ifName: 'ifName', inbpsPer: Math.ceil(Math.random() * 1000), outbpsPer: Math.ceil(Math.random() * 1000) },
//					        	{ ymdhms: '2016-12-01 02:00:00', devName: 'test', ifName: 'ifName', inbpsPer: Math.ceil(Math.random() * 1000), outbpsPer: Math.ceil(Math.random() * 1000) },
//					        	{ ymdhms: '2016-12-01 03:00:00', devName: 'test', ifName: 'ifName', inbpsPer: Math.ceil(Math.random() * 1000), outbpsPer: Math.ceil(Math.random() * 1000) },
//					        	{ ymdhms: '2016-12-01 04:00:00', devName: 'test', ifName: 'ifName', inbpsPer: Math.ceil(Math.random() * 1000), outbpsPer: Math.ceil(Math.random() * 1000) },
//					        	{ ymdhms: '2016-12-01 05:00:00', devName: 'test', ifName: 'ifName', inbpsPer: Math.ceil(Math.random() * 1000), outbpsPer: Math.ceil(Math.random() * 1000) }
//					        ]}];
				if(result != null && result.length > 0) Main.drawChart(result);
				else alert('검색된 데이터가 없습니다.');
			}
		});

		$('#chartArea').empty();
	},
	
	drawChart: function(data) {
		// 차트 초기화
		for(var i = 0; i < data.length; i++) {
		 	var chartId = 'chart' + i;
		 	$('#chartArea').append('<div style="border: 1px solid #eeeeee; width: 99.5%; height: 200px; margin-bottom: 5px;"><div id="' + chartId + '" style="width: 100%; height: 100%;"></div></div>');
			var series = {};

			switch(HmBoxCondition.val('cbType')) {
				case 'bpsPer':
					series = {series: [
							{name: 'IN BPS(%)', type: 'area', xField: 'dtYmdhms', yField: 'inbpsPer'},
							{name: 'OUT BPS(%)', type: 'area', xField: 'dtYmdhms', yField: 'outbpsPer'}
						]
						, chartConfig: { unit: 'pct' }};
					break;
				case 'pps':
					series = {series: [
							{name: 'In pps', type: 'area', xField: 'dtYmdhms', yField: 'inpps'},
							{name: 'Out pps', type: 'area', xField: 'dtYmdhms', yField: 'outpps'}
						]
						, chartConfig: { unit: '1000' }};
					break;
				case 'ecc':
					series = {series: [
							{name: 'err', type: 'area', xField: 'dtYmdhms', yField: 'err'},
							{name: 'crc', type: 'area', xField: 'dtYmdhms', yField: 'crc'},
							{name: 'collision', type: 'area', xField: 'dtYmdhms', yField: 'collision'},
						]
						, chartConfig: { unit: '1000' }};
					break;
				default:
					series = {series: [
							{name: 'In bps', type: 'area', xField: 'dtYmdhms', yField: 'inbps'},
							{name: 'Out bps', type: 'area', xField: 'dtYmdhms', yField: 'outbps'}
						]
						, chartConfig: { unit: '1000' }};
					break;
			}

			var userOptions = {
				chart: {
					marginTop: 30,
					marginBottom: 70
				}
			}
			$.extend(series, userOptions)
			var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
			$chart.initialize();

			var title = data[i].devName + ' - ' + data[i].ifName;

			var chartData = {};
			var xFieldArr = [], yFieldArr = [];

			$.each(series.series, function(si, sv) {
				xFieldArr.push(sv.xField);
				yFieldArr.push(sv.yField);
				chartData[si] = [];
			});

			$.each(data[i].perfList, function(i, v) {
				for(var sidx in xFieldArr) {
					var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
					chartData[sidx].push([v[_xField], v[_yField]]);
				}
			});

			$.each(series.series, function(si, sv) {
				HmHighchart.setSeriesData(chartId, si, chartData[si], false);
			});
			$('#'+chartId).highcharts().setTitle({
				text: title,
				style: {fontSize: '12px', fontWeight: 'bold'}
			});
			HmHighchart.redraw(chartId);

		}

	},

	ifGroupPop: function(){
		HmUtil.createPopup('/main/popup/nms/pIfGroupMgmt.do', $('#hForm'), ' pIfGroup', 1300, 700);
	},

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
