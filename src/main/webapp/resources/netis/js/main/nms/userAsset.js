var $generalGrid, $infraGrid, $histGrid;
var editIds = [], infraEditIds = [];

var Main = {
	/** variable */
	initVariable : function() {
		$generalGrid = $('#generalGrid'), $infraGrid = $('#infraGrid'), $histGrid = $('#histGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch_gen': case 'btnSearch_infra': case 'btnSearch_hist': this.search(); break;
		case 'btnAdd_gen': case 'btnAdd_infra': this.addAsset(); break;
		case 'btnDel_gen': case 'btnDel_infra': this.delAsset(); break;
		case 'btnDelAll_gen': case 'btnDelAll_infra': this.delAllAsset(); break;
		case 'btnSave_gen': case 'btnSave_infra': this.saveAsset(); break;
		case 'btnExcelUpload_gen': case 'btnExcelUpload_infra': this.uploadExcel(); break;
		case 'btnExcel_gen': case 'btnExcel_infra': this.exportExcel(); break;
		case 'btnColConf_gen': case 'btnColConf_infra': this.colConf(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmWindow.create($('#pwindow'), 100, 100);
		
		$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case 0:
					HmGrid.create($generalGrid, {
							source : new $.jqx.dataAdapter(
								{
									datatype : 'json',
									url: ctxPath + '/main/nms/userAsset/getUserAssetList.do',
									updaterow : function(rowid, rowdata, commit) {
										if (editIds.indexOf(rowid) == -1)
											editIds.push(rowid);
										commit(true);
									},
									datafields:
									[
									 	{ name: 'ciOid', type: 'number' },
									 	{ name: 'ciMgtKey', type: 'string' },
									 	{ name: 'vendor', type: 'string' },
									 	{ name: 'content', type: 'string' },
									 	{ name: 'job', type: 'string' },
									 	{ name: 'person', type: 'string' },
									 	{ name: 'mail', type: 'string' },
									 	{ name: 'office', type: 'string' },
									 	{ name: 'cellphone', type: 'string' },
									 	{ name: 'fax', type: 'string' },
									 	{ name: 'memo', type: 'string' }
									]
								},
								{
									formatData : function(data) {
										$.extend(data, Main.getCommParams());
										return data;
									},
									loadComplete : function(records) {
										editIds = [];
									} 
								}
							),
							selectionmode : 'multiplerowsextended',
							editable : true,
							editmode: 'selectedcell',
							columnsresize: true,
							columns :
							[
								{ text: '구성항목 OID', datafield: 'ciOid', width: 100, pinned: true, editable: false },
								{ text: '관리키', datafield: 'ciMgtKey', width: 100, pinned: true, editable: false },
								{ text: '업체명', datafield: 'vendor', width: 150, pinned: true },
								{ text: '내용', datafield: 'content', minwidth: 300 },
								{ text: '직무', datafield: 'job', width: 200 },
								{ text: '담당자', datafield: 'person', width: 120 },
								{ text: '이메일', datafield: 'mail', width: 180 },
								{ text: '사무실', datafield: 'office', width: 100 },
								{ text: '휴대폰', datafield: 'cellphone', width: 100 },
								{ text: 'FAX', datafield: 'fax', width: 100 },
								{ text: '비고', datafield: 'memo', width: 150 }
							]
					}, CtxMenu.USER_ASSET, '1');

					break;
				case 1:
					HmGrid.create($infraGrid, {
							source : new $.jqx.dataAdapter(
								{
									datatype : 'json',
									url: ctxPath + '/main/nms/userAsset/getInfraAssetList.do',
									updaterow : function(rowid, rowdata, commit) {
										if (editIds.indexOf(rowid) == -1)
											infraEditIds.push(rowid);
										commit(true);
									},
									datafields:
									[
									 	{ name: 'ciOid', type: 'number' },
									 	{ name: 'ciMgtKey', type: 'string' },
									 	{ name: 'vendor', type: 'string' },
									 	{ name: 'use', type: 'string' },
									 	{ name: 'division', type: 'string' },
									 	{ name: 'person', type: 'string' },
									 	{ name: 'mail', type: 'string' },
									 	{ name: 'office', type: 'string' },
									 	{ name: 'cellphone', type: 'string' },
									 	{ name: 'fax', type: 'string' },
									 	{ name: 'memo', type: 'string' }
									]
								},
								{
									formatData : function(data) {
										$.extend(data, Main.getCommParams());
										return data;
									},
									loadComplete : function(records) {
										infraEditIds = [];
									} 
								}
							),
							selectionmode : 'multiplerowsextended',
							editable : true,
							editmode: 'selectedcell',
							columnsresize: true,
							columns :
							[
								{ text: '구성항목 OID', datafield: 'ciOid', width: 100, pinned: true, editable: false },
								{ text: '관리키', datafield: 'ciMgtKey', width: 100, pinned: true, editable: false },
								{ text: '업체명', datafield: 'vendor', width: 150, pinned: true },
								{ text: '내용', datafield: 'use', minwidth: 300 },
								{ text: '부서', datafield: 'division', width: 200 },
								{ text: '담당자', datafield: 'person', width: 120 },
								{ text: '이메일', datafield: 'mail', width: 180 },
								{ text: '사무실', datafield: 'office', width: 100 },
								{ text: '휴대폰', datafield: 'cellphone', width: 100 },
								{ text: 'FAX', datafield: 'fax', width: 100 },
								{ text: '비고', datafield: 'memo', width: 150 }
							]
					}, CtxMenu.INFRA_ASSET, '1');

					break;
				case 2: 
					Master.createPeriodCondition($('#cbPeriod'), $('#date1'), $('#date2'));
					
					HmGrid.create($histGrid, {
						source: new $.jqx.dataAdapter(
								{ 
									datatype : 'json',
									url: ctxPath + '/main/nms/userAsset/getUserAssetChgHist.do'
								},
								{
									formatData: function(data) {
										$.extend(data, {
											date1: HmDate.getDateStr($('#date1')),
											time1: HmDate.getTimeStr($('#date1')),
											date2: HmDate.getDateStr($('#date2')),
											time2: HmDate.getTimeStr($('#date2'))
										})
										return data;
									}
								}
						),
						columns: 
						[
							 { text : '일시', datafield: 'chModifyDate', width: 160 },
							 { text : '구성관리 OID', datafield: 'chCiOid', width: 120 },
							 { text : '구성관리 KEY', datafield: 'chCiMgtKey', width: 120 },
							 { text	: '자산정보', datafield: 'chCiAssetnumber', width: 120 },
							 { text : '구성관리 필드ID', datafield: 'chFieldId', width: 120 },
							 { text : '구성관리 필드명', datafield: 'chFieldName', width: 120 },
							 { text : '구성관리 변경전', datafield: 'chModifyBefore', minwidth: 200 },
							 { text : '구성관리 변경후', datafield: 'chModifyAfter', minwidth: 200 },
							 { text : '변경자', datafield: 'chModifyUser', width: 120 }
						 ]
					}, CtxMenu.COMM, '2');
					break;
				}
			}
		});
		
	},
	
	/** init data */
	initData : function() {
	//	Main.searchAsset();
	},

	getCommParams: function() {
			
	},
	
	/** 조회 */
	search: function() {
		switch($('#mainTab').val()) {
		case 0: 
			HmGrid.updateBoundData($generalGrid);	
			break;
		case 1: 
			HmGrid.updateBoundData($infraGrid);	
			break;
		case 2:
			HmGrid.updateBoundData($histGrid);
			break;
		}
	},
	
	addAsset : function() {
		switch($('#mainTab').val()) {
		case 0: 
			$.get(ctxPath + '/main/popup/nms/pUserAssetAdd.do',
					function(result) {
						HmWindow.open($('#pwindow'), '연락처 자산 추가', result, 700, 300);
					}
				);
			break;
		case 1: 
			$.get(ctxPath + '/main/popup/nms/pInfraAssetAdd.do',
					function(result) {
						HmWindow.open($('#pwindow'), '연락처 자산 추가', result, 700, 300);
					}
				);
			break;
		}
	},

	/** 자산정보 삭제 */
	delAsset : function() {
			switch($('#mainTab').val()) {
			case 0: 
					var rowIdxes = HmGrid.getRowIdxes($generalGrid);
					if(rowIdxes === false) {
						alert('선택된 자산 정보가 없습니다.');
						return;
					}
					if(!confirm('[' + rowIdxes.length + ']건의 자산 정보를 삭제하시겠습니까?')) return;
					var _list = [], _uids = [];
					$.each(rowIdxes, function(idx, value) {
						var tmp = $generalGrid.jqxGrid('getrowdata', value);
						_list.push(tmp);
						_uids.push(tmp.uid);
					});
					Server.post('/main/nms/userAsset/delUserAsset.do', {
						data: { list: _list },
						success: function(result) {
							$generalGrid.jqxGrid('deleterow', _uids);
							alert('삭제되었습니다.');
						}
					});
					break;
			case 1: 
					var rowIdxes = HmGrid.getRowIdxes($infraGrid);
					if(rowIdxes === false) {
						alert('선택된 자산 정보가 없습니다.');
						return;
					}
					if(!confirm('[' + rowIdxes.length + ']건의 자산 정보를 삭제하시겠습니까?')) return;
					var _list = [], _uids = [];
					$.each(rowIdxes, function(idx, value) {
						var tmp = $infraGrid.jqxGrid('getrowdata', value);
						_list.push(tmp);
						_uids.push(tmp.uid);
					});
					Server.post('/main/nms/userAsset/delInfraAsset.do', {
						data: { list: _list },
						success: function(result) {
							$infraGrid.jqxGrid('deleterow', _uids);
							alert('삭제되었습니다.');
						}
					});
					break;
			}
	},
	delAllAsset : function() {
		if(!confirm('전체 자산 정보를 삭제하시겠습니까?')) return;
		switch($('#mainTab').val()) {
		case 0: 
			Server.get('/main/nms/userAsset/delAllUserAsset.do', {
				success: function(result) {
					Main.search();
					alert('삭제되었습니다.');
				}
			});
			break;
		case 0: 
			Server.get('/main/nms/userAsset/delAllInfraAsset.do', {
				success: function(result) {
					Main.search();
					alert('삭제되었습니다.');
				}
			});
			break;
		}
	},

	/** 자산정보 저장 */
	saveAsset : function() {
		switch($('#mainTab').val()) {
		case 0: 
			if (editIds.length == 0) {
				alert('변경된 내용이 존재하지 않습니다.');
				return;
			}
			var _list = [];
			$.each(editIds, function(idx, value) {
				var tmp = $generalGrid.jqxGrid('getrowdatabyid', value);
				if (tmp !== undefined)
					_list.push(tmp);
			});
			Server.post('/main/nms/userAsset/saveUserAsset.do', {
				data: { list: _list },
				success: function(result) {
					editIds = [];
					Main.search();
					alert('저장되었습니다.');
				}
			});
			break;
		case 1: 
			if (infraEditIds.length == 0) {
				alert('변경된 내용이 존재하지 않습니다.');
				return;
			}
			var _list = [];
			$.each(infraEditIds, function(idx, value) {
				var tmp = $infraGrid.jqxGrid('getrowdatabyid', value);
				if (tmp !== undefined)
					_list.push(tmp);
			});
			Server.post('/main/nms/userAsset/saveInfraAsset.do', {
				data: { list: _list },
				success: function(result) {
					infraEditIds = [];
					Main.search();
					alert('저장되었습니다.');
				}
			});
			break;
		}
	},
	
	uploadExcel: function() {
		switch($('#mainTab').val()) {
		case 0: 
			$.get(ctxPath + '/main/popup/nms/pUserAssetFileUpload.do',
					function(result) {
						HmWindow.open($('#pwindow'), '파일 업로드', result, 350, 200);
					}
			);
			break;
		case 1: 
			$.get(ctxPath + '/main/popup/nms/pInfraAssetFileUpload.do',
					function(result) {
						HmWindow.open($('#pwindow'), '파일 업로드', result, 350, 200);
					}
			);
			break;
		}
	},
	
	exportExcel: function() {
		var params = Master.getGrpTabParams();
		$.extend(params, {	selectTab : $('#mainTab').val() });
		HmUtil.exportExcel(ctxPath + '/main/nms/userAsset/export.do', params);
	},

	colConf : function() {
		HmWindow.create($('#pwindow'), 300, 400);
		$.post(ctxPath + '/main/popup/comm/pGridColsMgr.do', 
				function(result) {
					switch($('#mainTab').val()) {
					case 0: 
						HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $generalGrid);
						break;
					case 1: 
						HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $infraGrid);
						break;
					}
				}
		);
	},

};

function refresh() {
	Main.search();
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});