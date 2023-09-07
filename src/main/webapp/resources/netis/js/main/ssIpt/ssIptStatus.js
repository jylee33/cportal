var TAB = {
		SCMINFO: 0,
		PROC: 1,
		PHONE: 2,
		SYSTEM: 3,
		CALLFLOW: 4,
		LICENSE: 5,
		REG: 6,
}

var $dGrpTreeGrid, $dtlTab;
var $devGrid, $infoGrid, $procGrid, $phoneGrid, $sysPhoneGrid, $sysGwGrid;
var curMngNo = 0;
var ctxmenuIdx = 1;

var Main = {
		/** variable */
		initVariable: function() {
			$dGrpTreeGrid = $('#dGrpTreeGrid'), $dtlTab = $('#dtlTab');
			$devGrid = $('#devGrid'), $infoGrid = $('#infoGrid'), $procGrid = $('#procGrid'), $phoneGrid = $('#phoneGrid');
			$sysPhoneGrid = $('#sysPhoneGrid'), $sysGwGrid = $('#sysGwGrid');
//			$licenseGrid =$('#licenseGrid'), $currGrid =$('#currGrid');
			this.initCondition();
		},
			initCondition: function() {
				HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type2'));
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
			case 'btnSearch_dtl': this.searchDtlInfo();
			}
		},
		
		/** init design */
		initDesign: function() {
			HmJqxSplitter.createTree($('#mainSplitter'));
			HmJqxSplitter.create($('#splitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmTreeGrid.create($dGrpTreeGrid, HmTree.T_GRP_DEFAULT2, Main.selectTree, { devKind2: 'IPT' });
			$dtlTab.jqxTabs({ width: '100%', height: '100%', theme: 'ui-hamon-v1-tab-top',
				initTabContent: function(tab) {
					switch(tab) {
					case TAB.SCMINFO: 
						HmGrid.create($infoGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields: [	
								             { name: 'mngNo', type: 'number' },
								             { name: 'mngIdx', type: 'number' },
								             { name: 'sysName', type: 'string' },
								             { name: 'swVer', type: 'string' },
								             { name: 'nodeType', type: 'string' },
								             { name: 'linkStat', type: 'string' },
								             { name: 'haStat', type: 'string' },
								             { name: 'compIp', type: 'string' },
								             { name: 'sysIp', type: 'string' },
								             { name: 'compSubnet', type: 'string' },
								             { name: 'sysSubnet', type: 'string' },
								             { name: 'eth0Mac', type: 'string' },
								             { name: 'eth1Mac', type: 'string' },
								             { name: 'peerIp', type: 'string' }
							            ],
							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptScmInfoList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = curMngNo;
											return data;
										}
									}
							),
							columns:
							[
							 	{ text: '호스트명', datafield: 'sysName', width: 150, pinned: true }, 
							 	{ text: 'SW버전', datafield: 'swVer', width: 100 }, 
								{ text: 'Node Type', datafield: 'nodeType', width: 80 },
								{ text: '링크상태', datafield: 'linkStat', width: 80 },
								{ text: '이중화상태', datafield: 'haStat', width: 100 },
								{ text: '컴포넌트IP', datafield: 'compIp', width: 120 },
								{ text: '서브넷마스크', datafield: 'compSubnet', width: 120 },
								{ text: '시스템IP', datafield: 'sysIp', width: 120 },
								{ text: '서브넷마스크', datafield: 'sysSubnet', width: 120 },
								{ text: 'Eth0 MAC', datafield: 'eth0Mac', width: 120 },
								{ text: 'Eth1 MAC', datafield: 'eth1Mac', width: 120 },
								{ text: 'Peer IP', datafield: 'peerIp', width: 120 }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case TAB.PROC:
						HmGrid.create($procGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields: [	
								             { name: 'mngNo', type: 'number' },
								             { name: 'mngIdx', type: 'number' },
								             { name: 'procName', type: 'string' },
								             { name: 'procMem', type: 'number' },
								             { name: 'procUsageMem', type: 'number' },
								             { name: 'procMemPer', type: 'number' },
								             { name: 'procCpu', type: 'number' },
								             { name: 'procStat', type: 'string' }
							            ],
							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptScmProcessList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = curMngNo;
											return data;
										}
									}
							),
							columns:
							[
							 	{ text: '프로세스명', datafield: 'procName', minwidth: 150 }, 
							 	{ text: '프로세스상태', datafield: 'procStat', width: 130 }, 
								{ text: 'CPU 사용률 (%)', datafield: 'procCpu', width: 130, cellsalign: 'right' },
								{ text: '메모리 사용률 (%)', datafield: 'procMemPer', width: 130, cellsalign: 'right' },
								{ text: 'Total 메모리 (KB)', datafield: 'procMem', width: 130, cellsalign: 'right' },
								{ text: '사용중 메모리 (KB)', datafield: 'procUsageMem', width: 130, cellsalign: 'right' }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case TAB.PHONE:
						HmGrid.create($phoneGrid, {
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields: [	
								             { name: 'typeNm', type: 'string' },
								             { name: 'phoneCnt', type: 'number' },
								             { name: 'mobileCnt', type: 'number' },
								             { name: 'anlogCnt', type: 'number' },
								             { name: 'sipCnt', type: 'number' },
								             { name: 'gatewayCnt', type: 'number' },
								             { name: 'trunkCnt', type: 'number' }   
							            ],
							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptScmPhoneInfoList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = curMngNo;
											return data;
										}
									}
							),
							columns:
							[
							 	{ text: '구분', datafield: 'typeNm', minwidth: 150 }, 
							 	{ text: '단말기 수', datafield: 'phoneCnt', width: 100, cellsformat: 'd', cellsalign: 'right' }, 
								{ text: 'Samsung Mobile Phone 수', datafield: 'mobileCnt', width: 170, cellsformat: 'd', cellsalign: 'right' },
								{ text: 'Gateway Analog Phone 수', datafield: 'anlogCnt', width: 170, cellsformat: 'd', cellsalign: 'right' },
								{ text: '3\'rd party SIP Phone 수', datafield: 'sipCnt', width: 170, cellsformat: 'd', cellsalign: 'right' },
								{ text: 'GW 수', datafield: 'gatewayCnt', width: 100, cellsformat: 'd', cellsalign: 'right' },
								{ text: 'Trunk 수', datafield: 'trunkCnt', width: 100, cellsformat: 'd', cellsalign: 'right' }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case TAB.SYSTEM:
						HmGrid.create($sysPhoneGrid, {
							width: '49.8%',
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields: [	
								             { name: 'mngNo', type: 'number' },
								             { name: 'mngIdx', type: 'number' },
								             { name: 'phoneName', type: 'string' },
								             { name: 'currReg', type: 'number' }
							            ],
							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptScmSystemPhoneList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = curMngNo;
											return data;
										}
									}
							),
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, 'Regi 단말기정보');
							},
                            pagerheight: 27,
                            pagerrenderer : HmGrid.pagerrenderer,
							columns: 
							[
							 	{ text: '단말기 모델명', datafield: 'phoneName', width: '70%' }, 
							 	{ text: 'Regi 단말 수', datafield: 'currReg', width: '30%', cellsformat: 'd', cellsalign: 'right' }
							]
						}, CtxMenu.COMM, ctxmenuIdx++);
						
						HmGrid.create($sysGwGrid, {
							width: '49.9%',
							source: new $.jqx.dataAdapter(
									{
										datatype: 'json',
										datafields: [	
											{ name: 'mngNo', type: 'number' },
											{ name: 'mngIdx', type: 'number' },
											{ name: 'gwName', type: 'string' },
											{ name: 'tcpCnt', type: 'number' }
							            ],
							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptScmSystemGwList.do'
									},
									{
										formatData: function(data) {
											data.mngNo = curMngNo;
											return data;
										}
									}
							),
							showtoolbar: true,
							rendertoolbar: function(toolbar) {
								HmGrid.titlerenderer(toolbar, 'Regi G/W정보');
							},
							columns:
							[
								 { text: 'G/W 모델명', datafield: 'gwName', width: '70%' },
								 { text: 'TCP 연결 G/W 수', datafield: 'tcpCnt', width: '30%', cellsformat: 'd', cellsalign: 'right' }
							 ]
						}, CtxMenu.COMM, ctxmenuIdx++);
						break;
					case TAB.CALLFLOW:
						break;
					case TAB.LICENSE:
