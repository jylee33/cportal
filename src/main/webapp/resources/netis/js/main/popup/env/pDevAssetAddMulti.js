var $p_grid;
var fixedCols = [ { text: '순번', datafield: 'Z_SEQ_NO', minwidth: 60, cellsalign: 'right',  editable: false, cellsalign: 'center', hidden: true } ];
var codeList = {};
var editDevAssetIds = [];
$(function () {
    PMain.initVariable();
    PMain.observe();
    PMain.initDesign();
    PMain.initData();
});


var PMain = {
    /** Initialize */
    initVariable: function () {
        $p_grid = $('#p_grid');
    },

    /** Event Object */
    observe: function () {
        $("button").bind("click", function (event) {
            PMain.eventControl(event);
        });
    },

    /** Event Control Function */
    eventControl: function (event) {
        switch (event.currentTarget.id) {
            case 'pbtnSave': this.save(); break;
            case 'pbtnExcelUpload': this.uploadExcel(); break;
            case 'pbtnTempDown': this.downTemplate(); break;
        }
    },
    /** Init Design */
    initDesign: function () {
    	HmWindow.create($('#pwindow'));
    	$("#assetAddMultiLoader").jqxLoader({ text: "", isModal: true, width: 60, height: 36, imagePosition: 'top' });

        var source =
            {
                unboundmode: true,
                totalrecords: 1000,
                datafields: [
                    {name: 'Z_SEQ_NO'}
                ],
                updaterow: function (rowid, rowdata, commit) {
                    PMain.validationYn(rowdata);
                    // console.log(rowid)
                    // if(editDevAssetIds.indexOf(rowid) == -1)
                    //     editDevAssetIds.push(rowid);
                    commit(true);
                }
            };
        var dataAdapter = new $.jqx.dataAdapter(source);
        $.extend(dataAdapter, {
            loadComplete: function(records) {
                editDevAssetIds = [];
            }
        });
        HmGrid.create($p_grid, {
            source : dataAdapter,
            width: '100%',
            height: '100%',
            editable : true,
            columnsresize: true,
            selectionmode: 'multiplecellsextended',
            columns : fixedCols
        }, CtxMenu.NONE);

        PMain.searchAsset();
    },

    /** Init Data */
    initData: function () {

    },
    /** 자산 조회 */
    searchAsset: function() {
        Server.get("/main/env/devAssetMgmt/getDevAssetItemList.do", {
            success : function(data) {
                var cols = fixedCols.slice(0);
                codeList = {};

                $.each(data, function(idx, item) {

                    if( item.colNm == 'Z_SN_FLAG' || item.colNm == 'Z_OS_VER_FLAG' || item.colNm == 'Z_HOST_NM_FLAG' || item.colNm == 'Z_ASSET_TOTAL_CNT'
                        || item.colNm == 'Z_IP_FLAG' || item.colNm == 'Z_MAINT_MUSER_FLAG' || item.colNm == 'Z_MAINT_SUSER_FLAG' || item.colNm == 'Z_EOS_DT'){
                        return
                    }else{

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
                        codeList['DEV_ASSET_' + item.colNm] = [/*{codeId: -1, codeValue1: '미설정'}*/];
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
                                    valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme
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
                            codeList['EOS_ASSET_' + item.colNm] = [/*{codeId: -1, codeValue1: '미설정'}*/];
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
                        //                $p_grid.jqxGrid('setcellvalue', row, 'Z_MODEL', null);
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
                            // codeList['DEV_ASSET_' + item.colNm] = [/*{codeId: -1, codeValue1: '미설정'}*/];
                            cols.push({
                                text: item.colCap,
                                datafield: item.colNm,
                                width: item.colDisWidth,
                                editable: (item.colEditFlag == 'Y'),
                                align: 'center',
                                columntype: 'combobox',
                                initeditor: function(row, cellvalue, editor ){
                                    var devKind = $p_grid.jqxGrid('getcellValue', row, 'Z_DEV_KIND');
                                    var vendor = $p_grid.jqxGrid('getcellValue', row, 'Z_VENDOR');

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

                            cols.push( colsObj );
                        }
                    }
                    }
                });

                $p_grid.jqxGrid('beginupdate', true);

                $p_grid.jqxGrid({ columns : cols });
                $p_grid.jqxGrid('endupdate');


            }
        });
    },
    validationYn: function (data, type) {

    },
    save: function () {
        HmGrid.endRowEdit($p_grid);

        $('#assetAddMultiLoader').jqxLoader('open');
        var rows = $p_grid.jqxGrid('getrows');
        var _list = [], _rowIds = [];
        $.each(rows, function (idx, value) {
            // if (value.VALID_YN == 'Y') {
            // value['Z_SEQ_NO'].delete();
                _list.push(value);
                _rowIds.push(value.uid);
            // }
        });
        // $.each(editDevAssetIds, function(idx, value) {
        //     var tmp = $p_grid.jqxGrid('getrowdatabyid', value);
        //     _list.push(tmp);
        //     _rowIds.push(tmp.uid);
        // });

        editDevAssetIds = [];

        Server.post('/main/env/devAssetMgmt/saveDevAsset.do', {
            data : { list : _list, delList: []},
            success: function (result) {
                $('#assetAddMultiLoader').jqxLoader('close');
                    $p_grid.jqxGrid('clear');
                    window.opener.Main.searchAsset();
                    alert('저장되었습니다.');
            },
            error: function(err){
            	$('#assetAddMultiLoader').jqxLoader('close');
            }
        });
    },
    
    /** 엑셀 업로드 */
    uploadExcel: function(){
    	$.post(ctxPath + '/main/popup/env/pDevAssetAddMultiExcel.do', function(result) {
			HmWindow.open($('#pwindow'), '엑셀 업로드', result, 480, 125, 'pwindow_init', codeList );
		});
    },

    /** 템플릿 다운로드 */
    downTemplate: function(){
        var params = {};
        HmUtil.exportExcel(ctxPath + '/main/env/devAssetMgmt/downloadTemplate.do', params);
     }

};
