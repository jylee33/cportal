var $devGrid, $oidGrid, $cfgGrid;
var addCfgIds, editCfgIds = [];
var Main = {
		/** variable */
		initVariable : function() {
			$devGrid = $('#devGrid');
			$oidGrid = $('#oidGrid');
			$cfgGrid = $('#cfgGrid');
			this.initCondition();
		},
		initCondition: function() {
			// search condition
			HmBoxCondition.createRadioInput($('#sSrchType'), HmResource.getResource('cond_dev_srch_type'));
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
			case "btnExcel": this.exportExcel(); break;
			case 'btnAdd_oid': Main.addOid(); break;
			case 'btnEdit_oid': Main.editOid(); break;
			case 'btnDel_oid': Main.delOid(); break;
			case 'btnMove_cfg': Main.moveToCfg(); break;
			case 'btnSearch_cfg': Main.searchOidConfig(); break;
			case 'btnDel_cfg': Main.delOidConfig(); break;
			case 'btnSave_cfg': Main.saveOidConfig(); break;
			}
		},

		/** init design */
		initDesign : function() {

			HmWindow.create($('#p2window'), 100, 100);

			HmJqxSplitter.create($('#hSplitter'), HmJqxSplitter.ORIENTATION_H, [{ size: '50%', collapsible: false }, { size: '50%' }], 'auto', '100%');
			HmJqxSplitter.create($('#tv1Splitter'), HmJqxSplitter.ORIENTATION_V, [{ size: 300, collapsible: false }, { size: '100%' }], '100%', '100%');
			HmJqxSplitter.create($('#bvSplitter'), HmJqxSplitter.ORIENTATION_V, [{ size: '40%', collapsible: false }, { size: '60%' }], '100%', '100%');

			Master.createGrpTab(Main.search);
			HmGrid.create($devGrid, {
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
				selectionmode : 'multiplerowsextended',
				columns:
				[
				 	{ text : '장비명', 	datafield: 'devName',			minwidth: 150 	 },
					{ text : 'IP', 	datafield: 'devIp',			width: 120 	 },
					{ text : '종류', 		datafield: 'devKind2',		width: 150, filtertype: 'checkedlist' 	 },
					{ text : '모델', 		datafield: 'model',		width: 150, filtertype: 'checkedlist'	 },
					{ text : '제조사', 			datafield: 'vendor',	minwidth: 120, filtertype: 'checkedlist'    },
					{ text : 'mngNo', 	datafield: 'mngNo',			width: 150, hidden: true }
			    ]
			});
			
			HmGrid.create($oidGrid, {
				source: new $.jqx.dataAdapter(
						{
							datatype: 'json'
						}
				),
                pagerheight: 27,
                pagerrenderer : HmGrid.pagerrenderer,
				columns: 
				[
				 	{ text : 'OID', datafield: 'oidNo', minwidth: 120, hidden: true },
					{ text : 'OID명', datafield: 'oidName', width: 120 	},
					{ text : 'OID', datafield: 'oid', minwidth: 140 },
					{ text : 'SNMP', datafield: 'snmpType', displayfield: 'disSnmpType',width: 80 	},
                    { text : 'SNMP 값', datafield: 'oidValType', displayfield: 'disOidValType', width: 80 	},
					{ text : 'OID설명', datafield: 'oidDesc', minwidth: 80 }
			    ]
			});
			$oidGrid.on('bindingcomplete', function(event) {
				$oidGrid.jqxGrid('selectrow', 0);
				HmGrid.updateBoundData($cfgGrid, ctxPath +  '/main/nms/oidPerfConf/getOidConfigList.do');
			});
			HmGrid.create($cfgGrid,
					{
						source : new $.jqx.dataAdapter(
							{ 
								datatype : 'json',
                                addrow: function(rowid, rowdata, position, commit) {
                                    addCfgIds.push(rowid);
                                    commit(true);
                                },
                                updaterow: function(rowid, rowdata, commit) {
                                    if(editCfgIds.indexOf(rowid) == -1)
                                        editCfgIds.push(rowid);
                                    commit(true);
                                }
							},
							{
								formatData : function(data) {
									var idx = HmGrid.getRowIdx($oidGrid);
									if(idx !== false) {
										if($oidGrid.jqxGrid('getrowdata', idx)){
											var _oidNo = $oidGrid.jqxGrid('getrowdata', idx).oidNo;
											$.extend(data, {
												oidNo: _oidNo
											});
										}
									}
									return data;
								},
                                loadComplete: function(records) {
                                    addCfgIds = [];
									editCfgIds = [];
                                }
							}
						),
						editable: true,
						editmode: 'selectedrow',
						selectionmode: 'multiplerowsextended',
						columns :
						[
				 			{ text : 'seqNo', datafield : 'seqNo',minwidth : 150, editable: false, hidden: true },
				 			{ text : '장비명', datafield : 'devName',minwidth : 150, editable: false },
							{ text : '장비IP', datafield : 'devIp', width : 120, editable: false },
							{ text : '장비종류', datafield : 'devKind2', width : 150, editable: false, filtertype: 'checkedlist' },
							{ text : '모델', datafield : 'model', width : 150, editable: false, filtertype: 'checkedlist' },
							{ text : '제조사', datafield : 'vendor', minwidth : 120, editable: false, filtertype: 'checkedlist' },
                            { text : '장비번호', datafield : 'mngNo', minwidth : 120, editable: false, hidden: true },
							{ text : '수집주기', datafield : 'pollInterval', displayfield: 'pollIntervalStr', width : 100, columntype: 'dropdownlist',
                                createeditor: function (row, cellvalue, editor) {
                                    // editor.jqxNumberInput({
                                    //     decimalDigits: 0,
                                    //     min: 0,
                                    //     max: 99999,
                                    //     digits: 5
                                    // });
                                    editor.jqxDropDownList({
										source: [
											{label: '30초', value: 30},
											{label: '1분', value: 60},
											{label: '2분', value: 120},
											{label: '3분', value: 180},
											{label: '4분', value: 240},
											{label: '5분', value: 300}
										], displayMember: 'label', valueMember: 'value'
									});
                                }
							},
							{ text : '수집여부', datafield : 'perfPoll', width : 100 , columntype: 'checkbox' },
						]
				});
			
			$oidGrid.on('rowdoubleclick', function(event){
				HmGrid.updateBoundData($cfgGrid, ctxPath +  '/main/nms/oidPerfConf/getOidConfigList.do');
			});

			$('#section').css('display', 'block');
		},

		/** init data */
		initData : function() {

		},
		selectTree: function() {
			Main.search();
		},
		/** 공통 파라미터 */
		getCommParams: function() {
			var params = Master.getGrpTabParams();
			$.extend(params,HmBoxCondition.getSrchParams());
			return params;
		},

		
		search : function() {
			HmGrid.updateBoundData($devGrid, ctxPath + '/main/nms/oidPerfConf/getDevList.do');
			HmGrid.updateBoundData($oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
		},
		
	    
		/** export Excel */
		exportExcel: function() {
			var params = Master.getGrpTabParams();
			$.extend(params, HmBoxCondition.getSrchParams());
			HmUtil.exportExcel(ctxPath + '/main/nms/syslog/export.do', params);
		},
		
		addOid: function() {
			var params ={};

            $.post(ctxPath + '/main/popup/nms/pOidAdd.do',
                function(result) {
                    HmWindow.openFit($('#p2window'), 'OID 등록', result, 300, 240, 'p2window_init', params);
                }
            );
		},
		
		editOid: function() {
            var rowIdx = HmGrid.getRowIdx($oidGrid, 'OID를 선택해주세요..');
            if(rowIdx === false) return;

            var oidData = $oidGrid.jqxGrid('getrowdata', rowIdx);
            var params ={
							oidNo: oidData.oidNo,
							oid: oidData.oid,
							oidName: oidData.oidName,
							snmpType: oidData.snmpType,
							oidValType: oidData.oidValType,
							oidDesc: oidData.oidDesc
            };

            $.post(ctxPath + '/main/popup/nms/pOidEdit.do',
                function(result) {
                    HmWindow.openFit($('#p2window'), 'OID 수정', result, 300, 240, 'p2window_init', params);
                }
            );

		},

		delOid: function() {
			var idx = HmGrid.getRowIdx($oidGrid);
			if(idx !== false) {
				if(!confirm('선택된 Oid를 삭제하시겠습니까?')) return;
				Server.post('/main/nms/oidPerfConf/delOid.do', {
					data: {	oidNo: $oidGrid.jqxGrid('getrowdata', idx).oidNo},
					success: function(result) {
						HmGrid.updateBoundData($oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
						alert('삭제되었습니다.');
						$('#pbtnClose').click();
					}
				});
			}else{	alert('OID 선택해주세요.');	}
		},
		moveToCfg : function() {
			var idx = HmGrid.getRowIdx($oidGrid);
			if(idx !== false) {
				var rowIdxes = HmGrid.getRowIdxes($devGrid, '장비를 선택해주세요.');
				if(rowIdxes === false) return;
				var list = [], newIds = [];
				for(var i = 0; i < rowIdxes.length; i++) {
					var tmp = $devGrid.jqxGrid('getrowdata', rowIdxes[i]);
						list.push({ devName: tmp.devName, devIp: tmp.devIp, devKind2: tmp.devKind2, model: tmp.model,
							vendor: tmp.vendor, mngNo: tmp.mngNo, oidNo: $oidGrid.jqxGrid('getrowdata', idx).oidNo });
				}
				$cfgGrid.jqxGrid('addrow', null, list);
			}else{	alert('OID를 선택해주세요.');	}
			

	
		},

		searchOidConfig: function() {
			HmGrid.updateBoundData($oidGrid, ctxPath + '/main/nms/oidPerfConf/getOidList.do');
		},

		delOidConfig: function() {
			var rowIdxes = HmGrid.getRowIdxes($cfgGrid);
			if(rowIdxes === false) {
				alert('선택된 데이터가 없습니다.');
				return;
			}
			
			if(!confirm('[' + rowIdxes.length + ']건의 데이터를 삭제하시겠습니까?')) return;
			var _seqNos = [], _uids = [];
			$.each(rowIdxes, function(idx, value) {
				var rowdata = $cfgGrid.jqxGrid('getrowdata', value);
				// 로컬메모리에서 추가된 경우 삭제하고 리턴
				console.log(rowdata.seqNo);
				if(rowdata.seqNo === undefined) {
					$cfgGrid.jqxGrid('deleterow', rowdata.uid);
				}
				else {
					_seqNos.push(rowdata.seqNo);
					_uids.push(rowdata.uid);
				}
			});
			
			if(_seqNos.length > 0) {
				Server.post('/main/nms/oidPerfConf/delOidConfig.do', {
					data : { seqNos: _seqNos },
					success : function(result) {
						alert('삭제되었습니다.');
						$cfgGrid.jqxGrid('deleterow', _uids);
					} 
				});
			}
		},
		
		saveOidConfig: function() {
			var idx = HmGrid.getRowIdx($oidGrid);
			if(idx !== false) {
				var _list = $cfgGrid.jqxGrid('getboundrows');


                // $.each(addCfgIds, function(idx, value) {
                //     _list.push($oidGrid.jqxGrid('getrowdatabyid', value));
                // });
                // $.each(editCfgIds, function(idx, value) {
                //     _list.push($oidGrid.jqxGrid('getrowdatabyid', value));
                // });
                console.log(_list);
                if(_list.length){
				Server.post('/main/nms/oidPerfConf/saveOidConfig.do', {
					data: { oidNo: $oidGrid.jqxGrid('getrowdata', idx).oidNo, list: _list },
					success: function(result) {
						HmGrid.updateBoundData($cfgGrid);
						alert('저장되었습니다.');
					}
				});
                }else{
                	alert('변경된 내용이 없습니다.')
				}
			}else{	alert('OID를 선택해주세요.');	}
		}
};

$(function() {
	Main.initVariable();
	Main.observe();
	Main.initDesign();
	Main.initData();
});