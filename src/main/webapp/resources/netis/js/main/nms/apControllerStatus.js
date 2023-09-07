var $apControllerGrid;
var dtl_mngNo = -1;
var dtl_devName = '';
var Main = {
		/** variable */
		initVariable: function() {
			$apControllerGrid = $('#apControllerGrid');
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
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '45%', collapsible: false }, { size: '55%' }], 'auto', '100%');
			Master.createGrpTab(Main.selectTree);

			HmGrid.create($apControllerGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getGrpTabParams());
								return data;
							},beforeLoadComplete: function(records) {
								return records;
							}
						}
				),
				columns:
				[
				 	{ text: '장비 번호', datafield: 'mngNo', width: 100, hidden:true },
				 	{ text: '그룹명', datafield: 'grpName', width: 150 },
				 	{ text: '컨트롤러명', datafield: 'devName', minwidth: 120, cellsrenderer: HmGrid.apcNameRenderer },
				 	{ text: 'IP', datafield: 'devIp', width: 120},
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
					{ text: 'AP수', datafield: 'apCnt', width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number" },
					{ text: 'Alive수', datafield: 'aliveApCnt', width: 120, cellsformat: "n", cellsalign: "right", filtertype: "number" },
					{ text: "CPU사용률", datafield: "cpuPer", width: 100, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
					{ text: "메모리사용률", datafield: "memPer", width: 110, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
					{ text: '시리얼', datafield: 'machineSerial', width: 130 },
					{ text: 'OS버전', datafield: 'machineVer', width: 130 }
				 ]
			}, CtxMenu.APC);
			$apControllerGrid.on('rowdoubleclick', function(event) {
				console.log('event.args.row.bounddata',event.args.row.bounddata)
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_devName = event.args.row.bounddata.devName;
				Main.searchDtlInfo();
			})
				.on('bindingcomplete', function(event) {
					try {
						$(this).jqxGrid('selectrow', 0);
						dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
						dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'devName');
						Main.searchDtlInfo();
					} catch(e) {}
				});

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		/** 공통 파라미터 */
		// getCommParams: function() {
		// 	var params = Master.getGrpTabParams();
		// 	return params;
		// },
		/** 조회 */
		search: function() {
			var params = Master.getApGrpParams();
			if(params.grpType == 'FILTER'){
				if(params.filterFlag){
					Main.searchIf();
				}else{
					alert('선택된 필터가 없습니다.');
					// $('#apCnt').text('AP 상태 : '+ 0 +'/'+ 0 +' (up/전체)');
					$apControllerGrid.jqxGrid('clear');
				}
			}else{
				Main.searchIf();
			}
		},
		searchIf: function(){
			HmGrid.updateBoundData($apControllerGrid, ctxPath + '/main/nms/apControllerStatus/getApControllerStatusList.do');
		},

		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($apControllerGrid, 'AP Controller현황', false);
		},

		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		},
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});