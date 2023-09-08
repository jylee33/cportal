var $codeConfGrid, $tabs;
var editDevIds = [];

var Main = {
    /** variable */
    initVariable: function() {
        $codeConfGrid = $('#codeConfGrid');
        $tabs = $('#tabs');
    },

    /** add event */
    observe: function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl: function(event) {
        var curTarget = event.currentTarget;
        switch(curTarget.id) {
            case 'btnSave': Main.save(); break;
            case 'btnSearch': Main.search(); break;
            case 'btnDel': Main.del(); break;
            case 'btnAdd':Main.add();break;
        }
    },

    /** init design */
    initDesign: function() {
        $tabs.jqxTabs({ width: '100%', height: '100%',theme: 'ui-hamon-v1-tab-top'});

        HmGrid.create($codeConfGrid, {
            selectionmode: 'multiplerowsextended',
            editable: true,
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    datafields: [	// 필터기능이 정상동작을 안해서 추가함!
                        { name: 'codeKind', type: 'string' },
                        { name: 'codeId', type: 'string' },
                        { name: 'codeValue1', type: 'string' },
                        { name: 'codeValue2', type: 'string' },
                        { name: 'codeValue3', type: 'string' },
                        { name: 'codeValue4', type: 'string' },
                        { name: 'codeSort', type: 'number' },
                        { name: 'memo', type: 'string' },
                        { name: 'useFlag', type: 'number' },
                        { name: 'displayFlag', type: 'number' },
                    ],
                    updaterow: function (rowid, rowdata, commit) {
                        if (editDevIds.indexOf(rowid) == -1)
                            editDevIds.push(rowid);
                        commit(true);
                    },
                },
                {
                    loadComplete: function (records) {
                        editDevIds = [];
                    }
                }
            ),
            columns:
                [
                    {text: 'CodeKind', datafield: 'codeKind', minwidth: 300, editable: false},
                    {text: 'CodeId', datafield: 'codeId', width: 200, editable: false},
                    {text: 'CodeValue1', datafield: 'codeValue1', width: 200},
                    {text: 'CodeValue2', datafield: 'codeValue2', width: 200},
                    {text: 'CodeValue3', datafield: 'codeValue3', width: 200},
                    {text: 'CodeValue4', datafield: 'codeValue4', width: 200},
                    {text: 'CodeSort', datafield: 'codeSort', width: 200},
                    {text: 'Memo', datafield: 'memo', width: 200},
                    {text: 'UseFlag', datafield: 'useFlag',type: 'number', width: 80, columntype: 'checkbox', filtertype: 'bool'},
                    {text: 'DisplayFlag', datafield: 'displayFlag',type: 'number', width: 80, columntype: 'checkbox', filtertype: 'bool'}
                ]
        });

    },

    /** init data */
    initData: function() {
        this.search();
    },

    search: function () {
        HmGrid.updateBoundData($codeConfGrid, ctxPath + '/engineer/codeConf/getCodeList.do');
    },
    save: function () {
        HmGrid.endCellEdit($codeConfGrid);
        if (editDevIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editDevIds, function (idx, value) {
            _list.push($codeConfGrid.jqxGrid('getrowdatabyid', value));
        });

        Server.post('/engineer/codeConf/saveCode.do', {
            data: {list: _list},
            success: function (result) {
                if (result == 'SUCCESS') {
                    alert('저장되었습니다.');
                    editDevIds = [];
                    Main.search();
                } else {
                    alert(result);
                    Main.search();
                }
            }
        });
    },
    del: function () {
        var rowIdxes = HmGrid.getRowIdxes($codeConfGrid);
        if (rowIdxes === false) {
            alert('선택된 행이 없습니다.');
            return;
        }

        if (!confirm('[' + rowIdxes.length + ']건의 항목을 삭제하시겠습니까?')) return;
        var linkData =[];
        $.each(rowIdxes, function (idx, value) {
            var tmp = $codeConfGrid.jqxGrid('getrowdata', value);
            var obj = {
                codeKind: tmp.codeKind,
                codeId: tmp.codeId,
            };
            linkData.push(obj);
        });

        Server.post('/engineer/codeConf/deleteCode.do', {
            data: {list: linkData},
            success: function (result) {
                alert("삭제되었습니다.");
                Main.search();
            }
        });
    },
    add: function () {
        $.get(ctxPath + '/engineer/popup/pCodeConfAdd.do', function(result) {
            HmWindow.open($('#pwindow'), '코드추가', result, 600, 285, 'pwindow_init','');
        });
    }

};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});