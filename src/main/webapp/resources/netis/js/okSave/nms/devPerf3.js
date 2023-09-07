var $leftTab, $dGrpTreeGrid, $sGrpTreeGrid;
var $devGrid;
var $dtlTab, $ifGrid, $evtGrid, $moduleGrid;
var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_devName = '';

var Main = {
	/** variable */
	initVariable: function() {
		$leftTab = $('#leftTab');
		$dGrpTreeGrid = $('#dGrpTreeGrid'), $sGrpTreeGrid = $('#sGrpTreeGrid');
		$devGrid = $('#devGrid');
		this.initCondition();
	},

	initCondition: function() {
		HmBoxCondition.createPeriod('');
		HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
		HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

		/** 장비 그리드 */
		HmGrid.create($devGrid, {
			source: new $.jqx.dataAdapter(
				{
					datatype: 'json',
					type: 'post',
					contenttype: 'application/json;charset=utf8;',
					datafields:[ // 필터위해 추가
                        { name:'grpName', type:'string' },
                        { name:'mngNo', type:'string' },
                        { name:'disDevName', type:'string' },
                        { name:'devIp', type:'string' },
                        { name:'devKind1', type:'string' },
                        { name:'devKind2', type:'string' },
                        { name:'vendor', type:'string' },
                        { name:'model', type:'string' },
                        { name:'cpuMax', type:'number' },
                        { name:'cpuCurrency', type:'number' },
                        { name:'cpuAvg', type:'number' },
                        { name:'memMax', type:'number' },
                        { name:'memCurrency', type:'number' },
                        { name:'memAvg', type:'number' },
                        { name:'tempMax', type:'number' },
                        { name:'tempCurrency', type:'number' },
                        { name:'tempAvg', type:'number' },
                        { name:'crc', type:'number' },
                        { name:'inError', type:'number' },
                        { name:'outError', type:'number' },
					]
				},
				{
					formatData: function(data) {
						$.extend(data, Master.getGrpTabParams(), HmBoxCondition.getPeriodParams(),
							HmBoxCondition.getSrchParams(), {mngNo: -1});
						return JSON.stringify(data);
					},
					loadComplete: function(records) {
						// dtl_mngNo = -1; // 왜 -1?
						// dtl_devName = '';
					}
				}
			),
			columns:
			[
				{ text : '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 150 },
				{ text : '장비번호', columngroup: 'devInfo', datafield: 'mngNo', width: 100, hidden: true },
				{ text : '장비명', columngroup: 'devInfo', datafield: 'disDevName', width: 150, cellsrenderer: HmGrid.devNameRenderer },
				{ text : 'IP', columngroup: 'devInfo', datafield: 'devIp', width: 120 },
				{ text : '타입', columngroup: 'devInfo', datafield: 'devKind1', width: 100, hidden: true },
				{ text : '장비종류', columngroup: 'devInfo', datafield: 'devKind2', width: 130 },
				{ text : '제조사', columngroup: 'devInfo', datafield: 'vendor', width: 130 },
				{ text : '모델', columngroup: 'devInfo', datafield: 'model', width: 180 },
				{ text : '최대', columngroup: 'cpu', datafield: 'cpuMax', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '현재', columngroup: 'cpu', datafield: 'cpuCurrency', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '평균', columngroup: 'cpu', datafield: 'cpuAvg', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '최대', columngroup: 'mem', datafield: 'memMax', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '현재', columngroup: 'mem', datafield: 'memCurrency', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '평균', columngroup: 'mem', datafield: 'memAvg', width: 80, cellsrenderer: HmGrid.progressbarrenderer },
				{ text : '최대', columngroup: 'temp', datafield: 'tempMax', width: 80, cellsalign: 'right' },
				{ text : '현재', columngroup: 'temp', datafield: 'tempCurrency', width: 80, cellsalign: 'right' },
				{ text : '평균', columngroup: 'temp', datafield: 'tempAvg', width: 80, cellsalign: 'right' },
				{ text : 'Crc', columngroup: 'crc', datafield: 'crc', width: 80, cellsalign: 'right' },
				{ text : 'OUT', columngroup: 'error', datafield: 'inError', width: 80, cellsalign: 'right' },
				{ text : 'IN', columngroup: 'error', datafield: 'outError', width: 80, cellsalign: 'right' }
			],
			columngroups:
			[
				{ text: '장비정보', align: 'center', name: 'devInfo' },
				{ text: 'CPU', align: 'center', name: 'cpu' },
				{ text: 'MEMORY', align: 'center', name: 'mem' },
				{ text: '온도(℃)', align: 'center', name: 'temp' },
				{ text: 'CRC(개수)', align: 'center', name: 'crc' },
				{ text: 'ERROR(개수)', align: 'center', name: 'error' }
			]
		}, CtxMenu.DEV, ctxmenuIdx++);
		$devGrid.on('rowdoubleclick', function(event) {
			dtl_mngNo = event.args.row.bounddata.mngNo;
			dtl_devName = event.args.row.bounddata.disDevName;
			Main.searchDtlInfo();
		})
			.on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'disDevName');
					Main.searchDtlInfo();
				} catch(e) {}
			});

		// 좌측 탭영역
		Master.createGrpTab(Main.searchDev, {devKind1: 'DEV'});
		$('#section').css('display', 'block');
	},

	/** init data */
	initData: function() {

	},

	/** 장비 조회 */
	searchDev: function() {
		HmGrid.updateBoundData($devGrid, ctxPath + '/okSave/nms/devPerf3/getDevReportList.do');
	},

	/** 상세정보 */
	searchDtlInfo: function() {
		PMain.search();
	},

	exportExcel: function() {
		HmUtil.exportGrid($devGrid, '장비성능', false);
	}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});