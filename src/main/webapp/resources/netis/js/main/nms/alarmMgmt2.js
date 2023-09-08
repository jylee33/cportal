var $profileGrid, $limitGrid , $statusGrid;
var editProfileRowIds = [];
var curProfileNo = 0, editLimitRowIds = [], editStatusRowIds =[];
var evtLevel1Text, evtLevel2Text, evtLevel3Text, evtLevel4Text, evtLevel5Text;
var systemCdList;
var selectedProfileNo='';
var selectedSystemCd='';
var ctxIdxs = 0;

var interval1 = [
	{label: '30초', value: 30},	{label: '1분', value: 60},
	{label: '2분', value: 120},	{label: '3분', value: 180},
	{label: '4분', value: 240},	{label: '5분', value: 300}];

var interval2 = [
	{label: '10초', value: 10},
	{label: '15초', value: 15},	{label: '20초', value: 20},
	{label: '30초', value: 30},	{label: '1분', value: 60},
	{label: '2분', value: 120},	{label: '3분', value: 180},
	{label: '4분', value: 240},	{label: '5분', value: 300}];

var repeatInterval = [{label: '반복없음', value: 0},
	{label: '10분', value: 10}, {label: '20분', value: 20}, {label: '30분', value: 30},
	{label: '40분', value: 40}, {label: '50분', value: 50}, {label: '60분', value: 60}];

