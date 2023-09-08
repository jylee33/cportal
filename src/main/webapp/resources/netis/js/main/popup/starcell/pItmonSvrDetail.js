var $mainTab;

var TAB_PERF = {
		CPU: 0,
		MEM: 1,
		DISK: 2,
		FSYS: 3,
		NIC: 4,
		DB: 5,
		SESS: 6
}

var PMain = {
		/** variable */
		initVariable: function() {
			$mainTab = $('#mainTab');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnSearch': this.search(); break;
			case 'pbtnEvtClose_cpst': this.closeRtEvt(); break;
			case 'pbtnSearch_evt': this.searchEvtHist(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			$mainTab.jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
						case 0: // 성능조회
							$('#perf_splitter').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', panels: [{size: '50%'}, {size: '50%'}] });
							$('#perfWin1').jqxExpander({ width: '100%', height: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
								initContent: function() {
									var settings = HmChart2.getBulletOptions();
									$.extend(settings, {
										width: '33%',
										title: 'CPU (%)',
										tooltipFormatFunction: function (value, target) {
							                return "<div>CPU : <strong>" + value + " %</strong></div>"
							            }
									});
									HmChart2.createBulletChart($('#perf_cpuChart'), settings);
									$.extend(settings, {
										width: '33%',
										title: 'MEMORY (%)',
										tooltipFormatFunction: function (value, target) {
											return "<div>MEMORY : <strong>" + value + " %</strong></div>"
							            }
									});
									HmChart2.createBulletChart($('#perf_memChart'), settings);
									$.extend(settings, {
										width: '33%',
										title: 'SWAP (%)',
										tooltipFormatFunction: function (value, target) {
											return "<div>SWAP : <strong>" + value + " %</strong></div>"
							            }
									});
									HmChart2.createBulletChart($('#perf_swapChart'), settings);
								}
							});
							
							$('#perfWin2').jqxExpander({ width: '100%', height: '100%', showArrow: false, toggleMode: 'none', theme: jqxTheme,
								initContent: function() {
									HmGrid.create($('#perf_fsysGrid'), {
										source: new $.jqx.dataAdapter(
												{ datatype: 'json' },
												{
													formatData: function(data) {
														$.extend(data, PMain.getCommParams());
														return data;
													}
												}
										),
										pageable: false,
										columns: 
										[
										 	{ text: '하드디스크', datafield: 'instance', width: '33%' },
										 	{ text: '사용률 (%)', datafield: 'usedPct', width: '33%', cellsalign: 'right' },
										 	{ text: '총 디스크량', datafield: 'totalMb', width: '34%', cellsrenderer: HmGrid.unit1024renderer }
										]
									}, CtxMenu.COMM, "perf_fsys");
								}
							});
							
							$('#perfTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
								initTabContent: function(tab) {
									switch(tab) {
									case TAB_PERF.CPU: 
										PMain.createPrefEvtGrid($('#perf_cpuEvtGrid'), 'CPU');
										break;
									case TAB_PERF.MEM: 
										PMain.createPrefEvtGrid($('#perf_memEvtGrid'), 'Memory');
										break;
									case TAB_PERF.DISK:
										PMain.createPrefEvtGrid($('#perf_diskEvtGrid'), 'Disk');
										break;
									case TAB_PERF.FSYS: 
										PMain.createPrefEvtGrid($('#perf_fsysEvtGrid'), 'Filesystem');
										break;
									case TAB_PERF.NIC: 
										PMain.createPrefEvtGrid($('#perf_nicEvtGrid'), 'Network');
										break;
									case TAB_PERF.DB: 
										PMain.createPrefEvtGrid($('#perf_dbEvtGrid'), 'DB');
										break;
									case TAB_PERF.SESS: 
										PMain.createPrefEvtGrid($('#perf_sessEvtGrid'), 'Session');
										break;
									}
								}
							});
						break;
						case 1: // 구성정보
							HmGrid.create($('#cpst_evtGrid'), {
								source: new $.jqx.dataAdapter(
										{ 
											datatype: 'json',
											url: ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtHistList.do'
										},
										{
											formatData: function(data) {
												$.extend(data, PMain.getCommParams());
												data.searchType = 'RT';
												return data;
											}
										}
								),
								showtoolbar: true,
							    rendertoolbar: function(toolbar) {
							    	HmGrid.titlerenderer(toolbar, '실시간 이벤트');
							    },
							    selectionmode: 'multiplerowsextended',
								columns: 
								[
									 { text: '발생일시', datafield: 'ymdhms', width: 150 },
									 { text: '그룹', datafield: 'grpName', width: 150 },
									 { text: '장애종류', datafield: 'srcType', cellsalign: 'center', width: 80 },
									 { text: '장애대상', datafield: 'invenName', width: 200 },
									 { text: '이벤트명', datafield: 'eventClass', width: 200 },
									 { text: '장애등급', datafield: 'eventLevel', width: 80, cellsrenderer: HmGrid.evtLevelrenderer },
									 { text: '지속시간', datafield: 'eventSec', width: 100, cellsrenderer: HmGrid.cTimerenderer },
									 { text: '장애상태', datafield: 'status', cellsalign: 'center', width: 80 },
									 { text: '종료일시', datafield: 'endYmdhms', width: 150 },
									 { text: '이벤트 설명', datafield: 'eventMsg', width: 250 }
								 ]
							}, CtxMenu.COMM, "cpst_evt");
							break;
						case 2: // 설정내역조회
							$('#conf_splitter1').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', panels: [{size: '33%'}, {size: '67%'}] });
							$('#conf_splitter2').jqxSplitter({ width: '100%', height: '100%', theme: jqxTheme, orientation: 'horizontal', panels: [{size: '50%'}, {size: '50%'}] });
							HmGrid.create($('#conf_monitorGrid'), {
								source: new $.jqx.dataAdapter(
										{ 
											datatype: 'json',
											url: ctxPath + '/main/popup/itmonSvrDetail/getItmonMonitorConfList.do'
										},
										{
											formatData: function(data) {
												$.extend(data, PMain.getCommParams());
												return data;
											}
										}
								),
								showtoolbar: true,
							    rendertoolbar: function(toolbar) {
							    	HmGrid.titlerenderer(toolbar, '모니터링 설정내역');
							    },
								pageable: false,
								columns: 
								[
								 	{ text: '모니터링', datafield: 'eventGroup', width: 150 },
								 	{ text: '항목명', datafield: 'eventName' },
								 	{ text: '단위', datafield: 'eventUnit', width: 80 },
								 	{ text: '인스턴스', datafield: 'instance', width: 100 },
								 	{ text: '모니터링주기', datafield: 'eventTime', width: 100 },
								 	{ text: '장애', datafield: 'critical', width: 100 },
								 	{ text: '경보', datafield: 'minor', width: 100 },
								 	{ text: '알람', datafield: 'warning', width: 100 }
								]
							}, CtxMenu.COMM, "conf_mon");
							
							HmGrid.create($('#conf_urlGrid'), {
								source: new $.jqx.dataAdapter(
										{ 
											datatype: 'json', 
											url: ctxPath + '/main/popup/itmonSvrDetail/getItmonUrlConfList.do'
										},
										{
											formatData: function(data) {
												$.extend(data, PMain.getCommParams());
												return data;
											}
										}
								),
								showtoolbar: true,
							    rendertoolbar: function(toolbar) {
							    	HmGrid.titlerenderer(toolbar, 'URL 설정내역');
							    },
								pageable: false,
								columns: 
									[
									 { text: '모니터링그룹', datafield: 'eventGroup', width: 150 },
									 { text: 'URL주소', datafield: 'instance' },
									 { text: '모니터링주기', datafield: 'eventTime', width: 100 },
									 { text: '장애', datafield: 'critical', width: 100 },
									 { text: '경보', datafield: 'minor', width: 100 },
									 { text: '알람', datafield: 'warning', width: 100 }
									 ]
							}, CtxMenu.COMM, "conf_url");
							
							HmGrid.create($('#conf_logGrid'), {
								source: new $.jqx.dataAdapter(
										{ 
											datatype: 'json',
											url: ctxPath + '/main/popup/itmonSvrDetail/getItmonLogConfList.do'
										},
										{
											formatData: function(data) {
												$.extend(data, PMain.getCommParams());
												return data;
											}
										}
								),
								showtoolbar: true,
							    rendertoolbar: function(toolbar) {
							    	HmGrid.titlerenderer(toolbar, 'LOG 설정내역');
							    },
								pageable: false,
								columns: 
									[
									 { text: '모니터링그룹', datafield: 'eventGroup', width: 150 },
									 { text: 'URL주소', datafield: 'instance' },
									 { text: '모니터링주기', datafield: 'eventTime', width: 100 },
									 { text: '장애', datafield: 'critical', width: 100 },
									 { text: '경보', datafield: 'minor', width: 100 },
									 { text: '알람', datafield: 'warning', width: 100 }
									 ]
							}, CtxMenu.COMM, "conf_log");
							break;
						case 3: // 이벤트발생이력
							Master.createPeriodCondition($('#evt_cbPeriod'), $('#evt_date1'), $('#evt_date2'));
							
							HmGrid.create($('#evt_evtGrid'), {
								source: new $.jqx.dataAdapter(
										{ 
											datatype: 'json',
											url: ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtHistList.do'
										},
										{
											formatData: function(data) {
												$.extend(data, PMain.getCommParams());
												data.date1 = HmDate.getDateStr($('#evt_date1'));
												data.time1 = HmDate.getTimeStr($('#evt_date1'));
												data.date2 = HmDate.getDateStr($('#evt_date2'));
												data.time2 = HmDate.getTimeStr($('#evt_date2'));
												data.searchType = 'HIST';
												return data;
											}
										}
								),
								columns: 
								[
									 { text: '발생일시', datafield: 'ymdhms', width: 150 },
									 { text: '그룹', datafield: 'grpName', width: 150 },
									 { text: '장애종류', datafield: 'srcType', cellsalign: 'center', width: 80 },
									 { text: '장애대상', datafield: 'invenName', width: 200 },
									 { text: '이벤트명', datafield: 'eventClass', width: 200 },
									 { text: '장애등급', datafield: 'eventLevel', width: 80, cellsrenderer: HmGrid.evtLevelrenderer },
									 { text: '지속시간', datafield: 'eventSec', width: 100, cellsrenderer: HmGrid.cTimerenderer },
									 { text: '장애상태', datafield: 'status', cellsalign: 'center', width: 80 },
									 { text: '종료일시', datafield: 'endYmdhms', width: 150 },
									 { text: '이벤트 설명', datafield: 'eventMsg', width: 250 }
								 ]
							}, CtxMenu.COMM, "evt_hist");
							break;
					}
				}
			})
			.on('selected', PMain.search);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
		/** 성능정보 > 하단 이벤트 그리드 생성 */
		createPrefEvtGrid: function($grid, eventGroup) {
			HmGrid.create($grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do'
						},
						{
							formatData: function(data) {
								$.extend(data, PMain.getCommParams());
								data.eventGroup = eventGroup;
								return data;
							}
						}
				),
				pageable: false,
				columns:
				[
					{ text: 'EVENT ID', datafield: 'eventId', width: 80, hidden: true },
					{ text: 'DATASET ID', datafield: 'datasetId', width: 80, hidden: true },
					{ text: '이벤트 그룹', datafield: 'eventGroup', width: 130 },
					{ text: '이벤트명', datafield: 'eventName', width: 200 },
					{ text: '인스턴스', datafield: 'instance', width: 100 },
					{ text: '값', datafield: 'value', width: 100, cellsalign: 'right' },
					{ text: '단위', datafield: 'eventUnit', width: 100 },
					{ text: '설명', datafield: 'description', minwidth: 200 }
				]
			}, CtxMenu.COMM, eventGroup);
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			return {
				invenId: $('#pInvenId').val(),
				agentIp: $('#pAgentIp').val()
			}
		},
		
		/** 조회 */
		search: function() {
			switch($mainTab.val()) {
			case 0: PMain.searchPerf(); break;
			case 1: PMain.searchCpst(); break;
			case 2: PMain.searchConf(); break;
			case 3: PMain.searchEvtHist(); break;
			}
		},
		
		/** 성능 조회 */
		searchPerf: function() {
			var params = PMain.getCommParams();
			// 서버성능
			Server.post('/main/popup/itmonSvrDetail/getItmonSystemInfo.do', {
				data: params,
				success: function(result) {
					if(result != null) {
						$('#perf_cpuChart').val(result.cpu);
						$('#perf_memChart').val(result.memory);
						$('#perf_swapChart').val(result.swap);
					}
				}
			});
			// 파일시스템 사용률
			HmGrid.updateBoundData($('#perf_fsysGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonFsysList.do');
			// 이벤트
			try {
				HmGrid.updateBoundData($('#perf_cpuEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_memEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_diskEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_fsysEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_nicEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_dbEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
				HmGrid.updateBoundData($('#perf_sessEvtGrid'), ctxPath + '/main/popup/itmonSvrDetail/getItmonEvtList.do');
			} catch(e) {}
		},
		
		/** 구성정보 */
		searchCpst: function() {
			var params = PMain.getCommParams();
			Server.post('/main/popup/itmonSvrDetail/getItmonSvrCpstInfo.do', {
				data: params,
				success: function(result) {
					if(result == null) return;
					$.each(result, function(key, value) {
						try {
							$('#p_' + key).val(value);
						}catch(e) {}
					});
				}
			});
			
			HmGrid.updateBoundData($('#cpst_evtGrid'));
		},
		
		/** 설정내역조회 */
		searchConf: function() {
			HmGrid.updateBoundData($('#conf_monitorGrid'));
			HmGrid.updateBoundData($('#conf_urlGrid'));
			HmGrid.updateBoundData($('#conf_logGrid'));
		},
		
		/** 이벤트발생이력 */
		searchEvtHist: function() {
			HmGrid.updateBoundData($('#evt_evtGrid'));
		},
		
		/** 실시간 이벤트 종료 */
		closeRtEvt: function() {
			var rowIdxes = HmGrid.getRowIdxes($('#cpst_evtGrid'), '선택된 이벤트가 없습니다.');
			if(rowIdxes == null || rowIdxes.length == 0) return;
			var _seqNos = [];
			$.each(rowIdxes, function(idx, rowIdx) {
				var tmp = HmGrid.getRowData($('#cpst_evtGrid'), rowIdx);
				_seqNos.push(tmp.seqNo);
			});
			
			Server.post('/main/popup/itmonSvrDetail/saveItmonRtEvtClose.do', {
				data: { seqNos: _seqNos },
				success: function(result) {
					HmGrid.updateBoundData($('#cpst_evtGrid'));
					alert(result);
				}
			});
		}

};


$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});