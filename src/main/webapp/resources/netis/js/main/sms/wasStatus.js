var $grpTree, $wasGrid;
var timer;
var dtl_mngNo = -1;
var dtl_wasNo = -1;
var dtl_wasKind = '';
var dtl_devName = '';
var Main = {
		/** variable */
		initVariable : function() {
			$grpTree = $('#dGrpTreeGrid');
			$wasGrid = $('#wasGrid');
			this.initCondition();
		},

		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('', Main.search, timer);
			$("input[name=sRef]").eq(2).click();
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
            $('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		/** keyup event handler */
		keyupEventControl: function(event) {
			if(event.keyCode == 13) {
				Main.search();
			}
		},
		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_WAS, Main.search, {devKind1 : 'SVR'});


			/** WAS현황 그리드 그리기 */
			HmGrid.create($wasGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
                                var _grpNo = 0, _grpParent = 0, _grpType = 'DEFAULT', _itemKind = 'GROUP';
                                var treeItem = HmTreeGrid.getSelectedItem($grpTree);
                                var grpSelection = $grpTree.jqxTreeGrid('getSelection');
                                if(treeItem != null) {
                                    _itemKind = treeItem.devKind2;
                                    _grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
                                    _grpParent = treeItem.grpParent;
                                }
                                $.extend(data, {
                                    grpType: _grpType,
                                    grpNo: _grpNo,
                                    grpParent: _grpParent,
                                    itemKind: _itemKind
                                }, HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams());
                                return data;
							},
							loadComplete: function(records) {
							}
						}
				),
				columns:
				[
			 		{ text: '서버번호', datafield: 'mngNo', width: 80, hidden: true },
                    { text: '그룹명', datafield: 'grpName', width: 150, pinned: true },
					{ text: 'WAS명', datafield: 'wasNm', width: 100, cellsrenderer: HmGrid.wasNameRenderer },
                    { text: '서비스 종류', datafield: 'wasKind', width: 100, filtertype: 'checkedlist' },
                    { text: 'Runtime버전', datafield: 'runtSpecVer', width: 100 },
                    { text: '상태', datafield: 'engState', width: 80 },
					{ text: '서버명', datafield: 'devName', displayfield: 'disDevName', minwidth: 180, cellsrenderer: HmGrid.devNameRenderer },
					{ text: 'IP', datafield: 'devIp', width: 100},
					{ text: 'CPU', datafield: 'osSysCpuLoad' ,  width: 90, cellsalign: 'right', filtertype: "number" },
					{ text: 'Memory', datafield: 'memHeapUsed', width: 100, cellsrenderer: HmGrid.unit1024renderer, filtertype: 'number'  },
                    { text: 'In', datafield: 'bytesRciv', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: 'Out', datafield: 'bytesSend', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: '평균 TPS', datafield: 'procsTps', width: 90, filtertype: 'number', cellsalign: 'right', filtertype: 'number' },
                    { text: 'Active Session', datafield: 'actSessions', width: 90, filtertype: 'number', cellsalign: 'right' },
                    { text: '평균 응답시간(ms)', datafield: 'respTime', width: 110, cellsalign: 'right', filtertype: 'number'}
			    ]
			}, CtxMenu.SVR, 0);

			$wasGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_wasNo = event.args.row.bounddata.wasNo;
				dtl_wasKind = event.args.row.bounddata.wasKind;
				dtl_devName = event.args.row.bounddata.disDevName;
				Main.searchDtlInfo();
			}).on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
					dtl_mngNo = $(this).jqxGrid('getcellvalue', 0, 'mngNo');
					dtl_wasNo = $(this).jqxGrid('getcellvalue', 0, 'wasNo');
					dtl_wasKind = $(this).jqxGrid('getcellvalue', 0, 'wasKind');
					dtl_devName = $(this).jqxGrid('getcellvalue', 0, 'disDevName');
					Main.searchDtlInfo();
				} catch(e) {}
			});
			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {

		},
		
		/** 서버현황 그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($wasGrid, ctxPath + '/main/sms/wasStatus/getWasStatusList.do');
		},


		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		},
		
		/** export Excel */
		exportExcel: function() {
            HmUtil.exportGrid($wasGrid, "WAS 현황", false);
		},

		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#cbRefreshCycle').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		}
		
		
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});