var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid;
var $devGrid;
var $dtlTab, $ifGrid;

var Main = {
    /** variable */
    initVariable: function () {
        $leftTab = $('#leftTab');
        $dGrpTreeGrid = $('#dGrpTreeGrid');
        $sGrpTreeGrid = $('#sGrpTreeGrid');

        this.initCondition();
    },

    initCondition: function () {

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
            case 'btnSearch':
                this.searchDev();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            //Main.searchDev();
        }
    },

    /** init design */
    initDesign: function () {
        HmJqxSplitter.createTree($('#mainSplitter'));
        HmBoxCondition.createPeriod('_svrPerfChart');

        // 좌측 탭영역
        Master.createGrpTab(Main.createPaging, {devKind1: 'SVR'});
        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {

    },

    createPaging:function(){
        $("#chartContainer").empty(); //기존 차트 초기화

        Server.get('/main/sms/svrDynamicPerf/getNtSvrTotalCnt.do', {
            data: Master.getGrpTabParams(),
            success: function (totalCnt) {
                if(totalCnt > 0) {
                    Main.renderPagination("footer", totalCnt, 10, 10, 1, Main.changePage());
                } else {
                    $(".pagination").remove(); //페이징 제거
                    //상단 차트영역 조회 데이터 없음 표기
                    var noData = '<div style="position: absolute;left: 50%;top: 50%; transform: translate(-50%,-50%)">표시할 데이터가 없습니다.</div>';
                    $("#chartContainer").append(noData);
                }
            }
        });
    },

    /** 장비 조회 */
    searchDev: function () {

        var params = Main.getCommParams();

        // 차트 영역 생성
        Server.get('/main/sms/svrDynamicPerf/getNtSvrInfoList.do', {
            data: params,
            success: function (result) {
                // console.log('info', result)
                $(".hmChart").remove();

                var mainDiv = $("#chartContainer");
                $.each(result, function (idx, value) {
                    var chartDiv = '<div id="svrCharts_'+ value.mngNo + '_' + idx +'" class="hmChart" data-name="'+ value.devName+'-' + value.devName +'"></div>';
                    mainDiv.append(chartDiv);

                    params.mngNo = value.mngNo;
                    params.idx = idx;
                    params.devName = value.devName;
                    params.svrName = value.name;

                    Main.initChart(params);
                });
            }
        });
    },

    initChart: function (data) {

        //차트 생성
        var series = {series: [
            {name: 'BPS IN 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_IN_AVG'},
            {name: 'BPS IN 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_IN_MAX'},
            {name: 'BPS OUT 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_OUT_AVG'},
            {name: 'BPS OUT 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_OUT_MAX'},
        ], chartConfig: { unit: '1000' }};

        var userOptions = {
            chart: {
                marginTop: 30,
                marginBottom: 70
            },
            plotOptions : {
                line: {
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    connectNulls: true
                }
            }
        };
        $.extend(series, userOptions);

        var mngNo = data.mngNo;
        var devName = data.devName;
        var lanName = data.svrName;
        var idx = data.idx;

        var chartId = 'svrCharts_'+ mngNo + '_' + idx;
        var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
        $chart.initialize();

        var chartData = {};
        var xFieldArr = [], yFieldArr = [];
        $.each(series.series, function(si, sv) {
            xFieldArr.push(sv.xField);
            yFieldArr.push(sv.yField);
            chartData[si] = [];
        });

        $('#'+chartId).highcharts().setTitle({
            text: devName + ' - ' + lanName,
            style: {/*fontSize: '12px',*/ fontWeight: 'bold'}
        });

        var params = Main.getCommParams();
        params.mngNo = mngNo;
        params.lanName = lanName;

        Server.get('/main/sms/svrDynamicPerf/getNtSvrPerfData.do', {
            data: params,
            success: function (result) {
                // console.log('perf', result)
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

    //페이징 생성
    renderPagination :function (tableId, totalCnt, perPage, pageSize, current, changePage) {
        var $pagingHtml = $('#' + tableId).parent();

        if ($($pagingHtml).find('.pagination').length > 0) {
            $('.pagination').remove();
        }

        var pageCount = parseInt((totalCnt- 1) / perPage+ 1);// 전체 페이지 수

        var pages = [];
        var curBlockNum = parseInt((current- 1) / pageSize);

        if (totalCnt> 0) {
            var start = curBlockNum * pageSize;
            var end = pageCount > start + pageSize- 1 ? start + pageSize- 1 : pageCount - 1;
            for (var i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        var html = '<div class="pagination" style="text-align: center;">';

        /*if (current!== 1) {
            html += '<a href="#" id="first" class="btnfirst"></a>';
            html += '<a href="#" id="prev" class="btnleft"></a>';
            //이전, 처음
        }*/

        html += '<a href="#" id="first" class="btnfirst"></a>';
        html += '<a href="#" id="prev" class="btnleft"></a>';

        if (pages.length > 0) {
            var marginLeft= 0;
            for (var i = 0; i < pages.length; i++) {
                if(i !=0 ){
                    //marginLeft = '10px';
                }
                html += "<a href='#' class='pNum' style='margin-left: "+marginLeft+"' id=" + (pages[i] + 1) + ">" + (pages[i] + 1) + "</a>";
            }
        }

        /*if (pageCount > 1 && current!== pageCount) {
            html += '<a href=# id="next" class="btnright"></a>';
            html += '<a href=# id="last" class="btnlast"></a>';
            //다음,마지막
        }*/

        html += '<a href=# id="next" class="btnright"></a>';
        html += '<a href=# id="last" class="btnlast"></a>';

        html += '</div>';
        $($pagingHtml).append(html);

        //$(".pagination a").css("color", "black");
        //$(".pagination a#" + current).css({ "text-decoration": "none", "font-weight": "bold" });
        //$(".pagination a#" + current).css({ "text-decoration": "none", "font-weight": "bold" });
        $(".pagination a#" + current).addClass("hover");


        $(".pagination a").on("click", function() {

            var $item = $(this);
            var $id = $item.attr("id");
            var selected= $item.text();

            if ($id === "next") {
                if (pageCount > 1 && current!== pageCount) {
                    selected= Number(current) + 1;
                }else{
                    return
                }
            }
            else if ($id === "prev") {
                if(current!== 1){
                    selected= Number(current) - 1;
                }else{
                    return
                }
            }
            else if ($id === "last") {
                if (pageCount > 1 && current!== pageCount) {
                    selected= Number(pageCount);
                }else{
                    return
                }
            }
            else if ($id === "first") {
                if(current!== 1){
                    selected= 1;
                }else{
                    return
                }
            }
            else {
                selected = Number(selected);
            }

            if (selected=== current) return;
            Main.changePage(selected);
            Main.renderPagination(tableId, totalCnt, perPage, pageSize, selected);
        });
    },

    changePage :function (item) {
        if(item === undefined){
            item = 1
        }
        var curPage = $("#curPage").val();
        if (item === curPage) return;
        $("#curPage").val(item);

        Main.searchDev();
    },

    getCommParams: function () {
        var params = {};

        $.extend(params,
            Master.getGrpTabParams(),
            HmBoxCondition.getPeriodParams('_svrPerfChart')
        );

        params.pageFirstNo = (parseInt($('#curPage').val()) - 1) * 10;

        return params;
    },

    exportExcel: function () {
        var imageList = [];
        var svrNameList = [];
        $(".hmChart").each(function(index, item){
            var svrChart =  $('#'+this.id).highcharts();
            var svrName = $('#'+this.id).data("name");
            imageList.push(Main.makeChartExcel(svrChart));
            svrNameList.push(svrName);

        })
        var $chart = $('#svrCharts_8');

        var params = {
            imageList: imageList,
            svrNameList: svrNameList,
            excelName : '성능보고서(네트워크)'
        }
        HmUtil.exportExcel(ctxPath + '/main/sms/svrDynamicPerf/export.do', params);
    },

    makeChartExcel:function (chart) {
        var fname = $.format.date(new Date(), 'yyyyMMddHHmmssSSS') + '.png';
        var svg = chart.getSVG({
            exporting: {
                sourceWidth: chart.chartWidth,
                sourceHeight: chart.chartHeight
            }
        });
        var canvas = document.createElement('canvas');
        canvg(canvas, svg); //svg -> canvas draw
        var imgData = canvas.toDataURL("image/png"); // png이미지로 변환
        var ch_params = {fname: fname, imgData: imgData};

        Server.post('/file/saveHighchart.do', {
            data: ch_params,
            success: function (result) {
                //params.imgFile = fname;
            }
        });
        return fname;
    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();


});