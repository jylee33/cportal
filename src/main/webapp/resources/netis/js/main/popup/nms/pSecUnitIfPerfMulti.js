var p_typeChanged = false;
var p_webSocket;
var p_chartData = [], p_gridData = [];
var beforeVal = null;
var inbpsList = [], outbpsList = [], inppsList = [], outppsList = [];

$(function() {
	PSecUnitIfPerf.initVariable();
	PSecUnitIfPerf.observe();
	PSecUnitIfPerf.initDesign();
	PSecUnitIfPerf.initData();
});

var PSecUnitIfPerf = {
		/** variable */
		initVariable: function() {
			
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PSecUnitIfPerf.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnStart': this.pwindow_start(); break;
			case 'pbtnPause': this.pwindow_stop(); break;
			case 'pbtnClose': { this.pwindow_stop(); self.close(); break; }
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#p_cTime').jqxDropDownList({ width: '80px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
				source: [
				         { label: '1분', value: 1 }, 
				         { label: '5분', value: 5 }, 
				         { label: '10분', value: 10 }, 
				         { label: '20분', value: 20 }
				         ], 
				displayMember: 'label', valueMember: 'value', selectedIndex: 0
			});
			$('#p_reqCycle').jqxDropDownList({ width: '80px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
				source: [
				         { label: '2초', value: 2 }, 
				         { label: '5초', value: 5 }, 
				         { label: '10초', value: 10 }, 
				         { label: '30초', value: 30 },
				         { label: '60초', value: 60 }
				         ], 
				displayMember: 'label', valueMember: 'value', selectedIndex: 0
			});
			var settings = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_SECOND, HmChart2.unit1000FormatFn);
			settings.source = p_chartData;
			settings.padding = { left: 15, top: 0, right: 15, bottom: 0 };
			settings.title = 'BPS';
			$.extend(settings, {
				seriesGroups: [
				               HmChart2.getSeriesGroup($('#p_bpsChart'), HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
			            		   HmChart2.getSeries(
										['inbps', 'outbps'], 
										['IN', 'OUT'],
										false
			            		   )
				               )
			               ]
			});
