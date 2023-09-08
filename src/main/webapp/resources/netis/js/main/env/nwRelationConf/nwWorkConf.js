var NwWorkConf = {
    $grpGrid: null,
	$dataGrid: null,
	editRowIds: [],

	/** variable */
	initialize : function() {
		this.initVariable();
		this.observe();
		this.initDesign();
		this.initData();
	},

	initVariable: function() {
		this.$grpGrid = $('#nwWork_grpGrid'), this.$dataGrid = $('#nwWork_dataGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { NwWorkConf.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnAdd_nwWorkGrp': this.addGrp(); break;
			case 'btnEdit_nwWorkGrp': this.editGrp(); break;
			case 'btnDel_nwWorkGrp': this.delGrp(); break;
			case 'btnSearch_nwWork': this.searchData(); break;
			case 'btnAdd_nwWork': this.addData(); break;
			case 'btnSave_nwWork': this.saveData(); break;
			case 'btnDel_nwWork': this.delData(); break;
		}
	},

	/** init design */
	initDesign : function() {
		$('#nwWork_mainSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', theme: jqxTheme,
			panels: [ { size: 250, min: 150 }, { size: '100%' } ], showSplitBar: false });

		/*	업무그룹 */
		HmGrid.create(this.$grpGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						url: ctxPath + '/grp/getServiceGrpTreeList.do'
					},
					{
						formatData: function(data) {
							$.extend(data, {
								isContainTop: 'false'
							});
							return data;
						}
					}
			),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '그룹');
            },
			columns:
			[
				{ text: '그룹번호', dataField: 'grpNo' , hidden: true },
				{ text: '그룹명', dataField: 'grpName' }
			]
		}, CtxMenu.COMM, 'workGrp');

		this.$grpGrid
			.on('rowselect', function (event) {
                setTimeout(NwWorkConf.searchData, 100);
			 })
			.on('bindingcomplete', function(event) {
                var rows = $(this).jqxGrid('getrows');
                if(rows != null && rows.length > 0) {
                	$(this).jqxGrid('selectrow', rows[0].uid);
				}
			});

		/*	업무상세	*/
		HmGrid.create(this.$dataGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(NwWorkConf.editRowIds.indexOf(rowid) == -1)
                                NwWorkConf.editRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
                            var row = HmGrid.getRowData(NwWorkConf.$grpGrid);
                            if(row != null) {
                            	data.grpNo = row.grpNo;
							}
							return data;
						},
						loadComplete: function(records) {
                            NwWorkConf.editRowIds.length = 0;
						}
					}
			),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, '업무 목록');
            },
			selectionmode: 'multiplerowsextended',
			editable: true,
			editmode: 'selectedrow',
			columns:
			[
				{ text: '시작IP', datafield: 'fromIp', width: '20%',
                    validation: HmGrid.requireIpValidation
				},
				{ text: '끝IP', datafield: 'toIp', width: '20%',
                    validation: HmGrid.requireIpValidation
				},
				{ text: '프로토콜', datafield: 'protocol', displayfield: 'disProtocol', width: '20%', columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = HmResource.getResource('protocol_list');
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true });
					}

				},
				{ text: '시작PORT', datafield: 'fromPort', cellsalign: 'right', width: '20%', columntype: 'numberinput',
					initeditor: function(row, cellvalue, editor) {
						editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
					},
					validation: HmGrid.portValidation
				},
				{ text: '끝PORT', datafield: 'toPort', cellsalign: 'right', width: '20%', columntype: 'numberinput',
					initeditor: function(row, cellvalue, editor) {
						editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
					},
					validation: HmGrid.portValidation
				}
			]
		}, CtxMenu.COMM, 'workData');
	},

	/** init data */
	initData: function() {

	},

	/** App 그룹 */
	addGrp: function() {
		$.get(ctxPath + '/main/popup/env/pSvcGrpAdd.do', function(result) {
			HmWindow.open($('#pwindow'), '업무그룹 등록', result, 350, 109);
		});
	},

	editGrp: function() {
		var row = HmGrid.getRowData(this.$grpGrid);
		if(row == null) {
			alert('그룹을 선택해주세요.');
			return;
		}

		$.post(ctxPath + '/main/popup/env/pSvcGrpEdit.do',
				row,
				function(result) {
					HmWindow.open($('#pwindow'), '업무그룹 수정', result, 350, 109);
				}
		);
	},

	delGrp: function() {
        var row = HmGrid.getRowData(this.$grpGrid);
        if(row == null) {
            alert('그룹을 선택해주세요.');
            return;
        }
		if(!confirm('[' + row.grpName + '] 그룹을 삭제하시겠습니까?')) return;

		Server.post('/grp/delServiceGrp.do', {
			data: { grpNo: row.grpNo },
			success: function(result) {
				try {
					NwWorkConf.$grpGrid.jqxGrid('deleterow', row.uid);
					var rows = NwWorkConf.$grpGrid.jqxGrid('getrows');
					if(rows != null && rows.length > 0)
                        NwWorkConf.$grpGrid.jqxGrid('selectRow', rows[0].uid);

				} catch(e) {

				}
			}
		});
	},

	/** 업무 */
	searchData: function() {
		HmGrid.updateBoundData(NwWorkConf.$dataGrid, ctxPath + '/main/env/nwRelationConf/getWorkList.do');
	},

	addData: function() {
        var row = HmGrid.getRowData(this.$grpGrid);
        if(row == null) {
            alert('그룹을 선택해주세요.');
            return;
        }
		$.post(ctxPath + '/main/popup/env/pNwWorkAdd.do',
				row,
				function(result) {
					HmWindow.open($('#pwindow'), '업무 등록', result, 450, 200);
				}
		);
	},

	delData: function() {
		var rowIdxes = HmGrid.getRowIdxes(this.$dataGrid, '업무를 선택해주세요.');
		if(rowIdxes === false) return;
		if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
		var _serviceNos = [], _uids = [];
		$.each(rowIdxes, function(idx, value) {
			var tmp = NwWorkConf.$dataGrid.jqxGrid('getrowdata', value);
			_serviceNos.push(tmp.serviceNo);
			_uids.push(tmp.uid)
		});

		Server.post('/main/env/nwRelationConf/delWork.do', {
			data: { serviceNos: _serviceNos },
			success: function(result) {
				NwWorkConf.$dataGrid.jqxGrid('deleterow', _uids);
				alert('삭제되었습니다.');
			}
		});
	},

	saveData: function() {
		HmGrid.endRowEdit(this.$dataGrid);
		if(NwWorkConf.editRowIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(NwWorkConf.editRowIds, function(idx, value) {
			_list.push(NwWorkConf.$dataGrid.jqxGrid('getrowdatabyid', value));
		});

		Server.post('/main/env/nwRelationConf/saveWork.do', {
			data: { list: _list },
			success: function(result) {
				alert('저장되었습니다.');
                NwWorkConf.editRowIds.length = 0;
			}
		});
	}
};

function addGrpResult(type) {
    NwWorkConf.$grpGrid.jqxGrid('updateBoundData');
}