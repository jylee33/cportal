var $errProcessGrid;

var editNotiIds = [], editProcessIds = [];

var errKindList = [];

var Main = {
    /** variable */
    initVariable: function () {
        $errProcessGrid = $('#errProcessGrid');
        this.initCondition();
    },

    initCondition: function () {
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
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


            case 'btnAdd':
                this.addEvt();


                break;

            case 'btnSave':
                this.saveEvt();
                break;

            case 'btnDelete':
                this.delEvt();
                break;

            case 'btnSearch':
                this.search();
                break;
            case 'btnExcel':
                this.exportExcel();
                break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function (event) {
        if (event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign: function () {

        HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '90%',
            collapsible: false
        }, {size: '10%'}], 'auto', '100%');

        $('#sDate1').jqxDateTimeInput({
            width: 120,
            height: 21,
            theme: jqxTheme,
            // formatString: 'yyyy-MM-dd',
            formatString: 'yyyy-MM',
            culture: 'ko-KR',
            views: ['year']
        });
        $('#sDate1').val(new Date());



        HmGrid.create($errProcessGrid, {
            source: new $.jqx.dataAdapter(
                {
                    type: 'post',
                    datatype: 'json',
                    contenttype: 'application/json;charset=utf8;',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editProcessIds.indexOf(rowid) == -1)
                            editProcessIds.push(rowid);
                        commit(true);
                    },
                    datafields: [
                        {name: 'seqNo', type: 'number'},
                        {name: 'ymdhms', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'notiDate', type: 'string'},
                        {name: 'processDate', type: 'string'},
                        {name: 'processNeedDate', type: 'number'},
                        {name: 'needDate', type: 'number'},
                        {name: 'adminProcessNeedDate', type: 'number'},
                        {name: 'rate', type: 'string'},
                        {name: 'score', type: 'number'},
                        {name: 'systemProcessMemo', type: 'string'},
                        {name: 'adminProcessDate', type: 'string'},
                        {name: 'adminrate', type: 'string'},
                        {name: 'adminscore', type: 'number'},
                        {name: 'adminProcessMemo', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {

                        $.extend(data, {
                            code: "IP",
                            codeId: "PROCESS",
                            yyyymmdd: HmDate.getDateStr($("#sDate1"), 'yyyyMM')
                        });
                        data.filterGroups = [];

                        return JSON.stringify(data);
                    },
                    loadComplete: function (record) {

                        var needagg = $errProcessGrid.jqxGrid('getcolumnaggregateddata', 'adminProcessNeedDate', ['sum']);
                        var scoreagg = $errProcessGrid.jqxGrid('getcolumnaggregateddata', 'adminscore', ['sum']);

                        // 전체 행 개수 가져오기
                        var rows = $errProcessGrid.jqxGrid('getrows');
                        var rowCount = rows.length;

                        Server.post('/main/nms/slmMgmt/getRateList.do', {
                            data: {code: "IP", codeId: "ACCUMULATE"},
                            success: function (result) {

                                var levelTime1 = result[0].time * 60 * 60;
                                var levelTime2 = result[1].time * 60 * 60;
                                var levelTime3 = result[2].time * 60 * 60;
                                var levelTime4 = result[3].time * 60 * 60;

                                if ((needagg.sum / rowCount) <= levelTime1) {
                                    $("#calErrRate").text("목표수준(점수 : " + result[0].score + " )");
                                } else if (levelTime1 < (needagg.sum / rowCount) && (needagg.sum / rowCount) <= levelTime2) {
                                    $("#calErrRate").text("기본수준(점수 : " + result[1].score + " )");
                                } else if (levelTime2 < (needagg.sum / rowCount) && (needagg.sum / rowCount) <= levelTime3) {
                                    $("#calErrRate").text("최저허용(점수 : " + result[2].score + " )");
                                } else if (levelTime4 < (needagg.sum / rowCount)) {
                                    $("#calErrRate").text("불가수준(점수 : " + result[3].score + " )");
                                } else {
                                    $("#calErrRate").text("평가대상 없음 (점수 : " + 0.0 + " )");
                                }

                                $("#calErrCnt").text(rowCount + " 건");

                                if (rowCount == 0) {
                                    $("#calErrProcTimeSum").text(formatSecondsToHHMMSS(0));
                                    $("#calErrProcScoreSum").text(0);
                                    $("#calErrTimeSum").text(formatSecondsToHHMMSS(0));
                                    $("#calErrScoreSum").text(0);
                                } else {
                                    $("#calErrProcTimeSum").text(formatSecondsToHHMMSS(needagg.sum));
                                    $("#calErrProcScoreSum").text(scoreagg.sum);
                                    $("#calErrTimeSum").text(formatSecondsToHHMMSS(needagg.sum));
                                    $("#calErrScoreSum").text(scoreagg.sum);
                                }
                            }
                        });
                        editProcessIds.length = 0;
                    }
                }
            ),
            showtoolbar: true,
            editable: true,
            showstatusbar: true,
            showaggregates: true,
            selectionmode: 'multiplerowsextended',
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장애 처리');
            },
            columns:
                [
                    {
                        text: '장애대상',
                        datafield: 'srcInfo',
                        width: 180,
                        columngroup: "errInfo",
                        editable: true,
                        cellsalign: 'center'
                    },
                    {
                        text: '장애종류',
                        datafield: 'code',
                        width: 250,
                        columngroup: "errInfo",
                        editable: true,
                        cellsalign: 'center',
                        displayfield: 'code',
                        columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: errKindList,
                                displayMember: 'codeValue1',
                                valueMember: 'codeId',
                                dropDownWidth: 150
                            });
                        }
                    },
                    {
                        text: '발생시간', datafield: 'ymdhms', width: 180, columngroup: "errInfo", editable: true,
                        columntype: 'datetimeinput',
                        createeditor: function (row, value, editor) {
                            editor.jqxDateTimeInput({
                                formatString: 'yyyy-MM-dd HH:mm:ss',
                                showTimeButton: true,
                                showCalendarButton: true,
                                culture: 'ko-KR',
                                views: ['month', 'year', 'decade']
                            });
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            cell += (value == null || value.length == 0) ? value : value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) + ' '
                                + value.substr(8, 2) + ':' + value.substr(10, 2) + ":" + value.substr(12, 2);
                            cell += '</div>';
                            return cell;
                        },
                        initeditor: function (row, value, editor) {
                            if (value != null) {
                                editor.jqxDateTimeInput('setDate', parseDateString(value));
                            } else {
                                editor.jqxDateTimeInput('setDate', new Date());
                            }
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            return $.format.date(editor.jqxDateTimeInput('getDate'), 'yyyyMMddHHmmss');
                        },
                    },
                    {
                        text: '처리시간', datafield: 'processDate', width: 180, columngroup: "system",
                        columntype: 'datetimeinput',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {
                            editor.jqxDateTimeInput({
                                formatString: 'yyyy-MM-dd HH:mm:ss',
                                showTimeButton: true,
                                showCalendarButton: true,
                                culture: 'ko-KR',
                                views: ['month', 'year', 'decade']

                            });

                            editor.on('change', function (event) {

                                var rowindex = $errProcessGrid.jqxGrid('getselectedrowindex');
                                var rowdata = HmGrid.getRowData($errProcessGrid, rowindex);

                                var year = rowdata.ymdhms.substring(0, 4);
                                var month = rowdata.ymdhms.substring(4, 6);
                                var day = rowdata.ymdhms.substring(6, 8);
                                var hour = rowdata.ymdhms.substring(8, 10);
                                var minute = rowdata.ymdhms.substring(10, 12);
                                var second = rowdata.ymdhms.substring(12, 14);

                                var errDate = new Date(year, month - 1, day, hour, minute, second);
                                var selectedDate = event.args.date;

                                if (selectedDate != null) {
                                    editor.jqxDateTimeInput('setDate', selectedDate);
                                    if (errDate.getTime() > selectedDate.getTime()) {
                                        alert('처리시간은 통보시간보다 이전 일 수 없습니다.');
                                        editor.jqxDateTimeInput('setDate', new Date());
                                        event.preventDefault();
                                    }
                                }

                            });
                        },
                        initeditor: function (row, value, editor) {

                            if (value != null) {
                                editor.jqxDateTimeInput('setDate', parseDateString(value));
                            } else {
                                editor.jqxDateTimeInput('setDate', new Date());
                            }

                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            return $.format.date(editor.jqxDateTimeInput('getDate'), 'yyyyMMddHHmmss');
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            cell += (value == null || value.length == 0) ? value : value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) + ' '
                                + value.substr(8, 2) + ':' + value.substr(10, 2) + ":" + value.substr(12, 2);
                            cell += '</div>';
                            return cell;
                        }
                    },
                    {
                        text: '소요시간',
                        datafield: 'processNeedDate',
                        width: 120,
                        columngroup: "system",
                        editable: false,
                        cellsalign: 'right',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumTimerenderer_center,
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            var needDate = formatSecondsToHHMMSS(value);
                            cell += needDate;
                            cell += '</div>';
                            return cell;
                        }
                    },
                    {
                        text: '평가',
                        datafield: 'rate',
                        width: 120,
                        columngroup: "system",
                        editable: false,
                        cellsalign: 'center'
                    },
                    {
                        text: '점수',
                        datafield: 'score',
                        width: 120,
                        columngroup: "system",
                        editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center
                    },
                    {
                        text: '의견',
                        datafield: 'systemProcessMemo',
                        width: 120,
                        columngroup: "system",
                        cellsalign: 'right'
                    },
                    {
                        text: '처리시간', datafield: 'adminProcessDate', width: 180, columngroup: "admin",
                        columntype: 'datetimeinput',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {

                            editor.jqxDateTimeInput({
                                formatString: 'yyyy-MM-dd HH:mm:ss',
                                showTimeButton: true,
                                showCalendarButton: true,
                                culture: 'ko-KR',
                                views: ['month', 'year', 'decade']
                            });

                            editor.on('change', function (event) {

                                var rowindex = $errProcessGrid.jqxGrid('getselectedrowindex');
                                var rowdata = HmGrid.getRowData($errProcessGrid, rowindex);

                                var year = rowdata.ymdhms.substring(0, 4);
                                var month = rowdata.ymdhms.substring(4, 6);
                                var day = rowdata.ymdhms.substring(6, 8);
                                var hour = rowdata.ymdhms.substring(8, 10);
                                var minute = rowdata.ymdhms.substring(10, 12);
                                var second = rowdata.ymdhms.substring(12, 14);

                                var errDate = new Date(year, month - 1, day, hour, minute, second);
                                var selectedDate = event.args.date;

                                if (selectedDate != null && selectedDate!= "Invalid Date") {
                                    editor.jqxDateTimeInput('setDate', selectedDate);
                                    if (errDate.getTime() > selectedDate.getTime()) {
                                        alert('처리시간은 통보시간보다 이전 일 수 없습니다.');
                                        editor.jqxDateTimeInput('setDate', new Date());
                                        event.preventDefault();
                                    }
                                }else {
                                    editor.jqxDateTimeInput('setDate', new Date());
                                }

                            });

                        },
                        initeditor: function (row, value, editor) {

                            if (value != null) {
                                editor.jqxDateTimeInput('setDate', parseDateString(value));
                            } else {
                                editor.jqxDateTimeInput('setDate', new Date());
                            }

                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            return $.format.date(editor.jqxDateTimeInput('getDate'), 'yyyyMMddHHmmss');
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            cell += (value == null || value.length == 0) ? value : value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) + ' '
                                + value.substr(8, 2) + ':' + value.substr(10, 2) + ":" + value.substr(12, 2);
                            cell += '</div>';
                            return cell;
                        }
                    },
                    {
                        text: '소요시간',
                        datafield: 'adminProcessNeedDate',
                        width: 120,
                        columngroup: "admin",
                        editable: false,
                        cellsalign: 'right',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumTimerenderer_center,
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            var needDate = formatSecondsToHHMMSS(value);
                            cell += needDate;
                            cell += '</div>';
                            return cell;
                        }
                    },
                    {
                        text: '평가',
                        datafield: 'adminrate',
                        width: 120,
                        columngroup: "admin",
                        editable: false,
                        cellsalign: 'center'
                    },
                    {
                        text: '점수',
                        datafield: 'adminscore',
                        width: 120,
                        columngroup: "admin",
                        editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center
                    },
                    {text: '의견', datafield: 'adminProcessMemo', width: 120, columngroup: "admin", cellsalign: 'right'},
                    {text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden: true},
                    {text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center', hidden: true}
                ],
            columngroups: [
                {text: "장애 정보", align: "center", name: "errInfo"},
                {text: "유지보수 업체", align: "center", name: "system"},
                {text: "관리자", align: "center", name: "admin"}
            ]
        }, CtxMenu.COMM);

        $errProcessGrid.on('cellvaluechanged', function (event) {
            var args = event.args;
            var columnDataField = args.datafield; // 변경된 컬럼의 데이터 필드 가져오기
            var rowIndex = args.rowindex; // 변경된 행의 인덱스 가져오기
            var newValue = args.newvalue; // 변경된 값 가져오기
            if (columnDataField === 'processDate') {
                var data = HmGrid.getRowData($errProcessGrid, rowIndex);
                if (parseDateString(data.processDate).getTime() < parseDateString(data.ymdhms).getTime()) {
                    alert('처리시간은 통보시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errProcessGrid, rowIndex, "processDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }else if (columnDataField == 'adminProcessDate') {
                var data = HmGrid.getRowData($errProcessGrid, rowIndex);
                if (parseDateString(data.adminProcessDate).getTime() < parseDateString(data.ymdhms).getTime()) {
                    alert('처리시간은 통보시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errProcessGrid, rowIndex, "adminProcessDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }
        });

        Main.search();

    },

    /** init data */
    initData: function () {

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'IP'},
            success: function (result) {
                errKindList = result
            }
        });

    },

    /** 공통 파라미터 */
    getCommParams: function () {

        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },


    search: function () {
        Main.searchErrProcess();
    },


    delEvt: function () {

        var rowDataIdxes = HmGrid.getRowIdxes($errProcessGrid, "삭제 이벤트 목록을 선택해주세요.");
        var rowDataList = HmGrid.getRowDataList($errProcessGrid, rowDataIdxes);

        if (rowDataList == 0) {
            return
        }


        Server.post('/main/nms/slmMgmt/delSlmEtcList.do', {
            data: {list: rowDataList},
            success: function (data) {
                alert(data);
                Main.search();
            }
        });
    },


    addEvt: function () {

        var params = {
            code: 'IP',
            codeId: 'PROCESS'
        }

        $.ajax({
            url: ctxPath + '/main/popup/nms/pSlmEvtAdd.do',
            type: 'POST',
            data: JSON.stringify(params),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                HmWindow.openFit($("#pwindow"), "IP 전화 장애 등록", result, 500, 250);
            }
        });


    },

    saveEvt: function () {

        HmGrid.endRowEdit($errProcessGrid);

        var _processList = [];

        if (editProcessIds.length != 0) {
            $.each(editProcessIds, function (idx, value) {
                _processList.push($errProcessGrid.jqxGrid('getrowdatabyid', value));
                $.extend(_processList[idx], {
                    yyyymmdd : _processList[idx].ymdhms.substring(0,8),
                    hhmmss : _processList[idx].ymdhms.substring(8, _processList[idx].ymdhms.length),
                });

            });
        }


        if (_processList.length>0){

            console.log(_processList);

            Server.post('/main/nms/slmMgmt/saveSlmEtcList.do', {
                data: {processList: _processList, notiList: []},
                success: function (data) {
                    alert(data);
                    editProcessIds.length = 0;
                    Main.search();
                }
            });

        }

    },


    /** Real 조회 */
    searchErrProcess: function () {
        HmGrid.updateBoundData($errProcessGrid, ctxPath + '/main/nms/slmMgmt/getSlmErrStatusListetc_proc.do');
    },

    /** export 엑셀 */
    exportExcel: function () {


        var params = {
            calCnt: $("#calErrCnt").text(),
            calRate: $("#calErrRate").text(),
            calProcTimeSum: $("#calErrProcTimeSum").text(),
            calProcScoreSum: $("#calErrProcScoreSum").text(),
            calTotalTime: $("#calErrTimeSum").text(),
            calTotalScore: $("#calErrScoreSum").text()
        }

        HmUtil.exportGridSlm($errProcessGrid, "SLM 장애관리(IP 전화)", true, params);

    },
};


