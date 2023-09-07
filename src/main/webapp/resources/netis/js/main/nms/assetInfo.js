var $grpTree, $devAssetGrid, $apAssetGrid, $dtlTab;
var editIds = [], addIds = [];
var ctxIdxs = 0;
var selectedTab = 0;

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid'), $devAssetGrid = $('#devAssetGrid'), $apAssetGrid = $('#apAssetGrid');
        $dtlTab = $('#dtlTab');
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
        $('#section').css('display', 'block');
		//검색바 호출.
		Master.createSearchBar1('','',$("#srchBox"));

		HmJqxSplitter.createTree($('#mainSplitter'));
		HmWindow.create($('#pwindow'), 100, 100);
		HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree);

        Main.initTab();
        // $('#section').css('display', 'block');
	},

    initTab: function () {
        $dtlTab.jqxTabs({ width: '100%', height: '100%', theme: "ui-hamon-v1-tab-top",
            initTabContent: function(tab) {
                switch(tab) {
                    case 0: // DEV
                        HmGrid.create($devAssetGrid, {
                            source : new $.jqx.dataAdapter(
                                {
                                    datatype : 'json',
                                    updaterow : function(rowid, rowdata, commit) {
                                        if (rowdata.DEV10_FLAG == 2 && rowdata.MNG_NO === null)
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
                                        editIds = [], addIds = [];
                                    }
                                }
                            ),
                            selectionmode : 'singlerow',
                            editable : true,
                            editmode : 'selectedcell',
                            columns : fixedCols,
                            // ready: Main.searchAsset
                        }, CtxMenu.DEV10, ctxIdxs++);
                        break;
                    case 1: // AP
                        HmGrid.create($apAssetGrid, {
                            source : new $.jqx.dataAdapter(
                                {
                                    datatype : 'json',
                                    updaterow : function(rowid, rowdata, commit) {
                                        if (rowdata.AP_FLAG == 2 && rowdata.MNG_NO === null)
                                            return;
                                        if (editIds.indexOf(rowid) == -1)
                                            editIds.push(rowid);
                                        commit(true);
                                    },
                                    addrow: function(rowid, rowdata, position, commit) {
                                        addIds.push(rowid);
                                        commit(true);
                                        setTimeout("Main.addrowApResult(" + rowid + ");", 100);
                                    }
                                },
                                {
                                    formatData : function(data) {
                                        $.extend(data, Main.getCommParams());
                                        return data;
                                    },
                                    loadComplete : function(records) {
                                        editIds = [], addIds = [];
                                    }
                                }
                            ),
                            selectionmode : 'singlerow',
                            editable : true,
                            editmode : 'selectedcell',
                            columns : fixedApCols,
                            // ready: Main.searchAsset
                        }, CtxMenu.DEV10, ctxIdxs++);
                }
            }
        });

        $dtlTab.on('selected', function (event) {
            selectedTab = event.args.item;
            selectedTab === 0 ? //그룹 트리 변경
                HmTreeGrid.updateData($grpTree, HmTree.T_GRP_DEFAULT2) :
                HmTreeGrid.updateData($grpTree, HmTree.T_AP_GRP_DEFAULT)
        })
    },
	
	/** init data */
	initData: function() {

	},

	getCommParams: function() {
		var _grpNo = -1, _itemKind = 'GROUP';
		var treeItem = HmTreeGrid.getSelectedItem($grpTree);
		if(treeItem !== null) {
			_itemKind = treeItem.devKind2;
			_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
		}
		return {
			grpType: 'DEFAULT',
			itemKind: _itemKind,
			grpNo: _grpNo,
			sIp:Master.getSrchIp(),
			sDevName: Master.getSrchDevName()
		};	
	},
	
	selectTree: function() {
		Main.searchAsset();
	},

	/** 자산 조회 */
	searchAsset: function() {

        var prefix = '/main/nms/assetInfo/';
		var itemUrl = prefix + 'getAssetItemList.do';
		var listUrl = prefix + 'getAssetInfoList.do';

        var grid = $devAssetGrid;
        var cols = fixedCols.slice(0);

        //AP
		if(selectedTab === 1) {
			itemUrl = prefix + 'getApAssetItemList.do';
            listUrl = prefix + 'getApAssetInfoList.do';

            grid = $apAssetGrid;
            cols = fixedApCols.slice(0);
        }

		Server.get(itemUrl, {
			success : function(data) {
				var codeList = {};

				$.each(data, function(idx, item) {
					if (item.colType == 'NUMBER' || item.colType == 'INT') { //NUMBER 컬럼
                        cols.push(
                            {
                                text: item.colCap,
                                datafield: item.colNm,
                                width: 100,
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
						codeList['ASSET_' + item.colNm] = [{codeId: -1, codeValue1: '미설정'}];
						cols.push( {
							text: item.colCap, datafield: item.colNm, displayfield: 'DIS_ASSET_' + item.colNm, width: 100, align: 'center', columntype: 'dropdownlist',
							createeditor: function(row, value, editor) {
								editor.jqxDropDownList( {
									source: codeList['ASSET_' + item.colNm],
									valueMember: 'codeId', displayMember: 'codeValue1', theme: jqxTheme
								});
							}
						});
						// 코드성컬럼의 코드정보를 조회하여 바인딩한다.
                        Server.get('/code/getCodeListByCodeKind.do', {
                            data: { codeKind: 'ASSET_{0}'.substitute(item.colNm), useFlag: 1 },
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
								width : 100,
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

				grid.jqxGrid('beginupdate', true);
                grid.jqxGrid({ columns : cols });
                grid.jqxGrid('endupdate');

				// 데이터 갱신
				HmGrid.updateBoundData(grid, ctxPath + listUrl);
			}
		});
	},
	
	/** 항목설정 */
	showItemConf : function() {
		$.get(ctxPath + '/main/popup/nms/pAssetItemConf.do', 
				function(result) {
					HmWindow.open($('#pwindow'), '자산 항목 관리', result, 800, 600);
				}
		);
	},
	
	/** 자산 추가 */
	addAsset : function() {
        var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
        if(treeItem === null || treeItem.devKind2 !== 'GROUP') {
            alert('그룹을 선택해주세요.');
            return;
        }

        var grpName = Hlpr.sliceCharBeforeStr(treeItem.grpName, '(');
        if(selectedTab === 0) {
            if (addIds.length > 0) {
                // 수동추가시..
                var lastData = $devAssetGrid.jqxGrid('getrowdatabyid', addIds[addIds.length - 1]);
                if (lastData.GRP_NO == 0 || $.isBlank(lastData.DEV_NAME) || $.isBlank(lastData.DEV_IP))
                    return;
            }

            $devAssetGrid.jqxGrid('addrow', null, {
                DEV10_FLAG: 2, DEV10_FLAG_STR: '수동',
                GRP_NO: treeItem.grpNo,
                GRP_NAME: grpName,
                MNG_NO: null, DEV_NAME: null,
                DEV_IP: null, DEV_KIND1: null
            });

        } else {
            if (addIds.length > 0) {
                // 수동추가시..
                var lastData = $apAssetGrid.jqxGrid('getrowdatabyid', addIds[addIds.length - 1]);
                if (lastData.GRP_NO == 0 || $.isBlank(lastData.AP_NAME) || $.isBlank(lastData.AP_IP))
                    return;
            }

            $apAssetGrid.jqxGrid('addrow', null, {
                AP_FLAG: 2, AP_FLAG_STR: '수동',
                GRP_NO: treeItem.grpNo,
                GRP_NAME: grpName,
                MNG_NO: null, AP_NAME: null,
                AP_IP: null, SETUP_LOC: null,
            });
        }

	},
	
	addrowResult: function(rowid) {
		// 그룹 미선택 에러를 표시하기 위한 코드
		$devAssetGrid.jqxGrid('begincelledit', rowid, 'DEV_NAME');
		$devAssetGrid.jqxGrid('endcelledit', rowid, 'DEV_NAME', false);
		// 추가된 Row로 스크롤 이동
		$devAssetGrid.jqxGrid('removesort');
		var rowidx = $devAssetGrid.jqxGrid('getrowboundindexbyid', rowid);
		$devAssetGrid.jqxGrid('ensurerowvisible', rowidx);
	},

    addrowApResult: function(rowid) {
        // 그룹 미선택 에러를 표시하기 위한 코드
        $apAssetGrid.jqxGrid('begincelledit', rowid, 'AP_NAME');
        $apAssetGrid.jqxGrid('endcelledit', rowid, 'AP_NAME', false);
        // 추가된 Row로 스크롤 이동
        $apAssetGrid.jqxGrid('removesort');
        var rowidx = $apAssetGrid.jqxGrid('getrowboundindexbyid', rowid);
        $apAssetGrid.jqxGrid('ensurerowvisible', rowidx);
    },

	/** 자산정보 삭제 */
	delAsset : function() {

		var url = "/main/nms/assetInfo/delAssetInfo.do";
		var grid = $devAssetGrid;

        if(selectedTab === 1)  {
            grid = $apAssetGrid;
        	url = "/main/nms/assetInfo/delApAssetInfo.do";
        }

		var rowIdx = HmGrid.getRowIdx(grid, '데이터를 선택해주세요.');

		if (rowIdx === false) return;

		var rowdata = grid.jqxGrid('getrowdata', rowIdx);

		if (!confirm('선택된 데이터를 삭제하시겠습니까?')) return;

		// 추가된 컬럼이면 로컬에서 삭제
		if (addIds.indexOf(rowdata.uid) !== -1 && rowdata.MNG_NO === undefined) {
            grid.jqxGrid('deleterow', rowdata.uid);
			delete addIds[addIds.indexOf(rowdata.uid)];
			return;
		}

		// DB데이터 삭제
		Server.post(url, {
			data : rowdata,
			success : function(result) {
				grid.jqxGrid('deleterow', rowdata.uid);
				alert(result);
			} 
		});

	},

	/** 자산정보 저장 */
	saveAsset : function() {
		if (editIds.length === 0 && addIds.length === 0) {
			alert('변경된 내용이 존재하지 않습니다.');
			return;
		}

		selectedTab === 0 ? Main.devAsset() : Main.apAsset();
	},

    devAsset: function () {

        var isValid = true, _delCols = ['DEV_KIND1'];
        var _list = [];
        $.each(editIds, function(idx, value) {
            var tmp = $devAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });

        $.each(addIds, function(idx, value) {
            var tmp = $devAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });

        if(_list.length === 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        $.each(_list, function(idx, item) {
            if($.isBlank(item.DEV_NAME)) {
                isValid = false;
                alert('장비명을 입력해주세요.');
                return;
            }
            if($.isBlank(item.DEV_IP)) {
                isValid = false;
                alert('장비IP를 입력해주세요.');
                return;
            }
            if(!$.validateIp(item.DEV_IP)) {
                isValid = false;
                alert('장비IP를 확인해주세요.');
                return;
            }
        });

        if(isValid == false) return;

        Server.post('/main/nms/assetInfo/saveAssetInfo.do', {
            data : { list : _list },
            success : function(data) {
                editIds = [], addIds = [];
                alert(data);
                //Main.searchAsset();
            }
        });
    },

    apAsset: function () {

        var isValid = true, _delCols = ['DEV_KIND1'];
        var _list = [];
        $.each(editIds, function(idx, value) {
            var tmp = $apAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });

        $.each(addIds, function(idx, value) {
            var tmp = $apAssetGrid.jqxGrid('getrowdatabyid', value);

            if (tmp !== undefined) {
                $.each(_delCols, function(idx, delKey) {
                    delete tmp[delKey];
                });
                _list.push(tmp);
            }
        });

        if(_list.length === 0) {
            alert('저장할 데이터가 없습니다.');
            return;
        }

        $.each(_list, function(idx, item) {
            if($.isBlank(item.AP_NAME)) {
                isValid = false;
                alert('AP명을 입력해주세요.');
                return;
            }
            if($.isBlank(item.AP_IP)) {
                isValid = false;
                alert('AP IP를 입력해주세요.');
                return;
            }
            if(!$.validateIp(item.AP_IP)) {
                isValid = false;
                alert('AP IP를 확인해주세요.');
                return;
            }
        });

        if(isValid === false) return;

        Server.post('/main/nms/assetInfo/saveApAssetInfo.do', {
            data : { list : _list },
            success : function(data) {
                editIds = [], addIds = [];
                alert(data);
                //Main.searchAsset();
            }
        });
    },

    exportExcel: function() {
        selectedTab === 0 ?
            HmUtil.exportGrid($devAssetGrid, '장비자산정보', false) :
            HmUtil.exportGrid($apAssetGrid, 'AP자산정보', false);
    },
	
	exportExcel__: function() {
        var tabIdx = $('#dtlTab').val();
        var url = "/main/nms/assetInfo/export.do";
        if(tabIdx == 1) {
            url = "/main/nms/assetInfo/apExport.do";
        }

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
		
		HmUtil.exportExcel(ctxPath + url, params);
	}

};

var fixedCols = [
    { text : '관리형태', datafield : 'DEV10_FLAG_STR', width : 65, editable : false, cellsalign: 'center',  filtertype: 'checkedlist',
        cellsrenderer: function (row, datafield, value, defaultHTML) {
            if(value == null) return;
            var _color = '#d4d4d4';
            switch(value.toString().toUpperCase()) {
                case "등록":
                    _color = '#69B2E4'; break;
                case "삭제":
                    _color = '#d4d4d4'; break;
                case "수동":
                    _color = '#97dd90'; break;
                default: return ;
            }
            var div = $('<div></div>', {
                class: 'jqx-center-align evtName evt',
                style: 'background: {0}'.substitute(_color),
                text: value
            });
            return div[0].outerHTML;
        }
    },
    { text : '타입', datafield : 'DEV_KIND1', editable : false, hidden: true },
    { text : '그룹', datafield : 'GRP_NO', displayfield : 'GRP_NAME', width : 200, columntype : 'dropdownlist', editable: false,
        validation : function(cell, value) {
            if (value == 0 || value == null) {
                return { result : false, message : '그룹을 선택해주세요.' };
            }
            return true;
        }
    },
    { text : '장비명', datafield : 'DEV_NAME', width : 200,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: '장비명을 입력해주세요.' };
            }
            return true;
        }
    },
    { text : '장비IP', datafield : 'DEV_IP', width : 120,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: '장비IP를 입력해주세요.' };
            }
            if(!$.validateIp(value)) {
                return { result: false, message: '장비IP를 확인해주세요.' };
            }
            return true;
        }
    }
];

var fixedApCols = [
    { text : '관리형태', datafield : 'AP_FLAG_STR', width : 65, editable : false, cellsalign: 'center',  filtertype: 'checkedlist',
        cellsrenderer: function (row, datafield, value, defaultHTML) {
            if(value == null) return;
            var _color = '#d4d4d4';
            switch(value.toString().toUpperCase()) {
                case "등록":
                    _color = '#69B2E4'; break;
                case "삭제":
                    _color = '#d4d4d4'; break;
                case "수동":
                    _color = '#97dd90'; break;
                default: return ;
            }

            var div = $('<div></div>', {
                class: 'jqx-center-align evtName evt',
                style: 'background: {0}'.substitute(_color),
                text: value
            });
            return div[0].outerHTML;
        }
    },
    { text : '그룹', datafield : 'GRP_NO', displayfield : 'GRP_NAME', width : 200, columntype : 'dropdownlist', editable: false,
        validation : function(cell, value) {
            if (value == 0 || value == null) {
                return { result : false, message : '그룹을 선택해주세요.' };
            }
            return true;
        }
    },
    { text : 'AP명', datafield : 'AP_NAME', width : 200,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: 'AP명을 입력해주세요.' };
            }
            return true;
        }
    },
    { text : 'IP', datafield : 'AP_IP', width : 120,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: 'AP IP를 입력해주세요.' };
            }
            if(!$.validateIp(value)) {
                return { result: false, message: 'AP IP를 확인해주세요.' };
            }
            return true;
        }
    },
    { text : '설치위치', datafield : 'SETUP_LOC', width : 120,
        validation: function(cell, value) {
            if($.isBlank(value)) {
                return { result: false, message: '위치를 입력해주세요.' };
            }
            return true;
        }
    }
];

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

