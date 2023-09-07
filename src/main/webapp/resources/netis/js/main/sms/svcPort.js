var $svcPortGrid;
var port;
var editUserIds = [];
var userId;
var userName;
var svcPort = {

    initialize : function() {
        this.initVariable();
        this.observe();
        this.initDesign();
        this.initData();
    },

    /** variable */
    initVariable: function() {
        $svcPortGrid = $('#svcPortGrid');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { svcPort.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case "btnSearch_port": this.resizeChart(port); break;
        }
    },

    /** init design */
    initDesign: function() {

        $('#svcPortSplitter').jqxSplitter({width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', panels: [ { size: '41%'}, {size: '59%'}], showSplitBar: false});

        HmBoxCondition.createRadio($('#srchPerfType_port'), [
            {label: '3H', value: '3'},
            {label: '6H', value: '6'},
            {label: '12H', value: '12'},
            {label: '24H', value: '24'}
        ]);

        HmGrid.create($svcPortGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            mngNo: dtl_mngNo
                        });
                        return data;
                    }
                },
            ),
            height: 115,
            showtoolbar: false,
            pageable: false,
            columns:
                [
                    {
                        text: '포트',
                        datafield: 'port',
                        width: '6%',
                        filtertype: 'number',
                    },
                    {
                        text: 'CLOSED',
                        datafield: 'closed',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'LISTEN',
                        datafield: 'listen',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'SYN SENT',
                        datafield: 'synSent',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'SYN RECV',
                        datafield: 'synRecv',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'ESTABLISHED',
                        datafield: 'established',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'FIN WAIT',
                        datafield: 'finWait',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'FIN WAIT2',
                        datafield: 'finWait2',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'CLOSE WAIT',
                        datafield: 'closeWait',
                        width: '7.8%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'CLOSING',
                        datafield: 'closing',
                        width: '7.9%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'LAST ACK',
                        datafield: 'lastAck',
                        width: '7.9%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'TIME WAIT',
                        datafield: 'timeWait',
                        width: '7.9%',
                        cellsalign: 'center',
                    },
                    {
                        text: 'UNKOWN',
                        datafield: 'unkown',
                        width: '7.9%',
                        cellsalign: 'center',
                    }
                ]
        } , CtxMenu.NONE );
        $svcPortGrid.on('rowdoubleclick', function(event) {
            port = event.args.row.bounddata.port;
            svcPort.createChart(port);
        })

    },

    /** init data */
    initData: function() {
        svcPort.searchSvcPort();
    },

    searchSvcPort: function() {
        HmGrid.updateBoundData($svcPortGrid, ctxPath + '/main/sms/tcpSess/getSvcPortList.do');
    },

    destoryChart: function (chartId) {
        var chart = $('#' + chartId).highcharts();
        if (chart !== undefined) {
            chart.destroy();
        }
    },

    resizeChart : function(){
        // 해당 탭이 열려있을때만 활성화 ( svrStatusDtl 에서의 탭 val )
        if ($('#dtlTab').val() == 17 && $('#tcpTabs').val() == 1) {
            var chartArr = ['svcPortChart'];
            $.each(chartArr, function (idx, value) {
                svcPort.destoryChart(value);
                svcPort.createChart(port);
            });
        }

        // ( svrDetail 에서의 탭 val )
        if ($('#dtlTab').val() == 16 && $('#tcpTabs').val() == 1) {
            var chartArr = ['svcPortChart'];
            $.each(chartArr, function (idx, value) {
                svcPort.destoryChart(value);
                svcPort.createChart(port);
            });
        }

    },

    createChart: function (port) {
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
                marginTop: 30,
                marginBottom: 70,
                height: 248
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

        var chartId = 'svcPortChart';
        var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
        $chart.initialize();

        var chartData = {};
        var xFieldArr = [], yFieldArr = [];
        $.each(series.series, function(si, sv) {
            xFieldArr.push(sv.xField);
            yFieldArr.push(sv.yField);
            chartData[si] = [];
        });

        var period = HmBoxCondition.val('srchPerfType_port');

    if(dtl_mngNo === undefined || port === undefined) return;

        Server.get('/main/sms/tcpSess/getSvcPortChart.do', {
            data: {
                mngNo: dtl_mngNo,
                port: port,
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
            }
        });
    },

};