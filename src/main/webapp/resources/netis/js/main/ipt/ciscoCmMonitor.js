var $grpTree, $cmGrid, $devCntGrid, $serviceGrid;
var _curMngNo = 0;
var _templateHTML;
var timer, rowIndex;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$grpTree = $('#dGrpTreeGrid'), $cmGrid = $('#cmGrid'), $devCntGrid = $('#devCntGrid'), $serviceGrid = $('#serviceGrid');
			this.initCondition();
			},
		initCondition: function() {
			// 기간
			HmBoxCondition.createPeriod('', Main.refreshSearch, timer);
			$("input[name=sRef]").eq(2).click();
			// radio 조건
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type2'));
		},

	/** add event */
		observe: function() {
			$('button').bind('click', function(event) { Main.eventControl(event); });
			$('.searchBox').keypress(function(e) {
				if (e.keyCode == 13) Main.search(); 
			});
		},
		
		/** event handler */
		eventControl: function(event) {
			var curTarget = event.currentTarget;
			switch(curTarget.id) {
			case 'btnSearch': this.search(); break;
			case 'btnExcel': this.exportExcel(); break;
			}
		},
		refreshSearch:function(){
			Main.search();
			$cmGrid.jqxGrid('selectrow', rowIndex);
			Main.searchDetail();
			$(this).val(0);
		},
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmJqxSplitter.create($('#tSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: 100, collapsible: false }, { size: '100%' }], 'auto', '100%');
			HmJqxSplitter.create($('#bSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');

			HmTreeGrid.create($grpTree, HmTree.T_GRP_DEFAULT2, Main.selectTree, {devKind2: 'PBX'});

			
			HmGrid.create($cmGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						},
						{
							formatData: function(data) {
								$.extend(data, Main.getCommParams());
								return data;
							},
							loadComplete: function(records) {
								_curMngNo = 0;
								Main.clearDetail();
							}
						}
				),
				pageable: false,
				columns:
				[
				 	{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true }, 
				 	{ text: '그룹', datafield: 'grpName', width : 150, pinned: true }, 
				 	{ text: '교환기 이름', datafield: 'devName', minwidth : 150, pinned: true }, 
					{ text: 'IP 주소', datafield: 'devIp', width: 120 },
					{ text: '모델', datafield: 'model', width: 130 },
					{ text: '제조사', datafield: 'vendor', width: 130 },
					{ text: 'SW 버전', datafield: 'mgrVer', width: 130 },
					{ text: '교환기 상태', datafield: 'mgrStatusStr', width: 130 },
					{ text: 'H323 테이블 수', datafield: 'curH323Cnt', width: 150, cellsalign: 'right', cellsformat: 'n' },
					{ text: 'SIP 테이블 수', datafield: 'curSipCnt', width: 150, cellsalign: 'right', cellsformat: 'n' }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$cmGrid.on('rowselect', function(event) {
				if(event.args.row == undefined){
					setTimeout(function(){
						$cmGrid.jqxGrid('selectrow', rowIndex);
					}, 500);
				}else{
					_curMngNo = event.args.row.mngNo;
					rowIndex = event.args.rowindex;
					Main.searchDetail();
				}
			});

			HmGrid.create($devCntGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'type', type:'string' },
                                { name:'regCnt', type:'number' },
                                { name:'unregCnt', type:'number' },
							]
						},
						{
							formatData: function(data) {
								data.mngNo = _curMngNo;
								return data;
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, 'Device 등록/미등록 수량 현황');
			    },
				columns:
				[
					 { text: '구분', datafield: 'type', width : '33%' }, 
					 { text: '등록 수량', datafield: 'regCnt', width: '33%', cellsalign: 'right', cellsformat: 'n' }, 
					 { text: '미등록 수량', datafield: 'unregCnt', width: '34%', cellsalign: 'right', cellsformat: 'n' }
				 ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			HmGrid.create($serviceGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields:[
                                { name:'svcName', type:'string' },
                                { name:'svcStatus', type:'number' },
                                { name:'lastUpd', type:'string' },
							]
						},
						{
							formatData: function(data) {
								data.mngNo = _curMngNo;
								return data;
							}
						}
				),
				showtoolbar: true,
			    rendertoolbar: function(toolbar) {
			    	HmGrid.titlerenderer(toolbar, '교환기 서비스 상태');
			    },
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns:
				[
					 { text: '서비스 이름', datafield: 'svcName', width : '33%', cellclassname: Main.serviceCellclass }, 
					 { text: '서비스 상태', datafield: 'svcStatus', width: '33%', cellsalign: 'center', cellclassname: Main.serviceCellclass }, 
					 { text: '최종 수집 시각', datafield: 'lastUpd', width: '34%', cellsalign: 'center', cellclassname: Main.serviceCellclass }
				 ]
			}, CtxMenu.COMM, ctxmenuIdx++);
			
		},
		
		/** init data */
		initData: function() {
			// get CM Monitor template html
			$.get(ctxPath + '/main/ipt/ciscoCmMonitorTemplate.do',
					function(result) {
						_templateHTML = result;
						Main.searchCmStatus();
					}
			);
			/*Main.chgRefreshCycle();*/
		},
		
		/** 트리선택 */
		selectTree: function() {
			Main.searchCm();
		},
		
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getDefGrpParams($grpTree);
			$.extend(params, HmBoxCondition.getSrchParams());
			return params;
		},
		
		/** 교환기 서비스 상태 스타일 적용 (STOPPED일때 빨간색) */
		serviceCellclass: function(row, columnfield, value) {
			var cellval = $serviceGrid.jqxGrid('getcellvalue', row, 'svcStatus');
			var classnm = '';
			switch(cellval) {
			case 'STOPPED': classnm = 'stopStatus'; break;
			}
			return classnm;
		},
		
		search: function() {
			this.clearDetail();
			this.searchCmStatus();
			this.searchCm();
		},
		
		/** 장비 조회 */
		searchCm: function() {
			HmGrid.updateBoundData($cmGrid, ctxPath + '/main/ipt/ciscoCmMonitor/getCallMgrCiscoList.do');
		},
		
		/** 상세 하단 정보 클리어 */
		clearDetail: function() {
			$devCntGrid.jqxGrid('clear');
			$serviceGrid.jqxGrid('clear');
		},
		
		/** 상세 조회 */
		searchDetail: function() {
			HmGrid.updateBoundData($devCntGrid, ctxPath + '/main/ipt/ciscoCmMonitor/getCallMgrCiscoDevCntList.do');
			HmGrid.updateBoundData($serviceGrid, ctxPath + '/main/ipt/ciscoCmMonitor/getCallMgrCiscoSvcList.do');
		},
		/** 상단 교환기 상태 조회[권한그룹] */
		searchCmStatus: function() {
			var _cmBlock = $('#cmBlock');
			_cmBlock.empty();
			
			Server.get('/main/ipt/ciscoCmMonitor/getCallMgrCiscoStatusList.do', {
				success: function(result) {
					var cnt = 0;
					$.each(result, function(key, value) {
						cnt += value.regPhoneCnt;
						var $template = $(_templateHTML);
						
						$template.find('.cmName').text(value.devName);

						$template.find('.cmIcon>img').attr('src', ctxPath+'/img/cmIcon.png');			
						$template.find('.cmLevel').text(value.mgrStatusStr);			
						
						switch(value.mgrStatusStr.toString()) {
							case 'Up': 
											$template.find('.cmBox').addClass('cmUp');
											$template.find('.cmName').addClass('upTitle');
											$template.find('.cmLevel').addClass('upLevel');
							
							break;
							case 'Down': 
											$template.find('.cmBox').addClass('cmDown'); 
											$template.find('.cmName').addClass('downTitle'); 
											$template.find('.cmLevel').addClass('downLevel'); 
							
							break;
							case 'Unknown': 
											$template.find('.cmBox').addClass('cmUnknown'); 
											$template.find('.cmName').addClass('unknownTitle'); 
											$template.find('.cmLevel').addClass('unknownLevel'); 
							break;
							case 'Partial': 
								$template.find('.cmBox').addClass('cmPartial'); 
								$template.find('.cmName').addClass('partialTitle'); 
								$template.find('.cmLevel').addClass('partialLevel'); 
							break;
						}
						
						_cmBlock.append($template);
					});
					
					var $template = $(_templateHTML);
					
					$template.find('.cmBox').attr('class', 'totalPhone');
					$template.find('.cmName').attr('class', 'phoneTitle');
					$template.find('.cmLevel').attr('class', 'phoneCnt');
					$template.find('.phoneTitle').text('전체 전화기 등록수');			
					$template.find('.cmIcon>img').attr('src', ctxPath+'/img/telephoneIcon.png');			
					$template.find('.phoneCnt').text(HmUtil.commaNum(cnt));			
					_cmBlock.append($template);
				}
			});
		},

		/** export */
		exportExcel: function() {
			var params = Main.getCommParams();
			// HmUtil.exportExcel(ctxPath + '/main/svc/cmMonitor/ciscoExport.do', params);
		},
		
		/** 새로고침 주기 변경 */
		chgRefreshCycle : function() {
			var cycle = $('#refreshCycleCb').val();
			if (timer != null)
				clearInterval(timer);
			if (cycle > 0) {
				timer = setInterval(function() {
					var curVal = $('#prgrsBar').val();
					if (curVal < 100)
						curVal += 100 / cycle;
					$('#prgrsBar').val(curVal);
				}, 1000);
			} else {
				$('#prgrsBar').val(0);
			}
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();

});