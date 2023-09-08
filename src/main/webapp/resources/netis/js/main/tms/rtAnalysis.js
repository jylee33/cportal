var TAB = {
		IP: 0,
		C_CLASS: 1,
		MATRIX: 2,
		MATRIX_PORT: 3,
		APP: 4,
		BIZ: 5,
		GRP: 6,
		COUNTRY: 7,
		ISP: 8,
		AS: 9
};

var $grpTree;
var $allIpGrid, $srcIpGrid, $dstIpGrid, $allCclassGrid, $srcCclassGrid, $dstCclassGrid;
var $allIspGrid, $srcIspGrid, $dstIspGrid, $allAsGrid, $srcAsGrid, $dstAsGrid;
var $matrixGrid, $matrixPortGrid, $appGrid, $bizGrid, $grpGrid, $allCountryGrid, $srcCountryGrid, $dstCountryGrid;
var allIpParams, srcIpParams, dstIpParams, allCclassParams, srcCclassParams, dstCclassParams, 
	allIspParams, srcIspParams, dstIspParams, allAsParams, srcAsParams, dstAsParams, 
	matrixParams, matrixPortParams, appParams, bizParams, grpParams, allCountryParams, srcCountryParams, dstCountryParams;
var timer, ctxmenuIdx = 0;

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});

