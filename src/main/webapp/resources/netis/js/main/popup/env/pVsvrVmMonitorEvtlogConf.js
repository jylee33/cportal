var p_curProfileNo = 0;
var p_editIds = [];

var PMain = {
		/** variable */
		initVariable: function() {
			
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pw_btnEdit_ep': this.editProfile(); break;
			case 'pw_btnAdd_ep': this.addProfile(); break;
			case 'pw_btnDel_ep': this.delProfile(); break;
			case 'pw_btnSearch_evt': this.searchEvtlog(); break;
			case 'pw_btnSave_evt': this.saveEvtlog(); break;
			case 'pw_btnAdd_evt': this.addEvtlog(); break;
			case 'pw_btnDel_evt': this.delEvtlog(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$('#pw_splitter').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'vertical', panels: [{size: 250}, {size: '100%'}]});
			HmGrid.create($('#pw_profileGrid'), {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/popup/vsvrVmMonitorItemConf/getVsvrProfileList.do',
							data: { itemType: 'EVTLOG' }
						},
						{
							loadComplete: function(records) {
								p_curProfileNo = 0;
								p_editIds = [];
							}
						}
				),
				pageable: false,
				columns:
				[
				 	{ text: '프로파일번호', datafield: 'profileNo', width: 80, hidden: true },
				 	{ text: '프로파일명', datafield: 'profileName' }
				]
			});
			$('#pw_profileGrid').on('rowselect', function(event) {
				p_curProfileNo = event.args.row.profileNo;
				PMain.searchEvtlog();
			});
			
			HmGrid.create($('#pw_evtlogGrid'), {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(p_editIds.indexOf(rowid) == -1)
									p_editIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							formatData: function(data) {
								data.profileNo = p_curProfileNo;
								return data;
							}
						}
				),
				pageable: false,
				editable: true,
				columns:
				[
				 	{ text: 'SEQ_NO', datafield: 'seqNo', width: 60, hidden: true, editable: false },
					{ text: '로그명', datafield: 'logName', displayfield: 'logNameStr', width: 200, columntype: 'dropdownlist',
				 		createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: HmResource.getResource('evtlog_logname_list'), autoDropDownHeight: true });
						}
					},
					{ text: '원본', datafield: 'source', minwidth: 200 },
					{ text: '이벤트ID', datafield: 'eventId', width: 80, cellsalign: 'right', columntype: 'numberinput' },
					{ text: '수준', datafield: 'entryType', displayfield: 'entryTypeStr', width: 150, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: HmResource.getResource('evtlog_entrytype_list'), autoDropDownHeight: true });
						}
					},
					{ text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'evtLevelStr', width: 80, columntype: 'dropdownlist',
						cellsrenderer: HmGrid.evtLevelrenderer,
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: HmResource.getResource('evt_level_list'), autoDropDownHeight: true });
						}
					},
					{ text: '사용여부', datafield: 'useFlag', displayfield: 'useFlagStr', width: 60, columntype: 'dropdownlist',
						cellsrenderer: HmGrid.evtLevelrenderer,
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: HmResource.getResource('use_flag_list'), autoDropDownHeight: true });
						}
					}
				 ]
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 프로파일 조회 */
		searchProfile: function() {
			HmGrid.updateBoundData($('#pw_profileGrid'));
		},
		
		/** 프로파일 추가 */
		addProfile: function() {
			$.get(ctxPath + '/main/popup/env/pVsvrVmProfileAdd.do', 
					{ itemType: 'EVTLOG' },
					function(result) {
						HmWindow.open($('#pwindow'), '프로파일 등록', result, 300, 120);
					}
			);
		},
		
		/** 프로파일 수정 */
		editProfile: function() {
			var rowdata = HmGrid.getRowData($('#pw_profileGrid'));
			if(rowdata == null) {
				alert('프로파일을 선택해주세요.');
				return;
			}
			$.get(ctxPath + '/main/popup/env/pVsvrVmProfileEdit.do', 
					{ itemType: 'EVTLOG' },
					function(result) {
						HmWindow.open($('#pwindow'), '프로파일 수정', result, 300, 120, 'pwindow_init', rowdata);
					}
			);
		},
		
		/** 프로파일 삭제 */
		delProfile: function() {
			var rowdata = HmGrid.getRowData($('#pw_profileGrid'));
			if(rowdata == null) {
				alert('프로파일을 선택해주세요.');
				return;
			}
			if(!confirm('[' + rowdata.profileName + '] 프로파일을 삭제하시겠습니까?')) return;
			rowdata.itemType = 'EVTLOG';
			Server.post('/main/popup/vsvrVmMonitorItemConf/delVsvrProfile.do', {
				data: rowdata,
				success: function(result) {
					$('#pw_profileGrid').jqxGrid('deleterow', rowdata.uid);
					alert(result);
				}
			});
		},
		
		/** 이벤트로그 조회 */
		searchEvtlog: function() {
			HmGrid.updateBoundData($('#pw_evtlogGrid'), ctxPath + '/main/popup/vsvrVmMonitorItemConf/getVsvrEvtlogCfgProfileList.do');
		},

		/** 이벤트로그 추가 */
		addEvtlog: function() {
			if(p_curProfileNo == 0) {
				alert('프로파일을 선택해주세요.');
				return;
			}
			$.get(ctxPath + '/main/popup/env/pVsvrVmEvtlogCfgProfileAdd.do', 
					{ profileNo: p_curProfileNo },
					function(result) {
						HmWindow.open($('#pwindow'), '프로파일 이벤트로그 추가', result, 600, 180);
					}
			);
		},
		
		/** 이벤트로그 삭제 */
		delEvtlog: function() {
			var rowdata = HmGrid.getRowData($('#pw_evtlogGrid'));
			if(rowdata == null) {
				alert('이벤트로그를 선택해주세요.');
				return;
			}
			if(!confirm('[' + rowdata.logName + '] 이벤트로그를 삭제하시겠습니까?')) return;
			Server.post('/main/popup/vsvrVmMonitorItemConf/delVsvrEvtlogCfgProfile.do', {
				data: rowdata,
				success: function(result) {
					$('#pw_evtlogGrid').jqxGrid('deleterow', rowdata.uid);
					alert(result);
				}
			});
		},
		
		/** 이벤트로그 저장 */
		saveEvtlog: function() {
			HmGrid.endRowEdit($('#pw_evtlogGrid'));
			if(p_editIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			$.each(p_editIds, function(idx, value) {
				_list.push($('#pw_evtlogGrid').jqxGrid('getrowdatabyid', value));
			});
		
			Server.post('/main/popup/vsvrVmMonitorItemConf/saveVsvrEvtlogCfgProfile.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					p_editIds = [];
				}
			});
		}
};

function addProfileHandler() {
	PMain.searchProfile();
}
function editProfileHandler() {
	PMain.searchProfile();
}

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});