var $grpTree, $vmGrid;

var dtl_mngNo = -1;
var dtl_vmId = -1;
var dtl_devName = '';
var ctxmenuIdx = 100;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $vmGrid = $('#vmGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchVm(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind1: 'VSVR' });

			HmGrid.create($vmGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
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
				columns:
				[
                    { text: '호스트명', datafield: 'svrName', minwidth: '120', pinned: true },
                    { text: 'VM IP', datafield: 'ipAddress', width: '110', pinned: true },
                    { text: 'VM 명', datafield: 'vmName', minwidth: '150'},
                    { text: 'VM GUID', datafield: 'vmUuid', width: '260' },
                    { text: '에이전트설치여부', datafield: 'svrAgentFlag', width: '270', hidden: true },
                    { text: '서버번호', datafield: 'svrMngNo', width: '270', hidden: true },
                    { text: '파워상태', datafield: 'powerState', width: '80', cellsalign: 'center' },
                    { text: 'CPU 수', datafield: 'cores', width: '70', cellsalign: 'right' },
                    { text: 'CPU (%)', datafield: 'usedCpu', width: '100', cellsrenderer: HmGrid.progressbarrenderer },
                    { text: '총 메모리', datafield: 'totalMemory', width: '80', cellsrenderer: HmGrid.unit1024renderer },
                    { text: '여유 메모리', datafield: 'freeMemory', width: '80', cellsrenderer: HmGrid.unit1024renderer },
                    { text: 'Guest 메모리 사용', datafield: 'usedMemory', width: '120', cellsrenderer: HmGrid.unit1024renderer }
				]
			}, CtxMenu.VM_NUTANIX, ctxmenuIdx++);
			$vmGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_vmId = event.args.row.bounddata.vmUuid;
				dtl_devName = event.args.row.bounddata.svrName;
				Main.searchDtlInfo();
			}).on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_vmId = $(this).jqxGrid('getcellvalue', 0, 'vmUuid');
					dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'svrName');
					Main.searchDtlInfo();
				} catch(e) {}
			});
            // $vmGrid.on('rowselect', function(event) {
			//  	dtl_mngNo = event.args.row.mngNo;
			//  	dtl_vmId = event.args.row.vmId;
			//  	Main.searchDtlInfo();
			//  });

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.searchVm();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams();
			return params;
		},
		
		/** 가상서버 조회 */
        searchVm: function() {
			HmGrid.updateBoundData($vmGrid, ctxPath + '/main/vsvr/vmNutanixStatus/getVmStatusList.do');
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