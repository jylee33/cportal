var $allIpGrid, $srcIpGrid, $dstIpGrid, $allCclassGrid, $srcCclassGrid, $dstCclassGrid, $matrixGrid, $matrixPortGrid;
var timer;

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});

var PMain = {
		/** variable */
		initVariable: function() {
			$allIpGrid = $('#allIpGrid'), $srcIpGrid = $('#srcIpGrid'), $dstIpGrid = $('#dstIpGrid');
			$allCclassGrid = $('#allCclassGrid'), $srcCclassGrid = $('#srcCclassGrid'), $dstCclassGrid = $('#dstCclassGrid');
			$matrixGrid = $('#matrixGrid'), $matrixPortGrid = $('#matrixPortGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnExcel': this.exportExcel(); break;
			case 'pbtnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
//			// 10:15선택시 10:15~10:25선택! 현시점 +10
//			var pYmdhms = $('#pYmdhms').val();
//			var fromDate = new Date(pYmdhms.substr(0, 4), parseInt(pYmdhms.substr(4, 2)) -1, pYmdhms.substr(6, 2), pYmdhms.substr(8, 2), pYmdhms.substr(10, 2), pYmdhms.substr(12));
//			var toDate = new Date(fromDate.getTime());
//			toDate.setMinutes(toDate.getMinutes() + 10);
			
			var pYmdhms = $('#pYmdhms').val();
			var toDate = new Date(pYmdhms.substr(0, 4), parseInt(pYmdhms.substr(4, 2)) -1, pYmdhms.substr(6, 2), pYmdhms.substr(8, 2), pYmdhms.substr(10, 2), pYmdhms.substr(12));
			var fromDate = new Date(toDate.getTime());
			var tableCnt = $('#pTableCnt').val() || '1';
			if(tableCnt == '2') { // from hourChart
				// 10:00선택시 09:00 ~10:00선택! -1시~선택시점
				fromDate.setHours(toDate.getHours() - 1);
			}
			else { // from minuteChart
				// 10:15선택시 10:10~10:15선택! -5분~선택시점
				fromDate.setMinutes(toDate.getMinutes() - 5);
			}
			
			
			// 6일 이전 비활성화!
			var minDate = new Date();
			minDate.setDate(minDate.getDate() - 7);
			
			$('#date1').jqxDateTimeInput({ width: '120px', height: '21px', formatString: 'yyyy-MM-dd HH', theme: jqxTheme, min: minDate });
			$('#mm1, #mm2').jqxDateTimeInput({ width: '40px', height: '21px', formatString: 'mm', showCalendarButton: false, theme: jqxTheme });
			$('#date1').jqxDateTimeInput('setDate', fromDate);
			$('#mm1').jqxDateTimeInput('setDate', fromDate);
			$('#mm2').jqxDateTimeInput('setDate', toDate);
			
			$('#cbInout').jqxDropDownList({ width: 60, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 0,
				source: [ 'IN', 'OUT', 'TOTAL' ]
			});
			
			// 실시간 체크박스
			$('#p_ckRtTms').jqxCheckBox({ width: 80, height: 21, theme: jqxTheme })
				.on('change', function(event) {
					var checked = event.args.checked;
					$('#date1, #mm1, #mm2').jqxDateTimeInput({ disabled: checked });
				});
			
			$('#mainTab').jqxTabs({ width: '99.8%', height: '99%', theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
					case 0: //IP 
						$('#ipTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
							initTabContent: function(iptab) {
								switch(iptab) {
								case 0: PMain.createGrid($allIpGrid); break;
								case 1: PMain.createGrid($srcIpGrid); break;
								case 2: PMain.createGrid($dstIpGrid); break;
								}
							}
						});
						break;
					case 1: //C클래스
						$('#cclassTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
							initTabContent: function(cclasstab) {
								switch(cclasstab) {
								case 0: PMain.createGrid($allCclassGrid); break;
								case 1: PMain.createGrid($srcCclassGrid); break;
								case 2: PMain.createGrid($dstCclassGrid); break;
								}
							}
						});
						break;
					case 2: //Matrix
						PMain.createGrid($matrixGrid);
						break;
					case 3: //MatrixPort
						PMain.createGrid($matrixPortGrid);
						break;
					}
				}
			});			
		},
		
		/** 그리드 생성 */
		createGrid: function($grid) {
			var _columns = [], _ctxmenuType = null;
			switch($grid.attr('id')) {
			case 'allIpGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
				_ctxmenuType = 'allIp';
				break;
			case 'srcIpGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
				_ctxmenuType = 'srcIp';
				break;
			case 'dstIpGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
				_ctxmenuType = 'dstIp';
				break;
			case 'allCclassGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
				_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true }); 
				_columns.push({ text: 'NAME', datafield: 'subName', minwidth: 130, pinned: true });
				_ctxmenuType = 'allCclass';
				break;
			case 'srcCclassGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
				_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true }); 
				_columns.push({ text: 'NAME', datafield: 'subName', minwidth: 130, pinned: true });
				_ctxmenuType = 'srcCclass';
				break;
			case 'dstCclassGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
				_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true }); 
				_columns.push({ text: 'NAME', datafield: 'subName', minwidth: 130, pinned: true });
				_ctxmenuType = 'dstCclass';
				break;
			case 'matrixGrid':
				_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
				_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
				_ctxmenuType = 'matrix';
				break;
			case 'matrixPortGrid':
				_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
				_columns.push({ text: '출발지Port', datafield: 'srcPort', minwidth: 80, pinned: true });
				_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
				_columns.push({ text: '목적지Port', datafield: 'dstPort', minwidth: 130, pinned: true });
				_columns.push({ text: 'Protocol', datafield: 'protocol', minwidth: 100, pinned: true });
				_ctxmenuType = 'matrixPort';
				break;
			}
			
			var commColumns = [
					{ text: 'Bytes', datafield: 'bytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1024renderer },
					{ text: 'Packet', datafield: 'pkt', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'Host수', datafield: 'hostCnt', cellsalign: 'right', width: 100 },
					{ text: 'BPS', datafield: 'bpsBytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'PPS', datafield: 'ppsPacket', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P64', datafield: 'p64', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P128', datafield: 'p128', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P256', datafield: 'p256', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P512', datafield: 'p512', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P1024', datafield: 'p1024', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'P1518', datafield: 'p1518', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: 'POVER', datafield: 'pover', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer }
	           ];
			
			var source = {
					datatype: 'json'
			};
			var adapter = new $.jqx.dataAdapter(
					source,
					{
						formatData: function(data) {
							$.extend(data, PMain.getCommParams());
							return data;
						}
					}
			);
			
			HmGrid.create($grid, {
				source: adapter,
				columns: _columns.concat(commColumns)
			}, CtxMenu.NONE);
			
			// contextMenu 생성
			if(_ctxmenuType !== null) {
				PMain.createCtxmenu($grid, _ctxmenuType);
			}
		},
		
		/** init data */
		initData: function() {

		},
		
		getCommParams: function() {
			var _viewType = 'ALL', _tabNm = "";
			switch($('#mainTab').val()) {
			case 0: 
				switch($('#ipTab').val()) {
				case 0: _viewType = 'ALL'; _tabNm = 'allIp'; break;
				case 1: _viewType = 'SRC'; _tabNm = 'srcIp'; break;
				case 2: _viewType = 'DST'; _tabNm = 'dstIp'; break;
				}
				break;
			case 1:
				switch($('#cclassTab').val()) {
				case 0: _viewType = 'ALL'; _tabNm = 'allCclass'; break;
				case 1: _viewType = 'SRC'; _tabNm = 'srcCclass'; break;
				case 2: _viewType = 'DST'; _tabNm = 'dstCclass'; break;
				}
				break;
			case 2: 
				_tabNm = 'matrix';
				break;
			case 3:
				_tabNm = 'matrixPort';
				break;
			}
			
			// toMinute이 fromMinute보다 작거나 같으면 다음시간대로 계산!
			var _date1 = $('#date1').val('date'), _mm1 = $('#mm1').val(), _mm2 = $('#mm2').val();
			var _date2 = new Date(_date1.getTime());
			if(parseInt(_mm1) >= parseInt(_mm2)) {
				_date2.setHours(_date2.getHours() + 1);
			}
			return {
				viewType: _viewType,
				mngNo: $('#pMngNo').val(),
				ifIdx: $('#pIfIdx').val(),
				ifInout: $('#cbInout').val(),
				date1: $.format.date(_date1, 'yyyyMMddHH'),
				date2: $.format.date(_date2, 'yyyyMMddHH'),
				mm1: $.format.date(_mm1, 'mm'),
				mm2: $.format.date(_mm2, 'mm'),
				partition1: $.format.date(_date1, 'yyyyMMddHH'),
				partition2: $.format.date(_date2, 'yyyyMMddHH'),
				standardTable1: 'Z_RAW_0' + _date1.getDay() + '_' + $.format.date(_date1, 'HH'),
				standardTable2: 'Z_RAW_0' + _date2.getDay() + '_' + $.format.date(_date2, 'HH'),
				tabNm: _tabNm
			};
		},
		
		/** 조회 */
		search: function() {
			var isRtTms = $('#p_ckRtTms').val();
			var tabIdx = $('#mainTab').jqxTabs('val');
			if(isRtTms) { // 실시간 TMS 조회
				switch(tabIdx) {
				case 0: 
					switch($('#ipTab').val()) {
					case 0: PMain.updateBoundData($allIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
					case 1: PMain.updateBoundData($srcIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
					case 2: PMain.updateBoundData($dstIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
					}
					break;
				case 1:
					switch($('#cclassTab').val()) {
					case 0: PMain.updateBoundData($allCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
					case 1: PMain.updateBoundData($srcCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
					case 2: PMain.updateBoundData($dstCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
					}
					break;
				case 2:
					PMain.updateBoundData($matrixGrid, ctxPath + '/main/popup/trafficData/getMatrixAnalysisList.do'); 
					break;
				case 3:
					PMain.updateBoundData($matrixPortGrid, ctxPath + '/main/popup/trafficData/getMatrixPortAnalysisList.do'); 
					break;
				}
			}
			else {	// 시간 RawData TMS 조회
				switch(tabIdx) {
				case 0: 
					switch($('#ipTab').val()) {
					case 0: PMain.updateBoundData($allIpGrid, ctxPath + '/main/popup/chartTrafficData/getIpAnalysisList.do'); break;
					case 1: PMain.updateBoundData($srcIpGrid, ctxPath + '/main/popup/chartTrafficData/getIpAnalysisList.do'); break;
					case 2: PMain.updateBoundData($dstIpGrid, ctxPath + '/main/popup/chartTrafficData/getIpAnalysisList.do'); break;
					}
					break;
				case 1:
					switch($('#cclassTab').val()) {
					case 0: PMain.updateBoundData($allCclassGrid, ctxPath + '/main/popup/chartTrafficData/getCclassAnalysisList.do'); break;
					case 1: PMain.updateBoundData($srcCclassGrid, ctxPath + '/main/popup/chartTrafficData/getCclassAnalysisList.do'); break;
					case 2: PMain.updateBoundData($dstCclassGrid, ctxPath + '/main/popup/chartTrafficData/getCclassAnalysisList.do'); break;
					}
					break;
				case 2:
					PMain.updateBoundData($matrixGrid, ctxPath + '/main/popup/chartTrafficData/getMatrixAnalysisList.do'); 
					break;
				case 3:
					PMain.updateBoundData($matrixPortGrid, ctxPath + '/main/popup/chartTrafficData/getMatrixPortAnalysisList.do'); 
					break;
				}
			}
		},
		
		// URL이 호출시마다 바껴야 해서 따로 정의
		updateBoundData : function($grid, reqUrl) {
			$grid.jqxGrid("clearselection");
			var adapter = $grid.jqxGrid("source");
			if(adapter !== undefined) {
				adapter._source.url = reqUrl;
				
				if($grid.jqxGrid('filterable')) {
					$grid.jqxGrid("updatebounddata", "filter");					
				}
				else {
					$grid.jqxGrid("updatebounddata");
				}

				// 상태바 표시상태일때 높이조절
				if($grid.jqxGrid("showstatusbar") == true) {
					var gridId = $grid.attr("id");
					setTimeout('HmGrid.setStatusbarHeight("' + gridId + '")', 500);
				}
			}
		},
		
		/** ContextMenu */
		createCtxmenu: function(grid, type) {
			var menu = $('<div id="ctxmenu_' + type + '"></div>');
			var ul = $('<ul></ul>');
			switch(type) {
			case 'allIp': case 'srcIp': case 'dstIp':
				ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>IP상세</span></li>'));
				ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>서비스상세</span></li>'));
				break;
			case 'allCclass': case 'srcCclass': case 'dstCclass':
			case 'allBclass': case 'srcBclass': case 'dstBclass':
				ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>IP리스트</span></li>'));
				break;
			}
			var li = $('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/op_tool.png"><span>도구</span></li>');
			li.append($('<ul><li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/filter.png"><span>필터</span></li>' +
								'<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/filter_reset.png"><span>필터초기화</span></li></ul>'));
			ul.append(li);
			menu.append(ul).appendTo('body');
			
			grid.on('contextmenu', function(event) {
				return false;
			})
			.on('rowclick', function(event) {
				if(event.args.rightclick) {
					grid.jqxGrid('selectrow', event.args.rowindex);
					var scrollTop = $(window).scrollTop();
	                var scrollLeft = $(window).scrollLeft();
	                $('#ctxmenu_' + type).jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft, 
	                							parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
	                return false;
				}
			});
			menu.jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
				.on('itemclick', function(event) {
					PMain.selectCtxmenu(event);
				});
		},	
		
		selectCtxmenu: function(event) {
			var ctxmenuId = event.currentTarget.id;
			var grid = null, _viewType = 'ALL';
			switch(ctxmenuId) {
			case 'ctxmenu_allIp': grid = $allIpGrid; _viewType = 'ALL'; break;
			case 'ctxmenu_srcIp': grid = $srcIpGrid; _viewType = 'SRC'; break;
			case 'ctxmenu_dstIp': grid = $dstIpGrid; _viewType = 'DST'; break;
			case 'ctxmenu_allCclass': grid = $allCclassGrid; _viewType = 'ALL'; break;
			case 'ctxmenu_srcCclass': grid = $srcCclassGrid; _viewType = 'SRC'; break;
			case 'ctxmenu_dstCclass': grid = $dstCclassGrid; _viewType = 'DST'; break;
			case 'ctxmenu_matrix': grid = $matrixGrid; break;
			case 'ctxmenu_matrixPort': grid = $matrixPortGrid; break;
			default: return;
			}
			
			switch($.trim($(event.args).text())) {
			case 'IP상세':
				try {
					var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = grid.jqxGrid('getrowdata', rowidx);
					var params = PMain.getCommParams();
					if(params == null) return;
					params.ip = rowdata.ip;
					HmWindow.create($('#p2window'), 1100, 700);
					$.post(ctxPath + '/main/popup/tms/pNMS_RawDataIpDetail.do', 
							params,
							function(result) {
								HmWindow.open($('#p2window'), 'IP 상세', result, 1100, 700);
							}
					);
				} catch(e) {}
				break;
			case '서비스상세':
				try {
					var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = grid.jqxGrid('getrowdata', rowidx);
					var params = PMain.getCommParams();
					if(params == null) return;
					params.ip = rowdata.ip;
					HmWindow.create($('#p2window'), 1100, 700);
					$.post(ctxPath + '/main/popup/tms/pNMS_RawDataSvcDetail.do', 
							params,
							function(result) {
								HmWindow.open($('#p2window'), '서비스 상세', result, 1100, 700);
							}
					);
				} catch(e) {}
				break;
			case 'IP리스트':
				try {
					var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var rowdata = grid.jqxGrid('getrowdata', rowidx);
					var params = PMain.getCommParams();
					params.ip = rowdata.ip;
					HmWindow.create($('#p2window'), 1100, 700);
					if(ctxmenuId == 'ctxmenu_allCclass' || ctxmenuId == 'ctxmenu_srcCclass' || ctxmenuId == 'ctxmenu_dstCclass') {
						$.post(ctxPath + '/main/popup/tms/pNMS_RawDataCIpList.do', 
							params,
							function(result) {
								HmWindow.open($('#p2window'), 'IP 리스트', result, 1100, 700);
							}
						);
					}
					else if(ctxmenuId == 'ctxmenu_allBclass' || ctxmenuId == 'ctxmenu_srcBclass' || ctxmenuId == 'ctxmenu_dstBclass') {
						$.post(ctxPath + '/main/popup/tms/pNMS_RawDataBIpList.do', 
							params,
							function(result) {
								HmWindow.open($('#p2window'), 'IP 리스트', result, 1100, 700);
							}
						);
					}
				} catch(e) {}
				break;
			case '필터':
				grid.jqxGrid('beginupdate');
				if(grid.jqxGrid('filterable') === false) {
					grid.jqxGrid({ filterable: true });
				}
                setTimeout(function() {
                    grid.jqxGrid({showfilterrow: !grid.jqxGrid('showfilterrow')});
                }, 300);
				grid.jqxGrid('endupdate');
				break;
			case '필터초기화':
				grid.jqxGrid('clearfilters');
				break;
			}
		},
		
		/** Excel */
		exportExcel: function() {
			HmUtil.exportExcel(ctxPath + '/main/popup/chartTrafficData/export.do', PMain.getCommParams());
		}
		
};
