var NwAsConf = {
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
		this.$dataGrid = $('#nwAs_dataGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { NwAsConf.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
			case 'btnSearch_nwAs': this.searchData(); break;
			case 'btnAdd_nwAs': this.addData(); break;
			case 'btnSave_nwAs': this.saveData(); break;
			case 'btnDel_nwAs': this.delData(); break;
		}
	},

	/** init design */
	initDesign : function() {
		/*	AS 설정 그리드	*/
		HmGrid.create(this.$dataGrid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(NwAsConf.editRowIds.indexOf(rowid) == -1)
                                NwAsConf.editRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
                            return data;
						},
						loadComplete: function(records) {
                            NwAsConf.editRowIds.length = 0;
						}
					}
			),
            showtoolbar: true,
            rendertoolbar: function(toolbar) {
                HmGrid.titlerenderer(toolbar, 'AS 목록');
            },
			selectionmode: 'multiplerowsextended',
			editable: true,
			editmode: 'selectedrow',
			columns:
			[
                { text: 'AS명', datafield: 'asName' },
                { text: '국가명',	datafield: 'nameLong', width: '25%' },
                { text: '국가명 약어', datafield: 'nameShort', width: '15%',
                    validation: function(cell, value) {
                        if(value.toString().byteLen() > 2) {
                            return { result: false, message: ' 국가명 약어는 한글1자(2byte)로 입력해주세요.' };
                        }
                        return true;
                    }
                },
                { text: '국가번호', datafield: 'asNo', cellsalign: 'right', width: 200, editable: false , columntype: 'numberinput',
                    initeditor: function(row, cellvalue, editor) {
                        editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 99999 });
                    },
                    validation: function(cell, value) {
                        if(value.toString().length > 5) {
                            return { result: false, message: '0~99999사이의 값을 입력해주세요.' };
                        }
                        return true;
                    }
                }
			]
		}, CtxMenu.COMM, 'asData');
	},

	/** init data */
	initData: function() {
		this.searchData();
	},

	/** AS 설정 */
	searchData: function() {
		HmGrid.updateBoundData(NwAsConf.$dataGrid, ctxPath + '/main/env/nwRelationConf/getAsList.do');
	},

	addData: function() {
        $.post(ctxPath + '/main/popup/env/pNwAsAdd.do',
				function(result) {
					HmWindow.open($('#pwindow'), 'AS 등록', result, 500, 220);
				}
		);
	},

	delData: function() {
		var rowIdxes = HmGrid.getRowIdxes(this.$dataGrid, 'AS를 선택해주세요.');
		if(rowIdxes === false) return;
		if(!confirm('[' + rowIdxes.length + '] 건을 삭제하시겠습니까?')) return;
		var _asNos = [], _uids = [];
		$.each(rowIdxes, function(idx, value) {
			var tmp = NwAsConf.$dataGrid.jqxGrid('getrowdata', value);
			_asNos.push(tmp.asNo);
			_uids.push(tmp.uid)
		});

		Server.post('/main/env/nwRelationConf/delAs.do', {
			data: { asNos: _asNos },
			success: function(result) {
                NwAsConf.$dataGrid.jqxGrid('deleterow', _uids);
				alert('삭제되었습니다.');
			}
		});
	},

	saveData: function() {
		HmGrid.endRowEdit(this.$dataGrid);
		if(NwAsConf.editRowIds.length == 0) {
			alert('변경된 데이터가 없습니다.');
			return;
		}
		var _list = [];
		$.each(NwAsConf.editRowIds, function(idx, value) {
			_list.push(NwAsConf.$dataGrid.jqxGrid('getrowdatabyid', value));
		});

		Server.post('/main/env/nwRelationConf/saveAs.do', {
			data: { list: _list },
			success: function(result) {
				alert('저장되었습니다.');
                NwAsConf.editRowIds.length = 0;
			}
		});
	}
};