var $codeGrid;
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var codeCols = [], evtCodeCols = [];
var editIds = [];
var Main = {
    /** variable */
    initVariable: function () {
        $codeGrid = $('#codeGrid');
        evtLevel1Text = $('#sEvtLevel1').val();
        evtLevel2Text = $('#sEvtLevel2').val();
        evtLevel3Text = $('#sEvtLevel3').val();
        evtLevel4Text = $('#sEvtLevel4').val();
        evtLevel5Text = $('#sEvtLevel5').val();

        codeCols = [
            {text: '코드 종류', datafield: 'codeKind', width: 300, editable: false},
            {text: '코드 ID', datafield: 'codeId', width: 200, editable: false},
            {text: 'value1', datafield: 'codeValue1', width: 200},
            {text: 'value2', datafield: 'codeValue2', width: 300},
            {text: 'value3', datafield: 'codeValue3', width: 200},
            {text: 'memo', datafield: 'memo', minwidth: 200}
        ];

        evtCodeCols = [
            {text: '프로파일 번호', datafield: 'profileNo', width: 80, cellsalign: 'center', editable: false},
            {text: '코드', datafield: 'code', width: 100, editable: false},
            {text: '이벤트명', datafield: 'evtName', width: 200},
            {text: '엔진명', datafield: 'engName', width: 100},
            {text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 120, columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    var s = [
                        { label: evtLevel1Text, value: 1 },
                        { label: evtLevel2Text, value: 2 },
                        { label: evtLevel3Text, value: 3 },
                        { label: evtLevel4Text, value: 4 },
                        { label: evtLevel5Text, value: 5 }
                    ];
                    editor.jqxDropDownList({
                        source: s,
                        autoDropDownHeight: true,
                        displayMember: 'label',
                        valueMember: 'value'
                    });
                }
            },
            {text: '설명', datafield: 'limitDesc', minwidth: 200},
            {text: 'value', datafield: 'limitValue', width: 100},
            {text: '주기(초)', datafield: 'cycleSec', width: 80/*, columntype: 'numberinput'*/},
            {text: '엔진 이벤트명', datafield: 'engEvtName', width: 120},
            {text: '이벤트 설명', datafield: 'evtMemo', width: 200},
            {text: '이벤트 타입', datafield: 'evtType', width: 100},
            {text: evtLevel1Text, datafield: 'limitValue1', width: 100},
            {text: evtLevel2Text, datafield: 'limitValue2', width: 100},
            {text: evtLevel3Text, datafield: 'limitValue3', width: 100},
            {text: evtLevel4Text, datafield: 'limitValue4', width: 100},
            {text: evtLevel5Text, datafield: 'limitValue5', width: 100},
            {text: '코드 타입', datafield: 'codeType', displayfield: 'disCodeType', width: 120, columntype: 'dropdownlist',
                createeditor: function (row, value, editor) {
                    var s = [
                        { label: '임계치', value: 0 },
                        { label: '상태', value: 1 }
                    ];
                    editor.jqxDropDownList({
                        source: s,
                        autoDropDownHeight: true,
                        displayMember: 'label',
                        valueMember: 'value'
                    });
                }
            },
            {text: '시스템 코드', datafield: 'sysCode', width: 100, editable: false }

        ]
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
            case 'btnSave':
                this.save();
                break;
            case 'btnAdd':
                this.add();
                break;
            case 'btnDel':
                this.del();
                break;
            case 'btnSearch':
                this.search();
                break;
        }
    },

    /** init design */
    initDesign: function () {

        HmWindow.create($('#pwindow'), 100, 100);

        // 코드 구분
        $('#cbCodeType').jqxDropDownList({ width : 110, height : 22, theme : jqxTheme,
            source: [
                { label: '공통 코드', value: 'CM_CODE10' },
                { label: '이벤트 코드', value: 'CM_EVT_CODE' }
            ],
            selectedIndex: 0, autoDropDownHeight: true
        }).on('change', function(event) {
           Main.search();
        });


        HmGrid.create($codeGrid, {
            source: new $.jqx.dataAdapter(
                {
                    datatype: 'json',
                    updaterow: function(rowid, rowdata, commit) {
                        if(editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    }
                }
            ),
            editable: true
        }, CtxMenu.COMM);

    },


    /** init data */
    initData: function () {
        Main.search();
    },
    search: function() {
        $codeGrid.jqxGrid('clear');
        editIds = [];
        $codeGrid.jqxGrid('source')._source.url = null;
        switch($('#cbCodeType').val()){
            case 'CM_CODE10':
                $codeGrid.jqxGrid({ columns: codeCols });
                HmGrid.updateBoundData($codeGrid, ctxPath + '/main/com/codeMgmt/getCodeList.do');
            break;
            case 'CM_EVT_CODE':
                $codeGrid.jqxGrid({ columns: evtCodeCols });
                HmGrid.updateBoundData($codeGrid, ctxPath + '/main/com/codeMgmt/getEvtCodeList.do');
            break;
        }
    },


    add: function(){
        var disCodeType = $('#cbCodeType').jqxDropDownList('getSelectedItem').value;
        var h;
        var params = {};
        switch($('#cbCodeType').val()){
            case 'CM_CODE10':
                params.item = codeCols;
                h = (codeCols.length * 36) + 40;
                break;
            case 'CM_EVT_CODE':
                params.item = evtCodeCols;
                h = (evtCodeCols.length * 30) + 40;
                break;
        }
        params.codeType = $('#cbCodeType').val();
        $.post(ctxPath + '/main/popup/com/pCodeAdd.do', function(result) {
            HmWindow.open($('#pwindow'), disCodeType+' 추가', result, 400, h, 'pwindow_init', params);
        });
    },
    del: function(){
        var rowIdx = HmGrid.getRowIdx($codeGrid, '데이터를 선택해주세요.');
        if(rowIdx === false) return;
        if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

        var url;
        switch($('#cbCodeType').val()){
            case 'CM_CODE10':
                url = '/main/com/codeMgmt/delCode.do'
                break;
            case 'CM_EVT_CODE':
                url = '/main/com/codeMgmt/delEvtCode.do'
                break;
        }

        var rowdata = $codeGrid.jqxGrid('getrowdata', rowIdx);
        Server.post(url, {
            data: rowdata,
            success: function(result) {
                $codeGrid.jqxGrid('deleterow', $codeGrid.jqxGrid('getrowid', rowIdx));
                alert('삭제되었습니다.');
            }
        });
    },
    save: function() {
        if(editIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editIds, function(idx, value) {
            _list.push($codeGrid.jqxGrid('getrowdatabyid', value));
        });
        var url;
        switch($('#cbCodeType').val()){
            case 'CM_CODE10':
                url = '/main/com/codeMgmt/saveCode.do'
                break;
            case 'CM_EVT_CODE':
                url = '/main/com/codeMgmt/saveEvtCode.do'
                break;
        }
        Server.post(url, {
            data: { list: _list },
            success: function(result) {
                alert('저장되었습니다.');
                editIds = [];
            }
        });

    },


}



$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});