var TAB = {
	TOP_N: 0,
	AP: 1
};

var $cpuGrid, $memGrid, $tempGrid, $restimeGrid, $sessionGrid;
var $rxGrid, $txGrid, $clientGrid;
var timer;
var tabInit = [false, false];

var Main = {
		/** variable */
		initVariable: function() {
			$cpuGrid = $('#cpuGrid'), $memGrid = $('#memGrid'), $tempGrid = $('#tempGrid');
			$restimeGrid = $('#restimeGrid'), $sessionGrid = $('#sessionGrid');
			$rxGrid = $('#rxGrid'), $txGrid = $('#txGrid'), $clientGrid = $('#clientGrid');
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
			Master.createGrpTab(Main.selectTree, {devKind1 : 'DEV', devKind2: 'AP_CONTROLLER'});

			$('#mainTab').jqxTabs({ width: '100%', height: '100%', theme: jqxTheme,
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
						    	HmGrid.titlerenderer(toolbar, 'CPU');
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
						    	HmGrid.titlerenderer(toolbar, 'MEMORY');
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
								HmGrid.titlerenderer(toolbar, '온도');
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
								HmGrid.titlerenderer(toolbar, '응답시간');
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
								HmGrid.titlerenderer(toolbar, '세션');
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
						break;
					case TAB.AP:
						HmGrid.create($txGrid, {
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
							height: 220,
							autoheight: true,
							scrollbarsize: -1,
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '송신 Byte');
							},
							columns:
								[
									{ text : 'AP NO', datafield: 'apNo', width: 80, hidden: true },
									{ text : '컨트롤러', datafield: 'disDevName', width: 150, cellsrenderer: HmGrid.devNameRenderer },
									{ text : 'IP', datafield: 'devIp', width: 120 },
									{ text : 'AP 명', datafield: 'apName', minwidth: 130, cellsrenderer: HmGrid.apNameRenderer },
									{ text : 'AP IP', datafield: 'apIp', width: 120 },
									{ text : '송신Byte', datafield: 'txByte', width: 100, cellsrenderer: HmGrid.unit1024renderer }
								]
						}, CtxMenu.AP, 'ap_tx');
						HmGrid.create($rxGrid, {
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
							height: 220,
							autoheight: true,
							scrollbarsize: -1,
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '수신 Byte');
							},
							columns:
							[
								{ text : 'AP NO', datafield: 'apNo', width: 80, hidden: true },
								{ text : '컨트롤러', datafield: 'disDevName', width: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : 'IP', datafield: 'devIp', width: 120 },
								{ text : 'AP 명', datafield: 'apName', minwidth: 130, cellsrenderer: HmGrid.apNameRenderer },
								{ text : 'AP IP', datafield: 'apIp', width: 120 },
								{ text : '수신 Byte', datafield: 'rxByte', width: 100, cellsrenderer: HmGrid.unit1024renderer }
						    ]
						}, CtxMenu.AP, 'ap_rx');
						HmGrid.create($clientGrid, {
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
							height: 220,
							autoheight: true,
							scrollbarsize: -1,
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, '접속 Client');
							},
							columns:
							[
								{ text : 'AP NO', datafield: 'apNo', width: 80, hidden: true },
								{ text : '컨트롤러', datafield: 'disDevName', width: 150, cellsrenderer: HmGrid.devNameRenderer },
								{ text : 'IP', datafield: 'devIp', width: 120 },
								{ text : 'AP 명', datafield: 'apName', minwidth: 130, cellsrenderer: HmGrid.apNameRenderer },
								{ text : 'AP IP', datafield: 'apIp', width: 120 },
								{ text : '접속 Client', datafield: 'connCnt', width: 100, cellsalign: 'right', cellsformat: 'd' }
						    ]
						}, CtxMenu.AP, 'ap_client');
						break;
					}
				}
			});
			$('#section').css('display', 'block');
		},
		
		/** init data */
		initData: function() {
		},

		/** 공통 파라미터 */
		getCommParams: function() {
			var params = $.extend(Master.getGrpTabParams(), HmBoxCondition.getPeriodParams(), HmBoxCondition.getSrchParams('sSrchType'));
			params.topN = HmBoxCondition.val('sTopN');
			params.sortCol = HmBoxCondition.val('sSortType');
			params.sDevKind2 = 'AP_CONTROLLER';
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
				// $('#sSortType, #sTopN').parent().css('display', 'none'); // 기준,개수 hide
				$('#mainTab').find('ul').children(':gt(0)').find('.jqx-tabs-titleWrapper').css("margin-top", "0px");
				$('#mainTab').jqxTabs('select', 1);
				$('input:radio[name=sPeriod]').eq(0).next().addClass('hide');
				$('input:radio[name=sPeriod]').eq(1).click();
			}
			Main.search();
		},

		/** 장비 선택시 탭 데이터 초기화 */
		clearTabData: function() {
			$('#rxGrid').jqxGrid('clear');
			$('#txGrid').jqxGrid('clear');
			$('#clientGrid').jqxGrid('clear');
		},
		
		/** 조회 */
		search: function() {
			/*Master.refreshCbPeriod($cbPeriod);*/
			switch($('#mainTab').val()) {
			case TAB.TOP_N:
				HmGrid.updateBoundData($('#cpuGrid'), ctxPath + '/main/nms/devPerf/getCpuTopNList.do');
				HmGrid.updateBoundData($('#memGrid'), ctxPath + '/main/nms/devPerf/getMemTopNList.do');
				HmGrid.updateBoundData($('#tempGrid'), ctxPath + '/main/nms/devPerf/getTempTopNList.do');
				HmGrid.updateBoundData($('#restimeGrid'), ctxPath + '/main/nms/devPerf/getResTimeTopNList.do');
				HmGrid.updateBoundData($('#sessionGrid'), ctxPath + '/main/nms/devPerf/getSessionTopNList.do');
				break;
			case TAB.AP:
				HmGrid.updateBoundData($rxGrid, ctxPath + '/main/nms/apPerf/getRxbyteTopNList.do');
				HmGrid.updateBoundData($txGrid, ctxPath + '/main/nms/apPerf/getTxbyteTopNList.do');
				HmGrid.updateBoundData($clientGrid, ctxPath + '/main/nms/apPerf/getClientTopNList.do');
				break;
			}
		},

		/** 차트 저장 후 엑셀 출력시 사용*/
		exportExcel_after: function(params){
			HmUtil.exportExcel(ctxPath + '/main/nms/devPerf/export.do', params);
		},
		exportExcel: function() {
			switch($('#mainTab').val()) {
				case TAB.TOP_N:
					var grids = [$cpuGrid, $memGrid, $tempGrid, $restimeGrid, $sessionGrid];
					var titles = ['CPU', 'MEMORY', '온도', '응답시간', '세션'];
					HmUtil.exportGridList(grids, titles, 'AP성능 TopN');
					break;
				case TAB.AP:
					var grids = [$txGrid, $rxGrid, $clientGrid];
					var titles = ['송신 Byte', '수신 Byte', 'Client'];
					HmUtil.exportGridList(grids, titles, 'AP성능 TopN');
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