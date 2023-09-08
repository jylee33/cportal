var $clientGrid;
var timer;
var _columns = [
	{ text: '그룹명', datafield: 'grpName', width: 150, pinned: true },
	{ text: 'AP 명', datafield: 'apName', width: 150, pinned: true, cellsrenderer: HmGrid.apNameRenderer },
	{ text: 'SSID 명', datafield: 'apSsid', width: 120, pinned: true },
	{ text: '접속자 또는 디바이스명', datafield: 'connName', minwidth: 100, cellsrenderer: HmGrid.apClientRenderer },
	{ text: '접속 시작 시간', datafield: 'connStartTime', width: 120, cellsalign: 'center', hidden: true  },
	{ text: '접속 종료 시간', datafield: 'connEndTime', width: 120, hidden: true },
	{ text: '접속 유지 시간', datafield: 'connStayTime', width: 120, cellsrenderer: HmGrid.cTimerenderer },
	{ text: '접속자 IP', datafield: 'connIp', width: 100, cellsalign: 'center' },
	{ text: '접속자 MAC', datafield: 'connMac', width: 120, cellsalign: 'center' },
	{ text: '접속자 수신Byte', datafield: 'connRxByte', width: 120, cellsrenderer: HmGrid.unit1024renderer },
	{ text: '접속자 송신Byte', datafield: 'connTxByte', width: 120, cellsrenderer: HmGrid.unit1024renderer },
	{ text: '접속자 ID', datafield: 'connId', width: 150 }
];

var Main = {
		/** variable */
		initVariable: function() {
			$cbPeriod = $('#cbPeriod');
			$clientGrid = $('#clientGrid');
			this.initCondition();
		},

		initCondition: function() {
			HmBoxCondition.createPeriod('', Main.search, timer);
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			// HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);
			Master.createApGrpTab(Main.selectTree);

			HmGrid.create($clientGrid, {
				source: new $.jqx.dataAdapter(
						{
							// type: 'POST',
							// contenttype: 'application/json; charset=utf-8',
							datatype: 'json',
							datafields: [
					             { name: 'grpName', type: 'string' },
					             { name: 'apName', type: 'string' },
					             { name: 'apNo', type: 'number' },
					             { name: 'apSubNo', type: 'number' },
					             { name: 'apIdx', type: 'string' },
					             { name: 'apConnIdx', type: 'string' },
					             { name: 'apSsid', type: 'string' },
					             { name: 'connId', type: 'string' },
					             { name: 'connName', type: 'string' },
					             { name: 'connIp', type: 'string' },
					             { name: 'connMac', type: 'string' },
					             { name: 'yyyymmdd', type: 'string' },
					             { name: 'ymdhms', type: 'string' },
					             { name: 'connStartTime', type: 'string' },
					             { name: 'connStayTime', type: 'number' },
					             { name: 'connEndTime', type: 'string' },
					             { name: 'connRxByte', type: 'string' },
					             { name: 'connTxByte', type: 'string' },
					             { name: 'connDevType', type: 'string' },
					             { name: 'connOsType', type: 'string' },
					             { name: 'lastUpd', type: 'string' }
				             ]
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getApGrpParams(), HmBoxCondition.getPeriodParams());
								return data;
							}
						}
				),
				columns: _columns
			}, CtxMenu.AP_CLIENT);
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {

			var params = Master.getApGrpParams();
			if(params.grpType =='FILTER'){
				if(params.filterFlag){
					Main.searchIf();
					//Main.searchAp();
				}else{
					alert('선택된 필터가 없습니다.');
					$clientGrid.jqxGrid('clear');
				}
			}else{
					Main.searchIf();
                	//Main.searchAp();
            }


		},
		searchIf: function(){
			var params = HmBoxCondition.getPeriodParams();
			$clientGrid.jqxGrid('source')._source.url = null;
			var _svcUrl = params.period == 0? 'getClientList.do' : 'getClientHistList.do';

			$clientGrid.jqxGrid(params.period == 0 ? 'hidecolumn':'showcolumn', 'connEndTime');

			HmGrid.updateBoundData($clientGrid, ctxPath + '/main/nms/apClients/' + _svcUrl);
		},

		searchAp: function(){

		},

		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($clientGrid, 'Client현황', false);
		}

};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});