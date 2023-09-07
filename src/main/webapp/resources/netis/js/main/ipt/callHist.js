var $callHistGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$callHistGrid = $('#callHistGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.selectTree);
			
			HmGrid.create($callHistGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							// 필터위해 미리 추가
							// datafields:[
                             //    { name:'mngNo', type:'number' },
                             //    { name:'iptName', type:'string' },
                             //    { name:'iptIp', type:'string' },
                             //    { name:'iptMac', type:'string' },
                             //    { name:'sendTelNo', type:'string' },
                             //    { name:'finalRecvNum', type:'string' },
                             //    { name:'startYmdhms', type:'string' },
                             //    { name:'endYmdhms', type:'string' },
                             //    { name:'callDuration', type:'string' },
                             //    { name:'jitter', type:'string' },
                             //    { name:'delay', type:'string' },
                             //    { name:'loss', type:'string' },
                             //    { name:'avgMos', type:'string' },
							// ]
						},
						{
							formatData: function(data) {
								var params = Master.getGrpTabParams();
								$.extend(data, params);
								return data;
							}
						}
				),
				columns:
				[
					{ text: '장비번호', datafield: 'mngNo', width: 80, hidden: true },
					{ text: '전화기명', datafield: 'iptName', minwidth: 150, pinned: true }, 
					{ text: 'IP', datafield: 'iptIp', width: 120 },
					{ text: 'MAC', datafield: 'iptMac', width: 150 },
					{ text: '전화번호', datafield: 'sendTelNo', width: 130 },
					{ text: '상대번호', datafield: 'finalRecvNum', width: 100 },
					{ text: '통화시작', datafield: 'startYmdhms', width: 100 },
					{ text: '통화종료', datafield: 'endYmdhms', width: 120 },
					{ text: '지속시간', datafield: 'callDuration', width: 120 },
					{ text: 'Jitter', datafield: 'jitter', width: 120 },
					{ text: 'Delay', datafield: 'delay', width: 120 },
					{ text: 'Loss', datafield: 'loss', width: 140 },
					{ text: 'Mos', datafield: 'avgMos', width: 120 }
			    ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		refresh: function() {
			this.search();
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		search: function() {
			HmGrid.updateBoundData($callHistGrid, ctxPath + '/main/ipt/callHistMgmt/getCallMgrMgmtList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getGrpTabParams();
			
			HmUtil.exportExcel(ctxPath + '/main/ipt/callHistMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});