var $rptGrid;
var monthlyIfChart;
var Main = {
    /** variable */
    initVariable: function () {
        $rptGrid = $('#rptGrid');
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch":
                this.search();
                break;
            case 'btnExcel':
                this.excelExport();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '60%',
            collapsible: false
        }, {size: '40%'}], 'auto', '100%');

        $('#date1').jqxDateTimeInput({
            width: '110px',
            height: '21px',
            formatString: 'yyyy-MM',
            theme: jqxTheme,
            views: ["", "year", "decade"],
            culture: 'ko-KR',
        });

        var today = new Date();
        today.setDate(today.getDate() - 1);
        $('#date1').jqxDateTimeInput('setDate', today);

        $('#ddbWorkTime').jqxDropDownList({
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/code/getWorkTimeCombo.do'
                }
            ),
            displayMember: 'label', valueMember: 'value', width: 150, height: 22, theme: jqxTheme, selectedIndex: 0
        });

        /** 월간회선 그리드 그리기 */
        HmGrid.create($rptGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    }
                }
            ),
            columns:
                [
                    {text: '장비번호', datafield: 'mngNo', width: 40, hidden: true},
                    {text: '회선번호', datafield: 'ifIdx', width: 40, hidden: true},
                    {text: '그룹명', datafield: 'grpName', width: 150, pinned: true},
                    {text: '장비명', datafield: 'devName', minwidth: 100, pinned: true},
                    {text: '회선명', datafield: 'ifName', minwidth: 100, pinned: true},
                    {text: '회선별칭', datafield: 'ifAlias', minwidth: 100, pinned: true},
                    {text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '평균In bps', datafield: 'avgInBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '평균Out bps', datafield: 'avgOutBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '최대In bps', datafield: 'maxInBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '최대Out bps', datafield: 'maxOutBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '최소In bps', datafield: 'minInBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    {text: '최소Out bps', datafield: 'minOutBps', width: 100, cellsrenderer: HmGrid.unit1000renderer},
                    // { text: "평균In 사용률", datafield: "perAvgInBps", width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                    // { text: "평균Out 사용률", datafield: "perAvgOutBps", width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                    // { text: '최대In 사용률', datafield: 'perMaxInBps', width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                    // { text: '최대Out 사용률', datafield: 'perMaxOutBps', width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                    // { text: '최소In 사용률', datafield: 'perMinInBps', width: 100, cellsrenderer: HmGrid.progressbarrenderer },
                    // { text: '최소Out 사용률', datafield: 'perMinOutBps', width: 100, cellsrenderer: HmGrid.progressbarrenderer }
                ]
        });

        $rptGrid.on('rowdoubleclick', function (event) {
            Main.searchChart();
        });
        //일간회선 차트 그리기
