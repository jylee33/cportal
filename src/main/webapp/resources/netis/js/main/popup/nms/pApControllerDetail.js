var pMngNo, pGrpNo, pInitArea;
var $dtlTab;
var sAuth;
var pgSiteName;

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
	/** variable */
	initVariable: function() {
		pMngNo = $('#mngNo').val();
		pInitArea = $('#initArea').val();
		$dtlTab = $('#dtlTab');
		sAuth = $('#sAuth').val().toUpperCase();
		pgSiteName = $('#gSiteName').val();
	},

	/** add event */
	observe: function() {
		$('button').bind('click', function(event) { PMain.eventControl(event); });
	},

	/** event handler */
	eventControl: function(event) {
		var curTarget = event.currentTarget;
		switch(curTarget.id) {
			case 'btnSearch': this.searchSummary(); break;
			case 'pbtnClose': self.close(); break;
			case 'btnChgInfo': this.chgInfo(); break;
		}
	},

	/** init design */
	initDesign: function() {
		$('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_evt_action, #ctxmenu_dev_action, #ctxmenu_if_action, #ctxmenu_ap_action, #ctxmenu_itmon_action, #ctxmenu_syslog_action').jqxMenu({
			width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
		}).on('itemclick', function(event) {
			PMain.selectDevCtxmenu(event);
		});
		// 메인텝
		$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
			initTabContent: function(tab) {
				switch(tab) {
					case 0: // 요약
						break;
					case 1: // 성능
						pAp.initDesign();
						pAp.initData();
						break;
				}
			}
		}).on('selected', function(event) {
		});

		if(sAuth != 'SYSTEM' && sAuth != 'ADMIN') {
			// $('#btnChgInfo').hide();  // 권한에 따른 설정버튼 숨김
			// $dtlTab.jqxTabs('disableAt', 9); // 권한에 따른 설정탭 숨김
		}

	},

	/** init data */
	initData: function() {
		$('.p_content_layer').css('display', 'block');
	},

	/** 상세정보 */
	searchDtlInfo: function() {
	},

	/** ContextMenu */
	selectDevCtxmenu: function(event) {
		var tabIdx = $eventTabs.val();
		var $grid;
		// tab 에 따른 그리드 할당
		switch(tabIdx){
			case 0: // 현황
				$grid = $evtGrid;
				break;
			case 1: // 이력
				$grid = $evtHistGrid;
				break;
			case 2: // 조치이력
				$grid = $evtActionHistGrid;
				break;
			default: return;
		}


		var val = $(event.args)[0].id;
		if(val == null) return;
		switch(val) {
			case 'cm_evtAction':
				try {
					var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
					if(rowidxes === false) return;
					var _seqNos = [];
					$.each(rowidxes, function(idx, value) {
						_seqNos.push($grid.jqxGrid('getrowdata', value).seqNo);
					});
					var params = {
						seqNos: _seqNos
					};
					$.ajax({
						url: ctxPath + '/main/popup/nms/pErrAction.do',
						type: 'POST',
						data: JSON.stringify(params),
						contentType: 'application/json; charset=utf-8',
						success: function(result) {
							HmWindow.open($('#pwindow'), '장애조치', result, 660, 500);
						}
					});
				} catch(e) {}
				break;
			case 'cm_evtResume':
				try {
					var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
					var _seqNos = [];
					var _rowids = [];
					$.each(rowidxes, function(idx, value) {
						var tmp = $grid.jqxGrid('getrowdata', value);
						if(tmp.status == '일시정지') {
							_seqNos.push(tmp.seqNo);
							_rowids.push($grid.jqxGrid('getrowid', value));
						}
					});

					if(_seqNos.length == 0) {
						alert('선택한 데이터 중 일시정지 상태인 이벤트가 존재하지 않습니다.');
						return;
					}
					if(!confirm('선택한 이벤트를 재개 하시겠습니까?')) return;
					var params = {
						seqNos: _seqNos
					};
					Server.post('/main/popup/errAction/saveEvtResume.do', {
						data: params,
						success: function() {
							$.each(_rowids, function(idx, rowid) {
								$grid.jqxGrid('setcellvaluebyid', rowid, 'status', '진행중');
							});
							alert('선택한 이벤트가 재개되었습니다.');
						}
					});
				} catch(e) {}
				break;
			case 'cm_evtPause':
				try {
					var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
					if(!confirm('선택한 이벤트를 일시정지 하시겠습니까?')) return;
					var _seqNos = [];
					var _rowids = [];
					$.each(rowidxes, function(idx, value) {
						_seqNos.push($grid.jqxGrid('getrowdata', value).seqNo);
						_rowids.push($grid.jqxGrid('getrowid', value));
					});
					var params = {
						seqNos: _seqNos
					};
					Server.post('/main/popup/errAction/saveEvtPause.do', {
						data: params,
						success: function() {
							$.each(_rowids, function(idx, value) {
								$grid.jqxGrid('deleterow', value);
							});
							alert('선택한 이벤트가 정지되었습니다.');
						}
					});
				} catch(e) {}
				break;
			case 'cm_devPerfChart':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata =$grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp,
						mngNo: rowdata.mngNo
					};
					$.post(ctxPath + '/main/popup/nms/pDevPerfChart.do',
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + '] 장비성능그래프', result, 1100, 800);
						}
					);
				} catch(e) {}
				break;
			case 'cm_dev_rawPerfGraph': //장비성능그래프 (raw)
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp,
						mngNo: rowdata.mngNo,
						disDevName: rowdata.disDevName
					};
					// 그리드 엘리먼트 이름에 따라서 장비성능그래프 팝업의 검색 콤보 초기값 설정.
					// 그리드 엘리먼트 이름으로 판단이 안될 경우 default 값 cpu
					var _gridElementName = $grid.selector.toUpperCase();
					if(_gridElementName.indexOf('CPU') > 0){
						params.type = '1';
					}else if(_gridElementName.indexOf('MEM') > 0){
						params.type = '2';
					}else if(_gridElementName.indexOf('TEMP') > 0){
						params.type = '5';
					}else if(_gridElementName.indexOf('RESTIME') > 0){
						params.type = '6';
					}else if(_gridElementName.indexOf('SESSION') > 0){
						params.type = '11';
					}

					if (params !== undefined || params !== '') {
						// 18.07.06] 현대차 예외처리 추가
						var url = ctxPath + '/main/popup/nms/pDevRawPerfChart.do';
						if ($('#gSiteName').val() == 'HyundaiCar') {
							url = ctxPath + '/hyundaiCar/popup/nms/pDevRawPerfChart.do';
						}
						$.post(url,
							params,
							function(result) {
								HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 장비성능그래프', result, 900, 800);
							}
						);
					}
				} catch(e) {}


				break;
			case 'cm_dev_secUnitPerfGraph': //초단위 장비성능
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp,
						mngNo: rowdata.mngNo,
						disDevName: rowdata.disDevName
					};

					if (params !== undefined || params !== '') {
						$.post(ctxPath + '/main/popup/nms/pSecUnitDevPerf.do',
							params,
							function (result) {
								HmWindow.open($('#pwindow'), '[' + params.disDevName + '] 초단위 장비성능', result, 1100, 640);
							}
						);
					}
				} catch(e) {}

				break;
			case 'cm_if_rawPerfGraph': //회선성능그래프(raw)
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp,
						mngNo: rowdata.mngNo,
						ifIdx: rowdata.srcIdx,
						devName: rowdata.disDevName,
						ifName: rowdata.ifName,
						ifAlias: rowdata.ifAlias,
						lineWidth: rowdata.lineWidth
					};


					if (params !== undefined || params !== ''){
						// 18.07.06] 현대차 예외처리 추가
						var url = ctxPath + '/main/popup/nms/pIfRawPerfChart.do';
						if ($('#gSiteName').val() == 'HyundaiCar') {
							url = ctxPath + '/hyundaiCar/popup/nms/pIfRawPerfChart.do';
						}
						$.post(url,
							params,
							function(result) {
								HmWindow.open($('#pwindow'), '[' + params.devName + ' - ' + params.ifName + '(' + params.ifAlias + ')] 회선성능그래프',  result, 900, 800);
							}
						);
					}
				} catch(e) {}
				break;
			case 'cm_if_secUnitPerfGraph': //초단위 회선성능
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						mngNo: rowdata.mngNo,
						ifIdx: rowdata.srcIdx,
						disDevName: rowdata.disDevName,
						ifName: rowdata.ifName,
						ifAlias: rowdata.ifAlias
					};

					if (params !== undefined || params !== ''){
						$.post(ctxPath + '/main/popup/nms/pSecUnitIfPerf.do',
							params,
							function(result) {
								HmWindow.open($('#pwindow'), '[' + params.disDevName + ' - ' + params.ifName +'(' + params.ifAlias + ')] 초단위 회선성능', result, 1000, 610);
							}
						);
					}
				} catch(e) {}
				break;
			case 'cm_rtDevPerfChart':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						mngNo: rowdata.mngNo,
					};
					$.post(ctxPath + '/main/popup/nms/pRTimeDevPerfChart.do',
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ']  실시간 장비성능', result, 1000, 420);
						}
					);
				} catch(e) {}
				break;
			case 'cm_devJobReg':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						mngNo: rowdata.mngNo,
						devName: rowdata.devName
					};

					$.post(ctxPath +  '/main/popup/nms/pJobAdd.do',
						params,
						function(result) {
							HmWindow.openFit($('#pwindow'), rowdata.disDevName + ' 장비작업등록', result, 750, 660);
						}
					);
				} catch(e) {}
				break;
			case 'cm_ping':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						mngNo: rowdata.mngNo
					};
					HmUtil.showPingPopup(params);
				} catch(e) {}
				break;
			case 'cm_telnet':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					ActiveX.telnet(rowdata.devIp);
				} catch(e) {}
				break;
			case 'cm_tracert':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp
					};
					HmUtil.showTracertPopup(params);
				} catch(e) {}
				break;
			case 'cm_ssh':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					ActiveX.ssh(rowdata.devIp);
				} catch(e) {}
				break;
			case 'cm_http':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					ActiveX.http(rowdata.devIp);
				} catch(e) {}
				break;
			case 'cm_https':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					ActiveX.https(rowdata.devIp);
				} catch(e) {}
				break;
			case 'cm_ifJobReg':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						ifIdx: rowdata.srcIdx,
						ifName: rowdata.ifName,
						mngNo : rowdata.mngNo
					};
					$.ajax({
						url: ctxPath +  '/main/popup/nms/pJobAdd.do',
						type: 'POST',
						data: JSON.stringify(params),
						contentType: 'application/json; charset=utf-8',
						success: function(result){

                            var alias = (rowdata.ifAlias && rowdata.ifAlias !== "" && rowdata.ifAlias !== undefined) ? '(' + rowdata.ifAlias + ')' : "";


                            HmWindow.openFit($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + alias+'] 회선작업등록', result, 750, 660);
						}
					});
				} catch(e) {}
				break;
			case 'cm_ifPerfChart':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						devIp: rowdata.devIp,
						mngNo: rowdata.mngNo,
						ifIdx: rowdata.srcIdx,
						devName: rowdata.disDevName,
						ifName: rowdata.ifName
					};
					$.post(ctxPath + '/main/popup/nms/pIfPerfChart.do',
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName + '(' + rowdata.ifAlias + ')] 회선성능그래프', result, 1022, 685);
						}
					);
				} catch(e) {}
				break;
			case 'cm_rtIfPerfChart':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					var params = {
						mngNo: rowdata.mngNo,
						ifIdx: rowdata.srcIdx
					};
					$.post(ctxPath + '/main/popup/nms/pRTimeIfPerfChart.do',
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName +'(' + rowdata.ifAlias + ')] 실시간 회선성능', result, 1012, 440);
						}
					);
				} catch(e) {}
				break;
			case 'cm_apDtl':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var params = {
						apNo: $grid.jqxGrid('getrowdata', rowidx).mngNo
					};
					HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 660, params);
				} catch(e) {}
				break;
			case 'cm_syslog_detail': //Syslog 상세
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);
					if($.isBlank(rowdata.srcIdx) || rowdata.srcIdx == 0) {
						alert('SYSLOG정보가 존재하지 않습니다.');
						return;
					}
					Server.get("/main/nms/syslog/getSyslogInfo.do", {
						data: { seqNo: rowdata.srcIdx },
						success: function(resultData) {
							if(resultData == null) {
								alert('SYSLOG정보가 존재하지 않습니다.');
								return;
							}

							$.post(ctxPath + '/main/popup/nms/pSyslogDetail.do',
								resultData,
								function(result) {
									HmWindow.open($('#pwindow'), 'Syslog 상세', result, 800, 400);
								}
							);
						}
					})
				} catch(e) {}
				break;
			case 'cm_evt_stop': //이벤트 중지(SYSLOG삭제)
				try {
					var rowidxes = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
					var _seqNos = [];
					var _rowids = [];
					$.each(rowidxes, function(idx, value) {
						var tmp = $grid.jqxGrid('getrowdata', value);
						if(tmp.srcType == 'SYSLOG') {
							_seqNos.push(tmp.seqNo);
							_rowids.push(tmp.uid);
						}
					});
					if(_seqNos.length == 0) {
						alert('선택된 데이터 중 SYSLOG이벤트가 없습니다.');
						return;
					}
					if(!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
					var params = {
						seqNos: _seqNos
					};
					Server.post('/main/popup/errAction/saveEvtStop.do', {
						data: params,
						success: function() {
							$.each(_rowids, function(idx, value) {
								$grid.jqxGrid('deleterow', value);
							});
							alert('선택한 이벤트가 해제되었습니다.');
						}
					});
				} catch(e) {}
				break;
			case 'cm_filter':
				try {
					$grid.jqxGrid('beginupdate');
					if($grid.jqxGrid('filterable') === false) {
						$grid.jqxGrid({ filterable: true });
					}
					setTimeout(function() {
						$grid.jqxGrid({showfilterrow: !$grid.jqxGrid('showfilterrow')});
					}, 300);
					$grid.jqxGrid('endupdate');
				} catch(e) {}
				break;
			case 'cm_filterReset':
				try {
					$grid.jqxGrid('clearfilters');
				} catch(e) {}
				break;
			case 'cm_colsMgr':
				$.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
					function(result) {
						HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $grid);
					}
				);
				break;
			case 'cm_evtRevoke':
				try {
					var rowidx = HmGrid.getRowIdxes($grid, '선택된 데이터가 없습니다.');
					if(!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
					//				var _devIps = [];
					var _rowids = [];
					$.each(rowidx, function(idx, value) {
						//					_devIps.push($grid.jqxGrid('getrowdata', value).devIp);
						_rowids.push($grid.jqxGrid('getrowid', value));
					});
					var rowdata = $grid.jqxGrid('getrowdata', rowidx);

					var params = {
						devIp: rowdata.devIp
					};
					Server.post('/main/popup/errAction/saveStarCellEvtRevoke.do', {
						data: params,
						success: function() {
							$.each(_rowids, function(idx, value) {
								$gridv.jqxGrid('deleterow', value);
							});
							alert('선택한 이벤트가 해지되었습니다.');
						}
					});
				} catch(e) {}
				break;
		}
	},

	chgInfo: function(){


	}
};
