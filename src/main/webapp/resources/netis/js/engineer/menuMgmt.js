var $pageGrid, $pageGrpGrid, $menuGrid;


var popIdx = 0;

var curMenuNo = 0;
var curMenuPageNo = 0;
var curMenuPageGrpNo = 0;
var pageIds = [];
var pageGrpIds = [];
var menuIds = [];

var Main = {
		/** variable */
		initVariable: function() {
			$pageGrid = $('#pageGrid'), $pageGrpGrid = $('#pageGrpGrid'), $menuGrid = $('#menuGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */		
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch_dev': this.searchMain(); break;
			case 'btnAdd_page': this.addPage(); break;
			case 'btnEdit_page': this.editPage(); break;
			case 'btnDel_page': this.delPage(); break;
			case 'btnSave_page': this.savePage(); break;
			case 'btnAdd_pageGrp': this.addPageGroup(); break;
			case 'btnDel_pageGrp': this.delPageGroup(); break;
			case 'btnSave_pageGrp': this.savePageGroup(); break;
			case 'btnAdd_menu': this.addMenu(); break;
			case 'btnDel_menu': this.delMenu(); break;
			case 'btnSave_menu': this.saveMenu(); break;
			case 'btnLayout_mgr': this.layoutMgr(); break;
			case 'btnAdd_link': this.addLinkMenu(); break;
			case 'btnWidget_mgr': this.widgetMgr(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#splitter1'), HmJqxSplitter.ORIENTATION_V, [{ size: '30%' }, { size: '70%' }]);
			HmJqxSplitter.create($('#splitter2'), HmJqxSplitter.ORIENTATION_V, [{ size: '40%' }, { size: '60%' }]);

			HmGrid.create($pageGrid, {
				source : new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(pageIds.indexOf(rowid) == -1)
									pageIds.push(rowid);
				            	commit(true);
				            },
				            addrow: function(rowid, rowdata, position, commit) {
				            	$.each(rowid, function(idx, value) {
				            		pageIds.push(value);
				            	})
				            	commit(true);
				            },
							datafields: [
								{name: 'menuNo', type: 'number'},
								{name: 'menuName', type: 'string'},
								{name: 'menuKind', type: 'string'},
								{name: 'auth', type: 'string'},
								{name: 'menuPageNo', type: 'number'},
								{name: 'menuPageGrpNo', type: 'number'},
								{name: 'guid', type: 'string'},
								{name: 'siteName', type: 'string'},
								{name: 'visibleOrder', type: 'number'},
								{name: 'webIconClass', type: 'string'}
							]
						},
						{
							loadComplete: function(records) {
								pageIds = [];
							}
						}
				),
				pageable : false,
				editable: true,
			    editmode: 'selectedrow',
				columns : [
					{ text : 'menuNo', datafield : 'menuNo', width : 80 , hidden : true},
					{ text : '대메뉴', datafield : 'menuName', minwidth : 100,
						validation: function(cell, value) {							
							if($.isBlank(value)) {
								return { result: false, message: '메뉴명을 입력해주세요.' };
							}
							return true;
						}
					},
					{ text : 'menuKind', datafield : 'menuKind', width : 120 , hidden : true},
					{ text : 'Auth', datafield : 'auth', width : 40 , hidden : true },
					{ text : 'menuPageNo', datafield : 'menuPageNo', minwidth : 100 , hidden : true},
					{ text : 'menuPageGrpNo', datafield : 'menuPageGrpNo', minwidth : 100 , hidden : true},
					{ text : 'guid', datafield : 'guid', minwidth : 100 , hidden : true},
					{ text : 'siteName', datafield : 'siteName', minwidth : 100 , hidden : true},
					{ text : '순서', datafield : 'visibleOrder', width : 60, columntype: 'numberinput', cellsalign: 'right' },
					{ text : '아이콘', datafield : 'webIconClass', width : 150 }
				]
			});
			$pageGrid.on('bindingcomplete', function() {
				$(this).jqxGrid('sortby', 'visibleOrder', 'asc');
				var datarow = $pageGrid.jqxGrid('getrowdata', 0);
				 curMenuPageNo = datarow.menuNo;
				 Main.searchPageGroup();
			});
			
			$pageGrid.on('rowclick', function(event) {
				var row = event.args.rowindex;
				 var datarow = $pageGrid.jqxGrid('getrowdata', row);
				 curMenuPageNo = datarow.menuNo;
				 Main.searchPageGroup();
			});
			
			HmGrid.create($pageGrpGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(pageGrpIds.indexOf(rowid) == -1)
									pageGrpIds.push(rowid);
				            	commit(true);
				            },
				            addrow: function(rowid, rowdata, position, commit) {
				            	$.each(rowid, function(idx, value) {
				            		pageGrpIds.push(value);
				            	})
				            	commit(true);
				            },
							datafields: [
								{name: 'menuNo', type: 'number'},
								{name: 'menuName', type: 'string'},
								{name: 'menuKind', type: 'string'},
								{name: 'auth', type: 'string'},
								{name: 'menuPageNo', type: 'number'},
								{name: 'menuPageGrpNo', type: 'number'},
								{name: 'guid', type: 'string'},
								{name: 'siteName', type: 'string'},
								{name: 'visibleOrder', type: 'number'},
								{name: 'webIconClass', type: 'string'}
							]
						},
						{
							formatData: function(data) {
								$.extend(data, {
									menuPageNo: curMenuPageNo
								});
								return data;
							},
							loadComplete: function(records) {
								pageGrpIds = [];
							}
						}
				),
				pageable : false,
				editable: true,
			    editmode: 'selectedrow',
				columns: 
				[
					{ text : 'menuNo', datafield : 'menuNo', hidden : true},
					{ text : '중메뉴', datafield : 'menuName', minwidth : 150},
					{ text : 'menuKind', datafield : 'menuKind', hidden : true},
					{ text : 'Auth', datafield : 'auth', width : 40,  hidden : true},
					{ text : 'menuPageNo', datafield : 'menuPageNo', hidden : true},
					{ text : 'menuPageGrpNo', datafield : 'menuPageGrpNo' , hidden : true},
					{ text : 'guid', datafield : 'guid', hidden : true},
					{ text : 'siteName', datafield : 'siteName', hidden : true},
					{ text : '순서', datafield : 'visibleOrder', width : 60, columntype: 'numberinput', cellsalign: 'right' },
					{ text : '아이콘', datafield : 'webIconClass', hidden : true}
				 ]
			});			
			$pageGrpGrid.on('bindingcomplete', function() {
				$(this).jqxGrid('sortby', 'visibleOrder', 'asc');
				var datarow = $pageGrpGrid.jqxGrid('getrowdata', 0);
				 if(datarow != null){
					 curMenuPageGrpNo = datarow.menuNo;
					 curMenuNo = datarow.menuPageNo;
					 Main.searchMenu();
				 }else{
					 $menuGrid.jqxGrid('clear');
				 }
			});
			
			$pageGrpGrid.on('rowclick', function(event) {
				var row = event.args.rowindex;
				 var datarow = $pageGrpGrid.jqxGrid('getrowdata', row);
				 if(datarow != null){
					 curMenuPageGrpNo = datarow.menuNo;
					 curMenuNo = datarow.menuPageNo;
					 Main.searchMenu();
				 }else{
					 $menuGrid.jqxGrid('clear');
				 }
			});
			
			HmGrid.create($menuGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(menuIds.indexOf(rowid) == -1)
									menuIds.push(rowid);
				            	commit(true);
				            },
				            addrow: function(rowid, rowdata, position, commit) {
				            	$.each(rowid, function(idx, value) {
				            		menuIds.push(value);
				            	})
				            	commit(true);
				            },
							datafields: [
								{name: 'menuNo', type: 'number'},
								{name: 'menuType', type: 'string'},
								{name: 'originMenuName', type: 'string'},
								{name: 'menuName', type: 'string'},
								{name: 'menuKind', type: 'string'},
								{name: 'auth', type: 'string'},
								{name: 'menuPageNo', type: 'number'},
								{name: 'menuPageGrpNo', type: 'number'},
								{name: 'guid', type: 'string'},
								{name: 'siteName', type: 'string'},
								{name: 'visibleOrder', type: 'number'},
								{name: 'isWebuse', type: 'number'},
								{name: 'webIconClass', type: 'string'}
							]
						},
						{
							formatData: function(data) {
								$.extend(data, {
									menuPageGrpNo: curMenuPageGrpNo,
									menuPageNo: curMenuNo
								});
								return data;
							},
							loadComplete: function(records) {
								menuIds = [];
							}
						}
				),
				pageable : false,
				editable: true,
			    editmode: 'selectedrow',
				columns: 
				[
					{ text : 'menuNo', datafield : 'menuNo', hidden : true},
					{ text : '타입', datafield : 'menuType', minwidth : 80, editable: false },
					{ text : '소메뉴', datafield : 'originMenuName', minwidth : 130, editable: false },
					{ text : '사용자 소메뉴', datafield : 'menuName', minwidth : 130 },
					{ text : 'menuKind', datafield : 'menuKind', hidden : true},
					{ text : 'menuPageNo', datafield : 'menuPageNo', hidden : true},
					{ text : 'menuPageGrpNo', datafield : 'menuPageGrpNo', hidden : true},
					{ text : 'guid', datafield : 'guid', hidden : true},
					{ text : 'siteName', datafield : 'siteName', hidden : true},
					{ text : '순서', datafield : 'visibleOrder', width : 60, columntype: 'numberinput', cellsalign: 'right' },
					{ text : '웹 사용', datafield : 'isWebuse', width : 60, columntype: 'checkbox'},
					{ text : 'webIconClass', datafield : 'webIconClass', hidden : true}
				 ]
			});
			$menuGrid.on('bindingcomplete', function() {
				$(this).jqxGrid('sortby', 'visibleOrder', 'asc');
			});
			
		},
		
		initData: function() {
			HmGrid.updateBoundData($pageGrid, ctxPath + '/engineer/menuMgmt/getPageList.do');
		},
		searchPage: function() {
			HmGrid.updateBoundData($pageGrid, ctxPath + '/engineer/menuMgmt/getPageList.do');
		},
		searchPageGroup: function() {
			HmGrid.updateBoundData($pageGrpGrid, ctxPath + '/engineer/menuMgmt/getPageGroupList.do');
		},
		searchMenu: function() {
			HmGrid.updateBoundData($menuGrid, ctxPath + '/engineer/menuMgmt/getMenuList.do');
		},
		
		
		
		/** 대메뉴 추가 */
		addPage: function() {
			$.get(ctxPath + '/engineer/popup/pPageAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '대메뉴 추가', result, 382, 410);
			});
		},
		
		/** 대메뉴 수정 */
		editPage: function() {
            var rowIdxes = HmGrid.getRowIdx($pageGrid);
            if(rowIdxes === false) return;
            var rowdata = $pageGrid.jqxGrid('getrowdata', rowIdxes);

            $.get(ctxPath + '/engineer/popup/pPageEdit.do', function(result) {
				HmWindow.open($('#pwindow'), '대메뉴 수정', result, 382, 410, null, rowdata);
			});
		},

		/** 대메뉴 삭제 */
		delPage: function() {
			var rowIdxes = HmGrid.getRowIdx($pageGrid);
			if(rowIdxes === false) return;
			var rowdata = $pageGrid.jqxGrid('getrowdata', rowIdxes);
			
			if(!confirm('[' + rowdata.menuName + '] 를 삭제하시겠습니까?')) return;
			
			Server.post('/engineer/popup/delPage.do', {
			data: { menuNo: rowdata.menuNo },
			success: function(result) {
				$pageGrid.jqxGrid('deleterow', rowdata.uid);
                Main.searchPageGroup();
                alert('삭제되었습니다.');
			}
		});
		},
		/** 대메뉴 저장 */
		savePage: function() {
			HmGrid.endRowEdit($pageGrid);
			if(pageIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			
			var _list = [];
			$.each(pageIds, function(idx, value) {
				_list.push($pageGrid.jqxGrid('getrowdatabyid', value));
			});
			Server.post('/engineer/popup/savePage.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					pageIds = [];
				}
			});
		},
		
		/** 중메뉴 추가 */
		addPageGroup: function() {
			$.get(ctxPath + '/engineer/popup/pPageGroupAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '중메뉴 추가', result, 300, 110);
			});
		},
		
		/** 중메뉴 삭제 */
		delPageGroup: function() {
			var rowIdxes = HmGrid.getRowIdx($pageGrpGrid);
			if(rowIdxes === false) return;
			var rowdata = $pageGrpGrid.jqxGrid('getrowdata', rowIdxes);
			
			if(!confirm('[' + rowdata.menuName + '] 를 삭제하시겠습니까?')) return;
			
			Server.post('/engineer/popup/delPageGroup.do', {
			data: { menuNo: rowdata.menuNo,
				menuPageNo: rowdata.menuPageNo},
			success: function(result) {
				$pageGrpGrid.jqxGrid('deleterow', rowdata.uid);
                Main.searchMenu();
                alert('삭제되었습니다.');
			}
		});
		},
		/** 중메뉴 저장 */
		savePageGroup: function() {
			HmGrid.endRowEdit($pageGrpGrid);
			if(pageGrpIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			
			var _list = [];
			$.each(pageGrpIds, function(idx, value) {
				_list.push($pageGrpGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/engineer/popup/savePageGroup.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					pageGrpIds = [];
				}
			});
		},
		
		/** 소메뉴 추가 */
		addMenu: function() {
			var pageGrpDataRow = $pageGrpGrid.jqxGrid('getrowdata', 0);
			if(pageGrpDataRow == null){
		    	alert("중메뉴를 선택해주세요.");
		    	return;
		    }
		    
			$.get(ctxPath + '/engineer/popup/pMenuAdd.do', function(result) {
				HmWindow.open($('#pwindow'), '소메뉴 추가', result, 800, 600);
			});
		},
		
		/** 소메뉴 삭제 */
		delMenu: function() {
			var rowIdxes = HmGrid.getRowIdx($menuGrid);
			if(rowIdxes === false) return;
			var rowdata = $menuGrid.jqxGrid('getrowdata', rowIdxes);

			if(!confirm('[' + rowdata.menuName + '] 를 삭제하시겠습니까?')) return;

			Server.post('/engineer/popup/delMenu.do', {
			data: { menuNo: rowdata.menuNo, menuType: rowdata.menuType},
			success: function(result) {
				$menuGrid.jqxGrid('deleterow', rowdata.uid);
				alert('삭제되었습니다.');
			}
		});
		},
		/** 소메뉴 저장 */
		saveMenu: function() {
			HmGrid.endRowEdit($menuGrid);
			if(menuIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			
			var _list = [];
			$.each(menuIds, function(idx, value) {
				_list.push($menuGrid.jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/engineer/popup/saveMenu.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					menuIds = [];
				}
			});
		},
		/** Layout 페이지관리 */
		layoutMgr: function () {
            $.get(ctxPath + '/engineer/popup/pLayoutMgr.do', function(result) {
                HmWindow.open($('#pwindow'), '레이아웃 페이지 관리', result, 800, 700);
            });
        },

		/** Widget 페이지관리 */
		widgetMgr: function() {
			$.post(ctxPath + '/engineer/popup/pWidgetMgr.do', function(result) {
				HmWindow.open($('#pwindow'), '위젯 페이지 관리', result, 800, 620);
			});
		},

        /** link 메뉴 추가 */
        addLinkMenu: function() {
        	var rowdata = HmGrid.getRowData($pageGrpGrid);
        	if(rowdata == null) {
        		alert('중메뉴를 선택하세요.');
        		return;
			}

            $.get(ctxPath + '/engineer/popup/pLinkMenuAdd.do', function(result) {
                HmWindow.open($('#pwindow'), 'Link 메뉴 추가', result, 400, 200, 'pwindow_init', rowdata);
            });
		}
};

function addDevResult() {
	HmGrid.updateBoundData($pageGrid);
}
function refreshPageGroup() {
	HmGrid.updateBoundData($pageGrpGrid);
}
function refreshMenu() {
	HmGrid.updateBoundData($menuGrid);
}


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