//						HmGrid.create($licenseGrid, {
//							width: '49.5%',
//							source: new $.jqx.dataAdapter(
//									{
//										datatype: 'json',
//										datafields: [	
//								             { name: 'mngNo', type: 'number' },
//								             { name: 'mngIdx', type: 'number' },
//								             { name: 'phoneName', type: 'string' },
//								             { name: 'currReg', type: 'number' }
//							            ],
//							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptLicenseList.do'
//									},
//									{
//										formatData: function(data) {
//											data.mngNo = curMngNo;
//											return data;
//										}
//									}
//							),
//							showtoolbar: true,
//							rendertoolbar: function(toolbar) {
//								HmGrid.titlerenderer(toolbar, '라이선스');
//							},
//							columns: 
//							[
//							 	{ text: '구분', datafield: 'phoneName', width: '70%' }, 
//							 	{ text: '수', datafield: 'currReg', width: '30%', cellsformat: 'd', cellsalign: 'right' }
//							]
//						}, CtxMenu.COMM, TAB.LICENSE + '_1');
//						
//						HmGrid.create($currGrid, {
//							width: '49.5%',
//							source: new $.jqx.dataAdapter(
//									{
//										datatype: 'json',
//										datafields: [	
//											{ name: 'mngNo', type: 'number' },
//											{ name: 'mngIdx', type: 'number' },
//											{ name: 'gwName', type: 'string' },
//											{ name: 'tcpCnt', type: 'number' }
//							            ],
//							            url: ctxPath + '/main/ssIpt/ssIptStatus/getIptCurrList.do'
//									},
//									{
//										formatData: function(data) {
//											data.mngNo = curMngNo;
//											return data;
//										}
//									}
//							),
//							showtoolbar: true,
//							rendertoolbar: function(toolbar) {
//								HmGrid.titlerenderer(toolbar, '설정 대수');
//							},
//							columns: 
//							[
//								 { text: '구분', datafield: 'phoneName', width: '70%' }, 
//							 	 { text: '수', datafield: 'currReg', width: '30%', cellsformat: 'd', cellsalign: 'right' }
//							 ]
//						}, CtxMenu.COMM, TAB.LICENSE + '_2');
						break;
					case TAB.REG:
						break;
					}
				}
			})
			.on('selected', function(event) {
				Main.searchDtlInfo();
			});
			
			/** 장비 그리드 */
			HmGrid.create($devGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json',
							datafields: [	
					             { name: 'mngNo', type: 'number' },
					             { name: 'grpName', type: 'string' },
					             { name: 'devName', type: 'string' },
					             { name: 'devIp', type: 'string' },
					             { name: 'vendor', type: 'string' },
					             { name: 'model', type: 'string' },
					             { name: 'procTotalCnt', type: 'number' },
					             { name: 'procNormalCnt', type: 'number' },
					             { name: 'procAbnormalCnt', type: 'number' },
					             { name: 'currPhoneCnt', type: 'number' },
					             { name: 'regPhoneCnt', type: 'number' },
					             { name: 'unregPhoneCnt', type: 'number' }
				            ]
						},
						{
							formatData: function(data) {
								$.extend(data, Master.getDefGrpParams($dGrpTreeGrid),HmBoxCondition.getSrchParams());
								return data;
							},
							loadComplete: function(records) {
								curMngNo = 0;
							}
						}
				),
				columns:
				[
				 	{ text: '장비번호', datafield: 'mngNo', width: 80, pinned: true, hidden: true }, 
				 	{ text: '장비명', datafield: 'devName', minwidth : 150, pinned: true }, 
					{ text: '장비IP', datafield: 'devIp', width: 120 },
					{ text: '제조사', datafield: 'vendor', width: 130, filtertype: 'checkedlist' },
					{ text: '모델', datafield: 'model', width: 150, filtertype: 'checkedlist' },
					{ text: '전체', columngroup: 'proc', datafield: 'procTotalCnt', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '정상', columngroup: 'proc', datafield: 'procNormalCnt', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '비정상', columngroup: 'proc', datafield: 'procAbnormalCnt', width: 100, cellsformat: 'd', cellsalign: 'right' },
					{ text: '설정 단말기 수', columngroup: 'phone', datafield: 'currPhoneCnt', width: 120, cellsformat: 'd', cellsalign: 'right' },
					{ text: 'Regi 단말기 수', columngroup: 'phone', datafield: 'regPhoneCnt', width: 120, cellsformat: 'd', cellsalign: 'right' },
					{ text: 'UnRegi 단말기 수', columngroup: 'phone', datafield: 'unregPhoneCnt', width: 120, cellsformat: 'd', cellsalign: 'right' }
				],
				 columngroups:
				[
				 	{ text: '프로세스', align: 'center', name: 'proc' },
				 	{ text: '단말기 현황', align: 'center', name: 'phone' }
				]
			}, CtxMenu.COMM, ctxmenuIdx++);
			$devGrid.on('rowselect', function(event) {
				curMngNo = event.args.row.mngNo;
				Main.searchDtlInfo();
			});
			
		},
		
		/** init data */
		initData: function() {
			
		},
		
		selectTree: function() {
			Main.search();
		},
		
		/** IPT 장비현황 조회 */
		search: function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptDevStatusList.do');
		},
		
		/** 상세정보 */
		searchDtlInfo: function() {
			switch($dtlTab.val()) {
			case TAB.SCMINFO:
				HmGrid.updateBoundData($infoGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptScmInfoList.do');
				break;
			case TAB.PROC:
				HmGrid.updateBoundData($procGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptScmProcessList.do');
				break;
			case TAB.PHONE:
				HmGrid.updateBoundData($phoneGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptScmPhoneInfoList.do');
				break;
			case TAB.SYSTEM:
				HmGrid.updateBoundData($sysPhoneGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptScmSystemPhoneList.do');
				HmGrid.updateBoundData($sysGwGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptScmSystemGwList.do');
				break;
			case TAB.CALLFLOW:
				$('#cf_callTotal, #cf_callOut, #cf_callIn, #cf_callTndm, #cf_callInt').val(null);
				Server.get('/main/ssIpt/ssIptStatus/getIptScmCallFlow.do', {
					data: { mngNo: curMngNo },
					success: function(result) {
						if(result != null) {
							$('#cf_callTotal').val(HmUtil.commaNum(result.callTotal));
							$('#cf_callOut').val(HmUtil.commaNum(result.callOut));
							$('#cf_callIn').val(HmUtil.commaNum(result.callIn));
							$('#cf_callTndm').val(HmUtil.commaNum(result.callTndm));
							$('#cf_callInt').val(HmUtil.commaNum(result.callInt));
						}
					}
				});
				break;
			case TAB.LICENSE:
//				HmGrid.updateBoundData($licenseGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptLicenseList.do');
//				HmGrid.updateBoundData($currGrid, ctxPath + '/main/ssIpt/ssIptStatus/getIptCurrList.do');

				$('#licensePhone, #licenseSip, #licenseSoft, #licenseMobile, #licenseAtt, #licenseAnlog, #license3rdSip').empty();
				$('#currPhone, #currSip, #currSoft, #currAtt, #currAnlog, #curr3rdSip, #currGateway, #currTrunk, #currApp').empty();
				Server.get('/main/ssIpt/ssIptStatus/getIptLicenseList.do', {
					data: { mngNo: curMngNo },
					success: function(result) {
						if(result != null) {
							$('#licensePhone').text(HmUtil.commaNum(result.licensePhone));
							$('#licenseSip').text(HmUtil.commaNum(result.licenseSip));
							$('#licenseSoft').text(HmUtil.commaNum(result.licenseSoft));
							$('#licenseMobile').text(HmUtil.commaNum(result.licenseMobile));
							$('#licenseAtt').text(HmUtil.commaNum(result.licenseAtt));
							$('#licenseAnlog').text(HmUtil.commaNum(result.licenseAnlog));
							$('#license3rdSip').text(HmUtil.commaNum(result.license3rdSip));
						}else{
							
						}
					}
				});
				Server.get('/main/ssIpt/ssIptStatus/getIptCurrList.do', {
					data: { mngNo: curMngNo },
					success: function(result) {
						if(result != null) {
							$('#currPhone').text(HmUtil.commaNum(result.currPhone));
							$('#currSip').text(HmUtil.commaNum(result.currSip));
							$('#currSoft').text(HmUtil.commaNum(result.currSoft));
							$('#currMobile').text(HmUtil.commaNum(result.currMobile));
							$('#currAtt').text(HmUtil.commaNum(result.currAtt));
							$('#currAnlog').text(HmUtil.commaNum(result.currAnlog));
							$('#curr3rdSip').text(HmUtil.commaNum(result.curr3rdSip));
							$('#currGateway').text(HmUtil.commaNum(result.currGateway));
							$('#currTrunk').text(HmUtil.commaNum(result.currTrunk));
							$('#currApp').text(HmUtil.commaNum(result.currApp));
						}
					}
				});
				break;
			case TAB.REG:
				$('#regPhone', '#regMobile', '#regAnlog', '#regSip', '#regGateway', '#regTrunk', '#reg3rdSip', '#regSoft', '#regApp', '#regAtt').empty(); 
				$('#unRegPhone', '#unRegMobile', '#unRegAnlog', '#unRegSip', '#unRegGateway', '#unRegTrunk', '#unRegSoft', '#unRegAtt', '#unReg3rdSip', '#unRegApp', '#unRegPhoneSingle', '#unRegGatewaySingle', '#unRegTrunkSingle', '#unRegAppSingle').empty();
				Server.get('/main/ssIpt/ssIptStatus/getIptRegUnRegList.do', {
					data: { mngNo: curMngNo },
					success: function(result) {
						if(result != null) {
							$('#regPhone').text(HmUtil.commaNum(result.regPhone));
							$('#regMobile').text(HmUtil.commaNum(result.regMobile));
							$('#regAnlog').text(HmUtil.commaNum(result.regAnlog));
							$('#regSip').text(HmUtil.commaNum(result.regSip));
							$('#regGateway').text(HmUtil.commaNum(result.regGateway));
							$('#regTrunk').text(HmUtil.commaNum(result.regTrunk));
							$('#reg3rdSip').text(HmUtil.commaNum(result.reg3rdSip));
							$('#regSoft').text(HmUtil.commaNum(result.regSoft));
							$('#regApp').text(HmUtil.commaNum(result.regApp));
							$('#regAtt').text(HmUtil.commaNum(result.regAtt));
							
							$('#unRegPhone').text(HmUtil.commaNum(result.unRegPhone));
							$('#unRegMobile').text(HmUtil.commaNum(result.unRegMobile));
							$('#unRegAnlog').text(HmUtil.commaNum(result.unRegAnlog));
							$('#unRegSip').text(HmUtil.commaNum(result.unRegSip));
							$('#unRegGateway').text(HmUtil.commaNum(result.unRegGateway));
							$('#unRegTrunk').text(HmUtil.commaNum(result.unRegTrunk));
							$('#unRegSoft').text(HmUtil.commaNum(result.unRegSoft));
							$('#unRegAtt').text(HmUtil.commaNum(result.unRegAtt));
							$('#unReg3rdSip').text(HmUtil.commaNum(result.unReg3rdSip));
							$('#unRegApp').text(HmUtil.commaNum(result.unRegApp));
							$('#unRegPhoneSingle').text(HmUtil.commaNum(result.unRegPhoneSingle));
							$('#unRegGatewaySingle').text(HmUtil.commaNum(result.unRegGatewaySingle));
							$('#unRegTrunkSingle').text(HmUtil.commaNum(result.unRegTrunkSingle));
							$('#unRegAppSingle').text(HmUtil.commaNum(result.unRegAppSingle));
						}else{
							
						}
					}
				});
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