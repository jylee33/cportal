var $grpTree, $grid;
var dtl_mngNo = -1;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $grid = $('#grid');
			this.initCondition();
		},

	initCondition: function() {
		// 기간
		HmBoxCondition.createPeriod('');
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
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'RTU' });

			HmGrid.create($grid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'mngNo', type:'string' },
                                { name:'sensorId', type:'string' },
								{ name:'fmsSeqNo', type:'number' },
                                { name:'grpName', type:'string' },
                                { name:'devName', type:'string' },
                                { name:'devIp', type:'string' },
                                { name:'usrName', type:'string' },
                                { name:'stateStr', type:'string' },
                                { name:'setupLoc', type:'string' },
                                { name:'maxIV', type:'number' },
                                { name:'avgIV', type:'number' },
                                { name:'curIV', type:'number' },
                                { name:'maxOV', type:'number' },
                                { name:'avgOV', type:'number' },
                                { name:'curOV', type:'number' },
                                { name:'maxOA', type:'number' },
                                { name:'avgOA', type:'number' },
                                { name:'curOA', type:'number' },
                                { name:'maxBat', type:'number' },
                                { name:'avgBat', type:'number' },
                                { name:'curBat', type:'number' },

							]
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				columns:
				[
					{ text : '그룹명', columngroup: 'info', datafield: 'grpName', width : 150 },
					{ text : '주장치명', columngroup: 'info', datafield: 'devName', width : 150 },
					{ text : 'IP', columngroup: 'info', datafield: 'devIp', width : 120 },
					{ text : 'UPS명', columngroup: 'info', datafield: 'usrName', width : 100 },
					{ text : 'UPS상태', columngroup: 'info', datafield: 'stateStr', width : 90, cellsalign: 'center' },
					{ text : '설치위치', columngroup: 'info', datafield: 'setupLoc', minwidth : 120 },
					{ text : '최대', columngroup: 'iv', datafield: 'maxIV', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'iv', datafield: 'avgIV', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'iv', datafield: 'curIV', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'ov', datafield: 'maxOV', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'ov', datafield: 'avgOV', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'ov', datafield: 'curOV', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'oa', datafield: 'maxOA', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'oa', datafield: 'avgOA', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'oa', datafield: 'curOA', width : 80, cellsalign: 'right' },
					{ text : '최대', columngroup: 'bat', datafield: 'maxBat', width : 80, cellsalign: 'right' },
					{ text : '평균', columngroup: 'bat', datafield: 'avgBat', width : 80, cellsalign: 'right' },
					{ text : '현재', columngroup: 'bat', datafield: 'curBat', width : 80, cellsalign: 'right' }
			    ],
			    columngroups: 
		    	[
		    	 	{ text: '정보', align: 'center', name: 'info' },
		    	 	{ text: '입력전압(V)', align: 'center', name: 'iv' },
		    	 	{ text: '출력전압(V)', align: 'center', name: 'ov' },
		    	 	{ text: 'UPS부하(%)', align: 'center', name: 'oa' },
		    	 	{ text: '배터리(%)', align: 'center', name: 'bat' }
		    	]
			}, CtxMenu.NONE);
			$grid.on('rowselect', function(event) {
				var row = event.args.row;
                dtl_mngNo = row.mngNo;

                // Main.drawChart(row.mngNo, row.sensorId);
			});
			
			$grid.on('contextmenu', function() { return false; })
				.on('rowclick', function(event) {
					if(event.args.rightclick) {
						$grid.jqxGrid('selectrow', event.args.rowindex);
						var posX = parseInt(event.args.originalEvent.clientX) + 5 + $(window).scrollLeft();
		                var posY = parseInt(event.args.originalEvent.clientY) + 5 + $(window).scrollTop();
		                if($(window).height() < (event.args.originalEvent.clientY + $('#ctxmenu').height() + 10)) {
		                	posY = $(window).height() - ($('#ctxmenu').height() + 10);
		                }
		                $('#ctxmenu').jqxMenu('open', posX, posY);
						return false;
					}
				});
			$('#ctxmenu').jqxMenu({ width: 180, autoOpenPopup: false, mode: 'popup', theme: jqxTheme, popupZIndex: 99999 })
				.on('itemclick', function(event) {
					Main.selectCtxmenu(event);
				});

		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getPeriodParams());
			return params;
		},
		
		/** 조회 */
		search: function() {

			/*Master.refreshCbPeriod($('#cbPeriod'));*/
			HmGrid.updateBoundData($grid, ctxPath + '/main/innotube/itgUpsMonitor/getItgUpsMonitorList.do');
		},


		/** export Excel */
		exportExcel: function() {
			HmUtil.exportGrid($grid, 'UPS감시', false);
		},

		/** ContextMenu */
		selectCtxmenu: function(event) {
			var val = $(event.args)[0].title;
			if(val == null) return;
			switch(val) {
			case 'devCpst':
				try {
					var rowidx = HmGrid.getRowIdx($grid, '선택된 데이터가 없습니다.');
					if(rowidx === false) return;
					var params = $grid.jqxGrid('getrowdata', rowidx);
                    HmUtil.createPopup('/main/popup/innotube/pUpsDevDetail.do', $('#hForm'), 'pDevDetail_' + params.mngNo, 1300, 486, params);

				} catch(e) {}
				break;
			case 'filter':
				try {
					$grid.jqxGrid('beginupdate');
					if($grid.jqxGrid('filterable') === false) {
						$grid.jqxGrid({ filterable: true });
					}
                    setTimeout(function() {
                        $grid.jqxGrid({showfilterrow: !$grid.jqxGrid('showfilterrow')});
                    }, 300);
					$grid.jqxGrid('endupdate');
				} catch(e) {}
				break;
			case '필터초기화':
				try {
					$grid.jqxGrid('clearfilters');
				} catch(e) {}
				break;
			}
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});