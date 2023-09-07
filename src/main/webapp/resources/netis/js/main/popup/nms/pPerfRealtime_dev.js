var perf_realtimeChart;
var pRealtime_curPerfType = 'CPU';
var pRealtime_data = [];
var _flag = false;
var pRealtime_itemTypeCond;
var pRealtime_itemType;
var pRealtime_oids;
var pRealtime_pduType;
var pRealtime_moduleIndex;
var pRealtime_tempDiv;

var pRealtime_protocol = window.location.protocol;
var pRealtime_ip = window.location.hostname;
var pRealtime_port = $("#gCupidPort").val();
// var pRealtime_port = $("#gCupidPort").val();
var pRealtime_serverURL = pRealtime_protocol + "//" + pRealtime_ip +  ":"+pRealtime_port+"/eventbus/";
//var pRealtime_serverURL = pRealtime_protocol + "//10.1.3.154:"+pRealtime_port+"/eventbus/";
////http://183.109.124.233:8900/eventbus/info?t=1639024612418
//--------------------------------------------------------------------------------------------------------

//pRealtime_serverURL = "http://10.1.2.154:8900/eventbus/";
//------------------------------------------------------------------------------------------------------
var pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);

var pRealtime_timer = null;
var pRealtime_sessionId = HmUtil.generateUUID();
var pRealtime_guid = HmUtil.generateUUID();

var pRealtime_fixedCols = [
    { text: '일시', datafield: 'ymdhms', width: 150, cellsalign: 'center'  }
];

var rtCupidRestIp;
var rtCupidRestPort;
var rtMngNo;
var rtDevIp;
var rtPollGrpNo;
var rtDevKind2;
var rtCommunity;
var rtSnmpVer;
var rtSnmpUserId;
var rtSnmpSecurityLevelStr;
var rtSnmpAuthTypeStr;
var rtSnmpAuthKey;
var rtSnmpEncryptTypeStr;
var rtSnmpEncryptKey;
var rtModel;
var rtVendor;

var sTimer, sInterval;
var pSummaryObj = {};
var pSummaryUnit = '';