//			Main.drawChart();
//         var lineType = HmHighchart.TYPE_LINE;
//     	var areaType = HmHighchart.TYPE_AREA;
//         var defaultSeriesArray = [
//             {name: 'IN 평균', data: null, lineWidth: 0.5, type: areaType},
//             {name: 'OUT 평균', data: null, lineWidth: 0.5, type: areaType},
//             {name: 'IN 최대', data: null, lineWidth: 1, type: lineType},
//             {name: 'OUT 최대', data: null, lineWidth: 1, type: lineType}];
//
//         Main.createDefaultHighChart('bpsChart', defaultSeriesArray, '');
        var dailyIfSeries = [
            {name: 'IN 평균', type: 'area', xField: 'dtYmdhms', yField: 'avgInBps'},
            {name: 'OUT 평균', type: 'area', xField: 'dtYmdhms', yField: 'avgOutBps'},
            {name: 'IN 최대', type: 'line', xField: 'dtYmdhms', yField: 'maxInBps'},
            {name: 'OUT 최대', type: 'line', xField: 'dtYmdhms', yField: 'maxOutBps'},
            {name: 'IN 최소', type: 'line', visible: false, xField: 'dtYmdhms', yField: 'minInBps'},
            {name: 'OUT 최소', type: 'line', visible: false, xField: 'dtYmdhms', yField: 'minOutBps'},
        ]

        monthlyIfChart = new CustomChart('bpsChart', HmHighchart.TYPE_LINE, {
            series: dailyIfSeries, chartConfig: {unit: '1000'}
        }, '/main/rpt/monthlyIf/getMonthlyIfChart.do');
        monthlyIfChart.initialize();

        Master.createGrpTab(Main.search, {devKind1: 'DEV'});
    },

    /** init data */
    initData: function () {

    },

    getCommParams: function () {
        var params = Master.getGrpTabParams();
        return $.extend(params, {
            date1: HmDate.getDateStr($('#date1')),
            timeId: $('#ddbWorkTime').val() || 0,
            userId: $('#sUserId').val()
        });
    },

    /** 일간회선 그리드 조회 */
    search: function () {
        HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/monthlyIf/getMonthlyIfList.do');
    },

    searchChart: function () {
        var rowIdx = HmGrid.getRowIdx($rptGrid, '회선을 선택해주세요.');
        if (rowIdx === false) return;
        var rowdata = $rptGrid.jqxGrid('getrowdata', rowIdx);
        var params = {
            mngNo: rowdata.mngNo,
            ifIdx: rowdata.ifIdx,
            timeId: $("#ddbWorkTime").val(),
            date1: HmDate.getDateStr($('#date1'))
        };

        monthlyIfChart.searchData(params);
    },
    /* /!**  일간회선 차트 조회 *!/
     searchChart: function() {
         var rowIdx = HmGrid.getRowIdx($rptGrid, '회선을 선택해주세요.');
         if(rowIdx === false) return;
         var rowdata = $rptGrid.jqxGrid('getrowdata', rowIdx);
         var params = {
             mngNo: rowdata.mngNo,
             ifIdx: rowdata.ifIdx,
             timeId: $("#ddbWorkTime").val(),
             date1: HmDate.getDateStr($('#date1'))
         };
         Server.get('/main/rpt/dailyIf/getDailyIfChart.do', {
             data: params,
             success: function(result) {
                 Main.drawChart('bpsChart', result);
                 /!*
                 $bpsChart.jqxChart({ source: result });
                 $bpsChart.jqxChart('update');
                 *!/
             }
         });
     },*/
    /* /!* 차트 생성 *!/
     createDefaultHighChart: function (elementName, seriesArray, valUnit) {
 //      Highcharts.chart(elementName, pIfPerfChart.getSettings(seriesArray, suffix, itemType, chartType));
         var lineType = HmHighchart.TYPE_LINE;
          var commOptions = HmHighchart.getCommOptions(lineType);
          var options = {};
             options.chart= {
                     zoomType: 'x',
                     resetZoomButton: {
                         position: {
                             align: 'right', // by default
                             verticalAlign: 'top', // by default
                             x: -10,
                             y: 10
                         },
                         relativeTo: 'chart'
                     },
                     type: null
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
 //									format: '{value}'+valUnit
                         formatter:function(){
                             var val = this.value;
                             if(val!=null) val = Math.abs(val);
                             return HmUtil.convertUnit1000(Math.abs(val))+valUnit;
                         }
                     },
                     title: null
                 }
             ];
             options.tooltip = {
                 formatter: function(){
                     return Main.perfTooltipFormat(this, 'yyyy-MM-dd HH:mm', valUnit);
                 }
             };
             options.legend= { enabled: true };
             options.plotOptions = {
                     line: {
                         lineWidth: 1,
                         marker: {
                             enabled: false
                         },
                         connectNulls: true
                     }
                 };
             options.series= seriesArray;

             var hmOptions = $.extend(true, commOptions, options);

             HmHighchart.create2(elementName, hmOptions);
      },

     /!** 성능 차트 툴팁 포멧설정*!/
     perfTooltipFormat: function(thisVal, dateFormat, valUnit){
         var xVal = thisVal.x;
         var points = thisVal.points;

         var s = '<b>' + $.format.date(new Date(xVal), dateFormat) + '</b>';

         $.each(points, function(key, oneDt) {
             var name = oneDt.series.name;
             var yVal = oneDt.y;

             if(yVal!=null) yVal = Math.abs(yVal);
             s += '<br/>' + name + ': ' + HmUtil.convertUnit1000(yVal)+valUnit;
         });

         return s;
     },

     /!**  일간회선 차트 그리기 *!/
     drawChart: function(chartName, result) {
         var $chart = $('#'+chartName).highcharts();
         var seriesArray = [];

         var chData_in = [], chData_out = [], chData_max_in = [], chData_max_out = [];
         if(result!=null){
             for (var i = 0; i < result.length; i++) {
                 var oneDt = result[i];

                 var time = HmHighchart.change_date(oneDt.ymdhms).getTime();
                 var val = oneDt.avgInBps;
                 if(val != null) val = parseFloat(val);
                 chData_in.push([time, val]);

                 var val2 = oneDt.avgOutBps;
                 if(val2 != null) val2 = parseFloat(val2)*-1;
                 chData_out.push([time, val2]);


                 var val3 = oneDt.maxInBps;
                 if(val3 != null) val3 = parseFloat(val3);
                 chData_max_in.push([time, val3]);

                 var val4 = oneDt.maxOutBps;
                 if(val4 != null) val4 = parseFloat(val4)*-1;
                 chData_max_out.push([time, val4]);
             }
         }
 //				console.log(chData);

         $chart.series[0].setData(chData_in, false);
         $chart.series[1].setData(chData_out, false);
         $chart.series[2].setData(chData_max_in, false);
         $chart.series[3].setData(chData_max_out, false);
         $chart.redraw();
     },
     */
    /** 엑셀 출력 */
    excelExport: function () {
        HmUtil.exportGrid($rptGrid, '일간회선', false);
    }

};

$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});