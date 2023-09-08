var $grpTree, $assetGrid;
var editIds = [], addIds = [], _delList = [];
var fixedCols = [{ text: '순번', datafield: 'Z_SEQ_NO', minwidth: 60, cellsalign: 'right',  editable: false, cellsalign: 'center', hidden: true } ];

var Main = {
    /** variable */
    initVariable : function() {
        $assetGrid = $('#assetGrid');
    },

    /** add event */
    observe : function() {
        $('button').bind('click', function(event) { Main.eventControl(event); });
        $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
    },

    /** event handler */
    eventControl : function(event) {
        var curTarget = event.currentTarget;
        switch (curTarget.id) {
            case 'btnColConf': this.showColConf(); break;
            case 'btnCodeConf': this.showCodeConf(); break;
            case 'btnBatchChgPop': this.showBatchChgPop(); break;
            case 'btnAdd': this.addAsset(); break;
            case 'btnMultiAdd': this.addMulti(); break;
            case 'btnDel': this.delAsset(); break;
            case 'btnSave': this.saveAsset(); break;
            case 'btnSearch': this.searchAsset(); break;
            case 'btnExcel': this.exportExcel(); break;
            case 'btnItsmLink': this.itsmLinkPop(); break;
        }
    },

    /** keyup event handler */
    keyupEventControl: function(event) {
        if(event.keyCode == 13) {
            Main.searchAsset();
        }
    },

    /** init design */
    initDesign : function() {
        HmWindow.create($('#pwindow'), 100, 100);

        Main.createImportDateCondition($('#cbImportDatePeriod'), $('#importDate1'), $('#importDate2'));


        HmGrid.create($assetGrid, {
            source : new $.jqx.dataAdapter(
                {
                    datatype : 'json',
                    updaterow : function(rowid, rowdata, commit) {
                        if (rowdata.FLAG == 2)
                            return;
                        if (editIds.indexOf(rowid) == -1)
                            editIds.push(rowid);
                        commit(true);
                    },
                    addrow: function(rowid, rowdata, position, commit) {
                        addIds.push(rowid);
                        commit(true);
                        setTimeout("Main.addrowResult(" + rowid + ");", 100);
                    },
                },
                {
                    formatData : function(data) {
                        $.extend(data, Main.getCommParams());
                        return data;
                    },
                    loadComplete : function(records) {
                        editIds = [], addIds = [], _delList = [];
                    }
                }
            ),
            selectionmode : 'multiplecellsadvanced',
            editable : true,
            editmode : 'selectedcell',
            columns : fixedCols,

        }, CtxMenu.NONE);

        $assetGrid.on('bindingcomplete', function(){
            if($('#cbPageSize').val() != 'ALL'){
                $assetGrid.jqxGrid({pagesize: parseInt($('#cbPageSize').val()) })
            }else{
                var rowscount = $assetGrid.jqxGrid('getdatainformation').rowscount;
                $assetGrid.jqxGrid({pagesize: parseInt(rowscount)})
            }
        });

        $assetGrid.on('cellendedit', function(event){
            // event arguments.
            var args = event.args;
            // column data field.
            var dataField = event.args.datafield;
            // row's bound index.
            var rowBoundIndex = event.args.rowindex;
            // cell value
            var value = args.value;
            // cell old value.
            var oldvalue = args.oldvalue;
            // row's data.
            var rowData = args.row;
            if(rowData.FLAG){
                if(dataField == 'Z_IP')
                Server.get('/main/env/devAssetMgmt/getNmsInfo.do', {
                    data: {Z_IP: value},
                    success: function (result) {
                        if(result != null){
                            if(confirm('IP ' + value + '는 NMS에 등록된 장비입니다. \nNMS 장비정보를 입력하시겠습니까?')) {
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_SN", result.MACHONE_SERIAL);
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_OS_VER", result.MACHINE_VER);
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_HOST_NM", result.DEV_NAME);
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_MAINT_MUSER", result.MAIN_MAINT);
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_MAINT_SUSER", result.SUB_MAINT);
                                $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_IP_FLAG", 'Y');
                            }else{ $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_IP_FLAG", 'N');
                            }

                        }else{
                            // NMS 미등록 장비
                            $assetGrid.jqxGrid('setcellvalue', rowBoundIndex, "Z_IP_FLAG", 'N');
                        }
                    }
                });




                // if (!$.validateIp(value)) {
                //     alert('IP형식이 유효하지 않습니다.')
                // }
            }

        });

        $assetGrid.on('contextmenu', function (event) {
            return false;
        }).on('rowclick', function (event) {
            if (event.args.rightclick) {
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                $('#ctxmenu_devAsset').jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                    parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
            }
        });

        $('#ctxmenu_devAsset').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
            .on('itemclick', function(event) {
                Main.selectCtxmenu(event);
            });

        Main.searchAsset();
    },

    /** init data */
    initData: function() {

        $('#cbAssetKind').jqxDropDownList({ width: '70px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'DEV_ASSET_Z_ASSET_KIND', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
        // }).on('bindingComplete', function(event){
        //     $('#cbAssetKind').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '미설정'}, 0);
        });

        $('#cbDevKind').jqxDropDownList({ width: '120px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
            source: new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/main/env/eosAssetMgmt/getCodeListByCodeKind.do', data: { codeKind: 'EOS_ASSET_Z_DEV_KIND', useFlag: 1, SORT: 'ORDER BY CODE_ID'}}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
        }).on('bindingComplete', function(event){
            $('#cbDevKind').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '전체'}, 0);
        });

        $('#cbVendor').jqxDropDownList({ width: '120px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
            source: new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/main/env/eosAssetMgmt/getCodeListByCodeKind.do', data: { codeKind: 'EOS_ASSET_Z_VENDOR', useFlag: 1, SORT: 'ORDER BY CODE_ID'}}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
        }).on('bindingComplete', function(event){
            $('#cbVendor').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '전체'}, 0);
        });


        // $('#importDate').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });
        // var today = new Date();
        // today.setDate(today.getDate()-1);
        // $('#importDate').jqxDateTimeInput('setDate', today);

        $('#cbPageSize').jqxDropDownList({ width: '120px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: [
                { label: '20개씩 보기', value: 20 },
                { label: '50개씩 보기', value: 50 },
                { label: '100개씩 보기', value: 100 },
                { label: '1000개씩 보기', value: 1000 },
                { label: '전체 보기', value: 'ALL' }
            ],
            displayMember: 'label', valueMember: 'value', selectedIndex: 2
        });
    },

    getCommParams: function() {
        var params = {
            assetKind: $('#cbAssetKind').val(),
            devKind: $('#cbDevKind').val(),
            vendor: $('#cbVendor').val(),
            model: $('#sModel').val(),
            hostNm: $('#sHostNm').val(),
            ip: $('#sIp').val(),
            setLoc: $('#sSetLoc').val(),
            eosDtCond: $('#cbEosDtCond').val(),
            pageSize: $('#cbPageSize').val(),
            importDatePeriod: $('#cbImportDatePeriod').val(),
            importDate1: HmDate.getDateStr($('#importDate1')),
            importDate2: HmDate.getDateStr($('#importDate2'))

        };
        return params;
    },

    /** 자산 조회 */
    searchAsset: function() {
        Server.get("/main/env/devAssetMgmt/getDevAssetItemList.do", {
            success : function(data) {
                var cols = fixedCols.slice(0);
                var codeList = {};

                $.each(data, function(idx, item) {
                    if (item.colType == 'NUMBER' || item.colType == 'INT') { //NUMBER 컬럼
                        cols.push(
                            {
                                text: item.colCap,
                                datafield: item.colNm,
                                width: item.colDisWidth,
                                editable: (item.colEditFlag == 'Y'),
                                align: 'center',
                                cellsalign: 'right',
                                columntype: 'numberinput',
                                createeditor: function (row, cellvalue, editor) {
                                    var _max = '';
                                    for (var i = 0; i < item.colSize; i++) {
                                        _max += '9';
                                    }
                                    editor.jqxNumberInput(
                                        {
                                            inputMode: 'simple',
                                            digits: item.colSize,
                                            decimalDigits: 0,
                                            min: 0,
                                            max: parseInt(_max)
                                        });
                                }
                            });
                    } else if (item.colType == 'CODE') { //CODE 컬럼
                        codeList['DEV_ASSET_' + item.colNm] = [/*{codeId: '-1', codeValue1: '미설정'}*/];
                        cols.push({
                            text: item.colCap,
                            datafield: item.colNm,
                            displayfield: 'DIS_DEV_ASSET_' + item.colNm,
                            width: item.colDisWidth,
                            editable: (item.colEditFlag == 'Y'),
                            align: 'center',
                            columntype: 'dropdownlist',
                            createeditor: function (row, value, editor) {
                                editor.jqxDropDownList({
                                    source: codeList['DEV_ASSET_' + item.colNm],
                                    valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme, dropDownHeight: 200
                                });
                            }
                        });
                        // 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                        Server.get('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {
                            data: {codeKind: 'DEV_ASSET_{0}'.substitute(item.colNm), useFlag: 1, SORT: 'ORDER BY CODE_ID'},
                            success: function (codeResult) {
                                if (codeResult.length) {
                                    $.each(codeResult, function (idx, value) {
                                        codeList[codeResult[0].codeKind].push(value);
                                    });
                                }
                            }
                        });
                    }else { //VARCHAR 컬럼

                        //EOS CODE
                        if( item.colNm == 'Z_DEV_KIND' || item.colNm == 'Z_VENDOR' ) {
                            codeList['EOS_ASSET_' + item.colNm] = [/*{codeId: '-1', codeValue1: '미설정'}*/];
                            cols.push({
                                text: item.colCap,
                                datafield: item.colNm,
                                displayfield: 'DIS_DEV_ASSET_' + item.colNm,
                                width: item.colDisWidth,
                                editable: (item.colEditFlag == 'Y'),
                                align: 'center',
                                columntype: 'dropdownlist',
                                createeditor: function (row, value, editor) {
                                    editor.jqxDropDownList({
                                        source: codeList['EOS_ASSET_' + item.colNm],
                                        valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme, dropDownHeight: 200
                                    });
                                },cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
                                    if (newvalue != oldvalue) {
                                        $assetGrid.jqxGrid('setcellvalue', row, 'Z_MODEL', null);
                                    };
                                }
                            });
                            // 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                            Server.get('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {
                                data: {codeKind: 'EOS_ASSET_{0}'.substitute(item.colNm), useFlag: 1, SORT: 'ORDER BY CODE_ID'},
                                success: function (codeResult) {
                                    if (codeResult.length) {
                                        $.each(codeResult, function (idx, value) {
                                            codeList[codeResult[0].codeKind].push(value);
                                        });
                                    }
                                }
                            });
                        }
                        else if( item.colNm == 'Z_MODEL' ){ //EOS DATA
                            codeList['DEV_ASSET_' + item.colNm] = [/*{codeId: '-1', codeValue1: '미설정'}*/];
                            cols.push({
                                text: item.colCap,
                                datafield: item.colNm,
                                width: item.colDisWidth,
                                editable: (item.colEditFlag == 'Y'),
                                align: 'center',
                                columntype: 'combobox',
                                initeditor: function(row, cellvalue, editor ){
                                    var devKind = $assetGrid.jqxGrid('getcellValue', row, 'Z_DEV_KIND');
                                    var vendor = $assetGrid.jqxGrid('getcellValue', row, 'Z_VENDOR');

                                    var model = editor.val();
                                    console.log(model)
                                    var models =[];
                                    Server.get('/main/env/eosAssetMgmt/getEosCodeList.do', {
                                        data: {itemName: item.colNm, devKind: devKind, vendor: vendor},
                                        success: function (codeResult) {
                                            if (codeResult.length) {
                                                $.each(codeResult, function (idx, value) {
                                                    models.push(value.codeId);
                                                });
                                                console.log(models)
                                                editor.jqxComboBox({ source: models, theme: jqxTheme, dropDownHeight: 200 });

                                                if( model != null) {
                                                    var index = models.indexOf(model);
                                                    console.log(index)
                                                    editor.jqxComboBox('selectIndex', index);
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }else{
                            var colsObj = {
                                text : item.colCap,
                                datafield : item.colNm,
                                width: item.colDisWidth,
                                editable: (item.colEditFlag == 'Y'),
                                align: 'center',
                                validation : function(cell, value) {
                                    if (value == '')
                                        return true;
                                    if (value.length > item.colSize) {
                                        return {
                                            result : false,
                                            message : item.colSize + '자 이내로 입력하세요.' };
                                    } else
                                        return true;
                                }
                            }
                            if( item.colNm == 'Z_SN' || item.colNm == 'Z_OS_VER' || item.colNm == 'Z_HOST_NM' || item.colNm == 'Z_IP'
                                || item.colNm == 'Z_MAINT_MUSER' || item.colNm == 'Z_MAINT_SUSER' ){
                                $.extend(colsObj, { cellclassname: Main.cellclass });
                            }
                            if( item.colNm == 'Z_SN_FLAG' || item.colNm == 'Z_OS_VER_FLAG' || item.colNm == 'Z_HOST_NM_FLAG'
                                || item.colNm == 'Z_MAINT_MUSER_FLAG' || item.colNm == 'Z_MAINT_SUSER_FLAG' ){
                                $.extend(colsObj, { hidden: true});
                            }
                            cols.push( colsObj );
                        }

                    }
                });

                $assetGrid.jqxGrid('beginupdate', true);

                $assetGrid.jqxGrid({ columns : cols });
                $assetGrid.jqxGrid('endupdate');


                // 데이터 갱신
                HmGrid.updateBoundData($assetGrid, ctxPath + '/main/env/devAssetMgmt/getDevAssetList.do');

            }
        });
    },

    /** 항목설정 */
    showColConf : function() {
        $.get(ctxPath + '/hyundaiCar/popup/nms/pDevAssetItemConf.do',
            function(result) {
                HmWindow.open($('#pwindow'), '자산 항목 관리', result, 740, 465);
            }
        );
    },
    /** 항목설정 */
    // showCodeConf : function() {
    //     $.get(ctxPath + '/hyundaiCar/popup/nms/pDevAssetItemConf.do',
    //         function(result) {
    //             HmWindow.open($('#pwindow'), '자산 항목 관리', result, 740, 465);
    //         }
    //     );
    // },

    /** 자산 추가 */
    addAsset : function() {
        $assetGrid.jqxGrid('addrow', null, {Z_ITSM_FLAG: '2', DIS_DEV_ASSET_Z_ITSM_FLAG: 'N', FLAG: 2});
    },

    addrowResult: function(rowid) {
        // 추가된 Row로 스크롤 이동
        $assetGrid.jqxGrid('removesort');
        var rowidx = $assetGrid.jqxGrid('getrowboundindexbyid', rowid);
        $assetGrid.jqxGrid('ensurerowvisible', rowidx);
    },

    /** 자산정보 삭제 */
    delAsset : function() {
        var _seqNos = [];
        var cells = $assetGrid.jqxGrid('getselectedcells');
        if (!cells.length){
            alert('데이터를 선택해주세요.');
            return;
        }
        var _rowIdxes = [];
        $.each(cells, function(i, v){
            _rowIdxes.push(v.rowindex);
        });

        var rowIdxes = _rowIdxes.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

        var _localUids = [];
        var _dbUids = [];
        if(!confirm('선택된 데이터 ' + rowIdxes.length+ '건을 삭제하시겠습니까?')) return;

        $.each(rowIdxes, function(i, v){
            var rowdata = $assetGrid.jqxGrid('getrowdata', v);
            //로컬삭제
            if(rowdata.Z_SEQ_NO === undefined){
                delete addIds[addIds.indexOf(rowdata.uid)];
                _localUids.push(rowdata.uid);

            }else{
                //DB삭제
                _dbUids.push(rowdata.uid);
                _seqNos.push(rowdata.Z_SEQ_NO);
            }
        });
        if(_seqNos.length){
            Server.post('/main/env/devAssetMgmt/delDevAsset.do', {
                data :
                    { seqNos : _seqNos.join(',')},
                success : function(data) {
                    $assetGrid.jqxGrid('deleterow', _dbUids);
                    $assetGrid.jqxGrid('deleterow', _localUids);
                    Main.searchAsset();
                }
            });
        }else{
            $assetGrid.jqxGrid('deleterow', _localUids);
        }
    },

    /** 자산정보 저장 */
    saveAsset : function() {
        if (editIds.length == 0 && addIds.length == 0  && _delList.length == 0) {
            alert('변경된 내용이 존재하지 않습니다.');
            return;
        }

        var _list = [];
        $.each(editIds, function(idx, value) {
            var tmp = $assetGrid.jqxGrid('getrowdatabyid', value);
            if (tmp !== undefined) {
                _list.push(tmp);
            }
        });
        $.each(addIds, function(idx, value) {
            var tmp = $assetGrid.jqxGrid('getrowdatabyid', value);
            if (tmp !== undefined) {
                _list.push(tmp);
            }
        });

        if( (_list.length + _delList.length) == 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }
        // $.each(_list, function(idx, item) {
            // if($.isBlank(item.Z_CATEGORY)) {
            //     isValid = false;
            //     alert('대분류를 입력해주세요.');
            //     return;
            // }
            // if($.isBlank(item.Z_SUB_CATEGORY)) {
            //     isValid = false;
            //     alert('중분류를 입력해주세요.');
            //     return;
            // }
            // if($.isBlank(item.Z_MODEL)) {
            //     isValid = false;
            //     alert('모델을 입력해주세요.');
            //     return;
            // }
        // });
        // if(isValid == false) return;
        Server.post('/main/env/devAssetMgmt/saveDevAsset.do', {
            data :
                { list : _list, delList: _delList },
            success : function(data) {
                editIds = [], addIds = [], _delList = [];
                alert(data);
                Main.searchAsset();
            }
        });
    },
    /** 자산정보 일괄변경(셀렉트 우클릭된 셀 기준) */
    showBatchChgPop : function() {

        var cells = $assetGrid.jqxGrid('getselectedcells');
        if (!cells.length){
            alert('데이터를 선택해주세요.');
            return;
        }

        var selectedField = cells[0].owner._clickedcolumn;

        var column = $assetGrid.jqxGrid('getcolumn', selectedField);
        var selectedDisField =  column.text;
        var selectedColumnType =  column.columntype;
        // var selectedDisField =  $assetGrid.jqxGrid('getcolumnproperty', selectedField, 'text');
        var _rowIdxes = [];
        $.each(cells, function(i, v){
            if(selectedField == v.datafield)
                _rowIdxes.push(v.rowindex);
        });

        var rowIdxes = _rowIdxes.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

        var _uids =[];
        $.each(rowIdxes, function(i, v){
            var rowdata = $assetGrid.jqxGrid('getrowdata', v);
            _uids.push(rowdata.uid);
        });

        var params = {
            uids: _uids.join(','),
            datafield: selectedField,
            columnType: selectedColumnType,
            codePrefix: 'DEV_ASSET_'
        };
        HmWindow.create($('#pwindow'), 300, 140, 999);
        $.post(ctxPath + '/hyundaiCar/popup/nms/pEosAssetBatchSet.do',
            params,
            function(result) {
                HmWindow.open($('#pwindow'), selectedDisField + ' 일괄설정', result, 300, 140,'pwindow_init');
            }
        );

    },

    batchSet: function(data, uids, datafield){
        var uidArr = uids.split(',');
        $.each(uidArr, function(i){
            $assetGrid.jqxGrid('setcellvaluebyid', uidArr[i], datafield, data);
        });
    },
    batchDropDownSet: function(data, uids, datafield){
        var uidArr = uids.split(',');
        $.each(uidArr, function(i){
            $assetGrid.jqxGrid('setcellvaluebyid', uidArr[i], 'DIS_DEV_ASSET_' + datafield, data.label);
            $assetGrid.jqxGrid('setcellvaluebyid', uidArr[i], datafield, data.value);
        });
    },
    exportExcel: function() {
        HmUtil.exportGrid($assetGrid, '자산정보', false);
    },

    exportExcel__: function() {
        var _grpNo = -1, _itemKind = 'GROUP';
        var treeItem = HmTreeGrid.getSelectedItem($grpTree);
        if(treeItem !== null) {
            _itemKind = treeItem.devKind2;
            _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
        }
        var params = {
            grpType: 'DEFAULT',
            itemKind: _itemKind,
            grpNo: _grpNo,
            sIp: $('#sIp').val(),
            sDevName: $('#sDevName').val(),
            selectTab : $('#mainTab').val()
        };

        HmUtil.exportExcel(ctxPath + '/main/env/assetInfo/export.do', params);
    },
    cellclass: function(row, columnfield, value) {

        var cellval = $assetGrid.jqxGrid('getcellvalue', row, columnfield + '_FLAG');
        var classnm = '';
        if(cellval =='불일치'){
            classnm = 'red';
        };
        return classnm;
    },
    nmsDataSetting: function(data, rowIdx){
        $.each(data, function(k, v){
            $assetGrid.jqxGrid('setcellvalue', rowIdx, k, v);
        });
    },
    selectCtxmenu: function(event) {
        switch($(event.args)[0].id) {
            case 'cm_nmsCmp' :
                try {
                    var cells = $assetGrid.jqxGrid('getselectedcells');
                    if (!cells.length){
                        alert('데이터를 선택해주세요.');
                        return;
                    }
                    if(cells.length > 1){
                        alert('NMS 데이터 비교는 단건만 가능합니다.');
                        return;
                    }
                    var selectedField = cells[0].owner._clickedcolumn;
                    var rowIdx;
                     $.each(cells, function(i, v){
                        rowIdx = v.rowindex;
                    });

                    var rowdata = $assetGrid.jqxGrid('getrowdata', rowIdx);

                    if($.isBlank(rowdata.Z_IP)){
                        alert('IP를 입력해주세요.')
                        return;
                    }

                    var getData = {}
                    // if(rowdata.Z_SEQ_NO !== undefined){
                    //     getData = {
                    //         rowIdx: rowIdx,
                    //         assetIp: rowdata.Z_IP,
                    //         assetSn: rowdata.Z_SN,
                    //         assetOsVer: rowdata.Z_OS_VER,
                    //         assetHostNm: rowdata.Z_HOST_NM,
                    //         assetMaintMUser: rowdata.Z_MAINT_MUSER,
                    //         assetMaintSUser: rowdata.Z_MAINT_SUSER,
                    //
                    //         nmsIp: rowdata.DEV_IP,
                    //         nmsSn: rowdata.MACHONE_SERIAL,
                    //         nmsOsVer: rowdata.MACHONE_VER,
                    //         nmsHostNm: rowdata.DEV_NAME,
                    //         nmsMaintMUser: rowdata.MAIN_MAINT,
                    //         nmsMaintSUser: rowdata.SUB_MAINT
                    //     }
                    // }else{
                        Server.get('/main/env/devAssetMgmt/getNmsInfo.do', {
                            data: { Z_IP: rowdata.Z_IP },
                            success: function(result) {
                                if(result != null){
                                    getData = {
                                        rowIdx: rowIdx,
                                        assetIp: rowdata.Z_IP,
                                        assetSn: rowdata.Z_SN,
                                        assetOsVer: rowdata.Z_OS_VER,
                                        assetHostNm: rowdata.Z_HOST_NM,
                                        assetMaintMUser: rowdata.Z_MAINT_MUSER,
                                        assetMaintSUser: rowdata.Z_MAINT_SUSER,

                                        nmsIp: result.DEV_IP,
                                        nmsSn: result.MACHONE_SERIAL,
                                        nmsOsVer: result.MACHONE_VER,
                                        nmsHostNm: result.DEV_NAME,
                                        nmsMaintMUser: result.MAIN_MAINT,
                                        nmsMaintSUser: result.SUB_MAINT
                                    }

                                    HmWindow.create($('#pwindow'), 480, 270);
                                    $.post(ctxPath + '/hyundaiCar/popup/nms/pDevAssetNmsCmp.do',
                                        function(result) {
                                            HmWindow.open($('#pwindow'), 'NMS 데이터 비교', result, 480, 270, 'pwindow_init', getData);
                                        }
                                    );

                                }else{
                                    alert('NMS에 등록된 IP가 아닙니다.');
                                    var data = { Z_SN_FLAG: 'N/A', Z_OS_VER_FLAG: 'N/A', Z_IP_FLAG: 'N', Z_MAINT_MUSER_FLAG: 'N/A', Z_MAINT_SUSER_FLAG: 'N/A' };
                                    Main.nmsDataSetting(data, rowIdx);
                                }
                            }
                        });
                    // }



                } catch(e) {}
                break;
        case 'cm_filter' :
            try {
                $assetGrid.jqxGrid('beginupdate');
                if ($assetGrid.jqxGrid('filterable') === false) {
                    $assetGrid.jqxGrid({filterable: true});
                }
                $assetGrid.jqxGrid({showfilterrow: !$assetGrid.jqxGrid('showfilterrow')});
                $assetGrid.jqxGrid('endupdate');
            } catch (e) {
            }
            break;
        case 'cm_filterReset' :
            try {
                $assetGrid.jqxGrid('clearfilters');
            } catch (e) {
            }
            break;
        case 'cm_colsMgr' :
            $.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
                function (result) {
                    HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $assetGrid);
                }
            );
            break;
        }
    },
    /** 멀티 추가 */
    addMulti: function() {
            HmUtil.createPopup('/hyundaiCar/popup/nms/pDevAssetAddMulti.do', $('#hForm'), 'pMultiAdd', 1400, 700);
    },
    createImportDateCondition: function($combo, $date1, $date2) {

        $combo.jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
            displayMember: 'label', valueMember: 'value', selectedIndex: 0,
            source: [
                { label: '전체', value: 'ALL' },
                { label: '최근24시간', value: 1 },
                { label: '최근1주일', value: 7 },
                { label: '최근1개월', value: 30 },
                { label: '최근1년', value: 365 },
                { label: '사용자설정', value: -1 }
            ]
        }).on('change', function(event) {
                switch(String(event.args.item.value)) {
                    case 'ALL': $date1.add($date2).jqxDateTimeInput({ disabled: true });
                        $('#idpBox').hide();
                    break;
                    case '-1': $date1.add($date2).jqxDateTimeInput({ disabled: false });
                        $('#idpBox').show();
                    break;
                    default:
                        $('#idpBox').show();
                        var toDate = new Date();
                        var fromDate = new Date();
                        fromDate.setDate(fromDate.getDate() - parseInt(event.args.item.value));
                        $date1.jqxDateTimeInput('setDate', fromDate);
                        $date2.jqxDateTimeInput('setDate', toDate);
                        $date1.add($date2).jqxDateTimeInput({ disabled: true });
                        break;
                }
            });

        HmDate.create($date1, $date2, HmDate.DAY, 1);
        $date1.add($date2).jqxDateTimeInput({ disabled: true });
        $('#idpBox').hide();
    },
    itsmLinkPop: function(){
        var params = {};

        HmUtil.createPopup(ctxPath + '/hyundaiCar/popup/nms/pItsmLink.do', $('#hForm'), 'pItsmLink', 1200, 600, params);
    }
};

$(function() {
    Main.initVariable();
    Main.observe();
    Main.initData();
    Main.initDesign();
});