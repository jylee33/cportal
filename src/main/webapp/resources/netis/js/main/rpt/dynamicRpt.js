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
        Text: 'Text', DEV: 'DEV', IF: 'IF'
    },

    CTRL_ID: {
        global_ifState: 2715
    }
};
var Main = {
    ctrlList: null,

    /** variable */
    initVariable : function() {

    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnAdd_drpt': this.addDrpt(); break;
            case 'btnEdit_drpt': this.editDrpt(); break;
            case 'btnDel_drpt': this.delDrpt(); break;
            case 'btnMove_up': this.moveUp(); break;
            case 'btnMove_dn': this.moveDown(); break;
            case "btnDel": this.delConfItem(); break;
            case "btnSave": this.saveConf(); break;
            case 'btnAdd_condDev': this.addCondDev(); break;
            case 'btnDel_condDev': this.delCondDev(); break;
            case 'btnAdd_condIf': this.addCondIf(); break;
            case 'btnDel_condIf': this.delCondIf(); break;
        }
    },

    initDesign: function() {
        HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 300, collapsible: false }, { size: '100%' }], 'auto', '100%');

        // 보고서 유형
        HmDropDownList.create($('#sDrptType'), {
            source: [
                {label: 'NMS 일일보고서', value: 'NMS_DAILY'},
                // {label: 'NMS 주간보고서', value: 'NMS_WEEKLY'},
                {label: 'NMS 월간보고서', value: 'NMS_MONTHLY'},
                {label: 'SMS 일일보고서', value: 'SMS_DAILY'},
                {label: 'SMS 월간보고서', value: 'SMS_MONTHLY'},
                {label: 'WNMS 일일보고서', value: 'WNMS_DAILY'},
                {label: 'WNMS 월간보고서', value: 'WNMS_MONTHLY'}
            ], width: 250, selectedIndex: 0
        });
        // 보고서 유형 변경시 컨트롤 목록 재구성
        $('#sDrptType').on('change', function(event) {
            Main.searchDrpt();
            Main.searchCtrl();
        });

        Main.initCondDev();
        Main.initCondIf();
        Main.initConfGrid();
        Main.initDrptGrid();

        // Image 항목인 경우 업로드파일 이미지 체크
        $('#uploadFile').on('change', function(e) {
            var files = e.target.files;
            console.log(files);
            if(!files[0].type.toLowerCase().startsWith("image")) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }
            var reader = new FileReader();
            reader.onload = function(event) {
                $('#uploadImage').attr('src', event.target.result);
                console.log(event.target.result);
            }

            reader.readAsDataURL(files[0]);
        });

        // $('#uploadImage').jqxFileUpload({ width: '100%', fileInputName: 'fileinput', accept: 'image/*'})
        //     .on('select', function(event) {
        //         var fileCnt = event.args.owner._fileRows.length;
        //         if(fileCnt > 1) {
        //             $('#p_file').jqxFileUpload('cancelFile', fileCnt-1);
        //             alert('최대 업로드 가능한 파일개수는 1개 입니다.');
        //             return;
        //         }
        //         var size = event.args.size;
        //         if(size > $('#gUploadSize').val()) {
        //             $('#p_file').jqxFileUpload('cancelFile', fileCnt-1);
        //             alert('파일 용량이 최대업로드 용량을 초과하였습니다. (최대 ' + ($('#gUploadSize').val() / 1024) + 'kb)');
        //             return;
        //         }
        //
        //         var fileName = event.args.file;
        //         var temp = fileName.split(".");
        //         var accept = temp[temp.length-1].toUpperCase();
        //
        //         console.log(event.args.owner._fileRows[0].fileInput);
        //         var file = event.args.owner._fileRows[0].fileInput;
        //         var reader = new FileReader();
        //         reader.onload = function(e) {
        //             console.log("onload..");
        //             console.log(e.target.result);
        //         }
        //
        //         reader.readAsDataURL(file);
        //
        //     });
    },

    initData: function() {
        Main.searchDrpt();
        Main.searchCtrl();
    },

    // 보고서 목록 조회
    searchDrpt: function() {
        Main.resetConf();
        HmGrid.updateBoundData($('#drptGrid'), ctxPath + '/main/rpt/dynamicRpt/getDRptList.do');
    },

    // 보고서 선택시 우측 구성정보 초기화
    resetConf: function() {
        // 초기화
        $('#ctrlNm').text('');
        $('#isChapter, #isPageBreak').prop('checked', false);
        $('#chapter').val('');
        $('#summaryText').val('');
        $('#condIfGrid').jqxGrid('clear')
        $('#condSummaryRow, #condIfRow').css('visibility', 'collapse');
        curRptItem = null;
    },

    // 보고서 컨트롤 목록 조회
    searchCtrl: function() {
        Server.post('/main/rpt/dynamicRpt/getDRptCtrlList.do', {
            data: {drptType: $('#sDrptType').val()},
            success: function(result) {
                Main.ctrlList = result;
                Main.initDRptCtrl();
            }
        });
    },

    // 보고서 그리드
    initDrptGrid: function() {
        HmGrid.create($('#drptGrid'), {
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                type: 'post',
                contenttype: 'application/json',
                id: 'drptNo'
            }, {
                formatData: function(data) {
                    data.drptType = $('#sDrptType').val();
                    return JSON.stringify(data);
                }
            }),
            pageable: false,
            sortable: false,
            showheader: true,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '보고서 목록');
            },
            columns: [
                { text: '보고서명', datafield: 'drptNm', minwidth: 150 },
                { text: '그룹사', datafield: 'grpName', width: 100 },
                { text: '스타일 테마', datafield: 'theme', width: 80 },
                { text: '보고서 표지', datafield: 'coverCtrlId', displayfield: 'coverCtrlNm', width: 80 }
            ]
        }, CtxMenu.NONE);
        $('#drptGrid').on('rowselect', function(event) { // 보고서 클릭
            setTimeout(function() {
                Main.searchConfGrid();
                Main.resetConf();
            }, 100);
        });
    },

    // 보고서 페이지 생성/수정/삭제
    addDrpt: function() {
        $.post(ctxPath + '/main/popup/rpt/pDRptAdd.do',
            {drptType: $('#sDrptType').val()},
            function (result) {
                HmWindow.open($('#pwindow'), '보고서 추가', result, 332, 273, 'p2window_init', {callbackFn: 'callbackAddDrpt'});
            }
        );
    },

    editDrpt: function() {
        var rowdata = HmGrid.getRowData($('#drptGrid'));
        if(rowdata == null) {
            alert('보고서를 선택하세요.');
            return;
        }
        $.post('/main/popup/rpt/pDRptEdit.do',
            rowdata,
            function (result) {
                HmWindow.open($('#pwindow'), '보고서 수정', result, 383, 304, 'p2window_init', {callbackFn: 'callbackEditDrpt'});
            }
        );
    },

    delDrpt: function() {
        var rowdata = HmGrid.getRowData($('#drptGrid'));
        if(rowdata == null) {
            alert('보고서를 선택하세요.');
            return;
        }
        if(!confirm('[{0}] 보고서를 삭제하시겠습니까?'.substitute(rowdata.drptNm))) return;
        Server.post('/main/rpt/dynamicRpt/delDRpt.do', {
            data: {drptNo: rowdata.drptNo},
            success: function (result) {
                $('#drptGrid').jqxGrid('deleterow', rowdata.uid);
                Main.resetConf();
            }
        });
    },

    // 사용자 보고서 구성 그리드
    initConfGrid: function() {
        HmGrid.create($('#confGrid'), {
            source: new $.jqx.dataAdapter({
                datatype: 'json',
                type: 'post',
                contenttype: 'application/json'
            }, {
                formatData: function(data) {
                    var rowdata = HmGrid.getRowData($("#drptGrid"));
                    data.drptNo = rowdata == null? 0 : rowdata.drptNo;
                    return JSON.stringify(data);
                }
            }),
            pageable: false,
            sortable: false,
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '사용자 보고서 구성');
            },
            columns: [
                { text: '보고서 항목', dataField: 'ctrlNm',
                    cellsrenderer: function(row, datafield, value) {
                        var rowdata = $('#confGrid').jqxGrid('getrowdata', row);
                        var _color = '#000', _textIndent = 20;
                        if(rowdata.ctrlType == 'Chapter') {
                            _color = '#0000ff';
                            _textIndent = 0;
                        }
                        return '<div class="jqx-grid-cell-left-align" style="margin-top: 4.5px; text-indent: {0}px; color: {1}">{2}</div>'.substitute(_textIndent, _color, value);
                    }
                },
                { text: '사용자 정의 Chapter', dataField: 'chapter', width: '50%' },
                { text: 'CtrlId', dataField: 'ctrlId', width: 100, hidden: true },
                { text: 'CtrlType', dataField: 'ctrlType', width: 100, hidden: true }
            ]
        }, CtxMenu.NONE);
        /**
         * Grid selectrow 이벤트 발생시 이전 row에 대한 정보를 자동 업데이트 한다.
         */
        $('#confGrid').on('rowselect', Main.selectConfGrid);
    },

    /**
     * 보고서 구성항목 선택시
     * @param event
     */
    selectConfGrid: function(event) {
        try {
            Main.setCurRptItem();

            var row = event.args.row;
            $('#ctrlNm').text(row.ctrlNm || '');
            $('#isChapter').prop('checked', row.isChapter == 1);
            $('#isPageBreak').prop('checked', row.isPageBreak == 1);
            $('#chapter').val(row.chapter || '');

            if (row.ctrlType == 'DynamicText') {
                $('#condSummaryRow').css('visibility', 'visible');
                if (row.drptItemCondList != null && row.drptItemCondList.length > 0) {
                    $('#summaryText').val(row.drptItemCondList[0].condVal);
                }
                else {
                    $('#summaryText').val('');
                }
            }
            else {
                $('#condSummaryRow').css('visibility', 'collapse');
            }

            if (row.ctrlType == 'Image') {
                $('#condImageRow').css('visibility', 'visible');
                console.log(row.drptItemCondList);
                if (row.drptItemCondList != null && row.drptItemCondList.length > 0) {
                    var condVal = row.drptItemCondList[0].condVal;
                    // db데이터는 서버에 업로드된 파일명을 가지고 있음. 브라우저에서 이미지를 설정하고 저장전이면 image byte array의 데이터를 가짐.
                    // 서버이미지인지 byte array인지 판단하여 이미지 미리보기 제공
                    if(condVal.startsWith('data:image')) {
                        $('#uploadImage').attr('src', condVal);
                    }
                    else {
                        var imgUrl = ctxPath + '/img/birt/' + condVal;
                        var reader = new Image();
                        reader.onload = function () {
                            var canvas = document.createElement('canvas');
                            canvas.width = this.width;
                            canvas.height = this.height;
                            canvas.getContext('2d').drawImage(this, 0, 0);
                            var imgData = canvas.toDataURL('image/png');
                            $('#uploadImage').attr('src', imgData);
                        }
                        reader.src = imgUrl;
                    }
                }
                else {
                    $('#uploadImage').attr('src', null);
                }
            }
            else {
                $('#condImageRow').css('visibility', 'collapse');
            }

            if(row.ctrlCond == DRPT_CONST.CTRL_COND.DEV) {
                var _cols = [
                    {text: '그룹', datafield: 'grpName', width: 200, pinned: true, editable: false},
                    {text: '장비명', datafield: 'devName', width: 250, pinned: true, editable: false},
                    {text: '장비IP', datafield: 'devIp', width: 150, editable: false},
                    {text: '제조사', datafield: 'vendor', width: 150, editable: false},
                    {text: '모델', datafield: 'model', width: 150, editable: false}
                ];
                if(row.ctrlId == 2715) { // 전체 회선 현황
                    _cols.push({text: '국가', datafield: 'country', width: 100});
                    _cols.push({text: '법인', datafield: 'corporation', width: 150});
                    $('#condDevGrid').jqxGrid({columns: _cols, editable: true});
                }
                else {
                    $('#condDevGrid').jqxGrid({columns: _cols, editable: false});
                }
                // $('#condDevRow').css('visibility', 'visible');
                Main.searchCondDev(row.drptItemCondList);
            }
            else {
                // $('#condDevRow').css('visibility', 'collapse');
            }

            if(row.ctrlCond == 'IF') { // 컨트롤의 조건이 'IF'인 경우
                // $('#condIfRow').css('visibility', 'visible');
                Main.searchCondIf(row.drptItemCondList);
            }
            else {
                $('#condIfRow').css('visibility', 'collapse');
            }

            curRptItem = row;
        } catch(e) {alert(e);}
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

    addConfItem: function(item) {
        // var item = {
        //     ctrlNm: item.ctrlNm,
        //     ctrlId: item.ctrlId,
        //     ctrlType: item.ctrlType,
        //     ctrlCond: item.ctrlCond,
        //     chapter: item.ctrlNm,
        //     isChapter: item.isChapter,
        //     isPageBreak: item.isPageBreak
        // };

        // item.ctrlType != 'Chapter'가 아닌 경우 중복등록 불가
        if(item.ctrlType != 'Chapter') {
            var rows = $('#confGrid').jqxGrid('getboundrows');
            var isExist = false;
            for(var i = 0; i < rows.length; i++) {
                var tmp = rows[i];
                if(tmp.ctrlId == item.ctrlId) {
                    isExist = true;
                    break;
                }
            }
            if(isExist) {
                alert('이미 추가된 항목입니다.');
                return;
            }
        }

        $('#confGrid').jqxGrid('addrow', null, item);
    },

    /** 보고서 항목 위로 이동 */
    moveUp: function() {
        var rowdata = HmGrid.getRowData($('#confGrid'));
        if(rowdata == null) {
            alert('항목을 선택하세요.');
            return;
        }
        if(rowdata.visibleindex == 0) {
            return;
        }
        var newidx = rowdata.visibleindex -1;
        $('#confGrid').jqxGrid('beginupdate');
        $('#confGrid').jqxGrid('deleterow', rowdata.uid);
        $('#confGrid').jqxGrid('addrow', null, rowdata, newidx);
        $('#confGrid').jqxGrid('selectrow', newidx);
        $('#confGrid').jqxGrid('ensurerowvisible', newidx);
        $('#confGrid').jqxGrid('endupdate');
    },

    /** 보고서 항목 아래로 이동 */
    moveDown: function() {
        var rowdata = HmGrid.getRowData($('#confGrid'));
        if(rowdata == null) {
            alert('항목을 선택하세요.');
            return;
        }
        var totIdx = $('#confGrid').jqxGrid('getboundrows').length - 1;

        if(rowdata.visibleindex == totIdx) {
            return;
        }
        var newidx = rowdata.visibleindex +1;
        $('#confGrid').jqxGrid('beginupdate');
        $('#confGrid').jqxGrid('deleterow', rowdata.uid);
        $('#confGrid').jqxGrid('addrow', null, rowdata, newidx);
        $('#confGrid').jqxGrid('selectrow', newidx);
        $('#confGrid').jqxGrid('ensurerowvisible', newidx);
        $('#confGrid').jqxGrid('endupdate');
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


    /**
     * 보고서 컨트롤 항목 (CM_DRPT_CTRL)
     */
    initDRptCtrl: function() {
        $('#drptCtrlPanel').empty();
        if(Main.ctrlList.length == 0) return;
        $.each(Main.ctrlList, function(idx, item) {
            var drptCtrl = $('<div></div>', {
                class: 'draggable-drpt-ctrl jqx-rc-all',
                text: item.ctrlNm,
                'data-ctrlId': item.ctrlId,
                'data-ctrlType': item.ctrlType,
                'data-ctrlCond': item.ctrlCond,
                'data-chapter': item.chapter,
                'data-isChapter': 1,
                'data-isPageBreak': 1
            });
            $('#drptCtrlPanel').append(drptCtrl);
        });

        $('.draggable-drpt-ctrl').jqxDragDrop({dropTarget: $('#confGridPanel'), revert: false});
        $('.draggable-drpt-ctrl').click(function(event) {
            $('#ctrlTooltip').jqxTooltip({content: '<img src="/img/birt/ctrl/ctrl_{0}.png"></img>'.substitute($(event.currentTarget).attr('data-ctrlId')),
                autoHide: false,
                position: 'absolute', absolutePositionX: event.screenX-10, absolutePositionY: event.screenY-140});
            $('#ctrlTooltip').jqxTooltip('open');
        });
        // $('.draggable-drpt-ctrl').mouseleave(function() {
        //     $('#ctrlTooltip').jqxTooltip('close');
        // });
        this.addDragEvent();
    },

    addDragEvent: function() {
        var onItem = false;

        $('.draggable-drpt-ctrl').bind('dropTargetEnter', function(event) {
            onItem = true;
            $(this).jqxDragDrop('dropAction', 'none');
        });
        $('.draggable-drpt-ctrl').bind('dropTargetLeave', function(event) {
            onItem = false;
            $(this).jqxDragDrop('dropAction', 'default');
        });
        $('.draggable-drpt-ctrl').bind('dragEnd', function(event) {
            if(onItem) {
                console.log(event.args);
                Main.addConfItem({
                    ctrlNm: event.args.ctrlNm,
                    ctrlId: event.args.ctrlId,
                    ctrlType: event.args.ctrlType,
                    ctrlCond: event.args.ctrlCond,
                    chapter: event.args.chapter,
                    isChapter: event.args.isChapter,
                    isPageBreak: event.args.isPageBreak
                });
                onItem = false;
            }

        });
        $('.draggable-drpt-ctrl').bind('dragStart', function(event) {
            // var name = $(this).find('.draggable-rptItem').text();
            var ctrlNm = $(this).text();
            $(this).jqxDragDrop('data', {
                ctrlNm: ctrlNm,
                ctrlId: $(this).attr('data-ctrlId'),
                ctrlType: $(this).attr('data-ctrlType'),
                ctrlCond: $(this).attr('data-ctrlCond'),
                chapter: $(this).attr('data-chapter'),
                isChapter: $(this).attr('data-isChapter'),
                isPageBreak: $(this).attr('data-isPageBreak')
            });
        });
    }

};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initDesign();
    Main.initData();
});