var Main = {
	/** variable */
	initVariable : function() {
		$grpTree = $('#dGrpTreeGrid');
		$allIpGrid = $('#allIpGrid'), $srcIpGrid = $('#srcIpGrid'), $dstIpGrid = $('#dstIpGrid');
		$allCclassGrid = $('#allCclassGrid'), $srcCclassGrid = $('#srcCclassGrid'), $dstCclassGrid = $('#dstCclassGrid');
		$allIspGrid = $('#allIspGrid'), $srcIspGrid = $('#srcIspGrid'), $dstIspGrid = $('#dstIspGrid');
		$allAsGrid = $('#allAsGrid'), $srcAsGrid = $('#srcAsGrid'), $dstAsGrid = $('#dstAsGrid');
		$matrixGrid = $('#matrixGrid'), $matrixPortGrid = $('#matrixPortGrid'), $appGrid = $('#appGrid'), $bizGrid = $('#bizGrid');
		$grpGrid = $('#grpGrid'), $allCountryGrid = $('#allCountryGrid'), $srcCountryGrid = $('#srcCountryGrid'), $dstCountryGrid = $('#dstCountryGrid');
		this.initCondition();
	},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('', Main.search, timer);
		$("input[name=sRef]").eq(3).click();
	},

	/** add event */
	observe : function() {
		$('button').bind('click', function(event) { Main.eventControl(event); });
	},

	/** event handler */
	eventControl : function(event) {
		var curTarget = event.currentTarget;
		switch (curTarget.id) {
		case 'btnSearch': this.search(); break;
		case 'btnExcel': this.exportExcel(); break;
		}
	},

	/** init design */
	initDesign : function() {
		HmJqxSplitter.createTree($('#mainSplitter'));
		HmTreeGrid.create($grpTree, HmTree.T_GRP_MANG2, Main.selectTree, {isRootSelect: false});

		
		$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case TAB.IP: //IP 
					$('#ipTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(iptab) {
							switch(iptab) {
							case 0: Main.createGrid($allIpGrid); break;
							case 1: Main.createGrid($srcIpGrid); break;
							case 2: Main.createGrid($dstIpGrid); break;
							}
						}
					});
					break;
				case TAB.C_CLASS: //C클래스
					$('#cclassTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(cclasstab) {
							switch(cclasstab) {
							case 0: Main.createGrid($allCclassGrid); break;
							case 1: Main.createGrid($srcCclassGrid); break;
							case 2: Main.createGrid($dstCclassGrid); break;
							}
						}
					});
					break;
				case TAB.ISP: //ISP
					$('#ispTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(isptab) {
							switch(isptab) {
							case 0: Main.createGrid($allIspGrid); break;
							case 1: Main.createGrid($srcIspGrid); break;
							case 2: Main.createGrid($dstIspGrid); break;
							}
						}
					});
					break;
				case TAB.AS: //AS
					$('#asTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(astab) {
							switch(astab) {
							case 0: Main.createGrid($allAsGrid); break;
							case 1: Main.createGrid($srcAsGrid); break;
							case 2: Main.createGrid($dstAsGrid); break;
							}
						}
					});
					break;
				case TAB.MATRIX: //Matrix
					Main.createGrid($matrixGrid);
					break;
				case TAB.MATRIX_PORT: //MatrixPort
					Main.createGrid($matrixPortGrid);
					break;
				case TAB.APP: //App
					Main.createGrid($appGrid);
					break;
				case TAB.BIZ: //업무
					Main.createGrid($bizGrid);
					break;
				case TAB.GRP: //그룹
					Main.createGrid($grpGrid);
					break;
				case TAB.COUNTRY: //국가
					$('#countryTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(astab) {
							switch(astab) {
							case 0: Main.createGrid($allCountryGrid); break;
							case 1: Main.createGrid($srcCountryGrid); break;
							case 2: Main.createGrid($dstCountryGrid); break;
							}
						}
					});
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
		var _ctxmenuType = null;
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
		case 'allIspGrid':
		case 'srcIspGrid':
		case 'dstIspGrid':
			_columns.push({ text: 'ISP명', datafield: 'ispName', minwidth: 200, pinned: true });
			break;
		case 'allAsGrid':
		case 'srcAsGrid':
		case 'dstAsGrid':
			_columns.push({ text: 'AS명', datafield: 'asName', minwidth: 200, pinned: true });
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
			_columns.push({ text: 'PROTOCOL', datafield: 'protocol', minwidth: 100, pinned: true });
			break;
		case 'appGrid':
			_columns.push({ text: 'APP', datafield: 'name', minwidth: 130, pinned: true });
			break;
		case 'bizGrid':
			_columns.push({ text: '업무명', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'grpGrid':
			_columns.push({ text: '그룹명', datafield: 'grpName', minwidth: 130, pinned: true });
			break;
		case 'allCountryGrid':
			_columns.push({ text: '국가명', datafield: 'name', minwidth: 130, pinned: true });
			_ctxmenuType = 'allCountry';
			break;
		case 'srcCountryGrid': 
			_columns.push({ text: '국가명', datafield: 'name', minwidth: 130, pinned: true });
			_ctxmenuType = 'srcCountry';
			break;
		case 'dstCountryGrid':
			_columns.push({ text: '국가명', datafield: 'name', minwidth: 130, pinned: true });
			_ctxmenuType = 'dstCountry';
			break;
		}
		
		var commColumns = [
				{ text: 'Bytes', datafield: 'bytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1024renderer, 
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1024sumrenderer
				},
				{ text: 'Packet', datafield: 'pkt', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'Host수', datafield: 'hostCnt', cellsalign: 'right', width: 100,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_sumrenderer
				},
				{ text: 'BPS', datafield: 'bpsBytes', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'PPS', datafield: 'ppsPacket', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P64', datafield: 'p64', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P128', datafield: 'p128', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P256', datafield: 'p256', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P512', datafield: 'p512', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P1024', datafield: 'p1024', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'P1518', datafield: 'p1518', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				},
				{ text: 'POVER', datafield: 'pover', cellsalign: 'right', width: 100, cellsrenderer: HmGrid.unit1000renderer,
					aggregates: ['sum'], aggregatesrenderer: HmGrid.agg_unit1000sumrenderer
				}
           ];
		
		var source = {
				datatype: 'json',
				root: 'rows',
				beforeprocessing: function(data) {
					if(data != null) source.totalrecords = data.resultData.totalRows;
				},
				sort: function() {
					$grid.jqxGrid('updatebounddata', 'sort');
				},
				filter: function() {
					$grid.jqxGrid('updatebounddata', 'filter');
				}
		};
		var adapter = new $.jqx.dataAdapter(
				source,
				{
					formatData: function(data) {
						$.extend(data, Main.getCommParams());
						switch($('#mainTabs').val()) {
						case TAB.IP: 
							switch($('#ipTab').val()) {
							case 0: allIpParams = data; break;
							case 1: srcIpParams = data; break;
							case 2: dstIpParams = data; break;
							}
							break;
						case TAB.C_CLASS:
							switch($('#cclassTab').val()) {
							case 0: allCclassParams = data; break;
							case 1: srcCclassParams = data; break;
							case 2: dstCclassParams = data; break;
							}
							break;
						case TAB.ISP:
							switch($('#ispTab').val()) {
							case 0: allIspParams = data; break;
							case 1: srcIspParams = data; break;
							case 2: dstIspParams = data; break;
							}
							break;
						case TAB.AS:
							switch($('#asTab').val()) {
							case 0: allAsParams = data; break;
							case 1: srcAsParams = data; break;
							case 2: dstAsParams = data; break;
							}
							break;
						case TAB.MATRIX: matrixParams = data; break;
						case TAB.MATRIX_PORT: matrixPortParams = data; break;
						case TAB.APP: appParams = data; break;
						case TAB.BIZ: bizParams = data; break;
						case TAB.GRP: grpParams = data; break;
						case TAB.COUNTRY: 
							switch($('#countryTab').val()) {
							case 0: allCountryParams = data; break;
							case 1: srcCountryParams = data; break;
							case 2: dstCountryParams = data; break;
							}
							break;
						}
						return data;
					}
				}
		);
		
		HmGrid.create($grid, {
			source: adapter,
			virtualmode: true,
			rendergridrows: function(params) {
				return adapter.records;
			},
			showstatusbar: true,
            statusbarheight: 25,
			showaggregates: true,
			columns: _columns.concat(commColumns)
		}, CtxMenu.NONE);
		
		// contextMenu 생성
		// if(_ctxmenuType !== null) {
			Main.createCtxmenu($grid, _ctxmenuType);
		// }
	},
	
	getCommParams: function() {
		var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP', _viewType = 'ALL', _tabNm = '';
		var treeItem = HmTreeGrid.getSelectedItem($grpTree);
		if(treeItem !== null) {
			_itemKind = treeItem.devKind2;
			if(_itemKind == 'GROUP') {
				_grpNo = treeItem.grpNo;
			}
			else {
				var tmp = treeItem.grpNo.split('_');
				if(tmp != null && tmp.length == 3) {
					_grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
				}
			}
		}
		switch($('#mainTabs').val()) {
		case TAB.IP: 
			switch($('#ipTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allIp'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcIp'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstIp'; break;
			}
			break;
		case TAB.C_CLASS:
			switch($('#cclassTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allCclass'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcCclass'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstCclass'; break;
			}
			break;
		case TAB.ISP:
			switch($('#ispTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allIsp'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcIsp'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstIsp'; break;
			}
			break;
		case TAB.AS:
			switch($('#asTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allAs'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcAs'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstAs'; break;
			}
			break;
		case TAB.MATRIX:
			_tabNm = 'matrix';
			break;
		case TAB.MATRIX_PORT:
			_tabNm = 'matrixPort';
			break;
		case TAB.APP:
			_tabNm = 'app';
			break;
		case TAB.BIZ:
			_tabNm = 'biz';
			break;
		case TAB.GRP:
			_tabNm = 'grp';
			break;
		case TAB.COUNTRY:
			switch($('#countryTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allCountry'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcCountry'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstCountry'; break;
			}
			break;
		}

		return {
			itemKind: _itemKind,
			grpNo: _grpNo,
			netNo: _netNo,
			ifInout: _ifInout,
			viewType: _viewType,
			tabNm: _tabNm
		};
	},
	
	/** 그룹트리 선택시 */
	selectTree: function() {
		Main.search();
	},
	
	/** 조회 */
	search : function() {
		var tabIdx = $('#mainTabs').jqxTabs('val');
		switch(tabIdx) {
		case TAB.IP: 
			switch($('#ipTab').val()) {
			case 0: HmGrid.updateBoundData($allIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstIpGrid, ctxPath + '/main/tms/rtAnalysis/getIpAnalysisList.do'); break;
			}
			break;
		case TAB.C_CLASS:
			switch($('#cclassTab').val()) {
			case 0: HmGrid.updateBoundData($allCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstCclassGrid, ctxPath + '/main/tms/rtAnalysis/getCclassAnalysisList.do'); break;
			}
			break;
		case TAB.ISP:
			switch($('#ispTab').val()) {
			case 0: HmGrid.updateBoundData($allIspGrid, ctxPath + '/main/tms/rtAnalysis/getIspAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcIspGrid, ctxPath + '/main/tms/rtAnalysis/getIspAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstIspGrid, ctxPath + '/main/tms/rtAnalysis/getIspAnalysisList.do'); break;
			}
			break;
		case TAB.AS:
			switch($('#asTab').val()) {
			case 0: HmGrid.updateBoundData($allAsGrid, ctxPath + '/main/tms/rtAnalysis/getAsAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcAsGrid, ctxPath + '/main/tms/rtAnalysis/getAsAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstAsGrid, ctxPath + '/main/tms/rtAnalysis/getAsAnalysisList.do'); break;
			}
			break;
		case TAB.MATRIX:
			HmGrid.updateBoundData($matrixGrid, ctxPath + '/main/tms/rtAnalysis/getMatrixAnalysisList.do'); 
			break;
		case TAB.MATRIX_PORT:
			HmGrid.updateBoundData($matrixPortGrid, ctxPath + '/main/tms/rtAnalysis/getMatrixPortAnalysisList.do'); 
			break;
		case TAB.APP:
			HmGrid.updateBoundData($appGrid, ctxPath + '/main/tms/rtAnalysis/getAppAnalysisList.do'); 
			break;
		case TAB.BIZ:
			HmGrid.updateBoundData($bizGrid, ctxPath + '/main/tms/rtAnalysis/getBizAnalysisList.do'); 
			break;
		case TAB.GRP:
			HmGrid.updateBoundData($grpGrid, ctxPath + '/main/tms/rtAnalysis/getGrpAnalysisList.do'); 
			break;
		case TAB.COUNTRY:
			switch($('#countryTab').val()) {
			case 0: HmGrid.updateBoundData($allCountryGrid, ctxPath + '/main/tms/rtAnalysis/getCountryAnalysisList.do'); break;
			case 1: HmGrid.updateBoundData($srcCountryGrid, ctxPath + '/main/tms/rtAnalysis/getCountryAnalysisList.do'); break;
			case 2: HmGrid.updateBoundData($dstCountryGrid, ctxPath + '/main/tms/rtAnalysis/getCountryAnalysisList.do'); break;
			} 
			break;
		}
	},
	

	/** ContextMenu */
	createCtxmenu: function(grid, type) {
		var menuType = type || grid.attr('id');
		var menu = $('<div id="ctxmenu_' + menuType + '"></div>');
		var ul = $('<ul></ul>');
		if(type !== null) {
            ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>IP상세</span></li>'));
            ul.append($('<li><img style="margin-right: 5px" src="' + ctxPath + '/img/ctxmenu/ip_dtl.png"><span>서비스상세</span></li>'));
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
                $('#ctxmenu_' + menuType).jqxMenu('open', parseInt(event.args.originalEvent.clientX) + 5 + scrollLeft,
                							parseInt(event.args.originalEvent.clientY) + 5 + scrollTop);
                return false;
			}
		});
		menu.jqxMenu({ width: 180, height: 'auto', autoOpenPopup: false, mode: 'popup', theme: jqxTheme })
			.on('itemclick', function(event) {
				Main.selectCtxmenu(event);
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
		default: grid = $('#' + ctxmenuId.replace('ctxmenu_', '')); break;
		}
		if(grid == null) return;
		
		switch($.trim($(event.args).text())) {
		case 'IP상세':
			try {
				var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP';
				var treeItem = HmTreeGrid.getSelectedItem($grpTree);
				if(treeItem !== null) {
					_itemKind = treeItem.devKind2;
					if(_itemKind == 'GROUP') {
						_grpNo = treeItem.grpNo;
					}
					else {
						var tmp = treeItem.grpNo.split('_');
						if(tmp != null && tmp.length == 3) {
							_grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
						}
					}
				}
				var rowdata = grid.jqxGrid('getrowdata', rowidx);
				var params = {
						grpNo: _grpNo,
						netNo: _netNo,
						itemKind: _itemKind,
						ifInout: _ifInout,
						viewType: _viewType,
						ip: rowdata.ip
				};
				HmWindow.create($('#pwindow'), 1100, 700);
				$.post(ctxPath + '/main/popup/tms/pIpDetail.do', 
						params,
						function(result) {
							HmWindow.open($('#pwindow'), 'IP 상세', result, 1100, 700);
						}
				);
			} catch(e) {}
			break;
		case '서비스상세':
			try {
				var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var _grpNo = -1, _netNo = -1, _ifInout = '', _itemKind = 'GROUP';
				var treeItem = HmTreeGrid.getSelectedItem($grpTree);
				if(treeItem !== null) {
					_itemKind = treeItem.devKind2;
					if(_itemKind == 'GROUP') {
						_grpNo = treeItem.grpNo;
					}
					else {
						var tmp = treeItem.grpNo.split('_');
						if(tmp != null && tmp.length == 3) {
							_grpNo = tmp[0], _netNo = tmp[1], _ifInout = tmp[2] == 'I'? 'IN' : 'OUT';
						}
					}
				}
				var rowdata = grid.jqxGrid('getrowdata', rowidx);
				var params = {
						grpNo: _grpNo,
						netNo: _netNo,
						itemKind: _itemKind,
						ifInout: _ifInout,
						viewType: _viewType,
						ip: rowdata.ip
				};
				HmWindow.create($('#pwindow'), 1100, 650);
				$.post(ctxPath + '/main/popup/tms/pSvcDetail.do', 
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '서비스 상세', result, 1100, 650);
						}
				);
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
	
	exportExcel: function() {
        var params = null;
        switch($('#mainTabs').val()) {
            case TAB.IP:
                switch($('#ipTab').val()) {
                    case 0: HmUtil.exportGrid($allIpGrid, '실시간분석_전체IP', false); break;
                    case 1: HmUtil.exportGrid($srcIpGrid, '실시간분석_출발지IP', false); break;
                    case 2: HmUtil.exportGrid($dstIpGrid, '실시간분석_목적지IP', false); break;
                }
                break;
            case TAB.C_CLASS:
                switch($('#cclassTab').val()) {
                    case 0: HmUtil.exportGrid($allCclassGrid, '실시간분석_전체C클래스', false); break;
                    case 1: HmUtil.exportGrid($srcCclassGrid, '실시간분석_출발지C클래스', false); break;
                    case 2: HmUtil.exportGrid($dstCclassGrid, '실시간분석_목적지C클래스', false); break;
                }
                break;
            case TAB.ISP:
                switch($('#ispTab').val()) {
                    case 0: HmUtil.exportGrid($allIspGrid, '실시간분석_전체ISP', false); break;
                    case 1: HmUtil.exportGrid($srcIspGrid, '실시간분석_출발지ISP', false); break;
                    case 2: HmUtil.exportGrid($dstIspGrid, '실시간분석_목적지ISP', false); break;
                }
                break;
            case TAB.AS:
                switch($('#asTab').val()) {
                    case 0: HmUtil.exportGrid($allAsGrid, '실시간분석_전체AS', false); break;
                    case 1: HmUtil.exportGrid($srcAsGrid, '실시간분석_출발지AS', false); break;
                    case 2: HmUtil.exportGrid($dstAsGrid, '실시간분석_목적지AS', false); break;
                }
                break;
            case TAB.MATRIX: HmUtil.exportGrid($matrixGrid, '실시간분석_Matrix', false); break;
            case TAB.MATRIX_PORT: HmUtil.exportGrid($matrixPortGrid, '실시간분석_MatrixPort', false); break;
            case TAB.APP: HmUtil.exportGrid($appGrid, '실시간분석_APP', false); break;
            case TAB.BIZ: HmUtil.exportGrid($bizGrid, '실시간분석_업무', false); break;
            case TAB.GRP: HmUtil.exportGrid($grpGrid, '실시간분석_그룹', false); break;
            case TAB.COUNTRY:
                switch($('#countryTab').val()) {
                    case 0: HmUtil.exportGrid($allCountryGrid, '실시간분석_전체국가', false); break;
                    case 1: HmUtil.exportGrid($srcCountryGrid, '실시간분석_출발지국가', false); break;
                    case 2: HmUtil.exportGrid($dstCountryGrid, '실시간분석_목적지국가', false); break;
                }
                break;
        }
		// var params = null;
		// switch($('#mainTabs').val()) {
		// case TAB.IP:
		// 	switch($('#ipTab').val()) {
		// 	case 0: params = allIpParams; break;
		// 	case 1: params = srcIpParams; break;
		// 	case 2: params = dstIpParams; break;
		// 	}
		// 	break;
		// case TAB.C_CLASS:
		// 	switch($('#cclassTab').val()) {
		// 	case 0: params = allCclassParams; break;
		// 	case 1: params = srcCclassParams; break;
		// 	case 2: params = dstCclassParams; break;
		// 	}
		// 	break;
		// case TAB.ISP:
		// 	switch($('#ispTab').val()) {
		// 	case 0: params = allIspParams; break;
		// 	case 1: params = srcIspParams; break;
		// 	case 2: params = dstIspParams; break;
		// 	}
		// 	break;
		// case TAB.AS:
		// 	switch($('#asTab').val()) {
		// 	case 0: params = allAsParams; break;
		// 	case 1: params = srcAsParams; break;
		// 	case 2: params = dstAsParams; break;
		// 	}
		// 	break;
		// case TAB.MATRIX: params = matrixParams; break;
		// case TAB.MATRIX_PORT: params = matrixPortParams; break;
		// case TAB.APP: params = appParams; break;
		// case TAB.BIZ: params = bizParams; break;
		// case TAB.GRP: params = grpParams; break;
		// case TAB.COUNTRY:
		// 	switch($('#countryTab').val()) {
		// 	case 0: params = allCountryParams; break;
		// 	case 1: params = srcCountryParams; break;
		// 	case 2: params = dstCountryParams; break;
		// 	}
		// 	break;
		// }
		// HmUtil.exportExcel(ctxPath + '/main/tms/rtAnalysis/export.do', params);
	}
	
};
