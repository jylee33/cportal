var $phoneGrpGrpGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$phoneGrpGrid = $('#phoneGrpGrid');
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
			case 'btnAdd': this.addIptGrpRange(); break;
			case 'btnEdit': this.editIptGrpRange(); break;
			case 'btnDel': this.delIptGrpRange(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'VGW' });
			
			HmGrid.create($phoneGrpGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							// 필터위해 미리 추가
							datafields:[
                                { name:'codeSeq', type:'number' },
                                { name:'company', type:'string' },
                                { name:'grpNo', type:'string' },
                                { name:'range1', type:'string' },
                                { name:'range2', type:'string' },
                                { name:'memo', type:'string' },
							]
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
					{ text: 'SEQ', datafield: 'codeSeq', width: 80, hidden: true },
					{ text: '구분', datafield: 'company', width: 150 },
					{ text: '그룹', datafield: 'grpNo', minwidth: 150 },
					{ text: '전화번호 또는 IP대역 From', datafield: 'range1', width: 200 },
					{ text: '전화번호 또는 IP대역 To', datafield: 'range2', width: 200 },
					{ text: '메모', datafield: 'memo', width: 300 }
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
			HmGrid.updateBoundData($phoneGrpGrid, ctxPath + '/main/ipt/ipPhoneGrpMgmt/getIpPhoneGrpMgmtList.do');
		},
		
		/** 추가 */
		addIptGrpRange: function() {
			$.get(ctxPath + '/main/popup/ipt/pIptGrpRangeAdd.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '전화기 대역 추가', result, 400, 324);
					}
			);
		},
		
		/** 수정 */
		editIptGrpRange: function() {
			
		},
		
		/** 삭제 */
		delIptGrpRange: function() {
			
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getDefGrpParams($('#dGrpTreeGrid'));
			HmUtil.exportExcel(ctxPath + '/main/ipt/ipPhoneGrpMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});