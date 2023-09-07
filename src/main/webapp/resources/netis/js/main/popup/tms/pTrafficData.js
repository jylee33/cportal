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
			$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true, animationDuration: 0 });
			$('#prgrsBar').on('complete', function(event) {
				PMain.search();
				$(this).val(0);
			});
			$('#refreshCycleCb').jqxDropDownList({ width: 100, height: 21, theme: jqxTheme, autoDropDownHeight: true,
				source: [
				         { label: 'NONE', value: 0 },
				         { label: '30초', value: 30 },
				         { label: '20초', value: 20 },
				         { label: '10초', value: 10 }
		         ],
		        displayMember: 'label', valueMember: 'value', selectedIndex: 0
			})
			.on('change', function() {
				PMain.chgRefreshCycle();
			});
			$('#cbInout').jqxDropDownList({ width: 60, height: 21, theme: jqxTheme, autoDropDownHeight: true, selectedIndex: 0,
				source: [ 'IN', 'OUT', 'TOTAL' ]
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
			var _columns = [];
			var _isCtxMenu = false;
			switch($grid.attr('id')) {
			case 'allIpGrid': 
			case 'srcIpGrid': 
			case 'dstIpGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
				_isCtxMenu = true;
				break;
			case 'allCclassGrid':
			case 'srcCclassGrid':
			case 'dstCclassGrid':
				_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
				_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true }); 
				_columns.push({ text: 'NAME', datafield: 'subName', minwidth: 130, pinned: true });
				_isCtxMenu = true;
				break;
			case 'matrixGrid':
				_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
				_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
				break;
			case 'matrixPortGrid':
				_columns.push({ text: '출발지IP', datafield: 'srcIp', minwidth: 130, pinned: true });
				_columns.push({ text: '출발지Port', datafield: 'srcPort', minwidth: 80, pinned: true });
				_columns.push({ text: '목적지IP', datafield: 'dstIp', minwidth: 130, pinned: true });
				_columns.push({ text: '목적지Port', datafield: 'dstPort', minwidth: 130, pinned: true });
				_columns.push({ text: 'Protocol', datafield: 'protocol', minwidth: 100, pinned: true });
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
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var _viewType = 'ALL', _tabNm = "";
			switch($('#mainTab').val()) {
			case 0: 
				switch($('#ipTab').val()) {
				case 0: _viewType = 'ALL'; _tabNm = "allIp"; break;
				case 1: _viewType = 'SRC'; _tabNm = "srcIp"; break;
				case 2: _viewType = 'DST'; _tabNm = "dstIp"; break;
				}
				break;
			case 1:
				switch($('#cclassTab').val()) {
				case 0: _viewType = 'ALL'; _tabNm = "allCclass"; break;
				case 1: _viewType = 'SRC'; _tabNm = "srcCclass"; break;
				case 2: _viewType = 'DST'; _tabNm = "dstCclass"; break;
				}
				break;
			case 2:
				_tabNm = "matrix"; 
				break;
			case 3:
				_tabNm = "matrixPort";
				break;
			}

			return {
				viewType: _viewType,
				mngNo: $('#pMngNo').val(),
				ifIdx: $('#pIfIdx').val(),
				ifInout:$('#cbInout').val(),
				tabNm: _tabNm
			};
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
		
		/** 조회 */
		search: function() {
			var tabIdx = $('#mainTab').jqxTabs('val');
			switch(tabIdx) {
			case 0: 
				switch($('#ipTab').val()) {
				case 0: HmGrid.updateBoundData($allIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
				case 1: HmGrid.updateBoundData($srcIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
				case 2: HmGrid.updateBoundData($dstIpGrid, ctxPath + '/main/popup/trafficData/getIpAnalysisList.do'); break;
				}
				break;
			case 1:
				switch($('#cclassTab').val()) {
				case 0: HmGrid.updateBoundData($allCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
				case 1: HmGrid.updateBoundData($srcCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
				case 2: HmGrid.updateBoundData($dstCclassGrid, ctxPath + '/main/popup/trafficData/getCclassAnalysisList.do'); break;
				}
				break;
			case 2:
				HmGrid.updateBoundData($matrixGrid, ctxPath + '/main/popup/trafficData/getMatrixAnalysisList.do'); 
				break;
			case 3:
				HmGrid.updateBoundData($matrixPortGrid, ctxPath + '/main/popup/trafficData/getMatrixPortAnalysisList.do'); 
				break;
			}
		},
		
		/** Excel */
		exportExcel: function() {
			HmUtil.exportExcel(ctxPath + '/main/popup/trafficData/export.do', PMain.getCommParams());
		}
		
};