function callbackAddDrpt(item) {
    $('#drptGrid').jqxGrid('addrow', null, item);
}

function callbackEditDrpt(item) {
    var rowdata = $('#drptGrid').jqxGrid('getrowdatabyid', item.drptNo);
    $.each(item, function(key, value) {
        if(key != 'drptNo') {
            rowdata[key] = value;
        }
    });

    $('#drptGrid').jqxGrid('updaterow', item.drptNo, rowdata);
}

// 조건설정 > 장비 callback
function callbackAddCondDev(dataType, list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({
            condKey: DRPT_CONST.CTRL_COND.DEV, condVal: item.mngNo, mngNo: item.mngNo,
            grpName: item.grpName, devName: item.disDevName, devIp: item.devIp,
            vendor: item.vendor, model: item.model
        });
    });
    $('#condDevGrid').jqxGrid('addrow', null, addList);
}

// 조건설정 > 회선 callback
function callbackAddCondIf(dataType, list) {
    var addList = [];
    $.each(list, function(idx, item) {
        addList.push({condKey: 'IF', condVal: item.ifIdx, mngNo: item.mngNo, ifIdx: item.ifIdx,
            grpName: item.grpName, devName: item.disDevName, ifName: item.ifName, ifAlias: item.ifAlias,
            lineWidth: item.lineWidth });
    });
    $('#condIfGrid').jqxGrid('addrow', null, addList);
}