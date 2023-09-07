var $dataGrid;
var curRptItem = null;
var DRPT_CONST = {
    CTRL_TYPE: {
        Chapter: 'Chapter',
        DynamicText: 'DynamicText',
        Table: 'Table',
        Image: 'Image',
        Chart: 'Chart'
    },

    CTRL_COND: {
        Text: 'Text', DEV: 'DEV', IF: 'IF', GRP: 'GRP', RECVGRP: 'RECVGRP'
    },

    CTRL_ID: {
        global_ifState: 2715
    }
};
var Main = {
    ctrlList: null,
    curGrpNo: 0,

    /** variable */
    initVariable : function() {
        $dataGrid = $('#dataGrid');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnSearch': Main.searchData($('#sDrptCtrl').val()); break;
            case 'btnTimeSet': Main.setupReport(); break;
            case 'btnMove_up': Main.moveUp(); break;
            case 'btnMove_dn': Main.moveDown(); break;
            case 'btnAdd': Main.addData(); break;
            case 'btnDel': Main.delData(); break;
            case 'btnSave': Main.saveData(); break;
            case 'btnCodeConf': Main.codeConf(); break;
        }
    },

    initDesign: function() {
        // 보고서 항목
        HmDropDownList.create($('#sDrptCtrl'), {
            source: [], displayMember: 'ctrlNm', valueMember: 'ctrlId', autoDropDownHeight: false,
            width: 300
        });
        $('#sDrptCtrl').on('change', function(event) {
            var ctrlId = $(this).val();
            Main.searchData(ctrlId);
        });

        $('#sDrptType').on('change', function(event) {
            $('#sDrpt, #sDrptCtrl').jqxDropDownList('clearSelection');

            // 보고서 유형 변경시 컨트롤 목록 재구성
            Main.searchDrpt();
            Main.searchCtrl();
        });

        // 보고서 목록
        HmDropDownList.create($('#sDrpt'), {
            source: [], displayMember: 'drptNm', valueMember: 'drptNo', autoDropDownHeight: false,
            width: 200
        });

        // 보고서 유형
        HmDropDownList.create($('#sDrptType'), {
            source: [
                {label: 'NMS 월간보고서', value: 'NMS_MONTHLY'}
            ], width: 200
        });
        $('#sDrptType').val('NMS_MONTHLY');

        HmGrid.create($dataGrid, {
            source: new $.jqx.dataAdapter({
                datatype: 'json'
            }),
            pageable: false,
            editable: true,
            columns: []
        });

    },

    initData: function() {

    },

    // 보고서 목록 조회
    searchDrpt: function() {
        var drptType = $('#sDrptType').val();
        if(drptType == 'ACCOUNT_MONTHLY') {
            $('#dataZone').css('display', 'block');
            $('#dataGrid').css('display', 'none');
        }
        else {
            $('#dataZone').css('display', 'none');
            $('#dataGrid').css('display', 'block');
        }

        Server.post('/hyundaiCar/rpt/dynamicRpt/getDRptList.do', {
            data: {drptType: $('#sDrptType').val()},
            success: function(result) {
                $('#sDrpt').jqxDropDownList('source', result);
            }
        });
    },

    // 보고서 컨트롤 목록 조회
    searchCtrl: function() {
        Server.post('/main/rpt/dynamicRpt/getDRptCtrlList.do', {
            data: {drptType: $('#sDrptType').val()},
            success: function(result) {
                // 사용자 정의 데이터 입력 컨트롤만 표시 (ex: isUserData=1)
                for(var n = result.length, i = n-1; i >= 0; i--) {
                    if(result[i].isUserData == 0) delete result[i];
                }
                $('#sDrptCtrl').jqxDropDownList('source', result);
            }
        });
    },

    addData: function() {
        var ctrlItem = $('#sDrptCtrl').jqxDropDownList('getSelectedItem');
        var ctrlCond = ctrlItem.originalItem.ctrlCond;
        if(ctrlCond == DRPT_CONST.CTRL_COND.DEV) {
            Main.addCondDev();
        }
        else if(ctrlCond == DRPT_CONST.CTRL_COND.IF) {
            Main.addCondIf();
        }
        else if(ctrlCond == DRPT_CONST.CTRL_COND.GRP) {
            Main.addCondGrp();
        }
        else if(ctrlCond == DRPT_CONST.CTRL_COND.RECVGRP) {
            Main.addCondRecvGrp();
        }
        else {
            if(Main.getIsDataZone()) return;

            $dataGrid.jqxGrid('addrow', null, {});
        }
    },

    delData: function() {
        var grid = Main.getDataGrid();
        if(grid != null) {
            var rowdata = HmGrid.getRowData(grid);
            if(rowdata == null) {
                alert('데이터를 선택하세요.');
                return;
            }
            if(!confirm('선택된 데이터를 삭제하시겠습니까?')) return;
// debugger;
            grid.jqxGrid('deleterow', rowdata.uid);
        }
    },

    resetData: function() {
        $dataGrid.jqxGrid('clear');
    },

    searchData: function(ctrlId) {
        var drptNo = $('#sDrpt').val() || '';
        if(drptNo == '') {
            alert('보고서를 선택하세요.');
            return;
        }
        if(ctrlId == null) {
            alert('보고서 항목을 선택하세요.');
            return;
        }

        var drptType = $('#sDrptType').val();

        if(drptType == 'NMS_MONTHLY') {
            $('#dataZone').empty().load('/main/popup/rpt/pDRptCtrlData.do',
                {drptNo: drptNo, ctrlId: ctrlId},
                function (response, status, xhr) {
                    if(response.trim() == 'NOTFOUND') {
                        $('#dataZone').css('display', 'none');
                        $('#dataGrid').css('display', 'block');
                        $dataGrid.jqxGrid('columns', drpt_ctrl_col[ctrlId]);
                        Server.post('/main/rpt/dynamicRptData/getDrptUserDataList.do', {
                            data: {drptNo: drptNo, ctrlId: ctrlId, dataKind: ''},
                            success: function(result) {
                                if(result.length == 0) {
                                    $dataGrid.jqxGrid('source')._source.localdata = null;
                                    $dataGrid.jqxGrid('updateBoundData', 'data');
                                }
                                else {
                                    var cols = $dataGrid.jqxGrid('columns').records.filter(function(d) {return d.editable == true;});
                                    var dynCols = cols.map(function(d) { return d.datafield; });

                                    $.each(result, function(idx, item) {
                                        var jsonDynInfo = JSON.parse(item.dynInfo.replace(/\&quot\;/ig,'"'));
                                        $.extend(item, jsonDynInfo);
                                    });

                                    HmGrid.setLocalData($dataGrid, result);
                                }
                            }
                        });
                    }
                    else {
                        $('#dataZone').css('display', 'block');
                        $('#dataGrid').css('display', 'none');
                    }
                }
            );
        }
        else {
            $dataGrid.jqxGrid('columns', drpt_ctrl_col[ctrlId]);
            Server.post('/main/rpt/drptData/getDrptUserDataList.do', {
                data: {drptNo: drptNo, ctrlId: ctrlId, dataKind: ''},
                success: function(result) {
                    if(result.length == 0) {
                        $dataGrid.jqxGrid('source')._source.localdata = null;
                        $dataGrid.jqxGrid('updateBoundData', 'data');
                    }
                    else {
                        var cols = $dataGrid.jqxGrid('columns').records.filter(function(d) {return d.editable == true;});
                        var dynCols = cols.map(function(d) { return d.datafield; });

                        $.each(result, function(idx, item) {
                            var jsonDynInfo = JSON.parse(item.dynInfo.replace(/\&quot\;/ig,'"'));
                            $.extend(item, jsonDynInfo);
                        });

                        HmGrid.setLocalData($dataGrid, result);
                    }
                }
            });
        }
    },

    getIsDataZone: function() {
        var isDataZone = $('#dataZone').css('display') == 'block';
        return isDataZone;
    },

    getDataGrid: function() {
        var grid = Main.getIsDataZone()? $('div#dataZone div[id$="_dataGrid"][role="grid"]:first') : $dataGrid;
        return grid;
    },

    saveData: function() {
        var drptNo = $('#sDrpt').val() || '';
        if(drptNo == '') {
            alert('보고서를 선택하세요.');
            return;
        }
        var ctrlId = $('#sDrptCtrl').val();
        if(ctrlId == null) {
            alert('보고서 항목을 선택하세요.');
            return;
        }

        // 설정화면 예외적으로 분리작업한 경우 공통적으로 PMain.saveData() 함수에 저장 로직 구현 후 호출하도록 작업함.
        if(this.getIsDataZone()) {
            PMain.saveData();
            return;
        }

        var rows = $dataGrid.jqxGrid('getboundrows');
        var list = [];
        // 그룹사 > NMS등록현황, 수신자그룹에 항목에 대해서는 모든 컬럼을 동적컬럼으로 생성
        var cols = $dataGrid.jqxGrid('columns').records.filter(function(d) {return $.inArray(ctrlId, ['293','343']) !== -1? true : d.editable == true;});
        var dynCols = cols.map(function(d) { return d.datafield; });
        
        $.each(rows, function(idx, item) {
            var newItem = {
                dataId: item.dataId || -1,
                sortIdx: idx+1,
                mngNo: item.hasOwnProperty('mngNo')? item.mngNo : 0,
                ifIdx: item.hasOwnProperty('ifIdx')? item.ifIdx : 0,
                codeId: null
            };
            var dynInfo = {};
            for(var x in dynCols) {
                dynInfo[dynCols[x]] = item[dynCols[x]] || '';
            }
            newItem.dynInfo = JSON.stringify(dynInfo);
            list.push(newItem);
        });

        Server.post('/main/rpt/drptData/saveDrptUserData.do', {
            data: {
                drptNo: drptNo,
                ctrlId: ctrlId,
                list: list
            },
            success: function(result) {
                Main.searchData(ctrlId);
                alert('저장되었습니다.');
            }
        });
    },



    /**
     * 보고서의 선택항목이 변경될 시 보고서 조건값을 셋팅
     */
    setCurRptItem: function() {
        if(curRptItem != null) {
            curRptItem.isChapter = $('#isChapter').is(':checked')? 1 : 0;
            curRptItem.isPageBreak = $('#isPageBreak').is(':checked')? 1 : 0;
            curRptItem.chapter = $('#chapter').val();
            if(curRptItem.ctrlType == DRPT_CONST.CTRL_TYPE.DynamicText) {
                curRptItem.drptItemCondList = [{condKey: 'Text', condVal: $('#summaryText').val()}];
            }
            else if(curRptItem.ctrlType == DRPT_CONST.CTRL_TYPE.Image) {
                var obj = $('#uploadImage');
                if(obj.attr('src') != null) {
                    curRptItem.drptItemCondList = [
                        {condKey: 'Image', condVal: obj.attr('src')}
                    ];
                    obj.attr('src', null);
                }
            }
            else {
                if(curRptItem.ctrlCond == DRPT_CONST.CTRL_COND.DEV) {
                    var devRows = $('#condDevGrid').jqxGrid('getboundrows');
                    var devList = [];
                    if(devRows.length) {
                        if(curRptItem.ctrlId == DRPT_CONST.CTRL_ID.global_ifState) {
                            $.each(devRows, function(idx, devItem) {
                                devList.push({condKey: DRPT_CONST.CTRL_COND.DEV, condVal: devItem.mngNo,
                                    etc: JSON.stringify({country: devItem.country, corporation: devItem.corporation})});
                            });
                        }
                        else {
                            $.each(devRows, function(idx, devItem) {
                                devList.push({condKey: DRPT_CONST.CTRL_COND.DEV, condVal: devItem.mngNo});
                            });
                        }
                    }
                    curRptItem.drptItemCondList = devList;
                }
                else if(curRptItem.ctrlCond == 'IF') {  // 컨트롤의 조건이 'IF'인 경우
                    var ifRows = $('#condIfGrid').jqxGrid('getboundrows');
                    var ifList = [];
                    if(ifRows.length) {
                        $.each(ifRows, function(idx, ifItem) {
                            ifList.push({condKey: 'IF', condVal: ifItem.mngNo + '_' + ifItem.ifIdx});
                        });
                    }
                    curRptItem.drptItemCondList = ifList;
                }
            }

            $('#confGrid').jqxGrid('updaterow', curRptItem.uid, curRptItem);
        }
    },

    searchConfGrid: function() {
        HmGrid.updateBoundData($('#confGrid'), ctxPath + '/main/rpt/dynamicRpt/getDRptItemList.do');
    },

    /** 보고서 항목 위로 이동 */
    moveUp: function() {
        var grid = Main.getDataGrid();
        if(grid == null) return;

        var rowdata = HmGrid.getRowData(grid);
        if(rowdata == null) {
            alert('데이터를 선택하세요.');
            return;
        }
        if(rowdata.visibleindex == 0) {
            return;
        }
        var newidx = rowdata.visibleindex -1;
        grid.jqxGrid('deleterow', rowdata.uid);
        grid.jqxGrid('addrow', null, rowdata, newidx);
        grid.jqxGrid('selectrow', newidx);
    },

    /** 보고서 항목 아래로 이동 */
    moveDown: function() {
        var grid = Main.getDataGrid();
        if(grid == null) return;
        var rowdata = HmGrid.getRowData(grid);
        if(rowdata == null) {
            alert('데이터를 선택하세요.');
            return;
        }
        var totIdx = grid.jqxGrid('getboundrows').length - 1;

        if(rowdata.visibleindex == totIdx) {
            return;
        }
        var newidx = rowdata.visibleindex +1;
        grid.jqxGrid('deleterow', rowdata.uid);
        grid.jqxGrid('addrow', null, rowdata, newidx);
        grid.jqxGrid('selectrow', newidx);
    },

    delConfItem: function() {
        var rowdata = HmGrid.getRowData($('#confGrid'));
        if(rowdata == null) {
            alert('삭제 항목을 선택하세요.');
            return;
        }
        if(!confirm('선택된 항목을 삭제하시겠습니까?')) return;
        $('#confGrid').jqxGrid('deleterow', rowdata.uid);
    },

    saveConf: function() {
        Main.setCurRptItem(); //마지막 편집정보 업데이트
        var list = [];
        var drptRowdata = HmGrid.getRowData($('#drptGrid'));
        if(drptRowdata == null) {
            alert("선택된 보고서가 없습니다.");
            return;
        }
        var rows = $('#confGrid').jqxGrid('getboundrows');
        if(rows.length == 0) {
            alert('보고서 구성 항목이 없습니다.');
            return;
        }

        var saveData = {
            drptNo: drptRowdata.drptNo,
            theme: drptRowdata.theme,
            list: rows
        };

        Server.post('/main/rpt/dynamicRpt/addDRptItem.do', {
            data: saveData,
            success: function(result) {
                alert('저장되었습니다.');
            }
        });
    },

    /**
     * 조건 > 장비 설정
     * @param condList
     */
    initCondDev: function() {
        HmGrid.create($('#condDevGrid'), {
            selectionmode: 'checkbox',
            pageable: false,
            height: 200,
            columns:
                [
                    {text: '그룹', datafield: 'grpName', width: 200, pinned: true},
                    {text: '장비명', datafield: 'devName', width: 250, pinned: true},
                    {text: '장비IP', datafield: 'devIp', width: 150},
                    {text: '제조사', datafield: 'vendor', width: 150},
                    {text: '모델', datafield: 'model', width: 150}
                ]
        }, CtxMenu.COMM, 'condDevGrid');
    },

    searchCondDev: function(condList) {
        if(condList == null || condList.length == 0) {
            $('#condDevGrid').jqxGrid('clear');
            return;
        }

        var devList = [];
        $.each(condList, function(idx, item) {
            devList.push({mngNo: item.condVal, etc: item.etc});
        });
        Server.post('/main/rpt/dynamicRpt/getCondDevList.do', {
            data: {condList: devList},
            success: function(result) {
                if(result.length > 0) {
                    $.each(result, function(idx, item) {
                        var jsonEtc = JSON.parse(item.etc.replace(/\&quot\;/ig, '\"'));
                        item.country = jsonEtc == null? null : jsonEtc.country;
                        item.corporation = jsonEtc == null? null : jsonEtc.corporation;
                    });
                }
                console.log(result);
                HmGrid.setLocalData($('#condDevGrid'), result);
            }
        });
    },

    addCondDev: function() {
        var params = {
            dataType: 'DEV',
            callbackFn: 'callbackAddCondDev',
            addedIds: []
        };
        HmUtil.createPopup(ctxPath + '/main/popup/nms/pTargetAdd.do', $('#hForm'), 'pTargetAdd', 1000, 600, params);
    },

    delCondDev: function() {
        var rowIdxes = HmGrid.getRowIdxes($('#condDevGrid'), '장비를 선택하세요.');
        if(rowIdxes === false) return;
        if(!confirm('선택된 장비를 삭제하시겠습니까?')) return;

        var uids = [];
        $.each(rowIdxes, function(idx, value) {
            uids.push($('#condDevGrid').jqxGrid('getrowdata', value).uid);
        });
        $('#condDevGrid').jqxGrid('deleterow', uids);
        $('#condDevGrid').jqxGrid('clearselection');
    },


    /**
     * 조건 >  회선 설정
     * @param condList
     */
    initCondIf: function() {
        HmGrid.create($('#condIfGrid'), {
            selectionmode: 'checkbox',
            pageable: false,
            height: 200,
            columns:
                [
                    {text: '그룹', datafield: 'grpName', width: 150, pinned: true},
                    {text: '장비명', datafield: 'devName', width: 150, pinned: true},
                    {text: '회선명', datafield: 'ifName', minwidth: 150, pinned: true},
                    {text: '회선별명', datafield: 'ifAlias', width: 150},
                    {text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer}
                ]
        }, CtxMenu.COMM, 'condIfGrid');
    },

    searchCondIf: function(condList) {
        if(condList == null || condList.length == 0) {
            $('#condIfGrid').jqxGrid('clear');
            return;
        }

        var ifList = [];
        $.each(condList, function(idx, item) {
            var tmp = item.condVal.split('_');
            ifList.push({mngNo: tmp[0], ifIdx: tmp[1]});
        });

        Server.post('/main/rpt/dynamicRpt/getCondIfList.do', {
            data: {condList: ifList},
            success: function(result) {
                HmGrid.setLocalData($('#condIfGrid'), result);
            }
        });
    },

    addCondIf: function() {
        // var list = $('#p_targetGrid_if').jqxGrid('getboundrows');
        // if(list.length > 0) {
        //     $.each(list, function(idx, item) {
        //         addedIds.push(item.mngNo + '_' + item.ifIdx);
        //     });
        // }

        var params = {
            dataType: 'IF',
            callbackFn: 'callbackAddCondIf',
            addedIds: []
        };
        HmUtil.createPopup(ctxPath + '/main/popup/nms/pTargetAdd.do', $('#hForm'), 'pTargetAdd', 1000, 600, params);
    },

    // 그룹추가
    addCondGrp: function() {
        var params = {
            callbackFn: 'callbackAddCondGrp',
        };
        HmUtil.createPopup(ctxPath + '/main/popup/nms/pTargetGrpAdd.do', $('#hForm'), 'pTargetGrpAdd', 1000, 600, params);
    },
    
    // 수신자그룹 추가
    addCondRecvGrp: function() {
        var params = {
            callbackFn: 'callbackAddCondRecvGrp'
        };
        HmUtil.createPopup(ctxPath + '/main/popup/nms/pTargetRecvGrpAdd.do', $('#hForm'), 'pTargetRecvGrpAdd', 1000, 600, params);
    },

    delCondIf: function() {
        var rowIdxes = HmGrid.getRowIdxes($('#condIfGrid'), '회선을 선택하세요.');
        if(rowIdxes === false) return;
        if(!confirm('선택된 회선을 삭제하시겠습니까?')) return;

        var uids = [];
        $.each(rowIdxes, function(idx, value) {
            uids.push($('#condIfGrid').jqxGrid('getrowdata', value).uid);
        });
        $('#condIfGrid').jqxGrid('deleterow', uids);
        $('#condIfGrid').jqxGrid('clearselection');
    },

    /** 네트웍보고서 코드관리 */
    codeConf: function() {
        HmUtil.createPopup('/main/popup/rpt/pDRptCodeConf.do', $('#hForm'), 'pDRptCodeConf', 1000, 600, {});
        // $.post(ctxPath + '/main/popup/rpt/pDRptCodeConf.do', function(result) {
        //     HmWindow.open($('#pwindow'), '코드관리', result, 1000, 600, 'p2window_init', {});
        // });
    },

    /** 보고서 설정 */
    setupReport: function() {
        HmUtil.createPopup('/main/popup/rpt/pDRptTimediffConf.do', $('#hForm'), 'pDRptTimediffConf', 1300, 700, {});
    }

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

