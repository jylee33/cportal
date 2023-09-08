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
			$('#date1').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd', theme: jqxTheme });
			var today = new Date();
			today.setDate(today.getDate() - 1); 
			$('#date1').jqxDateTimeInput('setDate', today);
			
			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEF_ALL, 180, 22, 300, 350, null);

			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmGrid.create($rptGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
								var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
								$.extend(data, {
										grpNo: _grpNo,
										date1: HmDate.getDateStr($('#date1'))
								});
								return data;
							}
						}
				),
				pageable: true,
				columns: 
				[
				 	{ text: '학교명', datafield: 'grpName', minwidth: 140, pinned: true },
				 	{ text: '최대', datafield: 'maxVal', width: 150, cellsalign: 'right' },
				 	{ text: '최소', datafield: 'minVal', width: 150, cellsalign: 'right' },
				 	{ text: '평균', datafield: 'avgVal', width: 150, cellsalign: 'right' }
			    ]
			});
		},

		/** init data */
		initData : function() {

		},
		
		/** 조회 */
		search : function() {
			HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/cpuTopRpt/getCpuTopList.do');
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});