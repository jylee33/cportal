var $vgwGrid;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$vgwGrid = $('#vgwGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case "btnSearch": this.search(); break;
			case "btnExcel": this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.selectTree);
			
			HmGrid.create($vgwGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devKind2', type:'string' },
                                { name:'model', type:'string' },
                                { name:'vendor', type:'string' },
                                { name:'cpuMax', type:'number' },
                                { name:'cpuCurrency', type:'number' },
                                { name:'cpuAvg', type:'number' },
                                { name:'memMax', type:'number' },
                                { name:'memCurrency', type:'number' },
                                { name:'memAvg', type:'number' },
                                { name:'tempMax', type:'number' },
                                { name:'tempCurrency', type:'number' },
                                { name:'tempAvg', type:'number' },
                                { name:'devInfo', type:'string' },
                                { name:'cpu', type:'number' },
                                { name:'mem', type:'number' },
                                { name:'temp', type:'number' },
							]
						},
						{
							formatData: function(data) {
								var params = Master.getGrpTabParams();
								$.extend(data, params);
								return data;
							}
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
				 	{ text : '그룹', columngroup: 'devInfo', datafield: 'grpName', width: 140 },
					{ text : '장비명', columngroup: 'devInfo', datafield: 'devName', minwidth: 150 },
					{ text : 'IP', columngroup: 'devInfo', datafield: 'devKind2', width: 130 },
					{ text : '모델', columngroup: 'devInfo', datafield: 'model', width: 130, filtertype: 'checkedlist' },
					{ text : '제조사', columngroup: 'devInfo', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text : '최대', columngroup: 'cpu', datafield: 'cpuMax', width: 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'cpu', datafield: 'cpuCurrency', width: 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'cpu', datafield: 'cpuAvg', width: 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'mem', datafield: 'memMax', width: 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'mem', datafield: 'memCurrency', width: 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'mem', datafield: 'memAvg', width: 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'temp', datafield: 'tempMax', width: 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'temp', datafield: 'tempCurrency', width: 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'temp', datafield: 'tempAvg', width: 80, cellsalign: 'right' }
			    ],
			    columngroups: 
		    	[
		    	 	{ text: '장비정보', align: 'center', name: 'devInfo' },
		    	 	{ text: 'CPU(%)', align: 'center', name: 'cpu' },
		    	 	{ text: 'MEMORY(%)', align: 'center', name: 'mem' },
		    	 	{ text: '온도(℃)', align: 'center', name: 'temp' }
			    ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		refresh: function() {
			this.search();
		},
		
		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			Main.search();
		},
		
		search: function() {
			HmGrid.updateBoundData($vgwGrid, ctxPath + '/main/ipt/vgwMgmt/getCallMgrMgmtList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			var params = Master.getGrpTabParams();
			
			HmUtil.exportExcel(ctxPath + '/main/ipt/vgwMgmt/export.do', params);
		}
		
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});