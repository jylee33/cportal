var $svrGrid, $dtlGrid;
var timer;

var Main = {
		/** variable */
		initVariable: function() {
			$svrGrid = $('#svrGrid'), $dtlGrid = $('#dtlGrid');
		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.searchSvr(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 400, collapsible: false }, { size: '100%' }], 'auto', '100%');
			$("#date1").jqxDateTimeInput({ width: '100px', height: '21px', theme: jqxTheme, formatString: 'yyyy-MM-dd' });
			
			HmGrid.create($svrGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/main/starcell/itmonDbPerf/getITMonDbSvrList.do'
						},
						{
							formatData: function(data) {
								data.date1 = HmDate.getDateStr($('#date1'));
								data.smsItemGroup = $('#cbDbKind').val();
								return data;
							}
						}
				),
				columns: 
				[
					{ text : '그룹명', datafield: 'gname', width: 130 },
					{ text : '장비명', datafield: 'invenName', width: 150 },
					{ text : 'IP주소', datafield: 'agentIp', width: 120 }
			    ]
			});
			$svrGrid.on('rowdoubleclick', function(event) {
				Main.searchPerf();
			});

			HmGrid.create($dtlGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var rowIdx = HmGrid.getRowIdx($svrGrid);
								data.agentIp = rowIdx !== false? HmGrid.getRowData($svrGrid, rowIdx).agentIp : '';
								data.date1 = HmDate.getDateStr($('#date1'));
								data.dbKind = $("#cbDbKind").val() == 8? 'ORACLE' : 'MSSQL';
								return data;
							}
						}
				),
				columns: 
				[
					 { text : '장비명', datafield: 'invenName', minwidth: 130 },
					 { text : 'IP주소', datafield: 'agentIp', width: 120 },
					 { text : '항목명', datafield: 'monitem', width: 150 },
					 { text : '인스턴스', datafield: 'instance', width: 130 },
					 { text : '최소값', datafield: 'min', width: 80, cellsalign:' right' },
					 { text : '평균값', datafield: 'avg', width: 80, cellsalign:' right' },
					 { text : '최대값', datafield: 'max', width: 80, cellsalign:' right' },
					 { text : '단위', datafield: 'unit', width: 80 },
					 { text : '설명', datafield: 'description', minwidth: 250 }
				 ]
			});
		},
		
		/** init data */
		initData: function() {
			
		},
		
		searchSvr: function() {
			HmGrid.updateBoundData($svrGrid);
		},
		
		searchPerf: function() {
			HmGrid.updateBoundData($dtlGrid, ctxPath + '/main/starcell/itmonDbPerf/getITMonDbPerfList.do');
		},
		
		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($dtlGrid, 'DB성능', false);
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});