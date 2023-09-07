var $p_grid;
var ctxPath;

var PMain = {
		/** variable */
		initVariable: function() {;
			$p_grid = $('#p_grid');
			ctxPath = $('#ctxPath').val();
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { PMain.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'pbtnSearch': this.search(); break;
			case 'pbtnClose': self.close(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmGrid.create($p_grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
				columns: 
				[
				 	{ text: 'IP', datafield: 'devIp', width: 120 },
				 	{ text: '원인', datafield: 'failReason' }
				]
			}, CtxMenu.COMM);
		},
		
		/** init data */
		initData: function() {
			PMain.search();
		},
		
		search: function() {
			HmGrid.updateBoundData($p_grid, ctxPath + '/main/popup/devScan/getRegDevFailList.do');
		}
		
};

$(function() {
	PMain.initVariable();
	PMain.observe();
	PMain.initDesign();
	PMain.initData();
});
