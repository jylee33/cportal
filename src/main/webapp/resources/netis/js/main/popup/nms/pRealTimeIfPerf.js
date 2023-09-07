var _flag = false;
var timer = null;

var ip = window.location.hostname;
var protocol = window.location.protocol;
var port = $("#gCupidPort").val();
var serverURL = protocol + "//" + ip +  ":"+port+"/eventbus/";
//serverURL = protocol + "//10.1.2.154:"+port+"/eventbus/";
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

var _healthCheckInterval = null;

var Main = {
    /** variable */
    initVariable : function() {
        _flag = false;
        clearInterval(timer);
        if (typeof _healthCheckInterval !== "undefined" && _healthCheckInterval) clearInterval(_healthCheckInterval);
        timer = null;
        _healthCheckInterval = null;

        sessionId = HmUtil.generateUUID();
        sessionId1 = HmUtil.generateUUID();
        sessionId2 = HmUtil.generateUUID();
        sessionId3 = HmUtil.generateUUID();
        sessionId4 = HmUtil.generateUUID();
        sessionId5 = HmUtil.generateUUID();
        sessionId6 = HmUtil.generateUUID();
        sessionId7 = HmUtil.generateUUID();
        sessionId8 = HmUtil.generateUUID();

        Main.busOepn();
    },
    busOepn:function(){
        ebSecUnitPerf = new EventBus(serverURL);
            ebSecUnitPerf.onopen = function () {
            ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : sessionId, auth : "5"}, function (err, msg) {
                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                if( type.toUpperCase() == 'REC' &&  ('IF' in body ) == true ){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    var chartId = replyTarget.split('_');
                    chartId = chartId[0];
                    // Main.pwindow_recvData(chartId, recvData);

                    var uuid = replyTarget.replace(chartId+'_', "");
                    switch (uuid) {
                        case sessionId1:
                        case sessionId2:
                        case sessionId3:
                        case sessionId4:
                        case sessionId5:
                        case sessionId6:
                        case sessionId7:
                        case sessionId8:
                            Main.pwindow_recvData(chartId, recvData);
                        break;
                    }
                }
                if('RESULT' in body){
                    switch(body.RESULT){
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


    /** add event */
    observe : function() {
        $('button').bind('click', function(event) {
            Main.eventControl(event);
        });
        $('#pbtnStart').click(function() {
            Main.pwindow_start();
        });
        $('#pbtnPause').click(function() {
            Server.post('/main/nms/realTimeMultiIf/selectIfRealCupid.do', { data : { u :''}, success : function(result) {
                    $.each(result, function(idx, value){
                        Main.pwindow_stop(value,'N');
                    });
                } });
        });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnConf':
                this.setChartPopup();
                break;
        }
    },
    /** init design */
    initDesign : function() {
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
                { label: '5초', value: 5 },
                { label: '10초', value: 10 },
                { label: '30초', value: 30 },
                { label: '60초', value: 60 }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });
        $('#p_cbPerfType').jqxDropDownList({ width : 140, height : 21, theme : jqxTheme, autoDropDownHeight : true, source : [
                { label : 'BPS', value : 'BPS' },{ label : 'PPS', value : 'PPS' }
            ], displayMember : 'label', valueMember : 'value', selectedIndex : 0 }).on('change', function(event) {
        });
        //차트그리기.
        Main.drawChart();
    },

    /** init data */
    initData : function() {

    },

    /* 설정팝업 */
    setChartPopup : function() {
        HmWindow.create($('#pwindow'), 800, 350);
        $.post(ctxPath + '/main/popup/nms/pRealTimeMultiIfSetChart.do', null, function(result) {
            HmWindow.open($('#pwindow'), '실시간 회선 변경 ', result, 578, 348);
        });
    },
    drawChart : function() {
        var chartType = HmHighchart.TYPE_LINE;
        var commOptions = HmHighchart.getCommOptions(chartType);
        var options = {};
        options.boost= {useGPUTranslations: true};
        options.chart= {
            zoomType: 'x',
            animation:false,
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
        options.title= {
            style: {
                fontSize: '12px',
                fontWeight: 'bold'
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
                    formatter: HmHighchart.convertUnit1024
                },
                title: null
            }
        ];
        options.tooltip = {
            formatter: Main.toltipFormat
        };
        options.series= [
            {name: 'IN BPS',  lineWidth: 2 , color:'#1F99D3'},
            {name: 'OUT BPS',  lineWidth:2, color:'#2B9641'}
        ];
        options.plotOptions = {
            line: {
                lineWidth:2,
                marker: {
                    enabled: false
                },
                connectNulls: true
            }
        };
        var hmOptions = $.extend(true, commOptions, options);
        for (var i = 1; i < 9; i++) {
            HmHighchart.create2('RTimeChart'+i, hmOptions);
        }
    },
    pwindow_start : function(){
        if (typeof _healthCheckInterval !== "undefined" && _healthCheckInterval) clearInterval(_healthCheckInterval);
        _healthCheckInterval = null;
        Server.post('/main/nms/realTimeMultiIf/selectIfRealCupid.do', { data : { u :''}, success : function(result) {
                if(result.length == 0){
                    alert("회선을 등록해주세요.");
                    return;
                }else{
                    _flag = true;
                    $('#pbtnStart').hide();
                    $('#pbtnPause').show();
                    $('#btnConf').hide();
                    $('#p_cTime, #p_reqCycle,#p_cbPerfType').jqxDropDownList({ disabled: true });
                    for (var i = 1; i < 9; i++) {
                        var chart =$('#RTimeChart'+i).highcharts();
                        chart.destroy();
                    }
                    Main.drawChart();

                    //초기 차트 그릴때 체크.
                    $("#startCheck1").val("Y");
                    $("#startCheck2").val("Y");
                    $("#startCheck3").val("Y");
                    $("#startCheck4").val("Y");
                    $("#startCheck5").val("Y");
                    $("#startCheck6").val("Y");
                    $("#startCheck7").val("Y");
                    $("#startCheck8").val("Y");

                    $.each(result, function(idx, value){
                        var chart =$('#RTimeChart'+value.shLocation).highcharts();
                        if(value.ifAlias != ""){
                            chart.setTitle({text: value.devName + ' [' + value.ifName + ']'+'<br/>'+' [' + value.ifAlias + ']'});
                        }else{
                            chart.setTitle({text: value.devName + ' [' + value.ifName + ']'});
                        }
                        if($('#p_cbPerfType').val() == "BPS"){
                            chart.series[0].update({ name:'IN BPS'  });
                            chart.series[1].update({ name:'OUT BPS'  });
                        }else if($('#p_cbPerfType').val() == "PPS"){
                            chart.series[0].update({ name:'IN PPS'  });
                            chart.series[1].update({ name:'OUT PPS'  });
                        }
                        Main.send(value);
                    });
                }
            } });

        timer = setInterval(function(){
            if (typeof _healthCheckInterval !== "undefined" && _healthCheckInterval) clearInterval(_healthCheckInterval);
            _healthCheckInterval = null;
            Server.post('/main/nms/realTimeMultiIf/selectIfRealCupid.do', { data : { u :''}, success : function(result) {
                $.each(result, function(idx, value){
                    Main.pwindow_stop(value,'N');
                });
            } });
        }, $('#p_cTime').val() * 60 * 1000);

    },
    send : function(value2){
        // var message = {
        //     "type":"publish",
        //     "address":"tcp.to.server",
        //     "headers":{
        //         "info" : {
        //             "js_id" : $('#sUserId').val(),
        //             "js_guid" : sessionId,
        //             "tcp_id" : "NT_RealTimePerfd",
        //             "tcp_guid" :String(value2.pollGrpNo)
        //         },
        //         "msg_type" : "SEC_UNIT_PERF",
        //         "msg_info" : {
        //             "STATUS"  : "START",
        //             "CYCLE"  : $('#p_reqCycle').val(),
        //             "REQ_TYPE" : "IF",
        //             "MNG_NO" : String(value2.mngNo),
        //             "IF_IDX" :String(value2.ifIdx),
        //             "DEV_IP" : String(value2.devIp),
        //             "COMMUNITY" :String(value2.community),
        //             "SNMP_VER" : String(value2.snmpVer),
        //             "SNMP_USER_ID" : String(value2.snmpUserId),
        //             "SNMP_SECURITY_LEVEL" : String(value2.snmpSecurityLevelStr),
        //             "SNMP_AUTH_TYPE" :String(value2.snmpAuthTypeStr),
        //             "SNMP_AUTH_KEY" :String(value2.snmpAuthKey),
        //             "SNMP_ENCRYPT_TYPE" :String(value2.snmpEncryptTypeStr),
        //             "SNMP_ENCRYPT_KEY" :String(value2.snmpEncryptKey),
        //             "APPLY_SNMP_V1" : value2.applySnmpV1,
        //             "LINE_WIDTH" : String(value2.lineWidth),
        //             "IF_NAME" : String(value2.ifName),
        //             "VENDOR" : String(value2.vendor),
        //             "MODEL" : String(value2.model),
        //             "DEV_KIND2" :String(value2.devKind2),
        //             "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
        //         }
        //     },
        //     "body":{ "reply_target": "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation) }
        // };
        // var deliveryOptions = message.headers;
        // ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target": "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation)}, deliveryOptions);

        var _runList = {};
        var _ifList = {};
        _ifList[value2.mngNo] = [parseInt(value2.ifIdx)];
        _runList[value2.pollGrpNo + ''] = [_ifList];

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: _runList,
            MSG_BYPASS: 1,
            MSG_STATUS: "START",//START,END
            MSG_CYCLE: $('#p_reqCycle').val(),//초단위 주기적 실행
            RTN_FLAG: 1,//0:결과과정 전달안함
            RTN_ID: $('#sUserId').val(),//cupid user id
            RTN_TARGET: "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation),//cupid guid
            RTN_GUID: sessionId//cupid sessionId
        }

        ServerRest.cupidRest({
            _REST_PATH: '/nms/perf/if',
            _REST_PARAM: _paramObj,
        });

        _healthCheckInterval = setInterval(function(){
            ServerRest.cupidHealthCheck({_REST_PATH: '/nms/health/if', _GUID: "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation)});
        }, 60 * 1000);//1분마다 한번씩 호출함


    },
    pwindow_recvData: function(chartId, data) {
        var recvData = data.body;
        var RTimeChart = $('#' + chartId).highcharts();
        var date = new Date();

        var chartIdx = chartId.replace('RTimeChart', '');

        if($("#startCheck" + chartIdx).val() == "Y"){ //최초 차트 그리기.
            var date2 = new Date();
            for(var i=0; i<1 * 60/$("#p_reqCycle").val(); i++){
                /*date2.setTime(date2.getTime() - 1000 * 60 * 60 * 24); /!* 타임스탬프 + 1000*60*60*24ms(=1일) *!/*/
                date2.setTime(date2.getTime() - 1000 * $("#p_reqCycle").val());
                RTimeChart.series[0].addPoint([date2.getTime(), 0],true,false);
                RTimeChart.series[1].addPoint([date2.getTime(), 0],true,false);
            }
        }else{
            if($("#p_cTime").val() == "1"){ //표현시간 1분일때 무조건 첫번째꺼 밀어내기.
                var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                    inbps: recvData.IF.IN_BPS, outbps: recvData.IF.OUT_BPS, inpps: recvData.IF.IN_PPS, outpps: recvData.IF.OUT_PPS };
                if($('#p_cbPerfType').val() == "BPS"){
                    RTimeChart.series[0].addPoint([date.getTime(), newData.inbps],true,true);
                    RTimeChart.series[1].addPoint([date.getTime(), newData.outbps],true,true);
                }else if($('#p_cbPerfType').val() == "PPS"){
                    RTimeChart.series[0].addPoint([date.getTime(), newData.inpps],true,true);
                    RTimeChart.series[1].addPoint([date.getTime(), newData.outpps],true,true);
                }
            }else{ //표현시간 1분 아닐경우.
                var seriesData  = RTimeChart.series[0].data[0];
                var date3 = new Date();
                date3.setTime(seriesData.x + 1000 * $("#p_cTime").val()*60);
                if(date.getTime() > date3.getTime()){ // 첫번째꺼 밀어내기.
                    var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                        inbps: recvData.IF.IN_BPS, outbps: recvData.IF.OUT_BPS, inpps: recvData.IF.IN_PPS, outpps: recvData.IF.OUT_PPS };
                    if($('#p_cbPerfType').val() == "BPS"){
                        RTimeChart.series[0].addPoint([date.getTime(), newData.inbps],true,true);
                        RTimeChart.series[1].addPoint([date.getTime(), newData.outbps],true,true);
                    }else if($('#p_cbPerfType').val() == "PPS"){
                        RTimeChart.series[0].addPoint([date.getTime(), newData.inpps],true,true);
                        RTimeChart.series[1].addPoint([date.getTime(), newData.outpps],true,true);
                    }
                }else{ // 그대로유지.
                    var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                        inbps: recvData.IF.IN_BPS, outbps: recvData.IF.OUT_BPS, inpps: recvData.IF.IN_PPS, outpps: recvData.IF.OUT_PPS };
                    if($('#p_cbPerfType').val() == "BPS"){
                        RTimeChart.series[0].addPoint([date.getTime(), newData.inbps],true,false);
                        RTimeChart.series[1].addPoint([date.getTime(), newData.outbps],true,false);
                    }else if($('#p_cbPerfType').val() == "PPS"){
                        RTimeChart.series[0].addPoint([date.getTime(), newData.inpps],true,false);
                        RTimeChart.series[1].addPoint([date.getTime(), newData.outpps],true,false);
                    }
                }
            }
        }

        //최초실행.
        if($("#startCheck" + chartIdx).val() == "Y"){
            console.log('chl:::' , data)
            var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                inbps: recvData.IF.IN_BPS, outbps: recvData.IF.OUT_BPS, inpps: recvData.IF.IN_PPS, outpps: recvData.IF.OUT_PPS };
            if($('#p_cbPerfType').val() == "BPS"){
                RTimeChart.series[0].addPoint([date.getTime(), newData.inbps],true,false);
                RTimeChart.series[1].addPoint([date.getTime(), newData.outbps],true,false);
            }else if($('#p_cbPerfType').val() == "PPS"){
                RTimeChart.series[0].addPoint([date.getTime(), newData.inpps],true,false);
                RTimeChart.series[1].addPoint([date.getTime(), newData.outpps],true,false);
            }
            $("#startCheck" + chartIdx).val("N");
        }
    },

    pwindow_stop : function(value2,chk) {
        // var message = {
        //     "type":"publish",
        //     "address":"tcp.to.server",
        //     "headers":{
        //         "info" : {
        //             "js_id" : $('#sUserId').val(),
        //             "js_guid" : sessionId,
        //             "tcp_id" : "NT_RealTimePerfd",
        //             "tcp_guid" :String(value2.pollGrpNo)
        //         },
        //         "msg_type" : "SEC_UNIT_PERF",
        //         "msg_info" : {
        //             "STATUS"  : "STOP",
        //             "CYCLE"  : $('#p_reqCycle').val(),
        //             "REQ_TYPE" : "IF",
        //             "MNG_NO" : String(value2.mngNo),
        //             "IF_IDX" :String(value2.ifIdx),
        //             "DEV_IP" : String(value2.devIp),
        //             "COMMUNITY" :String(value2.community),
        //             "SNMP_VER" : String(value2.snmpVer),
        //             "SNMP_USER_ID" : String(value2.snmpUserId),
        //             "SNMP_SECURITY_LEVEL" : String(value2.snmpSecurityLevelStr),
        //             "SNMP_AUTH_TYPE" :String(value2.snmpAuthTypeStr),
        //             "SNMP_AUTH_KEY" :String(value2.snmpAuthKey),
        //             "SNMP_ENCRYPT_TYPE" :String(value2.snmpEncryptTypeStr),
        //             "SNMP_ENCRYPT_KEY" :String(value2.snmpEncryptKey),
        //             "APPLY_SNMP_V1" : value2.applySnmpV1,
        //             "LINE_WIDTH" : String(value2.lineWidth),
        //             "IF_NAME" : String(value2.ifName),
        //             "VENDOR" : String(value2.vendor),
        //             "MODEL" : String(value2.model),
        //             "DEV_KIND2" :String(value2.devKind2),
        //             "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
        //         }
        //     },
        //     "body":{ "reply_target": "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation) }
        // };
        // var deliveryOptions = message.headers;
        // ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target": "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation)}, deliveryOptions);
        var _runList = {};
        var _ifList = {};
        _ifList[value2.mngNo] = [parseInt(value2.ifIdx)];
        _runList[value2.pollGrpNo + ''] = [_ifList];

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: _runList,
            MSG_BYPASS: 1,
            MSG_STATUS: "STOP",//START,END
            MSG_CYCLE: $('#p_reqCycle').val(),//초단위 주기적 실행
            RTN_FLAG: 1,//0:결과과정 전달안함
            RTN_ID: $('#sUserId').val(),//cupid user id
            RTN_TARGET: "RTimeChart"+String(value2.shLocation)+"_"+eval('sessionId'+value2.shLocation),//cupid guid
            RTN_GUID: sessionId//cupid sessionId
        }

        ServerRest.cupidRest({
            _REST_PATH: '/nms/perf/if',
            _REST_PARAM: _paramObj,
        });

        if(chk == "N"){
            $('#pbtnStart').show();
            $('#pbtnPause').hide();
            $('#btnConf').show();
            $('#p_cTime, #p_reqCycle,#p_cbPerfType').jqxDropDownList({ disabled: false });
            _flag = false;
            clearInterval(timer);
            if (typeof _healthCheckInterval !== "undefined" && _healthCheckInterval) clearInterval(_healthCheckInterval);
            timer = null;
            _healthCheckInterval= null;
        }

    },
    initStatus : function() {
        _flag = false;
        clearInterval(timer);
        timer = null;

        if (typeof _healthCheckInterval !== "undefined" && _healthCheckInterval) clearInterval(_healthCheckInterval);
        _healthCheckInterval = null;

        $('#pbtnStart').show();
        $('#pbtnPause').hide();
        $('#btnConf').show();
        $('#p_cTime, #p_reqCycle,#p_cbPerfType').jqxDropDownList({ disabled: false });

    },
    toltipFormat: function(dateFormat) {
        var s = '<b>' + $.format.date(new Date(this.x), 'yyyy-MM-dd HH:mm:ss') + '</b>';
        $.each(this.points, function() {
            s += '<br/>' + this.series.name + ': ' + HmUtil.convertUnit1000(this.y, true);
        });
        return s;
    },
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});


function funWinClose(){
    Server.post('/main/nms/realTimeMultiIf/selectIfRealCupid.do', { data : { u :''}, success : function(result) {
            $.each(result, function(idx, value){
                Main.pwindow_stop(value,'N');
            });
        } });


}
