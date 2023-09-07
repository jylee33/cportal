var $grpTree, $vgGrid, $moduleGrid;
var _curMngNo = 0;
var timer, rowIndex;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $vgGrid = $('#vgGrid'), $moduleGrid = $('#moduleGrid');
			this.initCondition();
		},
		initCondition: function() {
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox').keypress(function(e) {
				if (e.keyCode == 13) Main.searchVgw(); 
			});
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchVgw(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });


			HmGrid.create($vgGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
								{ name:'mngNo', type:'number' },
                                { name:'grpName', type:'string' },
                                { name:'vgwNum', type:'number' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'model', type:'string' },
                                { name:'vgwMac', type:'string' },
                                { name:'vgwVintage', type:'string' },
                                { name:'vgwSerial', type:'string' },
                                { name:'vgwVer', type:'string' },
                                { name:'moduleCnt', type:'number' },
                                { name:'cmIp', type:'string' },
                                { name:'cmRegStr', type:'string' },
                                { name:'linkStatusStr', type:'string' },
                            ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {
								_curMngNo = 0;
								$moduleGrid.jqxGrid('clear');
							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
				 	{ text: '그룹', datafield: 'grpName', width : 150, pinned: true }, 
				 	{ text: 'VG 번호', datafield: 'vgwNum', width: 100, pinned: true }, 
				 	{ text: 'VG 이름', datafield: 'devName', minwidth: 150, pinned: true }, 
					{ text: 'VG IP 주소', datafield: 'devIp', width: 100 },
					{ text: '제조사', datafield: 'vendor', width: 80, filtertype: 'checkedlist' },
					{ text: '모델명', datafield: 'model', width: 80, filtertype: 'checkedlist' },
					{ text: 'MAC 주소', datafield: 'vgwMac', width: 150 },
					{ text: 'Vintage', datafield: 'vgwVintage', width: 80 },
					{ text: 'Serial No', datafield: 'vgwSerial', width: 130 },
					{ text: 'Firmware 버전', datafield: 'vgwVer', width: 130 },
					{ text: '모듈 수', datafield: 'moduleCnt', width: 80, cellsformat: 'n', cellsalign: 'right' },
					{ text: '등록 CM IP', datafield: 'cmIp', width: 120 },
					{ text: 'CM 등록 상태', datafield: 'cmRegStr', width: 130 },
					{ text: 'H.248 연결 상태', datafield: 'linkStatusStr', width: 130 }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$vgGrid.on('rowselect', function(event) {
				if(event.args.row == undefined){
					setTimeout(function(){
						$vgGrid.jqxGrid('selectrow', rowIndex);
					}, 500);
				}else{
					_curMngNo = event.args.row.mngNo;
					rowIndex = event.args.rowindex;
					Main.searchVgwModule();
				}
			});
			
			HmGrid.create($moduleGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'slotNo', type:'number' },
                                { name:'modName', type:'string' },
                                { name:'modTypeStr', type:'string' },
                                { name:'modInfo', type:'string' },
                                { name:'modSerial', type:'number' },
                                { name:'modVintage', type:'string' },
                                { name:'modSuffix', type:'string' },
                                { name:'modVer', type:'string' },
                                { name:'channelCnt', type:'number' },
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
				 	{ text: '슬롯번호', datafield: 'slotNo', width: 100, cellsalign: 'right' }, 
				 	{ text: '모듈 이름', datafield: 'modName', width: 150 }, 
					{ text: '모듈 종류', datafield: 'modTypeStr', width: 130, filtertype: 'checkedlist' },
				 	{ text: '상세 정보', datafield: 'modInfo', minwidth: 200 },
				 	{ text: 'Serial No', datafield: 'modSerial', width: 150 },
				 	{ text: 'Vintage', datafield: 'modVintage', width: 100 },
				 	{ text: 'Suffix', datafield: 'modSuffix', width: 100 },
				 	{ text: 'Firmware 버전', datafield: 'modVer', width: 130 },
				 	{ text: '채널 수', datafield: 'channelCnt', width: 100, cellsformat: 'n', cellsalign: 'right' }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
		},
		
		/** init data */
		initData: function() {
			Main.chgRefreshCycle();
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.searchVgw();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params,HmBoxCondition.getSrchParams());
			return params;
		},
		
		/** 장비 조회 */
		searchVgw: function() {
			HmGrid.updateBoundData($vgGrid, ctxPath + '/main/ipt/avayaVgwMonitor/getIptAvayaVgwList.do');
		},
		
		/** Module 조회 */
		searchVgwModule: function() {
			HmGrid.updateBoundData($moduleGrid, ctxPath + '/main/ipt/avayaVgwMonitor/getIptAvayaVgwModuleList.do');
		},
		
		/** Excel export */
		exportExcel: function() {
			HmUtil.exportGrid($vgGrid, 'VGW 모니터링', false);
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

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});