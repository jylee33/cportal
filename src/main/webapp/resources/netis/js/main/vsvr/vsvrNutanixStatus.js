var $grpTree, $hostGrid;
var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_devName = '';

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $hostGrid = $('#hostGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchHost(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind1: 'VSVR' });

			HmGrid.create($hostGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',

						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {

							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
				 	{ text: '서버번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true },
				 	{ text: '그룹', datafield: 'grpName', width : 130, pinned: true }, 
				 	{ text: '호스트명', datafield: 'devName', minwidth : 130, pinned: true },
				 	{ text: '서버명', datafield: 'svrName', minwidth : 130, pinned: true, cellsrenderer: HmGrid.nutanixVsvrNameRenderer }, // userDevName이 있으면 서버명에 보여주고 없으면 devName...
					{ text: 'IP', datafield: 'devIp', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text: 'OS', datafield: 'os', width: 130 },
					{ text: 'OS 버전', datafield: 'osVer', width: 80 },
					{ text: 'CPU (%)', datafield: 'usedCpuPer', width: 80, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer},
					{ text: 'CPU Capacity', datafield: 'totalCpu', width: 100,  cellsformat: "d", cellsrenderer: HmGrid.unitHzRenderer},
					{ text: 'MEM (%)', datafield: 'usedMemoryPer', width: 80, cellsformat: "d", cellsalign: "right", filtertype: "number", cellsrenderer:HmGrid.progressbarrenderer },
					{ text: 'Memory Capacity', datafield: 'totalMemory', width: 100,  cellsformat: "d", cellsrenderer: HmGrid.unit1024renderer},
					{ text: '파워상태', datafield: 'powerState', width: 80, cellsalign: 'center' },
					{ text: 'CPU 코어 수', datafield: 'cores', width: 100, cellsalign: 'right' },
					{ text: 'CPU Hz', datafield: 'freequency', width: 100,  cellsformat: "d", cellsrenderer: HmGrid.unitHzRenderer},
					{ text: 'CPU 모델', datafield: 'cpuModel', width: 200 },
					{ text: 'CPU 소켓당 코어 수', datafield: 'socketCore', width: 130, cellsalign: 'right' }
					// { text: 'Disk (%)', datafield: 'memoryCapacity', width: 100,  cellsformat: "d"},
					// { text: 'Disk', datafield: 'memoryCapacity', width: 100,  cellsformat: "d", cellsrenderer: HmGrid.unitHzRenderer},
				]
			}, CtxMenu.VSVR_NUTANIX, ctxmenuIdx++);
			$hostGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_devName = event.args.row.bounddata.svrName;
				Main.searchDtlInfo();
			}).on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'svrName');
					Main.searchDtlInfo();
				} catch(e) {}
			});


			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.searchHost();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams();
			return params;
		},
		
		/** 가상서버 조회 */
		searchHost: function() {
			HmGrid.updateBoundData($hostGrid, ctxPath + '/main/vsvr/vsvrNutanixStatus/getHostStatusList.do');
		},
		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		}

		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});