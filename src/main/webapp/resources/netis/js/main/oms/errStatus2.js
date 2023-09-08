var $evtGrid;
var timer;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$evtGrid = $('#evtGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
		$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnSearch":	this.searchErr();	break;
		case 'btnSyslogDel': this.delSyslogAll(); break;
		case "btnExcel": this.exportExcel(); break;
		}
	},

	/** keyup event handler */
	keyupEventControl: function(event) {
		if(event.keyCode == 13) {
			Main.searchErr();
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		Master.createGrpTab(Main.selectTree);

		$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
		$('#prgrsBar').on('complete', function(event) {
			Main.searchErr();
			$(this).val(0);
		});

		$('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: [
			         { label: 'NONE', value: 0 },
			         { label: '30초', value: 30 },
			         { label: '20초', value: 20 },
			         { label: '10초', value: 10 },
			         { label: '5초', value: 5 }
			         ],
	        displayMember: 'label', valueMember: 'value', selectedIndex: 1
		})
		.on('change', function() {
			Main.chgRefreshCycle();
		});
		HmGrid.create($evtGrid, {
			source : new $.jqx.dataAdapter(
					{
						datatype : 'json'
					},
					{
						formatData : function(data) {
							$.extend(data, Main.getCommParams());
							return data;
						}
					}
			),
			selectionmode: 'multiplerowsextended',
			columns : [
                { text : '장애등급', datafield : 'evtLevelStr', width : 70, filtertype: 'checkedlist', cellsrenderer : HmGrid.evtLevelrenderer, cellsalign: 'center',
				  createfilterwidget: function (column, columnElement, widget) {
                      widget.jqxDropDownList({
                          renderer: HmGrid.evtLevelFilterRenderer
                      });
                  }
				},
				{ text : '발생일시', datafield : 'ymdhms', cellsalign: 'center', width : 140 },
				{ text : '그룹', datafield : 'grpName', width : 100 },
				{ text : '장애종류', datafield : 'srcTypeStr', width: 70, cellsalign: 'center' },
				{ text : '장애대상', datafield : 'srcInfo', minwidth : 405 },
				{ text : '이벤트명', datafield : 'evtName', width : 140 },
				{ text : '지속시간', datafield : 'sumSec', width : 150, cellsrenderer : HmGrid.cTimerenderer },
				{ text : '장애상태', datafield : 'status', width: 70, cellsalign: 'center' },
				{ text : '진행상태', datafield : 'progressState', width: 70, cellsalign: 'center' },
				{ text : '조치내역', datafield : 'receiptMemo', width: 150 },
				{ text : '이벤트설명', datafield : 'limitDesc', width: 250 }
			]
		}, CtxMenu.NONE);

		$evtGrid.on('contextmenu', function() { return false; })
			.on('rowclick', function(event) {
				if(event.args.rightclick) {
					$('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_svr').jqxMenu('close');
					var targetMenu = null;
					$evtGrid.jqxGrid('selectrow', event.args.rowindex);
					var idxes = $evtGrid.jqxGrid('getselectedrowindexes');
					// 선택 Row 개수가 1이상일때
					if(idxes.length > 1) {
						var _list = [];
						$.each(idxes, function(idx, value) {
							var tmp = $evtGrid.jqxGrid('getrowdata', value);
							if(tmp.srcType == 'ITMON') return;
							_list.push(tmp);
						});

						if(_list.length > 1) targetMenu = $('#ctxmenu_evt');
						else if(_list.length == 1) {	// 우클릭메뉴가 제공되는 이벤트가 1개일때
							switch(_list[0].srcType) {
							case 'DEV': targetMenu = $('#ctxmenu_dev'); break;
								case 'SVR':targetMenu = $('#ctxmenu_svr'); break;
							case 'IF': targetMenu = $('#ctxmenu_if'); break;
							case 'AP': targetMenu = $('#ctxmenu_ap'); break;
							case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
							case 'SYSLOG': targetMenu = $('#ctxmenu_syslog'); break;
							default: targetMenu = $('#ctxmenu_evt'); break;
							}
						}
						else {
							targetMenu = $('#ctxmenu_itmon');
						}
					}
					else if(idxes.length == 1) { // 선택 Row가 1개일때
						var rowdata = $evtGrid.jqxGrid('getrowdata', event.args.rowindex);
						switch(rowdata.srcType) {
						case 'DEV': targetMenu = $('#ctxmenu_dev'); break;
                            case 'SVR':targetMenu = $('#ctxmenu_svr'); break;
						case 'IF': targetMenu = $('#ctxmenu_if'); break;
						case 'AP': targetMenu = $('#ctxmenu_ap'); break;
						case 'ITMON': targetMenu = $('#ctxmenu_itmon'); break;
						case 'SYSLOG': targetMenu = $('#ctxmenu_syslog'); break;
						default: targetMenu = $('#ctxmenu_evt'); break;
						}
					}
					
					if($('#gSiteName').val() == 'Samsung'){
						$('#cm_evtTicket').css('display', 'none');
					}else{
						$('#cm_evtTicket').css('display', 'block');
					}

					if(targetMenu != null) {
	                    var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
	                    var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
	                    if($(window).height() < (event.args.originalEvent.clientY + targetMenu.height() + 10)) {
	                    	posY = $(window).height() - (targetMenu.height() + 10);
	                    }
	                    targetMenu.jqxMenu('open', posX, posY);
					}
                    return false;
				}
			});
		$('#ctxmenu_evt, #ctxmenu_dev, #ctxmenu_if, #ctxmenu_ap, #ctxmenu_itmon, #ctxmenu_syslog, #ctxmenu_svr').jqxMenu({
				width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
			}).on('itemclick', function(event) {
				Main.selectDevCtxmenu(event);
			});

		Main.chgRefreshCycle();
		$('div.jqx-progressbar > div:last').css('left', '50px'); // jqwidgets 버전업 되면서 스타일이 깨지는 현상이 발생하여 강제 조정 (showText)
	},

	/** init data */
	initData : function() {
		this.searchErr();
	},

	refresh: function() {
		this.searchErr();
	},

	/** 공통 파라미터 */
	getCommParams: function() {
		var params = Master.getGrpTabParams();
		$.extend(params, {
			sIp: $('#sIp').val(),
			sDevName: $('#sDevName').val()
		});
		return params;
	},

	/** 그룹트리 선택이벤트 */
	selectTree: function() {
		Main.searchErr();
	},

	/** 조회 */
	searchErr : function() {
		HmGrid.updateBoundData($evtGrid, ctxPath + '/main/oms/errStatus/getErrStatusList.do');
	},

	/** 새로고침 주기 변경 */
	chgRefreshCycle : function() {
		var cycle = $('#refreshCycleCb').val();
		if (timer != null)
			clearInterval(timer);
		if (cycle > 0) {
			timer = setInterval(function() {
				var curVal = $('#prgrsBar').val();
				if (curVal < 100)
					curVal += 100 / cycle;
				$('#prgrsBar').val(curVal);
			}, 1000);
		} else {
			$('#prgrsBar').val(0);
		}
	},

	/** Syslog 전체삭제 */
	delSyslogAll: function() {
		Server.post('/main/popup/errAction/saveSyslogEvtAllStop.do', {
			data: Main.getCommParams(),
			success: function(result) {
				if(result > 0) {
					alert(result + '건의 Syslog이벤트가 해제되었습니다.');
					$('#prgrsBar').val(100);

				}
				else {
					alert('해제할 Syslog이벤트가 없습니다.');

				}
			}
		});
	},

	/** export Excel */
	exportExcel: function() {
		var params = Main.getCommParams();
		HmUtil.exportExcel(ctxPath + '/main/oms/errStatus/export.do', params);
	},

	/** ContextMenu */
	selectDevCtxmenu: function(event) {
		var val = $(event.args)[0].id;
		if(val == null) return;
		switch(val) {
		case 'cm_evtAction':
			try {
				var rowidxes = HmGrid.getRowIdxes($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidxes === false) return;
				var _seqNos = [];
				$.each(rowidxes, function(idx, value) {
					_seqNos.push($evtGrid.jqxGrid('getrowdata', value).seqNo);
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
		case 'cm_evtTicket':
			try {
				var rowidxes = HmGrid.getRowIdxes($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidxes === false) return;
				var _seqNos = [];
				var _tickets = [];
				$.each(rowidxes, function(idx, value) {
					_seqNos.push($evtGrid.jqxGrid('getrowdata', value).seqNo);
					_tickets.push($evtGrid.jqxGrid('getrowdata', value));
				});
				var params = {
						seqNos: _seqNos,
						tickets: _tickets,
						errYn: 'Y'
				};
				$.ajax({
					url: ctxPath + '/main/popup/nms/pEvtTicketAdd.do',
					type: 'POST',
					data: JSON.stringify(params),
					contentType: 'application/json; charset=utf-8',
					success: function(result) {
						HmWindow.openFit($('#pwindow'), '이벤트 티켓 발생', result, 660, 500, 'pwindow_init', params);
					}
				});
			} catch(e) {}
			break;
		case 'cm_evtPause':
			try {
				var rowidxes = HmGrid.getRowIdxes($evtGrid, '선택된 데이터가 없습니다.');
				if(!confirm('선택한 이벤트를 일시정지 하시겠습니까?')) return;
				var _seqNos = [];
				var _rowids = [];
				$.each(rowidxes, function(idx, value) {
					_seqNos.push($evtGrid.jqxGrid('getrowdata', value).seqNo);
					_rowids.push($evtGrid.jqxGrid('getrowid', value));
				});
				var params = {
						seqNos: _seqNos
				};
				Server.post('/main/popup/errAction/saveEvtPause.do', {
					data: params,
					success: function() {
						$.each(_rowids, function(idx, value) {
							$evtGrid.jqxGrid('deleterow', value);
						});
						alert('선택한 이벤트가 정지되었습니다.');
					}
				});
			} catch(e) {}
			break;
		case 'cm_devDtl':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var params = {
						mngNo: $evtGrid.jqxGrid('getrowdata', rowidx).mngNo
				};
				HmUtil.createPopup('/main/popup/nms/pDevDetail.do', $('#hForm'), 'pDevDetail', 1400, 700, params);
			} catch(e) {}
			break;
	case 'cm_svrDetail':
                try {
                    var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
                    if(rowidx === false) return;
                    var params = {
                        mngNo: $evtGrid.jqxGrid('getrowdata', rowidx).mngNo
                    };
                    HmUtil.createPopup('/main/popup/sms/pSvrDetail.do', $('#hForm'), 'pSvrDetail', 1300, 700, params);
                } catch(e) {}
                break;
		case 'cm_devPerfChart':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata =$evtGrid.jqxGrid('getrowdata', rowidx);
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
		case 'cm_rtDevPerfChart':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
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
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				var params11 = {
						mngNo: rowdata.mngNo,
						devName: rowdata.devName
				};

				$.post(
					ctxPath +  '/main/popup/nms/pJobAdd.do',
					params11,
					function(result) {
						HmWindow.openFit($('#pwindow'), rowdata.disDevName + ' 장비작업등록', result, 750, 660);
					}
				);
			} catch(e) {}
			break;
		case 'cm_ping':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				var params = {
						mngNo: rowdata.mngNo
				};
				HmUtil.showPingPopup(params);
			} catch(e) {}
			break;
		case 'cm_telnet':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				ActiveX.telnet(rowdata.devIp);
			} catch(e) {}
			break;
		case 'cm_tracert':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				var params = {
					mngNo: rowdata.mngNo
				};
				HmUtil.showTracertPopup(params);
			} catch(e) {}
			break;
		case 'cm_ssh':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				ActiveX.ssh(rowdata.devIp);
			} catch(e) {}
			break;
		case 'cm_http':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				ActiveX.http(rowdata.devIp);
			} catch(e) {}
			break;
		case 'cm_https':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
				ActiveX.https(rowdata.devIp);
			} catch(e) {}
			break;
		case 'cm_ifJobReg':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
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
                        HmWindow.openFit($('#pwindow'), '[' + rowdata.disDevName + ' - ' + rowdata.ifName +  alias +'] 회선작업등록', result, 750, 660);

					}
				});
			} catch(e) {}
			break;
		case 'cm_ifPerfChart':
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
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
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
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
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var params = {
						apNo: $evtGrid.jqxGrid('getrowdata', rowidx).mngNo
				};
				HmUtil.createPopup('/main/popup/nms/pApDetail.do', $('#hForm'), 'pApDetail', 1200, 660, params);
			} catch(e) {}
			break;
		case 'cm_syslog_detail': //Syslog 상세
			try {
				var rowidx = HmGrid.getRowIdx($evtGrid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);
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
				var rowidxes = HmGrid.getRowIdxes($evtGrid, '선택된 데이터가 없습니다.');
				var _seqNos = [];
				var _rowids = [];
				$.each(rowidxes, function(idx, value) {
					var tmp = $evtGrid.jqxGrid('getrowdata', value);
					if(tmp.srcType == 'SYSLOG') {
						_seqNos.push(tmp.seqNo);
						_rowids.push(tmp.uid);
					}
				});
				if(_seqNos.length == 0) {
					alert('선택된 데이터 중 SYSLOG이벤트가 없습니다.');
					return;
				}
				if(!confirm('선택한 이벤트를 삭제 하시겠습니까?')) return;
				var params = {
						seqNos: _seqNos
				};
				Server.post('/main/popup/errAction/saveEvtStop.do', {
					data: params,
					success: function() {
						$.each(_rowids, function(idx, value) {
							$evtGrid.jqxGrid('deleterow', value);
						});
						alert('선택한 이벤트가 해제되었습니다.');
					}
				});
			} catch(e) {}
			break;
		case 'cm_filter':
			try {
				$evtGrid.jqxGrid('beginupdate');
				if($evtGrid.jqxGrid('filterable') === false) {
					$evtGrid.jqxGrid({ filterable: true });
				}
                setTimeout(function() {
                    $evtGrid.jqxGrid({showfilterrow: !$evtGrid.jqxGrid('showfilterrow')});
                }, 300);
				$evtGrid.jqxGrid('endupdate');
			} catch(e) {}
			break;
		case 'cm_filterReset':
			try {
				$evtGrid.jqxGrid('clearfilters');
			} catch(e) {}
			break;
		case 'cm_colsMgr':
			$.post(ctxPath + '/main/popup/comm/pGridColsMgr.do',
					function(result) {
						HmWindow.open($('#pwindow'), '컬럼 관리', result, 300, 400, 'pwindow_init', $evtGrid);
					}
			);
			break;
		case 'cm_evtRevoke':
			try {
				var rowidx = HmGrid.getRowIdxes($evtGrid, '선택된 데이터가 없습니다.');
				if(!confirm('선택한 이벤트를 해제 하시겠습니까?')) return;
//				var _devIps = [];
				var _rowids = [];
				$.each(rowidx, function(idx, value) {
//					_devIps.push($evtGrid.jqxGrid('getrowdata', value).devIp);
					_rowids.push($evtGrid.jqxGrid('getrowid', value));
				});
				var rowdata = $evtGrid.jqxGrid('getrowdata', rowidx);

				var params = {
						devIp: rowdata.devIp
				};
				Server.post('/main/popup/errAction/saveStarCellEvtRevoke.do', {
					data: params,
					success: function() {
						$.each(_rowids, function(idx, value) {
							$evtGrid.jqxGrid('deleterow', value);
						});
						alert('선택한 이벤트가 해지되었습니다.');
					}
				});
			} catch(e) {}
			break;
		}
	}
};

function refresh() {
	Main.searchErr();
}