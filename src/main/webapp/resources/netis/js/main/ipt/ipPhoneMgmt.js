var $ipPhoneGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$ipPhoneGrid = $('#ipPhoneGrid');
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
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });
			
			HmGrid.create($ipPhoneGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							// 필터위해 미리 추가
							// datafields:[
                             //    { name:'mngNo', type:'number' },
                             //    { name:'grpName', type:'string' },
                             //    { name:'iptUser', type:'string' },
                             //    { name:'iptName', type:'string' },
                             //    { name:'iptMac', type:'string' },
                             //    { name:'iptDesc', type:'string' },
                             //    { name:'iptTelNo', type:'string' },
                             //    { name:'iptProtocol', type:'string' },
                             //    { name:'iptStatus', type:'string' },
                             //    { name:'iptTypeIdx', type:'string' },
                             //    { name:'iptModel', type:'string' },
                             //    { name:'loadId', type:'string' },
                             //    { name:'iptIp', type:'string' },
                             //    { name:'memo', type:'string' },
                             //    { name:'lastRegTime', type:'string' },
							// ]
						},
						{
							formatData: function(data) {
								var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
								$.extend(data, params);
								return data;
							}
						}
				),
                columns:
				[
					{ text: '장비번호', datafield: 'mngNo', width: 80, hidden: true },
					{ text: '그룹', datafield: 'grpName', width: 150, pinned: true }, 
					{ text: '사용자명', datafield: 'iptUser', width: 120, pinned: true },
					{ text: '전화기명', datafield: 'iptName', width: 150, pinned: true },
					{ text: 'MAC', datafield: 'iptMac', width: 130 },
					{ text: '별칭', datafield: 'iptDesc', width: 100 },
					{ text: '전화기 번호', datafield: 'iptTelNo', width: 100 },
					{ text: '프로토콜', datafield: 'iptProtocol', width: 120 },
					{ text: '상태', datafield: 'iptStatus', width: 120 },
					{ text: '타입', datafield: 'iptTypeIdx', width: 120 },
					{ text: '모델', datafield: 'iptModel', width: 140, filtertype: 'checkedlist' },
					{ text: 'Load Id', datafield: 'loadId', width: 120 },
					{ text: 'IP', datafield: 'iptIp', width: 120 },
					{ text: '메모', datafield: 'memo', width: 120 },
					{ text: '마지막 등록 시간', datafield: 'lastRegTime', width: 120 }
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
			HmGrid.updateBoundData($ipPhoneGrid, ctxPath + '/main/ipt/ipPhoneMgmt/getIpPhoneMgmtList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
			HmUtil.exportExcel(ctxPath + '/main/ipt/ipPhoneMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});