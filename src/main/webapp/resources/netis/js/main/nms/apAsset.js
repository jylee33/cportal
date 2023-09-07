var $grpTree, $assetGrid;
var editIds = [], addIds = [];
var grpList = [];

var fixedCols = [
	{ text : '관리형태', datafield : 'REG_FLAG', width : 65, editable : false, cellsalign: 'center',  filtertype: 'checkedlist',
		cellsrenderer: function (row, datafield, value, defaultHTML) {
			if(value == null) return;
			var _color = value === 'Y'? '#69B2E4' : '#97dd90';
			var div = $('<div></div>', {
				class: 'jqx-center-align evtName evt',
				style: 'background: {0}'.substitute(_color),
				text: value == 'Y'? '자동' : '수동'
			});
			if(value == 'Y') {
				div.attr('onclick', "try { showApDetail(" + row + ")} catch(e) {}");
			}
			return div[0].outerHTML;
		}
	},
	{ text : 'AP명', datafield : 'AP_NAME', width : 150,
		validation: function(cell, value) {
			if($.isBlank(value)) {
				return { result: false, message: 'AP명을 입력해주세요.' };
			}
			return true;
		}
	},
	{ text : 'AP MAC', datafield : 'AP_MAC', width : 180,
		validation: function(cell, value) {
			if($.isBlank(value)) {
				return { result: false, message: 'AP MAC을 입력해주세요.' };
			}
			return true;
		}
	},
	{ text : 'AP_IP', datafield : 'AP_IP', width : 120,
		validation: function(cell, value) {
			if(!$.isBlank(value) && !$.validateIp(value)) {
				return { result: false, message: 'AP IP를 확인해주세요.' };
			}
			return true;
		}
	},
	{ text : '제조사', datafield : 'VENDOR', width : 120 },
	{ text : '모델', datafield : 'MODEL', width : 120 },
	{ text : '설치위치', datafield : 'SETUP_LOC', width : 150 }
];

