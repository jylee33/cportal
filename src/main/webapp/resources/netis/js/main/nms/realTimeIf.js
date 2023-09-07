var p_typeChanged = false,  p_timeChanged = false;
var timer;

var Main = {
	/** variable */
	initVariable : function() {
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
		case "btnSearch":
			this.search();
			break;
		case 'btnConf':
			this.setChartPopup();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		$('#splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'vertical', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#l_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#l1_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#l2_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#r_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#r1_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });
		$('#r2_splitter').jqxSplitter({ width : '100%', height : '100%', orientation : 'horizontal', showSplitBar: false, panels : [
				{ size : '50%', collapsible : false }, { size : '50%' }
		] });

		$('#prgrsBar').jqxProgressBar({ width : 100, height : 21, theme : jqxTheme, showText : true, animationDuration: 0 });
		$('#prgrsBar').on('complete', function(event) {
			Main.search();
			$(this).val(0);

		});
		$('#cbRefreshCycle').jqxDropDownList(
				{
					width : 100,
					height : 21,
					theme : jqxTheme,
					autoDropDownHeight : true,
					source : [
							{ label : 'NONE', value : 0 }, { label : '30초', value : 30 }, { label : '1분', value : 60 }, { label : '2분', value : 120 }, { label : '3분', value : 180 },
							{ label : '4분', value : 240 }, { label : '5분', value : 300 }
					], displayMember : 'label', valueMember : 'value', selectedIndex : 1 }).on('change', function() {
			Main.chgRefreshCycle();
		});
		$('#p_cbTime').jqxDropDownList(
				{
					width : 140,
					height : 21,
					theme : jqxTheme,
					autoDropDownHeight : true,
					source : [
							{ label : '최근 30분', value : 30 }, { label : '최근 1시간', value : 60 }, { label : '최근 1일', value : 1440 }, { label : '최근 2일', value : 2880 },
							{ label : '최근 3일', value : 4320 }, { label : '최근 4일', value : 5760 }, { label : '최근 5일', value : 7200 }
					], displayMember : 'label', valueMember : 'value', selectedIndex : 0 }).on('change', function (event) {
			p_timeChanged = true;
		});
		$('#p_cbPerfType').jqxDropDownList({ width : 140, height : 21, theme : jqxTheme, autoDropDownHeight : true, source : [
				{ label : 'In/Out BPS', value : 'BPS' }, { label : 'In/Out BPS(%)', value : 'BPSPER' }, { label : 'In/Out PPS', value : 'PPS' }, { label : 'Err/CRC/Collision', value : 'ERR' }
		], displayMember : 'label', valueMember : 'value', selectedIndex : 0 }).on('change', function(event) {
			p_typeChanged = true;
			this.search();
		});

		var bpsSettings = HmChart2.getCommOptions(HmChart2.T_AREA, HmChart2.XUNIT_HOUR, HmChart2.unit1000FormatFn);
		$.extend(bpsSettings.xAxis, { dataField : 'ymdhms', type : 'date', labels: {
				rotationPoint: 'topright',
				angle: 0,
				offset: { x: 0, y: 0 }
			}, baseUnit : HmChart2.XUNIT_MINUTE, dateFormat : 'yyyy-MM-dd HH:mm:ss', formatFunction : function(value) {
			return $.format.date(value, 'dd일 HH시mm분');
		} });
		for (var i = 1; i < 9; i++) {
			$.extend(bpsSettings, { seriesGroups : [
				HmChart2.getSeriesGroup($('#RTimeChart' + i), HmChart2.T_AREA, HmChart2.unit1000ToolTipFormatFn, HmChart2.getSeries([
						'avgInbps', 'avgOutbps'
				], [
						'In Bps', 'Out Bps'
				], false))
			] });
			HmChart2.create($('#RTimeChart' + i), bpsSettings);
		}

		$('#section').css('display', 'block');
	},

	/** init data */
	initData : function() {
		Main.chgRefreshCycle();
	}, search : function() {
		var _itemType = $('#p_cbPerfType').val(), _formatFn = null, _tooltipFormatFn = null;
		switch (_itemType) {
		case 'BPS':
			_formatFn = HmChart2.unit1000FormatFn;
			_tooltipFormatFn = HmChart2.unit1000ToolTipFormatFn;
			break;
		case 'BPSPER':
			break;
		case 'PPS':
			_formatFn = HmChart2.unit1000FormatFn;
			_tooltipFormatFn = HmChart2.unit1000ToolTipFormatFn;
			break;
		case 'ERR':
			break;
		default:
			return;
		}
		var _list = [];

		var _seriesGroups = null;
		for (var i = 1; i < 9; i++) {
			if (p_typeChanged) {
				switch (_itemType) {
				case 'BPS':
					_seriesGroups = [
						HmChart2.getSeriesGroup($('#RTimeChart' + i), HmChart2.T_AREA, _tooltipFormatFn, HmChart2.getSeries([
								'avgInbps', 'avgOutbps'
						], [
								'In Bps', 'Out Bps'
						], false))
					];
					break;
				case 'BPSPER':
					_seriesGroups = [
						HmChart2.getSeriesGroup($('#RTimeChart' + i), HmChart2.T_AREA, _tooltipFormatFn, HmChart2.getSeries([
								'avgInbpsPer', 'avgOutbpsPer'
						], [
								'In Bps(%)', 'Out Bps(%)'
						], false))
					];
					break;
				case 'PPS':
					_seriesGroups = [
						HmChart2.getSeriesGroup($('#RTimeChart' + i), HmChart2.T_AREA, _tooltipFormatFn, HmChart2.getSeries([
								'avgInpps', 'avgOutpps'
						], [
								'In Pps', 'Out Pps'
						], false))
					];
					break;
				case 'ERR':
					_seriesGroups = [
						HmChart2.getSeriesGroup($('#RTimeChart' + i), HmChart2.T_LINE, _tooltipFormatFn, HmChart2.getSeries([
								'avgErr', 'avgCrc', 'avgCollision'
						], [
								'Err', 'CRC', 'Collision'
						], false))
					];
					break;
				}
				;
				var tmp = $('#RTimeChart' + i).jqxChart('valueAxis');
				if (_itemType == 'BPSPER') {
					tmp.formatSettings = { sufix : ' %' };
					tmp.formatFunction = null;
				} else {
					tmp.formatFunction = _formatFn;
				}
				var tmp2 = $('#RTimeChart' + i).jqxChart('valueAxis');

				$('#RTimeChart' + i).jqxChart('valueAxis', tmp);
				$('#RTimeChart' + i).jqxChart('seriesGroups', _seriesGroups);
			}
		}// for setting문
		p_typeChanged = false;


		// 기간변경시
		for (var i = 1; i <9 ;i++){
			if (p_timeChanged) {
				var cbTime = $('#p_cbTime').val();
				switch (cbTime) {
					case '2880':
					case '4320':
					case '5760':
					case '7200':
						$('#RTimeChart' + i).jqxChart({ 'xAxis': { 'baseUnit' : HmChart2.XUNIT_HOUR, 'dateFormat' : 'yyyy-MM-dd HH:mm:ss', 'type' : 'date',
								gridLines: {
									visible: true,
									step: 99999
								}, dataField : 'ymdhms'
								, formatFunction : function(value) {
									return $.format.date(value, 'dd일 HH시');
								} }});
						break;
					default:
						$('#RTimeChart' + i).jqxChart({ 'xAxis': { 'baseUnit' : HmChart2.XUNIT_MINUTE, 'dateFormat' : 'yyyy-MM-dd HH:mm:ss', 'type' : 'date',
								gridLines: {
									visible: true,
									step: 99999
								}, dataField : 'ymdhms'
								, formatFunction : function(value) {
									return $.format.date(value, 'dd일 HH시mm분');
								} }});
						break;
						break;
				}
				$('#RTimeChart' + i).jqxChart('update');
			}
		}
		p_timeChanged = false;


		Server.post('/main/nms/realTimeIf/getRealTimeIfChart.do', { data : { time : $('#p_cbTime').val() }, success : function(result) {
			$.each(result, function(idx, value) {
				var chartObj = $('#RTimeChart' + value.shLocation);
				chartObj.jqxChart('title', value.devName + ' [' + value.ifName + ']');
				chartObj.jqxChart('source', value.perfList);
				chartObj.jqxChart('update');
			});
		} });
	},

	/** 새로고침 주기 변경 */
	chgRefreshCycle : function() {
		var cycle = $('#cbRefreshCycle').val();
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
	/* 설정팝업 */
	setChartPopup : function() {
		// HmUtil.createPopup('/main/popup/nms/pRealTimeIfSetChart.do',
		// $('#hForm'), 'pConf', 720, 480);
		HmWindow.create($('#pwindow'), 800, 350);
		$.post(ctxPath + '/main/popup/nms/pRealTimeIfSetChart.do', null, function(result) {
			HmWindow.open($('#pwindow'), '실시간 회선 변경 ', result, 578, 350);
		});

	} };

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
