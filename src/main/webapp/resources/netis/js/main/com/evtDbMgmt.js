var $evtActionGrid;
var actionParam = null;
var editEvtIds = [];
var evtKindList = [];
var evtKind = null;


$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

var Main = {

    /** variable */
    initVariable: function () {
        $evtActionGrid = $('#evtActionGrid');
    },

    /** add event */
    observe: function () {

        $('button').bind('click', function (event) {
            Main.eventControl(event);
        });

        $("#sEvtAction, #sEvtDesc").bind('keydown', function (event) {
            if (event.keyCode == 13) {
                Main.searchAction();
            }
        });

    },

    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd':
                this.add();
                break;

            case 'btnSet':
                this.setCode();
                break;

            case 'btnSearchEvt':
                this.searchAction();
                break;


            case 'btnEditEvt':
                this.edit();
                break;

            case 'btnDelEvt':
                this.del();
                break;


        }
    },

    /** init design */
    initDesign: function () {

        HmWindow.create($('#pwindow'), 100, 100);


        $("#sEvtKind").jqxDropDownList({
            selectedIndex: 0, theme: jqxTheme,
            autoDropDownHeight: true,
            displayMember: 'codeValue1', valueMember: 'codeId'
        });

        Server.get('/code/getCodeListByCodeKind.do', {
            data: {codeKind: 'EVT_TYPE'},
            success: function (result) {
                $('#sEvtKind').jqxDropDownList({source: result, selectedIndex: 0});
            }
        });

        HmGrid.create($evtActionGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [
                        {name: 'codeNo', type: 'number'},
                        {name: 'code', type: 'string'},
                        {name: 'evtKind', type: 'string'},
                        {name: 'evtDesc', type: 'string'},
                        {name: 'action', type: 'string'}
                    ]
                },
                {
                    formatData: function (data) {


                        data.evtKind = evtKind;
                        data.evtDesc = $("#sEvtDesc").val();
                        data.action = $("#sEvtAction").val();

                        return data;

                    },
                }
            ),
            // selectionmode: 'multiplerowsextended',
            editable: false,
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '장애 지식 DB 조치 내역');
            },
            columns:
                [
                    {text: 'CODE NO', datafield: 'codeNo', width: 300, hidden: true},
                    {text: '장애 CODE', datafield: 'code', width: 300, hidden: true},
                    {text: '장애 유형', datafield: 'evtKind', width: '30%'},
                    {text: '장애 설명', datafield: 'evtDesc', width: '30%'},
                    {text: '조치 방법', datafield: 'action', width: '40%'}
                ]
        }, CtxMenu.COMM);


        $evtActionGrid.on('rowdoubleclick', function (event) {

            var rowIdx = event.args.rowindex;
            var rowData = $(this).jqxGrid('getrowdata', rowIdx);

            HmUtil.createPopup('/main/board/pEvtKnownDbContents.do?codeNo=' + rowData.codeNo, $('#hForm'), 'pNoticeBoardContents', 700, 300);

        });


        HmGrid.updateBoundData($evtActionGrid, ctxPath + '/main/com/evtDbMgmt/getEvtDbList.do');


    },


    /** init data */
    initData: function () {

    },


    searchAction: function () {

        evtKind = $('#sEvtKind').jqxDropDownList('getSelectedItem').label;
        HmGrid.updateBoundData($evtActionGrid, ctxPath + '/main/com/evtDbMgmt/getEvtDbList.do');

    },


    setCode: function () {

        $.post(ctxPath + '/main/popup/env/pEvtKnownSet.do',
            function (result) {
                HmWindow.openFit2($('#pwindow'), '장애 지식 DB 유형 설정', result, 350, 400, 'pwindow_init');
            }
        );

    },


    add: function () {

        HmUtil.createPopup('/main/board/pEvtKnownDbWrite.do', $('#hForm'), 'pNoticeBoardWrite2', 700, 350);

    },


    del: function () {


        var rowIdx = HmGrid.getRowIdx($evtActionGrid, "장애 지식 DB 데이타를 선택 해주세요.");
        var rowData = HmGrid.getRowData($evtActionGrid, rowIdx);

        if (confirm("삭제 하시겠습니까?") != true)
            return;

        Server.post('/main/com/evtDbMgmt/delEvtDb.do', {
            data: {codeNo: rowData.codeNo},
            success: function (result) {

                console.log(result);

                $.ajax({
                    type: "post",
                    url: $('#ctxPath').val() + '/file/deleteEvtDb.do',
                    data: {codeNo: rowData.codeNo},
                    dataType: "json",
                    success: function (jsonData) {
                        Main.searchAction();
                        alert("삭제 되었습니다");
                    }
                });

            }
        });
    },

    edit: function () {
        var idx = HmGrid.getRowIdx($evtActionGrid, "장애 지식 DB 데이타를 선택해 주세요.");
        var rowData = HmGrid.getRowData($evtActionGrid, idx);
        HmUtil.createPopup('/main/board/pEvtKnownDbEdit.do?codeNo=' + rowData.codeNo, $('#hForm'), 'pNoticeBoardWrite2', 700, 350);
    }


};

