var  $dGrpTreeGrid;
var $devGrid;
var $dtlTab, $ifGrid;
var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_devName = '';

var Main = {
	/** variable */
	initVariable: function() {
		$dGrpTreeGrid = $('#dGrpTreeGrid');
		$devGrid = $('#devGrid');
		this.initCondition();
	},

	initCondition: function() {
		HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
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
			case 'btnExcel': this.exportExcel(); break;
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
		CtxMenu_Dev.create('history');
		/** 장비 그리드 */
		HmGrid.create($devGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					datafields:[ // 필터위해 추가
						{ name: 'devKind1', type: 'string' },
						{ name: 'mngNo', type: 'number' },
						{ name: 'grpName', type: 'string' },
						{ name: 'devName', type: 'string' },
						{ name: 'userDevName', type: 'string' },
						{ name: 'devIp', type: 'string' },
						{ name: 'vendor', type: 'string' },
						{ name: 'devKind2', type: 'string' },
						{ name: 'model', type: 'string' },
						{ name: 'machineSerial', type: 'string' },
						{ name: 'machineVer', type: 'string' },
						{ name: 'configBakYmd', type: 'string' },
						{ name: 'ifCnt', type: 'number' },
						{ name: 'devCnt', type: 'number' },
						{ name: 'ciscoCnt', type: 'number' },
						{ name: 'piolinkCnt', type: 'number' },
						{ name: 'atmCnt', type: 'number' },
						{ name: 'ipsCnt', type: 'number' },
						{ name: 'l2Cnt', type: 'number' },
						{ name: 'l3Cnt', type: 'number' },
						{ name: 'l4Cnt', type: 'number' },
						{ name: 'backboneCnt', type: 'number' },
						{ name: 'routerCnt', type: 'string' },
						{ name: 'firwerCnt', type: 'number' },
						{ name: 'etcCnt', type: 'number' },
						{ name: 'ciscoL2Cnt', type: 'number' },
						{ name: 'ciscoL3Cnt', type: 'number' },
						{ name: 'piolinkL2Cnt', type: 'number' },
						{ name: 'piolinkL3Cnt', type: 'number' }
					]
				},
				{
					formatData: function(data) {
						var params = Main.getCommParams();
						$.extend(data, params, HmBoxCondition.getSrchParams());
						return data;
					},
				}
			),
			columns:
			[
				{ text : '', datafield: 'devKind1', width: 80, hidden: true   },
				{ text : '장비번호', datafield: 'mngNo', width: 80, hidden: true  },
				{ text : '그룹명', datafield: 'grpName', minwidth : 130, columngroup: 'devInfo' ,cellclassname: Main.status,},
				{ text : '장비명', datafield: 'devName', minwidth : 150, cellsrenderer: HmGrid.devNameRenderer  , columngroup: 'devInfo' ,cellclassname: Main.status},
				{ text : '사용자 장비명', datafield: 'userDevName', minwidth : 150, cellsrenderer: HmGrid.devNameRenderer , columngroup: 'devInfo' ,cellclassname: Main.status} ,
				{ text:  '장비IP', datafield: 'devIp', width: 120 , columngroup: 'devInfo' ,cellclassname: Main.status },
				{ text:  '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' , columngroup: 'devInfo'  ,cellclassname: Main.status},
				{ text : '종류', datafield: 'devKind2', width: 130 , filtertype: 'checkedlist' ,columngroup: 'devInfo'  ,cellclassname: Main.status },
				{ text:  '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' , columngroup: 'devInfo' ,cellclassname: Main.status },
				{ text:  '시리얼NO', datafield: 'machineSerial', width: 130 , columngroup: 'devInfo' ,cellclassname: Main.status},
				{ text:  'OS버전', datafield: 'machineVer', width: 130  , columngroup: 'devInfo' ,cellclassname: Main.status },
				{ text:  '컨피그 백업일자', datafield: 'configBakYmd', width: 130  , columngroup: 'devInfo' ,cellclassname: Main.status },
				{ text:  "회선수", datafield: "ifCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'devInfo' ,cellclassname: Main.status },
				{ text:  "전체장비수", datafield: "devCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'devInfo'  ,cellclassname: Main.status},
				{ text:  "CISCO", datafield: "ciscoCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'vendorInfo' ,cellclassname: Main.status },
				{ text:  "PIOLINK", datafield: "piolinkCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'vendorInfo'  ,cellclassname: Main.status},
				{ text:  "ATM", datafield: "atmCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status },
				{ text:  "IPS", datafield: "ipsCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'devKind2Info' ,cellclassname: Main.status },
				{ text:  "L2_SWITCH", datafield: "l2Cnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status},
				{ text:  "L3_SWITCH", datafield: "l3Cnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'devKind2Info' ,cellclassname: Main.status },
				{ text:  "L4_SWITCH", datafield: "l4Cnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status},
				{ text:  "BACKBONE", datafield: "backboneCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'devKind2Info'  ,cellclassname: Main.status},
				{ text:  "ROUTER", datafield: "routerCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status},
				{ text:  "FIREWALL", datafield: "firwerCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status},
				{ text:  "미분류", datafield: "etcCnt", width: 100, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'devKind2Info' ,cellclassname: Main.status},
				{ text:  "CISCO L2_SWITCH", datafield: "ciscoL2Cnt", width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'vendorSwitch' ,cellclassname: Main.status },
				{ text:  "CISCO L3_SWITCH", datafield: "ciscoL3Cnt", width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'vendorSwitch'  ,cellclassname: Main.status},
				{ text:  "PIOLINK L2_SWITCH", datafield: "piolinkL2Cnt", width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number"  , columngroup: 'vendorSwitch' ,cellclassname: Main.status},
				{ text:  "PIOLINK L3_SWITCH", datafield: "piolinkL3Cnt", width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number" , columngroup: 'vendorSwitch' ,cellclassname: Main.status },
			],
			columngroups:
			[
				{ text: '장비', align: 'center', name: 'devInfo' },
				{ text: '제조사별', align: 'center', name: 'vendorInfo' },
				{ text: '장비종류 분류', align: 'center', name: 'devKind2Info' },
				{ text: '제조사별 스위치 종류', align: 'center', name: 'vendorSwitch' },
			]
		}, CtxMenu.NONE);
		$devGrid.on('rowdoubleclick', function(event) {
			dtl_mngNo = event.args.row.bounddata.mngNo;
			dtl_devName = event.args.row.bounddata.disDevName;
			Main.searchDtlInfo();
		})
			.on('bindingcomplete', function(event) {
				try {
					//$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'disDevName');
					Main.searchDtlInfo();
				} catch(e) {}
			});

		$devGrid.on('contextmenu', function() { return false; })
			.on('rowclick', function(event) {
				if(event.args.rightclick) {
					$('#ctxmenu_dev, #ctxmenu_grp').jqxMenu('close');
					var targetMenu = null;
					$devGrid.jqxGrid('selectrow', event.args.rowindex);
					var rowdata = $devGrid.jqxGrid('getrowdata', event.args.rowindex);
					if(rowdata.mngNo != -1){
						targetMenu = $('#ctxmenu_dev');
					}else{
						targetMenu = $('#ctxmenu_grp');
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
		$('#ctxmenu_dev, #ctxmenu_grp').jqxMenu({
			width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999
		}).on('itemclick', function(event) {
			CtxMenu.itemClick($(event.args)[0].id, $devGrid, 'grid',$(event.args)[0].value);
		});
		HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.searchDev, { devKind1: 'DEV' });
		$('#section').css('display', 'block');


	},

	/** init data */
	initData: function() {

	},

	/** 공통 파라미터 */
	getCommParams: function() {
		var params = Master.getDefGrpParams();
		return params;
	},
	/** 장비 조회 */
	searchDev: function() {
		HmGrid.updateBoundData($devGrid, ctxPath + '/ksa/nms/devCpst/getDevCpstList.do');
	},

	/** 상세정보 */
	searchDtlInfo: function() {
		PMain.search();
	},

	exportExcel: function() {
		HmUtil.exportGrid($devGrid, '장비구성정보', false);
	},
	status: function(row, column, value, data) {
		var cellVal = $devGrid.jqxGrid('getcellvalue', row, "mngNo");
		if(cellVal == '-1'){
			return 'gray'
		}else{
			return ''
		}
	},

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});