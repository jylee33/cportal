var $totalGrid, $evtCodeGrid, $devKindGrid, $modelGrid, $evtGrid;

var Main = {
		/** variable */
		initVariable : function() {
			$totalGrid = $('#totalGrid'), $evtCodeGrid = $('#evtCodeGrid'), $devKindGrid = $('#devKindGrid'), $modelGrid = $('#modelGrid'), $evtGrid = $('#evtGrid');
		},

		/** add event */
		observe : function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('#ckTimeSet').bind('change', function(event) { Main.eventControl(event); });
		},

		/** event handler */
		eventControl : function(event) {
			var curTarget = event.currentTarget;
			switch (curTarget.id) {
			case "btnSearch": this.search(); break;
			case 'btnConf': this.confEvtCode(); break;
			case "btnExcel": this.exportExcel(); break;
			case 'btnReport': this.report(); break;
			case 'ckTimeSet': this.chgTimeSet(); break;
			}
		},

		/** init design */
		initDesign : function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.selectTree);
			HmDate.create($('#date1'), $('#date2'), HmDate.DAY, 1, HmDate.FS_SHORT);
			$('#time1, #time2').jqxDateTimeInput({ width: 30, height: 21, theme: jqxTheme, formatString: 'HH', textAlign: 'center', showCalendarButton: false, disabled: true });
			$('#time2').val('23');

			HmJqxSplitter.create($('#bSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '40%' }, { size: '60%' }], 'auto', '100%');
			
			// 전체현황
			HmGrid.create($totalGrid, {
				source: new $.jqx.dataAdapter(
						{ datatype: 'json' },
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				pageable: false,
				height: 100,
				autoheight: true,
				width: '99.9%',
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '장애등급 별 통계');
			    },
				columns: 
				[
				 	{ text: '총 장애수', datafield: 'totalCnt', cellsalign: 'right', cellsformat: 'n' },
				 	{ text: '총 장애시간', datafield: 'sumSec', cellsrenderer: HmGrid.cTimerenderer, hidden: true },
				 	{ text: '가동률', datafield: 'utilizationRate', cellsalign: 'right', hidden: true },
				 	{ text: '정보수', datafield: 'infoCnt', cellsalign: 'right', cellsformat: 'n' },
				 	{ text: '주의수', datafield: 'warningCnt', cellsalign: 'right', cellsformat: 'n' },
				 	{ text: '알람수', datafield: 'minorCnt', cellsalign: 'right', cellsformat: 'n' },
				 	{ text: '경보수', datafield: 'majorCnt', cellsalign: 'right', cellsformat: 'n' },
				 	{ text: '장애수', datafield: 'criticalCnt', cellsalign: 'right', cellsformat: 'n' }
				]
			}, CtxMenu.NONE);

			// 좌측
			HmGrid.create($evtCodeGrid, {
				source: new $.jqx.dataAdapter(
						{ datatype: 'json' },
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				height: '33%',
				pageable: false,
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '유형 별 통계');
			    },
				columns: 
				[
					{ text: '장애코드', datafield: 'code', hidden: true },
					{ text: '장애유형', datafield: 'evtName' },
					{ text: '장애수', datafield: 'errCnt', width: 80, cellsalign: 'right', cellsformat: 'n' },
					{ text: '총 장애시간', datafield: 'errTime', width: 120, cellsrenderer: HmGrid.cTimerenderer }
				 ]
			}, CtxMenu.NONE);
			$evtCodeGrid.on('rowdoubleclick', function(event) {
				var rowdata = HmGrid.getRowData($(this), event.args.rowindex);
				var filtervalue = null;
				if(rowdata != null) {
					filtervalue = rowdata.code;
				}
				Main.applyFilterForEvt('code', filtervalue);
			});
			
			HmGrid.create($devKindGrid, {
				source: new $.jqx.dataAdapter(
						{ datatype: 'json' },
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				height: '33%',
				pageable: false,
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '종류 별 통계');
			    },
				columns: 
				[
					 { text: '장비종류', datafield: 'devKind2' },
					 { text: '장비수', datafield: 'devCnt', width: 80, cellsalign: 'right', cellsformat: 'n' },
					 { text: '장애수', datafield: 'errCnt', width: 80, cellsalign: 'right', cellsformat: 'n' },
					 { text: '총 장애시간', datafield: 'errTime', width: 120, cellsrenderer: HmGrid.cTimerenderer }
				 ]
			}, CtxMenu.NONE);
			$devKindGrid.on('rowdoubleclick', function(event) {
				var rowdata = HmGrid.getRowData($(this), event.args.rowindex);
				var filtervalue = null;
				if(rowdata != null) {
					filtervalue = rowdata.devKind2;
				}
				Main.applyFilterForEvt('devKind2', filtervalue);
			});
			
			HmGrid.create($modelGrid, {
				source: new $.jqx.dataAdapter(
						{ datatype: 'json' },
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							}
						}
				),
				height: '33%',
				pageable: false,
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '모델 별 통계');
			    },
				columns: 
				[
					 { text: '모델', datafield: 'model' },
					 { text: '장애수', datafield: 'errCnt', width: 80, cellsalign: 'right', cellsformat: 'n' },
					 { text: '총 장애시간', datafield: 'errTime', width: 120, cellsrenderer: HmGrid.cTimerenderer }
				 ]
			}, CtxMenu.NONE);
			$modelGrid.on('rowdoubleclick', function(event) {
				var rowdata = HmGrid.getRowData($(this), event.args.rowindex);
				var filtervalue = null;
				if(rowdata != null) {
					filtervalue = rowdata.model;
				}
				Main.applyFilterForEvt('model', filtervalue);
			});

			// 우측 - 이벤트
			HmGrid.create($evtGrid, {
				source: new $.jqx.dataAdapter(
						{ datatype: 'json' },
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function() {
								try {
									$evtGrid.jqxGrid('clearfilters');
								} catch(e) {}
							}
						}
				),
				pageable: false,
				showtoolbar: true,
				rendertoolbar: function(toolbar) {
					HmGrid.titlerenderer(toolbar, '장애 상세 현황');
				},
				columns: 
				[
					{ text: '이벤트코드', datafield: 'code', width: 150, pinned: true, cellsalign: 'center', hidden: true },
					{ text: '발생일시', datafield: 'ymdhms', width: 150, pinned: true, cellsalign: 'center' },
					{ text: '장애종류', datafield: 'srcType', width: 80, pinned: true, cellsalign: 'center' },
					{ text: '장애대상', datafield: 'evtObject', minwidth: 130, pinned: true },
					{ text: '장비종류', datafield: 'devKind2', width: 150, cellsalign: 'center', hidden: true },
					{ text: '모델', datafield: 'model', width: 150, cellsalign: 'center', hidden: true },
					{ text: '지속시간', datafield: 'sumSec', width: 120, cellsrenderer: HmGrid.cTimerenderer },
					{ text: '이벤트명', datafield: 'evtName', width: 150 },
					{ text: '장애등급', datafield: 'evtLevel', width: 80, cellsrenderer: HmGrid.evtLevelrenderer, cellsalign: 'center' },
					{ text: '장애상태', datafield: 'status', width: 80, cellsalign: 'center' }
				 ]
			}, CtxMenu.NONE);
		},

		/** init data */
		initData : function() {
			
		},
		
		getCommParams: function() {
			var isChecked = $('#ckTimeSet').is(':checked');
			var params = Master.getGrpTabParams();
			$.extend(params, {
				date1: HmDate.getDateStr($('#date1')),
				time1: isChecked? HmDate.getTimeStr($('#time1')) : '0000',
				date2: HmDate.getDateStr($('#date2')),
				time2: isChecked? HmDate.getTimeStr($('#time2')) : '2359',
				ckTimeSet: isChecked
			});
			return params;
		},
		
		selectTree: function() {
			Main.search();
		},
		
		chgTimeSet: function() {
			var isChecked = $('#ckTimeSet').is(':checked');
			$('#time1, #time2').jqxDateTimeInput({ disabled: !isChecked });
		},

		/* 좌측 그리드에 따른 우측 이벤트 필터 적용 */
		applyFilterForEvt: function(datafield, filtervalue) {
			$evtGrid.jqxGrid('clearfilters');
			var filtergroup = new $.jqx.filter();
			var filter_or_operator = 1;
			var filtercondition = 'equal';
			var filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
			filtergroup.addfilter(filter_or_operator, filter1);
			// add the filters.
			$evtGrid.jqxGrid('addfilter', datafield, filtergroup);
			// apply the filters.
			$evtGrid.jqxGrid('applyfilters');
		},
	
		/** 조회 */
		search : function() {
			var time1 = parseInt($('#time1').val()), time2 = parseInt($('#time2').val());
			if(time1 > time2) {
				alert('시작시간이 종료시간 이후일 수 없습니다.');
				return;
			}
			HmGrid.updateBoundData($totalGrid, ctxPath + '/main/rpt/errDetailRpt/getTotalStatInfo.do');
			HmGrid.updateBoundData($evtCodeGrid, ctxPath + '/main/rpt/errDetailRpt/getStatByEvtCode.do');
			HmGrid.updateBoundData($devKindGrid, ctxPath + '/main/rpt/errDetailRpt/getStatByDevKind.do');
			HmGrid.updateBoundData($modelGrid, ctxPath + '/main/rpt/errDetailRpt/getStatByModel.do');
			HmGrid.updateBoundData($evtGrid, ctxPath + '/main/rpt/errDetailRpt/getEvtStatusList.do');
		},
		
		/** 이벤트 코드 설정 */
		confEvtCode: function() {
			$.post(ctxPath + '/main/popup/rpt/pErrDetailEvtConf.do', 
					function(result) {
						HmWindow.open($('#pwindow'), '이벤트 설정', result, 500, 477);
					}
			);
		},
		
		/** export Excel */
		exportExcel: function() {
			if($('#gSiteName').val() == 'HCN') {
				var _gridArr = [$totalGrid, $evtCodeGrid, $devKindGrid, $modelGrid, $evtGrid];
				var _gridTitleArr = ['장애등급 별 통계', '유형 별 통계', '종류 별 통계', '모델 별 통계', '장애 상세 현황'];
				HmUtil.exportGridList(_gridArr, _gridTitleArr, '장애상세');
			}
			else {
                var params = Main.getCommParams();
                HmUtil.exportExcel(ctxPath + '/main/rpt/errDetailRpt/export.do', params);
            }
		},
		
		/** 보고서 */
		report: function() {
			var treeItem = null, _grpType = 'DEFAULT';
			switch($('#leftTab').val()) {
			case 0: 
				treeItem = HmTreeGrid.getSelectedItem($('#dGrpTreeGrid')); 
				_grpType = 'DEFAULT'; 
				break;
			case 1: 
				treeItem = HmTreeGrid.getSelectedItem($('#sGrpTreeGrid')); 
				_grpType = 'SEARCH'; 
				break;
			}
			var _grpNo = 0, _grpParent = 0, _itemKind = 'GROUP';
			if(treeItem != null) {
				_itemKind = treeItem.devKind2;
				_grpNo = _itemKind == 'GROUP'? treeItem.grpNo : treeItem.grpNo.split('_')[1];
				_grpParent = treeItem.grpParent;
			}
			var _nodeName = _itemKind == 'GROUP'? treeItem.grpName.substr(0, treeItem.grpName.lastIndexOf('(')) : treeItem.grpName;
			var isChecked = $('#ckTimeSet').is(':checked');
			var params = {
				grpType: _grpType,
				grpNo: _grpNo,
				grpParent: _grpParent,
				itemKind: _itemKind,
				nodeName: _nodeName,
				date1: HmDate.getDateStr($('#date1')),
				time1: isChecked? HmDate.getTimeStr($('#time1')) : '0000',
				date2: HmDate.getDateStr($('#date2')),
				time2: isChecked? HmDate.getTimeStr($('#time2')) : '2359',
				ckTimeSet: isChecked
			};
			
			HmUtil.createPopup('/oz/viewer/errDetailRptViewer.do', $('#hForm'), 'oz', 1200, 700, params);
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});