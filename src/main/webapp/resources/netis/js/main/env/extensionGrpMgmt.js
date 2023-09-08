var $grpTree, $grpGrid;
var curIptNo = -1;
var editIptIds = [], editCfgIds = [];

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#grpTreeGrid');
		$grpGrid = $('#grpGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) {
			Main.eventControl(event);
		});
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnAdd_grp':
			this.addGrp();
			break;
		case 'btnEdit_grp':
			this.editGrp();
			break;
		case 'btnDel_grp':
			this.delGrp();
			break;

		case 'btnSearch':
			this.searchExtension();
			break;
		case 'btnAdd':
			this.addExtension();
			break;
		case 'btnDel':
			this.delExtension();
			break;
		case 'btnSave':
			this.saveExtension();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);
		HmJqxSplitter.createTree($('#mainSplitter'));

		HmGrid.create($grpGrid, {
			source : new $.jqx.dataAdapter({ datatype : 'json', url : '', datafields:[{ name:'extFromNo', type:'number' }, { name:'extToNo', type:'number' },]
				,updaterow : function(rowid, rowdata, commit) {
				if (editIptIds.indexOf(rowid) == -1)
					editIptIds.push(rowid);
				commit(true);
			} }, { formatData : function(data) {
				var _grpNo = 0;
				var grpSelection = $grpTree.jqxTreeGrid('getSelection');
				if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
					_grpNo = grpSelection[0].grpNo;

				$.extend(data, { grpNo : _grpNo });
				return data;
			}, loadComplete : function(records) {
				editIptIds = [];
				curIptNo = -1;
			} }),
			// showtoolbar : true,
			// rendertoolbar : function(toolbar) {
			// 	HmGrid.titlerenderer(toolbar, '내선그룹');
			// },
			editable : true,
			editmode : 'selectedrow',
            pagerheight: 27,
            pagerrenderer : HmGrid.pagerrenderer,
			columns : [
					{ text : 'No', datafield : '', width : 50, sortable : false, filterable : false, editable : false, groupable : false, draggable : false, resizable : false, columntype : 'number',
						cellsrenderer : function(row, column, value) {
							return "<div style='margin:4px; text-align: center;'>" + (value + 1) + "</div>";
						}

					}, { text : '시작 번호', datafield : 'extFromNo', cellvaluechanging : function(row, datafield, columntype, oldvalue, newvalue) {
						return newvalue.replace(/\D/g, '').length == 0 ? '000000' : newvalue.replace(/\D/g, '');
					}, validation : function(cell, value) {
						if (value.length > 6) {
							return { message : "6자리를 넘길 수 없습니다.", result : false };
						}

						if (value > $grpGrid.jqxGrid('getRowData', cell.row).extToNo) {
							return { message : "시작번호는 끝번호보다 클 수 없습니다.", result : false };
						}
						return true;
					} }, { text : '끝 번호', datafield : 'extToNo', cellvaluechanging : function(row, datafield, columntype, oldvalue, newvalue) {
						return newvalue.replace(/\D/g, '').length == 0 ? '000000' : newvalue.replace(/\D/g, '');
					} }
			] }, CtxMenu.COMM);

		HmTreeGrid.create($grpTree, HmTree.T_GRP_EXTENSION, Main.searchExtension, null);
	},

	/** init data */
	initData : function() {

	},

	/** 내선 그룹 */
	addGrp : function() {
		$.get(ctxPath + '/main/popup/env/pExtensionGrpAdd.do', function(result) {
			HmWindow.open($('#pwindow'), '내선그룹 등록', result, 400, 509);
		});
	},

	editGrp : function() {
		var grpSelection = $grpTree.jqxTreeGrid('getSelection');
		if (grpSelection.length == 0) {
			alert('그룹을 선택해주세요.');
			return;
		}
		var treeItem = grpSelection[0];
		if (treeItem.level == 0) {
			alert('최상위 그룹을 수정할 수 없습니다.');
			return;
		}
		$.post(ctxPath + '/main/popup/env/pExtensionGrpEdit.do', { grpNo : treeItem.grpNo, grpName : treeItem.grpName, grpParent : treeItem.grpParent, grpRef : treeItem.grpRef }, function(result) {
			HmWindow.open($('#pwindow'), '내선그룹 수정', result, 400, 520);
		});
	},

	delGrp : function() {
		var grpSelection = $grpTree.jqxTreeGrid('getSelection');
		if (grpSelection.length == 0) {
			alert('그룹을 선택해주세요.');
			return;
		}
		var treeItem = grpSelection[0];
		if (treeItem.level == 0) {
			alert('최상위 그룹을 삭제할 수 없습니다.');
			return;
		}
		var treeItem = grpSelection[0];
		if (!confirm('[' + treeItem.grpName + '] 그룹을 삭제하시겠습니까?'))
			return;
		Server.post('/grp/delExtensionGrp.do', { data : { grpNo : treeItem.grpNo }, success : function(result) {
			$grpTree.jqxTreeGrid('deleteRow', treeItem.uid);
			// $grpTree.jqxTreeGrid('selectRow', $grpTree.jqxTreeGrid('getSelection')[0].uid);
			alert('삭제되었습니다.');
		} });
	},

	/** IPT */
	searchExtension : function() {
		HmGrid.updateBoundData($grpGrid, ctxPath + '/main/env/extensionGrpMgmt/getExtension.do');
	},

	addExtension : function() {
		var _grpNo = 0;
		var grpSelection = $grpTree.jqxTreeGrid('getSelection');
		if (!$.isEmpty(grpSelection) && grpSelection.length > 0)
			_grpNo = grpSelection[0].grpNo;

		if (_grpNo == 0) {
			alert('그룹을 선택해 주세요.');
			return;
		}
		$.get(ctxPath + '/main/popup/env/pExtensionAdd.do', { grpNo : _grpNo }, function(result) {
			$('#pwindow').jqxWindow({ width : 300, height : 170, title : '<h1>내선 등록</h1>', content : result, position : 'center', resizable : false });
			$('#pwindow').jqxWindow('open');
		});
	},

	delExtension : function() {
		var rowIdx = HmGrid.getRowIdx($grpGrid);
		if (rowIdx === false) {
			alert('선택된 내선번호가 없습니다.');
			return;
		}
		var rowdata = $grpGrid.jqxGrid('getrowdata', rowIdx);
		if (!confirm('[' + rowdata.extFromNo + ' ~ ' + rowdata.extToNo + '] 번호 범위를 삭제하시겠습니까?'))
			return;
		$('body').addClass('wait');
		Server.post('/main/env/extensionGrpMgmt/delExtension.do', { data : rowdata, success : function(result) {
			$grpGrid.jqxGrid('deleterow', $grpGrid.jqxGrid('getrowid', rowIdx));
			alert('삭제되었습니다.');
		} });
	},

	saveExtension : function() {
		HmGrid.endRowEdit($grpGrid);
		if (editIptIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(editIptIds, function(idx, value) {
			var tmp = $grpGrid.jqxGrid('getrowdatabyid', value);
			_list.push(tmp);
		});


		Server.post('/main/env/extensionGrpMgmt/editExtension.do', { data : { list : _list }, success : function(result) {
			alert(result);
			editIptIds = [];
		} });
	} };

function grpResult() {
	HmTreeGrid.updateData($grpTree, HmTree.T_GRP_EXTENSION);
}

function iptResult() {
	Main.searchExtension();
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});