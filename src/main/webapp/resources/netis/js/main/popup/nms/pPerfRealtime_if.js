var perf_realtimeChart;
var pRealtime_curPerfType ='BPS';
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
// var pRealtime_ip = "10.1.2.154";
var pRealtime_port = $("#gCupidPort").val();
// var pRealtime_port = $("#gCupidPort").val();
var pRealtime_serverURL = pRealtime_protocol + "//" + pRealtime_ip +  ":"+pRealtime_port+"/eventbus/";
//pRealtime_serverURL = "http://10.1.2.154:8900/eventbus/";
var pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);

var pRealtime_interval = null;
var pRealtime_timer = null;
var pRealtime_sessionId = HmUtil.generateUUID();
var pRealtime_guid = HmUtil.generateUUID();

var pRealtime_fixedCols = [
    { text: '일시', datafield: 'ymdhms', width: '30%', cellsalign: 'center'  }
];

var rtMngNo;
var rtIfIdx;
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
var rtSnmpModel;
var rtSnmpVendor;
var rtIfName;
var rtLineWidth;
var rtApplySnmpV1;

var inbpsList = [], outbpsList = [], inppsList = [], outppsList = [], inerrList = [], outerrList = [];

var sTimer, sInterval;
var pSummaryObj = {};

var pPerfRealtime = {
    curMngNo: -1,

    /* snmp 정보를 가져온다.*/
    getRealtimeParams: function () {
        Server.get('/dev/getRtPerfInfo.do', {
            data: {mngNo: dtl_mngNo, ifIdx: dtl_ifIdx, rtType: 'IF'},
            success: function(result) {
                if(result != null){
                    rtMngNo = result.mngNo;
                    rtIfIdx = result.ifIdx;
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
                    rtSnmpModel = result.model;
                    rtSnmpVendor = result.vendor;
                    rtIfName = result.ifName;
                    rtLineWidth = result.lineWidth;
                    rtApplySnmpV1 = result.applySnmpV1;
                }
            }
        });
    },
    initialize: function () {
        pPerfRealtime.getRealtimeParams();

        pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);
        pRealtime_ebSecUnitPerf.enableReconnect(true);

        pRealtime_ebSecUnitPerf.onopen = function () {

            pRealtime_ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : pRealtime_sessionId, auth : "5"}, function (err, msg) {
                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                if( type.toUpperCase() == 'REC' &&  ('IF' in body ) == true ){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    //console.log(pRealtime_guid, replyTarget )
                    if(pRealtime_guid == replyTarget)
                        pPerfRealtime.recvData(body);
                }
                if('RESULT' in body){
                    switch(body.RESULT){
                        case 0:
                            console.log('result ok');
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
            columns : pRealtime_fixedCols
        }, CtxMenu.NONE);

        $('#sPerfType_pPerfRealtime').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                { label: 'bps', value: 'BPS' },
                { label: 'pps', value: 'PPS' },
                { label: 'error', value: 'ERROR' }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function(event) {
            pRealtime_curPerfType = event.args.item.value;
        });

        var chartArr = ['perf_realtimeChart'];
        $.each(chartArr, function (idx, value) {
            pPerfRealtime.createChart(value);
        });

        // Summary obj 초기화
        pPerfRealtime.chgSummary();
    },

    resizeChart: function() {
        // 해당 탭이 열려있을때만 활성화
        if ($('#dtlTab').val() == 2) {
            var chartArr = ['perf_realtimeChart'];
            $.each(chartArr, function (idx, value) {
                pPerfRealtime.createChart(value);
            });
            pPerfRealtime.searchAll();
        }
    },

    reSetDesign: function() {
        if (_flag) pPerfRealtime.stop(true);
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        if (typeof sTimer !== "undefined" && sTimer) clearTimeout(sTimer);  //임시
        if (typeof sInterval !== "undefined" && sInterval) clearInterval(sInterval);//임시
        pPerfRealtime.getRealtimeParams();
        pPerfRealtime.initDesign();
    },


    initData: function() {

    },
    searchAll: function(){

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

        var bpsSeries = [
            {name: 'In bps', type: 'spline', xField: 'DT_YMDHMS', yField: 'inbps' },
            {name: 'Out bps', type: 'spline', xField: 'DT_YMDHMS', yField: 'outbps'}
        ];
        var ppsSeries = [
            {name: 'In pps', type: 'spline', xField: 'DT_YMDHMS', yField: 'inpps' },
            {name: 'Out pps', type: 'spline', xField: 'DT_YMDHMS', yField: 'outpps'}
        ];
        var errSeries = [
            {name: 'In error', type: 'spline', xField: 'DT_YMDHMS', yField: 'inerr' },
            {name: 'Out error', type: 'spline', xField: 'DT_YMDHMS', yField: 'outerr'}
        ];
        // var options = {
        //     plotOptions: {
        //         line: {
        //             connectNulls: true
        //         }
        //     }
        // };
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
                        if(point.y !== 0) t += '<br/><span style="color:' + point.color + '">\u25CF </span>' + point.series.name + ' : ' + HmUtil.convertUnit1000(point.y);
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
                        enabled: true,
                        formatter: function() {return HmUtil.convertUnit1000(this.y); }
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
            case 'BPS' :
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: bpsSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: 'IN', datafield: 'inbps', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer , cellsalign: 'right'},
                    { text: 'OUT', datafield: 'outbps', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer , cellsalign: 'right'});

                break;
            case 'PPS' :
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: ppsSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: 'IN', datafield: 'inpps', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer , cellsalign: 'right'},
                    { text: 'OUT', datafield: 'outpps', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer, cellsalign: 'right' });
                break;
            case 'ERROR' :
                perf_realtimeChart = new CustomChart(chartId, HmHighchart.TYPE_LINE, $.extend({series: errSeries, chartConfig: { unit: '' }},options));
                _rtDynamicCols.push({ text: 'IN', datafield: 'inerr', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer, cellsalign: 'right' },
                    { text: 'OUT', datafield: 'outerr', width: '35%', align: 'center', cellsrenderer: HmGrid.unit1000renderer, cellsalign: 'right' });
                break;

        };
        perf_realtimeChart.initialize();
        $('#perf_grid').jqxGrid('beginupdate', true);
        $('#perf_grid').jqxGrid({ columns: $.merge(_rtDynamicCols, pRealtime_fixedCols) });
        $('#perf_grid').jqxGrid('endupdate');
    },

    chgSummary: function(){
        pSummaryObj = {};
        pSummaryObj.inVal = 0, pSummaryObj.outVal = 0, pSummaryObj.inSum = 0, pSummaryObj.outSum = 0, pSummaryObj.dataCnt = 0;
        pSummaryObj.inMax = null, pSummaryObj.inMin = null, pSummaryObj.outMax = null, pSummaryObj.outMin = null;
        $(".perfBox").text('0');
        $(".perfUnit").text( $('#sPerfType_pPerfRealtime').text());
    },

    /** 조회버튼 클릭 */
    start: function(){
        console.log("start ok");

        Server.get('/dev/getRtPerfInfo.do', {
            data: {mngNo: dtl_mngNo, ifIdx: dtl_ifIdx, rtType: 'IF'},
            success: function(result) {
                console.log('if result', result);
                if(result != null){
                    if(result.ifStatus != 'Alive'){
                        alert('[' + rtIfName + '] 회선은 상태가 ' + result.ifStatus + ' 상태 입니다.');
                    } else {
                        console.log("start ok");
                        // 초기화
                        _flag = true;
                        $('#pPerfRealtime_btnStart').css('display', 'none');
                        $('#pPerfRealtime_btnPause').css('display', 'block');

                        $('#sPerfType_pPerfRealtime').jqxDropDownList({ disabled: true });

                        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', true);		//요청주기
                        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', true);		//표현개수
                        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', true);			//종료시간

                        // $('#sPerfType_pPerfRealtime, #sItemIdx_pPerfRealtime, #sTime_pPerfRealtimem, #sPerfCycle_pPerfRealtime').jqxDropDownList({ disabled: true });
                        $('#perf_grid').jqxGrid('clear');
                        pRealtime_data.length = 0;
                        inbpsList.length = 0;
                        outbpsList.length = 0;
                        inppsList.length = 0;
                        outppsList.length = 0;

                        pPerfRealtime.chgChart('perf_realtimeChart', $('#sPerfType_pPerfRealtime').val());
                        // Summary obj 초기화
                        pPerfRealtime.chgSummary();

                        console.log(HmBoxCondition.val('sTime_pPerfRealtime'));

                        // 개발 완료 주석 제거
                        pPerfRealtime.send();
                        if( HmBoxCondition.val('sTime_pPerfRealtime') > 0) {
                            pRealtime_timer = setTimeout(function(){
                                pPerfRealtime.stop(false);
                            }, HmBoxCondition.val('sTime_pPerfRealtime') * 60 * 1000 + (HmBoxCondition.val('sPerfCycle_pPerfRealtime') * 500));
                        }
                    }
                }
            }
        });

        console.log("start end");

        /**
         * 임시 데이터 생성 타이머(삭제 예정)
         */
        // sTimer, sInterval;
        // if( HmBoxCondition.val('sTime_pPerfRealtime') > 0) {
        //     //종료시간 1분 ~ X분
        //     sTimer = setTimeout(function(){
        //         pPerfRealtime.stop();
        //     }, HmBoxCondition.val('sTime_pPerfRealtime') * 60 * 1000);
        // }
        //
        // sInterval = setInterval(function () {
        //
        //     var msg = {
        //         body: {
        //             IF: {
        //                 IN_BPS : Math.ceil(Math.random()*30) + 1000,
        //                 OUT_BPS : Math.ceil(Math.random()*10),
        //                 IN_PPS : Math.ceil(Math.random()*10),
        //                 OUT_PPS : Math.ceil(Math.random()*10),
        //                 IN_ERROR : Math.ceil(Math.random()*10),
        //                 OUT_ERROR : Math.ceil(Math.random()*10),
        //             }
        //         }
        //     };
        //     pPerfRealtime.setData(pRealtime_curPerfType, msg.body);
        // }, HmBoxCondition.val('sPerfCycle_pPerfRealtime') * 1000);
    },


    send: function() {
        console.log("send ok");
        // var message = {
        //     "type":"publish",
        //     "address":"tcp.to.server",
        //     "headers":{
        //         "info" : {
        //             "js_id" : $('#sUserId').val(),
        //             "js_guid" : pRealtime_sessionId,
        //             "tcp_id" : "NT_RealTimePerfd",
        //             "tcp_guid" : rtPollGrpNo
        //         },
        //         "msg_type" : "SEC_UNIT_PERF",
        //         "msg_info" : {
        //             "STATUS"  : "START",
        //             "CYCLE"  : HmBoxCondition.val('sPerfCycle_pPerfRealtime'),
        //             "REQ_TYPE" : "IF",
        //             "MNG_NO" : parseInt(rtMngNo),
        //             "IF_IDX" : parseInt(rtIfIdx),
        //             "DEV_IP" : rtDevIp,
        //             "COMMUNITY" : rtCommunity,
        //             "SNMP_VER" : String(rtSnmpVer),
        //             "SNMP_USER_ID" : String(rtSnmpUserId),
        //             "SNMP_SECURITY_LEVEL" : String(rtSnmpSecurityLevelStr),
        //             "SNMP_AUTH_TYPE" : String(rtSnmpAuthTypeStr),
        //             "SNMP_AUTH_KEY" : String(rtSnmpAuthKey),
        //             "SNMP_ENCRYPT_TYPE" : String(rtSnmpEncryptTypeStr),
        //             "SNMP_ENCRYPT_KEY" : String(rtSnmpEncryptKey),
        //             "APPLY_SNMP_V1" : rtApplySnmpV1,
        //             "LINE_WIDTH" : rtLineWidth,
        //             "IF_NAME" : rtIfName,
        //             "VENDOR" : rtSnmpVendor,
        //             "MODEL" : rtSnmpModel,
        //             "DEV_KIND2" : rtDevKind2,
        //             "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
        //         }
        //     },
        //     "body":{ "reply_target": pRealtime_guid }
        // };
        //
        //
        // var deliveryOptions = message.headers;
        // pRealtime_ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":pRealtime_guid}, deliveryOptions);
        var _runList = {};
        var _ifList = {};
        _ifList[rtMngNo] = [parseInt(rtIfIdx)];
        _runList[rtPollGrpNo + ''] = [_ifList];

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: _runList,
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
            _REST_PATH: '/nms/perf/if',
            _REST_PARAM: _paramObj,
        });

        pRealtime_interval = setInterval(function(){
            ServerRest.cupidHealthCheck({_REST_PATH: '/nms/health/if', _GUID: pRealtime_guid});
        }, 60 * 1000);//1분마다 한번씩 호출함
    },

    stop: function(REST_SEND) {
        console.log("stop ok");
        _flag = false;

        if (typeof pRealtime_interval !== "undefined" && pRealtime_interval) clearInterval(pRealtime_interval); // 임시
        if (typeof pRealtime_timer !== "undefined" && pRealtime_timer) clearTimeout(pRealtime_timer); // 임시
        if (typeof sTimer !== "undefined" && sTimer) clearTimeout(sTimer);  //임시
        if (typeof sInterval !== "undefined" && sInterval) clearInterval(sInterval);//임시
        pRealtime_interval = null;
        pRealtime_timer = null;
        sTimer = null; //임시
        sInterval = null; //임시

        // var message = {
        //     "type":"publish",
        //     "address":"tcp.to.server",
        //     "headers":{
        //         "info" : {
        //             "js_id" : $('#sUserId').val(),
        //             "js_guid" : pRealtime_sessionId,
        //             "tcp_id" : "NT_RealTimePerfd",
        //             "tcp_guid" : rtPollGrpNo
        //         },
        //         "msg_type" : "SEC_UNIT_PERF",
        //         "msg_info" : {
        //             "STATUS"  : "STOP",
        //             "CYCLE"  : HmBoxCondition.val('sPerfCycle_pPerfRealtime'),
        //             "REQ_TYPE" : "IF",
        //             "MNG_NO" : parseInt(rtMngNo),
        //             "IF_IDX" : parseInt(rtIfIdx),
        //             "DEV_IP" : rtDevIp,
        //             "COMMUNITY" : rtCommunity,
        //             "SNMP_VER" : String(rtSnmpVer),
        //             "SNMP_USER_ID" : String(rtSnmpUserId),
        //             "SNMP_SECURITY_LEVEL" : String(rtSnmpSecurityLevelStr),
        //             "SNMP_AUTH_TYPE" : String(rtSnmpAuthTypeStr),
        //             "SNMP_AUTH_KEY" : String(rtSnmpAuthKey),
        //             "SNMP_ENCRYPT_TYPE" : String(rtSnmpEncryptTypeStr),
        //             "SNMP_ENCRYPT_KEY" : String(rtSnmpEncryptKey),
        //             "APPLY_SNMP_V1" : rtApplySnmpV1,
        //             "LINE_WIDTH" : rtLineWidth,
        //             "IF_NAME" : rtIfName,
        //             "VENDOR" : rtSnmpVendor,
        //             "MODEL" : rtSnmpModel,
        //             "DEV_KIND2" : rtDevKind2,
        //             "REQ_YMDHMS" : $.format.date(new Date(), 'yyyyMMddHHmmss')
        //         }
        //     },
        //     "body":{ "reply_target": pRealtime_guid }
        // };
        //
        // var deliveryOptions = message.headers;
        // pRealtime_ebSecUnitPerf.publish("worker.NT_RealTimePerfd.sockjs", {"reply_target":pRealtime_guid}, deliveryOptions);
        var _runList = {};
        var _ifList = {};
        _ifList[rtMngNo] = [parseInt(rtIfIdx)];
        _runList[rtPollGrpNo + ''] = _ifList;

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: _runList,
            MSG_BYPASS: 1,
            MSG_STATUS: "STOP",//START,END
            MSG_CYCLE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
            MSG_CYCLE_RANGE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
            RTN_FLAG: 1,//0:결과과정 전달안함
            RTN_ID: $('#sUserId').val(),//cupid user id
            RTN_TARGET: pRealtime_guid,//cupid guid
            RTN_GUID: pRealtime_sessionId//cupid sessionId
        }

        if(REST_SEND){
            ServerRest.cupidRest({
                _REST_PATH: '/nms/perf/if',
                _REST_PARAM: _paramObj,
            });
        }

        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');
        $('#sPerfType_pPerfRealtime').jqxDropDownList({ disabled: false });
        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);	//요청주기
        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', false);		//표현개수
        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);			//지속시간
        // $('#sPerfType_pPerfRealtime, #sTime_pPerfRealtime, #sPerfCycle_pPerfRealtime').jqxDropDownList({ disabled: false });
        console.log("stop end");
    },

    initStatus: function (){
        _flag = false;
        clearTimeout(pRealtime_timer);
        clearInterval(pRealtime_interval);
        $('#perf_grid').jqxGrid('clear');
        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');
        // $('#p_cbPerfType, #p_cTime, #sPerfCycle_pPerfRealtime').jqxDropDownList({ disabled: false });
    },

    /* 파라메터 세팅 */
    getCommParams: function (chartName, tableCnt, dayRange) {

    },

    recvData: function(data) {

        switch(pRealtime_curPerfType) {
            case 'BPS':
                pPerfRealtime.setData(pRealtime_curPerfType, data);
                break;
            case 'PPS':
                pPerfRealtime.setData(pRealtime_curPerfType, data);
                break;
            case 'ERROR':
                pPerfRealtime.setData(pRealtime_curPerfType, data);
                break;
        }
    },

    setData: function(type, data){

        var p_chart = $('#perf_realtimeChart').highcharts();

        /** dummy data 생성
         *  Chart에 Data(dummy포함) 없을경우에한하여 호출
         *  Data에 처음 Data 넣을때 dummy 데이터 생성용
         */
        //if (p_chart.series[0].data.length == 0) pPerfRealtime.dummyCreate();

        var _yyyy = data.YYYYMMDD.substring(0,4);
        var _mm = parseInt(data.YYYYMMDD.substring(4,6)) - 1;
        var _dd = data.YYYYMMDD.substring(6,8);

        var _hh = data.HHMMSS.substring(0,2);
        var _mi = data.HHMMSS.substring(2,4);
        var _ss = data.HHMMSS.substring(4,6);

        var date = new Date(_yyyy, _mm, _dd, _hh, _mi, _ss);

        var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'),
            inbps: data.IF.IN_BPS, outbps: data.IF.OUT_BPS, inpps: data.IF.IN_PPS, outpps: data.IF.OUT_PPS, inerr: data.IF.IN_ERROR, outerr: data.IF.OUT_ERROR };
        switch(type){
            case 'BPS':
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(newData.inbps)], false,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(newData.outbps)], true,false);
                break;
            case 'PPS':
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(newData.inpps)], false,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(newData.outpps)], true,false);
                break;
            case 'ERROR':
                p_chart.series[0].addPoint( [date.getTime(), parseFloat(newData.inerr)], false,false);
                p_chart.series[1].addPoint( [date.getTime(), parseFloat(newData.outerr)], true,false);
                break;
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

        /** 수집 데이터 Max, Avg, Min 값 적용 **/
        pPerfRealtime.setMaxAvgMin(type, newData);
    },

    setMaxAvgMin: function(type, newData) {

        var inVal, outVal;
        switch(type){
            case 'BPS':
                pSummaryObj.inVal  = parseFloat(newData.inbps);
                pSummaryObj.outVal = parseFloat(newData.outbps);
                break;
            case 'PPS':
                pSummaryObj.inVal  = parseFloat(newData.inpps);
                pSummaryObj.outVal = parseFloat(newData.outpps);
                break;
            case 'ERROR':
                pSummaryObj.inVal  = parseFloat(newData.inerr);
                pSummaryObj.outVal = parseFloat(newData.outerr);
                break;
        }

        if ( !isNaN(pSummaryObj.inVal) && !isNaN(pSummaryObj.outVal) ) {

            if (pSummaryObj.inMax == null || pSummaryObj.inVal > pSummaryObj.inMax) pSummaryObj.inMax = pSummaryObj.inVal; //inMax
            if (pSummaryObj.inMin == null || pSummaryObj.inVal < pSummaryObj.inMin) pSummaryObj.inMin = pSummaryObj.inVal; //inMin
            if (pSummaryObj.outMax == null || pSummaryObj.outVal > pSummaryObj.outMax) pSummaryObj.outMax = pSummaryObj.outVal; //outMax
            if (pSummaryObj.outMin == null || pSummaryObj.outVal < pSummaryObj.outMin) pSummaryObj.outMin = pSummaryObj.outVal; //outMin

            pSummaryObj.inSum = pSummaryObj.inSum + pSummaryObj.inVal;
            pSummaryObj.outSum = pSummaryObj.outSum + pSummaryObj.outVal;

            // set Summary
            pSummaryObj.dataCnt += 1;
            pPerfRealtime.setSummaryData("In");
            pPerfRealtime.setSummaryData("Out");
        }
    },

    setSummaryData: function(typeInOut) {
        // var curData;
        var sumData, chkMax, chkMin;
        if (typeInOut == "In") {
            // curData = Math.round(pSummaryObj.inVal);
            sumData = pSummaryObj.inSum;
            chkMax = pSummaryObj.inMax;
            chkMin = pSummaryObj.inMin;
        } else {
            // curData = Math.round(pSummaryObj.outVal);
            sumData = pSummaryObj.outSum;
            chkMax = pSummaryObj.outMax;
            chkMin = pSummaryObj.outMin;
        }

        $('#perfIf' + typeInOut + 'Max').text(HmUtil.convertUnit1000(chkMax));
        $('#perfIf' + typeInOut + 'Min').text(HmUtil.convertUnit1000(chkMin));
        $('#perfIf' + typeInOut + 'Avg').text(HmUtil.convertUnit1000((sumData/pSummaryObj.dataCnt).toFixed(2)));

        // if ( curData > chkMax ) $('#perfIf' + typeInOut + 'Max').text(HmUtil.convertUnit1000(curData));
        // if ( $('#perf_grid').jqxGrid('getrows').length == 1 ) {
        //     $('#perfIf' + typeInOut + 'Min').text(HmUtil.convertUnit1000(curData));
        // } else {
        //     if ( curData < chkMin )  $('#perfIf' + typeInOut + 'Min').text(HmUtil.convertUnit1000(curData));
        // }
        // $('#perfIf' + typeInOut + 'Avg').text(HmUtil.convertUnit1000((sumData/$('#perf_grid').jqxGrid('getrows').length).toFixed(2)));
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
        for (i = dummyCnt; i < 0; i++) {
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
    HmUtil.exportGrid($('#perf_grid'), "실시간 회선", false);
})

function pwindow_close(){
    perf_realtimeChart = null;
}