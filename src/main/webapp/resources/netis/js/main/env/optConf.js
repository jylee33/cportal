var $chgGrid, $dayOffGrid, $dataGrid, $holidayGrid, $workGrid;
var editChgIds = [], editEvtColorIds = [], editDataIds = [],
    editWorkIds = [], editHolidayIds = [], editDayOffIds = [], editTreeHideIds = [];

var chgCounter = 1;

var Main = {
    /** variable */
    initVariable: function () {
        $chgGrid = $('#chgGrid'), $dayOffGrid=$("#dayOffGrid"), $dataGrid = $('#dataGrid'), $holidayGrid = $('#holidayGrid'), $workGrid = $('#workGrid');
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

            case 'btnSaveThemaConf':
                this.saveThemaConf();
                break;
            case 'btnSaveEtcConf':
                this.saveEtcConf();
                break;
            case 'btnSearch_evtColor':
                this.searchEvtColorConf();
                break;
            case 'btnSave_evtColor':
                this.saveEvtColorConf();
                break;

            case 'btnSearch_chg':
                this.searchChgMgmtConf();
                break;
            case 'btnSave_chg':
                this.saveChgMgmtConf();
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

            case 'btnSearch_treeHide':
                this.searchTreeHide();
                break;
            case 'btnSave_treeHide':
                this.saveTreeHide();
                break;

        }
    },


    /** init design */
    initDesign: function () {


        $("#pCronPage").jqxNumberInput({
            width: 100,
            height: 21,
            spinButtons: true,
            spinButtonsStep: 200,
            spinMode: 'simple',
            decimalDigits: 0,
            min: 0,
            max: 10000,
            inputMode: 'simple',
            decimal: 0
        });

        $("#pEventDelayTime").jqxNumberInput({
            width: 100,
            height: 21,
            spinButtons: true,
            spinButtonsStep: 1,
            spinMode: 'simple',
            decimalDigits: 0,
            min: 0,
            max: 300,
            inputMode: 'simple',
            decimal: 0
        });


        // Server.get('/main/env/optConf/getGridOption.do', {
        //     success: function (result) {
        //         $('#pCronPage').val(parseInt(result[0].codeValue1));
        //     }
        // });

        //테마 2022.10.11
        $('#pNetisThemaDefault').jqxRadioButton({ width:22, height: 21 , groupName: "thema"});
        $('#pNetisThemaDark').jqxRadioButton({width:22,  height: 21 , groupName: "thema"});
        $('#pNetisThemaWhite').jqxRadioButton({ width:22,  height: 21 , groupName: "thema"});

        $('#pMenuPositionLeft').jqxRadioButton({ width: 100, height: 21 , groupName: "position"});
        $('#pMenuPositionCenter').jqxRadioButton({ width: 100, height: 21 , groupName: "position"});

        Server.get('/main/env/optConf/getThemaConf.do', {
            success: function (result) {
                var themaId , positionId;
                $.each(result, function(idx, value) {
                    if(value.codeId == 'NETIS_THEMA'){
                        themaId = '#pNetisThema'+value.codeValue1.replace(/\b[a-z]/,letter=>letter.toUpperCase());
                    }
                    if(value.codeId == 'MENU_POSITION'){
                        positionId = '#pMenuPosition'+value.codeValue1.replace(/\b[a-z]/,letter=>letter.toUpperCase());
                    }
                });
                $(''+themaId+'').jqxRadioButton('check');
                $(''+positionId+'').jqxRadioButton('check');
            }
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'WEB_CONF'},
            success: function (result) {
                $.each(result, function(idx, value) {
                    if(value.codeId == 'GRID_DEFAULT'){
                        $('#pCronPage').val(parseInt(value.codeValue1));
                    }
                    else if (value.codeId == 'EVENT_DELAY_TIME') {
                        $('#pEventDelayTime').val(parseInt(value.codeValue1) / 1000);
                    }
                });
            }
        });

        // Server.get('/main/env/optConf/getEtcConf.do', {
        //     success: function (result) {
        //         $.each(result, function(idx, value) {
        //             if(value.codeId == 'GRID_DEFAULT'){
        //                 $('#pCronPage').val(parseInt(value.codeValue1));
        //             }
        //         });
        //     }
        // });

        $('#eventLevel5, #eventLevel4, #eventLevel3, #eventLevel2, #eventLevel1, #eventLevel0, #eventLevel').spectrum();


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
            // autoheight: true,
            pageable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '변경관리설정');
            },
            editable: true,
            editmode: 'selectedcell',
            columns:
                [
                    {text: '변경관리항목', datafield: 'itemName', editable: false},
                    {text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'}
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
                        },
                        rendered: HmGrid.changeTitleColor
                    },
                    {text: 'DB유형', datafield: 'codeValue4', width: 130, hidden: true},
                    {
                        text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox',  cellsalign: 'center',

                        // createwidget: HmGrid.createCheckBox,
                        // initWidget: function (row, column, value, cellElement) {
                        // }

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
            editmode: 'selectedcell',
            columns:
                [
                    {
                        text: '시작시간',
                        datafield: 'codeValue1',
                        width: '25%',
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
                            var disValue = value.substr(0, 2) + ':' + value.substr(2, 2);
                            return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-center-align'>" + disValue + "</div>";
                        },
                        rendered: HmGrid.changeTitleColor
                    },
                    {
                        text: '종료시간',
                        datafield: 'codeValue2',
                        width: '25%',
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
                        cellsrenderer: function (row, columnfield, value, defaultHTML) {
                            if (value == null || value.length < 4) return value;
                            if (value.indexOf(':') != -1) return value;
                            var disValue = value.substr(0, 2) + ':' + value.substr(2, 2);
                            return "<div style='margin-top: 6.5px; margin-right: 5px' class='jqx-center-align'>" + disValue + "</div>";
                        },
                        rendered: HmGrid.changeTitleColor
                    },
                    {
                        text: '설명', datafield: 'memo', width: '50%', editable: false,
                    },
                    {
                        text: '사용여부', datafield: 'useFlag', width: '14.9%', columntype: 'checkbox', hidden:true
                        // createwidget: HmGrid.createCheckBox,
                        // initWidget: function (row, column, value, cellElement) {
                        // }
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
            editmode: 'selectedcell',
            columns:
                [
                    {
                        text: '일자',
                        datafield: 'ymd',
                        dispalyfield: 'yyyymmdd',
                        width: '15%',
                        cellsformat: 'yyyy-MM-dd',
                        cellsalign: 'center',
                        editable: false,
                        //columntype: 'datetimeinput',
                        // cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                        //     if (newvalue != oldvalue) {
                        //         $holidayGrid.jqxGrid('getrowdata', row).yyyymmdd = $.format.date(newvalue, 'yyyyMMdd');
                        //     }
                        //     ;
                        // }
                    },
                    {text: '요일', datafield: 'dayOfWeek', width: '15%', editable: false, cellsalign: 'center'},
                    {
                        text: '메모', datafield: 'memo', width:'55%', rendered: HmGrid.changeTitleColor
                    },
                    {
                        text: '사용여부', datafield: 'dayFlg', width: '14.9%', columntype: 'checkbox',

                        // createwidget: HmGrid.createCheckBox,
                        // initWidget: function (row, column, value, cellElement) {
                        // }

                    }
                ]
        });


        HmGrid.create($dayOffGrid, {
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
            editmode: 'selectedcell',
            columns:
                [
                    {text: '코드 ID', datafield: 'codeId', editable: false, hidden: true},
                    {text: '설정항목', datafield: 'memo', editable: false, hidden: true},
                    {
                        text: '요일',
                        datafield: 'codeValue1',
                        width: '85%',
                        cellsalign: 'center', editable: false
                    },
                    {
                        text: '설정값',
                        datafield: 'disCode',
                        width: '50%',
                        cellsalign: 'right',
                        editable: false, hidden: true
                    },
                    {
                        text: '사용여부', datafield: 'useFlag', width: '14.9%', columntype: 'checkbox',
                        // createwidget: HmGrid.createCheckBox,
                        // initwidget: function () {
                        // }
                    }
                ]
        });

        HmGrid.create($("#treeHideGrid"), {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    url: ctxPath + '/main/env/optConf/getTreeList.do',
                    // updaterow: function (rowid, rowdata, commit) {
                    //     if (editTreeHideIds.indexOf(rowid) == -1)
                    //         editTreeHideIds.push(rowid);
                    //     commit(true);
                    // }
                },
                {
                    // loadComplete: function (records) {
                    //     editTreeHideIds = [];
                    // }
                }
            ),
            pageable: false,
            showtoolbar: true,
            height: "234px",
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '그룹 장비 숨김 설정');
            },
            editable: true,
            sortable: true,
            editmode: 'selectedcell',
            columns:
                [
                    {text: '번호', datafield: 'treeId', editable: false, hidden: true},
                    { text: '종류', datafield: 'treeType', editable: false, hidden: true },
                    { text: '구분', datafield: 'treeTypeNo', width: '20%', cellsalign: 'center', editable: false, cellsRenderer: Main.treeTypeRenderer },
                    { text: '트리 구분', datafield: 'treeName', width: '65%', cellsalign: 'center', editable: false },
                    { text: '장비 숨김', datafield: 'hideFlag', width: '14.9%', columntype: 'checkbox' }
                ]
        });

        Server.get('/main/env/optConf/getEvtColor.do', {
            success: function (result) {
                if (result) {

                    $("#event5Input").val(result[0].codeValue1);
                    $("#event4Input").val(result[1].codeValue1);
                    $("#event3Input").val(result[2].codeValue1);
                    $("#event2Input").val(result[3].codeValue1);
                    $("#event1Input").val(result[4].codeValue1);
                    $("#event0Input").val(result[5].codeValue1);
                    $("#eventInput").val(result[6].codeValue1);

                    $('#eventLevel5').spectrum('set', result[0].codeValue2 || '#a3a3a3');
                    $('#eventLevel4').spectrum('set', result[1].codeValue2 || '#a3a3a3');
                    $('#eventLevel3').spectrum('set', result[2].codeValue2 || '#a3a3a3');
                    $('#eventLevel2').spectrum('set', result[3].codeValue2 || '#a3a3a3');
                    $('#eventLevel1').spectrum('set', result[4].codeValue2 || '#a3a3a3');
                    $('#eventLevel0').spectrum('set', result[5].codeValue2 || '#a3a3a3');
                    $('#eventLevel').spectrum('set', result[6].codeValue2 || '#a3a3a3');
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

        console.log(_list);

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
            HmWindow.open($('#pwindow'), '데이터관리 주기', result, 350, 275);
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
        HmGrid.updateBoundData($dayOffGrid, '/main/env/optConf/getHolidayOfWeek.do');
    },


    saveHolidayOfWeek: function () {


        HmGrid.endRowEdit($dayOffGrid);
        if (editDayOffIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        var _list = [];

        $.each(editDayOffIds, function (idx, value) {
            _list.push($dayOffGrid.jqxGrid('getrowdatabyid', value));
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
            HmWindow.open($('#pwindow'), '공휴일 등록', result, 340, 201);
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
        var _list = [];
        $.each(editHolidayIds, function (idx, value) {
            _list.push($holidayGrid.jqxGrid('getrowdatabyid', value));
        });
        //var _list = $("#holidayGrid").jqxGrid('getboundrows');

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
        var _params = {
            workGrid: $workGrid
        };
        $.post(ctxPath + '/main/popup/env/pWorkTimeConfAdd.do', function (result) {
            HmWindow.open($('#pwindow'), '업무시간 등록', result, 350, 234, 'pwindow_init', _params);
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

                    $('#eventLevel5').spectrum('set', result[0].codeValue2 || '#a3a3a3');
                    $('#eventLevel4').spectrum('set', result[1].codeValue2 || '#a3a3a3');
                    $('#eventLevel3').spectrum('set', result[2].codeValue2 || '#a3a3a3');
                    $('#eventLevel2').spectrum('set', result[3].codeValue2 || '#a3a3a3');
                    $('#eventLevel1').spectrum('set', result[4].codeValue2 || '#a3a3a3');
                    $('#eventLevel0').spectrum('set', result[5].codeValue2 || '#a3a3a3');
                    $('#eventLevel').spectrum('set', result[6].codeValue2 || '#a3a3a3');
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
                codeValue2: '#' + $('#eventLevel' + i).spectrum("get").toHex()
            });
        }
        _list.push({
            codeId: $("#eventCode").val(),
            codeValue1: $("#eventInput").val(),
            codeValue2: '#' + $('#eventLevel').spectrum("get").toHex()
        });

        Server.post('/main/env/optConf/saveEvtColor.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
            }
        });

    },

    saveThemaConf: function () {

        var thema;
        if( $("#pNetisThemaDefault").jqxRadioButton('val') == true ){
            thema = 'default';
        }else if( $("#pNetisThemaDark").jqxRadioButton('val') == true ){
            thema = 'dark';
        }else{
            thema = 'white';
        }
        var menuPosition;
        if( $("#pMenuPositionLeft").jqxRadioButton('val') == true ){
            menuPosition = 'left';
        }else{
            menuPosition = 'center';
        }
        Server.post('/main/env/optConf/saveThemaConf.do', {
            data: {
                netisThema: thema,
                menuPosition: menuPosition,
            },
            success: function (result) {
                alert('저장되었습니다.\n변경된 설정은 재로그인 시 반영됩니다.');
            }
        });
    },

    saveEtcConf: function () {

        if ($("#pCronPage").val() == undefined || $("#pCronPage").val() == "") {
            alert("설정값을 입력해주세요.");
            return false;
        }

        if ($("#pEventDelayTime").val() == undefined || $("#pEventDelayTime").val() == "") {
            alert("이벤트 알람 유지시간을 입력해주세요.");
            return false;
        }

        var etcOptionList = [
            {codeKind:'WEB_CONF', codeId:'GRID_DEFAULT', value1: $("#pCronPage").val()},
            {codeKind:'WEB_CONF', codeId:'EVENT_DELAY_TIME', value1: parseInt($("#pEventDelayTime").val()) * 1000 }
        ];

        Server.post('/main/env/optConf/saveEtcConf.do', {
            data: {etcOptionList: etcOptionList,
            },
            success: function (result) {
                alert('저장되었습니다.');
            }
        });

    },

    /** 그룹 장비 숨김 */
    searchTreeHide: function () {
        HmGrid.updateBoundData($("#treeHideGrid"), '/main/env/optConf/getTreeList.do');
    },


    saveTreeHide: function () {
        var _list = [];
        var treeHideRows = $("#treeHideGrid").jqxGrid('getboundrows');

        $.each(treeHideRows, function (idx, value) {
            if (value["hideFlag"]) {
                _list.push(value["treeId"]);
            }
        });

        var _treeIdList = _list.toString();

        Server.post('/main/env/optConf/updateTreeList.do', {
            data: {treeIdList: _treeIdList},
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
    },

    treeTypeRenderer: function (row, datafield, value) {
        var cell = "<div style='margin-top: 7px; margin-left: 5px' class='jqx-center-align'>";
        switch (value.toString()) {
            case "0":
                cell += "공통";
                break;
            case "1":
                cell += "SMS";
                break;
            case "2":
                cell += "NMS";
                break;
            case "3":
                cell += "TMS";
                break;
            case "4":
                cell += "DBMS";
                break;
        }
        cell += "</div>";
        return cell;
    }

};


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});