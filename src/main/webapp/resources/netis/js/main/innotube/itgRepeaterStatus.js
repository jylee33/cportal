var $grid;

var Main = {
		/** variable */
		initVariable: function() {
			$grid = $('#grid');
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
			HmGrid.create($grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'regName', type:'string' },
                                { name:'ipAddr', type:'string' },
                                { name:'port', type:'string' },
                                { name:'kind', type:'string' },
                                { name:'brFwdPwr', type:'number' },
                                { name:'brRfcPwr', type:'number' },
                                { name:'brVswr', type:'string' },
                                { name:'tscStatus', type:'number' },
                                { name:'tscGps', type:'string' },
                                { name:'perfPoll', type:'string' },
                                { name:'lastUpd', type:'string' },
							]
						},
						{
							formatData: function(data) {
								return data;
							}
						}
				),
				columns:
				[
					{ text : '중계기명', datafield: 'regName', minwidth : 150 },
					{ text : 'IP', datafield: 'ipAddr', width : 120 },
					{ text : '포트', datafield: 'port', width : 100 },
					{ text : '종류', datafield: 'kind', width : 130 },
					{ text : '송신출력(W)', datafield: 'brFwdPwr', width : 100 },
					{ text : '반사출력(W)', datafield: 'brRfcPwr', width : 100 },
					{ text : '정재파비(VSWR)', datafield: 'brVswr', width : 120 },
					{ text : '운영상태', datafield: 'tscStatus', width : 100 },
					{ text : 'GPS연결', datafield: 'tscGps', width : 100 },
					{ text : '성능수집', datafield: 'perfPoll', width : 100 },
					{ text : '등록일자', datafield: 'lastUpd', width : 160 }
			    ]
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 조회 */
		search: function() {
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgRepeaterStatus/getItgRepeaterStatusList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($grid, '중계기현황', false);
			// var params = Master.getGrpTabParams();
			// var _grpNo = 0;
			// var treeItem = HmTreeGrid.getSelectedItem($grpTree);
			// if(treeItem != null) _grpNo = treeItem.grpNo;
			// $.extend(params, {
			// 	grpNo: _grpNo
			// });
			// HmUtil.exportExcel(ctxPath + '/main/env/rackConf/export.do', params);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});