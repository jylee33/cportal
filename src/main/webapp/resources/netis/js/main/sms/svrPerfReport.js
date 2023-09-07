var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid;
var $devGrid;
var $dtlTab, $ifGrid;
var svrMngNoList = [];
var windowWidth = $(window).width();
var windowWidthCheck = '';
var Main = {
    /** variable */
    initVariable: function () {
        $leftTab = $('#leftTab');
        $dGrpTreeGrid = $('#dGrpTreeGrid'), $sGrpTreeGrid = $('#sGrpTreeGrid');

        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createRadio($('#srchSvrTarget'), [
            {label: 'CPU', value: 'CPU'},
            {label: '메모리', value: 'MEM'},
            {label: '파일시스템', value: 'FS'},
            //{label: '네트워크', value: 'NETWORK'}
        ]);

        $("input[name='srchSvrTarget']").click(function () {
            $("input[name='srchSvrTarget']:checked").val()
            Main.searchDev2();
            /*if ($("input[name='srchSvrTarget']:checked").val().replace(/[0-9]/ig, '') == "D") {
                $("#sQcDate").show();
                $("#sQcDate2").hide();
            } else {
                $("#sQcDate").hide();
                $("#sQcDate2").show();
            }*/
        });
    },

    /** add event */
    observe: function () {
        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function (event) {
            Main.keyupEventControl(event);
        });

        /*$('#chartContainer').bind('mousemove touchmove touchstart', function (e) {
            var chart,
                point,
                i,
                event,
                chartsXPos;
            for (var i = 0; i < Highcharts.charts.length; i++) {
                chart = Highcharts.charts[i];
                event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                    //event.chartX = event.chartX + 804
                //804 // 812 options.positioner

                if(event.chartX < 0){ //커서가 좌측 시작이면 우측 차트 영역은 x값이 마이너스임
                    event.chartX = event.chartX + 812 //따라서 우측 차트 x값을 좌측과 같이 양수로 맞춤
                    //event.chartX = chartsXPos;
                }else{
                    chartsXPos = event.chartX;
                    if(event.chartX > 800){ //커서 시작이 우측차트면 좌측 차트는 우측+좌측 값이기에 오버 수치
                        event.chartX = event.chartX - 812 //좌측 차트 값은 우측 값 만큼 마이너스 시켜서 원래대로 복귀
                    }
                }
                point = chart.series[0].searchPoint(event, true); // Get the hovered point
                if (point) {
                    point.highlight(event);
                }
            }
        });*/
    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.searchDev2();
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
        //Master.createGrpTab(Main.searchDev2, {devKind1: 'SVR'});
        Master.createGrpTab(Main.createPaging, {devKind1: 'SVR'});
        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {

    },

    createPaging:function(){
        var treeItem = Master.getGrpTabParams();
        var params = {
            grpType: treeItem.grpType,
            grpNo: treeItem.grpNo,
            grpParent: treeItem.grpParent,
            itemKind: treeItem.itemKind
        };

        $("#chartContainer").empty(); //기존 차트 초기화
        Server.get('/main/sms/svrDynamicPerf/getSvrTotalCnt.do', {
            data: params,
            success: function (result) {
                var totalCnt = result;
                if(totalCnt > 0){
                    Main.renderPagination("footer", totalCnt, 10, 10, 1, Main.changePage());
                }else{
                    $(".pagination").remove(); //페이징 제거
                    //상단 차트영역 조회 데이터 없음 표기
                    var noData = '<div style="position: absolute;left: 50%;top: 50%; transform: translate(-50%,-50%)">표시할 데이터가 없습니다.</div>';
                    $("#chartContainer").append(noData);

                }
                //param1: append 될 부모 id
                //param2: 표현될 전체 데이터 row 수
                //param3: 페이징을 생성할 전체 수. 10 일 경우 하단 페이징은 1,2,3,4,5,6..10 10개
                //param4: 한 페이징에 보여질 row 제한 수
                //param5: 현재 위치
                //param6: 클릭 callback
            }
        });
    },

    /** 장비 조회 */
    searchDev: function () {
        //HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/devPerf3/getDevReportList.do');
        //$("#chartContainer").jqxDataTable('updateBoundData');
    },

    searchDev2: function () {
        /*var curPage = curPageParam;
        if(curPage === undefined){
            curPage = 1;
        }*/
        var curPage = $("#curPage").val();
        svrMngNoList = [];
        var treeItem = Master.getGrpTabParams();
        var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';

        var params = {
            grpType: treeItem.grpType,
            grpNo: treeItem.grpNo,
            grpParent: treeItem.grpParent,
            itemKind: treeItem.itemKind,
            pageFirstNo: (parseInt(curPage) - 1) * 10
        }

        //좌측 서버 그룹 트리 인성용으로 분리
        Server.get('/main/sms/svrDynamicPerf/getSvrList.do', {
            data: params,
            success: function (result) {
                var tmp = [];
                //$("#chartContainer").empty();
                $(".hmChart").remove();
                var mainDiv = $("#chartContainer");
                $.each(result, function (idx, value) {
                    //차트 div 생성
                    //var chartDiv = '<div id="svrCharts_'+ value.mngNo +'" class="hmChart">DIV:: '+ value.name +'</div>';
                    var chartDiv = '<div id="svrCharts_'+ value.mngNo +'" class="hmChart" data-name="'+ value.name +'"></div>';
                    mainDiv.append(chartDiv);
                    var seriesType = HmBoxCondition.val('srchSvrTarget'); //지표 선택값

                    if(seriesType != 'FS'){
                        Main.createSvrChart(value.mngNo,'pps', value);
                    }else{
                        Main.createSvrFsChart(value.mngNo,'pps', value);
                    }

                });
            }
        });
    },

    createSvrChart: function(mngNo,type, svrInfo){
        var chartId = 'svrCharts_'+mngNo;
        var series = {};
        var seriesType = HmBoxCondition.val('srchSvrTarget'); //지표 선택값
        var svrInfos = svrInfo;


        //seriesType = 'CPU'
        switch(seriesType) {
            case 'CPU':
                series = {series: [
                        {name: 'USER 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_AVG'},
                        {name: 'USER 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_MAX'}
                    ]
                    , chartConfig: { unit: 'pct' }};
                break;
            case 'MEM':
                series = {series: [
                        {name: '물리 사용률 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_AVG'},
                        {name: '물리 사용률 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_MAX'}
                    ]
                    , chartConfig: { unit: 'pct' }};
                break;
            case 'NETWORK':
                series = {series: [
                        {name: 'BPS IN 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_IN_AVG'},
                        {name: 'BPS IN 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_IN_MAX'},
                        //{name: 'BPS IN 최소', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_IN_MIN'},
                        {name: 'BPS OUT 평균', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_OUT_AVG'},
                        {name: 'BPS OUT 최대', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_OUT_MAX'},
                        //{name: 'BPS OUT 최소', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_OUT_MIN'}
                    ]
                    , chartConfig: { unit: '1000' }};
                break;
            default:
                series = {series: [
                        {name: 'PERF_AVG', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_AVG'},
                        {name: 'PERF_MAX', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_MAX'},
                        {name: 'PERF_MIN', type: 'area', xField: 'DT_YMDHMS', yField: 'PERF_MIN'}
                    ]
                    , chartConfig: { unit: 'pct' }};
                break;
        }

        var userOptions = {
            chart: {
                marginTop: 30,
                marginBottom: 70
            }

        }
        $.extend(series, userOptions)
        var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
        $chart.initialize(); //데이터 없는 경우 포함하여 모든 차트를 그림. 불필요시 주석

        var title = svrInfos.name+'(' +svrInfos.mngNo + ')';

        var chartData = {};
        var xFieldArr = [], yFieldArr = [];
        $.each(series.series, function(si, sv) {
            xFieldArr.push(sv.xField);
            yFieldArr.push(sv.yField);
            chartData[si] = [];
        });

        var params = {};
        $.extend(params, {
            mngNo: mngNo, //207031
            srchSvrTarget: seriesType //선택된 지표에 따라 타켓 테이블 변경 (NT_SVR_CPU, NT_SVR_MEMORY, FILESYSTEM ..)
        }, HmBoxCondition.getPeriodParams('_svrPerfChart'));

        $('#'+chartId).highcharts().setTitle({
            text: title,
            style: {/*fontSize: '12px',*/ fontWeight: 'bold'}
        });

        Server.post('/main/sms/svrDynamicPerf/getSvrPerfList.do', {
            data: params,
            success: function(result) {
                var totalSize = 0;
                var useSize = 0;
                var freeSize = 0;

                if(result.length > 0){

                    $.each(result, function(i, v) {
                        //지표가 메모리일 경우 마지막 row 수집 데이터를 요약정보로 표시
                        if(i == result.length -1){
                            if(seriesType == 'MEM') {
                                totalSize = v.totalSize;
                                useSize = v.useSize;
                                freeSize = v.freeSize;
                            }
                        }

                        for(var sidx in xFieldArr) {
                            var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                            chartData[sidx].push([v[_xField], v[_yField]]);
                        }
                    });
                    $.each(series.series, function(si, sv) {
                        HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                    });

                    HmHighchart.redraw(chartId);

                    //요약용 라스트 데이터 조회 (지표가 메모리, 파일시스템 일 경우)
                    if(seriesType == 'MEM' ){
                        var subTilte = '';

                        subTilte += '<span style="font-weight: bold">총량: </span>';
                        subTilte += '<span style="font-size: 12px;">'+HmUtil.convertUnit1024(totalSize)+'</span>';
                        subTilte += '&nbsp;';
                        subTilte += '<span style="font-weight: bold">사용량: </span>';
                        subTilte += '<span style="font-size: 12px;">'+HmUtil.convertUnit1024(useSize)+'</span>';
                        subTilte += '&nbsp;';
                        subTilte += '<span style="font-weight: bold">남은량: </span>';
                        subTilte += '<span style="font-size: 12px;">'+HmUtil.convertUnit1024(freeSize)+'</span>';

                        $('#'+chartId).highcharts().setSubtitle({
                            text : subTilte,
                            style: {fontSize: '14px'},
                            useHTML: true,
                            align: 'right',
                            verticalAlign: 'top',
                            x: 10,
                            y: 10
                        });
                    }

                }else{
                    //데이터 없는 경우 y축 선 제거
                    $('#'+chartId).highcharts().yAxis[0].update({gridLineWidth: 0}, false);
                }
            }
        })

    },

    createSvrFsChart: function(mngNo,type, svrInfo){
        var MountPointList = [];
        Server.post('/main/sms/svrDynamicPerf/getFsMountPointList.do', {
            data: {mngNo: mngNo},
            success: function (result) {
                if(result.length > 0){
                    $.each(result, function(idx, value){
                        MountPointList.push(value.mountPoint);
                    });
                }
                var chartId = 'svrCharts_'+mngNo;
                var series = {};
                var svrInfos = svrInfo;

                var options = HmHighchart.getCommOptions(HmHighchart.TYPE_LINE);

                HmHighchart.createStockChart(chartId, {
                    yAxis: {
                        crosshair: true,
                        opposite: false,
                        showLastLabel: true,
                        // max: 100,
                        labels: {
                            formatter:  function () {
                                return this.value + ' %'
                            }
                        }
                    },
                    tooltip: {
                        shared: true,
                        useHTML: true,
                        valueSuffix: ' %',
                        formatter: HmHighchart.absHtmlTooltipFormatter
                    },
                    plotOptions : {
                        line: {
                            lineWidth: 0.9
                        }
                    },
                    series: []
                }, HmHighchart.TYPE_LINE);

                var title = svrInfos.name;

                $('#'+chartId).highcharts().setTitle({
                    text: title,
                    style: {/*fontSize: '12px',*/ fontWeight: 'bold'}
                });

                var chart = $('#svrCharts_'+mngNo).highcharts();

                var seriesCnt = MountPointList.length;
                for(var i = 0; i <seriesCnt; i++){
                    chart.addSeries({ name: MountPointList[i] }, false);
                }


                var params = {};
                $.extend(params, {
                    //limit: 20000,
                    mngNo: mngNo,
                    srchSvrTarget: 'FS'
                }, HmBoxCondition.getPeriodParams('_svrPerfChart'));
                Server.post('/main/sms/svrDynamicPerf/getSvrPerfList.do', {
                    data: params,
                    success: function (result) {
                        for(var i = 0; i <seriesCnt; i++){
                            var chartData = [];
                            $.each(result, function(idx, value){
                                if( MountPointList[i] == value.MOUNT_POINT){
                                    chartData.push([value.DT_YMDHMS, value.PERF_AVG, value.MOUNT_POINT ]);
                                }
                            });
                            chart.series[i].update({ name: MountPointList[i], data: chartData }, false);
                        }
                        HmHighchart.redraw(chartId);
                    }
                });
            }
        });

    },


    //페이징 생성
    //perPage 한페이지 데이터 표시수
    //pageSize 페이징 번호 표기 수
    renderPagination :function (tableId, totalCnt, perPage, pageSize, current, changePage) {
        var $pagingHtml = $('#' + tableId).parent();

        if ($($pagingHtml).find('.pagination').length > 0) {
            $('.pagination').remove();
        }

        var pageCount = parseInt((totalCnt- 1) / perPage+ 1);// 전체 페이지 수
        var pageBlock = parseInt(pageCount / pageSize);// 생성될 페이지 블록 수
        var pages = [];
        var curBlockNum = parseInt((current- 1) / pageSize);

        /*if(pageCount < pageSize){
            pageSize = pageCount;
        }*/

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
        Main.searchDev2();


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
            excelName : '성능보고서'
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