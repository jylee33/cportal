var $errNoticeGrid, $errProcessGrid;

var editNotiIds = [], editProcessIds = [];
var errKindList = [];

var Main = {
    /** variable */
    initVariable: function () {
        $errNoticeGrid = $('#errNoticeGrid'), $errProcessGrid = $('#errProcessGrid');
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
            size: '50%',
            collapsible: false
        }, {size: '50%'}], 'auto', '100%');

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
                        {name: 'ymdhms', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'notiDate', type: 'string'},
                        {name: 'processDate', type: 'string'},
                        {name: 'notiNeedDate', type: 'number'},
                        {name: 'adminNotiNeedDate', type: 'number'},
                        {name: 'rate', type: 'string'},
                        {name: 'score', type: 'number'},
                        {name: 'systemNotiMemo', type: 'string'},
                        {name: 'adminNotiDate', type: 'string'},
                        {name: 'adminrate', type: 'string'},
                        {name: 'adminscore', type: 'number'},
                        {name: 'adminNotiMemo', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {
                        // $.extend(data, HmBoxCondition.getSrchParams());
                        $.extend(data, {
                            code: "INTERNET",
                            codeId: "NOTICE",
                            yyyymmdd: HmDate.getDateStr($("#sDate1"), 'yyyyMM')
                        });
                        return JSON.stringify(data);
                    },
                    loadComplete: function (record) {
                        editNotiIds.length = 0;
                        // $errProcessGrid.jqxGrid('clear');
                    }
                }
            ),
            editable: true,
            showtoolbar: true,
            showstatusbar: true,
            showaggregates: true,
            selectionmode: 'multiplerowsextended',
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장애 통보');
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
                        text: '통보시간', datafield: 'notiDate', width: 180, columngroup: "system",
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

                                var year = rowdata.ymdhms.substring(0, 4);
                                var month = rowdata.ymdhms.substring(4, 6);
                                var day = rowdata.ymdhms.substring(6, 8);
                                var hour = rowdata.ymdhms.substring(8, 10);
                                var minute = rowdata.ymdhms.substring(10, 12);
                                var second = rowdata.ymdhms.substring(12, 14);
                                var errDate = new Date(year, month - 1, day, hour, minute, second);

                                var selectedDate = event.args.date;

                                if (selectedDate!= null){
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

                            console.log(value);

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
                        datafield: 'notiNeedDate',
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
                        datafield: 'systemNotiMemo',
                        width: 120,
                        columngroup: "system",
                        cellsalign: 'right'
                    },
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


                                var year = rowdata.ymdhms.substring(0, 4);
                                var month = rowdata.ymdhms.substring(4, 6);
                                var day = rowdata.ymdhms.substring(6, 8);
                                var hour = rowdata.ymdhms.substring(8, 10);
                                var minute = rowdata.ymdhms.substring(10, 12);
                                var second = rowdata.ymdhms.substring(12, 14);

                                var errDate = new Date(year, month - 1, day, hour, minute, second);
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
                        text: '소요시간',
                        datafield: 'adminNotiNeedDate',
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
                    {text: '의견', datafield: 'adminNotiMemo', width: 120, columngroup: "admin", cellsalign: 'right'},
                    {text: 'Status', datafield: 'dispStatus', width: 80, cellsalign: 'center', hidden: true},
                    {text: "최종수집일시", datafield: "lastUpd", width: 160, cellsalign: 'center', hidden: true}
                ],
            columngroups: [
                {text: "장애 정보", align: "center", name: "errInfo"},
                {text: "유지보수 업체", align: "center", name: "system"},
                {text: "관리자", align: "center", name: "admin"}
            ]
        }, CtxMenu.COMM);

        $errNoticeGrid.on('rowdoubleclick', function (event) {
            // Main.searchErrProcess();
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
                        {name: 'ymdhms', type: 'string'},
                        {name: 'srcInfo', type: 'string'},
                        {name: 'code', type: 'string'},
                        {name: 'notiDate', type: 'string'},
                        {name: 'processDate', type: 'string'},
                        {name: 'processNeedDate', type: 'number'},
                        {name: 'adminNeedDate', type: 'number'},
                        {name: 'rate', type: 'string'},
                        {name: 'score', type: 'number'},
                        {name: 'systemProcessMemo', type: 'string'},
                        {name: 'adminNotiDate', type: 'string'},

                        {name: 'adminProcessDate', type: 'string'},
                        {name: 'adminProcessNeedDate', type: 'string'},
                        {name: 'adminrate', type: 'string'},
                        {name: 'adminscore', type: 'number'},
                        {name: 'adminProcessMemo', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {

                        $.extend(data, {
                            code: "INTERNET",
                            codeId: "PROCESS",
                            yyyymmdd: HmDate.getDateStr($("#sDate1"), 'yyyyMM')
                        });

                        return JSON.stringify(data);

                    },
                    loadComplete: function (record) {
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
                        editable: false,
                        cellsalign: 'center'
                    },
                    {
                        text: '장애종류',
                        datafield: 'code',
                        width: 250,
                        columngroup: "errInfo",
                        editable: false,
                        cellsalign: 'center'
                    },
                    {
                        text: '통보시간', datafield: 'adminNotiDate', width: 180, columngroup: "errInfo", editable: false,
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
                                if (selectedDate!=null){
                                    if (errDate.getTime() > selectedDate.getTime()) {
                                        alert('처리시간은 통보시간 보다 이전 일 수 없습니다.');
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

                                if (rowdata.adminNotiDate==null) {
                                    alert('통보시간을 설정해 주세요.');
                                    event.preventDefault();
                                }else {
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
                                        if (errDate.getTime() > selectedDate.getTime()) {
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
                if (parseDateString(data.notiDate).getTime() < parseDateString(data.ymdhms).getTime()) {
                    alert('통보시간은 발생시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errNoticeGrid, rowIndex, "notiDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }else if (columnDataField == 'adminNotiDate') {
                var data = HmGrid.getRowData($errNoticeGrid, rowIndex);
                if (parseDateString(data.adminNotiDate).getTime() < parseDateString(data.ymdhms).getTime()) {
                    alert('통보시간은 발생시간 이전 일수 없습니다.');
                    HmGrid.setColumnValue($errNoticeGrid, rowIndex, "adminNotiDate", formatDateToyyyyMMddHHmmss(new Date()));;
                }
            }
        });

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

        Main.search();

    },

    /** init data */
    initData: function () {

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'INTERNET'},
            success: function (result) {
                errKindList = result;
            }
        });

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
            HmWindow.openFit($("#pwindow"), "행정망 SLM 대상 이벤트 설정", result, 1000, 700);
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

        Server.post('/main/nms/slmMgmt/delSlmEtcList.do', {
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
                $.extend(_notiList[idx], {
                    yyyymmdd : _notiList[idx].ymdhms.substring(0,8),
                    hhmmss : _notiList[idx].ymdhms.substring(8, _notiList[idx].ymdhms.length),
                });
            });
        }

        if (editProcessIds.length != 0) {
            $.each(editProcessIds, function (idx, value) {
                _processList.push($errProcessGrid.jqxGrid('getrowdatabyid', value));
                $.extend(_processList[idx], {
                    yyyymmdd : _processList[idx].ymdhms.substring(0,8),
                    hhmmss : _processList[idx].ymdhms.substring(8, _processList[idx].ymdhms.length),
                });
            });
        }

        if (_notiList.length == 0 && _processList == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        Server.post('/main/nms/slmMgmt/saveSlmEtcList.do', {
            data: {notiList: _notiList, processList: _processList},
            success: function (data) {
                alert(data);
                editNotiIds.length = 0;
                editProcessIds.length = 0;
                Main.search();
            }
        });

    },

    /** Virtual 조회 */
    searchErrNotice: function () {
        HmGrid.updateBoundData($errNoticeGrid, ctxPath + '/main/nms/slmMgmt/getSlmErrStatusListetc_noti.do');
    },

    /** Real 조회 */
    searchErrProcess: function () {
        HmGrid.updateBoundData($errProcessGrid, ctxPath + '/main/nms/slmMgmt/getSlmErrStatusListetc_proc.do');
    },

    /** export 엑셀 */
    exportExcel: function () {
        HmUtil.exportMultiGrid($errNoticeGrid, $errProcessGrid, "SLM 장애 관리(인터넷 전화망)", true, null);
    },


    addEvt: function () {

        var params = {
            code: 'INTERNET',
            codeId: 'PROCESS'
        }

        $.ajax({
            url: ctxPath + '/main/popup/nms/pSlmEvtAdd.do',
            type: 'POST',
            data: JSON.stringify(params),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                HmWindow.openFit($("#pwindow"), "인터넷 전화망 장애 등록", result, 500, 300);
            }
        });


    },

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initData();
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



