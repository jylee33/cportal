var $svrGrid;

var Main = {
		/** variable */
		initVariable: function() {
			$svrGrid = $('#svrGrid');
		},

		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			/*사용자 관리 */
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			var columns = [];
				columns.push(
                    	{ text : '대상 종류', datafield: 'disMsgType', width: 200, cellsalign: 'center' }
				);
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
					{
						datatype: 'array',
						localdata: [],
						datafields: [
							{name: 'type', type: 'string'}
						]
					}
				),
				pageable: false,
				columns:
					[
						{ text : '대상 종류', datafield : 'type', minwidth : 100, cellsalign:'center' }
					],
			});
			// $termGrid.on('rowdoubleclick', function (event) {
			// 	Main.displayDevConfigContent();
			// }).on('bindingcomplete', function (event) {
			// 	$termGrid.jqxGrid('selectrow', 0);
			// 	Main.displayDevConfigContent();
			// });

			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {

		},
		
		search: function() {
			HmGrid.updateBoundData($smsHistGrid, ctxPath + '/main/env/smsHistory/getSmsHistoryList.do');
		},
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($smsHistGrid, '단문자 발송이력', false);
		}
		
	
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});