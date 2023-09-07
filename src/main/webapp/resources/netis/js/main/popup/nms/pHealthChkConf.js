var $p_grpGrid, $p_svcGrid;
// var editIds = [];

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
	/** variable */
	initVariable: function() {;
		$p_grpGrid = $('#p_grpGrid'), $p_svcGrid = $('#p_svcGrid');
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'btnAdd_grp': this.addGrp(); break;
			case 'btnEdit_grp': this.editGrp(); break;
			case 'btnDel_grp': this.delGrp(); break;
			case 'btnAdd_sp': this.addSvcPort(); break;
			case 'btnDel_sp': this.delSvcPort(); break;
			case 'btnEdit_sp': this.editSvcPort(); break;
			case 'btnSearch_sp': this.searchSvcPort(); break;
			case 'btnClose':
				opener.Main.grpTreeUpdate();
                opener.Main.search();
				self.close();
				break;
		}
	},

	/** init design */
	initDesign: function() {
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 260, min: 150, collapsible: false }, { size: '100%' }], '100%', '100%');

		HmGrid.create($p_grpGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					url: ctxPath + '/grp/getSvcPortGrpList.do'
				}
			),
			pageable: false,
			ready: function() {
				$p_grpGrid.jqxGrid('selectrow', 0);
				PMain.searchSvcPort();
			},
			columns:
				[
					{ text : '그룹명', datafield : 'grpName' }
				]
		});
		$p_grpGrid.on('rowdoubleclick', function(event) {
			PMain.searchSvcPort();
		});

		HmGrid.create($p_svcGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
				},
				{
					formatData: function(data) {
						var _grpNo = -1;
						var rowIdx = HmGrid.getRowIdx($p_grpGrid);
						if(rowIdx !== false && $p_grpGrid.jqxGrid('getrows').length != 0) {
							_grpNo = $p_grpGrid.jqxGrid('getrowdata', rowIdx).grpNo
						}
						$.extend(data, {
							grpNo: _grpNo
						});
						return data;
					},
				}
			),
			editable: false,
			editmode: 'selectedrow',
			pageable: false,
			columns:
				[
					{ text : '그룹번호', datafield : 'grpNo', width : '120', hidden: true},
					{ text : '그룹명', datafield : 'grpName', width : '120'},
					{ text : '서비스명', datafield : 'svcName', minwidth: 150 },
					{ text : '장비번호', datafield : 'mngNo', width : '120', hidden: true},
					{ text : 'IP', datafield : 'ip', width : '120'},
					{ text : 'PORT', datafield : 'port', width : '80', cellsalign: 'right'},
					{ text : '사용여부', datafield : 'useFlag', width : '80', columntype: 'checkbox' }
				]
		});
	},

	/** init data */
	initData: function() {

	},

	/** 그룹 */
	searchGrp: function() {
		HmGrid.updateBoundData($p_grpGrid);
	},

	addGrp: function() {
		$.post(ctxPath + '/main/popup/nms/pSvcPortGrpAdd.do',
			null,
			function(result) {
				HmWindow.open($('#pwindow'), '서비스포트 그룹 등록', result, 350, 109);
			}
		);
	},

	editGrp: function() {
		var rowIdx = HmGrid.getRowIdx($p_grpGrid);
		if(rowIdx === false) {
			alert('그룹을 선택하세요.');
			return;
		}
		var rowdata = $p_grpGrid.jqxGrid('getrowdata', rowIdx);
		$.post(ctxPath + '/main/popup/nms/pSvcPortGrpEdit.do',
			rowdata,
			function(result) {
				HmWindow.open($('#pwindow'), '서비스포트 그룹 수정', result, 350, 109);
			}
		);
	},

	delGrp: function() {
		var rowIdx = HmGrid.getRowIdx($p_grpGrid);
		if(rowIdx === false) return;
		var rowdata = $p_grpGrid.jqxGrid('getrowdata', rowIdx);
		if(!confirm('[' + rowdata.grpName + '] 그룹을 삭제하시겠습니까?')) return;

		Server.post('/grp/delSvcPortGrp.do', {
			data: rowdata,
			success: function(result) {
				$p_grpGrid.jqxGrid('deleterow', $p_grpGrid.jqxGrid('getrowid', rowIdx));
				alert(result);
			}
		});
	},

	/** 서비스포트 */
	searchSvcPort: function() {
        HmGrid.updateBoundData($p_svcGrid, ctxPath + '/main/nms/healthChk/getSvcPortList.do');
	},

	addSvcPort: function() {
		var rowIdx = HmGrid.getRowIdx($p_grpGrid);
		if(rowIdx === false) return;
        var rowData = $p_grpGrid.jqxGrid('getrowdata', rowIdx);
        if(!rowData) { alert('그룹을 선택해주세요'); return; }

		$.post(ctxPath + '/main/popup/nms/pSvcPortAdd.do',
            rowData,
			function(result) {
				HmWindow.open_new($('#pwindow'), '서비스포트 등록', result, {w: 350, h:239, position: {x: 500, y: 300}});
			}
		);
	},

	delSvcPort: function() {
		var rowIdx = HmGrid.getRowIdx($p_svcGrid);
		if(rowIdx === false) return;
		var rowdata = $p_svcGrid.jqxGrid('getrowdata', rowIdx);
		if(!confirm('[' + rowdata.svcName + '] 서비스를 삭제하시겠습니까?')) return;

		Server.post('/main/nms/healthChk/delSvcPort.do', {
			data: rowdata,
			success: function(result) {
				$p_svcGrid.jqxGrid('deleterow', $p_svcGrid.jqxGrid('getrowid', rowIdx));
				alert(result);
			}
		});
	},

	editSvcPort: function() {
		var rowIdx = HmGrid.getRowIdx($p_svcGrid, '서비스를 선택해주세요.');
		if(rowIdx === false) return;
		var rowdata = $p_svcGrid.jqxGrid('getrowdata', rowIdx);

		$.post(ctxPath + '/main/popup/nms/pSvcPortEdit.do',
			rowdata,
			function(result) {
				HmWindow.open_new($('#pwindow'), '서비스포트 수정', result, {w: 350, h:239, position: {x: 500, y: 300}}, "pwindow_init", rowdata);
			}
		);
	}

	// saveSvcPort: function() {
	// 	HmGrid.endRowEdit($p_svcGrid);
	// 	if(editIds.length == 0) {
	// 		alert('변경된 데이터가 없습니다.');
	// 		return;
	// 	}
	// 	var _list = [];
	// 	$.each(editIds, function(idx, value) {
	// 		_list.push($p_svcGrid.jqxGrid('getrowdatabyid', value));
	// 	});
	//
	// 	Server.post('/main/nms/healthChk/saveSvcPort.do', {
	// 		data: { list: _list },
	// 		success: function(result) {
	// 			editIds = [];
	// 			alert(result);
	// 		}
	// 	});
	// }

};
