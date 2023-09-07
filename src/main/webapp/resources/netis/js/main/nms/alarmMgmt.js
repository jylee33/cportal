var $profileGrid, $evtCodeGrid;
var curProfileNo = 0, editRowIds = [], editRowStatIds =[];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var otherLevelArray = {};

var Main = {
		/** variable */
		initVariable: function() {
			$profileGrid = $('#profileGrid');
			$evtCodeGrid = $('#evtCodeGrid');
			evtLevel1Text = $('#sEvtLevel1').val();
			evtLevel2Text = $('#sEvtLevel2').val();
			evtLevel3Text = $('#sEvtLevel3').val();
			evtLevel4Text = $('#sEvtLevel4').val();
			evtLevel5Text = $('#sEvtLevel5').val();
			otherLevelArray = {};
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
			case 'btnSetPps': this.saveSetPps(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 250 }, { size: '100%' }], '100%', '100%');
			HmJqxSplitter.create($('#rSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 195 }, { size: '100%' }], 'auto', '100%');

			HmGrid.create($profileGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/nms/alarmMgmt/getProfileList.do'
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
				//setTimeout(function() {
					Main.searchProfileDetail();
				//}, 300);
			});
			
			// 프로파일 정보
			//수집주기
			$('#pollInterval').jqxDropDownList({ width: '80px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
				source: [{label: '30초', value: 30}, {label: '1분', value: 60}, {label: '2분', value: 120}, {label: '3분', value: 180}, {label: '4분', value: 240}, {label: '5분', value: 300}],
				displayMember: 'label', valueMember: 'value'
			});

			//감시주기
			$('#watchInterval').jqxDropDownList({ width: '80px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
				source: [{label: '10초', value: 10}, {label: '15초', value: 15}, {label: '20초', value: 20}, {label: '30초', value: 30}, {label: '1분', value: 60}, {label: '2분', value: 120}, {label: '3분', value: 180}, {label: '4분', value: 240}, {label: '5분', value: 300}],
				displayMember: 'label', valueMember: 'value'
			});

			// 프로파일 정보
			$('#pollSendInterval, #watchSendInterval').jqxDropDownList({ width: '80px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
				source: [
					{label: '반복없음', value: 0},
					{label: '10분', value: 10}, {label: '20분', value: 20}, {label: '30분', value: 30},
					{label: '40분', value: 40}, {label: '50분', value: 50}, {label: '60분', value: 60}],
				displayMember: 'label', valueMember: 'value'
			});
			$('#minCnt').jqxDropDownList({ width: '80px', height: '21px', selectedIndex: 0, autoDropDownHeight: true,
				source: [1, 2, 3, 4, 5]
			});
			
			// 임계치 설정
			$('#evtCodeTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme });
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

                        	console.log('createeditor');

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

			// $('#cbIcmp01, #cbSnmp01, #cbPerf11, #cbTcp01, #cbTrap02')
			// 	.jqxDropDownList({ width: '80px', height: 21, autoDropDownHeight: true, placeHolder: '선택',
			// 		source: [ { label: evtLevel1Text, value: 1 }, { label: evtLevel2Text, value: 2 }, { label: evtLevel3Text, value: 3 }, { label: evtLevel4Text, value: 4 }, { label: evtLevel5Text, value: 5 } ]
			// 	});
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
			Server.get('/main/nms/alarmMgmt/getProfileInfo.do', {
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
			
			// $('#cbIcmp01, #cbSnmp01, #cbPerf11, #cbTcp01, #cbTrap02').jqxDropDownList('clearSelection');
			// Server.get('/main/nms/alarmMgmt/getOtherEvtLevel.do', {
			// 	data: { profileNo: curProfileNo },
			// 	success: function(result) {
			// 		$.each(result, function(idx, value) {
			// 			try {
			// 				switch(value.code) {
			// 				case 'ICMP_01': $('#cbIcmp01').val(value.evtLevel); break;
			// 				case 'SNMP_01': $('#cbSnmp01').val(value.evtLevel); break;
			// 				case 'PERF_11': $('#cbPerf11').val(value.evtLevel); break;
			// 				case 'TCP_01': $('#cbTcp01').val(value.evtLevel); break;
			// 				case 'TRAP_02': $('#cbTrap02').val(value.evtLevel); break;
			// 				}
			//
			// 				otherLevelArray[value.code] = value.evtLevel;
			// 			} catch(e) {}
			// 		});
			// 	}
			// });

            HmGrid.updateBoundData($evtCodeGrid, ctxPath + '/main/nms/alarmMgmt/getEvtCodeListByProfile.do');
            HmGrid.updateBoundData($('#evtCode_statGrid'), ctxPath + '/main/nms/alarmMgmt/getEvtCodeListByProfile.do');
		},
		
		/** 프로파일 추가 */
		addProfile: function() {
			HmWindow.create($('#pwindow'), 470, 230);
			$.post(ctxPath + '/main/popup/nms/pProfileAdd.do',
				function(result) {
					HmWindow.openFit($('#pwindow'), '프로파일 등록', result, 550, 250);
					// $('#pwindow').jqxWindow({ title : '<h1>프로파일 등록</h1>', content : result, width: 550, height: 245, position : 'center', resizable : false });
					// $('#pwindow').jqxWindow('open');
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

			Server.post('/main/nms/alarmMgmt/delProfile.do', {
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
			obj.watchInterval = $('#watchInterval').val();HmGrid.getRowIdxes
			obj.pollSendInterval = $('#pollSendInterval').val();
			obj.watchSendInterval = $('#watchSendInterval').val();
			obj.minCnt = $('#minCnt').val();
			if($.isBlank(obj.profileName)) {
				alert('프로파일명을 입력해주세요.');
				$("#profileName").focus();
				return;
			}
			Server.post('/main/nms/alarmMgmt/editProfile.do', {
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
		
		/** 임계치 저장 */
		saveProfileLimit: function() {
			// var _levelList = [
			//                   { code: 'ICMP_01', evtLevel: $('#cbIcmp01').val() },
			//                   { code: 'SNMP_01', evtLevel: $('#cbSnmp01').val() },
			//                   { code: 'PERF_11', evtLevel: $('#cbPerf11').val() },
			//                   { code: 'TCP_01', evtLevel: $('#cbTcp01').val() },
			//                   { code: 'TRAP_02', evtLevel: $('#cbTrap02').val() }
	         //          	];
			//
			// // 상단 이벤트 설정 변경되었는지 확인
			// var otherChgFlag = 0; // 0:변경없음, 1:변경있음
			// $.each(_levelList, function(idx, val) {
			// 	var code = val.code;
			// 	var level = val.evtLevel;
			// 	if(otherLevelArray[code]!=level){
			// 		otherChgFlag = 1;
			// 		return false;
			// 	}
			// });
			//

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
			
            // if(_list.length==0 && otherChgFlag==0){
            //     alert("수정된 정보가 존재하지 않습니다.");
            //     return;
            // }
			
			if(!confirm("저장하시겠습니까?")) return;
			
			Server.post('/main/nms/alarmMgmt/saveEvtCode.do', {
				data: { profileNo: curProfileNo, list: _list, levelList: [] },
				success: function(result) {
					$('#lastUpdTime').val(result);
					alert('저장되었습니다.');
					editRowIds = [];
				}
			});
		},

		/** 대역폭별 PPS 일괄설정 */
		saveSetPps: function() {
            HmWindow.create($('#pwindow'), 500, 230);
            $.post(ctxPath + '/mbc/popup/nms/pSetPps.do',
                function(result) {
                    $('#pwindow').jqxWindow({ title : '<h1>대역폭별 PPS 일괄설정</h1>', content : result, width: 500, height: 150, position : 'center', resizable : false });
                    $('#pwindow').jqxWindow('open');
                }
            );
        },

		exportExcel: function() {
			if($('#evtCodeTab').val() == 0)
				HmUtil.exportGrid($evtCodeGrid, '프로파일_임계치', false);
			else
                HmUtil.exportGrid($('#evtCode_statGrid'), '프로파일_상태', false);
		},

		exportExcel__: function() {
			var params = {
					profileNo : curProfileNo
			};
			
			HmUtil.exportExcel(ctxPath + '/main/nms/alarmMgmt/export.do', params);
		}
};

function addProfileResult(newdata) {
	$profileGrid.jqxGrid('addrow', null, newdata);
}

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});