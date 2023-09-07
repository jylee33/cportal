var $allIpGrid, $srcIpGrid, $dstIpGrid, $allCclassGrid, $srcCclassGrid, $dstCclassGrid;
var $matrixGrid, $matrixPortGrid;
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
		$allIpGrid = $('#allIpGrid'), $srcIpGrid = $('#srcIpGrid'), $dstIpGrid = $('#dstIpGrid');
		$allCclassGrid = $('#allCclassGrid'), $srcCclassGrid = $('#srcCclassGrid'), $dstCclassGrid = $('#dstCclassGrid');
		$matrixGrid = $('#matrixGrid'), $matrixPortGrid = $('#matrixPortGrid');
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case "btnSearch":
			this.search();
			break;
		}
	},

	/** init design */
	initDesign : function() {
		$('#prgrsBar').jqxProgressBar({ width : 120, height : 21, theme: jqxTheme, showText : true });
		$('#prgrsBar').on('complete', function(event) {
			Main.search();
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
			Main.chgRefreshCycle();
		});
		HmDropDownBtn.createTree($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_MANG, 200, 22, 200, 300);
		
		$('#mainTabs').jqxTabs({ width: '100%', height: '100%', 
			initTabContent: function(tab) {
				switch(tab) {
				case 0: //IP 
					$('#ipTab').jqxTabs({ width: '100%', height: '100%', 
						initTabContent: function(iptab) {
							switch(iptab) {
							case 0: Main.createGrid($allIpGrid); break;
							case 1: Main.createGrid($srcIpGrid); break;
							case 2: Main.createGrid($dstIpGrid); break;
							}
						}
					});
					break;
				case 1: //C클래스
					$('#cclassTab').jqxTabs({ width: '100%', height: '100%', 
						initTabContent: function(cclasstab) {
							switch(cclasstab) {
							case 0: Main.createGrid($allCclassGrid); break;
							case 1: Main.createGrid($srcCclassGrid); break;
							case 2: Main.createGrid($dstCclassGrid); break;
							}
						}
					});
					break;
				case 2: //Matrix
					Main.createGrid($matrixGrid);
					break;
				case 3: //MatrixPort
					Main.createGrid($matrixPortGrid);
					break;
				}
			}
		});
	},

	/** init data */
	initData : function() {
		
	},

	/** 그리드 생성 */
	createGrid: function($grid) {
		var _columns = [];
		switch($grid.attr('id')) {
		case 'allIpGrid': 
		case 'srcIpGrid': 
		case 'dstIpGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
			break;
		case 'allCclassGrid':
		case 'srcCclassGrid':
		case 'dstCclassGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
			_columns.push({ text: '그룹', datafield: 'grpName', minwidth: 130, pinned: true }); 
			_columns.push({ text: 'NAME', datafield: 'subName', minwidth: 130, pinned: true }); 
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
		
		HmGrid.create($grid, {
			source: new $.jqx.dataAdapter(
					{
						datatype: 'json'
					},
					{
						formatData: function(data) {
							var _grpNo = -1, _viewType = 'ALL';
							if($.isEmpty($('#grpTree').val()) === false) {
								_grpNo = $('#grpTree').val().value;
							}
							switch($('#mainTabs').val()) {
							case 0: 
								switch($('#ipTab').val()) {
								case 0: _viewType = 'ALL'; break;
								case 1: _viewType = 'SRC'; break;
								case 2: _viewType = 'DST'; break;
								}
								break;
							case 1:
								switch($('#cclassTab').val()) {
								case 0: _viewType = 'ALL'; break;
								case 1: _viewType = 'SRC'; break;
								case 2: _viewType = 'DST'; break;
								}
								break;
							}

							$.extend(data, {
								grpNo: _grpNo,
								viewType: _viewType
							});
							return data;
						}
					}
			),
			columns: _columns.concat(commColumns)						
		});
	},
	
	/** 조회 */
	search : function() {
		var tabIdx = $('#mainTabs').jqxTabs('val');
		switch(tabIdx) {
		case 0: 
			switch($('#ipTab').val()) {
			case 0: HmGrid.updateBoundData($allIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			}
			break;
		case 1:
			switch($('#cclassTab').val()) {
			case 0: HmGrid.updateBoundData($allCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			}
			break;
		case 2:
			HmGrid.updateBoundData($matrixGrid, ctxPath + '/main/tms/rtAnalysis/getMatrixAnalysisList.do'); 
			break;
		case 3:
			HmGrid.updateBoundData($matrixPortGrid, ctxPath + '/main/tms/rtAnalysis/getMatrixPortAnalysisList.do'); 
			break;
		}
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
	} 
};
