var TAB = {
		TOP_N: 0,
		DEV_CPU: 1,
		DEV_MEM: 2,
		DEV_TEMP: 3,
		RES_TIME: 4,
		DEV_SESSION: 5,
		SECT_PERF: 6
};

var $devCpuGrid, $devMemGrid, $devTempGrid, $devRestimeGrid, $devSessionGrid, $devSectionGrid;
var $cpuChart, $memChart, $tempChart, $restimeChart, $sessionChart;
var rowID=-1, timer = null;
var tabInit = [false, false, false, false, false, false, false];

var Main = {

		/** variable */
		initVariable: function() {
			$devCpuGrid = $('#devCpuGrid'), $devMemGrid = $('#devMemGrid'), $devTempGrid = $('#devTempGrid');
			$devRestimeGrid = $('#devRestimeGrid'), $devSessionGrid = $('#devSessionGrid'), $devSectionGrid = $('#devSectionGrid');
			$cpuChart = $('#cpuChart'), $memChart = $('#memChart'), $tempChart = $('#tempChart'), $restimeChart = $('#restimeChart'), $sessionChart = $('#sessionChart');
			this.initCondition();
		},

		initCondition: function() {

			// 기간
			HmBoxCondition.createPeriod('', Main.search, timer);
			// radio 조건
			HmBoxCondition.createRadio($('#sSortType'), HmResource.getResource('cond_perf_val'));
			HmBoxCondition.createRadio($('#sTopN'), HmResource.getResource('cond_topn_cnt'));
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_srch_type'));

		},
		
		/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox input:text').bind('keyup', function(event) { Main.keyupEventControl(event); });
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		
		/** keyup event handler */
		keyupEventControl: function(event) {

			if(event.keyCode == 13) {
				Main.search();
			}

		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			Master.createGrpTab(Main.selectTree, {devKind1 : 'DEV'});

			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					tabInit[tab] = true;
					switch(tab) {
					case TAB.TOP_N:
						HmGrid.create($('#cpuGrid'), {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height: 220,
							autoheight: true,
							showtoolbar: true,
							scrollbarsize: -1,
						    rendertoolbar: function(toolbar) {
						    	Main.topNToolbarRenderer(toolbar, 'CPU', 'Cpu', true);
						    },
						    pageable: false,
							columns:
							[
							 	{ text : '그룹', datafield: 'grpName', width: 140 },
								{ text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : '장비IP', datafield: 'devIp', width: 120 },
								{ text : 'CPU', datafield: 'topVal', width: 100, cellsrenderer: HmGrid.progressbarrenderer }
						    ]
						}, CtxMenu.DEV, '1');
						HmGrid.create($('#memGrid'), {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height: 220,
							autoheight: true,
							showtoolbar: true,
							scrollbarsize: -1,
						    rendertoolbar: function(toolbar) {
						    	Main.topNToolbarRenderer(toolbar, 'MEMORY', 'Mem', true);
						    },
						    pageable: false,
							columns:
							[
							 	{ text : '그룹', datafield: 'grpName', width: 140 },
								{ text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : '장비IP', datafield: 'devIp', width: 120 },
								{ text : 'MEM', datafield: 'topVal', width: 100, cellsrenderer: HmGrid.progressbarrenderer }
						    ]
						}, CtxMenu.DEV, '2');
						HmGrid.create($('#tempGrid'), {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height: 220,
							autoheight: true,
							showtoolbar: true,
							scrollbarsize: -1,
							rendertoolbar: function(toolbar) {
								Main.topNToolbarRenderer(toolbar, '온도', 'Temp', true);
							},
							pageable: false,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '온도(℃)', datafield: 'topVal', width: 100, cellsalign: 'right' }
							 ]
						}, CtxMenu.DEV, '3');
						HmGrid.create($('#restimeGrid'), {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											// 응답시간은 AVG, MAX값만 성능테이블에 존재함.
											if(data.sortCol != 'MAX' && data.sortCol != 'AVG') data.sortCol = 'MAX';
											return data;
										}
									}
							),
							height: 220,
							autoheight: true,
							showtoolbar: true,
							scrollbarsize: -1,
							rendertoolbar: function(toolbar) {
								Main.topNToolbarRenderer(toolbar, '응답시간', 'Restime', true);
							},
							pageable: false,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '응답시간(ms)', datafield: 'topVal', width: 100, cellsalign: 'right' }
							 ]
						}, CtxMenu.DEV, '4');
						HmGrid.create($('#sessionGrid'), {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							height: 220,
							autoheight: true,
							showtoolbar: true,
							scrollbarsize: -1,
							rendertoolbar: function(toolbar) {
								Main.topNToolbarRenderer(toolbar, '세션', 'Session', true);
							},
							pageable: false,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '세션', datafield: 'topVal', width: 100, cellsalign: 'right' }
							 ]
						}, CtxMenu.DEV, '5');

						$('#ckAll').jqxCheckBox({ checked: true })
							.on('change', function(event) {
								var ischecked = event.args.checked;
								$('#ckCpu, #ckMem, #ckTemp, #ckRestime, #ckSession').jqxCheckBox({ checked: ischecked });
							});
						break;
					case TAB.DEV_CPU:
						HmJqxSplitter.create($('#cpuSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], '100%', '100%',{showSplitBar: false});

						HmGrid.create($devCpuGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
							 	{ text : '그룹', datafield: 'grpName', width: 140 },
								{ text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : '장비IP', datafield: 'devIp', width: 120 },
								{ text : '종류', datafield: 'devKind2', width: 130 },
								{ text : '모델', datafield: 'model', width: 130 },
								{ text : '현재', columngroup: 'cpu', datafield: 'curVal', width: 100, cellsalign: 'right' },
								{ text : '평균', columngroup: 'cpu', datafield: 'avgVal', width: 100, cellsalign: 'right' },
								{ text : '최대', columngroup: 'cpu', datafield: 'maxVal', width: 100, cellsalign: 'right' }
								// { text : '최소', columngroup: 'cpu', datafield: 'minVal', width: 100, cellsalign: 'right' }
						    ],
						    columngroups:
					    	[
					    	 	{ text: 'CPU(%)', align: 'center', name: 'cpu' }
						    ],
				    	 	ready: function() {
								// 트리 이벤트를 받기 때문에 제외
//				    	 		HmGrid.updateBoundData($devCpuGrid, ctxPath + '/main/nms/devPerf/getCpuTopNList.do');
				    	 	}
						}, CtxMenu.DEV, '6');
						$devCpuGrid.on('rowselect', function(event) {
							var row = event.args.row;
							var rowindex = event.args.rowindex;
							rowID = $devCpuGrid.jqxGrid('getrowid', rowindex);
							Main.searchChart($cpuChart, row.mngNo, DevPerfType.CPU);
						}).on('bindingcomplete', function(event) {
							var row = $devCpuGrid.jqxGrid("getrows").length;
							if (row > 0) rowID = 0;
							if(rowID == -1) return;
							var rowindex =$devCpuGrid.jqxGrid("getrowboundindexbyid", rowID);
							$devCpuGrid.jqxGrid("selectrow",rowindex);
						});

						Main.createDefaultHighChart('cpuChart', DevPerfType.CPU);
						break;
					case TAB.DEV_MEM:
						HmJqxSplitter.create($('#memSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], '100%', '100%',{showSplitBar: false});
						HmGrid.create($devMemGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '종류', datafield: 'devKind2', width: 130 },
								 { text : '모델', datafield: 'model', width: 130 },
								 { text : '현재', columngroup: 'mem', datafield: 'curVal', width: 100, cellsalign: 'right' },
								 { text : '평균', columngroup: 'mem', datafield: 'avgVal', width: 100, cellsalign: 'right' },
								 { text : '최대', columngroup: 'mem', datafield: 'maxVal', width: 100, cellsalign: 'right' }
								 // { text : '최소', columngroup: 'mem', datafield: 'minVal', width: 100, cellsalign: 'right' }
							 ],
							 columngroups:
							 [
								 { text: 'MEMORY(%)', align: 'center', name: 'mem' }
							 ],
					    	 ready: function() {
								 //Main.search();
					    	 }
						}, CtxMenu.DEV, '7');
						$devMemGrid.on('rowselect', function(event) {
							var row = event.args.row;
							var rowindex = event.args.rowindex;
							rowID = $devMemGrid.jqxGrid('getrowid', rowindex);
							Main.searchChart($memChart, row.mngNo, DevPerfType.MEMORY);
						}).on('bindingcomplete', function(event) {
							var row = $devMemGrid.jqxGrid("getrows").length;
							if (row > 0) rowID = 0;
							if(rowID == -1) return;
							var rowindex =$devMemGrid.jqxGrid("getrowboundindexbyid", rowID);
							$devMemGrid.jqxGrid( "selectrow",rowindex);
						});

						Main.createDefaultHighChart('memChart', DevPerfType.MEMORY);
						break;
					case TAB.DEV_TEMP:
						HmJqxSplitter.create($('#tempSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], '100%', '100%',{showSplitBar: false});
						HmGrid.create($devTempGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '종류', datafield: 'devKind2', width: 130 },
								 { text : '모델', datafield: 'model', width: 130 },
								 { text : '현재', columngroup: 'temp', datafield: 'curVal', width: 100, cellsalign: 'right' },
								 { text : '평균', columngroup: 'temp', datafield: 'avgVal', width: 100, cellsalign: 'right' },
								 { text : '최대', columngroup: 'temp', datafield: 'maxVal', width: 100, cellsalign: 'right' }
								 // { text : '최소', columngroup: 'temp', datafield: 'minVal', width: 100, cellsalign: 'right' }
							 ],
							 columngroups:
							 [
							  	 { text: '온도(℃)', align: 'center', name: 'temp' }
				     	 	 ],
				    	 	 ready: function() {
								// Main.search();
				    	 	 }
						}, CtxMenu.DEV, '8');
						$devTempGrid.on('rowselect', function(event) {
							var row = event.args.row;
							var rowindex = event.args.rowindex;
							rowID = $devTempGrid.jqxGrid('getrowid', rowindex);
							Main.searchChart($tempChart, row.mngNo, DevPerfType.TEMP);
						}).on('bindingcomplete', function(event) {
							var row = $devTempGrid.jqxGrid("getrows").length;
							if (row > 0) rowID = 0;
							if(rowID == -1) return;
							var rowindex =$devTempGrid.jqxGrid("getrowboundindexbyid", rowID);
							$devTempGrid.jqxGrid( "selectrow",rowindex);
						});

						Main.createDefaultHighChart('tempChart', DevPerfType.TEMP);
						break;
					case TAB.RES_TIME:
						HmJqxSplitter.create($('#restimeSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], '100%', '100%',{showSplitBar: false});
						HmGrid.create($devRestimeGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
							 	{ text : '그룹', datafield: 'grpName', width: 140 },
							 	{ text : '종류', datafield: 'devKind2', width: 130 },
								{ text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : '장비IP', datafield: 'devIp', width: 120 },
								{ text : '현재', columngroup: 'restime', datafield: 'curVal', width: 100, cellsalign: 'right' },
								{ text : '평균', columngroup: 'restime', datafield: 'avgVal', width: 100, cellsalign: 'right' },
								{ text : '최대', columngroup: 'restime', datafield: 'maxVal', width: 100, cellsalign: 'right' },
                                // { text : '최소', columngroup: 'restime', datafield: 'minVal', width: 100, cellsalign: 'right' },
								{ text : '손실율', datafield: 'lossPer', width: 100, cellsalign: 'right' }
						    ],
						    columngroups:
							 [
							  	 { text: '응답시간(ms)', align: 'center', name: 'restime' }
				    	 	],
				    	 	ready: function() {
							//	Main.search();
				    	 	}
						}, CtxMenu.DEV, '9');
						$devRestimeGrid.on('rowselect', function(event) {
							var row = event.args.row;
							var rowindex = event.args.rowindex;
							rowID = $devRestimeGrid.jqxGrid('getrowid', rowindex);
							Main.searchChart($restimeChart, row.mngNo, DevPerfType.RESP);
						}).on('bindingcomplete', function(event) {
							var row = $devRestimeGrid.jqxGrid("getrows").length;
							if (row > 0) rowID = 0;
							if(rowID == -1) return;
							var rowindex =$devRestimeGrid.jqxGrid("getrowboundindexbyid", rowID);
							$devRestimeGrid.jqxGrid( "selectrow",rowindex);
						});

						Main.createDefaultHighChart('restimeChart', DevPerfType.RESP);
						break;
					case TAB.DEV_SESSION:
						HmJqxSplitter.create($('#sessionSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], '100%', '100%',{showSplitBar: false});
						HmGrid.create($devSessionGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
								 { text : '그룹', datafield: 'grpName', width: 140 },
								 { text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								 { text : '장비IP', datafield: 'devIp', width: 120 },
								 { text : '종류', datafield: 'devKind2', width: 130 },
								 { text : '모델', datafield: 'model', width: 130 },
								 { text : '현재', columngroup: 'session', datafield: 'curVal', width: 100, cellsalign: 'right' },
								 { text : '평균', columngroup: 'session', datafield: 'avgVal', width: 100, cellsalign: 'right' },
								 { text : '최대', columngroup: 'session', datafield: 'maxVal', width: 100, cellsalign: 'right' }
								 // { text : '최소', columngroup: 'session', datafield: 'minVal', width: 100, cellsalign: 'right' }
							 ],
							 columngroups:
							 [
							  	 { text: '세션', align: 'center', name: 'session' }
				    	 	 ],
				    	 	 ready: function() {
								// Main.search();
				    	 	 }
						}, CtxMenu.DEV, '10');
						$devSessionGrid.on('rowselect', function(event) {
							var row = event.args.row;
							var rowindex = event.args.rowindex;
							rowID = $devSessionGrid.jqxGrid('getrowid', rowindex);
							Main.searchChart($sessionChart, row.mngNo, DevPerfType.SESSION);
						}).on('bindingcomplete', function(event) {
							var row = $devSessionGrid.jqxGrid("getrows").length;
							if (row > 0) rowID = 0;
							if(rowID == -1) return;
							var rowindex =$devSessionGrid.jqxGrid("getrowboundindexbyid", rowID);
							$devSessionGrid.jqxGrid( "selectrow",rowindex);
						});

						Main.createDefaultHighChart('sessionChart', DevPerfType.SESSION);
						break;
					case TAB.SECT_PERF:
						HmGrid.create($devSectionGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json'
									},
									{
										formatData: function(data) {
											$.extend(data, Main.getCommParams());
											return data;
										}
									}
							),
							pageable: false,
							scrollbarsize: -1,
							columns:
							[
							 	{ text : '그룹', datafield: 'grpName', minwidth: 150 },
								{ text : 'Node명', datafield: 'nodeName', minwidth: 150 },
								{ text : '장비명', datafield: 'disDevName', minwidth: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : 'Source IP', datafield: 'fromIp', width: 130 },
								{ text : 'Target IP', datafield: 'toIp', width: 130 },
								{ text : '응답시간(ms)', datafield: 'respTime', width: 120, cellsalign: 'right' },
								{ text : '패킷로스율', datafield: 'pktLossRate', width: 120, cellsalign: 'right' }
						    ]
						}, CtxMenu.DEV, '11');
						break;
					}
				}
			});
			HmWindow.create($('#pwindow'));
			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
			/* 구간성능 탭 임시로 삭제 */
			setTimeout(function() {
				$('#mainTab').jqxTabs('removeLast');
			}, 1000);
		},

		createDefaultHighChart: function (chartName, itemType) {
			switch(itemType) {
				case DevPerfType.CPU:
					$cpuChart = new DevCpuChart(chartName);
                    $cpuChart.initialize();
					break;
				case DevPerfType.MEMORY:
					$memChart = new DevMemoryChart(chartName);
                    $memChart.initialize();
					break;
				case DevPerfType.TEMP:
					$tempChart = new DevTempChart(chartName);
                    $tempChart.initialize();
					break;
				case DevPerfType.RESP:
					$restimeChart = new DevResptimeChart(chartName);
                    $restimeChart.initialize();
					break;
				case DevPerfType.SESSION:
					$sessionChart = new DevSessChart(chartName);
                    $sessionChart.initialize();
					break;
			}
	     },

		/** TopN 툴바 ... 버튼추가 */
		topNToolbarRenderer: function(toolbar, title, type, isChecked) {
			if(isChecked == null) isChecked = false;
			var container = $('<div style="margin: 5px"></div>');
			var span = $('<span style="float: left; font-weight: bold; margin-top: 2px; margin-right: 4px;">' + title + '</span>');
            toolbar.css('background', '#d0d8de');
			toolbar.empty();
	    	toolbar.append(container);
	    	container.append(span);
	    	// 우측 체크박스
	    	var ckbox = $('<div id="ck' + type + '" style="float: right; margin-right: 2px"></div>');
	    	ckbox.jqxCheckBox({ checked: isChecked });
	    	container.append(ckbox);
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = $.extend(Master.getGrpTabParams(), HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams('sSrchType'));
			params.topN = HmBoxCondition.val('sTopN');
			params.sortCol = HmBoxCondition.val('sSortType');
			params.ckCpu = $('#ckCpu').val();
			params.ckMem = $('#ckMem').val();
			params.ckTemp = $('#ckTemp').val();
			params.ckRestime = $('#ckRestime').val();
			params.ckSession = $('#ckSession').val();
			return params;
		},

		/** 그룹트리 선택이벤트 */
		selectTree: function() {
			var params = Master.getGrpTabParams();
			if(params.itemKind == 'GROUP') {
				$('#mainTab').find('ul').children(':first').css('display', 'block');
				$('#mainTab').find('ul').children(':gt(0)').css('display', 'none');
				$('#sSortType, #sTopN').parent().css('display', 'block');
				$('#mainTab').jqxTabs('select', 0);
				$('input:radio[name=sPeriod]').eq(0).next().removeClass('hide');
				$('input:radio[name=sPeriod]').eq(0).click();
			}
			else {
				Main.clearTabData();
				$('#mainTab').find('ul').children(':first').css('display', 'none');
				$('#mainTab').find('ul').children(':gt(0)').css('display', 'block');
				$('#sSortType, #sTopN').parent().css('display', 'none'); // 기준,개수 hide
				$('#mainTab').find('ul').children(':gt(0)').find('.jqx-tabs-titleWrapper').css("margin-top", "0px");
				$('#mainTab').jqxTabs('select', 1);
				$('input:radio[name=sPeriod]').eq(0).next().addClass('hide');
				$('input:radio[name=sPeriod]').eq(1).click();
			}
			Main.search();
		},

		/** 장비 선택시 탭 데이터 초기화 */
		clearTabData: function() {
			rowID = -1;
			var gridArr = [null, $devCpuGrid, $devMemGrid, $devTempGrid, $devRestimeGrid, $devSessionGrid, null];
			var chartArr = [null, $cpuChart, $memChart, $tempChart, $restimeChart, $sessionChart, null];
			for(var i = 0; i < tabInit.length; i++) {
				if(tabInit[i]) {
					if(gridArr[i] != null) {
						gridArr[i].jqxGrid('clear');
					}
					if(chartArr[i] != null) {
						Main.clearChart(chartArr[i]);
					}
				}
			}
		},
		
		/** 조회 */
		search: function() {
			/*Master.refreshCbPeriod($cbPeriod);*/
			switch($('#mainTab').val()) {
			case TAB.TOP_N:
				if($('#ckCpu').val()) {
					HmGrid.updateBoundData($('#cpuGrid'), ctxPath + '/main/nms/devPerf/getCpuTopNList.do');
				}else {
					$('#cpuGrid').jqxGrid('source')._source.url = null;
					$('#cpuGrid').jqxGrid('updatebounddata');
				}

				if($('#ckMem').val()) {
					HmGrid.updateBoundData($('#memGrid'), ctxPath + '/main/nms/devPerf/getMemTopNList.do');
				} else {
					$('#memGrid').jqxGrid('source')._source.url = null;
					$('#memGrid').jqxGrid('updatebounddata');
				}
				if($('#ckTemp').val()) {
					HmGrid.updateBoundData($('#tempGrid'), ctxPath + '/main/nms/devPerf/getTempTopNList.do');
				} else {
					$('#tempGrid').jqxGrid('source')._source.url = null;
					$('#tempGrid').jqxGrid('updatebounddata');
				}
				if($('#ckRestime').val()) {
					HmGrid.updateBoundData($('#restimeGrid'), ctxPath + '/main/nms/devPerf/getResTimeTopNList.do');
				}
				else {
					$('#restimeGrid').jqxGrid('source')._source.url = null;
					$('#restimeGrid').jqxGrid('updatebounddata');
				}
				if($('#ckSession').val()) {
					HmGrid.updateBoundData($('#sessionGrid'), ctxPath + '/main/nms/devPerf/getSessionTopNList.do');
				}
				else {
					$('#sessionGrid').jqxGrid('source')._source.url = null;
					$('#sessionGrid').jqxGrid('updatebounddata');
				}
				break;
			case TAB.DEV_CPU:
				this.clearChart($cpuChart);
				HmGrid.updateBoundData($devCpuGrid, ctxPath + '/main/nms/devPerf/getCpuTopNList.do');
				break;
			case TAB.DEV_MEM:
				this.clearChart($memChart);
				HmGrid.updateBoundData($devMemGrid, ctxPath + '/main/nms/devPerf/getMemTopNList.do');
				break;
			case TAB.DEV_TEMP:
				this.clearChart($tempChart);
				HmGrid.updateBoundData($devTempGrid, ctxPath + '/main/nms/devPerf/getTempTopNList.do');
				break;
			case TAB.RES_TIME:
				this.clearChart($restimeChart);
				HmGrid.updateBoundData($devRestimeGrid, ctxPath + '/main/nms/devPerf/getResTimeTopNList.do');
				break;
			case TAB.DEV_SESSION:
				this.clearChart($sessionChart);
				HmGrid.updateBoundData($devSessionGrid, ctxPath + '/main/nms/devPerf/getSessionTopNList.do');
				break;
			case TAB.SECT_PERF:
				HmGrid.updateBoundData($devSectionGrid, ctxPath + '/main/nms/devPerf/getSectionPerfList.do');
				break;
			}
		},
		
		clearChart: function(chartObj) { // 차트 초기화
			try {
				chartObj.clearSeriesData();
			} catch(e) {}
		},

		/** 차트 조회 */
		searchChart: function(chartObj, mngNo, itemType) {
			var params = Main.getCommParams();
			if($.inArray(itemType, [DevPerfType.CPU, DevPerfType.MEMORY, DevPerfType.TEMP, DevPerfType.RESP, DevPerfType.SESSION]) === -1) return;

			params.mngNo = mngNo;
			params.itemType = itemType;
			chartObj.searchData(params);
		},
		
		/** 차트 저장 후 엑셀 출력시 사용*/
		exportExcel_after: function(params){
			HmUtil.exportExcel(ctxPath + '/main/nms/devPerf/export.do', params);
		},

		exportExcel: function() {
			var params = this.getCommParams();
			var _tabNm = '', _fname = '';
			switch($('#mainTab').val()) {
			case TAB.TOP_N:
				_tabNm = 'top';
				params.tabNm = _tabNm;
				HmUtil.exportExcel(ctxPath + '/main/nms/devPerf/export.do', params);
				break;
			case TAB.DEV_CPU:
				params.tabNm = 'cpu';
				HmUtil.saveHighchart($cpuChart.highcharts(), Main.exportExcel_after, params);
				break;
			case TAB.DEV_MEM: 
				params.tabNm = 'mem';
				HmUtil.saveHighchart($memChart.highcharts(), Main.exportExcel_after, params);
				break;
			case TAB.DEV_TEMP:
				params.tabNm = 'temp';
				HmUtil.saveHighchart($tempChart.highcharts(), Main.exportExcel_after, params);
				break;
			case TAB.RES_TIME:
				params.tabNm = 'restime';
				HmUtil.saveHighchart($restimeChart.highcharts(), Main.exportExcel_after, params);
				break;
			case TAB.DEV_SESSION:
				params.tabNm = 'session';
				HmUtil.saveHighchart($sessionChart.highcharts(), Main.exportExcel_after, params);
				break;
			}
			
		},

		customChartData: function(chartData){
			var series = chartData.series;
			var dateArr = [];
			
			for(var i=0; i<series.length; i++){
				var one_seri = series[i];
				var name = one_seri.name;
				var data = one_seri.data;
				for(var k=0; k<data.length; k++){
					var oneDt = data[k];
					var x = oneDt.x;
					var y = oneDt.y; //val
					var tmp_date = new Date(x);
					var ymdhms = HmHighchart.getConvertTime(tmp_date,"-"," ",":");
					
					dateArr.push({ymdhms: ymdhms, time: x, val: y});
				}
			}
			
			// 정렬
			function custonSort(a, b) { 
				if(a.ymdhms == b.ymdhms){ return 0} return a.ymdhms > b.ymdhms ? 1 : -1; 
			}
			dateArr.sort(custonSort);
			
			return dateArr;
		}
};


$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});