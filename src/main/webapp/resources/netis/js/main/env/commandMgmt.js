var $commandGrid;
var Main = {
    /** variable */
    initVariable: function () {
        $commandGrid = $('#commandGrid');
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

    keyupEventControl: function (event) {
        if (event.originalEvent.keyCode == 13) {
            this.search();
        }
    },


    /** event handler */
    eventControl: function (event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch':
                this.search();
                break;
            case 'btnAdd':
                this.addCommand();
                break;
            case 'btnEdit':
                this.editCommand();
                break;
            case 'btnDel':
                this.delCommand();
                break;
        }
    },

    /** init design */
    initDesign: function () {
        HmGrid.create($commandGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json'
                },
                {
                    formatData: function (data) {
                        var sCmdName = $('#sCmdName').val();
                        if (sCmdName.length != 0)
                            data.sCmdName = sCmdName;
                        return data;
                    }
                }
            ),
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: 'cmdNo', datafield: 'cmdNo', hidden: true},
                {text: 'workerCd', datafield: 'workerCd', hidden: true},
                {text: '작업명', datafield: 'cmdName', width: 180},
                {text: '작업종류', datafield: 'workerCdStr', width: 130, cellsalign: 'center'},
                {text: 'commandMode', datafield: 'commandMode', hidden: true},
                {text: '실행조건', datafield: 'commandModeStr', width: 150, cellsalign: 'center'},
                {text: 'sendCharStr', datafield: 'sendCharStr', hidden: true},
                {text: '개행문자', datafield: 'sendCharStrStr', width: 100, cellsalign: 'center'},
                {text: 'MORE 문자열', datafield: 'moreStr', width: 150, cellsalign: 'center'},
                {text: 'Timeout(초)', datafield: 'timeOut', width: 80, cellsalign: 'right'},
                {text: '사용여부', datafield: 'useFlag', width: 80, columntype: 'checkbox'},
                {text: '계속실행', datafield: 'runType', width: 80, columntype: 'checkbox'},
                {text: '수정자', datafield: 'userName', width: 120, cellsalign: 'center'},
                {text: '변경일시', datafield: 'lastUpdStr', width: 140, cellsalign: 'center'},
                {text: '설명', datafield: 'cmdDesc'},
            ]
        }, CtxMenu.COMM);
    },

    /** init data */
    initData: function () {
        this.search();
    },

    /* ==========================================================
        버튼 이벤트
     ===========================================================*/
    search: function () {
        HmGrid.updateBoundData($commandGrid, ctxPath + '/main/env/commandMgmt/getCommandList.do');
    },

    addCommand: function () {
        $.post(ctxPath + '/main/popup/env/pCommandAdd_new.do',
            {action: 'A'},
            function (result) {
                HmWindow.open($('#pwindow'), "작업추가", result, 800, 502, 'pwindow_init', null);
            }
        );
    },

    editCommand: function () {

        var rowIdxes = HmGrid.getRowIdxes($commandGrid, '선택한 작업이 없습니다.');
        if (!rowIdxes) {
            return;
        } else if (rowIdxes.length != 1) {
            alert('하나의 작업만 수정할 수 있습니다.');
            return;
        }

        var rowData = HmGrid.getRowData($commandGrid, rowIdxes[0]);

        $.post(ctxPath + '/main/popup/env/pCommandAdd_new.do',
            {action: 'U'},
            function (result) {
                HmWindow.open($('#pwindow'), "작업수정", result, 800, 502, 'pwindow_init', rowData);
            }
        );
    },

    delCommand: function () {

        var rowIdxes = HmGrid.getRowIdxes($commandGrid, '선택한 작업이 없습니다.');

        if (!confirm('[' + rowIdxes.length + ']건의 작업을 삭제하시겠습니까?\n삭제후 해당 작업만 설정된 스케줄도 삭제됩니다.')) return;
        var _cmdNos = [];
        $.each(rowIdxes, function (idx, value) {
            var rowdata = $commandGrid.jqxGrid('getrowdata', value);
            _cmdNos.push({cmdNo: rowdata.cmdNo});
        });
        Server.post('/main/env/commandMgmt/delCommandList.do', {
            data: {dataList: _cmdNos},
            success: function (result) {
                if (result.delScheList == undefined || result.delScheList.length == 0) {
                    alert('삭제되었습니다.');
                } else {
                    alert('삭제되었습니다.\n' + result.delScheList + '건의 스케줄이 삭제 되었습니다.');
                }


                //tb_cli_cmd_link를 지우는과정에서 삭제된 스케줄정보를 rest호출해준다.
                var _delScheList = result.delScheList;
                var _delCronList = [];
                var _delReserveList = [];
                for (var i = 0; i < _delScheList.length; i++) {
                    var _item = _delScheList[i];
                    if (_item.scheType == 'C') {
                        _delCronList.push(parseInt(_item.scheNo));
                    } else {
                        _delReserveList.push(parseInt(_item.scheNo));
                    }
                }//for end(i)

                var _restParam = {};
                if (_delCronList.length > 0) {
                    _restParam.CRON = {
                        DELETE: _delCronList
                    }
                }
                if (_delReserveList.length > 0) {
                    _restParam.RESERVATION = {
                        DELETE: _delReserveList
                    }
                }
                ServerRest.reqCronTab(_restParam);
                Main.search();
            }//success()
        });//Server.post();
    }
}
$(function () {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});