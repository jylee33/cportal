var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid;

var searchItems = []; //실제 조회할 항목
var selectItems = []; //팝업에서 선택한 항목
var selectedPortList = []; //이전에 선택했던 항목
var selectSvrMngNo = 0;
var timer;

var Main = {
    /** variable */
    initVariable: function () {
        $leftTab = $('#leftTab');
        $dGrpTreeGrid = $('#dGrpTreeGrid'), $sGrpTreeGrid = $('#sGrpTreeGrid');

        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createPeriod('_svrPerfChart', Main.search, timer);
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
                this.search();
                break;
            case 'btnTargetPopup':
                this.targetPopup();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            
        }
    },

    /** init design */
    initDesign: function () {
        HmBoxCondition.createRadio($('#srchPerfType'), [
            {label: '포트', value: 'PORT'},
            {label: '서버', value: 'SVR'}
        ]);

        $("input[name='srchPerfType']").click(function () {
            Main.search();
        });

        HmJqxSplitter.createTree($('#mainSplitter'));

        // 좌측 탭영역
        Master.createGrpTab(Main.search, {devKind1: 'SVR'});
        $('#section').css('display', 'block');

    },

    /** init data */
    initData: function () {

    },

    search: function () {
        var searchType = HmBoxCondition.val('srchPerfType');
        searchType === TcpPerfType.PORT ? Main.searchPort() : Main.searchSvr();
        HmUtil.switchDisplayByType($('#btnTargetPopup'), searchType);
    },

    targetPopup: function(){
        //todo 조회 기준이 포트냐 서버냐 팝업 분기 필요. 포트-> 멀티선택. 서버->단일선택
        var srchPerfType = $("#srchPerfType").val();
        var treeItem = Master.getGrpTabParams();
        treeItem.selected = selectedPortList;
        $.get(ctxPath + '/main/popup/sms/pTcpPerfTarget.do', function (result) {
            HmWindow.open($('#pwindow'), '조회', result, 500, 477, 'pwindow_init', treeItem);
        });

    },

    //설정팝업 확인 후 callback
    targetPopupResult: function(callbackData){
        //callbackData
        //포트일 경우 arr
        //서버일 경우 mngNo 단일
        if(callbackData.length > 0) selectItems = callbackData;
        else selectSvrMngNo = callbackData; //선택했던 포트 값 가지고 있기 위해서 서버일 경우, 변수 분리

        if(selectedPortList.length === 0) selectedPortList = searchItems;

        Main.search();
    },

    searchPort: function () {

        var mainDiv = $("#chartContainer");
        mainDiv.empty();
        $(".hmChart").remove();

        // 이전 선택한 포트와 재선택한 포트가 다를 경우
        if(JSON.stringify(selectItems) !== JSON.stringify(selectedPortList))
            selectedPortList = selectItems;

        //트리에서 선택한 그룹이 가지고 있는 포트 목록 조회
        Server.get('/main/sms/tcpConn/getPortMappingList.do', {
            data: Main.getCommParams(),
            success: function (result) {
                searchItems = [];
                //이전에 선택했던 포트와 비교하여 일치하는 것만 찾음
                $.each(selectedPortList, function (pIdx, pItem) {
                    $.each(result, function (idx, item) {
                        if(pItem.tcpPortNo === item.tcpPortNo) {
                            searchItems.push(item);
                        }
                    })
                });

                Main.createPaging(searchItems.length);

                $.each(searchItems, function (idx, value) {
                    var excelTitle = value.portName +'(' + value.port + ')'; //차트 이미지 excel port 용
                    var chartDiv = '<div id="svrCharts_'+ value.tcpPortNo +'" class="hmChart" data-name="'+ excelTitle +'"></div>';
                    mainDiv.append(chartDiv);
                    Main.portChart(value);
                });
            }
        });
    },

    searchSvr: function () {

        var mainDiv = $("#chartContainer");
        mainDiv.empty();
        $(".hmChart").remove();

        var params = Main.getCommParams();
        params.mngNo = 0;

        if(params.itemKind !== 'GROUP')  params.mngNo = params.grpNo;

        Server.get('/main/sms/tcpConn/getSvrForPortList.do', {
            data: params,
            success: function (result) {

                Main.createPaging(result.length);

                $.each(result, function (idx, value) {
                    var excelTitle = value.devIp +'-' +  value.portName  +'(' + value.port + ')'; //차트 이미지 excel port 용
                    var chartDiv = '<div id="svrCharts_' + value.port + '" class="hmChart" data-name="'+ excelTitle +'"></div>';
                    mainDiv.append(chartDiv);
                    Main.svrChart(value);
                });
            }
        });
    },

    portChart: function (paramData) {

        var tcpPortNo = paramData.tcpPortNo;
        var port = paramData.port;
        var svrSeries = [];
        var svrMngNos = [];
        var chartId = 'svrCharts_'+tcpPortNo;

        HmHighchart.createStockChart(chartId, {
            yAxis: {
                crosshair: true,
                opposite: false,
                showLastLabel: true,
                // max: 100,
                labels: {
                    formatter:  function () {
                        return this.value
                    }
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                //valueSuffix: ' %',
                formatter: HmHighchart.absHtmlTooltipFormatter
            },
            plotOptions : {
                line: {
                    lineWidth: 0.9
                }
            },
            series: []
        }, HmHighchart.TYPE_AREA);

        var chartTitle = paramData.portName + '(' + paramData.port + ')';
        $('#'+chartId).highcharts().setTitle({
            text: chartTitle,
            style: {/*fontSize: '12px',*/ fontWeight: 'bold'}
        });

        //각 포트에 연결된 서버 장비의 수 만큼 series 생성
        Server.get('/main/sms/tcpConn/getTcpPortSvrList.do', {
            data: { tcpPortNo: tcpPortNo },
            success: function (result) {
                var svrResult = result;
                if(svrResult.length > 0){
                    $.each(svrResult, function(idx, value){
                        var seriesInfo = {};

                        seriesInfo.mngNo = value.mngNo;
                        seriesInfo.devName = value.devName;

                        svrMngNos.push(value.mngNo);
                        svrSeries.push(seriesInfo);
                    });
                }//서버 수 조회
                // console.log("svrSeries",svrSeries);

                var chart = $('#svrCharts_'+tcpPortNo).highcharts();
                for(var i = 0; i < svrSeries.length; i++){
                    chart.addSeries({ name: svrSeries[i] }, false);
                }
                var params = {
                    svrMngNos: svrMngNos,
                    port: port
                };

                $.extend(params, Main.getCommParams())
                //포트에 연결된 서버 전체의 성능 조회.
                //모든 서버의 mng_no IN 조건으로 조회
                Server.post('/main/sms/tcpConn/getSvrForPortPerf.do', {
                    data: params,
                    success: function (result) {
                        var perfResult = result;
                        for(var i = 0; i <svrSeries.length; i++){
                            var chartData = [];
                            $.each(result, function(idx, value){
                                // console.log("svrSeries [i].mngNo",svrSeries [i].mngNo);
                                //시리즈 생성 장비 mngNo와 성능차트 MngNos 복수 데이터 N 비교하여 일치 값 시리즈 데이터 생성
                                if( svrSeries [i].mngNo == value.mngNo){
                                    chartData.push([value.dtYmdhms, value.timeWait, value.mngNo ]);
                                }
                            });
                            var seriesName = svrSeries[i].devName + '(' + svrSeries[i].mngNo + ')';
                            chart.series[i].update({ name: seriesName, data: chartData }, false);
                        }
                        //HmHighchart.redraw(chartId);
                        chart.redraw();
                    }
                });
            }
        });

    },

    svrChart: function (data) {
        var chartId = 'svrCharts_' + data.port;
        var series = {series: [
            {name: 'LISTEN', type: 'area', xField: 'dtYmdhms', yField: 'listen'},
            {name: 'SYN_SENT', type: 'area', xField: 'dtYmdhms', yField: 'synSent'},
            {name: 'SYN_RECV', type: 'area', xField: 'dtYmdhms', yField: 'synRecv'},
            {name: 'ESTABLISHED', type: 'area', xField: 'dtYmdhms', yField: 'established'},
            {name: 'FIN_WAIT1', type: 'area', xField: 'dtYmdhms', yField: 'finWait1'},
            {name: 'FIN_WAIT2', type: 'area', xField: 'dtYmdhms', yField: 'finWait2'},
            {name: 'TIME_WAIT', type: 'area', xField: 'dtYmdhms', yField: 'timeWait'},
        ] , chartConfig: { unit: '1000' }};

        var userOptions = {
            chart: {
                marginTop: 30,
                marginBottom: 70
            },
            plotOptions : {
                line: {
                    lineWidth: 0.9
                }
            },
        }


        $.extend(series, userOptions)
        var $chart = new CustomChart(chartId, HmHighchart.TYPE_LINE, series );
        $chart.initialize(); //데이터 없는 경우 포함하여 모든 차트를 그림. 불필요시 주석

        var params = Main.getCommParams();
        params.mngNo = data.mngNo;
        params.port = data.port;

        var chartData = {};
        var xFieldArr = [], yFieldArr = [];
        $.each(series.series, function(si, sv) {
            xFieldArr.push(sv.xField);
            yFieldArr.push(sv.yField);
            chartData[si] = [];
        });

        var title = data.devIp + ' - ' + data.portName + '(' + data.port + ')';
        $('#'+chartId).highcharts().setTitle({
            text: title,
            style: {/*fontSize: '12px',*/ fontWeight: 'bold'}
        });

        Server.get('/main/sms/tcpConn/getPortForPortPerf.do', {
            data: params,
            success: function (result) {

                if(result.length > 0 ) {
                    $.each(result, function (i, v) {
                        //지표가 메모리일 경우 마지막 row 수집 데이터를 요약정보로 표시
                        for (var sidx in xFieldArr) {
                            var _xField = xFieldArr[sidx], _yField = yFieldArr[sidx];
                            chartData[sidx].push([v[_xField], v[_yField]]);
                        }

                    });

                    $.each(series.series, function (si, sv) {
                        HmHighchart.setSeriesData(chartId, si, chartData[si], false);
                    });
                    HmHighchart.redraw(chartId);
                } else {
                    //데이터 없는 경우 y축 선 제거
                    $('#'+chartId).highcharts().yAxis[0].update({gridLineWidth: 0}, false);
                }
            }
        });
    },

    createPaging: function (totalCnt) {
        if (totalCnt > 0) {
            Main.renderPagination("footer", totalCnt, 10, 10, 1);
        } else {
            $(".pagination").remove(); //페이징 제거
            //상단 차트영역 조회 데이터 없음 표기
            var noData = '<div style="position: absolute;left: 50%;top: 50%; transform: translate(-50%,-50%)">표시할 데이터가 없습니다.</div>';
            $("#chartContainer").append(noData);
        }
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
        Main.search();
    },

    getCommParams: function () {
        var params = {};

        $.extend(params,
            Master.getGrpTabParams(),
            HmBoxCondition.getPeriodParams('_svrPerfChart')
        );

        params.pageFirstNo = (parseInt($('#curPage').val()) - 1) * 10;

        //실시간은 24H일 경우와 조건 동일하게 설정. 실시간은 refresh 의미
        if(params.period === '0') {
            var today = new Date();
            var yesterday = new Date(new Date().setDate(today.getDate() - 1));

            params.date1 = $.format.date(yesterday, 'yyyyMMdd');
            params.date2 = $.format.date(today, 'yyyyMMdd');
        }

        return params;
    },

    searchPerf: function () {

        var mainDiv = $("#chartContainer");

        //기존 차트 초기화
        mainDiv.empty();
        $(".hmChart").remove();

        var searchType = HmBoxCondition.val('srchPerfType');

        if(searchType === TcpPerfType.PORT) { //포트

            Main.createPaging(searchItems.length);

            $.each(searchItems, function (idx, value) {
                var chartDiv = '<div id="svrCharts_'+ value.tcpPortNo +'" class="hmChart"></div>';
                mainDiv.append(chartDiv);
                Main.portChart(value);
            });

        } else { //서버

            var params = Main.getCommParams();
            params.mngNo = selectItems;

            Server.get('/main/sms/tcpConn/getSvrForPortList.do', {
                data: params,
                success: function (result) {

                    Main.createPaging(result.length);

                    $.each(result, function (idx, value) {
                        var chartDiv = '<div id="svrCharts_' + value.port + '" class="hmChart"></div>';
                        mainDiv.append(chartDiv);
                        Main.svrChart(value);
                    });
                }
            });
        }
    },

    //차트 이미지 엑셀 export(동적보고서와 같은 java 사용)
    exportExcel: function () {
        var imageList = [];
        var svrNameList = [];
        $(".hmChart").each(function(index, item){
            var svrChart =  $('#'+this.id).highcharts();
            var svrName = $('#'+this.id).data("name");
            imageList.push(Main.makeChartExcel(svrChart));
            svrNameList.push(svrName);

        })

        var params = {
            imageList: imageList,
            svrNameList: svrNameList,
            excelName : 'TCP포트성능'
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