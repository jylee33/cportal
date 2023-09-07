var p_webSocket;
var p_chartData = [], p_gridData = [];
var p_curPerfType = 'CPU';
var p_cpuUserOid = $('#pCpuUserOid').val() != '' ? $('#pCpuUserOid').val(): 'NONE' ;
var p_cpuIdleOid = $('#pCpuIdleOid').val()!= '' ? $('#pCpuIdleOid').val(): 'NONE' ;
var p_memUseOid = $('#pMemUseOid').val()!= '' ? $('#pMemUseOid').val(): 'NONE' ;
var p_memFreeOid = $('#pMemFreeOid').val()!= '' ? $('#pMemFreeOid').val(): 'NONE' ;
var p_memTotalOid = $('#pMemTotalOid').val()!= '' ? $('#pMemTotalOid').val(): 'NONE' ;
var p_memCachedOid = $('#pMemCachedOid').val()!= '' ? $('#pMemCachedOid').val(): 'NONE' ;
var p_memUsePctOid = $('#pMemUsePctOid').val()!= '' ? $('#pMemUsePctOid').val(): 'NONE' ;
var p_tempOid = $('#pTempOid').val()!= '' ? $('#pTempOid').val(): 'NONE' ;
var p_sessCntOid = $('#pSessCntOid').val()!= '' ? $('#pSessCntOid').val(): 'NONE' ;

$(function() {
	PSecUnitDevPerf.initVariable();
	PSecUnitDevPerf.observe();
	PSecUnitDevPerf.initDesign();
	PSecUnitDevPerf.initData();
});