// 조건설정 > 장비 callback
function callbackAddCondDev(dataType, list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({mngNo: item.mngNo, grpName: item.grpName, devName: item.disDevName, devIp: item.devIp});
    });

    try {
        PMain.callbackAddCond(addList);
    } catch(e) {
        $dataGrid.jqxGrid('addrow', null, addList);
    }
}

// 조건설정 > 회선 callback
function callbackAddCondIf(dataType, list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({mngNo: item.mngNo, ifIdx: item.ifIdx, grpName: item.grpName, devName: item.disDevName, devIp: item.devIp, ifName: item.ifName });
    });

    try {
        PMain.callbackAddCond(addList);
    } catch(e) {
        $dataGrid.jqxGrid('addrow', null, addList);
    }
}

// 조건설정 > 그룹 callback
function callbackAddCondGrp(list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({grpNo: item.grpNo, grpName: item.grpName});
    });
    $dataGrid.jqxGrid('addrow', null, addList);
}

// 조건설정 > 수신자그룹 callback
function callbackAddCondRecvGrp(list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({recvGrpNo: item.recvGrpNo, recvGrpName: item.recvGrpName});
    });
    $dataGrid.jqxGrid('addrow', null, addList);
}


var drpt_ctrl_col = {

    /* 해외망 */
    // 전체 회선 현황
    2715: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '법인1', datafield: 'country1', width: 150},
        {text: '법인2', datafield: 'country2', width: 150},
        {text: '대역폭', datafield: 'lineWidth', width: 100},
        {text: '회선매체', datafield: 'ifMedia', width: 100},
        {text: '전용전화 회선수', datafield: 'ifCnt', width: 100},
        {text: '가속기 현황', datafield: 'acltState', width: 100},
        {text: '보장RTT', datafield: 'rtt', width: 100},
        {text: '접근통제 적용 현황', datafield: 'acState', width: 100},
        {text: '비고', datafield: 'memo', minwidth: 100}
    ],
    // 회선 사용률 현황
    2801: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '구분1', datafield: 'country1', width: 150},
        {text: '구분2', datafield: 'country2', width: 150},
        {text: '구분3', datafield: 'country3', width: 150},
        {text: '대역폭/COS2/COS3', datafield: 'lineWidth', width: 150},
        {text: '장애건수', datafield: 'errCnt', width: 100}
    ],
    // 회선 사용률 현황2
    3849: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '구분1', datafield: 'country1', width: 150},
        {text: '구분2', datafield: 'country2', width: 150},
        {text: '구분3', datafield: 'country3', width: 150},
        {text: '속도', datafield: 'lineWidth', width: 150},
        {text: '장애건수', datafield: 'errCnt', width: 100}
    ],
    // 전용전화 사용 현황
    2952: [
        {text: '구분1', datafield: 'country1', width: 150},
        {text: '구분2', datafield: 'country2', width: 150},
        {text: '구분3', datafield: 'country3', width: 150},
        {text: '보유 CH', datafield: 'chCnt', width: 100},
        {text: '전용전화 대역폭', datafield: 'lineWidth', width: 100},
        {text: '전월 최대 동시 통화 수', datafield: 'lastCallCnt', width: 150},
        {text: '당월 최대 동시 통화 수', datafield: 'thisCallCnt', width: 150},
        {text: '초과 수', datafield: 'exceedCnt', width: 100}
    ],
    // 사업장 회선 현황
    3581: [
        {text: '구분1', datafield: 'country1', width: 150},
        {text: '구분2', datafield: 'country2', width: 150},
        {text: '법인', datafield: 'country3', width: 150},
        {text: '총 대역폭', datafield: 'lineWidth', width: 100},
        {text: 'Cos2: 영상회의', datafield: 'cos2', width: 100},
        {text: '접근통제 적용 현황', datafield: 'acState', width: 150}
    ],

    // 회선 사용 상세 현황
    3229: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '표시문구', datafield: 'disText', width: 300}
    ],

    // NMS 등록현황
    293: [
        {text: '그룹번호', datafield: 'grpNo', width: 80, editable: false, hidden: true},
        {text: '그룹', datafield: 'grpName', width: 200, editable: false}
    ],

    // NMS SMS 수신현황
    343: [
        {text: '수신자번호', datafield: 'recvGrpNo', width: 80, editable: false, hidden: true},
        {text: '수신자그룹', datafield: 'recvGrpName', width: 200, editable: false}
    ],

    // 사업장 별 월간 회선 사용 현황
    1747: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '그룹사명', datafield: 'grpCompNm', width: 150},
        {text: '사업장명', datafield: 'workplaceNm', width: 150},
        {text: '회선향', datafield: 'direction', width: 150},
        {text: '대역폭', datafield: 'lineWidth', width: 100}
    ],
    // 사업장 별 월간 회선 사용 현황(업무시간)
    8621: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '그룹사명', datafield: 'grpCompNm', width: 150},
        {text: '사업장명', datafield: 'workplaceNm', width: 150},
        {text: '회선향', datafield: 'direction', width: 150},
        {text: '대역폭', datafield: 'lineWidth', width: 100}
    ],

    //회선성능 Case1
    2054: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '사업장명', datafield: 'kind1', width: 150}
    ],
    //회선성능 Case2
    2250: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '사업장명', datafield: 'kind1', width: 150}
    ],

    /* 통합 Account */
    // 장비 운영현황
    4210: [
        {text: '구분1', datafield: 'kind1', width: 200},
        {text: '구분2', datafield: 'kind2', width: 200}
    ],
    // 장비 운영현황 - HKMC
    4478: [
        {text: '구분1', datafield: 'kind1', width: 200},
        {text: '구분2', datafield: 'kind2', width: 200}
    ],

    // 인시던트 현황
    4592: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // 인시던트 현황 - HKMC
    4706: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // // 변경관리
    // 4779: [
    //     {text: 'X축 (월)', datafield: 'mm', width: 150},
    //     {text: 'Y축 (건)', datafield: 'cnt', width: 150}
    // ],
    // // 장애관리
    // 4920: [
    //     {text: 'X축 (월)', datafield: 'mm', width: 150},
    //     {text: 'Y축 (건)', datafield: 'cnt', width: 150}
    // ],
    // 인터넷 운영현황_회선(사용자)
    5011: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '구분', datafield: 'kind1', width: 200},
        {text: '회선명', datafield: 'disIfName', width: 200}
    ],
    // 인터넷 운영현황_회선(DMZ)
    5153: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '구분', datafield: 'kind1', width: 200},
        {text: '회선명', datafield: 'disIfName', width: 200}
    ],
    // 인터넷 운영현황_QoS(DMZ인터넷)
    5283: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // 인터넷 운영현황_QoS(사용자인터넷)
    5598: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // 그룹망 주요회선 운영현황_센터간 회선
    5748: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '회선구분1', datafield: 'kind1', width: 200},
        {text: '회선구분2', datafield: 'kind2', width: 150}
    ],
    // 그룹망 주요회선 운영현황_사업장 WAN
    5826: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '구분', datafield: 'kind1', width: 200},
        {text: '사업장', datafield: 'kind2', width: 150}
    ],
    // 그룹망 주요회선 운영현황_복제회선
    5910: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '회선구분1', datafield: 'kind1', width: 200},
        {text: '회선구분2', datafield: 'kind2', width: 150}
    ],
    // TMS 주요회선 운영현황
    5987: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '회선구분1', datafield: 'kind1', width: 200},
        {text: '회선구분2', datafield: 'kind2', width: 150}
    ],
    // 해외망 주요회선 운영현황_데이터센터, 생산법인
    6063: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '회선', datafield: 'ifName', width: 150, editable: false},
        {text: '회선구분1', datafield: 'kind1', width: 100},
        {text: '회선구분2', datafield: 'kind2', width: 150},
        {text: '회선구분3', datafield: 'kind3', width: 150},
        {text: '대역폭', datafield: 'speed', width: 150},
        {text: '화면번호(1,2)', datafield: 'pageNo', width: 150, columntype: 'numberinput'}
    ],
    // 방화벽 운영현황_의왕센터
    6925: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '구분1', datafield: 'kind1', width: 100},
        {text: '구분2', datafield: 'kind2', width: 150},
        {text: '구분3', datafield: 'kind3', width: 150}
    ],
    // 방화벽 운영현황_파주센터
    7088: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '구분1', datafield: 'kind1', width: 100},
        {text: '구분2', datafield: 'kind2', width: 150}
    ],
    // 방화벽 운영현황_광주센터
    7212: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '구분1', datafield: 'kind1', width: 100},
        {text: '구분2', datafield: 'kind2', width: 150}
    ],
    // 방화벽 운영현황_사업장 생산망
    7357: [
        {text: '그룹', datafield: 'grpName', width: 150, editable: false},
        {text: '장비', datafield: 'devName', width: 150, editable: false},
        {text: '장비IP', datafield: 'devIp', width: 120, editable: false},
        {text: '구분1', datafield: 'kind1', width: 100},
        {text: '구분2', datafield: 'kind2', width: 150}
    ],
    // VPN 운영현황_H/W VPN
    6581: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // VPN 운영현황_SSL VPN
    6702: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // VPN 운영현황_재택근무 VPN
    6810: [
        {text: '구분', datafield: 'kind1', width: 200}
    ],
    // 서버 접근 통제(SAC) 운영현황
    7451: [
        {text: '구분1', datafield: 'kind1', width: 200},
        {text: '구분2', datafield: 'kind2', width: 200}
    ],
    // 무선랜 운영현황
    7602: [
        {text: '구분1', datafield: 'kind1', width: 200},
        {text: '구분2', datafield: 'kind2', width: 200}
    ],
    // WIPS 운영현황
    7922: [
        {text: '정책서버', datafield: 'kind1', width: 200},
        {text: '적용 사업장', datafield: 'kind2', width: 200}
    ],
    // DNS 운영현황
    8243: [
        {text: '구분', datafield: 'kind1', width: 200},
        {text: '장비수량(의왕)', datafield: 'kind2', width: 200},
        {text: '장비수량(파주)', datafield: 'kind3', width: 200}
    ]
};