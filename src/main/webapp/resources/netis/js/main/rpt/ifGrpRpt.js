var $rptGrid, $rptChart;

var Main = {
		/** variable */
		initVariable : function() {
			$rptGrid = $('#rptGrid'), $rptChart = $('#rptChart');
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
			$('#date1, #date2').jqxDateTimeInput({ width: '110px', height: '21px', formatString: 'yyyy-MM-dd HH', theme: jqxTheme });
			var today = new Date();
			today.setHours(today.getHours() -1, 0, 0, 0);
			$('#date1, #date2').jqxDateTimeInput('setDate', today);
			
			$('#btnGrpType').jqxButtonGroup({ mode: 'radio', theme: jqxTheme })
				.on('buttonclick', function(event) {
					Main.chgGrpType(event.args.button[0].id);
				});
			$('#btnGrpType').jqxButtonGroup('setSelection', 0);

			HmDropDownBtn.createTreeGrid($('#ddbGrp'), $('#grpTree'), HmTree.T_GRP_DEF_ALL, 180, 22, 300, 350, Main.searchDevCond);
			$('#ddbDev').jqxDropDownButton({ width: 180, height: 22, theme: jqxTheme })
				.on('open', function(event) {
					$('#devGrid').css('display', 'block');
				});

			HmGrid.create($('#devGrid'), {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							url: ctxPath + '/dev/getDevList.do'
						},
						{
							formatData: function(data) {
								var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');
								var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
								var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
								$.extend(data, {
									isAll: true,
									grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
									grpNo: _grpNo									
								});
								return data;
							}
						}
				),
				columns:
					[
	                    { text: '장비명', datafield: 'disDevName', minwidth: 150 },
	                    { text: '사용자장비명', datafield: 'userDevName', width: 150 },
	                    { text: 'IP', datafield: 'devIp', width: 100 },
	                    { text: '모델', datafield: 'model', width: 90 },
	                    { text: '제조사', datafield: 'vendor', width: 90 }
	                ],
                width: 600
			});
			$('#devGrid').on('rowselect', function(event) {
				var rowdata = $(this).jqxGrid('getrowdata', event.args.rowindex);
				var content = '<div style="position: relative; margin-left: 3px; margin-top: 2px">' + rowdata.devName + '</div>';
				$('#ddbDev').jqxDropDownButton('setContent', content);
			}).on('bindingcomplete', function(event) {
				$(this).jqxGrid('selectrow', 0);
			}).on('rowdoubleclick', function(event){
				$('#ddbDev').jqxDropDownButton('close'); 
			});

			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmGrid.create($rptGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								var btnIdx = $('#btnGrpType').jqxButtonGroup('getSelection');
								var rowIdx = HmGrid.getRowIdx($('#devGrid'));
								var grpSelection = $('#grpTree').jqxTreeGrid('getSelection');
								var _grpNo = grpSelection.length == 0? 0 : grpSelection[0].grpNo;
								var _mngNo = -1;
								if(rowIdx !== false) {
									_mngNo = $('#devGrid').jqxGrid('getrowdata', rowIdx).mngNo;
								}
								$.extend(data, {
									grpType: btnIdx == 0? 'DEFAULT' : 'SEARCH',
									grpNo: _grpNo,
									mngNo: _mngNo,
									date1: HmDate.getDateStr($('#date1')),
									time1: HmDate.getTimeStr($('#date1')),
									date2: HmDate.getDateStr($('#date2')),
									time2: HmDate.getTimeStr($('#date2'))
								});
								return data;
							}
						}
				),
				columns: 
				[
				 	{ text: '그룹', datafield: 'grpName', minwidth: 140, pinned: true },
				 	{ text: '대역폭', datafield: 'lineWidth', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
				 	{ text: '사용자대역폭', datafield: 'userLineWidth', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
					{ text: 'InBps', datafield: 'avgInbps', columngroup: 'avgBps', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
					{ text: 'OutBps', datafield: 'avgOutbps', columngroup: 'avgBps', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
					{ text: 'InBps', datafield: 'maxInbps', columngroup: 'maxBps', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
					{ text: 'OutBps', datafield: 'maxOutbps', columngroup: 'maxBps', width: 80, cellsrenderer: HmGrid.unit1000renderer, filtertype: 'number' },
					{ text: 'InLoad', datafield: 'avgInload',  columngroup: 'avgLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'OutLoad', datafield: 'avgOutload', columngroup: 'avgLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'InLoad(User)', datafield: 'avgUserInload', columngroup: 'avgLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'OutLoad(User)', datafield: 'avgUserOutload', columngroup: 'avgLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'InLoad', datafield: 'maxInload',  columngroup: 'maxLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'OutLoad', datafield: 'maxOutload', columngroup: 'maxLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'InLoad(User)', datafield: 'maxUserInload', columngroup: 'maxLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' },
					{ text: 'OutLoad(User)', datafield: 'maxUserOutload', columngroup: 'maxLoad', width: 80, cellsformat: 'p', cellsalign: 'right', filtertype: 'number' }
			    ],
			    columngroups: 
		    	[
                    { text: '평균', align: 'center', name: 'avgBps' },
                    { text: '최대', align: 'center', name: 'maxBps' },
                    { text: '평균', align: 'center', name: 'avgLoad' },
                    { text: '최대', align: 'center', name: 'maxLoad' }
                ]
			});
			$rptGrid.on('rowdoubleclick', function(event) {
				Main.searchChart();
			});
			
			var chartSettings = HmChart.getDefaultOptions();
			$.extend(chartSettings.xAxis, {
				dataField: 'ymdhms',
				type: 'date',
				baseUnit: 'day'
			});
			$.extend(chartSettings.xAxis.labels, {
				formatFunction: function(value) {
					return $.format.date(value, 'MM-dd');
				}
			});
			$.extend(chartSettings.valueAxis, {
				formatFunction: function(value) {
					return HmUtil.convertUnit1000(value);
				} 
			});
			$.extend(chartSettings, {
				seriesGroups: [
		               HmChart.getSeriesGroup($rptChart, HmChart.T_AREA, HmChart.unit1000ToolTipFormatFn,
		            		   HmChart.getSeries([ 'avgInbps', 'avgOutbps', 'maxInbps', 'maxOutbps' ], [ 'INBPS', 'OUTBPS', 'MAX_INBPS', 'MAX_OUTBPS' ], false, 0.5))
                ]
			});
			HmChart.create($rptChart, chartSettings);
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
		
		/** 검색조건 > 장비그리드 조회 */
		searchDevCond: function() {
			HmGrid.updateBoundData($('#devGrid'), ctxPath + '/dev/getDevList.do');
		},

		/** 조회 */
		search : function() {
			if(!$.validateDateHours($('#date1'), $('#date2'))) return;
			HmGrid.updateBoundData($rptGrid, ctxPath + '/main/rpt/ifGrpRpt/getIfGrpRptList.do');
		},
		
		/** 차트 조회 */
		searchChart: function() {
			var rowIdx = HmGrid.getRowIdx($rptGrid, '그룹을 선택해주세요.');
			if(rowIdx === false) return;
			var rowdata = $rptGrid.jqxGrid('getrowdata', rowIdx);
			var _mngNo = -1, devRowIdx = HmGrid.getRowIdx($('#devGrid'));
			if(devRowIdx !== false) {
				_mngNo = $('#devGrid').jqxGrid('getrowdata', devRowIdx).mngNo;
			}
			var params = {
					grpType: $('#btnGrpType').jqxButtonGroup('getSelection')==0? 'DEFAULT' : 'SEARCH',
					grpNo: rowdata.grpNo,
					mngNo: _mngNo,
					date1: HmDate.getDateStr($('#date1')),
					time1: HmDate.getTimeStr($('#date1')),
					date2: HmDate.getDateStr($('#date2')),
					time2: HmDate.getTimeStr($('#date2'))
			};
			Server.get('/main/rpt/ifGrpRpt/getIfGrpRptChartList.do', {
				data: params,
				success: function(result) {
					$rptChart.jqxChart({ source: result });
					$rptChart.jqxChart({ source: result });
				}
			});
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});