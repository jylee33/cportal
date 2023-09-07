var $slaGrid, editCnts = [];
var $ChgslaGrid;


var Main = {
    /** variable */
    initVariable: function () {
        $slaGrid = $('#slaGrid');
        $ChgslaGrid = $('#chgSlaGrid');
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
            // case 'btnEdit':
            //     this.updateAplSla();
            //     break;
            case "btnExcel":
                this.exportExcel(curTarget.id);
                break;
            case 'btnDel':
                this.delSla();
                break;

            case 'btnChgSearch':
                this.searchChgSLA();
                break;
            // case 'btnChgEdit':
            //     this.updateAplSla();
            //     break;
            case "btnChgExcel":
                this.exportExcel(curTarget.id);
                break;
            case "btnChgDel":
                this.delSla();
                break;
        }
    },

    initApplicationSla: function () {

        $('#telecom').jqxDropDownList({
            source: [{label: '전체', value: 0}, {label: 'KT', value: 1}, {label: 'LG', value: 2}, {
                label: 'SK',
                value: 3
            }],
            displayMember: 'label',
            valueMember: 'value',
            height: 22,
            width: 120,
            theme: jqxTheme,
            selectedIndex: 0,
            autoDropDownHeight: true
        });

        HmGrid.create($slaGrid, {
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
                            var params = Master.getGrpTabParams();

                            $.extend(data, params);
                            $.extend(data, Main.getAplCommParams());
                            console.log(JSON.stringify(data));
                            return data;
                        },
                        loadComplete: function (records) {
                            editCnts.length = 0;
                        }
                    }
                ),
                editable: true,
                showstatusbar: true,
                statusbarheight: 25,
                showaggregates: true,
                columns: [
                    {text: 'AGNCD', datafield: 'agncCd', minwidth: 100, editable: false, hidden: true},
                    {text: 'NO', datafield: 'appNo', minwidth: 100, editable: false, hidden: true},
                    {
                        text: 'SLA구분',
                        datafield: 'slaFlag',
                        minwidth: 100,
                        cellsalign: 'center',
                        editable: false,
                        aggregatesrenderer: function () {
                            var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                            return cell + ' 합계</div>';
                        }
                    },
                    {
                        text: '기준월',
                        datafield: 'baseMonth',
                        minwidth: 100,
                        editable: false,
                        cellsalign: 'center',
                        aggregates: ['avg'],
                        aggregatesrenderer: function (aggregates, column, element) {
                            var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                            $.each(aggregates, function (key, value) {
                                console.log("KEY : " + JSON.stringify(value));
                            });
                            return cell + '</div>';
                        }
                    },
                    {
                        text: '보상요금', datafield: 'calcSlaCharge', width: 100, editable: false,
                        aggregates: ['sum'], aggregatesrenderer: Main.aggrRenderer,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var str = Main.makeComma(value);
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                        }
                    },
                    {text: '교육청', datafield: 'college', minwidth: 100, cellsalign: 'center', editable: false, hidden : true},
                    {text: '이용기관', datafield: 'grpName', minwidth: 100, cellsalign: 'center', editable: false},
                    {text: '장비명', datafield: 'devName', minwidth: 100, cellsalign: 'center', editable: false},
                    {text: '통신사', datafield: 'wireServiceName', width: 80, cellsalign: 'center', editable: false},
                    {text: '서비스명', datafield: 'disSvcType', width: 100, cellsalign: 'center', editable: false},
                    // {text: '신청대역폭', datafield: 'userLineWidth', width: 100, editable: false, cellsrenderer: HmGrid.unit1000renderer},

                    {text: '개통신청일', datafield: 'appYmd', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통신청접수일', datafield: 'niaAprYmd', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통기준일', datafield: 'openBaseMonth', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통사전보고일', datafield: 'inDelayYmdh', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통예정일', datafield: 'openDelayYmd', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통일', datafield: 'endYmd', minwidth: 100, editable: false, cellsalign: 'center'},
                    {text: '개통희망일', datafield: 'wishYmd', minwidth: 100, editable: false, cellsalign: 'center'},

                    {
                        text: '월 이용료',
                        datafield: 'amt',
                        minwidth: 100,
                        editable: false,
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var str = Main.makeComma(parseInt(value));
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                        }
                    },
                    {
                        text: '보상대상', datafield: 'compDay', minwidth: 100, editable: false, cellsalign: 'center',
                        cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                            var compData = parseInt(value);
                            console.log("compData : " + compData);
                            if (compData > 0) {
                                return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + compData + '일</div>';
                            } else {
                                return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">0일</div>';
                            }
                        }
                    },
                    {text: '비고(Memo)', datafield: 'memo', minwidth: 100, editable: true, cellsalign: 'center'},
                    {text: '정보수정일시', datafield: 'infoDate', minwidth: 150, editable: false, cellsalign: 'center'},
                    // {text: '정보수정일시', datafield: 'infoDate', minwidth: 100, editable: true},
                    {text: '작업자', datafield: 'worker', minwidth: 100, editable: true, cellsalign: 'center'}

                ]
            }, CtxMenu.COMM
        );

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

    aggrRenderer: function (aggregates) {

        var total = 0;
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        $.each(aggregates, function (key, value) {
            total += value;
            console.log("aggrRenderer : " + value);
        });
        cell += total > 0 ? Main.makeComma(total) + '원' : '-' + "</div>";
        return cell;
    },


    initChangeSla: function () {


        $('#Chgtelecom').jqxDropDownList({
            source: [{label: '전체', value: 0}, {label: 'KT', value: 1}, {label: 'LG', value: 2}, {
                label: 'SK',
                value: 3
            }],
            displayMember: 'label',
            valueMember: 'value',
            height: 22,
            width: 120,
            theme: jqxTheme,
            selectedIndex: 0,
            autoDropDownHeight: true
        });

        HmGrid.create($ChgslaGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        var params = Master.getGrpTabParams();
                        $.extend(data, params);
                        $.extend(data, Main.getChgCommParams());

                        console.log(JSON.stringify(data));
                        return data;
                    }
                }
            ),
            editable: true,
            showstatusbar: true,
            statusbarheight: 25,
            showaggregates: true,
            columns: [

                {text: 'AGNCD', datafield: 'agncCd', minwidth: 100, editable: false, hidden: true},
                {text: 'NO', datafield: 'appNo', minwidth: 100, editable: false, hidden: true},
                {
                    text: 'SLA구분',
                    datafield: 'slaFlag',
                    minwidth: 100,
                    editable: false,
                    cellsalign: 'center',
                    aggregatesrenderer: function () {
                        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                        return cell + ' 합계</div>';
                    }
                },
                {
                    text: '기준월',
                    datafield: 'baseMonth',
                    minwidth: 100,
                    editable: false,
                    cellsalign: 'center',
                    aggregatesrenderer: function (aggregates, column, element) {

                        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
                        $.each(aggregates, function (key, value) {
                            console.log("KEY : " + JSON.stringify(key));
                        });
                        return cell + ' </div>';
                    }
                },
                {
                    text: '보상요금', datafield: 'calcSlaCharge4', width: 100, editable: false,
                    aggregates: ['sum'], aggregatesrenderer: Main.aggrRenderer,
                    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                        var str = Main.makeComma(value);
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                    }
                },
                {text: '교육청', datafield: 'college', minwidth: 100, cellsalign: 'center', editable: false, hidden: true},
                {text: '이용기관', datafield: 'grpName', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '장비명', datafield: 'devName', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '통신사', datafield: 'wireServiceName', width: 80, cellsalign: 'center', editable: false},
                {text: '서비스명', datafield: 'disSvcType', width: 100, cellsalign: 'center', editable: false},
                // {text: '변경대역폭', datafield: 'userLineWidth', width: 100, editable: false, cellsrenderer: HmGrid.unit1000renderer},

                {text: '변경신청일', datafield: 'appYmd', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경신청접수일', datafield: 'niaAprYmd', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경기준일', datafield: 'openBaseMonth', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경사전보고일', datafield: 'inDelayYmdh', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경예정일', datafield: 'openDelayYmd', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경완료일', datafield: 'endYmd', minwidth: 100, cellsalign: 'center', editable: false},
                {text: '변경희망일', datafield: 'wishYmd', minwidth: 100, cellsalign: 'center', editable: false},

                {
                    text: '월 이용료',
                    datafield: 'amt',
                    minwidth: 100,
                    editable: false,
                    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                        var str = Main.makeComma(parseInt(value));
                        return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + str + ' 원</div>';
                    }
                },
                {
                    text: '보상대상', datafield: 'compDay', minwidth: 100,
                    cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
                        var compData = parseInt(value);
                        if (compData > 0) {
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">' + compData + '일</div>';
                        } else {
                            return '<div style="margin-top: 6px" class="jqx-grid-cell-middle-align">0일</div>';
                        }
                    }
                },
                {text: '비고(Memo)', datafield: 'memo', minwidth: 100, editable: true, cellsalign: 'center'},
                {text: '정보수정일시', datafield: 'infoDate', minwidth: 100, editable: false, cellsalign: 'center'},
                {text: '작업자', datafield: 'worker', minwidth: 100, editable: false, cellsalign: 'center'}
            ]
        }, CtxMenu.COMM);

    }
    ,


    /** init design */
    initDesign: function () {
        $('#dGrpTreeGrid').on('bindingComplete', function () {
            try {
                $('#dGrpTreeGrid').jqxTreeGrid('setCellValue', 1, 'grpName', '회선서비스');
            } catch (e) {
            }
        });
        Master.createGrpTab2(Main.searchALL);

        $('#mainSplitter').jqxSplitter({
            width: '99.8%',
            height: '99.8%',
            orientation: 'vertical',
            theme: jqxTheme,
            panels: [{size: 254, collapsible: true}, {size: '100%'}]
        });

        $('#horizontalSplit').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'horizontal',
            theme: jqxTheme,
            panels: [{size: '50%', collapsible: false}, {size: '50%'}]
        });


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


        $('#sYear1').jqxDropDownList({
            width: 80, height: 21, theme: jqxTheme,
            source: s_year, selectedIndex: s_year.length - 1, autoDropDownHeight: true
        });

        $('#sMonth1').jqxDropDownList({
            width: 60, height: 21, theme: jqxTheme,
            source: s_month, selectedIndex: curMonth
        }).on('open', function (event) {
            $(this).jqxDropDownList('ensureVisible', $(this).jqxDropDownList('getSelectedIndex'));
        });

        Main.initApplicationSla();
        Main.initChangeSla();

    },

    /** init data */
    initData: function () {

    },

    getAplCommParams: function () {

        var params = {};

        var yyyy = $('#sYear').val(), mm = $('#sMonth').val();

        if (mm == '01') {
            params.lastMonth = null;
        }
        else {
            params.lastMonth = parseInt(mm) - 1 < 10 ? '0' + (parseInt(mm) - 1) : parseInt(mm) - 1;
        }

        params.yyyy = yyyy;

        params.yyyymm = yyyy + mm;

        // params.yyyy = '2017';
        // params.thisMonth = '02'


        var item = $("#telecom").jqxDropDownList('getSelectedItem');

        params.wireServiceName = item.label;

        console.log("getAplCommParams : " + JSON.stringify(params));

        return params;

    }
    ,

    getChgCommParams: function () {

        var params = {};
        var yyyy = $('#sYear1').val(), mm = $('#sMonth1').val();


        if (mm == '01') {
            params.lastMonth = null;
        }
        else {
            params.lastMonth = parseInt(mm) - 1 < 10 ? '0' + (parseInt(mm) - 1) : parseInt(mm) - 1;
        }

        params.yyyy = yyyy;
        params.yyyymm = yyyy + mm;

        var item = $("#Chgtelecom").jqxDropDownList('getSelectedItem');
        params.wireServiceName = item.label;

        console.log("getAplCommParams : " + JSON.stringify(params));

        return params;

    }
    ,

    searchALL: function () {
        HmGrid.updateBoundData($slaGrid, ctxPath + '/edu/sla/aplSla/getAplSlaLIst_nia4.do');
        HmGrid.updateBoundData($ChgslaGrid, ctxPath + '/edu/sla/aplSla/getChgSlaLIst_nia4.do');
    },

    /** 조회 */
    searchSLA: function () {
        HmGrid.updateBoundData($slaGrid, ctxPath + '/edu/sla/aplSla/getAplSlaLIst_nia4.do');
    },

    searchChgSLA: function () {
        HmGrid.updateBoundData($ChgslaGrid, ctxPath + '/edu/sla/aplSla/getChgSlaLIst_nia4.do');
    }
    ,

    /** SLA 요금표 변경 */
    editSlaCharge: function () {
        $.get('/edu/popup/sla/pSlaChargeEdit.do', function (result) {
            HmWindow.open($('#pwindow'), 'SLA 요금 변경', result, 1000, 600);
        });
    }
    ,

    /** 장애이력에서 잘못 체크한 항목을 삭제하기 위함  */
    delSla: function () {
        var rowData = HmGrid.getRowData($slaGrid);
        if (rowData == null) {
            alert('삭제할 SLA를 선택해 주세요.');
            return;
        }
        if (!confirm('삭제하시겠습니까?')) return;

        Server.post('/edu/sla/aplSla/delAplSla.do', {
            data: rowData,
            success: function (result) {
                $slaGrid.jqxGrid('deleterow', rowData.uid);
                alert('삭제되었습니다.');
            }
        });
    }
    ,

    updateAplSla: function () {

        var rowData = HmGrid.getRowData($slaGrid);

        if (rowData == null) {
            alert('저장할 SLA를 선택해 주세요.');
            return;
        }

        rowData.worker = $("#sUserId").val()
        console.log("SAVE DATA ROW : " + JSON.stringify(rowData));

        Server.post('/edu/sla/aplSla/saveAplSla.do', {
            data: rowData,
            success: function (result) {
                $slaGrid.jqxGrid('updaterow', rowData.uid);
                alert('수정되었습니다.');
            }
        });
    }
    ,

    /** export Excel */
    exportExcel: function (data) {
        var params;
        if (data == "btnExcel") {
            params = Main.getAplCommParams();
            HmUtil.exportExcel(ctxPath + '/edu/sla/aplSla/AplExport.do', params);
        } else {
            params = Main.getChgCommParams();
            HmUtil.exportExcel(ctxPath + '/edu/sla/aplSla/ChgExport.do', params);
        }
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});