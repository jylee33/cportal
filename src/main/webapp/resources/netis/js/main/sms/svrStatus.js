var $grpTree, $svrGrid;
var timer;
var dtl_mngNo = -1;
var dtl_devName = '';
var dtl_devKind2 = '';

var Main = {

		/** variable */
		initVariable : function() {
			$grpTree = $('#dGrpTreeGrid');
			$svrGrid = $('#svrGrid');
			this.initCondition();
		},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('', Main.search, timer);
		$("input[name=sRef]").eq(3).click();
		// radio 조건
		HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
				case "btnExcelHtml": this.exportExcelHtml(); break;
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

			if($('#gSiteName').val() == 'TTA') {
				$('#btnExcelHtml').css('display', 'inline-block');
			}

			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '40%', collapsible: false }, { size: '60%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.search, {devKind1 : 'SVR'});

			/** 서버현황 그리드 그리기 */
			HmGrid.create($svrGrid, {
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
                                    itemKind: _itemKind,
                                    sIp: $('#sIp').val(),
                                    sDevName: $('#sName').val()
                                });

								$.extend(data, HmBoxCondition.getSrchParams());
                                return data;
							},
							loadComplete: function(records) {
							}
						}
				),
				columns:
				[
			 		{ text: '서버번호', datafield: 'mngNo', hidden: true },
                    { text: '그룹명', datafield: 'grpName', width: 150, pinned: true },
					{ text: '서버명', datafield: 'name', displayfield: 'disDevName', minwidth: 200, pinned: true, cellsrenderer: HmGrid.devNameRenderer },
					{ text: 'IP', datafield: 'devIp', width: 100, pinned: true },
					{ text: '타입', datafield: 'devKind1', hidden: true },
                    { text: '종류', datafield: 'devKind2', width: 90, filtertype: 'checkedlist' },
                    { text: 'OS버전', datafield: 'machineVer', width: 90 },
					{ text: 'CPU', datafield: 'cpuPer' ,  width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: "number" },
					{ text: 'Memory', datafield: 'memPer', width: 100, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number'  },
                    { text: 'In',  columngroup: 'bps',datafield: 'inBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: 'Out',  columngroup: 'bps',datafield: 'outBps', width: 90, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
                    { text: '최대',  columngroup: 'fileSystem',datafield: 'fsMaxPer', width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number' },
                    { text: '평균',  columngroup: 'fileSystem',datafield: 'fsAvgPer', width: 90, cellsrenderer: HmGrid.progressbarrenderer, filtertype: 'number' },
                    { text: '프로세스(수)',  datafield: 'procCnt', width: 90, filtertype: 'number', cellsalign: 'right' },
                    { text: '제조사',  datafield: 'vendor', width: 120, cellsalign: 'left', filtertype: 'checkedlist' },
                    { text: '모델',  datafield: 'model', width: 120, cellsalign: 'left', filtertype: 'checkedlist' },
                    { text: '최근부팅', datafield: 'upTime', width: 120, cellsalign: 'center'},
                    {
                        text: '부팅후',
                        datafield: 'upTimeSumSec',
                        width: 150,
                        cellsrenderer: HmGrid.cTimerenderer,
                        filtertype: 'number'
                    },
					{ text: '성능수집', datafield: 'perfPoll', displayfield: 'disPerfPoll', width: 100 },
					{ text: '수집기명', datafield: 'pollGrpNo', displayfield: 'pollGrpNoStr', width: 100 },

                    { text: '시리얼', datafield: 'machine_serial', width: 130 },
                    { text: '비고', datafield: 'svrDesc', width: 130 },
					{ text: 'WAS번호', datafield: 'wasNo', hidden: true },
					{ text: 'DBMS번호', datafield: 'dbmsNo', hidden: true }
			    ],
                columngroups:
                [
	                 { text: '파일시스템', align: 'center', name: 'fileSystem'},
                     { text: 'bps', align: 'center', name: 'bps'}
                ]
			}, CtxMenu.SVR, 0);

			$svrGrid.on('rowdoubleclick', function(event) {
				dtl_mngNo = event.args.row.bounddata.mngNo;
				dtl_devName = event.args.row.bounddata.disDevName;
				dtl_devKind2 = event.args.row.bounddata.devKind2;
				dtl_wasNo  = event.args.row.bounddata.wasNo;
				dtl_dbmsNo = event.args.row.bounddata.dbmsNo;
				Main.searchDtlInfo();
			}).on('bindingcomplete', function(event) {
				try {
					$(this).jqxGrid('selectrow', 0);
                    var rowData = $(this).jqxGrid('getrowdata', 0);

					dtl_mngNo = rowData.mngNo;
					dtl_devName = rowData.disDevName;
					dtl_devKind2 = rowData.devKind2;
					dtl_wasNo = rowData.wasNo;
					dtl_dbmsNo = rowData.dbmsNo;
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
			HmGrid.updateBoundData($svrGrid, ctxPath + '/main/sms/svrStatus/getSvrStatusList.do');
		},


		/** 상세정보 */
		searchDtlInfo: function() {
			PMain.search();
		},

		/** export Excel */
		exportExcel: function() {
            HmUtil.exportGrid($svrGrid, "서버현황", false);
		},
		exportExcelHtml: function() {
			HmUtil.exportGridHtml($svrGrid, '서버현황', false);
		}

};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});
