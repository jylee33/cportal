var $assetGrid;
var editIds = [], addIds = [], _delList = [];
var fixedCols = [{ text: '순번', datafield: 'Z_SEQ_NO', minwidth: 60, cellsalign: 'right',  editable: false, cellsalign: 'center', hidden: true } ,
    { text: '선택', datafield: 'Z_CHECK', minwidth: 60, cellsalign: 'right', cellsalign: 'center', columntype: 'checkbox'},
    { text: '수량분할', datafield: 'Z_DIVISION', minwidth: 60, cellsalign: 'right', cellsalign: 'center', columntype: 'checkbox' }
];

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initData();
	PMain.initDesign();
});

var PMain = {
		/** variable */
        initVariable: function () {
            $assetGrid = $('#assetGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'btnClose': self.close(); break;
                case 'btnSearch': this.searchAsset(); break;
				case 'btnSave': this.saveAsset(); break;
				case 'btnColConf': this.showColConf(); break;
				case 'btnExcel': this.exportExcel(); break;
				case 'btnDel': this.delAsset(); break;
			}
		},
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				PMain.searchAsset();
			}
		},
		/** init design */
		initDesign: function() {
            HmWindow.create($('#pwindow'), 100, 100);

            PMain.createImportDateCondition($('#cbImportDatePeriod'), $('#importDate1'), $('#importDate2'));

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
                        }
                    },
                    {
                        formatData : function(data) {
                            $.extend(data, PMain.getCommParams());
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
		},

		/** init data */
		initData: function() {
            $('#cbItsmSysKind').jqxDropDownList({ width: '70px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
                source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'DEV_ASSET_Z_ASSET_KIND', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
                displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
            });
            $('#cbAssetKind').jqxDropDownList({ width: '70px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
                source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'DEV_ASSET_Z_ASSET_KIND', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
                displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
            });

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

            PMain.searchAsset();
		},
    getCommParams: function() {
        var params = {
            devKind: $('#cbDevKind').val(),
            model: $('#sModel').val(),
            pageSize: $('#cbPageSize').val(),
            importDatePeriod: $('#cbImportDatePeriod').val(),
            importDate1: HmDate.getDateStr($('#importDate1')),
            importDate2: HmDate.getDateStr($('#importDate2'))
        };
        return params;
    },
    /** 항목설정 */
    showColConf : function() {
        $.get(ctxPath + '/hyundaiCar/popup/nms/pItsmAssetItemConf.do',
            function(result) {
                HmWindow.open($('#pwindow'), '자산 항목 관리', result, 740, 465);
            }
        );
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
    /** 자산 조회 */
    searchAsset: function() {
        Server.get("/hyundaiCar/nms/devAssetMgmt/getItsmAssetItemList.do", {
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
                            // if( item.colNm == 'Z_SN' || item.colNm == 'Z_OS_VER' || item.colNm == 'Z_HOST_NM' || item.colNm == 'Z_IP'
                            //     || item.colNm == 'Z_MAINT_MUSER' || item.colNm == 'Z_MAINT_SUSER' ){
                            //     $.extend(colsObj, { cellclassname: PMain.cellclass });
                            // }
                            // if( item.colNm == 'Z_SN_FLAG' || item.colNm == 'Z_OS_VER_FLAG' || item.colNm == 'Z_HOST_NM_FLAG'
                            //     || item.colNm == 'Z_MAINT_MUSER_FLAG' || item.colNm == 'Z_MAINT_SUSER_FLAG' ){
                            //     $.extend(colsObj, { hidden: true});
                            // }
                            cols.push( colsObj );
                        }

                    }
                });

                $assetGrid.jqxGrid('beginupdate', true);

                $assetGrid.jqxGrid({ columns : cols });
                $assetGrid.jqxGrid('endupdate');


                // 데이터 갱신
                HmGrid.updateBoundData($assetGrid, ctxPath + '/hyundaiCar/nms/devAssetMgmt/getDevAssetList.do');

            }
        });
    },

    /** 자산정보 삭제 */
    delAsset : function() {
        // var _seqNos = [];
        // var cells = $assetGrid.jqxGrid('getselectedcells');
        // if (!cells.length){
        //     alert('데이터를 선택해주세요.');
        //     return;
        // }
        // var _rowIdxes = [];
        // $.each(cells, function(i, v){
        //     _rowIdxes.push(v.rowindex);
        // });
		//
        // var rowIdxes = _rowIdxes.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
		//
        // var _localUids = [];
        // var _dbUids = [];
        // if(!confirm('선택된 데이터 ' + rowIdxes.length+ '건을 삭제하시겠습니까?')) return;
		//
        // $.each(rowIdxes, function(i, v){
        //     var rowdata = $assetGrid.jqxGrid('getrowdata', v);
        //     //로컬삭제
        //     if(rowdata.Z_SEQ_NO === undefined){
        //         delete addIds[addIds.indexOf(rowdata.uid)];
        //         _localUids.push(rowdata.uid);
		//
        //     }else{
        //         //DB삭제
        //         _dbUids.push(rowdata.uid);
        //         _seqNos.push(rowdata.Z_SEQ_NO);
        //     }
        // });
        // if(_seqNos.length){
        //     Server.post('/hyundaiCar/nms/devAssetMgmt/delDevAsset.do', {
        //         data :
        //             { seqNos : _seqNos.join(',')},
        //         success : function(data) {
        //             $assetGrid.jqxGrid('deleterow', _dbUids);
        //             $assetGrid.jqxGrid('deleterow', _localUids);
        //             Main.searchAsset();
        //         }
        //     });
        // }else{
        //     $assetGrid.jqxGrid('deleterow', _localUids);
        // }
    },

};
