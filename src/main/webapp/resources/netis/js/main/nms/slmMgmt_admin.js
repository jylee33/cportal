var $errNoticeGrid, $errProcessGrid;

var editNotiIds = [], editProcessIds = [];

var isGrid1Loaded = false;
var isGrid2Loaded = false;


var Main = {
    /** variable */
    initVariable: function () {

        $errNoticeGrid = $('#errNoticeGrid'), $errProcessGrid = $('#errProcessGrid');
        this.initCondition();
    },

    initCondition: function () {
        // search condition
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

            case 'btnSet':
                this.getEvtSlm();
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

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '45%',
            collapsible: false
        }, {size: '55%'}], 'auto', '100%');


        HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_H, [{
            size: '85%',
            collapsible: false
        }, {size: '15%'}], 'auto', '100%');


        HmGrid.create($errNoticeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editNotiIds.indexOf(rowid) == -1)
                            editNotiIds.push(rowid);
                        commit(true);
                    },
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        {name: 'seqNo', type: 'number'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'ymdhms', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'evtName', type: 'string'},

                        {name: 'devKind2', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'status', type: 'number'},
                        {name: 'dispStatus', type: 'string'},
                        {name: 'lastUpd', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'evtLevel', type: 'number'},

                        {name: 'notiDate', type: 'string'},
                        {name: 'rate', type: 'string'},
                        {name: 'score', type: 'number'},
                        {name: 'systemNotiMemo', type: 'string'},

                        {name: 'adminNotiDate', type: 'string'},
                        {name: 'adminRate', type: 'string'},
                        {name: 'adminScore', type: 'number'},
                        {name: 'adminNotiMemo', type: 'string'},

                        {name: 'notiNeedDate', type: 'number'},
                        {name: 'adminNotiNeedDate', type: 'number'},

                    ]
                },
                {
                    formatData: function (data) {

                        $.extend(data, {
                            code: "MAIN",
                            codeId: "NOTICE",
                            yyyymm: HmDate.getDateStr($("#sDate1"), 'yyyyMM')
                        });


                        return JSON.stringify(data);
                    },
                    loadComplete: function (record) {
                        isGrid1Loaded = true;
                        Main.checkGridsLoaded();
                        editNotiIds.length = 0;
                    }
                }
            ),
            pageable : false,
            editable: true,
            showtoolbar: true,
            showstatusbar: true,
            selectionmode: 'multiplerowsextended',
            showaggregates: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장애 통보');
            },
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장애종류', datafield: 'code', width: 130, columngroup: "errInfo", editable: false, hidden: true},
                    {text: '이벤트명', datafield: 'evtName', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장애대상', datafield: 'srcInfo', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장비명', datafield: 'devName', width: 150, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장비IP', datafield: 'devIp', width: 120, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '발생시간', datafield: 'ymdhms', width: 120, columngroup: "errInfo", editable: false ,cellsalign: 'center'},
                    {
                        text: '통보시간',
                        datafield: 'notiDate',
                        width: 180,
                        columngroup: "system",
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

                                var rowindex = $errNoticeGrid.jqxGrid('getselectedrowindex');
                                var rowdata = HmGrid.getRowData($errNoticeGrid, rowindex);
                                var errDate = new Date(rowdata.ymdhms);

                                var selectedDate = event.args.date;

                                if (selectedDate!=null){
                                    editor.jqxDateTimeInput('setDate', selectedDate);

                                    if (errDate.getTime() > selectedDate.getTime()) {
                                        alert('통보시간은 발생시간보다 이전 일 수 없습니다.');
                                        editor.jqxDateTimeInput('setDate', new Date());
                                        event.preventDefault();
                                    }
                                }

                            });
                        },
                        initeditor: function (row, value, editor) {

                            if (value!=null){
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
                        text: '소요시간', datafield: 'notiNeedDate', width: 120, columngroup: "system", editable: false,cellsalign: 'center',
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
                        cellsalign: 'center',
                    },
                    {
                        text: '점수', datafield: 'score', width: 120, columngroup: "system", editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center
                    },
                    {text: '의견', datafield: 'systemNotiMemo', width: 120, columngroup: "system"},
                    {
                        text: '통보시간', datafield: 'adminNotiDate', width: 180, columngroup: "admin",
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
                                var rowindex = $errNoticeGrid.jqxGrid('getselectedrowindex');
                                var rowdata = HmGrid.getRowData($errNoticeGrid, rowindex);
                                var errDate = new Date(rowdata.ymdhms);
                                var selectedDate = event.args.date;

                                if (selectedDate!=null){
                                    editor.jqxDateTimeInput('setDate', selectedDate);

                                    if (event.args.date!=null || event.args.date != undefined){
                                        if (errDate.getTime() > selectedDate.getTime()) {
                                            alert('통보시간은 발생시간보다 이전 일 수 없습니다.');
                                            editor.jqxDateTimeInput('setDate', new Date());
                                            event.preventDefault();
                                        }
                                    }
                                }
                            });
                        },

                        initeditor: function (row, value, editor) {
                            if (value!=null){
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
                        text: '소요시간', datafield: 'adminNotiNeedDate', width: 120, columngroup: "admin", editable: false,
                        aggregates: ['sum'],
                        cellsalign: 'center',
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
                        datafield: 'adminRate',
                        width: 120,
                        columngroup: "admin",
                        editable: false,
                        cellsalign: 'center',
                    },
                    {
                        text: '점수', datafield: 'adminScore', width: 120, columngroup: "admin", editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center
                    },
                    {text: '의견', datafield: 'adminNotiMemo', width: 120, columngroup: "admin"},
                    {text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden: true},
                    {text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center', hidden: true}
                ],
            columngroups: [
                {text: "장애 정보", align: "center", name: "errInfo"},
                {text: "유지보수 업체", align: "center", name: "system"},
                {text: "관리자", align: "center", name: "admin"}
            ]
        }, CtxMenu.COMM);

        $errNoticeGrid.on('rowclick', function (event) {
            var rowindex = $errNoticeGrid.jqxGrid('getselectedrowindex');
            $errProcessGrid.jqxGrid('selectrow', rowindex);
            $errProcessGrid.jqxGrid('ensurerowvisible', rowindex);
        });

        $errNoticeGrid.on('cellvaluechanged', function (event) {
            var args = event.args;
            var columnDataField = args.datafield; // 변경된 컬럼의 데이터 필드 가져오기
            var rowIndex = args.rowindex; // 변경된 행의 인덱스 가져오기
            var newValue = args.newvalue; // 변경된 값 가져오기
            if (columnDataField === 'notiDate') {
                var data = HmGrid.getRowData($errNoticeGrid, rowIndex);
                if (parseDateString(data.notiDate).getTime() < convertStringToDate(data.ymdhms).getTime()) {
                    alert('통보시간은 발생시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errNoticeGrid, rowIndex, "notiDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }else if (columnDataField == 'adminNotiDate') {
                var data = HmGrid.getRowData($errNoticeGrid, rowIndex);
                if (parseDateString(data.adminNotiDate).getTime() < convertStringToDate(data.ymdhms).getTime()) {
                    alert('통보시간은 발생시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errNoticeGrid, rowIndex, "adminNotiDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }
        });


        HmGrid.create($errProcessGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    type: 'post',
                    contenttype: 'application/json;charset=utf8;',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editProcessIds.indexOf(rowid) == -1)
                            editProcessIds.push(rowid);
                        commit(true);
                    },
                    datafields: [

                        {name: 'seqNo', type: 'number'},
                        {name: 'mngNo', type: 'number'},
                        {name: 'ymdhms', type: 'string'},
                        {name: 'grpName', type: 'string'},
                        {name: 'devName', type: 'string'},
                        {name: 'srcInfo', type: 'string'},

                        {name: 'evtName', type: 'string'},

                        {name: 'devKind2', type: 'string'},
                        {name: 'devIp', type: 'string'},
                        {name: 'status', type: 'number'},
                        {name: 'dispStatus', type: 'string'},
                        {name: 'lastUpd', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'evtLevel', type: 'number'},
                        {name: 'evtName', type: 'string'},

                        {name: 'adminNotiDate', type: 'string'},
                        {name: 'processDate', type: 'string'},
                        {name: 'rate', type: 'string'},
                        {name: 'score', type: 'number'},


                        {name: 'systemProcessMemo', type: 'string'},

                        {name: 'adminProcessDate', type: 'string'},
                        {name: 'adminRate', type: 'string'},
                        {name: 'adminScore', type: 'number'},
                        {name: 'adminProcessMemo', type: 'string'},
                        {name: 'adminProcessNeedDate', type: 'number'},
                        {name: 'processNeedDate', type: 'number'},
                    ]
                },
                {
                    formatData: function (data) {
                        $.extend(data, {
                            code: "MAIN",
                            codeId: "PROCESS",
                            yyyymm: HmDate.getDateStr($("#sDate1"), 'yyyyMM')
                        });
                        return JSON.stringify(data);
                    },
                    loadComplete: function (record) {

                        isGrid2Loaded = true;

                        Main.checkGridsLoaded();

                        editProcessIds.length = 0;

                    }
                }
            ),
            showtoolbar: true,
            editable: true,
            showstatusbar: true,
            showaggregates: true,
            pageable : false,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장애 처리');
            },
            columns:
                [
                    {text: '그룹명', datafield: 'grpName', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장애코드', datafield: 'code', width: 130, columngroup: "errInfo", editable: false, hidden: true},
                    {text: '이벤트명', datafield: 'evtName', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장애대상', datafield: 'srcInfo', width: 130, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장비명', datafield: 'devName', width: 150, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {text: '장비IP', datafield: 'devIp', width: 120, columngroup: "errInfo", editable: false, cellsalign : 'center'},
                    {
                        text: '통보시간', datafield: 'adminNotiDate', width: 120, columngroup: "errInfo", editable: false,
                        cellsalign: 'center',
                        cellsrenderer: function (row, columnfield, value) {
                            var cell = '<div style="text-align: center; overflow: hidden; padding-bottom: 2px; margin-top: 7px; margin-right: 5px; margin-left: 4px; -ms-text-overflow: ellipsis;">';
                            cell += (value == null || value.length == 0) ? value : value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6, 2) + ' '
                                + value.substr(8, 2) + ':' + value.substr(10, 2) + ":" + value.substr(12, 2);
                            cell += '</div>';
                            return cell;
                        }
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
                                var year = rowdata.adminNotiDate.substring(0, 4);
                                var month = rowdata.adminNotiDate.substring(4, 6);
                                var day = rowdata.adminNotiDate.substring(6, 8);
                                var hour = rowdata.adminNotiDate.substring(8, 10);
                                var minute = rowdata.adminNotiDate.substring(10, 12);
                                var second = rowdata.adminNotiDate.substring(12, 14);
                                var errDate = new Date(year, month - 1, day, hour, minute, second);
                                var selectedDate = event.args.date;
                                if (selectedDate!= null){
                                    editor.jqxDateTimeInput('setDate', selectedDate);
                                    if (event.args.date!=null){
                                        if (errDate.getTime() > event.args.date.getTime()) {
                                            alert('처리시간은 통보시간보다 이전 일 수 없습니다.');
                                            editor.jqxDateTimeInput('setDate', new Date());
                                            event.preventDefault();
                                        }
                                    }
                                }
                            });

                        },
                        initeditor: function (row, value, editor) {

                            if (value!=null){
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
                        text: '소요시간', datafield: 'processNeedDate', width: 120, columngroup: "system", editable: false,
                        cellsalign: 'center',
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
                        text: '평가', datafield: 'rate', width: 120, columngroup: "system", editable: false,
                        cellsalign: 'center',
                    },
                    {
                        text: '점수', datafield: 'score', width: 120, columngroup: "system", editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center

                    },
                    {text: '의견', datafield: 'systemProcessMemo', width: 120, columngroup: "system"},

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

                                var year = rowdata.adminNotiDate.substring(0, 4);
                                var month = rowdata.adminNotiDate.substring(4, 6);
                                var day = rowdata.adminNotiDate.substring(6, 8);
                                var hour = rowdata.adminNotiDate.substring(8, 10);
                                var minute = rowdata.adminNotiDate.substring(10, 12);
                                var second = rowdata.adminNotiDate.substring(12, 14);

                                var errDate = new Date(year, month - 1, day, hour, minute, second);
                                var selectedDate = event.args.date;

                                if (selectedDate!=null){
                                    editor.jqxDateTimeInput('setDate', selectedDate);

                                    if (event.args.date!=null) {
                                        if (errDate.getTime() > event.args.date.getTime()) {
                                            alert('처리시간은 통보시간 보다 이전 일 수 없습니다.');
                                            editor.jqxDateTimeInput('setDate', new Date());
                                            event.preventDefault();
                                        }
                                    }

                                }

                            });
                        },
                        initeditor: function (row, value, editor) {
                            if (value!=null){
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
                        cellsalign: 'center',
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
                        text: '평가', datafield: 'adminRate', width: 120, columngroup: "admin", editable: false,
                        cellsalign: 'center',
                    },
                    {
                        text: '점수', datafield: 'adminScore', width: 120, columngroup: "admin", editable: false,
                        cellsalign: 'center',
                        aggregates: ['sum'],
                        aggregatesrenderer: HmGrid.agg_sumcntrenderer_center
                    },
                    {text: '의견', datafield: 'adminProcessMemo', width: 120, columngroup: "admin"},

                    {text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden: true},
                    {text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center', hidden: true}
                ],
            columngroups: [
                {text: "장애 정보", align: "center", name: "errInfo"},
                {text: "유지보수 업체", align: "center", name: "system"},
                {text: "관리자", align: "center", name: "admin"}
            ]
        }, CtxMenu.COMM);


        $errProcessGrid.on('rowclick', function (event) {
            var rowindex = $errProcessGrid.jqxGrid('getselectedrowindex');
            $errNoticeGrid.jqxGrid('selectrow', rowindex);
            $errNoticeGrid.jqxGrid('ensurerowvisible', rowindex);
        });



        $errProcessGrid.on('cellvaluechanged', function (event) {
            var args = event.args;
            var columnDataField = args.datafield; // 변경된 컬럼의 데이터 필드 가져오기
            var rowIndex = args.rowindex; // 변경된 행의 인덱스 가져오기
            var newValue = args.newvalue; // 변경된 값 가져오기
            if (columnDataField === 'processDate') {
                var data = HmGrid.getRowData($errProcessGrid, rowIndex);
                if (parseDateString(data.processDate).getTime() < parseDateString(data.adminNotiDate).getTime()) {
                    alert('처리시간은 통보시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errProcessGrid, rowIndex, "processDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }else if (columnDataField == 'adminProcessDate') {
                var data = HmGrid.getRowData($errProcessGrid, rowIndex);
                if (parseDateString(data.adminProcessDate).getTime() < parseDateString(data.adminNotiDate).getTime()) {
                    alert('처리시간은 통보시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errProcessGrid, rowIndex, "adminProcessDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }
        });

    },

    /** init data */
    initData: function () {
        Main.search();
    },

    /** 공통 파라미터 */
    getCommParams: function () {
        // $.extend(params, {
        //     sIp: $('#sIp').val(),
        //     sDevName: $('#sDevName').val()
        // });
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },


    getEvtSlm: function () {

        $.get(ctxPath + "/main/popup/nms/pEvtAdminSet.do", function (result) {
            HmWindow.openFit($("#pwindow"), "행정망 SLM 대상 이벤트 설정", result, 1200, 700);
        });

    },

    search: function () {
        Main.searchErrNotice();
        Main.searchErrProcess();
    },


    delEvt: function () {

        var rowDataIdxes = HmGrid.getRowIdxes($errNoticeGrid, "삭제 이벤트 목록을 선택해주세요.");
        var rowDataList = HmGrid.getRowDataList($errNoticeGrid, rowDataIdxes);

        if (rowDataList.length == 0) {
            return;
        }

        if (!confirm('선택된 명령어를 삭제하시겠습니까?')) return;

        Server.post('/main/nms/slmMgmt/delSlmEvtList.do', {
            data: {list: rowDataList},
            success: function (data) {
                alert(data);
                Main.search();
            }
        });
    },


    saveEvt: function () {

        HmGrid.endRowEdit($errNoticeGrid);
        HmGrid.endRowEdit($errProcessGrid);

        var _notiList = [];
        var _processList = [];

        if (editNotiIds.length != 0) {
            $.each(editNotiIds, function (idx, value) {
                _notiList.push($errNoticeGrid.jqxGrid('getrowdatabyid', value));
            });
        }


        if (editProcessIds.length != 0) {
            $.each(editProcessIds, function (idx, value) {
                _processList.push($errProcessGrid.jqxGrid('getrowdatabyid', value));
            });
        }

        if (editProcessIds.length == 0 && editNotiIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }


        Server.post('/main/nms/slmMgmt/saveSlmEvtList.do', {
            data: {notiList: _notiList, processList: _processList},
            success: function (data) {
                alert(data);
                editNotiIds.length = 0;
                editProcessIds.length = 0;
                Main.search();
            }
        });
    },

    checkGridsLoaded: function () {

        if (isGrid1Loaded && isGrid2Loaded) {

            var notiNeedagg = $errNoticeGrid.jqxGrid('getcolumnaggregateddata', 'adminNotiNeedDate', ['sum']);
            console.log(notiNeedagg.sum);

            var notiscoreagg = $errNoticeGrid.jqxGrid('getcolumnaggregateddata', 'adminScore', ['sum']);

            var procNeedagg = $errProcessGrid.jqxGrid('getcolumnaggregateddata', 'adminProcessNeedDate', ['sum']);
            var procscoreagg = $errProcessGrid.jqxGrid('getcolumnaggregateddata', 'adminScore', ['sum']);

            var totalNeedAgg = notiNeedagg.sum + procNeedagg.sum;
            var totalScoreAgg = notiscoreagg.sum + procscoreagg.sum;

            // 전체 행 개수 가져오기
            var rows = $errProcessGrid.jqxGrid('getrows');
            var rowCount = rows.length;

            Server.post('/main/nms/slmMgmt/getRateList.do', {
                data: {code: "MAIN", codeId: "ACCUMULATE"},
                success: function (result) {

                    var levelTime1 = result[0].time * 60 * 60;
                    var levelTime2 = result[1].time * 60 * 60;
                    var levelTime3 = result[2].time * 60 * 60;

                    console.log(result);

                    console.log("===============");

                    console.log(totalNeedAgg)
                    console.log(totalNeedAgg/rowCount)

                    console.log(levelTime1)
                    console.log(levelTime2)
                    console.log(levelTime3)

                    if ((totalNeedAgg / rowCount) <= levelTime1) {
                        $("#calErrRate").text("목표수준(점수 : " + result[0].score + " )");
                    } else if (levelTime1 < (totalNeedAgg / rowCount) && (totalNeedAgg / rowCount) <= levelTime2) {
                        $("#calErrRate").text("기본수준(점수 : " + result[1].score + " )");
                    } else if (levelTime2 < (totalNeedAgg / rowCount) && (totalNeedAgg / rowCount) <= levelTime3) {
                        $("#calErrRate").text("최저허용(점수 : " + result[2].score + " )");
                    } else {
                        $("#calErrRate").text("불가수준(점수 : " + result[3].score + " )");
                    }

                    $("#calErrCnt").text(rowCount+" 건");

                    if (rowCount == 0) {

                        $("#calErrNotiTimeSum").text(formatSecondsToHHMMSS(0));
                        $("#calErrNotiScoreSum").text(0.0);

                        $("#calErrProcTimeSum").text(formatSecondsToHHMMSS(0));
                        $("#calErrProcScoreSum").text(0.0);

                        $("#calErrTimeSum").text(0.0);
                        $("#calErrScoreSum").text(0.0);

                    } else {
                        $("#calErrNotiTimeSum").text(formatSecondsToHHMMSS(notiNeedagg.sum));
                        $("#calErrNotiScoreSum").text(notiscoreagg.sum.toFixed(2));

                        $("#calErrProcTimeSum").text(formatSecondsToHHMMSS(procNeedagg.sum));
                        $("#calErrProcScoreSum").text(procscoreagg.sum.toFixed(2));

                        $("#calErrTimeSum").text(formatSecondsToHHMMSS(totalNeedAgg));
                        $("#calErrScoreSum").text(totalScoreAgg.toFixed(2));
                    }


                    isGrid2Loaded = false;
                    isGrid1Loaded = false;
                }
            });
        }

    },


    /** Virtual 조회 */
    searchErrNotice: function () {
        HmGrid.updateBoundData($errNoticeGrid, ctxPath + '/main/nms/slmMgmt/getSlmErrStatusList_noti.do');
    },

    /** Real 조회 */
    searchErrProcess: function () {
        HmGrid.updateBoundData($errProcessGrid, ctxPath + '/main/nms/slmMgmt/getSlmErrStatusList_proc.do');
    },

    /** export 엑셀 */
    exportExcel: function () {

        var params = {
            calCnt: $("#calErrCnt").text(),
            calRate: $("#calErrRate").text(),

            calNotiTimeSum: $("#calErrNotiTimeSum").text(),
            calNotiScoreSum: $("#calErrNotiScoreSum").text(),

            calProcTimeSum: $("#calErrProcTimeSum").text(),
            calProcScoreSum: $("#calErrProcScoreSum").text(),

            calTotalTime: $("#calErrTimeSum").text(),
            calTotalScore: $("#calErrScoreSum").text()
        }

        HmUtil.exportMultiGrid($errNoticeGrid, $errProcessGrid, '행정망 SLM 관리', false, params);

    },

    // l4f5StatusRenderer: function (row, datafield, value, defaulthtml, columnproperties, rowdata) {
    //     var clz = rowdata.status;
    //     switch (clz) {
    //         case 0 :
    //             clz = 'none';
    //             break;
    //         case 1 :
    //             clz = 'green';
    //             break;
    //         case 2 :
    //             clz = 'yellow';
    //             break;
    //         case 3 :
    //             clz = 'red';
    //             break;
    //         case 4 :
    //             clz = 'blue';
    //             break;
    //         case 5 :
    //             clz = 'gray';
    //             break;
    //     }
    //     return '<div class="jqx-center-align {0}" style="margin-top: 6px;">●</div>'.substitute('l4f5_status_' + clz);
    // },
};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
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

function convertStringToDate(dateString) {
    var parts = dateString.split(' ');
    var datePart = parts[0];
    var timePart = parts[1];
    var dateComponents = datePart.split('-');
    var year = parseInt(dateComponents[0]);
    var month = parseInt(dateComponents[1]) - 1; // 월은 0부터 시작하므로 1을 빼줍니다.
    var day = parseInt(dateComponents[2]);
    var timeComponents = timePart.split(':');
    var hour = parseInt(timeComponents[0]);
    var minute = parseInt(timeComponents[1]);
    var second = parseInt(timeComponents[2]);
    return new Date(year, month, day, hour, minute, second);
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


function refreshGrid() {
    Main.searchErrNotice();
    Main.searchErrProcess();
}