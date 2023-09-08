var perf_realtimeChart;
var pRealtime_curPerfType = 'cpu';
var pRealtime_curSubPerfType = 'idle';
var pRealtime_data = [];
var _isRunning = false;

var pRealtime_protocol = window.location.protocol;
var pRealtime_ip = window.location.hostname;
var pRealtime_port = $("#gCupidPort").val();
var pRealtime_serverURL = pRealtime_protocol + "//" + pRealtime_ip +  ":"+pRealtime_port+"/eventbus/";
// var pRealtime_serverURL = "http://10.1.3.205:8900/eventbus/";

var pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);

var pRealtime_healthCheckTimer = null;
var pRealtime_sessionId = HmUtil.generateUUID();
var pRealtime_guid = HmUtil.generateUUID();
var _orgRestCallParam = null;//정지용도

var pRealtime_fixedCols = [
    { text: '일시', datafield: 'ymdhms', width: 150, cellsalign: 'center'  }
];

var pSummaryObj = {
    dataCnt: 0,
    defaultSum: 0
};
var pSummaryUnit = '';

var pPerfRealtime = {
    curMngNo: -1,
    searchAll: function(){
        pPerfRealtime.curMngNo = dtl_mngNo;
    },
    itemIdxSearch: function () {
        switch($('#sPerfType_pPerfRealtime').val()) {
            case 'cpu': pSummaryUnit = '%'; break;
            case 'memory': pSummaryUnit = '%'; break;
        }
    },
    initialize: function () {

        pRealtime_ebSecUnitPerf = new EventBus(pRealtime_serverURL);//cupid접속
        pRealtime_ebSecUnitPerf.enableReconnect(true);//자동 재연결

        pRealtime_ebSecUnitPerf.onopen = function () {

            pRealtime_ebSecUnitPerf.registerHandler("js.to.server", { id : $('#sUserId').val(), guid : pRealtime_sessionId, auth : "5"}, function (err, msg) {

                console.log("registerHandler");

                var recvData = msg;
                var type = recvData.type;
                var body = recvData.body;
                if( type.toUpperCase() == 'REC' &&  ('cpu' in body ) == true || ('memory' in body ) == true){
                    var headers = recvData.headers;
                    var replyTarget = recvData.body.reply_target;
                    if(pRealtime_guid == replyTarget){
                        pPerfRealtime.recvData(body);
                    }
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

        //세부지표
        $('#sSubPerfType_pPerfRealtime').jqxDropDownList({ width: '200px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                {label: "IDLE", value: "idle"},
                {label: "IOWAIT", value: "iowait"},
                {label: "SYSTEM", value: "system"},
                {label: "USER", value: "user"},
                {label: "IRQ", value: "irq"},
                {label: "NICE", value: "nice"},
                {label: "SOFTIRQ", value: "softirq"},
                {label: "STEAL", value: "steal"},
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function(e){
            pRealtime_curSubPerfType = e.args.item.value;
        });

        //수집지표(CPU, MEMORY)
        $('#sPerfType_pPerfRealtime').jqxDropDownList({ width: '100px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                { label: 'CPU', value: 'cpu' },
                { label: 'Memory', value: 'memory' }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        }).on('change', function(event) {

            pRealtime_curPerfType = event.args.item.value;
            switch (pRealtime_curPerfType) {
                case 'cpu':
                    pSummaryUnit = '%';
                    $('#sSubPerfType_pPerfRealtime').jqxDropDownList('source',[
                        {label: "IDLE", value: "idle"},
                        {label: "IOWAIT", value: "iowait"},
                        {label: "SYSTEM", value: "system"},
                        {label: "USER", value: "user"},
                        {label: "IRQ", value: "irq"},
                        {label: "NICE", value: "nice"},
                        {label: "SOFTIRQ", value: "softirq"},
                        {label: "STEAL", value: "steal"},
                    ]);
                    pRealtime_curSubPerfType = "idle";
                    break;
                case 'memory':
                    pSummaryUnit = '%';
                    $('#sSubPerfType_pPerfRealtime').jqxDropDownList('source',[
                        {label: "물리", value: "actual"},
                        {label: "SWAP", value: "swap"}
                    ]);

                    pRealtime_curSubPerfType = "PHYSICAL";
                    break;
            }//switch(pRealtime_curPerfType)

        });

        pPerfRealtime.createChart('perf_realtimeChart');

        $(".box").hide();
        $("." + "perfDefault").show();
        pPerfRealtime.chgSummary($('#sPerfType_pPerfRealtime').val());
    },

    resizeChart: function() {
        // 해당 탭이 열려있을때만 활성화
        if ($('#dtlTab').val() == 11) {

            pPerfRealtime.createChart('perf_realtimeChart');

            pPerfRealtime.searchAll();
        }
    },

    reSetDesign : function() {
        if (_isRunning) pPerfRealtime.stop(true);
        if (typeof pRealtime_healthCheckTimer !== "undefined" && pRealtime_healthCheckTimer) clearInterval(pRealtime_healthCheckTimer); // 임시
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        pPerfRealtime.initDesign();
    },

    initData: function() {},

    createChart: function (chartId) {
        pPerfRealtime.chgChart(chartId, $('#sPerfType_pPerfRealtime').val());
    },

    /* 차트 변경 */
    chgChart: function (chartId, itemType) {
        var chart = $('#' + chartId).highcharts();
        if (chart !== undefined) {
            perf_realtimeChart.destroy();
        }

        var defaultSeries = [
            {name: itemType, type: 'spline', xField: 'DT_YMDHMS', yField: 'val'}
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
                    }
                }
            }
        };

        var _rtDynamicCols = [];
        perf_realtimeChart = new CustomChart(chartId,
            HmHighchart.TYPE_LINE,
            $.extend({series: defaultSeries, chartConfig: { unit: '' }},options)
        );
        _rtDynamicCols.push({ text: '성능값', datafield: 'val',  align: 'center', cellsalign: 'right'});
        perf_realtimeChart.initialize();

        pRealtime_data.length = 0;
        $('#perf_grid').jqxGrid('clear');
        $('#perf_grid').jqxGrid('beginupdate', true);
        $('#perf_grid').jqxGrid({ columns: $.merge(_rtDynamicCols, pRealtime_fixedCols) });
        $('#perf_grid').jqxGrid('endupdate');

    },

    chgSummary: function(itemType){
        switch(itemType){
            case 'cpu' :case 'memory' :
                $(".box").not("." + "perfDefault").hide();
                $("." + "perfDefault").show();
                break;
            default:
                $(".box").not("." + "perfDefault").hide();
                $("." + "perfDefault").show();
        };

        pSummaryObj.dataCnt = 0;
        pSummaryObj.defaultSum = 0;

        $(".perfBox").text('0');
    },

    /** 조회버튼 클릭 */
    start: function(){
        console.log("start ok");

        _isRunning = true;
        $('#pPerfRealtime_btnStart').css('display', 'none');
        $('#pPerfRealtime_btnPause').css('display', 'block');
        $('#sPerfType_pPerfRealtime, #sSubPerfType_pPerfRealtime').jqxDropDownList({ disabled: true });//수집지표, 세부지표
        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', true);		//요청주기
        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', true);		//표현개수
        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', true);			//종료시간

        //Chart 초기화
        pPerfRealtime.chgChart('perf_realtimeChart', $('#sPerfType_pPerfRealtime').val());
        pPerfRealtime.chgSummary($('#sPerfType_pPerfRealtime').val());

        switch($('#sPerfType_pPerfRealtime').val()) {
            case 'cpu': pSummaryUnit = '%'; break;
            case 'memory': pSummaryUnit = '%'; break;
        }

        pPerfRealtime.send();
        console.log("start end");
    },

    // 실시간엔진
    send: function() {

        var _paramObj = {
            MSG_SEND: "WEB",//데이터전달위치
            MSG_YMDHMS: $.format.date(new Date(), 'yyyyMMddHHmmss'),//전달받을 시간
            RUN_LIST: [dtl_mngNo],
            DETAIL_INFO: {metric: $('#sPerfType_pPerfRealtime').val()},//RUN_LIST에서 추가로 사용할 값
            MSG_BYPASS: 1,
            MSG_STATUS: "START",//START,END
            MSG_CYCLE: parseInt(HmBoxCondition.val('sPerfCycle_pPerfRealtime')),//초단위 주기적 실행
            MSG_CYCLE_RANGE: parseInt(HmBoxCondition.val('sTime_pPerfRealtime')),//종료지점
            RTN_FLAG: 1,//0:결과과정 전달안함
            RTN_ID: $('#sUserId').val(),//cupid user id
            RTN_TARGET: pRealtime_guid,//cupid guid
            RTN_GUID: pRealtime_sessionId//cupid sessionId
        };
        console.log('test', _paramObj);

        ServerRest.cupidRest({
            _REST_PATH: '/sms/perf/sms_perf',
            _REST_PARAM: _paramObj,
        });
        _orgRestCallParam = _paramObj;

        pRealtime_healthCheckTimer = setInterval(function(){
            ServerRest.cupidHealthCheck({_REST_PATH: '/sms/health/sms_perf', _GUID: pRealtime_guid});
        }, 60 * 1000);//1분마다 한번씩 호출함

        //종료시간 표시
        if(HmBoxCondition.val('sTime_pPerfRealtime') > 0) {
            timer = setTimeout(function(){
                pPerfRealtime.stop(true);
            }, HmBoxCondition.val('sTime_pPerfRealtime') * 60 * 1000);
        }
    },

    stop: function(REST_SEND) {

        console.log("stop ok");
        _isRunning = false;
        if(typeof  pRealtime_healthCheckTimer !== "undefined" && pRealtime_healthCheckTimer) clearInterval(pRealtime_healthCheckTimer);
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시
        timer = null;
        pRealtime_healthCheckTimer = null;

        if(_orgRestCallParam != null){
            _orgRestCallParam.MSG_STATUS = "STOP";
            if(REST_SEND){
                ServerRest.cupidRest({
                    _REST_PATH: '/sms/perf/sms_perf',
                    _REST_PARAM: _orgRestCallParam,
                    _CALLBACK: function(){
                        pRealtime_healthCheckTimer = null;
                    }
                });
            }
            _orgRestCallParam = null;
        }

        $('#sPerfType_pPerfRealtime, #sSubPerfType_pPerfRealtime').jqxDropDownList({disabled: false});
        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');
        HmBoxCondition.disabledRadio('sPerfCycle_pPerfRealtime', false);	//요청주기
        HmBoxCondition.disabledRadio('sXaxisCnt_pPerfRealtime', false);		//표현개수
        HmBoxCondition.disabledRadio('sTime_pPerfRealtime', false);			//지속시간

        console.log("stop end");
    },

    initStatus: function (){
        _isRunning = false;
        //clearTimeout(timer);
        if (typeof timer !== "undefined" && timer) clearTimeout(timer); // 임시

        $('#perf_grid').jqxGrid('clear');
        $('#pPerfRealtime_btnStart').css('display', 'block');
        $('#pPerfRealtime_btnPause').css('display', 'none');

    },


    recvData: function(data) {

        console.log('cupid data', data);
        var perfVal = 0;
        switch(pRealtime_curPerfType) {
            case 'cpu': case 'CPU':
                var perfData = data.cpu[pRealtime_curSubPerfType].pct;
                if(perfData.length){
                    var sum = perfData.reduce((a, b) => a + b );
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
            case 'memory': case 'MEM':
                var perfData = null;
                if(pRealtime_curSubPerfType == "actual"){
                    perfData = data.memory.actual.used.pct;
                } else {
                    perfData = data.memory.swap.used.pct;
                }
                if(perfData.length){
                    var sum = perfData.reduce((a, b) => a + b );
                    perfVal = sum / perfData.length;
                }
                pPerfRealtime.setData(pRealtime_curPerfType, perfData, data);
                break;
        }
    },

    setData: function(type, showData, _SERVER_DATA){

        var p_chart = $('#perf_realtimeChart').highcharts();

        /** dummy data 생성
         *  Chart에 Data(dummy포함) 없을경우에한하여 호출
         *  Data에 처음 Data 넣을때 dummy 데이터 생성용
         *  제거(이유제-2023.05.01) - 클라이언트 시간과 서버시간이 다를경우 그래프 끊어지는 문제 발생
         */
        //if (p_chart.series[0].data.length == 0) pPerfRealtime.dummyCreate();

        //서버에서 받은 시간으로 표시
        var _yyyy = _SERVER_DATA.YYYYMMDD.substring(0,4);
        var _mm = parseInt(_SERVER_DATA.YYYYMMDD.substring(4,6)) - 1;
        var _dd = _SERVER_DATA.YYYYMMDD.substring(6,8);

        var _hh = _SERVER_DATA.HHMMSS.substring(0,2);
        var _mi = _SERVER_DATA.HHMMSS.substring(2,4);
        var _ss = _SERVER_DATA.HHMMSS.substring(4,6);

        var date = new Date(_yyyy, _mm, _dd, _hh, _mi, _ss);
        var newData = { ymdhms: $.format.date(date, 'yyyy-MM-dd HH:mm:ss'), val : showData };
        p_chart.series[0].addPoint( [date.getTime(), parseFloat(showData)], true, false);


        pRealtime_data.splice(0, 0, newData);
        $('#perf_grid').jqxGrid('updatebounddata');

        /** 표현개수 초과시 맨 앞 Data remove **/
        if (p_chart.series[0].data.length > HmBoxCondition.val('sXaxisCnt_pPerfRealtime')) {
            var seriesLength = p_chart.series.length;
            for (var i = 0; i < seriesLength; i++ ) {
                p_chart.series[i].data[0].remove(false);
            }
        }
        console.log("response ok");
        /** 수집 데이터 Max, Avg, Min 값 적용 **/
        pPerfRealtime.setMaxAvgMin(type, showData);
    },

    setMaxAvgMin: function(type, data) {
        var boxArray = [], dataArray = [], sumArray = [];
        switch(type){
            case 'cpu' :case 'memory' :
                if ( !isNaN(parseFloat(data)) ) {
                    boxArray = ['perfDefault'];
                    dataArray = [parseFloat(data)];
                    pSummaryObj.defaultSum += parseFloat(data);
                    sumArray = [pSummaryObj.defaultSum];
                }
                break;
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
    HmUtil.exportGrid($('#perf_grid'), "서버-실시간", false);
});

function pwindow_close(){
    perf_realtimeChart = null;
}






