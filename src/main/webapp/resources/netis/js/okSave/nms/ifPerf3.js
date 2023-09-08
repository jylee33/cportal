var $dGrpTreeGrid;
var $devGrid, $lineGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid, $cardGrid, $cmDevGrid, $cmIfGrid;
var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_ifIdx = -1;
var dtl_lineWidth = 1000000000;

var Main = {
		/** variable */
		initVariable: function() {
			$dGrpTreeGrid = $('#dGrpTreeGrid');
			$devGrid = $('#devGrid');
			$lineGrid = $('#lineGrid');
//			$dtlTab = $('#dtlTab');
//			$ifGrid = $('#ifGrid'), $evtGrid = $('#evtGrid'), $moduleGrid = $('#moduleGrid'), $cardGrid = $('#cardGrid');
//			$cmDevGrid = $('#cmDevGrid'), $cmIfGrid = $('#cmIfGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchDev(); break;
			}
		},

		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.searchDev();
			}
		},

		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], '100%', '100%');
			HmJqxSplitter.create($('#sub_splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], '100%', '100%');
			// 성능수집여부 체크박스
			$('#cbPerfPoll').jqxCheckBox({width: 80, height: 22, checked: true});

			// 좌측 탭영역
//			Master.createGrpTab(Main.searchDev, {devKind1 : 'DEV'});
//			HmTreeGrid.create($dGrpTreeGrid, HmTree.T_GRP_DEFAULT2, Main.searchDev, {devKind1 : 'DEV'});
			$('#leftTab').jqxTabs({ width: '100%', height: '99.8%', scrollable: true, theme: jqxTheme,
				initTabContent: function(tab) {
					switch(tab) {
						case 0: HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind1 : 'DEV'}); break;
						case 1: HmTreeGrid.create($('#sGrpTreeGrid'), HmTree.T_GRP_SEARCH2, Main.selectTree); break;
						case 2: HmTreeGrid.create($('#iGrpTreeGrid'), HmTree.T_GRP_IF, Main.selectTree); break;
					}
				}
			});
			/** 장비 그리드 */
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [	// 필터기능이 정상동작을 안해서 추가함!
					             { name: 'grpName', type: 'string' },
					             { name: 'disDevName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'userDevName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'devKind2', type: 'string' },
					             { name: 'model', type: 'string' },
					             { name: 'vendor', type: 'string' },
					             { name: 'ifCnt', type: 'number' },
					             { name: 'aliveIfCnt', type: 'number' },
					             { name: 'deadIfCnt', type: 'number' },
					             { name: 'usedIf', type: 'number' },
					             { name: 'aliveIfCnt', type: 'number' },
					             { name: 'aliveIfCnt', type: 'number' },
					             { name: 'card', type: 'number' },
					             { name: 'module', type: 'number' },
					             { name: 'backup', type: 'string' },
					             { name: 'grpNo', type: 'number' },
					             { name: 'mngNo', type: 'number' },
					             { name: 'memory', type: 'number' },
					             { name: 'isCommunity', type: 'string' },
					             { name: 'cpuPer', type: 'number' },
					             { name: 'memPer', type: 'number' }
				            ]
						},
						{
							formatData: function(data) {
								var params = Main.getCommParams();
								$.extend(data, params);
								return data;
							},
							loadComplete: function(records) {
								dtl_mngNo = -1;
							}
						}
				),
				columns:
				[
				 	{ text : '장비번호', datafield: 'mngNo', width: 80, hidden: true },
				 	{ text : '그룹명', datafield: 'grpName', minwidth : 130 },
				 	{ text : '장비명', datafield: 'disDevName', minwidth : 150 },
					{ text: '대표IP', datafield: 'devIp', width: 120 },
					{ text: '종류', datafield: 'devKind2', width: 100 },
					{ text: '모델', datafield: 'model', width: 80 },
					{ text: '제조사', datafield: 'vendor', width: 80 },
					//{ text: "회선사용률", datafield: "usedIf", width: 100, cellsrenderer: HmGrid.progressbarrenderer, filtertype: "number" },
					{ text: "회선수", datafield: "ifCnt", width: 60, cellsformat: "n", cellsalign: "right", filtertype: "number" },
					{ text: "Alive 수", datafield: "aliveIfCnt", width: 60, cellsformat: "n", cellsalign: "right", filtertype: "number" },
//					{ text: "Dead 수", datafield: "deadIfCnt", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
//					{ text: "모듈수", datafield: "module", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
//					{ text: "카드수", datafield: "card", width: 80, cellsformat: "n", cellsalign: "right", filtertype: "number" },
//					{ text: "Config일시", datafield: "backup", width: 100 },
//					{ text: "메모리", datafield: "memory", width: 100, cellsrenderer: HmGrid.unit1024renderer },
//                    { text: "CPU사용률", datafield: "cpuPer", width: 100, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
//					{ text: "메모리사용률", datafield: "memPer", width: 110, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
//					{ text: "커뮤니티", datafield: "isCommunity", width: 80, hidden:true }
				 ],
				showtoolbar: true,
				rendertoolbar: function(toolbar) {
					HmGrid.titlerenderer(toolbar, '장비', 'titleIfGrid');
				}	
			}, CtxMenu.DEV, ctxmenuIdx++);
			$devGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				Main.searchLine();
			});

			// 회선 Grid
			HmGrid.create($lineGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [	// 필터기능이 정상동작을 안해서 추가함!
					             { name: 'grpName', type: 'string' },
					             { name: 'disDevName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'ifName', type: 'string' },
					             { name: 'ifAlias', type: 'string' },
					             { name: 'lineWidth', type: 'string' },
					             { name: 'status', type: 'string' },
					             { name: 'perfPoll', type: 'string' },
					             { name: 'grpNo', type: 'number' },
					             { name: 'mngNo', type: 'number' },
					             { name: 'ifIdx', type: 'number' },
					             { name: 'inbpsPer', type: 'number' },
					             { name: 'outbpsPer', type: 'number' }
				            ]
						},
						{
							formatData: function(data) {
								var _mngNo = -1, _devGrpNo = -1;
								var rowdata = HmGrid.getRowData($devGrid);
								if(rowdata != null) {
									_mngNo = rowdata.mngNo;
									_devGrpNo = rowdata.grpNo;
								}
								var params = Main.getCommParams();
								$.extend(data, params);
								$.extend(data, {
									mngNo: _mngNo,
									devGrpNo: _devGrpNo,
									perfPoll: $('#cbPerfPoll').val() ? 1 : 0
								});
								return data;
							},
							loadComplete: function(records) {
								dtl_ifIdx = -1;
							}
						}
				),
				columns: 
				[
					{ text: '회선번호', datafield: 'ifIdx',  pinned: true, width: 80 },
					{ text: '회선명', datafield: 'ifName',  pinned: true, minwidth: 160 },
					{ text: '회선별칭', datafield: 'ifAlias', width: 130 },
					{ text: '대역폭', datafield: 'lineWidth', width: 100, cellsrenderer: HmGrid.unit1000renderer },
					{ text: "IN BPS(%)", datafield: "inbpsPer", width: 80, cellsformat:'p', cellsalign: 'right' },
					{ text: "OUT BPS(%)", datafield: "outbpsPer", width: 80, cellsformat:'p', cellsalign: 'right' },
					{ text: '상태', datafield: 'status', width: 80, cellsalign: 'center', cellsrenderer: HmGrid.statusrenderer },
					{ text: "성능수집", datafield: "perfPoll", width: 80, cellsalign: 'center' }
			    ],
				showtoolbar: true,
				rendertoolbar: function(toolbar) {
					// var me = this;
					// var title = $('<span style="float: left; font-weight: bold; margin-top: 5px; margin-right: 4px;">회선 </span>')
					// var container = $("<div style='margin: 5px;'></div>");
					// var input = $("<div id='field'/>");
					// toolbar.append(container);
					// container.append(title);
					// container.append(input);
					//
					// input.jqxComboBox({
					// 	source: [
					// 			{value : 'ALL', label : "전체"},
					// 			{value : 'Y', label : "성능 수집"},
					// 			{value : 'N', label : "성능 미수집"}
					// 		],
					// 	selectedIndex: 1,autoDropDownHeight: true,
					// 	width: 100,
					// 	height: 21
					// });
					HmGrid.titlerenderer(toolbar, '회선', 'titleIfGrid');
				}				
			}, CtxMenu.IF, ctxmenuIdx++);
			$lineGrid.on('rowdoubleclick', function(event) {
				dtl_ifIdx = event.args.row.bounddata.ifIdx;
				dtl_lineWidth = event.args.row.bounddata.lineWidth;
				Main.searchDtlInfo();
			});
			
			
		},

		/** init data */
		initData: function() {

		},
		/** 공통 파라미터 */
		getCommParams: function () {
			var treeItem = null, _grpType = 'DEFAULT';
			switch ($('#leftTab').val()) {
				case 0:
					treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
					_grpType = 'DEFAULT';
					break;
				case 1:
					treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid'));
					_grpType = 'SEARCH';
					break;
				case 2:
					treeItem = HmTreeGrid.getSelectedItem($('#iGrpTreeGrid'));
					_grpType = 'IF';
					break;
			}
			var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
			if (treeItem != null) {
				_itemKind = treeItem.devKind2;
				_grpNo = _itemKind == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1];
				_grpParent = treeItem.grpParent;
			}

			var params = {
				grpType: _grpType,
				grpNo: _grpNo,
				grpParent: _grpParent,
				itemKind: _itemKind
			};
			return params;
		},

		selectTree: function () {
			Main.searchDev();
		},
		/** 장비 조회 */
		searchDev: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/ifPerf3/getDevList.do');
			$lineGrid.jqxGrid('clear'); // 회선 그리드 초기화
		},
		/** 회선 조회 */
		searchLine: function() {
			HmGrid.updateBoundData($lineGrid, ctxPath + '/main/nms/ifPerf3/getLineList.do');
		},
		
		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});