var Main = {
		/** variable */
		initVariable: function() {
			$profileGrid = $('#profileGrid');
			$limitGrid = $('#limitGrid');
			$statusGrid = $('#statusGrid');

			evtLevel1Text = $('#sEvtLevel1').val();
			evtLevel2Text = $('#sEvtLevel2').val();
			evtLevel3Text = $('#sEvtLevel3').val();
			evtLevel4Text = $('#sEvtLevel4').val();
			evtLevel5Text = $('#sEvtLevel5').val();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch_profile': this.searchProfile(); break;
			case 'btnAdd_profile': this.addProfile(); break;
			case 'btnCopy_profile': this.copyProfile(); break;
			case 'btnDel_profile': this.delProfile(); break;
			case 'btnSave_profile': this.saveProfile(); break;
			//btnEdit_profile 수정 팝업
			case 'btnEdit_profile': this.editProfile(); break;
			//btnDel_profile 프로파일 삭제 - 사용중인지 확인 필요
			case 'btnApply_profile': this.applyProfile(); break;

			case 'btnExcel_profile': this.exportExcel(); break;
			case 'btnSave_limit': this.saveLimit(); break;
			case 'btnSave_status': this.saveStatus(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#mainSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%' }, { size: '55%' }], '100%', '100%');
			HmJqxSplitter.create($('#subSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%' }, { size: '50%' }], '100%', '100%');

			// Server.post('/main/nms/alarmMgmt2/getProfileCodeInfo.do', {
			// 	data: {codeKind : 'SYSTEM_CD' },
			// 	success: function (result) {
			// 		systemCdList = result;
			// 	}
			// });


			//프로파일 그리드 $profileGrid
			 HmGrid.create($profileGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf-8',
						url: ctxPath + '/main/nms/alarmMgmt2/getProfileList.do',
						updaterow: function (rowid, rowdata, commit) {
							if (editProfileRowIds.indexOf(rowid) == -1)
								editProfileRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function (data) {
							return data;
						},
						loadComplete: function (records) {
							editProfileRowIds = [];
						}
					}
				),
				editable: true,
				editmode: 'selectedrow',
				columns:
					[
						{text: '시스템구분코드', datafield: 'systemCd', width: 160 , editable : false , hidden : true },
						{text: '시스템구분', datafield: 'disSystemCd', width: 160 , editable : false },
						{text: '프로파일번호', datafield: 'profileNo', width: 100 ,  editable : false , hidden : true  },
						{text: '프로파일명', datafield: 'profileNm', width: 240 },
						{text: '수집주기', columngroup: 'perf', datafield: 'pollInterval', displayfield: 'disPollInterval', width: 140 , columntype: 'dropdownlist',
							createeditor: function (row, value, editor) {
								editor.jqxDropDownList({
									source: interval1,
									autoDropDownHeight: true,
									displayMember: 'label',
									valueMember: 'value',
								});
							}
						},
						{text: '반복 알림주기', columngroup: 'perf', datafield: 'pollRepeatInterval', displayfield: 'disPollRepeatInterval', width: 140 , columntype: 'dropdownlist',
							createeditor: function (row, value, editor) {
								editor.jqxDropDownList({
									source: repeatInterval,
									autoDropDownHeight: true,
									displayMember: 'label',
									valueMember: 'value'
								});
							}
						},
						{text: '감시주기', columngroup: 'evt', datafield: 'watchInterval', displayfield: 'disWatchInterval', width: 140 , columntype: 'dropdownlist',
							createeditor: function (row, value, editor) {
							editor.jqxDropDownList({
								source: interval2,
								autoDropDownHeight: true,
								displayMember: 'label',
								valueMember: 'value'
							});
						}},
						{text: '반복 알림주기', columngroup: 'evt', datafield: 'watchRepeatInterval', displayfield: 'disWatchRepeatInterval', width: 140 , columntype: 'dropdownlist',
							createeditor: function (row, value, editor) {
								editor.jqxDropDownList({
									source: repeatInterval,
									autoDropDownHeight: true,
									displayMember: 'label',
									valueMember: 'value'
								});
							}
						},
						{text: '이벤트 유형', datafield: 'evtConf', width: 170 , editable : false , hidden : true },
						{text: '설명', datafield: 'profileDesc' , editable : true },
						{text: 'cpu', datafield: 'procLimitCpuPer' , editable : false , hidden : true},
						{text: 'mem', datafield: 'procLimitMemPer' , editable : false , hidden : true},
						{text: 'topn', datafield: 'procLimitTopnCnt' , editable : false , hidden : true},
						{text: '수정일시', datafield: 'lastUpd', width: 170 , editable : false },
					],
				columngroups: [
					{ text: '성능', align: 'center', name: 'perf' },
					{ text: '장애', align: 'center', name: 'evt' },
				]
			}, CtxMenu.COMM , ctxIdxs++);

			 //프로파일 클릭 시 하단에 임계, 상태 그리드에 데이터 출력
			$profileGrid.on('rowselect', function (event)
			{
				var rowData = event.args.row;
				selectedProfileNo = rowData.profileNo;
				selectedSystemCd  = rowData.systemCd;

				HmGrid.updateBoundData($limitGrid, ctxPath + '/main/nms/alarmMgmt2/getLimitList.do');
				HmGrid.updateBoundData($statusGrid, ctxPath + '/main/nms/alarmMgmt2/getStatusList.do');
			});

			//임계치 설정 그리드 $limitGrid
			HmGrid.create($limitGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf-8',
						url: ctxPath + '/main/nms/alarmMgmt2/getLimitList.do',
						updaterow: function (rowid, rowdata, commit) {
							if (editLimitRowIds.indexOf(rowid) == -1)
								editLimitRowIds.push(rowid);
							commit(true);
						}
					},
					{
						formatData: function (data) {
							$.extend(data, {
								systemCd : selectedSystemCd,
								profileNo: selectedProfileNo,
							});
							return JSON.stringify(data);
						},
						loadComplete: function (records) {
							editLimitRowIds = [];
						}
					}
				),
				editable: true,
				editmode: 'selectedcell',
				selectionmode: 'multiplerowsextended',
				pageable: false,
				columns:
					[
						{text: 'EVT_COND', datafield: 'evtCond', hidden: true  , editable: false },
						{text: '이벤트코드', datafield: 'evtCd', hidden: true  , editable: false },
						{text: '이벤트명', datafield: 'evtNm'  , editable: false },
						{text: '이벤트 유형', datafield: 'evtType', width: 90  , editable: false , hidden: true},

						{text: '사용여부', datafield: 'useFlag', width: 80 , columntype: 'checkbox' },

						{text: evtLevel1Text, columngroup: 'limit', datafield: 'limitValue1', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor2 },
						{text: evtLevel2Text, columngroup: 'limit', datafield: 'limitValue2', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor2 },
						{text: evtLevel3Text, columngroup: 'limit', datafield: 'limitValue3', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor2 },
						{text: evtLevel4Text, columngroup: 'limit', datafield: 'limitValue4', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor2 },
						{text: evtLevel5Text, columngroup: 'limit', datafield: 'limitValue5', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor2 },

						{text: '발생', columngroup: 'delay', datafield: 'occurDelayCnt', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor },
						{text: '해제', columngroup: 'delay', datafield: 'freeDelayCnt', width: 80 , cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor },
					],
				columngroups: [
					{ text: '임계치', align: 'center', name: 'limit' },
					{ text: '지연횟수', align: 'center', name: 'delay' },
				]
			// }, CtxMenu.COMM , ctxIdxs++);
			}, CtxMenu.EACH_LIMIT_BATCH_SET , ctxIdxs++);

			//상태 설정 그리드 $statusGrid
			HmGrid.create($statusGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'json',
						type: 'POST',
						contenttype: 'application/json; charset=utf-8',
						url: ctxPath + '/main/nms/alarmMgmt2/getStatusList.do',
						updaterow: function (rowid, rowdata, commit) {
							if (editStatusRowIds.indexOf(rowid) == -1)
								editStatusRowIds.push(rowid);
							commit(true);
						},
					},
					{
						formatData: function (data) {
							$.extend(data, {
								systemCd : selectedSystemCd,
								profileNo: selectedProfileNo,
							});
							return JSON.stringify(data);
						},
						loadComplete: function (records) {
							editStatusRowIds = [];
						}
					}
				),
				editable: true,
				editmode: 'selectedcell',
				selectionmode: 'multiplerowsextended',
				pageable: false,
				columns:
					[
						{text: 'EVT_COND', datafield: 'evtCond', hidden: true  , editable: false },
						{text: '이벤트코드', datafield: 'evtCd', hidden: true  , editable: false  },
						{text: '이벤트명', datafield: 'evtNm' , editable: false },
						{text: '이벤트 유형', datafield: 'evtType', width: 90  , editable: false , hidden: true},
						{text: '사용여부', datafield: 'useFlag', width: 80 , columntype: 'checkbox' },
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
						{text: 'Count', columngroup: 'limit', datafield: 'cnt', width: 100 , cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass },
						{text: 'Timeout(ms)', columngroup: 'limit', datafield: 'timeout', width: 100 , cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass },
						{text: 'Interval(ms)', columngroup: 'limit', datafield: 'interval', width: 100 , cellsalign: 'right', columntype: 'numberinput',
							initeditor: Main.limitInitEditor, cellbeginedit: Main.isEditable, cellclassname: Main.isEditableClass },

						{text: '발생', columngroup: 'delay', datafield: 'occurDelayCnt', width: 80, cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor },
						{text: '해제', columngroup: 'delay', datafield: 'freeDelayCnt', width: 80, cellsalign: 'right', columntype: 'numberinput', initeditor: Main.limitInitEditor },
					],
				columngroups: [
					{ text: '임계치', align: 'center', name: 'limit' },
					{ text: '지연횟수', align: 'center', name: 'delay' },
				]
			// }, CtxMenu.COMM , ctxIdxs++);
			}, CtxMenu.EACH_LIMIT_BATCH_SET , ctxIdxs++);

		},

		isEditable: function(row) {
			var rowdata = $('#statusGrid').jqxGrid('getrowdata', row);
			// // if($.inArray(rowdata.code, ['ICMP_01', 'SNMP_01']) !== -1) {
			if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ||rowdata.evtCd.indexOf('TCP') !== -1 ||rowdata.evtCd.indexOf('URL') !== -1 ) {
				return true;
			}
			return false;
		},

		isEditableClass: function (row, column, value, data) {
            var rowdata = $('#statusGrid').jqxGrid('getrowdata', row);
            // // if($.inArray(rowdata.code, ['ICMP_01', 'SNMP_01']) !== -1) {
            if(rowdata.evtCd.indexOf('ICMP') !== -1 ||rowdata.evtCd.indexOf('SNMP') !== -1 ||rowdata.evtCd.indexOf('TCP') !== -1 ||rowdata.evtCd.indexOf('URL') !== -1 ) {
                return null;
            }
            return "disabledCell";
        },

		/** init data */
		initData: function() {

		},
		
		/** 임계치 */
		limitInitEditor: function(row, cellvalue, editor) {
			// editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 });
			editor.jqxNumberInput({ decimalDigits: 0, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

		},
		/** 임계치  소수점 둘째자리 까지 가능하도록 함 */
		limitInitEditor2: function(row, cellvalue, editor) {
			// editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 });
			editor.jqxNumberInput({ decimalDigits: 2, min: 0, max: 9999999999 , theme: jqxTheme, inputMode: 'simple', spinButtons: true, value: cellvalue });

		},

		/** 프로파일 조회 */
		searchProfile: function() {
			HmGrid.updateBoundData($profileGrid);
		},
		
		/** 프로파일 추가 */
		addProfile: function() {
			$.post('/main/popup/nms/pProfileAdd2.do',
				function (result) {
					HmWindow.openFit($('#pwindow'), '프로파일 등록', result, 800, 900 , 'init');
				}
			);
		},

		/** 프로파일 복사 */
		copyProfile: function() {
			var rowIdx = HmGrid.getRowIdx($profileGrid , '프로파일을 선택해주세요.');
			if(rowIdx === false) return;

			var rowData = HmGrid.getRowData($profileGrid , rowIdx);

			if(confirm(rowData.profileNm + " 프로파일을 복사하시겠습니까?")){
				Server.post('/main/nms/alarmMgmt2/copyProfile.do', {
					data: rowData,
					success: function (result) {
						alert('복사가 완료 되었습니다.');
						HmGrid.updateBoundData($profileGrid);
					}
				});
			}
		},

		editProfile: function() {

			var rowIdx = HmGrid.getRowIdx($profileGrid , '프로파일을 선택해주세요.');
			if(rowIdx === false) return;
			var rowData = HmGrid.getRowData($profileGrid , rowIdx);
			$.post('/main/popup/nms/pProfileEdit2.do', rowData ,
				function (result) {
					HmWindow.openFit($('#pwindow'), '프로파일 수정', result, 800, 900 , 'init' , rowData );
				}
			);
		},
		

		/** 프로파일 상세정보 저장 */
		saveProfile: function() {

			HmGrid.endRowEdit($profileGrid);
			if (editProfileRowIds.length == 0 && editProfileRowIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
			var _list = [];
			var checkEmpty = false;
			$.each(editProfileRowIds, function (idx, value) {
				var tmp = $profileGrid.jqxGrid('getrowdatabyid', value);
				if( tmp.profileNm == undefined || tmp.profileNm == "" ) checkEmpty = true;
				_list.push(tmp);
			});

			if(checkEmpty){
				alert("프로파일명을 입력해주세요.");
				return false;
			}

			Server.post('/main/nms/alarmMgmt2/saveProfile.do', {
				data: {list: _list},
				success: function (result) {
					alert('저장되었습니다.');
					editProfileRowIds = [];
					HmGrid.updateBoundData($profileGrid);
				}
			});

		},
		
		/** 임계치 저장 */
		saveLimit: function() {
			if(selectedSystemCd == '' || (selectedProfileNo == null || selectedProfileNo == undefined) ){
				alert("프로파일을 선택해주세요.");
				return false;
			}else{
				HmGrid.endRowEdit($limitGrid);
				if (editLimitRowIds.length == 0 && editLimitRowIds.length == 0) {
					alert('변경된 데이터가 없습니다.');
					return;
				}

				var _list = [];
				$.each(editLimitRowIds, function (idx, value) {
					var tmp = $limitGrid.jqxGrid('getrowdatabyid', value);
					if (tmp.limitValue1 == "null"){ tmp.limitValue1 = 0 ; }
					else{ tmp.limitValue1  = parseFloat(tmp.limitValue1); }

					if (tmp.limitValue2 == "null"){ tmp.limitValue2 = 0 ; }
					else{ tmp.limitValue2  = parseFloat(tmp.limitValue2); }

					if (tmp.limitValue3 == "null"){ tmp.limitValue3 = 0; }
					else{ tmp.limitValue3  = parseFloat(tmp.limitValue3); }

					if (tmp.limitValue4 == "null"){ tmp.limitValue4 = 0; }
					else{ tmp.limitValue4  = parseFloat(tmp.limitValue4); }

					if (tmp.limitValue5 == "null"){ tmp.limitValue5 = 0; }
					else{ tmp.limitValue5  = parseFloat(tmp.limitValue5); }

					if (tmp.occurDelayCnt == "null") tmp.occurDelayCnt = 0;
					if (tmp.freeDelayCnt == "null") tmp.freeDelayCnt = 0;

					_list.push(tmp);
				});

				Server.post('/main/nms/alarmMgmt2/saveLimit.do', {
					data: {list: _list},
					success: function (result) {
						alert('저장되었습니다.');
						editLimitRowIds = [];
						HmGrid.updateBoundData($limitGrid);
					}
				});
			}
		},

		saveStatus: function() {
			if(selectedSystemCd == '' || (selectedProfileNo == null || selectedProfileNo == undefined) ){
				alert("프로파일을 선택해주세요.");
				return false;
			}else{
				HmGrid.endRowEdit($statusGrid);
				if (editStatusRowIds.length == 0 && editStatusRowIds.length == 0) {
					alert('변경된 데이터가 없습니다.');
					return;
				}

				var _list = [];
				$.each(editStatusRowIds, function (idx, value) {
					var tmp = $statusGrid.jqxGrid('getrowdatabyid', value);
					if (tmp.cnt == "null"){tmp.cnt = parseInt('0'); }
					else { tmp.cnt = parseInt(tmp.cnt); }

					if (tmp.interval == "null"){tmp.interval = parseInt('0'); }
					else { tmp.interval = parseInt(tmp.interval); }

					if (tmp.timeout == "null"){ tmp.timeout = parseInt('0'); }
					else{ tmp.timeout = parseInt(tmp.timeout); }

					if (tmp.occurDelayCnt == "null") tmp.occurDelayCnt = 0;
					if (tmp.freeDelayCnt == "null") tmp.freeDelayCnt = 0;
					_list.push(tmp);
				});

				Server.post('/main/nms/alarmMgmt2/saveStatus.do', {
					data: {list: _list},
					success: function (result) {
						alert('저장되었습니다.');
						editStatusRowIds = [];
						HmGrid.updateBoundData($statusGrid);
					}
				});
			}
		},

		/** 프로파일 삭제 */
		delProfile: function() {
			var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $profileGrid.jqxGrid('getrowdata', rowIdx);
			var systemCdStr = rowdata.disSystemCd;

			if(rowdata.profileNo == 0) {
				alert('기본 프로파일은 삭제할 수 없습니다.');
				return;
			}
			if(!confirm('[' + rowdata.profileNm + '] 프로파일을 삭제하시겠습니까?')) return;

			Server.post('/main/nms/alarmMgmt2/delProfile.do', {
				data: { systemCd : rowdata.systemCd , profileNo: rowdata.profileNo },
				success: function(result) {
					if(result == -1){
						alert("사용중인 "+systemCdStr+" 프로파일입니다. \n프로파일을 변경/해지 후 삭제하세요");
					}else{
						alert('삭제되었습니다.');
						HmGrid.updateBoundData($profileGrid);
						$('#limitGrid').jqxGrid('clear');
						$('#statusGrid').jqxGrid('clear');

					}
				}
			});

		},

		exportExcel: function() {

			var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $profileGrid.jqxGrid('getrowdata', rowIdx);
			HmUtil.exportExcel(ctxPath + '/main/nms/alarmMgmt2/export.do', rowdata);
		},

		/** 프로파일 적용 */
		applyProfile: function() {
			var rowIdx = HmGrid.getRowIdx($profileGrid, '프로파일을 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $profileGrid.jqxGrid('getrowdata', rowIdx);

			switch(rowdata.systemCd){
				case 'DEV':
					$.post('/main/popup/nms/pProfileApplyDev.do', rowdata ,
						function (result) {
							HmWindow.open($('#pwindow'), '프로파일 대상설정', result, 1250, 800 , 'init' , rowdata);
						}
					);
					break;
				case 'IF' :
					$.post('/main/popup/nms/pProfileApplyIf.do', rowdata ,
						function (result) {
							// HmWindow.openFit($('#pwindow'), '프로파일 대상설정', result, 800, 900 , 'init');
							HmWindow.open($('#pwindow'), '프로파일 대상설정', result, 1400, 800 , 'init' , rowdata);
						}
					);
					break;
				case 'RACK' :
					$.post('/main/popup/nms/pProfileApplyRack.do', rowdata ,
						function (result) {
							HmWindow.open($('#pwindow'), '프로파일 대상설정', result, 1400, 800 , 'init' , rowdata);
						}
					);
					break;
				case 'SVR' :
					$.post('/main/popup/nms/pProfileApplySvr.do', rowdata ,
						function (result) {
							HmWindow.open($('#pwindow'), '프로파일 대상설정', result, 1400, 800 , 'init' , rowdata);
						}
					);
					break;
			}

		},

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});