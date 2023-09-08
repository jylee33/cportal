var timer = null;
var corrChart = null;
var axis = [];

var Main = {
    /** variable */
    initVariable: function () {

        this.initCondition();

    },

    initCondition: function () {

        Master.createSearchBar3($("#periodBox"), $("#dateBox"));
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

            case 'btnAdd_grp':
                this.addGrp();
                break;

            case 'btnEdit_grp':
                this.editGrp();
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

        HmWindow.create($('#pwindow'));

        $('#section').css('display', 'block');


        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'CORR_MEASURE_KIND', useFlag: 1},
            success: function (result) {

                $("#sPerfType").jqxDropDownList({
                    source: result,
                    autoDropDownHeight: true,
                    width: "100px",
                    height: "20px",
                    displayMember: 'codeValue1', valueMember: 'codeId',
                    selectedIndex: 0
                });

            }
        });


        Server.post('/main/nms/corrAnalysis/getXyaxisCorrList.do', {
            data: Main.getCommParam(),
            success: function (result) {
                result.forEach(function (value) {
                    axis.push(value.axis);
                });
                Main.createChart(axis);
            }
        });

    },

    /** init data */
    initData: function () {

    },


    createChart: function (categories) {

        corrChart = Highcharts.chart('corrChart', {
            chart: {
                type: 'heatmap',
                width: 1680,
                height: 800,
                marginTop: 70,
                marginBottom: 80,
                marginLeft: 300
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                categories: categories,
                title: null,
                reversed: false
            },
            exporting: {
                enabled: true,
                // Custom definition
                menuItemDefinitions: {
                    hmViewChartData: {
                        onclick: function () {
                            HmHighchart.showChartData(this, $(event.currentTarget).text());
                        },
                        text: '데이터보기'
                    },
                    hmDownloadPNG: {
                        onclick: function () {
                            var filename = 'chart_' + $.format.date(new Date(), 'yyyyMMddHHmmssSSS');
                            HmUtil.exportHighchart(this, filename);
                        },
                        text: '다운로드'
                    }
                },
                buttons: {
                    contextButton: {
                        menuItems: ['hmViewChartData', 'printChart', 'hmDownloadPNG'],
                        verticalAlign: 'bottom',
                        y: -10
                    }
                }
            },
            lang: {
                months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                weekdays: ['일', '월', '화', '수', '목', '금', '토'],
                noData: '조회된 데이터가 없습니다.',
                loading: '조회중입니다.',
                printChart: '인쇄'
            },
            navigation: {
                buttonOptions: {
                    enabled: true
                },
                menuItemStyle: {
                    padding: '0.3em 1em'
                }
            },
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        var ix = point.index + 1,
                            xName = getPointCategoryName(point, 'x'),
                            yName = getPointCategoryName(point, 'y'),
                            val = point.value;
                        return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
                    }
                }
            },
            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },
            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 680
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + 'X : ' + this.point.x + '</b>  <br>  <b>' + 'Y : ' + this.point.y + '</b> <br><b>' + 'VALUE : ' + this.point.value + '</b><br>';
                }
            },
            series:
                [{
                    name: '상관분석',
                    borderWidth: 1,
                    data: [],
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }],
        });
    },


    search: function () {


        Server.post('/main/nms/corrAnalysis/getXyaxisCorrList.do', {
            data: Main.getCommParam(),
            success: function (result) {

                result.forEach(function (value) {
                    axis.push(value.axis);
                });

                Main.createChart(axis);

                Server.post('/main/nms/corrAnalysis/getXyAxisCoordinateList.do', {
                    data: Main.getCommParam(),
                    success: function (result) {
                        var chartDatas = [];

                        result.forEach(function (value) {
                            chartDatas.push([value.x, value.y, value.value]);
                        });

                        corrChart.series[0].setData(chartDatas, false);
                        corrChart.redraw();
                    }
                });


            }
        });


    },


    addGrp: function () {

        var params = {jobType: 'IF'};
        $.post(ctxPath + '/main/popup/nms/pCorrAdd.do',
            params,
            function (result) {
                HmWindow.open($('#pwindow'), '설정', result, 850, 430);
            }
        );
    },


    editGrp: function () {
        var params = {jobType: 'IF'};
        $.post(ctxPath + '/main/popup/nms/pCorrAdd.do',
            params,
            function (result) {
                HmWindow.open($('#pwindow'), '회선등록', result, 850, 500);
            }
        );
    },

    getCommParam: function () {
        return {
            unit: $("input[name='cbPeriod']:checked").val().replace(/[0-9]/g, ""),
            date: HmDate.getDateStr($("#date1")),
            perfType: $("#sPerfType").val()
        }
    }

};


function getPointCategoryName(point, dimension) {
    var series = point.series,
        isY = dimension === 'y',
        axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
}


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});