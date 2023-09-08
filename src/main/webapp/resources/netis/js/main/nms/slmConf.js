var $errConfGrid;

var editIds = [];
var condList = [];
var levelList = [];

var yearList = [];
var slmList = [];

var Main = {

    /** variable */
    initVariable: function () {
        $errConfGrid = $('#errConfGrid');
        condList = [{label: '초과', value: 'MORE'}, {label: '이내', value: 'BELOW'}];
        levelList = [{label: '목표수준', value: '1'}, {label: '기본수준', value: '2'},
            {label: '최저허용', value: '3'}, {label: '불가수준', value: '4'}];

        this.initCondition();
    },

    initCondition: function () {

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
                this.addSlmConf();
                break;

            case 'btnErrKind':
                this.addSlmErr();
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

        HmGrid.create($errConfGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    },
                    contenttype: 'application/json;charset=utf8;',
                    datafields: [
                        {name: 'codeName', type: 'string'},
                        {name: 'codeLevel', type: 'string'},

                        {name: 'notiScore', type: 'number'},
                        {name: 'notiTime', type: 'number'},
                        {name: 'notiCond', type: 'string'},
                        {name: 'notiMemo', type: 'string'},

                        {name: 'procScore', type: 'number'},
                        {name: 'procTime', type: 'number'},
                        {name: 'procCond', type: 'string'},
                        {name: 'procMemo', type: 'string'},

                        {name: 'accuScore', type: 'number'},
                        {name: 'accuTime', type: 'number'},
                        {name: 'accuCond', type: 'string'},
                        {name: 'accuMemo', type: 'string'},
                    ]
                },
                {
                    formatData: function (data) {
                        var yyyy = "";
                        var code = "";
                        var params = {};
                        if ($("#sDate1").jqxDropDownList('getSelectedItem') != null) {
                            yyyy = $('#sDate1').jqxDropDownList('getSelectedItem').label;
                            code = $('#sNet').jqxDropDownList('getSelectedItem').value;
                        } else {
                            yyyy = '2023';
                            code = 'MAIN';
                        }

                        params = {
                            yyyy: yyyy,
                            code: code
                        };

                        $.extend(data, params);
                        return data;

                    },
                    loadComplete: function (record) {
                        editIds.length = 0;
                    }
                }
            ),
            editable: true,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '평가 기준 관리');
            },
            columns:
                [
                    {text: '코드 레벨', datafield: 'codeLevel', width: 130, editable: false, hidden: true},
                    {text: '기준명 ', datafield: 'codeName', width: 130, editable: false},

                    {text: '기준점수', datafield: 'notiScore', width: '8%', cellsalign: 'center', columngroup: "noti",},
                    {text: '기준시간', datafield: 'notiTime', width: '8%', cellsalign: 'center', columngroup: "noti",},
                    {
                        text: '조건',
                        datafield: 'notiCond',
                        width: '8%',
                        cellsalign: 'center',
                        columngroup: "noti",
                        columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: condList,
                                displayMember: 'label',
                                valueMember: 'value',
                                filterable: false,
                                selectedIndex: 0,
                                autoDropDownHeight: true,
                                dropDownWidth: 170
                            });
                        },
                        cellclassname: function (row, columnfield, value) {
                            if (value == undefined || value == '') {
                                return '';
                            }
                        }
                    },
                    {text: '설명', datafield: 'notiMemo', width: '8%', cellsalign: 'center', columngroup: "noti",},
                    {text: '기준점수', datafield: 'procScore', width: '8%', cellsalign: 'center', columngroup: "proc",},
                    {text: '기준시간', datafield: 'procTime', width: '8%', cellsalign: 'center', columngroup: "proc",},
                    {
                        text: '조건',
                        datafield: 'procCond',
                        width: '8%',
                        cellsalign: 'center',
                        columngroup: "proc",
                        columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: condList,
                                displayMember: 'label',
                                valueMember: 'value',
                                filterable: false,
                                selectedIndex: 0,
                                autoDropDownHeight: true,
                                dropDownWidth: 170
                            });
                        },
                        cellclassname: function (row, columnfield, value) {
                            if (value == undefined || value == '') {
                                return '';
                            }
                        }
                    },
                    {text: '설명', datafield: 'procMemo', width: '8%', cellsalign: 'center', columngroup: "proc",},

                    {text: '기준점수', datafield: 'accuScore', width: '8%', cellsalign: 'center', columngroup: "accu"},
                    {text: '기준시간', datafield: 'accuTime', width: '8%', cellsalign: 'center', columngroup: "accu"},
                    {
                        text: "조건",
                        datafield: "accuCond",
                        width: '8%',
                        cellsalign: 'center',
                        columngroup: "accu",
                        columntype: 'dropdownlist',
                        createeditor: function (row, value, editor) {
                            editor.jqxDropDownList({
                                source: condList,
                                displayMember: 'label',
                                valueMember: 'value',
                                filterable: false,
                                selectedIndex: 0,
                                autoDropDownHeight: true,
                                dropDownWidth: 170
                            });
                        },
                        cellclassname: function (row, columnfield, value) {
                            if (value == undefined || value == '') {
                                return '';
                            }
                        }
                    },
                    {text: "설명", datafield: "accuMemo", width: '8%', cellsalign: 'center', columngroup: "accu"}
                ],
            columngroups: [
                {text: "장애통보", align: "center", name: "noti"},
                {text: "장애처리", align: "center", name: "proc"},
                {text: "누적평가", align: "center", name: "accu"}
            ]
        }, CtxMenu.COMM);

        // Main.search();

    },

    /** init data */
    initData: function () {

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'YEAR_CONF'},
            success: function (result) {

                var now = new Date();
                var year = now.getFullYear().toString().padStart(4, '0');
                var list = [];

                result.forEach(function (value) {
                    if (parseInt(value.codeValue1) > parseInt(year)) {
                    } else {
                        list.push(value);
                    }
                });

                $('#sDate1').jqxDropDownList({
                    source: list,
                    displayMember: 'codeValue1',
                    valueMember: 'codeValue1',
                    width: 150, height: 21, selectedIndex: 0
                });
                $('#sDate1').jqxDropDownList('selectItem', year);
            }
        });


        $('#sNet').jqxDropDownList({
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                url: ctxPath + '/code/getCodeListByCodeKind.do',
                async: true,
                data: {codeKind: 'SLM_CONF'},
            }),
            displayMember: 'codeValue1',
            valueMember: 'codeId',
            width: 150, height: 21, selectedIndex: 0
        }).on('change', function (event) {
            Main.search();
        });

    },

    /** 공통 파라미터 */
    getCommParams: function () {

        $.extend(params, HmBoxCondition.getSrchParams());
        return params;

    },


    addSlmConf: function () {
        $.get(ctxPath + "/main/popup/nms/pEvtConfAdd.do", function (result) {
            HmWindow.openFit($("#pwindow"), "SLM 평가 관리", result, 800, 450);
        });
    },


    addSlmErr: function () {

        $.get(ctxPath + '/main/popup/nms/pSlmErrAdd.do', function (result) {
            HmWindow.open($('#pwindow'), 'SLM 장애 추가', result, 400, 350);
        });

    },


    search: function () {
        Main.searchErrConf();
    },


    delEvt: function () {

        var rowDataIdxes = HmGrid.getRowIdxes($errConfGrid, "삭제 이벤트 목록을 선택해주세요.");
        var rowDataList = HmGrid.getRowDataList($errConfGrid, rowDataIdxes);

        Server.post('/main/nms/slmMgmt/delSlmEvtList.do', {
            data: {list: rowDataList},
            success: function (data) {
                alert(data);
                Main.search();
            }
        });

    },


    saveEvt: function () {

        HmGrid.endRowEdit($errConfGrid);

        var _notiList = [];

        if (editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }

        if (editIds.length != 0) {
            $.each(editIds, function (idx, value) {
                console.log(value);
                _notiList.push($errConfGrid.jqxGrid('getrowdatabyid', value));
            });
        }

        if (_notiList.length > 0) {
            Server.post('/main/nms/slmMgmt/saveSlmConfListAll.do', {
                data: {
                    yyyy: $('#sDate1').jqxDropDownList('getSelectedItem').label,
                    code: $('#sNet').jqxDropDownList('getSelectedItem').value,
                    list: _notiList
                },
                success: function (data) {
                    alert(data);
                    // Main.search();
                }
            });
        }

    },

    /** Virtual 조회 */
    searchErrConf: function () {

        HmGrid.updateBoundData($errConfGrid, ctxPath + '/main/nms/slmMgmt/getSlmConfList.do');
    },


};


$(function () {
    Main.initData();
    Main.initVariable();
    Main.observe();
    Main.initDesign();
});