function parseDateString(dateString) {

    // 'yyyyMMddHHmmss' 형식의 문자열을 Date 객체로 변환
    var year = dateString.substr(0, 4);
    var month = dateString.substr(4, 2) - 1; // 월은 0부터 시작하므로 1을 빼줌
    var day = dateString.substr(6, 2);
    var hours = dateString.substr(8, 2);
    var minutes = dateString.substr(10, 2);
    var seconds = dateString.substr(12, 2);

    return new Date(year, month, day, hours, minutes, seconds);
}


function formatTimeFromHours(hours) {
    // 시간을 'HH:mm' 형식으로 포맷팅
    var formattedHours = Math.floor(hours).toString().padStart(2, '0');
    var minutes = Math.floor((hours % 1) * 60);
    var formattedMinutes = minutes.toString().padStart(2, '0');
    return formattedHours + ':' + formattedMinutes;
}


$(function () {
    Main.initData();
    Main.initVariable();
    Main.observe();
    Main.initDesign();
});


function formatSecondsToHHMMSS(seconds) {

    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var remainingSeconds = seconds % 60;

    var formattedHours = String(hours).padStart(2, '0');
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}


function parseDateString(dateString) {
    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    var hours = dateString.substring(8, 10);
    var minutes = dateString.substring(10, 12);
    var seconds = dateString.substring(12, 14);
    var formattedDateString = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
    return new Date(formattedDateString);
}



function formatDateToyyyyMMddHHmmss(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    return year + month + day + hours + minutes + seconds;
}