var pPerfRealtime = {
    curMngNo: -1,
    searchAll: function(){
        pPerfRealtime.getRealtimeParams();
        pPerfRealtime.itemIdxSearch();
    },
    /* snmp 정보를 가져온다.*/
    getRealtimeParams: function () {

        rtCupidRestIp = $('#gCupidRestIp').val();
        rtCupidRestPort = $('#gCupidRestPort').val();

        Server.get('/dev/getRtPerfInfo.do', {
            data: {mngNo: dtl_mngNo, rtType: 'DEV'},
            success: function(result) {
                if(result != null){
                    rtMngNo = result.mngNo;
                    rtDevIp = result.devIp;
                    rtPollGrpNo = result.pollGrpNo;
                    rtDevKind2 = result.devKind2;
                    rtCommunity = result.community;
                    rtSnmpVer = result.snmpVer;
                    rtSnmpUserId = result.snmpUserId;
                    rtSnmpSecurityLevelStr = result.snmpSecurityLevel;
                    rtSnmpAuthTypeStr = result.snmpAuthType;
                    rtSnmpAuthKey = result.snmpAuthKey;
                    rtSnmpEncryptTypeStr = result.snmpEncryptType;
                    rtSnmpEncryptKey = result.snmpEncryptKey;
                    rtModel = result.model;
                    rtVendor = result.vendor;
                }
            }
        });
    },

    itemIdxSearch: function () {
        var _itemType = 1;
        switch($('#sPerfType_pPerfRealtime').val()) {
            case 'CPU': _itemType = 1; pSummaryUnit = '%'; break;
            case 'MEM': _itemType = 2; pSummaryUnit = '%'; break;
            case 'TEMP': _itemType = 5; pSummaryUnit = '℃'; break;
            case 'CPS': _itemType = 14; pSummaryUnit = 'Cnt'; break;
            case 'SESSION': _itemType = 11; pSummaryUnit = 'Cnt'; break;
            case 'FW_CPS': _itemType = -1; pSummaryUnit = 'Cnt'; break;
            case 'FW_SESSION': _itemType = -1; pSummaryUnit = 'Cnt'; break;
            case 'HIT_RATIO': _itemType = -1; pSummaryUnit = '%'; break;
            case 'QUERY_RATE': _itemType = -1; pSummaryUnit = '%'; break;
        }

        Server.get('/main/env/devMgmt/getOidList.do', {
            data: {useFlag: 1, mngNo: dtl_mngNo, itemType: _itemType, perfPoll: 1, addAll :'Y'},
            success: function(result) {
                if(_itemType != 6) {
                    $('#sItemIdx_pPerfRealtime').jqxDropDownList('clear');
                }
                $('#sItemIdx_pPerfRealtime').jqxDropDownList({ source: result, selectedIndex: 0 });
            }
        });
    },
    initialize: function () {

        pPerfRealtime.getRealtimeParams();
        //debugger;
        pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);
        pRealtime_ebSecUnitPerf.enableReconnect(true);

        pRealtime_ebSecUnitPerf.onopen = function () {

            pRealtime_ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : pRealtime_sessionId, auth : "5"}, function (err, msg) {
                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                if( type.toUpperCase() == 'REC' &&  ('DEV' in body ) == true || ('FW' in body ) == true ||('DNS' in body ) == true ){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    //console.log(pRealtime_guid, replyTarget)
                    if(pRealtime_guid == replyTarget)
                        pPerfRealtime.recvData(body);
                }
                console.log("RESULT", body);
                if('RESULT' in body){
                    switch(body.RESULT){
                        case 0:
                            console.log('result ok')
                            break;
                        case 1:
                            pPerfRealtime.initStatus();
                            alert('Validation check error.');
                            break;
                        case 2:
                            pPerfRealtime.initStatus();
                            alert('수집중인 내용 없음.');
                            break;
                        case 4:
                            //   pPerfRealtime.initStatus();
                            //   alert('엔진 연동 실패.');
                            break;
                    }

                }
            });
        };
    },

    initDesign: function () {
        $('#sPerfCycle_pPerfRealtime').empty();
        $('#sXaxisCnt_pPerfRealtime').empty();
        $('#sTime_pPerfRealtime').empty();

        HmBoxCondition.createRadio($('#sPerfCycle_pPerfRealtime'), HmResource.getResource('cond_realtime_perf_cycle')); 	//요청주기
        HmBoxCondition.createRadio($('#sXaxisCnt_pPerfRealtime'), HmResource.getResource('cond_realtime_perf_xaxis_cnt'));	//표현개수
        HmBoxCondition.createRadio($('#sTime_pPerfRealtime'), HmResource.getResource('cond_realtime_time')); 				//종료시간

        HmJqxSplitter.create($('#pPerfRealtime_splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: "70%" }, { size: '30%' }], '100%', '100%', {showSplitBar: false});

        HmGrid.create($('#perf_grid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    localdata: pRealtime_data
                }
            ),
            pageable: false,
            columns : pRealtime_fixedCols,
            // height : 400
        }, CtxMenu.NONE);

        $('#sPerfType_pPerfRealtime').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
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
            pRealtime_curPerfType = event.args.item.value;

            var _itemType = 1;
            switch (pRealtime_curPerfType) {
                case 'CPU':
                    _itemType = 1;
                    pSummaryUnit = '%';
                    $('#sItemIdx_pPerfRealtime').parent().show();
                    break;
                case 'MEM':
                    _itemType = 2;
                    pSummaryUnit = '%';
                    $('#sItemIdx_pPerfRealtime').parent().show();
                    break;
                case 'TEMP':
                    _itemType = 5;
                    pSummaryUnit = '℃';
                    $('#sItemIdx_pPerfRealtime').parent().show();
                    break;
                case 'FW_CPS':
                    pSummaryUnit = 'Cnt';
                case 'FW_SESSION':
                    pSummaryUnit = 'Cnt';
                    $('#sItemIdx_pPerfRealtime').parent().hide();
                    break;
                case 'CPS':
                    _itemType = 14;
                    pSummaryUnit = 'Cnt';
                    $('#sItemIdx_pPerfRealtime').parent().show();
                    break;
                case 'SESSION':
                    _itemType = 11;
                    pSummaryUnit = 'Cnt';
                    $('#sItemIdx_pPerfRealtime').parent().show();
                    break;
                case 'HIT_RATIO':
                    pSummaryUnit = '%';
                case 'QUERY_RATE':
                    pSummaryUnit = '%';
                    $('#sItemIdx_pPerfRealtime').parent().hide();
                    break;
            }

            Server.get('/main/env/devMgmt/getOidList.do', {
                data: {useFlag: 1, mngNo: dtl_mngNo, itemType: _itemType, perfPoll: 1, addAll :'Y'},
                success: function(result) {
                    $('#sItemIdx_pPerfRealtime').jqxDropDownList('source', result);
                    $('#sItemIdx_pPerfRealtime').jqxDropDownList('selectIndex', 0);
                }
            });

        }).on('bindingComplete', function(event){
            switch (rtDevKind2.toUpperCase()) {
                case 'L7SWITCH': case 'FIREWALL':
                    // session display
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'SESSION');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'HIT_RATIO');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'QUERY_RATE');
                    break;
                case 'SERVER':
                    if( $('#pVendor').val() == 'INFOBLOX'){
                        // qps display
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'SESSION');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'CPS');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'HIT_RATIO');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'QUERY_RATE');
                    }else{
                        // not qps
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'SESSION');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'CPS');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'HIT_RATIO');
                        $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'QUERY_RATE');
                    }
                    break;
                case 'DNS' :
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'SESSION');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'CPS');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'HIT_RATIO');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('enableItem', 'QUERY_RATE');
                    // qps display
                    break;
                default:
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'SESSION');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'CPS');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'HIT_RATIO');
                    $('#sPerfType_pPerfRealtime').jqxDropDownList('disableItem', 'QUERY_RATE');
                //qps nodisplay
            }
        });

        $('#sItemIdx_pPerfRealtime').jqxDropDownList({ width: '200px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/devMgmt/getOidList.do', {useFlag: 1, mngNo: dtl_mngNo, itemType: 1, perfPoll: 1}),
            displayMember: 'snmpVal', valueMember: 'oid', selectedIndex: 0
        });

        var chartArr = ['perf_realtimeChart'];
        $.each(chartArr, function (idx, value) {
            pPerfRealtime.createChart(value);
        });

        $(".box").hide();
        $("." + "perfDefault").show();
        pPerfRealtime.chgSummary($('#sPerfType_pPerfRealtime').val());
    },

    resizeChart: function() {
        // 해당 탭이 열려있을때만 활성화
        if ($('#dtlTab').val() == 4) {

            var chartArr = ['perf_realtimeChart'];
            $.each(chartArr, function (idx, value) {
                pPerfRealtime.createChart(value);
            });

            pPerfRealtime.searchAll();
        }
    },

    reSetDesign : function() {
        if (_flag) pPerfRealtime.stop(true);
        if (typeof pRealtime_timer !== "undefined" && pRealtime_timer) clearInterval(pRealtime_timer); // 임시
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        if (typeof sTimer !== "undefined" && sTimer) clearTimeout(sTimer);  //임시
        if (typeof sInterval !== "undefined" && sInterval) clearInterval(sInterval);//임시
        pPerfRealtime.getRealtimeParams();
        pPerfRealtime.initDesign();
    },

    initData: function() {

    },

    createChart: function (chartId) {
        pPerfRealtime.chgChart(chartId, $('#sPerfType_pPerfRealtime').val());
    },

    /* 차트 변경 */
    chgChart: function (chartId, itemType) {
        var chart = $('#' + chartId).highcharts();
        if (chart !== undefined) {
            perf_realtimeChart.destroy();
        }

        var info = { label: '', value: '', unit: '' };

        var defaultSeries = [ {name: itemType, type: 'spline', xField: 'DT_YMDHMS', yField: 'val'}
        ];

        var fwCpsSeries = [ 	{name: 'TCP CPS', type: 'spline', xField: 'DT_YMDHMS', yField: 'rTcpCps'},
            {name: 'UDP CPS', type: 'spline', xField: 'DT_YMDHMS', yField: 'rUdpCps'},
            {name: 'ICMP CPS', type: 'spline', xField: 'DT_YMDHMS', yField: 'rIcmpCps'}
        ];

        var fwSessionSeries = [	 {name: 'TCP SESSION', type: 'spline', xField: 'DT_YMDHMS', yField: 'rTcpSession'},
            {name: 'UDP SESSION', type: 'spline', xField: 'DT_YMDHMS', yField: 'rUdpSession'},
            {name: 'ICMP SESSION', type: 'spline', xField: 'DT_YMDHMS', yField: 'rIcmpSession'}
        ];

        var options = {
            time: {
                useUTC: false
            },
            tooltip: {
                shared: true,
                formatter: function () {
                    var t;
                    $.each(this.points, function (i, point) {
                        if (t == null) t = '<br/>' + $.format.date(point.x, 'yyyy-MM-dd HH:mm:ss');
                        if(point.y !== 0) t += '<br/><span style="color:' + point.color + '">\u25CF </span>' + point.series.name + ' : ' + point.y;
                    });
                    return t;
                }
            },
            // xAxis: {
            //     type: 'datetime',
            //     tickPixelInterval: 150
            // },
            // yAxis: {
            //     min: 0,
            //     max : 100
            // },
            plotOptions: {
                line: {
                    connectNulls: true
                },
                series: {
                    dataLabels: {
                        enabled: true
                    }
                },
                spline: {
                    marker: {
                        enabled: false
                    },
                }
            }
        };

        var _rtDynamicCols = [];
        switch(itemType){
            case 'CPU' :case 'MEM' :case 'TEMP' : case 'HIT_RATIO' : case 'QUERY_RATE' :case 'CPS' :case 'SESSION' :
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: defaultSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: '성능값', datafield: 'val',  align: 'center', cellsalign: 'right'});
                break;
            case 'FW_CPS' :
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: fwCpsSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: 'TCP CPS', datafield: 'rTcpCps',  align: 'center', cellsalign: 'right' });
                _rtDynamicCols.push({ text: 'UDP CPS', datafield: 'rUdpCps',  align: 'center', cellsalign: 'right' });
                _rtDynamicCols.push({ text: 'ICMP CPS', datafield: 'rIcmpCps', align: 'center', cellsalign: 'right' });
                break;
            case 'FW_SESSION':
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: fwSessionSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: 'TCP SESSION', datafield: 'rTcpSession',  align: 'center', cellsalign: 'right' });
                _rtDynamicCols.push({ text: 'UDP SESSION', datafield: 'rUdpSession', align: 'center', cellsalign: 'right' });
                _rtDynamicCols.push({ text: 'ICMP SESSION', datafield: 'rIcmpSession',  align: 'center', cellsalign: 'right' });
                break;
        };
        perf_realtimeChart.initialize();

        pRealtime_data.length = 0;
        $('#perf_grid').jqxGrid('clear');
        $('#perf_grid').jqxGrid('beginupdate', true);
        $('#perf_grid').jqxGrid({ columns: $.merge(_rtDynamicCols, pRealtime_fixedCols) });
        $('#perf_grid').jqxGrid('endupdate');

    },

    chgSummary: function(itemType){
        switch(itemType){
            case 'CPU' :case 'MEM' :case 'TEMP' : case 'HIT_RATIO' : case 'QUERY_RATE' :case 'CPS' :case 'SESSION' :
                $(".box").not("." + "perfDefault").hide();
                $("." + "perfDefault").show();
                break;
            case 'FW_CPS' :
                $(".box").not("." + "perfFwCps").hide();
                $("." + "perfFwCps").show();
                break;
            case 'FW_SESSION':
                $(".box").not("." + "perfFwSession").hide();
                $("." + "perfFwSession").show();
                break;
            default:
                $(".box").not("." + "perfDefault").hide();
                $("." + "perfDefault").show();
        };

        pSummaryObj = {};
        pSummaryObj.defaultSum = 0;
        pSummaryObj.tcpSum = 0;
        pSummaryObj.UdpSum = 0;
        pSummaryObj.IcmpSum = 0;
        pSummaryObj.dataCnt = 0;
        //$(".perfBox").text('0' + ' ' + pSummaryUnit);
        $(".perfBox").text('0');

        // var obj = $('#p_md_' + key);
        // if(obj != null) {
        //     obj.text(value || '');
        // }

    },

    /** 조회버튼 클릭 */
    start: function(){
        console.log("start ok");

        // Server.get('/dev/getRtPerfInfo.do', {
        //     data: {mngNo: dtl_mngNo, rtType: 'DEV'},
        //     success: function(result) {
        //         if(result != null){
        //             console.log('devStatus', result.devStatus);
        //             if(result.devStatus != '1'){
        //                 alert('[' + result.disDevname + '] 장비는 상태가 dead 상태 입니다.');
        //             } else {
                        _flag = true;
                        $('#pPerfRealtime_btnStart').css('display', 'none');
                        $('#pPerfRealtime_btnPause').css('display', 'block');
                        $('#sPerfType_pPerfRealtime, #sItemIdx_pPerfRealtime').jqxDropDownList({ disabled: true });
                        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', true);		//요청주기
                        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', true);		//표현개수
                        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', true);			//종료시간

                        //Chart 초기화
                        pPerfRealtime.chgChart('perf_realtimeChart', $('#sPerfType_pPerfRealtime').val());
                        pPerfRealtime.chgSummary($('#sPerfType_pPerfRealtime').val());

                        var _itemType;
                        switch($('#sPerfType_pPerfRealtime').val()) {
                            case 'CPU': _itemType = 1; pSummaryUnit = '%'; break;
                            case 'MEM': _itemType = 2; pSummaryUnit = '%'; break;
                            case 'TEMP': _itemType = 5; pSummaryUnit = '℃'; break;
                            case 'CPS': _itemType = 14; pSummaryUnit = 'Cnt'; break;
                            case 'SESSION': _itemType = 11; pSummaryUnit = 'Cnt'; break;
                            case 'FW_CPS': _itemType = -1; pSummaryUnit = 'Cnt'; break;
                            case 'FW_SESSION': _itemType = -1; pSummaryUnit = 'Cnt'; break;
                            case 'HIT_RATIO': _itemType = -1; pSummaryUnit = '%'; break;
                            case 'QUERY_RATE': _itemType = -1; pSummaryUnit = '%'; break;
                        }

                        var params = {
                            useFlag: 1,
                            mngNo: dtl_mngNo,
                            itemType: _itemType,
                            perfPoll: 1
                        };

                        switch(_itemType){
                            case 1: case 2: case 5: case 11: case 14:
                            var oid;
                            if($('#sItemIdx_pPerfRealtime').jqxDropDownList('getSelectedItem') != null) {
                                oid = $('#sItemIdx_pPerfRealtime').jqxDropDownList('getSelectedItem').originalItem;
                                if(params.itemType != -1) $.extend(params, {itemTypeCond: oid.itemTypeCond, moduleTmplOidSeq: oid.moduleTmplOidSeq, itemIdx: oid.itemIdx });
                                pPerfRealtime.getOidInfo(params);
                            }else{
                                pPerfRealtime.initStatus();
                            }
                            break;
                            default:
                                pPerfRealtime.getOidInfo(params);
                        }

                    // }
                // }
        //     }//success
        // });//Server.get()
        console.log("start end");
    },

    // 실시간엔진
    send: function() {
        console.log("send ok");
        var _selectedItem = $('#sItemIdx_pPerfRealtime').jqxDropDownList('getSelectedItem').originalItem;

        var _runList = {};
        _runList[rtPollGrpNo + ''] = [parseInt(rtMngNo)];

        var _detailInfo = {};
        if(pRealtime_itemType != '-1'){
            _detailInfo.ITEM_TYPE = pRealtime_itemType;
            if(pRealtime_moduleIndex != undefined){
                var set = new Set(Object.values(JSON.parse(pRealtime_moduleIndex)));
                var _itemIdxList = Array.from(set);
                _detailInfo.ITEM_IDX = _itemIdxList;
                if(_selectedItem.moduleTmplOidSeq != 0){
                    _detailInfo.MODULE_TMPL_OID_SEQ = _selectedItem.moduleTmplOidSeq + "";
                }
            }
            var _paramObj = {
                MSG_SEND: "WEB",//데이터전달위치
                MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
                RUN_LIST: _runList,
                DETAIL_INFO: _detailInfo,//RUN_LIST에서 추가로 사용할 값
                MSG_BYPASS: 1,
                MSG_STATUS: "START",//START,END
                MSG_CYCLE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
                MSG_CYCLE_RANGE: parseInt(HmBoxCondition.val('sTime_pPerfRealtime')),
                RTN_FLAG: 1,//0:결과과정 전달안함
                RTN_ID: $('#sUserId').val(),//cupid user id
                RTN_TARGET: pRealtime_guid,//cupid guid
                RTN_GUID: pRealtime_sessionId//cupid sessionId
            }

            ServerRest.cupidRest({
                _REST_PATH: '/nms/perf/dev',
                _REST_PARAM: _paramObj,
            });

            pRealtime_timer = setInterval(function(){
                ServerRest.cupidHealthCheck({_REST_PATH: '/nms/health/dev', _GUID: pRealtime_guid});
            }, 60 * 1000);//1분마다 한번씩 호출함
        }

    },
    getOidInfo: function(params){
        Server.get('/dev/getOidsInfo.do', {
            data: params,
            success: function (result) {
                console.log(result);
                pRealtime_itemTypeCond = result.itemTypeCond;
                pRealtime_itemType = result.itemType;

                pRealtime_oids = (result.oids).htmlCharacterUnescapes();
                pRealtime_pduType = (result.pduType).htmlCharacterUnescapes();
                pRealtime_moduleIndex = (result.moduleIndex).htmlCharacterUnescapes();
                pRealtime_tempDiv = (result.tempDiv).htmlCharacterUnescapes();


                if(pRealtime_moduleIndex == '{}'){
                    alert('수집정보가 존재하지않아 요청을 수행할수 없습니다.');

                    _flag = false;
                    $('#pPerfRealtime_btnStart').css('display', 'block');
                    $('#pPerfRealtime_btnPause').css('display', 'none');
                    $('#sPerfType_pPerfRealtime, #sItemIdx_pPerfRealtime').jqxDropDownList({ disabled: false });
                    HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);		//요청주기
                    HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', false);		//표현개수
                    HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);			//종료시간

                    return ;
                } else {
                    pPerfRealtime.send();
                }


                //종료시간 1분~20분 인경우 (0인경우 정지전까지 표시)
                /** 수정 완료 후 변경 또는 주석 제거*/
                console.log("sTime_pPerfRealtime : " + HmBoxCondition.val('sTime_pPerfRealtime'));
                if(HmBoxCondition.val('sTime_pPerfRealtime') > 0) {
                    timer = setTimeout(function(){
                        pPerfRealtime.stop(false);
                    }, HmBoxCondition.val('sTime_pPerfRealtime') * 60 * 1000 + (HmBoxCondition.val('sPerfCycle_pPerfRealtime') * 500));
                }
            }
        });
    },

    stop: function(REST_SEND) {
        console.log("stop ok");
        _flag = false;
        if(typeof  pRealtime_timer !== "undefined" && pRealtime_timer) clearInterval(pRealtime_timer);
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        if (typeof sTimer !== "undefined" && sTimer) clearTimeout(sTimer);  //임시
        if (typeof sInterval !== "undefined" && sInterval) clearInterval(sInterval);//임시
        timer = null;
        sTimer = null; //임시
        sInterval = null; //임시
        pRealtime_timer = null;

        var _selectedItem = $('#sItemIdx_pPerfRealtime').jqxDropDownList('getSelectedItem').originalItem;

        var _runList = {};
        _runList[rtPollGrpNo + ''] = [parseInt(rtMngNo)];

        if(pRealtime_itemType != '-1'){
            var _detailInfo = {
                ITEM_TYPE: pRealtime_itemType,
            };
            if(pRealtime_moduleIndex != undefined){
                var set = new Set(Object.values(JSON.parse(pRealtime_moduleIndex)));
                var _itemIdxList = Array.from(set);

                _detailInfo.ITEM_IDX = _itemIdxList;
                if(_selectedItem.moduleTmplOidSeq != 0){
                    _detailInfo.MODULE_TMPL_OID_SEQ = _selectedItem.moduleTmplOidSeq + "";
                }
            }
        }

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: _runList,
            DETAIL_INFO: _detailInfo,//RUN_LIST에서 추가로 사용할 값
            MSG_BYPASS: 1,
            MSG_STATUS: "STOP",//START,STOP
            MSG_CYCLE: HmBoxCondition.val('sPerfCycle_pPerfRealtime'),//초단위 주기적 실행
            MSG_CYCLE_RANGE: parseInt(HmBoxCondition.val('sTime_pPerfRealtime')),
            RTN_FLAG: 1,//0:결과과정 전달안함
            RTN_ID: $('#sUserId').val(),//cupid user id
            RTN_TARGET: pRealtime_guid,//cupid guid
            RTN_GUID: pRealtime_sessionId//cupid sessionId
        };

        if(REST_SEND){
            ServerRest.cupidRest({
                _REST_PATH: '/nms/perf/dev',
                _REST_PARAM: _paramObj
            });
        }

        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');
        $('#sPerfType_pPerfRealtime, #sItemIdx_pPerfRealtime').jqxDropDownList({ disabled: false });
        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);	//요청주기
        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', false);		//표현개수
        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);			//지속시간

        console.log("stop end");
    },

    initStatus: function (){
        _flag = false;
        //clearTimeout(timer);
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        if (typeof sTimer !== "undefined" && sTimer) clearTimeout(sTimer);  //임시
        if (typeof sInterval !== "undefined" && sInterval) clearInterval(sInterval);//임시

        $('#perf_grid').jqxGrid('clear');
        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');
        // $('#p_cbPerfType, #p_cTime, #sPerfCycle_pPerfRealtime').jqxDropDownList({ disabled: false });
    },

    /* 파라메터 세팅 */
    getCommParams: function (chartName, tableCnt, dayRange) {

    },

    recvData: function(data) {
        var perfVal = 0;
        switch(pRealtime_curPerfType) {
            case 'CPU':
                var perfData = data.DEV.CPU;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'MEM':
                var perfData = data.DEV.MEM;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'TEMP':
                var perfData = data.DEV.TEMP;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'CPS':
                var perfData = data.DEV.CPS;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'SESSION':
                var perfData = data.DEV.SESSION;
                if(perfData.length){
                    var sum = perfData.reduce(function(a, b) { return a + b; });
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'FW_CPS':
                var perfData = data.FW;
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'FW_SESSION':
                var perfData = data.FW;
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'HIT_RATIO':
                var perfData = data.DNS.HIT_RATIO;
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'QUERY_RATE':
                var perfData = data.DNS.QUERY_RATE;
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
        }
    },

    setData: function(type, data, dateData){

        var p_chart = $('#perf_realtimeChart').highcharts();

        /** dummy data 생성
         *  Chart에 Data(dummy포함) 없을경우에한하여 호출
         *  Data에 처음 Data 넣을때 dummy 데이터 생성용
         */
        //if (p_chart.series[0].data.length == 0) pPerfRealtime.dummyCreate();

        var _yyyy = dateData.YYYYMMDD.substring(0,4);
        var _mm = parseInt(dateData.YYYYMMDD.substring(4,6)) - 1;
        var _dd = dateData.YYYYMMDD.substring(6,8);

        var _hh = dateData.HHMMSS.substring(0,2);
        var _mi = dateData.HHMMSS.substring(2,4);
        var _ss = dateData.HHMMSS.substring(4,6);

        var date = new Date(_yyyy, _mm, _dd, _hh, _mi, _ss);
        var newData = {};
        switch(type){
            case 'FW_CPS':
                newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                    rTcpCps: data[0].TCP_CPS, rUdpCps: data[0].UDP_CPS, rIcmpCps: data[0].ICMP_CPS
                };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_CPS)], false,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_CPS)], false,false);
                p_chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_CPS)], true,false);
                break;
            case 'FW_SESSION':
                newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
                    rTcpSession: data[0].TCP_SESSION, rUdpSession: data[0].UDP_SESSION, rIcmpSession: data[0].ICMP_SESSION
                };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data[0].TCP_SESSION)], false,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(data[0].UDP_SESSION)], false,false);
                p_chart.series[2].addPoint( [date.getTime(), parseFloat(data[0].ICMP_SESSION)], true,false);
                break;
            default:
                newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'), val : data[0] };
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(data[0])],true,false);
            /** 2개이상 series 추가시 앞 series는 false, false 마지막 series 설정은 true,false **/
            //p_chart.series[0].addPoint( [date.getTime(), parseFloat(data)],false, false);
            // p_chart.series[1].addPoint( [date.getTime(), parseFloat(data+10)],true,false);
        }

        pRealtime_data.splice(0, 0, newData);
        $('#perf_grid').jqxGrid('updatebounddata');

        /** 표현개수 초과시 맨 앞 Data remove **/
        if (p_chart.series[0].data.length > HmBoxCondition.val('sXaxisCnt_pPerfRealtime')) {
            var seriesLength = p_chart.series.length;
            for (var i = 0; i < seriesLength; i++ ) {
                p_chart.series[i].data[0].remove(false);
            }
        }
        console.log("response ok")
        /** 수집 데이터 Max, Avg, Min 값 적용 **/
        pPerfRealtime.setMaxAvgMin(type, data);
    },

    setMaxAvgMin: function(type, data) {
        var boxArray = [], dataArray = [], sumArray = [];
        switch(type){
            case 'CPU' :case 'MEM' :case 'TEMP' : case 'HIT_RATIO' : case 'QUERY_RATE' :case 'CPS' :case 'SESSION' :
                if ( !isNaN(parseFloat(data)) ) {
                    boxArray = ['perfDefault'];
                    dataArray = [parseFloat(data)];
                    pSummaryObj.defaultSum += parseFloat(data);
                    sumArray = [pSummaryObj.defaultSum];
                }
                break;
            case 'FW_CPS' :
                if ( !isNaN(parseFloat(data[0].TCP_CPS)) &&
                    !isNaN(parseFloat(data[0].UDP_CPS)) &&
                    !isNaN(parseFloat(data[0].ICMP_CPS)) ) {
                    boxArray = ['perfFwCpsTcp', 'perfFwCpsUdp', 'perfFwCpsIcmp'];
                    dataArray = [parseFloat(data[0].TCP_CPS), parseFloat(data[0].UDP_CPS), parseFloat(data[0].ICMP_CPS)];
                    pSummaryObj.tcpSum += parseFloat(data[0].TCP_CPS);
                    pSummaryObj.UdpSum += parseFloat(data[0].UDP_CPS);
                    pSummaryObj.IcmpSum += parseFloat(data[0].ICMP_CPS);
                    sumArray = [pSummaryObj.tcpSum, pSummaryObj.UdpSum, pSummaryObj.IcmpSum];
                }
                break;
            case 'FW_SESSION':
                if ( !isNaN(parseFloat(data[0].TCP_SESSION)) &&
                    !isNaN(parseFloat(data[0].UDP_SESSION)) &&
                    !isNaN(parseFloat(data[0].ICMP_SESSION)) ) {
                    boxArray = ['perfFwSessionTcp', 'perfFwSessionUdp', 'perfFwSessionIcmp'];
                    dataArray = [parseFloat(data[0].TCP_SESSION), parseFloat(data[0].UDP_SESSION), parseFloat(data[0].ICMP_SESSION)];
                    pSummaryObj.tcpSum += parseFloat(data[0].TCP_SESSION);
                    pSummaryObj.UdpSum += parseFloat(data[0].UDP_SESSION);
                    pSummaryObj.IcmpSum += parseFloat(data[0].ICMP_SESSION);
                    sumArray = [pSummaryObj.tcpSum, pSummaryObj.UdpSum, pSummaryObj.IcmpSum];
                }
                break;
            default:
                console.log("data NaN :" + isNaN(parseFloat(data)));
                if ( !isNaN(parseFloat(data)) ) {
                    boxArray = ['perfDefault'];
                    dataArray = [parseFloat(data)];
                    pSummaryObj.defaultSum += parseFloat(data);
                    sumArray = [pSummaryObj.defaultSum];
                }
        };
        if (boxArray.length > 0) {
            pSummaryObj.dataCnt += 1;
            pPerfRealtime.setSummaryData(boxArray, dataArray, sumArray);
        }
    },

    setSummaryData: function(boxArray, dataArray, sumArray) {

        for (var i = 0; i < boxArray.length; i++) {

            if ( dataArray[i] > parseFloat($('#' + boxArray[i] + 'Max').text()) )  $('#' + boxArray[i] + 'Max').text(dataArray[i]);
            if ( dataArray[i] > 0 && parseFloat($('#' + boxArray[i] + 'Min').text()) == 0 ) {
                $('#' + boxArray[i] + 'Min').text(dataArray[i]);
            } else {
                if ( parseFloat(dataArray[i]) < parseFloat($('#' + boxArray[i] + 'Min').text()) )  $('#' + boxArray[i] + 'Min').text(dataArray[i]);
            }
            $('#' + boxArray[i] + 'Avg').text((sumArray[i]/pSummaryObj.dataCnt).toFixed(2));

        }

    },

    /** 선택한 표현개수에 따라 Dummy 데이터 생성  */
    dummyCreate: function() {
        var p_chart = $('#perf_realtimeChart').highcharts();
        var timeCycle =  HmBoxCondition.val('sPerfCycle_pPerfRealtime');
        var dummyCnt = HmBoxCondition.val('sXaxisCnt_pPerfRealtime') * (-1);
        var seriesLength = p_chart.series.length;
        var cTime = (new Date()).getTime(),
            dTime,
            dValue = null,
            i;

        var _arr = {};
        for (var j = 0; j < seriesLength; j++ ) {
            _arr[j] = [];
        }
        for (i = dummyCnt; i < 0; i += 1) {
            dTime = cTime + i * 1000 * timeCycle;
            for (var j = 0; j < seriesLength; j++ ) {
                _arr[j].push([dTime, dValue]);
            }
        }

        for (var j = 0; j < seriesLength; j++ ) {
            p_chart.series[j].update({ data: _arr[j] }, false);
        }
    }
}

$('#pPerfRealtime_btnStart').click(function () {
    pPerfRealtime.start();
});
$('#pPerfRealtime_btnPause').click(function () {
    pPerfRealtime.stop(true);
});

$('#pPerfRealtime_btnExcel').click(function(){
    HmUtil.exportGrid($('#perf_grid'), "실시간 장비", false);
});

function pwindow_close(){
    perf_realtimeChart = null;
}






