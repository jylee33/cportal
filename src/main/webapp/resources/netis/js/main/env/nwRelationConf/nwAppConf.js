var NwAppConf = {
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
		// this.$grpGrid = $('#nwApp_grpGrid'),
		this.$dataGrid = $('#nwApp_dataGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { NwAppConf.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnAdd_nwAppGrp': this.addGrp(); break;
			case 'btnEdit_nwAppGrp': this.editGrp(); break;
			case 'btnDel_nwAppGrp': this.delGrp(); break;
			case 'btnSearch_nwApp': this.searchData(); break;
			case 'btnAdd_nwApp': this.addData(); break;
			case 'btnSave_nwApp': this.saveData(); break;
			case 'btnDel_nwApp': this.delData(); break;
		}
	},

	/** init design */
	initDesign : function() {
		// $('#nwApp_mainSplitter').jqxSplitter({ width: '100%', height: '100%', orientation: 'vertical', theme: jqxTheme,
		// 	panels: [ { size: 250, min: 150 }, { size: '100%' } ], showSplitBar: false });

		/*	APP 그룹 그리드	*/
		// HmGrid.create(this.$grpGrid, {
		// 	source: new $.jqx.dataAdapter(
		// 			{
		// 				datatype: 'json',
		// 				url: ctxPath + '/grp/getAppGrpTreeList.do'
		// 			},
		// 			{
		// 				formatData: function(data) {
		// 					$.extend(data, {
		// 						isContainTop: 'false'
		// 					});
		// 					return data;
		// 				}
		// 			}
		// 	),
         //    showtoolbar: true,
         //    rendertoolbar: function(toolbar) {
         //        HmGrid.titlerenderer(toolbar, '그룹');
         //    },
		// 	columns:
		// 	[
		// 		{ text: '그룹번호', dataField: 'grpNo' , hidden: true },
		// 		{ text: '그룹명', dataField: 'grpName' },
		// 		{ text: '유해여부', dataField: 'isLeaf',  columntype: 'checkbox',width: '80' },
		// 		{ text: 'IP', datafield: 'devIp', hidden: true }
		// 	]
		// }, CtxMenu.COMM, 'appGrp');

		// this.$grpGrid
		// 	.on('rowselect', function (event) {
		// 		setTimeout(NwAppConf.searchData, 100);
		// 	 })
		// 	.on('bindingcomplete', function(event) {
         //        var rows = $(this).jqxGrid('getrows');
         //        if(rows != null && rows.length > 0) {
         //        	$(this).jqxGrid('selectrow', rows[0].uid);
		// 		}
		// 	});

		/*	APP 설정 그리드	*/
		HmGrid.create(this.$dataGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(NwAppConf.editRowIds.indexOf(rowid) == -1)
                                NwAppConf.editRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
                            // var row = HmGrid.getRowData(NwAppConf.$grpGrid);
                            // if(row != null) {
                            	// data.grpNo = row.grpNo;
							// }
							data.grpNo = -1;
							return data;
						},
						loadComplete: function(records) {
                            NwAppConf.editRowIds.length = 0;
						}
					}
			),
			width: '100%',
			height: '100%',
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'Application 목록');
            },
			selectionmode: 'multiplerowsextended',
			editable: true,
			editmode: 'selectedrow',
			columns:
			[
				// { text: '그룹번호', datafield: 'grpNo', hidden: true },
				{ text: '서비스번호',	datafield: 'serviceNo',	hidden: true },
				{ text: 'Application',	datafield: 'name',	width: '35%'},
				{ text: '프로토콜', datafield: 'protocol', displayfield: 'disProtocol', width: '25%', columntype: 'dropdownlist',
					createeditor: function(row, value, editor) {
						var s = HmResource.getResource('protocol_list');
						editor.jqxDropDownList({ source: s, autoDropDownHeight: true });
					}
				},
				{ text: '포트번호', datafield: 'port', cellsalign: 'right', width: '25%', columntype: 'numberinput',
					initeditor: function(row, cellvalue, editor) {
						editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
					},
					validation: HmGrid.portValidation
				},
				{ text: '프로파일', datafield: 'bProfile', columntype: 'checkbox', width: '15%' }
			]
		}, CtxMenu.COMM, 'appData');
	},

	/** init data */
	initData: function() {
		this.searchData();
	},

	/** App 그룹 */
	addGrp: function() {
		$.get(ctxPath + '/main/popup/env/pAppGrpAdd.do', function(result) {
			HmWindow.open($('#pwindow'), 'APP그룹 등록', result, 350, 150);
		});
	},

	editGrp: function() {
		var row = HmGrid.getRowData(this.$grpGrid);
		if(row == null) {
			alert('그룹을 선택해주세요.');
			return;
		}

		$.post(ctxPath + '/main/popup/env/pAppGrpEdit.do',
				row,
				function(result) {
					HmWindow.open($('#pwindow'), 'APP그룹 수정', result, 350, 150);
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

		Server.post('/grp/delAppGrp.do', {
			data: { grpNo: row.grpNo },
			success: function(result) {
				try {
					$grpGrid.jqxGrid('deleterow', row.uid);
					var rows = $grpGrid.jqxGrid('getrows');
					if(rows != null && rows.length > 0)
						$grpGrid.jqxGrid('selectRow', rows[0].uid);

                    alert('삭제되었습니다.');
				} catch(e) {}
			}
		});
	},

	/** APP 설정 */
	searchData: function() {
		HmGrid.updateBoundData(NwAppConf.$dataGrid, ctxPath + '/main/env/nwRelationConf/getAppList.do');
	},

	addData: function() {
        $.post(ctxPath + '/main/popup/env/pNwAppAdd.do',
				function(result) {
					HmWindow.open($('#pwindow'), 'Application 등록', result, 500, 250);
				}
		);
	},

	delData: function() {
		var rowIdxes = HmGrid.getRowIdxes(this.$dataGrid, 'APP를 선택해주세요.');
		if(rowIdxes === false) return;
		if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
		var _serviceNos = [], _uids = [];
		$.each(rowIdxes, function(idx, value) {
			var tmp = NwAppConf.$dataGrid.jqxGrid('getrowdata', value);
			_serviceNos.push(tmp.serviceNo);
			_uids.push(tmp.uid)
		});

		Server.post('/main/env/nwRelationConf/delApp.do', {
			data: { serviceNos: _serviceNos },
			success: function(result) {
				NwAppConf.$dataGrid.jqxGrid('deleterow', _uids);
				alert('삭제되었습니다.');
			}
		});
	},

	saveData: function() {
		HmGrid.endRowEdit(this.$dataGrid);
		if(NwAppConf.editRowIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(NwAppConf.editRowIds, function(idx, value) {
            var tmp = NwAppConf.$dataGrid.jqxGrid('getrowdatabyid', value);
			tmp.profile = tmp.bProfile? 'Y' : 'N';
			_list.push(tmp);
		});

		Server.post('/main/env/nwRelationConf/saveApp.do', {
			data: { list: _list },
			success: function(result) {
				alert('저장되었습니다.');
                NwAppConf.editRowIds.length = 0;
			}
		});
	}
};