var $rptGrid;

var Main = {
		/** variable */
		initVariable : function() {
			$rptGrid = $('#rptGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
				case "btnSearch": this.search(); break;
			}
		},

		/** init design */
		initDesign : function() {
			$("#searchUnit").jqxDropDownList({ source: ["10초단위", "5분단위"], selectedIndex: 0, width: '150px', height: '22px', autoDropDownHeight: true });	
			$("#over").jqxNumberInput		({ width: '100px', height: '22px', min: 0,	max: 100,	digits: 5,	decimal: 80 ,decimalDigits: 0, inputMode: 'simple',	spinButtons: true });
		
			$('#date1').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });
			var today = new Date();
			today.setHours(today.getHours() -1, 0, 0, 0);
			$('#date1').jqxDateTimeInput('setDate', today);
			
			$('#btnGrpType').jqxButtonGroup({ mode: 'radio', theme: jqxTheme })
				.on('buttonclick', function(event) {
					Main.chgGrpType(event.args.button[0].id);
				});
			$('#btnGrpType').jqxButtonGroup('setSelection', 0);
			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEF_ALL, 180, 22, 300, 350, Main.searchDevCond);
	
		
			/** 회선초과 그리드  그리기 */
			HmGrid.create($rptGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');
								var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
								var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
								var searchUnitType=0;
								$.extend(data, {
									grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
									searchUnit: $("#searchUnit").val(),
									grpNo: _grpNo,
									date1: HmDate.getDateStr($('#date1')),
									over: $("#over").val()
								});
								return data;
							}
						}
				),
				columns: 
				[
				 	{ text: '그룹', datafield: 'grpName', minwidth: 100, pinned: true },
				 	{ text: '장비', datafield: 'devName', minwidth: 100, pinned: true },
					{ text: '회선', datafield: 'ifName', minwidth: 100, pinned: true },
					{ text: '대역폭', datafield: 'lineWidth', width: 80, cellsrenderer: HmGrid.unit1000renderer },
					{ text: '상태',  datafield: 'status', width: 80, cellsrenderer: HmGrid.ifStatusrenderer },
					{ text: '사용률', datafield: 'usePer', width: 100 , cellsrenderer: HmGrid.progressbarrenderer, filtertype: "number" },
					{ text: '트래픽(전일)', datafield: 'yesterdayBps', width: 100  },
					{ text: '트래픽(금일)', datafield: 'todayBps', width: 100 },
					{ text: '증감', datafield: 'variation', width: 100  },
					{ text: '초과시간', datafield: 'overTime', width: 100  }
			    ]
			});
	
		},

		/** init data */
		initData : function() {

		},
		
		// 그룹타입 변경
		chgGrpType: function(btnId) {
			if(btnId == 'DEFAULT') {
				HmTreeGrid.updateData($('#grpTree'), HmTree.T_GRP_DEF_ALL);
			}
			else if(btnId == 'SEARCH') {
				HmTreeGrid.updateData($('#grpTree'), HmTree.T_GRP_SEARCH);
			}
		},
		
		/** 회선초과 그리드 조회 */
		search : function() {
			HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/lineOver/getLineOverList.do');
		}
		
		


};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});