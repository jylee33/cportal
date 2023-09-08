var p_typeChanged = false;
var timer;
var healthInterval = null;


var ip = window.location.hostname;
var protocol = window.location.protocol;
var port = $("#gCupidPort").val();
var serverURL = protocol + "//" + ip +  ":"+port+"/eventbus/";
//serverURL = protocol + "//10.1.3.154:"+port+"/eventbus/";
var header = [];
var ebSecUnitPerf;

var sessionId = '';
var sessionId1 = '';
var sessionId2 = '';
var sessionId3 = '';
var sessionId4 = '';
var sessionId5 = '';
var sessionId6 = '';
var sessionId7 = '';
var sessionId8 = '';
var sessionId9 = '';
var sessionId10 = '';
var sessionId11 = '';
var sessionId12 = '';
var errFlag = 0;

var deliveryList = [];
var addCnt = 0;
var Main = {
	/** variable */
	initVariable : function() {
		_flag = false;
		clearInterval(timer);
		timer = null;
		clearInterval(healthInterval);
        healthInterval = null;

		sessionId = HmUtil.generateUUID();
		sessionId1 = HmUtil.generateUUID();
		sessionId2 = HmUtil.generateUUID();
		sessionId3 = HmUtil.generateUUID();
		sessionId4 = HmUtil.generateUUID();
		sessionId5 = HmUtil.generateUUID();
		sessionId6 = HmUtil.generateUUID();
		sessionId7 = HmUtil.generateUUID();
		sessionId8 = HmUtil.generateUUID();
		sessionId9 = HmUtil.generateUUID();
		sessionId10 = HmUtil.generateUUID();
		sessionId11 = HmUtil.generateUUID();
		sessionId12 = HmUtil.generateUUID();
		//OPEN

		Main.busOpen();

	},

	busOpen:function(){
		ebSecUnitPerf = new EventBus(serverURL);
		ebSecUnitPerf.onopen = function () {
			ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : sessionId, auth : "5"}, function (err, msg) {
				var recvData = msg;
				var type = recvData.type;
				var body = recvData.body;
				if (type.toUpperCase() == 'REC' && (('DEV' in body) == true || ('IF' in body) == true)) {
					var headers = recvData.headers;
					var replyTarget = recvData.body.reply_target;
					var chartId = replyTarget.split('_');
					chartId = chartId[0];

					var uuid = replyTarget.replace(chartId+'_', "");
					switch (uuid) {
						case sessionId1.toString():
						case sessionId2:
						case sessionId3:
						case sessionId4:
						case sessionId5:
						case sessionId6:
						case sessionId7:
						case sessionId8:
						case sessionId9:
						case sessionId10:
						case sessionId11:
						case sessionId12:
							Main.recvData(chartId, body);
							break;
					}
				}
				if ('RESULT' in body) {
					switch (body.RESULT) {
						case 0:
							console.log('result ok');
							break;
						case 1:
							var chartId = recvData.body.reply_target.split('_');
							var chart = $('#'+chartId[0]).highcharts();
							if (!chart.hasData()) {
								chart.hideNoData();
								chart.showNoData('Validation check error.');
							}
							break;
						case 2:
							var chartId = recvData.body.reply_target.split('_');
							var chart = $('#'+chartId[0]).highcharts();
							if (!chart.hasData()) {
								chart.hideNoData();
								chart.showNoData('수집중인 내용 없음.');
							}
							break;
						case 4:
							var chartId = recvData.body.reply_target.split('_');
							var chart = $('#'+chartId[0]).highcharts();
							if (!chart.hasData()) {
								chart.hideNoData();
								chart.showNoData('엔진 연동 실패.');
							}
							break;
					}
				}
			});
		};
	},

	recvData: function(chartId, data) {
		var currPerfType = HmBoxCondition.val('sItemType_pPerfRealtime');
		var perfVal = 0;
		switch(currPerfType) {
			case 'CPU':
				var perfData = data.DEV.CPU;
				if (perfData.length) {
					var sum = perfData.reduce(function (a, b) {
						return a + b;
					});
					perfVal = sum / perfData.length;
				}
				Main.setData(chartId, currPerfType, perfData);
				break;
			case 'MEMORY':
				var perfData = data.DEV.MEM;
				if (perfData.length) {
					var sum = perfData.reduce(function (a, b) {
						return a + b;
					});
					perfVal = sum / perfData.length;
				}
				Main.setData(chartId, currPerfType, perfData);
				break;
			case 'TEMPERATURE':
				var perfData = data.DEV.TEMP;
				if (perfData.length) {
					var sum = perfData.reduce(function (a, b) {
						return a + b;
					});
					perfVal = sum / perfData.length;
				}
				Main.setData(chartId, currPerfType, perfData);
				break;
			case 'Session':
				var perfData = data.DEV.SESSION;
				if (perfData.length) {
					var sum = perfData.reduce(function (a, b) {
						return a + b;
					});
					perfVal = sum / perfData.length;
				}
				Main.setData(chartId, currPerfType, perfData);
				break;
			case 'CPS':
				var perfData = data.DEV.CPS;
				if (perfData.length) {
					var sum = perfData.reduce(function (a, b) {
						return a + b;
					});
					perfVal = sum / perfData.length;
				}
				Main.setData(chartId, currPerfType, perfData);
				break;
			case 'BPS': case 'PPS': case 'ERR':
				Main.setData(chartId, currPerfType, data);
				break;
		}

	},
	setData: function(chartId, type, data){
		var chart = $('#'+chartId).highcharts();
		var date = new Date();
		switch(type){
			case 'FW_CPS':
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
					rTcpCps: data[0].TCP_CPS, rUdpCps: data[0].UDP_CPS, rIcmpCps: data[0].ICMP_CPS/*,
                        rTcpCps: data[1].TCP_CPS, rUdpCps: data[1].UDP_CPS, rIcmpCps: data[1].ICMP_CPS*/
				};
				chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_CPS)], true,false);
				chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_CPS)], true,false);
				chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_CPS)], true,false);
				break;
			case 'FW_SESSION':
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
					rTcpSession: data[0].TCP_SESSION, rUdpSession: data[0].UDP_SESSION, rIcmpSession: data[0].ICMP_SESSION/*,
                        rTcpSession: data[1].TCP_SESSION, rUdpSession: data[1].UPD_SESSION, rIcmpSession: data[1].ICMP_SESSION*/
				};
				chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_SESSION)], true,false);
				chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_SESSION)], true,false);
				chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_SESSION)], true,false);
				break;
			case 'BPS':
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
					inbps: data.IF.IN_BPS, outbps: data.IF.OUT_BPS, inpps: data.IF.IN_PPS, outpps: data.IF.OUT_PPS, inerr: data.IF.IN_ERROR, outerr: data.IF.OUT_ERROR };
				chart.series[0].addPoint([date.getTime(), newData.inbps]);
				chart.series[1].addPoint([date.getTime(), newData.outbps]);
				break;
			case 'PPS':
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
					inbps: data.IF.IN_BPS, outbps: data.IF.OUT_BPS, inpps: data.IF.IN_PPS, outpps: data.IF.OUT_PPS, inerr: data.IF.IN_ERROR, outerr: data.IF.OUT_ERROR };
				chart.series[0].addPoint([date.getTime(), newData.inpps]);
				chart.series[1].addPoint([date.getTime(), newData.outpps]);
				break;
			case 'ERR':
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
					inbps: data.IF.IN_BPS, outbps: data.IF.OUT_BPS, inpps: data.IF.IN_PPS, outpps: data.IF.OUT_PPS, inerr: data.IF.IN_ERROR, outerr: data.IF.OUT_ERROR };
				chart.series[0].addPoint([date.getTime(), newData.inerr]);
				chart.series[1].addPoint([date.getTime(), newData.outerr]);
				break;
			default:
				var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'), val : data };
				chart.series[0].addPoint( [date.getTime(), parseFloat(data)],true,false);
		}

	},

	search: function(){
		var item = $('#p_cbMultiGrp').jqxDropDownList('getSelectedItem').originalItem;
		addCnt = 0;
		for(var i =1; i<13; i++){
			if($('#monChart' + i).highcharts() !== undefined){
				$('#monChart' + i).highcharts().destroy();
			}
		}

		Server.get('/main/nms/realTimeMultiPerf/getMultiPerf.do', {
			data: {multiGrpNo: item.multiGrpNo, perfType: item.perfType, itemType: HmBoxCondition.val('sItemType_pPerfRealtime'), oidType: 1},
			success: function (data) {
				header = [];
				if(data.length == 0){
					alert('설정된 그룹 정보가 없습니다.\n우측 설정버튼을 통해 해당 그룹에 장비 및 회선을 등록해주세요.')
					Main.initStatus();
				}
				$.each(data, function(i, v){
					addCnt = addCnt+1;
					var guid = 'monChart'+addCnt+'_'+eval('sessionId'+addCnt);
					var iname = v.dpIfName != null ? v.dpIfName : (v.devName+'['+v.ifName+']');
					var displayName = item.perfType =='DEV' ? v.devName : iname ;
					Main.createChart(addCnt, item.perfType, HmBoxCondition.val('sItemType_pPerfRealtime'), displayName);
					header.push({idx: addCnt, perfType: item.perfType, data: v, chartGuid: guid });
				});
			}
		});

	},

	cupidStart: function(){
		if(!header.length){
			alert('조회 후 시작해주세요.');
			return false;
		}
		var item = $('#p_cbMultiGrp').jqxDropDownList('getSelectedItem').originalItem;
		_flag = true;
		$('#pbtnStart').hide();
		$('#pbtnSearch').hide();
		$('#pbtnPause').show();
		$('#p_cbMultiGrp').jqxDropDownList({ disabled: true });
		HmBoxCondition.disabledRadio('sItemType_pPerfRealtime', true);
		HmBoxCondition.disabledRadio('sTime_pPerfRealtime', true);
		HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', true);
		deliveryList = [];

		timer = setTimeout(function(){
			Main.cupidStop();
		}, HmBoxCondition.val('sTime_pPerfRealtime') * 60 * 1000);

		// $.each(header, function(i, v){
		$.each(header, function(i, v){
			var chartId = v.chartGuid.split('_');
			Main.clearSeriesData(chartId);
			Main.send(v.idx, v.perfType, v.data, v.chartGuid);
		});

		// });


	},

	clearSeriesData: function(chartId){
		var chart = $('#'+chartId).highcharts();
		try {
			var slen = chart.series.length;
			for (var i = 0; i < slen; i++) {
				chart.series[i].update({data: []}, false);
			}
			chart.yAxis[0].update({gridLineWidth: true}, false);
			HmHighchart.redraw(chartId);
		}catch(e){}
	},

	cupidStop: function() {
		_flag = false;
		clearTimeout(timer);
		timer = null;

		$.each(deliveryList, function(i, v){
			v._REST_PARAM.MSG_STATUS = 'STOP';
			ServerRest.cupidRest(v);

            if(typeof v._HEALTH !== "undefined" && v._HEALTH) {
				clearInterval(v._HEALTH);
				v._HEALTH = null;
            }
			// v.headers.msg_info.STATUS = 'STOP';
			// ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target" : v.body.reply_target}, v.headers);
		});
		//ebSecUnitPerf.onclose();
		$('#pbtnStart').show();
		$('#pbtnPause').hide();
		$('#pbtnSearch').show();
		$('#p_cbMultiGrp').jqxDropDownList({ disabled: false });
		HmBoxCondition.disabledRadio('sItemType_pPerfRealtime', false);
		HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);
		HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);
	},
	initStatus : function() {
		_flag = false;
		clearInterval(timer);
		timer = null;
		if(deliveryList.length != 0){
			for(var i = 0 ; i < deliveryList.length ; i++) {
                if(typeof deliveryList[i]._HEALTH !== "undefined" && deliveryList[i]._HEALTH) {
					clearInterval(deliveryList[i]._HEALTH);
					deliveryList[i]._HEALTH = null;
				}
            }//for end(i)
		}
		$('#pbtnStart').show();
		$('#pbtnPause').hide();
		$('#p_cbMultiGrp').jqxDropDownList({ disabled: false });
		HmBoxCondition.disabledRadio('sItemType_pPerfRealtime', false);
		HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);
		HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);

	},
	send : function(addCnt, perfType, data, guid){
		var message;
		if(perfType == 'DEV') {

			// message = {
			// 	"type": "publish",
			// 	"address": "tcp.to.server",
			// 	"headers": {
			// 		"info": {
			// 			"js_id": $('#sUserId').val(),
			// 			"js_guid": sessionId,
			// 			"tcp_id": "NT_RealTimePerfd",
			// 			"tcp_guid": data.pollGrpNo
			// 		},
			// 		"msg_type": "SEC_UNIT_PERF"
			// 	},
			// 	"body": {"reply_target" : guid}
			// };
            //
			// message.headers.msg_info = {
			// 	"STATUS": "START",
			// 	"CYCLE"  : HmBoxCondition.val('sPerfCycle_pPerfRealtime'),
			// 	"REQ_TYPE": "DEV",
			// 	"MNG_NO": data.mngNo,
			// 	"ITEM_TYPE": data.itemType,
			// 	"ITEM_TYPE_COND": data.itemTypeCond,
			// 	"OIDS": JSON.parse((data.oids).htmlCharacterUnescapes()),
			// 	"PDU_TYPE": JSON.parse((data.pduType).htmlCharacterUnescapes()),
			// 	"MODULE_INDEX": JSON.parse((data.moduleIndex).htmlCharacterUnescapes()),
			// 	"TEMP_DIV": JSON.parse((data.tempDiv).htmlCharacterUnescapes()),
			// 	"DEV_IP": data.devIp,
			// 	"COMMUNITY": data.community,
			// 	"SNMP_VER": String(data.snmpVer),
			// 	"SNMP_USER_ID": String(data.snmpUserId),
			// 	"SNMP_SECURITY_LEVEL": String(data.snmpSecurityLevel),
			// 	"SNMP_AUTH_TYPE": String(data.snmpAuthType),
			// 	"SNMP_AUTH_KEY": String(data.snmpAuthKey),
			// 	"SNMP_ENCRYPT_TYPE": String(data.snmpEncryptType),
			// 	"SNMP_ENCRYPT_KEY": String(data.snmpEncryptKey),
			// 	"VENDOR": data.vendor,
			// 	"MODEL": data.model,
			// 	"DEV_KIND2": data.devKind2,
			// 	"REQ_YMDHMS": $.format.date(new Date(), 'yyyyMMddHHmmss')
			// }

            var _runList = {};
            _runList[data.pollGrpNo + ''] = [parseInt(data.mngNo)];

            var _detailInfo = {};
            if(data.itemType != '-1'){
                _detailInfo.ITEM_TYPE = data.itemType;
                if(data.moduleIndex != undefined){
                    var set = new Set(Object.values(JSON.parse(data.moduleIndex)));
                    var _itemIdxList = Array.from(set);
                    _detailInfo.ITEM_IDX = _itemIdxList;
                }
            }

            //block scope을 위해 let 사용
            let _paramObj = {
                MSG_SEND: "WEB",//데이터전달위치
                MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                RUN_LIST: _runList,
                DETAIL_INFO: _detailInfo,//RUN_LIST에서 추가로 사용할 값
                MSG_BYPASS: 1,
                MSG_STATUS: "START",//START,END
                MSG_CYCLE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
                RTN_FLAG: 1,//0:결과과정 전달안함
                RTN_ID: $('#sUserId').val(),//cupid user id
                RTN_TARGET: guid,//cupid guid
                RTN_GUID: sessionId//cupid sessionId
            }

            ServerRest.cupidRest({
                _REST_PATH: '/nms/perf/dev',
                _REST_PARAM: _paramObj,
            });

            deliveryList.push({
                _REST_PATH: '/nms/perf/dev',
                _REST_PARAM: _paramObj,
				_HEALTH: setInterval(function(){
                    ServerRest.cupidHealthCheck({_REST_PATH: '/nms/health/dev', _GUID: guid});
                }, 60 * 1000)
            });
		}else{
			// message = {
			// 	"type":"publish",
			// 	"address":"tcp.to.server",
			// 	"headers":{
			// 		"info" : {
			// 			"js_id" : $('#sUserId').val(),
			// 			"js_guid" : sessionId,
			// 			"tcp_id" : "NT_RealTimePerfd",
			// 			"tcp_guid" : data.pollGrpNo
			// 		},
			// 		"msg_type" : "SEC_UNIT_PERF",
			// 	},
			// 	"body":{ "reply_target": guid }
			// };
			// message.headers.msg_info = {
			// 	"STATUS"  : "START",
			// 	"CYCLE"  : HmBoxCondition.val('sPerfCycle_pPerfRealtime'),
			// 	"REQ_TYPE" : "IF",
			// 	"MNG_NO" : data.mngNo,
			// 	"IF_IDX" : data.ifIdx,
			// 	"DEV_IP" : data.devIp,
			// 	"COMMUNITY": data.community,
			// 	"SNMP_VER": String(data.snmpVer),
			// 	"SNMP_USER_ID": String(data.snmpUserId),
			// 	"SNMP_SECURITY_LEVEL": String(data.snmpSecurityLevel),
			// 	"SNMP_AUTH_TYPE": String(data.snmpAuthType),
			// 	"SNMP_AUTH_KEY": String(data.snmpAuthKey),
			// 	"SNMP_ENCRYPT_TYPE": String(data.snmpEncryptType),
			// 	"SNMP_ENCRYPT_KEY": String(data.snmpEncryptKey),
			// 	"APPLY_SNMP_V1" : data.applySnmpV1,
			// 	"LINE_WIDTH" : data.lineWidth,
			// 	"IF_NAME" : data.ifName,
			// 	"VENDOR": data.vendor,
			// 	"MODEL": data.model,
			// 	"DEV_KIND2": data.devKind2,
			// 	"REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
			// }
            var _runList = {};
            var _ifList = {};
            _ifList[data.mngNo] = [parseInt(data.ifIdx)];
            _runList[data.pollGrpNo + ''] = [_ifList];

            //block scope을 위해 let 사용
            let _paramObj = {
                MSG_SEND: "WEB",//데이터전달위치
                MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                RUN_LIST: _runList,
                MSG_BYPASS: 1,
                MSG_STATUS: "START",//START,END
                MSG_CYCLE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
                RTN_FLAG: 1,//0:결과과정 전달안함
                RTN_ID: $('#sUserId').val(),//cupid user id
                RTN_TARGET: guid,//cupid guid
                RTN_GUID: sessionId//cupid sessionId
            }

            ServerRest.cupidRest({
                _REST_PATH: '/nms/perf/if',
                _REST_PARAM: _paramObj,
            });
			deliveryList.push({
                _REST_PATH: '/nms/perf/if',
				_REST_PARAM: _paramObj,
                _HEALTH: setInterval(function(){
                    ServerRest.cupidHealthCheck({_REST_PATH: '/nms/health/if', _GUID: guid});
                }, 60 * 1000)
			});
		}
		// var deliveryOptions = message.headers;
		// ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":guid}, deliveryOptions);
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
			case "pbtnSearch":
				this.search();
				break;
			case "pbtnStart":
				this.cupidStart();
				break;
			case "pbtnPause":
				this.cupidStop();
				break;
			case 'btnSet':
				this.setChartPopup();
				break;
		}
	},

	/** init design */
	initDesign : function() {
		HmBoxCondition.createRadio($('#sTime_pPerfRealtime'), [
			{ label: '10분', value: 10 },
			{ label: '20분', value: 20 },
			{ label: '30분', value: 30 },
			{ label: '40분', value: 40 },
			{ label: '50분', value: 50 },
			{ label: '60분', value: 60 }
		]);
		HmBoxCondition.createRadio($('#sPerfCycle_pPerfRealtime'), [
			// { label: '2초', value: 2 },
			{ label: '5초', value: 5 },
			{ label: '10초', value: 10 },
			{ label: '30초', value: 30 },
			{ label: '60초', value: 60 }
		]);

		$('#p_cbMultiGrp').jqxDropDownList({
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					url: ctxPath + '/main/nms/realTimeMultiPerf/getMultiGrpList.do'
				}
			),
			displayMember: 'multiGrpName', valueMember: 'multiGrpNo', width: 150, height: 22, theme: jqxTheme,selectedIndex: 0
		}).on('bindingComplete', function(event){
			var orgItem = $('#p_cbMultiGrp').jqxDropDownList('getSelectedItem').originalItem;
			var result;
			if(orgItem.perfType =='DEV'){
				result = [{ label: 'cpu', value: 'CPU'},
					{ label: 'mem', value: 'MEMORY'},
					{ label: 'temp', value: 'TEMPERATURE'},
					{ label: 'session', value: 'SESSION'},
					{ label: 'cps', value: 'CPS'}];
			}else{
				result = [{label: 'bps', value: 'BPS'},/* {label: 'bps(%)', value: 'BPSPER'},*/ {label: 'pps', value: 'PPS'}, {label: 'error', value: 'ERR'}];
			}
			// $('#p_itemType').jqxDropDownList('source', result);
			HmBoxCondition.changeRadioSource($('#sItemType_pPerfRealtime'), result);

		}).on('change', function(event){
			var result;
			if(event.args.item.originalItem.perfType =='DEV'){
				result = [{ label: 'cpu', value: 'CPU'},
					{ label: 'mem', value: 'MEMORY'},
					{ label: 'temp', value: 'TEMPERATURE'},
					{ label: 'session', value: 'SESSION'},
					{ label: 'cps', value: 'CPS'}];
			}else{
				result = [{label: 'bps', value: 'BPS'},/* {label: 'bps(%)', value: 'BPSPER'},*/ {label: 'pps', value: 'PPS'}, {label: 'error', value: 'ERR'}];
			}
			// $('#p_itemType').jqxDropDownList('source', result);
			HmBoxCondition.changeRadioSource($('#sItemType_pPerfRealtime'), result);
		});

		HmBoxCondition.createRadio($('#sItemType_pPerfRealtime'), [	]);
		// $('#p_itemType').change(function(event){
		// });
		// $('#p_itemType').jqxDropDownList({ width: '150px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
		// 	source: [
		//
		// 	],
		// 	displayMember: 'label', valueMember: 'value', selectedIndex: 0
		// });


		$('#hSplitter1').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'vertical', splitBarSize: 0.5, panels: [{size: '33%'}, {size: '77%'}] });
		$('#hSplitter2').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'vertical', splitBarSize: 0.5, panels: [{size: '50%'}, {size: '50%'}] });

		$('#vSplitter1_1').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '25%'}, {size: '85%'}] });
		$('#vSplitter1_2').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '33%'}, {size: '77%'}] });
		$('#vSplitter1_3').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '50%'}, {size: '50%'}] });
		$('#vSplitter2_1').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '25%'}, {size: '85%'}] });
		$('#vSplitter2_2').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '33%'}, {size: '77%'}] });
		$('#vSplitter2_3').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '50%'}, {size: '50%'}] });
		$('#vSplitter3_1').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '25%'}, {size: '85%'}] });
		$('#vSplitter3_2').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '33%'}, {size: '77%'}] });
		$('#vSplitter3_3').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', splitBarSize: 0.5, panels: [{size: '50%'}, {size: '50%'}] });


	},

	/** init data */
	initData : function() {
		/*Main.chgRefreshCycle();*/
	},


	createChart: function(idx, perfType, itemType, displayName){
		var options = {
			yAxis: {
				crosshair: true,
				opposite: false,
				showLastLabel: true,
				labels: {
					formatter:  function () {
						return this.value
					}
				}
			},
			tooltip: {
				shared: true,
				useHTML: true,
				formatter: HmHighchart.absHtmlTooltipFormatter
			},
			plotOptions: {
				line: {
					connectNulls: true
				}
			},
			legend: {
				enabled: true,
				itemStyle: {
					fontWeight: 'normal'
				}
			},
			series: []
		}

		if(perfType == 'DEV'){
			options.series= [{name: itemType, data: null, lineWidth: 0.5}];
		}else{
			options.yAxis.labels.formatter = HmHighchart.absUnit1000Formatter;
			options.tooltip.formatter = HmHighchart.absUnit1000HtmlTooltipFormatter;

			if(GlobalEnv.webSiteName == SiteEnum.HI) {
				options.series= [{name: 'IN '+ itemType, type: 'line', data: null, color: '#88151d'}, {name: 'OUT ' + itemType, type: 'area', data: null, color: '#8fd68a'}];
			}
			else {
				options.series= [{name: 'IN '+ itemType, data: null, lineWidth: 0.5}, {name: 'OUT ' + itemType, data: null, lineWidth: 0.5}];
			}
		}
		options.title ={ text: displayName,  align: 'center', style: {fontSize: '12px', fontWeight: 'bold'}}
		HmHighchart.createStockChart('monChart'+idx, options, HmHighchart.TYPE_LINE);
	},


	/* 설정팝업 */
	setChartPopup : function() {
		HmWindow.create($('#pwindow'), 800, 400);
		$.post(ctxPath + '/main/popup/nms/pRealTimeGrpSet.do', null, function(result) {
			HmWindow.open($('#pwindow'), '그룹 차트 설정 ', result, 1000, 800, 'pwindow_init');
		});

	} };

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});