var PSecUnitDevPerf = {
		/** variable */
		initVariable: function() {
			
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PSecUnitDevPerf.eventControl(event); });
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
			var pt_source = [];
			var tmp = '';
			if(p_cpuUserOid != 'NONE') tmp = p_cpuUserOid;
			else tmp = p_cpuIdleOid;
			pt_source.push({ label: 'CPU', value: tmp });
			tmp = '';
			if(p_memUsePctOid != 'NONE') tmp = p_memUsePctOid;
			else {
				if(p_memUseOid != 'NONE') tmp = p_memUseOid;
				if(p_memFreeOid != 'NONE') {
					if(tmp.length > 0) tmp += '|';
					tmp += p_memFreeOid;
				}
				if(p_memTotalOid != 'NONE') {
					if(tmp.length > 0) tmp += '|';
					tmp += p_memTotalOid;
				}
			}
			pt_source.push({ label: 'MEMORY', value: tmp });
			
			$('#p_cbPerfType').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
				source: pt_source, 
				displayMember: 'label', valueMember: 'value', selectedIndex: 0
			});
			
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
			PSecUnitDevPerf.drawChart();
			
			HmGrid.create($('#p_perfGrid'), {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							localdata: p_gridData
						}
				),
				pageable: false,
				columns: 
				[
				 	{ text: '일시', datafield: 'ymdhms' },
				 	{ text: '성능값', datafield: 'val', cellsalign: 'right' }
				]
			}, CtxMenu.NONE);
		},
		
		/** init data */
		initData: function() {
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
//	 		options.yAxis.title = p_curPerfType;
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
			options.series= [{name: p_curPerfType, data: null, lineWidth: 0.5}];
			
			HmHighchart.create2('p_chart', options);
		},
		
		pwindow_start: function(){
			if($('#p_cbPerfType').val() == 'NONE') {
				alert('OID가 설정되어 있지 않습니다. (OID=NONE)');
				return;
			}
			
			// 초기화
			$('#pbtnStart').css('display', 'none');
			$('#pbtnPause').css('display', 'block');
			$('#p_cbPerfType, #p_cTime, #p_reqCycle').jqxDropDownList({ disabled: true });
			p_chartData.length = 0;
			p_gridData.length = 0;
			
			// web socket
			if(p_webSocket !== undefined && p_webSocket.readyState != WebSocket.CLOSED) {
				alert("WebSocket is already opened.");
				return;
			}		
			console.log(p_webSocket)
			var ctxPath = $('#ctxPath').val();
			p_webSocket = new WebSocket('ws://' + location.host + '/' + ctxPath + '/nws');
			console.log(p_webSocket)
			p_webSocket.onopen = function(event) {
				PSecUnitDevPerf.pwindow_send();
			};
			
			p_webSocket.onmessage = function(event) {
				if(event.data == 'Connection Established') return;
				var result = event.data.split('|');
				if(result[0] == 'STOP') {
					PSecUnitDevPerf.pwindow_stop();
					console.log(result[1])
					alert(result[1]);
				}
				else {
					PSecUnitDevPerf.pwindow_recvData(event.data);
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
			p_curPerfType = $('#p_cbPerfType').jqxDropDownList('getSelectedItem').label;
//			$('#p_chart').jqxChart('seriesGroups')[0].series[0].displayText = p_curPerfType;
			var p_chart = $('#p_chart').highcharts();
			p_chart.yAxis[0].axisTitle.attr({
		        text: p_curPerfType
		    });
			
			var params = {
					pktType: 'SecUnitDevPerf',
					perfType: p_curPerfType,
//					uuid: Math.round(),
					devIp: $('#pDevIp').val(),
					community: $('#pCommunity').val(),
					snmpVer: $('#pSnmpVer').val(),
					snmpUserId: $('#pSnmpUserId').val(),
					snmpSecurityLevel: $('#pSnmpSecurityLevel').val(),
					snmpAuthType: $('#pSnmpAuthType').val(),
					snmpAuthKey: $('#pSnmpAuthKey').val(),
					snmpEncryptType: $('#pSnmpEncryptType').val(),
					snmpEncryptKey: $('#pSnmpEncryptKey').val(),
					oid: $('#p_cbPerfType').val(),
					cTime: $('#p_cTime').val(),
					reqCycle: $('#p_reqCycle').val()
			};
			p_webSocket.send(JSON.stringify(params));
		},
		
		pwindow_recvData: function(data) {
			var result = data.split('|');
			var perfVal = 0;
			switch(p_curPerfType) {
			case 'CPU':
				if(p_cpuUserOid != 'NONE') perfVal = result[0];
				else perfVal = 100 - result[0];
				break;
			case 'MEMORY':
				if(p_memUsePctOid != 'NONE') perfVal = result[0];
				else {
					var total = 0, free = 0, use = 0, idx = 0;
					if(p_memUseOid != 'NONE') use = parseFloat(result[idx++]);
					if(p_memFreeOid != 'NONE') free = parseFloat(result[idx++]);
					if(p_memTotalOid != 'NONE') total = parseFloat(result[idx++]);
					if(free > 0 && use > 0) {
						perfVal = (use / (free + use) * 100).toFixed(2);
					}
					else if(total > 0 && free > 0) {
						perfVal = ((total - free) / total * 100).toFixed(2);
					}
					else if(total > 0 && use > 0) {
						perfVal = (use / total * 100).toFixed(2);;
					}
				}
				break;
			case '온도':
				perfVal = result[0].split('=')[1];
				break;
			case '세션':
				perfVal = result[0].split('=')[1];
				break;
			}
			
			var date = new Date();
			var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'), val: perfVal };
			p_chart.series[0].addPoint( [date.getTime(), perfVal*1], false);		
			p_chart.redraw();
			p_gridData.splice(0, 0, newData);
			$('#p_perfGrid').jqxGrid('updatebounddata');
		},
		
		pwindow_stop: function() {
			$('#pbtnStart').css('display', 'block');
			$('#pbtnPause').css('display', 'none');
			$('#p_cbPerfType, #p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
			if(p_webSocket !== undefined && p_webSocket.readyState != WebSocket.CLOSED) {
				p_webSocket.close();
			}
		}
}
