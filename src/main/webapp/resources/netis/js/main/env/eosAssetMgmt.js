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
		case 'btnDel': this.delAsset(); break;
		case 'btnSave': this.saveAsset(); break;
		case 'btnSearch': this.searchAsset(); break;
		case 'btnExcel': this.exportExcel(); break;
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
						}
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

			}, CtxMenu.DEV10);

		$assetGrid.on('bindingcomplete', function(){
            if($('#cbPageSize').val() != 'ALL'){
                $assetGrid.jqxGrid({pagesize: parseInt($('#cbPageSize').val()) })
            }else{
                var rowscount = $assetGrid.jqxGrid('getdatainformation').rowscount;
                $assetGrid.jqxGrid({pagesize: parseInt(rowscount)})
            }
		});

		Main.searchAsset();
	},
	
	/** init data */
	initData: function() {

       /* $('#cbDevKind').jqxDropDownList({ width: '120px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/main/env/eosAssetMgmt/getEosDevKindList.do' }),
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });

        $('#cbVendor').jqxDropDownList({ width: '120px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: new $.jqx.dataAdapter({ datatype: 'json', url: ctxPath + '/main/env/eosAssetMgmt/getEosVendorList.do' }),
            displayMember: 'label', valueMember: 'value', selectedIndex: 0
        });*/

        $('#cbDevKind').jqxDropDownList({ width: '120px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'EOS_ASSET_Z_DEV_KIND', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
		}).on('bindingComplete', function(event){
			$('#cbDevKind').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '전체'}, 0);
        });

        $('#cbVendor').jqxDropDownList({ width: '120px', height: '21px', dropDownHeight: 200, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'EOS_ASSET_Z_VENDOR', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
        }).on('bindingComplete', function(event){
            $('#cbVendor').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '전체'}, 0);
        });

        $('#cbEosDeclareCd').jqxDropDownList({ width: '70px', height: '21px', autoDropDownHeight: true, theme: jqxTheme,
            source: HmDropDownList.getSourceByUrl('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {codeKind: 'EOS_ASSET_Z_EOS_DECLARE_CD', useFlag: 1, SORT: 'ORDER BY CODE_ID'}),
            displayMember: 'codeValue1', valueMember: 'codeId', selectedIndex: 0
        }).on('bindingComplete', function(event){
            $('#cbEosDeclareCd').jqxDropDownList('insertAt',{codeId: 'ALL', codeValue1: '전체'}, 0);
        });

        $('#eosDate').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });
        var today = new Date();
