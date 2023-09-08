var $devGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$devGrid = $('#devGrid');
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
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},
		
		/** init design */
		initDesign: function() {
			//검색바 호출.
			Master.createSearchBar1('','',$("#srchBox"));

			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.search);
			
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [
						            { name: 'mngNo', type: 'number' },
									{ name: 'grpNo', type: 'number' },
									{ name: 'grpName', type: 'string' },
									{ name: 'disDevName', type: 'string' },
									{ name: 'devName', type: 'string' },
									{ name: 'devIp', type: 'string' },
									{ name: 'devKind1', type: 'string' },
									{ name: 'devKind2', type: 'string' },
									{ name: 'model', type: 'string' },
									{ name: 'vendor', type: 'string' }
				             ]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				columns:
				[
					{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true },
					{ text: '그룹명', datafield: 'grpName', width : 150, pinned: true },
					{ text: '장비명', datafield: 'disDevName', width : 200, pinned: true },
					{ text: '장비IP', datafield: 'devIp', width: 120 },
					{ text: '타입', datafield: 'devKind1', width: 100, cellsrenderer: HmGrid.devKind1renderer},
					{ text: '장비종류', datafield: 'devKind2', width: 130, filtertype: 'checkedlist' },
					{ text: '제조사', datafield: 'vendor', width: 150, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', minwidth: 180, filtertype: 'checkedlist' }
				 ]
			}, CtxMenu.DEV10);

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			
		},
		
		getCommParams: function() {
			var params = Master.getGrpTabParams();

			params.sIp =Master.getSrchIp();
			params.sDevName =Master.getSrchDevName();

			return params;
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/oms/overallStatus/getOverallStatusList.do');
		},
		
		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportExcel(ctxPath + '/main/oms/overallStatus/export.do', Main.getCommParams());
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});