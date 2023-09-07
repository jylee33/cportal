var TAB = {
		IP: 0,
		C_CLASS: 1,
		B_CLASS: 2,
		MATRIX: 3,
		MATRIX_PORT: 4,
		APP: 5,
		BIZ: 6,
		GRP: 7,
		ISP: 8,
		AS: 9
};

var $grpTree;
var $allIpGrid, $srcIpGrid, $dstIpGrid, $allCclassGrid, $srcCclassGrid, $dstCclassGrid;
var $allBclassGrid, $srcBclassGrid, $dstBclassGrid;
var $allIspGrid, $srcIspGrid, $dstIspGrid, $allAsGrid, $srcAsGrid, $dstAsGrid;
var $matrixGrid, $matrixPortGrid, $grpGrid, $bizGrid, $appGrid;
var allIpParams, srcIpParams, dstIpParams, allCclassParams, srcCclassParams, dstCclassParams, allBclassParams, srcBclassParams, dstBclassParams,
	allIspParams, srcIspParams, dstIspParams, allAsParams, srcAsParams, dstAsParams, 
	matrixParams, matrixPortParams, grpParams, bizParams, appParams;

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
		$allBclassGrid = $('#allBclassGrid'), $srcBclassGrid = $('#srcBclassGrid'), $dstBclassGrid = $('#dstBclassGrid');
		$allIspGrid = $('#allIspGrid'), $srcIspGrid = $('#srcIspGrid'), $dstIspGrid = $('#dstIspGrid');
		$allAsGrid = $('#allAsGrid'), $srcAsGrid = $('#srcAsGrid'), $dstAsGrid = $('#dstAsGrid');
		$matrixGrid = $('#matrixGrid'), $matrixPortGrid = $('#matrixPortGrid'), $grpGrid = $('#grpGrid'), $bizGrid = $('#bizGrid'); 
		$appGrid = $('#appGrid');
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
		// 10분전을 현재시간으로 셋팅
		var dateList = [];
		var today = new Date(new Date().getTime() - (10 * 60 * 1000));
		for(var i = 0; i <= 6; i++) {
			dateList.push({ 
				label: $.format.date(new Date().setDate(today.getDate() - i), 'yyyy-MM-dd'), 
				value: $.format.date(new Date().setDate(today.getDate() - i), 'yyyyMMdd') 
			});
		}
		$('#dateCb').jqxDropDownList({ width: 130, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: dateList, displayMember: 'label', valueMember: 'value', selectedIndex: 0
		});
		var hhList = [];
		var curHH = $.format.date(today, 'HH');
		var hhIdx = 0;
		for(var i = 0; i <= 23; i++) {
			var tmp = i < 10? '0' + i : i.toString();
			hhList.push({ label: tmp, value: tmp });
			if(tmp == curHH) hhIdx = i;
		}
		$('#hhCb').jqxDropDownList({ width: 50, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: hhList, displayMember: 'label', valueMember: 'value', selectedIndex: hhIdx
		});
		var smmList = [];
		var emmList = [];
		var smmIdx = 0, emmIdx = 0;
		var startMM = Math.floor(today.getMinutes() / 5) * 5;
		var endMM = (startMM + 5) > 60? 0 : (startMM + 5);
		startMM = startMM < 10? '0' + startMM : startMM.toString();
		endMM = endMM < 10? '0' + endMM : endMM.toString();
		for(var i = 0; i <= 60; i+=5) {
			var tmp = i < 10? '0' + i : i.toString();
			if(i<=55){
				smmList.push({ label: tmp, value: tmp });
				if(tmp == startMM) smmIdx = i / 5;
			}
			emmList.push({ label: tmp, value: tmp });
			if(tmp == endMM) emmIdx = i / 5;
		}
		
		$('#startMMCb').jqxDropDownList({ width: 50, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: smmList, displayMember: 'label', valueMember: 'value', selectedIndex: smmIdx
		});
		$('#endMMCb').jqxDropDownList({ width: 50, height: 21, theme: jqxTheme, autoDropDownHeight: true,
			source: emmList, displayMember: 'label', valueMember: 'value', selectedIndex: emmIdx
		});
		
		$('#mainTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
			initTabContent: function(tab) {
				switch(tab) {
				case TAB.IP: 
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
				case TAB.C_CLASS:
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
				case TAB.B_CLASS:
					$('#bclassTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
						initTabContent: function(bclasstab) {
							switch(bclasstab) {
							case 0: Main.createGrid($allBclassGrid); break;
							case 1: Main.createGrid($srcBclassGrid); break;
							case 2: Main.createGrid($dstBclassGrid); break;
							}
						}
					});
					break;
				case TAB.ISP:
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
				case TAB.AS:
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
				case TAB.MATRIX:
					Main.createGrid($matrixGrid);
					break;
				case TAB.MATRIX_PORT:
					Main.createGrid($matrixPortGrid);
					break;
				case TAB.GRP:
					Main.createGrid($grpGrid);
					break;
				case TAB.BIZ:
					Main.createGrid($bizGrid);
					break;
				case TAB.APP:
					Main.createGrid($appGrid);
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
		case 'allBclassGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
			_ctxmenuType = 'allBclass';
			break;
		case 'srcBclassGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true }); 
			_ctxmenuType = 'srcBclass';
			break;
		case 'dstBclassGrid':
			_columns.push({ text: 'IP', datafield: 'ip', minwidth: 130, pinned: true });
			_ctxmenuType = 'dstBclass';
			break;
		case 'allIspGrid':
		case 'srcIspGrid':
		case 'dstIspGrid':
			_columns.push({ text: 'ISP명', datafield: 'ispName', minwidth: 200, pinned: true });
			_ctxmenuType = 'isp';
			break;
		case 'allAsGrid':
		case 'srcAsGrid':
		case 'dstAsGrid':
			_columns.push({ text: 'AS명', datafield: 'asName', minwidth: 200, pinned: true });
			_ctxmenuType = 'as';
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
			_columns.push({ text: 'PROTOCOL', datafield: 'protocol', minwidth: 100, pinned: true });
			_ctxmenuType = 'matrixPort';
			break;
		case 'grpGrid':
			_columns.push({ text: '그룹명', datafield: 'grpName', minwidth: 130, pinned: true });
			_ctxmenuType = 'grp';
			break;
		case 'bizGrid':
			_columns.push({ text: '업무명', datafield: 'grpName', minwidth: 130, pinned: true });
			_ctxmenuType = 'biz';
			break;
		case 'appGrid':
			_columns.push({ text: 'APP', datafield: 'name', minwidth: 130, pinned: true });
			_ctxmenuType = 'app';
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
						case TAB.B_CLASS:
							switch($('#bclassTab').val()) {
							case 0: allBclassParams = data; break;
							case 1: srcBclassParams = data; break;
							case 2: dstBclassParams = data; break;
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
						case TAB.GRP: grpParams = data; break;
						case TAB.BIZ: bizParams = data; break;
						case TAB.APP: appParams = data; break;
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
		if(_ctxmenuType !== null) {
			Main.createCtxmenu($grid, _ctxmenuType);
		}		
	},
	
	/** 그룹트리 선택시 */
	selectTree: function() {
		Main.search();
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
		case TAB.B_CLASS:
			switch($('#bclassTab').val()) {
			case 0: _viewType = 'ALL'; _tabNm = 'allBclass'; break;
			case 1: _viewType = 'SRC'; _tabNm = 'srcBclass'; break;
			case 2: _viewType = 'DST'; _tabNm = 'dstBclass'; break;
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
		case TAB.MATRIX: _tabNm = 'matrix'; break;
		case TAB.MATRIX_PORT: _tabNm = 'matrixPort'; break;
		case TAB.GRP: _tabNm = 'grp'; break;
		case TAB.BIZ: _tabNm = 'biz'; break;
		case TAB.APP: _tabNm = 'app'; break;
		}

		var _date1 = $('#dateCb').val() + $('#hhCb').val();
		var _date = new Date(_date1.substr(0,4), parseInt(_date1.substr(4,2)) -1, _date1.substr(6,2), _date1.substr(8,2));
		_date.setTime(_date.getTime() + (60 * 60 * 1000));
		var _standardTable = '';
		if(_tabNm == 'biz' || _tabNm == 'grp') {
			_standardTable = 'Z_SUM_0' + _date.getDay() + '_' + $('#hhCb').val();
		}
		else {
			_standardTable = 'Z_RAW_0' + _date.getDay() + '_' + $('#hhCb').val();
		}
		
		return {
			itemKind: _itemKind,
			grpNo: _grpNo,
			netNo: _netNo,
			ifInout: _ifInout,
			viewType: _viewType,
			period: 'REALTIME',
			partition: $.format.date(_date, 'yyyyMMddHH'),
			date1: _date1,
			date2: _date1,
			hh: $('#hhCb').val(),
			standardTable: _standardTable,
			startMM: $('#startMMCb').val(),
			endMM: $('#endMMCb').val(),
			tabNm: _tabNm
		};
	},
	
	/** 조회 */
	search : function() {
		Main.setEngineCycle(); 
		
		var tabIdx = $('#mainTabs').jqxTabs('val');
		var url = null, $grid = null;
		switch(tabIdx) {
		case TAB.IP:
			url = ctxPath + '/main/tms/trafficAnalysis/getIpTrafficAnalysisList.do';
			switch($('#ipTab').val()) {
			case 0: $grid = $allIpGrid; break;
			case 1: $grid = $srcIpGrid; break;
			case 2: $grid = $dstIpGrid; break;
			}
			break;
		case TAB.C_CLASS:
			url = ctxPath + '/main/tms/trafficAnalysis/getCclassTrafficAnalysisList.do';
			switch($('#cclassTab').val()) {
			case 0: $grid = $allCclassGrid; break;
			case 1: $grid = $srcCclassGrid; break;
			case 2: $grid = $dstCclassGrid; break;
			}
			break;
		case TAB.B_CLASS:
			url = ctxPath + '/main/tms/trafficAnalysis/getBclassTrafficAnalysisList.do';
			switch($('#bclassTab').val()) {
			case 0: $grid = $allBclassGrid; break;
			case 1: $grid = $srcBclassGrid; break;
			case 2: $grid = $dstBclassGrid; break;
			}
			break;
		case TAB.ISP:
			url = ctxPath + '/main/tms/trafficAnalysis/getIspTrafficAnalysisList.do';
			switch($('#ispTab').val()) {
			case 0: $grid = $allIspGrid; break;
			case 1: $grid = $srcIspGrid; break;
			case 2: $grid = $dstIspGrid; break;
			}
			break;
		case TAB.AS:
			url = ctxPath + '/main/tms/trafficAnalysis/getAsTrafficAnalysisList.do';
			switch($('#asTab').val()) {
			case 0: $grid = $allAsGrid; break;
			case 1: $grid = $srcAsGrid; break;
			case 2: $grid = $dstAsGrid; break;
			}
			break;
		case TAB.MATRIX:
			url = ctxPath + '/main/tms/trafficAnalysis/getMatrixTrafficAnalysisList.do';
			$grid = $matrixGrid; 
			break;
		case TAB.MATRIX_PORT:
			url = ctxPath + '/main/tms/trafficAnalysis/getMatrixPortTrafficAnalysisList.do';
			$grid = $matrixPortGrid;
			break;
		case TAB.GRP:
			url = ctxPath + '/main/tms/trafficAnalysis/getGrpTrafficAnalysisList.do';
			$grid = $grpGrid;
			break;
		case TAB.BIZ:
			url = ctxPath + '/main/tms/trafficAnalysis/getBizTrafficAnalysisList.do';
			$grid = $bizGrid;
			break;
		case TAB.APP:
			url = ctxPath + '/main/tms/trafficAnalysis/getAppTrafficAnalysisList.do';
			$grid = $appGrid;
			break;
		}
		if($grid !== null && url !== null)
			HmGrid.updateBoundData($grid, url);
	},
	
	/** 엔진 수집기간 표시 */
	setEngineCycle: function() {
		// 엔진 수집기간 표시 (상신 - 송욱)
		var _sHH, _eHH, _sMM, _eMM;
		if($('#startMMCb').val() == '00') {
			_sHH = $('#hhCb').val() == '00'? '전일 23' : parseInt($('#hhCb').val()) - 1 < 10? '0' + (parseInt($('#hhCb').val()) - 1) : parseInt($('#hhCb').val()) - 1;
			_sMM = '55';
		}
		else {
			_sHH = $('#hhCb').val();
			_sMM = parseInt($('#startMMCb').val()) - 5 < 10? '0' + (parseInt($('#startMMCb').val()) - 5) : parseInt($('#startMMCb').val()) - 5;
		}
		if($('#endMMCb').val() == '00') {
			_eHH = $('#hhCb').val() == '00'? '전일 23': parseInt($('#hhCb').val()) - 1 < 10? '0' + (parseInt($('#hhCb').val()) - 1) : parseInt($('#hhCb').val()) - 1;
			_eMM = '59';
		}
		else {
			_eHH = $('#hhCb').val();
			_eMM = parseInt($('#endMMCb').val()) - 1 < 10? '0' + (parseInt($('#endMMCb').val()) - 1) : parseInt($('#endMMCb').val()) - 1;
		}
		var time = '(' + _sHH + ':' + _sMM + '~' + _eHH + ':' + _eMM + ')';
		$('#lbEngineCycle').text(time);		
		
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
		case 'ctxmenu_allBclass': grid = $allBclassGrid; _viewType = 'ALL'; break;
		case 'ctxmenu_srcBclass': grid = $srcBclassGrid; _viewType = 'SRC'; break;
		case 'ctxmenu_dstBclass': grid = $dstBclassGrid; _viewType = 'DST'; break;
		case 'ctxmenu_isp': grid = $ispGrid; break;
		case 'ctxmenu_as': grid = $asGrid; break;
		case 'ctxmenu_matrix': grid = $matrixGrid; break;
		case 'ctxmenu_matrixPort': grid = $matrixPortGrid; break;
		case 'ctxmenu_grp': grid = $grpGrid; break;
		case 'ctxmenu_biz': grid = $bizGrid; break;
		case 'ctxmenu_app': grid = $appGrid; break;
		default: return;
		}
		
		switch($.trim($(event.args).text())) {
		case 'IP상세':
			try {
				var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = grid.jqxGrid('getrowdata', rowidx);
				var params = Main.getCommParams();
				params.ip = rowdata.ip;
				HmWindow.create($('#pwindow'), 1100, 700);
				$.post(ctxPath + '/main/popup/tms/pRawDataIpDetail.do', 
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
				var rowdata = grid.jqxGrid('getrowdata', rowidx);
				var params = Main.getCommParams();
				params.ip = rowdata.ip;
				HmWindow.create($('#pwindow'), 1100, 700);
				$.post(ctxPath + '/main/popup/tms/pRawDataSvcDetail.do', 
						params,
						function(result) {
							HmWindow.open($('#pwindow'), '서비스 상세', result, 1100, 700);
						}
				);
			} catch(e) {}
			break;
		case 'IP리스트':
			try {
				var rowidx = HmGrid.getRowIdx(grid, '선택된 데이터가 없습니다.');
				if(rowidx === false) return;
				var rowdata = grid.jqxGrid('getrowdata', rowidx);
				var params = Main.getCommParams();
				params.ip = rowdata.ip;
				HmWindow.create($('#pwindow'), 1100, 700);
				if(ctxmenuId == 'ctxmenu_allCclass' || ctxmenuId == 'ctxmenu_srcCclass' || ctxmenuId == 'ctxmenu_dstCclass') {
					$.post(ctxPath + '/main/popup/tms/pRawDataCIpList.do', 
						params,
						function(result) {
							HmWindow.open($('#pwindow'), 'IP 리스트', result, 1100, 700);
						}
					);
				}
				else if(ctxmenuId == 'ctxmenu_allBclass' || ctxmenuId == 'ctxmenu_srcBclass' || ctxmenuId == 'ctxmenu_dstBclass') {
					$.post(ctxPath + '/main/popup/tms/pRawDataBIpList.do', 
						params,
						function(result) {
							HmWindow.open($('#pwindow'), 'IP 리스트', result, 1100, 700);
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
	
	exportExcel: function() {
		var params = null;
		switch($('#mainTabs').val()) {
		case TAB.IP:
			switch($('#ipTab').val()) {
			case 0: params = allIpParams; break;
			case 1: params = srcIpParams; break;
			case 2: params = dstIpParams; break;
			}
			break;
		case TAB.C_CLASS:
			switch($('#cclassTab').val()) {
			case 0: params = allCclassParams; break;
			case 1: params = srcCclassParams; break;
			case 2: params = dstCclassParams; break;
			}
			break;
		case TAB.B_CLASS:
			switch($('#bclassTab').val()) {
			case 0: params = allBclassParams; break;
			case 1: params = srcBclassParams; break;
			case 2: params = dstBclassParams; break;
			}
			break;
		case TAB.ISP:
			switch($('#ispTab').val()) {
			case 0: params = allIspParams; break;
			case 1: params = srcIspParams; break;
			case 2: params = dstIspParams; break;
			}
			break;
		case TAB.AS:
			switch($('#asTab').val()) {
			case 0: params = allAsParams; break;
			case 1: params = srcAsParams; break;
			case 2: params = dstAsParams; break;
			}
			break;
		case TAB.MATRIX: params = matrixParams; break;
		case TAB.MATRIX_PORT: params = matrixPortParams; break;
		case TAB.GRP: params = grpParams; break;
		case TAB.BIZ: params = bizParams; break;
		case TAB.APP: params = appParams; break;
		}
		HmUtil.exportExcel(ctxPath + '/main/tms/trafficAnalysis/export.do', params);
	}

};