var $assetGrid;
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
		case 'btnConf': this.showItemConf(); break;
		case 'btnAdd': this.addAsset(); break;
		case 'btnDel': this.delAsset(); break;
		case 'btnSave': this.saveAsset(); break;
		case 'btnSearch': this.searchAssetItem(); break;
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
		//검색바 호출.
		Master.createSearchBar1('','',$("#srchBox"));
		HmGrid.create($assetGrid, {
				source : new $.jqx.dataAdapter(
					{
						datatype : 'json',
						type: 'POST',
						contentType: 'application/json; charset=UTF-8',
						updaterow : function(rowid, rowdata, commit) {
							if(rowdata.ASSET_NO == -1) {
								return;
							}
							if(editIds.indexOf(rowid) == -1) {
								editIds.push(rowid);
							}
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
							return JSON.stringify(data);
						},
						loadComplete : function(records) {
							editIds = [], addIds = [];
						}
					}
				),
				selectionmode : 'singlerow',
				editable : true,
				editmode : 'selectedcell',
				columns : fixedCols
			}, CtxMenu.COMM);

		$('#section').css('display', 'block');
	},


	/** init data */
	initData: function() {
		Main.searchAssetItem();
	},

	getCommParams: function() {
		return {
			sIp:Master.getSrchIp(),
			sDevName: Master.getSrchDevName()
		};
	},

	/** 자산 조회 */
	searchAssetItem: function() {
		Server.post("/main/nms/apAsset/getAssetItemList.do", {
			data: {},
			success : function(data) {
				var cols = fixedCols.slice(0);
				var codeList = {};

				$.each(data, function(idx, item) {
					if (item.colType == 'NUMBER' || item.colType == 'INT') { //NUMBER 컬럼
                        cols.push(
                            {
                                text: item.colCap,
                                datafield: item.colNm,
                                width: item.colDisWidth || 100,
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
						codeList['AP_ASSET_' + item.colNm] = [{codeId: -1, codeValue1: '미설정'}];
						cols.push( {
							text: item.colCap, datafield: item.colNm, displayfield: 'DIS_ASSET_' + item.colNm, width: item.colDisWidth || 100, align: 'center', columntype: 'dropdownlist',
							createeditor: function(row, value, editor) {
								editor.jqxDropDownList( {
									source: codeList['AP_ASSET_' + item.colNm],
									valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme
								});
							}
						});
						// 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                        Server.get('/code/getCodeListByCodeKind.do', {
                            data: { codeKind: 'AP_ASSET_{0}'.substitute(item.colNm), useFlag: 1 },
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
								width : item.colDisWidth || 100,
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
				Main.searchAsset();
			}
		});
	},

	searchAsset: function() {
		HmGrid.updateBoundData($assetGrid, ctxPath + '/main/nms/apAsset/getApAssetList.do');
	},

	/** 항목설정 */
	showItemConf : function() {
		$.get(ctxPath + '/main/popup/nms/pApAssetItemConf.do',
				function(result) {
					HmWindow.open($('#pwindow'), '자산 항목 관리', result, 800, 600);
				}
		);
	},

	/** 자산 추가 */
	addAsset : function() {
		if (addIds.length > 0) {
			// 수동추가시..
			var lastData = $assetGrid.jqxGrid('getrowdatabyid', addIds[addIds.length - 1]);
			if ($.isBlank(lastData.AP_MAC)){
				return;
			}
		}
		$assetGrid.jqxGrid('addrow', null, {ASSET_NO: -1, REG_FLAG: 'N'});
	},

	addrowResult: function(rowid) {
		// 그룹 미선택 에러를 표시하기 위한 코드
		$assetGrid.jqxGrid('begincelledit', rowid, 'AP_MAC');
		$assetGrid.jqxGrid('endcelledit', rowid, 'AP_MAC', false);
		// 추가된 Row로 스크롤 이동
		$assetGrid.jqxGrid('removesort');
		var rowidx = $assetGrid.jqxGrid('getrowboundindexbyid', rowid);
		$assetGrid.jqxGrid('ensurerowvisible', rowidx);
	},

	/** 자산정보 삭제 */
	delAsset : function() {
		var rowIdx = HmGrid.getRowIdx($assetGrid, '데이터를 선택해주세요.');
		if (rowIdx === false)
			return;
		var rowdata = $assetGrid.jqxGrid('getrowdata', rowIdx);
		if (!confirm('선택된 데이터를 삭제하시겠습니까?'))
			return;
		// 추가된 컬럼이면 로컬에서 삭제
		if (addIds.indexOf(rowdata.uid) !== -1 && rowdata.ASSET_NO === undefined) {
			$assetGrid.jqxGrid('deleterow', rowdata.uid);
			delete addIds[addIds.indexOf(rowdata.uid)];
			return;
		}

		// DB데이터 삭제
		Server.post('/main/nms/apAsset/delApAsset.do', {
			data : {assetNos: [rowdata.ASSET_NO]},
			success : function(result) {
				$assetGrid.jqxGrid('deleterow', rowdata.uid);
				alert('삭제되었습니다.');
			}
		});
	},

	/** 자산정보 저장 */
	saveAsset : function() {
		if (editIds.length == 0 && addIds.length == 0) {
			alert('변경된 내용이 존재하지 않습니다.');
			return;
		}
		var isValid = true;
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
		if(_list.length == 0) {
			alert('저장할 데이터가 없습니다.');
			return;
		}
		$.each(_list, function(idx, item) {
			if($.isBlank(item.AP_MAC)) {
				isValid = false;
				alert('AP MAC을 입력해주세요.');
				return false;
			}
			if(!$.isBlank(item.AP_IP) && !$.validateIp(item.AP_IP)) {
				isValid = false;
				alert('AP IP를 확인해주세요.');
				return false;
			}
		});
		if(isValid == false) return;
		Server.post('/main/nms/apAsset/saveApAsset.do', {
			data :
				{ list : _list },
			success : function(data) {
				editIds = [], addIds = [];
				Main.searchAsset();
				alert('저장되었습니다.');
			}
		});
	},

    exportExcel: function() {
        HmUtil.exportGrid($assetGrid, '자산정보', false);
    }

};

function showApDetail(rowidx) {
	try {
		var rowdata = $assetGrid.jqxGrid('getrowdata', rowidx);
		if(rowdata != null) {
			var params = {
				apNo: rowdata.AP_NO,
				apName: rowdata.AP_NAME
			}
			HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1280, 660, params);
		}
	} catch(e) {}
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
