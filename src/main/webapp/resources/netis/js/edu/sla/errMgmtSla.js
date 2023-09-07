var $slaGrid, $evtGrid, editIds = [], editEvtIds = [], sessAuth;

var Main = {
    SLA_STATE_CD: {
        //NONE -> 소명신청 -> 검토중 -> 반려 -> 보완완료(재요청) -> 소명거부 -> 소명완료
        NONE: 0, REQ: 1, CHECK: 2, RETURN: 3, REREQ: 4, REJECT: 5, APPROVE: 6
    },


    /** variable */
    initVariable: function () {
        $slaGrid = $('#slaGrid'), $evtGrid = $('#evtGrid');
        sessAuth = $('#sAuth').val().toUpperCase();
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
            case 'btnSearch_evt':
                this.searchEvtHist();
                break;
            case 'btnSave_evt':
                this.saveEvtSla();
                break;
            case 'btnHelp':
                this.showHelp();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        HmJqxSplitter.createTree($('#mainSplitter'));

        $('#contentSplitter').jqxSplitter({
            width: '100%',
            height: '100%',
            orientation: 'horizontal',
            theme: jqxTheme,
            panels: [{size: '70%', collapsible: false}, {size: '30%'}]
        });
        Master.createGrpTab2(Main.selectTree);

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

        HmGrid.create($slaGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete: function (records) {
                        editIds.length = 0;
                    }
                }
            ),
            editable: true,
            showstatusbar: true,
            statusbarheight: 25,
            showaggregates: true,
            columns:
                [
                    // {
                    //     text: '교육청', datafield: 'college', width: 130, editable: false, hidden: false
                        // aggregatesrenderer: function () {
                        //     return "<div style='margin-top: 4px;' class='jqx-center-align'>합계</div>";
                        // }
                    // },
                    // {
                    //     text: '지원청', datafield: 'collegeNia', width: 130, editable: false, hidden: false
                        // aggregatesrenderer: function () {
                        //     return "<div style='margin-top: 4px;' class='jqx-center-align'>합계</div>";
                        // }
                    // },
                    {
                        text: '이용기관', datafield: 'grpName', width: 130, editable: false, hidden: false
                        // aggregatesrenderer: function () {
                        //     return "<div style='margin-top: 4px;' class='jqx-center-align'>합계</div>";
                        // }
                    },
                    {text: '장비명', datafield: 'devName', minwidth: 130, editable: false},
                    {text: '하위 장비', datafield: 'mngNo', width: 80, editable: false, hidden: true, cellsalign: 'right'},
                    {text: '통신사', datafield: 'wireServiceName', width: 60, cellsalign: 'center', editable: false},
                    {
                        text: '월 이용료',
                        datafield: 'monthCost',
                        width: 100,
                        cellsalign: 'right',
                        cellsformat: 'n',
                        editable: false
                    },
                    {
                        text: '보상 합계',
                        datafield: 'calcSlaCharge',
                        width: 100,
                        cellsalign: 'right',
                        cellsformat: 'n',
                        editable: false,
                        aggregates: ['sum'],
                        aggregatesrenderer: Main.agg_sumrenderer
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
        }, CtxMenu.COMM, 1);
        $slaGrid.on('rowselect', function (event) {
            if (event.args.row.errCnt > 0) setTimeout(Main.searchEvtHist, 100);
            else $evtGrid.jqxGrid('clear');
        });

        // 장애이력
        HmGrid.create($evtGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editEvtIds.indexOf(rowid) == -1)
                            editEvtIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        var params = Master.getGrpTabParams();
                        var yyyymm = $('#sYear').val().toString() + $('#sMonth').val().toString();
                        params.sDate1 = yyyymm + '01';
                        params.sDate2 = yyyymm + '31';
                        params.slaFlag = 1;
                        params.slaIng = $('#chkSlaIng').is(':checked') ? 1 : 0;
                        params.slaEnd = $('#chkSlaEnd').is(':checked') ? 1 : 0;

                        var slaRow = HmGrid.getRowData($slaGrid);
                        params.sMngNo = slaRow == null ? 0 : slaRow.mngNo;
                        $.extend(data, params);
                        return data;
                    },
                    loadComplete: function (records) {
                        editEvtIds.length = 0;
                    },
                    beforeLoadComplete: function (list) {

                        if (list && list.length > 0) {
                            $.each(list, function (idx, data) {
                                data.orgSlaStateCd = data.slaStateCd;
                            });
                        }

                        return list;

                    }

                }

            ),
            editable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '상세내역 <span style="color: red; padding-left: 10px; font-weight: normal;">※ 금일 내역(통보/소명/종료된 장애)은 익일에 확인가능</span>');
            },
            columns:
                [
                    {
                        text: '장애통보',
                        datafield: 'slaActionCd',
                        width: 100,
                        pinned: true,
                        cellsrenderer: HmGrid.slaActionrenderer
                    },
                    {text: '소명관리', datafield: 'slaStateCd', width: 100, cellsrenderer: HmGrid.slaStaterenderer},
                    {text: '소명신청자', datafield: 'slaReqUserNm', width: 80, cellsalign: 'center', editable: false},
                    {text: '소명처리자', datafield: 'slaApprUserNm', width: 80, cellsalign: 'center', editable: false},
                    {text: '이용기관', datafield: 'grpName', width: 150, editable: false},
                    {text: '장애대상', datafield: 'srcInfo', minwidth: 250, editable: false},
                    {
                        text: '장애등급',
                        datafield: 'evtLevelStr',
                        width: 100,
                        filtertype: 'checkedlist',
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        editable: false,
                        hidden: true
                    },
                    {text: '시작일시', datafield: 'evtStartdate', width: 160, editable: false},
                    {text: '종료일시', datafield: 'evtFreedate', width: 160, editable: false},
                    {text: '통보일시', datafield: 'receiptDate', width: 160, editable: false},
                    {
                        text: '지속시간',
                        datafield: 'slaSumSec',
                        width: 150,
                        cellsrenderer: HmGrid.cTimerenderer,
                        editable: false
                    },
                    {
                        text: '소명시간',
                        datafield: 'apprExcSlaSumSec',
                        width: 150,
                        cellsrenderer: HmGrid.cTimerenderer,
                        editable: false
                    },
                    {text: '장애상태', datafield: 'status', width: 100, editable: false, hidden: true},
                    {text: '조치자', datafield: 'receiptUser', width: 100, editable: false, hidden: true},
                    {text: '조치내역', datafield: 'receiptMemo', width: 150, editable: false, hidden: true}
                    // { text : '소명상태', datafield : 'slaStateCd', displayfield: 'disSlaStateCd', width: 100, cellsalign: 'center', editable: true,
                    //     cellclassname: Main.slaStateCellclass,
                    //     columntype: 'dropdownlist', filtertype: 'checkedlist',
                    //     createeditor: function(row, value, editor) {
                    //         editor.jqxDropDownList({
                    //             source: [
                    //                 {label: 'NONE', value: Main.SLA_STATE_CD.NONE},
                    //                 {label: '소명신청', value: Main.SLA_STATE_CD.REQ},
                    //                 // {label: '검토중', value: Main.SLA_STATE_CD.CHECK},
                    //                 {label: '소명반려', value: Main.SLA_STATE_CD.RETURN},
                    //                 // {label: '보완완료', value: Main.SLA_STATE_CD.REREQ},
                    //                 // {label: '소명거부', value: Main.SLA_STATE_CD.REJECT},
                    //                 {label: '소명승인', value: Main.SLA_STATE_CD.APPROVE}
                    //             ], autoDropDownHeight: true
                    //         });
                    //     },
                    //     initeditor: function(row, value, editor) {
                    //         var rowdata = HmGrid.getRowData($evtGrid, row);
                    //         var _stateCd = rowdata.slaStateCd, _orgStateCd = rowdata.orgSlaStateCd;
                    //         if(_stateCd == null) _stateCd = 0;
                    //         if(_orgStateCd == null) _orgStateCd = 0;
                    //
                    //         editor.jqxDropDownList({disabled: false});
                    //         for (var i = 0; i <= 3; i++) {
                    //             editor.jqxDropDownList('enableAt', i);
                    //         }
                    //         editor.jqxDropDownList('selectItem', editor.jqxDropDownList('getItemByValue', _stateCd));
                    //
                    //         // User등급이면 [소명승인] 비활성화
                    //         if(sessAuth == 'USER') {
                    //             editor.jqxDropDownList('disableAt', 3);
                    //             return;
                    //         }
                    //         else {
                    //
                    //         }
                    //         // // 소명승인이면 비활성화
                    //         // if ($.inArray(_orgStateCd, [Main.SLA_STATE_CD.APPROVE]) != -1) {
                    //         //     editor.jqxDropDownList({disabled: true});
                    //         //     return;
                    //         // }
                    //
                    //     }
                    // },
                    // { text : '소명', datafield : 'slaFileNo', width: 80, cellsalign: 'center', editable: false,
                    //     cellsrenderer: function (row, datafield, value) {
                    //         return '<div id="btnInfo' +  row + '" class="rpt ' + (value > 0? 'rpt_upload' : 'rpt_none') + ' jqx-center-align">' +
                    //                 '<div class="rptText" onclick="Main.reportMgmt('+row+')">보고서</div>' +
                    //                 // '<img style="margin-left:7px; margin-top:1px;" src="' + ctxPath + '/img/Btn/btnReport.gif" onClick="Main.reportMgmt('+row+')">' +
                    //             '</div>';
                    //     }
                    // },
                ]
        }, CtxMenu.NONE, 2);

        //CtxMenuHandler.initEvtCtxMenu();
        //운영자 요청에 따른 문구 변경 (장애조치 -> 장애통보)
        // $('div[id^=ctxmenu] li[id=cm_evtAction] span').text('장애통보');


        $('#section').css('display', 'block');
    },

    /** init data */
    initData: function () {

    },

    slaStateCellclass: function (row, columnfield, value) {
        var row = $evtGrid.jqxGrid('getrowdata', row);
        if (row == null) return;
        switch (row.slaStateCd || 0) {
            case 1:
                return 'slaState1';
            case 2:
            case 3:
            case 4:
                return "slaState2";
            case 5:
                return "slaState5";
            case 6:
                return "slaState6";
            default:
                return null;
        }
    },

    agg_sumrenderer: function (aggregates, column) {
        var value = aggregates['sum'];
        var suffix = '';
        if ($.inArray(column.datafield, ['errActionExceedCnt', 'errRepairExceedCnt', 'errCnt']) != -1) {
            suffix = '건';
        }
        else if ($.inArray(column.datafield, ['errActionExceedHour', 'errRepairExceedHour', 'errAccrueHour']) != -1) {
            suffix = '시간';
        }
        else if ($.inArray(column.datafield, ['calcSlaCharge', 'calcErrRepairCharge', 'calcErrAccrueCharge', 'calcErrOverlapCharge']) != -1) {
            suffix = '원';
        }
        if (value === undefined) value = 0;

        if (isNaN(value)) {
            return '<div style="float: right; margin: 4px; overflow: hidden;">' + (value || 0) + suffix + '</div>';
        }
        else {
            return '<div style="float: right; margin: 4px; overflow: hidden;">' + HmUtil.commaNum(value || 0) + suffix + '</div>';
        }
    },

    cntRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value == 0 ? "-" : value + " 건";
        cell += "</div>";
        return cell;
    },

    hourRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value == 0 ? "-" : value + " 시간";
        cell += "</div>";
        return cell;
    },

    minuteRenderer: function (row, datafield, value) {
        var result = HmUtil.convertCTime(value * 60);
        return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + result + "</div>";
    },

    chargeRenderer: function (row, datafield, value) {
        if (value == 0) {
            return "<div style='margin-top: 4px;' class='jqx-center-align'> - </div>";
        }
        else {
            return "<div style='margin-top: 4px; margin-right: 4px' class='jqx-right-align'>" + HmUtil.commaNum(value) + "</div>";
        }
    },

    contErrRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 4px;' class='jqx-center-align'>";
        cell += value == 1 ? "O" : "X";
        cell += "</div>";
        return cell;
    },

    getCommParams: function () {
        var params = Master.getGrpTabParams();
        var yyyy = $('#sYear').val(), mm = $('#sMonth').val();
        if (mm == '01') {
            params.lastMonth = null;
        }
        else {
            params.lastMonth = parseInt(mm) - 1 < 10 ? '0' + (parseInt(mm) - 1) : parseInt(mm) - 1;
        }
        params.yyyy = yyyy;
        params.thisMonth = mm;
        params.fromDay = '01';
        params.toDay = '31';
        return params;
    },

    /** 그룹트리 선택이벤트 */
    selectTree: function () {
        Main.searchSLA();
    },

    /** 조회 */
    searchSLA: function () {
        $evtGrid.jqxGrid('clear');
        HmGrid.updateBoundData($slaGrid, ctxPath + '/edu/sla/errMgmtSla/getErrMgmtSlaList_4.do');
    },

    /** 장애이력 조회 */
    searchEvtHist: function () {
        HmGrid.updateBoundData($evtGrid, ctxPath + '/main/sla/slaEvtMgmt/getSlaEvtMgmtList2.do');
    },


    /** 저장 */
    saveSLA: function() {
        HmGrid.endRowEdit($slaGrid);
        if(editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editIds, function(idx, value) {
            _list.push($slaGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/sla/errMgmtSla/saveErrSlaMemo.do', {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                editIds.length = 0;
            }
        });
    },

    /** SLA 요금표 변경 */
    editSlaCharge: function() {
        $.get('/main/popup/nms/pSlaChargeEdit.do', function(result) {
            HmWindow.open($('#pwindow'), 'SLA 요금 변경', result, 1000, 600);
        });
    },

    /** export Excel */
    exportExcel: function () {
        HmUtil.exportGrid($slaGrid, '장애관리SLA', false);
    },

    /** 소명보고서 관리 팝업 */
    reportMgmt: function (row) {
        var data = HmGrid.getRowData($evtGrid, row);
        var seqNoList = $evtGrid.jqxGrid('getboundrows').map(function (d) {
            return d.seqNo;
        });
        var params = {
            seqNo: data.seqNo,
            seqNoList: seqNoList
        };
        HmUtil.createPopup('/main/popup/sla/pErrSlaReport.do', $('#hForm'), 'pErrSlaReport', 820, 700, params);
    },

    /** 이벤트 소명상태 저장 */
    saveEvtSla: function () {
        HmGrid.endRowEdit($evtGrid);
        if (editEvtIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editEvtIds, function (idx, value) {
            var tmp = $evtGrid.jqxGrid('getrowdatabyid', value);
            _list.push({seqNo: tmp.seqNo, slaStateCd: tmp.slaStateCd});
        });

        Server.post('/main/sla/errMgmtSla/saveEvtSlaState.do', {
            data: {list: _list},
            success: function (result) {
                Main.searchEvtHist();
                alert('저장되었습니다.');
            }
        });
    },

    showHelp: function () {
        HmUtil.createPopup('/main/popup/sla/pGNS_ecSlaHelp.do', $('#hForm'), 'pGNS_ecSlaHelp', 1000, 600);
    },

    /** 장애이력에서 잘못 체크한 항목을 삭제하기 위함  */
    delSla : function(){
        var rowData = HmGrid.getRowData($slaGrid);
        if(rowData == null){
            alert('삭제할 SLA를 선택해 주세요.');
            return;
        }
        if(!confirm('삭제하시겠습니까?')) return;

        $.extend(rowData, Main.getCommParams());

        Server.post('/main/nms/sla/delSlaFlag.do', {
            data: rowData,
            success: function(result) {
                $slaGrid.jqxGrid('deleterow', rowData.uid);
                alert('삭제되었습니다.');
            }
        });
    },


};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});


function uploadEndCallback(result) {

}