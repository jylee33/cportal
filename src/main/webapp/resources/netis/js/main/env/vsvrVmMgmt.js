var $vsvrGrid, $vmGrid, $tabs, $serviceGrid, $processGrid, $evtlogGrid;
var serviceProfileList = [], processProfileList = [], evtlogProfileList = [], defaultValueList = [];
var _curVsvrNo = 0, _curVmRowdata = null, _editIds = [];
var TAB = {
		SERVICE: 0,
		PROCESS: 1,
		EVENT_LOG: 2
}

var Main = {
		/** variable */
		initVariable: function() {
			$vsvrGrid = $('#vsvrGrid'), $vmGrid = $('#vmGrid'), $tabs = $('#tabs'), $serviceGrid = $('#serviceGrid'), $processGrid = $('#processGrid');
			$evtlogGrid = $('#evtlogGrid');
			defaultValueList = [{profileNo: null, profileName:'미설정'}];
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchVm(); break;
			case 'btnDevReg': this.regiVmToDev10(); break;
			case 'btnSave': this.saveVmProfile(); break;
			case 'btnSet_svc': this.showMonitorServiceConfPopup(); break; 
			case 'btnSet_prcs': this.showMonitorProcessConfPopup(); break; 
			case 'btnSet_evtlog': this.showMonitorEvtlogConfPopup(); break; 
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmGrid.create($vsvrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							
						},
						{
							beforeLoadComplete: function(records) { 
								records.unshift({ vsvrNo: -1, vsvrName: '전체' });
								return records;
							},
							loadComplete: function(records) {
								_curVsvrNo = 0;
								$vmGrid.jqxGrid('clear');
							}
						}
				),
				pageable: false,
				columns:
				[
				 	{ text: '서버번호', datafield: 'vsvrNo', width: 80, hidden: true }, 
				 	{ text: '가상 서버명', datafield: 'vsvrName' }
				],
				ready: function() {
					$vsvrGrid.jqxGrid('selectrow', 0);
				}
			});
			$vsvrGrid.on('rowselect', function(event) {
				_curVsvrNo = event.args.row.vsvrNo;
				Main.searchVm();
			});
			
			HmGrid.create($vmGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							updaterow: function(rowid, rowdata, commit) {
								if(_editIds.indexOf(rowid) == -1)
									_editIds.push(rowid);
				            	commit(true);
				            }
						},
						{
							formatData: function(data) {
								data.vsvrNo = _curVsvrNo;
								return data;
							},
							loadComplete: function(records) {
								_editIds = [];
								_curVmRowdata = null;
								Main.clearMonitorGrid();
							}
						}
				),
				showtoolbar: true,
				rendertoolbar: function(toolbar) {
					HmGrid.titlerenderer(toolbar, 'VM 리스트', 'titleVmGrid');
				},
				editable: true,
				columns:
				[
				 	{ text: '장비 등록여부', datafield: 'dev10RegFlagStr', width: '100', pinned: true, editable: false }, 
				 	{ text: '서버명', datafield: 'vsvrName', width: '150', pinned: true, editable: false }, 
				 	{ text: 'VM 명', datafield: 'vmName', width: '150', pinned: true, editable: false }, 
					{ text: 'VM GUID', datafield: 'vmGuid', width: '270', editable: false },
					{ text: 'VM IP', datafield: 'vmIp', width: '120', editable: false },
					{ text: '파워상태', datafield: 'powerState', width: '100', editable: false },
					{ text: 'VM 버전', datafield: 'vmVer', width: '100', editable: false },
					{ text: 'Guest OS', datafield: 'guestOs', width: '150', editable: false },	
					{ text: 'CPU 수', datafield: 'vmCpuCnt', width: '80', cellsalign: 'right', editable: false },	
					{ text: 'CPU 사용 Hz', datafield: 'vmCpuHzUse', width: '100', cellsrenderer: HmGrid.unit1000HzRenderer, editable: false },	
					{ text: '소켓당 코어수', datafield: 'vmCpuPkgCoreCnt', width: '100', cellsalign: 'right', editable: false },	
					{ text: '총 메모리', datafield: 'vmMemTotal', width: '100', cellsrenderer: HmGrid.unit1024renderer, editable: false },	
					{ text: '여유 메모리', datafield: 'vmMemFree', width: '100', cellsrenderer: HmGrid.unit1024renderer, editable: false },	
					{ text: 'Guest 메모리 사용', datafield: 'vmMemGuestUse', width: '120', cellsrenderer: HmGrid.unit1024renderer, editable: false },	
					{ text: 'Storage 사용', datafield: 'vmStorageUse', width: '100', cellsrenderer: HmGrid.unit1024renderer, editable: false },	
					{ text: 'VM 파일경로', datafield: 'vmFilePath', width: '300', editable: false },
					{ text: '서비스', columngroup: 'profile', datafield: 'serviceProfileNo', displayfield: 'serviceProfileNm', width: 100, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: serviceProfileList, displayMember: 'profileName', valueMember: 'profileNo', selectedIndex: 0 });
						}
					},
					{ text: '프로세스', columngroup: 'profile', datafield: 'processProfileNo', displayfield: 'processProfileNm', width: 100, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: processProfileList, displayMember: 'profileName', valueMember: 'profileNo', selectedIndex: 0 });
						}
					},
					{ text: '이벤트로그', columngroup: 'profile', datafield: 'evtlogProfileNo', displayfield: 'evtlogProfileNm', width: 100, columntype: 'dropdownlist',
						createeditor: function(row, value, editor) {
							editor.jqxDropDownList({ source: evtlogProfileList, displayMember: 'profileName', valueMember: 'profileNo', selectedIndex: 0 });
						}
					},
					{ text: '도메인', datafield: 'vmDomain', width: 160 },
					{ text: '시스템번호', datafield: 'sysno', width: 80 }
				],
				columngroups: 
				[
				 	{ text: '프로파일', align: 'center', name: 'profile' }
				]
			});
			$vmGrid.on('rowselect', function(event) {
				_curVmRowdata = event.args.row;
				Main.clearMonitorGrid();
				Main.searchMonitorItem();
			});
			
			$tabs.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
					case TAB.SERVICE:
						HmGrid.create($serviceGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/popup/vsvrVmMonitorItemConf/getVsvrServiceCfgProfileList.do'
									},
									{
										formatData: function(data) {
											data.profileNo = _curVmRowdata == null? 0 : _curVmRowdata.serviceProfileNo;
											return data;
										}
									}
							),
							pageable: false,
							columns:
							[
							 	{ text: '서비스명', datafield: 'displayName' },
							 	{ text: '이벤트 등급', datafield: 'evtLevelStr', width: 150, cellsrenderer: HmGrid.evtLevelrenderer },
							 	{ text: '사용유무', datafield: 'useFlagStr', width: 150}
							]
						});
						break;
					case TAB.PROCESS:
						HmGrid.create($processGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/popup/vsvrVmMonitorItemConf/getVsvrProcessCfgProfileList.do'
									},
									{
										formatData: function(data) {
											data.profileNo = _curVmRowdata == null? 0 : _curVmRowdata.processProfileNo;
											return data;
										}
									}
							),
							pageable: false,
							columns:
							[
							 	{ text: '프로세스명', datafield: 'name', width: 200 },
							 	{ text: '사용자 프로세스명', datafield: 'userProcessName', width: 200 },
							 	{ text: '프로세스 명령어', datafield: 'commandLine', minwidth: 300 },
							 	{ text: '프로세스 개수', columngroup: 'limit', datafield: 'limitCnt', width: 100, cellsalign: 'right' },
							 	{ text: '이벤트 등급', columngroup: 'limit', datafield: 'evtLevelStr', width: 100, cellsrenderer: HmGrid.evtLevelrenderer },
							 	{ text: '사용유무', datafield: 'useFlagStr', width: 100}
							],
							columngroups:
							[
							 	{ text: '임계치 설정', align: 'center', name: 'limit' }
							]
						});
						break;
					case TAB.EVENT_LOG:
						HmGrid.create($evtlogGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/popup/vsvrVmMonitorItemConf/getVsvrEvtlogCfgProfileList.do'
									},
									{
										formatData: function(data) {
											data.profileNo = _curVmRowdata == null? 0 : _curVmRowdata.evtlogProfileNo;
											return data;
										}
									}
							),
							pageable: false,
							columns:
							[
								 { text: '이벤트 로그', datafield: 'logName', width: '20%' },
								 { text: '이벤트 ID', datafield: 'eventId', width: '10%' },
								 { text: '원본', datafield: 'source', width: '40%' },
								 { text: '이벤트 수준', datafield: 'entryTypeStr', width: '10%' },
								 { text: '이벤트 등급', datafield: 'evtLevelStr', width: '10%', cellsrenderer: HmGrid.evtLevelrenderer },
								 { text: '사용유무', datafield: 'useFlagStr', width: '10%'}
							 ]
						});
						break;
					}
				}
			})
			.on('selected', function(event) {
				Main.searchMonitorItem();
			});
		},
		
		/** init data */
		initData: function() {
			Server.get('/main/popup/vsvrVmMonitorItemConf/getVsvrProfileList.do', {
				data: { itemType: 'SERVICE' },
				success: function(result) {
					serviceProfileList = defaultValueList.concat(result);
				}
			});
			Server.get('/main/popup/vsvrVmMonitorItemConf/getVsvrProfileList.do', {
				data: { itemType: 'PROCESS' },
				success: function(result) {
					processProfileList = defaultValueList.concat(result);
				}
			});
			Server.get('/main/popup/vsvrVmMonitorItemConf/getVsvrProfileList.do', {
				data: { itemType: 'EVTLOG' },
				success: function(result) {
					evtlogProfileList = defaultValueList.concat(result);
				}
			});
			
			Main.searchVsvr();
		},
		
		/** 가상서버 조회 */
		searchVsvr: function() {
			HmGrid.updateBoundData($vsvrGrid, ctxPath + '/main/env/vsvrMgmt/getVsvrList.do');
		},
		
		/** VM 조회 */
		searchVm: function() {
			HmGrid.updateBoundData($vmGrid, ctxPath + '/main/env/vsvrVmMgmt/getVsvrVmList.do');
		},
		
		/** VM을 DEV10으로 등록 */
		regiVmToDev10: function() {
			var rows = HmGrid.getRowDataList($vmGrid);
			if(rows == null || rows.length == 0) {
				alert('선택된 VM이 없습니다.');
				return;
			}
			
			var _unregList = [];
			$.each(rows, function(idx, value) {
				if(value.dev10RegFlag != 1) _unregList.push(value);
			});
			if(_unregList.length == 0) {
				alert('선택된 VM은 이미 장비로 등록되어 있습니다.');
				return;
			}
			
			$.get(ctxPath + '/main/popup/env/pVsvrVmDevReg.do', function(result) {
				HmWindow.open($('#pwindow'), 'VM 장비 등록', result, 400, 450, 'pwindow_init', _unregList);
			});
		},

		/** VM 프로파일 설정 저장 */
		saveVmProfile: function() {

			HmGrid.endRowEdit($vmGrid);
			if(_editIds.length == 0) {
				alert('변경된 데이터가 없습니다.');
				return;
			}
            var _list = [];
            $.each(_editIds, function(idx, value) {
                _list.push($vmGrid.jqxGrid('getrowdatabyid', value));
            });
		
			Server.post('/main/env/vsvrVmMgmt/saveVsvrVmProfile.do', {
				data: { list: _list },
				success: function(result) {
					alert('저장되었습니다.');
					_editIds = [];
				}
			});
		},
		
		/** 감시 서비스 설정 팝업 */
		showMonitorServiceConfPopup: function() {
			HmUtil.createPopup(ctxPath + '/main/popup/env/pVsvrVmMonitorServiceConf.do', $('#hForm'), 'pVsvrVmMonitorServiceConf', 1000, 650);
		},
		
		/** 감시 프로세스 설정 팝업 */
		showMonitorProcessConfPopup: function() {
			HmUtil.createPopup(ctxPath + '/main/popup/env/pVsvrVmMonitorProcessConf.do', $('#hForm'), 'pVsvrVmMonitorProcessConf', 1000, 650);
		},
		
		/** 감시 이벤트로그 설정 팝업 */
		showMonitorEvtlogConfPopup: function() {
			HmUtil.createPopup(ctxPath + '/main/popup/env/pVsvrVmMonitorEvtlogConf.do', $('#hForm'), 'pVsvrVmMonitorEvtlogConf', 1050, 650);
		},
		
		/** VM 감시항목 Clear */
		clearMonitorGrid: function() {
			$serviceGrid.jqxGrid('clear');
			$processGrid.jqxGrid('clear');
			$evtlogGrid.jqxGrid('clear');
		},
		
		/** VM 감시항목 설정 */
		searchMonitorItem: function() {
			switch($tabs.val()) {
			case TAB.SERVICE:
				if(_curVmRowdata == null || _curVmRowdata.serviceProfileNo == 0) return;
				HmGrid.updateBoundData($serviceGrid);
				break;
			case TAB.PROCESS:
				if(_curVmRowdata == null || _curVmRowdata.processProfileNo == 0) return;
				HmGrid.updateBoundData($processGrid);
				break;
			case TAB.EVENT_LOG:
				if(_curVmRowdata == null || _curVmRowdata.evtlogProfileNo == 0) return;
				HmGrid.updateBoundData($evtlogGrid);
				break;
			}
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});