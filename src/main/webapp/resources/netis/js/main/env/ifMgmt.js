var $ifMgmt, $limitGrid, $statGrid, dtl_mngNo = -1, dtl_ifIdx = -1, dtl_profileNo = -1;
var editDevIds = [], editIfIds = [], editEvtCode_limitIds = [], editEvtCode_statIds = [];
var editRows = [];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var curDevData = null;
var codeMap = {
    devKindList: [],
    vendorList: [],
    vendorModelList: [],
    profileList: [],
    oidTmplList: [],
    cfgbackTmplList: [],
    devDynamicThrhldList: [{thrhldGrpNo: null, thrhldGrpNm: '미설정'}],
    ifDynamicThrhldList: [{thrhldGrpNo: null, thrhldGrpNm: '미설정'}]
};

var Main = {
    /** variable */
    initVariable : function() {
        $ifMgmt = $('#ifMgmt');
        $limitGrid = $('#limitGrid');
        $statGrid = $('#statGrid');
        this.initCondition();

        evtLevel1Text = $('#sEvtLevel1').val();
        evtLevel2Text = $('#sEvtLevel2').val();
        evtLevel3Text = $('#sEvtLevel3').val();
        evtLevel4Text = $('#sEvtLevel4').val();
        evtLevel5Text = $('#sEvtLevel5').val();

    },

    initCondition: function() {
        // search condition
        HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
    },

    /** add event */
    observe : function() {
        $('button').on('click', function(event) {
            Main.eventControl(event);
        });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case "btnSearch": this.search(); break;
            case "btnSave": this.save(); break;
            case "btnExcel": this.exportExcel(); break;
            case "btnEvtCodeEachSearch": this.searchEvtCodeEach(); break;
            case "btnEvtCodeEachSave": this.saveEvtCodeEach(); break;
            case "btnEvtCodeEachExcel": this.exportEvtCodeEachExcel(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.search();
        }
    },

    /** init design */
    initDesign : function() {
        HmJqxSplitter.createTree($('#mainSplitter'));

        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        HmJqxSplitter.create($('#ifEachSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
        Master.createGrpTab(Main.selectTree, {devKind1: 'DEV'});

        // 회선성능Grid
        Main.createifMgmt();

        $('#section').css('display', 'block');
    },

    createifMgmt : function() {
        // 본페이지 메인 그리드

        var source = {
            datatype: 'json',
            updaterow: function(rowid, rowdata, commit) {
                if(editRows.indexOf(rowid) == -1)
                    editRows.push(rowid);
                commit(true);
            },
            root: 'rows',

            beforeprocessing: function(data) {
                if(data != null)
                    source.totalrecords = data.resultData != null? data.resultData.totalrecords : 0;
            },
            sort: function() {
                $ifMgmt.jqxGrid('updatebounddata', 'sort');
            },
            filter: function() {
                $ifMgmt.jqxGrid('updatebounddata', 'filter');
            }
        };
        var adapter = new $.jqx.dataAdapter(
            source,
            {
                formatData: function(data) {
                    var params = Main.getCommParams();
                    $.extend(data, params);
                    return data;
                }
            }
        );

        // 메인 회선 그리드
        HmGrid.create($ifMgmt, {
            source: adapter,
            virtualmode: true,
            rendergridrows: function(params) {
                return adapter.records;
            },
            selectionmode: 'multiplerowsextended',
            editable: true,
            columns : [
                { text : '장비번호', datafield : 'mngNo', hidden:true, editable: false },
                { text : '그룹', datafield : 'grpName', pinned: true, width : 130, editable: false },
                { text : '장비명', datafield : 'disDevName', pinned: true, minwidth : 150, cellsrenderer: HmGrid.devNameRenderer, editable: false },
                { text : '장비IP', datafield : 'devIp', width : 120, editable: false },
                { text : '타입', datafield : 'devKind1', hidden: true, editable: false },
                { text : '종류', datafield : 'devKind2', width : 130, editable: false },
                { text : '제조사', datafield : 'vendor', width : 130, editable: false },
                { text : '모델', datafield : 'model', width : 130, editable: false },
                { text : '장비위치', datafield: 'devLocation', width: 130, hidden: true, editable: false },
                { text : '회선번호', datafield : 'ifIdx', cellsalign: 'right', width : 80, editable: false },
	            // { text : 'FLOW', datafield : 'flowPoll', cellsalign: 'center', width : 80 },
                { text : '회선명', datafield : 'ifName', width : 150, cellsrenderer: HmGrid.ifNameRenderer, editable: false },
                { text : '회선IP', datafield : 'ifIp', width : 120, editable: false },
                { text : '회선별칭', datafield : 'ifAlias', width : 130, editable: false },
                { text : '사용자회선명', datafield : 'userIfName', width : 130, editable: true },
                {
                    text: '유형',
                    datafield: 'userLineWidthPoll',
                    displayfield: 'userLineWidthPollStr',
                    width: 100,
                    editable: false,
                    columtype: 'dropdownlist',
                    createeditor: function (row, value, editor) {
                        var s = [
                            {label: '사용대역', value: 1},
                            {label: '원본대역', value: 0}
                        ];
                        editor.jqxDropDownList({source: s, autoDropDownHeight: true});
                    }
                },
                { text : '대역폭', datafield : 'lineWidth', cellsrenderer: HmGrid.unit1000renderer, width : 80 },
                { text : '상태', datafield : 'status', width : 80, cellsrenderer: HmGrid.ifStatusrenderer, editable: false },
                { text : '최종접속일자', datafield : 'ifStatusUpd', displayfield: 'disIfStatusUpd', hidden: ($('#gSiteName').val() !='HI'), width : 120, editable: false },
                { text : 'Subnet Mask', datafield : 'ifMask', width : 100, editable: false },
                {
                    text: '프로파일',
                    width: 120,
                    datafield: 'profileNo',
                    displayfield: 'profileNm',
                    columntype: 'dropdownlist',
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: codeMap.profileList,
                            displayMember: 'profileNm',
                            valueMember: 'profileNo',
                            dropDownWidth: 150
                        });
                    }
                },
                // {datafield: 'profileNm', hidden: true},
                {
                    text: '동적임계치',
                    width: 120,
                    datafield: 'thrhldGrpNo',
                    displayfield: 'thrhldGrpNm',
                    columntype: 'dropdownlist',
                    createeditor: function (row, value, editor) {
                        editor.jqxDropDownList({
                            source: codeMap.ifDynamicThrhldList,
                            displayMember: 'thrhldGrpNm',
                            valueMember: 'thrhldGrpNo',
                            dropDownWidth: 150
                        });
                    }
                },
                {
                    text: '성능수집',
                    datafield: 'perfPoll',
                    columngroup: 'poll',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '성능예측',
                    datafield: 'aiPoll',
                    columngroup: 'poll',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '경보설정',
                    datafield: 'evtPoll',
                    columngroup: 'poll',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '단문자',
                    datafield: 'isRecvPollSms',
                    columngroup: 'poll',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '회선장애',
                    datafield: 'statPoll',
                    columngroup: 'watch',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '헬스체크',
                    datafield: 'icmpPoll',
                    columngroup: 'watch',
                    width: 80,
                    columntype: 'checkbox'
                },
                {
                    text: '단문자',
                    datafield: 'isRecvWatchSms',
                    columngroup: 'watch',
                    width: 80,
                    columntype: 'checkbox'
                },
            ],
            columngroups: [
                {text: '성능', align: 'center', name: 'poll'},
                {text: '회선', align: 'center', name: 'watch'}
            ]

        }, CtxMenu.IF);
        $ifMgmt.off('bindingcomplete').on('bindingcomplete', function(event) {
            try {
                $(this).jqxGrid('selectrow', 0);
                dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
                dtl_ifIdx = $(this).jqxGrid('getcellvalue', 0, 'ifIdx');
                Main.predictShow($(this).jqxGrid('getcellvalue', 0, 'aiPoll'));
                Main.searchDtlInfo();
            } catch(e) {}
        })
        .off('rowdoubleclick').on('rowdoubleclick', function(event) {
            dtl_mngNo = event.args.row.bounddata.mngNo;
            dtl_ifIdx = event.args.row.bounddata.ifIdx;
            dtl_lineWidth = event.args.row.bounddata.lineWidth;
            Main.searchEvtCodeEach();
        });

        // 임계치 이벤트
        HmGrid.create($limitGrid, {
            source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    type: 'POST',
                    contenttype: 'application/json; charset=utf-8',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editEvtCode_limitIds.indexOf(rowid) == -1)
                            editEvtCode_limitIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        var rowdata = HmGrid.getRowData($ifMgmt);
                        if (rowdata != null) {
                            data.mngNo = rowdata.mngNo;
                            data.ifIdx = rowdata.ifIdx;
                            data.devKind2 = rowdata.devKind2;
                        }
                        else {
                            data.mngNo = -1;
                            data.devKind2 = '';
                        }
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                        editEvtCode_limitIds = [];
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '임계치 이벤트');
            },
            editable: true,
            pageable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                {text: 'EVTCOND', datafield: 'evtCond', width: 100, hidden: true, editable: false},
                {text: '항목', datafield: 'evtNm', minwidth: 150, editable: false},
                {
                    text: evtLevel1Text,
                    datafield: 'limitValue1',
                    width: 100,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor2
                },
                {
                    text: evtLevel2Text,
                    datafield: 'limitValue2',
                    width: 100,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor2
                },
                {
                    text: evtLevel3Text,
                    datafield: 'limitValue3',
                    width: 100,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor2
                },
                {
                    text: evtLevel4Text,
                    datafield: 'limitValue4',
                    width: 100,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor2
                },
                {
                    text: evtLevel5Text,
                    datafield: 'limitValue5',
                    width: 100,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor2
                },
                {text: '사용', datafield: 'useFlag', width: 60, columntype: 'checkbox'}
            ]
        // }, CtxMenu.COMM, 'evtCode_limit');
        }, CtxMenu.EACH_LIMIT_BATCH_SET, 'evtCode_limit');

        // 상태 이벤트
        HmGrid.create($statGrid, {
            source: new $.jqx.dataAdapter({
                    datatype: 'json',
                    type: 'POST',
                    contenttype: 'application/json; charset=utf-8',
                    updaterow: function (rowid, rowdata, commit) {
                        if (editEvtCode_statIds.indexOf(rowid) == -1)
                            editEvtCode_statIds.push(rowid);
                        commit(true);
                    }
                },
                {
                    formatData: function (data) {
                        var rowdata = HmGrid.getRowData($ifMgmt);
                        if (rowdata != null) {
                            data.mngNo = rowdata.mngNo;
                            data.ifIdx = rowdata.ifIdx;
                            data.devKind2 = rowdata.devKind2;
                        }
                        else {
                            data.mngNo = -1;
                            data.devKind2 = '';
                        }
                        return JSON.stringify(data);
                    },
                    loadComplete: function (records) {
                        editEvtCode_statIds = [];
                    }
                }
            ),
            showtoolbar: true,
            rendertoolbar: function (toolbar) {
                HmGrid.titlerenderer(toolbar, '상태 이벤트');
            },
            editable: true,
            pageable: false,
            selectionmode: 'multiplerowsextended',
            columns: [
                {text: 'CODE', datafield: 'evtCd', width: 100, hidden: true, editable: false},
                {text: '이벤트명', datafield: 'evtNm', minwidth: 150, editable: false},
                { text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 120, columntype: 'dropdownlist',
                    createeditor: function (row, value, editor) {

                        var s = [
                            { label: $('#sEvtLevel1').val(), value: 1 },
                            { label: $('#sEvtLevel2').val(), value: 2 },
                            { label: $('#sEvtLevel3').val(), value: 3 },
                            { label: $('#sEvtLevel4').val(), value: 4 },
                            { label: $('#sEvtLevel5').val(), value: 5 }
                        ];
                        editor.jqxDropDownList({
                            source: s,
                            autoDropDownHeight: true,
                            displayMember: 'label',
                            valueMember: 'value',
                            selectedIndex: 1
                        });
                    }
                },
                {
                    text: 'Count',
                    datafield: 'limitValue1',
                    width: 120,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                },
                {
                    text: 'Timeout(ms)',
                    datafield: 'limitValue2',
                    width: 120,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                },
                {
                    text: 'Interval(ms)',
                    datafield: 'limitValue3',
                    width: 120,
                    columntype: 'numberinput',
                    cellsalign: 'right',
                    initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
                },
                {text: '사용', datafield: 'useFlag', width: 60, columntype: 'checkbox'}
            ]
        // }, CtxMenu.COMM, 'evtCode_limit');
        }, CtxMenu.EACH_LIMIT_BATCH_SET, 'evtCode_limit');

    },

    /** init data */
    initData : function() {
        // 프로파일 dropDownList data
        Server.post('/main/nms/alarmMgmt2/getSystemCdProfileList.do', {
            data: { devKind1 : 'IF'} ,
            success: function (result) {
                codeMap.profileList = result;
            }
        });
    },
    /** 공통 파라미터 */
    getCommParams: function () {
        var params = Master.getGrpTabParams();
        $.extend(params, HmBoxCondition.getSrchParams());
        return params;
    },

    selectTree: function () {
        Main.search();
    },

    search : function(a) {
        var $grid = $ifMgmt;
        // $grid.jqxGrid("gotopage", 0); // jqxgrid의 paginginformation 초기화를 위해 호출
        HmGrid.updateBoundData($ifMgmt, ctxPath + '/main/env/ifMgmt/getIfMgmt.do');
    },

    /** 상세정보 */
    searchEvtCodeEach : function(a) {
        console.log("하단 개별 임계치 설정의 목록들 조회");
        var rowdata = HmGrid.getRowData($ifMgmt);
        var params = {};
        if (rowdata != null) {
            params.mngNo = rowdata.mngNo;
            params.ifIdx = rowdata.ifIdx;
            params.devKind2 = rowdata.devKind2;
        }
        else {
            params.mngNo = -1;
            params.devKind2 = '';
        }

        Server.post('/main/env/ifMgmt/getIfEvtCodeList.do', {
            data: params,
            success: function (result) {
                var _limitList = [], _statList = [];
                if (result != null) {
                    _limitList = result.filter(function (d) {
                        // return d.codeType == 1;
                        return d.evtCond == 1;
                    });
                    _statList = result.filter(function (d) {
                        // return d.codeType == 0;
                        return d.evtCond == 0;
                    })
                }
                // _statList 배열이 비어있으면 빈 배열로 변환
                if (_statList.length<2 && _statList[0].code==null && _statList[0].engName==null && _statList[0].evtName==null && _statList[0].evtNm==null) _statList=[];
                HmGrid.setLocalData($limitGrid, _limitList);
                HmGrid.setLocalData($statGrid, _statList);
            }
        });

    },

    save : function(a) {
        var result = HmGrid.endCellEdit($ifMgmt);
        if(result === false) return;

        if(editRows.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editRows, function(idx, value) {
            var _row = $ifMgmt.jqxGrid('getrowdatabyid', value);
            // _row.userPcIp = _row.userPcIp?.replace(/ /gi, "");//null체크
            _list.push(_row);
        });
        // IP 공백 제거
        //_list.forEach(value => value["userPcIp"] = value["userPcIp"].replace(/\s/gi, ''));

        Server.post('/main/env/ifMgmt/editIfMgmt.do', {
            data: { list: _list },
            success: function(data) {
                alert(data);
                editRows = [];
            }
        });

    },

    saveEvtCodeEach : function(a) {
        HmGrid.endRowEdit($limitGrid);
        HmGrid.endRowEdit($statGrid);
        if (editEvtCode_limitIds.length == 0 && editEvtCode_statIds.length == 0) {
            alert('변경된 데이터가 없습니다.');
            return;
        }
        var _list = [];
        $.each(editEvtCode_limitIds, function (idx, value) {
            var tmp = $limitGrid.jqxGrid('getrowdatabyid', value);
            tmp.useFlag = tmp.useFlag ? 1 : 0;
            if (tmp.limitValue1 == "null"){ tmp.limitValue1 = 0; }
            else{ tmp.limitValue1  = parseFloat(tmp.limitValue1); }
            if (tmp.limitValue2 == "null"){ tmp.limitValue2 = 0; }
            else{ tmp.limitValue2  = parseFloat(tmp.limitValue2); }
            if (tmp.limitValue3 == "null"){ tmp.limitValue3 = 0; }
            else{ tmp.limitValue3  = parseFloat(tmp.limitValue3); }
            if (tmp.limitValue4 == "null"){ tmp.limitValue4 = 0; }
            else{ tmp.limitValue4  = parseFloat(tmp.limitValue4); }
            if (tmp.limitValue5 == "null"){ tmp.limitValue5 = 0; }
            else{ tmp.limitValue5  = parseFloat(tmp.limitValue5); }
            _list.push(tmp);
        });
        $.each(editEvtCode_statIds, function (idx, value) {
            var tmp = $statGrid.jqxGrid('getrowdatabyid', value);
            tmp.useFlag = tmp.useFlag ? 1 : 0;
            if (tmp.limitValue1 == "null"){ tmp.limitValue1 = parseInt('0') }
            else{ tmp.limitValue1  = parseInt(tmp.limitValue1); }
            if (tmp.limitValue2 == "null"){ tmp.limitValue2 = parseInt('0') }
            else{ tmp.limitValue2  = parseInt(tmp.limitValue2); }
            if (tmp.limitValue3 == "null"){ tmp.limitValue3 = parseInt('0') }
            else{ tmp.limitValue3  = parseInt(tmp.limitValue3); }
            _list.push(tmp);
        });

        console.dir(_list);

        Server.post('/main/env/ifMgmt/saveIfEvtCode.do', {
            data: {list: _list},
            success: function (result) {
                alert('저장되었습니다.');
                editEvtCode_limitIds = [];
                editEvtCode_statIds = [];
            }
        });

    },

    /** export Excel */
    exportExcel: function() {
        HmUtil.exportGrid($ifMgmt, '회선현황', false);
    },
    exportEvtCodeEachExcel: function() {
        var rowdata = HmGrid.getRowData($ifMgmt);

        var disDevNameStr = '';
        var ifNameStr = '';
        if(rowdata != null){
            disDevNameStr = rowdata.disDevName+' ';
            ifNameStr = rowdata.ifName+' ';
        }

        var grids = [$limitGrid, $statGrid];
        var titles = ['임계치 이벤트', '상태 이벤트'];
        HmUtil.exportGridList(grids, titles, '['+disDevNameStr+']'+ ifNameStr+ '_회선 개별 임계치', false);
    },


    /** aiPoll == 1 이면 성능예측, 장애예측 탭 출력 0인경우 성능예측,장애예측탭 선택시 요약탭으로 변경 eq 11 12 하드코딩.  */
    predictShow: function(aiPoll) {
        var displayFlag = aiPoll == 1 ? 'block' : 'none';
        if(aiPoll == 0){
            if($('#dtlTab').val() == 2 || $('#dtlTab').val() == 3)
                $('#dtlTab').jqxTabs('select', 0);
        }
        $('#dtlTab .jqx-tabs-title:eq(3)').css('display', displayFlag);
        $('#dtlTab .jqx-tabs-title:eq(4)').css('display', displayFlag);
    },

    /** devMgmt참조 */
    limitInitEditor: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    /** 임계치  소수점 둘째자리 까지 가능하도록 함 */
    limitInitEditor2: function(row, cellvalue, editor) {
        editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

    },
    isEditable: function(row) {
        var rowdata = $statGrid.jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ) {
            return true;
        }
        return false;
    },
    isEditableClass: function (row, column, value, data) {
        var rowdata = $statGrid.jqxGrid('getrowdata', row);
        if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ) {
            return null;
        }
        return "disabledCell";
    },

};

function refreshIf() {
    HmGrid.updateBoundData($ifMgmt);
}

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});