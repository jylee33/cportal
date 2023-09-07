var $ssidGrid, $apGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$ssidGrid = $('#ssidGrid'), $apGrid = $('#apGrid');
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

			// HmTreeGrid.create($('#dGrpTreeGrid'), HmTree.T_AP_GRP_DEFAULT, Main.selectTree);

			Master.createApGrpTab(Main.selectTree);
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], '100%', '100%');
		
	    	HmGrid.create($ssidGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [

					             { name: 'grpName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'devKind2', type: 'string' },
					             { name: 'apSsid', type: 'string' }

				             ]
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getApGrpParams());
								return data;
							}
						}
				),
				pageable: false,
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, 'SSID 리스트');
			    },
				columns: 
				[
				 	{ text: 'SSID 명', datafield: 'apSsid', width: '25%' },
					{ text: '컨트롤러명', datafield: 'devName', width: '30%' },
					{ text: '컨트롤러 IP', datafield: 'devIp', width: '20%' },
					{ text: '그룹명', datafield: 'grpName', width: '25%' }
				 ]
			});

	    	$ssidGrid.on('rowdoubleclick' ,function(event){
	    		Main.searchAp();
	    	});
	    	
			HmGrid.create($apGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [
					             { name: 'apNo', type: 'number' },
					             { name: 'apName', type: 'string' },
					             { name: 'apMac', type: 'string' },
					             { name: 'apIp', type: 'string' },
					             { name: 'apModel', type: 'string' },
					             { name: 'apType', type: 'string' },
					             { name: 'apSerial', type: 'string' },
					             { name: 'apStatus', type: 'string' },
					             { name: 'apUptime', type: 'string' },
					             { name: 'apLocation', type: 'string' },
					             { name: 'numConn', type: 'number' },
					             { name: 'rxByte', type: 'number' },
					             { name: 'txByte', type: 'number' },
					             { name: 'apVendor', type: 'string' },
					             { name: 'apBand', type: 'string' },
					             { name: 'apCpuLoad', type: 'number' },
					             { name: 'apMemLoad', type: 'number' }
				             ]
						},
						{
							formatData: function(data) {
								// var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
								// data.grpNo = treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0;
								// data.itemKind = treeItem !== null? treeItem.devKind2 : 'GROUP';
								var rowId = HmGrid.getRowIdx($ssidGrid);
								data.apSsid = rowId !== false? $ssidGrid.jqxGrid('getrowdata', rowId).apSsid : null;
								$.extend(data, Master.getApGrpParams());
								return data;
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, 'AP 현황');
			    },
				columns:
				[
					{ text: 'AP 명', datafield: 'apName', width: 150, pinned: true },
					{ text: 'AP Mac', datafield: 'apMac', width: 120, pinned: true },
					{ text: 'AP IP', datafield: 'apIp', width: 120, pinned: true },
					{ text: '접속 Client 수 ', datafield: 'numConn', width: 100, cellsalign: 'right', cellsformat: 'd' },
					{ text: 'AP Band', datafield: 'apBand', width: 100 },
					{ text: 'AP 모델', datafield: 'apModel', width: 130, filtertype: 'checkedlist' },
					{ text: 'AP 타입', datafield: 'apType', width: 130, filtertype: 'checkedlist' },
					{ text: 'AP 벤더', datafield: 'apVendor', width: 130, filtertype: 'checkedlist' },
					{ text: 'AP 시리얼 번호', datafield: 'apSerial', width: 120 },
					{ text: "AP 상태", datafield: "apStatus", width: 80, cellsrenderer: HmGrid.apStatusrenderer },
					{ text: "AP 구동시간", datafield: "apUptime", width: 140, cellsrenderer: HmGrid.cTimerenderer },
					{ text: "AP 설치 위치", datafield: "apLocation", width: 130 },
					{ text: "수신 Byte", datafield: "rxByte", width: 100, cellsrenderer: HmGrid.unit1024renderer },
					{ text: "송신 Byte", datafield: "txByte", width: 100, cellsrenderer: HmGrid.unit1024renderer },
					{ text: "CPU", datafield: "apCpuLoad", width: 100, cellsalign: 'right' },
					{ text: "MEMORY", datafield: "apMemLoad", width: 100, cellsalign: 'right' }
				 ]
			}, CtxMenu.AP);
				
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		search: function() {
			var params = Master.getApGrpParams();
			if(params.grpType == 'FILTER'){
				if(params.filterFlag){
					Main.searchSSID();
				}else{
					alert('선택된 필터가 없습니다.');
					$ssidGrid.jqxGrid('clear');
				}
			}else{
				Main.searchSSID();
			}
		},
		
		/** SSID 조회 */
		searchSSID: function() {
			$apGrid.jqxGrid('clear');
			HmGrid.updateBoundData($ssidGrid, ctxPath + '/main/nms/apSsid/getApSsidList.do');
		},
		
		/** AP현황 조회 */
		searchAp: function() {
			HmGrid.updateBoundData($apGrid, ctxPath + '/main/nms/apSsid/getApStatusList.do');
		},
		
		/** export 엑셀 */
		exportExcel: function() {
			HmUtil.exportGrid($apGrid, 'SSID현황', false);
//			var treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid'));
//			var params = {
//					grpNo: treeItem !== null? treeItem.devKind2 == 'GROUP' ? treeItem.grpNo : treeItem.grpNo.split('_')[1] : 0,
//					itemKind: treeItem != null? treeItem.devKind2 : 'GROUP'
//			};
//			HmUtil.exportExcel(ctxPath + '/main/nms/apSsid/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});