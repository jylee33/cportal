var $priShareGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$priShareGrid = $('#priShareGrid');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('');
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
			case 'btnCList': this.showChartData(); break;
			case 'btnCSave': this.saveChart(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });
			
			HmGrid.create($priShareGrid, {
				source: new $.jqx.dataAdapter(
						{
                            datatype: 'json',
                            // 필터위해 미리 추가
                            // datafields:[
                            //     { name:'mngNo', type:'number' },
                            //     { name:'grpName', type:'string' },
                            //     { name:'devName', type:'string' },
                            //     { name:'devIp', type:'string' },
                            //     { name:'model', type:'string' },
                            //     { name:'vendor', type:'string' },
                            //     { name:'port', type:'number' },
                            //     { name:'channelNo', type:'number' },
                            //     { name:'usedDs0Count', type:'number' },
                            // ]
                        },
						{
							formatData: function(data) {
								var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
								$.extend(data, params, HmBoxCondition.getPeriodParams());

								return data;
							}
						}
				),
				columns:
				[
				 	{ text : '장비번호', datafield: 'mngNo', width: 60, hidden: true },
				 	{ text : '그룹', datafield: 'grpName', width: 140 },
					{ text : '장비명', datafield: 'devName', minwidth: 150 },
					{ text : 'IP', datafield: 'devIp', width: 130 },
					{ text : '모델', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text : '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text : '포트번호', datafield: 'port', width: 100, cellsalign: 'right' },
					{ text : '채널번호', datafield: 'channelNo', width: 100, cellsalign: 'right' },
					{ text : '총통화점유횟수', datafield: 'usedDs0Count', width: 120, cellsalign: 'right', cellsformat: 'n' }
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
			/*Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($priShareGrid, ctxPath + '/main/ipt/priShareMgmt/getPriShareMgmtList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
			HmUtil.exportExcel(ctxPath + '/main/ipt/priShareMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});