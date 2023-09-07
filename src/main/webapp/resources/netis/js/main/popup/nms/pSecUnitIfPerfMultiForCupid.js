var p_chartData = [], p_gridData = [];
var beforeVal = null;
var inbpsList = [], outbpsList = [], inppsList = [], outppsList = [], inerrList = [], outerrList = [];

var _flag = false;

var ip = window.location.hostname;
var protocol = window.location.protocol;
var port = $("#gCupidPort").val();
var serverURL = protocol + "//" + ip +  ":"+port+"/eventbus/";

var ebSecUnitPerf = new EventBus(serverURL);

var timer = null;
var sessionId = HmUtil.generateUUID();
var guid = HmUtil.generateUUID();

$(function() {
    PSecUnitIfPerf.initVariable();
    PSecUnitIfPerf.observe();
    PSecUnitIfPerf.initDesign();
    PSecUnitIfPerf.initData();
});

var PSecUnitIfPerf = {
    /** variable */
    initVariable: function() {
        ebSecUnitPerf = new EventBus(serverURL);

        ebSecUnitPerf.onopen = function () {
            ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : sessionId, auth : "5"}, function (err, msg) {
                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                console.log(body)
                if( type.toUpperCase() == 'REC' &&  ('IF' in body ) == true ){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    if(guid == replyTarget)
                        PSecUnitIfPerf.pwindow_recvData(body);
                }
                if('RESULT' in body){
                    switch(body.RESULT){
                        case 0:
                            console.log('result ok')
                            break;
                        case 1:
                            PSecUnitIfPerf.initStatus();
                            alert('Validation check error.');
                            break;
                        case 2:
                            PSecUnitIfPerf.initStatus();
                            alert('수집중인 내용 없음.');
                            break;
                        case 4:
                            // PSecUnitIfPerf.initStatus();
                            // alert('엔진 연동 실패.');
                            break;
                    }

                }
            });
        };
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
                    { text: '일시', datafield: 'ymdhms', width: '10%' },
                    { text: 'IN', columngroup: 'bps', datafield: 'inbps', width: '15%', cellsrenderer: HmGrid.unit1000renderer },
                    { text: 'OUT', columngroup: 'bps', datafield: 'outbps', width: '15%', cellsrenderer: HmGrid.unit1000renderer },
                    { text: 'IN', columngroup: 'pps', datafield: 'inpps', width: '15%', cellsrenderer: HmGrid.unit1000renderer },
                    { text: 'OUT', columngroup: 'pps', datafield: 'outpps', width: '15%', cellsrenderer: HmGrid.unit1000renderer },
                    { text: 'IN', columngroup: 'err', datafield: 'inerr', width: '15%', cellsrenderer: HmGrid.unit1000renderer },
                    { text: 'OUT', columngroup: 'err', datafield: 'outerr', width: '15%', cellsrenderer: HmGrid.unit1000renderer }
                ],
            pageable: false,
            columngroups:
                [
                    { text: 'BPS', name: 'bps', align: 'center' },
                    { text: 'PPS', name: 'pps', align: 'center' },
                    { text: 'ERR', name: 'err', align: 'center' }
                ]
        });
    },

    /** init data */
    initData: function() {
    },

    drawChart: function(){

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
            series: []
        }

        options.yAxis.labels.formatter = HmHighchart.absUnit1000Formatter;
        options.tooltip.formatter = HmHighchart.absUnit1000HtmlTooltipFormatter;
        if($('#gSiteName').val() == SiteEnum.HI) {
            options.series= [{name: 'IN', type: 'line', data: null, color: '#88151d'}, {name: 'OUT', type: 'area', data: null, color: '#8fd68a'}];
        }
        else {
            options.series = [{name: 'IN', data: null, lineWidth: 0.5}, {name: 'OUT', data: null, lineWidth: 0.5}];
        }

        HmHighchart.createStockChart('p_bpsChart', Highcharts.merge(options, {yAxis: {title: {text: 'bps'}}}), HmHighchart.TYPE_LINE);
        HmHighchart.createStockChart('p_ppsChart', Highcharts.merge(options, {yAxis: {title: {text: 'pps'}}}), HmHighchart.TYPE_LINE);
        HmHighchart.createStockChart('p_errChart', Highcharts.merge(options, {yAxis: {title: {text: 'error'}}}), HmHighchart.TYPE_LINE);

    },

    pwindow_start: function(){
        _flag = true;
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
        var p_errChart = $('#p_errChart').highcharts();
        p_bpsChart.destroy();
        p_ppsChart.destroy();
        p_errChart.destroy();
        PSecUnitIfPerf.drawChart();
        PSecUnitIfPerf.send();

        timer = setTimeout(function(){
            PSecUnitIfPerf.pwindow_stop();
        }, $('#p_cTime').val() * 60 * 1000);

    },

    send: function() {
        var message = {
            "type":"publish",
            "address":"tcp.to.server",
            "headers":{
                "info" : {
                    "js_id" : $('#sUserId').val(),
                    "js_guid" : sessionId,
                    "tcp_id" : "NT_RealTimePerfd",
                    "tcp_guid" : $('#pPollGrpNo').val()
                },
                "msg_type" : "SEC_UNIT_PERF",
                "msg_info" : {
                    "STATUS"  : "START",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "IF",
                    "MNG_NO" : $('#pMngNo').val(),
                    "IF_IDX" : $('#pIfIdx').val(),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "APPLY_SNMP_V1" : $('#pApplySnmpV1').val(),
                    "LINE_WIDTH" : $('#pLineWidth').val(),
                    "IF_NAME" : $('#pIfName').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
            },
            "body": {"reply_target" : guid}
        };

        var deliveryOptions = message.headers;
        ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":guid}, deliveryOptions);
    },

    pwindow_recvData: function(data) {
        var p_bpsChart = $('#p_bpsChart').highcharts();
        var p_ppsChart = $('#p_ppsChart').highcharts();
        var p_errChart = $('#p_errChart').highcharts();

        var date = new Date();

        var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
            inbps: data.IF.IN_BPS, outbps: data.IF.OUT_BPS, inpps: data.IF.IN_PPS, outpps: data.IF.OUT_PPS, inerr: data.IF.IN_ERROR, outerr: data.IF.OUT_ERROR };

        inbpsList.push(newData.inbps);
        outbpsList.push(newData.outbps);
        inppsList.push(newData.inpps);
        outppsList.push(newData.outpps);
        inerrList.push(newData.inerr);
        outerrList.push(newData.outerr);
        p_gridData.splice(0, 0, newData);
        $('#p_perfGrid').jqxGrid('updatebounddata');


        p_bpsChart.series[0].addPoint([date.getTime(), newData.inbps]);
        p_bpsChart.series[1].addPoint([date.getTime(), newData.outbps]);
        p_ppsChart.series[0].addPoint([date.getTime(), newData.inpps]);
        p_ppsChart.series[1].addPoint([date.getTime(), newData.outpps]);
        p_errChart.series[0].addPoint([date.getTime(), newData.inerr]);
        p_errChart.series[1].addPoint([date.getTime(), newData.outerr]);

        p_bpsChart.redraw();
        p_ppsChart.redraw();
        p_errChart.redraw();

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

        $('#p_maxInerr').text(HmUtil.convertUnit1000(Math.max.apply(null, inerrList)));
        $('#p_maxOuterr').text(HmUtil.convertUnit1000(Math.max.apply(null, outerrList)));
        sum = inerrList.reduce(function(a, b) { return a + b; });
        $('#p_avgInerr').text(HmUtil.convertUnit1000(sum / inerrList.length));
        sum = outerrList.reduce(function(a, b) { return a + b; });
        $('#p_avgOuterr').text(HmUtil.convertUnit1000(sum / outerrList.length));
    },

    pwindow_stop: function() {
        _flag = false;
        timer = null;

        var message = {
            "type":"publish",
            "address":"tcp.to.server",
            "headers":{
                "info" : {
                    "js_id" : $('#sUserId').val(),
                    "js_guid" : sessionId,
                    "tcp_id" : "NT_RealTimePerfd",
                    "tcp_guid" : $('#pPollGrpNo').val()
                },
                "msg_type" : "SEC_UNIT_PERF",
                "msg_info" : {
                    "STATUS"  : "STOP",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "IF",
                    "MNG_NO" : $('#pMngNo').val(),
                    "IF_IDX" : $('#pIfIdx').val(),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "APPLY_SNMP_V1" : $('#pApplySnmpV1').val(),
                    "LINE_WIDTH" : $('#pLineWidth').val(),
                    "IF_NAME" : $('#pIfName').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
            },
            "body":{ "reply_target": guid }
        };

        var deliveryOptions = message.headers;
        ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":guid}, deliveryOptions);


        $('#pbtnStart').css('display', 'block');
        $('#pbtnPause').css('display', 'none');
        $('#p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
    },
    initStatus: function(){
        _flag = false;
        clearTimeout(timer)
        $('#pbtnStart').css('display', 'block');
        $('#pbtnPause').css('display', 'none');
        $('#p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
    }
}
