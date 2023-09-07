var $slaGrid;
var editSlaIds = [];
var _collegeList = [];
var chartType = "COST";

var Main = {
    /** variable */
    initVariable: function () {
        $slaGrid = $('#slaGrid');
        $slaDistrChart = $('#slaDistrChart'), $wireServiceChart = $('#wireServiceChart'), $areaDistrChart = $('#areaDistrChart'), $groupChart = $("#groupChart");
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
            case 'btnChange':
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


        $('#dGrpTreeGrid').on('bindingComplete', function () {
            try {
                $('#dGrpTreeGrid').jqxTreeGrid('setCellValue', 1, 'grpName', '인터넷서비스');
            } catch (e) {
            }
        });

        Master.createGrpTab2(Main.searchSLA);

        // $('#date1').jqxDateTimeInput({
        //     width: 120,
        //     height: 21,
        //     theme: jqxTheme,
        //     formatString: 'yyyy년 MM월',
        //     showCalendarButton: false
        // });
        //
        // $('#date1').val(new Date());

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


        var s = [
            {label: '전체', value: 'ALL'},
            {label: 'KT', value: 'KT'},
            {label: 'LG', value: 'LG'},
            {label: 'SK', value: 'SK'}
        ];

        $('#cbWireless').jqxDropDownList({
            selectedIndex: 0,
            source: s,
            theme: jqxTheme,
            width: 100,
            height: 21,
            autoDropDownHeight: true
        });

        $slaDistrChart.jqxChart(chartSettings);
        $wireServiceChart.jqxChart(chartSettings);
        // $areaDistrChart.jqxChart(chartSettings);
        $groupChart.jqxChart(chartSettings);

        HmGrid.create($slaGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        console.log(JSON.stringify(data));
                        return data;
                    },
                    updaterow: function (rowid, rowdata, commit) {
                        Main.compensationCheck(rowdata);
                        if (editSlaIds.indexOf(rowid) == -1) {
                            editSlaIds.push(rowid);
                        }
                        commit();
                    },
                    loadComplete: function (records) {

                        editSlaIds.length = 0;
                        Main.updateChart(records.resultData, 'CNT');

                    }
                }
            ),
            showstatusbar: true,
            statusbarheight: 25,
            showaggregates: true,
            editable: false,
            columns:
                [
                    {text: '대상년월', datafield: 'yyyymm', width: 80, cellsalign: 'center', editable: false},
                    // {text: '교육청', datafield: 'college', width: 150, editable: false},
                    // {text: '지원청', datafield: 'collegeNia', minwidth: 150, editable: false},
                    {text: '이용기관', datafield: 'grpName', minwidth: 250, editable: false},
                    {text: '기관코드', datafield: 'agncCd', minwidth: 100, editable: false},
                    {text: '배정번호', datafield: 'asgnNo', width: 150, cellsalign: 'center', editable: false},
                    // { text : '장비명', datafield : 'devName', minwidth: 130, editable: false },
                    {text: '통신사', datafield: 'wireServiceName', width: 80, cellsalign: 'center', editable: false},
                    // {text: '이용기관 분류', datafield: 'lcd', width: 150, cellsalign: 'center', editable: false},
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
                        text: '기준',
                        datafield: 'lossStd',
                        columngroup: 'lossRate',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        cellsrenderer: Main.cellsRendererLoss
                    },
                    {
                        text: '측정', datafield: 'lossAvg', columngroup: 'lossRate', width: 80, cellsalign: 'center',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue == '')
                                return '-';
                        },
                    },
                    {
                        text: '보상일',
                        datafield: 'lossCnt',
                        columngroup: 'lossRate',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.aggrCntRenderer,

                    },
                    {
                        text: '보상금액',
                        datafield: 'lossCharge',
                        columngroup: 'lossRate',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.aggrChgRenderer,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var str = Main.makeComma(parseInt(value));
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                        }
                    },
                    {
                        text: '기준',
                        datafield: 'respStd',
                        columngroup: 'delay',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        cellsrenderer: Main.cellsRendererResp

                    },
                    {
                        text: '측정', datafield: 'respAvg', columngroup: 'delay', width: 80, cellsalign: 'center',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue == '')
                                return '-';
                        },
                    },
                    {
                        text: '보상일',
                        datafield: 'respCnt',
                        columngroup: 'delay',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.aggrCntRenderer,
                    },
                    {
                        text: '보상금액',
                        datafield: 'respCharge',
                        columngroup: 'delay',
                        width: 80,
                        cellsalign: 'center',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.aggrChgRenderer,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var str = Main.makeComma(parseInt(value));
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                        }

                    },
                ],
            columngroups:
                [
                    // { text: '가용성(미만 보상)', align: 'center', name: 'availability' },
                    {text: '손실률(초과 보상)', align: 'center', name: 'lossRate'},
                    {text: '지연(초과 보상)', align: 'center', name: 'delay'}
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

    },

    /** init data */
    initData: function () {

        Server.get('/main/sla/slaStat/getSlaCollegeList.do', {
            success: function (result) {
                _collegeList = result;
            }
        });

    },

    reportCellclass: function (row, columnfield, value) {
        var row = $slaGrid.jqxGrid('getrowdata', row);
        return row.isAttachFile == 1 ? 'slaState6' : null;
    },

    getCommParams: function () {

        var params = Master.getGrpTabParams();
        var yyyy = $('#sYear').val(), mm = $('#sMonth').val();
        if (mm == '01') params.lastMonth = null;
        else params.lastMonth = parseInt(mm) - 1 < 10 ? '0' + (parseInt(mm) - 1) : parseInt(mm) - 1;

        params.yyyy = yyyy;
        params.thisMonth = mm;
        params.yyyymm = yyyy + mm;
        params.date1 = yyyy + mm + '01';
        params.wireServiceName = $('#cbWireless').val();

        return params;

    },


    /** 조회 */
    searchSLA: function () {
        HmGrid.updateBoundData($slaGrid, ctxPath + '/main/sla/qcMgmt/getQcSlaList.do');
    },

    changeChart: function () {
        var data = $slaGrid.jqxGrid('getboundrows');
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
        // params.areaImg = HmUtil.saveChart($("#areaDistrChart"));
        params.groupImg = HmUtil.saveChart($("#groupChart"));

        HmUtil.exportGrid_Sla($slaGrid, "품질관리 SLA 보고서", false, params);

    },

    compensationCheck: function (rowdata) {

        var monthCost = rowdata.monthCost;

        if (parseFloat(rowdata.defLossRate) < parseFloat(rowdata.lossRate)) {
            if (parseFloat(rowdata.defDelay) < parseFloat(rowdata.delay)) {
                rowdata.lossRateDay = '-';
            } else {
                rowdata.lossRateDay = '1일';
            }
        } else {
            rowdata.lossRateDay = '-';
        }

        if (rowdata.delay != '-') {
            if (parseFloat(rowdata.defDelay) < parseFloat(rowdata.delay)) {
                rowdata.delayDay = '1일'
            } else {
                rowdata.delayDay = '-';
            }
        }


        // var aC = rowdata.availabilityDay == '1일' ? 1:0;
        var lC = rowdata.lossRateDay == '1일' ? 1 : 0;
        var dC = rowdata.delayDay == '1일' ? 1 : 0;

        if (monthCost == '0') {
            rowdata.reward = 0;
        } else {
            rowdata.reward = (monthCost / 30) * (lC + dC);
        }
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


    cellsRendererLoss: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += value + ' %';
        cell += '</div>';
        return cell;
    },

    cellsRendererResp: function (row, column, value) {
        var cell = '<div style="text-align: right; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
        cell += value + ' ms';
        cell += '</div>';
        return cell;
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


                var wireData = $slaGrid.jqxGrid('getboundrows');

                var aggrTotData = 0;


                if (flag) {
                    aggrTotData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;
                }

                $.each(wireData, function (idx, value) {
                    switch (value.lcd) {
                        case '0010':
                            lowCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0020':
                            middleCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0030':
                            highCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0040':
                            specCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0045':
                            eduCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0050':
                            etcCnt += value.respCnt + value.lossCnt;
                            break;

                        case '0060':
                            publicCnt += value.respCnt + value.lossCnt;
                            break;
                    }
                });


                tmp.push({name: '초등학교', cnt: lowCnt, color: "#0000FF"});
                tmp.push({name: '고등학교', cnt: highCnt, color: "#FF0000"});
                tmp.push({name: '중학교', cnt: middleCnt, color: "#00FF00"});

                tmp.push({name: '특수학교', cnt: specCnt, color: "#0FFFF0"});
                tmp.push({name: '교육청', cnt: eduCnt, color: "#FFF000"});
                tmp.push({name: '기타', cnt: etcCnt, color: "#FFFFFF"});
                tmp.push({name: '공공기관', cnt: publicCnt, color: "#FF00FF"});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#groupChart').jqxChart('source')[itemIndex];
                            var s = '<div style="text-align: left;"><b>' + categoryValue + '</b><br>' + HmUtil.commaNum(dataItem.cnt) + '건' + '(' + dataItem.amt + ' 원)';
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

                var wireData = $slaGrid.jqxGrid('getboundrows');

                var aggrAmtData = 0;

                if (flag) {
                    aggrAmtData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCharge', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCharge', ['sum']).sum;
                }

                $.each(wireData, function (idx, value) {
                    switch (value.lcd) {
                        case '0010':
                            lowAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0020':
                            middleAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0030':
                            highAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0040':
                            specAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0045':
                            eduAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0050':
                            etcAmt += value.respCharge + value.lossCharge;
                            break;

                        case '0060':
                            publicAmt += value.respCharge + value.lossCharge;
                            break;
                    }
                });


                tmp.push({name: '초등학교', color: "#0000FF", amt: lowAmt});
                tmp.push({name: '고등학교', color: "#FF0000", amt: highAmt});
                tmp.push({name: '중학교', color: "#00FF00", amt: middleAmt});

                tmp.push({name: '특수학교', color: "#0FFFF0", amt: specAmt});
                tmp.push({name: '교육청', color: "#FFF000", amt: eduAmt});
                tmp.push({name: '기타', color: "#FFFFFF", amt: etcAmt});
                tmp.push({name: '공공기관', color: "#FF00FF", amt: publicAmt});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
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

        var aggrTotAmt = 0;

        var aggrRepairAmt = 0;
        var aggrAccrueAmt = 0;


        var title = '';

        switch (type) {

            case 'CNT':
                title = 'SLA 건';

                if (flag) {

                    aggrTotData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;

                    aggrErrData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum;

                    aggrRepairAmt = $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;

                }

                tmp.push({name: '지연 초과', cnt: aggrErrData, color: "#FF0000"});
                tmp.push({name: '손실 초과', cnt: aggrRepairAmt, color: "#00FF00"});

                var _seriesGroups = [

                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
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
                                }
                            },
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

                    aggrTotAmt = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCharge', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCharge', ['sum']).sum;

                    aggrErrData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum;
                    aggrRepairData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCharge', ['sum']).sum;

                    aggrRepairAmt = $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;
                    aggrAccrueAmt = $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCharge', ['sum']).sum;

                }

                tmp.push({name: '지연 초과', color: "#FF0000", amt: aggrRepairData});
                tmp.push({name: '손실 초과', color: "#00FF00", amt: aggrAccrueAmt});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {
                            var dataItem = $('#slaDistrChart').jqxChart('source')[itemIndex];
                            var s = '<br style="text-align: left;"><b>' + categoryValue + '</b><br>' + '(' + dataItem.amt + ' 원)';
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
                            },
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

                var aggrTotData = 0;

                if (flag) {
                    aggrTotData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;

                    var wireData = $slaGrid.jqxGrid('getboundrows');

                    $.each(wireData, function (idx, value) {
                        switch (value.wireServiceName) {
                            case 'KT':
                                ktCnt += value.lossCnt + value.respCnt;
                                break;
                            case 'LG':
                                lgCnt += value.lossCnt + value.respCnt;
                                break;
                            case 'SK':
                                skCnt += value.lossCnt + value.respCnt;
                                break;
                        }
                    });

                }

                tmp.push({name: 'KT', cnt: ktCnt, color: "#0000FF"});
                tmp.push({name: 'LG', cnt: lgCnt, color: "#FF0000"});
                tmp.push({name: 'SK', cnt: skCnt, color: "#00FF00"});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
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
                            }
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

                    aggrTotAmtData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCharge', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCharge', ['sum']).sum;

                    var wireData = $slaGrid.jqxGrid('getboundrows');

                    $.each(wireData, function (idx, value) {
                        switch (value.wireServiceName) {
                            case 'KT':
                                ktAmt += value.respCharge + value.lossCharge;
                                break;
                            case 'LG':
                                lgAmt += value.respCharge + value.lossCharge;
                                break;
                            case 'SK':
                                skAmt += value.respCharge + value.lossCharge;
                                break;
                        }
                    });
                }

                tmp.push({name: 'KT', color: "#0000FF", amt: ktAmt});
                tmp.push({name: 'LG', color: "#FF0000", amt: lgAmt});
                tmp.push({name: 'SK', color: "#00FF00", amt: skAmt});

                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
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
        var aggrTotAmtData = 0;

        switch (type) {

            case 'CNT':
                title = 'SLA 건';

                var wireData = $slaGrid.jqxGrid('getboundrows');

                if (flag) {
                    aggrTotData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCnt', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCnt', ['sum']).sum;
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
                        if (element.college == v) {
                            cnt += element.respCnt + element.lossCnt;
                        }
                    })
                    tmp.push({name: college, cnt: cnt, color: "#0000FF"});
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

                var wireData = $slaGrid.jqxGrid('getboundrows');

                if (flag) {
                    aggrTotAmtData = $slaGrid.jqxGrid('getcolumnaggregateddata', 'respCharge', ['sum']).sum + $slaGrid.jqxGrid('getcolumnaggregateddata', 'lossCharge', ['sum']).sum;
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
                        if (element.college == v) {
                            amt += element.respCharge + element.lossCharge;
                        }
                    })
                    tmp.push({name: college, color: "#0000FF", amt: amt});
                });


                var _seriesGroups = [
                    {
                        type: 'pie',
                        showBorderLine: false,
                        showLabels: true,
                        showLegend: false,
                        toolTipFormatFunction: function (value, itemIndex, series, group, categoryValue, categoryAxis) {

                            var dataItem = $('#areaDistrChart').jqxChart('source')[itemIndex];
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
                            }
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

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    // Main.initData();
});