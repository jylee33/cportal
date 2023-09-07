var $tcpStateGrid;
var editUserIds = [];
var userId;
var userName;
var  chart;
var tcpState = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $tcpStateGrid = $('#tcpStateGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { tcpState.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch_tcp": this.createChart(); this.searchTcpState(); break;
        }
    },

    /** init design */
    initDesign: function() {

        $('#tcpStateSplitter').jqxSplitter({width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', panels: [ { size: '28%'}, {size: '72%'}], showSplitBar: false});

        HmBoxCondition.createRadio($('#srchPerfType_tcp'), [
            {label: '3H', value: '3'},
            {label: '6H', value: '6'},
            {label: '12H', value: '12'},
            {label: '24H', value: '24'}
        ]);

        HmGrid.create($tcpStateGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            mngNo: dtl_mngNo
                        });
                        return data;
                    }
                }
            ),
            height: 59,
            showtoolbar: false,
            pageable: false,
            sortable: false,
            columns:
                [
                    {
                        text: 'CLOSED',
                        datafield: 'closed',
                        width: '8.3%',
                        cellsalign: 'center',

                    },
                    {
                        text: 'LISTEN',
                        datafield: 'listen',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'SYN SENT',
                        datafield: 'synSent',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'SYN RECV',
                        datafield: 'synRecv',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'ESTABLISHED',
                        datafield: 'established',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'FIN WAIT',
                        datafield: 'finWait',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'FIN WAIT2',
                        datafield: 'finWait2',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'CLOSE WAIT',
                        datafield: 'closeWait',
                        width: '8.3%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'CLOSING',
                        datafield: 'closing',
                        width: '8.4%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'LAST ACK',
                        datafield: 'lastAck',
                        width: '8.4%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'TIME WAIT',
                        datafield: 'timeWait',
                        width: '8.4%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'UNKOWN',
                        datafield: 'unkown',
                        width: '8.4%',
                        cellsalign: 'center',
                    }
                ]
        } , CtxMenu.NONE );

        tcpState.createChart();

    },

    /** init data */
    initData: function() {
        tcpState.searchTcpState();
    },

    /*=======================================================================================
    버튼 이벤트 처리
    ========================================================================================*/
    searchTcpState: function() {
        HmGrid.updateBoundData($tcpStateGrid, ctxPath + '/main/sms/tcpSess/getTcpStateList.do');
    },

    destroyChart: function (chartId) {
        var chart = $('#' + chartId).highcharts();
        if (chart !== undefined) {
            chart.destroy();
        }
    },

    resizeChart : function(){
        // 해당 탭이 열려있을때만 활성화
        if ($('#dtlTab').val() == 17 && $('#tcpTabs').val() == 0) {
            var chartArr = ['tcpStateChart'];
            $.each(chartArr, function (idx, value) {
                tcpState.destroyChart(value);
                tcpState.createChart(value);
            });
        }

    },

    createChart: function () {
        //차트 생성
        var series = {series: [
                {name: 'CLOSED', type: 'line', xField: 'DT_YMDHMS', yField: 'CLOSED', visible: false, },
                {name: 'LISTEN', type: 'line', xField: 'DT_YMDHMS', yField: 'LISTEN', visible: true, },
                {name: 'SYN SENT', type: 'line', xField: 'DT_YMDHMS', yField: 'SYN_SENT', visible: false, },
                {name: 'SYN RECV', type: 'line', xField: 'DT_YMDHMS', yField: 'SYN_RECV', visible: false, },
                {name: 'ESTABLISHED', type: 'line', xField: 'DT_YMDHMS', yField: 'ESTABLISHED', visible: true, },
                {name: 'FIN WAIT', type: 'line', xField: 'DT_YMDHMS', yField: 'FIN_WAIT', visible: false, },
                {name: 'FIN WAIT2', type: 'line', xField: 'DT_YMDHMS', yField: 'FIN_WAIT2', visible: false, },
                {name: 'CLOSE WAIT', type: 'line', xField: 'DT_YMDHMS', yField: 'CLOSE_WAIT', visible: false, },
                {name: 'CLOSING', type: 'line', xField: 'DT_YMDHMS', yField: 'CLOSING', visible: false, },
                {name: 'LAST ACK', type: 'line', xField: 'DT_YMDHMS', yField: 'LAST_ACK', visible: false, },
                {name: 'TIME WAIT', type: 'line', xField: 'DT_YMDHMS', yField: 'TIME_WAIT', visible: true, },
                {name: 'UNKOWN', type: 'line', xField: 'DT_YMDHMS', yField: 'UNKOWN', visible: false, }
            ], chartConfig: { unit: '1000' }};

        var userOptions = {
            chart: {
                height: 302
            },
            plotOptions : {
                line: {
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    connectNulls: true
                }
            },
            yAxis: {
                tickInterval: 1
            }
        };
        $.extend(series, userOptions);

        var chartId = 'tcpStateChart';
        var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
        $chart.initialize();

        var chartData = {};
        var xFieldArr = [], yFieldArr = [];
        $.each(series.series, function(si, sv) {
            xFieldArr.push(sv.xField);
            yFieldArr.push(sv.yField);
            chartData[si] = [];
        });

        var period = HmBoxCondition.val('srchPerfType_tcp');

        Server.get('/main/sms/tcpSess/getTcpStateChart.do', {
            data: {
                mngNo: dtl_mngNo,
                period: period
            },
            success: function (result) {
                $.each(result, function (i, v) {
                    for(var sidx in xFieldArr) {
                        var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                        chartData[sidx].push([v[_xField], v[_yField]]);
                    }
                });
                $.each(series.series, function(si, sv) {
                    HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                });
                HmHighchart.redraw(chartId);
            },
            error: function () {
            }
        });
    }
    };
