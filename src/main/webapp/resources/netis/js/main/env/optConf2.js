var $chgGrid, $dataGrid;
var editChgIds = [], editEvtColorIds = [], editDataIds = [],
    editWorkIds = [], editHolidayIds = [], editDayOffIds = [];

var Main = {
    /** variable */
    initVariable: function () {
        $chgGrid = $('#chgGrid'), $dataGrid = $('#dataGrid');
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

            case 'btnSaveGrid':
                this.saveGridPageCount();
                break;

            case 'btnSearch_evtColor':
                this.searchEvtColorConf();
                break;
            case 'btnSave_evtColor':
                this.saveEvtColorConf()
                break;

            case 'btnSearch_chg':
                this.searchChgMgmtConf();
                break;
            case 'btnSave_chg':
                this.saveChgMgmtConf();
                break;
            case 'btnSearch_health':
                this.searchHealthChkConf();
                break;

            case 'btnSave_health':
                this.saveHealthChkConf();
                break;
            case 'btnSearch_data':
                this.searchDataMgmtConf();
                break;

            case 'btnAdd_data':
                this.addDataMgmtConf();
                break;
            case 'btnDel_data':
                this.delDataMgmtConf();
                break;
            case 'btnSave_data':
                this.saveDataMgmtConf();
                break;


            case 'btnSearch_work':
                this.searchWorkTimeConf();
                break;
            case 'btnAdd_work':
                this.addWorkTimeConf();
                break;
            case 'btnDel_work':
                this.delWorkTimeConf();
                break;
            case 'btnSave_work':
                this.saveWorkTimeConf();
                break;

            case 'btnSearch_day':
                this.searchHolidayOfWeek();
                break;

            case 'btnSave_day':
                this.saveHolidayOfWeek();
                break;

            case 'btnSearch_holiday':
                this.searchHolidayConf();
                break;
            case 'btnAdd_holiday':
                this.addHolidayConf();
                break;
            case 'btnDel_holiday':
                this.delHolidayConf();
                break;
            case 'btnSave_holiday':
                this.saveHolidayConf();
                break;


        }
    },


    /** init design */
    initDesign: function () {


        $("#pCronPage").jqxNumberInput({
            width: '100%',
            height: 21,
            spinButtons: true,
            spinButtonsStep: 1000,
            spinMode: 'simple',
            decimalDigits: 0,
            min: 0,
            max: 10000,
            inputMode: 'simple',
            decimal: 0
        });


        Server.get('/main/env/optConf/getGridOption.do', {
            success: function (result) {
                $('#pCronPage').val(parseInt(result[0].codeValue1));
            }
        });

        $('#eventLevel5DDB,#eventLevel4DDB,#eventLevel3DDB,#eventLevel2DDB,#eventLevel1DDB,#eventLevel0DDB, #eventLevelDDB').jqxDropDownButton({
            width: '100%',
            height: 20
        });

        $('#eventLevel5, #eventLevel4, #eventLevel3, #eventLevel2, #eventLevel1, #eventLevel0, #eventLevel').jqxColorPicker({
            width: 145,
            height: 150,
            colorMode: 'hue',
            color: 'a3a3a3'
        })
            .on('colorchange', function (event) {
                var targetId = event.currentTarget.id;
                var ddb = $('#' + targetId + "DDB");
                if (ddb == null) return;
                ddb.jqxDropDownButton('setContent', '#' + event.args.color.hex);
                ddb.css('background', '#' + event.args.color.hex);
            });


        HmGrid.create($chgGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/optConf/getChgMgmtConfList.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editChgIds.indexOf(rowid) == -1)
                            editChgIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editChgIds = [];
                    }
                }
            ),
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '변경관리설정');
            },
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    {text: '변경관리항목', datafield: 'itemName', editable: false},
                    {
                        text: '사용여부', datafield: 'useFlag', width: 100, columntype: 'custom',
                        createwidget: HmGrid.createCheckBox,
                        initWidget : function (row, column, value, cellElement) {
                        }
                    }
                ]
        });


        HmGrid.create($dataGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/optConf/getDataMgmtConfList.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editDataIds.indexOf(rowid) == -1)
                            editDataIds.push(rowid);
                        commit(true);
                    },
                    addrow: function (rowid, rowdata, commit) {
                        Server.post('/main/env/optConf/addDataMgmtConf.do', {
                            data: rowdata,
                            success: function () {
                                Main.searchDataMgmtConf();
                                $('#pwindow').jqxWindow('close');
                                alert('추가되었습니다.');
                            }
                        });
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editDataIds = [];
                    }
                }
            ),
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '데이터관리설정');
            },
            editable: true,
            editmode: 'selectedcell',
            columns:
                [
                    {text: '관리대상테이블', datafield: 'codeId', width: 130, editable: false},
                    {text: '테이블설명', datafield: 'memo', editable: false},
                    {
                        text: '보관일수',
                        datafield: 'codeValue1',
                        width: 80,
                        editable: true,
                        cellsalign: 'right',
                        columntype: 'numberinput',
                        initeditor: function (row, cellvalue, editor) {
                            editor.jqxNumberInput({decimalDigits: 0, min: 0});
                        }
                    },
                    {
                        text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'custom',
                        cellsalign: 'center',

                        createwidget: HmGrid.createCheckBox,

                        initWidget : function (row, column, value, cellElement) {
                        }
                    }
                ]
        });


        HmGrid.create($("#workGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/optConf/getWorkTimeConfList.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editWorkIds.indexOf(rowid) == -1)
                            editWorkIds.push(rowid);
                        commit(true);
                    },
                    addrow: function (rowid, rowdata, commit) {
                        Server.post('/main/env/optConf/addWorkTimeConf.do', {
                            data: rowdata,
                            success: function () {
                                Main.searchWorkTimeConf();
                                $('#pwindow').jqxWindow('close');
                                alert('추가되었습니다.');
                            }
                        });
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editWorkIds = [];
                    }
                }
            ),
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '업무시간설정');
            },
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    {
                        text: '시작시간',
                        datafield: 'codeValue1',
                        width: 100,
                        columntype: 'datetimeinput',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {
                            editor.jqxDateTimeInput({
                                formatString: 'HH:mm',
                                showTimeButton: false,
                                showCalendarButton: false
                            });
                        },
                        initeditor: function (row, value, editor) {
                            if (value.indexOf(':') != -1) {
                                return;
                            }
                            editor.jqxDateTimeInput('setDate', new Date(2015, 1, 1, value.substr(0, 2), value.substr(2, 2)));
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            return $.format.date(editor.jqxDateTimeInput('getDate'), 'HHmmss');
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            if (value == null || value.length < 4) return value;
                            if (value.indexOf(':') != -1) return value;
                            return value.substr(0, 2) + ':' + value.substr(2, 2);
                        }
                    },
                    {
                        text: '종료시간',
                        datafield: 'codeValue2',
                        width: 100,
                        columntype: 'datetimeinput',
                        cellsalign: 'center',
                        createeditor: function (row, value, editor) {
                            editor.jqxDateTimeInput({
                                formatString: 'HH:mm',
                                showTimeButton: false,
                                showCalendarButton: false
                            });
                        },
                        initeditor: function (row, value, editor) {
                            if (value.indexOf(':') != -1) {
                                return;
                            }
                            editor.jqxDateTimeInput('setDate', new Date(2015, 1, 1, value.substr(0, 2), value.substr(2, 2)));
                        },
                        geteditorvalue: function (row, cellvalue, editor) {
                            return $.format.date(editor.jqxDateTimeInput('getDate'), 'HHmmss');
                        },
                        cellsrenderer: function (row, columnfield, value) {
                            if (value == null || value.length < 4) return value;
                            if (value.indexOf(':') != -1) return value;
                            return value.substr(0, 2) + ':' + value.substr(2, 2);
                        }
                    },
                    {text: '설명', datafield: 'memo'},
                    {
                        text: '사용여부', datafield: 'useFlag', width: 100, columntype: 'custom',
                        createwidget: HmGrid.createCheckBox,

                        initWidget : function (row, column, value, cellElement) {
                        }
                    }
                ]
        });


        HmGrid.create($("#holidayGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'yyyymmdd', type: 'string'},
                        {name: 'ymd', type: 'date'},
                        {name: 'dayOfWeek', type: 'string'},
                        {name: 'memo', type: 'string'},
                        {name: 'dayFlg', type: 'int'}
                    ],
                    url: ctxPath + '/main/env/optConf/getHolidayConfList.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editHolidayIds.indexOf(rowid) == -1)
                            editHolidayIds.push(rowid);
                        commit(true);
                    },
                    addrow: function (rowid, rowdata, commit) {
                        Server.post('/main/env/optConf/addHolidayConf.do', {
                            data: rowdata,
                            success: function () {
                                Main.searchHolidayConf();
                                $('#pwindow').jqxWindow('close');
                                alert('추가되었습니다.');
                            }
                        });
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editHolidayIds = [];
                    }
                }
            ),
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '공휴일설정');
            },
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    {
                        text: '일자',
                        datafield: 'ymd',
                        dispalyfield: 'yyyymmdd',
                        width: 100,
                        cellsformat: 'yyyy-MM-dd',
                        cellsalign: 'center',
                        columntype: 'datetimeinput',
                        cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                            if (newvalue != oldvalue) {
                                $holidayGrid.jqxGrid('getrowdata', row).yyyymmdd = $.format.date(newvalue, 'yyyyMMdd');
                            }
                            ;
                        }
                    },
                    {text: '요일', datafield: 'dayOfWeek', width: 100, editable: false},
                    {text: '메모', datafield: 'memo'},
                    {
                        text: '사용여부', datafield: 'dayFlg', width: 100, columntype: 'custom',
                        createwidget: HmGrid.createCheckBox,
                        initWidget : function (row, column, value, cellElement) {
                        }
                    }
                ]
        });


        HmGrid.create($("#dayOffGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/optConf/getHolidayOfWeek.do',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editDayOffIds.indexOf(rowid) == -1)
                            editDayOffIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    loadComplete: function (records) {
                        editDayOffIds = [];
                    }
                }
            ),
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '휴일설정');
            },
            editable: true,
            editmode: 'selectedrow',
            columns:
                [
                    {text: '코드 ID', datafield: 'codeId', editable: false, hidden: true},
                    {text: '설정항목', datafield: 'memo', editable: false, hidden: true},
                    {
                        text: '요일',
                        datafield: 'disCode',
                        cellsalign: 'center', editable: false
                    },
                    {
                        text: '설정값',
                        datafield: 'codeValue1',
                        width: '50%',
                        cellsalign: 'right',
                        editable: true, hidden: true
                    },
                    {
                        text: '사용여부', datafield: 'useFlag', width: 100, columntype: 'custom', width: 81,
                        createwidget: HmGrid.createCheckBox,
                        initwidget : function () {
                            
                        }
                    }
                ]
        });


        // HmGrid.create($("#evtColorGrid"), {
        //     source: new $.jqx.dataAdapter(
        //         {
        //             datatype: 'json',
        //             url: ctxPath + '/main/env/optConf/getEvtColor.do',
        //             updaterow: function (rowid, rowdata, commit) {
        //                 if (editEvtColorIds.indexOf(rowid) == -1)
        //                     editEvtColorIds.push(rowid);
        //                 commit(true);
        //             }
        //         },
        //         {
        //             loadComplete: function (records) {
        //                 editEvtColorIds = [];
        //             }
        //         }
        //     ),
        //     pageable: false,
        //     showtoolbar: true,
        //     rendertoolbar: function (toolbar) {
        //         HmGrid.titlerenderer(toolbar, '이벤트 색상');
        //     },
        //     editable: true,
        //     editmode: 'selectedrow',
        //     columns:
        //         [
        //             {text: '이벤트 레벨', datafield: 'codeId', editable: false, hidden: false, cellsalign: 'center'},
        //             {text: '설정항목', datafield: 'memo', editable: true, hidden: true},
        //             {
        //                 text: '등급',
        //                 datafield: 'codeValue1',
        //                 cellsalign: 'center',
        //                 editable: true
        //             },
        //             {
        //                 text: '설정값', dataField: 'codeValue2', width: 220, columnType: "custom",
        //                 cellsrenderer: function (rowKey, column, value) {
        //                     return Main.getTextElementByColor(new $.jqx.color({hex: value.substring(1)}))[0].outerHTML;
        //                 },
        //                 // creates an editor depending on the "type" value.
        //                 createEditor: function (rowKey, cellvalue, editor, cellText, width, height) {
        //                     var dropDownButton = $("<div style='border: none;'><div style='padding: 5px;'><div class='colorPicker" + rowKey + "'></div></div></div>");
        //                     dropDownButton.appendTo(editor);
        //                     dropDownButton.jqxDropDownButton({width: '100%', height: '100%'});
        //                     var colorPicker = $($.find(".colorPicker" + rowKey));
        //                     colorPicker.jqxColorPicker({width: 220, height: 220});
        //                     colorPicker.on('colorchange', function (event) {
        //                         dropDownButton.jqxDropDownButton('setContent', Main.getTextElementByColor(event.args.color));
        //                     });
        //                     dropDownButton.jqxDropDownButton('setContent', Main.getTextElementByColor(new $.jqx.color({hex: "ffaabb"})));
        //                 },
        //                 // updates the editor's value.
        //                 initEditor: function (rowKey, cellvalue, editor, celltext, width, height) {
        //                     $($.find('.colorPicker' + rowKey)).val(cellvalue);
        //                 },
        //                 // returns the value of the custom editor.
        //                 getEditorValue: function (rowKey, cellvalue, editor) {
        //                     return $($.find('.colorPicker' + rowKey)).val();
        //                 }
        //             }
        //         ]
        // });


        Server.get('/main/env/optConf/getEvtColor.do', {
            success: function (result) {
                if (result) {
                    console.log(result)

                    $("#event5Input").val(result[0].codeValue1);
                    $("#event4Input").val(result[1].codeValue1);
                    $("#event3Input").val(result[2].codeValue1);
                    $("#event2Input").val(result[3].codeValue1);
                    $("#event1Input").val(result[4].codeValue1);
                    $("#event0Input").val(result[5].codeValue1);
                    $("#eventInput").val(result[6].codeValue1);

                    $('#eventLevel5').jqxColorPicker('setColor', result[0].codeValue2 || '#a3a3a3');
                    $('#eventLevel4').jqxColorPicker('setColor', result[1].codeValue2 || '#a3a3a3');
                    $('#eventLevel3').jqxColorPicker('setColor', result[2].codeValue2 || '#a3a3a3');
                    $('#eventLevel2').jqxColorPicker('setColor', result[3].codeValue2 || '#a3a3a3');
                    $('#eventLevel1').jqxColorPicker('setColor', result[4].codeValue2 || '#a3a3a3');
                    $('#eventLevel0').jqxColorPicker('setColor', result[5].codeValue2 || '#a3a3a3');
                    $('#eventLevel').jqxColorPicker('setColor', result[6].codeValue2 || '#a3a3a3');
                }
            }
        });


        HmWindow.create($('#pwindow'), 100, 100, 999);
    },

    /** init data */
    initData: function () {

    },

    /** 변경관리설정 */
    searchChgMgmtConf: function () {
        HmGrid.updateBoundData($chgGrid);
    },

    /** 업무시간설정 */
    searchWorkTimeConf: function () {
        HmGrid.updateBoundData($("#workGrid"));
    },

    saveChgMgmtConf: function () {
        HmGrid.endRowEdit($chgGrid);
        if (editChgIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editChgIds, function (idx, value) {
            _list.push($chgGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/optConf/saveChgMgmtConf.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editChgIds = [];
            }
        });
    },


    /** 데이터관리설정 */
    searchDataMgmtConf: function () {
        HmGrid.updateBoundData($dataGrid);
    },

    addDataMgmtConf: function () {
        $.get(ctxPath + '/main/popup/env/pDataMgmtConfAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '데이터관리 주기', result, 350, 235);
        });
    },

    delDataMgmtConf: function () {
        var rowIdx = HmGrid.getRowIdx($dataGrid, '데이터를 선택해주세요.');
        if (rowIdx === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $dataGrid.jqxGrid('getrowdata', rowIdx);
        Server.post('/main/env/optConf/delDataMgmtConf.do', {
            data: {codeId: rowdata.codeId},
            success: function (result) {
                $dataGrid.jqxGrid('deleterow', $dataGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveDataMgmtConf: function () {

        HmGrid.endRowEdit($dataGrid);
        if (editDataIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editDataIds, function (idx, value) {
            _list.push($dataGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/optConf/saveDataMgmtConf.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editDataIds = [];
            }
        });

    },


    searchHolidayOfWeek: function () {
        HmGrid.updateBoundData($("#dayOffGrid"), '/main/env/optConf/getHolidayOfWeek.do');
    },


    saveHolidayOfWeek: function () {


        HmGrid.endRowEdit($("#dayOffGrid"));
        if (editDayOffIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];

        $.each(editDayOffIds, function (idx, value) {
            _list.push($("#dayOffGrid").jqxGrid('getrowdatabyid', value));
        });


        Server.post('/main/env/optConf/saveDayOffConf.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                Main.searchHolidayOfWeek();
            }
        });

    },


    /** 휴일설정 */
    searchHolidayConf: function () {
        HmGrid.updateBoundData($("#holidayGrid"), '/main/env/optConf/getHolidayConfList.do');
    },

    addHolidayConf: function () {
        $.get(ctxPath + '/main/popup/env/pHolidayConfAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '공휴일 등록', result, 340, 210);
        });
    },

    delHolidayConf: function () {
        var rowIdx = HmGrid.getRowIdx($("#holidayGrid"), '데이터를 선택해주세요.');
        if (rowIdx === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $("#holidayGrid").jqxGrid('getrowdata', rowIdx);
        Server.post('/main/env/optConf/delHolidayConf.do', {
            data: {yyyymmdd: rowdata.yyyymmdd},
            success: function (result) {
                $("#holidayGrid").jqxGrid('deleterow', $("#holidayGrid").jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveHolidayConf: function () {
        HmGrid.endRowEdit($("#holidayGrid"));
        if (editHolidayIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = $("#holidayGrid").jqxGrid('getboundrows');

        Server.post('/main/env/optConf/saveHolidayConf.do', {
            data: {list: _list},
            success: function (result) {
                Main.searchHolidayConf();
                alert('저장되었습니다.');
                editHolidayIds = [];
            }
        });
    },


    addWorkTimeConf: function () {
        $.get(ctxPath + '/main/popup/env/pWorkTimeConfAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '업무시간 등록', result, 350, 240);
        });
    },

    delWorkTimeConf: function () {

        var rowIdx = HmGrid.getRowIdx($("#workGrid"), '데이터를 선택해주세요.');
        if (rowIdx === false) return;
        if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var rowdata = $("#workGrid").jqxGrid('getrowdata', rowIdx);
        Server.post('/main/env/optConf/delWorkTimeConf.do', {
            data: {codeId: rowdata.codeId},
            success: function (result) {
                $("#workGrid").jqxGrid('deleterow', $("#workGrid").jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },

    saveWorkTimeConf: function () {
        HmGrid.endRowEdit($("#workGrid"));
        if (editWorkIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editWorkIds, function (idx, value) {
            _list.push($("#workGrid").jqxGrid('getrowdatabyid', value));
        });

        Server.post('/main/env/optConf/saveWorkTimeConf.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editWorkIds = [];
            }
        });
    },


    /** EVENT COLOR 설정 */
    searchEvtColorConf: function () {

        Server.get('/main/env/optConf/getEvtColor.do', {
            success: function (result) {
                if (result) {
                    console.log(result)

                    $("#event5Input").val(result[0].codeValue1);
                    $("#event4Input").val(result[1].codeValue1);
                    $("#event3Input").val(result[2].codeValue1);
                    $("#event2Input").val(result[3].codeValue1);
                    $("#event1Input").val(result[4].codeValue1);
                    $("#event0Input").val(result[5].codeValue1);
                    $("#eventInput").val(result[6].codeValue1);

                    $('#eventLevel5').jqxColorPicker('setColor', result[0].codeValue2 || '#a3a3a3');
                    $('#eventLevel4').jqxColorPicker('setColor', result[1].codeValue2 || '#a3a3a3');
                    $('#eventLevel3').jqxColorPicker('setColor', result[2].codeValue2 || '#a3a3a3');
                    $('#eventLevel2').jqxColorPicker('setColor', result[3].codeValue2 || '#a3a3a3');
                    $('#eventLevel1').jqxColorPicker('setColor', result[4].codeValue2 || '#a3a3a3');
                    $('#eventLevel0').jqxColorPicker('setColor', result[5].codeValue2 || '#a3a3a3');
                    $('#eventLevel').jqxColorPicker('setColor', result[6].codeValue2 || '#a3a3a3');
                }
            }
        });

    },

    /** EVENT COLOR 설정 */
    saveEvtColorConf: function () {
        var _list = [];
        for (var i = 0; i < 6; i++) {
            _list.push({
                codeId: $("#eventCode" + i).val(),
                codeValue1: $("#event" + i + "Input").val(),
                codeValue2: '#' + $('#eventLevel' + i).jqxColorPicker('getColor').hex
            });
        }
        _list.push({
            codeId: $("#eventCode").val(),
            codeValue1: $("#eventInput").val(),
            codeValue2: '#' + $('#eventLevel').jqxColorPicker('getColor').hex
        });

        Server.post('/main/env/optConf/saveEvtColor.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
            }
        });

    },

    saveGridPageCount: function () {

        if ($("#pCronPage").val() == undefined || $("#pCronPage").val() == "") {
            alert("설정값을 입력해주세요.");
            return false;
        }

        Server.post('/main/env/optConf/saveGridDefault.do', {
            data: {codeValue1: $("#pCronPage").val()},
            success: function (result) {
                alert('저장되었습니다.');
            }
        });

    },


    getTextElementByColor: function (color) {
        if (color == 'transparent' || color.hex == "") {
            return $("<div style='text-shadow: none; position: relative; padding-bottom: 4px; margin-top: 4px;'>transparent</div>");
        }
        var element = $("<div style='text-shadow: none; position: relative; padding-bottom: 4px; margin-top: 4px;'>#" + color.hex + "</div>");
        var nThreshold = 105;
        var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
        var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';
        element.css('color', foreColor);
        element.css('background', "#" + color.hex);
        element.addClass('jqx-rc-all');
        return element;
    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});