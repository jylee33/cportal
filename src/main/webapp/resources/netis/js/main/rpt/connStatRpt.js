var $connChart;
var $connGrid;

var Main = {

    /** variable */
    initVariable: function () {
        $connChart = $('#connChart');
        $connGrid = $('#connGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch":
                this.search();
                break;
            case "pbtnExcel":
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            // Main.search();
        }
    },

    /** init design */
    initDesign: function () {

        HmWindow.create($('#p2window'));

        // 기간설정
        $('#date1').jqxDateTimeInput({
            width: '110px',
            height: '21px',
            formatString: 'yyyy-MM-dd',
            theme: jqxTheme,
            showCalendarButton: false
        });

        $('#mainSplitter').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'horizontal',
            showSplitBar: false,
            panels: [{size: '50%'}, {size: '50%'}]
        });

        $('#subSplitter').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'horizontal',
            showSplitBar: false,
            panels: [{size: 140}, {size: '100%'}]
        });

        $('#btnViewType').jqxButtonGroup({mode: 'radio', theme: jqxTheme})
            .on('buttonclick', function (event) {
                switch (event.args.button[0].id) {
                    case 'HOURLY':
                        $('#date1').jqxDateTimeInput({formatString: 'yyyy-MM-dd'});
                        break;
                    case 'DAILY':
                        $('#date1').jqxDateTimeInput({formatString: 'yyyy-MM'});
                        break;
                }
            });
        $('#btnViewType').jqxButtonGroup('setSelection', 0);

        // 그룹
        HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_AP_GRP_DEFAULT, 200, 22, 300, 350, Main.searchAp);


        $('#ddbDev').jqxDropDownButton({width: 180, height: 22})
            .on('open', function (event) {
                $('#devGrid').css('display', 'block');
            });


        HmGrid.create($('#devGrid'), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                },
                {
                    formatData: function (data) {

                        var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');

                        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;

                        $.extend(data, {
                            apGrpNo: _grpNo,
                        });

                        return data;

                    }
                }
            ),
            filterable: true,
            showfilterrow: true,
            columns:
                [
                    {text: 'AP 명', datafield: 'apName', width: '35%'},
                    {text: 'AP 대역폭', datafield: 'apBwName', width: '20%'},
                    {text: 'AP IP', datafield: 'apIp', width: '20%'},
                    {text: 'AP MAC', datafield: 'apMac', width: '25%'},
                    {text: '', datafield: 'apNo', width: 0, hidden: true},
                    {text: '', datafield: 'apBw', width: 0, hidden: true},
                ],
            width: 750
        });

        $('#devGrid').on('rowselect', function (event) {
            var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
            if (rowdata !== undefined) {
                var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.apName + '</div>';
            } else {
                var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px"></div>';
            }
            $('#ddbDev').jqxDropDownButton('setContent', content);
        }).on('bindingcomplete', function (event) {
            $(this).jqxGrid('selectrow', 0);
        }).on('rowdoubleclick', function (event) {
            $('#ddbDev').jqxDropDownButton('close');
        });


        HmGrid.create($connGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    beforeLoadComplete: function (records) {
                    },
                }
            ),
            pageable: false,
            columns:
                [
                    {text: "날짜", datafield: "ymdhms", displayfield: 'disYmdhms', width: 160, cellsalign: 'center'},
                    {text: "장비명", datafield: "disApName", minwidth: 80},
                    {text: "접속", datafield: "connCnt", width: 200, cellsalign: 'center'}
                ]
        }, CtxMenu.COMM, '');


        Main.createChart();
        // var defaultSeriesArray = [
        //     {name: '수신 Byte',  lineWidth: 0.5},
        //     {name: '송신 Byte',  lineWidth: 0.5}
        // ];
        // var chartType = HmHighchart.TYPE_AREA;
        // Main.createDefaultHighChart('trfChart', defaultSeriesArray, '', '', chartType);
        // Main.createDefaultHighChart('clientChart', defaultSeriesArray, '', '', chartType);
    },

    getCommParams: function () {

        var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');

        var _grpNo = grpSelection.length == 0 ? 0 : grpSelection[0].grpNo;

        var rowIdx = HmGrid.getRowIdx($('#devGrid'));

        if (rowIdx === false) return;

        var rowdata = $('#devGrid').jqxGrid('getrowdata', rowIdx);
        var btnIdx = $('#btnViewType').jqxButtonGroup('getSelection');
        var viewType = 0;

        var _date1;
        var _date2;
        switch (btnIdx) {
            case 0:
                viewType = 'HOURLY';
                _date1 = new Date($('#date1').val('date'));
                _date2 = new Date($('#date1').val('date'));
                break;
            case 1:
                viewType = 'DAILY';
                _date1 = new Date($('#date1').val('date'));
                _date1.setDate(1);

                _date2 = new Date($('#date1').val('date'));
                _date2.setMonth(_date2.getMonth() + 1);
                _date2.setDate(0);

                break;
        }

        return {
            viewType: viewType,
            date1: $.format.date(_date1, 'yyyyMMdd'),
            time1: '0000',
            date2: $.format.date(_date2, 'yyyyMMdd'),
            time2: '2359',
            grpNo: _grpNo,
            apNo: rowdata.apNo
        };
    },

    searchAp: function () {

        HmGrid.updateBoundData($('#devGrid'), ctxPath + '/main/rpt/connStatRpt/getApList.do');

    },

    search: function () {
        Main.searchPerf();
        Main.searchStat();
        Main.searchChart();
    },

    createChart: function () {
        HmHighchart.create('connChart', {
            chart: {type: 'column'},
            xAxis: {type: 'category'},
            // colors: ['#FF0000', '#00FF00'],
            yAxis: {
                /*labels: {
                    formatter: HmHighchart.unit1024Formatter
                },*/
                title: ''
            },
            legend: {enabled: true},
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b><br/>' +
                        this.series.name + ' : ' + (this.point.y) + '<br/>';
                }
            },
            series: [{
                name: '접속자수',
                type: 'column',
                data: null
            }
            ]
        }, CtxMenu.NONE);
        /*        var options = {

                };

                HmHighchart.create2($trfChart, $.extend({
                    chart: {type: 'bar'},
                    legend: {enabled: false},
                    yAxis: {title: {text: null}},
                }, options), HmHighchart.TYPE_BAR);
                */

    },
    searchChart: function () {
        var _chart = $connChart.highcharts();
        var len = _chart.series.length;
        for (var i = len - 1; i >= 0; i--) {
            _chart.series[i].remove();
        }

        Server.get('/main/rpt/connStatRpt/getApConnChartList.do', {
            data: Main.getCommParams(),
            success: function (result) {

                if (result != null) {

                    var connData = [], categories = [];
                    if (result.length > 0) {
                        $.each(result, function (idx, item) {
                            connData.push({name: item.ymdhms, y: item.connCnt});
                            categories.push(item.ymdhms);
                        });
                    }
                    _chart.xAxis[0].setCategories(categories, false);
                    _chart.addSeries({name: '접속자수', type: 'column', colorByPoint: false, data: connData});


                }
            }
        });
    },

    searchStat: function () {
        Server.get('/main/rpt/connStatRpt/getApConnStatList.do', {
            data: Main.getCommParams(),
            success: function (result) {
                if (result != null) {
                    $.each(result, function (key, value) {
                        console.log(key, value)
                        try {
                            $('#' + key).text(value);
                        } catch (e) {
                        }
                    });
                }
            }
        });
        // HmGrid.updateBoundData($('#trfGrid'), ctxPath + '/main/rpt/trfStatRpt/getApTrafficStatList.do');
    },

    searchPerf: function () {
        HmGrid.updateBoundData($('#connGrid'), ctxPath + '/main/rpt/connStatRpt/getApConnList.do');
    },

    exportExcel: function () {


        HmUtil.saveHighchart($('#connChart').highcharts(), function (_params) {

            var _chartObj = {
                chartFileName: _params.imgFile
            };

            var _grid_1 = {
                totalConn: $('#totalConn').text(),
                avgConn: $('#avgConn').text(),
                maxConn: $('#maxConn').text(),
                minConn: $('#minConn').text()
            };

            var _grid_2_param = Main.getCommParams();

            HmUtil.exportExcel(ctxPath + '/main/rpt/connStatRpt/export.do', {
                chartObj: _chartObj,
                grid1: _grid_1,
                grid2_param: _grid_2_param
            });

        }, Main.getCommParams());

    }
};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
});