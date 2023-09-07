var $grpTree, $devGrid, $aepLinkGrid, $tciLinkGrid, $cvlanLinkGrid, $tsapiLinkGrid;
var _curMngNo = 0;
var ctxmenuIdx = 1;

var DTL_TAB = {
		TSAPI: 0,
		AEP: 1,
		TCI: 2,
		CVLAN: 3
}

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $devGrid = $('#devGrid'), $aepLinkGrid = $('#aepLinkGrid'), $tciLinkGrid = $('#tciLinkGrid');
			$cvlanLinkGrid = $('#cvlanLinkGrid'), $tsapiLinkGrid = $('#tsapiLinkGrid');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type2'));
		},
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox').keypress(function(e) {
				if (e.keyCode == 13) Main.searchDev(); 
			});
			
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchDev(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'AES' });
		
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {
								_curMngNo = 0;
								Main.clearDetail();
							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
				 	{ text: '그룹', datafield: 'grpName', width: 150, pinned: true }, 
				 	{ text: '이름', datafield: 'transName', minwidth: 150, pinned: true }, 
					{ text: 'IP 주소', datafield: 'devIp', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델명', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text: 'Transport', columngroup: 'service', datafield: 'transStatusStr', width: 150 },
					{ text: 'Cvlan', columngroup: 'service', datafield: 'cvlanStatusStr', width: 80 },
					{ text: 'TSAPI', columngroup: 'service', datafield: 'tsapiStatusStr', width: 80 },
					{ text: 'DLG', columngroup: 'service', datafield: 'dlgStatusStr', width: 80 },
					{ text: 'DMCC', columngroup: 'service', datafield: 'dmccStatusStr', width: 80 },
					{ text: 'TSAPI', columngroup: 'license', datafield: 'tsapiModeStr',  width: 80 },
					{ text: 'DLG', columngroup: 'license', datafield: 'dlgModeStr',  width: 80 },
					{ text: 'DMCC', columngroup: 'license', datafield: 'dmccModeStr',  width: 80 }
				],
				columngroups:
				[
				 	{ text: '서비스 상태', align: 'center', name: 'service' },
				 	{ text: '라이선스 상태', align: 'center', name: 'license' }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$devGrid.on('rowselect', function(event) {
				_curMngNo = event.args.row.mngNo;
				Main.clearDetail();
				Main.searchDetail();
			});

			$('#dtlTabs').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case DTL_TAB.AEP:
						HmGrid.create($aepLinkGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAesMonitor/getIptAesLinkList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											data.linkType = 1;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
							 	{ text: '번호', datafield: 'linkIdx', width: '10%' }, 
							 	{ text: '연결 SW 이름', datafield: 'linkName', width: '30%' }, 
								{ text: '연결 SW IP', datafield: 'linkIp', width: '30%' },
							 	{ text: 'Link 동작 상태', datafield: 'statusStr', width: '30%' }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case DTL_TAB.TCI:
						HmGrid.create($tciLinkGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAesMonitor/getIptAesLinkList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											data.linkType = 2;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
							 	{ text: '번호', datafield: 'linkIdx', minWidth: '20%' }, 
							 	{ text: '연결 SW 이름', datafield: 'linkName', width: '20%' }, 
								//{ text: '연결 SW IP', datafield: 'linkIp', width: '20%' },
							 	{ text: 'TCI Link 유형', datafield: 'linkFlagStr', width: '20%', filtertype: 'checkedlist' },
								{ text: 'Link 동작 상태', datafield: 'statusStr', width: '20%' }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case DTL_TAB.CVLAN:
						HmGrid.create($cvlanLinkGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAesMonitor/getIptAesLinkList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											data.linkType = 3;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
								 { text: 'Link ID', datafield: 'linkIdx', width: '50%' }, 
								 { text: 'Link 동작 상태', datafield: 'statusStr', width: '50%' }
							 ]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case DTL_TAB.TSAPI:
						HmGrid.create($tsapiLinkGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAesMonitor/getIptAesLinkList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											data.linkType = 4;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
								 { text: 'Link ID', datafield: 'linkIdx', width: '30%' }, 
								 { text: '연결 SW 이름', datafield: 'linkName', width: '35%' },
								 { text: 'Link 동작 상태', datafield: 'statusStr', width: '35%' }
							 ]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					}
				}
			})
			.on('selected', function(event) {
				Main.searchDetail();
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.searchDev();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getSrchParams());
			return params;
		},
		
		/** AES 장비 조회 */
		searchDev: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/ipt/avayaAesMonitor/getIptAesList.do');
		},
		
		/** 상세정보 clear */
		clearDetail: function() {
			$aepLinkGrid.jqxGrid('clear');
			$tciLinkGrid.jqxGrid('clear');
			$cvlanLinkGrid.jqxGrid('clear');
			$tsapiLinkGrid.jqxGrid('clear');
		},
		
		/** 상세 조회 */
		searchDetail: function() {
			switch($('#dtlTabs').val()) {
			case DTL_TAB.AEP:
				HmGrid.updateBoundData($aepLinkGrid);
				break;
			case DTL_TAB.TCI:
				HmGrid.updateBoundData($tciLinkGrid);
				break;
			case DTL_TAB.CVLAN:
				HmGrid.updateBoundData($cvlanLinkGrid);
				break;
			case DTL_TAB.TSAPI:
				HmGrid.updateBoundData($tsapiLinkGrid);
				break;
			}
		},
		
		/** Excel export */
		exportExcel: function() {
			HmUtil.exportGrid($devGrid, 'AES 모니터링', false);
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});