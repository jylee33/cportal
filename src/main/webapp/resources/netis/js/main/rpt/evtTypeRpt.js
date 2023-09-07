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
										grpNo: _grpNo					
								});
								return data;
							}
						}
				),
				pageable: false,
				columns: 
				[
				 	{ text: '장애종류', datafield: 'evtName', minwidth: 140, pinned: true },
				 	{ text: '전일', datafield: 'yesterdayCnt', width: 150, cellsformat: 'n', cellsalign: 'right' },
				 	{ text: '금일', datafield: 'todayCnt', width: 150, cellsformat: 'n', cellsalign: 'right' },
				 	{ text: '증감율', datafield: 'chgRate', width: 150, cellsformat: 'n', cellsalign: 'right',
				 		 cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
				 			 if(value == 0) return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>-</div>";
				 			 else return "<div style='margin-top: 4px; margin-right: 5px' class='jqx-right-align'>" + value + " %</div>";
				 		 }
				 	}
			    ]
			});
		},

		/** init data */
		initData : function() {

		},
		
		/** 조회 */
		search : function() {
			HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/evtTypeRpt/getEvtTypeList.do');
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});