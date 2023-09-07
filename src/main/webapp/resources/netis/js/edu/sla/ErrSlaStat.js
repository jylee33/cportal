var $cntGrid, editCnts = [], editCosts = [];
var $slaDistrChart, $wireServiceChart, $areaDistrChart, $groupChart;

var _collegeList = [];

var slaDistrYn = false;
var wireServiceYn = false;
var areaDistrYn = false;

var chartType = "COST";

var Main = {

    /** variable */
    initVariable: function () {
        $cntGrid = $('#cntGrid'),
            $slaDistrChart = $('#slaDistrChart'),
            $wireServiceChart = $('#wireServiceChart'), $groupChart = $("#groupChart");
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
            case 'btnSearch':
                this.searchSLA();
                break;
            case "btnExcel":
                this.exportExcel();
                break;

            case "btnChange":
                this.changeChart();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        $('#mainSplitter').jqxSplitter({
            width: '99.8%',
            height: '99.8%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: 254, collapsible: true}, {size: '100%'}]
        });

        $('#contentSplitter1').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'horizontal',
            theme: jqxTheme,
            panels: [{size: '47%', collapsible: false}, {size: '53%'}]
        });

        $('#chartSplitter1').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: '67%', collapsible: false}, {size: '33%'}]
        });


        // $('#chartSplitter2').jqxSplitter({
        //     width: '100%',
        //     height: '100%',
        //     orientation: 'vertical',
        //     theme: jqxTheme,
        //     panels: [{size: '50%', collapsible: false}, {size: '50%'}]
        // });


        $('#chartSplitter3').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: '50%', collapsible: false}, {size: '50%'}]
        });

        Master.createGrpTab(Main.selectTree);

        // 기간 년/월 초기값 설정
        var s_year = [], s_month = [];
        var curYear = new Date().getFullYear(), curMonth = new Date().getMonth();
        for (var i = -5; i <= 0; i++) {
            var yyyy = curYear + i;
            s_year.push({label: yyyy + '년', value: yyyy});
        }
        for (var i = 1; i <= 12; i++) {
            var mm = i < 10 ? '0' + i : i;
            s_month.push({label: mm + '월', value: mm});
        }

        $('#sYear').jqxDropDownList({
            width: 80, height: 21, theme: jqxTheme,
            source: s_year, selectedIndex: s_year.length - 1, autoDropDownHeight: true
        });

        $('#sMonth').jqxDropDownList({
            width: 60, height: 21, theme: jqxTheme,
            source: s_month, selectedIndex: curMonth
        }).on('open', function (event) {
            $(this).jqxDropDownList('ensureVisible', $(this).jqxDropDownList('getSelectedIndex'));
        });

        var chartSettings = HmChart2.getColumnOptions();

        $.extend(chartSettings, {
            categoryAxis: {
                dataField: 'name',
                type: 'basic'
            },
            seriesGroups: [
                {
                    type: 'pie',
                    showLegend: false,
                    showLabels: true,
                    showBorderLine: false,
                    toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                        var dataItem = $('#slaDistrChart').jqxChart('source')[itemIndex];
                        var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>';
                        s += '</div>';
                        return s;
                    },
                    series: [
                        {
                            dataField: 'cnt', displayText: 'name', labelRadius: 80, initialAngle: 15, radius: 100,
                            legendFormatFunction: function (value) {
                                return value;
                            }
                        }
                    ]
                }
            ]
        });

        $slaDistrChart.jqxChart(chartSettings);
        $wireServiceChart.jqxChart(chartSettings);
        // $areaDistrChart.jqxChart(chartSettings);
        $groupChart.jqxChart(chartSettings);


        HmGrid.create($cntGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editCnts.indexOf(rowid) == -1)
                            editCnts.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete: function (records) {

                        editCnts.length = 0;
                        Main.updateChart(records.resultData, 'CNT');

                    }
                }
            ),
            editable: false,
            showstatusbar: true,
            statusbarheight: 25,
            showaggregates: true,
            columns:
                [
                    {
                        text: '기준월', datafield: 'yyyymm', width: 130, editable: false, hidden: false
                    },
                    // {
                    //     text: '교육청', datafield: 'college', width: 130, editable: false, hidden: false
                    // },
                    // {
                    //     text: '지원청', datafield: 'collegeNia', width: 130, editable: false, hidden: false
                    // },
                    {
                        text: '이용기관', datafield: 'grpName', width: 130, editable: false, hidden: false
                    },
                    {
                        text: '이용기관 분류', datafield: 'lcd', width: 130, editable: false, hidden: true
                    },
                    // {text: '장비명', datafield: 'devName', minwidth: 130, editable: false},
                    {text: '하위 장비', datafield: 'mngNo', width: 80, editable: false, hidden: true, cellsalign: 'right'},
                    {text: '통신사', datafield: 'wireServiceName', width: 60, cellsalign: 'center', editable: false},

                    {text: '기관코드', datafield: 'agncCd', width: 130, editable: false},
                    {text: '배정번호', datafield: 'asgnNo', width: 130, editable: false},

                    {
                        text: '월 이용료',
                        datafield: 'monthCost',
                        width: 100,
                        cellsalign: 'right',
                        cellsformat: 'n',
                        editable: false,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var str = Main.makeComma(parseInt(value));
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                        }
                    },
                    {
                        text: '전체 건수',
                        datafield: 'totalCnt',
                        width: 100,
                        cellsalign: 'right',
                        cellsformat: 'n',
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '보상 합계',
                        datafield: 'calcSlaCharge',
                        width: 100,
                        cellsalign: 'right',
                        cellsformat: 'n',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer,
                        makeComma: function (num) {

                            var total = num;
                            var len, point, str;

                            total = total + "";
                            point = total.length % 3;
                            len = total.length;

                            str = total.substring(0, point);
                            while (point < len) {
                                if (str != "") str += ",";
                                str += total.substring(point, point + 3);
                                point += 3;
                            }
                            return str;
                        },
                    },
                    {
                        text: '통보 건수',
                        columngroup: 'noti',
                        datafield: 'errActionCnt',
                        width: 100,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '지연통보 건수',
                        columngroup: 'noti',
                        datafield: 'errActionExceedCnt',
                        width: 100,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '미통보 건수',
                        columngroup: 'noti',
                        datafield: 'errActionNotNotiCnt',
                        width: 80,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    /*    { text : '산출시간', columngroup: 'noti', datafield: 'errActionExceedCnt', width: 80, cellsrenderer: Main.hourRenderer, editable: false,
                            aggregates: ['sum'], aggregatesrenderer: Main.agg_sumrenderer},*/
                    {
                        text: '지연건수',
                        columngroup: 'repair',
                        datafield: 'errRepairExceedCnt',
                        width: 60,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    /*       { text : '보상시간', columngroup: 'repair', datafield: 'errRepairExceedHour', width: 80, cellsrenderer: Main.hourRenderer, editable: false,
                               aggregates: ['sum'], aggregatesrenderer: Main.agg_sumrenderer},*/
                    {
                        text: '보상금액',
                        columngroup: 'repair',
                        datafield: 'calcErrRepairCharge',
                        width: 100,
                        cellsrenderer: Main.chargeRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '산출시간',
                        columngroup: 'accrue',
                        datafield: 'errAccrueHour',
                        width: 80,
                        cellsrenderer: Main.hourRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '누적건수',
                        columngroup: 'accrue',
                        datafield: 'errAccrueCnt',
                        width: 80,
                        cellsrenderer: Main.hourRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer,
                        hidden: true
                    },
                    {
                        text: '보상금액',
                        columngroup: 'accrue',
                        datafield: 'calcErrAccrueCharge',
                        width: 100,
                        cellsrenderer: Main.chargeRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '건수',
                        columngroup: 'overlap',
                        datafield: 'errCnt',
                        width: 60,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },
                    {
                        text: '보상금액',
                        columngroup: 'overlap',
                        datafield: 'calcErrOverlapCharge',
                        width: 100,
                        cellsrenderer: Main.chargeRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
                    },

                    {
                        text: '2개월연속',
                        columngroup: 'continue',
                        datafield: 'calcLastMonContErrCnt',
                        width: 80,
                        cellsrenderer: Main.contErrRenderer,
                        editable: false
                    },

                    {
                        text: '3개월연속',
                        columngroup: 'continue',
                        datafield: 'calcLast2MonContErrCnt',
                        width: 80,
                        cellsrenderer: Main.contErrRenderer,
                        editable: false
                    },
                    // { text : '보상금액', columngroup: 'continue', datafield: 'calcContErrCharge', width: 100, editable: false,
                    //     cellsrenderer: function(row, datafield, value) {
                    //         var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                    //         cell += value == 0 ? "없음" : HmUtil.commaNum(value);
                    //         cell += "</div>";
                    //         return cell;
                    //     }
                    // },
                    {
                        text: '건수',
                        columngroup: 'continue',
                        datafield: 'errContCnt',
                        width: 80,
                        cellsrenderer: Main.cntRenderer,
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer,
                        hidden: true
                    },

                    {
                        text: '익월요금',
                        columngroup: 'continue',
                        datafield: 'calcContErrNextCharge',
                        width: 100,
                        editable: false,
                        cellsrenderer: function (row, datafield, value) {

                            var str = "";

                            if (value == 2) {
                                str = "20%할인";
                            } else if (value == 1) {
                                str = "10%할인";
                            } else if (value == 0) {
                                str = "할인없음";
                            }

                            var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                            cell += str;
                            cell += "</div>";
                            return cell;

                        }
                    }
                ],
            columngroups: [
                {text: '장애통보', align: 'center', name: 'noti'},
                {text: '장애복구', align: 'center', name: 'repair'},
                {text: '누적장애', align: 'center', name: 'accrue'},
                {text: '중복장애', align: 'center', name: 'overlap'},
                {text: '장애연속', align: 'center', name: 'continue'}
            ]
        }, CtxMenu.COMM);


        $('#distrPopover').jqxPopover({
            offset: {left: -100, top: 0},
            arrowOffsetValue: 50,
            title: "SLA 분포",
            showCloseButton: false,
            selector: $('#btnCList_distr')
        });

        $('#wirePopover').jqxPopover({
            offset: {left: -100, top: 0},
            arrowOffsetValue: 50,
            title: "통신사별 SLA",
            showCloseButton: false,
            selector: $('#btnCList_wire')
        });

        // $('#areaPopover').jqxPopover({
        //     offset: {left: -100, top: 0},
        //     arrowOffsetValue: 50,
        //     title: "교육청별 분포",
        //     showCloseButton: false,
        //     selector: $('#btnCList_area')
        // });

        $('#groupPopover').jqxPopover({
            offset: {left: -100, top: 0},
            arrowOffsetValue: 50,
            title: "기관별 SLA 분포",
            showCloseButton: false,
            selector: $('#btnCList_group')
        });


    }
    ,

    /** init data */
    initData: function () {

        Server.get('/main/sla/slaStat/getSlaCollegeList.do', {
            success: function (result) {
                _collegeList = result;
            }
        });

    },


    makeComma: function (num) {

        var total = num;
        var len, point, str;

        total = total + "";
        point = total.length % 3;
        len = total.length;

        str = total.substring(0, point);
        while (point < len) {
            if (str != "") str += ",";
            str += total.substring(point, point + 3);
            point += 3;
        }
        return str;
    },


    agg_sumrenderer: function (aggregates, column) {

        var value = aggregates['sum'];
        var suffix = '';

        if ($.inArray(column.datafield, ['errActionExceedCnt', 'errRepairExceedCnt', 'errCnt', 'errActionCnt', 'errActionNotNotiCnt', 'totalCnt']) != -1) {
            suffix = '건';
        } else if ($.inArray(column.datafield, ['errActionExceedHour', 'errRepairExceedHour', 'errAccrueHour']) != -1) {
            suffix = '시간';
        } else if ($.inArray(column.datafield, ['calcSlaCharge', 'calcErrRepairCharge', 'calcErrAccrueCharge', 'calcErrOverlapCharge']) != -1) {
            suffix = '원';
        }

        if (value === undefined) value = 0;

        if (isNaN(value)) {
            return '<div style="float: right; margin: 4px; overflow: hidden;">' + (value || 0) + suffix + '</div>';
        } else {
            return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.commaNum(value || 0) + suffix + '</div>';
        }

    },

    cntRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value == 0 ? "-" : value + " 건";
        cell += "</div>";
        return cell;
    }
    ,

    hourRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value == 0 ? "-" : value + " 시간";
        cell += "</div>";
        return cell;
    }
    ,

    chargeRenderer: function (row, datafield, value) {
        if (value == 0) {
            return "<div style='margin-top: 4px;' class='jqx-center-align'> - </div>";
        }
        else {
            return "<div style='margin-top: 4px; margin-right: 4px' class='jqx-right-align'>" + HmUtil.commaNum(value) + "</div>";
        }
    }
    ,

    contErrRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value >= 2 ? "O" : "X";
        cell += "</div>";
        return cell;
    }
    ,

    getCommParams: function () {

        var params = Master.getGrpTabParams();
        var yyyy = $('#sYear').val(), mm = $('#sMonth').val();
        if (mm == '01') params.lastMonth = null;
        else params.lastMonth = parseInt(mm) - 1 < 10 ? '0' + (parseInt(mm) - 1) : parseInt(mm) - 1;

        params.yyyy = yyyy;
        params.thisMonth = mm;
        params.yyyymm = yyyy + mm;
        params.date1 = yyyy + mm;
        // params.date2 = $.format.date($('#date2').jqxDateTimeInput('getDate'), 'yyyyMM');

        params.fromDay = '01';
        params.toDay = '31';
        return params;

    }
    ,

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.searchSLA();
    },


    aggrCntRenderer: function (aggregates) {
        var total = 0;
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        $.each(aggregates, function (key, value) {
            total += parseInt(value);
        });
        cell += total > 0 ? HmUtil.commaNum(total) + '건' : '-' + "</div>";
        return cell;
    },


    aggrChgRenderer: function (aggregates) {
        var total = 0;
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        $.each(aggregates, function (key, value) {
            total += parseInt(value);
        });
        cell += total > 0 ? HmUtil.commaNum(total) + '원' : '-' + "</div>";
        return cell;
    },

    /** 조회 */
    searchSLA: function () {
        HmGrid.updateBoundData($cntGrid, ctxPath + '/edu/sla/errMgmtSla/getErrMgmtSlaList_report.do');
    },

    updateChart: function (data, type) {

        if (data != null && data.length > 0) {
            Main.updateSla(type, true);
            Main.updateWire(type, true);
            // Main.updateArea(type, true);
            Main.updateAgnc(type, true);
        } else {
            Main.updateSla(type, false);
            Main.updateWire(type, false);
            // Main.updateArea(type, false);
            Main.updateAgnc(type, false);
        }

    },


    updateAgnc: function (type, flag) {

        var tmp = [];
        var title = '';

        switch (type) {

            case 'CNT':

                title = '기관별 SLA 건';

                var lowCnt = 0;
                var middleCnt = 0;
                var highCnt = 0;
                var specCnt = 0;
                var eduCnt = 0;
                var etcCnt = 0;
                var publicCnt = 0;

                var wireData = $cntGrid.jqxGrid('getboundrows');

                var aggrTotData = 0;


                if (flag) {
                    aggrTotData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errCnt', ['sum']).sum;
                }

                $.each(wireData, function (idx, value) {
                    switch (value.lcd) {
                        case '0010':
                            lowCnt += value.errCnt;
                            break;
                        case '0020':
                            middleCnt += value.errCnt;
                            break;
                        case '0030':
                            highCnt += value.errCnt;
                            break;
                        case '0040':
                            specCnt += value.errCnt;
                            break;
                        case '0045':
                            eduCnt += value.errCnt;
                            break;
                        case '0050':
                            etcCnt += value.errCnt;
                            break;
                        case '0060':
                            publicCnt += value.errCnt;
                            break;
                    }
                });

                if (lowCnt > 0) tmp.push({name: '초등학교', cnt: lowCnt, color: "#0000FF"});

                if (highCnt > 0) tmp.push({name: '고등학교', cnt: highCnt, color: "#FF0000"});

                if (middleCnt > 0) tmp.push({name: '중학교', cnt: middleCnt, color: "#00FF00"});

                if (specCnt > 0) tmp.push({name: '특수학교', cnt: specCnt, color: "#0FFFF0"});

                if (eduCnt > 0) tmp.push({name: '교육청', cnt: eduCnt, color: "#FFF000"});

                if (etcCnt > 0) tmp.push({name: '기타', cnt: etcCnt, color: "#FFFFFF"});

                if (publicCnt > 0) tmp.push({name: '공공기관', cnt: publicCnt, color: "#FF00FF"});


                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#groupChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.cnt) + '건';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'cnt',
                                displayText: 'name',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    var per = 0;
                                    if (aggrTotData > 0) per = (value / aggrTotData) * 100;
                                    return HmUtil.commaNum(value) + '건' + '(' + per.toFixed(2) + '%)';
                                },
                                legendFormatFunction: function (value) {
                                    return value;
                                }
                            }
                        ]
                    }
                ];

                $('#groupChart').jqxChart({title: '기관별 SLA (건)'});
                $('#groupChart').jqxChart({showBorderLine: 'false'});
                $('#groupChart').jqxChart('seriesGroups', _seriesGroups);
                $('#groupChart').jqxChart('source', tmp.filter(function (d) {
                    return d.cnt > 0;
                }));

                $('#groupChart').jqxChart('update');
                break;


            case 'COST':

                title = '기관별 SLA 금액';

                var lowAmt = 0;
                var middleAmt = 0;
                var highAmt = 0;
                var specAmt = 0;
                var eduAmt = 0;
                var etcAmt = 0;
                var publicAmt = 0;

                var wireData = $cntGrid.jqxGrid('getboundrows');

                var aggrAmtData = 0;

                if (flag) {
                    aggrAmtData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcSlaCharge', ['sum']).sum;
                }

                $.each(wireData, function (idx, value) {
                    switch (value.lcd) {
                        case '0010':
                            lowAmt += value.calcSlaCharge;
                            break;
                        case '0020':
                            middleAmt += value.calcSlaCharge;
                            break;
                        case '0030':
                            highAmt += value.calcSlaCharge;
                            break;
                        case '0040':
                            specAmt += value.calcSlaCharge;
                            break;
                        case '0045':
                            eduAmt += value.calcSlaCharge;
                            break;
                        case '0050':
                            etcAmt += value.calcSlaCharge;
                            break;
                        case '0060':
                            publicAmt += value.calcSlaCharge;
                            break;
                    }
                });

                if (lowAmt > 0) tmp.push({name: '초등학교', color: "#0000FF", amt: lowAmt});

                if (highAmt > 0) tmp.push({name: '고등학교', color: "#FF0000", amt: highAmt});

                if (middleAmt > 0) tmp.push({name: '중학교', color: "#00FF00", amt: middleAmt});

                if (specAmt > 0) tmp.push({name: '특수학교', color: "#0FFFF0", amt: specAmt});

                if (eduAmt > 0) tmp.push({name: '교육청', color: "#FFF000", amt: eduAmt});

                if (etcAmt > 0) tmp.push({name: '기타', color: "#FFFFFF", amt: etcAmt});

                if (publicAmt > 0) tmp.push({name: '공공기관', color: "#FF00FF", amt: publicAmt});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#groupChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + '(' + dataItem.amt + ' 원)';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'amt',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    return HmUtil.commaNum(value) + ' 원';
                                },
                                legendFormatFunction: function (value) {
                                    return value.name;
                                }
                            },
                        ]
                    }
                ];

                $('#groupChart').jqxChart({title: '기관별 SLA (금액)'});
                $('#groupChart').jqxChart({showBorderLine: 'false'});
                $('#groupChart').jqxChart('seriesGroups', _seriesGroups);
                $('#groupChart').jqxChart('source', tmp.filter(function (d) {
                    return d.amt > 0;
                }));

                $('#groupChart').jqxChart('update');
                break;
        }

        Main.slaToggle(tmp, title, $('#groupToggle'));
    },


    updateSla: function (type, flag) {

        var tmp = [];

        var aggrTotData = 0;

        var aggrErrData = 0;
        var aggrRepairData = 0;
        var aggrAccrueData = 0;
        var aggrOverlapData = 0;
        var aggrErrContData = 0;

        var aggrTotAmt = 0;

        var aggrRepairAmt = 0;
        var aggrAccrueAmt = 0;
        var aggrOverlapAmt = 0;


        var title = '';

        switch (type) {

            case 'CNT':
                title = 'SLA 건';

                if (flag) {
                    aggrTotData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errCnt', ['sum']).sum;
                    aggrErrData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errActionCnt', ['sum']).sum;
                    aggrRepairData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errRepairExceedCnt', ['sum']).sum;
                    aggrAccrueData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errAccrueCnt', ['sum']).sum;
                    aggrOverlapData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errCnt', ['sum']).sum;
                    aggrErrContData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errContCnt', ['sum']).sum;
                }

                if (aggrErrData > 0) tmp.push({name: '장애통보', cnt: aggrErrData, color: "#FF0000"});

                if (aggrRepairData > 0) tmp.push({
                    name: '장애복구',
                    cnt: aggrRepairData,
                    color: "#00FF00"
                });

                if (aggrAccrueData > 0) tmp.push({
                    name: '누적장애',
                    cnt: aggrAccrueData,
                    color: "#0000FF"
                });

                if (aggrOverlapData > 0) tmp.push({
                    name: '중복장애',
                    cnt: aggrOverlapData,
                    color: "#00FFFF"
                });

                if (aggrErrContData > 0) tmp.push({name: '연속장애', cnt: aggrErrContData, color: "#FF00FF"});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#slaDistrChart').jqxChart('source')[itemIndex];
                            var s = '<br style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.cnt) + '건';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'cnt',
                                displayText: 'name',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    var per = 0;
                                    if (aggrTotData > 0) per = (value / aggrTotData) * 100;
                                    return HmUtil.commaNum(value) + '건' + '(' + per.toFixed(2) + '%)';
                                },
                                legendFormatFunction: function (value) {
                                    return value;
                                }
                            }
                        ]
                    }

                ];


                $('#slaDistrChart').jqxChart({title: 'SLA 분포 (건)'});
                $('#slaDistrChart').jqxChart({showBorderLine: 'false'});
                $('#slaDistrChart').jqxChart('seriesGroups', _seriesGroups);

                $('#slaDistrChart').jqxChart('source', tmp.filter(function (d) {
                    return d.cnt > 0;
                }));

                $('#slaDistrChart').jqxChart('update');
                break;

            case 'COST':
                title = 'SLA 금액';

                if (flag) {

                    aggrTotAmt = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcSlaCharge', ['sum']).sum;

                    aggrRepairAmt = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcErrRepairCharge', ['sum']).sum;
                    aggrAccrueAmt = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcErrAccrueCharge', ['sum']).sum;
                    aggrOverlapAmt = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcErrOverlapCharge', ['sum']).sum;
                }


                if (aggrRepairAmt > 0) tmp.push({
                    name: '장애복구',
                    color: "#00FF00",
                    amt: aggrRepairAmt
                });

                if (aggrAccrueAmt > 0) tmp.push({
                    name: '누적장애',
                    color: "#0000FF",
                    amt: aggrAccrueAmt
                });

                if (aggrOverlapAmt > 0) tmp.push({
                    name: '중복장애',
                    color: "#00FFFF",
                    amt: aggrOverlapAmt
                });

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#slaDistrChart').jqxChart('source')[itemIndex];
                            var s = '<br style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.amt) + ' 원';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'amt',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    return HmUtil.commaNum(value) + ' 원';
                                },
                                legendFormatFunction: function (value) {
                                    return value.name;
                                }
                            }
                        ]
                    }
                ];


                $('#slaDistrChart').jqxChart({title: 'SLA 분포 (금액)'});
                $('#slaDistrChart').jqxChart({showBorderLine: 'false'});
                $('#slaDistrChart').jqxChart('seriesGroups', _seriesGroups);

                $('#slaDistrChart').jqxChart('source', tmp.filter(function (d) {
                    return d.amt > 0;
                }));
                $('#slaDistrChart').jqxChart('update');
                break;
        }
        Main.slaToggle(tmp, title, $('#slaDistrToggle'));

    },


    updateWire: function (type, flag) {

        var tmp = [];
        var title = '';

        switch (type) {

            case 'CNT':
                title = 'SLA 건';

                var ktCnt = 0;
                var lgCnt = 0;
                var skCnt = 0;

                var ktAmt = 0;
                var lgAmt = 0;
                var skAmt = 0;

                var aggrTotData = 0;
                var aggrTotAmtData = 0;

                if (flag) {

                    aggrTotData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errCnt', ['sum']).sum;

                    var wireData = $cntGrid.jqxGrid('getboundrows');

                    $.each(wireData, function (idx, value) {
                        switch (value.wireServiceName) {
                            case 'KT':
                                ktCnt += value.errCnt;
                                break;
                            case 'LG':
                                lgCnt += value.errCnt;
                                break;
                            case 'SK':
                                skCnt += value.errCnt;
                                break;
                        }
                    });

                }

                if (ktCnt > 0) tmp.push({name: 'KT', cnt: ktCnt, color: "#0000FF"});

                if (lgCnt > 0) tmp.push({name: 'LG', cnt: lgCnt, color: "#FF0000"});

                if (skCnt > 0) tmp.push({name: 'SK', cnt: skCnt, color: "#00FF00"});


                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#wireServiceChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.cnt) + '건';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'cnt',
                                displayText: 'name',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    var per = 0;
                                    if (aggrTotData > 0) per = (value / aggrTotData) * 100;
                                    return HmUtil.commaNum(value) + '건' + '(' + per.toFixed(2) + '%)';
                                },
                                legendFormatFunction: function (value) {
                                    return value;
                                }
                            },
                        ]
                    }
                ];

                $('#wireServiceChart').jqxChart({title: '통신사별 SLA (건)'});
                $('#wireServiceChart').jqxChart({showBorderLine: 'false'});
                $('#wireServiceChart').jqxChart('seriesGroups', _seriesGroups);
                $('#wireServiceChart').jqxChart('source', tmp);
                $('#wireServiceChart').jqxChart('update');
                break;

            case 'COST':
                title = 'SLA 금액';

                var ktAmt = 0;
                var lgAmt = 0;
                var skAmt = 0;

                var aggrTotAmtData = 0;

                if (flag) {

                    aggrTotAmtData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcSlaCharge', ['sum']).sum;

                    var wireData = $cntGrid.jqxGrid('getboundrows');

                    $.each(wireData, function (idx, value) {
                        switch (value.wireServiceName) {
                            case 'KT':
                                ktAmt += value.calcSlaCharge;
                                break;
                            case 'LG':
                                lgAmt += value.calcSlaCharge;
                                break;
                            case 'SK':
                                skAmt += value.calcSlaCharge;
                                break;
                        }
                    });

                }

                if (ktAmt > 0) tmp.push({name: 'KT', color: "#0000FF", amt: ktAmt});

                if (lgAmt > 0) tmp.push({name: 'LG', color: "#FF0000", amt: lgAmt});

                if (skAmt > 0) tmp.push({name: 'SK', color: "#00FF00", amt: skAmt});


                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: true,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#wireServiceChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + '(' + dataItem.amt + ' 원)';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'amt',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    return HmUtil.commaNum(value) + ' 원';
                                },
                                legendFormatFunction: function (value) {
                                    return value.name;
                                }
                            },
                        ]
                    }
                ];

                $('#wireServiceChart').jqxChart({title: '통신사별 SLA (금액)'});
                $('#wireServiceChart').jqxChart({showBorderLine: 'false'});
                $('#wireServiceChart').jqxChart('seriesGroups', _seriesGroups);
                $('#wireServiceChart').jqxChart('source', tmp);
                $('#wireServiceChart').jqxChart('update');
                break;
        }

        Main.slaToggle(tmp, title, $('#wireServiceToggle'));

    },

    updateArea: function (type, flag) {

        var tmp = [];
        var title = '';
        var aggrTotData = 0;

        switch (type) {

            case 'CNT':
                title = 'SLA 건';

                var wireData = $cntGrid.jqxGrid('getboundrows');

                if (flag) {
                    aggrTotData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'errCnt', ['sum']).sum;
                }

                var res = [];


                $.each(_collegeList, function (i, v) {
                    try {
                        res.push(v.college || 'NONE');
                    } catch (e) {
                        console.log(v);
                    }
                });


                var label = res.filter(function (item, i, a) {
                    return i = res.indexOf(item) === i;
                });

                $.each(label, function (i, v) {

                    var college = v;
                    var cnt = 0;

                    wireData.filter(function (element) {
                        if (element.collegeNia == v) {
                            cnt += element.errCnt;
                        }
                    });
                    if (cnt > 0) tmp.push({name: college, cnt: cnt, color: "#0000FF"});
                });

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {

                            var dataItem = $('#areaDistrChart').jqxChart('source')[itemIndex];

                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.cnt) + '건';
                            s += '</div>';
                            return s;

                        },
                        series: [
                            {
                                dataField: 'cnt',
                                displayText: 'name',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    var per = 0;
                                    if (aggrTotData > 0) per = (value / aggrTotData) * 100;
                                    return HmUtil.commaNum(value) + '건' + '(' + per.toFixed(2) + '%)';
                                },
                                legendFormatFunction: function (value) {
                                    return value;
                                }
                            }
                        ]
                    }
                ];

                var treeItem = null;
                if (HmTreeGrid.getSelectedItem($("#dGrpTreeGrid")) != null) {
                    treeItem = HmTreeGrid.getSelectedItem($("#dGrpTreeGrid"));
                    if (treeItem.grpNo == '1') {
                        $('#areaDistrChart').jqxChart({title: '교육청별 (건)'});
                    } else {
                        $('#areaDistrChart').jqxChart({title: '지원청별 (건)'});
                    }
                } else {
                    $('#areaDistrChart').jqxChart({title: '교육청별 (건)'});
                }

                $('#areaDistrChart').jqxChart({showBorderLine: 'false'});
                $('#areaDistrChart').jqxChart('seriesGroups', _seriesGroups);
                $('#areaDistrChart').jqxChart('source', tmp.filter(function (d) {
                    return d.cnt > 0;
                }));
                $('#areaDistrChart').jqxChart('update');
                break;


            case 'COST':

                title = 'SLA 금액';
                var aggrTotAmtData = 0;

                var wireData = $cntGrid.jqxGrid('getboundrows');

                if (flag) {
                    aggrTotAmtData = $cntGrid.jqxGrid('getcolumnaggregateddata', 'calcSlaCharge', ['sum']).sum;
                }

                var res = [];

                $.each(_collegeList, function (i, v) {
                    try {
                        res.push(v.college || 'NONE');
                    } catch (e) {
                        console.log(v);
                    }
                });


                var label = res.filter(function (item, i, a) {
                    return i = res.indexOf(item) === i;
                });

                $.each(label, function (i, v) {

                    var college = v;
                    var amt = 0;

                    wireData.filter(function (element) {

                        if (element.collegeNia == v) {
                            amt += element.calcSlaCharge;
                        }
                    });
                    if (amt > 0) tmp.push({name: college, color: "#0000FF", amt: amt});
                });

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#areaDistrChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + '(' + HmUtil.commaNum(dataItem.amt) + ' 원)';
                            s += '</div>';
                            return s;
                        },
                        series: [
                            {
                                dataField: 'amt',
                                labelRadius: 130,
                                initialAngle: 15,
                                radius: 100,
                                formatFunction: function (value) {
                                    if (isNaN(value)) value = 0;
                                    return HmUtil.commaNum(value) + ' 원';
                                },
                                legendFormatFunction: function (value) {
                                    return value.name;
                                }
                            },
                        ]
                    }
                ];


                var treeItem = null;
                if (HmTreeGrid.getSelectedItem($("#dGrpTreeGrid")) != null) {
                    treeItem = HmTreeGrid.getSelectedItem($("#dGrpTreeGrid"));
                    if (treeItem.grpNo == '1') {
                        $('#areaDistrChart').jqxChart({title: '교육청별 (금액)'});
                    } else {
                        $('#areaDistrChart').jqxChart({title: '지원청별 (금액)'});
                    }
                } else {
                    $('#areaDistrChart').jqxChart({title: '교육청별 (금액)'});
                }

                $('#areaDistrChart').jqxChart({showBorderLine: 'false'});
                $('#areaDistrChart').jqxChart('seriesGroups', _seriesGroups);
                $('#areaDistrChart').jqxChart('source', tmp.filter(function (d) {
                    return d.amt > 0;
                }));
                $('#areaDistrChart').jqxChart('update');

                break;


        }
        Main.slaToggle(tmp, title, $('#areaToggle'));
    },


    slaToggle: function (tmp, title, toggleBox) {

        var text = '<table border="1" cellspacing="0" style="width: 280px;"><tr style="text-align: center" bgcolor="darkgray"><td width="50%">구분</td><td width="20%">' + title + '</td>' + '</tr>';
        var idx = 0;
        var total = 0;
        var amt = 0;

        $.each(tmp, function (key, data) {

            total += data.cnt;
            amt += data.amt;
            idx++;
            if (total > 0) {
                text += '<tr><td style="text-align: center">' + data.name + '</td><td style="text-align: right">' + HmUtil.commaNum(data.cnt) + '</td></tr>';
            } else {
                text += '<tr><td style="text-align: center">' + data.name + '</td><td style="text-align: right">' + HmUtil.commaNum(data.amt) + '</td></tr>';
            }
        });

        if (total > 0) {
            text += '<tr><td style="text-align: center">계</td><td style="text-align: right">' + HmUtil.commaNum(total) + '</td></tr>';
        } else {
            text += '<tr><td style="text-align: center">계</td><td style="text-align: right">' + HmUtil.commaNum(amt) + '</td></tr>';
        }
        text += '</table>';
        toggleBox[0].innerHTML = text;
    },


    changeChart: function () {
        var data = $cntGrid.jqxGrid('getboundrows');
        switch (chartType) {
            case 'CNT':
                Main.updateChart(data, 'CNT');
                chartType = 'COST';
                break;
            case 'COST':
                Main.updateChart(data, 'COST');
                chartType = 'CNT';
                break;
            default:
                break;
        }

    },


    /** export Excel */
    exportExcel: function () {

        var params = {
            tab: $('#contentTab').val()
        };

        $.extend(params, Main.getCommParams());

        params.slaImg = HmUtil.saveChart($("#slaDistrChart"));
        params.wireImg = HmUtil.saveChart($("#wireServiceChart"));
        params.areaImg = HmUtil.saveChart($("#areaDistrChart"));
        params.groupImg = HmUtil.saveChart($("#groupChart"));

        // HmUtil.exportExcel(ctxPath + '/main/sla/slaStat/export.do', params);

        HmUtil.exportGrid_Sla($cntGrid, "장애관리 SLA 보고서", false, params);

    }
};


$(function () {
    Main.initVariable();
    Main.observe();
    // Main.initData();
    Main.initDesign();
});