//			today.setHours(today.getHours() -1, 0, 0, 0);
        today.setDate(today.getDate()-1);
        $('#eosDate').jqxDateTimeInput('setDate', today);

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
            devKind: $('#cbDevKind').val(),
            vendor: $('#cbVendor').val(),
            model: $('#sModel').val(),
            eosDeclareCd: $('#cbEosDeclareCd').val(),
            eosDtCond: $('#cbEosDtCond').val(),
            pageSize: $('#cbPageSize').val(),
        };
        console.log(params)
        return params;
	},
	
	/** 자산 조회 */
	searchAsset: function() {
		Server.get("/main/env/eosAssetMgmt/getEosAssetItemList.do", {
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
                    } else if(item.colType == 'CODE') { //CODE 컬럼
						codeList['EOS_ASSET_' + item.colNm] = [/*{codeId: '-1', codeValue1: '미설정'}*/];
						cols.push( {
							text: item.colCap, datafield: item.colNm, displayfield: 'DIS_EOS_ASSET_' + item.colNm, width: item.colDisWidth, editable: (item.colEditFlag == 'Y'), align: 'center', columntype: 'dropdownlist',
							createeditor: function(row, value, editor) {
								editor.jqxDropDownList( {
									source: codeList['EOS_ASSET_' + item.colNm],
									valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme, dropDownHeight: 200
								});
							}
						});
						// 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                        Server.get('/main/env/eosAssetMgmt/getCodeListByCodeKind.do', {
                            data: { codeKind: 'EOS_ASSET_{0}'.substitute(item.colNm), useFlag: 1, SORT: 'ORDER BY CODE_VALUE1' },
                            success: function(codeResult) {
                                if(codeResult.length) {
                                	$.each(codeResult, function(idx, value) {
                                        codeList[codeResult[0].codeKind].push(value);
									});
								}
                            }
                        });
					} else { //VARCHAR 컬럼
						cols.push(
							{
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

							});
					}
				});

				$assetGrid.jqxGrid('beginupdate', true);
				$assetGrid.jqxGrid({ columns : cols });
				$assetGrid.jqxGrid('endupdate');

				// 데이터 갱신
				HmGrid.updateBoundData($assetGrid, ctxPath + '/main/env/eosAssetMgmt/getEosAssetList.do');

			}
		});
	},
	
	/** 항목설정 */
	showColConf : function() {
		$.get(ctxPath + '/hyundaiCar/popup/nms/pEosAssetItemConf.do',
				function(result) {
					HmWindow.open($('#pwindow'), '자산 항목 관리', result, 740, 465);
				}
		);
	},
    /** 항목설정 */
    showCodeConf : function() {
        $.get(ctxPath + '/hyundaiCar/popup/nms/pEosAssetItemConf.do',
            function(result) {
                HmWindow.open($('#pwindow'), '자산 항목 관리', result, 740, 465);
            }
        );
    },
	
	/** 자산 추가 */
	addAsset : function() {

		$assetGrid.jqxGrid('addrow', null, {FLAG: 2});
	},
	
	addrowResult: function(rowid) {
		// 추가된 Row로 스크롤 이동
		$assetGrid.jqxGrid('removesort');
		var rowidx = $assetGrid.jqxGrid('getrowboundindexbyid', rowid);
		$assetGrid.jqxGrid('ensurerowvisible', rowidx);
	},

	/** 자산정보 삭제 */
	delAsset : function() {

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

		var _uids = [];
        $.each(rowIdxes, function(i, v){
            var rowdata = $assetGrid.jqxGrid('getrowdata', v);
        	//로컬삭제
			if(rowdata.Z_SEQ_NO === undefined){
				delete addIds[addIds.indexOf(rowdata.uid)];
				_uids.push(rowdata.uid);

			}else{
				//DB삭제
                _uids.push(rowdata.uid);
				_delList.push(rowdata);
			}
        });
        $assetGrid.jqxGrid('deleterow', _uids);
	},

	/** 자산정보 저장 */
	saveAsset : function() {
		if (editIds.length == 0 && addIds.length == 0  && _delList.length == 0) {
			alert('변경된 내용이 존재하지 않습니다.');
			return;
		}

		var isValid = true; //_delCols = ['Z_SEQ_NO'];
		var _list = [];
		$.each(editIds, function(idx, value) {
			var tmp = $assetGrid.jqxGrid('getrowdatabyid', value);
			if (tmp !== undefined) {
                // $.each(_delCols, function(idx, delKey) {
                //     delete tmp[delKey];
                // });
                _list.push(tmp);
            }
		});
		$.each(addIds, function(idx, value) {
			var tmp = $assetGrid.jqxGrid('getrowdatabyid', value);
			if (tmp !== undefined) {
                // $.each(_delCols, function(idx, delKey) {
                //     delete tmp[delKey];
                // });
				_list.push(tmp);
			}
		});

		if( (_list.length + _delList.length) == 0) {
			alert('저장할 데이터가 없습니다.');
			return;
		}
		$.each(_list, function(idx, item) {
			if($.isBlank(item.Z_CATEGORY)) {
				isValid = false;
				alert('대분류를 입력해주세요.');
				return;
			}
			if($.isBlank(item.Z_SUB_CATEGORY)) {
				isValid = false;
				alert('중분류를 입력해주세요.');
				return;
			}
            if($.isBlank(item.Z_MODEL)) {
				isValid = false;
				alert('모델을 입력해주세요.');
				return;
			}
		});
		if(isValid == false) return;
		Server.post('/main/env/eosAssetMgmt/saveEosAsset.do', {
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
        console.log(column)
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
            console.log('uid:' + rowdata.uid+',' + 'chgField:' + selectedField +',' + 'chgDisField:' + selectedDisField);
            _uids.push(rowdata.uid);
        });

        var params = {
            uids: _uids.join(','),
            datafield: selectedField,
            columnType: selectedColumnType,
            codePrefix: 'EOS_ASSET_'
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
            $assetGrid.jqxGrid('setcellvaluebyid', uidArr[i], 'DIS_EOS_ASSET_' + datafield, data.label);
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
	}

};

$(function() {
	Main.initVariable();
	Main.observe();
    Main.initData();
	Main.initDesign();
});