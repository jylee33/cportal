var $callMgrGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$callMgrGrid = $('#callMgrGrid');
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
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'IPT' });
			
			HmGrid.create($callMgrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							// 필터위해 미리 추가
							// datafields:[
                             //    { name:'mngNo', type:'number' },
                             //    { name:'disDevName', type:'string' },
                             //    { name:'devIp', type:'string' },
                             //    { name:'model', type:'string' },
                             //    { name:'vendor', type:'string' },
                             //    { name:'curH323Cnt', type:'number' },
                             //    { name:'curSipCnt', type:'number' },
                             //    { name:'regCtiCnt', type:'number' },
                             //    { name:'regGwCnt', type:'number' },
                             //    { name:'regMdCnt', type:'number' },
                             //    { name:'regPhoneCnt', type:'number' },
                             //    { name:'regVmdCnt', type:'number' },
                             //    { name:'unregCtiCnt', type:'number' },
                             //    { name:'unregGwCnt', type:'number' },
                             //    { name:'unregPhoneCnt', type:'number' },
                             //    { name:'unregVmdCnt', type:'number' },
                             //    { name:'rjtGwCnt', type:'number' },
                             //    { name:'rjtPhoneCnt', type:'number' },
                             //    { name:'rjtVmdCnt', type:'number' },
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
					{ text: '장비명', datafield: 'disDevName', minwidth: 150, pinned: true }, 
					{ text: '장비IP', datafield: 'devIp', width: 120 },
					{ text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: 'H323 Table 수', datafield: 'curH323Cnt', width: 100 },
					{ text: 'SIP Table 수', datafield: 'curSipCnt', width: 100 },
					{ text: 'CTI Device 수', columngroup: 'reg', datafield: 'regCtiCnt', width: 120 },
					{ text: 'Gateway 수', columngroup: 'reg', datafield: 'regGwCnt', width: 120 },
					{ text: 'Media Device 수', columngroup: 'reg', datafield: 'regMdCnt', width: 120 },
					{ text: 'Phone 수', columngroup: 'reg', datafield: 'regPhoneCnt', width: 120 },
					{ text: 'Voice Mail Device 수', columngroup: 'reg', datafield: 'regVmdCnt', width: 140 },
					{ text: 'CTI Device 수', columngroup: 'unreg', datafield: 'unregCtiCnt', width: 120 },
					{ text: 'Gateway 수', columngroup: 'unreg', datafield: 'unregGwCnt', width: 120 },
					{ text: 'Phone 수', columngroup: 'unreg', datafield: 'unregPhoneCnt', width: 120 },
					{ text: 'Voice Mail Device 수', columngroup: 'unreg', datafield: 'unregVmdCnt', width: 140 },
					{ text: 'Gateway 수', columngroup: 'rjt', datafield: 'rjtGwCnt', width: 120 },
					{ text: 'Phone 수', columngroup: 'rjt', datafield: 'rjtPhoneCnt', width: 120 },
					{ text: 'Voice Mail Device 수', columngroup: 'rjt', datafield: 'rjtVmdCnt', width: 140 }
			    ],
			    columngroups:
		    	[
		    	 	{ text: 'Reg', align: 'center', name: 'reg' },
		    	 	{ text: 'UnReg', align: 'center', name: 'unreg' },
		    	 	{ text: 'Reject', align: 'center', name: 'rjt' }
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
			HmGrid.updateBoundData($callMgrGrid, ctxPath + '/main/ipt/callMgrMgmt/getCallMgrMgmtList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
			HmUtil.exportExcel(ctxPath + '/main/ipt/callMgrMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});