//			HmChart2.create($('#p_bpsChart'), settings);
//			var settings2 = HmChart2.getCommOptions(HmChart2.T_LINE, HmChart2.XUNIT_SECOND, HmChart2.unit1000FormatFn);
//			settings2.source = p_chartData;
//			settings2.padding = { left: 15, top: 0, right: 15, bottom: 0 };
//			settings2.title = 'PPS';
//			$.extend(settings2, {
//				seriesGroups: [
//				               HmChart2.getSeriesGroup($('#p_ppsChart'), HmChart2.T_LINE, HmChart2.unit1000ToolTipFormatFn, 
//			            		   HmChart2.getSeries(
//										['inpps', 'outpps'], 
//										['IN', 'OUT'],
//										false
//			            		   )
//				               )
//			               ]
//			});
//			HmChart2.create($('#p_ppsChart'), settings2);
			PSecUnitIfPerf.drawChart();
			
			HmGrid.create($('#p_perfGrid'), {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							localdata: p_gridData
						}
				),
				columns: 
				[
				 	{ text: '일시', datafield: 'ymdhms', width: '20%' },
				 	{ text: 'IN', columngroup: 'bps', datafield: 'inbps', width: '20%', cellsrenderer: HmGrid.unit1000renderer },
				 	{ text: 'OUT', columngroup: 'bps', datafield: 'outbps', width: '20%', cellsrenderer: HmGrid.unit1000renderer },
				 	{ text: 'IN', columngroup: 'pps', datafield: 'inpps', width: '20%', cellsrenderer: HmGrid.unit1000renderer },
				 	{ text: 'OUT', columngroup: 'pps', datafield: 'outpps', width: '20%', cellsrenderer: HmGrid.unit1000renderer }
				],
				pageable: false,
				columngroups: 
				[
					{ text: 'BPS', name: 'bps', align: 'center' }, 
					{ text: 'PPS', name: 'pps', align: 'center' } 
				]
			});
		},
		
		/** init data */
		initData: function() {
			PSecUnitIfPerf.searchDev();
		},
		
		pwindow_start: function(){
			$('#pbtnStart').css('display', 'none');
			$('#pbtnPause').css('display', 'block');
			$('#p_cTime, #p_reqCycle').jqxDropDownList({ disabled: true });
			p_chartData.length = 0;
			p_gridData.length = 0;
			inbpsList.length = 0;
			outbpsList.length = 0;
			inppsList.length = 0;
			outppsList.length = 0;
			
			var p_bpsChart = $('#p_bpsChart').highcharts();
			var p_ppsChart = $('#p_ppsChart').highcharts();
			p_bpsChart.destroy();
			p_ppsChart.destroy();
		    PSecUnitIfPerf.drawChart();
		    
			if(p_webSocket !== undefined && p_webSocket.readyState != WebSocket.CLOSED) {
				alert("WebSocket is already opened.");
				return;
			}		
			var ctxPath = $('#ctxPath').val();
			p_webSocket = new WebSocket('ws://' + location.host + '/' + ctxPath + '/nws');
			p_webSocket.onopen = function(event) {
				PSecUnitIfPerf.pwindow_send();
			};
			
			p_webSocket.onmessage = function(event) {
				if(event.data == 'Connection Established') return;
				var result = event.data.split('|');
				if(result[0] == 'STOP') {
					PSecUnitIfPerf.pwindow_stop();
					alert(result[1]);
				}
				else {
					PSecUnitIfPerf.pwindow_recvData(event.data);
				}
			};
			
			p_webSocket.onclose = function(event) {
				console.log('socket is closed.');
			};
		},
		
		/**
		*	SNMPVer=1 (32bit)
				#define ifInOctets  ".1.3.6.1.2.1.2.2.1.10"
				#define ifOutOctets  ".1.3.6.1.2.1.2.2.1.16"
				#define ifInUcastPkts		".1.3.6.1.2.1.2.2.1.11" 
				#define ifOutUcastPkts		".1.3.6.1.2.1.2.2.1.17"
			
			SNMPVer=2이상 (64bit)
				#define ifHCInOctets ".1.3.6.1.2.1.31.1.1.1.6"
				#define ifHCOutOctets ".1.3.6.1.2.1.31.1.1.1.10"
				#define ifHCInUcastPkts		".1.3.6.1.2.1.31.1.1.1.7" 
				#define ifHCOutUcastPkts	".1.3.6.1.2.1.31.1.1.1.11"
				
			예외상황
				벤더가 CISCO이고 회선명이 SE, E1, BR, NU로 시작하는 경우 SNMP버전 상관없이 32BIT OID를 사용한다.

		*/
		pwindow_send: function() {
			var oids = null;
			var _vendor = $('#pVendor').val().toUpperCase();
			var _ifName = $('#pIfName').val().toUpperCase();
			if(_vendor == "CISCO") {
				_ifName = _ifName.length >= 2? _ifName.substr(0, 2) : _ifName;
				if(_ifName == "SE" || _ifName == "E1" || _ifName == "BR" || _ifName == "NU") {
					oids = "1.3.6.1.2.1.2.2.1.10|1.3.6.1.2.1.2.2.1.16|1.3.6.1.2.1.2.2.1.11|1.3.6.1.2.1.2.2.1.17";
				}
				else {
					switch($('#pSnmpVer').val()) {
					case '1': oids = "1.3.6.1.2.1.2.2.1.10|1.3.6.1.2.1.2.2.1.16|1.3.6.1.2.1.2.2.1.11|1.3.6.1.2.1.2.2.1.17"; break;
					case '2': case '3': oids = "1.3.6.1.2.1.31.1.1.1.6|1.3.6.1.2.1.31.1.1.1.10|1.3.6.1.2.1.31.1.1.1.7|1.3.6.1.2.1.31.1.1.1.11"; break;
					default: 
						alert('SNMP Ver이 존재하지 않습니다.'); 
						pwindow_stop();
						return;
					}		
				}
			}
			else {
				switch($('#pSnmpVer').val()) {
				case '1': oids = "1.3.6.1.2.1.2.2.1.10|1.3.6.1.2.1.2.2.1.16|1.3.6.1.2.1.2.2.1.11|1.3.6.1.2.1.2.2.1.17"; break;
				case '2': case '3': oids = "1.3.6.1.2.1.31.1.1.1.6|1.3.6.1.2.1.31.1.1.1.10|1.3.6.1.2.1.31.1.1.1.7|1.3.6.1.2.1.31.1.1.1.11"; break;
				default: 
					alert('SNMP Ver이 존재하지 않습니다.'); 
					pwindow_stop();
					return;
				}
			}
			
			var params = {
					pktType: 'SecUnitIfPerf',
					devIp: $('#pDevIp').val(),
					ifIdx: $('#pIfIdx').val(),
					community: $('#pCommunity').val(),
					snmpVer: $('#pSnmpVer').val(),
					snmpUserId: $('#pSnmpUserId').val(),
					snmpSecurityLevel: $('#pSnmpSecurityLevel').val(),
					snmpAuthType: $('#pSnmpAuthType').val(),
					snmpAuthKey: $('#pSnmpAuthKey').val(),
					snmpEncryptType: $('#pSnmpEncryptType').val(),
					snmpEncryptKey: $('#pSnmpEncryptKey').val(),
					oid: oids,
					cTime: $('#p_cTime').val(),
					reqCycle: $('#p_reqCycle').val()
			};
			p_webSocket.send(JSON.stringify(params));
		},
		
		pwindow_recvData: function(data) {
			var result = data.split('|');
			if(result.length < 3) return;
			var newData = { ymdhms: $.format.date(new Date(), 'yyyy-MM-dd HH:mm:ss'), 
									inbps: result[0], outbps: result[1], inpps: result[2], outpps: result[3] };
			// 이전값을 관리.. 새로운값이 수집되면 이전값과의 차이값을 구하여 표시.. 수집값이 누적치이므로..
			if(beforeVal == null) {
				beforeVal = [newData.inbps, newData.outbps, newData.inpps, newData.outpps];
				return;
			}
			
			var addData = { ymdhms: newData.ymdhms, inbps: newData.inbps - beforeVal[0], outbps: newData.outbps - beforeVal[1],
									inpps: newData.inpps - beforeVal[2], outpps: newData.outpps - beforeVal[3] };
			beforeVal = [ newData.inbps, newData.outbps, newData.inpps, newData.outpps ];
			inbpsList.push(addData.inbps);
			outbpsList.push(addData.outbps);
			inppsList.push(addData.inpps);
			outppsList.push(addData.outpps);
			p_chartData.push(addData);
			p_gridData.splice(0, 0, addData);
			
			p_bpsChart.series[0].addPoint([date.getTime(), addData.inbps]);
			p_bpsChart.series[1].addPoint([date.getTime(), addData.outbps]);
			p_ppsChart.series[0].addPoint([date.getTime(), addData.inpps]);
			p_ppsChart.series[1].addPoint([date.getTime(), addData.outpps]);
			
			p_bpsChart.redraw();
			p_ppsChart.redraw();
			
			$('#p_perfGrid').jqxGrid('updatebounddata');

			// 차트 옆에 MAX/AVG값을 계산하여 표시
			$('#p_maxInbps').text(HmUtil.convertUnit1000(Math.max.apply(null, inbpsList)));
			$('#p_maxOutbps').text(HmUtil.convertUnit1000(Math.max.apply(null, outbpsList)));
			var sum = inbpsList.reduce(function(a, b) { return a + b; });
			$('#p_avgInbps').text(HmUtil.convertUnit1000(sum / inbpsList.length));
			sum = outbpsList.reduce(function(a, b) { return a + b; });
			$('#p_avgOutbps').text(HmUtil.convertUnit1000(sum / outbpsList.length));
			$('#p_maxInpps').text(HmUtil.convertUnit1000(Math.max.apply(null, inppsList)));
			$('#p_maxOutpps').text(HmUtil.convertUnit1000(Math.max.apply(null, outppsList)));
			sum = inppsList.reduce(function(a, b) { return a + b; });
			$('#p_avgInpps').text(HmUtil.convertUnit1000(sum / inppsList.length));
			sum = outppsList.reduce(function(a, b) { return a + b; });
			$('#p_avgOutpps').text(HmUtil.convertUnit1000(sum / outppsList.length));
		},
		
		pwindow_stop: function() {
			$('#pbtnStart').css('display', 'block');
			$('#pbtnPause').css('display', 'none');
			$('#p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
			if(p_webSocket !== undefined && p_webSocket.readyState != WebSocket.CLOSED) {
				p_webSocket.close();
			}
		},
		drawChart: function(){
			var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);
			options.boost= {useGPUTranslations: true};
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
			options.series= [{name: 'IN', data: null, lineWidth: 0.5}, {name: 'OUT', data: null, lineWidth: 0.5}];
			
			HmHighchart.create2('p_bpsChart', options);
			HmHighchart.create2('p_ppsChart', options);
			var p_bpsChart = $('#p_bpsChart').highcharts();
			var p_ppsChart = $('#p_ppsChart').highcharts();
			
			p_bpsChart.yAxis[0].axisTitle.attr({
		        text: 'BPS'
		    });
			p_ppsChart.yAxis[0].axisTitle.attr({
		        text: 'PPS'
		    });
		}
}
