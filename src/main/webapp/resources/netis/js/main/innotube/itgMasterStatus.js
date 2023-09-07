var $grpTree, $rtuGrid;

var ctxmenuIdx = 1;
var dtl_mngNo = -1;
var dtl_devName = '';


var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $rtuGrid = $('#rtuGrid');
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
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {

			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'RTU' });
			
			HmGrid.create($rtuGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getDefGrpParams($grpTree));
								return data;
							},
							loadComplete: function(records) {
								curMasterRow = null;
								return records;
							}
						}
				),
				columns:
				[
                    {
                        text: '장애등급',
                        datafield: 'evtLevel',
                        width: 100,
                        cellsrenderer: HmGrid.evtLevelrenderer,
                        cellsalign: 'center'
                    },
					{ text : '장비번호', datafield: 'mngNo', width : 200, hidden: true },
					{ text : '그룹명', datafield: 'grpName', width : 300},
					{ text : '주장치명', datafield: 'devName', minwidth : 150 },
					{ text : 'IP', datafield: 'devIp', width : 200 },
					{ text : '설비수', datafield: 'sensorCnt', width : 200, cellsalign: 'right' },
					//{ text : '알람수', datafield: 'alarmCnt', width : 150 },
					//{ text : '설치위치', datafield: 'setupLoc', minwidth : 130 },
					//{ text : '최종수집일시', datafield: 'lastUpd', width : 150 }
			    ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$rtuGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_devName = event.args.row.bounddata.devName;
				Main.searchDtlInfo();
			}).on('bindingcomplete', function(event) {
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
		
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($rtuGrid, ctxPath + '/main/innotube/itgMasterStatus/getItgMasterStatusList.do');
		},

		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		},

		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($rtuGrid, '주장치현황', false);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});