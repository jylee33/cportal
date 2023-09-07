var p_chartData = [], p_gridData = [];
var p_curPerfType = 'CPU';
var _flag = false;

var pItemTypeCond;
var pItemType;
var pOids;
var pPduType;
var pModuleIndex;
var pTempDiv;

var fixedCols = [
    { text: '일시', datafield: 'ymdhms' }
];

var ip = window.location.hostname;
var protocol = window.location.protocol;
var port = $("#gCupidPort").val();
var serverURL = protocol + "//" + ip +  ":"+port+"/eventbus/";

var ebSecUnitPerf = new EventBus(serverURL);



var timer = null;
var sessionId = HmUtil.generateUUID();
var guid = HmUtil.generateUUID();
//     var sessionId = 'sessionId'
$(function() {
    PSecUnitDevPerf.initVariable();
    PSecUnitDevPerf.observe();
    PSecUnitDevPerf.initDesign();
    PSecUnitDevPerf.initData();
});

var PSecUnitDevPerf = {
    /** variable */
    initVariable: function() {
        ebSecUnitPerf = new EventBus(serverURL);

        ebSecUnitPerf.onopen = function () {
            ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : sessionId, auth : "5"}, function (err, msg) {
                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                if( type.toUpperCase() == 'REC' &&  ('DEV' in body ) == true || ('FW' in body ) == true ||('DNS' in body ) == true ){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    if(guid == replyTarget)
                        PSecUnitDevPerf.pwindow_recvData(body);
                }
                if('RESULT' in body){
                    switch(body.RESULT){
                        case 0:
                            console.log('result ok')
                            break;
                        case 1:
                            PSecUnitDevPerf.initStatus();
                            alert('Validation check error.');
                            break;
                        case 2:
                            PSecUnitDevPerf.initStatus();
                            alert('수집중인 내용 없음.');
                            break;
                        case 4:
                            //   PSecUnitDevPerf.initStatus();
                            //   alert('엔진 연동 실패.');
                            break;
                    }

                }
            });
        };
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

        $('#p_cbPerfType').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                { label: 'Cpu', value: 'CPU' },
                { label: 'Memory', value: 'MEM' },
                { label: '온도', value: 'TEMP' },
                { label: 'Cps', value: 'CPS' },
                { label: 'Session', value: 'SESSION' },
                { label: 'FW_Cps', value: 'FW_CPS' },
                { label: 'FW_Session', value: 'FW_SESSION' },
                { label: 'HitRatio', value: 'HIT_RATIO' },
                { label: 'QueryRate', value: 'QUERY_RATE' }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function(event) {
            p_curPerfType = event.args.item.value;

            var _itemType = 1;
            switch(p_curPerfType) {
                case 'CPU':
                    _itemType = 1;
                    $('#p_cbDtlPerfType').parent().show();
                    break;
                case 'MEM':
                    $('#p_cbDtlPerfType').parent().show();
                    _itemType = 2;
                    break;
                case 'TEMP':
                    $('#p_cbDtlPerfType').parent().show();
                    _itemType = 5;
                    break;
                case 'FW_CPS': case 'FW_SESSION':
                    $('#p_cbDtlPerfType').parent().hide();
                    break;
                case 'CPS':
                    $('#p_cbDtlPerfType').parent().show();
                    _itemType = 14;
                    break;
                case 'SESSION':
                    $('#p_cbDtlPerfType').parent().show();
                    _itemType = 11;
                    break;
                case 'HIT_RATIO':
                case 'QUERY_RATE':
                    $('#p_cbDtlPerfType').parent().hide();
                    break;
            }

            Server.get('/main/env/devMgmt/getOidList.do', {
                data: {useFlag: 1, mngNo: $('#pMngNo').val(), itemType: _itemType, perfPoll: 1},
                success: function(result) {
                    $('#p_cbDtlPerfType').jqxDropDownList('source', result);
                }
            });
        }).on('bindingComplete', function(event){
            switch ($('#pDevKind2').val().toUpperCase()) {
                case 'L7SWITCH': case 'FIREWALL':
                    // session display
                    $('#p_cbPerfType').jqxDropDownList('enableItem', 'SESSION');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'HIT_RATIO');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'QUERY_RATE');
                    break;
                case 'SERVER':
                    if( $('#pVendor').val() == 'INFOBLOX'){
                        // qps display
                        $('#p_cbPerfType').jqxDropDownList('disableItem', 'SESSION');
                        $('#p_cbPerfType').jqxDropDownList('disableItem', 'CPS');
                        $('#p_cbPerfType').jqxDropDownList('enableItem', 'HIT_RATIO');
                        $('#p_cbPerfType').jqxDropDownList('enableItem', 'QUERY_RATE');
                    }else{
                        // not qps
                        $('#p_cbPerfType').jqxDropDownList('enableItem', 'SESSION');
                        $('#p_cbPerfType').jqxDropDownList('enableItem', 'CPS');
                        $('#p_cbPerfType').jqxDropDownList('disableItem', 'HIT_RATIO');
                        $('#p_cbPerfType').jqxDropDownList('disableItem', 'QUERY_RATE');
                    }
                    break;
                case 'DNS' :
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'SESSION');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'CPS');
                    $('#p_cbPerfType').jqxDropDownList('enableItem', 'HIT_RATIO');
                    $('#p_cbPerfType').jqxDropDownList('enableItem', 'QUERY_RATE');
                    // qps display
                    break;
                default:
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'SESSION');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'CPS');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'HIT_RATIO');
                    $('#p_cbPerfType').jqxDropDownList('disableItem', 'QUERY_RATE');
                //qps nodisplay
            }
        });

        $('#p_cbDtlPerfType').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/devMgmt/getOidList.do', {useFlag: 1, mngNo: $('#pMngNo').val(), itemType: 1, perfPoll: 1}),
            displayMember: 'snmpVal', valueMember: 'oid', selectedIndex: 0
        }).on('change', function(event) {
            //p_curPerfType = event.args.item.value;
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


        HmGrid.create($('#p_perfGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    localdata: p_gridData
                }
            ),
            pageable: false,
            columns : fixedCols
        }, CtxMenu.NONE);

        PSecUnitDevPerf.drawChart();
    },

    /** init data */
    initData: function() {
    },

    drawChart: function(type){
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

        var _dynamicCols = [];
        switch(type){
            case 'CPU' :case 'MEM' :case 'TEMP' : case 'HIT_RATIO' : case 'QUERY_RATE' :case 'CPS' :case 'SESSION' :
                _dynamicCols.push({ text: '성능값', datafield: 'val', width: 130, align: 'right' });
                options.series= [{name: type, data: null, lineWidth: 0.5}];
                break;
            case 'FW_CPS' :
                options.series= [   /*{name: 'VIRTUAL_TCP_CPS', data: null, lineWidth: 0.5},
                                        {name: 'VIRTUAL_UDP_CPS', data: null, lineWidth: 0.5},
                                        {name: 'VIRTUAL_ICMP_CPS', data: null, lineWidth: 0.5},*/
                    {name: 'TCP_CPS', data: null, lineWidth: 0.5},
                    {name: 'UDP_CPS', data: null, lineWidth: 0.5},
                    {name: 'ICMP_CPS', data: null, lineWidth: 0.5}
                ];
                /*_dynamicCols.push({ text: '가상화 TCP CPS', datafield: 'vTcpCps', width: 140, align: 'center' });
                _dynamicCols.push({ text: '가상화 UDP CPS', datafield: 'vUdpCps', width: 140, align: 'center' });
                _dynamicCols.push({ text: '가상화 ICMP CPS', datafield: 'vIcmpCps', width: 140, align: 'center' });*/
                _dynamicCols.push({ text: 'TCP CPS', datafield: 'rTcpCps', width: 140, align: 'center' });
                _dynamicCols.push({ text: 'UDP CPS', datafield: 'rUdpCps', width: 140, align: 'center' });
                _dynamicCols.push({ text: 'ICMP CPS', datafield: 'rIcmpCps', width: 140, align: 'center' });
                break;
            case 'FW_SESSION':
                options.series= [   /*{name: 'VIRTUAL_TCP_SESSION', data: null, lineWidth: 0.5},
                        {name: 'VIRTUAL_UPD_SESSION', data: null, lineWidth: 0.5},
                        {name: 'VIRTUAL_ICMP_SESSION', data: null, lineWidth: 0.5},*/
                    {name: 'TCP_SESSION', data: null, lineWidth: 0.5},
                    {name: 'UDP_SESSION', data: null, lineWidth: 0.5},
                    {name: 'ICMP_SESSION', data: null, lineWidth: 0.5}
                ];

                /*_dynamicCols.push({ text: '가상화 TCP SESSION', datafield: 'vTcpSession', width: 140, align: 'center' });
                _dynamicCols.push({ text: '가상화 UDP SESSION', datafield: 'vUdpSession', width: 140, align: 'center' });
                _dynamicCols.push({ text: '가상화 ICMP SESSION', datafield: 'vIcmpSession', width: 140, align: 'center' });*/
                _dynamicCols.push({ text: 'TCP SESSION', datafield: 'rTcpSession', width: 140, align: 'center' });
                _dynamicCols.push({ text: 'UDP SESSION', datafield: 'rUdpSession', width: 140, align: 'center' });
                _dynamicCols.push({ text: 'ICMP SESSION', datafield: 'rIcmpSession', width: 140, align: 'center' });
                break;

        }

        HmHighchart.createStockChart('p_chart', options, HmHighchart.TYPE_LINE);
        $('#p_perfGrid').jqxGrid('beginupdate', true);
        $('#p_perfGrid').jqxGrid({ columns: $.merge(_dynamicCols, fixedCols) });
        $('#p_perfGrid').jqxGrid('endupdate');
    },

    pwindow_start: function(){
        // 초기화
        _flag = true;
        $('#pbtnStart').css('display', 'none');
        $('#pbtnPause').css('display', 'block');
        $('#p_cbPerfType, #p_cTime, #p_reqCycle').jqxDropDownList({ disabled: true });
        $('#p_perfGrid').jqxGrid('clear');
        p_gridData.length = 0;

        var p_chart = $('#p_chart').highcharts();
        p_chart.destroy();
        PSecUnitDevPerf.drawChart($('#p_cbPerfType').val());

        var _itemType;
        switch($('#p_cbPerfType').val()) {
            case 'CPU': _itemType = 1; break;
            case 'MEM': _itemType = 2; break;
            case 'TEMP': _itemType = 5; break;
            case 'CPS': _itemType = 14; break;
            case 'SESSION': _itemType = 11; break;
            case 'FW_CPS': _itemType = -1; break;
            case 'FW_SESSION': _itemType = -1; break;
            case 'HIT_RATIO': _itemType = -1; break;
            case 'QUERY_RATE': _itemType = -1; break;
        }

        var params = {
            useFlag: 1,
            mngNo: $('#pMngNo').val(),
            itemType: _itemType,
            perfPoll: 1
        };
        switch(_itemType){
            case 1: case 2: case 5: case 11: case 14:
                var oid;
                if($('#p_cbDtlPerfType').jqxDropDownList('getSelectedItem') != null) {
                    oid = $('#p_cbDtlPerfType').jqxDropDownList('getSelectedItem').originalItem;
                    if(params.itemType != -1) $.extend(params, {itemTypeCond: oid.itemTypeCond, moduleTmplOidSeq: oid.moduleTmplOidSeq, itemIdx: oid.itemIdx });
                    PSecUnitDevPerf.getOidInfo(params);
                }else{
                    PSecUnitDevPerf.initStatus();
                }
                break;
            default:
                PSecUnitDevPerf.getOidInfo(params);
        }

    },

    getOidInfo: function(params){
        Server.get('/dev/getOidsInfo.do', {
            data: params,
            success: function (result) {
                pItemTypeCond = result.itemTypeCond;
                pItemType = result.itemType;

                pOids = (result.oids).htmlCharacterUnescapes();
                pPduType = (result.pduType).htmlCharacterUnescapes();
                pModuleIndex = (result.moduleIndex).htmlCharacterUnescapes();
                pTempDiv = (result.tempDiv).htmlCharacterUnescapes();


                PSecUnitDevPerf.send();

                timer = setTimeout(function(){
                    PSecUnitDevPerf.pwindow_stop();
                }, $('#p_cTime').val() * 60 * 1000);
            }
        });
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
                "msg_type" : "SEC_UNIT_PERF"
            },
            "body":{ "reply_target": guid }
        };

        switch($('#p_cbPerfType').val()) {
            case 'CPU': case 'MEM': case 'TEMP': case 'CPS': case 'SESSION': // DEV
                message.headers.msg_info = {
                    "STATUS"  : "START",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "DEV",
                    "MNG_NO" : parseInt($('#pMngNo').val()),
                    "ITEM_TYPE" : pItemType,
                    "ITEM_TYPE_COND" : pItemTypeCond,
                    "OIDS" : JSON.parse(pOids),
                    "PDU_TYPE" : JSON.parse(pPduType),
                    "MODULE_INDEX" : JSON.parse(pModuleIndex),
                    "TEMP_DIV" : JSON.parse(pTempDiv),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
            case 'HIT_RATIO': case 'QUERY_RATE': // DNS
                message.headers.msg_info = {
                    "STATUS"  : "START",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "DNS",
                    "MNG_NO" : $('#pMngNo').val(),
                    // "ITEM_TYPE_COND" : zoneMain[zoneNum].itemTypeCond,
                    // "OIDS" : zoneMain[zoneNum].oids,
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
            case 'FW_CPS': case 'FW_SESSION': // FW
                message.headers.msg_info = {
                    "STATUS"  : "START",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "FW",
                    "MNG_NO" : $('#pMngNo').val(),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    // "LOGIN_ID" : zoneMain[zoneNum].loginId,
                    // "LOGIN_PWD" : zoneMain[zoneNum].loginPwd,
                    // "PORT" : zoneMain[zoneNum].port,
                    // "EN_PWD" : zoneMain[zoneNum].enPwd,
                    // "LOGIN_FORMAT" : zoneMain[zoneNum].loginFormat,
                    // "PWD_FORMAT" : zoneMain[zoneNum].pwdFormat,
                    // "EN_FLAG" : zoneMain[zoneNum].enFlag,
                    // "ENG_CHAR" : zoneMain[zoneNum].engChar,
                    // "CONF_MODE" : zoneMain[zoneNum].confMode,
                    // "COMMAND_FLAG" : zoneMain[zoneNum].commandFlag,
                    // "MORE_FORMAT" : zoneMain[zoneNum].moreFormat,
                    // "COMMAND" : zoneMain[zoneNum].command,
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
        }

        // switch($('#pDevKind2').val()) {
        //     case 'FIREWALL':
        //
        //     break;
        //     case 'DNS':
        //
        //     break;
        //     case 'L7SWITCH':
        //         message.headers.msg_info = {
        //             "STATUS"  : "START",
        //             "CYCLE"  : $('#p_reqCycle').val(),
        //             "REQ_TYPE" : "DEV",
        //             "MNG_NO" : $('#pMngNo').val(),
        //             "ITEM_TYPE" : $('#p_cbPerfType').val(),
        //             "ITEM_TYPE_COND" : $('#pItemTypeCond').val(),
        //             "OIDS" : JSON.parse($('#pOids').val()),
        //             "PDU_TYPE" : JSON.parse($('#pPduType').val()),
        //             "DEV_IP" : $('#pDevIp').val(),
        //             "COMMUNITY" : $('#pCommunity').val(),
        //             "SNMP_VER" : $('#pSnmpVer').val(),
        //             "SNMP_USER_ID" : $('#pSnmpUserId').val(),
        //             "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
        //             "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
        //             "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
        //             "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
        //             "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
        //             "VENDOR" : $('#pVendor').val(),
        //             "MODEL" : $('#pModel').val(),
        //             "DEV_KIND2" : $('#pDevKind2').val(),
        //             "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
        //         }
        //     break;
        //     default:
        //
        //
        // }


        var deliveryOptions = message.headers;
        ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":guid}, deliveryOptions);
    },

    pwindow_recvData: function(data) {
        var perfVal = 0;
        switch(p_curPerfType) {
            case 'CPU':
                var perfData = data.DEV.CPU;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'MEM':
                var perfData = data.DEV.MEM;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'TEMP':
                var perfData = data.DEV.TEMP;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'CPS':
                var perfData = data.DEV.CPS;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'SESSION':
                var perfData = data.DEV.SESSION;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'FW_CPS':
                var perfData = data.FW;
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'FW_SESSION':
                var perfData = data.FW;
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'HIT_RATIO':
                var perfData = data.DNS.HIT_RATIO;
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
            case 'QUERY_RATE':
                var perfData = data.DNS.QUERY_RATE;
                PSecUnitDevPerf.setData(p_curPerfType, perfData);
                break;
        }

    },
    setData: function(type, data){
        var p_chart = $('#p_chart').highcharts();

        // p_chart.yAxis[0].axisTitle.attr({
        //     text: p_curPerfType
        // });

        var date = new Date();
        switch(type){
            case 'FW_CPS':
                var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                    rTcpCps: data[0].TCP_CPS, rUdpCps: data[0].UDP_CPS, rIcmpCps: data[0].ICMP_CPS/*,
                        rTcpCps: data[1].TCP_CPS, rUdpCps: data[1].UDP_CPS, rIcmpCps: data[1].ICMP_CPS*/
                };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_CPS)], true,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_CPS)], true,false);
                p_chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_CPS)], true,false);
                /*p_chart.series[3].addPoint( [date.getTime(), parseFloat(data[1].TCP_CPS)], true,false);
                p_chart.series[4].addPoint( [date.getTime(), parseFloat(data[1].UDP_CPS)], true,false);
                p_chart.series[5].addPoint( [date.getTime(), parseFloat(data[1].ICMP_CPS)], true,false);*/
                break;
            case 'FW_SESSION':
                var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                    rTcpSession: data[0].TCP_SESSION, rUdpSession: data[0].UDP_SESSION, rIcmpSession: data[0].ICMP_SESSION/*,
                        rTcpSession: data[1].TCP_SESSION, rUdpSession: data[1].UPD_SESSION, rIcmpSession: data[1].ICMP_SESSION*/
                };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_SESSION)], true,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_SESSION)], true,false);
                p_chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_SESSION)], true,false);
                /*   p_chart.series[3].addPoint( [date.getTime(), parseFloat(data[1].TCP_SESSION)], true,false);
                   p_chart.series[4].addPoint( [date.getTime(), parseFloat(data[1].UDP_SESSION)], true,false);
                   p_chart.series[5].addPoint( [date.getTime(), parseFloat(data[1].ICMP_SESSION)], true,false);*/
                break;
            default:
                var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'), val : data };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data)],true,false);
        }
        // p_chart.redraw();

        p_gridData.splice(0, 0, newData);
        $('#p_perfGrid').jqxGrid('updatebounddata');
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
                "msg_type" : "SEC_UNIT_PERF"
            },
            "body":{ "reply_target": guid }
        };

        switch($('#p_cbPerfType').val()) {
            case 'CPU': case 'MEM': case 'TEMP': case 'CPS': case 'SESSION':// DEV
                message.headers.msg_info = {
                    "STATUS"  : "STOP",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "DEV",
                    "MNG_NO" : parseInt($('#pMngNo').val()),
                    "ITEM_TYPE" : pItemType,
                    "ITEM_TYPE_COND" : pItemTypeCond,
                    "OIDS" : JSON.parse(pOids),
                    "PDU_TYPE" : JSON.parse(pPduType),
                    "MODULE_INDEX" : JSON.parse(pModuleIndex),
                    "TEMP_DIV" : JSON.parse(pTempDiv),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
            case 'HIT_RATIO': case 'QUERY_RATE': // DNS
                message.headers.msg_info = {
                    "STATUS"  : "STOP",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "DNS",
                    "MNG_NO" : $('#pMngNo').val(),
                    // "ITEM_TYPE_COND" : zoneMain[zoneNum].itemTypeCond,
                    // "OIDS" : zoneMain[zoneNum].oids,
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
            case 'FW_CPS': case 'FW_SESSION': // FW
                message.headers.msg_info = {
                    "STATUS"  : "STOP",
                    "CYCLE"  : $('#p_reqCycle').val(),
                    "REQ_TYPE" : "FW",
                    "MNG_NO" : $('#pMngNo').val(),
                    "DEV_IP" : $('#pDevIp').val(),
                    "COMMUNITY" : $('#pCommunity').val(),
                    "SNMP_VER" : $('#pSnmpVer').val(),
                    "SNMP_USER_ID" : $('#pSnmpUserId').val(),
                    "SNMP_SECURITY_LEVEL" : $('#pSnmpSecurityLevelStr').val(),
                    "SNMP_AUTH_TYPE" : $('#pSnmpAuthTypeStr').val(),
                    "SNMP_AUTH_KEY" : $('#pSnmpAuthKey').val(),
                    "SNMP_ENCRYPT_TYPE" : $('#pSnmpEncryptTypeStr').val(),
                    "SNMP_ENCRYPT_KEY" : $('#pSnmpEncryptKey').val(),
                    "VENDOR" : $('#pVendor').val(),
                    "MODEL" : $('#pModel').val(),
                    "DEV_KIND2" : $('#pDevKind2').val(),
                    "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
                }
                break;
        }

        var deliveryOptions = message.headers;
        ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":guid}, deliveryOptions);

        $('#pbtnStart').css('display', 'block');
        $('#pbtnPause').css('display', 'none');
        $('#p_cbPerfType, #p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
    },

    initStatus: function (){
        _flag = false;
        clearTimeout(timer)
        $('#p_perfGrid').jqxGrid('clear');
        $('#pbtnStart').css('display', 'block');
        $('#pbtnPause').css('display', 'none');
        $('#p_cbPerfType, #p_cTime, #p_reqCycle').jqxDropDownList({ disabled: false });
    }

}
