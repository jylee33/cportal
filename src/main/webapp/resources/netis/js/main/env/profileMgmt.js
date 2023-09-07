var $profileGrid, $evtCodeGrid, $mprocGrid;
var curProfileNo = 0, editRowIds = [], editMprocRowIds = [];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;

var Main = {
		/** variable */
		initVariable: function() {
			$profileGrid = $('#profileGrid');
			$evtCodeGrid = $('#evtCodeGrid');
			$mprocGrid = $('#mprocGrid');
			evtLevel1Text = $("#sEvtLevel1").val();
            evtLevel2Text = $("#sEvtLevel2").val();
            evtLevel3Text = $("#sEvtLevel3").val();
            evtLevel4Text = $("#sEvtLevel4").val();
            evtLevel5Text = $("#sEvtLevel5").val();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
				case 'btnAdd_profile': this.addProfile(); break;
				case 'btnDel_profile': this.delProfile(); break;
				case 'btnSave_info': this.saveProfileInfo(); break;
				case 'btnSave_limit': this.saveProfileLimit(); break;
				// case 'btnAdd_limit': this.addProfileLimit(); break;
				// case 'btnDel_limit': this.delProfileLimit(); break;
				// case 'btnAdd_mproc': this.addMProc(); break;
				// case 'btnSave_mproc': this.saveMProc(); break;
				// case 'btnDel_mproc': this.delMProc(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 254, collapsible: false }, { size: '100%' }], 'auto', '100%');
			HmJqxSplitter.create($('#rSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 210, collapsible: false }, { size: '100%' }], 'auto', '100%');

			HmGrid.create($profileGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/env/profileMgmt/getProfileList.do'
						}
				),
				pageable: false,
				ready: function() {
					try {
						$profileGrid.jqxGrid('selectrow', 0);
					} catch(e) {}
				},
				columns: 
				[
					{ text : '프로파일', datafield : 'profileName' }
			    ]
			});
			$profileGrid.on('rowselect', function(event) {
				curProfileNo = event.args.row.profileNo;
                // curProfileNo == 0 ? $('#btnAdd_limit').hide() : $('#btnAdd_limit').show();
                // $('#btnDel_limit').hide();
				Main.searchProfileDetail();
			});
			
			// 프로파일 정보
			$('#pollInterval').jqxDropDownList({ width: '100px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
				source: [{label: '30초', value: 30}, {label: '1분', value: 60}, {label: '2분', value: 120}, {label: '3분', value: 180}, {label: '4분', value: 240}, {label: '5분', value: 300}],
				displayMember: 'label', valueMember: 'value'
			});

			// 임계치 설정
			$('#evtCodeTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top'});
			HmGrid.create($evtCodeGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(editRowIds.indexOf(rowid) == -1)
								editRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
							data.profileNo = curProfileNo;
							data.codeType = 1;
							return data;
						},
						loadComplete: function(records) {
							editRowIds = [];
						}
					}
				),
				editable: true,
				editmode: 'selectedrow',
				pageable: false,
				columns:
					[
						{ text : '이벤트명', datafield : 'evtName', minwidth : 150 },
						{ text : '수집방법', datafield : 'engName', width : 100, editable: false },
						{ text : '발생구분', datafield : 'evtType', width : 100, editable: false },
						{ text : '사용여부', datafield : 'disIsUsing', width : 90, columntype: 'checkbox' },
						{ text : evtLevel1Text, columngroup: 'limit', datafield : 'limitValue1', width: 80, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor
						},
						{ text : evtLevel2Text, columngroup: 'limit', datafield : 'limitValue2', width : 80, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor
						},
						{ text : evtLevel3Text, columngroup: 'limit', datafield : 'limitValue3', width: 80, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor
						},
						{ text : evtLevel4Text, columngroup: 'limit', datafield : 'limitValue4', width: 80, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor
						},
						{ text : evtLevel5Text, columngroup: 'limit', datafield : 'limitValue5', width: 80, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor
						}
					],
				columngroups: [
					{ text: '임계값', align: 'center', name: 'limit' }
				]
			});

			HmGrid.create($('#evtCode_statGrid'), {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						updaterow: function(rowid, rowdata, commit) {
							if(editRowStatIds.indexOf(rowid) == -1)
								editRowStatIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function(data) {
							data.profileNo = curProfileNo;
							data.codeType = 0;
							return data;
						},
						loadComplete: function(records) {
							editRowStatIds = [];
						}
					}
				),
				editable: true,
				editmode: 'selectedcell',
				pageable: false,
				columns:
					[
						{ text : '이벤트명', datafield : 'evtName', minwidth : 150 },
						{ text : '수집방법', datafield : 'engName', width : 100, editable: false },
						{ text : '발생구분', datafield : 'evtType', width : 100, editable: false },
						{ text : '사용여부', datafield : 'disIsUsing', width : 90, columntype: 'checkbox' },
						{ text: '이벤트 등급', datafield: 'evtLevel', displayfield: 'disEvtLevel', width: 120, columntype: 'dropdownlist',
							createeditor: function (row, value, editor) {
								var s = [
									{ label: evtLevel1Text, value: 1 },
									{ label: evtLevel2Text, value: 2 },
									{ label: evtLevel3Text, value: 3 },
									{ label: evtLevel4Text, value: 4 },
									{ label: evtLevel5Text, value: 5 }
								];
								editor.jqxDropDownList({
									source: s,
									autoDropDownHeight: true,
									displayMember: 'label',
									valueMember: 'value'
								});
							}
						},
						{ text : 'Ping Count', columngroup: 'limit', datafield : 'limitValue1', width: 120, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
						},
						{ text : 'Ping Timeout(ms)', columngroup: 'limit', datafield : 'limitValue2', width : 120, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
						},
						{ text : 'Ping Interval(ms)', columngroup: 'limit', datafield : 'limitValue3', width: 120, cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
						},
						{ text: '누적카운트', columngroup: 'limit', datafield: 'limitValue4', width: 120, cellsalign: 'right', columntype: 'numberinput',
							createeditor: function(row, value, editor) {
								editor.jqxNumberInput({ decimalDigits: 0, min: 1, max: 10 });
							},
							validation: function (cell, value) {
								if (value < 1 || value > 10) {
									return {result: false, message: '1~10 사이의 값을 입력해주세요.'};
								}
								return true;
							},
							cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass
						}
					],
				columngroups: [
					{ text: '임계값', align: 'center', name: 'limit' },
				]
			});

            $('#evtCode_statGrid').on('bindingcomplete', function(e){
                var _rows = $('#evtCode_statGrid').jqxGrid('getrows');
                for(var i = 0 ; i < _rows.length ; i++){
                	var _row = _rows[i];
                    switch(_row.evtLevel){
						case 1:
                            _row.disEvtLevel = evtLevel1Text;
							break;
						case 2:
                            _row.disEvtLevel = evtLevel2Text;
							break;
						case 3:
                            _row.disEvtLevel = evtLevel3Text;
							break;
						case 4:
                            _row.disEvtLevel = evtLevel4Text;
							break;
						case 5:
                            _row.disEvtLevel = evtLevel5Text;
							break;
					}//switch(_rows.evtLevel)
				}//for end(i)
			})

		},

		isEditable: function(row) {
			var rowdata = $('#evtCode_statGrid').jqxGrid('getrowdata', row);
			console.log(rowdata)
			// if($.inArray(rowdata.code, ['ICMP_01', 'SNMP_01']) !== -1) {
			if(rowdata.code.indexOf('ICMP') !== -1 ||rowdata.code.indexOf('SNMP') !== -1) {
				return true;
			}
			return false;
		},

		isEditableClass: function (row, column, value, data) {
			var rowdata = $('#evtCode_statGrid').jqxGrid('getrowdata', row);
			// if($.inArray(rowdata.code, ['ICMP_01', 'SNMP_01']) !== -1) {
			if(rowdata.code.indexOf('ICMP') !== -1 ||rowdata.code.indexOf('SNMP') !== -1) {
				return null;
			}
			return "disabledCell";
		},

    /** init data */
		initData: function() {

		},
		
		/** 임계치 */
		limitInitEditor: function(row, cellvalue, editor) {
			editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 });
		},
				
		/** 프로파일 선택 */
		searchProfileDetail: function() {
			Server.get('/main/env/profileMgmt/getProfileInfo.do', {
				data: { profileNo: curProfileNo },
				success: function(result) {
					$.each(result, function(key, value) {
						try {
							var obj = $('#' + key);
							if(obj === undefined) return;
							obj.val(value);
						} catch(e) {}
					});
				}
			});

			HmGrid.updateBoundData($evtCodeGrid, ctxPath + '/main/env/profileMgmt/getEvtCodeListByProfile.do');
			HmGrid.updateBoundData($('#evtCode_statGrid'), ctxPath + '/main/env/profileMgmt/getEvtCodeListByProfile.do');

		},
		
		/** 프로파일 추가 */
		addProfile: function() {

			HmWindow.create($('#pwindow'), 470, 200, 999);
			$.post(ctxPath + '/main/popup/env/pProfileAdd.do',
				function(result) {
					HmWindow.openFit($('#pwindow'), '프로파일 등록', result, 500, 235);
				}
			);

		},
		
		/** 프로파일 삭제 */
		delProfile: function() {
			var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $profileGrid.jqxGrid('getrowdata', rowIdx);
			if(rowdata.profileNo == 0) {
				alert('기본 프로파일은 삭제할 수 없습니다.');
				return;
			}
			if(!confirm('[' + rowdata.profileName + '] 프로파일을 삭제하시겠습니까?')) return;
			Server.post('/main/env/profileMgmt/delProfile.do', {
				data: { profileNo: rowdata.profileNo },
				success: function(result) {
					$profileGrid.jqxGrid('deleterow', $profileGrid.jqxGrid('getrowid', rowIdx));
					alert('삭제되었습니다.');
					$profileGrid.jqxGrid('selectrow', 0);
				}
			});
		},
		
		/** 프로파일 상세정보 저장 */
		saveProfileInfo: function() {
			var obj = $('#profileForm').serializeObject();
			obj.pollInterval = $('#pollInterval').val();
			if($.isBlank(obj.profileName)) {
				alert('프로파일명을 입력해주세요.');
				$("#profileName").focus();
				return;
			}
			Server.post('/main/env/profileMgmt/editProfile.do', {
				data: obj,
				success: function(result) {
					$('#lastUpdTime').val(result);
					var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
					if(rowIdx !== false) {
						$profileGrid.jqxGrid('setcellvalue', rowIdx, 'profileName', obj.profileName);
					}
					alert('저장되었습니다.');
				}
			});
		},

    	/** 임계치 추가 */
		addProfileLimit: function() {
            $.post(ctxPath + '/main/popup/env/pEvtCodeAdd.do',
                function(result) {
                    HmWindow.open($('#pwindow'), '임계치 등록', result, 350, 150, 'p2window_init', { profileNo: curProfileNo });
                }
            );
		},

    	/** 임계치 삭제 */
		delProfileLimit: function() {
            var rowIdx = HmGrid.getRowIdx($evtCodeGrid, '이벤트를 선택해주세요.');
            if(rowIdx === false) return;
            var rowdata = $evtCodeGrid.jqxGrid('getrowdata', rowIdx);

            if(!confirm('[' + rowdata.evtName + '] 이벤트를 삭제하시겠습니까?')) return;
            Server.post('/main/env/profileMgmt/delEvtCode.do', {
                data: { profileNo: rowdata.profileNo, code: rowdata.code },
                success: function(result) {
                    $evtCodeGrid.jqxGrid('deleterow', $evtCodeGrid.jqxGrid('getrowid', rowIdx));
                    alert('삭제되었습니다.');
                    $('#btnDel_limit').hide();
                }
            });
		},

		/** 임계치 저장 */
		saveProfileLimit: function() {

			if(editRowIds.length == 0 && editRowStatIds.length == 0) {
				alert("수정된 정보가 존재하지 않습니다.");
				return;
			}

			var _list = [];
			$.each(editRowIds, function(idx, value) {
				var rowDt = $evtCodeGrid.jqxGrid('getrowdatabyid', value);
				var disIsUsing = rowDt.disIsUsing;
				if(disIsUsing==false||disIsUsing==0){ rowDt.isUsing='N'; }
				else if(disIsUsing==true||disIsUsing==1){ rowDt.isUsing='Y'; }

				_list.push(rowDt);
			});
			$.each(editRowStatIds, function(idx, value) {
				var rowDt = $('#evtCode_statGrid').jqxGrid('getrowdatabyid', value);
				var disIsUsing = rowDt.disIsUsing;
				if(disIsUsing==false||disIsUsing==0){ rowDt.isUsing='N'; }
				else if(disIsUsing==true||disIsUsing==1){ rowDt.isUsing='Y'; }

				_list.push(rowDt);
			});

			if(!confirm("저장하시겠습니까?")) return;

			Server.post('/main/env/profileMgmt/saveEvtCode.do', {
				data: { profileNo: curProfileNo, list: _list },
				success: function(result) {
					$('#lastUpdTime').val(result);
					alert('저장되었습니다.');
					editRowIds = [];
				}
			});
		},

		/** 감시프로세스 삭제 */
		delMProc: function () {
            var rowIdx = HmGrid.getRowIdx($mprocGrid, '프로세스를 선택해주세요.');
            if(rowIdx === false) return;
            var rowdata = $mprocGrid.jqxGrid('getrowdata', rowIdx);

            if(!confirm('[' + rowdata.mprocName + '] 프로세스를 삭제하시겠습니까?')) return;
            Server.post('/main/env/profileMgmt/delMProc.do', {
                data: { profileNo: rowdata.profileNo, mprocName: rowdata.mprocName },
                success: function(result) {
                    $mprocGrid.jqxGrid('deleterow', $mprocGrid.jqxGrid('getrowid', rowIdx));
                    alert('삭제되었습니다.');
                }
            });
        },

		/** 감시프로세스 저장 */
		saveMProc: function () {
			if(editMprocRowIds.length == 0) {
				alert('[감시 프로세스] 변경된 정보가 없습니다.');
				return;
			}
			
            var _list = [];
            $.each(editMprocRowIds, function(idx, value) {
                _list.push($mprocGrid.jqxGrid('getrowdatabyid', value));
            });

            Server.post('/main/env/profileMgmt/editMProc.do', {
                data: { profileNo: curProfileNo, mprocList: _list },
                success: function(result) {
                    alert(result);
                    editMprocRowIds = [];
                }
            });
		},

		/** 감시프로세스 추가 */
		addMProc: function () {
            HmWindow.create($('#pwindow'), 470, 200, 999);
            $.post(ctxPath + '/main/popup/env/pMProcAdd.do',
                function(result) {
                    HmWindow.open($('#pwindow'), '프로세스 등록', result, 500, 245, 'p2window_init', { profileNo: curProfileNo });

                }
            );
		}
};

function addProfileResult(newdata) {
	$profileGrid.jqxGrid('addrow', null, newdata);
}
function addMProcResult(newdata) {
    $mprocGrid.jqxGrid('addrow', null, newdata);
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});