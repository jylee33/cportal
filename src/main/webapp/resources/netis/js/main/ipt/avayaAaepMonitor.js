var $grpTree, $aaepGrid, $mppGrid, $appGrid;
var _curMngNo = 0;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $aaepGrid = $('#aaepGrid'), $mppGrid = $('#mppGrid'), $appGrid = $('#appGrid');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			
			$('.searchBox').keypress(function(e) {
				if (e.keyCode == 13) Main.searchVpms(); 
			});
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchVpms(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'AAEP' });
		
			HmGrid.create($aaepGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
								{ name:'mngNo', type:'number' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'model', type:'string' },
                                { name:'vpmsName', type:'string' },
                                { name:'vpmsVer', type:'string' },
                                { name:'mppCnt', type:'number' },
                                { name:'unknownCnt', type:'number' },
							]
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
				 	{ text: '그룹', datafield: 'grpName', width: 150 }, 
				 	{ text: 'AAEP 이름', datafield: 'devName', minwidth: 150 }, 
					{ text: 'IP 주소', datafield: 'devIp', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델명', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text: 'VPMS 이름', datafield: 'vpmsName', width: 150 },
					{ text: 'VPMS SW 버전', datafield: 'vpmsVer', width: 130 },
					{ text: 'MPP 개수', datafield: 'mppCnt', width: 100, cellsformat: 'n', cellsalign: 'right' },
					{ text: '미확인 알람 수', datafield: 'unknownCnt', width: 110, cellsformat: 'n', cellsalign: 'right' }
				]
			});
			$aaepGrid.on('rowselect', function(event) {
				_curMngNo = event.args.row.mngNo;
				Main.clearDetail();
				Main.searchDetail();
			});
			
			$('#dtlTabs').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme, 
				initTabContent: function(tab) {
					switch(tab) {
					case 0: //MPP
						HmGrid.create($mppGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAaepMonitor/getIptAaepMppList.do',
										datafields:[
                                            { name:'mppIdx', type:'number' },
                                            { name:'mppName', type:'string' },
                                            { name:'mppVer', type:'string' },
                                            { name:'cpuUsage', type:'number' },
                                            { name:'memUsage', type:'number' },
                                            { name:'diskUsage', type:'number' },
                                            { name:'knownCnt', type:'number' },
                                            { name:'unknownCnt', type:'number' },
                                            { name:'activeCall', type:'number' },
                                            { name:'todayCall', type:'number' },
                                            { name:'resource', type:'number' },
                                            { name:'alarm', type:'string' },
                                            { name:'call', type:'string' },
										]
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
							 	{ text: '번호', datafield: 'mppIdx', width: 70 }, 
							 	{ text: '이름', datafield: 'mppName', minwidth: 130 }, 
//								{ text: 'IP 주소', datafield: 'mppIp', width: 120 },
							 	{ text: 'SW 버전', datafield: 'mppVer', width: 120 },
							 	{ text: 'CPU', columngroup: 'resource', datafield: 'cpuUsage', width: 80, cellsalign: 'right' },
							 	{ text: 'Memory', columngroup: 'resource', datafield: 'memUsage', width: 80, cellsalign: 'right' },
							 	{ text: 'Disk', columngroup: 'resource', datafield: 'diskUsage', width: 80, cellsalign: 'right' },
							 	{ text: '확인', columngroup: 'alarm', datafield: 'knownCnt', width: 80, cellsformat: 'n', cellsalign: 'right' },
							 	{ text: '미확인', columngroup: 'alarm', width: 80, datafield: 'unknownCnt', cellsformat: 'n', cellsalign: 'right' },
							 	{ text: '현재', columngroup: 'call', width: 80, datafield: 'activeCall', cellsformat: 'n', cellsalign: 'right' },
							 	{ text: '당일 누적', columngroup: 'call', width: 80, datafield: 'todayCall', cellsformat: 'n', cellsalign: 'right' }
							],
							columngroups:
							[
							 	{ text: '자원 이용률 (%)', align: 'center', name: 'resource' },
							 	{ text: '알람', align: 'center', name: 'alarm' },
							 	{ text: 'Call', align: 'center', name: 'call' }
							]
						});
						break;
					case 1: //Application
						HmGrid.create($appGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										url: ctxPath + '/main/ipt/avayaAaepMonitor/getIptAaepAppList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = _curMngNo;
											return data;
										}
									}
							),
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns:
							[
							 	{ text: '번호', datafield: 'appIdx', width: '100px' }, 
							 	{ text: '이름', datafield: 'appName', width: '200px' }, 
								{ text: 'DNIS', datafield: 'appDnis' }
							]
						});
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
			Main.searchVpms();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getSrchParams());
			return params;
		},
		
		/** AAEP 장비 조회 */
		searchVpms: function() {
			HmGrid.updateBoundData($aaepGrid, ctxPath + '/main/ipt/avayaAaepMonitor/getIptAaepVpmsList.do');
		},
		
		/** 상세 clear */
		clearDetail: function() {
			$mppGrid.jqxGrid('clear');
			$appGrid.jqxGrid('clear');
		},
		
		/** 상세 조회 */
		searchDetail: function() {
			switch($('#dtlTabs').val()) {
			case 0:
				HmGrid.updateBoundData($mppGrid);
				break;
			case 1:
				HmGrid.updateBoundData($appGrid);
				break;
			}
		},
		
		/** Excel export */
		exportExcel: function() {
			HmUtil.exportGrid($aaepGrid, 'AAEP 모니터링', false);
		}
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});